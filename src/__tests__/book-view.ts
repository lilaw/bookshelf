import App from "../App.vue";
import { buildListItem, buildBook } from "../test/generate";
import { waitFor, screen } from "@testing-library/vue";
import userEvent from "@testing-library/user-event";
import * as booksDB from "../test/data/books";
import * as listItemsDB from "../test/data/list-items";
import {
  waitForLoadingToFinish,
  loginAsUser,
  render,
} from "../test/app-test-utils";
import type { book as Book, user } from "@/types";
import faker from "faker";
import { server, rest } from "../test/server";
import { createModel } from "@xstate/test";
import { actions, createMachine } from "xstate";
const { raise } = actions;
const apiURL = process.env.VUE_APP_BOOK_APP_API_URL;
const fakeErrorMessage =
  "something is wrong, our engineers are working quickly to resolve the issue.";

const bookTestMachine = createMachine({
  id: "bookTestMachine",
  initial: "unread",
  states: {
    unread: {
      initial: "normal",
      states: {
        normal: {
          on: {
            "ADD.error": "error",
            "ADD.success": "send",
          },
          meta: {
            test: async () => {
              expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
            },
          },
        },
        error: {
          on: {
            "ADD.success": "send",
          },
          meta: {
            test: async () => {
              expect(
                screen.getByRole("tooltip", { name: fakeErrorMessage })
              ).toBeInTheDocument();
            },
          },
        },
        send: { type: "final" },
      },
      onDone: "read",
      meta: {
        test: async ({ book }) => {
          expect(
            screen.queryByRole("heading", { name: book.title })
          ).toBeInTheDocument();
        },
      },
    },
    read: {
      id: "read",
      type: "parallel",
      states: {
        remove: {
          initial: "normal",
          states: {
            normal: {
              on: {
                "REMOVE.success": "send",
                "REMOVE.error": "error",
              },
              meta: {
                test: () => {
                  expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
                },
              },
            },

            error: {
              on: {
                "REMOVE.success": "send",
              },
              meta: {
                test: () => {
                  expect(
                    screen.getByRole("tooltip", { name: fakeErrorMessage })
                  ).toBeInTheDocument();
                },
              },
            },
            send: { entry: raise("REMOVE") },
          },
        },
        duration: {
          id: "duration",
          initial: "unfinish",
          states: {
            finish: {
              on: {
                // UNFINISH: "unfinish",
              },
              meta: {
                test: () => {
                  expect(
                    screen.getByRole("button", {
                      name: /mark as unfinish/i,
                    })
                  ).toBeInTheDocument();
                },
              },
            },
            unfinish: {
              on: {
                FINISH: "finish",
              },
              meta: {
                test: () => {
                  expect(
                    screen.getByRole("button", {
                      name: /mark as finish/i,
                    })
                  ).toBeInTheDocument();
                },
              },
            },
          },
        },
      },
      on: {
        REMOVE: "unread",
      },
      meta: {
        test: async () => {
          expect(
            screen.getByRole("button", { name: /remove from list/i })
          ).toBeInTheDocument();

          expect(screen.getAllByRole("radio", { name: /star/i }).length).toBe(
            5
          );

          expect(screen.getByText(formatDate(Date.now()))).toBeInTheDocument();
          expect(
            screen.getByRole("textbox", { name: /note/i })
          ).toBeInTheDocument();
        },
      },
    },
  },
});

