import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { Send } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

const Messages = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchConversations();
    const subscription = supabase
      .channel('messages')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'messages' }, handleNewMessage)
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
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

  const fetchConversations = async () => {
    try {
      const { data: sentMessages } = await supabase
        .from('messages')
        .select('receiver_id')
        .eq('sender_id', user.id)
        .distinct();

      const { data: receivedMessages } = await supabase
        .from('messages')
        .select('sender_id')
        .eq('receiver_id', user.id)
        .distinct();

      const userIds = new Set([
        ...sentMessages.map(m => m.receiver_id),
        ...receivedMessages.map(m => m.sender_id)
      ]);

      const { data: users } = await supabase
        .from('profiles')
        .select('*')
        .in('id', Array.from(userIds));

      setConversations(users);
    } catch (error) {
      console.error('Erreur lors du chargement des conversations:', error);
    }
  };

  const fetchMessages = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          sender:profiles!messages_sender_id_fkey(name),
          receiver:profiles!messages_receiver_id_fkey(name)
        `)
        .or(`and(sender_id.eq.${user.id},receiver_id.eq.${userId}),and(sender_id.eq.${userId},receiver_id.eq.${user.id})`)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages(data);

      // Marquer les messages comme lus
      await supabase
        .from('messages')
        .update({ read: true })
        .eq('receiver_id', user.id)
        .eq('sender_id', userId);
    } catch (error) {
      console.error('Erreur lors du chargement des messages:', error);
    }
  };

  const handleNewMessage = (payload) => {
    if (payload.new && (payload.new.sender_id === selectedUser?.id || payload.new.receiver_id === selectedUser?.id)) {
      fetchMessages(selectedUser.id);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedUser) return;

    try {
      const { error } = await supabase
        .from('messages')
        .insert([
          {
            sender_id: user.id,
            receiver_id: selectedUser.id,
            content: newMessage.trim(),
          }
        ]);

      if (error) throw error;
      setNewMessage('');
    } catch (error) {
      console.error('Erreur lors de l\'envoi du message:', error);
    }
  };

  return (
    <div className="min-h-screen pt-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Liste des conversations */}
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
                  <p className="text-sm text-gray-400">{conv.user_type}</p>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Zone de messages */}
          <div className="md:col-span-3 bg-glass-primary rounded-xl border border-white/10 p-4 flex flex-col h-[calc(100vh-8rem)]">
            {selectedUser ? (
              <>
                <div className="border-b border-white/10 pb-4 mb-4">
                  <h2 className="text-xl font-bold text-white">
                    {selectedUser.name}
                  </h2>
                </div>

                <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.sender_id === user.id ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      <div
                        className={`max-w-[70%] p-3 rounded-lg ${
                          message.sender_id === user.id
                            ? 'bg-primary-500/20 text-white'
                            : 'bg-white/5 text-gray-200'
                        }`}
                      >
                        <p>{message.content}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          {formatDistanceToNow(new Date(message.created_at), {
                            addSuffix: true,
                            locale: fr,
                          })}
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