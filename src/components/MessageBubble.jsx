import React from "react";
import { Check, CheckCheck } from "lucide-react";

export default function MessageBubble({ message }) {
  const isSent = message.direction === "outbound";
  const time = new Date(message.timestamp || Date.now()).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className={`flex ${isSent ? "justify-end" : "justify-start"} mb-1`}>
      <div
        className={`max-w-md px-3 py-2 rounded-lg shadow text-sm relative ${
          isSent
            ? "bg-green-500 text-white rounded-br-none"
            : "bg-white text-gray-800 rounded-bl-none"
        }`}
      >
        {/* Message Text props pass*/}
        <div className="whitespace-pre-wrap break-words">{message.text || "No text"}</div>

        {/* Time and  Status */}
        <div
          className={`flex items-center gap-1 text-xs mt-1 ${
            isSent ? "text-green-100" : "text-gray-500"
          }`}
        >
          <span>{time}</span>
          {isSent &&
            (message.status === "read" ? (
              <CheckCheck size={14} className="text-blue-400" />
            ) : (
              <Check size={14} />
            ))}
        </div>
      </div>
    </div>
  );
}