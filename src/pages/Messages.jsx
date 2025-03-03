import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Send } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const Messages = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!user) return;

    const fetchConversations = async () => {
      try {
        const { data } = await axios.get(`/api/conversations/${user.id}`);
        setConversations(data);
      } catch (error) {
        console.error('Erreur lors du chargement des conversations:', error);
      }
    };

    fetchConversations();
  }, [user]);

  useEffect(() => {
    if (selectedUser) {
      fetchMessages(selectedUser.id);
    }
  }, [selectedUser]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchMessages = async (userId) => {
    try {
      const { data } = await axios.get(`/api/messages/${user.id}/${userId}`);
      setMessages(data);

      await axios.put(`/api/messages/read`, { senderId: userId, receiverId: user.id });
    } catch (error) {
      console.error('Erreur lors du chargement des messages:', error);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedUser) return;

    try {
      await axios.post(`/api/messages/send`, {
        senderId: user.id,
        receiverId: selectedUser.id,
        content: newMessage.trim(),
      });
      setNewMessage('');
      fetchMessages(selectedUser.id);
    } catch (error) {
      console.error('Erreur lors de l\'envoi du message:', error);
    }
  };

  return (
    <div className="min-h-screen pt-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-glass-primary rounded-xl border border-white/10 p-4">
            <h2 className="text-xl font-bold text-white mb-4">Conversations</h2>
            <div className="space-y-2">
              {conversations.map((conv) => (
                <motion.button
                  key={conv.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedUser(conv)}
                  className={`w-full p-3 rounded-lg text-left transition-colors ${
                    selectedUser?.id === conv.id
                      ? 'bg-primary-500/20 border border-primary-500/30'
                      : 'bg-white/5 border border-white/10 hover:bg-white/10'
                  }`}
                >
                  <p className="font-medium text-white">{conv.name}</p>
                </motion.button>
              ))}
            </div>
          </div>

          <div className="md:col-span-3 bg-glass-primary rounded-xl border border-white/10 p-4 flex flex-col h-[calc(100vh-8rem)]">
            {selectedUser ? (
              <>
                <div className="border-b border-white/10 pb-4 mb-4">
                  <h2 className="text-xl font-bold text-white">{selectedUser.name}</h2>
                </div>

                <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.senderId === user.id ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[70%] p-3 rounded-lg ${message.senderId === user.id ? 'bg-primary-500/20 text-white' : 'bg-white/5 text-gray-200'}`}>
                        <p>{message.content}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true, locale: fr })}
                        </p>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                <form onSubmit={sendMessage} className="flex gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Écrivez votre message..."
                    className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    className="bg-primary-500 hover:bg-primary-600 text-white p-2 rounded-lg"
                  >
                    <Send className="h-5 w-5" />
                  </motion.button>
                </form>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-400">
                Sélectionnez une conversation pour commencer
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;
