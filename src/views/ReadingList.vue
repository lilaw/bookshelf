<template>
  <div>

    <ul class="books">
      <li v-for="item in listItems" :key="item.id">
        <book-row :book="item.book" />
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent, } from "vue";
import { useListItems , } from "@/utils/listItems";
import BookRow from "@/components/BookRow.vue";

export default defineComponent({
  setup() {
    const listItems = useListItems();

    return { listItems };
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
