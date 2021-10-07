/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any */
import { dataMachine } from "./dataMachine";
import type { ActorRef } from "xstate";
import { assign, spawn } from "xstate";
import { performListItems } from "@/utils/listItems";
import { bookMachine } from "./bookMachine";
import type { item } from "@/types";

export const listMachine = dataMachine.withConfig({
  services: {
    performRequest() {
      return performListItems();
    },
  },
  actions: {
    onDone: assign({
      result: (ctx, event: any) => {
        return event.data.map((item: item) =>
          spawn(bookMachine({ book: item.book, item }))
        );
      },
    }),
  },
});
