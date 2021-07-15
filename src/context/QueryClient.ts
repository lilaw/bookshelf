import { QueryClient, VUE_QUERY_CLIENT } from "vue-query";
import { provide, onUnmounted } from "vue";

const queryClient = new QueryClient();

function useQueryProvider(): void {
  queryClient.setDefaultOptions({
    queries: {
      refetchOnWindowFocus: false,
      retry(failureCount: number, error: any) {
        if (
          typeof error === "object" &&
          error !== null &&
          typeof error.status === "number"
        ) {
          return error.status >= 500 ? true : false;
        } else if (failureCount < 2) return true;
        return false;
      },
    },
    mutations: {
      onError(err, variables, recover) {
        typeof recover === "function" ? recover() : null;
      },
      onSettled: () => queryClient.invalidateQueries("list-items"),
    },
  });

  queryClient.mount();
  provide(VUE_QUERY_CLIENT, queryClient);

  onUnmounted(() => {
    queryClient.unmount();
  });
}

export { useQueryProvider, queryClient };
