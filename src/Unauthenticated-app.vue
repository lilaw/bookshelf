<template>
  <main class="container">
    <h1 class="hero">Bookshelf</h1>
    <section class="control">
      <app-modal :closeAction="clearMessage">
        <template #modal-openButton="{ openModal }">
          <el-button @click="openModal">register</el-button>
        </template>
        <template #modal-title>
          <h3 data-testid="registerHeading">Register</h3>
        </template>
        <template #modal-content>
          <login-form :handleSubmit="register" submitButtonText="register">
          </login-form>
        </template>
      </app-modal>

      <app-modal :closeAction="clearMessage">
        <template #modal-openButton="{ openModal }">
          <el-button @click="openModal">login</el-button>
        </template>
        <template #modal-title>
          <h3 data-testid="loginHeading">login</h3>
        </template>
        <template #modal-content>
          <login-form :handleSubmit="login" submitButtonText="login">
          </login-form>
        </template>
      </app-modal>
    </section>
  </main>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import LoginForm from "@/components/LoginForm.vue";
import AppModal from "@/components/AppModal.vue";
import { useAuthActor } from "@/machines/authMachine";
import type { form } from "@/types";

export default defineComponent({
  name: "Home",
  setup() {
    const { sendAuth } = useAuthActor();
    function clearMessage() {
      sendAuth("CLEAR");
    }
    function login(form: form) {
      sendAuth({ type: "LOGIN", form });
    }
    function register(form: form) {
      sendAuth({ type: "SIGNUP", form });
    }

    return {
      login,
      register,
      clearMessage,
    };
  },
  components: {
    LoginForm,
    AppModal,
  },
});
</script>

<style lang="scss">
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: black;
}
.form {
  display: flex;
  column-gap: 1rem;
}
.hero {
  font-size: 3rem;
}
.control {
  display: flex;
  column-gap: 2rem;
}
</style>
