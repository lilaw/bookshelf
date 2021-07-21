<template>
  <form class="search" @submit.prevent="refetch">
    <el-input placeholder="search books" v-model="query"></el-input>
    <el-button
      type="primary"
      class="search__btn"
      @click="refetch"
      :disabled="isFetching"
    >
      <span v-if="isFetching"
        ><i class="el-icon-loading" aria-label="loading"></i
      ></span>
      <span v-else><i class="el-icon-search"></i> Search</span>
    </el-button>
  </form>
  <div>
    <p>Welcome to the discover page.</p>
    <p>Here, let me load a few books for you...</p>
  </div>
  <main v-if="books">
    <section v-if="isError">
      <h3>There was an error:</h3>
      <pre>{{ error.message }}</pre>
    </section>
    <ul class="books">
      <li v-for="book in books" :key="book.id">
        <book-row :book="book" />
      </li>
    </ul>
  </main>
</template>

<script lang="ts">
import { defineComponent, onUnmounted, ref } from "vue";
import BookRow from "@/components/BookRow.vue";
import { discoverBookSearch, refetchBookSearch } from "@/utils/book";

export default defineComponent({
  setup() {
    const query = ref("");
    const {
      isLoading,
      isError,
      isFetching,
      data: books,
      error,
      refetch,
    } = discoverBookSearch(query);

    onUnmounted(() => refetchBookSearch());

    return {
      query,
      isLoading,
      isError,
      isFetching,
      books,
      error,
      refetch,
    };
  },
  components: {
    BookRow,
  },
});
</script>

<style lang="scss" scoped>
.search {
  display: flex;
  column-gap: 1rem;
  width: 42rem;
  &__btn {
    width: 125px;
  }
}

.books {
  list-style-type: none;
  padding: 0;
}
</style>
