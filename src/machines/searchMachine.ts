import { createMachine, assign, interpret, State } from "xstate";
import type { HttpError, book } from "@/types";
import bookPlaceholderSvg from "@/assets/book-placeholder.svg";
import { queryClient } from "@/context/QueryClient";
import { bookSearch } from "@/utils/book";

export type SearchjMachineEvents =
  | { type: "SEARCH" }
  | { type: "FAILURE"; message: string }
  | { type: "SUCCESS"; books: book[] }
  | { type: "UPDATE-QUERY"; query: string };

export interface SearchMachineContext {
  message?: string;
  books?: book[];
  query: string;
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
  SearchjMachineEvents,
  SearchMachineState
>(
  {
    id: "SearchMachine",
    context: {
      books: undefined,
      message: undefined,
      query: "",
    },
    initial: "idle",
    states: {
      idle: {
        entry: ["setDefaultBooks"],
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
        console.log(7777777777);
        return bookSearch(context.query);
      },
    },
    actions: {
      setDefaultBooks: assign({
        books: (context) => {
          const loadingBook = {
            title: "Loading...",
            author: "loading...",
            coverImageUrl: bookPlaceholderSvg,
            publisher: "Loading Publishing",
            synopsis: "Loading...",
            id: "loading...",
            pageCount: -1,
          };
          const loadingBooks = Array.from({ length: 7 }).map(function makeBook(
            v,
            i
          ) {
            return { ...loadingBook, id: `loadingbook-${i}` };
          });
          return loadingBooks;
        },
      }),
      setBooks: assign({
        books: (context, event: any) => {
          console.log({ context, event });
          return event.data;
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
