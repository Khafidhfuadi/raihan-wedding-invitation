import React from 'react';
import { motion } from 'framer-motion';

const PrayerSection = () => {
  return (
    <section className="py-24 bg-main-red relative overflow-hidden flex flex-col items-center justify-center">
      {/* Background Decor */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-0 left-0 w-64 h-64 bg-accent-wine blur-[100px] rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-accent-wine blur-[100px] rounded-full transform translate-x-1/2 translate-y-1/2"></div>
      </div>

      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
        className="relative z-10 max-w-md w-full mx-6 aspect-[3/4] bg-vanilla/10 backdrop-blur-md border border-vanilla/30 rounded-[100px] flex flex-col items-center justify-center text-center p-8 md:p-12 shadow-2xl"
      >
        {/* Inner Border Ring */}
        <div className="absolute inset-4 border border-vanilla/20 rounded-[80px] pointer-events-none"></div>
        
        <motion.h2 
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="font-pinyon text-4xl md:text-5xl text-vanilla mb-6 drop-shadow-md"
        >
            Doa Untuk <br/> Kedua Mempelai
        </motion.h2>

        <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="mb-8"
        >
            <p className="font-serif text-2xl md:text-3xl text-vanilla mb-2 leading-loose" dir="rtl">
            بَارَكَ اللهُ لَكَ وَبَارَكَ عَلَيْكَ <br/> وَجَمَعَ بَيْنَكُمَا فِي خَيْرٍ
            </p>
        </motion.div>

        <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 1 }}
            className="font-dm-sans text-vanilla/90 text-sm md:text-base italic leading-relaxed mb-6"
        >
            "Semoga Allah Memberkahimu Di Waktu Bahagia Dan Memberkahimu Di Waktu Susah, Serta Semoga Allah Mempersatukan Kalian Berdua Dalam Kebaikan"
        </motion.p>

        <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 1 }}
            className="font-dm-sans text-xs text-vanilla/60 uppercase tracking-widest"
        >
            (HR. Abu Dawud No. 2130)
        </motion.p>

      </motion.div>
    </section>
  );
};

export default PrayerSection;
