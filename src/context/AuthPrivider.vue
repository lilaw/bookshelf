<template>
  <div v-if="isLoading">is loading</div>
  <div v-else-if="isError">There's a problem.  {{ error.message }}</div>
  <div v-else-if="isSuccess">
    <slot> </slot>
  </div>
  <div v-else>
    There is a Unhandled state in AuthContext.vue. state is {{ status }},
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { authProvider } from "./authProvider";

export default defineComponent({
  setup() {
    const { status, isLoading, isError, isSuccess, error } = authProvider();

    return { status, isLoading, isError, isSuccess, error };
  },
});
</script>

<style scoped></style>
