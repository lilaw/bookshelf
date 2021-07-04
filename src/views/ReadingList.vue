<template>
  <div>
    <ListItemList :filter="filter">
      <template v-slot:welcome>
        <span>
          Hey there! Welcome to your bookshelf reading list. Get started by
          heading over to
          <router-link to="/discover">the Discover page</router-link> to add
          books to your list.
        </span>
      </template>

      <template v-slot:explore>
        <span>
          Looks like you've finished all your books! Check them out in your
          <router-link to="/finished">finished books</router-link> or
          <router-link to="/discover">discover more</router-link>
        </span>
      </template>
    </ListItemList>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import ListItemList from "@/components/ListItemList.vue";
import { item } from "@/types";
export default defineComponent({
  setup() {
    function filter(item: item) {
      return !item.finishDate;
    }

    return { filter };
  },
  components: {
    ListItemList,
  },
});
</script>

<style scoped>
.books {
  list-style-type: none;
}
</style>
