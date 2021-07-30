<template>
  <header class="header">
    <span class="hero">Bookshelf</span>
    <span class="header__username">{{ user.username }}</span>
    <el-button
      type="primary"
      class="header__logout"
      aria-label="logout"
      @click.prevent="logout"
      >Logout</el-button
    >
  </header>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useAuthActor } from "@/machines";

export default defineComponent({
  setup() {
    const { authState, sendAuth } = useAuthActor();
    function logout() {
      sendAuth({ type: "LOGOUT" });
    }

    return { user: authState.value.context.user, logout };
  },
});
</script>

<style lang="scss" scoped>
.hero {
  margin-right: auto;
}
.header {
  margin-bottom: 2rem;
  display: flex;
  justify-content: flex-end;
  align-items: baseline;
  column-gap: 1rem;
  padding: 1rem;
  &__username {
  }
  &__logout {
  }
}
</style>
