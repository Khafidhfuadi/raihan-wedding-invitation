import React from 'react';
import { motion } from 'framer-motion';

const Etiquette = () => {
  const etiquetteItems = [
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20.38 3.4a1.6 1.6 0 0 1 .58 2.4l-1.9 2.9A4 4 0 0 1 15.6 10.5H8.4a4 4 0 0 1-3.47-1.8l-1.9-2.9a1.6 1.6 0 0 1 .58-2.4 1.62 1.62 0 0 1 2.4.58l.7 1.07h10.4l.7-1.07a1.62 1.62 0 0 1 2.39-.58z"></path><path d="M12 10.5V21"></path><path d="M8 21h8"></path></svg>
      ),
      text: "Memakai pakaian yang sopan dan menutup aurat"
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
      ),
      text: "Memperhatikan waktu sholat"
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"></path><path d="M12 15l-3 3a2.2 2.2 0 0 0-.09 2.91c.84 1.29 5 2 5 2s-.5-3.74-2-5a2.2 2.2 0 0 0-2.91-.09z"></path><path d="M12 15a6 6 0 0 0 6-6c0-1-1-2-2-2s-2 1-2 2"></path><path d="M16 9c1 0 2-1 2-2s-1-2-2-2-2 1-2 2"></path></svg>
      ),
      text: "Mendoakan kedua mempelai"
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"></line><path d="M16 12h-8"></path></svg>
      ),
      text: "Dilarang merokok"
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"></path><path d="M7 2v20"></path><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"></path></svg>
      ),
      text: "Makan & minum sambil duduk"
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle><line x1="3" y1="3" x2="21" y2="21"></line></svg>
      ),
      text: "Dilarang mengambil foto tanpa seizin kedua mempelai"
    },
  ];

  return (
    <section className="py-20 bg-vanilla text-main-red relative overflow-hidden">
      {/* Subtle Pattern Background */}
      <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(#842A3B_1px,transparent_1px)] [background-size:16px_16px]"></div>

      <div className="container mx-auto px-6 relative z-10 max-w-4xl text-center">
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mb-12"
        >
            <motion.h2 
              initial={{ scale: 0.9 }}
              whileInView={{ scale: 1 }}
              transition={{ duration: 0.6, type: "spring" }}
              className="font-pinyon text-5xl md:text-6xl mb-6 text-accent-wine"
            >
              Adab Walimah
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="font-dm-sans text-main-red/80 max-w-lg mx-auto leading-relaxed"
            >
                Tanpa mengurangi rasa hormat, ada hal-hal dalam adab seorang muslim ketika menghadiri walimah yang harus diperhatikan:
            </motion.p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-12 mb-16">
            {etiquetteItems.map((item, index) => (
                <motion.div 
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.5, type: "spring" }}
                    viewport={{ once: true }}
                    className="flex flex-col items-center group cursor-default"
                >
                    <motion.div 
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        className="w-20 h-20 md:w-24 md:h-24 bg-accent-wine/80 rounded-full flex items-center justify-center text-vanilla mb-4 shadow-lg group-hover:bg-accent-wine transition-colors duration-300"
                    >
                        {item.icon}
                    </motion.div>
                    <p className="font-dm-sans text-sm text-main-red font-medium leading-snug max-w-[150px]">
                        {item.text}
                    </p>
                </motion.div>
            ))}
        </div>

        <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-accent-wine/10 border-l-4 border-accent-wine p-6 rounded-r-xl text-left md:text-center max-w-2xl mx-auto hover:bg-accent-wine/20 transition-colors duration-300"
        >
            <p className="font-dm-sans italic text-main-red/90 text-sm md:text-base leading-relaxed">
                "Dan di antara ayat-ayat-Nya ialah Dia menciptakan untukmu istri-istri dari jenismu sendiri, supaya kamu merasa nyaman kepadanya, dan dijadikan-Nya di antaramu mawaddah dan rahmah. Sesungguhnya pada yang demikian itu benar-benar terdapat tanda-tanda bagi kaum yang berpikir."
                <br/><span className="font-bold not-italic mt-2 block text-xs md:text-sm">(QS. Ar-Rum: 21)</span>
            </p>
        </motion.div>
      </div>
    </section>
  );
};

export default Etiquette;
