import { createContext, useContext, useState } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  // technicalMode: false = Layman / Public mode, true = Technical / Meteorological mode
  const [technicalMode, setTechnicalMode] = useState(false);

  const toggleMode = () => setTechnicalMode(prev => !prev);

  return (
    <ThemeContext.Provider value={{ technicalMode, toggleMode, setTechnicalMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return ctx;
}
