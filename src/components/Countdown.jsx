import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const Countdown = () => {
  const targetDate = new Date('2026-01-10T08:00:00').getTime(); // 10 Jan 2026, 8 AM
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateTime = () => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance < 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }

      return {
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      };
    };

    setTimeLeft(calculateTime());

    const interval = setInterval(() => {
      setTimeLeft(calculateTime());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const TimeItem = ({ value, label }) => (
    <motion.div
      whileHover={{ scale: 1.1 }}
      className="flex flex-col items-center justify-center w-16 md:w-24 bg-white/5 backdrop-blur-sm rounded-lg p-2 md:p-3 border border-vanilla/10 shadow-lg"
    >
      <motion.div
        key={value}
        initial={{ scale: 0.8, opacity: 0.5 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300 }}
        className="text-2xl md:text-5xl font-dm-sans font-bold text-vanilla mb-1 md:mb-2"
      >
        {value < 10 ? `0${value}` : value}
      </motion.div>
      <div className="text-[10px] md:text-xs font-dm-sans text-vanilla/70 uppercase tracking-widest border-t border-vanilla/30 pt-1 md:pt-2 w-full text-center">
        {label}
      </div>
    </motion.div>
  );

  return (
    <section className="py-20 bg-main-red relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            rotate: [0, 360],
            scale: [1, 1.2, 1]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-20 -left-20 w-64 h-64 bg-accent-wine/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            rotate: [360, 0],
            scale: [1, 1.5, 1]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-20 -right-20 w-80 h-80 bg-accent-wine/20 rounded-full blur-3xl"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
        className="container mx-auto px-4 text-center relative z-10"
      >
        <div className="mb-12">
          <motion.h3
            initial={{ scale: 0.9 }}
            whileInView={{ scale: 1 }}
            transition={{ duration: 0.8, type: "spring" }}
            className="font-pinyon text-4xl md:text-5xl text-vanilla mb-4 drop-shadow-md"
          >
            Menuju Hari Bahagia
          </motion.h3>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="font-dm-sans text-vanilla/60 text-sm max-w-md mx-auto"
          >
            Kami menantikan kehadiran Anda untuk berbagi kebahagiaan bersama kami.
          </motion.p>
        </div>

        <div className="flex justify-center items-center gap-3 md:gap-6">
          <TimeItem value={timeLeft.days} label="Hari" />
          <TimeItem value={timeLeft.hours} label="Jam" />
          <TimeItem value={timeLeft.minutes} label="Menit" />
          <TimeItem value={timeLeft.seconds} label="Detik" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          viewport={{ once: true }}
          className="mt-12"
        >
          <motion.a
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            href="https://calendar.google.com/calendar/render?action=TEMPLATE&text=The+Wedding+of+Raihan+%26+Fadhil&dates=20260110T010000Z/20260110T070000Z&details=Kami+menantikan+kehadiran+Anda+untuk+berbagi+kebahagiaan+bersama+kami.&location=Kp.+Jampang+RT.01+RW.03,+Ds.+Wanaherang,+Kec.+Gunung+Putri,+Kab.+Bogor"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-8 py-3 bg-vanilla text-main-red font-bold rounded-full hover:bg-white transition-all shadow-lg text-sm md:text-base group"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
            Simpan ke Kalender
          </motion.a>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Countdown;
