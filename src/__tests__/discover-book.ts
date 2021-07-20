import {
  waitForLoadingToFinish,
  loginAsUser,
  render,
} from "../test/app-test-utils";
import AppIndex from "../Index.vue";
import { server, rest } from "../test/server";
import { buildListItem, buildBook } from "../test/generate";
import { waitFor, screen } from "@testing-library/vue";
import * as booksDB from "../test/data/books";
import userEvent from "@testing-library/user-event";

const apiURL = process.env.VUE_APP_BOOK_APP_API_URL;

async function renderDiscover() {
  const user = await loginAsUser();
  const result = await render(AppIndex, { path: `/discover` });
  await waitForLoadingToFinish();

  return { user, ...result };
}

test("display some recommended books and search book", async () => {
  const mahoo = await booksDB.create(buildBook({ title: "Magic High School" }));
  const isegai = await booksDB.create(
    buildBook({ title: "Alice's Adventures in Wonderland" })
  );

  server.use(
    rest.get(`${apiURL}/books`, async (req, res, ctx) => {
      if (!req.url.searchParams.has("query")) {
        return ctx.fetch(req);
      }
      const query = req.url.searchParams.get("query");

      let matchingBooks = [];
      if (query) {
        matchingBooks = await booksDB.query(query);
      } else {
        matchingBooks = [mahoo, isegai];
      }
      return res(ctx.json({ books: matchingBooks }));
    })
  );

  await renderDiscover();

  expect(screen.getByRole("heading", { name: mahoo.title })).toBeTruthy();
  expect(screen.getByRole("heading", { name: isegai.title })).toBeTruthy();
  expect(screen.getAllByTestId("book-row").length).toBe(2);

  const searchBox = screen.getByPlaceholderText("search books");
  const searchButton = screen.getByRole("button", { name: /search/i });
  await userEvent.type(searchBox, mahoo.title);
  await userEvent.click(searchButton);

  await waitForLoadingToFinish();

  expect(screen.getAllByTestId("book-row").length).toBe(1);
  expect(screen.getByRole("heading", { name: mahoo.title })).toBeTruthy();
});
