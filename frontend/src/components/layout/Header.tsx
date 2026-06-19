import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { Bell, UserCircle, LogOut, Sun, Moon } from 'lucide-react';

export const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="h-16 bg-card border-b border-border flex items-center justify-between px-6 sticky top-0 z-10 shadow-sm">
      <div className="flex items-center">
        <h1 className="text-xl font-semibold text-foreground">Welcome back, {user?.fullName || 'User'}</h1>
      </div>
      <div className="flex items-center space-x-4 text-muted-foreground">
        <button 
          onClick={toggleTheme}
          className="p-2 hover:bg-muted rounded-full transition-colors relative"
          title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
        </button>
        <button className="p-2 hover:bg-muted rounded-full transition-colors relative">
          <Bell size={20} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full"></span>
        </button>
        <div className="flex items-center space-x-4 pl-4 border-l border-border">
          <div className="flex items-center space-x-2">
            <div className="text-right hidden md:block">
              <p className="text-sm font-medium text-foreground">{user?.fullName}</p>
              <p className="text-xs text-muted-foreground">{user?.username} &bull; {user?.role}</p>
            </div>
            <UserCircle size={32} className="text-primary" />
          </div>
          <button 
            onClick={logout}
            className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors flex items-center space-x-1"
            title="Logout"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </header>
  );
};
