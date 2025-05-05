


import { useState, useRef, useEffect } from "react";
import { X, Send } from "lucide-react";

export function TempChatInterface({
  isOpen,
  onClose,
  inputRef,
  isRelativeToParent = true,
}: {
  isOpen: boolean;
  onClose: () => void;
  inputRef?: React.RefObject<HTMLInputElement>;
  isRelativeToParent?: boolean;
}) {
  const [messages, setMessages] = useState<{ role: "user" | "ai"; content: string }[]>([]);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
        inputRef?.current?.focus();
      }, 100);
    }
  }, [isOpen, messages]);

  if (!isOpen) return null;

  return (
    <div
      className={`w-full border border-gray-200 rounded-lg shadow bg-white flex flex-col ${
        isRelativeToParent ? "" : "absolute top-0 left-0 z-30"
      }`}
      style={{ height: "400px" }}
    >
      {/* Header */}
      <div className="flex justify-between items-center border-b px-4 py-2 bg-gray-50">
        <span className="text-sm font-medium text-gray-700">💬 AI Chat</span>
        <button onClick={onClose}>
          <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
        </button>
      </div>

      {/* Message History */}
      <div
        className="flex-1 overflow-y-auto px-4 py-2 space-y-3 text-left text-sm"
        ref={scrollRef}
      >
        {messages.length === 0 ? (
          <div className="text-gray-400 text-center mt-10">Ask me anything about AI tools!</div>
        ) : (
          messages.map((msg, idx) => (
            <div
              key={idx}
              className={`p-2 rounded-md max-w-[80%] ${
                msg.role === "user"
                  ? "bg-purple-100 self-end ml-auto"
                  : "bg-gray-100 self-start mr-auto"
              }`}
            >
              {msg.content}
            </div>
          ))
        )}
      </div>

      {/* Input */}
      <div className="flex items-center border-t px-3 py-2 bg-white gap-2">
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              setMessages((prev) => [...prev, { role: "user", content: input }]);
              setInput("");
              // Simulate AI response
              setTimeout(() => {
                setMessages((prev) => [...prev, { role: "ai", content: "Here's a suggestion!" }]);
              }, 600);
            }
          }}
          placeholder="Ask a question..."
          className="flex-1 border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-purple-200"
        />
        <button
          onClick={() => {
            setMessages((prev) => [...prev, { role: "user", content: input }]);
            setInput("");
            setTimeout(() => {
              setMessages((prev) => [...prev, { role: "ai", content: "Here's a suggestion!" }]);
            }, 600);
          }}
          className="p-2 rounded-md bg-purple-600 text-white hover:bg-purple-700"
        >
          <Send className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
