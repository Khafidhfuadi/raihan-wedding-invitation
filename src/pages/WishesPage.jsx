import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

// --- Particle Components ---
const Particle = ({ delay }) => {
    const randomX = Math.random() * 100;
    const randomY = Math.random() * 100;
    const randomSize = Math.random() * 4 + 1;
    const duration = Math.random() * 20 + 10;

    return (
        <motion.div
            initial={{ x: `${randomX}vw`, y: `110vh`, opacity: 0 }}
            animate={{
                y: `-10vh`,
                opacity: [0, 0.5, 0],
                x: [`${randomX}vw`, `${randomX + (Math.random() * 10 - 5)}vw`]
            }}
            transition={{
                duration: duration,
                repeat: Infinity,
                delay: delay,
                ease: "linear"
            }}
            className="absolute bg-vanilla rounded-full pointer-events-none"
            style={{
                width: randomSize,
                height: randomSize,
                filter: 'blur(1px)'
            }}
        />
    );
};

const ParticleBackground = () => (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {[...Array(30)].map((_, i) => (
            <Particle key={i} delay={Math.random() * 20} />
        ))}
    </div>
);

// --- Relative Time Helper ---
const getRelativeTime = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) {
        return "Baru saja";
    }

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
        return `${diffInMinutes} menit lalu`;
    }

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
        return `${diffInHours} jam lalu`;
    }

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) {
        return `${diffInDays} hari lalu`;
    }

    const diffInWeeks = Math.floor(diffInDays / 7);
    if (diffInWeeks < 4) {
        if (diffInWeeks === 1) return "Seminggu lalu";
        return `${diffInWeeks} minggu lalu`;
    }

    const diffInMonths = Math.floor(diffInDays / 30);
    if (diffInMonths === 1) return "1 bulan lalu";
    if (diffInMonths < 12) return `${diffInMonths} bulan lalu`;

    return "Lebih dari setahun lalu";
};

