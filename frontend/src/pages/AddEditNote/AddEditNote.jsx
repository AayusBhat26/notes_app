import React from "react";
import { useState } from "react";
import TagInput from "../../components/Input/TagInput";
import { MdClose } from "react-icons/md";
import axiosInstance from "../../utils/axiosinstance";
import { motion } from "framer-motion";

export default function AddEditNote({
  onClose,
  noteData,
  type,
  getAllNotes,
  showToast,
}) {
  const [tags, setTags] = useState(noteData?.tags || []);
  const [title, setTitle] = useState(noteData?.title || "");
  const [content, setContent] = useState(noteData?.content || "");
  const [error, setError] = useState(null);

  const handleSetTags = newTags => {
    if (newTags.length <= 5) { // Limit to 5 tags
      setTags(newTags.map(tag => tag.slice(0, 10))); // Each tag up to 10 characters
    }
  };

  const addNewNote = async () => {
    try {
      const response = await axiosInstance.post("/create-note", {
        title,
        content,
        tags,
      });
      if (response.data.error) {
        setError(response.data.error);
        return;
      }
      if (response.data.note) {
        getAllNotes();
        onClose();
        showToast("Note Added Successfully");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleEditNote = async () => {
    try {
      console.log("Editing Note with id" + " " + noteData._id);
      const response = await axiosInstance.post(`/edit-note/${noteData._id}`, {
        title,
        content,
        tags,
      });
      if (response.data.error) {
        setError(response.data.error);
        return;
      }
      if (response.data.note) {
        getAllNotes();
        onClose();
        showToast("Note Edited Successfully");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddNote = () => {
    if (!title.trim() || !content.trim()) {
      setError("Please fill all the fields");
      return;
    }

    setError(null);

    if (type === "add") {
      console.log("Adding Note");
      addNewNote();
      showToast("Note Added Successfully");
    }

    if (type === "edit") {
      console.log("Editing Note");
      handleEditNote();
    }
  };

  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="relative w-full max-w-4xl p-4 m-4 bg-white rounded-lg shadow-xl sm:p-8"
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <button
          onClick={onClose}
          className="absolute text-gray-400 top-4 right-4 hover:text-gray-600"
        >
          <MdClose size={24} />
        </button>
        <h2 className="mb-4 text-xl font-semibold text-gray-800">
          {type === "add" ? "Add New Note" : "Edit Note"}
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded-lg shadow-sm form-input focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
              placeholder="Enter Title"
              value={title}
              onChange={(e) => setTitle(e.target.value.slice(0, 50))} // Max length of 50 characters
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Content</label>
            <textarea
              className="w-full p-2 border border-gray-300 rounded-lg shadow-sm form-textarea focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
              placeholder="Enter Content"
              rows={6}
              value={content}
              onChange={(e) => setContent(e.target.value)}
            ></textarea>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Tags</label>
            <TagInput tags={tags} setTags={handleSetTags} />
          </div>
          {error && (
            <p className="text-sm text-red-500">{error}</p>
          )}
          <button
            className="w-full py-3 font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            onClick={handleAddNote}
          >
            {type === "add" ? "Add Note" : "Edit Note"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}