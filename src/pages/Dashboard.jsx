import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Calendar, DollarSign, User, Briefcase, MessageSquare } from 'lucide-react';

const Dashboard = () => {
  const { user, userProfile } = useAuth();
  const [projects, setProjects] = useState([]);
  const [proposals, setProposals] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      // Simuler le chargement des données
      const mockProjects = [
        {
          id: '1',
          title: 'Application Web E-commerce',
          description: 'Création d\'une boutique en ligne complète avec panier et paiement',
          budget: 3000,
          status: 'en_attente',
          client_id: '456',
          client: { name: 'Entreprise ABC' },
          created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: '2',
          title: 'Refonte de Site Vitrine',
          description: 'Modernisation d\'un site existant avec design responsive',
          budget: 1500,
          status: 'en_cours',
          client_id: '456',
          freelance_id: '123',
          client: { name: 'Entreprise XYZ' },
          freelance: { name: 'John Doe' },
          created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        },
      ];
      
      const mockProposals = [
        {
          id: '1',
          project_id: '1',
          project: { title: 'Application Web E-commerce' },
          freelance_id: '123',
          price: 2800,
          description: 'Je peux réaliser ce projet en 3 semaines avec toutes les fonctionnalités demandées',
          status: 'en_attente',
          freelance: { name: 'John Doe' },
          created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        },
      ];
      
      const mockMessages = [
        {
          id: '1',
          sender_id: '123',
          receiver_id: '456',
          content: 'Bonjour, je suis intéressé par votre projet',
          read: true,
          created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          sender: { name: 'John Doe' },
          receiver: { name: 'Entreprise ABC' },
        },
        {
          id: '2',
          sender_id: '456',
          receiver_id: '123',
          content: 'Merci pour votre intérêt ! Pouvez-vous me donner plus de détails sur votre expérience ?',
          read: false,
          created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          sender: { name: 'Entreprise ABC' },
          receiver: { name: 'John Doe' },
        },
      ];
      
      setProjects(mockProjects);
      setProposals(mockProposals);
      setMessages(mockMessages);
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-white/10 rounded w-1/4"></div>
            <div className="h-32 bg-white/10 rounded"></div>
            <div className="h-64 bg-white/10 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 px-4 pb-10">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Tableau de bord</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-glass-primary p-6 rounded-xl border border-white/10"
          >
            <div className="flex items-center mb-4">
              <Briefcase className="h-6 w-6 text-primary-400 mr-2" />
              <h2 className="text-xl font-bold text-white">Projets</h2>
            </div>
            <div className="flex justify-between">
              <div className="text-center">
                <p className="text-3xl font-bold text-white">
                  {projects.filter(p => p.status === 'en_cours').length}
                </p>
                <p className="text-sm text-gray-400">En cours</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-white">
                  {projects.filter(p => p.status === 'en_attente').length}
                </p>
                <p className="text-sm text-gray-400">En attente</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-white">
                  {projects.filter(p => p.status === 'termine').length}
                </p>
                <p className="text-sm text-gray-400">Terminés</p>
              </div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-glass-primary p-6 rounded-xl border border-white/10"
          >
            <div className="flex items-center mb-4">
              <DollarSign className="h-6 w-6 text-primary-400 mr-2" />
              <h2 className="text-xl font-bold text-white">Propositions</h2>
            </div>
            <div className="flex justify-between">
              <div className="text-center">
                <p className="text-3xl font-bold text-white">
                  {proposals.filter(p => p.status === 'en_attente').length}
                </p>
                <p className="text-sm text-gray-400">En attente</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-white">
                  {proposals.filter(p => p.status === 'accepte').length}
                </p>
                <p className="text-sm text-gray-400">Acceptées</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-white">
                  {proposals.filter(p => p.status === 'refuse').length}
                </p>
                <p className="text-sm text-gray-400">Refusées</p>
              </div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-glass-primary p-6 rounded-xl border border-white/10"
          >
            <div className="flex items-center mb-4">
              <MessageSquare className="h-6 w-6 text-primary-400 mr-2" />
              <h2 className="text-xl font-bold text-white">Messages</h2>
            </div>
            <div className="flex justify-between">
              <div className="text-center">
                <p className="text-3xl font-bold text-white">
                  {messages.filter(m => !m.read && m.receiver_id === user.id).length}
                </p>
                <p className="text-sm text-gray-400">Non lus</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-white">
                  {messages.length}
                </p>
                <p className="text-sm text-gray-400">Total</p>
              </div>
              <div className="text-center">
                <Link to="/messages" className="bg-primary-500 hover:bg-primary-600 text-white px-3 py-1 rounded-lg text-sm">
                  Voir tous
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profil */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-glass-primary p-6 rounded-xl border border-white/10"
          >
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-bold text-white">Mon Profil</h2>
              <Link to="/profile" className="text-primary-400 hover:text-primary-300 text-sm">
                Modifier
              </Link>
            </div>
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="w-16 h-16 bg-primary-500/20 rounded-full flex items-center justify-center">
                  <User className="h-8 w-8 text-primary-400" />
                </div>
                <div className="ml-4">
                  <p className="text-lg font-semibold text-white">{userProfile?.name || 'John Doe'}</p>
                  <p className="text-gray-400">{userProfile?.user_type === 'freelance' ? 'Freelance' : 'Client'}</p>
                </div>
              </div>
              
              {userProfile?.user_type === 'freelance' && (
                <>
                  <div>
                    <p className="text-gray-300 font-medium">Taux horaire</p>
                    <p className="text-primary-400">{userProfile?.hourly_rate || 50}€/h</p>
                  </div>
                  <div>
                    <p className="text-gray-300 font-medium">Compétences</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {userProfile?.skills?.map((skill, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-primary-500/20 text-primary-300 rounded-full text-xs"
                        >
                          {skill}
                        </span>
                      )) || ['React', 'Node.js', 'TypeScript'].map((skill, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-primary-500/20 text-primary-300 rounded-full text-xs"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </motion.div>

          {/* Projets récents */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2 bg-glass-primary p-6 rounded-xl border border-white/10"
          >
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-bold text-white">Projets récents</h2>
              <Link to="/projects" className="text-primary-400 hover:text-primary-300 text-sm">
                Voir tous
              </Link>
            </div>
            <div className="space-y-4">
              {projects.length > 0 ? (
                projects.slice(0, 3).map((project) => (
                  <Link to={`/projects/${project.id}`} key={project.id}>
                    <div className="p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors">
                      <div className="flex justify-between items-start">
                        <h3 className="text-lg font-semibold text-white">{project.title}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          project.status === 'en_cours'
                            ? 'bg-green-500/20 text-green-300'
                            : project.status === 'en_attente'
                            ? 'bg-yellow-500/20 text-yellow-300'
                            : 'bg-blue-500/20 text-blue-300'
                        }`}>
                          {project.status.replace('_', ' ')}
                        </span>
                      </div>
                      <p className="text-gray-400 text-sm mb-2">
                        {formatDistanceToNow(new Date(project.created_at), {
                          addSuffix: true,
                          locale: fr,
                        })}
                      </p>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-primary-400">{project.budget}€</span>
                        <div className="flex items-center text-gray-400 text-sm">
                          <User className="h-4 w-4 mr-1" />
                          <span>{project.client.name}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="text-center py-8 text-gray-400">
                  <p>Aucun projet récent</p>
                  <Link to="/projects" className="text-primary-400 hover:text-primary-300 mt-2 inline-block">
                    Parcourir les projets
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;