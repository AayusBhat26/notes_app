import React, { useState } from "react";
import { MdAdd, MdClose } from "react-icons/md";

export default function TagInput({ tags, setTags }) {
  const [tagInput, setTagInput] = useState("");

  const addNewTag = () => {
    if (tagInput.trim() === "" || tagInput.trim().length > 10) return; // Do not add if tag is empty or exceeds 10 characters
    if (tags.length >= 5) return; // Limit the number of tags to 5
    if (tags.includes(tagInput)) return; // Prevent adding duplicate tags

    setTags([...tags, tagInput.trim()]);
    setTagInput("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      addNewTag();
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    const newTags = tags.filter((tag) => tag !== tagToRemove);
    setTags(newTags);
  }

  return (
    <div>
      {tags?.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap mt-2">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="flex items-center text-blue-700 bg-slate-100 shadow px-3 py-1 rounded-full text-xs mr-1">
              #{tag}
              <button onClick={() => handleRemoveTag(tag)}>
                <MdClose className="text-red-600 text-sm"/>
              </button>
            </span>
          ))}
        </div>
      )}

      <div className="flex items-center gap-4 mt-3">
        <input
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyDown={handleKeyDown}
          type="text"
          className="flex-grow bg-transparent border px-3 py-2 rounded outline-none"
          placeholder="Add tags (max 10 chars)"
          maxLength={10}
        />
        <button
          onClick={addNewTag}
          className="w-8 h-8 flex items-center justify-center rounded border border-blue-700 hover:bg-blue-700 hover:text-white transition-all duration-300 ease-in-out"
        >
          <MdAdd className="text-2xl text-blue-700 hover:text-white" />
        </button>
      </div>
    </div>
  );
}
