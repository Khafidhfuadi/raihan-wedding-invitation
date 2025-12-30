import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const EventDetails = () => {
    // Parallax background effect
    const { scrollYProgress } = useScroll();
    const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

    return (
        <section className="py-20 bg-main-red text-vanilla relative overflow-hidden">
            {/* Simple pattern overlay with subtle parallax */}
            <motion.div
                style={{ y: bgY }}
                className="absolute inset-0 opacity-5 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white to-transparent pointer-events-none"
            ></motion.div>

            {/* Floating Background Particles */}
            <div className="absolute inset-0 pointer-events-none">
                {[...Array(5)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute bg-vanilla/10 rounded-full blur-xl"
                        style={{
                            width: Math.random() * 100 + 50 + 'px',
                            height: Math.random() * 100 + 50 + 'px',
                            top: Math.random() * 100 + '%',
                            left: Math.random() * 100 + '%',
                        }}
                        animate={{
                            y: [0, -50, 0],
                            x: [0, 30, 0],
                            opacity: [0.1, 0.3, 0.1],
                        }}
                        transition={{
                            duration: Math.random() * 10 + 10,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    />
                ))}
            </div>

            <div className="container mx-auto px-6 text-center z-10 relative">
                <motion.h2
                    initial={{ y: 30, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8, type: "spring" }}
                    viewport={{ once: true }}
                    className="font-pinyon text-5xl md:text-6xl mb-12 drop-shadow-md"
                >
                    Rangkaian Acara
                </motion.h2>

                <div className="flex flex-col md:flex-row justify-center gap-8 md:gap-12">
                    {/* Akad Nikah */}
                    <motion.div
                        initial={{ x: -50, opacity: 0 }}
                        whileInView={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
                        viewport={{ once: true }}
                        whileHover={{ y: -15, scale: 1.02 }}
                        className="bg-accent-wine/30 backdrop-blur-sm p-8 rounded-2xl border border-vanilla/20 flex-1 max-w-md mx-auto w-full hover:bg-accent-wine/40 transition-all cursor-default shadow-lg hover:shadow-2xl group"
                    >
                        <motion.div
                            initial={{ rotate: 0 }}
                            whileInView={{ rotate: [0, 10, -10, 0] }}
                            transition={{ duration: 1, delay: 0.5 }}
                            whileHover={{ rotate: 360, scale: 1.1 }}
                            className="w-12 h-12 mx-auto mb-4 bg-vanilla/10 rounded-full flex items-center justify-center text-vanilla group-hover:bg-vanilla group-hover:text-accent-wine transition-colors duration-300"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"></path></svg>
                        </motion.div>
                        <h3 className="font-pinyon text-4xl mb-2">Akad</h3>
                        <p className="font-dm-sans font-bold text-xl mb-4">Sabtu, 10 Januari 2026</p>
                        <div className="font-dm-sans text-sm opacity-90 space-y-2">
                            <p className="flex items-center justify-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                                Pukul 08:00 WIB
                            </p>
                            <p className="px-4">
                                Bertempat di Kediaman Mempelai Wanita<br />
                                Kp. Jampang RT.01 RW.03, Ds. Wanaherang, Kec. Gunung Putri, Kab. Bogor
                            </p>
                        </div>
                    </motion.div>

                    {/* Resepsi */}
                    <motion.div
                        initial={{ x: 50, opacity: 0 }}
                        whileInView={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.8, type: "spring", bounce: 0.4, delay: 0.2 }}
                        viewport={{ once: true }}
                        whileHover={{ y: -15, scale: 1.02 }}
                        className="bg-accent-wine/30 backdrop-blur-sm p-8 rounded-2xl border border-vanilla/20 flex-1 max-w-md mx-auto w-full hover:bg-accent-wine/40 transition-all cursor-default shadow-lg hover:shadow-2xl group"
                    >
                        <motion.div
                            initial={{ rotate: 0 }}
                            whileInView={{ rotate: [0, 10, -10, 0] }}
                            transition={{ duration: 1, delay: 0.7 }}
                            whileHover={{ rotate: 360, scale: 1.1 }}
                            className="w-12 h-12 mx-auto mb-4 bg-vanilla/10 rounded-full flex items-center justify-center text-vanilla group-hover:bg-vanilla group-hover:text-accent-wine transition-colors duration-300"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                        </motion.div>
                        <h3 className="font-pinyon text-4xl mb-2">Walimatul Urs</h3>
                        <p className="font-dm-sans font-bold text-xl mb-4">Sabtu, 10 Januari 2026</p>
                        <div className="font-dm-sans text-sm opacity-90 space-y-2">
                            <p className="flex items-center justify-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                                Pukul 11:00 s/d Selesai
                            </p>
                            <p className="px-4">
                                Bertempat di Kediaman Mempelai Wanita<br />
                                Kp. Jampang RT.01 RW.03, Ds. Wanaherang, Kec. Gunung Putri, Kab. Bogor
                            </p>
                        </div>
                    </motion.div>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.8 }}
                    viewport={{ once: true }}
                    className="mt-12 w-full max-w-4xl mx-auto"
                >
                    {/* Google Maps Embed */}
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.3 }}
                        className="rounded-xl overflow-hidden shadow-2xl border-4 border-vanilla/20 mb-8 h-64 md:h-80"
                    >

                        <iframe src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d2982.1018601981027!2d106.93557260803836!3d-6.412941717413175!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2s!5e1!3m2!1sid!2sid!4v1767094673107!5m2!1sid!2sid" width="100%" height="100%" style={{ border: 0 }} allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
                    </motion.div>

                    <motion.a
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        href="https://maps.app.goo.gl/wh8aP4oJ9YSjiVKKA"
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-vanilla text-main-red font-bold rounded-full hover:bg-white transition-all shadow-lg text-sm md:text-base group"
                    >
                        <motion.svg
                            animate={{ y: [0, -3, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                            xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                        >
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle>
                        </motion.svg>
                        Buka di Google Maps
                    </motion.a>
                </motion.div>
            </div>
        </section>
    );
};

export default EventDetails;
