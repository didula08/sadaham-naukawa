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

/* ── Floating incense smoke & lamp sparks ── */
function ShowcaseBackground() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const sparkParams = useMemo(() =>
    Array.from({ length: 18 }).map(() => ({
      left: `${Math.random() * 100}%`,
      size: 1.5 + Math.random() * 3,
      duration: 10 + Math.random() * 10,
      delay: Math.random() * 10,
      drift: (Math.random() - 0.5) * 80,
    })), []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
      {/* Deep maroon-to-saffron ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-[#8B1A1A]/10 blur-[120px]" />
      <div className="absolute bottom-0 left-1/4 w-[400px] h-[200px] rounded-full bg-[#C8870A]/8 blur-[100px]" />
      <div className="absolute top-1/3 right-0 w-[300px] h-[300px] rounded-full bg-[#FFB300]/5 blur-[90px]" />

      {/* Rising lamp sparks */}
      {mounted && sparkParams.map((p, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            left: p.left,
            bottom: '0%',
            width: p.size,
            height: p.size,
            background: 'radial-gradient(circle, #FFD700, #FF8C00)',
          }}
          animate={{ y: [0, -900], x: [0, p.drift], opacity: [0, 0.8, 0.6, 0], scale: [0.6, 1.4, 0.8] }}
          transition={{ duration: p.duration, repeat: Infinity, delay: p.delay, ease: 'linear' }}
        />
      ))}
    </div>
  );
}

/* ── Ornamental SVG divider ── */
function OrnamantDivider() {
  return (
    <div className="flex items-center justify-center gap-3 my-1">
      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#C8870A]/60 to-[#C8870A]/60" />
      <svg width="28" height="14" viewBox="0 0 28 14" fill="none" className="opacity-80">
        <path d="M14 1 L26 7 L14 13 L2 7 Z" stroke="#C8870A" strokeWidth="1.2" fill="rgba(200,135,10,0.15)" />
        <circle cx="14" cy="7" r="2.5" fill="#C8870A" />
      </svg>
      <div className="h-px flex-1 bg-gradient-to-l from-transparent via-[#C8870A]/60 to-[#C8870A]/60" />
    </div>
  );
}

/* ── Lotus petal corner decorations ── */
function LotusCorner({ className }: { className?: string }) {
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none" className={`absolute opacity-50 ${className}`}>
      <path d="M2 2 Q18 2 18 18" stroke="#C8870A" strokeWidth="1.2" fill="none" />
      <path d="M2 2 Q2 18 18 18" stroke="#C8870A" strokeWidth="1.2" fill="none" />
      <path d="M2 2 Q10 2 10 10" stroke="#FFD700" strokeWidth="0.8" fill="none" />
      <path d="M2 2 Q2 10 10 10" stroke="#FFD700" strokeWidth="0.8" fill="none" />
      <circle cx="4" cy="4" r="1.5" fill="#C8870A" />
    </svg>
  );
}

