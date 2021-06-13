<template>
  <div>
    <slot name="open-button" :open-dialog="openDialog" />
    <el-dialog :title="modal" v-model="open" width="30%">
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
          <el-button @click="refetch" :disabled="isFetching" native-type=“submit”>
            <slot name="button-text" :isFetching="isFetching" />
          </el-button>
          &nbsp;
          <el-button @click="close">cancel</el-button>
        </el-form-item>
      </el-form>
      <span class="dialog-footer">
        <p v-if="isError">{{ error.message }}</p>
      </span>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, reactive, toRefs } from "vue";
import { useQuery } from "vue-query";
import { form, responseError, user } from "@/context/authProvider";
type state = {
  username: string;
  password: string;
  open: boolean;
};

export default defineComponent({
  props: {
    modal: { type: String as PropType<"register" | "login"> },
    handler: {
      type: Function as PropType<(form: form) => Promise<user>>,
    },
  },
  setup(prop) {
    const state = reactive<state>({ username: "", password: "", open: false });

    // todo: how to add a correctly type
    const { isFetching, isError, error, refetch } = useQuery(
      "login",
      () =>
        prop.handler &&
        prop.handler({ username: state.username, password: state.password }),
      {
        cacheTime: 0,
        enabled: false,
      }
    );
    return { ...toRefs(state), isError, isFetching, error, refetch };
  },
  methods: {
    openDialog() {
      this.open = true;
    },
    close() {
      this.password = "";
      this.username = "";
      this.open = false;
    },
  },
});
</script>

<style scoped></style>
