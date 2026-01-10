
import { Children } from 'react';
import './App.css'


import Navbar from './Components/Navbar';
import { ThemeProvider } from './Components/theme-provider';
 

function App() {
  return (
    <ThemeProvider defaultTheme='dark' storageKey='vite-ui-theme'>
    <header>
     <Navbar/>
    </header>
    </ThemeProvider>
  );
};

export default App;