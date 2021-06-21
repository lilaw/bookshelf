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
        <div class="book__button">
          <tooltip-status :bookId="bookId" />
        </div>
        <div class="book__rate">
          <rate />
        </div>
        <div class="book__date"></div>
        <p class="book__synopsis">{{ book.synopsis.substring(0, 500) }}...</p>
      </div>
    </section>

    <section class="book-container--tail">
      <label for="book__note" class="book__label">Notes:</label>
      <textarea
        name="note"
        class="book__note"
        id="book__note"
        cols="30"
        rows="10"
      ></textarea>
    </section>
  </main>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";
import { useRoute } from "vue-router";
import TooltipStatus from "@/components/TooltipStatus.vue";
import Rate from "@/components/Rate.vue";
import {useBook} from '@/utils/book'

export default defineComponent({
  setup() {
    const route = useRoute();
    const bookId = computed(() => route.params.bookId as string);
    const book = useBook(bookId.value)

    console.log({ route: route.params.bookId });
    return { book, bookId };
  },
  components: {
    TooltipStatus,
    Rate,
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
  }
  &__date {
    grid-column: 1 / -1;
  }
  &__synopsis {
    grid-column: 1 / -1;
  }

  /* tail */
  &__note {
    margin-top: 1rem;
    display: block;
    width: 100%;
  }
  &__label {
  }
}
</style>
