import { useQuery } from "vue-query";
import {
  getToken,
  login as authLogin,
  logout as authLogout,
  register as authRegister,
} from "@/utils/auth-provider";
import { provide, Ref, ref, InjectionKey, inject } from "vue";
import { client } from "@/utils/client";

/**
 * type for provider ********************************************
 */
type form = {
  [K in "username" | "password"]: string;
};
type user = {
  [k in "id" | "token" | "username"]: string;
};

type responseError = { message: string; code: number };
type value = {
  user: Ref<user>;
  login: (form: form) => Promise<user>;
  register: (form: form) => Promise<user>;
  logout: () => void;
};
export { form, user, responseError, value };
/**
 * end of type define *****************************************
 */

const valueKey: InjectionKey<value> = Symbol();

export function authProvider() {
  function getUser(): Promise<undefined | user> {
    return getToken().then((token) => {
      console.log("gettoken");
      if (token) {
        return client("bootstrap", { token }).then((data) => data.user);
      } else {
        return Promise.resolve(undefined);
      }
    });
  }
  const user: Ref<user | undefined> = ref(undefined);
  const result = useQuery("user", getUser);
  const { status, isLoading, isError, isSuccess, error } = result;
  user.value = result.data.value;

  function login(form: form) {
    return authLogin(form).then((newUser) => (user.value = newUser));
  }
  function register(form: form) {
    return authRegister(form).then((newUser) => (user.value = newUser));
  }
  function logout() {
    debugger;
    authLogout();
    user.value = undefined;
  }
  const value = {
    user: user as Ref<user | undefined>,
    login,
    register,
    logout,
  };
  provide(valueKey, value);

  return { status, isLoading, isError, isSuccess, error };
}

export function useAuth(): value {
  const value = inject(valueKey);
  if (value) {
    return value;
  } else {
    throw new Error("use Auth value is undefined. ");
  }
}
