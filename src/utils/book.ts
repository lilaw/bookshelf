/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { useClient } from "@/utils/client";
import { useQuery, useQueryClient } from "vue-query";
import { isBookData, isBooksData } from "@/type-guards";
import { areYouABadBody } from "@/utils/client";
import type { HttpError, book } from "@/types";
import type { Ref } from "vue";
import {queryClient} from "@/context/QueryClient"


function useBook(bookId: string) {
  const client = useClient();

  const data = useQuery<book, HttpError>(
    ["book", { bookId }],
    () =>
      client(`books/${bookId}`)
        .then(areYouABadBody(isBookData))
        .then((data) => data.book),
    // { initialData: loadingBook }
  );
  return data;
}
export function performBook(bookId: string) {
  const client = useClient();

  const data = queryClient.fetchQuery<book, HttpError>(
    ["book", { bookId }],
    () =>
      client(`books/${bookId}`)
        .then(areYouABadBody(isBookData))
        .then((data) => data.book),
    // { initialData: loadingBook }
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

function bookSearch(query: string) {
  const result = queryClient.fetchQuery<book[], HttpError>({
    queryKey: "bookSearchh",
    queryFn: bookSearchFunction(query),
  });
  return result;
}
// update cache. remove the book in read list
function refetchBookSearch(): void {
  const queryClient = useQueryClient();
  queryClient.removeQueries("bookSearch", { exact: true });
  queryClient.prefetchQuery("bookSearch", bookSearchFunction(""));
}

export { useBook, bookSearch, refetchBookSearch };
