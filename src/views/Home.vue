<template>
  <div class="home">home</div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from "vue";

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
  methods: {},
  components: {},
});
</script>
