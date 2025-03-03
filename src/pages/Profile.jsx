import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { Star, Award } from 'lucide-react';

const Profile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [projects, setProjects] = useState([]);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    skills: '',
    hourly_rate: '',
    portfolio_url: '',
  });

  useEffect(() => {
    fetchProfileData();
  }, [user]);

  const fetchProfileData = async () => {
    try {
      // Charger le profil
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      setProfile(profileData);
      setFormData({
        name: profileData.name,
        description: profileData.description || '',
        skills: profileData.skills?.join(', ') || '',
        hourly_rate: profileData.hourly_rate || '',
        portfolio_url: profileData.portfolio_url || '',
      });

      // Charger les évaluations
      const { data: reviewsData } = await supabase
        .from('reviews')
        .select(`
          *,
          reviewer:profiles!reviews_reviewer_id_fkey(name),
          project:projects(title)
        `)
        .eq('reviewed_id', user.id);

      setReviews(reviewsData);

      // Charger les projets
      const { data: projectsData } = await supabase
        .from('projects')
        .select('*')
        .or(`client_id.eq.${user.id},freelance_id.eq.${user.id}`)
        .order('created_at', { ascending: false });

      setProjects(projectsData);
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          name: formData.name,
          description: formData.description,
          skills: formData.skills.split(',').map(s => s.trim()),
          hourly_rate: formData.hourly_rate ? parseFloat(formData.hourly_rate) : null,
          portfolio_url: formData.portfolio_url,
        })
        .eq('id', user.id);

      if (error) throw error;
      setEditing(false);
      fetchProfileData();
    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil:', error);
    }
  };

  const averageRating = reviews.length
    ? (reviews.reduce((acc, rev) => acc + rev.rating, 0) / reviews.length).toFixed(1)
    : 0;

  return (
    <div className="min-h-screen pt-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Profil principal */}
          <div className="bg-glass-primary rounded-xl border border-white/10 p-6">
            {editing ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-1">
                    Nom
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-1">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                    rows="4"
                  />
                </div>
                {profile?.user_type === 'freelance' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-200 mb-1">
                        Compétences (séparées par des virgules)
                      </label>
                      <input
                        type="text"
                        value={formData.skills}
                        onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-200 mb-1">
                        Taux horaire (€)
                      </label>
                      <input
                        type="number"
                        value={formData.hourly_rate}
                        onChange={(e) => setFormData({ ...formData, hourly_rate: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-200 mb-1">
                        URL du portfolio
                      </label>
                      <input
                        type="url"
                        value={formData.portfolio_url}
                        onChange={(e) => setFormData({ ...formData, portfolio_url: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                  </>
                )}
                <div className="flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg"
                  >
                    Enregistrer
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={() => setEditing(false)}
                    className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg"
                  >
                    Annuler
                  </motion.button>
                </div>
              </form>
            ) : (
              <>
                <div className="flex justify-between items-start mb-6">
                  <h2 className="text-2xl font-bold text-white">{profile?.name}</h2>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setEditing(true)}
                    className="bg-white/10 hover:bg-white/20 text-white px-3 py-1 rounded-lg text-sm"
                  >
                    Modifier
                  </motion.button>
                </div>
                <div className="space-y-4">
                  <p className="text-gray-300">{profile?.description}</p>
                  {profile?.user_type === 'freelance' && (
                    <>
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-2">Compétences</h3>
                        <div className="flex flex-wrap gap-2">
                          {profile?.skills?.map((skill, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-primary-500/20 text-primary-300 rounded-full text-sm"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-2">Taux horaire</h3>
                        <p className="text-primary-400 font-medium">{profile?.hourly_rate}€/h</p>
                      </div>
                      {profile?.portfolio_url && (
                        <div>
                          <h3 className="text-lg font-semibold text-white mb-2">Portfolio</h3>
                          <a
                            href={profile.portfolio_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary-400 hover:text-primary-300 underline"
                          >
                            Voir le portfolio
                          </a>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Statistiques et évaluations */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-glass-primary rounded-xl border border-white/10 p-6">
              <h3 className="text-xl font-bold text-white mb-4">Statistiques</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white/5 rounded-lg p-4">
                  <p className="text-gray-400 text-sm">Projets terminés</p>
                  <p className="text-2xl font-bold text-white">
                    {projects.filter(p => p.status === 'termine').length}
                  </p>
                </div>
                <div className="bg-white/5 rounded-lg p-4">
                  <p className="text-gray-400 text-sm">Note moyenne</p>
                  <div className="flex items-center">
                    <p className="text-2xl font-bold text-white mr-2">{averageRating}</p>
                    <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  </div>
                </div>
                <div className="bg-white/5 rounded-lg p-4">
                  <p className="text-gray-400 text-sm">Projets en cours</p>
                  <p className="text-2xl font-bold text-white">
                    {projects.filter(p => p.status === 'en_cours').length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-glass-primary rounded-xl border border-white/10 p-6">
              <h3 className="text-xl font-bold text-white mb-4">Évaluations</h3>
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div
                    key={review.id}
                    className="bg-white/5 rounded-lg p-4 border border-white/10"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-medium text-white">{review.reviewer.name}</p>
                        <p className="text-sm text-gray-400">{review.project.title}</p>
                      </div>
                      <div className="flex items-center">
                        <p className="text-yellow-400 mr-1">{review.rating}</p>
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      </div>
                    </div>
                    <p className="text-gray-300">{review.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;