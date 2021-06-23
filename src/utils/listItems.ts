import { useMutation, useQuery, useQueryClient } from "vue-query";
import { useClient } from "@/context/authProvider";
import { config } from "@/utils/client";
import { computed, ComputedRef, Ref } from "vue";
import type { UseMutationOptions } from "react-query/types";

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

type payload = {
  id: string;
  finishDate?: number | null;
  rating?: number;
  notes?: string;
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

function useCreateListItem() {
  const client = useClient();
  const queryClient = useQueryClient();

  return useMutation(
    ({ bookId }: { bookId: string }) => {
      return client("list-items", {
        data: { bookId },
        method: "POST",
      });
    },
    { onSettled: () => queryClient.invalidateQueries("list-items") }
  );
}

function useRemoveListItem(config?: config) {
  const client = useClient();
  const queryClient = useQueryClient();
  const remove = ({ id }: { id: string }) =>
    client(`list-items/${id}`, { method: "DELETE", ...config });

  return useMutation(remove, {
    onSettled: () => queryClient.invalidateQueries("list-items"),
  });
}

function useUdateListItem(config?: config) {
  const client = useClient();
  const queryClient = useQueryClient();
  function perform(payload: payload) {
    return client(`list-items/${payload.id}`, {
      data: payload,
      method: "PUT",
      ...config,
    });
  }
  function optimisticUpdate(payload: payload) {
    const oldvalue = queryClient.getQueryData("list-items");

    queryClient.setQueryData<item[]>(
      "list-items",
      function updateCache(listItems: item[] | undefined) {
        if (typeof listItems === "undefined") return [];
        return listItems.map((item) =>
          item.id === payload.id ? { ...item, ...payload } : item
        );
      }
    );

    return () => queryClient.setQueryData("list-items", oldvalue);
  }

  return useMutation(perform, {
    onSettled: () => queryClient.invalidateQueries("list-items"),
    onMutate: optimisticUpdate,
  });
}

export {
  useListItem,
  useListItems,
  useCreateListItem,
  useRemoveListItem,
  useUdateListItem,
  book,
  item,
};
