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

  return (
    <section className="py-20 bg-main-red text-vanilla relative overflow-hidden">
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

      <div className="container mx-auto px-6 max-w-4xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <motion.h2
            initial={{ scale: 0.9 }}
            whileInView={{ scale: 1 }}
            transition={{ duration: 0.6, type: "spring" }}
            className="font-pinyon text-5xl md:text-6xl mb-4 text-vanilla"
          >
            Ucapan
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="font-dm-sans text-vanilla/80"
          >
            Ucapan Selamat & Do'a
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Form Section */}
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
            viewport={{ once: true }}
          >
            <form onSubmit={handleSubmit} className="bg-accent-wine/30 backdrop-blur-sm p-8 rounded-2xl border border-vanilla/30 shadow-lg relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

              <div className="mb-4 relative z-10">
                <label className="block font-dm-sans font-bold mb-2 text-sm text-vanilla">Mengirim sebagai</label>
                <div className="w-full px-4 py-3 rounded-lg border border-vanilla/40 bg-vanilla/20 font-dm-sans font-bold text-vanilla placeholder-vanilla/70">
                  {name}
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

          {/* List Section */}
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, type: "spring", bounce: 0.4, delay: 0.2 }}
            viewport={{ once: true }}
            className="h-[500px] overflow-y-auto pr-2 custom-scrollbar"
          >
            {wishes.length === 0 ? (
              <div className="text-center py-10 opacity-60 italic text-vanilla">
                Belum ada ucapan. Jadilah yang pertama mengirimkan ucapan!
              </div>
            ) : (
              <div className="space-y-4">
                <AnimatePresence>
                  {wishes.map((wish, index) => (
                    <motion.div
                      key={wish.id}
                      initial={{ opacity: 0, y: 20, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ delay: index * 0.05, duration: 0.3 }}
                      className="bg-accent-wine/30 backdrop-blur-sm p-6 rounded-xl border-l-4 border-vanilla shadow-sm hover:bg-accent-wine/40 transition-colors"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-dm-sans font-bold text-lg text-vanilla">{wish.name}</span>
                      </div>
                      <p className="font-dm-sans text-vanilla/90 text-sm leading-relaxed whitespace-pre-line">
                        {wish.message}
                      </p>
                      <div className="mt-3 pt-3 border-t border-vanilla/10 text-xs text-vanilla/50 flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                        {formatTime(wish.created_at)}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Wishes;
