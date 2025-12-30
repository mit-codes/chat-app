import React, { useState } from "react";
import {
  Search,
  MoreVertical,
  Phone,
  Video,
  Send,
  Paperclip,
  Smile,
  Mic,
  Check,
  CheckCheck,
} from "lucide-react";

const Chat = () => {
  const [activeChat, setActiveChat] = useState(1);
  const [messageInput, setMessageInput] = useState("");

  // Demo Data
  const contacts = [
    {
      id: 1,
      name: "Alice Freeman",
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop",
      lastMessage: "See you tomorrow! 👋",
      time: "10:30 AM",
      unread: 2,
      online: true,
    },
    {
      id: 2,
      name: "Bob Smith",
      avatar:
        "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=150&h=150&fit=crop",
      lastMessage: "Can you send the files?",
      time: "Yesterday",
      unread: 0,
      online: false,
    },
    {
      id: 3,
      name: "Charlie Davis",
      avatar:
        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop",
      lastMessage: "Thanks for the help.",
      time: "Yesterday",
      unread: 0,
      online: true,
    },
    {
      id: 4,
      name: "Diana Prince",
      avatar:
        "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=150&h=150&fit=crop",
      lastMessage: "Meeting rescheduled to 3 PM.",
      time: "Mon",
      unread: 5,
      online: false,
    },
  ];

  const messages = [
    {
      id: 1,
      senderId: 1,
      text: "Hey, how are you doing?",
      time: "10:00 AM",
      status: "read",
    },
    {
      id: 2,
      senderId: "me",
      text: "I'm good, thanks! Just working on the new project.",
      time: "10:05 AM",
      status: "read",
    },
    {
      id: 3,
      senderId: 1,
      text: "That sounds exciting! Which one?",
      time: "10:06 AM",
      status: "read",
    },
    {
      id: 4,
      senderId: "me",
      text: "The chat application redesign. It's coming along nicely.",
      time: "10:10 AM",
      status: "delivered",
    },
    {
      id: 5,
      senderId: 1,
      text: "Can't wait to see it!",
      time: "10:15 AM",
      status: "sent",
    },
    {
      id: 6,
      senderId: 1,
      text: "See you tomorrow! 👋",
      time: "10:30 AM",
      status: "sent",
    },
  ];

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!messageInput.trim()) return;
    // Handle send logic here
    console.log("Sending:", messageInput);
    setMessageInput("");
  };

  const activeContact = contacts.find((c) => c.id === activeChat);

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900 overflow-hidden">
      {/* Sidebar */}
      <div className="w-1/3 max-w-sm bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
        {/* Sidebar Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center sticky top-0 bg-white dark:bg-gray-800 z-10">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            Chats
          </h1>
          <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300">
            <MoreVertical size={20} />
          </button>
        </div>

        {/* Search */}
        <div className="p-4">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search conversations..."
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 border-none focus:ring-2 focus:ring-indigo-500 text-gray-700 dark:text-gray-200 placeholder-gray-400 focus:outline-none transition-all"
            />
          </div>
        </div>

        {/* Contacts List */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {contacts.map((contact) => (
            <div
              key={contact.id}
              onClick={() => setActiveChat(contact.id)}
              className={`flex items-center p-4 cursor-pointer transition-colors duration-200 hover:bg-gray-50 dark:hover:bg-gray-700 ${
                activeChat === contact.id
                  ? "bg-indigo-50 dark:bg-indigo-900/20 border-l-4 border-indigo-500"
                  : "border-l-4 border-transparent"
              }`}
            >
              <div className="relative">
                <img
                  src={contact.avatar}
                  alt={contact.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                {contact.online && (
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></span>
                )}
              </div>
              <div className="ml-4 flex-1">
                <div className="flex justify-between items-baseline">
                  <h3
                    className={`text-sm font-semibold ${
                      activeChat === contact.id
                        ? "text-indigo-600 dark:text-indigo-400"
                        : "text-gray-800 dark:text-gray-200"
                    }`}
                  >
                    {contact.name}
                  </h3>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {contact.time}
                  </span>
                </div>
                <div className="flex justify-between items-center mt-1">
                  <p className="text-sm text-gray-500 dark:text-gray-400 truncate w-40">
                    {contact.lastMessage}
                  </p>
                  {contact.unread > 0 && (
                    <span className="w-5 h-5 flex items-center justify-center bg-indigo-500 text-white text-xs font-bold rounded-full">
                      {contact.unread}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col h-full bg-gray-50 dark:bg-gray-900">
        {activeChat ? (
          <>
            {/* Chat Header */}
            <div className="px-6 py-3 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center shadow-sm">
              <div className="flex items-center">
                <div className="relative">
                  <img
                    src={activeContact?.avatar}
                    alt={activeContact?.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  {activeContact?.online && (
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></span>
                  )}
                </div>
                <div className="ml-4">
                  <h2 className="text-lg font-bold text-gray-800 dark:text-white">
                    {activeContact?.name}
                  </h2>
                  <p className="text-xs text-green-500 font-medium">
                    {activeContact?.online ? "Online" : "Offline"}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-300">
                  <Phone size={20} />
                </button>
                <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-300">
                  <Video size={20} />
                </button>
                <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-300">
                  <MoreVertical size={20} />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50 dark:bg-gray-900 custom-scrollbar">
              {/* Date separator example */}
              <div className="flex justify-center my-4">
                <span className="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full text-xs font-medium">
                  Today
                </span>
              </div>

              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${
                    msg.senderId === "me" ? "justify-end" : "justify-start"
                  }`}
                >
                  {msg.senderId !== "me" && (
                    <img
                      src={activeContact?.avatar}
                      alt="sender"
                      className="w-8 h-8 rounded-full object-cover mr-2 self-end mb-1"
                    />
                  )}
                  <div
                    className={`max-w-[70%] px-4 py-2 rounded-2xl shadow-sm relative group ${
                      msg.senderId === "me"
                        ? "bg-indigo-600 text-white rounded-br-none"
                        : "bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-bl-none"
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{msg.text}</p>
                    <div
                      className={`flex items-center justify-end mt-1 space-x-1 ${
                        msg.senderId === "me"
                          ? "text-indigo-200"
                          : "text-gray-400"
                      }`}
                    >
                      <span className="text-[10px]">{msg.time}</span>
                      {msg.senderId === "me" && (
                        <span>
                          {msg.status === "sent" && <Check size={12} />}
                          {msg.status === "delivered" && (
                            <CheckCheck size={12} />
                          )}
                          {msg.status === "read" && (
                            <CheckCheck size={12} className="text-blue-300" />
                          )}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
              <form
                onSubmit={handleSendMessage}
                className="flex items-center space-x-2"
              >
                <div className="flex items-center space-x-2 text-gray-400">
                  <button
                    type="button"
                    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <Smile size={24} />
                  </button>
                  <button
                    type="button"
                    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <Paperclip size={24} />
                  </button>
                </div>

                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    placeholder="Type a message..."
                    className="w-full pl-5 pr-12 py-3 rounded-xl bg-gray-100 dark:bg-gray-700 border-none focus:ring-2 focus:ring-indigo-500 text-gray-700 dark:text-gray-200 placeholder-gray-400 focus:outline-none transition-all"
                  />
                </div>

                {messageInput.trim() ? (
                  <button
                    type="submit"
                    className="p-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-lg transition-all transform hover:scale-105"
                  >
                    <Send size={24} className="ml-1" />
                  </button>
                ) : (
                  <button
                    type="button"
                    className="p-3 bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-300 rounded-full transition-all"
                  >
                    <Mic size={24} />
                  </button>
                )}
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col justify-center items-center text-center p-8 text-gray-500">
            <div className="w-24 h-24 bg-indigo-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
              <span className="text-4xl">👋</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
              Welcome to User Chat
            </h3>
            <p>Select a conversation from the sidebar to start chatting.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;
