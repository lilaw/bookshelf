import { createMachine, assign, interpret, State, Interpreter } from "xstate";
import { createModel } from "xstate/lib/model";
import {
  login as authLogin,
  logout as authLogout,
  register as authRegister,
} from "@/utils/auth-provider";
import { areYouABadBody, areYouABadStatus } from "@/utils/client";
import type { user, form } from "@/types";
import { isUserData } from "@/type-guards";
import { useActor } from "@xstate/vue";


const authModel = createModel(
  {
    user: undefined as user | undefined,
    message: undefined as string | undefined,
  },
  {
    events: {
      LOGIN: (form: form) => ({ form }),
      LOGOUT: () => ({}),
      SIGNUP: (form: form) => ({ form }),
      CLEAR: () => ({}),
      RESET: () => ({}),
      updateUser: (data: user) => ({ data }),
      updateMessage: (message: string) => ({ message }),
      clearMessage: () => ({}),
    },
  }
);
export const authMachine = authModel.createMachine(
  {
    id: "authentication",
    initial: "unauthorized",
    context: authModel.initialContext,
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
      RESET: "unauthorized",
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
        user: (context, event: any) => {
          return event.data;
        },
      }),
      onError: authModel.assign({
        message: (context, event: any) => {
          return event.data.message;
        },
      }),
      clearMessage: authModel.assign({
        message: () => {
          return undefined;
        },
      }),
    },
  }
);

function createAuthService() {
  const stateDefinition: typeof authMachine.initialState =
    // @ts-expect-error: localStorage may return null, but || handle it
    JSON.parse(window.localStorage.getItem("authState")) ||
    authMachine.initialState;
  const previousState = State.create(stateDefinition);

  const resolvedState = authMachine.resolveState(previousState);

  const authService = interpret(authMachine, { devTools: true })
    .onTransition((state) => {
      if (state.changed) {
        if (process.env.NODE_ENV !== "test") console.log(state);
        localStorage.setItem("authState", JSON.stringify(state));
      }
    })
    .start(resolvedState);
  return authService;
}

let authService: ReturnType<typeof createAuthService>;
export function setupAuthService(): void {
  authService = createAuthService();
}

export function useAuthActor() {
  if (!authService) throw new Error(`call setupAuthService() first.`);
  const { state: authState, send: sendAuth } = useActor(authService);
  return { authState, sendAuth };
}

export function resetAuth(): void {
  authService.send("RESET");
}

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
