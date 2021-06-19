<template>
  <section class="book">
    <a href="" class="book__link">
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
    </a>
    <TooltipStatus :bookId="book.id" />
  </section>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import TooltipStatus from "@/components/TooltipStatus.vue";
import { book } from "@/utils/listItems";


export default defineComponent({
  props: {
    book: Object as PropType<book>,
  },
  setup(props) {
    return {};
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
