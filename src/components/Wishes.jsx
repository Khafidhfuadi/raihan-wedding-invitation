import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabaseClient';

const Wishes = () => {
  const [wishes, setWishes] = useState([]);
  const [name, setName] = useState('Nama Tamu');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Initialize name from URL and fetch wishes on mount
  useEffect(() => {
    // Get guest name from URL
    const params = new URLSearchParams(window.location.search);
    const to = params.get('to');
    if (to) setName(to);

    fetchWishes();

    // Optional: Realtime subscription
    const channel = supabase
      .channel('wishes_channel')
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
      const { data, error } = await supabase
        .from('wishes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (data) setWishes(data);
    } catch (err) {
      console.error('Error fetching wishes:', err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    if (!message.trim()) {
      setError("Pesan harus diisi.");
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase
        .from('wishes')
        .insert([{ name, message }]);

      if (error) throw error;

      // Reset form (keep name as is)
      setMessage('');
      setSuccess(true);
      fetchWishes(); // Refresh list immediately

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);

    } catch (err) {
      console.error('Error submitting wish:', err.message);
      setError('Gagal mengirim ucapan. Pastikan koneksi internet lancar atau konfigurasi database sudah benar.');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const datePart = date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
    const timePart = date.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    }).replace('.', ':');

    return `${datePart} ${timePart} WIB`;
  };

  // Split wishes into 3 rows for the masonry/marquee effect
  const getRows = () => {
    const rows = [[], [], []];
    wishes.forEach((wish, i) => {
      rows[i % 3].push(wish);
    });
    return rows;
  };

  const rows = getRows();

  // Marquee Row Component
  const MarqueeRow = ({ items, direction = "left" }) => {
    if (items.length === 0) return null;

    // Duplicate items to ensure seamless loop
    // If items are few, duplicate more times to fill width
    // We need enough width to scroll continuously. 
    // Usually 2 sets are enough if the total width > viewport width.
    // If total width < viewport, we need more.
    // Simple heuristic: repeat 4 times if < 5 items, else 2 times.
    const repeatCount = items.length < 5 ? 4 : 2;
    const duplicatedItems = Array(repeatCount).fill(items).flat();

    return (
      <div className="flex overflow-hidden w-full mb-6 relative group">
        {/* Gradient masks for smooth fade */}
        <div className="absolute inset-y-0 left-0 w-8 md:w-20 bg-gradient-to-r from-main-red to-transparent z-10 pointer-events-none"></div>
        <div className="absolute inset-y-0 right-0 w-8 md:w-20 bg-gradient-to-l from-main-red to-transparent z-10 pointer-events-none"></div>

        <motion.div
          className="flex gap-4"
          // We scroll from 0 to -50% (if 2 copies) or -100/N% 
          // Actually, standard marquee: animate X from 0 to -100% of the *original* content width.
          // But with framer motion simpler is usually 0 to -50% if we have 2 copies of equal length.
          // Let's assume 2 copies for simplicity and consistency.
          initial={{ x: direction === "left" ? 0 : `-${100 / repeatCount * (repeatCount - 1)}%` }}
          animate={{ x: direction === "left" ? `-${100 / repeatCount * (repeatCount - 1)}%` : 0 }}
          // Wait, logic check:
          // If we have [A, B, C, A, B, C], we want to move left until the second A reaches the start.
          // That is moving -50%.
          // If we have 4 copies: [A...D, A...D, A...D, A...D], we move -25%.
          // Let's stick to a simpler sliding window.
          // If we animate from 0 to -100% of a single set's width, it should work if we have enough copies.
          // To be safe with framer motion percentages, we usually just put a lot of copies and move.

          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: Math.max(40, items.length * 20), // Slower animation
              ease: "linear",
            }
          }}
          style={{ width: "max-content" }}
        >
          {duplicatedItems.map((wish, idx) => (
            <div
              key={`${wish.id}-${idx}`}
              className={`
                flex-shrink-0 
                bg-accent-wine/30 backdrop-blur-sm 
                p-5 rounded-xl border border-vanilla/20 
                w-[280px] md:w-[350px]
                ${wish.message.length > 80 ? 'md:w-[450px]' : ''} 
                hover:bg-accent-wine/50 transition-colors
              `}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="font-dm-sans font-bold text-vanilla truncate max-w-[180px] md:max-w-[200px]">{wish.name}</span>
              </div>
              <p className="font-dm-sans text-vanilla/90 text-sm leading-relaxed whitespace-pre-line line-clamp-4">
                {wish.message}
              </p>
              <div className="mt-3 pt-3 border-t border-vanilla/10 text-xs text-vanilla/50 flex items-center gap-1">
                {formatTime(wish.created_at)}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    );
  };

  return (
    <section className="py-20 bg-main-red text-vanilla relative overflow-hidden flex flex-col items-center">
      {/* Background Animation */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          animate={{
            y: [0, -30, 0],
            opacity: [0.05, 0.1, 0.05]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-0 right-0 w-96 h-96 bg-accent-wine rounded-full blur-3xl opacity-10"
        />
        <motion.div
          animate={{
            y: [0, 30, 0],
            opacity: [0.05, 0.1, 0.05]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-0 left-0 w-64 h-64 bg-accent-wine rounded-full blur-3xl opacity-10"
        />
      </div>

      <div className="container mx-auto px-6 relative z-10 mb-12 w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2 className="font-pinyon text-5xl md:text-6xl mb-4 text-vanilla">
            Doa & Ucapan
          </h2>
          <p className="font-dm-sans text-vanilla/80 max-w-2xl mx-auto">
            Doa restu Anda merupakan kado terindah bagi perjalanan baru kami.
          </p>

          <motion.div className="mt-4 flex justify-center">
            <span className="px-4 py-1.5 rounded-full bg-vanilla/10 border border-vanilla/20 backdrop-blur-sm text-vanilla/90 text-sm font-dm-sans flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
              {wishes.length} Ucapan Terkirim
            </span>
          </motion.div>
        </motion.div>

        {/* Form Section - Centered */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto"
        >
          <form onSubmit={handleSubmit} className="bg-accent-wine/30 backdrop-blur-sm p-8 rounded-2xl border border-vanilla/30 shadow-lg relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

            <div className="flex flex-col md:flex-row gap-6 mb-6">
              <div className="flex-1 relative z-10">
                <label className="block font-dm-sans font-bold mb-2 text-sm text-vanilla">Nama</label>
                <div className="w-full px-4 py-3 rounded-lg border border-vanilla/40 bg-vanilla/20 font-dm-sans font-bold text-vanilla placeholder-vanilla/70">
                  {name}
                </div>
              </div>
            </div>

            <div className="mb-6 relative z-10">
              <label htmlFor="message" className="block font-dm-sans font-bold mb-2 text-sm text-vanilla">Ucapan</label>
              <textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onFocus={(e) => e.target.parentElement.classList.add('ring-2', 'ring-vanilla/20')}
                onBlur={(e) => e.target.parentElement.classList.remove('ring-2', 'ring-vanilla/20')}
                rows="4"
                className="w-full px-4 py-3 rounded-lg border border-vanilla/40 focus:border-vanilla focus:ring-1 focus:ring-vanilla outline-none bg-vanilla/20 transition-all resize-none text-vanilla placeholder-vanilla/70"
                placeholder="Tulis ucapan dan doa..."
              ></textarea>
            </div>

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-4 text-red-200 text-sm bg-red-900/50 p-3 rounded-lg border border-red-500/30 overflow-hidden"
                >
                  {error}
                </motion.div>
              )}

              {success && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-4 text-green-200 text-sm bg-green-900/50 p-3 rounded-lg border border-green-500/30 overflow-hidden"
                >
                  Jazakumullahu khairon! Ucapan Antum telah terkirim.
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading}
              type="submit"
              className="w-full py-3 bg-vanilla text-main-red font-bold rounded-lg hover:bg-white transition-colors shadow-md disabled:opacity-70 disabled:cursor-not-allowed relative z-10"
            >
              {loading ? 'Mengirim...' : 'Kirim'}
            </motion.button>
          </form>
        </motion.div>
      </div>

      {/* Wishes Marquee Section */}
      <div className="w-full relative py-8">
        {wishes.length > 0 ? (
          <div className="flex flex-col gap-6">
            {/* Row 1 - Left */}
            <MarqueeRow items={rows[0]} direction="left" />

            {/* Row 2 - Right or Left, user said "automatically moves", usually same direction is cleaner but alternating is "dynamic". 
                         Let's toggle direction if index is odd. 
                      */}
            <MarqueeRow items={rows[1]} direction="right" />

            {/* Row 3 - Left */}
            {rows[2].length > 0 && <MarqueeRow items={rows[2]} direction="left" />}
          </div>
        ) : (
          <div className="text-center py-10 opacity-60 italic text-vanilla container mx-auto">
            Belum ada ucapan. Jadilah yang pertama mengirimkan ucapan!
          </div>
        )}
      </div>
    </section>
  );
};

export default Wishes;
