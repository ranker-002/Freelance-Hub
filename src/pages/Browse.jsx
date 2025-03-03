import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { Search, Filter, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

const Browse = () => {
  const [freelancers, setFreelancers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [availableSkills, setAvailableSkills] = useState([
    'React', 'Node.js', 'TypeScript', 'JavaScript', 'Python', 'PHP', 'Laravel',
    'Vue.js', 'Angular', 'UI/UX Design', 'Graphic Design', 'WordPress', 'SEO',
    'Marketing', 'Content Writing', 'Mobile Development', 'DevOps'
  ]);

  useEffect(() => {
    fetchFreelancers();
  }, []);

  const fetchFreelancers = async () => {
    try {
      // Simuler le chargement des freelancers
      const mockFreelancers = [
        {
          id: '1',
          name: 'Sophie Martin',
          user_type: 'freelance',
          skills: ['React', 'TypeScript', 'UI/UX Design'],
          hourly_rate: 45,
          description: 'Développeuse front-end spécialisée dans les interfaces modernes et réactives.',
          rating: 4.8,
          projects_completed: 24,
          avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80'
        },
        {
          id: '2',
          name: 'Thomas Dubois',
          user_type: 'freelance',
          skills: ['Node.js', 'Express', 'MongoDB'],
          hourly_rate: 50,
          description: 'Développeur back-end avec 6 ans d\'expérience dans les architectures cloud.',
          rating: 4.9,
          projects_completed: 31,
          avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80'
        },
        {
          id: '3',
          name: 'Emma Leroy',
          user_type: 'freelance',
          skills: ['WordPress', 'SEO', 'Content Writing'],
          hourly_rate: 35,
          description: 'Spécialiste WordPress et SEO, je crée des sites optimisés pour le référencement.',
          rating: 4.7,
          projects_completed: 42,
          avatar_url: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80'
        },
        {
          id: '4',
          name: 'Lucas Bernard',
          user_type: 'freelance',
          skills: ['Python', 'Django', 'Data Science'],
          hourly_rate: 55,
          description: 'Data scientist et développeur Python, spécialisé dans l\'analyse de données et le machine learning.',
          rating: 4.9,
          projects_completed: 18,
          avatar_url: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80'
        },
        {
          id: '5',
          name: 'Julie Moreau',
          user_type: 'freelance',
          skills: ['Graphic Design', 'Illustration', 'Branding'],
          hourly_rate: 40,
          description: 'Designer graphique créative avec une passion pour l\'identité de marque et l\'illustration.',
          rating: 4.8,
          projects_completed: 37,
          avatar_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80'
        },
        {
          id: '6',
          name: 'Antoine Petit',
          user_type: 'freelance',
          skills: ['Mobile Development', 'React Native', 'Flutter'],
          hourly_rate: 60,
          description: 'Développeur mobile expérimenté, je crée des applications performantes pour iOS et Android.',
          rating: 4.9,
          projects_completed: 22,
          avatar_url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80'
        }
      ];
      
      setFreelancers(mockFreelancers);
    } catch (error) {
      console.error('Erreur lors du chargement des freelancers:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleSkill = (skill) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter(s => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const filteredFreelancers = freelancers.filter(freelancer => {
    const matchesSearch = freelancer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         freelancer.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSkills = selectedSkills.length === 0 || 
                         selectedSkills.some(skill => freelancer.skills.includes(skill));
    
    return matchesSearch && matchesSkills;
  });

  return (
    <div className="min-h-screen pt-20 px-4 pb-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Parcourir les freelances</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filtres */}
          <div className="space-y-6">
            <div className="bg-glass-primary rounded-xl border border-white/10 p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Rechercher..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>

            <div className="bg-glass-primary rounded-xl border border-white/10 p-4">
              <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                <Filter className="h-5 w-5 mr-2 text-primary-400" />
                Compétences
              </h3>
              <div className="space-y-2">
                {availableSkills.map((skill) => (
                  <button
                    key={skill}
                    onClick={() => toggleSkill(skill)}
                    className={`px-3 py-1 rounded-full text-sm mr-2 mb-2 transition-colors ${
                      selectedSkills.includes(skill)
                        ? 'bg-primary-500 text-white'
                        : 'bg-white/5 text-gray-300 hover:bg-white/10'
                    }`}
                  >
                    {skill}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Liste des freelancers */}
          <div className="lg:col-span-3 space-y-6">
            {loading ? (
              <div className="animate-pulse space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-white/5 rounded-xl h-40"></div>
                ))}
              </div>
            ) : filteredFreelancers.length > 0 ? (
              filteredFreelancers.map((freelancer) => (
                <motion.div
                  key={freelancer.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -5 }}
                  className="bg-glass-primary rounded-xl border border-white/10 p-6 transition-all duration-300 hover:border-primary-500/50"
                >
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex-shrink-0">
                      <img
                        src={freelancer.avatar_url}
                        alt={freelancer.name}
                        className="w-24 h-24 rounded-full object-cover border-2 border-primary-500/50"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h3 className="text-xl font-semibold text-white">{freelancer.name}</h3>
                        <div className="flex items-center">
                          <span className="text-yellow-400 mr-1">{freelancer.rating}</span>
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        </div>
                      </div>
                      <p className="text-primary-400 font-medium">{freelancer.hourly_rate}€/h</p>
                      <p className="text-gray-300 my-2">{freelancer.description}</p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {freelancer.skills.map((skill, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-primary-500/20 text-primary-300 rounded-full text-sm"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                      <div className="mt-4 flex justify-between items-center">
                        <span className="text-gray-400 text-sm">{freelancer.projects_completed} projets terminés</span>
                        <Link to={`/profile/${freelancer.id}`}>
                          <button className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg text-sm transition-colors">
                            Voir le profil
                          </button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="bg-glass-primary rounded-xl border border-white/10 p-6 text-center">
                <p className="text-gray-300">Aucun freelance ne correspond à votre recherche.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Browse;