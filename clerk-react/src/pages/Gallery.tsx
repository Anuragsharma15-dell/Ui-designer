import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import { Trash2, Eye } from 'lucide-react';
import { apiRequest } from '../lib/api';

export default function Gallery() {
  const [designs, setDesigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { getToken } = useAuth();

  useEffect(() => {
    loadDesigns();
  }, []);

  const loadDesigns = async () => {
    try {
      const token = await getToken();
      const data = await apiRequest('GET', '/api/designs/all', undefined, token);
      setDesigns(data);
    } catch (error) {
      console.error('Error loading designs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this design?')) return;
    
    try {
      const token = await getToken();
      await apiRequest('DELETE', `/api/designs/${id}`, undefined, token);
      setDesigns(designs.filter(d => d._id !== id));
    } catch (error: any) {
      console.error('Error deleting design:', error);
      alert(error.message || 'Failed to delete design');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center pt-24">
        <div className="text-gray-600 dark:text-gray-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-24 px-4 pb-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          My Projects
        </h1>

        {designs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400 text-lg mb-4">
              No designs yet. Create your first design!
            </p>
            <button
              onClick={() => navigate('/')}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded-md"
            >
              Create Design
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {designs.map((design) => (
              <div
                key={design._id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
              >
                {/* Thumbnail */}
                <div
                  className="h-48 bg-gray-100 dark:bg-gray-700 relative cursor-pointer overflow-hidden"
                  onClick={() => navigate(`/canvas/${design._id}`)}
                >
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
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                    {design.projectName}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                    Theme: {design.theme}
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500">
                    {new Date(design.createdAt).toLocaleDateString()}
                  </p>

                  {/* Actions */}
                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => navigate(`/canvas/${design._id}`)}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md flex items-center justify-center gap-2 text-sm"
                    >
                      <Eye className="w-4 h-4" />
                      Open
                    </button>
                    <button
                      onClick={() => handleDelete(design._id)}
                      className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-md flex items-center justify-center gap-2 text-sm"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
