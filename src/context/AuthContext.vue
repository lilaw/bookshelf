<template>
  <div v-if="isLoading">is loading</div>
  <div v-if="isError">is error {{ error.message }}</div>
  <div v-if="isSuccess">
    is success
    <slot> </slot>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import {
  getToken,
  login as authLogin,
  logout as authLogout,
  register as authRegister,
} from "@/utils/auth-provider";
import { client } from "@/utils/client";
import { useQuery } from "vue-query";
import { InjectionKey, provide, inject, Ref } from "vue";

type form = {
  [K in "username" | "password"]: string;
};
type user = {
  [k in "id" | "token" | "username"]: string;
};

// eslint-disable-next-line
type value = {
  user: Ref<user>;
  login: (form: form) => Promise<user>;
  register: (form: form) => Promise<user>;
  logout: () => void;
};
const valueKey: InjectionKey<value> = Symbol();

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

    return { isLoading, isError, isSuccess, error };
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
</script>

<style scoped></style>
