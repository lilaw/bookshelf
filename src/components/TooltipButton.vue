<template>
  <div class="tooltip">
    <button class="button">
      <i class="el-icon-circle-plus"></i>
    </button>


  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  setup () {


    return {}
  }
})
</script>

<style lang="scss" scoped>
.tooltip {
  display: flex;
  align-items: center;
}

.button {
  border: white solid .1em;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  margin-left: -15px;
  cursor: pointer;

}

</style>