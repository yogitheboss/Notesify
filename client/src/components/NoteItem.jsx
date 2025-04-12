// components/NoteItem.jsx
import React, { useState } from "react";
import ReactMarkdown from "react-markdown";

const NoteItem = ({ note, index, removeNote }) => {
  const audioURL = URL.createObjectURL(note);
  const [transcript, setTranscript] = useState("");
  const [notes, setNotes] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const uploadAudio = async () => {
    setIsLoading(true);
    const formData = new FormData();
    // Create a meaningful file name with the correct extension (e.g., .mp3)
    const fileName = `audio-${Date.now()}.mp3`;

    // Append the file to the FormData object, with a custom name
    formData.append("file", note, fileName);

    try {
      const response = await apiClient
      const data = await response.json();

      // Set both transcript and notes from the response
      setTranscript(data.data || "");
      setNotes(data.notes || "");
      console.log("File uploaded successfully:", data.message);
    } catch (error) {
      console.error("Error uploading file:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mb-6 border rounded-lg overflow-hidden shadow-sm">
      <div className="p-3 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
        <audio controls src={audioURL} className="max-w-[250px]"></audio>
        <div className="flex space-x-2">
          <button
            onClick={uploadAudio}
            disabled={isLoading}
            className={`ml-4 ${
              isLoading ? "bg-blue-300" : "bg-blue-500 hover:bg-blue-600"
            } text-white px-3 py-1 rounded transition`}
          >
            {isLoading ? "Processing..." : "Upload"}
          </button>
          <button
            onClick={() => removeNote(index)}
            className="ml-4 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition"
          >
            Delete
          </button>
        </div>
      </div>

      {(transcript || notes) && (
        <div className="p-4">
          {transcript && (
            <div className="mb-4">
              <h3 className="text-lg font-medium text-gray-800 mb-2">
                Transcript
              </h3>
              <div className="bg-gray-50 p-3 rounded border border-gray-200">
                {transcript}
              </div>
            </div>
          )}

          {notes && (
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">Notes</h3>
              <div className="bg-gray-50 p-3 rounded border border-gray-200 prose max-w-none">
                <ReactMarkdown>{notes}</ReactMarkdown>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NoteItem;
