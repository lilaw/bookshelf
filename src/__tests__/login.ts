import AppIndex from "../Index.vue";
import { buildUser } from "../test/generate";
import {
  render,
  screen,
  within,
  waitForElementToBeRemoved,
} from "@testing-library/vue";
import router from "../router";
import store from "../store/index";
import ElementPlus from "element-plus";
import userEvent from "@testing-library/user-event";
import * as authProvider from "../utils/auth-provider";

async function renderLoginScreen() {
  router.push("/list");
  await router.isReady();

  render(AppIndex, {
    global: {
      plugins: [router, store, ElementPlus],
    },
  });
}

afterEach(() => {
  localStorage.removeItem("authState");
});

test("user can login, logout, register", async () => {
  jest.spyOn(authProvider, "logout");
  const user = buildUser();
  await renderLoginScreen()

  expect(screen.queryByRole("heading", { name: "Bookshelf" })).toBeTruthy();

  // register
  await userEvent.click(screen.getByRole("button", { name: "register" }));
  const inModal = within(screen.getByRole("dialog"));
  await userEvent.type(inModal.getByTestId("username"), user.username);
  await userEvent.type(inModal.getByTestId("password"), user.password);
  await userEvent.click(inModal.getByTestId("submitButton"));

  await waitForElementToBeRemoved(() => [
    ...screen.queryAllByLabelText(/loading/i),
    ...screen.queryAllByText(/loading/i),
  ]);
  expect(screen.queryByText(user.username)).toBeTruthy();
  expect(screen.queryByRole("button", { name: /logout/i })).toBeTruthy();

  // logout
  await userEvent.click(screen.getByRole("button", { name: "logout" }));
  expect(authProvider.logout).toHaveBeenCalledTimes(1);
  expect(screen.queryByRole("heading", { name: "Bookshelf" })).toBeTruthy();

  // login
  await userEvent.click(screen.getByRole("button", { name: "login" }));
  const loginModal = within(screen.getByRole("dialog"));
  await userEvent.type(loginModal.getByTestId("username"), user.username);
  await userEvent.type(loginModal.getByTestId("password"), user.password);
  await userEvent.click(loginModal.getByTestId("submitButton"));

  await waitForElementToBeRemoved(() => [
    ...screen.queryAllByLabelText(/loading/i),
    ...screen.queryAllByText(/loading/i),
  ]);
  expect(screen.queryByText(user.username)).toBeTruthy();
  expect(screen.queryByRole("button", { name: /logout/i })).toBeTruthy();
  localStorage.removeItem("authState");
});

test("show error message if something go wrong", async () => {
  const user = buildUser();
  console.log(localStorage)
  await renderLoginScreen()

  await userEvent.click(screen.getByRole("button", { name: "login" }));
  const loginModal = within(screen.getByRole("dialog"));
  await userEvent.type(loginModal.getByTestId("username"), user.username);
  await userEvent.type(loginModal.getByTestId("password"), user.password);
  await userEvent.click(loginModal.getByTestId("submitButton"));

  await waitForElementToBeRemoved(() => [
    ...screen.queryAllByLabelText(/loading/i),
    ...screen.queryAllByText(/loading/i),
  ]);

  expect(screen.getByRole("alert").textContent).toMatchInlineSnapshot(
    `"There was an error:   Invalid username or password"`
  );
});
