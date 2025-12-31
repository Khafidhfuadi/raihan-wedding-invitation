import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabaseClient';
import { Link } from 'react-router-dom';

const LeaveWishPage = () => {
    const [name, setName] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false);

        if (!name.trim() || !message.trim()) {
            setError("Mohon isi nama dan pesan.");
            setLoading(false);
            return;
        }

        try {
            const { error } = await supabase
                .from('wishes')
                .insert([{ name, message }]);

            if (error) throw error;

            setSuccess(true);
            setName('');
            setMessage('');

            // Reset success message/redirect logic could go here if needed
            setTimeout(() => setSuccess(false), 5000);

        } catch (err) {
            console.error('Error submitting wish:', err.message);
            setError('Gagal mengirim ucapan. Silakan coba lagi.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-main-red flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-accent-wine rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2 opacity-50"></div>
            <div className="absolute bottom-0 right-0 w-80 h-80 bg-accent-wine rounded-full blur-[120px] translate-x-1/3 translate-y-1/3 opacity-60"></div>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="w-full max-w-md bg-accent-wine/30 backdrop-blur-xl border border-vanilla/10 p-8 rounded-3xl shadow-2xl relative z-10"
            >
                <div className="text-center mb-8">
                    <h1 className="font-pinyon text-5xl text-vanilla mb-2">Kirim Ucapan</h1>
                    <p className="font-dm-sans text-vanilla/70 text-sm">
                        Tuliskan doa & harapan terbaikmu untuk <br /> Raihan & Fadhil
                    </p>
                    <div className="mt-6 border-t border-vanilla/10 pt-4">
                        <p className="font-pinyon text-2xl text-vanilla/60">The Wedding of Raihan & Fadhil</p>
                        <p className="font-dm-sans text-xs text-vanilla/40 tracking-widest mt-1">10 • 01 • 2025</p>
                    </div>
                </div>

                {success ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-green-500/20 border border-green-500/30 text-vanilla p-6 rounded-xl text-center"
                    >
                        <div className="text-4xl mb-4">✨</div>
                        <h3 className="font-pinyon text-3xl mb-2">Terima Kasih!</h3>
                        <p className="font-dm-sans text-sm opacity-90">
                            Ucapanmu telah berhasil dikirim dan akan tampil di layar utama.
                        </p>
                        <button
                            onClick={() => setSuccess(false)}
                            className="mt-6 px-6 py-2 bg-vanilla text-main-red font-dm-sans font-bold rounded-full text-sm hover:bg-vanilla/90 transition-colors"
                        >
                            Kirim Lagi
                        </button>
                        <div className="mt-4">
                            <Link to="/wishes" className="text-xs text-vanilla/50 underline">Lihat Wall of Wishes</Link>
                        </div>
                    </motion.div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-vanilla font-dm-sans text-sm font-bold mb-2 ml-1">Nama</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full bg-main-red/50 border border-vanilla/20 rounded-xl px-4 py-3 text-vanilla placeholder-vanilla/30 focus:outline-none focus:border-vanilla/50 transition-colors font-dm-sans"
                                placeholder="Isi nama kamu..."
                            />
                        </div>

                        <div>
                            <label className="block text-vanilla font-dm-sans text-sm font-bold mb-2 ml-1">Pesan / Doa</label>
                            <textarea
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                rows="5"
                                className="w-full bg-main-red/50 border border-vanilla/20 rounded-xl px-4 py-3 text-vanilla placeholder-vanilla/30 focus:outline-none focus:border-vanilla/50 transition-colors font-dm-sans resize-none"
                                placeholder="Tuliskan ucapanmu disini..."
                            ></textarea>
                        </div>

                        {error && (
                            <div className="text-red-300 text-xs text-center font-dm-sans bg-red-900/20 p-2 rounded-lg border border-red-500/20">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-vanilla text-main-red font-bold font-dm-sans py-4 rounded-xl shadow-lg hover:shadow-vanilla/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Mengirim...' : 'Kirim Ucapan'}
                        </button>


                    </form>
                )}
            </motion.div>
        </div>
    );
};

export default LeaveWishPage;
