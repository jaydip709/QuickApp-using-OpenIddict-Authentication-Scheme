import  { useContext } from 'react';
import { ThemeContext } from './ThemeContext';

const ThemeSlider = () => {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('ThemeSlider must be used within a ThemeProvider');
  }

  const { theme, setTheme } = context;

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
   
    <div className="fixed top-4 right-4 flex mb-4">
  <div
    className={`w-16 h-8 mx-2 rounded-full flex items-center cursor-pointer ${theme === 'dark' ? 'bg-blue-700' : 'bg-blue-200'}`}
    onClick={toggleTheme}
  >
    <div
      className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform ${theme === 'dark' ? 'translate-x-8' : 'translate-x-0'}`}
    />
  </div>
</div>

  );
};

export default ThemeSlider;
