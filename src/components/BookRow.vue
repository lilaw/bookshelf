<template>
  <section class="book" data-testid="book-row">
    <router-link :to="`/books/${book.id}`" class="book__link">
      <div class="book__wrapper">
        <img
          :src="book.coverImageUrl"
          :alt="`${book.title} cover`"
          class="book__cover"
        />
        <div class="book__info">
          <h3 class="book__title">{{ book.title }}</h3>
          <span class="book__author">{{ book.author }}</span>
          <p class="book__synopsis">{{ book.synopsis.substring(0, 500) }}...</p>
        </div>
      </div>
    </router-link>
    <TooltipStatus :bookService="bookRef" />
  </section>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from "vue";
import TooltipStatus from "@/components/TooltipStatus.vue";
import { useActor } from "@xstate/vue";
import type { Interpreter} from "xstate";
import type {
  BookMachineContext,
  BookMachineEvents,
} from "@/machines/bookMachine";

export default defineComponent({
  props: {
    bookRef: {
      type: Object as PropType<
        Interpreter<BookMachineContext, any, BookMachineEvents>
      >,
      required: true,
    },
  },
  setup(props) {
    const { state: bookState, } = useActor(props.bookRef);
    const book = computed(() => bookState.value.context?.book);

    return { book };
  },
  components: {
    TooltipStatus,
  },
});
</script>

<style lang="scss" scoped>
.book {
  margin-top: 1rem;
  width: 45rem;
  display: flex;
  height: 17.25rem;
  &__wrapper {
    display: flex;
    align-items: flex-start;
    column-gap: 1rem;
    padding: 1rem;
    padding-right: 2rem;
    border: white solid 0.1em;
  }
  &__cover {
    width: 140px;
  }
  &__info {
    display: grid;
    grid-template-columns: 4fr 2fr;
  }
  &__title {
  }
  &__author {
    align-self: center;
  }
  &__synopsis {
    grid-row: 2 / 3;
    grid-column: 1 / 3;
    text-align: left;
  }
  &__link {
    color: white;
  }
}
</style>
