import React from "react";
import { useUserStore } from "@/store/user";
import { Redirect } from "expo-router";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const MainUI = () => {
  const user = useUserStore((state) => state.user);
  const router = useRouter();
  console.log("User:", user);
  if (!user) {
    return <Redirect href="/auth" />;
  }

  return (
    <SafeAreaView className="flex-1 bg-black h-full">
      <ScrollView className="flex-1 h-full">
        {/* Top Bar with Profile */}
        <View className="flex-row justify-between items-center px-5 pt-4 pb-6">
          <View>
            <Text className="text-white text-2xl font-bold">
              Hello, {user.name || "User"}
            </Text>
          </View>
          <TouchableOpacity className="h-10 w-10 rounded-full overflow-hidden border-2 border-yellow-400">
            {user.photoURL ? (
              <Image
                source={{ uri: user.photoURL }}
                className="h-full w-full"
              />
            ) : (
              <View className="h-full w-full bg-gray-700 justify-center items-center">
                <Text className="text-white text-lg font-bold">
                  {user.name ? user.name[0].toUpperCase() : "U"}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Main Content */}
        <View className="px-5 pb-10">
          <Text className="text-white text-xl font-semibold mb-6">
            What would you like to do?
          </Text>

          {/* Create Notes Button */}
          <TouchableOpacity
            className="bg-yellow-400 rounded-2xl p-6 mb-5"
            onPress={() => router.push("/create-notes")}
          >
            <View className="flex-row justify-between items-center">
              <View className="flex-1">
                <Text className="text-black text-2xl font-bold mb-2">
                  Create Notes
                </Text>
                <Text className="text-black opacity-80">
                  Start writing your thoughts and ideas
                </Text>
              </View>
              <View className="bg-black h-12 w-12 rounded-full justify-center items-center">
                <Ionicons name="create-outline" size={24} color="#FFCA28" />
              </View>
            </View>
            <View className="flex-row mt-4">
              {[...Array(12)].map((_, i) => (
                <Text key={i} className="text-black mx-1">
                  +
                </Text>
              ))}
            </View>
          </TouchableOpacity>

          {/* View Saved Notes Button */}
          <TouchableOpacity
            className="bg-gray-800 rounded-2xl p-6 border border-yellow-400"
            onPress={() => router.push("/saved-notes")}
          >
            <View className="flex-row justify-between items-center">
              <View className="flex-1">
                <Text className="text-white text-2xl font-bold mb-2">
                  Saved Notes
                </Text>
                <Text className="text-white opacity-80">
                  Browse through your collection
                </Text>
              </View>
              <View className="bg-yellow-400 h-12 w-12 rounded-full justify-center items-center">
                <Ionicons name="bookmark" size={24} color="black" />
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default MainUI;
