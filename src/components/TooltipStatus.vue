<template>
  <div class="tooltip">
    <tooltip-button
      class="button"
      icon="el-icon-close"
      label="Remove from list"
      :state="btn.btnState.removeState"
      :clickHandler="btn.evtFun.remove"
      v-if="showRemoveBtn"
    />
    <tooltip-button
      class="button"
      icon="el-icon-circle-plus"
      label="Add to list"
      :state="btn.btnState.createState"
      :clickHandler="btn.evtFun.create"
      v-if="showAddBtn"
    />
    <tooltip-button
      class="button"
      icon="el-icon-notebook-1"
      label="Mark as unfinish"
      :state="btn.btnState.unfinishState"
      :clickHandler="btn.evtFun.unfinish"
      v-if="showUnfinBtn"
    >
    </tooltip-button>
    <tooltip-button
      class="button"
      icon="el-icon-check"
      label="MarK as finish"
      :state="btn.btnState.finishState"
      :clickHandler="btn.evtFun.finish"
      v-if="showFinBtn"
    />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from "vue";
import TooltipButton from "@/components/TooltipButton.vue";
import { useActor } from "@xstate/vue";
import { DataMachineActor } from "@/machines/dataMachine";

export default defineComponent({
  props: {
    buttonsRef: {
      type: Object as PropType<DataMachineActor[]>,
      required: true,
    },
    bookState: {
      type: Object as any,
      require: true,
    },
  },
  setup(props) {
    const btn = computed(function btnState() {
      const buttons = props.buttonsRef.map((ref) => useActor(ref));
      const [createState, removeState, finishState, unfinishState] =
        buttons.map((btn) => ({
          isLoading: computed(() => btn.state.value.matches("loading")),
          isError: computed(() => btn.state.value.matches("failure")),
          error: computed(() => btn.state.value.context?.message),
        }));

      const [create, remove, finish, unfinish] = buttons.map(
        (btn) => () => btn.send({ type: "CLICK" })
      );
      return {
        btnState: { createState, removeState, finishState, unfinishState },
        evtFun: { create, remove, finish, unfinish },
      };
    });

    // when to show
    // const showBtns = computed(() => props.bookState.matches("success"));
    const showAddBtn = computed(() =>
      props.bookState.matches("success.unread")
    );
    const showRemoveBtn = computed(() =>
      props.bookState.matches("success.read")
    );
    const showFinBtn = computed(() =>
      props.bookState.matches("success.read.duration.unfinish")
    );
    const showUnfinBtn = computed(() =>
      props.bookState.matches("success.read.duration.finish")
    );
    return {
      showAddBtn,
      showRemoveBtn,
      showFinBtn,
      showUnfinBtn,
      btn,
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
