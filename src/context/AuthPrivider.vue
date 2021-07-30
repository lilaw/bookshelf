<template>
  <!-- <div v-if="isLoading">
    <full-page-spinner />
  </div>
  <div v-else-if="isError">
    <error-message :error="error" />
  </div>
  <div v-else-if="isSuccess"> -->
    <slot> </slot>
  <!-- </div> -->
  <!-- <div v-else>
    There is a Unhandled state in AuthContext.vue. state is {{ status }},
  </div> -->
</template>

<script lang="tsx">
import { defineComponent } from "vue";
import { authProvider } from ".";
// import { FullPageSpinner, ErrorMessage } from "@/components/lib";

export default defineComponent({
  setup() {
    const { status, isLoading, isError, isSuccess, error } = authProvider();

    return { status, isLoading, isError, isSuccess, error };
  },
  components: {
    // FullPageSpinner,
    // ErrorMessage,
  },
});
</script>

<style scoped></style>
