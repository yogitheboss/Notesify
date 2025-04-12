import { View } from "react-native";
import { useState } from "react";
import LoginForm from "@/components/LoginForm";
import SignupForm from "@/components/SignupForm";

export default function AuthScreen() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <View className="flex-1 bg-white p-4 justify-center items-center">
      <View className="w-full max-w-sm">
        {isLogin ? (
          <LoginForm onToggle={() => setIsLogin(false)} />
        ) : (
          <SignupForm onToggle={() => setIsLogin(true)} />
        )}
      </View>
    </View>
  );
}
