import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Phone,
  Video,
  Send,
  Paperclip,
  Smile,
  Check,
  CheckCheck,
  Hash,
  Users,
  Sparkles,
  UserPlus,
  X,
  LogOut,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../services/api";
import { useEffect } from "react";
import io from "socket.io-client";
const socket = io("http://localhost:5000");

const Chat = () => {
  const navigate = useNavigate()
  const [activeChat, setActiveChat] = useState(null);
  const [messageInput, setMessageInput] = useState("");
  const [privateChat, setPrivateChat] = useState(false);
  const [groupeChat, setGroupeChat] = useState(false);
  const [contactNumber, setContactNumber] = useState("");
  const [contacts, setContacts] = useState([]);
  const [activeContact, setActiveContact] = useState(null);
  const [messages, setMessages] = useState([]);
  const [showContacts, setShowContacts] = useState(false);
  const [serchedContacts, setSerchedContacts] = useState([]);
  const [allConversation, setAllConversation] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const user = JSON.parse(localStorage.getItem("user"));

  // for new Grupe members
  const [groupName, setGroupName] = useState("");
  const [groupMembers, setGroupMembers] = useState([]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!messageInput.trim()) return;

    socket.emit("send-message", {
      roomId: activeContact.roomId,
      senderId: user.id,
      message: messageInput,
    });

    setMessageInput("");
  };

  const handleNewChat = async () => {
    await api
      .post("/conversation/create-private", {
        myMobile: user.mobile,
        autherMobile: contactNumber,
      })
      .then((data) => {
        getConversations();
        setGroupeChat(false);
      })
      .catch((error) => {
        console.error("Error starting chat:", error);
      });
  };

  const handleNewGroup = async () => {
    let menubar = groupMembers.map((con) => con.mobile);
    menubar.push(user.mobile);
    await api
      .post("/conversation/create-group", {
        groupName,
        members: menubar,
        admin: user.mobile,
      })
      .then((data) => {
        getConversations();
        setGroupMembers([]);
        setGroupeChat(false);
      })
      .catch((error) => {
        console.error("Error starting chat:", error);
      });
  };

  const getConversations = async () => {
    try {
      const response = await api.get("/conversation/getMyConversations");
      setContacts(response.conversations);
    } catch (error) {
      console.error("Error fetching conversations:", error);
    }
  };

  useEffect(() => {
    getConversations();
  }, []);

  useEffect(() => {
    socket.on("receive-message", (message) => {
      console.log("message : ", message);
      setMessages((prevMessages) => [...prevMessages, message]);
      console.log("messages : ", messages);
    });
  }, []);

  const handlerActiveChat = async (id) => {
    setActiveChat(id);
    const contact = contacts.find((c) => c.id === id);
    setActiveContact(contact);
    socket.emit("join-room", contact.roomId);
    try {
      const response = await api.get(`/chat/getChat`, {
        params: {
          roomId: contact.roomId,
        },
      });
      console.log("response : ", response);
      setMessages(response);
    } catch (error) {
      console.error("Error fetching chat history:", error);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim() === "") {
      setSerchedContacts(contacts);
    } else {
      const filtered = contacts.filter((contact) =>
        contact.name.toLowerCase().includes(query.toLowerCase()),
      );
      setSerchedContacts(filtered);
    }
  };

  const handlerAddGrupeMember = (contact) => {
    if (groupMembers.includes(contact)) {
      setGroupMembers(groupMembers.filter((con) => con != contact));
      return;
    }

    setGroupMembers((pre) => [...pre, contact]);
  };

  const handlerRemoveMemberGrupe = (contact) => {
    setGroupMembers(groupMembers.filter((con) => con != contact));
  };

  const logOut = () => {
    localStorage.clear();
    navigate("/login")
  }

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
            <button
              className="p-2 rounded-xl hover:bg-white/5 text-slate-400 transition-colors cursor-pointer"
              onClick={() => {
                setGroupeChat(true);
                setSerchedContacts(contacts);
              }}
            >
              <Users size={20} />
            </button>
            <button
              onClick={() => setPrivateChat(true)}
              className="p-2 rounded-xl hover:bg-white/5 text-slate-400 transition-colors cursor-pointer"
            >
              <UserPlus size={20} />
            </button>
            <button
              onClick={() => logOut()}
              className="p-2 rounded-xl hover:bg-white/5 text-slate-400 transition-colors cursor-pointer"
            >
              <LogOut size={20} />
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
          {contacts.map((contact) => (
            <div
              key={contact.id}
              onClick={() => handlerActiveChat(contact.id)}
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
                      activeChat === contact.id
                        ? "text-white"
                        : "text-slate-300"
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
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${
                    msg.senderId === user.id ? "justify-end" : "justify-start"
                  }`}
                >
                  {msg.senderId !== user.id && (
                    <img
                      src={activeContact?.avatar}
                      className="w-8 h-8 rounded-xl object-cover mr-3 self-end mb-1 border border-white/10"
                      alt=""
                    />
                  )}
                  <div
                    className={`px-5 py-3.5 rounded-3xl max-w-sm shadow-xl ${
                      msg.senderId === user.id
                        ? "bg-gradient-to-br from-primary to-primary/80 text-white rounded-br-none shadow-primary/20"
                        : "glass-morphism text-slate-200 rounded-bl-none"
                    }`}
                  >
                    <p className="text-sm font-medium leading-relaxed">
                      {msg.message}
                    </p>
                    <div
                      className={`flex items-center justify-end mt-1.5 space-x-1.5 ${
                        msg.senderId === user.id
                          ? "text-white/60"
                          : "text-slate-500"
                      }`}
                    >
                      <span className="text-[9px] font-black uppercase tracking-tighter">
                        {msg.time}
                      </span>
                      {msg.senderId === user.id && (
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
                <div className="w-20 h-20 bg-primary/20 rounded-3xl flex items-center justify-center border border-primary/20">
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

        {/* Groupe Chat Dialog */}
        {groupeChat && (
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setGroupeChat(false)}
              className="absolute inset-0 bg-bg-deep/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="w-full max-w-3xl glass border border-white/10 rounded-[32px] p-8 relative z-10 shadow-2xl"
            >
              <div className="flex justify-around">
                {/* Left side */}
                <div className="flex flex-col items-center text-center border-white/10 w-5/10">
                  {/* header */}
                  <div className="header w-70 flex justify-around items-center">
                    <div className="w-20 h-20 bg-primary/20 rounded-3xl flex items-center justify-center border border-primary/20">
                      <Users className="text-primary w-10 h-10" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-black text-white mb-2">
                        New Vibe
                      </h2>
                    </div>
                  </div>

                  <div className="w-full space-y-4 flex flex-col h-[90vh] max-h-[600px]">
                    {/* Search */}
                    <div className="py-4 border-b border-white/10">
                      <div className="relative group">
                        <Search
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors"
                          size={18}
                        />
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={(e) => handleSearch(e.target.value)}
                          placeholder="Search contacts..."
                          className="w-full pl-12 pr-4 py-3 rounded-2xl bg-white/5 border border-white/5 focus:outline-none focus:ring-2 focus:ring-primary/50 text-white placeholder:text-slate-600 transition-all"
                        />
                      </div>
                    </div>

                    {/* Contacts List */}
                    <div className="flex-1 overflow-y-auto custom-scrollbar">
                      {serchedContacts.length > 0 ? (
                        serchedContacts.map((contact) => (
                          <div
                            key={contact.id}
                            onClick={() => handlerAddGrupeMember(contact)}
                            className={`mx-4 my-2 p-4 rounded-2xl cursor-pointer transition-all duration-200 hover:bg-white/5 border border-transparent hover:border-white/10 ${groupMembers.includes(contact) ? "bg-white/5 border border-transparent border-white/10" : ""}`}
                          >
                            <div className="flex items-center">
                              <div className="relative">
                                <img
                                  src={contact.avatar}
                                  alt={contact.name}
                                  className="w-12 h-12 rounded-2xl object-cover"
                                />
                                {contact.online && (
                                  <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-3 border-[#121b2e] rounded-full" />
                                )}
                              </div>
                              <div className="ml-4 flex-1">
                                <div className="flex justify-between items-baseline">
                                  <h3 className="font-bold text-slate-200">
                                    {contact.name}
                                  </h3>
                                  <span className="text-[10px] uppercase font-black text-slate-500">
                                    {contact.online ? "Online" : "Offline"}
                                  </span>
                                </div>
                                <p className="text-xs text-slate-500 truncate w-40 mt-1">
                                  {contact.lastMessage || "No messages yet"}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="flex items-center justify-center h-full text-slate-400">
                          <p className="text-center">No contacts found</p>
                        </div>
                      )}
                    </div>

                    {/* Footer */}
                    <div className="p-4 border-t border-white/10">
                      <p className="text-xs text-slate-500 text-center">
                        {contacts.length} contact
                        {contacts.length !== 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Right side */}
                <div className="members w-4/10">
                  <h2 className="font-bold text-slate-200 p-2">
                    Groupe Name :{" "}
                  </h2>
                  <div className="relative group">
                    <Users
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors"
                      size={20}
                    />
                    <input
                      type="text"
                      onChange={(e) => setGroupName(e.target.value)}
                      required
                      placeholder=" ✌️ Cool doudes... ✌️  "
                      className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/5 border border-white/10 focus:outline-none focus:ring-2 focus:ring-primary/50 text-white placeholder:text-slate-600 transition-all font-bold"
                    />
                  </div>

                  <h2 className="py-4 border-b border-white/10">Members : </h2>
                  <div className="flex-1 overflow-y-auto custom-scrollbar">
                    {groupMembers.length > 0 ? (
                      groupMembers.map((contact) => (
                        <div
                          key={contact.id}
                          className="mx-4 my-2 p-4 rounded-2xl cursor-pointer transition-all duration-200 hover:bg-white/5 border border-transparent hover:border-white/10"
                        >
                          <div className="flex items-center">
                            <div className="relative">
                              <img
                                src={contact.avatar}
                                alt={contact.name}
                                className="w-12 h-12 rounded-2xl object-cover"
                              />
                            </div>

                            <div className="ml-4 flex-1">
                              <h3 className="font-bold text-slate-200">
                                {contact.name}
                              </h3>
                            </div>

                            <X
                              className="text-red-400"
                              onClick={() => {
                                handlerRemoveMemberGrupe(contact);
                              }}
                            />
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="flex items-center justify-center h-full text-slate-400">
                        <p className="text-center mt-2">
                          {" "}
                          No any members selected{" "}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Btn bottom */}
              <div className="flex gap-4">
                <button
                  onClick={() => setGroupeChat(false)}
                  className="flex-1 px-6 py-4 rounded-2xl bg-white/5 text-slate-400 font-bold hover:bg-white/10 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleNewGroup}
                  className="flex-[2] px-6 py-4 rounded-2xl bg-primary text-white font-bold shadow-lg shadow-primary/20 active:scale-95 transition-all"
                >
                  New group
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;
