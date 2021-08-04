<template>
  <div class="rate">
    <template v-for="i in numberOfStar" :key="i">
      <input
        type="radio"
        :id="`${listItem.bookId}-${i}`"
        class="rate__radio"
        name="rate"
        aria-label="star"
        @change.prevent="rateBook({ id: listItem.id, rating: i })"
        :checked="listItem.rating === i"
      />
      <label :for="`${listItem.bookId}-${i}`" class="rate__label">
        <i
          :class="{
            'el-icon-star-on': true,
            // eslint-disable-next-line
            rate__icon: true,
            'rate__icon--unrate': !isRating,
            'rate__icon--rated': isRating,
          }"
        ></i>
      </label>
      <p v-if="isError">there are a error: {{ error.message }}</p>
    </template>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from "vue";
import { useActor } from "@xstate/vue";
import { DataMachineEvents } from "@/machines/dataMachine";
import type { ActorRef } from "xstate";
import type { item } from "@/types";

export default defineComponent({
  props: {
    starRef: {
      type: Object as PropType<ActorRef<DataMachineEvents>>,
      required: true,
    },
    listItem: {
      type: Object as PropType<item>,
      required: true,
    },
  },
  setup(props) {
    const numberOfStar = 5;
    const { state: starState, send: sendStar } = useActor(props.starRef);
    const isRating = computed(() =>
      props.listItem.rating == -1 ? false : true
    );
    const { isError, error } = {
      isError: computed(() => starState.value.matches("failure")),
      error: computed(() => starState.value.context?.message),
    };
    const rateBook = (data: { id: string; rating: number }) =>
      sendStar({ type: "CLICK", data });

    return { numberOfStar, isRating, rateBook, isError, error };
  },
});
</script>

<style lang="scss" scoped>
.rate {
  position: relative;
  display: inline-block;
}
.rate__radio {
  position: absolute;
  width: 0;
  height: 0;
  overflow: hidden;
}
.rate__radio:checked ~ .rate__label > .rate__icon {
  color: whitesmoke;
}
.rate__radio:checked + .rate__label > .rate__icon {
  color: orange;
}
.rate:hover .rate__label .rate__icon {
  color: orange;
}
.rate__radio:hover ~ .rate__label > .rate__icon {
  color: whitesmoke;
}
.rate__radio:hover + .rate__label > .rate__icon {
  color: orange;
}

.rate__icon {
  font-size: 1.7rem;
  cursor: pointer;
}
.rate__icon--unrate {
  color: whitesmoke;
}
.rate__icon--rated {
  color: orange;
}
</style>
