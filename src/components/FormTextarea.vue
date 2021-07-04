<template>
  <span v-if="isLoading">&nbsp;saving</span>
  <textarea
    name="note"
    class="book__note"
    id="book__note"
    cols="30"
    rows="10"
    @input="updateNoteChange"
    v-model="noteValue"
  ></textarea>
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from "vue";
import { useUdateListItem } from "@/utils/listItems";
import type { item } from "@/types";
import debounceFn from "debounce-fn";

export default defineComponent({
  props: {
    listItem: { type: Object as PropType<item>, required: true },
  },
  setup(props) {
    const noteValue = ref(props.listItem.notes);
    const { mutate, isError, error, isLoading } = useUdateListItem();

    type DebounceMutate = (payload: { id: string; notes: string }) => void;
    const debounceMutate: DebounceMutate = debounceFn(mutate, { wait: 3000 });
    function updateNoteChange() {
      debounceMutate({
        id: props.listItem.id,
        notes: noteValue.value,
      });
    }

    return { isError, error, isLoading, noteValue, updateNoteChange };
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
