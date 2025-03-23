import React from 'react';
import { MdOutlinePushPin, MdCreate, MdDelete } from 'react-icons/md';
import { motion } from "framer-motion";

export default function NoteCard({
  title, date, content, tags, isPinned, onEdit, onDelete, onPinNote, onClick
}) {
  // Prevent event propagation to avoid triggering onClick of the parent element
  const handleEditClick = (event) => {
    event.stopPropagation();
    onEdit();
  };

  const handleDeleteClick = (event) => {
    event.stopPropagation();
    onDelete();
  };

  const handlePinClick = (event) => {
    event.stopPropagation();
    onPinNote();
  };

  return (
    <motion.div
      className='p-4 transition duration-300 ease-in-out bg-white border rounded-lg hover:shadow-lg'
      onClick={onClick}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className='flex items-start justify-between'>
        <div>
          <h5 className='text-lg font-semibold text-gray-800'>{title}</h5>
          <p className='text-sm text-gray-500'>{date}</p>
        </div>
        <button
          className={`p-2 rounded-full ${isPinned ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-400'}`}
          onClick={handlePinClick}
          aria-label="Pin Note"
        >
          <MdOutlinePushPin />
        </button>
      </div>

      <p className='mt-3 mb-2 text-sm text-gray-600'>
        {content?.slice(0, 100)}{content.length > 100 ? '...' : ''}
      </p>

      <div className='flex items-center justify-between'>
        <div className='flex flex-wrap gap-1'>
          {tags.map(tag => (
            <span key={tag} className='px-2 py-1 text-xs font-medium text-blue-600 bg-blue-100 rounded-full'>
              #{tag}
            </span>
          ))}
        </div>
        <div className='flex gap-2'>
          <button
            className='p-2 text-green-600 rounded-full hover:bg-green-100'
            onClick={handleEditClick}
            aria-label="Edit Note"
          >
            <MdCreate />
          </button>
          <button
            className='p-2 text-red-600 rounded-full hover:bg-red-100'
            onClick={handleDeleteClick}
            aria-label="Delete Note"
          >
            <MdDelete />
          </button>
        </div>
      </div>
    </motion.div>
  );
}