<template>
  <div class="tooltip">
    <tooltip-button
      class="button"
      icon="el-icon-close"
      label="Remove from list"
      :state="remove"
      :clickHandler="() => remove.mutate({ id: item.id })"
      v-if="item"
    />
    <tooltip-button
      class="button"
      icon="el-icon-circle-plus"
      label="Add to list"
      :state="create"
      :clickHandler="() => create.mutate({ bookId: bookId })"
      v-else
    />
    <div class="update" v-if="item">
      <tooltip-button
        class="button"
        icon="el-icon-notebook-1"
        label="Mark as unread"
        :state="update"
        :clickHandler="() => update.mutate({ id: item.id, finishDate: null })"
        v-if="item.finishDate"
      >
      </tooltip-button>
      <tooltip-button
        class="button"
        icon="el-icon-check"
        label="MarK as read"
        :state="update"
        :clickHandler="
          () => update.mutate({ id: item.id, finishDate: Date.now() })
        "
        v-else
      >
      </tooltip-button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import TooltipButton from "@/components/TooltipButton.vue";
import {
  useListItem,
  useUdateListItem,
  useCreateListItem,
  useRemoveListItem,
} from "@/utils/listItems";

export default defineComponent({
  props: {
    bookId: { type: String, required: true },
  },
  setup(props) {
    const item = useListItem(props.bookId);

    const update = useUdateListItem();
    const create = useCreateListItem();
    const remove = useRemoveListItem();

    return {
      item,
      update,
      create,
      remove,
    };
  },
  components: {
    TooltipButton,
  },
});
</script>

<style scoped>
.tooltip {
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
  margin-left: -15px;
  height: 100%;

}
.button {
}
</style>
