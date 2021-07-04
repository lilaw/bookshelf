<template>
  <main class="book">
    <section class="book-container--head">
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
        <span class="book__author">{{ book.author }}</span>
        <div class="book__button" v-if="!loadingBook">
          <tooltip-status :bookId="bookId" />
        </div>
        <div class="book__rate" v-if="listItem">
          <rate :listItem="listItem" />
        </div>
        <div class="book__date" v-if="listItem">
          <i class="el-icon-date"></i>
          <span>{{ formatDate(listItem.startDate) }}</span>
          <span v-if="listItem.finishDate"
            >— &nbsp;{{ formatDate(listItem.finishDate) }}</span
          >
        </div>
        <p class="book__synopsis">{{ book.synopsis.substring(0, 500) }}...</p>
      </div>
    </section>

    <section class="book-container--tail" v-if="listItem">
      <label for="book__note" class="book__label">Notes:</label>
      <form-textarea :listItem="listItem" />
    </section>
  </main>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";
import { useRoute } from "vue-router";
import TooltipStatus from "@/components/TooltipStatus.vue";
import Rate from "@/components/Rate.vue";
import { useBook } from "@/utils/book";
import { useListItem } from "@/utils/listItems";
import FormTextarea from "@/components/FormTextarea.vue";

export default defineComponent({
  setup() {
    const route = useRoute();
    const bookId = computed(() => route.params.bookId as string);
    const { data: book, isLoading: loadingBook } = useBook(bookId.value);
    const listItem = useListItem(bookId.value);

    function formatDate(isostring: string): string {
      return Intl.DateTimeFormat(undefined, {
        month: "short",
        year: "2-digit",
      }).format(new Date(isostring));
    }

    return { book, loadingBook, bookId, listItem, formatDate };
  },
  components: {
    TooltipStatus,
    Rate,
    FormTextarea,
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
    row-gap: 0.5rem;
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
</style>
