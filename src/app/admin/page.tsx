'use client';

import { useState, useEffect } from 'react';
import { 
  verifyAdminPassword, 
  getAdminLanterns, 
  approveLantern, 
  rejectLantern, 
  selectWinner 
} from '@/actions/lanternActions';
import { 
  Lock, Loader2, CheckCircle, XCircle, Trophy, 
  Coins, Clock, Grid, ChevronRight, X, Eye, 
  ExternalLink, LogOut, Heart, ShieldAlert, Sparkles,
  Home
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminPage() {
  const [passcode, setPasscode] = useState('');
  const [inputPass, setInputPass] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loadingAuth, setLoadingAuth] = useState(false);
  const [errorAuth, setErrorAuth] = useState('');
  
  const [lanterns, setLanterns] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(false);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'reacts'>('date');
  const [selectedLantern, setSelectedLantern] = useState<any | null>(null);
  const [zoomReceipt, setZoomReceipt] = useState(false);
  const [processingAction, setProcessingAction] = useState(false);

  // Check storage on mount
  useEffect(() => {
    const saved = localStorage.getItem('admin_passcode');
    if (saved) {
      handleAuth(saved);
    }
  }, []);

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleAuth(inputPass);
  };

  const handleAuth = async (pass: string) => {
    setLoadingAuth(true);
    setErrorAuth('');
    try {
      const res = await verifyAdminPassword(pass);
      if (res.success) {
        setPasscode(pass);
        setIsAuthenticated(true);
        localStorage.setItem('admin_passcode', pass);
        await loadLanterns(pass);
      } else {
        setErrorAuth(res.error || 'Incorrect passcode');
        localStorage.removeItem('admin_passcode');
      }
    } catch (e) {
      setErrorAuth('Authentication error. Please try again.');
    } finally {
      setLoadingAuth(false);
    }
  };

  const loadLanterns = async (pass: string) => {
    setLoadingData(true);
    try {
      const data = await getAdminLanterns(pass);
      setLanterns(data);
    } catch (e) {
      console.error('Error loading data:', e);
    } finally {
      setLoadingData(false);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPasscode('');
    setInputPass('');
    setLanterns([]);
    localStorage.removeItem('admin_passcode');
  };

  const handleApprove = async (id: string) => {
    if (processingAction) return;
    setProcessingAction(true);
    const res = await approveLantern(id, passcode);
    setProcessingAction(false);
    if (res.success) {
      setLanterns(prev => prev.map(l => l._id === id ? { ...l, isApproved: true } : l));
      if (selectedLantern?._id === id) {
        setSelectedLantern((prev: any) => ({ ...prev, isApproved: true }));
      }
    } else {
      alert(res.error);
    }
  };

  const handleReject = async (id: string) => {
    if (!confirm('මෙම නිර්මාණය සහ රිසිට්පත සම්පූර්ණයෙන්ම මකා දැමීමට අවශ්‍යද? (Are you sure you want to permanently delete/reject this submission?)')) return;
    if (processingAction) return;
    setProcessingAction(true);
    const res = await rejectLantern(id, passcode);
    setProcessingAction(false);
    if (res.success) {
      setLanterns(prev => prev.filter(l => l._id !== id));
      setSelectedLantern(null);
    } else {
      alert(res.error);
    }
  };

  const handleSelectWinner = async (id: string) => {
    if (!confirm('මෙම නිර්මාණය තරඟයේ ජයග්‍රාහකයා (10,000 LKR) ලෙස තේරීමට අවශ්‍යද? (Are you sure you want to select this creation as the winner?)')) return;
    if (processingAction) return;
    setProcessingAction(true);
    const res = await selectWinner(id, passcode);
    setProcessingAction(false);
    if (res.success) {
      setLanterns(prev => prev.map(l => ({ 
        ...l, 
        isWinner: l._id === id, 
        isApproved: l._id === id ? true : l.isApproved 
      })));
      if (selectedLantern?._id === id) {
        setSelectedLantern((prev: any) => ({ ...prev, isWinner: true, isApproved: true }));
      } else if (selectedLantern) {
        setSelectedLantern((prev: any) => ({ ...prev, isWinner: false }));
      }
    } else {
      alert(res.error);
    }
  };

  // Stats calculation
  const totalEntries = lanterns.length;
  const pendingCount = lanterns.filter(l => !l.isApproved).length;
  const approvedCount = lanterns.filter(l => l.isApproved).length;
  const totalRevenue = totalEntries * 300;
  const winnerLantern = lanterns.find(l => l.isWinner);

  // Find current leader (approved entry with the most likes)
  const approvedLanterns = lanterns.filter(l => l.isApproved);
  const leadingLantern = approvedLanterns.length > 0
    ? [...approvedLanterns].sort((a, b) => b.likeCount - a.likeCount)[0]
    : null;

  // Filtered and sorted list
  const filteredLanterns = lanterns
    .filter(l => {
      if (filter === 'pending') return !l.isApproved;
      if (filter === 'approved') return l.isApproved;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'reacts') {
        if (b.likeCount !== a.likeCount) {
          return b.likeCount - a.likeCount;
        }
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      } else {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

  return (
    <main className="min-h-screen bg-[#070508] text-[#F5F5F7] font-sans pb-16 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] bg-[#D4AF37]/5 blur-[160px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] bg-[#D4AF37]/5 blur-[160px] rounded-full pointer-events-none" />

      {/* 1. Login Screen */}
      <AnimatePresence mode="wait">
        {!isAuthenticated ? (
          <div className="min-h-screen flex items-center justify-center p-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full max-w-md bg-[#0D0B0F]/90 border border-[#D4AF37]/35 rounded-3xl p-8 gold-glow relative backdrop-blur-md"
            >
              <div className="text-center mb-8">
                <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#D4AF37] to-[#FFD700] flex items-center justify-center text-black mx-auto mb-4 shadow-lg shadow-[#D4AF37]/30">
                  <Lock className="w-8 h-8" />
                </div>
                <h1 className="text-3xl font-extrabold text-[#D4AF37] gold-text-glow font-serif">
                  පරිපාලක පිවිසුම
                </h1>
                <p className="text-xs text-[#F5F5F7]/60 mt-2 tracking-widest uppercase">
                  Sadaham Naukawa Admin Portal
                </p>
              </div>

              <form onSubmit={handleAuthSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm text-[#F5F5F7]/80 mb-2">පරිපාලක මුරපදය (Passcode)</label>
                  <input
                    type="password"
                    value={inputPass}
                    onChange={(e) => setInputPass(e.target.value)}
                    required
                    className="w-full bg-black border border-[#D4AF37]/50 rounded-xl px-4 py-3 text-center text-white focus:outline-none focus:border-[#FFD700] focus:ring-1 focus:ring-[#FFD700] text-lg font-mono tracking-widest transition-all"
                    placeholder="••••••••"
                  />
                </div>

                {errorAuth && (
                  <p className="text-red-400 text-xs text-center font-bold flex items-center justify-center gap-1.5 bg-red-500/10 py-2 border border-red-500/20 rounded-lg">
                    <ShieldAlert className="w-4 h-4" />
                    {errorAuth}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loadingAuth}
                  className="w-full bg-gradient-to-r from-[#D4AF37] to-[#FFD700] text-black font-bold py-3 rounded-xl hover:shadow-[0_0_15px_rgba(255,215,0,0.5)] transition-all flex items-center justify-center"
                >
                  {loadingAuth ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    'ඇතුළු වන්න (Login)'
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        ) : (
          /* 2. Admin Dashboard */
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 relative z-10">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-10 pb-6 border-b border-white/10">
              <div>
                <div className="flex items-center gap-2 mb-1 justify-center sm:justify-start">
                  <span className="text-xl">🪷</span>
                  <p className="text-xs text-[#D4AF37] tracking-[0.2em] font-black uppercase">නමෝ තස්ස භගවතෝ අරහතෝ සම්මා සම්බුද්ධස්ස</p>
                </div>
                <h1 className="text-3xl md:text-4xl font-extrabold text-[#D4AF37] gold-text-glow font-serif text-center sm:text-left">
                  පාලන පැනලය (Admin Dashboard)
                </h1>
              </div>
              <div className="flex items-center gap-3">
                <a
                  href="/"
                  className="px-5 py-2.5 bg-white/5 border border-white/10 hover:bg-[#D4AF37]/15 hover:border-[#D4AF37]/35 hover:text-[#FFD700] rounded-xl text-sm transition-all flex items-center gap-2 font-bold"
                >
                  <Home className="w-4 h-4" />
                  <span>මුල් පිටුවට (Home)</span>
                </a>
                <button
                  onClick={handleLogout}
                  className="px-5 py-2.5 bg-white/5 border border-white/10 hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-400 rounded-xl text-sm transition-all flex items-center gap-2 font-bold"
                >
                  <LogOut className="w-4 h-4" />
                  <span>පිටවීම (Logout)</span>
                </button>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              <motion.div 
                whileHover={{ y: -4 }}
                className="bg-[#0D0B0F]/80 border border-[#D4AF37]/20 rounded-2xl p-5 flex items-center gap-4 backdrop-blur-md"
              >
                <div className="p-3.5 bg-[#D4AF37]/10 text-[#D4AF37] rounded-xl">
                  <Coins className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs text-[#F5F5F7]/60 font-semibold uppercase tracking-wider">මුළු එකතුව (Total Income)</p>
                  <p className="text-2xl font-black text-white mt-1">{totalRevenue.toLocaleString()} LKR</p>
                  <p className="text-[10px] text-[#D4AF37] mt-0.5">{totalEntries} x රු. 300</p>
                </div>
              </motion.div>

              <motion.div 
                whileHover={{ y: -4 }}
                className="bg-[#0D0B0F]/80 border border-[#D4AF37]/20 rounded-2xl p-5 flex items-center gap-4 backdrop-blur-md"
              >
                <div className="p-3.5 bg-yellow-500/10 text-yellow-400 rounded-xl">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs text-[#F5F5F7]/60 font-semibold uppercase tracking-wider">අනුමැතිය අපේක්ෂිත (Pending)</p>
                  <p className="text-2xl font-black text-white mt-1">{pendingCount}</p>
                  <p className="text-[10px] text-yellow-400 mt-0.5">පරීක්ෂා කිරීමට ඇත</p>
                </div>
              </motion.div>

              <motion.div 
                whileHover={{ y: -4 }}
                className="bg-[#0D0B0F]/80 border border-[#D4AF37]/20 rounded-2xl p-5 flex items-center gap-4 backdrop-blur-md"
              >
                <div className="p-3.5 bg-green-500/10 text-green-400 rounded-xl">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs text-[#F5F5F7]/60 font-semibold uppercase tracking-wider">අනුමත කළ නිර්මාණ (Approved)</p>
                  <p className="text-2xl font-black text-white mt-1">{approvedCount}</p>
                  <p className="text-[10px] text-green-400 mt-0.5">ප්‍රදර්ශනය වෙමින් පවතී</p>
                </div>
              </motion.div>

              <motion.div 
                whileHover={{ y: -4 }}
                className="bg-[#0D0B0F]/80 border border-[#D4AF37]/20 rounded-2xl p-5 flex items-center gap-4 backdrop-blur-md"
              >
                <div className="p-3.5 bg-gradient-to-tr from-[#D4AF37] to-[#FFD700] text-black rounded-xl">
                  <Trophy className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs text-[#F5F5F7]/60 font-semibold uppercase tracking-wider">ජයග්‍රාහකයා (Winner)</p>
                  <p className="text-lg font-black text-[#FFD700] mt-1 line-clamp-1">
                    {winnerLantern ? winnerLantern.creatorName : 'තෝරා නොමැත'}
                  </p>
                  <p className="text-[10px] text-[#D4AF37] mt-0.5">ත්‍යාගය: රු. 10,000</p>
                </div>
              </motion.div>
            </div>

            {/* List and Filter Section */}
            <div className="bg-[#0D0B0F]/85 border border-[#D4AF37]/20 rounded-3xl p-6 backdrop-blur-md">
              <div className="flex flex-col lg:flex-row justify-between items-center gap-4 mb-6 pb-4 border-b border-white/5">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Grid className="w-5 h-5 text-[#D4AF37]" />
                  <span>තරඟකරුවන්ගේ නිර්මාණ ලැයිස්තුව ({filteredLanterns.length})</span>
                </h2>

                <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto sm:justify-end">
                  {/* Sorting Controls */}
                  <div className="flex bg-black/60 rounded-xl p-1 border border-white/5 items-center w-full sm:w-auto">
                    <span className="text-[10px] text-[#F5F5F7]/40 px-2 uppercase tracking-wider font-bold">පිළිවෙල (Sort):</span>
                    <button
                      onClick={() => setSortBy('date')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex-grow sm:flex-grow-0 ${
                        sortBy === 'date' ? 'bg-[#D4AF37]/25 text-[#FFD700] border border-[#D4AF37]/35' : 'text-[#F5F5F7]/60 hover:text-white'
                      }`}
                    >
                      දිනය (Date)
                    </button>
                    <button
                      onClick={() => setSortBy('reacts')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1 flex-grow sm:flex-grow-0 ${
                        sortBy === 'reacts' ? 'bg-[#D4AF37]/25 text-[#FFD700] border border-[#D4AF37]/35' : 'text-[#F5F5F7]/60 hover:text-white'
                      }`}
                    >
                      <Heart className="w-3 h-3 fill-current text-[#D4AF37]" />
                      <span>මනාප (Reacts)</span>
                    </button>
                  </div>

                  {/* Filter Controls */}
                  <div className="flex bg-black/60 rounded-xl p-1 border border-white/5 w-full sm:w-auto">
                    <button
                      onClick={() => setFilter('all')}
                      className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all flex-grow sm:flex-grow-0 ${
                        filter === 'all' ? 'bg-[#D4AF37] text-black' : 'text-[#F5F5F7]/60 hover:text-white'
                      }`}
                    >
                      සියල්ල (All)
                    </button>
                    <button
                      onClick={() => setFilter('pending')}
                      className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1 flex-grow sm:flex-grow-0 ${
                        filter === 'pending' ? 'bg-yellow-500 text-black' : 'text-[#F5F5F7]/60 hover:text-white'
                      }`}
                    >
                      <span>අපේක්ෂිත</span>
                      {pendingCount > 0 && (
                        <span className={`w-1.5 h-1.5 rounded-full ${filter === 'pending' ? 'bg-black' : 'bg-yellow-500'}`} />
                      )}
                    </button>
                    <button
                      onClick={() => setFilter('approved')}
                      className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all flex-grow sm:flex-grow-0 ${
                        filter === 'approved' ? 'bg-green-500 text-black' : 'text-[#F5F5F7]/60 hover:text-white'
                      }`}
                    >
                      අනුමත (Approved)
                    </button>
                  </div>
                </div>
              </div>

              {/* Data Table */}
              {loadingData ? (
                <div className="text-center py-20">
                  <Loader2 className="w-10 h-10 animate-spin text-[#D4AF37] mx-auto mb-4" />
                  <p className="text-[#F5F5F7]/60 text-sm">දත්ත පූරණය වෙමින් පවතී...</p>
                </div>
              ) : filteredLanterns.length === 0 ? (
                <div className="text-center py-20 border border-dashed border-white/5 rounded-2xl">
                  <p className="text-[#F5F5F7]/40">නිර්මාණ කිසිවක් හමු නොවීය.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-white/5 text-[#D4AF37] text-xs font-bold uppercase tracking-wider">
                        <th className="py-3.5 px-4">ක්‍රියාකරු (Creator)</th>
                        <th className="py-3.5 px-4">නිර්මාණය (Title)</th>
                        <th className="py-3.5 px-4">දිනය (Date)</th>
                        <th className="py-3.5 px-4 text-center">මනාප (Reacts)</th>
                        <th className="py-3.5 px-4 text-center">තත්ත්වය (Status)</th>
                        <th className="py-3.5 px-4 text-right">ක්‍රියාකාරකම් (Action)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-sm">
                      {filteredLanterns.map((lantern) => (
                        <tr 
                          key={lantern._id} 
                          className="hover:bg-white/2 transition-colors cursor-pointer group"
                          onClick={() => setSelectedLantern(lantern)}
                        >
                          <td className="py-4 px-4 font-bold text-white">
                            <div className="flex items-center gap-2">
                              {lantern.isWinner && <Trophy className="w-4 h-4 text-[#FFD700] fill-[#FFD700] flex-shrink-0 animate-pulse" />}
                              <span>{lantern.creatorName}</span>
                              {lantern.isApproved && leadingLantern && lantern._id === leadingLantern._id && (
                                <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[9px] font-black bg-gradient-to-r from-[#D4AF37] to-[#FFD700] text-black shadow shadow-[#D4AF37]/35 uppercase tracking-widest animate-pulse" title="වැඩිම මනාප සංඛ්‍යාවක් ලබාගෙන ප්‍රමුඛත්වයේ සිටින නිර්මාණය">
                                  <Sparkles className="w-2.5 h-2.5 fill-black" />
                                  <span>Leader</span>
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="py-4 px-4 text-[#F5F5F7]/80 max-w-[200px] truncate">{lantern.title}</td>
                          <td className="py-4 px-4 text-[#F5F5F7]/50 text-xs">
                            {new Date(lantern.createdAt).toLocaleDateString('si-LK')}
                          </td>
                          <td className="py-4 px-4 text-center font-extrabold text-[#FFD700]">
                            <div className="flex items-center justify-center gap-1.5">
                              <Heart className="w-4 h-4 fill-[#FFD700] text-[#FFD700] flex-shrink-0" />
                              <span>{lantern.likeCount}</span>
                            </div>
                          </td>
                          <td className="py-4 px-4 text-center">
                            {lantern.isApproved ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-green-500/10 text-green-400 border border-green-500/20">
                                <CheckCircle className="w-3 h-3" /> Approved
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 animate-pulse">
                                <Clock className="w-3 h-3" /> Pending Review
                              </span>
                            )}
                          </td>
                          <td className="py-4 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => setSelectedLantern(lantern)}
                                className="p-2 bg-white/5 border border-white/10 hover:bg-white/10 rounded-lg transition-colors text-[#D4AF37]"
                                title="විස්තර බලන්න"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              
                              {!lantern.isApproved && (
                                <button
                                  onClick={() => handleApprove(lantern._id)}
                                  disabled={processingAction}
                                  className="px-3 py-1.5 bg-green-500 text-black font-bold text-xs rounded-lg hover:shadow-[0_0_10px_rgba(34,197,94,0.4)] transition-all flex items-center gap-1 disabled:opacity-50"
                                >
                                  Approve
                                </button>
                              )}

                              {lantern.isApproved && !lantern.isWinner && (
                                <button
                                  onClick={() => handleSelectWinner(lantern._id)}
                                  disabled={processingAction}
                                  className="px-3 py-1.5 bg-gradient-to-r from-[#D4AF37] to-[#FFD700] text-black font-bold text-xs rounded-lg hover:shadow-[0_0_10px_rgba(255,215,0,0.4)] transition-all flex items-center gap-1 disabled:opacity-50"
                                >
                                  <Trophy className="w-3.5 h-3.5" /> Winner
                                </button>
                              )}

                              <button
                                onClick={() => handleReject(lantern._id)}
                                disabled={processingAction}
                                className="p-2 bg-red-500/10 border border-red-500/20 hover:bg-red-500 hover:text-black rounded-lg transition-all text-red-400"
                                title="ප්‍රතික්ෂේප කරන්න"
                              >
                                <XCircle className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* 3. Review Drawer Modal */}
            <AnimatePresence>
              {selectedLantern && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="w-full max-w-4xl bg-[#0B0B0C] border border-[#D4AF37]/30 rounded-3xl p-6 gold-glow relative max-h-[90vh] overflow-y-auto"
                  >
                    <button
                      onClick={() => setSelectedLantern(null)}
                      className="absolute top-4 right-4 text-[#D4AF37] hover:text-[#FFD700] transition-colors z-10"
                    >
                      <X className="w-6 h-6" />
                    </button>

                    <div className="flex items-center gap-2 text-[#D4AF37] uppercase tracking-wider text-xs font-black mb-1">
                      <Sparkles className="w-4 h-4" />
                      <span>Review Submission</span>
                    </div>

                    <h2 className="text-2xl font-extrabold text-[#FFD700] mb-6 gold-text-glow leading-tight">
                      {selectedLantern.title}
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
                      
                      {/* Left: Video & Details */}
                      <div className="space-y-4 flex flex-col justify-between">
                        <div className="space-y-4">
                          {/* Youtube/Video Embed */}
                          <div className="aspect-video w-full bg-black rounded-xl overflow-hidden border border-[#D4AF37]/20 relative shadow-inner">
                            {selectedLantern.videoUrl ? (
                              <iframe
                                src={selectedLantern.videoUrl}
                                title={selectedLantern.title}
                                className="w-full h-full absolute top-0 left-0"
                                allowFullScreen
                              />
                            ) : (
                              <div className="w-full h-full flex flex-col items-center justify-center text-[#F5F5F7]/30">
                                <XCircle className="w-8 h-8 mb-2" />
                                <span>වීඩියෝවක් නොමැත</span>
                              </div>
                            )}
                          </div>

                          {/* Info block */}
                          <div className="bg-white/3 rounded-xl p-4 border border-white/5 space-y-3">
                            <div className="flex justify-between items-start gap-4">
                              <div>
                                <p className="text-[10px] text-[#D4AF37] font-bold uppercase tracking-widest">නිර්මාණකරු (Creator)</p>
                                <p className="text-lg font-black text-white">{selectedLantern.creatorName}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-[10px] text-[#D4AF37] font-bold uppercase tracking-widest">මනාප සංඛ්‍යාව (Reacts)</p>
                                <p className="text-lg font-black text-[#FFD700] flex items-center justify-end gap-1.5 mt-0.5">
                                  <Heart className="w-5 h-5 fill-[#FFD700] text-[#FFD700]" />
                                  <span>{selectedLantern.likeCount}</span>
                                </p>
                              </div>
                            </div>
                            <div>
                              <p className="text-[10px] text-[#D4AF37] font-bold uppercase tracking-widest">විස්තරය (Description)</p>
                              <p className="text-sm text-[#F5F5F7]/80 leading-relaxed whitespace-pre-wrap">{selectedLantern.description}</p>
                            </div>
                          </div>
                        </div>

                        {/* Control Actions */}
                        <div className="bg-[#D4AF37]/5 border border-[#D4AF37]/20 rounded-xl p-4 flex flex-wrap gap-3 items-center justify-between">
                          <div className="text-xs">
                            <span className="text-[#F5F5F7]/50">Status: </span>
                            {selectedLantern.isApproved ? (
                              <span className="text-green-400 font-bold">Approved</span>
                            ) : (
                              <span className="text-yellow-500 font-bold animate-pulse">Pending Review</span>
                            )}
                          </div>

                          <div className="flex gap-2">
                            {!selectedLantern.isApproved ? (
                              <button
                                onClick={() => handleApprove(selectedLantern._id)}
                                disabled={processingAction}
                                className="px-4 py-2 bg-green-500 text-black font-extrabold text-xs rounded-lg hover:shadow-[0_0_12px_rgba(34,197,94,0.5)] transition-all disabled:opacity-50"
                              >
                                Approve Entry
                              </button>
                            ) : !selectedLantern.isWinner ? (
                              <button
                                onClick={() => handleSelectWinner(selectedLantern._id)}
                                disabled={processingAction}
                                className="px-4 py-2 bg-gradient-to-r from-[#D4AF37] to-[#FFD700] text-black font-extrabold text-xs rounded-lg hover:shadow-[0_0_12px_rgba(255,215,0,0.5)] transition-all flex items-center gap-1.5 disabled:opacity-50"
                              >
                                <Trophy className="w-3.5 h-3.5 animate-bounce" /> Select Winner
                              </button>
                            ) : (
                              <div className="px-3.5 py-1.5 bg-[#FFD700]/10 border border-[#FFD700]/30 text-[#FFD700] font-black text-xs rounded-lg flex items-center gap-1">
                                <Trophy className="w-3.5 h-3.5 fill-[#FFD700]" /> Current Winner
                              </div>
                            )}

                            <button
                              onClick={() => handleReject(selectedLantern._id)}
                              disabled={processingAction}
                              className="px-4 py-2 bg-red-500/10 border border-red-500/20 text-red-400 font-extrabold text-xs rounded-lg hover:bg-red-500 hover:text-black transition-all disabled:opacity-50"
                            >
                              Reject & Delete
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Right: Receipt & Bank Account */}
                      <div className="space-y-4 flex flex-col">
                        {/* Bank Details Card */}
                        <div className="bg-[#0F1B12]/80 border border-green-500/20 rounded-xl p-4 space-y-2.5">
                          <h4 className="text-xs font-black text-[#D4AF37] uppercase tracking-wider flex items-center gap-1">
                            🏦 ත්‍යාග මුදල බැර කළ යුතු ගිණුම (Recipient Bank)
                          </h4>
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div className="bg-black/30 p-2 rounded">
                              <p className="text-[10px] text-[#F5F5F7]/40">හිමිකරුගේ නම (Acc Holder)</p>
                              <p className="font-bold text-white truncate">{selectedLantern.bankAccountName}</p>
                            </div>
                            <div className="bg-black/30 p-2 rounded">
                              <p className="text-[10px] text-[#F5F5F7]/40">බැංකුවේ නම (Bank)</p>
                              <p className="font-bold text-white truncate">{selectedLantern.bankName}</p>
                            </div>
                            <div className="bg-black/30 p-2 rounded">
                              <p className="text-[10px] text-[#F5F5F7]/40">ශාඛාව (Branch)</p>
                              <p className="font-bold text-white truncate">{selectedLantern.bankBranch}</p>
                            </div>
                            <div className="bg-black/30 p-2 rounded col-span-2">
                              <p className="text-[10px] text-[#F5F5F7]/40">ගිණුම් අංකය (Acc Number)</p>
                              <p className="font-bold text-green-400 font-mono text-sm tracking-wide">{selectedLantern.bankAccountNumber}</p>
                            </div>
                          </div>
                        </div>

                        {/* Receipt Preview */}
                        <div className="flex-grow flex flex-col justify-between bg-black/45 border border-white/5 rounded-xl p-4 overflow-hidden relative min-h-[220px]">
                          <div className="flex justify-between items-center mb-2">
                            <h4 className="text-xs font-black text-[#D4AF37] uppercase tracking-wider">
                              📄 ගෙවීම් රිසිට්පත (Receipt Slip - LKR 300)
                            </h4>
                            <button
                              onClick={() => setZoomReceipt(true)}
                              className="text-xs text-[#FFD700] hover:underline flex items-center gap-1"
                            >
                              <Eye className="w-3.5 h-3.5" /> ලොකුවට බලන්න (Zoom)
                            </button>
                          </div>

                          <div 
                            onClick={() => setZoomReceipt(true)}
                            className="w-full flex-grow rounded-lg overflow-hidden border border-white/10 relative bg-black flex items-center justify-center cursor-zoom-in"
                          >
                            {selectedLantern.receiptImage ? (
                              <img
                                src={selectedLantern.receiptImage}
                                alt="Payment Receipt"
                                className="w-full h-full max-h-[200px] md:max-h-[280px] object-contain hover:scale-[1.03] transition-transform duration-300"
                              />
                            ) : (
                              <div className="text-[#F5F5F7]/30 text-xs">රිසිට්පතක් සොයාගත නොහැක</div>
                            )}
                          </div>
                        </div>

                      </div>

                    </div>

                  </motion.div>
                </div>
              )}
            </AnimatePresence>

            {/* 4. Zoom Receipt Lightbox Overlay */}
            <AnimatePresence>
              {zoomReceipt && selectedLantern && (
                <div 
                  onClick={() => setZoomReceipt(false)}
                  className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 cursor-zoom-out"
                >
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="relative max-w-full max-h-full"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      onClick={() => setZoomReceipt(false)}
                      className="absolute top-[-40px] right-0 text-[#D4AF37] hover:text-white flex items-center gap-1 text-sm bg-black/60 px-3 py-1.5 border border-white/10 rounded-full"
                    >
                      <X className="w-4 h-4" /> <span>වහන්න (Close)</span>
                    </button>
                    <img
                      src={selectedLantern.receiptImage}
                      alt="Zoomed Receipt"
                      className="max-w-[90vw] max-h-[85vh] object-contain border border-[#D4AF37]/30 rounded-xl"
                    />
                  </motion.div>
                </div>
              )}
            </AnimatePresence>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}
