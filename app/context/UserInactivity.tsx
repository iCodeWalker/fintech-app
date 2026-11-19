import { useAuth } from "@clerk/expo";
import { useAuthViewState } from "@clerk/expo/native-components";
import { useRouter } from "expo-router";
import { useEffect, useRef } from "react";
import { AppState, AppStateStatus } from "react-native";
import { createMMKV } from "react-native-mmkv";

const storage = createMMKV({
  id: "inactivity-storage",
});

export const UserInactivityProvider = ({ children }: any) => {
  const appState = useRef(AppState.currentState);
  const router = useRouter();
  const { isAuthFlowComplete } = useAuthViewState();
  const { isSignedIn } = useAuth();

  // Use a ref for auth status so handleAppStateChange never suffers from stale closures
  const isUserAuthenticated = useRef(Boolean(isSignedIn || isAuthFlowComplete));

  useEffect(() => {
    isUserAuthenticated.current = Boolean(isSignedIn || isAuthFlowComplete);
  }, [isSignedIn, isAuthFlowComplete]);

  useEffect(() => {
    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange,
    );

    return () => {
      subscription.remove();
    };
  }, []);

  const handleAppStateChange = async (nextAppState: AppStateStatus) => {
    // When the app leaves the active/foreground state (transitions to inactive or background)
    if (
      nextAppState.match(/inactive|background/) &&
      appState.current === "active"
    ) {
      recordStartTime();
    }
    // When returning to active/foreground from either inactive or background
    else if (
      nextAppState === "active" &&
      appState.current?.match(/inactive|background/)
    ) {
      const startTime = storage.getNumber("startTime") || 0;
      const elapsedTime = Date.now() - startTime;
      console.log(
        `[UserInactivity] Inactivity elapsed: ${elapsedTime}ms (Auth: ${isUserAuthenticated.current})`,
      );

      if (elapsedTime > 3000 && isUserAuthenticated.current && startTime > 0) {
        router.replace("/(authenticated)/(modals)/lock");
      }
    }

    appState.current = nextAppState;
  };

  const recordStartTime = () => {
    storage.set("startTime", Date.now());
  };

  return children;
};
