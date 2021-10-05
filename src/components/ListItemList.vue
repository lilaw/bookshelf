<template>
  <div v-if="bookRefs">
    <p v-if="bookRefs.length === 0">
      <slot name="welcome" />
    </p>
    <p v-else-if="filtteredBookRefs.length !== 0">
      <slot name="explore" />
    </p>

    <ul class="books">
      <li v-for="bookRef in filtteredBookRefs" :key="bookRef.id">
        <BookRow :bookRef="bookRef" />
      </li>
    </ul>
  </div>
  <el-skeleton style="margin-left: 40px" v-if="isLoading">
    <template #template>
      <div
        class="book__wrapper"
        style="display: flex; gap: 1rem; width: 650px; margin-bottom: 3rem"
      >
        <el-skeleton-item
          variant="image"
          class="book__cover"
          style="height: 210px; width: 200px"
        />
        <el-skeleton :rows="5" animated />
      </div>
      <div
        class="book__wrapper"
        style="display: flex; gap: 1rem; width: 650px; margin-bottom: 1rem"
      >
        <el-skeleton-item
          variant="image"
          class="book__cover"
          style="height: 210px; width: 200px"
        />
        <el-skeleton :rows="5" animated />
      </div>
    </template>
  </el-skeleton>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from "vue";
import type { item } from "@/types";
import BookRow from "@/components/BookRow.vue";
import { listMachine } from "@/machines/listMachine";
import { useMachine } from "@xstate/vue";

export default defineComponent({
  props: {
    filter: {
      type: Function as PropType<(i: item) => boolean>,
      required: true,
    },
  },
  setup(props) {
    const { state: listState, send: sendList } = useMachine(listMachine);
    sendList({ type: "CLICK" });
    const isLoading = computed(() =>
      (["loading", "idle"] as ["loading", "idle"]).some(listState.value.matches)
    );
    const bookRefs = computed(() =>
      isLoading.value ? [] : listState.value.context.result
    );

    const filtteredBookRefs = computed(() =>
      isLoading.value
        ? []
        : bookRefs.value.filter((ref) =>
            props.filter(ref.state.context.listItem)
          )
    );

    return { filtteredBookRefs, bookRefs, isLoading };
  },
  components: {
    BookRow,
  },
});
</script>

<style scoped>
.books {
  list-style-type: none;
}
</style>
