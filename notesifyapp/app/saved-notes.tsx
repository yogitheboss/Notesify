import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { useNotesStore } from "@/store/notes";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { formatDistanceToNow } from "date-fns";
import Markdown from "react-native-markdown-display";

const SavedNotes = () => {
  const { notes, getNotes } = useNotesStore();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    setLoading(true);
    try {
      await getNotes();
    } catch (error) {
      console.error("Failed to load notes:", error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await getNotes();
    } catch (error) {
      console.error("Failed to refresh notes:", error);
    } finally {
      setRefreshing(false);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (error) {
      return "Unknown date";
    }
  };

  const truncateText = (text: string, maxLength: number) => {
    if (!text) return "";
    // We'll keep the markdown syntax for the preview now
    return text.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  };

  return (
    <SafeAreaView className="flex-1 bg-black h-full">
      {/* Header */}
      <View className="flex-row items-center px-5 pt-4 pb-6">
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text className="text-white text-2xl font-bold">Saved Notes</Text>
      </View>

      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#FFCA28" />
        </View>
      ) : (
        <ScrollView
          className="flex-1 px-5"
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#FFCA28"]}
            />
          }
        >
          {notes.length === 0 ? (
            <View className="flex-1 justify-center items-center py-20">
              <Ionicons name="document-text-outline" size={64} color="#555" />
              <Text className="text-white text-lg mt-4 text-center">
                You don't have any saved notes yet.
              </Text>
              <TouchableOpacity
                className="mt-6 bg-yellow-400 px-6 py-3 rounded-full"
                onPress={() => router.push("/create-notes")}
              >
                <Text className="text-black font-semibold">Create a Note</Text>
              </TouchableOpacity>
            </View>
          ) : (
            notes.map((note) => (
              <TouchableOpacity
                key={note._id}
                className="bg-gray-800 rounded-xl p-4 mb-4 border border-gray-700"
                onPress={() => router.push(`/note/${note._id}`)}
              >
                <Text className="text-white text-xl font-bold mb-2">
                  {note.title || "Untitled Note"}
                </Text>
                <View className="mb-3">
                  <Markdown
                    style={{
                      body: { color: "#9ca3af" }, // text-gray-400 equivalent
                      paragraph: { marginVertical: 0 },
                    }}
                  >
                    {truncateText(note.content, 100)}
                  </Markdown>
                </View>
                <View className="flex-row justify-between items-center">
                  <Text className="text-gray-500 text-xs">
                    {formatDate(note.updatedAt)}
                  </Text>
                  <View className="bg-yellow-400 h-8 w-8 rounded-full justify-center items-center">
                    <Ionicons name="chevron-forward" size={16} color="black" />
                  </View>
                </View>
              </TouchableOpacity>
            ))
          )}
          <View className="h-20" />
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default SavedNotes;
