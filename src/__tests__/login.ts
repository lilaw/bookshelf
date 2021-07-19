import AppIndex from "../Index.vue";
import { buildUser } from "../test/generate";
import { server } from "../test/server";
import {
  render,
  screen,
  waitFor,
  within,
  waitForElementToBeRemoved,
} from "@testing-library/vue";
import router from "../router";
import store from "../store/index";
import ElementPlus from "element-plus";
import userEvent from "@testing-library/user-event";
import { ErrorMessage } from "../components/lib";
import { flushPromises } from "@vue/test-utils";
import * as authProvider from "../utils/auth-provider";

beforeEach(async () => {
  router.push("/list");
  await router.isReady();

  render(AppIndex, {
    global: {
      plugins: [router, store, ElementPlus],
    },
  });
  await waitForElementToBeRemoved(() => [
    ...screen.queryAllByLabelText(/loading/i),
    ...screen.queryAllByText(/loading/i),
  ]);
});

test("user can login, logout, register", async () => {
  jest.spyOn(authProvider, "logout");
  const user = buildUser();

  expect(screen.queryByRole("heading", { name: "Bookshelf" })).toBeTruthy();

  // register
  await userEvent.click(screen.getByRole("button", { name: "register" }));
  const inModal = within(screen.getByRole("dialog"));
  await userEvent.type(inModal.getByTestId("username"), user.username);
  await userEvent.type(inModal.getByTestId("password"), user.password);
  await userEvent.click(inModal.getByTestId("submitForm"));

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
  await userEvent.click(loginModal.getByTestId("submitForm"));

  await waitForElementToBeRemoved(() => [
    ...screen.queryAllByLabelText(/loading/i),
    ...screen.queryAllByText(/loading/i),
  ]);
  expect(screen.queryByText(user.username)).toBeTruthy();
  expect(screen.queryByRole("button", { name: /logout/i })).toBeTruthy();
});

test("show error message if something go wrong", async () => {
  const user = buildUser();
  await userEvent.click(screen.getByRole("button", { name: "login" }));
  const loginModal = within(screen.getByRole("dialog"));
  await userEvent.type(loginModal.getByTestId("username"), user.username);
  await userEvent.type(loginModal.getByTestId("password"), user.password);
  await userEvent.click(loginModal.getByTestId("submitForm"));

  await waitForElementToBeRemoved(
    () => [
      ...screen.queryAllByLabelText(/loading/i),
      ...screen.queryAllByText(/loading/i),
    ],
  );

  expect(screen.queryByRole("alert")).toBeTruthy();
});
