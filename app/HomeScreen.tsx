import { signOut } from 'firebase/auth';
import React, { useState, useEffect } from 'react';
import {auth} from "../firebaseConfig.js"; 
import { useAuth } from '../context/authContext.js';
import Project from './Project'; // Import your Project component

const handleSignOut = () => {
    signOut(auth).then(()=>{
        console.log("User signed out successfully");
    }).catch((error)=>{
        console.error("Error signing out:", error);
    });
}

const MenuSlider = ({ isOpen, onClose, user, onNavigate }: { 
  isOpen: boolean; 
  onClose: () => void; 
  user: { email: string; displayName?: string };
  onNavigate: (page: string) => void;
}) => {
  const menuItems = [
    { icon: '🏠', title: 'Dashboard', subtitle: 'Overview & Stats', page: 'dashboard' },
    { icon: '👥', title: 'Team Members', subtitle: 'Manage your team', page: 'team' },
    { icon: '📊', title: 'Projects', subtitle: 'Active projects', page: 'projects' },
    { icon: '📅', title: 'Calendar', subtitle: 'Schedule & events', page: 'calendar' },
    { icon: '📝', title: 'Notes', subtitle: 'Team notes & docs', page: 'notes' },
    { icon: '💬', title: 'Chat', subtitle: 'Team communication', page: 'chat' },
    { icon: '⚙️', title: 'Settings', subtitle: 'App preferences', page: 'settings' },
    { icon: '📈', title: 'Analytics', subtitle: 'Performance data', page: 'analytics' },
  ];

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm transition-all duration-300 z-40 ${
          isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
        onClick={onClose}
      />

      {/* Menu Slider */}
      <div
        className={`fixed top-0 left-0 h-full w-80 transform transition-transform duration-300 ease-out z-50 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{
          background: 'linear-gradient(135deg, #f093fb 0%, #764ba2 50%, #667eea 100%)',
        }}
      >
        {/* Floating background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(3)].map((_, index) => (
            <div
              key={index}
              className="absolute bg-white/10 rounded-full animate-float"
              style={{
                width: `${80 + index * 40}px`,
                height: `${80 + index * 40}px`,
                top: `${10 + index * 20}%`,
                left: `${5 + index * 15}%`,
                animationDelay: `${index * 0.5}s`,
                animationDuration: `${3 + index * 0.5}s`,
              }}
            />
          ))}
        </div>

        {/* Menu Content */}
        <div className="relative h-full backdrop-blur-xl bg-white/10 border-r border-white/20 flex flex-col">
          {/* Header */}
          <div className="pt-16 px-6 pb-8 border-b border-white/10">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mb-4 border-2 border-white/30 backdrop-blur-sm">
              <span className="text-3xl">👤</span>
            </div>
            <h2 className="text-white text-2xl font-bold mb-2">TeamPad</h2>
            <div className="inline-block bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/30">
              <p className="text-white/90 text-sm font-medium">{user?.displayName}</p>
            </div>
          </div>

          {/* Menu Items */}
          <div className="flex-1 py-4 overflow-y-auto">
            {menuItems.map((item, index) => (
              <button
                key={index}
                className="w-full flex items-center px-6 py-4 mx-3 my-1 rounded-2xl bg-white/10 border border-white/20 hover:bg-white/15 transition-all duration-300 transform hover:scale-105 group"
                onClick={() => {
                  console.log(`Navigating to: ${item.title}`);
                  onNavigate(item.page);
                  onClose();
                }}
              >
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mr-4 group-hover:bg-white/25 transition-colors">
                  <span className="text-xl">{item.icon}</span>
                </div>
                <div className="flex-1 text-left">
                  <h3 className="text-white text-base font-semibold mb-0.5">
                    {item.title}
                  </h3>
                  <p className="text-white/70 text-xs">
                    {item.subtitle}
                  </p>
                </div>
                <div className="w-6 h-6 flex items-center justify-center">
                  <span className="text-white/60 text-lg font-bold group-hover:text-white transition-colors">
                    ›
                  </span>
                </div>
              </button>
            ))}
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-white/10">
            <button
              className="w-full bg-white/20 backdrop-blur-sm border border-white/30 rounded-2xl py-4 text-white font-semibold hover:bg-white/25 transition-all duration-300 transform hover:scale-105"
              onClick={handleSignOut}
            >
              🚪 Sign Out
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default function HomeScreen() {
  const { user, loading: authLoading } = useAuth(null)
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [notifications, setNotifications] = useState<Array<{
    id: string;
    message: string;
    type: 'success' | 'info' | 'warning';
    timestamp: Date;
    read: boolean;
  }>>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [hasWelcomeNotification, setHasWelcomeNotification] = useState(false);

  // Add welcome notification for new users
  useEffect(() => {
    if (user && !hasWelcomeNotification) {
      const welcomeNotification = {
        id: Date.now().toString(),
        message: `Welcome to TeamPad, ${user.displayName}! 🎉`,
        type: 'info' as const,
        timestamp: new Date(),
        read: false
      };
      setNotifications([welcomeNotification]);
      setHasWelcomeNotification(true);
    }
  }, [user, hasWelcomeNotification]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  // Close notifications panel when clicking outside (optional enhancement)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showNotifications) {
        const target = event.target as Element;
        if (!target.closest('.notifications-container')) {
          setShowNotifications(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showNotifications]);

  const handleNavigation = (page: string) => {
    setCurrentPage(page);
  };

  const handleBackToHome = () => {
    setCurrentPage('dashboard');
  };

  const addNotification = (message: string, type: 'success' | 'info' | 'warning') => {
    const newNotification = {
      id: Date.now().toString(),
      message,
      type,
      timestamp: new Date(),
      read: false
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  // Fixed notification marking function
  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
         notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  // Optional: Function to remove notification entirely
  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );
    // Optional: Auto-remove all after marking as read
    setTimeout(() => {
      setNotifications([]);
      setShowNotifications(false);
    }, 1000);
  };

  // Clear all notifications
  const clearAllNotifications = () => {
    setNotifications([]);
    setShowNotifications(false); // Close the panel after clearing
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  // CONDITIONAL RENDERING AFTER ALL HOOKS
  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden font-sans">
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(135deg, #f093fb 0%, #764ba2 50%, #667eea 100%)",
          }}
        />
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(3)].map((_, index) => (
            <div
              key={index}
              className="absolute bg-white/10 rounded-full animate-pulse"
              style={{
                width: `${100 + index * 50}px`,
                height: `${100 + index * 50}px`,
                top: `${10 + index * 20}%`,
                left: `${10 + index * 25}%`,
                animationDelay: `${index * 0.5}s`,
                animationDuration: `${3 + index * 0.5}s`,
              }}
            />
          ))}
        </div>
        
        <div className="relative z-10 backdrop-blur-xl bg-white/10 rounded-3xl p-8 border border-white/20 shadow-2xl flex flex-col items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-white border-t-transparent mb-4"></div>
          <p className="text-white text-lg font-medium">Getting things ready...</p>
        </div>
      </div>
    );
  }

  // Render different pages based on currentPage state
  if (currentPage === 'projects') {
    return <Project onBackToHome={handleBackToHome} addNotification={addNotification} />;
  }

  // YOUR ORIGINAL RETURN STATEMENT - Enhanced with menu functionality
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

        {/* Header with Menu Button */}
        <div className="relative z-10 pt-16 px-6 pb-6 flex items-center justify-between">
          <button
            onClick={() => setIsMenuOpen(true)}
            className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30 hover:bg-white/25 transition-all duration-300 transform hover:scale-110"
          >
            <div className="w-5 h-4 flex flex-col justify-between">
              <div className="h-0.5 bg-white rounded-full"></div>
              <div className="h-0.5 bg-white rounded-full w-4/5"></div>
              <div className="h-0.5 bg-white rounded-full"></div>
            </div>
          </button>

          <h1 className="text-white text-2xl font-bold">TeamPad</h1>

          <div className="relative notifications-container">
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30 hover:bg-white/25 transition-all duration-300 transform hover:scale-110 relative"
            >
              <span className="text-xl">🔔</span>
              {unreadCount > 0 && (
                <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold animate-pulse">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </div>
              )}
            </button>

            {/* Enhanced Notifications Panel */}
            {showNotifications && (
              <div className="absolute top-full right-0 mt-2 w-80 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl z-50 max-h-96 overflow-hidden">
                <div className="p-4 border-b border-white/10 flex items-center justify-between">
                  <div>
                    <h3 className="text-white font-semibold">Notifications</h3>
                    {notifications.length > 0 && (
                      <p className="text-white/60 text-xs">
                        {unreadCount} unread of {notifications.length} total
                      </p>
                    )}
                  </div>
                  {notifications.length > 0 && (
                    <div className="flex gap-2">
                      {unreadCount > 0 && (
                        <button
                          onClick={markAllAsRead}
                          className="text-white/60 hover:text-white text-xs px-2 py-1 rounded-md bg-white/10 hover:bg-white/20 transition-colors"
                        >
                          Mark all read
                        </button>
                      )}
                      <button
                        onClick={clearAllNotifications}
                        className="text-white/60 hover:text-white text-xs px-2 py-1 rounded-md bg-white/10 hover:bg-white/20 transition-colors"
                      >
                        Clear all
                      </button>
                    </div>
                  )}
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-8 text-center text-white/60">
                      <div className="text-4xl mb-2">🔕</div>
                      <p>No notifications yet</p>
                    </div>
                  ) : (
                    notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-4 border-b border-white/10 cursor-pointer hover:bg-white/5 transition-all duration-200 group ${
                          !notification.read ? 'bg-white/8' : ''
                        }`}
                        onClick={() => {
                          markNotificationAsRead(notification.id);
                          // Optional: Auto-remove after marking as read
                          setTimeout(() => {
                            removeNotification(notification.id);
                          }, 500);
                        }}
                      >
                        <div className="flex items-start gap-3">
                          <div className="text-lg flex-shrink-0">
                            {notification.type === 'success' && '✅'}
                            {notification.type === 'info' && 'ℹ️'}
                            {notification.type === 'warning' && '⚠️'}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm ${!notification.read ? 'text-white font-medium' : 'text-white/80'}`}>
                              {notification.message}
                            </p>
                            <p className="text-white/50 text-xs mt-1">
                              {notification.timestamp.toLocaleTimeString([], { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              })}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            {!notification.read && (
                              <div className="w-2 h-2 bg-blue-400 rounded-full flex-shrink-0"></div>
                            )}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                removeNotification(notification.id);
                              }}
                              className="opacity-0 group-hover:opacity-100 text-white/40 hover:text-white/80 transition-all text-xs p-1"
                            >
                              ✕
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Main Content - YOUR ORIGINAL WELCOME MESSAGE */}
        <div className="relative z-10 flex-1 px-6 pt-8">
          <div className="text-4xl mb-6">
          <div className="text-white text-3xl font-bold mb-8">
          </div>
            <h2 className={`text-white text-3xl font-bold mb-8 transform transition-transform duration-300 ease-out ${
  isMenuOpen ? 'translate-x-80' : 'translate-x-0'
}`}>
             👋 Welcome to TeamPad, {user.displayName}
            </h2>
            

          </div>
        </div>

        {/* Menu Slider */}
        <MenuSlider 
          isOpen={isMenuOpen} 
          onClose={() => setIsMenuOpen(false)}
          user={user}
          onNavigate={handleNavigation}
        />
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
      `}</style>
    </div>
  );
}