/* ── Stat card with temple-parchment style ── */
function StatCard({
  icon,
  label,
  value,
  accentColor,
  topColor,
  symbol,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  accentColor: string;
  topColor: string;
  symbol?: string;
}) {
  return (
    <div
      className="relative rounded-2xl overflow-hidden group transition-all duration-400"
      style={{
        background: 'linear-gradient(160deg, #1A0E00 0%, #0F0800 60%, #150C00 100%)',
        border: `1px solid ${accentColor}55`,
        boxShadow: `0 0 0 1px ${accentColor}18, inset 0 1px 0 ${accentColor}20, 0 8px 32px #00000070`,
      }}
    >
      {/* Top ornamental border stripe */}
      <div className="h-[3px]" style={{ background: `linear-gradient(90deg, transparent, ${topColor}, transparent)` }} />

      {/* Inner parchment texture overlay */}
      <div className="absolute inset-0 opacity-[0.04]"
        style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 3px, #C8870A 3px, #C8870A 4px)' }} />

      {/* Lotus corners */}
      <LotusCorner className="top-2 left-2" />
      <LotusCorner className="top-2 right-2 scale-x-[-1]" />

      <div className="relative z-10 px-5 py-6 text-center">
        {/* Icon in ornate circle */}
        <div
          className="w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center relative group-hover:scale-110 transition-transform duration-300"
          style={{
            background: `radial-gradient(circle, ${accentColor}30, ${accentColor}10)`,
            border: `1.5px solid ${accentColor}60`,
            boxShadow: `0 0 16px ${accentColor}30`,
          }}
        >
          {icon}
          {/* Petal ring */}
          <div className="absolute inset-0 rounded-full border border-dashed opacity-30" style={{ borderColor: accentColor }} />
        </div>

        <p className="text-[10px] md:text-[11px] font-bold uppercase tracking-[0.12em] mb-3 leading-tight"
          style={{ color: `${accentColor}99`, fontFamily: 'serif' }}>
          {label}
        </p>

        <OrnamantDivider />

        <p className="mt-3 text-4xl font-black leading-none"
          style={{
            color: accentColor,
            textShadow: `0 0 18px ${accentColor}80, 0 0 40px ${accentColor}30`,
            fontFamily: 'serif',
          }}>
          {symbol}{value}
        </p>
      </div>

      {/* Bottom ornamental border stripe */}
      <div className="h-[1px]" style={{ background: `linear-gradient(90deg, transparent, ${accentColor}30, transparent)` }} />
    </div>
  );
}

