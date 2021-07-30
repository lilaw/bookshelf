import { server } from "./test/server";
import { queryClient } from "./context/QueryClient";
import * as usersDB from "./test/data/users";
import * as booksDB from "./test/data/books";
import * as listItemsDB from "./test/data/list-items";
import { waitFor } from "@testing-library/vue";
import { resetAuth } from "./machines/authMachine";

beforeAll(() => server.listen());
afterAll(() => server.close());
afterEach(() => server.resetHandlers());

afterEach(async () => {
  queryClient.clear();

  await Promise.all([
    resetAuth(),
    usersDB.reset(),
    booksDB.reset(),
    listItemsDB.reset(),
  ]);
});

afterEach(async () => {
  await waitFor(() => expect(queryClient.isFetching()).toBe(0));
  if (jest.isMockFunction(setTimeout)) {
    () => jest.runOnlyPendingTimers();
    jest.useRealTimers();
  }
});
