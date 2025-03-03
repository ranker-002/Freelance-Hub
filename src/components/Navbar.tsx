import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { GlobeIcon, Menu, X, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <nav className="fixed w-full z-50 backdrop-blur-xl bg-glass-primary border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <motion.div
              whileHover={{ scale: 1.1, rotate: 360 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.8 }}
            >
              <GlobeIcon className="h-8 w-8 text-primary-400" />
            </motion.div>
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-xl font-bold bg-gradient-to-r from-primary-400 to-primary-200 bg-clip-text text-transparent"
            >
              FreelanceHub
            </motion.span>
          </Link>
          
          <div className="hidden md:flex items-center space-x-8">
            <NavLink href="/browse">Parcourir</NavLink>
            <NavLink href="/projects">Projets</NavLink>
            {user ? (
              <>
                <NavLink href="/dashboard">Tableau de bord</NavLink>
                <NavLink href="/messages">Messages</NavLink>
                <NavLink href="/profile">Profil</NavLink>
                <button 
                  onClick={handleLogout}
                  className="text-gray-300 hover:text-white flex items-center gap-1"
                >
                  <LogOut className="h-4 w-4" />
                  Déconnexion
                </button>
              </>
            ) : (
              <>
                <NavLink href="/login" className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-primary-500/20">
                  Connexion
                </NavLink>
                <NavLink href="/register" className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-all duration-300">
                  Inscription
                </NavLink>
              </>
            )}
          </div>
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-gray-300 hover:text-white"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </motion.button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-glass-primary border-t border-white/10"
          >
            <div className="px-4 py-4 space-y-4">
              <MobileNavLink href="/browse">Parcourir</MobileNavLink>
              <MobileNavLink href="/projects">Projets</MobileNavLink>
              {user ? (
                <>
                  <MobileNavLink href="/dashboard">Tableau de bord</MobileNavLink>
                  <MobileNavLink href="/messages">Messages</MobileNavLink>
                  <MobileNavLink href="/profile">Profil</MobileNavLink>
                  <button 
                    onClick={handleLogout}
                    className="w-full text-left text-gray-300 hover:text-white flex items-center gap-2 py-2"
                  >
                    <LogOut className="h-4 w-4" />
                    Déconnexion
                  </button>
                </>
              ) : (
                <>
                  <MobileNavLink href="/login" className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg block text-center">
                    Connexion
                  </MobileNavLink>
                  <MobileNavLink href="/register" className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg block text-center">
                    Inscription
                  </MobileNavLink>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const NavLink = ({ href, children, className = '' }) => (
  <motion.div whileHover={{ y: -2 }}>
    <Link
      to={href}
      className={`text-gray-300 hover:text-white transition-colors ${className}`}
    >
      {children}
    </Link>
  </motion.div>
);

const MobileNavLink = ({ href, children, className = '' }) => (
  <motion.div
    whileHover={{ x: 5 }}
    whileTap={{ scale: 0.95 }}
  >
    <Link
      to={href}
      className={`block text-gray-300 hover:text-white transition-colors ${className}`}
    >
      {children}
    </Link>
  </motion.div>
);

export default Navbar;