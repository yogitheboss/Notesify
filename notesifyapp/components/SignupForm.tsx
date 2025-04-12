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

export default function SignupForm({ onToggle }: { onToggle: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const { signup, isLoading } = useUserStore();
  const router = useRouter();

  const handleSignup = async () => {
    try {
      setError("");

      if (!name || !email || !password) {
        setError("Please fill in all fields");
        return;
      }

      if (password.length < 6) {
        setError("Password must be at least 6 characters");
        return;
      }

      const user = await signup(email, password, name);
      if (user) {
        // Navigate to home screen after successful signup
        router.push("/");
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        (err instanceof Error ? err.message : "Signup failed");
      setError(errorMessage);
    }
  };

  return (
    <View className="w-full gap-5">
      <View className="space-y-2">
        <Text className="text-3xl font-bold text-center text-gray-800">
          Create Account
        </Text>
        <Text className="text-gray-500 text-center">
          Sign up to get started
        </Text>
      </View>

      <View className="space-y-4 gap-4">
        <TextInput
          className="w-full bg-gray-50 border border-gray-200 p-4 rounded-xl"
          placeholder="Full Name"
          value={name}
          onChangeText={setName}
        />

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
        className={`bg-blue-600 py-4 rounded-xl ${
          isLoading ? "opacity-70" : ""
        }`}
        onPress={handleSignup}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text className="text-white text-center font-semibold text-lg">
            Create Account
          </Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={onToggle} className="py-2">
        <Text className="text-blue-600 text-center">
          Already have an account?{" "}
          <Text className="font-semibold">Sign in</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
}
