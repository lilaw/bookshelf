import AppIndex from "../Index.vue";
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
const apiURL = process.env.VUE_APP_BOOK_APP_API_URL;

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
  const result = await render(AppIndex, {
    path: `/books/${(book as Book).id}`,
  });
  await waitForLoadingToFinish();
  return {
    ...result,
    user,
    book: book as Book,
  };
}

test("can render book information", async () => {
  const { book } = await renderBookView();

  expect(screen.queryByRole("heading", { name: book.title })).toBeTruthy();
  expect(screen.queryByText(book.author)).toBeTruthy();
  expect(screen.queryByText(book.publisher)).toBeTruthy();
  expect(screen.queryByTestId("book-synopsis")).toBeTruthy();
  expect(screen.queryByRole("button", { name: /add to list/i })).toBeTruthy();
  expect(
    screen.queryByRole("button", { name: /remove from list/i })
  ).toBeFalsy();
  expect(screen.queryByRole("radio", { name: /star/i })).toBeFalsy();
});

test("can add book to  reading list", async () => {
  await renderBookView();

  const addToListButton = screen.getByRole("button", { name: /add to list/i });
  await userEvent.click(addToListButton);
  expect(addToListButton.getAttribute("disabled")).toEqual("");
  await waitForLoadingToFinish();

  expect(
    screen.queryByRole("button", { name: /remove from list/i })
  ).toBeTruthy();

  expect(screen.queryAllByRole("radio", { name: /star/i })).toBeTruthy();

  expect(screen.queryByRole("button", { name: /mark as read/i })).toBeTruthy();
  expect(screen.queryByRole("button", { name: /mark as unread/i })).toBeFalsy();

  expect(screen.getByText(formatDate(Date.now()))).toBeTruthy();
  expect(screen.getByRole("textbox", { name: /note/i })).toBeTruthy();
});

test("can remove book form reading list", async () => {
  // add book to reading list
  const { user, book } = await buildReadingBook();

  await renderBookView(book, user);

  const removeFromListButton = screen.getByRole("button", {
    name: /remove from list/i,
  });
  await userEvent.click(removeFromListButton);
  expect(removeFromListButton.getAttribute("disabled")).toEqual("");
  await waitForLoadingToFinish();

  expect(screen.getByRole("button", { name: /add to list/i })).toBeTruthy();
});

test("can mark list as read", async () => {
  // add book to reading list
  const { user, book } = await buildReadingBook();
  await renderBookView(book, user);

  const removeFromListButton = screen.getByRole("button", {
    name: /mark as read/i,
  });
  await userEvent.click(removeFromListButton);
  expect(removeFromListButton.getAttribute("disabled")).toEqual("");
  await waitForLoadingToFinish();

  expect(screen.getByRole("button", { name: /mark as unread/i })).toBeTruthy();
});

test("can edit note", async () => {
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

test("show an error if book fails to load", async () => {
  // do not add book book database
  const book = buildBook({ id: 999 });

  await renderBookView(book);
  await waitFor(() => expect(screen.queryByRole("alert")).toBeTruthy());

  expect(screen.queryByText(/book not found/i)).toBeTruthy();
});

test("note update failures are displaye", async () => {
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
  await waitFor(() => expect(screen.getByLabelText("loading")).toBeTruthy());
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
