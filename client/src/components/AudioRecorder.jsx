// components/AudioRecorder.jsx
import React, { useState } from "react";

const AudioRecorder = ({ addNote }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new MediaRecorder(stream);
    recorder.ondataavailable = (e) => {
      const blob = new Blob([e.data], { type: "audio/wav" });
      addNote(blob); // Pass the recorded blob to parent component
    };
    recorder.start();
    setIsRecording(true);
    setMediaRecorder(recorder);
  };

  const stopRecording = () => {
    mediaRecorder.stop();
    setIsRecording(false);
  };

  return (
    <div className="p-4 bg-gray-100 rounded-md shadow-md">
      <h2 className="text-xl mb-4">Record a Note</h2>
      {isRecording ? (
        <button
          onClick={() => {
            stopRecording();
          }}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Stop Recording
        </button>
      ) : (
        <button
          onClick={startRecording}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Start Recording
        </button>
      )}
    </div>
  );
};

export default AudioRecorder;
