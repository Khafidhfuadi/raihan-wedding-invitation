import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Opening from './components/Opening';
import MainSection from './components/MainSection';
import Countdown from './components/Countdown';
import CoupleIntro from './components/CoupleIntro';
import EventDetails from './components/EventDetails';
import Etiquette from './components/Etiquette';
import Wishes from './components/Wishes';
import Closing from './components/Closing';
import GuestManager from './pages/GuestManager';
import backsound from './assets/audio/backsound.mp3';
import { motion, AnimatePresence } from 'framer-motion';

const MainApp = () => {
  const [isOpened, setIsOpened] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 500) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Lock scroll initially
    if (!isOpened) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    // Cleanup
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpened]);

  const handleOpen = () => {
    setIsOpened(true);
    // Play music
    if (audioRef.current) {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch((err) => {
        console.error("Audio playback failed:", err);
      });
    }

    // Add a small delay to allow state update and then scroll
    setTimeout(() => {
      const element = document.getElementById('main-content');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 300);
  };

  const toggleMusic = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const scrollToTop = () => {
    const element = document.getElementById('main-content');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full bg-main-red min-h-screen">
      <audio ref={audioRef} src={backsound} loop />

      <Opening onOpen={handleOpen} />

      {/* Back to Top Button */}
      <AnimatePresence>
        {isOpened && showScrollTop && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={scrollToTop}
            className="fixed bottom-24 right-6 z-50 w-12 h-12 bg-vanilla/80 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center text-accent-wine border-2 border-accent-wine/20"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 15l-6-6-6 6" /></svg>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Floating Music Button */}
      <AnimatePresence>
        {isOpened && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleMusic}
            className="fixed bottom-6 right-6 z-50 w-12 h-12 bg-vanilla/80 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center text-accent-wine border-2 border-accent-wine/20"
          >
            {isPlaying ? (
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18V5l12-2v13"></path><circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="16" r="3"></circle></svg>
              </motion.div>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="1" y1="1" x2="23" y2="23"></line><path d="M9 9v3.13a4 4 0 0 0 1.5 3.32"></path><path d="M9 18.13a3 3 0 1 1-3-3"></path><path d="M21 5v9.5"></path><circle cx="18" cy="16" r="3"></circle></svg>
            )}
          </motion.button>
        )}
      </AnimatePresence>

      <main id="main-content" className="relative z-10 bg-main-red shadow-2xl">
        <MainSection />
        <CoupleIntro />
        <EventDetails />
        <Countdown />
        <Etiquette />
        <Wishes />
        <Closing />

        {/* Simple Footer */}
        <footer className="py-8 bg-main-red text-center text-vanilla/50 text-sm font-dm-sans">
          <p>The Wedding of Raihan & Fadhil</p>
          <p className="mt-2">Created by The Coolest Cousin : Apid 😎</p>
          {/* Informasi Kerjasama */}
          <div className="mt-2">
            <p className="text-xs text-vanilla/40">
              Informasi Kerjasama :
              <a href="mailto:muhammadkhafidfuadi@gmail.com" className="underline hover:text-vanilla/60 transition-colors ml-2">
                muhammadkhafidfuadi@gmail.com
              </a>
              <span className="mx-2">|</span>
              <a href="https://instagram.com/khaa_1.7" target="_blank" rel="noopener noreferrer" className="underline hover:text-vanilla/60 transition-colors">
                instagram.com/khaa_1.7
              </a>
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainApp />} />
        <Route path="/manage-guests" element={<GuestManager />} />
      </Routes>
    </Router>
  );
}

export default App;
