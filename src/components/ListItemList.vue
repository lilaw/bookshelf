<template>
  <div>
    <p v-if="listItems.length === 0">
      <slot name="welcome" />
    </p>
    <p v-else-if="filtteredListItems.length === 0">
      <slot name="explore" />
    </p>

    <ul class="books">
      <li v-for="item in filtteredListItems" :key="item.id">
        <book-row :book="item.book" />
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from "vue";
import { useListItems, item } from "@/utils/listItems";
import BookRow from "@/components/BookRow.vue";

export default defineComponent({
  props: {
    filter: {
      type: Function as PropType<(i: item) => boolean>,
      required: true,
    },
  },
  setup(props) {
    const listItems = useListItems();
    const filtteredListItems = computed(() =>
      listItems.value?.filter(props.filter)
    );

    return { filtteredListItems, listItems };
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
