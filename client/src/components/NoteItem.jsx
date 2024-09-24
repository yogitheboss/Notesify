// components/NoteItem.jsx
import React from 'react';

const NoteItem = ({ note, index, removeNote }) => {
  const audioURL = URL.createObjectURL(note);

  return (
    <div className="p-2 border-b border-gray-200 flex justify-between items-center">
      <audio controls src={audioURL}></audio>
      <button
        onClick={() => removeNote(index)}
        className="ml-4 bg-red-500 text-white px-3 py-1 rounded"
      >
        Delete
      </button>
    </div>
  );
};

export default NoteItem;
