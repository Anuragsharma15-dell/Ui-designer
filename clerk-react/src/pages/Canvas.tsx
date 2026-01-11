import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import { Sparkles, Camera, Upload } from 'lucide-react';
import { apiRequest } from '../lib/api';
import Textarea from '../Components/Textarea';

const THEMES = [
  { name: 'SLACK', colors: ['#4A154B', '#36C5F0', '#2EB67D', '#000000', '#FFFFFF'] },
  { name: 'FIGMA', colors: ['#0D99FF', '#9747FF', '#F24E1E', '#000000', '#FFFFFF'] },
  { name: 'NETFLIX', colors: ['#E50914', '#000000', '#564D4D', '#FFFFFF', '#141414'] },
  { name: 'SHOPIFY', colors: ['#95BF47', '#FFFFFF', '#000000', '#232F3E', '#146EB4'] },
  { name: 'AMAZON', colors: ['#FF9900', '#232F3E', '#146EB4', '#FFFFFF', '#131A22'] },
  { name: 'AURORA_INK', colors: ['#6366F1', '#10B981', '#3B82F6', '#0F172A', '#FFFFFF'] },
  { name: 'DUSTY_ORCHID', colors: ['#A855F7', '#EC4899', '#3B82F6', '#1E1B4B', '#FFFFFF'] },
];

