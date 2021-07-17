import { useQuery, useQueryClient } from "vue-query";
import {
  getToken,
  login as authLogin,
  logout as authLogout,
  register as authRegister,
} from "@/utils/auth-provider";
import { provide, Ref, ref, InjectionKey, inject, watch } from "vue";
import {
  areYouABadBody,
  areYouABadStatus,
  client,
  config,
} from "@/utils/client";
import type { HttpError, item, user, form } from "@/types";
import { isBootstrapData, isUserLike, isUserData } from "@/type-guards";

/**
 * type for provider ********************************************
 */

type value = {
  user: Ref<user>;
  login: (form: form) => Promise<user>;
  register: (form: form) => Promise<user>;
  logout: () => void;
};

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
    function cacheListitems(data: { user: user; listItems: item[] }) {
      queryClient.setQueryData("list-items", data.listItems);
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
      .then(areYouABadBody(isBootstrapData))
      .then(cacheListitems)
      .catch(handleNoToken);
  }

  const result = useQuery<user | undefined, HttpError>("user", bootstrap, {
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
    return authLogin(form)
      .then(formatData)
      .catch(formatError)
      .then(areYouABadStatus)
      .then(areYouABadBody(isUserData))
      .then((newUser) => (user.value = newUser));
  }
  function register(form: form) {
    return authRegister(form)
      .then(formatData)
      .catch(formatError)
      .then(areYouABadStatus)
      .then(areYouABadBody(isUserData))
      .then((newUser) => (user.value = newUser));
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

function formatError(data: { status: number; message: string }) {
  return {
    response: { ok: false, status: data.status } as Response,
    json: data,
  };
}
function formatData(data: { status: number; message: string }): {
  response: Response;
  json: unknown;
} {
  return {
    response: { ok: true, status: data.status } as Response,
    json: data,
  };
}
