// Simulation de Supabase pour la démo visuelle
const createMockClient = () => {
  return {
    auth: {
      getSession: () => Promise.resolve({ data: { session: { user: { id: '123', email: 'demo@example.com' } } } }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      signUp: (data) => Promise.resolve({ data: { user: { id: '123', email: data.email } }, error: null }),
      signInWithPassword: (data) => Promise.resolve({ data: { user: { id: '123', email: data.email } }, error: null }),
      signOut: () => Promise.resolve({ error: null }),
    },
    from: (table) => ({
      select: (fields) => ({
        eq: (field, value) => ({
          single: () => Promise.resolve({ data: getMockData(table, value), error: null }),
          in: (field, values) => Promise.resolve({ data: getMockData(table, values), error: null }),
          or: (query) => Promise.resolve({ data: getMockData(table), error: null }),
          order: (field, options) => Promise.resolve({ data: getMockData(table), error: null }),
          distinct: () => Promise.resolve({ data: getMockData(table), error: null }),
        }),
        or: (query) => Promise.resolve({ data: getMockData(table), error: null }),
        order: (field, options) => Promise.resolve({ data: getMockData(table), error: null }),
      }),
      insert: (data) => Promise.resolve({ data, error: null }),
      update: (data) => ({
        eq: (field, value) => Promise.resolve({ data, error: null }),
      }),
    }),
    channel: (name) => ({
      on: (event, table, callback) => ({
        subscribe: () => {},
      }),
    }),
  };
};

export const supabase = createMockClient();

// Données fictives pour la démo
function getMockData(table, id) {
  const mockData = {
    profiles: [
      { id: '123', name: 'John Doe', user_type: 'freelance', skills: ['React', 'Node.js', 'TypeScript'], hourly_rate: 50, description: 'Développeur full-stack avec 5 ans d\'expérience' },
    ],
    projects: [
      { id: '1', title: 'Application Web E-commerce', description: 'Création d\'une boutique en ligne complète avec panier et paiement', budget: 3000, status: 'en_attente', client_id: '456', client: { name: 'Entreprise ABC' }, created_at: new Date().toISOString() },
      { id: '2', title: 'Refonte de Site Vitrine', description: 'Modernisation d\'un site existant avec design responsive', budget: 1500, status: 'en_cours', client_id: '456', freelance_id: '123', client: { name: 'Entreprise XYZ' }, freelance: { name: 'John Doe' }, created_at: new Date().toISOString() },
    ],
    proposals: [
      { id: '1', project_id: '1', freelance_id: '123', price: 2800, description: 'Je peux réaliser ce projet en 3 semaines avec toutes les fonctionnalités demandées', status: 'en_attente', freelance: { name: 'John Doe' }, created_at: new Date().toISOString() },
    ],
    messages: [
      { id: '1', sender_id: '123', receiver_id: '456', content: 'Bonjour, je suis intéressé par votre projet', read: true, created_at: new Date().toISOString(), sender: { name: 'John Doe' }, receiver: { name: 'Entreprise ABC' } },
      { id: '2', sender_id: '456', receiver_id: '123', content: 'Merci pour votre intérêt ! Pouvez-vous me donner plus de détails sur votre expérience ?', read: false, created_at: new Date().toISOString(), sender: { name: 'Entreprise ABC' }, receiver: { name: 'John Doe' } },
    ],
    reviews: [
      { id: '1', project_id: '2', reviewer_id: '456', reviewed_id: '123', rating: 5, comment: 'Excellent travail, livré dans les délais', created_at: new Date().toISOString(), reviewer: { name: 'Entreprise XYZ' }, project: { title: 'Refonte de Site Vitrine' } },
    ],
  };

  if (table === 'profiles' && id) {
    return mockData.profiles.find(p => p.id === id);
  } else if (table === 'projects' && id) {
    return mockData.projects.find(p => p.id === id);
  } else {
    return mockData[table] || [];
  }
}