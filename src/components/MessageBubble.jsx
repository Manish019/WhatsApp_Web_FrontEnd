import React from "react";
import { Check, CheckCheck } from "lucide-react";

export default function MessageBubble({ message }) {
  const isSent = message.direction === "outbound";
  const time = new Date(message.timestamp || Date.now()).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div
      className={`flex ${isSent ? "justify-end" : "justify-start"} mb-1 px-1 sm:px-0`}
    >
      <div
        className={`max-w-[85%] sm:max-w-md px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg shadow text-xs sm:text-sm relative ${
          isSent
            ? "bg-green-500 text-white rounded-br-none"
            : "bg-white text-gray-800 rounded-bl-none"
        }`}
      >
        {/* Message Text */}
        <div className="whitespace-pre-wrap break-words">{message.text || "No text"}</div>

        {/* Time + Status */}
        <div
          className={`flex items-center gap-1 mt-1 text-[10px] sm:text-xs ${
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
