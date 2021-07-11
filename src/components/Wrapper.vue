<template>
  <div>
          <el-button @click="$emit('modalEvent')">app wrapper</el-button>
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default {
  name: "EventListener",
};
</script>

<style scoped></style>
