<template>
  <div class="layout">
    <authenticated-app v-if="isLoggedIn" />
    <unauthenticated-app v-else />
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";
import AuthenticatedApp from "./Authenticated-app.vue";
import UnauthenticatedApp from "./Unauthenticated-app.vue";
import { useAuthActor, setupAuthService } from "@/machines/authMachine";

export default defineComponent({
  setup() {
    setupAuthService();
    const { authState } = useAuthActor();
    const isLoggedIn = computed<boolean>(() =>
      authState.value.matches("authorized")
    );

    return { isLoggedIn };
  },
  components: {
    AuthenticatedApp,
    UnauthenticatedApp,
  },
});
</script>

<style lang="scss">
* {
  box-sizing: border-box;
}
.layout {
  color: white;
  background-color: black;
}
a {
  color: white;
}
</style>
