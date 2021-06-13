<template>
  <div class="layout">
    <authenticated-app v-if="user" />
    <unauthenticated-app v-else />
  </div>
</template>

<script>
import { defineComponent } from "vue";
import { useAuth } from "@/context/AuthContext.vue";
import AuthenticatedApp from "./Authenticated-app.vue";
import UnauthenticatedApp from "./Unauthenticated-app.vue";

export default defineComponent({
  components: {
    AuthenticatedApp,
    UnauthenticatedApp,
  },
  setup() {
    const { user } = useAuth();

    return { user };
  },
});
</script>

<style lang="scss">
  .layout {

  color: white;
  background-color: black;
  }

</style>
