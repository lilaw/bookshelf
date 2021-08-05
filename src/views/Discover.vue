<template>
  <form class="search" @submit.prevent="searchBooks">
    <el-input placeholder="search books" v-model="query"></el-input>
    <el-button
      type="primary"
      class="search__btn"
      native-type="submit"
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
    <ul class="books" v-if="!isFetching">
      <li v-for="bookRef in booksRef" :key="bookRef.id">
        <BookRow :bookRef="bookRef" />
      </li>
    </ul>
  </main>
</template>

<script lang="ts">
import { defineComponent, onUnmounted, ref, watch , computed, } from "vue";
import BookRow from "@/components/BookRow.vue";
import { refetchBookSearch } from "@/utils/book";
import { useMachine } from "@xstate/vue";
import { searchMachine } from "@/machines/searchMachine";

export default defineComponent({
  setup() {
    const query = ref("");
    const { state: searchState, send: sendSearch } = useMachine(searchMachine);
    const isFetching = computed(() => searchState.value.matches("searching"))
    const isError = computed(() => searchState.value.matches("failure"))
    const error = computed(() => searchState.value.context.message)
    const books = computed(() => searchState.value.context.books)
    const booksRef = computed(() => searchState.value.context.booksRef)
    watch(query, (query) => {
      sendSearch({ type: "UPDATE-QUERY", query });
    });

    function searchBooks() {
      sendSearch({ type: "SEARCH" });
    }

    onUnmounted(() => refetchBookSearch());

    return {
      query,
      isError,
      isFetching,
      books,
      error,
      status,
      searchBooks,
      booksRef
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
