import { useQuery } from "vue-query";
import {
  getToken,
  login as authLogin,
  logout as authLogout,
  register as authRegister,
} from "@/utils/auth-provider";
import { provide, Ref, ref, InjectionKey, inject, watch } from "vue";
import { client, config } from "@/utils/client";

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
  const result = useQuery<user | undefined, responseError>("user", getUser, {staleTime: Infinity});
  const {
    status,
    isLoading,
    isError,
    isSuccess,
    error,
    data: userFromServer,
  } = result;

  watch(userFromServer, (data) => {
    console.log("featch user");
    user.value = data;
  });

  function login(form: form) {
    return authLogin(form).then((newUser) => (user.value = newUser));
  }
  function register(form: form) {
    return authRegister(form).then((newUser) => (user.value = newUser));
  }
  function logout() {
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

export function useClient() {
  const { user } = useAuth();
  const token = user.value?.token;
  return function withUserClient(endpoint: string, config?: config) {
    return client(endpoint, { token, ...config });
  };
}
