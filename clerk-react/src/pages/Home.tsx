import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Plane, BookOpen, Wallet, ShoppingBag, CheckSquare, UtensilsCrossed, GraduationCap, Loader2 } from 'lucide-react';
import { useAuth } from '@clerk/clerk-react';
import { apiRequest } from '../lib/api';

interface Design {
  _id: string;
  projectName: string;
  theme: string;
  screens: any[];
  createdAt: string;
}

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [designType, setDesignType] = useState<'Mobile' | 'Website'>('Mobile');
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState<Design[]>([]);
  const [projectsLoading, setProjectsLoading] = useState(true);
  const navigate = useNavigate();
  const { getToken, isSignedIn } = useAuth();

  useEffect(() => {
    if (isSignedIn) {
      loadProjects();
    } else {
      setProjectsLoading(false);
    }
  }, [isSignedIn]);

  const loadProjects = async () => {
    try {
      const token = await getToken();
      if (token) {
        const data = await apiRequest('GET', '/api/designs/all', undefined, token);
        // Get only the 3 most recent projects
        setProjects(data.slice(0, 3));
      }
    } catch (error) {
      console.error('Error loading projects:', error);
    } finally {
      setProjectsLoading(false);
    }
  };

  const suggestedCategories = [
    { name: 'Travel Planner App', icon: Plane, prompt: 'Travel Planner App with itinerary, bookings, and map integration' },
    { name: 'AI Learning Platform', icon: BookOpen, prompt: 'AI Learning Platform with courses, progress tracking, and AI tutor' },
    { name: 'Finance Tracker', icon: Wallet, prompt: 'Finance Tracker with budget, expenses, and financial insights' },
    { name: 'E-Commerce Store', icon: ShoppingBag, prompt: 'E-Commerce Store with product catalog, cart, and checkout' },
    { name: 'Smart To-Do Planner', icon: CheckSquare, prompt: 'Smart To-Do Planner with tasks, reminders, and productivity stats' },
    { name: 'Food Delivery App', icon: UtensilsCrossed, prompt: 'Food Delivery App with restaurants, menu, and order tracking' },
    { name: 'Kids Learning App', icon: GraduationCap, prompt: 'Kids Learning App with interactive lessons and games' },
  ];

  const handleCategoryClick = (categoryPrompt: string) => {
    setPrompt(categoryPrompt);
  };

  const handleGenerate = async () => {
    if (!isSignedIn) {
      alert('Please sign in to generate designs');
      return;
    }
    
    if (!prompt.trim()) {
      alert('Please enter a prompt or select a category');
      return;
    }

    setLoading(true);
    try {
      const token = await getToken();
      const projectName = prompt.split(' ').slice(0, 3).join(' ') || 'New Project';
      
      const design = await apiRequest(
        'POST',
        '/api/designs/generate',
        { prompt, projectName, theme: 'SLACK' },
        token || undefined
      );
      navigate(`/canvas/${design._id}`);
    } catch (error: any) {
      console.error('Error generating design:', error);
      alert(error.message || 'Failed to generate design');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen mx-auto bg-gray-50 dark:bg-gray-900 pt-20 pb-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
            Design High Quality{' '}
            <span className="text-red-500 dark:text-red-400">Website</span>
            {' '}and{' '}
            <span className="text-red-500 dark:text-red-400">App</span>
            {' '}Designs
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
            From websites to mobile apps, we turn ideas into intuitive, high-impact digital experiences.
          </p>
        </div>

        {/* Input Section */}
        <div className="w-2xl  mx-auto mb-12 flex items-baseline gap-4 justify-center sm:items-center sm:flex-row flex-col">
          <div className="relative ">
            <input
              type="text "
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
              placeholder="Enter what design you want to create"
              className="w-120 h-40   px-3  py-4 pr-14 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-lg focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-transparent shadow-sm"
            />
            <button
              onClick={handleGenerate}
              disabled={loading}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-red-600 hover:bg-red-700 text-white p-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Sparkles className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Suggested Categories */}
        <div className="mb-20 mt-20">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6 text-center">
            Popular Categories
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {suggestedCategories.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.name}
                  onClick={() => handleCategoryClick(category.prompt)}
                  className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md hover:shadow-lg transition-all hover:scale-105 border border-gray-200 dark:border-gray-700 group"
                >
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 bg-red-50 dark:bg-red-900/20 rounded-lg flex items-center justify-center group-hover:bg-red-100 dark:group-hover:bg-red-900/30 transition-colors">
                      <Icon className="w-6 h-6 text-red-600 dark:text-red-400" />
                    </div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 text-center">
                      {category.name}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* My Projects Section */}
        {isSignedIn && (
          <div className="mt-16">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                My Projects
              </h2>
              <button
                onClick={() => navigate('/gallery')}
                className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-500 font-medium"
              >
                View All →
              </button>
            </div>

            {projectsLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
              </div>
            ) : projects.length === 0 ? (
              <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl">
                <p className="text-gray-600 dark:text-gray-400">
                  No projects yet. Create your first design above!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((design) => (
                  <div
                    key={design._id}
                    onClick={() => navigate(`/canvas/${design._id}`)}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer group"
                  >
                    {/* Thumbnail */}
                    <div className="h-48 bg-gray-100 dark:bg-gray-700 relative overflow-hidden">
                      {design.screens && design.screens.length > 0 ? (
                        <div
                          className="w-full h-full overflow-hidden transform scale-50 origin-top-left"
                          style={{ width: '200%', height: '200%' }}
                          dangerouslySetInnerHTML={{
                            __html: design.screens[0].html,
                          }}
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full text-gray-400">
                          No Preview
                        </div>
                      )}
                      <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                        {design.screens?.length || 0} screen(s)
                      </div>
                    </div>

                    {/* Info */}
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                        {design.projectName}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(design.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}