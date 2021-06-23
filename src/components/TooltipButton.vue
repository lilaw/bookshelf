<template>
  <el-tooltip
    :content="isError ? error.message : label"
    placement="bottom"
    effect="light"
  >
    <div>
      <el-button
        class="button"
        native-type="button"
        :aria-label="isError ? error.message : label"
        size="mini"
        circle
        @click.prevent.stop="clickHandler"
      >
        <!-- optimisticUpdate  -->
        <i class="el-icon-loading" v-if="isLoading" />
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
