import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Navbar.css';
import { LayoutGrid, Building2, Briefcase, Mail, Globe, Send } from 'lucide-react';

export const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <div className="logo-icon">
          <LayoutGrid size={20} />
        </div>
        <span>Job Outreach</span>
      </div>
      <div className="navbar-actions">
        <button 
          className={`btn ${isActive('/companies') ? 'btn-primary' : 'btn-ghost'}`}
          onClick={() => navigate('/companies')}
        >
          <Building2 size={16} />
          Companii
        </button>
        <button 
          className={`btn ${isActive('/positions') ? 'btn-primary' : 'btn-ghost'}`}
          onClick={() => navigate('/positions')}
        >
          <Briefcase size={16} />
          Poziții
        </button>
        <button 
          className={`btn ${isActive('/email') ? 'btn-primary' : 'btn-ghost'}`}
          onClick={() => navigate('/email')}
        >
          <Mail size={16} />
          Email
        </button>
        <button 
          className={`btn ${isActive('/send') ? 'btn-primary' : 'btn-ghost'}`}
          onClick={() => navigate('/send')}
        >
          <Send size={16} />
          Trimitere
        </button>
        <button 
          className={`btn ${isActive('/countries') ? 'btn-primary' : 'btn-ghost'}`}
          onClick={() => navigate('/countries')}
        >
          <Globe size={16} />
          Țări
        </button>
      </div>
    </nav>
  );
};
