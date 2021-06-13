<template>
  <div v-if="isLoading">is loading</div>
  <div v-else-if="isError">is error {{ error.message }}</div>
  <div v-else-if="isSuccess">
    is success
    <slot> </slot>
  </div>
  <div v-else>
    There is a Unhandled state in AuthContext.vue. state is {{ state }}
  </div>
</template>

<script lang="ts">
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
const valueKey: InjectionKey<value> = Symbol();

import { defineComponent } from "vue";
import {
  getToken,
  login as authLogin,
  logout as authLogout,
  register as authRegister,
} from "@/utils/auth-provider";
import { client } from "@/utils/client";
import { useQuery } from "vue-query";
import { provide, InjectionKey, Ref, inject } from "vue";

export default defineComponent({
  setup() {
    function getUser(): Promise<undefined | user> {
      return getToken().then((token) => {
        if (token) {
          return client("bootstrap", { token }).then((data) => data.user);
        } else {
          return Promise.resolve(undefined);
        }
      });
    }

    var {
      status,
      isLoading,
      isError,
      isSuccess,
      error,
      data: user,
    } = useQuery("user", getUser);

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
    const value = { user: user as Ref<user>, login, register, logout };
    provide(valueKey, value);

    return { status, isLoading, isError, isSuccess, error };
  },
});

export function useAuth(): value {
  const value = inject(valueKey);
  if (value) {
    return value;
  } else {
    throw new Error("use Auth value is undefined. ");
  }
}
export { form, user, responseError, valueKey, value };
</script>

<style scoped></style>
