import {
  createMachine,
  assign,
  sendParent,
  spawn,
  ActorRef,
  Actor,
  Interpreter,
} from "xstate";

export type DataMachineEvents = { type: "CLICK" } & Record<string, any>;

export interface DataMachineContext {
  message?: string;
  listItem?: undefined;
}

export const dataMachine = createMachine<DataMachineContext, DataMachineEvents>(
  {
    id: "buttonMachine",
    context: {
      message: undefined,
      listItem: undefined,
    },
    initial: "idle",
    states: {
      idle: {
        on: { CLICK: "loading" },
      },
      loading: {
        invoke: {
          src: "performRequest",
          onDone: { target: "success", actions: "doneAction" },
          onError: { target: "failure", actions: "onError" },
        },
      },
      failure: {
        on: { CLICK: "loading" },
        onExit: "clearError",
      },
      success: {
        on: { CLICK: "loading" },
        entry: "sendParent",
      },
    },
  },
  {
    actions: {
      onError: assign({
        message: (context, event: any) => {
          return event.data.message;
        },
      }),
    },
  }
);
