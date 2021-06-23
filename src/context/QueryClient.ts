import { QueryClient, VUE_QUERY_CLIENT } from "vue-query";
import { provide, onUnmounted } from "vue";
// import type { QueryClient, TError } from "react-query/types";

function useQueryProvider(): void {
  const queryClient = new QueryClient();

  queryClient.setDefaultOptions({
    queries: {
      refetchOnWindowFocus: false,
      // retry(failureCount: number, error) {
      //   if (error.status === 404) return false;
      //   else if (failureCount < 2) return true;
      //   else return false;
      // },
    },
    mutations: {
      onError: (err, variables, recover) =>
        typeof recover === "function" ? recover() : null,
      onSettled: () => queryClient.invalidateQueries("list-items"),
    },
  });

  queryClient.mount();
  provide(VUE_QUERY_CLIENT, queryClient);

  onUnmounted(() => {
    queryClient.unmount();
  });
}

export { useQueryProvider };
