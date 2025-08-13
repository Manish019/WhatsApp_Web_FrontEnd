import React, { useState, useEffect } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { X } from "lucide-react";

export default function Sidebar({ conversations, selected, onSelect }) {
  const [isOpen, setIsOpen] = useState(false); // mobile by default closed
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // responsiveness 
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsOpen(true); // Desktop always open rhega
      }
    };
    window.addEventListener("resize", handleResize);
    handleResize(); // initial check
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleSelect = (wa_id) => {
    onSelect(wa_id);
    if (isMobile) setIsOpen(false); // auto close on mobile
  };

  return (
    <div className="relative">
      {/* Toggle Button (Mobile only - outside sidebar) */}
      {isMobile && !isOpen && (
        <button
          type="button"
          className="fixed top-4 right-4 z-50 bg-white p-2 rounded-full shadow border"
          onClick={() => setIsOpen(true)}
        >
          <GiHamburgerMenu size={20} />
        </button>
      )}

      {/*Overlay (mobile only, when open) */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-50 w-80 bg-white border-r flex flex-col
        transform transition-transform duration-300 ease-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-3 bg-gray-100 border-b">
          <div className="w-10 h-10 bg-gray-400 rounded-full"></div>

          {/* Close Icon inside header (Mobile only) */}
          {isMobile && (
            <button
              type="button"
              className="p-1 rounded-full hover:bg-gray-200"
              onClick={() => setIsOpen(false)}
            >
              <X size={20} />
            </button>
          )}
        </div>

        {/* Search not working */}
        <div className="p-2 border-b">
          <input
            type="text"
            placeholder="Search or start new chat"
            className="w-full px-3 py-2 rounded-full bg-gray-50 border text-sm focus:outline-none focus:ring"
          />
        </div>

        {/* Chat list details */}
        <div className="flex-1 overflow-y-auto">
          {conversations.map((c) => {
            const name = c.name || c.wa_id;
            const lastText = c.lastMessage?.text || "No messages yet";
            const time =
              c.lastMessage?.createdAt || c.lastMessage?.timestamp
                ? new Date(
                    c.lastMessage.createdAt || c.lastMessage.timestamp
                  ).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                : "";

            return (
              <div
                key={c.wa_id}
                onClick={() => handleSelect(c.wa_id)}
                className={`flex items-center px-3 py-2 cursor-pointer hover:bg-gray-100 ${
                  selected === c.wa_id ? "bg-gray-200" : ""
                }`}
              >
                <div className="w-10 h-10 bg-gray-400 rounded-full flex-shrink-0"></div>
                <div className="ml-3 flex-1 border-b border-gray-200 pb-2 min-w-0">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold truncate">{name}</span>
                    <span className="text-xs text-gray-500">{time}</span>
                  </div>
                  <div className="flex justify-between items-center mt-0.5">
                    <span className="text-sm text-gray-600 truncate">{lastText}</span>
                    {c.count > 0 && (
                      <span className="bg-green-500 text-white rounded-full px-2 text-xs">
                        {c.count}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </aside>
    </div>
  );
}
