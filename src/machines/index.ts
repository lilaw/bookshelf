import { useActor } from "@xstate/vue";
import { authService } from "@/machines/authMachine";

export function useAuthActor() {
  const { state: authState, send: sendAuth } = useActor(authService);
  return { authState, sendAuth };
}
