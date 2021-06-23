import { useQuery, useQueryClient } from "vue-query";
import {
  getToken,
  login as authLogin,
  logout as authLogout,
  register as authRegister,
} from "@/utils/auth-provider";
import { provide, Ref, ref, InjectionKey, inject, watch, reactive } from "vue";
import { client, config } from "@/utils/client";
import { item } from "@/utils/listItems";
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
  const queryClient = useQueryClient();
  const user: Ref<user | undefined> = ref(undefined);

  function bootstrap(): Promise<user | undefined> {
    function validateToken(token: string | null) {
      return token ? token : Promise.reject("no token in localStorage");
    }
    function fetchUser(token: string) {
      return client("bootstrap", { token });
    }
    function cacheListitems(data: { user: user; listitems: item[] }) {
      queryClient.setQueryData("list-items", data.listitems);
      return data.user;
    }
    function handleNoToken(reason: unknown) {
      if (typeof reason === "string" && reason === "no token in localStorage")
        return undefined;
      return Promise.reject(reason);
    }

    return getToken()
      .then(validateToken)
      .then(fetchUser)
      .then(cacheListitems)
      .catch(handleNoToken);
  }

  const result = useQuery<user | undefined, responseError>("user", bootstrap, {
    staleTime: Infinity,
    retry: false,
  });
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
