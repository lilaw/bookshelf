import { client } from "../client";
import { server, rest } from "@/test/server";

import * as authMock from "../auth-provider.ts";

const apiURL = process.env.VUE_APP_BOOK_APP_API_URL;
const endpoint = "test-endpoint";

test("fetch at the endpoint wiht GET requests", async () => {
  const mockResult = { value: "somevalue" };
  server.use(
    rest.get(`${apiURL}/${endpoint}`, async (req, res, ctx) => {
      return res(ctx.json(mockResult));
    })
  );

  const result = await client(endpoint);
  expect(result).toEqual(mockResult);
});

test("can add auth token", async () => {
  const token = "fake token";
  const mockValue = { value: "somevalue" };
  let request;
  server.use(
    rest.get(`${apiURL}/${endpoint}`, async (req, res, ctx) => {
      request = req;
      return res(ctx.json(mockValue));
    })
  );
  await client(endpoint, { token });
  expect(request.headers.get("authorization")).toBe(`Bearer ${token}`);
});

test("allow config override", async () => {
  let request;
  server.use(
    rest.get(`${apiURL}/${endpoint}`, async (req, res, ctx) => {
      request = req;
      return res(ctx.json({}));
    })
  );

  const config = {
    headers: {
      "Content-Type": "image/svg+xml",
      "Access-Control-Allow-Origin": "*",
    },
  };

  await client(endpoint, config);
  expect(request.headers.get("content-type")).toBe(
    config.headers["Content-Type"]
  );
  expect(request.headers.get("access-control-allow-origin")).toBe(
    config.headers["Access-Control-Allow-Origin"]
  );
});

test("method set to POST if data is provide", async () => {
  let request;
  server.use(
    rest.post(`${apiURL}/${endpoint}`, async (req, res, ctx) => {
      request = req;
      return res(ctx.json({}));
    })
  );
  const mockData = { data: { somekey: "value" } };
  await client(endpoint, mockData);

  expect(request.method).toBe("POST");
});

test("reject wiht badStatus if HTTP code >= 300", async () => {
  const testError = { status: 500, message: "server is under maintenance." };
  server.use(
    rest.get(`${apiURL}/${endpoint}`, async (req, res, ctx) => {
      return res(ctx.status(500), ctx.json(testError));
    })
  );

  const actual = await client(endpoint).catch((c) => c);
  const expectError = { type: "BadStatus", ...testError };

  expect(actual).toEqual(expectError);
});

test("logout user if request return 401", async () => {
  jest.spyOn(authMock, "logout");
  authMock.logout.mockImplementation(() => Promise.resolve());

  const testError = {
    status: 401,
    message: "your session has expired. Please re-authenticate",
  };
  server.use(
    rest.get(`${apiURL}/${endpoint}`, async (req, res, ctx) => {
      return res(ctx.status(401), ctx.json(testError));
    })
  );

  const actual = await client(endpoint).catch((c) => c);
  const expectError = {
    type: "BadStatus",
    message: "your session has expired. Please re-authenticate",
    status: 401,
  };

  expect(actual).toEqual(expectError);
  expect(authMock.logout).toHaveBeenCalledTimes(1);
});
