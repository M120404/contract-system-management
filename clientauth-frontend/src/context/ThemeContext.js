import { createContext, useState, useContext } from 'react';

// Create context
const ThemeContext = createContext();

// Create provider component
export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');
  
  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Create custom hook
export const useTheme = () => useContext(ThemeContext);

// Add default export (optional but can help with the error)
export default ThemeProvider;