import Colors from "@/constants/Colors";
import { ClerkProvider } from "@clerk/expo";
import { useAuthViewState } from "@clerk/expo/native-components";
import { tokenCache } from "@clerk/expo/token-cache";
import { Ionicons } from "@expo/vector-icons";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useFonts } from "expo-font";
import { Link, Stack, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";
import { UserInactivityProvider } from "./context/UserInactivity";

const CLERK_PUBLISHABLE_KEY = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;
// Create a client
const queryClient = new QueryClient();

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const InitialLayout = () => {
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  const router = useRouter();

  const { isLoaded, isAuthFlowComplete } = useAuthViewState();
  const segments = useSegments();

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  useEffect(() => {
    if (!isLoaded) return;

    const inAuthGroup = segments[0] === "(authenticated)";

    // User is on login page.
    if (isAuthFlowComplete && !inAuthGroup) {
      router.replace("/(authenticated)/(tabs)/home");
    } else if (!isAuthFlowComplete) {
      router.replace("/");
    }
  }, [isAuthFlowComplete]);

  if (!loaded || !isLoaded) {
    return (
      <View style={{ justifyContent: "center", alignItems: "center" }}>
        <Text>Loading...</Text>
        <ActivityIndicator size={"large"} color={Colors.primary} />
      </View>
    );
  }

  return (
    <Stack
      screenOptions={{
        statusBarStyle: "dark", // <--- Default for all screens in the app
      }}
    >
      <Stack.Screen
        name="index"
        options={{ headerShown: false, statusBarStyle: "light" }}
      />
      <Stack.Screen
        name="signup"
        options={{
          title: "",
          headerBackTitle: "",
          headerShadowVisible: false,
          headerStyle: { backgroundColor: Colors.background },
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={28} color={Colors.primary} />
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="login"
        options={{
          title: "",
          headerBackTitle: "",
          headerShadowVisible: false,
          headerStyle: { backgroundColor: Colors.background },
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={28} color={Colors.primary} />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <Link href="/help" asChild>
              <TouchableOpacity>
                <Ionicons
                  name="help-circle-outline"
                  size={28}
                  color={Colors.primary}
                />
              </TouchableOpacity>
            </Link>
          ),
        }}
      />

      <Stack.Screen
        name="help"
        options={{
          title: "Help",
          presentation: "modal",
          animation: "slide_from_bottom", // <--- Forces bottom-to-top slide on Android as by default android does not support modal
        }}
      />
      <Stack.Screen
        name="verify/[phone]"
        options={{
          title: "",
          headerBackTitle: "",
          headerShadowVisible: false,
          headerStyle: { backgroundColor: Colors.background },
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={28} color={Colors.primary} />
            </TouchableOpacity>
          ),
        }}
      />

      <Stack.Screen
        name="(authenticated)/(tabs)"
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="(authenticated)/crypto/[id]"
        options={{
          title: "",
          headerLargeTitleEnabled: true,
          headerTransparent: true,
          headerLargeTitle: true,
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={28} color={Colors.primary} />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <View style={{ flexDirection: "row", gap: 10 }}>
              <TouchableOpacity>
                <Ionicons
                  name="notifications-outline"
                  size={30}
                  color={Colors.dark}
                />
              </TouchableOpacity>
              <TouchableOpacity>
                <Ionicons name="star-outline" size={30} color={Colors.dark} />
              </TouchableOpacity>
            </View>
          ),
        }}
      />

      <Stack.Screen
        name="(authenticated)/(modals)/lock"
        options={{
          headerShown: false,
          animation: "none",
        }}
      />

      <Stack.Screen
        name="(authenticated)/(modals)/account"
        options={{
          presentation: "transparentModal",
          animation: "fade",
          title: "",
          headerTransparent: true,
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="close-outline" size={34} color={"#fff"} />
            </TouchableOpacity>
          ),
        }}
      />
    </Stack>
  );
};

const RootLayoutNav = () => {
  return (
    <ClerkProvider
      publishableKey={CLERK_PUBLISHABLE_KEY}
      tokenCache={tokenCache}
    >
      <QueryClientProvider client={queryClient}>
        <UserInactivityProvider>
          <GestureHandlerRootView style={{ flex: 1 }}>
            {/* <StatusBar barStyle="dark-content" /> */}
            <InitialLayout />
          </GestureHandlerRootView>
        </UserInactivityProvider>
      </QueryClientProvider>
    </ClerkProvider>
  );
};

export default RootLayoutNav;
