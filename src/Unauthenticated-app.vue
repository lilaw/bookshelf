<template>
  
  <main class="container">
    <h1 class="hero">Bookshelf</h1>
    <div class="form">
      <Form modal="register" >
        <template v-slot:open-button="slotProps">
          <el-button v-on:click="slotProps.openDialog()">register</el-button>
        </template>
        <template v-slot:button="slotProps">
          <el-button @click="register(slotProps.form)">Regist</el-button>
        </template>
      </Form>
      <Form modal="login">
        <template v-slot:open-button="slotProps">
          <el-button v-on:click="slotProps.openDialog()">login</el-button>
        </template>
        <template v-slot:button="slotProps">
          <el-button @click="login(slotProps.form)">Login</el-button>
        </template>
      </Form>
    </div>
  </main>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from "vue";
import Form from "@/components/Form.vue";
import { useAuth } from "@/context/AuthContext.vue";

// import HelloWorld from "@/components/HelloWorld.vue"; // @ is an alias to /src
// type LoginForm = {
// modal: "none" | "register" | "login";
// form: {
//   username: string;
//   password: string;
// };
// };
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