import React, { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';

/**
 * ThemeToggle - A beautiful animated toggle switch for light/dark mode.
 * 
 * TODO: Customize the icons by replacing the emoji with custom SVGs or icon library
 * (e.g., react-icons, lucide-react, or your own SVG components)
 */
const ThemeToggle = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <button
      className="bg-transparent border-none cursor-pointer p-1 flex items-center justify-center"
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      <span className={`w-14 h-7 rounded-full relative transition-all duration-300 shadow-inner ${theme === 'light' ? 'bg-gradient-to-r from-slate-200 to-slate-300' : 'bg-gradient-to-r from-slate-700 to-slate-800'}`}>
        <span className={`absolute top-0.5 left-0.5 w-6 h-6 rounded-full flex items-center justify-center text-sm shadow-md transition-transform duration-300 ${theme === 'light' ? 'bg-white translate-x-0' : 'bg-slate-800 translate-x-7'}`}>
          {theme === 'light' ? '☀️' : '🌙'}
        </span>
      </span>
    </button>
  );
};

export default ThemeToggle;
