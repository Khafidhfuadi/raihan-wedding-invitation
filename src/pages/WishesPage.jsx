import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import decorLeft from '../assets/decor-left.webp';
import decorRight from '../assets/decor-right.webp';

// --- Particle Components ---
const Particle = React.memo(({ delay }) => {
    // Memoize random values to strictly prevent regeneration on re-renders
    const { randomX, randomSize, duration, xVariation } = React.useMemo(() => ({
        randomX: Math.random() * 100,
        randomSize: Math.random() * 6 + 4,
        duration: Math.random() * 20 + 10,
        xVariation: Math.random() * 10 - 5
    }), []);

    return (
        <motion.div
            initial={{ x: `${randomX}vw`, y: `110vh`, opacity: 0 }}
            animate={{
                y: `-10vh`,
                opacity: [0, 0.9, 0],
                x: [`${randomX}vw`, `${randomX + xVariation}vw`]
            }}
            transition={{
                duration: duration,
                repeat: Infinity,
                delay: delay,
                ease: "linear"
            }}
            className="absolute bg-vanilla rounded-full pointer-events-none shadow-[0_0_15px_rgba(255,253,208,0.7)]"
            style={{
                width: randomSize,
                height: randomSize,
                filter: 'blur(0.2px)'
            }}
        />
    );
});

const ParticleBackground = React.memo(() => (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {[...Array(100)].map((_, i) => (
            <Particle key={i} delay={Math.random() * 20} />
        ))}
    </div>
));

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

