import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { Clock, DollarSign, User, Send, Star } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

const ProjectDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [project, setProject] = useState(null);
  const [proposals, setProposals] = useState([]);
  const [newProposal, setNewProposal] = useState({
    price: '',
    description: '',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjectDetails();
  }, [id]);

  const fetchProjectDetails = async () => {
    try {
      // Charger les détails du projet
      const { data: projectData, error: projectError } = await supabase
        .from('projects')
        .select(`
          *,
          client:profiles!projects_client_id_fkey(*),
          freelance:profiles!projects_freelance_id_fkey(*)
        `)
        .eq('id', id)
        .single();

      if (projectError) throw projectError;
      setProject(projectData);

      // Charger les propositions si l'utilisateur est le client
      if (projectData.client_id === user.id) {
        const { data: proposalsData, error: proposalsError } = await supabase
          .from('proposals')
          .select(`
            *,
            freelance:profiles!proposals_freelance_id_fkey(*)
          `)
          .eq('project_id', id)
          .order('created_at', { ascending: false });

        if (proposalsError) throw proposalsError;
        setProposals(proposalsData);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des détails:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProposalSubmit = async (e) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from('proposals')
        .insert([
          {
            project_id: id,
            freelance_id: user.id,
            price: parseFloat(newProposal.price),
            description: newProposal.description,
          },
        ]);

      if (error) throw error;
      setNewProposal({ price: '', description: '' });
      fetchProjectDetails();
    } catch (error) {
      console.error('Erreur lors de l\'envoi de la proposition:', error);
    }
  };

  const acceptProposal = async (proposalId, freelanceId) => {
    try {
      // Mettre à jour le statut de la proposition
      const { error: proposalError } = await supabase
        .from('proposals')
        .update({ status: 'accepte' })
        .eq('id', proposalId);

      if (proposalError) throw proposalError;

      // Mettre à jour le projet
      const { error: projectError } = await supabase
        .from('projects')
        .update({
          status: 'en_cours',
          freelance_id: freelanceId,
        })
        .eq('id', id);

      if (projectError) throw projectError;

      fetchProjectDetails();
    } catch (error) {
      console.error('Erreur lors de l\'acceptation de la proposition:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-white/10 rounded w-1/4"></div>
            <div className="h-32 bg-white/10 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Détails du projet */}
          <div className="lg:col-span-2 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-glass-primary rounded-xl border border-white/10 p-6"
            >
              <div className="flex justify-between items-start mb-6">
                <h1 className="text-3xl font-bold text-white">{project.title}</h1>
                <span className={`px-3 py-1 rounded-full text-sm ${
                  project.status === 'en_cours'
                    ? 'bg-green-500/20 text-green-300'
                    : project.status === 'en_attente'
                    ? 'bg-yellow-500/20 text-yellow-300'
                    : 'bg-blue-500/20 text-blue-300'
                }`}>
                  {project.status}
                </span>
              </div>
              <p className="text-gray-300 mb-6">{project.description}</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center space-x-2 text-gray-300">
                  <Clock className="h-5 w-5 text-primary-400" />
                  <span>
                    {formatDistanceToNow(new Date(project.created_at), {
                      addSuffix: true,
                      locale: fr,
                    })}
                  </span>
                </div>
                <div className="flex items-center space-x-2 text-gray-300">
                  <DollarSign className="h-5 w-5 text-primary-400" />
                  <span>{project.budget}€</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-300">
                  <User className="h-5 w-5 text-primary-400" />
                  <span>{project.client.name}</span>
                </div>
              </div>
            </motion.div>

            {/* Formulaire de proposition */}
            {project.status === 'en_attente' && user.id !== project.client_id && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-glass-primary rounded-xl border border-white/10 p-6"
              >
                <h2 className="text-xl font-bold text-white mb-4">Faire une proposition</h2>
                <form onSubmit={handleProposalSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-200 mb-1">
                      Prix proposé (€)
                    </label>
                    <input
                      type="number"
                      value={newProposal.price}
                      onChange={(e) => setNewProposal({ ...newProposal, price: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-200 mb-1">
                      Description de votre proposition
                    </label>
                    <textarea
                      value={newProposal.description}
                      onChange={(e) => setNewProposal({ ...newProposal, description: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                      rows="4"
                      required
                    />
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="w-full bg-primary-500 hover:bg-primary-600 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <Send className="h-5 w-5" />
                    Envoyer la proposition
                  </motion.button>
                </form>
              </motion.div>
            )}
          </div>

          {/* Liste des propositions */}
          {user.id === project.client_id && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-white">Propositions</h2>
              {proposals.map((proposal) => (
                <motion.div
                  key={proposal.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-glass-primary rounded-xl border border-white/10 p-4"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-medium text-white">{proposal.freelance.name}</p>
                      <p className="text-primary-400 font-medium">{proposal.price}€</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-sm ${
                      proposal.status === 'accepte'
                        ? 'bg-green-500/20 text-green-300'
                        : proposal.status === 'refuse'
                        ? 'bg-red-500/20 text-red-300'
                        : 'bg-yellow-500/20 text-yellow-300'
                    }`}>
                      {proposal.status}
                    </span>
                  </div>
                  <p className="text-gray-300 mb-4">{proposal.description}</p>
                  {project.status === 'en_attente' && proposal.status === 'en_attente' && (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => acceptProposal(proposal.id, proposal.freelance_id)}
                      className="w-full bg-primary-500 hover:bg-primary-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                    >
                      Accepter la proposition
                    </motion.button>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;