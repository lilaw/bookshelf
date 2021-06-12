const apiURL = "https://bookshelf.jk/api";


type config = {
  data?: string;
  token?: string;
  headers?: string;
};
function client(
  endpoint: string,
  { data, token, headers: customHeaders, ...customConfig }: config = {}
) {
  const config = {
    method: "GET",
    headers: {
      customHeaders,
    },
    ...customConfig,
  };
  console.log({ data, token });

  return window
    .fetch(`${apiURL}/${endpoint}`, config as RequestInit)
    .then((res) => res.json());
}

export { client };
