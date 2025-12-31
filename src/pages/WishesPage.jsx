import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

const WishesPage = () => {
    const [wishes, setWishes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchWishes();

        const channel = supabase
            .channel('wishes_page_channel')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'wishes' }, (payload) => {
                setWishes((prev) => [payload.new, ...prev]);
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    const fetchWishes = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('wishes')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            if (data) setWishes(data);
        } catch (err) {
            console.error('Error fetching wishes:', err.message);
        } finally {
            setLoading(false);
        }
    };

    const formatTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', {
            day: 'numeric', month: 'short', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
        }).replace('.', ':');
    };

    // Memoized columns for masonry layout
    const getColumns = (cols) => {
        const columns = Array.from({ length: cols }, () => []);
        wishes.forEach((wish, i) => {
            columns[i % cols].push(wish);
        });
        return columns;
    };

    // Responsive columns logic could be handled by CSS grid actually, but JS masonry is smoother for varied heights without gaps.
    // For simplicity and robustness, let's use CSS Columns (multi-column layout) which is native and works great for masonry.

    return (
        <div className="min-h-screen bg-main-red text-vanilla selection:bg-accent-wine selection:text-vanilla overflow-x-hidden relative">

            {/* Background Decorations */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <motion.div
                    initial={{ opacity: 0 }} animate={{ opacity: 0.1 }} transition={{ duration: 2 }}
                    className="absolute -top-20 -left-20 w-96 h-96 bg-accent-wine rounded-full blur-[100px]"
                />
                <motion.div
                    initial={{ opacity: 0 }} animate={{ opacity: 0.1 }} transition={{ duration: 2, delay: 1 }}
                    className="absolute top-1/2 right-0 w-80 h-80 bg-highlight-rose rounded-full blur-[100px]"
                />
                <motion.div
                    initial={{ opacity: 0 }} animate={{ opacity: 0.05 }} transition={{ duration: 3, delay: 0.5 }}
                    className="absolute bottom-0 left-1/3 w-full h-64 bg-accent-wine rounded-full blur-[120px]"
                />
            </div>

            <div className="container mx-auto px-6 py-12 relative z-10">

                {/* Header */}
                <header className="mb-16 text-center">
                    <motion.div
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        <Link to="/" className="inline-flex items-center gap-2 text-vanilla/60 hover:text-vanilla transition-colors mb-6 group">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:-translate-x-1 transition-transform"><path d="M19 12H5" /><path d="M12 19l-7-7 7-7" /></svg>
                            Kembali ke Undangan
                        </Link>
                        <h1 className="font-pinyon text-6xl md:text-7xl mb-4 text-vanilla drop-shadow-sm">
                            Wall of Wishes
                        </h1>
                        <p className="font-dm-sans text-vanilla/80 text-lg max-w-2xl mx-auto leading-relaxed">
                            Kumpulan doa dan harapan tulus dari keluarga dan sahabat untuk perjalanan cinta kami.
                        </p>
                    </motion.div>
                </header>

                {/* Content */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="h-40 bg-accent-wine/20 rounded-2xl border border-vanilla/10"></div>
                        ))}
                    </div>
                ) : (
                    wishes.length > 0 ? (
                        /* Masonry Layout using CSS columns */
                        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
                            <AnimatePresence>
                                {wishes.map((wish, index) => (
                                    <motion.div
                                        key={wish.id}
                                        initial={{ opacity: 0, y: 50 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5, delay: index * 0.05 }}
                                        className="break-inside-avoid"
                                    >
                                        <div className="group relative bg-accent-wine/30 backdrop-blur-md p-6 rounded-2xl border border-vanilla/20 shadow-lg hover:shadow-xl hover:bg-accent-wine/40 transition-all duration-300 transform hover:-translate-y-1">
                                            {/* Quote Icon Decoration */}
                                            <div className="absolute top-4 right-6 text-vanilla/10 group-hover:text-vanilla/20 transition-colors pointer-events-none">
                                                <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor"><path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C19.5693 16 20.017 15.5523 20.017 15V9C20.017 8.44772 19.5693 8 19.017 8H15.017C14.4647 8 14.017 8.44772 14.017 9V11C14.017 11.5523 13.5693 12 13.017 12H12.017V5H22.017V15C22.017 18.3137 19.3307 21 16.017 21H14.017ZM5.0166 21L5.0166 18C5.0166 16.8954 5.91203 16 7.0166 16H10.0166C10.5689 16 11.0166 15.5523 11.0166 15V9C11.0166 8.44772 10.0166 8 8.0166 8H6.0166C5.46432 8 5.0166 8.44772 5.0166 9V11C5.0166 11.5523 4.56889 12 4.0166 12H3.0166V5H13.0166V15C13.0166 18.3137 10.3303 21 7.0166 21H5.0166Z" /></svg>
                                            </div>

                                            <div className="mb-4">
                                                <h3 className="font-dm-sans font-bold text-xl text-vanilla mb-1">{wish.name}</h3>
                                                <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider bg-vanilla/10 text-vanilla/60 uppercase">
                                                    Guest
                                                </span>
                                            </div>

                                            <p className="font-dm-sans text-vanilla/90 leading-relaxed text-sm md:text-base whitespace-pre-line relative z-10">
                                                {wish.message}
                                            </p>

                                            <div className="mt-4 pt-4 border-t border-vanilla/10 flex items-center justify-between text-xs text-vanilla/50 font-dm-sans">
                                                <span>{formatTime(wish.created_at)}</span>
                                                <div className="flex gap-1">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-vanilla/30"></div>
                                                    <div className="w-1.5 h-1.5 rounded-full bg-vanilla/30"></div>
                                                    <div className="w-1.5 h-1.5 rounded-full bg-vanilla/30"></div>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    ) : (
                        <div className="text-center py-20 opacity-60">
                            <p className="font-dm-sans text-xl italic text-vanilla">Belum ada ucapan. Jadilah yang pertama!</p>
                        </div>
                    )
                )}
            </div>
        </div>
    );
};

export default WishesPage;
