import React from 'react';
import { motion } from 'framer-motion';

const LoadingScreen = ({ isLoading }) => {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: isLoading ? 1 : 0, pointerEvents: isLoading ? 'auto' : 'none' }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-main-red ${!isLoading ? 'pointer-events-none' : ''}`}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="flex flex-col items-center"
      >
        <div className="relative w-24 h-24 mb-6">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 border-4 border-vanilla/20 border-t-vanilla rounded-full"
          />
          <div className="absolute inset-0 flex items-center justify-center">
             <span className="font-pinyon text-3xl text-vanilla">R & F</span>
          </div>
        </div>
        
        <motion.p
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="font-serif text-vanilla/80 text-sm tracking-[0.2em] uppercase"
        >
          Loading Invitation
        </motion.p>
      </motion.div>
    </motion.div>
  );
};

export default LoadingScreen;
