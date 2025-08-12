import React from "react";

export default function Sidebar({ conversations, selected, onSelect }) {
  const handleSelect = (wa_id) => {
    onSelect(wa_id); // yeh code unread reset App.jsx me handle ho raha hai
  };

  return (
    <div className="w-80 bg-white border-r flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-3 bg-gray-100 border-b">
        <div className="w-10 h-10 bg-gray-400 rounded-full"></div>
        <div className="flex space-x-4 text-gray-600">
        </div>
      </div>

      {/* Search box */}
      <div className="p-2 border-b">
        <input
          type="text"
          placeholder="Search or start new chat"
          className="w-full px-3 py-2 rounded-full bg-gray-50 border text-sm focus:outline-none focus:ring"
        />
      </div>

      {/* Chat list */}
      <div className="flex-1 overflow-y-auto">
        {conversations.map((c) => {
          const name = c.name || c.wa_id;
          const lastText = c.lastMessage?.text || "No messages yet";
          const time = c.lastMessage?.createdAt || c.lastMessage?.timestamp
            ? new Date(c.lastMessage.createdAt || c.lastMessage.timestamp).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })
            : "";

          return (
            <div
              key={c.wa_id}
              onClick={() => handleSelect(c.wa_id)}
              className={`flex items-center px-3 py-2 cursor-pointer hover:bg-gray-100 ${
                selected === c.wa_id ? "bg-gray-200" : ""
              }`}
            >
              {/* images blang */}
              <div className="w-10 h-10 bg-gray-400 rounded-full flex-shrink-0"></div>

              {/* Chat info  details*/}
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
    </div>
  );
}
