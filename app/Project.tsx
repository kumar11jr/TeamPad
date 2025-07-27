import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/authContext.js';

// Note: You'll need to import this component in your main file where routing is handled
// and add navigation logic to the MenuSlider component in your HomeScreen

interface Project {
  id: string;
  title: string;
  description: string;
  createdAt: Date;
  userId: string;
}

const Project = ({ onBackToHome, addNotification }: { 
  onBackToHome: () => void; 
  addNotification: (message: string, type: 'success' | 'info' | 'warning') => void;
}) => {
  const { user } = useAuth();
  const [showInitialDialog, setShowInitialDialog] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showNoProjectsPopup, setShowNoProjectsPopup] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    description: ''
  });
  const [hasNavigatedToProjectsList, setHasNavigatedToProjectsList] = useState(false);

  // Load projects for the current user (simulated with localStorage)
  useEffect(() => {
    if (user) {
      const savedProjects = localStorage.getItem(`projects_${user.email}`);
      if (savedProjects) {
        setProjects(JSON.parse(savedProjects));
      }
    }
  }, [user]);

  // Save projects to localStorage
  const saveProjects = (updatedProjects: Project[]) => {
    if (user) {
      localStorage.setItem(`projects_${user.email}`, JSON.stringify(updatedProjects));
      setProjects(updatedProjects);
    }
  };

  const handleCreateNewProject = () => {
    setShowInitialDialog(false);
    setShowCreateForm(true);
  };

  const handleOpenExistingProject = () => {
    if (projects.length === 0) {
      setShowInitialDialog(false);
      setShowNoProjectsPopup(true);
    } else {
      setShowInitialDialog(false);
      setHasNavigatedToProjectsList(true);
      // Show existing projects list
    }
  };

  const handleCreateFromPopup = () => {
    setShowNoProjectsPopup(false);
    setShowCreateForm(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.title.trim() && formData.description.trim()) {
      const newProject: Project = {
        id: Date.now().toString(),
        title: formData.title,
        description: formData.description,
        createdAt: new Date(),
        userId: user?.email || ''
      };
      
      const updatedProjects = [...projects, newProject];
      saveProjects(updatedProjects);
      
      // Add notification for project creation
      addNotification(`New project created: ${formData.title}`, 'success');
      
      // Reset form and show projects list
      setFormData({ title: '', description: '' });
      setShowCreateForm(false);
      setHasNavigatedToProjectsList(true);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'description' && value.length > 200) return;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const resetToInitial = () => {
    setShowInitialDialog(true);
    setShowCreateForm(false);
    setShowNoProjectsPopup(false);
    setHasNavigatedToProjectsList(false);
  };

  const handleBackButton = () => {
    if (hasNavigatedToProjectsList) {
      // If we're in the projects list, go back to home
      onBackToHome();
    } else {
      // If we're still in dialogs, reset to initial dialog
      resetToInitial();
    }
  };

  const handleCancelDialog = () => {
    // Cancel should go directly back to home, not to project screen
    onBackToHome();
  };

  const handleCancelCreateForm = () => {
    // If coming from initial dialog, go back to dialog
    // If coming from "no projects" popup, go back to that popup
    // Otherwise go to home
    if (showNoProjectsPopup) {
      setShowCreateForm(false);
      setShowNoProjectsPopup(true);
    } else {
      onBackToHome();
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-white text-lg">Please log in to access projects.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative font-sans">
      <div
        className="min-h-screen relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #f093fb 0%, #764ba2 50%, #667eea 100%)',
        }}
      >
        {/* Floating background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(4)].map((_, index) => (
            <div
              key={index}
              className="absolute bg-white/10 rounded-full animate-float"
              style={{
                width: `${120 + index * 40}px`,
                height: `${120 + index * 40}px`,
                top: `${5 + index * 25}%`,
                right: `${-10 + index * 20}%`,
                animationDelay: `${index * 0.7}s`,
                animationDuration: `${4 + index * 0.5}s`,
              }}
            />
          ))}
        </div>

        {/* Header */}
        <div className="relative z-10 pt-16 px-6 pb-6 flex items-center justify-between">
          <button
            onClick={handleBackButton}
            className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30 hover:bg-white/25 transition-all duration-300 transform hover:scale-110"
          >
            <span className="text-white text-lg">←</span>
          </button>

          <h1 className="text-white text-2xl font-bold">Projects</h1>

          <div className="w-12 h-12"></div>
        </div>

        {/* Main Content */}
        <div className="relative z-10 flex-1 px-6">
          {/* Initial Dialog */}
          {showInitialDialog && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
              <div 
                className="fixed inset-0" 
                onClick={handleCancelDialog}
              ></div>
              <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl max-w-md w-full mx-4 relative z-10">
                <h2 className="text-white text-2xl font-bold mb-6 text-center">Project Options</h2>
                <p className="text-white/80 text-center mb-8">What would you like to do?</p>
                
                  <div className="space-y-4">
                    <button
                      onClick={handleCreateNewProject}
                      className="w-full bg-white/20 backdrop-blur-sm border border-white/30 rounded-2xl py-4 text-white font-semibold hover:bg-white/25 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-3"
                    >
                      <span className="text-xl">✨</span>
                      Create New Project
                    </button>
                    
                    <button
                      onClick={handleOpenExistingProject}
                      className="w-full bg-white/20 backdrop-blur-sm border border-white/30 rounded-2xl py-4 text-white font-semibold hover:bg-white/25 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-3"
                    >
                      <span className="text-xl">📂</span>
                      Open Existing Project
                    </button>

                    <button
                      onClick={handleCancelDialog}
                      className="w-full bg-transparent border border-white/30 rounded-2xl py-4 text-white font-semibold hover:bg-white/10 transition-all duration-300"
                    >
                      Cancel
                    </button>
                  </div>
              </div>
            </div>
          )}

          {/* No Projects Popup */}
          {showNoProjectsPopup && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
              <div 
                className="fixed inset-0" 
                onClick={handleCancelDialog}
              ></div>
              <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl max-w-md w-full mx-4 relative z-10">
                <div className="text-center mb-6">
                  <span className="text-6xl mb-4 block">📭</span>
                  <h2 className="text-white text-2xl font-bold mb-4">No Projects Found</h2>
                  <p className="text-white/80 mb-6">You don't have any existing projects yet. Would you like to create your first project?</p>
                </div>
                
                <div className="space-y-4">
                  <button
                    onClick={handleCreateFromPopup}
                    className="w-full bg-white/20 backdrop-blur-sm border border-white/30 rounded-2xl py-4 text-white font-semibold hover:bg-white/25 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-3"
                  >
                    <span className="text-xl">✨</span>
                    Create New Project
                  </button>
                  
                  <button
                    onClick={handleCancelDialog}
                    className="w-full bg-transparent border border-white/30 rounded-2xl py-4 text-white font-semibold hover:bg-white/10 transition-all duration-300"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Create Project Form */}
          {showCreateForm && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
              <div 
                className="fixed inset-0" 
                onClick={handleCancelCreateForm}
              ></div>
              <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl max-w-md w-full mx-4 relative z-10">
                <h2 className="text-white text-2xl font-bold mb-6 text-center">Create New Project</h2>
                
                <form onSubmit={handleFormSubmit} className="space-y-6">
                  <div>
                    <label className="block text-white/90 text-sm font-medium mb-2">
                      Project Title
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                      className="w-full bg-white/10 backdrop-blur-sm border border-white/30 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent"
                      placeholder="Enter project title..."
                    />
                  </div>
                  
                  <div>
                    <label className="block text-white/90 text-sm font-medium mb-2">
                      Project Description
                      <span className="text-white/60 text-xs ml-2">
                        ({formData.description.length}/200)
                      </span>
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      required
                      rows={4}
                      className="w-full bg-white/10 backdrop-blur-sm border border-white/30 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent resize-none"
                      placeholder="Describe your project..."
                    />
                  </div>
                  
                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={handleCancelCreateForm}
                      className="flex-1 bg-transparent border border-white/30 rounded-2xl py-3 text-white font-semibold hover:bg-white/10 transition-all duration-300"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={!formData.title.trim() || !formData.description.trim()}
                      className="flex-1 bg-white/20 backdrop-blur-sm border border-white/30 rounded-2xl py-3 text-white font-semibold hover:bg-white/25 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    >
                      Create Project
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Projects List (when not showing dialogs) */}
          {!showInitialDialog && !showCreateForm && !showNoProjectsPopup && hasNavigatedToProjectsList && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-white text-2xl font-bold">Your Projects</h2>
                <button
                  onClick={() => setShowCreateForm(true)}
                  className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl px-4 py-2 text-white font-semibold hover:bg-white/25 transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
                >
                  <span className="text-lg">+</span>
                  New Project
                </button>
              </div>

              {projects.length === 0 ? (
                <div className="text-center py-12">
                  <span className="text-6xl mb-4 block">📝</span>
                  <p className="text-white/80 text-lg">No projects yet. Create your first project!</p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {projects.map((project) => (
                    <div
                      key={project.id}
                      className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all duration-300 transform hover:scale-105"
                    >
                      <h3 className="text-white text-xl font-semibold mb-2">{project.title}</h3>
                      <p className="text-white/70 text-sm mb-4 line-clamp-2">{project.description}</p>
                      <p className="text-white/50 text-xs">
                        Created: {new Date(project.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(180deg);
          }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default Project;