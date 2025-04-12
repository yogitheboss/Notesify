import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useState } from "react";
import { useUserStore } from "@/store/user";
import { useRouter } from "expo-router";
export default function LoginForm({ onToggle }: { onToggle: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login, isLoading } = useUserStore();
  const router = useRouter();

  const handleLogin = async () => {
    try {
      setLoading(true);
      setError("");

      const user = await login(email, password);
      if (user) {
        router.push("/");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="w-full h-full justify-center gap-5">
      <View className="space-y-2">
        <Text className="text-3xl font-bold text-center text-gray-800">
          Welcome Back
        </Text>
        <Text className="text-gray-500 text-center">
          Sign in to your account
        </Text>
      </View>

      <View className="space-y-4 gap-3">
        <TextInput
          className="w-full bg-gray-50 border border-gray-200 p-4 rounded-xl"
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TextInput
          className="w-full bg-gray-50 border border-gray-200 p-4 rounded-xl"
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
      </View>

      {error ? <Text className="text-red-500 text-center">{error}</Text> : null}

      <TouchableOpacity
        className={`bg-blue-600 py-4 rounded-xl ${loading ? "opacity-70" : ""}`}
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text className="text-white text-center font-semibold text-lg">
            Sign In
          </Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={onToggle} className="py-2">
        <Text className="text-blue-600 text-center">
          Don't have an account?{" "}
          <Text className="font-semibold">Create one</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
}
