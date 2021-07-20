<template>
  <main class="book">
    <section class="book-container--head" v-if="!isError">
      <div class="book__cover-container">
        <img
          :src="book.coverImageUrl"
          :alt="`${book.title} cover image`"
          class="book__cover-img"
        />
      </div>
      <div class="book__info-warpper">
        <h2 class="book__title">
          {{ book.title }}
        </h2>
        <div class="book__maker">
          <span class="book__author">{{ book.author }}</span> |
          <span>{{ book.publisher }}</span>
        </div>
        <div class="book__button" v-if="!isLoading">
          <tooltip-status :bookId="bookId" />
        </div>
        <div class="book__rate" v-if="listItem">
          <BookRate :listItem="listItem" />
        </div>
        <div class="book__date" v-if="listItem">
          <i class="el-icon-date"></i>
          <span>{{ formatDate(listItem.startDate) }}</span>
          <!-- eslint-disable-next-line  -->
          <span v-if="listItem.finishDate"> - &nbsp;{{ formatDate(listItem.finishDate) }}</span>
        </div>
        <p class="book__synopsis" data-testid="book-synopsis">
          {{ book.synopsis.slice(0, 500) }}...
        </p>
      </div>
    </section>

    <section class="book-container--tail" v-if="listItem">
      <label for="book__note" class="book__label">Notes:</label>
      <BookNoteArea :listItem="listItem" />
    </section>

    <section class="book-error" v-if="isError">
      <ErrorMessage :error="error" />
    </section>
  </main>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";
import { useRoute } from "vue-router";
import TooltipStatus from "@/components/TooltipStatus.vue";
import BookRate from "@/components/BookRate.vue";
import { useBook } from "@/utils/book";
import { useListItem } from "@/utils/listItems";
import BookNoteArea from "@/components/BookNoteArea.vue";
import { ErrorMessage } from "@/components/lib";

export default defineComponent({
  setup() {
    const route = useRoute();
    const bookId = computed(() => route.params.bookId as string);
    const { data: book, isLoading, isError, error } = useBook(bookId.value);
    const listItem = useListItem(bookId.value);

    function formatDate(isostring: number): string {
      return Intl.DateTimeFormat(undefined, {
        month: "short",
        year: "2-digit",
      }).format(new Date(isostring));
    }

    return { book, isLoading, bookId, listItem, formatDate, isError, error };
  },
  components: {
    TooltipStatus,
    BookRate,
    BookNoteArea,
    ErrorMessage,
  },
});
</script>

<style lang="scss" scoped>
.book {
  border: 2px solid white;
  width: 44rem;
  padding: 1rem;
}
.book-container--head {
  display: flex;
  column-gap: 2rem;
}
.book-container--tail {
  margin-top: 3rem;
}
.book {
  &__cover-container {
    width: 12rem;
  }
  &__cover-img {
    width: 100%;
  }
  &__info-warpper {
    display: grid;
    grid-template-columns: 9fr 1fr;
    column-gap: 1rem;
    row-gap: 1rem;
    width: 100%;
  }
  &__title {
    font-size: 2rem;
    grid-row: 1 / 2;
  }
  &__author {
  }
  &__button {
    grid-row: 1 / 3;
    grid-column: 2 / 3;
    justify-self: right;
  }
  &__rate {
    grid-column: 1 / -1;
    height: 2rem;
  }
  &__date {
    grid-column: 1 / -1;
    display: flex;
    column-gap: 0.5rem;
    height: 1.2rem;
  }
  &__synopsis {
    grid-column: 1 / -1;
  }

  /* tail */
  &__label {
  }
}
.book-error {
  display: grid;
  justify-content: center;
  align-content: center;
  height: 16rem;
}
</style>
