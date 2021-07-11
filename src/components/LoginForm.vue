<template>
  <div>
    <el-form ref="form" label-width="120px" @submit.prevent="refetch">
      <el-form-item label="User name">
        <el-input v-model="username"></el-input>
      </el-form-item>
      <el-form-item label="Password">
        <el-input
          type="password"
          v-model="password"
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button
          @click="refetch"
          :disabled="isFetching"
          native-type="“submit”"
        >
          <i class="el-icon-loading" v-if="isFetching" />
          <span v-else>{{ submitButtonText }}</span>
        </el-button>
        &nbsp;
      </el-form-item>
    </el-form>
    <span class="dialog-footer">
      <p v-if="isError">{{ error.message }}</p>
    </span>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, reactive, toRefs } from "vue";
import { useQuery } from "vue-query";
import type { user, HttpError, form } from "@/types";

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

    const { isFetching, isError, error, refetch } = useQuery<user, HttpError>(
      "login",
      () =>
        prop.handleSubmit({
          username: state.username,
          password: state.password,
        }),
      {
        cacheTime: 0,
        enabled: false,
      }
    );
    return { ...toRefs(state), isError, isFetching, error, refetch };
  },
});
</script>

<style scoped></style>
