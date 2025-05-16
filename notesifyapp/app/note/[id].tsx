import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useNotesStore } from "@/store/notes";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { format } from "date-fns";
import Markdown from "react-native-markdown-display";

const NoteDetail = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getNoteById, selectedNote, deleteNote } = useNotesStore();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"note" | "internet">("note");

  console.log("Selected Note:", selectedNote);
  useEffect(() => {
    if (id) {
      loadNote(id);
    }
  }, [id]);

  const loadNote = async (noteId: string) => {
    setLoading(true);
    try {
      await getNoteById(noteId);
    } catch (error) {
      console.error("Failed to load note:", error);
      Alert.alert("Error", "Failed to load note details");
      router.back();
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      "Delete Note",
      "Are you sure you want to delete this note? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            if (id) {
              try {
                await deleteNote(id);
                router.replace("/saved-notes");
              } catch (error) {
                Alert.alert("Error", "Failed to delete note");
              }
            }
          },
        },
      ]
    );
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    try {
      return format(new Date(dateString), "MMMM d, yyyy 'at' h:mm a");
    } catch (error) {
      return "Unknown date";
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-black h-full">
      {/* Header */}
      <View className="flex-row justify-between items-center px-5 pt-4 pb-2">
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>

        <View className="flex-row">
          <TouchableOpacity
            onPress={() => console.log("Edit note")}
            className="mr-4"
          >
            <Ionicons name="create-outline" size={24} color="white" />
          </TouchableOpacity>

          <TouchableOpacity onPress={handleDelete}>
            <Ionicons name="trash-outline" size={24} color="#FF4040" />
          </TouchableOpacity>
        </View>
      </View>

      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#FFCA28" />
        </View>
      ) : selectedNote ? (
        <>
          {/* Tabs for switching between note content and internet notes */}
          {selectedNote.internetGenNotes && (
            <View className="flex-row px-5 mb-2">
              <TouchableOpacity
                className={`py-2 px-4 rounded-t-lg ${
                  activeTab === "note" ? "bg-gray-800" : "bg-transparent"
                }`}
                onPress={() => setActiveTab("note")}
              >
                <Text
                  className={`${
                    activeTab === "note"
                      ? "text-white font-bold"
                      : "text-gray-400"
                  }`}
                >
                  My Note
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className={`py-2 px-4 rounded-t-lg ${
                  activeTab === "internet" ? "bg-gray-800" : "bg-transparent"
                }`}
                onPress={() => setActiveTab("internet")}
              >
                <Text
                  className={`${
                    activeTab === "internet"
                      ? "text-white font-bold"
                      : "text-gray-400"
                  }`}
                >
                  Internet Notes
                </Text>
              </TouchableOpacity>
            </View>
          )}

          <ScrollView className="flex-1 px-5">
            <Text className="text-white text-3xl font-bold mt-4 mb-2">
              {selectedNote.title || "Untitled Note"}
            </Text>

            <Text className="text-gray-500 mb-6">
              {formatDate(selectedNote.updatedAt)}
            </Text>

            {activeTab === "note" ? (
              <Markdown
                style={{
                  body: { color: "white" },
                  heading1: {
                    fontSize: 24,
                    fontWeight: "bold",
                    color: "white",
                    marginTop: 20,
                    marginBottom: 10,
                  },
                  heading2: {
                    fontSize: 22,
                    fontWeight: "bold",
                    color: "white",
                    marginTop: 16,
                    marginBottom: 8,
                  },
                  heading3: {
                    fontSize: 20,
                    fontWeight: "bold",
                    color: "white",
                    marginTop: 14,
                    marginBottom: 7,
                  },
                  heading4: {
                    fontSize: 18,
                    fontWeight: "bold",
                    color: "white",
                    marginTop: 12,
                    marginBottom: 6,
                  },
                  heading5: {
                    fontSize: 16,
                    fontWeight: "bold",
                    color: "white",
                    marginTop: 10,
                    marginBottom: 5,
                  },
                  heading6: {
                    fontSize: 14,
                    fontWeight: "bold",
                    color: "white",
                    marginTop: 8,
                    marginBottom: 4,
                  },
                  paragraph: {
                    fontSize: 18,
                    lineHeight: 28,
                    color: "white",
                    marginVertical: 8,
                  },
                  link: { color: "#FFCA28", textDecorationLine: "underline" },
                  list_item: { color: "white", fontSize: 18, lineHeight: 28 },
                  blockquote: {
                    backgroundColor: "#333",
                    borderLeftColor: "#FFCA28",
                    borderLeftWidth: 4,
                    paddingHorizontal: 10,
                    paddingVertical: 5,
                  },
                  code_block: {
                    backgroundColor: "#333",
                    padding: 10,
                    borderRadius: 5,
                  },
                  code_inline: {
                    backgroundColor: "#333",
                    color: "#FFCA28",
                    padding: 3,
                    borderRadius: 3,
                  },
                }}
              >
                {selectedNote.content}
              </Markdown>
            ) : (
              <Markdown
                style={{
                  body: { color: "white" },
                  heading1: {
                    fontSize: 24,
                    fontWeight: "bold",
                    color: "white",
                    marginTop: 20,
                    marginBottom: 10,
                  },
                  heading2: {
                    fontSize: 22,
                    fontWeight: "bold",
                    color: "white",
                    marginTop: 16,
                    marginBottom: 8,
                  },
                  heading3: {
                    fontSize: 20,
                    fontWeight: "bold",
                    color: "white",
                    marginTop: 14,
                    marginBottom: 7,
                  },
                  heading4: {
                    fontSize: 18,
                    fontWeight: "bold",
                    color: "white",
                    marginTop: 12,
                    marginBottom: 6,
                  },
                  heading5: {
                    fontSize: 16,
                    fontWeight: "bold",
                    color: "white",
                    marginTop: 10,
                    marginBottom: 5,
                  },
                  heading6: {
                    fontSize: 14,
                    fontWeight: "bold",
                    color: "white",
                    marginTop: 8,
                    marginBottom: 4,
                  },
                  paragraph: {
                    fontSize: 18,
                    lineHeight: 28,
                    color: "white",
                    marginVertical: 8,
                  },
                  link: { color: "#FFCA28", textDecorationLine: "underline" },
                  list_item: { color: "white", fontSize: 18, lineHeight: 28 },
                  blockquote: {
                    backgroundColor: "#333",
                    borderLeftColor: "#FFCA28",
                    borderLeftWidth: 4,
                    paddingHorizontal: 10,
                    paddingVertical: 5,
                  },
                  code_block: {
                    backgroundColor: "#333",
                    padding: 10,
                    borderRadius: 5,
                  },
                  code_inline: {
                    backgroundColor: "#333",
                    color: "#FFCA28",
                    padding: 3,
                    borderRadius: 3,
                  },
                }}
              >
                {selectedNote.internetGenNotes}
              </Markdown>
            )}

            <View className="h-20" />
          </ScrollView>
        </>
      ) : (
        <View className="flex-1 justify-center items-center p-5">
          <Text className="text-white text-center">Note not found</Text>
        </View>
      )}
    </SafeAreaView>
  );
};

export default NoteDetail;
