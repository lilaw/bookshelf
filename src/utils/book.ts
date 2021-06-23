import { useClient } from "@/context/authProvider";
import { useQuery, useQueryClient } from "vue-query";
import { Ref } from "vue";
import bookPlaceholderSvg from "@/assets/book-placeholder.svg";


const loadingBook = {
  title: "Loading...",
  author: "loading...",
  coverImageUrl: bookPlaceholderSvg,
  publisher: "Loading Publishing",
  synopsis: "Loading...",
  loadingBook: true,
};
const loadingBooks = Array.from({ length: 7 }).map(function makeBook(v, i) {
  return { ...loadingBook, id: `loadingbook-${i}` };
});

function useBook(bookId: string): Ref<typeof loadingBook> {
  const client = useClient();

  const { data } = useQuery(
    ["book", { bookId }],
    () => client(`books/${bookId}`).then((data) => data.book),
    { initialData: loadingBook}
  );
  return data;
}

const bookSearchFunction = function bookSearchFunction(query: string) {
  const client = useClient();
  return () =>
    client(`books?query=${encodeURIComponent(query)}`).then(
      (data) => data.books
    );
};

function discoverBookSearch(query: string) {
  const result = useQuery({
    queryKey: "bookSearch",
    queryFn: bookSearchFunction(query),
    initialData: loadingBooks,
  });
  return result;
}

function refetchBookSearch(): void {
  const queryClient = useQueryClient()
  queryClient.removeQueries("bookSearch", { exact: true });
  queryClient.prefetchQuery("bookSearch", bookSearchFunction(""));
}

export { useBook, discoverBookSearch, refetchBookSearch };