export default function Canvas() {
  const { id } = useParams<{ id: string }>();
  const { getToken } = useAuth();
  const [design, setDesign] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [projectName, setProjectName] = useState('');
  const [newPrompt, setNewPrompt] = useState('');
  const [selectedTheme, setSelectedTheme] = useState('SLACK');
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    if (id) {
      loadDesign();
    }
  }, [id]);

  const loadDesign = async () => {
    try {
      const token = await getToken();
      const data = await apiRequest('GET', `/api/designs/${id}`, undefined, token || undefined);
      setDesign(data);
      setProjectName(data.projectName);
      setSelectedTheme(data.theme || 'SLACK');
    } catch (error) {
      console.error('Error loading design:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddScreen = async () => {
    if (!newPrompt.trim()) return;
    
    setGenerating(true);
    try {
      const token = await getToken();
      const updated = await apiRequest(
        'POST',
        `/api/designs/${id}/screens`,
        { prompt: newPrompt },
        token || undefined
      );
      setDesign(updated);
      setNewPrompt('');
    } catch (error: any) {
      console.error('Error adding screen:', error);
      alert(error.message || 'Failed to generate screen');
    } finally {
      setGenerating(false);
    }
  };

  const handleThemeChange = async (theme: string) => {
    setSelectedTheme(theme);
    try {
      const token = await getToken();
      const updated = await apiRequest(
        'PATCH',
        `/api/designs/${id}/theme`,
        { theme },
        token || undefined
      );
      setDesign(updated);
    } catch (error: any) {
      console.error('Error updating theme:', error);
      alert(error.message || 'Failed to update theme');
    }
  };

  const handleProjectNameUpdate = async () => {
    try {
      const token = await getToken();
      const updated = await apiRequest(
        'PATCH',
        `/api/designs/${id}/project-name`,
        { projectName },
        token || undefined
      );
      setDesign(updated);
    } catch (error: any) {
      console.error('Error updating project name:', error);
      alert(error.message || 'Failed to update project name');
    }
  };

  const handleScreenshot = () => {
    alert('Screenshot feature coming soon');
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('Link copied to clipboard!');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!design) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-red-600">Design not found</div>
      </div>
    );
  }

  // Define individual theme colors for quick selection
  const quickThemes = [
    { name: 'RED', color: '#E50914', theme: 'NETFLIX' },
    { name: 'ORANGE', color: '#FF9900', theme: 'AMAZON' },
    { name: 'PURPLE', color: '#A855F7', theme: 'DUSTY_ORCHID' },
    { name: 'BLACK', color: '#000000', theme: 'SLACK' },
    { name: 'BLACK', color: '#1E1B4B', theme: 'DUSTY_ORCHID' },
  ];

  // Filter preset themes
  const presetThemes = THEMES.filter(t => t.name === 'AURORA_INK' || t.name === 'DUSTY_ORCHID');

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 p-6 overflow-y-auto h-screen">
        {/* Header */}
        <div className="flex items-center gap-2 mb-8">
          <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-sm">UIUX</span>
          </div>
          <span className="text-xl font-bold text-black">MOCK</span>
        </div>

        {/* Settings Section */}
        <div className="space-y-6">
          <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4">Settings</h2>

          {/* Project Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Project Name
            </label>
            <input
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              onBlur={handleProjectNameUpdate}
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>

          {/* Generate New Screen */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Generate New Screen
            </label>
            <Textarea
              value={newPrompt}
              onChange={(e) => setNewPrompt(e.target.value)}
              placeholder="Enter Prompt to generate screen using AI"
              className="w-full min-h-24 text-sm mb-2 resize-none"
            />
            <button
              onClick={handleAddScreen}
              disabled={generating}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5 px-4 rounded-md flex items-center justify-center gap-2 text-sm disabled:opacity-50 transition-colors"
            >
              <Sparkles className="w-4 h-4" />
              Generate With AI
            </button>
          </div>

          {/* Themes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Themes
            </label>
            
            {/* Quick Theme Colors */}
            <div className="flex gap-2 mb-4">
              {quickThemes.map((qt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleThemeChange(qt.theme)}
                  className={`w-10 h-10 rounded-full border-2 transition-all ${
                    selectedTheme === qt.theme
                      ? 'border-red-500 ring-2 ring-red-200 scale-110'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                  style={{ backgroundColor: qt.color }}
                  title={qt.name}
                />
              ))}
            </div>

            {/* Preset Themes */}
            <div className="space-y-2">
              {presetThemes.map((theme) => (
                <button
                  key={theme.name}
                  onClick={() => handleThemeChange(theme.name)}
                  className={`w-full flex items-center justify-between p-2.5 rounded-md border transition-colors ${
                    selectedTheme === theme.name
                      ? 'border-red-500 bg-red-50'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <span className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                    {theme.name}
                  </span>
                  <div className="flex gap-1.5">
                    {theme.colors.slice(0, 3).map((color, idx) => (
                      <div
                        key={idx}
                        className="w-5 h-5 rounded-full border border-gray-300"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Extras */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Extras
            </label>
            <div className="flex gap-2">
              <button
                onClick={handleScreenshot}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2.5 px-4 rounded-md flex items-center justify-center gap-2 text-sm transition-colors"
              >
                <Camera className="w-4 h-4" />
                Screenshot
              </button>
              <button
                onClick={handleShare}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2.5 px-4 rounded-md flex items-center justify-center gap-2 text-sm transition-colors"
              >
                <Upload className="w-4 h-4" />
                Share
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Canvas */}
      <div className="flex-1 overflow-auto h-screen">
        <div className="bg-gray-100 p-8 min-h-full" style={{
          backgroundImage: 'radial-gradient(circle, #d1d5db 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}>
          <div className="flex gap-6 justify-center flex-wrap">
            {design.screens && design.screens.length > 0 ? (
              design.screens.map((screen: any, index: number) => (
                <div
                  key={index}
                  className="bg-white rounded-lg shadow-xl overflow-hidden"
                  style={{ width: '375px', minWidth: '375px' }}
                >
                  <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
                    <h3 className="text-sm font-semibold text-gray-700">
                      {screen.title || `Screen ${index + 1}`}
                    </h3>
                  </div>
                  <div
                    className="overflow-auto bg-white"
                    style={{ height: '667px', maxHeight: '667px' }}
                    dangerouslySetInnerHTML={{ __html: screen.html }}
                  />
                </div>
              ))
            ) : (
              <div className="text-gray-500 text-center py-12">No screens generated yet</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
