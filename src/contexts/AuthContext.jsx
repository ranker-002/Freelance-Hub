import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('freelance_user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      fetchUserProfile(parsedUser.id);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUserProfile = async (userId) => {
    try {
        const response = await fetch(`http://localhost:5000/api/profiles/${userId}`, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${user?.token}` },
        });

        if (!response.ok) {
            throw new Error('Erreur lors du chargement du profil');
        }

        const profile = await response.json();
        setUserProfile(profile);
    } catch (error) {
        console.error('Erreur lors du chargement du profil:', error);
    } finally {
        setLoading(false);
    }
};


  const signUp = async (data) => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Erreur lors de l'inscription");

      const newUser = {
        id: result.userId,
        email: data.email,
        userType: data.userType,
      };

      setUser(newUser);
      localStorage.setItem('freelance_user', JSON.stringify(newUser));

      await fetchUserProfile(newUser.id);

      return { data: { user: newUser }, error: null };
    } catch (error) {
      return { data: null, error };
    }
  };

  const signIn = async (data) => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Erreur lors de la connexion");

      const user = {
        id: result.userId,
        email: data.email,
        userType: result.userType,
        token: result.token,
      };

      setUser(user);
      localStorage.setItem('freelance_user', JSON.stringify(user));

      await fetchUserProfile(user.id);

      return { data: { user }, error: null };
    } catch (error) {
      return { data: null, error };
    }
  };

  const signOut = async () => {
    try {
      setUser(null);
      setUserProfile(null);
      localStorage.removeItem('freelance_user');
      return { error: null };
    } catch (error) {
      return { error };
    }
  };

  const value = {
    signUp,
    signIn,
    signOut,
    user,
    userProfile,
    isClient: userProfile?.user_type === 'client',
    isFreelance: userProfile?.user_type === 'freelance',
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  return useContext(AuthContext);
};