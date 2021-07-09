import { logout } from "@/utils/auth-provider";
import { isErrorInfoData } from "@/type-guards";

const apiURL = "https://bookshelf.jk/api";

type config = {
  data?: { [k in string]: string | number | null | undefined };
  token?: string;
  headers?: Record<string, string | undefined>;
  method?: "GET" | "DELETE" | "PUT" | "POST";
};

function client(
  endpoint: string,
  { data, token, headers: customHeaders, method, ...customConfig }: config = {}
): Promise<unknown> {
  const config = {
    method: data ? "POST" : "GET",
    headers: {
      Authorization: token ? `Bearer ${token}` : undefined,
      "Content-Type": data ? "application/json" : undefined,
      ...customHeaders,
    },
    body: data ? JSON.stringify(data) : undefined,
    ...customConfig,
  };
  return window
    .fetch(`${apiURL}/${endpoint}`, config as RequestInit)
    .then(unauthorized)
    .then(responseAndJSON)
    .then(areYouABadStatus);

  function unauthorized(res: Response) {
    if (res.status === 401) {
      logout().then(() => window.location.assign(window.location.toString()));
      return Promise.reject({
        type: "BadStatus",
        message: "your session has expired. Please re-authenticate",
        code: 401,
      });
    }
    return res;
  }
  async function responseAndJSON(response: Response) {
    const json = await response.json();
    return { response, json };
  }
}

function areYouABadStatus(data: { response: Response; json: unknown }) {
  if (data.response.ok) {
    return data.json;
  } else {
    return Promise.reject({
      type: "BadStatus",
      code: data.response.status,
      message: isErrorInfoData(data.json)
        ? data.json.message
        : `there are some error: \n ${JSON.stringify(data.json, null, 2)}`,
    });
  }
}

// eslint-disable-next-line
function areYouABadBody<T>(check: (x: any) => x is T) {
  return function areYouABadBodyWithCheck(json: unknown): T | Promise<never> {
    if (check(json)) return json;
    return Promise.reject({
      type: "BadBody",
      message: `this http body did't match type of ${check.name}. 
       ${JSON.stringify(json, null, 2)}`,
    });
  };
}

export { client, config, areYouABadBody };
