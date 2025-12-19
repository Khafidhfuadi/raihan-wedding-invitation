import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import decorLeft from '../assets/decor-left.png';
import decorRight from '../assets/decor-right.png';

const Opening = ({ onOpen }) => {
  const [guestName, setGuestName] = useState('Nama Tamu');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const to = params.get('to');
    if (to) setGuestName(to);
  }, []);

  return (
    <section className="h-screen w-full flex flex-col justify-center items-center bg-main-red text-vanilla relative overflow-hidden z-50">
      {/* Floating Particles/Stars */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute bg-vanilla rounded-full opacity-30"
            style={{
              width: Math.random() * 4 + 1 + 'px',
              height: Math.random() * 4 + 1 + 'px',
              top: Math.random() * 100 + '%',
              left: Math.random() * 100 + '%',
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1 }}
        className="text-center z-10 px-6 max-w-lg"
      >
        <div className="mb-6">
          {/* Placeholder for a top decorative icon if needed */}
        </div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="font-pinyon text-3xl md:text-4xl mb-4 tracking-wide text-vanilla/90"
        >
          The Wedding of
        </motion.p>

        <motion.h1
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8, type: "spring" }}
          className="font-pinyon text-6xl md:text-8xl mb-8 leading-tight text-vanilla drop-shadow-lg"
        >
          Raihan <span className="text-4xl md:text-6xl align-middle my-2 block md:inline">&</span> Fadhil
        </motion.h1>

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="mt-16 mb-10 p-6 rounded-xl bg-accent-wine/20 backdrop-blur-sm border border-vanilla/20 shadow-xl"
        >
          <p className="font-dm-sans text-xs tracking-[0.2em] uppercase mb-3 opacity-80">Kepada Yth.</p>
          <h2 className="font-dm-sans text-2xl font-bold capitalize mb-1">{guestName}</h2>
          <p className="font-dm-sans text-xs opacity-70 mt-2">Tanpa mengurangi rasa hormat, kami mengundang Anda untuk hadir di acara kami.</p>
        </motion.div>

        <motion.button
          whileHover={{ scale: 1.05, boxShadow: "0px 0px 15px rgba(252, 246, 217, 0.5)" }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.5 }}
          onClick={onOpen}
          className="px-8 py-3 bg-vanilla text-main-red font-dm-sans font-bold rounded-full hover:bg-white transition-all duration-300 shadow-xl flex items-center justify-center gap-3 mx-auto relative overflow-hidden group"
        >
          <span className="relative z-10 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
            Buka Undangan
          </span>
          <div className="absolute inset-0 h-full w-full scale-0 rounded-full transition-all duration-300 group-hover:scale-100 group-hover:bg-white/30"></div>
        </motion.button>
      </motion.div>

      {/* Decorative corners with gentle floating animation */}
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-0 left-0 w-32 h-32 opacity-30 pointer-events-none"
      >
        <img src={decorLeft} className="w-full h-full object-contain -scale-x-100 rotate-180" alt="" />
      </motion.div>
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-0 right-0 w-32 h-32 opacity-30 pointer-events-none"
      >
        <img src={decorRight} className="w-full h-full object-contain" alt="" />
      </motion.div>
    </section>
  );
};

export default Opening;
