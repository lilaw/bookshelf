/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { useClient } from "@/context/authProvider";
import { useQuery, useQueryClient } from "vue-query";
import { Ref } from "vue";
import bookPlaceholderSvg from "@/assets/book-placeholder.svg";
import { isBookData, isBooksData } from "@/type-guards";
import { areYouABadBody } from "@/utils/client";
import type { HttpError, book } from "@/types";

const loadingBook = {
  title: "Loading...",
  author: "loading...",
  coverImageUrl: bookPlaceholderSvg,
  publisher: "Loading Publishing",
  synopsis: "Loading...",
  id: "loading...",
  pageCount: -1,
};
const loadingBooks = Array.from({ length: 7 }).map(function makeBook(v, i) {
  return { ...loadingBook, id: `loadingbook-${i}` };
});

function useBook(bookId: string) {
  const client = useClient();

  const data = useQuery<book, HttpError>(
    ["book", { bookId }],
    () =>
      client(`books/${bookId}`)
        .then(areYouABadBody(isBookData))
        .then((data) => data.book),
    { initialData: loadingBook }
  );
  return data;
}

const bookSearchFunction = function bookSearchFunction(query: string) {
  const client = useClient();
  return () =>
    client(`books?query=${encodeURIComponent(query)}`)
      .then(areYouABadBody(isBooksData))
      .then((data) => data.books);
};

function discoverBookSearch(query: string) {
  const result = useQuery<book[], HttpError>({
    queryKey: "bookSearch",
    queryFn: bookSearchFunction(query),
    initialData: loadingBooks,
  });
  return result;
}

function refetchBookSearch(): void {
  const queryClient = useQueryClient();
  queryClient.removeQueries("bookSearch", { exact: true });
  queryClient.prefetchQuery("bookSearch", bookSearchFunction(""));
}

export { useBook, discoverBookSearch, refetchBookSearch };
