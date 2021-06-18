import { useMutation, useQuery } from "vue-query";
import { useClient } from "@/context/authProvider";
import { config } from "@/utils/client";
import { computed, ComputedRef, Ref, ref, watch } from "vue";

type book = {
  [K in
    | "title"
    | "author"
    | "coverImageUrl"
    | "id"
    | "publisher"
    | "synopsis"]: number;
} & {
  pageCount: number;
};

type item = {
  book: book;
  bookId: string;
  finishDate: null | number;
  id: string;
  notes: string;
  ownerId: string;
  rating: number;
  startDate: number;
};

function useListItems(): Ref<item[]> | Ref<undefined> {
  const client = useClient();

  const { data: listItems } = useQuery<item[]>(
    "list-items",
    () => client("list-items").then((data) => data.listItems),
    {
      initialData: [],
    }
  );
  return listItems;
}

function useListItem(bookId: string): ComputedRef<item | null> {
  const listItems = useListItems();
  const item = computed(
    () => listItems.value?.find((book) => book.bookId === bookId) ?? null
  );

  return item;
}

function useCreateListItem(config: config) {
  const client = useClient();

  return useMutation(({ bookId }: { bookId: string }) =>
    client("list-items", { data: { bookId }, ...config })
  );
}

function useRemoveListItem(config: config) {
  const client = useClient();

  return useMutation(({ id }: { id: string }) =>
    client(`list-items/${id}`, config)
  );
}

function useUdateListItem(config: config) {
  const client = useClient();

  return useMutation((payload: { id: string; finishDate: number }) =>
    client(`list-item/${payload.id}`, { data: payload, ...config })
  );
}

export {
  useListItem,
  useListItems,
  useCreateListItem,
  useRemoveListItem,
  useUdateListItem,
  book,
};
