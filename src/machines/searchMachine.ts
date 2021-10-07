/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any */
import { createMachine, assign, spawn } from "xstate";
import type { book } from "@/types";
import { bookSearch } from "@/utils/book";
import { bookMachine } from "./bookMachine";
import type { BookMachineActor } from "@/machines/bookMachine";

export type SearchMachineEvents =
  | { type: "SEARCH" }
  | { type: "FAILURE"; message: string }
  | { type: "SUCCESS"; books: book[] }
  | { type: "UPDATE-QUERY"; query: string };

export interface SearchMachineContext {
  message?: string;
  books?: book[];
  query: string;
  booksRef: BookMachineActor[];
}

export type SearchMachineState =
  | {
      value: "idle";
      context: SearchMachineContext & { books: book[]; query: "" };
    }
  | {
      value: "searching";
      context: SearchMachineContext;
    }
  | {
      value: "success";
      context: SearchMachineContext;
    }
  | {
      value: "failure";
      context: SearchMachineContext & { message: string };
    };
export const searchMachine = createMachine<
  SearchMachineContext,
  SearchMachineEvents,
  SearchMachineState
>(
  {
    id: "SearchMachine",
    context: {
      books: undefined,
      message: undefined,
      booksRef: [],
      query: "",
    },
    initial: "searching",
    states: {
      idle: {
        on: {
          SEARCH: "searching",
        },
        invoke: {
          id: "searchBooks",
          src: "searchBooks",
          onDone: {
            target: "success",
            actions: "setBooks",
          },
          onError: {
            target: "failure",
            actions: "onError",
          },
        },
      },
      searching: {
        invoke: {
          id: "searchBooks",
          src: "searchBooks",
          onDone: {
            target: "success",
            actions: "setBooks",
          },
          onError: {
            target: "failure",
            actions: "onError",
          },
        },
      },
      success: {
        on: {
          SEARCH: "searching",
        },
      },
      failure: {
        on: {
          SEARCH: "searching",
        },
      },
    },
    on: {
      "UPDATE-QUERY": {
        actions: "updateQuery",
      },
    },
  },
  {
    services: {
      searchBooks(context, event) {
        return bookSearch(context.query);
      },
    },
    actions: {
      setBooks: assign({
        books: (context, event: any) => {
          return event.data;
        },
        booksRef: (context, event: any) => {
          const booksRef = event.data.map((book: book) =>
            spawn(bookMachine({ book }), book.id)
          );
          return booksRef;
        },
      }),
      onError: assign({
        message: (context, event: any) => {
          return event.data.message;
        },
      }),
      updateQuery: assign({
        query: (context, event: any) => {
          return event.query;
        },
      }),
    },
  }
);
