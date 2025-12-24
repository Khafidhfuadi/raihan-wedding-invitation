import React from 'react';
import { motion } from 'framer-motion';
import closingVector from '../assets/closing-vector.webp';
import decorLeft from '../assets/decor-left.webp';
import decorRight from '../assets/decor-right.webp';

const Closing = () => {
    return (
        <section className="py-24 bg-vanilla text-main-red relative overflow-hidden flex flex-col items-center text-center">
            {/* Background Animation */}
            <div className="absolute inset-0 pointer-events-none opacity-10">
                <motion.div
                    animate={{ y: [0, -20, 0] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-10 left-10 w-20 h-20 bg-accent-wine rounded-full blur-2xl"
                />
                <motion.div
                    animate={{ y: [0, 20, 0] }}
                    transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute bottom-10 right-10 w-32 h-32 bg-accent-wine rounded-full blur-2xl"
                />
            </div>

            {/* Decorative Bouquet Top */}
            <motion.div
                initial={{ y: -50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 1 }}
                viewport={{ once: true }}
                className="mb-8 relative z-10"
            >
                <div className="w-48 h-auto mx-auto relative">
                    <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute inset-0 bg-vanilla/10 blur-2xl rounded-full"
                    ></motion.div>
                    <motion.img
                        whileHover={{ scale: 1.05, rotate: 2 }}
                        src={closingVector}
                        alt="Decoration"
                        className="w-full h-auto object-contain relative z-10 drop-shadow-lg"
                    />
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                viewport={{ once: true }}
                className="container mx-auto px-6 relative z-10"
            >
                <motion.h2
                    initial={{ y: 20 }}
                    whileInView={{ y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="font-pinyon text-4xl md:text-5xl mb-6 text-accent-wine"
                >
                    جَزَاكُمُ اللهُ خَيْرًا
                </motion.h2>
                <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.8 }}
                    className="font-dm-sans text-main-red/90 max-w-lg mx-auto mb-10 leading-relaxed"
                >
                    Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu kepada kedua mempelai.
                </motion.p>

                <div className="mb-12">
                    <p className="font-pinyon text-3xl mb-4 text-main-red/80">Kami Yang Berbahagia,</p>
                    <motion.h3
                        whileHover={{ scale: 1.05 }}
                        className="font-pinyon text-5xl md:text-6xl mb-8 drop-shadow-lg text-accent-wine cursor-default"
                    >
                        Raihan & Fadhil
                    </motion.h3>

                    <div className="flex flex-col gap-6 font-dm-sans text-sm md:text-base text-main-red/80">
                        <motion.div
                            initial={{ x: -20, opacity: 0 }}
                            whileInView={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.6 }}
                        >
                            <p className="font-bold">Keluarga Besar</p>
                            <p>Bapak Mista Sucipto & Ibu Hodijah</p>
                        </motion.div>
                        <div className="text-xl font-pinyon text-main-red/60">- & -</div>
                        <motion.div
                            initial={{ x: 20, opacity: 0 }}
                            whileInView={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.8 }}
                        >
                            <p className="font-bold">Keluarga Besar</p>
                            <p>Bapak Aryadin & Ibu Titik Hartini</p>
                        </motion.div>
                    </div>
                </div>
            </motion.div>

            {/* Side Decorations */}
            <motion.div
                initial={{ x: -50, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                transition={{ duration: 1 }}
                viewport={{ once: true }}
                className="absolute bottom-0 left-0 w-32 md:w-48 opacity-40 pointer-events-none"
            >
                <motion.img
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    src={decorLeft}
                    className="w-full h-full object-contain"
                    alt=""
                />
            </motion.div>
            <motion.div
                initial={{ x: 50, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                transition={{ duration: 1 }}
                viewport={{ once: true }}
                className="absolute bottom-0 right-0 w-32 md:w-48 opacity-40 pointer-events-none"
            >
                <motion.img
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    src={decorRight}
                    className="w-full h-full object-contain"
                    alt=""
                />
            </motion.div>
        </section>
    );
};

export default Closing;
