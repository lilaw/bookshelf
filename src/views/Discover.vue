<template>
  <form class="search" @submit.prevent="refetch">
    <el-input placeholder="search books" v-model="query"></el-input>
    <el-button
      type="primary"
      class="search__btn"
      @click="refetch"
      :disabled="isFetching"
    >
      <span v-if="isFetching"><i class="el-icon-loading"></i></span>
      <span v-else><i class="el-icon-search"></i> Search</span>
    </el-button>
  </form>
  <main v-if="books">
    <section v-if="isError">
      <h3>There was an error:</h3>
      <pre>{{ error.emssage }}</pre>
    </section>
    <ul class="books">
      <li v-for="book in books" :key="book.id">
        <book-row :book="book" />
      </li>
    </ul>
  </main>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from "vue";
import { client } from "@/utils/client";
import { useQuery } from "vue-query";
import BookRow from "@/components/BookRow.vue";

export default defineComponent({
  setup() {
    const state = reactive({
      query: "j",
    });
    const {
      isLoading,
      isError,
      isFetching,
      data: books,
      error,
      refetch,
    } = useQuery(
      "books",
      () =>
        client(`books?query=${encodeURIComponent(state.query)}`).then(
          (data) => data.books
        ),
      {
        refetchOnWindowFocus: false,
      }
    );
    return {
      ...toRefs(state),
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
  &__btn {
    width: 125px;
  }
}

.books {
  list-style-type: none;
}
</style>
