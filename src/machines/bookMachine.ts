/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any */
import {
  assign,
  sendParent,
  spawn,
  ContextFrom,
  EventFrom,
  Interpreter,
  StateMachine,
} from "xstate";
import { createModel } from "xstate/lib/model";
import type { book, item } from "@/types";
import {
  performListItem,
  performCreateListItem,
  performRemoveListItem,
  perfermUdateListItem,
} from "@/utils/listItems";
import { performBook } from "@/utils/book";
import { DataMachineActor, dataMachine } from "./dataMachine";

export type BookMachineState =
  | {
      value: "loadBook";
      context: BookMachineContext;
    }
  | {
      value: "loadBook.book";
      context: BookMachineContext;
    }
  | {
      value: "loadBook.listItem";
      context: BookMachineContext;
    }
  | {
      value: "loadBook.failure";
      context: BookMachineContext;
    }
  | {
      value:
        | "success"
        | "success.pending"
        | "success.unread"
        | "success.read"
        | "success.read.duration.unfinish"
        | "success.read.duration.finish";
      context: BookMachineContext;
    };

const bookModel = createModel(
  {
    message: undefined,
    book: undefined as undefined | book,
    listItem: undefined as undefined | item,
    buttons: [] as DataMachineActor[],
    star: undefined as undefined | DataMachineActor,
    note: undefined as undefined | DataMachineActor,
  },
  {
    events: {
      ADD: (data: item) => ({ data }),
      REMOVE: () => ({}),
      FINISH: (data: item) => ({ data }),
      UNFINISH: (data: item) => ({ data }),
      RATE: (data: item) => ({ data }),
      WRITE: (data: item) => ({ data }),
    },
  }
);
type BookMachineContext = ContextFrom<typeof bookModel>;
type BookMachineEvents = EventFrom<typeof bookModel>;
export type BookMachineActor = Interpreter<
  BookMachineContext,
  any,
  BookMachineEvents,
  BookMachineState
>;
export type BookState = BookMachineActor["state"];

export function bookMachine({
  book,
  item,
  bookId,
}: {
  book?: book;
  item?: item;
  bookId?: string;
}): StateMachine<BookMachineContext, any, BookMachineEvents, BookMachineState> {
  const bookIdv = (bookId || book?.id) as string;
  const initial = book && item ? "success" : "loadBook";
  const loadBookInitial = book ? "listItem" : "book";

  return bookModel.createMachine(
    {
      id: "bookMachine",
      initial: initial,
      context: {
        message: undefined,
        book: book,
        listItem: item,
        buttons: [],
        star: undefined,
        note: undefined,
      },
      states: {
        loadBook: {
          initial: loadBookInitial,
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
              entry: ["buildAddButtons", "buildStar", "buildNote"],
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
              entry: ["buildRemoveFinishUnfinishButtons"],
              id: "read",
              on: {
                REMOVE: { target: "#unread", actions: "removeListItem" },
              },
              type: "parallel",
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
        isFinish(context) {
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
                      // @ts-expect-error: no problem
                      id: context.listItem.id,
                      notes: event.data.notes,
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
        buildAddButtons: assign({
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
            ];
          },
        }),
        buildRemoveFinishUnfinishButtons: assign({
          buttons: (context) => {
            return [
              ...context.buttons,

              //remove:
              spawn(
                dataMachine.withConfig({
                  services: {
                    performRequest(ctx, event) {
                      debugger;
                      // @ts-expect-error: no problem
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
                      return perfermUdateListItem({
                        // @ts-expect-error: no problem
                        id: context.listItem.id,
                        finishDate: Date.now(),
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
                        // @ts-expect-error: no problem
                        id: context.listItem.id,
                        finishDate: null,
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
