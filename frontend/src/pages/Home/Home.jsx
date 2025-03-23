import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import NoteCard from "../../components/Cards/NoteCard";
import { MdAdd } from "react-icons/md";
import AddEditNote from "../AddEditNote/AddEditNote";
import Modal from "react-modal";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosinstance";
import Toast from "../../components/Toasts/Toast";
import ViewNote from "../ViewNote/ViewNote";
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import "../../App.css";

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
      setUserInfo(response.data.user);
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  };

  const getAllNotes = async () => {
    try {
      const response = await axiosInstance.get("/get-notes");
      if (response.data.notes) {
        const sortedNotes = response.data.notes.sort((a, b) => {
          if (a.isPinned === b.isPinned) return a.position - b.position;
          return a.isPinned ? -1 : 1;
        });
        setNotes(sortedNotes);
      }
    } catch (error) {
      console.error("Error fetching notes:", error);
    }
  };

  const handleReorderNotes = async (result) => {
    if (!result.destination) return;

    const newNotes = Array.from(notes);
    const [movedNote] = newNotes.splice(result.source.index, 1);
    newNotes.splice(result.destination.index, 0, movedNote);

    // Optimistic UI update
    setNotes(newNotes);

    try {
      const noteIds = newNotes.map(note => note._id);
      await axiosInstance.put("/update-notes-order", { noteIds });
      handleShowToast("Notes reordered successfully", "add");
    } catch (error) {
      setNotes(notes);
      handleShowToast("Failed to save new order", "delete");
      console.error("Reorder error:", error);
    }
  };

  const handleEditNote = (note) => {
    setOpenAddEditModal({ isShown: true, type: "edit", data: note });
  };

  const handleShowToast = (message, type) => {
    setShowToast({ isShown: true, message, type });
  };

  const handleDeleteNote = async (note) => {
    try {
      const response = await axiosInstance.delete(`/delete-note/${note._id}`);
      if (!response.data.error) {
        getAllNotes();
        handleShowToast("Note Deleted Successfully", 'delete');
      }
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  const onPinNote = async (note) => {
    try {
      const response = await axiosInstance.put(`/pin-note/${note._id}`);
      if (!response.data.error) {
        getAllNotes();
        handleShowToast("Note Pinned Successfully", 'add');
      }
    } catch (error) {
      console.error("Pin error:", error);
    }
  };

  const handleSearch = async (searchQuery) => {
    try {
      const response = await axiosInstance.get(`/search/${searchQuery}`);
      if (response.data.notes) setNotes(response.data.notes);
    } catch (error) {
      console.error("Search error:", error);
    }
  };

  const handleViewNote = (note) => {
    setOpenViewNoteModal({ isShown: true, note });
  };

  useEffect(() => {
    getUserInfo();
    getAllNotes();
  }, []);

  const getItemStyle = (isDragging, draggableStyle) => ({
    userSelect: "none",
    margin: `0 0 16px 0`,
    background: isDragging ? "rgba(245,245,245,0.9)" : "white",
    transform: isDragging ? "rotate(3deg)" : "none",
    boxShadow: isDragging ? "0 10px 20px rgba(0,0,0,0.19)" : "none",
    ...draggableStyle,
  });

  return (
    <>
      <Navbar userInfo={userInfo} handleSearch={handleSearch} getAllNotes={getAllNotes} />

      <div className="container mx-auto">
        <DragDropContext onDragEnd={handleReorderNotes}>
          <Droppable droppableId="notes" direction="horizontal">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="grid grid-cols-1 gap-4 m-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
              >
                {notes.map((note, index) => (
                  <Draggable key={note._id} draggableId={note._id} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={getItemStyle(
                          snapshot.isDragging,
                          provided.draggableProps.style
                        )}
                        className={`transform transition-transform duration-200 ${
                          snapshot.isDragging ? 'shadow-xl z-50' : 'shadow-md'
                        }`}
                      >
                        <NoteCard
                          title={note.title}
                          date={new Date(note.createdAt).toLocaleDateString()}
                          content={note.content}
                          tags={note.tags}
                          isPinned={note.isPinned}
                          onEdit={() => handleEditNote(note)}
                          onDelete={() => handleDeleteNote(note)}
                          onPinNote={() => onPinNote(note)}
                          onClick={() => handleViewNote(note)}
                        />
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>

      <button
        onClick={() => setOpenAddEditModal({ isShown: true, type: "add", data: null })}
        className="fixed flex items-center justify-center w-16 h-16 duration-500 rounded-full bg-primary hover:bg-blue-600 hover:scale-105 right-10 bottom-10"
      >
        <MdAdd className="text-3xl text-white" />
      </button>

      {/* Modals and Toast components remain the same */}
      <Modal
        isOpen={openAddEditModal.isShown}
        onRequestClose={() => setOpenAddEditModal({ isShown: false, type: "add", data: null })}
        style={modalStyles}
      >
        <AddEditNote
          type={openAddEditModal.type}
          noteData={openAddEditModal.data}
          onClose={() => setOpenAddEditModal({ isShown: false, type: "add", data: null })}
          getAllNotes={getAllNotes}
          showToast={handleShowToast}
        />
      </Modal>

      <Modal
        isOpen={openViewNoteModal.isShown}
        onRequestClose={() => setOpenViewNoteModal({ isShown: false, note: null })}
        style={viewNoteModalStyles}
      >
        <ViewNote
          note={openViewNoteModal.note}
          onCloseNote={() => setOpenViewNoteModal({ isShown: false })}
        />
      </Modal>

      <Toast
        isShown={showToast.isShown}
        message={showToast.message}
        type={showToast.type}
        onClose={() => setShowToast({ isShown: false, message: "", type: "" })}
      />
    </>
  );
}

// Modal styles
const modalStyles = {
  overlay: {
    backgroundColor: "rgba(0,0,0,0.6)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    width: "90%",
    maxWidth: "600px",
    margin: "auto",
    borderRadius: "10px",
    padding: "20px",
  },
};

const viewNoteModalStyles = {
  overlay: {
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  content: {
    width: "90%",
    maxWidth: "800px",
    margin: "auto",
    borderRadius: "10px",
    padding: "20px",
  },
};