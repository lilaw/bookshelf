<template>
  <main class="book">
    <div class="book-container" v-if="isSuccess">
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
          <div class="book__maker">
            <span class="book__author">{{ book.author }}</span> |
            <span>{{ book.publisher }}</span>
          </div>
          <div class="book__button">
            <TooltipStatus :buttonsRef="buttons" :bookState="bookState" />
          </div>
          <div class="book__rate" v-if="isRead">
            <BookRate :starRef="star" :listItem="listItem" />
          </div>
          <div class="book__date" v-if="isRead">
            <i class="el-icon-date"></i>
            <span>{{ formatDate(listItem.startDate) }}</span>
            <!-- eslint-disable-next-line  -->
            <span v-if="listItem.finishDate">
              - &nbsp;{{ formatDate(listItem.finishDate) }}</span
            >
          </div>
          <p class="book__synopsis" data-testid="book-synopsis">
            {{ book.synopsis.slice(0, 500) }}...
          </p>
        </div>
      </section>
      <section class="book-container--tail" v-if="isRead">
        <label for="book__note" class="book__label">Notes:</label>
        <BookNoteArea :noteRef="note" :listItem="listItem" />
      </section>
    </div>
    <section class="book-error" v-if="isError">
      <ErrorMessage :error="error" />
    </section>
    <el-skeleton class="book-container" v-if="isLoading" aria-label="loading">
      <template #template>
        <section class="book-container--head">
          <div class="book__cover-container">
            <el-skeleton-item
              variant="image"
              class="book__cover-img"
              style="height: 214px"
            />
          </div>
          <div class="book__info-warpper">
            <el-skeleton :rows="5" animated />
          </div>
        </section>
      </template>
    </el-skeleton>
  </main>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";
import { useRoute } from "vue-router";
import TooltipStatus from "@/components/TooltipStatus.vue";
import BookRate from "@/components/BookRate.vue";
import BookNoteArea from "@/components/BookNoteArea.vue";
import { ErrorMessage } from "@/components/lib";
import { useMachine } from "@xstate/vue";
import { bookMachine } from "@/machines/bookMachine";

export default defineComponent({
  setup() {
    const route = useRoute();
    const bookId = computed(() => route.params.bookId as string);

    const { state: bookState, service: bookService } = useMachine(
      bookMachine({ bookId: bookId.value })
    );
    const isLoading = computed(() =>
      ["loadBook.book", "loadBook.listItem"].some((s) =>
        bookState.value.matches(s as "loadBook.book" | "loadBook.listItem")
      )
    );
    const isError = computed(() => bookState.value.matches("loadBook.failure"));
    const isSuccess = computed(() => bookState.value.matches("success"));
    const error = computed(() => bookState.value.context.message);
    const listItem = computed(() => bookState.value.context?.listItem);
    const isRead = computed(() => bookState.value.matches("success.read"));
    const note = computed(() => bookState.value.context?.note);
    const star = computed(() => bookState.value.context?.star);
    const buttons = computed(() => bookState.value.context?.buttons);
    const book = computed(() => bookState.value.context?.book);

    function formatDate(isostring: number): string {
      return Intl.DateTimeFormat(undefined, {
        month: "short",
        year: "2-digit",
      }).format(new Date(isostring));
    }

    return {
      bookState,
      book,
      bookService,
      isSuccess,
      isLoading,
      listItem,
      formatDate,
      isError,
      error,
      isRead,
      note,
      star,
      buttons,
    };
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
  position: relative;
  min-height: 25rem;
  &__cover-container {
    width: 12rem;
  }
  &__cover-img {
    width: 100%;
    aspect-ratio: 71 / 107;
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
}
.book-error {
  display: grid;
  justify-content: center;
  align-content: center;
  height: 16rem;
}
</style>
