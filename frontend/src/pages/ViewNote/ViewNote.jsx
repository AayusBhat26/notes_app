import React from "react";
import { MdClose } from "react-icons/md";

const ViewNote = ({ note, onCloseNote }) => {
  return (
    note && (
      <div className="bg-white rounded-lg p-6 relative max-w-4xl w-full mx-auto">
        <button
          onClick={onCloseNote}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <MdClose size={24} />
        </button>
        <h3 className="text-xl font-semibold text-gray-800">{note.title}</h3>
        <p className="text-sm text-gray-500 mb-4">
          {new Date(note.createdAt).toLocaleDateString()}
        </p>
        <div className="text-gray-700 whitespace-pre-wrap overflow-y-auto max-h-96" style={{ paddingRight: '1rem' }}>
          {note.content}
        </div>
        {note.tags && note.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {note.tags.map((tag, index) => (
              <span key={index} className="text-sm text-blue-700 bg-slate-100 px-3 py-1 rounded-full">
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>
    )
  );
};

export default ViewNote;
