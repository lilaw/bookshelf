import router from "../router";
import store from "../store/index";
import ElementPlus from "element-plus";
import * as usersDB from "../test/data/users";
import { buildUser } from "../test/generate";
import {
  render as tlrender,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/vue";
import type { RouteLocationRaw } from "vue-router";
import type { RenderResult } from "@testing-library/vue/types";
import { authMachine } from "../machines/authMachine";

export async function loginAsUser() {
  const user = buildUser();
  await usersDB.create(user);
  const authUser = await usersDB.authenticate(user);
  const authSate = {
    value: "authorized",
    context: {
      message: undefined,
      user: { id: user.id, username: user.username, token: authUser.token },
    },
  };
  const stateDefinition = { ...authMachine.initialState, ...authSate };
  window.localStorage.setItem("authState", JSON.stringify(stateDefinition));
  return { ...user, ...authUser };
}

export async function waitForLoadingToFinish(): Promise<void> {
  return waitForElementToBeRemoved(() => [
    ...screen.queryAllByLabelText(/loading/i),
    ...screen.queryAllByText(/loading/i),
  ]);
}

export async function render(
  // eslint-disable-next-line
  component: any,
  { path }: { path: RouteLocationRaw }
): Promise<RenderResult> {
  router.push(path);
  await router.isReady();
  const result = tlrender(component, {
    global: {
      plugins: [router, store, ElementPlus],
    },
  });
  return result;
}
