import React from 'react';
import { motion } from 'framer-motion';
import manVector from '../assets/man-vector.png';
import womanVector from '../assets/woman-vector.png';
import sectionDivider from '../assets/divider-section.png';

const CoupleIntro = () => {
    return (
        <section className="py-24 bg-vanilla text-main-red relative overflow-hidden">
            {/* Background Particles */}
            <div className="absolute inset-0 pointer-events-none">
                {[...Array(3)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute bg-accent-wine/5 rounded-full blur-2xl"
                        style={{
                            width: Math.random() * 200 + 100 + 'px',
                            height: Math.random() * 200 + 100 + 'px',
                            top: Math.random() * 100 + '%',
                            left: Math.random() * 100 + '%',
                        }}
                        animate={{
                            y: [0, -50, 0],
                            opacity: [0.3, 0.6, 0.3],
                        }}
                        transition={{
                            duration: Math.random() * 10 + 10,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    />
                ))}
            </div>

            {/* Decorative Divider Top */}
            <div className="absolute top-0 left-0 w-full h-16 opacity-20 pointer-events-none transform rotate-180">
                <img src={sectionDivider} alt="" className="w-full h-full object-cover" />
            </div>

            <div className="container mx-auto px-6 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <motion.h2
                        initial={{ scale: 0.9, opacity: 0 }}
                        whileInView={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="font-pinyon text-5xl md:text-6xl mb-6 text-accent-wine"
                    >
                        Mempelai
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 0.4 }}
                        className="font-dm-sans text-main-red/80 italic max-w-2xl mx-auto"
                    >
                        "Dan segala sesuatu Kami ciptakan berpasang-pasangan supaya kamu mengingat kebesaran Allah."
                        <br /><span className="font-bold not-italic text-sm mt-2 block">(QS. Adz-Dzariyat: 49)</span>
                    </motion.p>
                </motion.div>

                <div className="flex flex-col md:flex-row justify-center items-center gap-8 md:gap-0 relative">
                    {/* Bride (Raihan) */}
                    <motion.div
                        initial={{ x: -50, opacity: 0 }}
                        whileInView={{ x: 0, opacity: 1 }}
                        transition={{ duration: 1 }}
                        viewport={{ once: true }}
                        className="flex-1 w-full flex flex-col items-center text-center md:items-end md:text-right md:border-r border-accent-wine/20 md:pr-12"
                    >
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            transition={{ type: "spring", stiffness: 300 }}
                            className="relative mb-6 group cursor-pointer"
                        >
                            <div className="absolute inset-0 bg-accent-wine rounded-full opacity-0 group-hover:opacity-10 transition-opacity duration-300 transform scale-105"></div>
                            <div className="w-48 h-48 md:w-56 md:h-56 rounded-full overflow-hidden border-4 border-accent-wine shadow-xl bg-white">
                                <img src={womanVector} alt="Raihan" className="w-full h-full object-cover" />
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3, duration: 0.8 }}
                        >
                            <h3 className="font-pinyon text-4xl text-accent-wine mb-2">Raihan</h3>
                            <p className="font-dm-sans font-bold text-xl mb-1 text-main-red">Raihan Zaina</p>
                            <p className="font-dm-sans text-sm text-main-red/70 mb-2">Putri dari Bapak Mista Sucipto & Ibu Hodijah</p>
                            <p className="font-dm-sans text-xs text-main-red/60 italic max-w-xs md:ml-auto">
                                Kp. Jampang RT.01 RW.03, Ds. Wanaherang, <br />Kec. Gunung Putri, Kab. Bogor
                            </p>
                        </motion.div>

                        <div className="flex gap-3 justify-center md:justify-end mt-4">
                            {/* Instagram link removed */}
                        </div>
                    </motion.div>

                    {/* Ampersand in between */}
                    <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        whileInView={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.5, duration: 0.5, type: "spring" }}
                        className="font-serif italic text-6xl text-accent-wine md:absolute md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 z-20 my-4 md:my-0"
                    >
                        &
                    </motion.div>

                    {/* Groom (Fadhil) */}
                    <motion.div
                        initial={{ x: 50, opacity: 0 }}
                        whileInView={{ x: 0, opacity: 1 }}
                        transition={{ duration: 1 }}
                        viewport={{ once: true }}
                        className="flex-1 w-full flex flex-col items-center text-center md:items-start md:text-left md:pl-12"
                    >
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            transition={{ type: "spring", stiffness: 300 }}
                            className="relative mb-6 group cursor-pointer"
                        >
                            <div className="absolute inset-0 bg-accent-wine rounded-full opacity-0 group-hover:opacity-10 transition-opacity duration-300 transform scale-105"></div>
                            <div className="w-48 h-48 md:w-56 md:h-56 rounded-full overflow-hidden border-4 border-accent-wine shadow-xl bg-white">
                                <img src={manVector} alt="Fadhil" className="w-full h-full object-cover" />
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3, duration: 0.8 }}
                        >
                            <h3 className="font-pinyon text-4xl text-accent-wine mb-2">Fadhil</h3>
                            <p className="font-dm-sans font-bold text-xl mb-1 text-main-red">Muhammad Fadhilah</p>
                            <p className="font-dm-sans text-sm text-main-red/70 mb-2">Putra dari Bapak Aryadin & Ibu Titik Hartini</p>
                            <p className="font-dm-sans text-xs text-main-red/60 italic max-w-xs md:mr-auto">
                                Perum Wahana Pondok Gede Blok B4/16 RT.11 RW.07, <br />Kel. Jatiranggon, Kec. Jati Sampurna, Kota Bekasi
                            </p>
                        </motion.div>

                        <div className="flex gap-3 justify-center md:justify-start mt-4">
                            {/* Instagram link removed */}
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Decorative Divider Bottom */}
            <div className="absolute bottom-0 left-0 w-full h-16 opacity-20 pointer-events-none">
                <img src={sectionDivider} alt="" className="w-full h-full object-cover" />
            </div>
        </section>
    );
};

export default CoupleIntro;
