import React, { useEffect } from "react";
import Navbar from "../../components/Navbar/Navbar";
import NoteCard from "../../components/Cards/NoteCard";
import { MdAdd } from "react-icons/md";
import AddEditNote from "../AddEditNote/AddEditNote";
import { useState } from "react";
import Modal from "react-modal";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosinstance";
import Toast from "../../components/Toasts/Toast";
import ViewNote from "../ViewNote/ViewNote";

export default function Home() {
  const [openAddEditModal, setOpenAddEditModal] = useState({
    isShown: false,
    type: "add",
    data: null,
  });

  const [openViewNoteModal, setOpenViewNoteModal] = useState({
    isShown: false,
    note: null,
  });

  const [showToast, setShowToast] = useState({
    isShown: false,
    message: "",
    type: "add",
  });

  const [userInfo, setUserInfo] = useState(null);
  const [notes, setNotes] = useState([]);

  const navigate = useNavigate();

  const getUserInfo = async () => {
    try {
      const response = await axiosInstance.get("/user");

      if (response.data.error) {
        localStorage.removeItem("token");
        navigate("/login");
      }

      if (response.data.user) {
        setUserInfo(response.data.user);
      }
    } catch {}
  };

  const getAllNotes = async () => {
    try {
      const response = await axiosInstance.get("/get-notes");

      if (response.data.notes) {
        setNotes(response.data.notes);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleEditNote = (note) => {
    setOpenAddEditModal({ isShown: true, type: "edit", data: note });
  }

  const handleShowToast = (message, type) => {
    setShowToast({ isShown: true, message, type });
  }

  const handleDeleteNote = async (note) => {
    const noteId = note._id;
    try {
      const response = await axiosInstance.delete(`/delete-note/${noteId}`);

      if (response.data.error) {
        console.log(response.data.error);
        return;
      }

      if (!response.data.error) {
        getAllNotes();
        handleShowToast("Note Deleted Successfully", 'delete');
      }
    } catch (error) {
      console.log(error);
    }
  }

  const onPinNote = async (note) => {
    const noteId = note._id;
    try {
      const response = await axiosInstance.put(`/pin-note/${noteId}`);

      if (response.data.error) {
        console.log(response.data.error);
        return;
      }

      if (!response.data.error) {
        getAllNotes();
        handleShowToast("Note Pinned Successfully", 'add');
      }
    } catch (error) {
      console.log(error);
    }
  }

  const handleSearch = async (searchQuery) => {
    try {
      const response = await axiosInstance.get(`/search/${searchQuery}`);
      if (response.data.notes) {
        setNotes(response.data.notes);
      } else {
        console.log(response.data.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleViewNote = (note) => {
    setOpenViewNoteModal({ isShown: true, note });
  };

  useEffect(() => {
    getUserInfo();
    getAllNotes();
  }, []);

  return (
    <>
      <Navbar userInfo={userInfo} handleSearch={handleSearch} getAllNotes={getAllNotes}/>

      <div className="container mx-auto">
<div className="grid grid-cols-1 gap-4 m-8 sm:grid-cols-2 md:grid-cols-3">
            {notes.map((note) => (
            <NoteCard
              key={note._id}
              title={note.title}
              date={new Date(
                note?.createdAt || new Date()
              ).toLocaleDateString()}
              content={note.content}
              tags={note.tags}
              isPinned={note.isPinned}
              onEdit={() => {handleEditNote(note)}}
              onPin={() => {}}
              onDelete={() => {handleDeleteNote(note)}}
              onPinNote={() => {onPinNote(note)}}
              onClick={() => handleViewNote(note)}
            />
          ))}
        </div>
      </div>

      <button
        onClick={() =>
          setOpenAddEditModal({ isShown: true, type: "add", data: null })
        }
        className="absolute flex items-center justify-center w-16 h-16 duration-500 outline-none rounded-2xl bg-primary hover:bg-blue-600 hover:scale-105 right-10 bottom-10 "
      >
        <MdAdd className="text-[32px] text-white" />
      </button>

      <Modal
        isOpen={openAddEditModal.isShown}
        onRequestClose={() => {}}
        style={{
          overlay: {
            backgroundColor: "rgba(0,0,0,0.6)",
          },
        }}
        contentLabel=""
        className="w-[40%] max-h-3/4 rounded-md mx-auto mt-14 overflow-x-hidden p-5 overflow-y-auto"
      >
        <AddEditNote
          type={openAddEditModal.type}
          noteData={openAddEditModal.data}
          onClose={() =>
            setOpenAddEditModal({ isShown: false, type: "add", data: null })
          }
          getAllNotes={getAllNotes}
          showToast={handleShowToast}
        />
      </Modal>

      {/* <Modal
        isOpen={openViewNoteModal.isShown}
        onRequestClose={() => setOpenViewNoteModal({ isShown: false, note: null })}
        style={{
          overlay: {
            backgroundColor: "rgba(0,0,0,0.6)",
          },
        }}
        contentLabel=""
        className="w-[70%] max-h-3/4 rounded-md mx-auto mt-14 overflow-x-hidden p-5 overflow-y-auto"
      >
        <ViewNote
          note={openViewNoteModal.note}
          onCloseNote={() => setOpenViewNoteModal({ isShown: false })}
        />
      </Modal> */}

<Modal
  isOpen={openViewNoteModal.isShown}
  onRequestClose={() => setOpenViewNoteModal({ isShown: false, note: null })}
  style={{
    overlay: {
      backgroundColor: "rgba(0,0,0,0.6)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
    content: {
      position: "relative", // Override default absolute positioning
      margin: "auto",
      width: "90%",
      maxWidth: "600px", 
      height: "auto", // Auto height based on content
      top: "0",
      left: "0",
      right: "0",
      bottom: "0",
      borderRadius: "10px", // Rounded corners
      padding: "20px", // Inner padding
      overflow: "hidden", // Prevents overflow
      display: "flex", // Ensures content is flexibly designed
      flexDirection: "column", // Stack children vertically
      justifyContent: "center", // Center vertically in flex container
      alignItems: "center", // Center horizontally in flex container
    },
  }}
  contentLabel="View Note"
>
  <ViewNote
    note={openViewNoteModal.note}
    onCloseNote={() => setOpenViewNoteModal({ isShown: false })}
  />
</Modal>

      <Toast
        isShown={showToast.isShown}
        message={showToast.message}
        onClose={() => setShowToast({ isShown: false, message: "", type: "" })}
        type={showToast.type}
      />
    </>
  );
}