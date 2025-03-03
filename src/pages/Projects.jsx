import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { Plus, Search, Calendar, DollarSign } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const Projects = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    budget: '',
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      // Simuler le chargement des projets
      const mockProjects = [
        {
          id: '1',
          title: 'Développement d\'une application mobile de livraison',
          description: 'Nous recherchons un développeur mobile expérimenté pour créer une application de livraison de repas avec géolocalisation et paiement intégré.',
          budget: 5000,
          status: 'en_attente',
          client_id: '456',
          client: { name: 'FoodTech SAS' },
          created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: '2',
          title: 'Refonte de site e-commerce',
          description: 'Modernisation complète d\'un site e-commerce existant avec migration vers une architecture headless et amélioration des performances.',
          budget: 3500,
          status: 'en_cours',
          client_id: '457',
          client: { name: 'ModaShop' },
          freelance_id: '123',
          freelance: { name: 'John Doe' },
          created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: '3',
          title: 'Création d\'une identité visuelle',
          description: 'Conception d\'un logo, charte graphique et supports de communication pour une nouvelle marque de produits bio.',
          budget: 1200,
          status: 'en_attente',
          client_id: '458',
          client: { name: 'NatureBio' },
          created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: '4',
          title: 'Développement d\'un tableau de bord analytique',
          description: 'Création d\'un dashboard interactif pour visualiser les données de vente et marketing avec filtres avancés et exports.',
          budget: 2800,
          status: 'termine',
          client_id: '459',
          client: { name: 'DataViz Corp' },
          freelance_id: '124',
          freelance: { name: 'Jane Smith' },
          created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: '5',
          title: 'Rédaction de contenu SEO',
          description: 'Rédaction de 20 articles optimisés pour le référencement sur la thématique du bien-être et de la santé.',
          budget: 800,
          status: 'en_cours',
          client_id: '460',
          client: { name: 'Wellness Blog' },
          freelance_id: '125',
          freelance: { name: 'Marie Dupont' },
          created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: '6',
          title: 'Intégration API de paiement',
          description: 'Intégration de Stripe et PayPal dans une application web existante avec gestion des abonnements et webhooks.',
          budget: 1500,
          status: 'en_attente',
          client_id: '461',
          client: { name: 'SaaS Platform' },
          created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        },
      ];
      
      setProjects(mockProjects);
    } catch (error) {
      console.error('Erreur lors du chargement des projets:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    try {
      // Simuler la création d'un projet
      const newProjectData = {
        id: Math.random().toString(36).substring(2, 15),
        ...newProject,
        budget: parseFloat(newProject.budget),
        status: 'en_attente',
        client_id: user.id,
        client: { name: 'Votre Entreprise' },
        created_at: new Date().toISOString(),
      };
      
      setProjects([newProjectData, ...projects]);
      setShowNewProjectModal(false);
      setNewProject({ title: '', description: '', budget: '' });
    } catch (error) {
      console.error('Erreur lors de la création du projet:', error);
    }
  };

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || project.status === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen pt-20 px-4 pb-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Projets</h1>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowNewProjectModal(true)}
            className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <Plus className="h-5 w-5" />
            Nouveau projet
          </motion.button>
        </div>

        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Rechercher un projet..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">Tous</option>
            <option value="en_attente">En attente</option>
            <option value="en_cours">En cours</option>
            <option value="termine">Terminé</option>
          </select>
        </div>

        {/* Reste du code... */}
      </div>
    </div>
  );
};

export default Projects;