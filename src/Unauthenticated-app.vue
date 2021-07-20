<template>
  <main class="container">
    <h1 class="hero">Bookshelf</h1>
    <section class="control">
      <app-modal>
        <template #modal-openButton="{ openModal }">
          <el-button @click="openModal">register</el-button>
        </template>
        <template #modal-title>
          <h3>Register</h3>
        </template>
        <template #modal-content>
          <login-form :handleSubmit="register" submitButtonText="register">
          </login-form>
        </template>
      </app-modal>

      <app-modal>
        <template #modal-openButton="{ openModal }">
          <el-button @click="openModal">login</el-button>
        </template>
        <template #modal-title>
          <h3>login</h3>
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
import { useAuth } from "@/context";
import AppModal from "@/components/AppModal.vue";

export default defineComponent({
  name: "Home",
  setup() {
    const { login, register } = useAuth();
    return {
      login,
      register,
    };
  },
  methods: {},
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
