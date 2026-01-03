import React, { createContext, useState, useEffect } from 'react';

/**
 * ThemeContext - Manages light/dark theme state across the application.
 * 
 * TODO: To add more themes, extend the 'theme' state to support additional values
 * (e.g., 'ocean', 'sunset') and add corresponding CSS variables in index.css
 * under [data-theme="your-theme-name"]
 */
export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // Initialize theme from localStorage or default to 'light'
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('shopmicro-theme');
    return savedTheme || 'light';
  });

  // Apply theme to document root and persist to localStorage
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('shopmicro-theme', theme);
  }, [theme]);

  // Toggle between light and dark themes
  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  /**
   * TODO: Add additional theme functions here if needed:
   * - setCustomTheme(themeName) - For preset themes
   * - setAccentColor(color) - For user-selected accent colors
   */

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
