<template>
  <div>
    <slot name="open-button" :open-dialog="openDialog" />
    <el-dialog :title="modal" v-model="open" width="30%">
      <el-form ref="form" label-width="120px">
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
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <slot name="button" :form="{ username, password }" />
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, reactive, toRefs } from "vue";
type form = {
  username: string;
  password: string;
  open: boolean;
};

export default defineComponent({
  props: {
    modal: { type: String as PropType<"register" | "login"> },
  },
  setup() {
    const state = reactive<form>({ username: "", password: "", open: false });
    return { ...toRefs(state) };
  },
  methods: {
    openDialog() {
      this.open = true;
    },
  },
});
</script>

<style scoped></style>
