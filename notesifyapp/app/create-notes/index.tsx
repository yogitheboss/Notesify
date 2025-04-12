import React from "react";
import CreateNotes from "@/components/CreateNotes";
import { View } from "react-native";
const index = () => {
  return (
    <View className="flex-1 bg-black h-full">
      <CreateNotes />
    </View>
  );
};

export default index;