export default function DesignsShowcase({ initialLanterns }: DesignsShowcaseProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTab, setFilterTab] = useState<FilterTab>('all');

  const stats = useMemo(() => {
    const totalDesigns = initialLanterns.length;
    const totalLampsLit = initialLanterns.reduce((acc, curr) => acc + (curr.likeCount || 0), 0);
    const uniqueCreators = new Set(initialLanterns.map((l) => l.creatorName.trim().toLowerCase())).size;
    return { totalDesigns, totalLampsLit, uniqueCreators };
  }, [initialLanterns]);

  const processedLanterns = useMemo(() => {
    let list = [...initialLanterns];
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter((l) => l.title.toLowerCase().includes(q) || l.creatorName.toLowerCase().includes(q));
    }
    if (filterTab === 'winners') list = list.filter((l) => l.isWinner);
    else if (filterTab === 'popular') list.sort((a, b) => b.likeCount - a.likeCount);
    else if (filterTab === 'newest') {
      list.sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      });
    } else {
      list.sort((a, b) => b.likeCount - a.likeCount);
    }
    return list;
  }, [initialLanterns, searchQuery, filterTab]);

  const tabs = [
    { id: 'all' as FilterTab,     label: 'සියල්ල (All)',              icon: Sparkles, emoji: '🪷' },
    { id: 'popular' as FilterTab, label: 'ප්‍රසිද්ධම (Popular)',       icon: Flame,    emoji: '🔥' },
    { id: 'newest' as FilterTab,  label: 'නවතම (Newest)',              icon: Calendar, emoji: '🌸' },
    { id: 'winners' as FilterTab, label: 'ජයග්‍රාහකයන් (Winners)',     icon: Award,    emoji: '🏆' },
  ];

  return (
    <div
      className="relative py-6 sm:py-14 px-4 sm:px-10 overflow-hidden space-y-6 sm:space-y-12"
      style={{
        background: 'linear-gradient(180deg, #0D0600 0%, #080400 50%, #0B0500 100%)',
        borderRadius: 32,
        border: '1px solid rgba(200,135,10,0.22)',
        boxShadow: '0 0 0 1px rgba(200,135,10,0.08), 0 20px 80px rgba(0,0,0,0.8), inset 0 1px 0 rgba(200,135,10,0.15)',
      }}
    >
      <ShowcaseBackground />

      {/* ── Outer ornamental border ── */}
      <div className="absolute inset-[6px] rounded-[26px] pointer-events-none"
        style={{ border: '1px solid rgba(200,135,10,0.12)' }} />

      {/* ── Top ornamental header band ── */}
      <div className="absolute top-0 left-0 right-0 h-[5px] rounded-t-[32px]"
        style={{ background: 'linear-gradient(90deg, transparent 0%, #8B1A1A 20%, #C8870A 50%, #8B1A1A 80%, transparent 100%)' }} />

      {/* ── Corner lotus decorations ── */}
      <LotusCorner className="top-4 left-4 w-10 h-10 opacity-40" />
      <LotusCorner className="top-4 right-4 scale-x-[-1] w-10 h-10 opacity-40" />
      <LotusCorner className="bottom-4 left-4 scale-y-[-1] w-10 h-10 opacity-40" />
      <LotusCorner className="bottom-4 right-4 scale-[-1] w-10 h-10 opacity-40" />

      {/* ── Section title ── */}
      <div className="text-center relative z-10">
        <div className="flex items-center justify-center gap-3 mb-2">
          <span className="text-2xl">🪔</span>
          <h2
            className="text-xl sm:text-2xl font-black uppercase tracking-[0.15em]"
            style={{
              background: 'linear-gradient(135deg, #C8870A, #FFD700, #C8870A)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontFamily: 'serif',
              textShadow: 'none',
              filter: 'drop-shadow(0 0 12px rgba(200,135,10,0.6))',
            }}
          >
            වෙසක් කූඩු ප්‍රදර්ශනය
          </h2>
          <span className="text-2xl">🪔</span>
        </div>
        <p className="text-[11px] tracking-[0.2em] uppercase"
          style={{ color: 'rgba(200,135,10,0.6)', fontFamily: 'serif' }}>
          ✦ &nbsp; Vesak Lantern Showcase &nbsp; ✦
        </p>
        {/* Ornamental line under title */}
        <div className="flex items-center justify-center gap-2 mt-3">
          <div className="h-px w-24" style={{ background: 'linear-gradient(90deg, transparent, #C8870A)' }} />
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <circle cx="10" cy="10" r="4" fill="none" stroke="#C8870A" strokeWidth="1.2" />
            <circle cx="10" cy="10" r="1.5" fill="#C8870A" />
            {[0,45,90,135,180,225,270,315].map((deg, i) => (
              <line key={i}
                x1={10 + 5.5 * Math.cos(deg * Math.PI / 180)}
                y1={10 + 5.5 * Math.sin(deg * Math.PI / 180)}
                x2={10 + 8 * Math.cos(deg * Math.PI / 180)}
                y2={10 + 8 * Math.sin(deg * Math.PI / 180)}
                stroke="#C8870A" strokeWidth="1.2" />
            ))}
          </svg>
          <div className="h-px w-24" style={{ background: 'linear-gradient(90deg, #C8870A, transparent)' }} />
        </div>
      </div>

      {/* ── Live Stats Row ── */}
      <div className="hidden sm:grid grid-cols-1 sm:grid-cols-3 gap-5 max-w-3xl mx-auto relative z-10">
        <StatCard
          icon={<Sparkles className="w-5 h-5" style={{ color: '#FFD700' }} />}
          label="මුළු නිර්මාණ · Total Designs"
          value={stats.totalDesigns}
          accentColor="#FFD700"
          topColor="#C8870A"
        />
        <StatCard
          icon={<span className="text-xl leading-none">🪔</span>}
          label="දල්වා ඇති පහන් · Lamps Lit"
          value={stats.totalLampsLit}
          accentColor="#FF8C00"
          topColor="#FF4500"
        />
        <StatCard
          icon={<Users className="w-5 h-5" style={{ color: '#C8870A' }} />}
          label="කලාකරුවන් · Creators"
          value={stats.uniqueCreators}
          accentColor="#C8870A"
          topColor="#8B1A1A"
        />
      </div>

      {/* ── Ornamental section divider ── */}
      <div className="flex items-center justify-center gap-4 relative z-10 -my-4">
        <div className="h-px flex-1 max-w-[160px]" style={{ background: 'linear-gradient(90deg, transparent, #C8870A55)' }} />
        <div className="flex gap-1.5 items-center">
          {['✦', '🌸', '✦'].map((s, i) => (
            <span key={i} className="text-[10px]" style={{ color: '#C8870A99' }}>{s}</span>
          ))}
        </div>
        <div className="h-px flex-1 max-w-[160px]" style={{ background: 'linear-gradient(90deg, #C8870A55, transparent)' }} />
      </div>

      {/* ── Search & Filter Panel ── */}
      <div
        className="flex flex-col md:flex-row gap-4 items-center justify-between p-5 max-w-5xl mx-auto relative z-10 overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #100800 0%, #0A0500 100%)',
          border: '1px solid rgba(200,135,10,0.28)',
          borderRadius: 20,
          boxShadow: 'inset 0 1px 0 rgba(200,135,10,0.2), 0 4px 24px rgba(0,0,0,0.6)',
        }}
      >
        {/* Parchment stripe texture */}
        <div className="absolute inset-0 opacity-[0.025] pointer-events-none"
          style={{ backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 8px, #C8870A 8px, #C8870A 9px)' }} />

        {/* Inner ornamental corners */}
        <div className="absolute top-2 left-2 w-5 h-5 border-t border-l opacity-40" style={{ borderColor: '#C8870A' }} />
        <div className="absolute top-2 right-2 w-5 h-5 border-t border-r opacity-40" style={{ borderColor: '#C8870A' }} />
        <div className="absolute bottom-2 left-2 w-5 h-5 border-b border-l opacity-40" style={{ borderColor: '#C8870A' }} />
        <div className="absolute bottom-2 right-2 w-5 h-5 border-b border-r opacity-40" style={{ borderColor: '#C8870A' }} />

        {/* Search Input */}
        <div className="relative w-full md:max-w-sm z-10">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#C8870A99' }} />
          <input
            type="text"
            placeholder="කලාකරු හෝ නම සොයන්න... (Search by title or creator)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-white rounded-full py-3 pl-11 pr-4 text-xs md:text-sm outline-none transition-all placeholder:text-white/25"
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(200,135,10,0.35)',
              boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.5)',
            }}
            onFocus={(e) => (e.target.style.borderColor = 'rgba(200,135,10,0.75)')}
            onBlur={(e) => (e.target.style.borderColor = 'rgba(200,135,10,0.35)')}
          />
        </div>

        {/* Tab Buttons */}
        <div className="flex flex-wrap gap-2 w-full md:w-auto justify-center z-10">
          {tabs.map((tab) => {
            const isActive = filterTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setFilterTab(tab.id)}
                className="px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 relative overflow-hidden"
                style={
                  isActive
                    ? {
                        background: 'linear-gradient(135deg, #8B1A1A, #C8870A)',
                        color: '#FFF8E1',
                        border: '1px solid rgba(200,135,10,0.6)',
                        boxShadow: '0 0 18px rgba(200,135,10,0.4), inset 0 1px 0 rgba(255,255,255,0.15)',
                        fontFamily: 'serif',
                      }
                    : {
                        background: 'rgba(200,135,10,0.07)',
                        color: 'rgba(200,135,10,0.8)',
                        border: '1px solid rgba(200,135,10,0.25)',
                        fontFamily: 'serif',
                      }
                }
              >
                <span className="text-sm leading-none">{tab.emoji}</span>
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Lantern Grid ── */}
      <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 relative z-10 w-full">
        <AnimatePresence mode="popLayout">
          {processedLanterns.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="text-center py-24 w-full md:col-span-3 lg:col-span-4 xl:col-span-5 mx-auto"
              style={{
                background: 'linear-gradient(160deg, #0F0800, #0A0500)',
                border: '1px solid rgba(200,135,10,0.2)',
                borderRadius: 24,
              }}
            >
              <p className="text-3xl mb-3">🪷</p>
              <p className="text-sm" style={{ color: 'rgba(200,135,10,0.6)', fontFamily: 'serif' }}>
                නිර්මාණ කිසිවක් සොයාගත නොහැක<br />
                <span className="text-xs opacity-60">(No designs found matching your search)</span>
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
                className="w-full flex"
              >
                <div className="w-full h-full">
                  <LanternCard lantern={lantern} />
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </motion.div>

      {/* ── Bottom ornamental footer band ── */}
      <div className="absolute bottom-0 left-0 right-0 h-[4px] rounded-b-[32px]"
        style={{ background: 'linear-gradient(90deg, transparent 0%, #8B1A1A 20%, #C8870A 50%, #8B1A1A 80%, transparent 100%)' }} />
    </div>
  );
}
