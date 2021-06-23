<template>
  <authProvider>
    <App />
  </authProvider>
</template>

<script>
import { defineComponent } from "vue";
import { useQueryProvider } from "@/context/QueryClient";
import App from "./App.vue";
import authProvider from "@/context/AuthPrivider.vue";

export default defineComponent({
  components: {
    authProvider,
    App,
  },
  setup() {
    useQueryProvider();
  },
});
</script>

<style lang="scss"></style>
