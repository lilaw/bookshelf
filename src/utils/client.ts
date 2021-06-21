const apiURL = "https://bookshelf.jk/api";

type config = {
  data?: { [k in string]: string | number | null | undefined };
  token?: string;
  headers?: string;
  method?: "GET" | "DELETE" | "PUT" | "POST";
};
function client(
  endpoint: string,
  { data, token, headers: customHeaders, method, ...customConfig }: config = {}
) {
  const config = {
    method: method ? method : "GET",
    headers: {
      Authorization: token ? `Bearer ${token}` : undefined,
      "Content-Type": data ? "application/json" : undefined,
      customHeaders,
    },
    body: data ? JSON.stringify(data) : undefined,
    ...customConfig,
  };

  return window
    .fetch(`${apiURL}/${endpoint}`, config as RequestInit)
    .then((res) => res.json());
}

export { client, config };
