import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { motion } from 'framer-motion';

const GuestManager = () => {
    const [guests, setGuests] = useState([]);
    const [newGuestName, setNewGuestName] = useState('');
    const [loading, setLoading] = useState(false);
    const [notification, setNotification] = useState(null);

    const [bulkNames, setBulkNames] = useState('');
    const [isBulkMode, setIsBulkMode] = useState(false);

    const [newGuestCategory, setNewGuestCategory] = useState('mempelai');
    const [searchQuery, setSearchQuery] = useState('');
    const [filterCategory, setFilterCategory] = useState('all');

    useEffect(() => {
        fetchGuests();
    }, []);

    const fetchGuests = async () => {
        try {
            const { data, error } = await supabase
                .from('guests')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setGuests(data || []);
        } catch (error) {
            console.error('Error fetching guests:', error);
        }
    };

    const generateSlug = (name) => {
        return name
            .toLowerCase()
            .replace(/[^\w\s-]/g, '') // Remove special chars
            .replace(/\s+/g, '+'); // Replace spaces with +
    };

    const handleAddGuest = async (e) => {
        e.preventDefault();
        if (!newGuestName.trim()) return;

        setLoading(true);
        const slug = generateSlug(newGuestName);

        // Check for duplicate slug
        const existing = guests.find(g => g.slug === slug);
        if (existing) {
            setNotification({ type: 'error', message: 'Tamu dengan nama ini sudah ada.' });
            setLoading(false);
            return;
        }

        try {
            const { data, error } = await supabase
                .from('guests')
                .insert([{ name: newGuestName, slug, category: newGuestCategory }])
                .select();

            if (error) throw error;

            setGuests([data[0], ...guests]);
            setNewGuestName('');
            setNotification({ type: 'success', message: 'Tamu berhasil ditambahkan!' });
        } catch (error) {
            console.error('Error adding guest:', error);
            setNotification({ type: 'error', message: 'Gagal menambahkan tamu.' });
        } finally {
            setLoading(false);
            setTimeout(() => setNotification(null), 3000);
        }
    };

    const handleBulkAddGuests = async (e) => {
        e.preventDefault();
        if (!bulkNames.trim()) return;

        setLoading(true);

        // Split by newline and filter empty strings
        const names = bulkNames.split('\n').map(name => name.trim()).filter(name => name);

        if (names.length === 0) {
            setLoading(false);
            return;
        }

        const newGuests = [];
        const errors = [];

        for (const name of names) {
            const slug = generateSlug(name);

            // Check for duplicate slug locally in the current list
            const existing = guests.find(g => g.slug === slug);
            if (existing) {
                errors.push(`"${name}" sudah ada.`);
                continue;
            }

            // Also check duplicates within the new batch itself to avoid slug collision
            if (newGuests.find(g => g.slug === slug)) {
                continue;
            }

            newGuests.push({ name, slug, category: newGuestCategory });
        }

        if (newGuests.length === 0) {
            setNotification({ type: 'error', message: 'Tidak ada tamu baru yang bisa ditambahkan (mungkin duplikat).' });
            setLoading(false);
            return;
        }

        try {
            const { data, error } = await supabase
                .from('guests')
                .insert(newGuests)
                .select();

            if (error) throw error;

            setGuests([...data, ...guests]);
            setBulkNames('');
            setNotification({ type: 'success', message: `${data.length} tamu berhasil ditambahkan!` });
        } catch (error) {
            console.error('Error adding guests:', error);
            setNotification({ type: 'error', message: 'Gagal menambahkan tamu.' });
        } finally {
            setLoading(false);
            setTimeout(() => setNotification(null), 3000);
        }
    };

    const handleDeleteGuest = async (id) => {
        if (!window.confirm('Yakin ingin menghapus tamu ini?')) return;

        try {
            const { error } = await supabase
                .from('guests')
                .delete()
                .eq('id', id);

            if (error) throw error;

            setGuests(guests.filter(g => g.id !== id));
            setNotification({ type: 'success', message: 'Tamu berhasil dihapus.' });
        } catch (error) {
            console.error('Error deleting guest:', error);
            setNotification({ type: 'error', message: 'Gagal menghapus tamu.' });
        } finally {
            setTimeout(() => setNotification(null), 3000);
        }
    };

    const copyToClipboard = (name) => {
        // Use name directly but encoded, instead of slug
        // This preserves titles like "Dr.", "S.Kom", etc.
        const url = `${window.location.origin}/?to=${encodeURIComponent(name).replace(/%20/g, '+')}`;
        navigator.clipboard.writeText(url).then(() => {
            setNotification({ type: 'success', message: 'Link berhasil disalin!' });
            setTimeout(() => setNotification(null), 3000);
        });
    };

    const copyMessage = (name, type = 'mempelai') => {
        const url = `${window.location.origin}/?to=${encodeURIComponent(name).replace(/%20/g, '+')}`;
        let message = '';

        if (type === 'mempelai') {
            message = `بِسْــــــــــــــــــمِ اللهِ الرَّحْمَنِ الرَّحِيْمِ

Assalamu'alaykum Warahmatullahi Wabarokatuh

Kepada
*${name}*
di Tempat

Tanpa mengurangi rasa hormat, perkenankan kami mengundang Bapak/Ibu/Saudara/i, untuk menghadiri acara pernikahan kami :

Raihan Zaina
&
Muhammad Fadhilah

Info lengkap acara bisa dilihat di link berikut:
${url}

Merupakan suatu kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan untuk hadir dan memberikan doa restu pada acara pernikahan kami.

Mohon maaf, apabila hanya membagikan kabar bahagia ini melalui pesan singkat. Terima kasih banyak atas perhatiannya.

جَزَاكُمُ اللهُ خَيْرًا كَثِيْرًا

Hormat kami,
Raihan & Fadhil`;
        } else {
            message = `Kepada Bapak/Ibu/Saudara/i
*${name}*
Di Tempat
---------------------------
*بِسْــــــــــــــــــمِ اللهِ الرَّحْمَنِ الرَّحِيْمِ*

*_Assalaamu'alaykum Wa Rahmatullaahi Wa Barakaatuh_*

Dengan memohon Ridho dan Rahmat Allah Subhanahu wa Ta'ala, kami bermaksud menyelenggarakan acara pernikahan putra-putri kami,

Raihan Zaina
&
Muhammad Fadhilah

Detail acara dapat dilihat pada link berikut
${url}

Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Sdr berkenan memberikan doa restu kepada keduanya.
--------------------------------

Jazakumullah khairon.
*_Wassalaamu'alaykum Wa Rahmatullaahi Wa Barakaatuh._*

*Kel. Bapak Mista Sucipto & Ibu Hodijah*
*Kel. Bapak Aryadin & Ibu Titik Hartini*`;
        }

        navigator.clipboard.writeText(message).then(() => {
            setNotification({ type: 'success', message: 'Pesan undangan berhasil disalin!' });
            setTimeout(() => setNotification(null), 3000);
        });
    };

    const filteredGuests = guests.filter(guest => {
        const matchesSearch = guest.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = filterCategory === 'all' || guest.category === filterCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="min-h-screen bg-vanilla p-6 md:p-12 font-dm-sans text-main-red">
            <div className="max-w-4xl mx-auto">
                <h1 className="font-pinyon text-5xl mb-8 text-center text-accent-wine">Guest Manager</h1>

                {/* Notification Toast */}
                {notification && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`fixed top-6 right-6 px-6 py-3 rounded-lg shadow-lg z-50 text-white font-bold ${notification.type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}
                    >
                        {notification.message}
                    </motion.div>
                )}

                {/* Add Guest Form */}
                <div className="bg-white/50 backdrop-blur-sm p-8 rounded-2xl border border-main-red/10 shadow-lg mb-12">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="font-bold text-lg">Tambah Tamu</h2>
                        <button
                            onClick={() => setIsBulkMode(!isBulkMode)}
                            className="text-sm underline text-accent-wine hover:text-main-red"
                        >
                            {isBulkMode ? 'Mode Single' : 'Mode Banyak (Bulk)'}
                        </button>
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm font-bold mb-2">Kategori Tamu</label>
                        <div className="flex gap-4">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="category"
                                    value="mempelai"
                                    checked={newGuestCategory === 'mempelai'}
                                    onChange={(e) => setNewGuestCategory(e.target.value)}
                                    className="accent-accent-wine"
                                />
                                <span>Tamu Mempelai</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="category"
                                    value="orangtua"
                                    checked={newGuestCategory === 'orangtua'}
                                    onChange={(e) => setNewGuestCategory(e.target.value)}
                                    className="accent-accent-wine"
                                />
                                <span>Tamu Orang Tua</span>
                            </label>
                        </div>
                    </div>

                    {!isBulkMode ? (
                        <form onSubmit={handleAddGuest} className="flex flex-col md:flex-row gap-4">
                            <input
                                type="text"
                                value={newGuestName}
                                onChange={(e) => setNewGuestName(e.target.value)}
                                placeholder="Nama Tamu (misal: Budi Santoso)"
                                className="flex-1 px-4 py-3 rounded-lg border border-main-red/20 focus:border-accent-wine focus:ring-1 focus:ring-accent-wine outline-none bg-white/80"
                            />
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-8 py-3 bg-accent-wine text-vanilla font-bold rounded-lg hover:bg-main-red transition-colors shadow-md disabled:opacity-70"
                            >
                                {loading ? 'Adding...' : 'Tambah Tamu'}
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handleBulkAddGuests} className="flex flex-col gap-4">
                            <textarea
                                value={bulkNames}
                                onChange={(e) => setBulkNames(e.target.value)}
                                placeholder={`Masukkan daftar nama tamu, pisahkan dengan baris baru (Enter).\nContoh:\nBudi Santoso\nSiti Aminah\nDr. Joko Widodo`}
                                rows="6"
                                className="w-full px-4 py-3 rounded-lg border border-main-red/20 focus:border-accent-wine focus:ring-1 focus:ring-accent-wine outline-none bg-white/80 resize-none"
                            ></textarea>
                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="px-8 py-3 bg-accent-wine text-vanilla font-bold rounded-lg hover:bg-main-red transition-colors shadow-md disabled:opacity-70"
                                >
                                    {loading ? 'Adding...' : 'Tambah Semua Tamu'}
                                </button>
                            </div>
                        </form>
                    )}
                </div>

                {/* Guest List */}
                <div className="bg-white/50 backdrop-blur-sm rounded-2xl border border-main-red/10 shadow-lg overflow-hidden">
                    <div className="p-6 border-b border-main-red/10 bg-accent-wine/5 flex flex-col md:flex-row justify-between items-center gap-4">
                        <h2 className="font-bold text-xl">Daftar Tamu ({filteredGuests.length})</h2>

                        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
                            <input
                                type="text"
                                placeholder="Cari nama tamu..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="px-4 py-2 rounded-lg border border-main-red/20 outline-none focus:border-accent-wine bg-white/80"
                            />
                            <select
                                value={filterCategory}
                                onChange={(e) => setFilterCategory(e.target.value)}
                                className="px-4 py-2 rounded-lg border border-main-red/20 outline-none focus:border-accent-wine bg-white/80"
                            >
                                <option value="all">Semua Kategori</option>
                                <option value="mempelai">Tamu Mempelai</option>
                                <option value="orangtua">Tamu Orang Tua</option>
                            </select>
                        </div>
                    </div>

                    <div className="divide-y divide-main-red/10 max-h-[600px] overflow-y-auto">
                        {filteredGuests.length === 0 ? (
                            <div className="p-8 text-center text-main-red/60 italic">Tidak ada tamu yang ditemukan.</div>
                        ) : (
                            filteredGuests.map((guest) => (
                                <div key={guest.id} className="p-6 hover:bg-white/40 transition-colors flex flex-col md:flex-row justify-between items-center gap-4">
                                    <div className="text-center md:text-left">
                                        <div className="flex items-center gap-2 justify-center md:justify-start">
                                            <h3 className="font-bold text-lg">{guest.name}</h3>
                                            <span className={`text-[10px] px-2 py-0.5 rounded-full border uppercase tracking-wider ${guest.category === 'orangtua' ? 'bg-orange-100 text-orange-800 border-orange-200' : 'bg-blue-100 text-blue-800 border-blue-200'}`}>
                                                {guest.category === 'orangtua' ? 'Ortu' : 'Mempelai'}
                                            </span>
                                        </div>
                                        <p className="text-sm text-main-red/60 font-mono mt-1">
                                            {`${window.location.origin}/?to=${encodeURIComponent(guest.name).replace(/%20/g, '+')}`}
                                        </p>
                                    </div>

                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => copyToClipboard(guest.name)}
                                            className="px-3 py-2 bg-vanilla border border-main-red/20 rounded-lg text-sm font-bold hover:bg-white transition-colors flex items-center gap-2"
                                            title="Salin Link"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                                            Link
                                        </button>
                                        <button
                                            onClick={() => copyMessage(guest.name, guest.category)}
                                            className="px-3 py-2 bg-accent-wine text-vanilla rounded-lg text-sm font-bold hover:bg-main-red transition-colors flex items-center gap-2"
                                            title="Salin Pesan Undangan"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                                            Pesan
                                        </button>
                                        <button
                                            onClick={() => handleDeleteGuest(guest.id)}
                                            className="px-2 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                                            title="Hapus"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GuestManager;
