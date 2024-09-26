// components/NoteItem.jsx
import React, { useState } from "react";

const NoteItem = ({ note, index, removeNote }) => {
  const audioURL = URL.createObjectURL(note);
  const [transcript, setTranscript] = useState([]);
  const uploadAudio = async () => {
    const formData = new FormData();
    // Create a meaningful file name with the correct extension (e.g., .mp3)
    const fileName = `audio-${Date.now()}.mp3`;

    // Append the file to the FormData object, with a custom name
    formData.append("file", note, fileName);

    try {
      const response = await fetch("http://localhost:3000/upload_files", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      console.log(data);
      setTranscript(data.data);
      console.log("File uploaded successfully:", data.message);
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };
  console.log(transcript);
  return (
    <>
      <div className="p-2 border-b border-gray-200 flex justify-between items-center">
        <audio controls src={audioURL}></audio>
        <button
          onClick={uploadAudio}
          className="ml-4 bg-blue-500 text-white px-3 py-1 rounded"
        >
          Upload
        </button>
        <button
          onClick={() => removeNote(index)}
          className="ml-4 bg-red-500 text-white px-3 py-1 rounded"
        >
          Delete
        </button>
      </div>
      <div>{transcript}</div>
    </>
  );
};

export default NoteItem;
