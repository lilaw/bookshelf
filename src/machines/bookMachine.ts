import {
  createMachine,
  assign,
  sendParent,
  spawn,
  ActorRef,
  StateMachine,
} from "xstate";
import type { HttpError, book } from "@/types";
import {
  performListItem,
  performCreateListItem,
  performRemoveListItem,
  perfermUdateListItem,
} from "@/utils/listItems";
import { performBook } from "@/utils/book";
import { dataMachine, DataMachineEvents } from "./dataMachine";

export type BookMachineEvents =
  | { type: "ADD" }
  | { type: "REMOVE" }
  | { type: "FINISH" }
  | { type: "UNFINISH" }
  | { type: "RATE" }
  | { type: "WRITE" };

export interface BookMachineContext {
  message?: string;
  book?: book;
  listItem?: undefined;
  buttons: ActorRef<DataMachineEvents>[];
  star?: ActorRef<DataMachineEvents>;
  note?: ActorRef<DataMachineEvents>;
}

export type BookMachineState = {
  value: any;
  context: BookMachineContext;
};

export function bookMachine({
  book,
  initial = "book",
  bookId,
}: {
  book?: book;
  initial?: string;
  bookId?: string;
}): StateMachine<BookMachineContext, any, BookMachineEvents, BookMachineState> {
  const bookIdv = (bookId || book?.id) as string;

  return createMachine<BookMachineContext, BookMachineEvents, BookMachineState>(
    {
      id: "bookMachine",
      initial: "loadBook",
      context: {
        message: undefined,
        book: book,
        listItem: undefined,
        buttons: [],
        star: undefined,
        note: undefined,
      },
      states: {
        loadBook: {
          initial: initial,
          states: {
            book: {
              invoke: {
                src: "performBook",
                onDone: { target: "listItem", actions: "setBook" },
                onError: { target: "failure", actions: "onError" },
              },
            },
            listItem: {
              invoke: {
                src: "performListItem",
                onDone: {
                  target: "#bookMachine.success.pending",
                  actions: "setListItem",
                },
                onError: { target: "failure", actions: "onError" },
              },
            },
            failure: {},
          },
        },
        success: {
          id: "book",
          initial: "pending",
          states: {
            pending: {
              entry: ["buildButtons", "buildStar", "buildNote"],
              always: [
                { target: "unread", cond: "isUnread" },
                { target: "read", cond: "isRead" },
              ],
            },
            unread: {
              id: "unread",
              on: { ADD: { target: "#read", actions: "setListItem" } },
            },
            read: {
              id: "read",
              on: {
                REMOVE: { target: "#unread", actions: "removeListItem" },
              },
              parallel: true,
              states: {
                duration: {
                  id: "duration",
                  initial: "pending",
                  states: {
                    pending: {
                      always: [
                        { target: "finish", cond: "isFinish" },
                        { target: "unfinish" },
                      ],
                    },
                    finish: {
                      on: {
                        UNFINISH: {
                          target: "#duration.unfinish",
                          actions: "setListItem",
                        },
                      },
                    },
                    unfinish: {
                      on: {
                        FINISH: {
                          target: "#duration.finish",
                          actions: "setListItem",
                        },
                      },
                    },
                  },
                },
                rateStar: {
                  on: {
                    RATE: {
                      target: "rateStar",
                      actions: "setListItem",
                    },
                  },
                },
                note: {
                  on: {
                    WRITE: {
                      target: "note",
                      actions: "setListItem",
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    {
      guards: {
        isUnread(context) {
          return context.listItem === undefined;
        },
        isRead(context) {
          return context.listItem !== undefined;
        },
        isFinish(context, event) {
          return (
            context.listItem !== undefined &&
            typeof context.listItem.finishDate === "number"
          );
        },
      },
      services: {
        performBook(context) {
          return performBook(bookIdv);
        },
        performListItem(context) {
          return performListItem(bookIdv);
        },
      },
      actions: {
        buildNote: assign({
          note: (context) =>
            spawn(
              dataMachine.withConfig({
                services: {
                  performRequest(ctx, event) {
                    return perfermUdateListItem({
                      id: context.listItem.id,
                      notes: event.notes,
                    });
                  },
                },
                actions: {
                  sendParent: sendParent((context, event: any) => ({
                    type: "WRITE",
                    data: event.data,
                  })),
                },
              }),
              "note"
            ),
        }),
        buildStar: assign({
          star: (context) =>
            spawn(
              dataMachine.withConfig({
                services: {
                  performRequest(ctx, event) {
                    return perfermUdateListItem(event.data);
                  },
                },
                actions: {
                  sendParent: sendParent((context, event: any) => ({
                    type: "RATE",
                    data: event.data,
                  })),
                },
              }),
              "star"
            ),
        }),
        buildButtons: assign({
          buttons: (context) => {
            return [
              //add:
              spawn(
                dataMachine.withConfig({
                  services: {
                    performRequest(ctx, event) {
                      return performCreateListItem(bookIdv);
                    },
                  },
                  actions: {
                    sendParent: sendParent((context, event: any) => ({
                      type: "ADD",
                      data: event.data,
                    })),
                  },
                }),
                "addBtn"
              ),

              //remove:
              spawn(
                dataMachine.withConfig({
                  services: {
                    performRequest(ctx, event) {
                      return performRemoveListItem(context.listItem.id);
                    },
                  },
                  actions: {
                    sendParent: sendParent("REMOVE"),
                  },
                }),
                "removeBtn"
              ),
              // finish:
              spawn(
                dataMachine.withConfig({
                  services: {
                    performRequest(ctx, event) {
                      console.log("finish");
                      return perfermUdateListItem({
                        id: context.listItem.id,
                        finishDate: null,
                      });
                    },
                  },
                  actions: {
                    sendParent: sendParent((context, event: any) => ({
                      type: "FINISH",
                      data: event.data,
                    })),
                  },
                }),
                "finishBtn"
              ),
              // unfinish
              spawn(
                dataMachine.withConfig({
                  services: {
                    performRequest(ctx, event) {
                      console.log("finish");
                      return perfermUdateListItem({
                        id: context.listItem.id,
                        finishDate: Date.now(),
                      });
                    },
                  },
                  actions: {
                    sendParent: sendParent((context, event: any) => ({
                      type: "UNFINISH",
                      data: event.data,
                    })),
                  },
                }),
                "unfinishBtn"
              ),
            ];
          },
        }),
        setBook: assign({
          book: (context, event: any) => {
            return event.data;
          },
        }),
        setListItem: assign({
          listItem: (context, event: any) => {
            return event.data;
          },
        }),
        removeListItem: assign({
          listItem: (context, event: any) => {
            return undefined;
          },
        }),
        onError: assign({
          message: (context, event: any) => {
            return event.data.message;
          },
        }),
        clearError: assign({
          message: (context, event: any) => {
            return undefined;
          },
        }),
      },
    }
  );
}
