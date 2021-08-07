import { useActor } from "@xstate/vue";
import { createAuthService } from "@/machines/authMachine";

let authService;
export function useAuthActor() {
  authService = authService || createAuthService();

  const { state: authState, send: sendAuth } = useActor(authService);
  return { authState, sendAuth };
}
