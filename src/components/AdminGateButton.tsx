'use client';

import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock } from 'lucide-react';

const LotusIcon = () => (
  <svg
    viewBox="0 0 100 100"
    className="w-7 h-7 text-black transition-transform duration-500 group-hover:rotate-12"
    fill="currentColor"
  >
    {/* Center petal */}
    <path d="M50 20 C42 45 42 65 50 80 C58 65 58 45 50 20 Z" />
    {/* Left petal 1 */}
    <path d="M50 35 C32 50 32 70 47 80 C40 68 42 50 50 35 Z" />
    {/* Right petal 1 */}
    <path d="M50 35 C68 50 68 70 53 80 C60 68 58 50 50 35 Z" />
    {/* Left petal 2 */}
    <path d="M48 45 C20 60 20 80 43 82 C28 72 32 58 48 45 Z" />
    {/* Right petal 2 */}
    <path d="M52 45 C80 60 80 80 57 82 C72 72 68 58 52 45 Z" />
  </svg>
);

export default function AdminGateButton() {
  const pathname = usePathname();
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);

  // Do not render this button on the admin page itself
  if (pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
      {/* Label Tooltip */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, x: 15, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="hidden sm:flex bg-[#0D0B0F]/95 border border-[#D4AF37]/40 text-[#FFD700] text-xs font-bold px-4 py-2.5 rounded-2xl shadow-xl shadow-black/80 backdrop-blur-md items-center gap-2 max-w-xs cursor-pointer select-none"
            onClick={() => router.push('/admin')}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>පරිපාලන ද්වාරය (Admin Portal)</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Zen Button */}
      <motion.button
        onClick={() => router.push('/admin')}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="w-14 h-14 bg-gradient-to-tr from-[#D4AF37] to-[#FFD700] rounded-full flex items-center justify-center cursor-pointer shadow-[0_0_20px_rgba(212,175,55,0.4)] hover:shadow-[0_0_30px_rgba(255,215,0,0.65)] hover:scale-110 active:scale-95 transition-all duration-300 relative group"
        whileHover={{ rotate: 5 }}
      >
        {/* Pulsing ring animation */}
        <span className="absolute inset-0 rounded-full border-2 border-[#FFD700] opacity-0 group-hover:animate-ping group-hover:opacity-40 transition-opacity" />
        
        {/* Shine overlay */}
        <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 pointer-events-none" />
        
        <LotusIcon />
      </motion.button>
    </div>
  );
}
