<template>
  <div class="home">
    <Form modal="register">
      <template v-slot:open-button="slotProps">
        <el-button v-on:click="slotProps.openDialog()">register</el-button>
      </template>
      <template v-slot:button>
        <el-button @click="register">Regist</el-button>
      </template>
    </Form>
    <Form modal="login">
      <template v-slot:open-button="slotProps">
        <el-button v-on:click="slotProps.openDialog()">login</el-button>
      </template>
      <template v-slot:button>
        <el-button @click="login">Login</el-button>
      </template>
    </Form>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from "vue";
import Form from "@/components/Form.vue";

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
    const state = reactive({});

    return {
      ...toRefs(state),
    };
  },
  methods: {
    onSubmit(form: { username: string; password: string }) {
      console.log("submit!", { form });
    },
    register() {
      console.log("register");
    },
    login() {
      console.log("login");
    },
  },
  components: {
    Form,
  },
});
</script>
