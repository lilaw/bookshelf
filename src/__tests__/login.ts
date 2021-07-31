import AppIndex from "../Index.vue";
import { buildUser } from "../test/generate";
import { loginAsUser } from "../test/app-test-utils";
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
import { createModel } from "@xstate/test";
import { createMachine } from "xstate";

const authTestMachine = createMachine({
  id: "authTestMachine ",
  initial: "unauthorized",
  states: {
    unauthorized: {
      initial: "noError",
      states: {
        noError: {
          meta: {
            test: async () => {
              expect(screen.queryByRole("alert")).toBeFalsy();
            },
          },
        },
        hasError: {
          meta: {
            test: async () => {
              expect(screen.getByRole("alert")).toBeTruthy();
              await Promise.all(
                screen
                  .queryAllByLabelText(/close/i)
                  .map((el) => userEvent.click(el))
              );
            },
          },
        },
      },
      on: {
        LOGIN: "authorized",
        "LOGIN-ERROR": "unauthorized.hasError",
        SIGNUP: "authorized",
        "SIGNUP-ERROR": "unauthorized.hasError",
      },
      meta: {
        test: async (query, state) => {
          expect(
            screen.queryByRole("heading", { name: "Bookshelf" })
          ).toBeTruthy();
        },
      },
    },
    authorized: {
      on: {
        LOGOUT: "unauthorized",
      },
      meta: {
        test: () => {
          expect(screen.getByRole("button", { name: /logout/i })).toBeTruthy();
        },
      },
    },
  },
});

const authTestModel = createModel(authTestMachine).withEvents({
  LOGIN: {
    exec: async () => {
      await Promise.all(
        screen.queryAllByLabelText(/close/i).map((el) => userEvent.click(el))
      );

      const authUser = await loginAsUser();
      await userEvent.click(screen.getByRole("button", { name: "login" }));
      const loginModal = within(
        screen.getByTestId("loginHeading").closest(".el-dialog")
      );
      await userEvent.clear(loginModal.getByTestId("username"));
      await userEvent.clear(loginModal.getByTestId("password"));
      await userEvent.type(
        loginModal.getByTestId("username"),
        authUser.username
      );
      await userEvent.type(
        loginModal.getByTestId("password"),
        authUser.password
      );
      await userEvent.click(loginModal.getByTestId("submitButton"));

      await waitForElementToBeRemoved(() => [
        ...screen.queryAllByLabelText(/loading/i),
        ...screen.queryAllByText(/loading/i),
      ]);
    },
  },
  "LOGIN-ERROR": {
    exec: async (query, event) => {
      await Promise.all(
        screen.queryAllByLabelText(/close/i).map((el) => userEvent.click(el))
      );
      // unregister user
      const user = buildUser();
      await userEvent.click(screen.getByRole("button", { name: "login" }));
      const loginModal = within(screen.getByRole("dialog"));
      await userEvent.type(loginModal.getByTestId("username"), user.username);
      await userEvent.type(loginModal.getByTestId("password"), user.password);
      await userEvent.click(loginModal.getByTestId("submitButton"));

      await waitForElementToBeRemoved(() => [
        ...screen.queryAllByLabelText(/loading/i),
        ...screen.queryAllByText(/loading/i),
      ]);
    },
  },
  SIGNUP: {
    exec: async () => {
      await Promise.all(
        screen.queryAllByLabelText(/close/i).map((el) => userEvent.click(el))
      );

      const user = buildUser();
      await userEvent.click(screen.getByRole("button", { name: "register" }));
      const inModal = within(
        screen.getByTestId("registerHeading").closest(".el-dialog")
      );
      // const inModal = within(screen.getByRole("dialog"));
      await userEvent.clear(inModal.getByTestId("username"));
      await userEvent.clear(inModal.getByTestId("password"));
      await userEvent.type(inModal.getByTestId("username"), user.username);
      await userEvent.type(inModal.getByTestId("password"), user.password);
      await userEvent.click(inModal.getByTestId("submitButton"));

      await waitForElementToBeRemoved(() => [
        ...screen.queryAllByLabelText(/loading/i),
        ...screen.queryAllByText(/loading/i),
      ]);
    },
  },
  "SIGNUP-ERROR": {
    exec: async (query, event) => {
      await Promise.all(
        screen.queryAllByLabelText(/close/i).map((el) => userEvent.click(el))
      );
      await userEvent.click(screen.getByRole("button", { name: "register" }));
      const inModal = within(screen.getByRole("dialog"));
      await userEvent.click(inModal.getByTestId("submitButton"));

      await waitForElementToBeRemoved(() => [
        ...screen.queryAllByLabelText(/loading/i),
        ...screen.queryAllByText(/loading/i),
      ]);
    },
  },
  LOGOUT: {
    exec: async () => {
      jest.spyOn(authProvider, "logout");
      await userEvent.click(screen.getByRole("button", { name: "logout" }));
      expect(authProvider.logout).toHaveBeenCalledTimes(1);
    },
  },
});

describe("test user authorization", () => {
  const testPlans = authTestModel.getSimplePathPlans();

  testPlans.forEach((plan) => {
    describe(plan.description, () => {
      plan.paths.forEach((path) => {
        it(path.description, async () => {
          const rendered = await renderLoginScreen();

          return path.test(rendered);
        });
      });
    });
  });
});

async function renderLoginScreen() {
  router.push("/list");
  await router.isReady();

  return render(AppIndex, {
    global: {
      plugins: [router, store, ElementPlus],
    },
  });
}