// --- Vertical Marquee Component ---
const VerticalMarqueeColumn = ({ items, speed = 50, className = "" }) => {
    const [contentHeight, setContentHeight] = useState(0);
    const containerRef = useRef(null);

    // If very few items, duplicate more to ensure smooth scroll
    // We need enough items to cover at least 2x view height ideally
    const MIN_ITEMS = 6;
    const repeatCount = items.length < MIN_ITEMS ? Math.ceil(MIN_ITEMS / Math.max(1, items.length)) * 2 : 2;
    const duplicatedItems = Array(repeatCount).fill(items).flat();

    useEffect(() => {
        if (containerRef.current) {
            setContentHeight(containerRef.current.scrollHeight / 2);
        }
    }, [items]);

    return (
        <div className={`relative h-full overflow-hidden ${className}`}>
            {/* Gradient masks */}
            <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-main-red to-transparent z-10 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-main-red to-transparent z-10 pointer-events-none"></div>

            <motion.div
                ref={containerRef}
                className="flex flex-col gap-6"
                initial={{ y: 0 }}
                animate={{ y: "-50%" }}
                transition={{
                    y: {
                        repeat: Infinity,
                        repeatType: "loop",
                        duration: Math.max(30, duplicatedItems.length * 5) * (100 / speed), // Adjust speed logic
                        ease: "linear",
                    }
                }}
            >
                {duplicatedItems.map((wish, idx) => (
                    <div
                        key={`${wish.id}-${idx}`}
                        className="w-full"
                    >
                        <div className="group relative bg-accent-wine/30 backdrop-blur-md p-6 rounded-2xl border border-vanilla/20 shadow-lg hover:shadow-xl hover:bg-accent-wine/40 transition-all duration-300 transform">
                            {/* Quote Icon Decoration */}
                            <div className="absolute top-4 right-6 text-vanilla/10 group-hover:text-vanilla/20 transition-colors pointer-events-none">
                                <svg width="30" height="30" viewBox="0 0 24 24" fill="currentColor"><path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C19.5693 16 20.017 15.5523 20.017 15V9C20.017 8.44772 19.5693 8 19.017 8H15.017C14.4647 8 14.017 8.44772 14.017 9V11C14.017 11.5523 13.5693 12 13.017 12H12.017V5H22.017V15C22.017 18.3137 19.3307 21 16.017 21H14.017ZM5.0166 21L5.0166 18C5.0166 16.8954 5.91203 16 7.0166 16H10.0166C10.5689 16 11.0166 15.5523 11.0166 15V9C11.0166 8.44772 10.0166 8 8.0166 8H6.0166C5.46432 8 5.0166 8.44772 5.0166 9V11C5.0166 11.5523 4.56889 12 4.0166 12H3.0166V5H13.0166V15C13.0166 18.3137 10.3303 21 7.0166 21H5.0166Z" /></svg>
                            </div>

                            <div className="mb-3">
                                <h3 className="font-dm-sans font-bold text-lg text-vanilla mb-1 truncate">{wish.name}</h3>
                            </div>

                            <p className="font-dm-sans text-vanilla/90 leading-relaxed text-sm whitespace-pre-line relative z-10 line-clamp-6">
                                {wish.message}
                            </p>

                            <div className="mt-3 pt-3 border-t border-vanilla/10 flex items-center justify-between text-xs text-vanilla/50 font-dm-sans">
                                {/* Simple time display */}
                                <span>{getRelativeTime(wish.created_at)}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </motion.div>
        </div>
    );
};


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

    // Split wishes into 3 balanced columns
    const getColumns = () => {
        const cols = [[], [], []];
        wishes.forEach((wish, i) => {
            cols[i % 3].push(wish);
        });
        return cols;
    };

    const columns = getColumns();

    return (
        <div className="h-screen w-screen bg-main-red text-vanilla selection:bg-accent-wine selection:text-vanilla overflow-hidden relative flex flex-col">

            <ParticleBackground />

            {/* Background Gradients/Blur */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
                <motion.div
                    initial={{ opacity: 0 }} animate={{ opacity: 0.1 }} transition={{ duration: 2 }}
                    className="absolute -top-20 -left-20 w-96 h-96 bg-accent-wine rounded-full blur-[100px]"
                />
                <motion.div
                    initial={{ opacity: 0 }} animate={{ opacity: 0.05 }} transition={{ duration: 3, delay: 0.5 }}
                    className="absolute bottom-0 right-0 w-full h-80 bg-accent-wine rounded-full blur-[120px]"
                />
            </div>

            <div className="container mx-auto px-4 py-6 relative z-10 flex-none z-20">
                {/* Compact Header */}
                <header className="flex justify-between items-end border-b border-vanilla/10 pb-4 mb-4">
                    <h1 className="font-pinyon text-5xl md:text-6xl text-vanilla drop-shadow-sm leading-none">
                        Wall of Wishes
                    </h1>
                    <div className="text-right hidden md:block">
                        <p className="font-dm-sans text-vanilla/80 text-sm max-w-md ml-auto">
                            Kumpulan doa dan harapan untuk Raihan & Fadhil
                        </p>
                        <div className="text-4xl font-pinyon text-vanilla/40 mt-1">#RaihanFadhilWedding</div>
                    </div>
                </header>
            </div>

            {/* Main Content Area - Full remaining height */}
            <div className="flex-1 container mx-auto px-4 relative z-10 overflow-hidden pb-4">
                {loading ? (
                    <div className="flex justify-center items-center h-full">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-vanilla"></div>
                    </div>
                ) : (
                    wishes.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 h-full">
                            {/* Render Columns with different speeds for Parallax effect */}
                            <VerticalMarqueeColumn items={columns[0]} speed={100} className="" />
                            <VerticalMarqueeColumn items={columns[1]} speed={80} className="hidden md:block pt-12" /> {/* Staggered start visually */}
                            <VerticalMarqueeColumn items={columns[2]} speed={110} className="hidden lg:block pt-24" />
                        </div>
                    ) : (
                        <div className="flex flex-col justify-center items-center h-full opacity-60">
                            <p className="font-dm-sans text-2xl italic text-vanilla">Belum ada ucapan.</p>
                            <p className="font-dm-sans text-sm mt-2 text-vanilla/60">Jadilah yang pertama mengirimkan doa!</p>
                        </div>
                    )
                )}
            </div>
        </div>
    );
};

export default WishesPage;
