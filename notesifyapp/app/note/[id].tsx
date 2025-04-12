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

const NoteDetail = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getNoteById, selectedNote, deleteNote } = useNotesStore();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
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
        <ScrollView className="flex-1 px-5">
          <Text className="text-white text-3xl font-bold mt-4 mb-2">
            {selectedNote.title || "Untitled Note"}
          </Text>

          <Text className="text-gray-500 mb-6">
            {formatDate(selectedNote.updatedAt)}
          </Text>

          <Text className="text-white text-lg leading-7">
            {selectedNote.content}
          </Text>

          <View className="h-20" />
        </ScrollView>
      ) : (
        <View className="flex-1 justify-center items-center p-5">
          <Text className="text-white text-center">Note not found</Text>
        </View>
      )}
    </SafeAreaView>
  );
};

export default NoteDetail;
