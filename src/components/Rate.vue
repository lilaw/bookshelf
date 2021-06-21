<template>
  <div class="rate">
    <template v-for="i in numberOfStar" :key="i">
      <input type="radio" :id="`${id}-${i}`" class="rate__radio" name="rate" />
      <label :for="`${id}-${i}`" class="rate__label">
        <i
          :class="{
            'el-icon-star-on': true,
            // eslint-disable-next-line
            'rate__icon': true,
            'rate__icon--unrate': !rating,
            'rate__icon--rated': rating,
          }"
        ></i>
      </label>
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  setup() {
    const id = "1212";
    const numberOfStar = 5;
    const rating = false;

    return { id, numberOfStar, rating };
  },
});
</script>

<style lang="scss" scoped>
.rate {
  position: relative;
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
