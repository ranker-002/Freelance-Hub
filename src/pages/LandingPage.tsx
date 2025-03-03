import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Code, Briefcase, Users } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Scene from '../components/3d/Scene';

const LandingPage = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/register');
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      <Scene />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary-950/80 to-primary-950" />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <motion.h1 
              className="text-4xl sm:text-6xl font-bold text-white mb-6"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              <span className="bg-gradient-to-r from-primary-400 to-primary-200 bg-clip-text text-transparent">
                Trouvez les meilleurs talents
              </span>
              <br />
              pour vos projets
            </motion.h1>
            <motion.p 
              className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              Une plateforme moderne qui connecte les freelances talentueux avec des projets innovants.
            </motion.p>
            <motion.div 
              className="flex justify-center gap-4"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleGetStarted}
                className="px-8 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-medium flex items-center gap-2 backdrop-blur-sm"
              >
                Commencer <ArrowRight className="h-5 w-5" />
              </motion.button>
              <Link to="/browse">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-3 bg-glass-primary hover:bg-glass-secondary text-white rounded-lg font-medium border border-white/10 backdrop-blur-sm"
                >
                  En savoir plus
                </motion.button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Code className="h-8 w-8 text-primary-400" />}
              title="Développement"
              description="Trouvez des développeurs experts pour vos projets techniques."
              delay={0.2}
            />
            <FeatureCard
              icon={<Briefcase className="h-8 w-8 text-primary-400" />}
              title="Business"
              description="Des consultants qualifiés pour développer votre entreprise."
              delay={0.4}
            />
            <FeatureCard
              icon={<Users className="h-8 w-8 text-primary-400" />}
              title="Design"
              description="Des designers créatifs pour donner vie à vos idées."
              delay={0.6}
            />
          </div>
        </div>
      </section>
    </div>
  );
};

const FeatureCard = ({ icon, title, description, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.8 }}
    whileHover={{ y: -5, scale: 1.02 }}
    className="p-6 rounded-xl backdrop-blur-xl bg-glass-primary border border-white/10 hover:border-primary-500/50 transition-all duration-300"
  >
    <motion.div 
      className="mb-4"
      whileHover={{ rotate: 360 }}
      transition={{ duration: 0.8 }}
    >
      {icon}
    </motion.div>
    <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
    <p className="text-gray-300">{description}</p>
  </motion.div>
);

export default LandingPage;