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
import * as auth from "../utils/auth-provider";
type component = typeof AppIndex;

export async function loginAsUser() {
  const user = buildUser();
  await usersDB.create(user);
  const authUser = await usersDB.authenticate(user);
  window.localStorage.setItem(auth.localStorageKey, authUser.token);
  return { ...user, ...authUser };
}

export async function waitForLoadingToFinish(): Promise<void> {
  return waitForElementToBeRemoved(() => [
    ...screen.queryAllByLabelText(/loading/i),
    ...screen.queryAllByText(/loading/i),
  ]);
}

export async function render(
  component: component,
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
