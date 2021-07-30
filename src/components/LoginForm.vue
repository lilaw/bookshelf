<template>
  <div>
    <el-form ref="form" label-width="120px" @submit.prevent="submitForm">
      <el-form-item label="User name">
        <el-input v-model="username" data-testid="username"></el-input>
      </el-form-item>
      <el-form-item label="Password">
        <el-input
          type="password"
          v-model="password"
          autocomplete="off"
          data-testid="password"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button
          :disabled="isFetching"
          native-type="submit"
          data-testid="submitButton"
        >
          <i class="el-icon-loading" aria-label="loading" v-if="isFetching" />
          <span v-else>{{ submitButtonText }}</span>
        </el-button>
        &nbsp;
      </el-form-item>
    </el-form>
    <section class="error-warpper">
      <ErrorMessage v-if="hasMessage" :error="message" />
    </section>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, reactive, toRefs } from "vue";
import type { user, form } from "@/types";
import { ErrorMessage } from "@/components/lib";
import { useAuthActor } from "@/machines";

export default defineComponent({
  props: {
    submitButtonText: {
      type: String,
      required: true,
    },
    handleSubmit: {
      type: Function as PropType<(form: form) => Promise<user>>,
      required: true,
    },
  },
  setup(prop) {
    const state = reactive({ username: "", password: "" });
    const { authState } = useAuthActor();
    const isFetching = computed(() => authState.value.matches("loading"));
    const hasMessage = computed(() => Boolean(authState.value.context.message));
    const message = computed(() => authState.value.context.message);
    function submitForm() {
      prop.handleSubmit({
        username: state.username,
        password: state.password,
      });
    }

    return { ...toRefs(state), isFetching, hasMessage, message, submitForm };
  },
  components: {
    ErrorMessage,
  },
});
</script>

<style scoped></style>
