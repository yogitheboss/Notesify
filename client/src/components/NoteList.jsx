// components/NoteList.jsx
import React from 'react';
import NoteItem from './NoteItem';

const NoteList = ({ notes, removeNote }) => {
  return (
    <div className="p-4 bg-white rounded-md shadow-md">
      <h2 className="text-xl mb-4">Your Notes</h2>
      {notes.length > 0 ? (
        notes.map((note, index) => (
          <NoteItem key={index} note={note} index={index} removeNote={removeNote} />
        ))
      ) : (
        <p>No notes recorded yet.</p>
      )}
    </div>
  );
};

export default NoteList;
