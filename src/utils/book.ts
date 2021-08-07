/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { useClient } from "@/utils/client";
import { isBookData, isBooksData } from "@/type-guards";
import { areYouABadBody } from "@/utils/client";
import type { HttpError, book } from "@/types";
import { queryClient } from "@/context/QueryClient";

export function performBook(bookId: string) {
  const client = useClient();

  const data = queryClient.fetchQuery<book, HttpError>(
    ["book", { bookId }],
    () =>
      client(`books/${bookId}`)
        .then(areYouABadBody(isBookData))
        .then((data) => data.book)
    // { initialData: loadingBook }
  );
  return data;
}

export const bookSearchFunction = function bookSearchFunction(query: string) {
  const client = useClient();
  return () =>
    client(`books?query=${encodeURIComponent(query)}`)
      .then(areYouABadBody(isBooksData))
      .then((data) => data.books);
};

export function bookSearch(query: string) {
  const result = queryClient.fetchQuery<book[], HttpError>({
    queryKey: "bookSearchh",
    queryFn: bookSearchFunction(query),
  });
  return result;
}
// update cache. remove the book in read list
export function refetchBookSearch(): void {
  queryClient.removeQueries("bookSearch", { exact: true });
  queryClient.prefetchQuery("bookSearch", bookSearchFunction(""));
}
