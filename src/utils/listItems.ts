/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { useMutation, useQuery, useQueryClient } from "vue-query";
import { useClient } from "@/context";
import { config } from "@/utils/client";
import { computed, ComputedRef, Ref } from "vue";
import type { item, HttpError } from "@/types";
import { isListItemsData, isItemData } from "@/type-guards";
import { areYouABadBody } from "@/utils/client";

type updateItemPayload = {
  id: string;
  finishDate?: number | null;
  rating?: number;
  notes?: string;
};

type createItemPayload = { bookId: string };
type removeItmPayload = { id: string };

function useListItems(): Ref<item[]> | Ref<undefined> {
  const client = useClient();

  const { data: listItems } = useQuery<item[], HttpError>(
    "list-items",
    () =>
      client("list-items")
        .then(areYouABadBody(isListItemsData))
        .then((data) => data.listItems),
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

  return useMutation<item, HttpError, createItemPayload>(
    ({ bookId }: createItemPayload) => {
      return client("list-items", {
        data: { bookId },
        method: "POST",
      })
        .then(areYouABadBody(isItemData))
        .then((data) => data.listItem);
    },
    { onSettled: () => queryClient.invalidateQueries("list-items") }
  );
}

function useRemoveListItem() {
  const client = useClient();
  const queryClient = useQueryClient();
  const remove = ({ id }: removeItmPayload) =>
    client(`list-items/${id}`, { method: "DELETE" });
  // remove  return this type form serve. I don't think I will use it.
  // type removeSuccessful = { success: true };

  return useMutation<unknown, HttpError, removeItmPayload>(remove, {
    onSettled: () => queryClient.invalidateQueries("list-items"),
  });
}

function useUdateListItem(config?: config) {
  const client = useClient();
  const queryClient = useQueryClient();
  function perform(payload: updateItemPayload): Promise<item> {
    return client(`list-items/${payload.id}`, {
      data: payload,
      method: "PUT",
      ...config,
    })
      .then(areYouABadBody(isItemData))
      .then((data) => data.listItem);
  }
  function optimisticUpdate(payload: updateItemPayload): unknown {
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
    return oldvalue;
  }

  // just rollback whaterver previous cached value, I don't care what type you are. you are unknow. (this unknow probability is undefined or item. not sure)
  return useMutation<item, HttpError, updateItemPayload, unknown>(perform, {
    onSettled: () => queryClient.invalidateQueries("list-items"),
    onMutate: optimisticUpdate,
    onError: (err, payload, oldvalue) => {
      queryClient.setQueryData("list-items", oldvalue);
    },
  });
}

export {
  useListItem,
  useListItems,
  useCreateListItem,
  useRemoveListItem,
  useUdateListItem,
};
