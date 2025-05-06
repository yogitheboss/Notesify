import { Stack } from "expo-router";
import "../global.css";
import { useEffect } from "react";
import { useUserStore } from "@/store/user";

export default function RootLayout() {
  const { initialize } = useUserStore();

  useEffect(() => {
    // Initialize user authentication state
    initialize();
  }, []);

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

      <Stack.Screen name="auth/index" options={{ headerShown: false }} />
      <Stack.Screen name="+not-found" />
      <Stack.Screen
        name="create-notes/index"
        options={{ headerShown: false }}
      />
      <Stack.Screen name="saved-notes" options={{ headerShown: false }} />
      <Stack.Screen name="note/[id]" options={{ headerShown: false }} />
    </Stack>
  );
}