// --- New Wish Popup Component ---
const NewWishPopup = ({ wish, onComplete }) => {
    useEffect(() => {
        // Play notification sound if possible? (Optional, maybe later)

        const timer = setTimeout(() => {
            onComplete();
        }, 8000); // Display for 8 seconds
        return () => clearTimeout(timer);
    }, [onComplete]);

    return (
        <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0, y: -500, transition: { duration: 0.8, ease: "backIn" } }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
            <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            <motion.div
                className="relative bg-main-red border border-vanilla/30 p-12 md:p-16 rounded-3xl shadow-2xl max-w-3xl w-full text-center overflow-hidden"
                layoutId={`wish-${wish.id}`}
            >

                <motion.img
                    initial={{ opacity: 0, x: 20 }} animate={{ opacity: 0.8, x: 0 }} transition={{ delay: 0.2, duration: 0.8 }}
                    src={decorRight} className="absolute bottom-0 right-0 w-40 md:w-56 pointer-events-none translate-x-10 translate-y-10 opacity-50 mix-blend-screen" alt=""
                />

                {/* Decorative Glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-accent-wine/40 blur-[80px] -z-10 animate-pulse"></div>

                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    <div className="inline-block px-4 py-1 rounded-full bg-vanilla/10 text-vanilla border border-vanilla/20 text-sm font-dm-sans mb-6">
                        ✨ جَزَاكُمُ ٱللّٰهُ خَيْرًا ✨
                    </div>
                </motion.div>

                <motion.h3
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.3, type: "spring" }}
                    className="font-pinyon text-5xl md:text-6xl text-vanilla mb-6 leading-tight"
                >
                    {wish.name}
                </motion.h3>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="relative"
                >
                    <svg className="absolute -top-4 -left-2 text-vanilla/10 w-12 h-12" viewBox="0 0 24 24" fill="currentColor"><path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C19.5693 16 20.017 15.5523 20.017 15V9C20.017 8.44772 19.5693 8 19.017 8H15.017C14.4647 8 14.017 8.44772 14.017 9V11C14.017 11.5523 13.5693 12 13.017 12H12.017V5H22.017V15C22.017 18.3137 19.3307 21 16.017 21H14.017ZM5.0166 21L5.0166 18C5.0166 16.8954 5.91203 16 7.0166 16H10.0166C10.5689 16 11.0166 15.5523 11.0166 15V9C11.0166 8.44772 10.0166 8 8.0166 8H6.0166C5.46432 8 5.0166 8.44772 5.0166 9V11C5.0166 11.5523 4.56889 12 4.0166 12H3.0166V5H13.0166V15C13.0166 18.3137 10.3303 21 7.0166 21H5.0166Z" /></svg>
                    <p className="font-dm-sans text-xl md:text-2xl text-vanilla/90 italic leading-relaxed px-8">
                        "{wish.message}"
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 }}
                    className="mt-8 text-sm text-vanilla/50 font-dm-sans"
                >
                    Baru saja
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.9 }}
                    className="mt-4 text-2xl font-pinyon text-vanilla/30"
                >
                    #RaihanFadhilWedding
                </motion.div>
            </motion.div>
        </motion.div>
    );
};

// --- vertical Marquee Component ---
const VerticalMarqueeColumn = React.memo(({ items, speed = 50, className = "", highlightedIds = new Set() }) => {
    const [contentHeight, setContentHeight] = useState(0);
    const containerRef = useRef(null);

    // Memoize the duplicated items based on the input items 
    // This prevents re-creation on every render if items haven't changed
    const duplicatedItems = React.useMemo(() => {
        const MIN_ITEMS = 6;
        const repeatCount = items.length < MIN_ITEMS ? Math.ceil(MIN_ITEMS / Math.max(1, items.length)) * 2 : 2;
        return Array(repeatCount).fill(items).flat();
    }, [items]);

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
                {duplicatedItems.map((wish, idx) => {
                    const isHighlighted = highlightedIds.has(wish.id);
                    return (
                        <div
                            key={`${wish.id}-${idx}`}
                            className="w-full"
                        >
                            <div className={`
                                group relative backdrop-blur-md p-6 rounded-2xl border transition-all duration-500
                                ${isHighlighted
                                    ? 'bg-accent-wine/80 border-amber-200/50 shadow-[0_0_20px_rgba(251,191,36,0.15)]'
                                    : 'bg-accent-wine/30 border-vanilla/20 shadow-lg hover:shadow-xl hover:bg-accent-wine/40'
                                }
                            `}>
                                {/* Quote Icon Decoration */}
                                <div className={`absolute top-4 right-6 transition-colors pointer-events-none ${isHighlighted ? 'text-amber-200/20' : 'text-vanilla/10 group-hover:text-vanilla/20'}`}>
                                    <svg width="30" height="30" viewBox="0 0 24 24" fill="currentColor"><path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C19.5693 16 20.017 15.5523 20.017 15V9C20.017 8.44772 19.5693 8 19.017 8H15.017C14.4647 8 14.017 8.44772 14.017 9V11C14.017 11.5523 13.5693 12 13.017 12H12.017V5H22.017V15C22.017 18.3137 19.3307 21 16.017 21H14.017ZM5.0166 21L5.0166 18C5.0166 16.8954 5.91203 16 7.0166 16H10.0166C10.5689 16 11.0166 15.5523 11.0166 15V9C11.0166 8.44772 10.0166 8 8.0166 8H6.0166C5.46432 8 5.0166 8.44772 5.0166 9V11C5.0166 11.5523 4.56889 12 4.0166 12H3.0166V5H13.0166V15C13.0166 18.3137 10.3303 21 7.0166 21H5.0166Z" /></svg>
                                </div>

                                <div className="mb-3 flex items-start justify-between gap-2">
                                    <h3 className={`font-dm-sans font-bold text-lg mb-1 truncate flex-1 ${isHighlighted ? 'text-amber-100' : 'text-vanilla'}`}>
                                        {wish.name}
                                    </h3>
                                </div>

                                <p className={`font-dm-sans leading-relaxed text-sm whitespace-pre-line relative z-10 line-clamp-6 ${isHighlighted ? 'text-white' : 'text-vanilla/90'}`}>
                                    {wish.message}
                                </p>

                                <div className={`mt-3 pt-3 border-t flex items-center justify-between text-xs font-dm-sans ${isHighlighted ? 'border-amber-200/20 text-amber-200/60' : 'border-vanilla/10 text-vanilla/50'}`}>
                                    <span>{getRelativeTime(wish.created_at)}</span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </motion.div>
        </div>
    );
});


