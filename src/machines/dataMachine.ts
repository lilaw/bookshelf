/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any */
import { createMachine, assign, ActorRefWithDeprecatedState } from "xstate";

export type DataMachineEvents = { type: "CLICK"; data?: any };
export interface DataMachineContext {
  message?: string;
  result: any[];
}

type DataMachineState =
  | {
      value: "idle";
      context: DataMachineContext;
    }
  | {
      value: "loading";
      context: DataMachineContext;
    }
  | {
      value: "failure";
      context: DataMachineContext;
    }
  | {
      value: "success";
      context: DataMachineContext;
    };


export type DataMachineActor = ActorRefWithDeprecatedState<
  DataMachineContext,
  DataMachineEvents,
  DataMachineState
>;
export const dataMachine = createMachine<
  DataMachineContext,
  DataMachineEvents,
  DataMachineState
>(
  {
    id: "dataMachine",
    context: {
      message: undefined,
      result: [],
    },
    initial: "idle",
    states: {
      idle: {
        on: { CLICK: "loading" },
      },
      loading: {
        invoke: {
          src: "performRequest",
          onDone: { target: "success", actions: "onDone" },
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
      // xstate complain about no those functon, those functions are overwritten by function in wichConfig
      onDone: assign({}),
      clearError: assign({}),
      sendParent: assign({}),
    },
  }
);
