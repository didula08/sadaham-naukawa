'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Share2, ArrowLeft, Check, Sparkles, ChevronLeft, ChevronRight, Trophy } from 'lucide-react';
import { likeLantern } from '@/actions/lanternActions';
import { getYoutubeId } from '@/lib/youtube';
import YouTubePlayer from '@/components/YouTubePlayer';

interface LanternDetailsClientProps {
  lantern: {
    _id: string;
    title: string;
    description: string;
    videoUrl: string;
    creatorName: string;
    likeCount: number;
    createdAt: string;
    isWinner?: boolean;
  };
  prevLantern: { id: string; title: string } | null;
  nextLantern: { id: string; title: string } | null;
}

export default function LanternDetailsClient({ lantern, prevLantern, nextLantern }: LanternDetailsClientProps) {
  const [likeCount, setLikeCount] = useState(lantern.likeCount);
  const [isLit, setIsLit] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [showSparkle, setShowSparkle] = useState(false);
  const [lanternsList, setLanternsList] = useState<{ id: number; left: string; size: string; delay: string; duration: string; drift: string; rotate: string }[]>([]);

  useEffect(() => {
    // Check if user has already lit this lamp
    if (localStorage.getItem(`liked_${lantern._id}`)) {
      setIsLit(true);
    }

    // Generate random floating lanterns for the background
    const list = Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      size: `${20 + Math.random() * 25}px`,
      delay: `${Math.random() * 10}s`,
      duration: `${12 + Math.random() * 18}s`,
      drift: `${-80 + Math.random() * 160}px`,
      rotate: `${-25 + Math.random() * 50}deg`
    }));
    setLanternsList(list);
  }, [lantern._id]);

  const handleLightLamp = async () => {
    if (isLit || isLiking) return;
    setIsLiking(true);
    setError('');
    
    try {
      const result = await likeLantern(lantern._id);
      if (result.error) {
        setError(result.error);
        if (result.error.includes('දැනටමත්') || result.error.includes('already')) {
          setIsLit(true);
          localStorage.setItem(`liked_${lantern._id}`, 'true');
        }
      } else if (result.success && result.likeCount !== undefined) {
        setLikeCount(result.likeCount);
        setIsLit(true);
        setShowSparkle(true);
        localStorage.setItem(`liked_${lantern._id}`, 'true');
        setTimeout(() => setShowSparkle(false), 2000);
      }
    } catch (e) {
      console.error(e);
      setError('දෝෂයක් සිදු විය. පසුව නැවත උත්සාහ කරන්න.');
    } finally {
      setIsLiking(false);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const ytId = getYoutubeId(lantern.videoUrl);
  const embedUrl = ytId ? `https://www.youtube.com/embed/${ytId}` : lantern.videoUrl;

  const isShorts = lantern.videoUrl.includes('shorts') || lantern.videoUrl.includes('/shorts/');
  
  return (
    <div className="h-screen bg-[#060507] text-white overflow-hidden relative flex flex-col justify-between pb-2">
      
      {/* Dynamic Embedded CSS Styles */}
      <style jsx global>{`
        @keyframes floatUp {
          0% {
            transform: translateY(105vh) translateX(0) scale(0.6) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 0.7;
          }
          90% {
            opacity: 0.7;
          }
          100% {
            transform: translateY(-10vh) translateX(var(--drift)) scale(1.1) rotate(var(--rotate));
            opacity: 0;
          }
        }
        .floating-lantern {
          position: absolute;
          bottom: -100px;
          background: radial-gradient(circle at 50% 30%, #ffdf9e 10%, #ff8c00 60%, #cc3300 90%);
          border-radius: 50% 50% 35% 35% / 40% 40% 60% 60%;
          box-shadow: 0 0 25px rgba(255, 102, 0, 0.8), 0 0 45px rgba(255, 200, 0, 0.4);
          pointer-events: none;
          animation: floatUp linear infinite;
          z-index: 1;
        }
        @keyframes flicker {
          0%, 100% { transform: scale(1) rotate(-1deg) translateY(0); filter: brightness(1); }
          25% { transform: scale(1.05) rotate(1deg) translateY(-1px); filter: brightness(1.15); }
          50% { transform: scale(0.95) rotate(-2deg) translateY(0); filter: brightness(0.9); }
          75% { transform: scale(1.02) rotate(2deg) translateY(-2px); filter: brightness(1.2); }
        }
        .animate-flicker {
          animation: flicker 0.15s infinite alternate ease-in-out;
          transform-origin: bottom center;
        }
        @keyframes lampGlow {
          0%, 100% { box-shadow: 0 0 15px rgba(255, 140, 0, 0.4), 0 0 30px rgba(255, 100, 0, 0.2); }
          50% { box-shadow: 0 0 25px rgba(255, 140, 0, 0.6), 0 0 45px rgba(255, 100, 0, 0.4); }
        }
        .lamp-glow-effect {
          animation: lampGlow 2s infinite alternate ease-in-out;
        }
        @keyframes pulseRipple {
          0% { transform: scale(0.85); opacity: 0.6; }
          100% { transform: scale(1.55); opacity: 0; }
        }
        .lamp-ripple {
          animation: pulseRipple 2s infinite ease-out;
        }
      `}</style>

      {/* Floating Sky Lanterns Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {/* Sky gradient background */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#150a21] via-[#07050a] to-[#040305]" />
        
        {/* Soft center lighting glow */}
        <div className="absolute top-[30%] left-[50%] -translate-x-[50%] w-[80%] h-[50%] bg-[#ff7b00]/5 blur-[160px] rounded-full" />
        
        {/* Drifting Lanterns */}
        {lanternsList.map((l) => (
          <div
            key={l.id}
            className="floating-lantern"
            style={{
              left: l.left,
              width: l.size,
              height: `calc(${l.size} * 1.3)`,
              animationDelay: l.delay,
              animationDuration: l.duration,
              '--drift': l.drift,
              '--rotate': l.rotate,
            } as any}
          />
        ))}
      </div>

      {/* Main Container */}
      <div className="w-full max-w-[92%] mx-auto px-4 py-3 relative z-10 flex-grow flex flex-col justify-center overflow-hidden">
        
        {/* Header Navigation */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mb-3 flex-shrink-0">
          <button
            onClick={() => window.close()}
            className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-[#D4AF37] hover:text-[#FFD700] transition-all flex items-center gap-2 group text-sm backdrop-blur-md w-full sm:w-auto justify-center"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            වෙසක් කලාපයට (Back to Festival)
          </button>

          {/* Next & Previous Navigation */}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-center">
            {prevLantern ? (
              <a
                href={`/lantern/${prevLantern.id}`}
                className="px-4 py-2 rounded-xl bg-[#D4AF37]/15 border border-[#D4AF37]/40 hover:bg-[#D4AF37]/30 text-[#FFD700] hover:text-white transition-all flex items-center gap-2 text-sm backdrop-blur-md font-bold hover:shadow-[0_0_15px_rgba(212,175,55,0.3)]"
                title={`Previous: ${prevLantern.title}`}
              >
                <ChevronLeft className="w-4 h-4" />
                <span>කලින් එක (Prev)</span>
              </a>
            ) : (
              <div className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white/40 text-sm select-none font-bold cursor-not-allowed flex items-center gap-2">
                <ChevronLeft className="w-4 h-4" />
                <span>කලින් එක (Prev)</span>
              </div>
            )}

            {nextLantern ? (
              <a
                href={`/lantern/${nextLantern.id}`}
                className="px-4 py-2 rounded-xl bg-[#D4AF37]/15 border border-[#D4AF37]/40 hover:bg-[#D4AF37]/30 text-[#FFD700] hover:text-white transition-all flex items-center gap-2 text-sm backdrop-blur-md font-bold hover:shadow-[0_0_15px_rgba(212,175,55,0.3)]"
                title={`Next: ${nextLantern.title}`}
              >
                <span>ඊළඟ එක (Next)</span>
                <ChevronRight className="w-4 h-4" />
              </a>
            ) : (
              <div className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white/40 text-sm select-none font-bold cursor-not-allowed flex items-center gap-2">
                <span>ඊළඟ එක (Next)</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            )}
          </div>
          
          <button
            onClick={handleCopyLink}
            className="px-4 py-2 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/35 hover:bg-[#D4AF37]/20 text-[#FFD700] transition-all flex items-center gap-2 group text-sm backdrop-blur-md w-full sm:w-auto justify-center"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-green-400" />
                <span>කොපි කලා! (Copied!)</span>
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4" />
                <span>බෙදාගන්න (Share Link)</span>
              </>
            )}
          </button>
        </div>

        {/* Dynamic Layout - 50/50 Split on Desktop */}
        <div className="flex flex-col md:flex-row gap-6 lg:gap-8 mt-2 items-center md:items-stretch justify-center flex-grow overflow-hidden max-h-[calc(100vh-180px)]">
          
          {/* VIDEO BOX (Left/Top) - Takes half the screen width */}
          <div className="w-full md:w-1/2 flex justify-center items-center h-full overflow-hidden">
            <div 
              className={`bg-black/40 rounded-3xl overflow-hidden border border-[#D4AF37]/30 shadow-2xl relative ${
                isShorts ? 'h-full max-h-[calc(100vh-210px)] aspect-[9/16] shadow-[#D4AF37]/5' : 'w-full aspect-video shadow-[#D4AF37]/10'
              } backdrop-blur-sm`}
            >
              <YouTubePlayer
                videoId={ytId}
                embedUrl={embedUrl}
                title={lantern.title}
                autoplay={true}
              />
            </div>
          </div>

          {/* INFORMATION & INTERACTION PANEL (Right/Bottom) - Takes other half the screen width */}
          <div className="w-full md:w-1/2 flex flex-col justify-center gap-4 h-full overflow-hidden">
            
            {/* Title & Info Card */}
            <div className="bg-black/40 border border-white/5 rounded-3xl p-5 lg:p-6 backdrop-blur-md relative overflow-hidden flex-shrink-0">
              {/* Gold Top Border line */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />
              
              {lantern.isWinner ? (
                <div className="flex items-center gap-2 text-sm lg:text-base text-[#FFD700] bg-[#D4AF37]/15 border border-[#D4AF37]/45 rounded-xl px-4 py-2 mb-4 font-black uppercase tracking-wider shadow-[0_0_15px_rgba(212,175,55,0.2)] animate-pulse w-fit">
                  <Trophy className="w-4 h-4 text-[#FFD700] animate-bounce" />
                  <span>🏆 තරඟයේ ජයග්‍රාහකයා (Winner - LKR 10,000)</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-base lg:text-lg text-[#FFD700] uppercase tracking-wider mb-3 font-black">
                  <Sparkles className="w-5 h-5 text-[#FFD700] animate-pulse" />
                  <span>වෙසක් නිර්මාණය (Vesak Creation)</span>
                </div>
              )}
              
              <h1 className="text-4xl lg:text-5xl font-black text-[#FFD700] gold-text-glow leading-tight mb-4">
                {lantern.title}
              </h1>
              
              <div className="flex items-center gap-4 py-3 border-y border-[#D4AF37]/30 mb-5">
                <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#D4AF37] to-[#FFD700] flex items-center justify-center text-black font-black text-2xl shadow-lg shadow-[#D4AF37]/35 flex-shrink-0">
                  {lantern.creatorName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm lg:text-base text-[#D4AF37] font-extrabold uppercase tracking-widest">නිර්මාණකරු (Creator)</p>
                  <p className="text-2xl lg:text-3xl font-black text-white leading-tight mt-0.5">{lantern.creatorName}</p>
                </div>
              </div>

              <div className="mt-4">
                <p className="text-sm lg:text-base text-[#D4AF37] font-extrabold uppercase tracking-widest mb-2">නිර්මාණයේ විස්තරය (Description)</p>
                <div className="text-white font-black leading-relaxed whitespace-pre-wrap text-lg lg:text-xl break-words break-all">
                  {lantern.description}
                </div>
              </div>
            </div>

            {/* Clay Oil Lamp (පහන) Altar Area */}
            <div className="bg-gradient-to-b from-[#18111a]/40 to-[#0e0a12]/60 border border-[#D4AF37]/20 rounded-3xl p-5 lg:p-6 backdrop-blur-md flex flex-col items-center justify-center relative overflow-hidden text-center flex-shrink-0">
              
              {/* Lamp Altar Shelf Design (Visual) */}
              <div className="absolute bottom-[75px] w-[80%] h-[3px] bg-gradient-to-r from-transparent via-[#D4AF37]/40 to-transparent" />
              
              {/* Animated Light Ripples when Lit */}
              {isLit && (
                <>
                  <div className="absolute w-36 h-36 rounded-full bg-[#ff9900]/10 border border-[#ffaa00]/10 lamp-ripple z-0" style={{ animationDelay: '0s' }} />
                  <div className="absolute w-36 h-36 rounded-full bg-[#ff9900]/10 border border-[#ffaa00]/10 lamp-ripple z-0" style={{ animationDelay: '1s' }} />
                </>
              )}

              {/* Clay Lamp (මැටි පහන) SVG */}
              <div className={`relative z-10 cursor-pointer transition-transform duration-300 ${!isLit ? 'hover:scale-110 active:scale-95' : ''} ${isLit ? 'lamp-glow-effect rounded-full p-2' : ''}`} onClick={handleLightLamp}>
                <svg viewBox="0 0 100 65" className="w-28 h-28 select-none filter drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
                  {/* Oil Lamp Shadow */}
                  <ellipse cx="50" cy="54" rx="42" ry="7" fill="black" opacity="0.4" />
                  
                  {/* Clay Pot Base */}
                  <path d="M 12 38 C 12 55, 88 55, 88 38 C 88 28, 73 28, 50 33 C 27 28, 12 28, 12 38 Z" fill="#8B4513" stroke="#5C2E0B" strokeWidth="2.5" />
                  
                  {/* Clay Pot Trim detail */}
                  <path d="M 22 36 C 32 31, 68 31, 78 36" fill="none" stroke="#6b350f" strokeWidth="1.5" />
                  
                  {/* Coconut/Mustard Oil */}
                  <ellipse cx="50" cy="34" rx="32" ry="4" fill="#cf9613" />
                  
                  {/* Cotton Wick */}
                  <path d="M 50 34 Q 50 22, 50 20" fill="none" stroke="#2b2622" strokeWidth="4.5" strokeLinecap="round" />
                  
                  {/* FLAME (Only rendered/animated if lamp is lit) */}
                  {isLit && (
                    <g className="flame-group">
                      {/* Outer Fire Glow */}
                      <path d="M 50 3 Q 41 15, 50 24 Q 59 15, 50 3 Z" fill="#ff4d00" opacity="0.35" className="animate-pulse" />
                      {/* Middle Fire Flame */}
                      <path d="M 50 6 Q 43 16, 50 24 Q 57 16, 50 6 Z" fill="#ff9000" className="animate-flicker" />
                      {/* Inner Golden Core */}
                      <path d="M 50 12 Q 46 18, 50 24 Q 54 18, 50 12 Z" fill="#ffea00" />
                    </g>
                  )}
                </svg>
                
                {/* Floating Spars / Blessings Burst when user lights it */}
                <AnimatePresence>
                  {showSparkle && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1.5 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 flex items-center justify-center pointer-events-none"
                    >
                      <Sparkles className="w-16 h-16 text-[#FFD700] fill-[#FFD700] animate-spin" style={{ animationDuration: '3s' }} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Status and count */}
              <div className="mt-4 z-10">
                <p className="text-[#FFD700] font-bold text-2xl gold-text-glow flex items-center justify-center gap-2">
                  <Heart className="w-6 h-6 fill-[#FFD700] text-[#FFD700] inline" />
                  {likeCount} පහන් දල්වා ඇත (Lamps Lit)
                </p>
                
                {error && <p className="text-red-400 text-xs mt-2">{error}</p>}
                
                <button
                  onClick={handleLightLamp}
                  disabled={isLit || isLiking}
                  className={`mt-4 px-6 py-3 rounded-xl font-bold transition-all ${
                    isLit 
                      ? 'bg-gradient-to-r from-[#D4AF37]/10 to-[#FFD700]/10 border border-[#D4AF37]/30 text-[#FFD700]/70 cursor-default'
                      : 'bg-gradient-to-r from-[#D4AF37] to-[#FFD700] text-black hover:shadow-[0_0_20px_rgba(255,215,0,0.6)]'
                  } disabled:opacity-80`}
                >
                  {isLit 
                    ? 'ඔබ පහනක් දල්වා ඇත (You Lit a Lamp)' 
                    : isLiking 
                      ? 'පහන දල්වමින්...' 
                      : 'පහනක් දල්වන්න (Light a Lamp)'}
                </button>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* Footer copyright */}
      <footer className="w-full text-center py-2 text-xs text-white/30 border-t border-white/5 relative z-10 mt-3 flex-shrink-0">
        සදහම් නෞකාව වෙසක් කලාපය © 2026. සියලුම හිමිකම් ඇවිරිණි.
      </footer>
    </div>
  );
}
