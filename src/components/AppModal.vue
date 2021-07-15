<script lang="ts">
import { defineComponent, ref } from "vue";

export default defineComponent({
  setup() {
    const open = ref(false);

    function openModal() {
      open.value = true;
    }

    function closeModal() {
      open.value = false;
    }

    return { open, openModal, closeModal };
  },
});
</script>

<template>
  <div>
    <slot name="modal-openButton" :openModal="openModal" />
    <el-dialog v-model="open" width="30%" title="dialog">
      <template #title>
        <section class="modal__title">
          <slot name="modal-title">
            <h3>title</h3>
          </slot>
        </section>
      </template>

      <slot name="modal-content">content area</slot>

      <template #footer>
        <span class="dialog-footer">
          <slot name="modal-footer" />
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.modal__title {
  color: black;
  text-align: center;
}
</style>
