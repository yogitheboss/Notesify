import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  SafeAreaView,
  Alert,
} from "react-native";
import { Audio } from "expo-av";
import { Ionicons } from "@expo/vector-icons";
import * as FileSystem from "expo-file-system";
import { useRouter } from "expo-router";
import { Recording } from "expo-av/build/Audio";
import apiClient from "@/utils/apiClient";

// Define a type for our recording items with additional properties
interface RecordingItem {
  uri: string;
  duration: number;
  timestamp: string;
  name: string;
  transcript?: string;
  notes?: string;
  isProcessed?: boolean;
}

const CreateNotes = () => {
  const [recording, setRecording] = useState<Recording | null>(null);
  const [recordings, setRecordings] = useState<RecordingItem[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Request permissions when component mounts
    (async () => {
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission required",
          "Please grant microphone access to record audio notes"
        );
      }
    })();

    // Clean up recording when component unmounts
    return () => {
      if (recording) {
        stopRecording();
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      // Configure audio
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      // Start recording
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );

      setRecording(recording);
      setIsRecording(true);
    } catch (err) {
      console.error("Failed to start recording", err);
      Alert.alert("Error", "Failed to start recording");
    }
  };

  const stopRecording = async () => {
    if (!recording) return;

    try {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();

      if (!uri) {
        throw new Error("Recording URI is undefined");
      }

      // Create a new recording object with metadata
      const newRecording: RecordingItem = {
        uri,
        duration: recording._finalDurationMillis || 0,
        timestamp: new Date().toISOString(),
        name: `Recording ${recordings.length + 1}`,
      };

      setRecordings([...recordings, newRecording]);
      setRecording(null);
      setIsRecording(false);
    } catch (err) {
      console.error("Failed to stop recording", err);
      Alert.alert("Error", "Failed to stop recording");
    }
  };

  const uploadRecording = async (
    recordingItem: RecordingItem,
    index: number
  ) => {
    setIsUploading(true);

    try {
      const fileInfo = await FileSystem.getInfoAsync(recordingItem.uri);
      if (!fileInfo.exists) {
        Alert.alert("Error", "Recording file not found");
        return;
      }

      // Create form data for upload
      const formData = new FormData();

      // Get the file from URI
      const fileUri = recordingItem.uri;
      const fileExtension = fileUri.split(".").pop() || "m4a";
      const fileName = `audio-${Date.now()}.${fileExtension}`;

      // Create a file object that matches what the server expects
      formData.append("file", {
        uri: fileUri,
        name: fileName,
        type: `audio/${fileExtension}`,
      } as any);

      console.log("Uploading file:", fileName);
      console.log("File URI:", fileUri);
      console.log("File type:", `audio/${fileExtension}`);

      // Make the API request - don't set Content-Type in headers here
      // Let the interceptor handle it based on FormData detection
      const response = await apiClient.post("/api/files/upload", formData);
      const result = response.data;
      console.log("Response:", result);

      if (response.status === 200) {
        // Update recording with transcription and notes
        const updatedRecordings = [...recordings];
        updatedRecordings[index] = {
          ...recordingItem,
          transcript: result.data || "",
          notes: result.notes || "",
          isProcessed: true,
        };

        setRecordings(updatedRecordings);
        Alert.alert("Success", "Recording processed successfully");
      } else {
        throw new Error(result.message || "Failed to process recording");
      }
    } catch (err: any) {
      console.error("Upload failed", err.response?.data || err.message || err);
      Alert.alert(
        "Error",
        `Failed to upload recording: ${
          err.response?.data?.message || err.message || "Unknown error"
        }`
      );
    } finally {
      setIsUploading(false);
    }
  };

  const deleteRecording = (index: number) => {
    const updatedRecordings = recordings.filter((_, i) => i !== index);
    setRecordings(updatedRecordings);
  };

  const formatDuration = (milliseconds: number) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <SafeAreaView className="flex-1 bg-black">
      <View className="flex-row items-center px-5 pt-4 pb-2">
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <Ionicons name="arrow-back" size={24} color="#FFCA28" />
        </TouchableOpacity>
        <Text className="text-white text-2xl font-bold">Create Notes</Text>
      </View>

      <ScrollView className="flex-1 px-5">
        {/* Recording UI */}
        <View className="bg-gray-900 rounded-2xl p-6 my-5 border border-yellow-400">
          <Text className="text-white text-xl font-semibold mb-4">
            Start Notetaking
          </Text>

          <View className="items-center justify-center py-8">
            <TouchableOpacity
              onPress={isRecording ? stopRecording : startRecording}
              className={`h-20 w-20 rounded-full justify-center items-center ${
                isRecording ? "bg-red-500" : "bg-yellow-400"
              }`}
            >
              <Ionicons
                name={isRecording ? "square" : "mic"}
                size={36}
                color={isRecording ? "white" : "black"}
              />
            </TouchableOpacity>

            <Text className="text-white mt-4">
              {isRecording ? "Tap to stop recording" : "Tap to start recording"}
            </Text>
          </View>
        </View>

        {/* Recordings List */}
        {recordings.length > 0 && (
          <View className="mb-10">
            <Text className="text-white text-xl font-semibold mb-4">
              Your Recordings
            </Text>

            {recordings.map((item, index) => (
              <View
                key={index}
                className="bg-gray-800 rounded-lg mb-4 overflow-hidden border border-gray-700"
              >
                <View className="p-4 flex-row justify-between items-center">
                  <View className="flex-1">
                    <Text className="text-white font-medium">{item.name}</Text>
                    <Text className="text-gray-400 text-sm">
                      {formatDuration(item.duration)} •{" "}
                      {new Date(item.timestamp).toLocaleTimeString()}
                    </Text>
                  </View>

                  <View className="flex-row">
                    {!item.isProcessed ? (
                      <TouchableOpacity
                        onPress={() => uploadRecording(item, index)}
                        disabled={isUploading}
                        className={`mr-2 rounded-full p-2 ${
                          isUploading ? "bg-gray-600" : "bg-yellow-400"
                        }`}
                      >
                        {isUploading ? (
                          <ActivityIndicator size="small" color="white" />
                        ) : (
                          <Ionicons
                            name="cloud-upload"
                            size={20}
                            color="black"
                          />
                        )}
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity className="mr-2 rounded-full p-2 bg-green-500">
                        <Ionicons name="checkmark" size={20} color="white" />
                      </TouchableOpacity>
                    )}

                    <TouchableOpacity
                      onPress={() => deleteRecording(index)}
                      className="rounded-full p-2 bg-red-500"
                    >
                      <Ionicons name="trash" size={20} color="white" />
                    </TouchableOpacity>
                  </View>
                </View>

                {item.isProcessed && (item.transcript || item.notes) && (
                  <View className="p-4 border-t border-gray-700">
                    {item.transcript && (
                      <View className="mb-3">
                        <Text className="text-yellow-400 font-medium mb-1">
                          Transcript
                        </Text>
                        <Text className="text-white">{item.transcript}</Text>
                      </View>
                    )}

                    {item.notes && (
                      <View>
                        <Text className="text-yellow-400 font-medium mb-1">
                          Notes
                        </Text>
                        <Text className="text-white">{item.notes}</Text>
                      </View>
                    )}
                  </View>
                )}
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default CreateNotes;
