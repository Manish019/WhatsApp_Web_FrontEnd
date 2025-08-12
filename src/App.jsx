import React, { useEffect, useState, useRef } from "react";
import "./App.css";
import Sidebar from "./components/Sidebar";
import ChatWindow from "./components/ChatWindow";
import { fetchConversations } from "./Api";
import { io } from "socket.io-client";

export default function App() {
  const [conversations, setConversations] = useState([]);
  const [selected, setSelected] = useState(null);
  const socketRef = useRef(null);

  useEffect(() => {
    loadConversations();

    const API = import.meta.env.VITE_API_URL || "http://localhost:5000";
    socketRef.current = io(API, { transports: ["websocket", "polling"] });
    const socket = socketRef.current;

    // New message from backend
    const handleNewMessage = (msg) => {
      setConversations((prev) => {
        // Prevent duplicate conversations
        let copy = [...prev];
        const idx = copy.findIndex((c) => c.wa_id === msg.wa_id);

        if (idx === -1) {
          // New conversation
          copy.unshift({
            wa_id: msg.wa_id,
            lastMessage: msg,
            count: msg.wa_id === selected ? 0 : 1,
          });
        } else {
          // Update existing conversation
          const isCurrentChat = msg.wa_id === selected;
          copy[idx] = {
            ...copy[idx],
            lastMessage: msg,
            count: isCurrentChat ? 0 : (copy[idx].count || 0) + 1,
          };
          // Move updated conversation to top
          const updatedConv = copy.splice(idx, 1)[0];
          copy.unshift(updatedConv);
        }

        // Remove any accidental duplicates
        const seen = new Set();
        return copy.filter((c) => {
          if (seen.has(c.wa_id)) return false;
          seen.add(c.wa_id);
          return true;
        });
      });
    };

    // Status update
    const handleStatusUpdate = (st) => {
      window.dispatchEvent(new CustomEvent("wc_status_update", { detail: st }));
    };

    socket.on("new_message", handleNewMessage);
    socket.on("status_update", handleStatusUpdate);

    socket.on("connect_error", (err) => {
      console.warn("Socket connection error:", err);
    });

    return () => {
      socket.off("new_message", handleNewMessage);
      socket.off("status_update", handleStatusUpdate);
      socket.disconnect();
    };
  }, [selected]);

  // Fetch conversations from DB
  async function loadConversations() {
    try {
      const data = await fetchConversations();
      setConversations(data);
      if (data.length && !selected) {
        setSelected(data[0].wa_id);
      }
    } catch (err) {
      console.error("Failed to load conversations", err);
    }
  }

  // When selecting a conversation, reset unread count
    const handleSelect = (wa_id) => {
    setSelected(wa_id);
    setConversations((prev) =>
      prev.map((c) => (c.wa_id === wa_id ? { ...c, count: 0 } : c))
    );
  };

  return (
    <div className="h-screen flex">
      <Sidebar
        conversations={conversations}
        selected={selected}
        onSelect={handleSelect}
      />
      <ChatWindow wa_id={selected} socket={socketRef.current} />
    </div>
  );
}
