import React, { useContext, useState } from "react";
import { X, MessageCircle } from "lucide-react"; // icons
import { DataContext } from "../context/DataContext";

const ChatBotWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hi 👋, tell me your symptoms and I’ll suggest a department!" },
  ]);
  const [input, setInput] = useState("");
  const {axios}=useContext(DataContext);
  const handleSend = async() => {
    if (!input.trim()) return;

    const newMessages = [...messages, { sender: "user", text: input }];

    try {
        const {data}=await axios.post('/api/openai',{message:input})
        if(data.success){
            const { department, specialization, message: botMessage } = data.reply;
            setMessages([
        ...newMessages,
        {
          sender: "bot",
          text: botMessage,
          department,
          specialization
        }
      ]);
        }
    } catch (error) {
        console.log(error.message);
        setMessages([
      ...newMessages,
      { sender: "bot", text: "⚠️ Error connecting to AI service." },
    ]);
    }

    setInput("");
  };

  return (
    <>
      {/* Floating Chat Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed md:bottom-6 md:right-6 bottom-2 right-2 bg-blue-600 text-white md:p-4 p-2 rounded-full shadow-lg hover:bg-blue-700 transition"
      >
        <MessageCircle size={24} />
      </button>

      {/* Chatbot Modal */}
      {isOpen && (
        <div 
        className="fixed bottom-15 right-4 md:bottom-20 md:right-6 md:w-80 w-60 bg-white rounded-2xl shadow-xl border flex flex-col">
        {/* className="fixed bottom-20 right-4 md:bottom-20 md:right-6 w-[90vw] max-w-80 bg-white rounded-2xl shadow-xl border flex flex-col z-50"   */}
        {/* Header */}
          <div className="flex justify-between items-center p-3 border-b bg-blue-600 text-white rounded-t-2xl">
            <h2 className="text-sm font-semibold">Health Assistant</h2>
            <button onClick={() => setIsOpen(false)}>
              <X size={18} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-3 overflow-y-auto max-h-80 space-y-2">
{messages.map((msg, idx) => (
  <div
    key={idx}
    className={`p-2 rounded-lg text-sm ${
      msg.sender === "user"
        ? "bg-blue-100 self-end text-right"
        : "bg-gray-100 self-start text-left"
    }`}
  >
    <div>{msg.text}</div>
    {msg.sender === "bot" && msg.department && (
      <div className="text-xs text-gray-500 mt-1">
        Department: {msg.department} <br />
        Specialization: {msg.specialization}
      </div>
    )}
  </div>
))}

          </div>

          {/* Input */}
          <div className="p-2 border-t flex md:gap-2 gap-1 sm:gap-0">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your symptoms..."
              className="sm:flex-1 border rounded-lg sm:px-3 sm:py-2 text-sm focus:outline-none"
            />
            <button
              onClick={handleSend}
              className="bg-blue-600 text-white md:px-3 px-1 py-2 rounded-lg text-sm hover:bg-blue-700"
              //className=" bottom-4 right-4 md:bottom-6 md:right-6 z-50 bg-blue-600 text-white p-3 md:p-4 rounded-full shadow-lg hover:bg-blue-700 transition"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBotWidget;
