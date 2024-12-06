// components/AudioRecorder.jsx
import React, { useState } from "react";
import { AiTwotoneAudio } from "react-icons/ai";
import { AiOutlineAudioMuted } from "react-icons/ai";
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
    <div className="p-4 bg-gray-100 rounded-md shadow-md flex align-item flex-col">
      <h2 className="text-xl text-center mb-4">Record a Note</h2>
      {isRecording ? (
        <button
          onClick={() => {
            stopRecording();
          }}
          className="bg-red-500 mx-auto   text-white px-4 py-2 rounded flex flex-col items-center w-30"
        >
          <span>
            <AiOutlineAudioMuted style={{ fontSize: "2rem" }} />
          </span>
          <span>Stop Recording</span>
        </button>
      ) : (
        <button
          onClick={startRecording}
          className="bg-green-500 w-30 mx-auto text-white px-4 py-2 rounded flex flex-col text-center  items-center"
        >
          <span>
            <AiTwotoneAudio style={{ fontSize: "2rem" }} />
          </span>
          <spa>Start Recording</spa>
        </button>
      )}
    </div>
  );
};

export default AudioRecorder;
