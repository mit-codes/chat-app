import React, { useState } from "react";
import {
  Search,
  Phone,
  Video,
  Send,
  Paperclip,
  Smile,
  Mic,
  Check,
  CheckCheck,
  Hash,
  Users,
  Sparkles,
  UserPlus,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../services/api";
import { useEffect } from "react";

const Chat = () => {
  const [activeChat, setActiveChat] = useState(null);
  const [messageInput, setMessageInput] = useState("");
  const [privateChat, setPrivateChat] = useState(false);
  const [groupeChat, setGroupeChat] = useState(false);
  const [contactNumber, setContactNumber] = useState("");
  const user = JSON.parse(localStorage.getItem("user"));
  // Demo Data
  const [contacts, setContacts] = useState([]);

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
    console.log("Sending:", messageInput);
    setMessageInput("");
  };

  const handleNewChat = async () => {
    console.log("Starting chat with:", contactNumber);
    await api
      .post("/conversation/create-private", {
        myMobile: user.mobile,
        autherMobile: contactNumber,
      })
      .then((Data) => {
        console.log("Chat started successfully", Data);
        getConversations();
        setPrivateChat(false);
      })
      .catch((error) => {
        console.error("Error starting chat:", error);
      });
  };

  const getConversations = async () => {
    try {
      const response = await api.get("/conversation/getMyConversations", {});
      console.log(response);
      console.log("Conversations fetched successfully", response);
      setContacts(response.conversations);
    } catch (error) {
      console.error("Error fetching conversations:", error);
    }
  };

  useEffect(() => {
    getConversations();
  }, []);

  const activeContact = contacts.find((c) => c.id === activeChat);

  return (
    <div className="flex h-screen bg-bg-deep overflow-hidden relative">
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 blur-[128px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/5 blur-[128px] pointer-events-none" />

      <div className="w-1/4 max-w-sm glass border-r border-white/10 flex flex-col z-10">
        {/* Sidebar Header */}
        <div className="p-6 flex justify-between items-center">
          <h1 className="text-3xl font-black bg-gradient-to-r from-white to-white/40 bg-clip-text text-transparent">
            Vibe
          </h1>
          <div className="flex space-x-2">
            <button className="p-2 rounded-xl hover:bg-white/5 text-slate-400 transition-colors cursor-pointer">
              <Users size={20} />
            </button>
            <button
              onClick={() => setPrivateChat(true)}
              className="p-2 rounded-xl hover:bg-white/5 text-slate-400 transition-colors cursor-pointer"
            >
              <UserPlus size={20} />
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="px-6 pb-6">
          <div className="relative group">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors"
              size={18}
            />
            <input
              type="text"
              placeholder="Search vibe..."
              className="w-full pl-12 pr-4 py-3 rounded-2xl bg-white/5 border border-white/5 focus:outline-none focus:ring-2 focus:ring-primary/50 text-white placeholder:text-slate-600 transition-all"
            />
          </div>
        </div>

        {/* Contacts List */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {contacts.map((contact, idx) => (
            <div
              key={contact.id}
              onClick={() => setActiveChat(contact.id)}
              className={`flex items-center mx-4 my-1 p-4 rounded-2xl cursor-pointer transition-all duration-200 ${
                activeChat === contact.id
                  ? "bg-white/10 border border-white/10 shadow-lg"
                  : "hover:bg-white/5 border border-transparent"
              }`}
            >
              <div className="relative">
                <img
                  src={contact.avatar}
                  alt={contact.name}
                  className="w-14 h-14 rounded-2xl object-cover"
                />
                {contact.online && (
                  <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-4 border-[#121b2e] rounded-full" />
                )}
              </div>
              <div className="ml-4 flex-1">
                <div className="flex justify-between items-baseline">
                  <h3
                    className={`font-bold ${
                      activeChat === idx ? "text-white" : "text-slate-300"
                    }`}
                  >
                    {contact.name}
                  </h3>
                  <span className="text-[10px] uppercase font-black text-slate-500">
                    {contact.time}
                  </span>
                </div>
                <p className="text-xs text-slate-500 truncate w-40 mt-1">
                  {contact.lastMessage}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col h-full z-10">
        {activeChat ? (
          <>
            {/* Chat Header */}
            <div className="px-8 py-5 border-b border-white/5 flex justify-between items-center bg-transparent backdrop-blur-md">
              <div className="flex items-center">
                <div className="relative">
                  <img
                    src={activeContact?.avatar}
                    alt={activeContact?.name}
                    className="w-12 h-12 rounded-2xl object-cover border border-white/10"
                  />
                  {activeContact?.online && (
                    <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-green-500 border-4 border-[#0f172a] rounded-full" />
                  )}
                </div>
                <div className="ml-4">
                  <h2 className="text-xl font-black text-white">
                    {activeContact?.name}
                  </h2>
                  <div className="flex items-center">
                    <span
                      className={`w-1.5 h-1.5 rounded-full mr-2 ${
                        activeContact?.online
                          ? "bg-green-500 shadow-sm"
                          : "bg-slate-600"
                      }`}
                    />
                    <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                      {activeContact?.online
                        ? "Active Now"
                        : "Currently Offline"}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button className="p-3 rounded-2xl hover:bg-white/5 text-slate-400 hover:text-white transition-all">
                  <Phone size={20} />
                </button>
                <button className="p-3 rounded-2xl hover:bg-white/5 text-slate-400 hover:text-white transition-all">
                  <Video size={20} />
                </button>
                <button className="p-3 rounded-2xl hover:bg-white/5 text-slate-400 hover:text-white transition-all">
                  <Hash size={20} />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar">
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
                      className="w-8 h-8 rounded-xl object-cover mr-3 self-end mb-1 border border-white/10"
                      alt=""
                    />
                  )}
                  <div
                    className={`px-5 py-3.5 rounded-3xl max-w-sm shadow-xl ${
                      msg.senderId === "me"
                        ? "bg-gradient-to-br from-primary to-primary/80 text-white rounded-br-none shadow-primary/20"
                        : "glass-morphism text-slate-200 rounded-bl-none"
                    }`}
                  >
                    <p className="text-sm font-medium leading-relaxed">
                      {msg.text}
                    </p>
                    <div
                      className={`flex items-center justify-end mt-1.5 space-x-1.5 ${
                        msg.senderId === "me"
                          ? "text-white/60"
                          : "text-slate-500"
                      }`}
                    >
                      <span className="text-[9px] font-black uppercase tracking-tighter">
                        {msg.time}
                      </span>
                      {msg.senderId === "me" && (
                        <span className="opacity-80">
                          {msg.status === "sent" && <Check size={10} />}
                          {msg.status === "delivered" && (
                            <CheckCheck size={10} />
                          )}
                          {msg.status === "read" && (
                            <CheckCheck size={10} className="text-accent" />
                          )}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Input Area */}
            <div className="px-8 pb-8 pt-4">
              <div className="glass-morphism p-3 rounded-3xl flex items-center space-x-3">
                <button className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-all">
                  <Smile size={24} />
                </button>
                <button className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-all">
                  <Paperclip size={24} />
                </button>

                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    placeholder="Type a message..."
                    className="w-full bg-white/5 border border-white/5 rounded-2xl py-3 px-5 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  />
                </div>

                <AnimatePresence mode="wait">
                  <motion.button
                    key="send"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    transition={{ duration: 0.1 }}
                    type="submit"
                    onClick={handleSendMessage}
                    className="p-3.5 bg-primary text-white rounded-2xl shadow-lg shadow-primary/20 active:scale-95 transition-all"
                  >
                    <Send size={22} />
                  </motion.button>
                </AnimatePresence>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col justify-center items-center text-center p-8">
            <div className="w-32 h-32 bg-gradient-to-tr from-primary/20 to-secondary/20 rounded-[40px] flex items-center justify-center mb-8 border border-white/5">
              <Sparkles className="text-primary w-16 h-16" />
            </div>
            <h3 className="text-4xl font-black text-white mb-4">
              Select a vibe
            </h3>
            <p className="text-slate-500 max-w-xs font-medium">
              Choose a conversation from the sidebar to join the conversation.
            </p>
          </div>
        )}

        {/* Private Chat Dialog */}
        {privateChat && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setPrivateChat(false)}
              className="absolute inset-0 bg-bg-deep/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="w-full max-w-md glass border border-white/10 rounded-[32px] p-8 relative z-10 shadow-2xl"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-primary/20 rounded-3xl flex items-center justify-center mb-6 border border-primary/20">
                  <UserPlus className="text-primary w-10 h-10" />
                </div>
                <h2 className="text-3xl font-black text-white mb-2">
                  New Vibe
                </h2>
                <p className="text-slate-400 mb-8 font-medium">
                  Enter a mobile number to start a private conversation.
                </p>

                <div className="w-full space-y-4">
                  <div className="relative group">
                    <Phone
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors"
                      size={20}
                    />
                    <input
                      type="tel"
                      value={contactNumber}
                      onChange={(e) => setContactNumber(e.target.value)}
                      placeholder="Mobile number..."
                      className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/5 border border-white/10 focus:outline-none focus:ring-2 focus:ring-primary/50 text-white placeholder:text-slate-600 transition-all font-bold"
                    />
                  </div>

                  <div className="flex gap-4">
                    <button
                      onClick={() => setPrivateChat(false)}
                      className="flex-1 px-6 py-4 rounded-2xl bg-white/5 text-slate-400 font-bold hover:bg-white/10 transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleNewChat}
                      className="flex-[2] px-6 py-4 rounded-2xl bg-primary text-white font-bold shadow-lg shadow-primary/20 active:scale-95 transition-all"
                    >
                      Start Chat
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;
