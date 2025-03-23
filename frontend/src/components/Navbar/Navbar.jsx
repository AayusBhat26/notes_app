import React from "react";
import ProfileInfo from "../Cards/ProfileInfo";
import SearchBar from "../SearchBar/SearchBar";
import { useState, useEffect } from "react";
import { FaRegStickyNote } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { motion } from "framer-motion";

export default function Navbar({ userInfo, handleSearch, getAllNotes }) {
  const [searchQuery, setSearchQuery] = useState("");

  const clearSearch = () => {
    setSearchQuery("");
    getAllNotes();
  };

  const navigate = useNavigate();

  const handleIconClick = () => {
    const token = localStorage.getItem('token');
    token ? navigate('/dashboard') : navigate('/login');
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      searchQuery.trim() ? handleSearch(searchQuery) : getAllNotes();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  return (
    <motion.nav
      className="flex items-center justify-between px-6 py-3 bg-gray-100 drop-shadow-lg"
      initial={{ y: -50 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <a onClick={handleIconClick} className="cursor-pointer">
        <FaRegStickyNote size={32} className="text-blue-600" />
      </a>
      <SearchBar value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} handleSearch={() => handleSearch(searchQuery)} clearSearch={clearSearch} />
      <ProfileInfo userInfo={userInfo} />
    </motion.nav>
  );
}