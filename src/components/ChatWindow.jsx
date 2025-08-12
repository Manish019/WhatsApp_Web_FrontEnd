import React, { useEffect, useState, useRef } from "react";
import { fetchMessages, sendMessage } from "../Api";
import { FiArrowLeft } from "react-icons/fi";

export default function ChatWindow({ wa_id, socket, onBack }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const savedWaRef = useRef(null);

  // Load messages jab conversation change ho
  useEffect(() => {
    if (wa_id) loadMessages();
    savedWaRef.current = wa_id;
  }, [wa_id]);

  // Socket listeners
  useEffect(() => {
    if (!socket) return;

    // New message listener (duplicate prevention)
    socket.on("new_message", (msg) => {
      if (msg.wa_id === savedWaRef.current) {
        setMessages((prev) => {
          // Agar temp message hai (same meta_msg_id) => replace karega
          const tempIndex = prev.findIndex(
            (m) => m.meta_msg_id && m.meta_msg_id === msg.meta_msg_id
          );
          if (tempIndex !== -1) {
            const updated = [...prev];
            updated[tempIndex] = msg;
            return updated;
          }

          // Agar message already hai => skip krega
          const exists = prev.some(
            (m) => m._id === msg._id || m.meta_msg_id === msg.meta_msg_id
          );
          return exists ? prev : [...prev, msg];
        });
      }
    });

    // Status update listener
    socket.on("status_update", (st) => {
      setMessages((prev) =>
        prev.map((m) =>
          m.meta_msg_id === st.meta_msg_id ? { ...m, status: st.status } : m
        )
      );
    });

    return () => {
      socket.off("new_message");
      socket.off("status_update");
    };
  }, [socket]);

  // API se messages load karne kye liye
  async function loadMessages() {
    if (!wa_id) return;
    try {
      const data = await fetchMessages(wa_id);
      setMessages(data);
    } catch (err) {
      console.error("Failed to load messages", err);
    }
  }

  // Message send karna
  async function handleSend(e) {
    e.preventDefault();
    if (!text.trim()) return;

    const tempId = `temp_${Date.now()}`;
    const newMsg = {
      wa_id,
      text,
      from: "me",
      createdAt: new Date().toISOString(),
      status: "sending",
      meta_msg_id: tempId,
    };

    // UI me temp message add karo
    setMessages((prev) => [...prev, newMsg]);

    try {
      const savedMsg = await sendMessage(wa_id, text);
      setMessages((prev) =>
        prev.map((m) =>
          m.meta_msg_id === tempId ? savedMsg : m
        )
      );
    } catch (err) {
      console.error("Send failed", err);
      setMessages((prev) =>
        prev.map((m) =>
          m.meta_msg_id === tempId ? { ...m, status: "failed" } : m
        )
      );
    }

    setText("");
  }

  if (!wa_id) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-500 bg-[#efeae2]">
        Select a conversation
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-[#efeae2]">
      {/* Header */}
      <div className="p-3 bg-gray-100 border-b flex items-center shadow-sm">
        <button
          onClick={onBack}
          className="md:hidden mr-3 text-gray-600 hover:text-black"
        >
          <FiArrowLeft size={22} />
        </button>
        <div className="w-10 h-10 bg-gray-400 rounded-full"></div>
        <div className="ml-3">
          <div className="font-semibold">{wa_id}</div>
          <div className="text-xs text-gray-500">Online</div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((m, index) => {
          const isMe = m.from === "me";
          return (
            <div
              key={`${m._id || m.meta_msg_id || "temp"}_${index}`}
              className={`flex ${isMe ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`px-3 py-2 rounded-lg max-w-xs shadow-sm ${
                  isMe
                    ? "bg-[#d9fdd3] text-gray-800"
                    : "bg-white text-gray-800"
                }`}
              >
                <div className="text-sm">{m.text}</div>
                <div className="text-[10px] text-gray-500 mt-1 text-right">
                  {new Date(m.createdAt || m.timestamp).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                  {isMe && m.status && (
                    <span className="ml-1">✓</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Send box */}
      <form
        onSubmit={handleSend}
        className="p-3 bg-[#f0f0f0] flex items-center space-x-2"
      >
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="flex-1 px-4 py-2 text-sm rounded-full bg-white border border-gray-300 focus:outline-none focus:ring focus:ring-green-300"
          placeholder="Type a message"
        />
        <button
          type="submit"
          className="bg-[#00a884] text-white px-4 py-2 rounded-full hover:bg-green-600"
        >
          Send
        </button>
      </form>
    </div>
  );
}
