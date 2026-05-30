'use client';

import { motion } from 'framer-motion';
import { Trophy, Flame, Sparkles } from 'lucide-react';
import { getYoutubeId } from '@/lib/youtube';
import { getTikTokId } from '@/lib/tiktok';
import YouTubePlayer from '@/components/YouTubePlayer';

interface LeaderboardSectionProps {
  topLanterns: Array<{
    _id: string;
    title: string;
    description: string;
    videoUrl: string;
    creatorName: string;
    likeCount: number;
  }>;
}

export default function LeaderboardSection({ topLanterns }: LeaderboardSectionProps) {
  if (!topLanterns || topLanterns.length === 0) return null;

  // We only show up to the top 3
  const leaders = topLanterns.slice(0, 3);

  // Setup ranks configuration
  const rankConfigs = [
    {
      rank: 1,
      badge: '🥇 ප්‍රථම ස්ථානය (1st Place)',
      borderColor: 'border-[#D4AF37]',
      textColor: 'text-[#FFD700]',
      glowClass: 'shadow-[0_0_30px_rgba(212,175,55,0.25)] hover:shadow-[0_0_50px_rgba(255,215,0,0.5)]',
      accentBg: 'bg-gradient-to-r from-[#D4AF37] to-[#FFD700]',
      scaleClass: 'md:scale-105 md:-translate-y-2 z-20',
      orderClass: 'order-1 md:order-2',
    },
    {
      rank: 2,
      badge: '🥈 දෙවන ස්ථානය (2nd Place)',
      borderColor: 'border-[#C0C0C0]',
      textColor: 'text-[#E6E6E6]',
      glowClass: 'shadow-[0_0_20px_rgba(192,192,192,0.15)] hover:shadow-[0_0_35px_rgba(192,192,192,0.35)]',
      accentBg: 'bg-gradient-to-r from-[#8e8e93] to-[#C0C0C0]',
      scaleClass: 'z-10',
      orderClass: 'order-2 md:order-1',
    },
    {
      rank: 3,
      badge: '🥉 තෙවන ස්ථානය (3rd Place)',
      borderColor: 'border-[#CD7F32]',
      textColor: 'text-[#CD7F32]',
      glowClass: 'shadow-[0_0_20px_rgba(205,127,50,0.15)] hover:shadow-[0_0_35px_rgba(205,127,50,0.35)]',
      accentBg: 'bg-gradient-to-r from-[#a0522d] to-[#CD7F32]',
      scaleClass: 'z-10',
      orderClass: 'order-3 md:order-3',
    },
  ];

  // Map leaders to their configurations
  const podiumItems = leaders.map((lantern, index) => ({
    ...lantern,
    config: rankConfigs[index],
  }));

  // Handle click on card (open details page)
  const handleCardClick = (id: string) => {
    window.open(`/lantern/${id}`, '_blank');
  };

  return (
    <section className="mb-24 relative py-8">
      {/* Background glow for the entire section */}
      <div className="absolute inset-0 bg-radial-gradient from-[#D4AF37]/5 to-transparent blur-[120px] -z-10 pointer-events-none" />

      {/* Header */}
      <div className="text-center mb-16 space-y-3">
        <div className="flex items-center justify-center gap-2 text-xs text-[#D4AF37] font-black uppercase tracking-[0.2em] font-serif">
          <Trophy className="w-4 h-4 animate-bounce" />
          <span>මහජන මනාපය දිනූ ප්‍රමුඛ පෙළේ නිර්මාණ</span>
        </div>
        <h2 className="text-3xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-[#FFF] via-[#FFD700] to-[#B8860B] gold-text-glow font-serif">
          ප්‍රධාන මනාප දිනූ නිර්මාණ (Leaderboard)
        </h2>
        <div className="w-24 h-[2px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto mt-4" />
      </div>

      {/* Podium Grid Layout */}
      <div className={`flex flex-col md:flex-row items-center md:items-stretch justify-center gap-8 md:gap-4 max-w-6xl mx-auto px-4 ${leaders.length === 3 ? 'md:px-0' : ''}`}>
        {podiumItems.map((item) => {
          const ytId = getYoutubeId(item.videoUrl);
          const ttId = getTikTokId(item.videoUrl);
          const thumbnailUrl = ytId ? `https://img.youtube.com/vi/${ytId}/hqdefault.jpg` : null;
          const embedUrl = ytId
            ? `https://www.youtube.com/embed/${ytId}`
            : ttId
              ? `https://www.tiktok.com/embed/v2/${ttId}`
              : item.videoUrl;

          return (
            <motion.div
              key={item._id}
              onClick={() => handleCardClick(item._id)}
              className={`w-full sm:w-[85%] md:w-[32%] min-w-0 sm:min-w-[300px] max-w-[420px] flex flex-col justify-between bg-gradient-to-b from-[#110E14]/95 to-[#070509]/95 border-2 rounded-3xl overflow-hidden cursor-pointer backdrop-blur-lg group transition-all duration-500 ${item.config.borderColor} ${item.config.glowClass} ${item.config.scaleClass} ${item.config.orderClass}`}
              whileHover={{ y: -8 }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: item.config.rank * 0.15 }}
            >
              {/* Dynamic shining sweep on card hover */}
              <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 bg-gradient-to-r from-transparent via-[#FFF]/5 to-transparent pointer-events-none z-10" />

              {/* Top Rank Badge */}
              <div className={`w-full py-3 px-4 flex items-center justify-between text-xs font-black uppercase tracking-wider text-black ${item.config.accentBg}`}>
                <span className="flex items-center gap-1.5 font-serif">{item.config.badge}</span>
                <span className="bg-black/90 text-white rounded-full px-2 py-0.5 text-[9px] font-sans">
                  RANK {item.config.rank}
                </span>
              </div>

              {/* Video Thumbnail Cover */}
              <div className="aspect-video w-full bg-black relative overflow-hidden flex-shrink-0 border-b border-white/5">
                {thumbnailUrl ? (
                  <>
                    <img
                      src={thumbnailUrl}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    {/* Play Hover Overlay */}
                    <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="p-2.5 bg-black/75 rounded-full border border-[#D4AF37]/50 group-hover:scale-110 transition-transform duration-300">
                        <Flame className="w-8 h-8 text-[#FFD700] animate-pulse" />
                      </div>
                    </div>
                  </>
                ) : ttId ? (
                  <div className="w-full h-full absolute top-0 left-0 flex flex-col items-center justify-center bg-black gap-3">
                    <svg viewBox="0 0 48 48" className="w-10 h-10" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M38.4 10.6A11.2 11.2 0 0 1 30.6 7v26.5a7.1 7.1 0 1 1-7.1-7.1c.4 0 .8 0 1.2.1V19a14.2 14.2 0 1 0 13.7 14.5V18.5a18.3 18.3 0 0 0 10.8 3.5V15a11.2 11.2 0 0 1-10.8-4.4z" fill="#fff" />
                    </svg>
                    <span className="text-white/80 text-xs font-semibold">TikTok Video</span>
                    <span className="text-[#FFD700] text-[10px] font-bold bg-black/60 px-3 py-1 rounded-full border border-[#D4AF37]/30">
                      විස්තර බලන්න (View Details)
                    </span>
                  </div>
                ) : (
                  <div className="w-full h-full absolute top-0 left-0 relative">
                    <YouTubePlayer
                      videoId={null}
                      embedUrl={embedUrl}
                      title={item.title}
                      autoplay={false}
                    />
                    <div className="absolute inset-0 bg-transparent z-20 cursor-pointer"></div>
                    <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-30 pointer-events-none">
                      <div className="p-3 bg-black/60 rounded-full border border-[#D4AF37]/50">
                        <Flame className="w-8 h-8 text-[#FFD700] animate-pulse" />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Details & Footer */}
              <div className="p-6 flex flex-col flex-grow justify-between gap-5 relative">
                <div className="space-y-2">
                  <div className="flex items-center gap-1 text-xs text-[#D4AF37]/80 font-medium">
                    <Sparkles className="w-3.5 h-3.5 animate-pulse text-[#FFD700]" />
                    <span>නිර්මාණය: <strong className="text-white">{item.creatorName}</strong></span>
                  </div>
                  <h3 className={`text-xl font-bold group-hover:text-white transition-colors duration-300 line-clamp-2 leading-snug font-serif ${item.config.textColor} drop-shadow`}>
                    {item.title}
                  </h3>
                  <p className="text-xs text-[#F5F5F7]/60 line-clamp-2 font-sans font-light leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {/* Score Section */}
                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                  <div className="flex items-center gap-2">
                    <div className="relative flex items-center justify-center">
                      <Flame className="w-5 h-5 text-[#FF6A00] fill-[#FF6A00] animate-pulse filter drop-shadow-[0_0_6px_#FF6A00]" />
                      <Flame className="w-5 h-5 text-[#FFCC00] fill-[#FFCC00] absolute animate-ping opacity-35" />
                    </div>
                    <span className="text-sm font-extrabold text-white tracking-wide">
                      {item.likeCount} <span className="text-[#FFD700] text-xs font-serif font-semibold">පහන් (Lamps)</span>
                    </span>
                  </div>
                  <span className="text-xs text-[#D4AF37] font-semibold group-hover:underline flex items-center gap-1">
                    විස්තර බලන්න &rarr;
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
