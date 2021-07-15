import { server } from "./test/server";
import { queryClient } from "./context/QueryClient";
import { logout } from "./utils/auth-provider";

beforeAll(() => server.listen());
afterAll(() => server.close());
afterEach(() => server.resetHandlers());

afterEach(async () => {
  queryClient.clear();
  await logout();
});