const bookTestModel = createModel(bookTestMachine).withEvents({
  "ADD.error": {
    exec: async () => {
      const fakeErrorMessage =
        "something is wrong, our engineers are working quickly to resolve the issue.";
      server.use(
        rest.post(`${apiURL}/list-items`, async (req, res, ctx) => {
          return res.once(
            ctx.status(500),
            ctx.json({ status: 500, message: fakeErrorMessage })
          );
        })
      );

      const addToListButton = screen.getByRole("button", {
        name: /add to list/i,
      });
      await userEvent.click(addToListButton);
      expect(addToListButton).toBeDisabled();
      await waitForLoadingToFinish();
    },
  },
  "ADD.success": {
    exec: async () => {
      const addToListButton = screen.getByRole("button", {
        name: /add to list/i,
      });
      await userEvent.click(addToListButton);
      expect(addToListButton).toBeDisabled();
      await waitForLoadingToFinish();
    },
  },
  "REMOVE.error": {
    exec: async () => {
      const fakeErrorMessage =
        "something is wrong, our engineers are working quickly to resolve the issue.";
      server.use(
        rest.delete(
          `${apiURL}/list-items/:listItemId`,
          async (req, res, ctx) => {
            return res.once(
              ctx.status(500),
              ctx.json({ status: 500, message: fakeErrorMessage })
            );
          }
        )
      );
      const removeFromListButton = screen.getByRole("button", {
        name: /remove from list/i,
      });
      await userEvent.click(removeFromListButton);
      expect(removeFromListButton).toBeDisabled();
      await waitForLoadingToFinish();
    },
  },
  "REMOVE.success": {
    exec: async () => {},
  },
  REMOVE: {
    exec: async () => {
      await waitForLoadingToFinish();
    },
  },
  FINISH: {
    exec: async () => {
      const finishButton = screen.getByRole("button", {
        name: /mark as finish/i,
      });
      await userEvent.click(finishButton);
      expect(finishButton).toBeDisabled();
      await waitForLoadingToFinish();
    },
  },
  UNFINISH: {
    exec: async () => {
      const unfinishButton = screen.getByRole("button", {
        name: /mark as unfinish/i,
      });
      await userEvent.click(unfinishButton);
      expect(unfinishButton).toBeDisabled();
      await waitForLoadingToFinish();
    },
  },
});

describe("book can add, remove, finish, unfinish", () => {
  function filter(state) {
    return state.event.type !== "done.state.bookTestMachine.unread";
  }
  const testPlans = bookTestModel.getSimplePathPlans({ filter });

  testPlans.forEach((plan) => {
    describe(plan.description, () => {
      plan.paths.forEach((path) => {
        it(path.description, async () => {
          const page = await renderBookView();

          return path.test(page);
        });
      });
    });
  });
});

////////////////////
async function buildReadingBook() {
  const user = await loginAsUser();
  const book = await booksDB.create(buildBook());
  const listItem = await listItemsDB.create(buildListItem({ book }, user));
  return { user, book, listItem };
}

async function renderBookView(book?: Book, user?: user) {
  if (typeof book === "undefined") {
    book = await booksDB.create(buildBook());
  }

  if (typeof user === "undefined") {
    user = await loginAsUser();
  }
  const result = await render(App, {
    path: `/books/${(book as Book).id}`,
  });
  await waitForLoadingToFinish();
  return {
    ...result,
    user,
    book: book as Book,
  };
}

xtest("can edit note", async () => {
  jest.useFakeTimers();
  const fakeNote = faker.lorem.sentence();
  const { user, book, listItem } = await buildReadingBook();
  await renderBookView(book, user);

  const note = screen.getByRole("textbox");
  await userEvent.clear(note);
  await userEvent.type(note, fakeNote);
  await waitFor(() => expect(screen.queryByLabelText("loading")).toBeTruthy());
  await waitForLoadingToFinish();

  expect((note as HTMLTextAreaElement).value).toBe(fakeNote);
  expect(await listItemsDB.read(listItem.id)).toMatchObject({
    notes: fakeNote,
  });
});

xtest("show an error if book fails to load", async () => {
  // do not add book book database
  const book = buildBook({ id: 999 });

  await renderBookView(book);
  await waitFor(() => expect(screen.queryByRole("alert")).toBeTruthy());

  expect(screen.queryByText(/book not found/i)).toBeTruthy();
});

xtest("note update failures are displaye", async () => {
  jest.useFakeTimers();
  const fakeNote = "yahoo";
  const fakeErrorMessage =
    "something is wrong, our engineers are working quickly to resolve the issue.";
  server.use(
    rest.put(`${apiURL}/list-items/:listItemId`, async (req, res, ctx) => {
      return res(
        ctx.status(400),
        ctx.json({ status: 400, message: fakeErrorMessage })
      );
    })
  );

  const { user, book } = await buildReadingBook();
  await renderBookView(book, user);

  const note = screen.getByRole("textbox");
  await userEvent.clear(note);
  await userEvent.type(note, fakeNote);
  await waitFor(() =>
    expect(screen.getByLabelText("loading")).toBeInTheDocument()
  );
  await waitForLoadingToFinish();

  expect(screen.getByRole("alert").textContent).toMatchInlineSnapshot(
    `"There was an error:   something is wrong, our engineers are working quickly to resolve the issue."`
  );
});

function formatDate(isostring: number): string {
  return Intl.DateTimeFormat(undefined, {
    month: "short",
    year: "2-digit",
  }).format(new Date(isostring));
}
