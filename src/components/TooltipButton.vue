<template>
  <el-tooltip
    :content="isError ? error : label"
    placement="bottom"
    effect="light"
    :model-value="isError ? true : null"
    :manual="isError"
  >
    <div>
      <el-button
        class="button"
        native-type="button"
        :aria-label="isError ? `${label} ${error}` : label"
        size="mini"
        circle
        @click.prevent.stop="clickHandler"
        :disabled="isLoading"
      >
        <!-- optimisticUpdate  -->
        <i class="el-icon-loading" aria-label="loading" v-if="isLoading" />
        <i :class="icon" v-else />
        <!-- <i :class="icon"  /> -->
      </el-button>
    </div>
  </el-tooltip>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    label: String,
    clickHandler: { type: Function, required: true },
    icon: { type: String, required: true },
    state: { type: Object, required: true },
  },
  setup(props) {
    return {
      isLoading: props.state.isLoading,
      isError: props.state.isError,
      error: props.state.error,
    };
  },
});
</script>

<style lang="scss" scoped></style>
