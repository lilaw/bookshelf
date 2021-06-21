import { useClient } from "@/context/authProvider";
import { useQuery } from "vue-query";
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

function useBook(bookId: string): Ref<typeof loadingBook> {
  const client = useClient();

  const { data } = useQuery(
    ["book", { bookId }],
    () => client(`books/${bookId}`).then((data) => data.book),
    { initialData: loadingBook, refetchOnWindowFocus: false }
  );
  return data;
}

export { useBook };
