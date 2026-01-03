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
      className="theme-toggle"
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      <span className="theme-toggle-track">
        <span className={`theme-toggle-thumb ${theme === 'dark' ? 'dark' : ''}`}>
          {theme === 'light' ? '☀️' : '🌙'}
        </span>
      </span>
    </button>
  );
};

export default ThemeToggle;
