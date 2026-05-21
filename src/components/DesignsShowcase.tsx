'use client';

import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Sparkles, Flame, Users, Calendar, Award } from 'lucide-react';
import LanternCard from './LanternCard';

interface DesignsShowcaseProps {
  initialLanterns: Array<{
    _id: string;
    title: string;
    description: string;
    videoUrl: string;
    creatorName: string;
    likeCount: number;
    isWinner?: boolean;
    createdAt?: string;
  }>;
}

type FilterTab = 'all' | 'popular' | 'newest' | 'winners';

// A component that generates warm rising sparks and ambient radial glows
function ShowcaseBackground() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Pre-generate stable random parameters so that they don't regenerate on every re-render on the client
  const sparkParams = useMemo(() => {
    return Array.from({ length: 16 }).map(() => ({
      left: `${Math.random() * 100}%`,
      size: 2 + Math.random() * 4, // 2px to 6px
      duration: 8 + Math.random() * 8, // 8s to 16s
      delay: Math.random() * 8,
      drift: (Math.random() - 0.5) * 100, // Left-to-right drift
    }));
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10 rounded-[32px] sm:rounded-[40px]">
      {/* Slow-breathing radial glowing atmospheres */}
      <div className="absolute top-[10%] left-[5%] w-[350px] h-[350px] rounded-full bg-[#D4AF37]/4 blur-[100px] animate-[pulse_10s_infinite_alternate]" />
      <div className="absolute bottom-[10%] right-[5%] w-[450px] h-[450px] rounded-full bg-[#FF6A00]/3 blur-[120px] animate-[pulse_12s_infinite_alternate]" />

      {/* Floating Sparks (only rendered after client-side mount to prevent hydration mismatch) */}
      {mounted &&
        sparkParams.map((param, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-gradient-to-t from-[#FFD700] to-[#FF6A00] opacity-0"
            style={{
              left: param.left,
              bottom: "0%",
              width: param.size,
              height: param.size,
            }}
            animate={{
              y: [0, -850],
              x: [0, param.drift],
              opacity: [0, 0.7, 0.7, 0],
              scale: [0.8, 1.3, 0.8],
            }}
            transition={{
              duration: param.duration,
              repeat: Infinity,
              delay: param.delay,
              ease: "linear",
            }}
          />
        ))}
    </div>
  );
}

export default function DesignsShowcase({ initialLanterns }: DesignsShowcaseProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTab, setFilterTab] = useState<FilterTab>('all');

  // Compute live statistics
  const stats = useMemo(() => {
    const totalDesigns = initialLanterns.length;
    const totalLampsLit = initialLanterns.reduce((acc, curr) => acc + (curr.likeCount || 0), 0);
    const uniqueCreators = new Set(
      initialLanterns.map((l) => l.creatorName.trim().toLowerCase())
    ).size;

    return { totalDesigns, totalLampsLit, uniqueCreators };
  }, [initialLanterns]);

  // Handle client-side search and filtering
  const processedLanterns = useMemo(() => {
    let list = [...initialLanterns];

    // 1. Filter by Search Query (Title or Creator Name)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (l) =>
          l.title.toLowerCase().includes(q) ||
          l.creatorName.toLowerCase().includes(q)
      );
    }

    // 2. Filter / Sort by Selected Tab
    if (filterTab === 'winners') {
      list = list.filter((l) => l.isWinner);
    } else if (filterTab === 'popular') {
      // Sort by likes descending, then date
      list.sort((a, b) => b.likeCount - a.likeCount);
    } else if (filterTab === 'newest') {
      // Sort by creation date descending
      list.sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      });
    } else {
      // Default 'all' sorts by likeCount desc (already done by backend, but we keep a stable copy)
      list.sort((a, b) => b.likeCount - a.likeCount);
    }

    return list;
  }, [initialLanterns, searchQuery, filterTab]);

  return (
    <div className="relative py-12 px-4 sm:px-10 rounded-[32px] sm:rounded-[40px] border border-[#D4AF37]/10 bg-gradient-to-b from-[#0D0B0F]/45 to-[#070509]/45 backdrop-blur-sm overflow-hidden space-y-12 shadow-2xl">
      {/* Ambient background glows and sparks */}
      <ShowcaseBackground />

      {/* 📊 Glassmorphic Live Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto relative z-10">
        {/* Total Submissions Card */}
        <div className="bg-[#0C0A0E]/80 border border-[#D4AF37]/20 rounded-2xl p-5 text-center backdrop-blur-md relative overflow-hidden group hover:border-[#D4AF37]/45 transition-all duration-300">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent" />
          <div className="flex justify-center mb-2 text-[#D4AF37]/80 group-hover:scale-110 transition-transform">
            <Sparkles className="w-5 h-5 text-[#FFD700] animate-pulse" />
          </div>
          <p className="text-[10px] md:text-xs text-[#F5F5F7]/50 font-bold uppercase tracking-wider mb-1 font-serif">
            මුළු නිර්මාණ (Total Designs)
          </p>
          <p className="text-3xl font-black text-white gold-text-glow font-sans">
            {stats.totalDesigns}
          </p>
        </div>

        {/* Total Lamps Lit Card */}
        <div className="bg-[#0C0A0E]/80 border border-[#D4AF37]/20 rounded-2xl p-5 text-center backdrop-blur-md relative overflow-hidden group hover:border-[#D4AF37]/45 transition-all duration-300">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#FF6A00] to-transparent" />
          <div className="flex justify-center mb-2 text-[#FF6A00] group-hover:scale-110 transition-transform">
            <Flame className="w-5 h-5 fill-[#FF6A00]" />
          </div>
          <p className="text-[10px] md:text-xs text-[#F5F5F7]/50 font-bold uppercase tracking-wider mb-1 font-serif">
            දල්වා ඇති මුළු පහන් (Lamps Lit)
          </p>
          <p className="text-3xl font-black text-[#FFD700] gold-text-glow font-sans flex items-center justify-center gap-1.5">
            🪔 {stats.totalLampsLit}
          </p>
        </div>

        {/* Total Participating Creators Card */}
        <div className="bg-[#0C0A0E]/80 border border-[#D4AF37]/20 rounded-2xl p-5 text-center backdrop-blur-md relative overflow-hidden group hover:border-[#D4AF37]/45 transition-all duration-300">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent" />
          <div className="flex justify-center mb-2 text-[#D4AF37]/80 group-hover:scale-110 transition-transform">
            <Users className="w-5 h-5 text-[#D4AF37]" />
          </div>
          <p className="text-[10px] md:text-xs text-[#F5F5F7]/50 font-bold uppercase tracking-wider mb-1 font-serif">
            නිර්මාණකරුවන් (Creators)
          </p>
          <p className="text-3xl font-black text-white gold-text-glow font-sans">
            {stats.uniqueCreators}
          </p>
        </div>
      </div>

      {/* 🔍 Search & Sort Control Panel */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-[#0F0D12]/80 border border-[#D4AF37]/15 p-5 rounded-3xl backdrop-blur-lg max-w-5xl mx-auto shadow-2xl relative overflow-hidden z-10">
        <div className="absolute inset-0 bg-gradient-to-r from-[#D4AF37]/2 to-transparent pointer-events-none" />

        {/* Styled Search Input */}
        <div className="relative w-full md:max-w-sm">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#D4AF37]/70" />
          <input
            type="text"
            placeholder="නිර්මාණකරු හෝ නම සොයන්න... (Search by title or creator)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#151218] border border-[#D4AF37]/25 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] text-white rounded-full py-3 pl-11 pr-4 text-xs md:text-sm outline-none transition-all placeholder:text-[#F5F5F7]/30 shadow-inner"
          />
        </div>

        {/* Tab Buttons */}
        <div className="flex flex-wrap gap-2 w-full md:w-auto justify-center">
          {(
            [
              { id: 'all', label: 'සියල්ල (All)', icon: Sparkles },
              { id: 'popular', label: 'ප්‍රසිද්ධම (Popular)', icon: Flame },
              { id: 'newest', label: 'නවතම (Newest)', icon: Calendar },
              { id: 'winners', label: 'ජයග්‍රාහකයන් (Winners)', icon: Award },
            ] as const
          ).map((tab) => {
            const IconComponent = tab.icon;
            const isActive = filterTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setFilterTab(tab.id)}
                className={`px-4.5 py-2.5 rounded-full text-xs font-bold transition-all border flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-gradient-to-r from-[#D4AF37] to-[#FFD700] text-black border-transparent shadow-[0_0_15px_rgba(212,175,55,0.45)]'
                    : 'bg-transparent text-[#D4AF37]/80 border-[#D4AF37]/25 hover:border-[#D4AF37]/50 hover:text-white'
                }`}
              >
                <IconComponent className={`w-3.5 h-3.5 ${isActive ? 'text-black' : 'text-[#D4AF37]'}`} />
                <span className="font-serif">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 🏮 Animated Showcase Grid */}
      <motion.div layout className="flex flex-wrap justify-center gap-8 relative z-10">
        <AnimatePresence mode="popLayout">
          {processedLanterns.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="text-center py-24 w-full border border-[#D4AF37]/15 rounded-3xl bg-black/40 backdrop-blur-sm max-w-4xl mx-auto shadow-xl"
            >
              <p className="text-[#F5F5F7]/45 text-lg font-serif">
                නිර්මාණ කිසිවක් සොයාගත නොහැක (No designs found matching your search).
              </p>
            </motion.div>
          ) : (
            processedLanterns.map((lantern) => (
              <motion.div
                layout
                key={lantern._id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.35 }}
                className="w-full sm:w-[45%] lg:w-[31%] min-w-0 sm:min-w-[320px] max-w-[460px]"
              >
                <LanternCard lantern={lantern} />
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
