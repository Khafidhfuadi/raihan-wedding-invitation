import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import mainVector from '../assets/main-vector.png';
import leftDecor from '../assets/decor-left.png';
import rightDecor from '../assets/decor-right.png';

const MainSection = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const yLeft = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const yRight = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const scaleVector = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 0.9]);

  return (
    <section ref={containerRef} id="main-section" className="min-h-screen w-full relative bg-accent-wine flex flex-col items-center justify-center py-20 overflow-hidden">
      {/* Background Decor */}
      <motion.img
        style={{ y: yLeft }}
        initial={{ x: -50, opacity: 0 }}
        whileInView={{ x: 0, opacity: 0.3 }}
        transition={{ duration: 1.2 }}
        viewport={{ once: true }}
        src={leftDecor}
        alt="Decoration Left"
        className="absolute bottom-0 left-0 w-40 md:w-64 opacity-30 z-10 pointer-events-none"
      />
      <motion.img
        style={{ y: yRight }}
        initial={{ x: 50, opacity: 0 }}
        whileInView={{ x: 0, opacity: 0.3 }}
        transition={{ duration: 1.2 }}
        viewport={{ once: true }}
        src={rightDecor}
        alt="Decoration Right"
        className="absolute bottom-0 right-0 w-40 md:w-64 opacity-30 z-10 pointer-events-none"
      />

      {/* Main Content */}
      <div className="z-20 text-center px-6 max-w-4xl flex flex-col items-center">
        <motion.div
          style={{ scale: scaleVector }}
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="w-40 md:w-56 mb-8 relative"
        >
          <div className="absolute inset-0 bg-vanilla/20 blur-3xl rounded-full animate-pulse"></div>
          <motion.img
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            src={mainVector}
            alt="Wedding Symbol"
            className="w-full h-auto drop-shadow-2xl relative z-10"
          />
        </motion.div>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          viewport={{ once: true }}
          className="font-pinyon text-3xl md:text-4xl text-vanilla mb-2 drop-shadow-md"
        >
          The Wedding of
        </motion.p>

        <motion.h2
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          viewport={{ once: true }}
          className="font-pinyon text-6xl md:text-8xl text-vanilla mb-10 drop-shadow-lg leading-tight"
        >
          Raihan <span className="text-4xl md:text-6xl">&</span> Fadhil
        </motion.h2>

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.8 }}
          whileHover={{ scale: 1.05 }}
          viewport={{ once: true }}
          className="bg-highlight-rose/40 backdrop-blur-sm px-10 py-4 rounded-full border border-vanilla/40 shadow-lg cursor-default"
        >
          <p className="font-dm-sans text-xl md:text-2xl font-bold text-vanilla tracking-[0.2em]">
            10 JANUARI 2026
          </p>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          viewport={{ once: true }}
          className="font-dm-sans text-vanilla/90 mt-12 max-w-lg text-sm md:text-base leading-relaxed italic"
        >
          "Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya."
          <br /><span className="font-bold not-italic mt-2 block">(QS. Ar-Rum: 21)</span>
        </motion.p>
      </div>
    </section>
  );
};

export default MainSection;
