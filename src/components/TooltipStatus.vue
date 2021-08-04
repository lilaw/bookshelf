<template>
  <div class="tooltip" v-if="showBtns">
    <tooltip-button
      class="button"
      icon="el-icon-close"
      label="Remove from list"
      :state="removeState"
      :clickHandler="remove"
      v-if="showRemoveBtn"
    />
    <tooltip-button
      class="button"
      icon="el-icon-circle-plus"
      label="Add to list"
      :state="createState"
      :clickHandler="create"
      v-if="showAddBtn"
    />
    <tooltip-button
      class="button"
      icon="el-icon-notebook-1"
      label="Mark as unfinish"
      :state="unfinishState"
      :clickHandler="unfinish"
      v-if="showUnfinBtn"
    >
    </tooltip-button>
    <tooltip-button
      class="button"
      icon="el-icon-check"
      label="MarK as finish"
      :state="finishState"
      :clickHandler="finish"
      v-if="showFinBtn"
    />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, watch } from "vue";
import TooltipButton from "@/components/TooltipButton.vue";
import { useActor } from "@xstate/vue";
import type { Interpreter, ActorRef } from "xstate";
import type {
  BookMachineContext,
  BookMachineEvents,
  DataMachineEvents,
} from "@/machines/bookMachine";

export default defineComponent({
  props: {
    bookService: {
      type: Object as PropType<
        Interpreter<BookMachineContext, any, BookMachineEvents>
      >,
      required: true,
    },
  },
  setup(props) {
    const { state: bookState } = useActor(props.bookService);
    const buttonRefs = bookState.value.context
      ?.buttons as ActorRef<DataMachineEvents>[];
    const buttons = buttonRefs.map((ref) => useActor(ref));

    const [createState, removeState, finishState, unfinishState] = buttons.map(
      (btn) => ({
        isLoading: computed(() => btn.state.value.matches("loading")),
        isError: computed(() => btn.state.value.matches("failure")),
        error: computed(() => btn.state.value.context?.message),
      })
    );

    // event function
    // const finish = () => finishBtn.send({ type: "CLICK" });
    const [create, remove, finish, unfinish] = buttons.map(
      (btn) => () => btn.send({ type: "CLICK" })
    );

    // when to show
    const showAddBtn = computed(() =>
      ["success.unread"].some(bookState.value.matches)
    );
    const showRemoveBtn = computed(() =>
      ["success.read"].some(bookState.value.matches)
    );
    const showFinBtn = computed(() =>
      ["success.read.duration.unfinish"].some(bookState.value.matches)
    );
    const showUnfinBtn = computed(() =>
      ["success.read.duration.finish"].some(bookState.value.matches)
    );
    const showBtns = computed(() => bookState.value.matches("success"));
    return {
      showAddBtn,
      showRemoveBtn,
      showFinBtn,
      showUnfinBtn,
      showBtns,
      createState,
      create,
      removeState,
      remove,
      finish,
      finishState,
      unfinish,
      unfinishState,
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
</style>
