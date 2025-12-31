import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { motion, AnimatePresence } from 'framer-motion';

const ReservationBook = () => {
    const [guests, setGuests] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [selectedGuest, setSelectedGuest] = useState(null); // For check-in modal
    const [paxInput, setPaxInput] = useState(1);
    const [notification, setNotification] = useState(null);

    // Stats
    const totalGuests = guests.length;
    const checkedInGuests = guests.filter(g => g.attendance_status === 'hadir');
    const totalCheckedIn = checkedInGuests.length;
    const totalPax = guests.reduce((sum, g) => sum + (g.pax || 0), 0);

    const attendancePercentage = totalGuests > 0 ? ((totalCheckedIn / totalGuests) * 100).toFixed(1) : 0;

    // Category Stats
    const mempelaiTotal = guests.filter(g => g.category === 'mempelai').length;
    const mempelaiCheckedIn = guests.filter(g => g.category === 'mempelai' && g.attendance_status === 'hadir').length;

    const orangTuaTotal = guests.filter(g => g.category === 'orangtua').length;
    const orangTuaCheckedIn = guests.filter(g => g.category === 'orangtua' && g.attendance_status === 'hadir').length;

    useEffect(() => {
        fetchGuests();

        // Subscription for real-time updates
        const subscription = supabase
            .channel('public:guests')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'guests' }, (payload) => {
                fetchGuests();
            })
            .subscribe();

        return () => {
            supabase.removeChannel(subscription);
        };
    }, []);

    const fetchGuests = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('guests')
                .select('*')
                .order('name', { ascending: true });

            if (error) throw error;
            setGuests(data || []);
        } catch (error) {
            console.error('Error fetching guests:', error);
            // Don't show error to user immediately on load to avoid spam if it's just a network blip
        } finally {
            setLoading(false);
        }
    };

    const handleCheckInClick = (guest) => {
        setSelectedGuest(guest);
        setPaxInput(guest.pax && guest.pax > 0 ? guest.pax : 1); // Default to 1 or existing pax
    };

    const handleConfirmCheckIn = async () => {
        if (!selectedGuest) return;

        try {
            const { error } = await supabase
                .from('guests')
                .update({
                    attendance_status: 'hadir',
                    pax: paxInput,
                    updated_at: new Date()
                })
                .eq('id', selectedGuest.id);

            if (error) throw error;

            setNotification({ type: 'success', message: `Berhasil check-in: ${selectedGuest.name}` });
            setSelectedGuest(null);
            fetchGuests(); // Refresh list immediately
        } catch (error) {
            console.error('Error updating guest:', error);
            setNotification({ type: 'error', message: 'Gagal melakukan check-in.' });
        } finally {
            setTimeout(() => setNotification(null), 3000);
        }
    };

    const handleCancelCheckIn = async (guest) => {
        if (!window.confirm(`Batalkan check-in untuk ${guest.name}?`)) return;

        try {
            const { error } = await supabase
                .from('guests')
                .update({
                    attendance_status: null,
                    pax: 0,
                    updated_at: new Date()
                })
                .eq('id', guest.id);

            if (error) throw error;
            setNotification({ type: 'success', message: 'Check-in dibatalkan.' });
            fetchGuests();
        } catch (error) {
            console.error('Error canceling check-in:', error);
            setNotification({ type: 'error', message: 'Gagal membatalkan check-in.' });
        } finally {
            setTimeout(() => setNotification(null), 3000);
        }
    };

    const filteredGuests = guests.filter(guest =>
        guest.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // --- Add Guest Logic ---
    const [showAddGuestModal, setShowAddGuestModal] = useState(false);
    const [newGuestName, setNewGuestName] = useState('');
    const [newGuestCategory, setNewGuestCategory] = useState('mempelai');
    const [newGuestPax, setNewGuestPax] = useState(1);

    const openAddGuestModal = () => {
        setNewGuestName(searchQuery); // Pre-fill with search query
        setNewGuestPax(1);
        setNewGuestCategory('mempelai');
        setShowAddGuestModal(true);
    };

    const generateSlug = (name) => {
        return name
            .toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '+');
    };

    const handleAddNewGuest = async () => {
        if (!newGuestName.trim()) return;

        // 1. Check if name exists locally to prevent slight duplicates if possible? 
        // We already did a search, so user knows.

        try {
            const slug = generateSlug(newGuestName);
            const { data, error } = await supabase
                .from('guests')
                .insert([{
                    name: newGuestName,
                    slug: slug,
                    category: newGuestCategory,
                    attendance_status: 'hadir', // Auto check-in
                    pax: newGuestPax,
                    updated_at: new Date()
                }])
                .select();

            if (error) throw error;

            setNotification({ type: 'success', message: `Tamu baru berhasil ditambahkan: ${newGuestName}` });
            setShowAddGuestModal(false);
            setSearchQuery(''); // Clear search to show recent list or all
            fetchGuests();
        } catch (error) {
            console.error('Error adding new guest:', error);
            setNotification({ type: 'error', message: 'Gagal menambahkan tamu baru.' });
        } finally {
            setTimeout(() => setNotification(null), 3000);
        }
    };

    return (
        <div className="min-h-screen bg-vanilla p-6 md:p-12 font-dm-sans text-main-red">
            <div className="max-w-6xl mx-auto">
                <header className="mb-10">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
                        <div>
                            <h1 className="font-pinyon text-5xl mb-2 text-accent-wine">Buku Tamu</h1>
                            <p className="text-main-red/60 text-lg">Dashboard Resepsionis</p>
                        </div>
                    </div>

                    {/* Analytics Cards */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        {/* Main Stats */}
                        <div className="col-span-2 md:col-span-1 bg-white/60 p-5 rounded-2xl border border-main-red/10 shadow-sm relative overflow-hidden">
                            <div className="absolute right-0 top-0 p-4 opacity-5">
                                <svg width="80" height="80" viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" /></svg>
                            </div>
                            <p className="text-xs uppercase tracking-widest text-main-red/60 mb-1">Total Tamu Hadir</p>
                            <div className="flex items-baseline gap-2">
                                <h3 className="text-4xl font-bold text-accent-wine">{totalCheckedIn}</h3>
                                <span className="text-sm text-main-red/50">/ {totalGuests} Undangan</span>
                            </div>
                            <div className="mt-3 h-1.5 w-full bg-main-red/10 rounded-full overflow-hidden">
                                <div className="h-full bg-accent-wine transition-all duration-1000" style={{ width: `${attendancePercentage}%` }}></div>
                            </div>
                            <p className="text-xs text-right mt-1 text-main-red/50">{attendancePercentage}% Kehadiran</p>
                        </div>

                        <div className="col-span-2 md:col-span-1 bg-white/60 p-5 rounded-2xl border border-main-red/10 shadow-sm relative overflow-hidden">
                            <div className="absolute right-0 top-0 p-4 opacity-5">
                                <svg width="80" height="80" viewBox="0 0 24 24" fill="currentColor"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" /></svg>
                            </div>
                            <p className="text-xs uppercase tracking-widest text-main-red/60 mb-1">Total Pax (Jiwa)</p>
                            <div className="flex items-baseline gap-2">
                                <h3 className="text-4xl font-bold text-main-red">{totalPax}</h3>
                                <span className="text-sm text-main-red/50">Orang</span>
                            </div>
                            <p className="text-xs mt-3 text-main-red/50">
                                Rata-rata: {(totalCheckedIn > 0 ? (totalPax / totalCheckedIn).toFixed(1) : 0)} org / undangan
                            </p>
                        </div>

                        {/* Breakdown Stats */}
                        <div className="col-span-1 bg-blue-50/50 p-4 rounded-2xl border border-blue-100 shadow-sm flex flex-col justify-between">
                            <div>
                                <div className="flex justify-between items-start mb-2">
                                    <span className="text-[10px] uppercase font-bold text-blue-800 bg-blue-100 px-2 py-0.5 rounded-full">Mempelai</span>
                                    <span className="text-xs font-bold text-blue-900/50">{mempelaiCheckedIn}/{mempelaiTotal}</span>
                                </div>
                                <h3 className="text-2xl font-bold text-blue-900">{mempelaiTotal > 0 ? Math.round((mempelaiCheckedIn / mempelaiTotal) * 100) : 0}%</h3>
                            </div>
                            <div className="h-1 w-full bg-blue-200 rounded-full overflow-hidden mt-2">
                                <div className="h-full bg-blue-600 transition-all" style={{ width: `${mempelaiTotal > 0 ? (mempelaiCheckedIn / mempelaiTotal) * 100 : 0}%` }}></div>
                            </div>
                        </div>

                        <div className="col-span-1 bg-orange-50/50 p-4 rounded-2xl border border-orange-100 shadow-sm flex flex-col justify-between">
                            <div>
                                <div className="flex justify-between items-start mb-2">
                                    <span className="text-[10px] uppercase font-bold text-orange-800 bg-orange-100 px-2 py-0.5 rounded-full">Orang Tua</span>
                                    <span className="text-xs font-bold text-orange-900/50">{orangTuaCheckedIn}/{orangTuaTotal}</span>
                                </div>
                                <h3 className="text-2xl font-bold text-orange-900">{orangTuaTotal > 0 ? Math.round((orangTuaCheckedIn / orangTuaTotal) * 100) : 0}%</h3>
                            </div>
                            <div className="h-1 w-full bg-orange-200 rounded-full overflow-hidden mt-2">
                                <div className="h-full bg-orange-600 transition-all" style={{ width: `${orangTuaTotal > 0 ? (orangTuaCheckedIn / orangTuaTotal) * 100 : 0}%` }}></div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Notification Toast */}
                <AnimatePresence>
                    {notification && (
                        <motion.div
                            initial={{ opacity: 0, y: -20, x: '-50%' }}
                            animate={{ opacity: 1, y: 0, x: '-50%' }}
                            exit={{ opacity: 0, y: -20, x: '-50%' }}
                            className={`fixed top-6 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-lg shadow-xl z-50 text-white font-bold flex items-center gap-2 ${notification.type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}
                        >
                            {notification.type === 'success' ? (
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>
                            )}
                            {notification.message}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Search Bar */}
                <div className="sticky top-6 z-30 mb-8">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Cari Nama Tamu..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full px-6 py-4 text-lg rounded-xl border border-main-red/20 shadow-lg focus:ring-2 focus:ring-accent-wine focus:border-accent-wine outline-none bg-white/90 backdrop-blur-md"
                            autoFocus
                        />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-main-red/40">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                        </div>
                    </div>
                </div>

                {/* Guest List */}
                <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-main-red/10 shadow-xl overflow-hidden min-h-[400px]">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
                        {loading && guests.length === 0 ? (
                            <div className="col-span-full py-12 text-center text-main-red/50">
                                <svg className="animate-spin h-8 w-8 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Loading data tamu...
                            </div>
                        ) : filteredGuests.length === 0 ? (
                            <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
                                <p className="text-main-red/50 text-lg mb-4">Tidak ditemukan tamu dengan nama "{searchQuery}"</p>
                                {searchQuery && (
                                    <button
                                        onClick={openAddGuestModal}
                                        className="px-6 py-3 bg-accent-wine text-vanilla font-bold rounded-lg hover:bg-main-red transition-all shadow-lg flex items-center gap-2"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                                        Tambah Tamu Baru: "{searchQuery}"
                                    </button>
                                )}
                            </div>
                        ) : (
                            filteredGuests.map((guest) => (
                                <div
                                    key={guest.id}
                                    className={`relative p-5 rounded-xl border transition-all duration-200 ${guest.attendance_status === 'hadir'
                                        ? 'bg-green-50 border-green-200 shadow-sm'
                                        : 'bg-white border-main-red/10 hover:border-accent-wine/50 hover:shadow-md'
                                        }`}
                                >
                                    <div className="flex justify-between items-start mb-3">
                                        <div>
                                            <h3 className="font-bold text-lg leading-tight mb-1">{guest.name}</h3>
                                            <span className={`text-[10px] px-2 py-0.5 rounded-full border uppercase tracking-wider ${guest.category === 'orangtua' ? 'bg-orange-100 text-orange-800 border-orange-200' : 'bg-blue-100 text-blue-800 border-blue-200'}`}>
                                                {guest.category === 'orangtua' ? 'Ortu' : 'Mempelai'}
                                            </span>
                                        </div>
                                        {guest.attendance_status === 'hadir' && (
                                            <span className="bg-green-100 text-green-700 p-1 rounded-full">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                            </span>
                                        )}
                                    </div>

                                    <div className="mt-4 flex items-center justify-between">
                                        {guest.attendance_status === 'hadir' ? (
                                            <div className="flex items-center gap-3 w-full">
                                                <div className="flex-1">
                                                    <p className="text-xs text-green-700 font-bold uppercase tracking-wider mb-1">Sudah Hadir</p>
                                                    <p className="text-sm font-bold">{guest.pax} Orang</p>
                                                    {guest.updated_at && (
                                                        <p className="text-[10px] text-main-red/50 mt-1">
                                                            {new Date(guest.updated_at).toLocaleString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                                        </p>
                                                    )}
                                                </div>
                                                <button
                                                    onClick={() => handleCancelCheckIn(guest)}
                                                    className="text-xs text-red-500 hover:text-red-700 underline"
                                                >
                                                    Batal
                                                </button>
                                                <button
                                                    onClick={() => handleCheckInClick(guest)}
                                                    className="px-3 py-1.5 bg-green-200 text-green-800 rounded-lg text-xs font-bold hover:bg-green-300 transition-colors"
                                                >
                                                    Edit
                                                </button>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => handleCheckInClick(guest)}
                                                className="w-full py-2 bg-accent-wine text-vanilla rounded-lg font-bold shadow-sm hover:bg-main-red transition-all active:scale-95 flex justify-center items-center gap-2"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><line x1="20" y1="8" x2="20" y2="14"></line><line x1="23" y1="11" x2="17" y2="11"></line></svg>
                                                Check In
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Add New Guest Modal */}
                <AnimatePresence>
                    {showAddGuestModal && (
                        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                                className="bg-vanilla text-main-red w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border-2 border-accent-wine"
                            >
                                <div className="bg-accent-wine p-6 text-center">
                                    <h2 className="text-vanilla text-2xl font-pinyon">Tambah Tamu & Check-In</h2>
                                </div>
                                <div className="p-8">
                                    <div className="mb-6">
                                        <label className="block text-sm font-bold mb-2">Nama Tamu</label>
                                        <input
                                            type="text"
                                            value={newGuestName}
                                            onChange={(e) => setNewGuestName(e.target.value)}
                                            className="w-full px-4 py-2 border border-main-red/20 rounded-lg focus:border-accent-wine outline-none bg-white/50"
                                            placeholder="Nama Tamu"
                                        />
                                    </div>

                                    <div className="mb-6">
                                        <label className="block text-sm font-bold mb-2">Kategori</label>
                                        <div className="flex gap-4">
                                            <label className="flex items-center gap-2 cursor-pointer bg-white/50 px-4 py-2 rounded-lg border border-main-red/10 flex-1 hover:border-accent-wine">
                                                <input
                                                    type="radio"
                                                    name="newGuestCategory"
                                                    value="mempelai"
                                                    checked={newGuestCategory === 'mempelai'}
                                                    onChange={(e) => setNewGuestCategory(e.target.value)}
                                                    className="accent-accent-wine"
                                                />
                                                <span className="text-sm">Tamu Mempelai</span>
                                            </label>
                                            <label className="flex items-center gap-2 cursor-pointer bg-white/50 px-4 py-2 rounded-lg border border-main-red/10 flex-1 hover:border-accent-wine">
                                                <input
                                                    type="radio"
                                                    name="newGuestCategory"
                                                    value="orangtua"
                                                    checked={newGuestCategory === 'orangtua'}
                                                    onChange={(e) => setNewGuestCategory(e.target.value)}
                                                    className="accent-accent-wine"
                                                />
                                                <span className="text-sm">Tamu Ortu</span>
                                            </label>
                                        </div>
                                    </div>

                                    <div className="mb-8">
                                        <label className="block text-center text-sm font-bold mb-4">Jumlah Orang (Pax)</label>
                                        <div className="flex items-center justify-center gap-4">
                                            <button
                                                onClick={() => setNewGuestPax(Math.max(1, newGuestPax - 1))}
                                                className="w-12 h-12 rounded-full border-2 border-main-red/20 flex items-center justify-center text-xl hover:bg-main-red/5 active:bg-main-red/10 transition-colors"
                                            >
                                                -
                                            </button>
                                            <input
                                                type="number"
                                                min="1"
                                                value={newGuestPax}
                                                onChange={(e) => setNewGuestPax(parseInt(e.target.value) || 1)}
                                                className="w-24 text-center text-4xl font-bold bg-transparent outline-none border-b-2 border-main-red/20 focus:border-accent-wine"
                                            />
                                            <button
                                                onClick={() => setNewGuestPax(newGuestPax + 1)}
                                                className="w-12 h-12 rounded-full border-2 border-main-red/20 flex items-center justify-center text-xl hover:bg-main-red/5 active:bg-main-red/10 transition-colors"
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>

                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => setShowAddGuestModal(false)}
                                            className="flex-1 py-3 text-main-red font-bold rounded-xl hover:bg-black/5 transition-colors"
                                        >
                                            Batal
                                        </button>
                                        <button
                                            onClick={handleAddNewGuest}
                                            className="flex-1 py-3 bg-accent-wine text-vanilla font-bold rounded-xl shadow-lg hover:bg-main-red transition-all active:scale-95"
                                        >
                                            Simpan & Check-In
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>

                {/* Check-in Modal */}
                <AnimatePresence>
                    {selectedGuest && (
                        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                                className="bg-vanilla text-main-red w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border-2 border-accent-wine"
                            >
                                <div className="bg-accent-wine p-6 text-center">
                                    <h2 className="text-vanilla text-2xl font-pinyon">Konfirmasi Kehadiran</h2>
                                </div>
                                <div className="p-8">
                                    <div className="text-center mb-6">
                                        <p className="text-sm text-main-red/60 uppercase tracking-widest mb-2">Nama Tamu</p>
                                        <h3 className="text-3xl font-bold">{selectedGuest.name}</h3>
                                    </div>

                                    <div className="mb-8">
                                        <label className="block text-center text-sm font-bold mb-4">Jumlah Orang yang Hadir (Pax)</label>
                                        <div className="flex items-center justify-center gap-4">
                                            <button
                                                onClick={() => setPaxInput(Math.max(1, paxInput - 1))}
                                                className="w-12 h-12 rounded-full border-2 border-main-red/20 flex items-center justify-center text-xl hover:bg-main-red/5 active:bg-main-red/10 transition-colors"
                                            >
                                                -
                                            </button>
                                            <input
                                                type="number"
                                                min="1"
                                                value={paxInput}
                                                onChange={(e) => setPaxInput(parseInt(e.target.value) || 1)}
                                                className="w-24 text-center text-4xl font-bold bg-transparent outline-none border-b-2 border-main-red/20 focus:border-accent-wine"
                                            />
                                            <button
                                                onClick={() => setPaxInput(paxInput + 1)}
                                                className="w-12 h-12 rounded-full border-2 border-main-red/20 flex items-center justify-center text-xl hover:bg-main-red/5 active:bg-main-red/10 transition-colors"
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>

                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => setSelectedGuest(null)}
                                            className="flex-1 py-3 text-main-red font-bold rounded-xl hover:bg-black/5 transition-colors"
                                        >
                                            Batal
                                        </button>
                                        <button
                                            onClick={handleConfirmCheckIn}
                                            className="flex-1 py-3 bg-accent-wine text-vanilla font-bold rounded-xl shadow-lg hover:bg-main-red transition-all active:scale-95"
                                        >
                                            Konfirmasi
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default ReservationBook;
