'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';

interface Verse {
  original: string;
  translation: string;
  source: string;
}

const VERSES: Verse[] = [
  {
    original: "නහී වේරේන වේරානී - සම්මන්තීධ කුදාචනං | අවේරේන ච සම්මන්ති - ඒස ධම්මෝ සනන්තනෝ",
    translation: "Hatred is never appeased by hatred in this world. By non-hatred alone is hatred appeased. This is a law eternal.",
    source: "ධම්මපදය - යමක වග්ගය (Dhammapada)"
  },
  {
    original: "මනොපුබ්බංගමා ධම්මා - මනොසෙට්ඨා මනොමයා",
    translation: "Mind precedes all mental states. Mind is their chief; they are all mind-wrought.",
    source: "ධම්මපදය - යමක වග්ගය (Dhammapada)"
  },
  {
    original: "ආරෝග්‍යපරමා ලාභා - සන්තුට්ඨිපරමං ධනං | විශ්වාසපරමා ඥාතී - නිබ්බාණං පරමං සුඛං",
    translation: "Health is the supreme gain, contentment the greatest wealth, trust the best kinsman, and Nibbana the highest bliss.",
    source: "ධම්මපදය - ආරෝග්‍ය වග්ගය (Dhammapada)"
  },
  {
    original: "සබ්බපාපස්ස අකරණං - කුසලස්ස උපසම්පදා | සචිත්තපරියෝදපනං - ඒතං බුද්ධාන සාසනං",
    translation: "To avoid all evil, to cultivate good, and to cleanse one's mind — this is the teaching of the Buddhas.",
    source: "ධම්මපදය - බුද්ධ වග්ගය (Dhammapada)"
  },
  {
    original: "ධම්මපීතී සුඛං සේති - විප්පසන්නෙන චේතසා",
    translation: "He who drinks in the Dharma lives happily with a serene and peaceful mind.",
    source: "ධම්මපදය - පණ්ඩිත වග්ගය (Dhammapada)"
  }
];

export default function DhammapadaTicker() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % VERSES.length);
    }, 8500); // Gentle 8.5 second display duration
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full bg-[#0D0B0F]/90 border-b border-[#D4AF37]/30 backdrop-blur-md relative z-40 overflow-hidden py-3 px-4">
      {/* Light glow strip */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#FFD700]/40 to-transparent" />
      
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-3">
        <Sparkles className="w-4 h-4 text-[#D4AF37] animate-pulse flex-shrink-0" />
        
        <div className="relative w-full overflow-hidden min-h-[50px] sm:min-h-[40px] flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              className="text-center flex flex-col items-center justify-center"
            >
              <p className="text-sm md:text-base font-medium text-[#FFD700] tracking-wide font-serif leading-relaxed">
                "{VERSES[index].original}"
              </p>
              <div className="flex flex-col sm:flex-row items-center gap-1.5 sm:gap-3 mt-1">
                <span className="text-[10px] md:text-xs text-[#F5F5F7]/70 italic text-center">
                  {VERSES[index].translation}
                </span>
                <span className="text-[9px] uppercase tracking-wider text-[#D4AF37] font-black border-l-0 sm:border-l sm:border-white/20 sm:pl-3">
                  {VERSES[index].source}
                </span>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <Sparkles className="w-4 h-4 text-[#D4AF37] animate-pulse flex-shrink-0" />
      </div>
    </div>
  );
}
