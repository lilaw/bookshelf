<template>
  <App />
</template>

<script>
import { defineComponent } from "vue";
import { useQueryProvider } from "@/context/QueryClient";
import App from "./App.vue";

export default defineComponent({
  components: {
    App,
  },
  setup() {
    useQueryProvider();
  },
});
</script>

<style lang="scss"></style>
