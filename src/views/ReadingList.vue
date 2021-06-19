<template>
  <div>
    <p v-if="listItems.length === 0">
      Hey there! Welcome to your bookshelf reading list. Get started by heading
      over to <router-link to="/discover">the Discover page</router-link> to add
      books to your list.
    </p>
    <p v-else-if="filtteredListItems.length === 0">
      Looks like you've finished all your books! Check them out in your{' '}
      <router-link to="/finished">finished books</router-link> or{' '}
      <roter-link to="/discover">discover more</roter-link>
    </p>

    <ul class="books">
      <li v-for="item in filtteredListItems" :key="item.id">
        <book-row :book="item.book" />
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";
import { useListItems } from "@/utils/listItems";
import BookRow from "@/components/BookRow.vue";

export default defineComponent({
  setup() {
    const listItems = useListItems();
    const filtteredListItems = computed(() =>
      listItems.value?.filter((i) => !i.finishDate)
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
