import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Send, Bot } from "lucide-react";
import { send } from "../../../API/chat";

const AIChat = ({ onExit }) => {
  const [messages, setMessages] = useState([
    { from: "bot", text: "🤖 Hi there! I'm your AI Assistant. How can I help you today?" },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef(null);

  const handleSend = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { from: "user", text: input }];
    setMessages(newMessages);
    const userMessage = input;
    setInput("");
    setIsLoading(true);

    try {
      const res = await send(userMessage);
      const botMessage = res?.data?.message || "🤔 I couldn’t generate a reply. Try again!";
      setMessages((prev) => [...prev, { from: "bot", text: botMessage }]);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        { from: "bot", text: "⚠️ Something went wrong. Please try again later." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="fixed bottom-[100px] right-6 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden z-50"
    >
      {/* Header */}
      <div className="bg-[#4F46E5] text-white p-3 font-semibold flex justify-between items-center">
        <span><Bot className="inline mr-2" />AI Assistant</span>
        <button onClick={onExit} className="text-white text-sm">↩ Back</button>
      </div>

      {/* Messages */}
      <div className="flex-1 p-3 overflow-y-auto max-h-[400px]">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`my-2 flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}
          >
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className={`px-3 py-2 rounded-xl text-sm max-w-[80%] whitespace-pre-line ${
                msg.from === "user"
                  ? "bg-[#4F46E5] text-white"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {msg.text}
            </motion.div>
          </div>
        ))}

        {isLoading && (
          <div className="text-gray-500 text-xs italic mt-2">AI is thinking...</div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input */}
      <div className="p-2 border-t flex items-center bg-gray-50">
        <input
          type="text"
          className="flex-1 text-sm p-2 rounded-lg border outline-none"
          placeholder="Ask me anything..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          disabled={isLoading}
        />
        <button
          onClick={handleSend}
          className="ml-2 bg-[#4F46E5] text-white p-2 rounded-lg hover:bg-[#4338CA] transition disabled:opacity-50"
          disabled={isLoading}
        >
          <Send size={18} />
        </button>
      </div>
    </motion.div>
  );
};

export default AIChat;