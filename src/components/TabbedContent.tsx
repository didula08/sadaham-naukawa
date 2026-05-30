"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Sparkles, LayoutGrid, Award } from 'lucide-react';
import LeaderboardSection from '@/components/LeaderboardSection';
import DesignsShowcase from '@/components/DesignsShowcase';

export default function TabbedContent({ winner, lanterns }: { winner: any, lanterns: any[] }) {
  const [activeTab, setActiveTab] = useState<'designs' | 'leaderboard' | 'winner'>('designs');

  const tabs = [
    { id: 'designs', label: 'සියලුම නිර්මාණ (All Designs)', icon: LayoutGrid },
    { id: 'leaderboard', label: 'ප්‍රමුඛ පුවරුව (Leaderboard)', icon: Award },
    ...(winner ? [{ id: 'winner', label: 'ජයග්‍රාහකයා (Winner)', icon: Trophy }] : [])
  ] as const;

  return (
    <div className="w-full">
      {/* Tab Navigation */}
      <div className="flex justify-center mb-12 px-4">
        <div className="bg-[#1a140b] p-2 rounded-full border border-[#D4AF37]/30 flex flex-wrap justify-center gap-2 max-w-full overflow-x-auto custom-scrollbar shadow-[0_0_30px_rgba(212,175,55,0.05)]">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`relative px-6 py-3 rounded-full text-sm md:text-base font-semibold transition-all duration-300 flex items-center gap-2 whitespace-nowrap
                  ${isActive ? 'text-black' : 'text-[#D4AF37] hover:text-[#FFD700] hover:bg-[#D4AF37]/10'}
                `}
              >
                {isActive && (
                  <motion.div
                    layoutId="active-tab-bg"
                    className="absolute inset-0 bg-gradient-to-r from-[#D4AF37] to-[#FFD700] rounded-full shadow-[0_0_15px_rgba(255,215,0,0.4)]"
                    initial={false}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-2">
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="min-h-[50vh]">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="w-full"
          >
            {activeTab === 'winner' && winner && (
              <section className="mb-20 relative px-4">
                <div className="absolute inset-0 bg-radial-gradient from-[#D4AF37]/15 to-transparent blur-[80px] -z-10 pointer-events-none" />
                
                <div className="bg-gradient-to-br from-[#1a140b] via-[#0E0B0F]/95 to-[#1a140b] border-2 border-[#D4AF37] rounded-3xl p-6 md:p-8 gold-glow relative overflow-hidden max-w-4xl mx-auto flex flex-col md:flex-row gap-8 items-center">
                  
                  {/* Corner winner badge */}
                  <div className="absolute top-0 right-0 bg-gradient-to-l from-[#D4AF37] to-[#FFD700] text-black font-black px-6 py-2 rounded-bl-3xl shadow-lg flex items-center gap-1.5 text-xs md:text-sm uppercase tracking-wider">
                    <Trophy className="w-4 h-4 fill-black text-black" />
                    <span>Winner - LKR 5,000</span>
                  </div>
                  
                  {/* Winner Thumbnail/Video Link */}
                  <div className="w-full md:w-1/2 aspect-video bg-black rounded-2xl overflow-hidden border border-[#D4AF37]/35 relative group cursor-pointer flex-shrink-0">
                    {(() => {
                      const ytMatch = winner.videoUrl?.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=|shorts\/)|youtu\.be\/)([^"&?\/\s]{11})/);
                      const ytId = ytMatch ? ytMatch[1] : null;
                      const thumb = ytId ? `https://img.youtube.com/vi/${ytId}/hqdefault.jpg` : null;
                      return thumb ? (
                        <a href={`/lantern/${winner._id}`} className="block w-full h-full">
                          <img 
                            src={thumb} 
                            alt={winner.title} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                          />
                          <div className="absolute inset-0 bg-black/45 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <span className="bg-black/85 text-[#FFD700] border border-[#D4AF37]/50 px-4 py-2 rounded-full font-bold text-xs uppercase tracking-wider">
                              නිර්මාණය නරඹන්න (View Design)
                            </span>
                          </div>
                        </a>
                      ) : (
                        <a href={`/lantern/${winner._id}`} className="w-full h-full flex items-center justify-center text-[#D4AF37] bg-black/50 text-sm font-semibold hover:underline">
                          View Video Detail
                        </a>
                      );
                    })()}
                  </div>
                  
                  {/* Winner Info */}
                  <div className="w-full md:w-1/2 flex flex-col justify-center space-y-4 mt-4 md:mt-0">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-xs text-[#D4AF37] font-black uppercase tracking-widest">
                        <Sparkles className="w-4 h-4 text-[#D4AF37] animate-pulse" />
                        <span>මෙවර තරඟයේ ප්‍රථම ස්ථානය (1st Place Winner)</span>
                      </div>
                      <h3 className="text-2xl md:text-3xl font-extrabold text-[#FFD700] gold-text-glow leading-tight">
                        {winner.title}
                      </h3>
                    </div>
                    
                    <div className="border-l-2 border-[#D4AF37] pl-4 space-y-1 py-1">
                      <p className="text-xs text-[#F5F5F7]/50 font-bold uppercase tracking-wider">කලාකරු (Creator)</p>
                      <p className="text-xl font-extrabold text-white">{winner.creatorName}</p>
                    </div>
                    
                    <p className="text-sm text-[#F5F5F7]/70 line-clamp-3 leading-relaxed">
                      {winner.description}
                    </p>
                    
                    <a
                      href={`/lantern/${winner._id}`}
                      className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-[#D4AF37] to-[#FFD700] text-black font-extrabold rounded-full hover:shadow-[0_0_15px_rgba(255,215,0,0.6)] transform hover:-translate-y-0.5 transition-all text-xs w-fit"
                    >
                      <span>නිර්මාණය නැරඹීමට සහ පහන් දැල්වීමට (View Details)</span>
                      <span>&rarr;</span>
                    </a>
                  </div>
                </div>
              </section>
            )}

            {activeTab === 'leaderboard' && (
              <section className="mb-20">
                {lanterns.length > 0 ? (
                  <LeaderboardSection topLanterns={lanterns} />
                ) : (
                  <div className="text-center text-[#D4AF37]/70 py-12">
                    තවමත් නිර්මාණ ඉදිරිපත් කර නොමැත. (No designs submitted yet.)
                  </div>
                )}
              </section>
            )}

            {activeTab === 'designs' && (
              <section className="mb-20">
                <DesignsShowcase initialLanterns={lanterns} />
              </section>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
