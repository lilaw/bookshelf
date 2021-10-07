<template>
  <i class="el-icon-loading" aria-label="loading" v-if="isLoading" />
  <ErrorMessage :error="error" v-if="isError" />
  <textarea
    name="note"
    class="book__note"
    id="book__note"
    cols="30"
    rows="10"
    @input="updateNoteChange"
    v-model="noteValue"
    aria-label="note"
  ></textarea>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, computed } from "vue";
import type { item } from "@/types";
import debounceFn from "debounce-fn";
import { ErrorMessage } from "@/components/lib";
import { useActor } from "@xstate/vue";
import type { DataMachineActor } from "@/machines/dataMachine";

export default defineComponent({
  props: {
    noteRef: {
      type: Object as PropType<DataMachineActor>,
      required: true,
    },
    listItem: {
      type: Object as PropType<item>,
      required: true,
    },
  },
  setup(props) {
    const noteValue = ref(props.listItem.notes);
    const { state: noteState, send: sendNote } = useActor(props.noteRef);

    type DebounceMutate = (notes: string) => void;
    const debounceMutate: DebounceMutate = debounceFn(
      (notes) => sendNote({ type: "CLICK", data: { notes } }),
      { wait: 3000 }
    );
    function updateNoteChange() {
      debounceMutate(noteValue.value);
    }

    const { isError, error, isLoading } = {
      isLoading: computed(() => noteState.value.matches("loading")),
      isError: computed(() => noteState.value.matches("failure")),
      error: computed(() => noteState.value.context?.message),
    };
    return { isError, error, isLoading, noteValue, updateNoteChange };
  },
  components: {
    ErrorMessage,
  },
});
</script>

<style scoped>
.book__note {
  margin-top: 1rem;
  display: block;
  width: 100%;
}
</style>
