import { createMachine, assign, interpret, State } from "xstate";
import {
  login as authLogin,
  logout as authLogout,
  register as authRegister,
} from "@/utils/auth-provider";
import { areYouABadBody, areYouABadStatus } from "@/utils/client";
import type { user, form } from "@/types";
import { isUserData } from "@/type-guards";

export type AuthMachineEvents =
  | { type: "LOGIN"; form: form }
  | { type: "LOGOUT" }
  | { type: "SIGNUP"; form: form }
  | { type: "CLEAR" }
  | { type: "RESET"};

export interface AuthMachineContext {
  user?: user;
  message?: string;
}

export type AuthMachineState =
  | {
      value: "unauthorized";
      context: AuthMachineContext & { user: undefined; message: undefined };
    }
  | { value: "signup"; context: AuthMachineContext & { user: undefined } }
  | {
      value: "loading";
      context: AuthMachineContext & { user: undefined; message: undefined };
    }
  | {
      value: "logout";
      context: AuthMachineContext & { user: undefined; message: undefined };
    }
  | {
      value: "authorized";
      context: AuthMachineContext & { user: user; message: undefined };
    };

export const authMachine = createMachine<
  AuthMachineContext,
  AuthMachineEvents,
  AuthMachineState
>(
  {
    id: "authentication",
    initial: "unauthorized",
    context: {
      user: undefined,
      message: undefined,
    },
    states: {
      unauthorized: {
        on: {
          LOGIN: "loading.login",
          SIGNUP: "loading.signup",
        },
      },
      loading: {
        states: {
          login: {
            invoke: {
              id: "preformLogin",
              src: "performLogin",
              onDone: {
                target: "#authentication.authorized",
                actions: "setUserProfile",
              },
              onError: {
                target: "#authentication.unauthorized",
                actions: "onError",
              },
            },
          },
          signup: {
            invoke: {
              id: "performRegister",

              src: "performRegister",
              onDone: {
                target: "#authentication.authorized",
                actions: "setUserProfile",
              },
              onError: {
                target: "#authentication.unauthorized",
                actions: "onError",
              },
            },
          },
        },
      },
      logout: {
        invoke: {
          src: "performLogout",
          onDone: { target: "unauthorized" },
        },
      },
      authorized: {
        on: {
          LOGOUT: "logout",
        },
      },
    },
    on: {
      CLEAR: {
        actions: "clearMessage",
      },
      RESET: "unauthorized"
    },
  },
  {
    services: {
      performLogin(context, event) {
        // @ts-expect-error: skip error
        return authLogin(event.form)
          .then(formatData)
          .catch(formatError)
          .then(areYouABadStatus)
          .then(areYouABadBody(isUserData));
      },
      performRegister(context, event) {
        // @ts-expect-error: skip error
        return authRegister(event.form)
          .then(formatData)
          .catch(formatError)
          .then(areYouABadStatus)
          .then(areYouABadBody(isUserData));
      },
      performLogout() {
        return authLogout();
      },
    },
    actions: {
      setUserProfile: assign({
        user(context, event: any) {
          return event.data;
        },
      }),
      onError: assign({
        message: (context, event: any) => {
          return event.data.message;
        },
      }),
      clearMessage: assign({
        message: (context) => {
          return undefined;
        },
      }),
    },
  }
);

const stateDefinition =
  // @ts-expect-error: localStorage may return null, but || handle it
  JSON.parse(localStorage.getItem("authState")) || authMachine.initialState;

const previousState = State.create(stateDefinition);

// @ts-expect-error: skip error
const resolvedState = authMachine.resolveState(previousState);

export const authService = interpret(authMachine, { devTools: true })
  .onTransition((state) => {
    if (state.changed) {
      if (process.env.NODE_ENV !== "test") console.log(state);
      localStorage.setItem("authState", JSON.stringify(state));
    }
  })
  .start(resolvedState);

//----------------------------
// helper
function formatError(data: { status: number; message: string }) {
  return {
    response: { ok: false, status: data.status } as Response,
    json: data,
  };
}
function formatData(data: { status: number; message: string }): {
  response: Response;
  json: unknown;
} {
  return {
    response: { ok: true, status: data.status } as Response,
    json: data,
  };
}

export function resetAuth(): void {
  authService.send("RESET")
}