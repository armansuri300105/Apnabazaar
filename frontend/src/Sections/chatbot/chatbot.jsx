import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, MessageCircle } from "lucide-react";
import { sendInputToBot } from "../../../API/api";
import AIChat from "./AIChat"; // 👈 import the AI chat component

const ChatBot = () => {
  const [open, setOpen] = useState(false);
  const [switchToAI, setSwitchToAI] = useState(false); // 👈 state to switch mode
  const [messages, setMessages] = useState([
    {
      from: "bot",
      text: "👋 Hello! Welcome to ApnaBazzar! How may I help you today?",
      options: ["Order Related", "Product Related", "Chat with AI Assistant", "Others"],
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef(null);

  const handleSend = async (customInput) => {
    const userInput = customInput || input.trim();
    if (!userInput) return;

    // ✅ if user selects AI assistant
    if (userInput.toLowerCase() === "chat with ai assistant") {
      setSwitchToAI(true);
      return;
    }

    const newMessages = [...messages, { from: "user", text: userInput }];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      const res = await sendInputToBot(userInput);
      const botMessage = res?.data?.message || "Sorry, I didn’t understand that 😅";
      const botOptions = res?.data?.options || [];

      setMessages((prev) => [
        ...prev,
        { from: "bot", text: botMessage, options: botOptions },
      ]);
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

  const handleOptionClick = (option) => handleSend(option);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // 👇 If user switched to AI, show AIChat instead
  if (switchToAI) return <AIChat onExit={() => setSwitchToAI(false)} />;

  return (
    <>
      <motion.button
        whileTap={{ scale: 0.9 }}
        whileHover={{ scale: 1.05 }}
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 bg-[#4F46E5] text-white p-4 rounded-full shadow-lg hover:shadow-2xl transition-all"
      >
        <MessageCircle size={26} />
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            key="chatbot"
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
              transition: { type: "spring", stiffness: 120, damping: 12 },
            }}
            exit={{ opacity: 0, scale: 0.8, y: 30, transition: { duration: 0.25 } }}
            className="fixed bottom-[100px] max-w-[80vw] right-6 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden z-50"
          >
            <div className="bg-[#4F46E5] text-white p-3 font-semibold flex justify-between items-center">
              <span>🛍️ ApnaBazzar Support</span>
              <button onClick={() => setOpen(false)} className="text-white text-sm">
                ✕
              </button>
            </div>

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
                    dangerouslySetInnerHTML={{
                      __html: msg.text.replace(/\n/g, "<br>"),
                    }}
                  />
                </div>
              ))}

              {messages[messages.length - 1]?.from === "bot" &&
                messages[messages.length - 1]?.options?.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="flex flex-wrap gap-2 mt-2"
                  >
                    {messages[messages.length - 1].options.map((opt, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleOptionClick(opt)}
                        className="text-xs bg-white border border-[#4F46E5] text-[#4F46E5] rounded-lg px-3 py-1 hover:bg-[#4F46E5] hover:text-white transition"
                      >
                        {opt}
                      </button>
                    ))}
                  </motion.div>
                )}

              {isLoading && (
                <div className="text-gray-500 text-xs italic mt-2">Bot is typing...</div>
              )}
              <div ref={chatEndRef} />
            </div>

            <div className="p-2 border-t flex items-center bg-gray-50">
              <input
                type="text"
                className="flex-1 text-sm p-2 rounded-lg border outline-none"
                placeholder="Type your message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                disabled={isLoading}
              />
              <button
                onClick={() => handleSend()}
                className="ml-2 bg-[#4F46E5] text-white p-2 rounded-lg hover:bg-[#4338CA] transition disabled:opacity-50"
                disabled={isLoading}
              >
                <Send size={18} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatBot;