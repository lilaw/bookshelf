<template>
  <main class="container">
    <h1 class="hero">Bookshelf</h1>
    <div class="form">
      <Form modal="register" :handler="register">
        <template v-slot:open-button="slotProps">
          <el-button v-on:click="slotProps.openDialog()">register</el-button>
        </template>
        <template v-slot:button-text="slotProps">
          <span v-if="slotProps.isFetching">loading</span>
          <span v-else>Regist</span>
        </template>
      </Form>
      <Form modal="login" :handler="login">
        <template v-slot:open-button="slotProps">
          <el-button v-on:click="slotProps.openDialog()">login</el-button>
        </template>
        <template v-slot:button-text="slotProps">
          <span v-if="slotProps.isFetching">loading</span>
          <span v-else>Login</span>
        </template>
      </Form>
    </div>
  </main>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Form from "@/components/Form.vue";
import { useAuth } from "@/context/authProvider";

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
    Form,
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
</style>