const WishesPage = () => {
    const [wishes, setWishes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [popupQueue, setPopupQueue] = useState([]);
    const [currentPopup, setCurrentPopup] = useState(null);
    const [highlightedIds, setHighlightedIds] = useState(new Set());

    // Spotlight State
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e) => {
        const { clientX, clientY } = e;
        setMousePosition({ x: clientX, y: clientY });
    };

    // Footer States
    const [currentTime, setCurrentTime] = useState(new Date());
    const [prayerTimes, setPrayerTimes] = useState(null);
    const [adabIndex, setAdabIndex] = useState(0);

    const adabWalimah = [
        "Memakai pakaian yang sopan dan menutup aurat",
        "Memperhatikan waktu sholat",
        "Mendoakan kedua mempelai",
        "Dilarang merokok",
        "Makan & minum sambil duduk",
        "Dilarang mengambil foto tanpa seizin kedua mempelai"
    ];

    // Clock Timer
    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    // Adab Rotator
    useEffect(() => {
        const timer = setInterval(() => {
            setAdabIndex((prev) => (prev + 1) % adabWalimah.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    // Fetch Prayer Times (Client-side)
    useEffect(() => {
        const fetchPrayerTimes = async () => {
            try {
                const res = await fetch('https://api.aladhan.com/v1/timingsByCity?city=Jakarta&country=Indonesia&method=20');
                const data = await res.json();
                if (data && data.data && data.data.timings) {
                    setPrayerTimes(data.data.timings);
                }
            } catch (error) {
                console.error('Error fetching prayer times:', error);
            }
        };
        fetchPrayerTimes();
    }, []);

    // Formatted Time Helper
    const formatTime = (date) => {
        return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }).replace('.', ':');
    };

    useEffect(() => {
        fetchWishes();

        const channel = supabase
            .channel('wishes_page_channel')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'wishes' }, (payload) => {
                console.log('Realtime event received:', payload);
                const newWish = payload.new;

                // Add to main list - Append for stability with ascending sort
                setWishes((prev) => [...prev, newWish]);

                // Add to popup queue to show notification
                setPopupQueue((prev) => [...prev, newWish]);

                // Add to highlighted set
                setHighlightedIds(prev => new Set(prev).add(newWish.id));

                // Remove highlight after duration (approx 2 loops: ~3 minutes to be safe/generous)
                setTimeout(() => {
                    setHighlightedIds(prev => {
                        const next = new Set(prev);
                        next.delete(newWish.id);
                        return next;
                    });
                }, 180000); // 3 minutes highlight duration
            })
            .subscribe((status) => {
                console.log('Supabase subscription status:', status);
            });

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    // Queue Processor
    useEffect(() => {
        if (!currentPopup && popupQueue.length > 0) {
            const nextWish = popupQueue[0];
            setCurrentPopup(nextWish);
            setPopupQueue((prev) => prev.slice(1));
        }
    }, [currentPopup, popupQueue]);

    const handlePopupComplete = React.useCallback(() => {
        setCurrentPopup(null);
    }, []);

    const fetchWishes = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('wishes')
                .select('*')
                .order('created_at', { ascending: true }); // Change to ascending for stable append

            if (error) throw error;
            if (data) setWishes(data);
        } catch (err) {
            console.error('Error fetching wishes:', err.message);
        } finally {
            setLoading(false);
        }
    };

    // Split wishes into 3 balanced columns - MEMOIZED
    const columns = React.useMemo(() => {
        const cols = [[], [], []];
        wishes.forEach((wish, i) => {
            cols[i % 3].push(wish);
        });
        return cols;
    }, [wishes]);

    return (
        <div
            onMouseMove={handleMouseMove}
            className="h-screen w-screen bg-main-red text-vanilla selection:bg-accent-wine selection:text-vanilla overflow-hidden relative flex flex-col"
        >
            {/* Spotlight Overlay */}
            <div
                className="pointer-events-none fixed inset-0 z-30 transition-opacity duration-300"
                style={{
                    background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255,255,255,0.06), transparent 40%)`
                }}
            />

            {/* Realtime Popup */}
            <AnimatePresence>
                {currentPopup && (
                    <NewWishPopup
                        key={currentPopup.id}
                        wish={currentPopup}
                        onComplete={handlePopupComplete}
                    />
                )}
            </AnimatePresence>

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

            <div className="container mx-auto px-4 py-8 relative z-20 flex-none">
                {/* Centered Header */}
                <header className="flex flex-col items-center justify-center text-center pb-6">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-2"
                    >
                        <div className="inline-block px-4 py-1.5 rounded-full bg-black/20 border border-vanilla/10 backdrop-blur-sm text-xs font-dm-sans tracking-widest uppercase text-vanilla/60 mb-3">
                            The Wedding of
                        </div>
                    </motion.div>

                    <h1 className="font-pinyon text-6xl md:text-7xl text-vanilla drop-shadow-sm leading-none mb-2">
                        Raihan & Fadhil
                    </h1>

                    <p className="font-dm-sans text-vanilla/80 text-sm md:text-base max-w-lg leading-relaxed">
                        Ucapan doa dan harapan tulus dari para tamu yang berbahagia
                    </p>
                    <div className="font-dm-sans text-xs text-vanilla/30 tracking-[0.2em] mt-3 uppercase">10 Januari 2026</div>


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
                            <VerticalMarqueeColumn items={columns[0]} speed={100} className="" highlightedIds={highlightedIds} />
                            <VerticalMarqueeColumn items={columns[1]} speed={80} className="hidden md:block pt-12" highlightedIds={highlightedIds} /> {/* Staggered start visually */}
                            <VerticalMarqueeColumn items={columns[2]} speed={110} className="hidden lg:block pt-24" highlightedIds={highlightedIds} />
                        </div>
                    ) : (
                        <div className="flex flex-col justify-center items-center h-full opacity-60">
                            <p className="font-dm-sans text-2xl italic text-vanilla">Belum ada ucapan.</p>
                            <p className="font-dm-sans text-sm mt-2 text-vanilla/60">Jadilah yang pertama mengirimkan doa!</p>
                        </div>
                    )
                )}
            </div>
            {/* Floating Footer */}
            {/* Floating Footer */}
            <AnimatePresence mode="wait">
                {!currentPopup && (
                    <motion.footer
                        initial={{ y: 100, opacity: 0, width: "60px" }}
                        animate={{
                            y: 0,
                            opacity: 1,
                            width: "95%",
                            transition: {
                                y: { duration: 0.5, ease: "backOut" },
                                width: { delay: 0.4, duration: 0.6, ease: [0.25, 0.1, 0.25, 1.0] }, // Cubic bezier for silky smooth expansion
                                opacity: { duration: 0.4 }
                            }
                        }}
                        exit={{
                            y: 100,
                            opacity: 0,
                            width: "60px",
                            transition: {
                                width: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1.0] }, // Matches entrance smoothness
                                y: { delay: 0.5, duration: 0.5, ease: "backIn" }, // Starts dropping just before shrink ends
                                opacity: { delay: 0.6, duration: 0.3 }
                            }
                        }}
                        className="fixed bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 z-50 max-w-5xl bg-black/40 backdrop-blur-xl border border-vanilla/10 overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.3)] hover:border-vanilla/20 rounded-full"
                        style={{ height: "auto", minHeight: "60px" }}
                    >
                        {/* Content Container */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1, transition: { delay: 0.7, duration: 0.4 } }} // Wait for expansion
                            exit={{ opacity: 0, transition: { duration: 0.2 } }} // Fade out quickly
                            className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-vanilla/80 font-dm-sans text-sm py-3 px-4 md:px-6 w-full h-full whitespace-nowrap"
                        >
                            {/* Prayer Times */}
                            <div className="flex items-center gap-4 text-xs md:text-sm overflow-x-auto max-w-full no-scrollbar whitespace-nowrap min-w-0">
                                <AnimatePresence mode="wait">
                                    {prayerTimes ? (
                                        (() => {
                                            const prayers = [
                                                { name: 'SUBUH', time: prayerTimes.Fajr },
                                                { name: 'DZUHUR', time: prayerTimes.Dhuhr },
                                                { name: 'ASHAR', time: prayerTimes.Asr },
                                                { name: 'MAGHRIB', time: prayerTimes.Maghrib },
                                                { name: 'ISYA', time: prayerTimes.Isha },
                                            ];

                                            // Use currentTime state to ensure sync with re-renders, assuming it's available in scope
                                            // Fallback to new Date() if needed, but consistency is better.
                                            // The parent component has `currentTime` state.
                                            const now = currentTime || new Date();
                                            const currentTimestamp = now.getTime();

                                            let activePrayer = null;
                                            let nextPrayer = null;
                                            let timeDiff = Infinity;

                                            for (const prayer of prayers) {
                                                const [pHours, pMinutes] = prayer.time.split(':').map(Number);
                                                const prayerDate = new Date();
                                                prayerDate.setHours(pHours, pMinutes, 0, 0);

                                                const diff = prayerDate.getTime() - currentTimestamp;

                                                // Check if currently within 10 minutes after prayer time (active prayer)
                                                const tenMinutesInMs = 10 * 60 * 1000;

                                                if (diff <= 0 && diff >= -tenMinutesInMs) {
                                                    activePrayer = prayer;
                                                    break;
                                                }

                                                if (diff > 0 && diff < timeDiff) {
                                                    timeDiff = diff;
                                                    nextPrayer = prayer;
                                                }
                                            }

                                            // 1. ACTIVE PRAYER STATE
                                            if (activePrayer) {
                                                return (
                                                    <motion.div
                                                        key="active-prayer-msg"
                                                        initial={{ opacity: 0, y: 20 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        exit={{ opacity: 0, y: -20 }}
                                                        transition={{ duration: 0.5, ease: "easeOut" }}
                                                        className="flex items-center gap-3 text-amber-200 font-bold tracking-wide"
                                                    >
                                                        <span className="text-xl animate-pulse">🕌</span>
                                                        <span>SAATNYA WAKTU {activePrayer.name} UNTUK WILAYAH JAKARTA DAN SEKITARNYA</span>
                                                    </motion.div>
                                                );
                                            }

                                            // 2. COUNTDOWN STATE
                                            if (!nextPrayer) {
                                                nextPrayer = prayers[0];
                                                const [pHours, pMinutes] = nextPrayer.time.split(':').map(Number);
                                                const tomorrow = new Date();
                                                tomorrow.setDate(tomorrow.getDate() + 1);
                                                tomorrow.setHours(pHours, pMinutes, 0, 0);
                                                timeDiff = tomorrow - now;
                                            }

                                            const totalSeconds = Math.floor(timeDiff / 1000);
                                            const h = Math.floor(totalSeconds / 3600);
                                            const m = Math.floor((totalSeconds % 3600) / 60);
                                            const s = totalSeconds % 60;
                                            const countdown = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;

                                            return (
                                                <motion.div
                                                    key="countdown-msg"
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: -20 }}
                                                    transition={{ duration: 0.5, ease: "easeOut" }}
                                                    className="flex items-center gap-4"
                                                >
                                                    <span className="opacity-50 uppercase tracking-widest text-[10px]">Menuju Waktu Sholat</span>
                                                    <div className="flex gap-2 font-medium items-center">
                                                        <span className="text-amber-200 font-bold capitalize">{nextPrayer.name.toLowerCase()}</span>
                                                        <span className="font-mono bg-vanilla/10 px-2 py-0.5 rounded text-xs">{countdown}</span>
                                                        <span className="text-xs opacity-50">({nextPrayer.time})</span>
                                                    </div>
                                                </motion.div>
                                            );
                                        })()
                                    ) : (
                                        <motion.span
                                            key="loading"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="animate-pulse"
                                        >
                                            Memuat...
                                        </motion.span>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Adab Walimah (Center) */}
                            <div className="hidden lg:flex items-center gap-2 flex-1 justify-center">
                                <span className="text-vanilla/40">✨</span>
                                <AnimatePresence mode="wait">
                                    <motion.span
                                        key={adabIndex}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="italic text-vanilla font-medium text-center min-w-[300px]"
                                    >
                                        {adabWalimah[adabIndex]}
                                    </motion.span>
                                </AnimatePresence>
                                <span className="text-vanilla/40">✨</span>
                            </div>

                            {/* Realtime Clock */}
                            <div className="flex items-center gap-2 font-mono text-base font-bold bg-black/20 px-3 py-1 rounded-lg border border-vanilla/10">
                                <span>{formatTime(currentTime)}</span>
                                <span className="text-[10px] font-dm-sans font-normal opacity-60">WIB</span>
                            </div>
                        </motion.div>
                    </motion.footer>
                )}
            </AnimatePresence>
        </div>
    );
};

export default WishesPage;
