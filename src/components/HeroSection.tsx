"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import SubmitButton from "./SubmitButton";
import dynamic from "next/dynamic";

const VesakLantern3D = dynamic(() => import("./VesakLantern3D"), { ssr: false });

// A component to create floating "Pahan" (clay lamp) glows or fireflies
function FloatingLamps() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const lamps = Array.from({ length: 20 });
  return (
    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
      {lamps.map((_, i) => {
        const left = `${Math.random() * 100}%`;
        const top = `${Math.random() * 100}%`;
        const duration = 4 + Math.random() * 4;
        const delay = Math.random() * 5;
        return (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-[#ffddaa] blur-[1px]"
            style={{ left, top }}
            animate={{
              y: [0, -40, 0],
              opacity: [0.2, 0.9, 0.2],
              scale: [0.8, 1.5, 0.8],
              boxShadow: [
                "0 0 10px 2px rgba(255,100,0,0.4)",
                "0 0 20px 8px rgba(255,150,0,0.8)",
                "0 0 10px 2px rgba(255,100,0,0.4)"
              ]
            }}
            transition={{
              duration,
              repeat: Infinity,
              delay,
              ease: "easeInOut"
            }}
          />
        );
      })}
    </div>
  );
}

export default function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden font-serif">
      {/* Background Image & Effects */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/3d_lord_buddha.png"
          alt="3D Lord Buddha"
          fill
          priority
          className="object-cover object-center opacity-30 mix-blend-screen"
        />
        {/* Buddhist Flag subtle gradient overlay at the very top */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-yellow-400 to-red-600 opacity-50" />
        
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0C] via-[#0B0B0C]/80 to-[#0B0B0C]/40" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B0B0C] via-transparent to-[#0B0B0C]" />
      </div>

      <FloatingLamps />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mt-20 lg:mt-0 pt-20">
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
          
          {/* Traditional Pali Stanza */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.1, ease: "easeOut" }}
            className="flex items-center gap-3 mb-6 text-[#D4AF37]/90"
          >
            <span className="text-xl md:text-2xl drop-shadow-md">🪷</span>
            <p className="text-xs md:text-sm tracking-[0.2em] uppercase font-medium">නමෝ තස්ස භගවතෝ අරහතෝ සම්මා සම්බුද්ධස්ස</p>
            <span className="text-xl md:text-2xl drop-shadow-md">🪷</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
            className="relative"
          >
            {/* Subtle glow behind text */}
            <div className="absolute inset-0 blur-[80px] bg-[#D4AF37]/20 rounded-full w-full h-full transform scale-150" />
            
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-[#FFeba8] via-[#FFD700] to-[#B8860B] mb-4 tracking-wide drop-shadow-[0_0_20px_rgba(255,215,0,0.5)]">
              සදහම් නෞකාව
              <span className="block text-3xl md:text-5xl lg:text-6xl mt-4 font-normal text-[#ffe8b3] opacity-95 drop-shadow-lg">
                ඩිජිටල් වෙසක් කලාපය
              </span>
            </h1>
          </motion.div>

          {/* Dharmachakra Divider */}
          <motion.div
             initial={{ opacity: 0, scale: 0 }}
             animate={{ opacity: 1, scale: 1 }}
             transition={{ duration: 1, delay: 0.3 }}
             className="my-6 text-[#D4AF37]/60 text-2xl"
          >
            ☸
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
            className="text-lg md:text-xl text-[#fcedc7]/80 mb-10 max-w-2xl mx-auto lg:mx-0 font-light leading-loose tracking-wide"
          >
            මෙවර වෙසක් මංගල්‍යය වෙනුවෙන් ඔබ නිර්මාණය කළ වෙසක් කූඩුව ලොවටම ප්‍රදර්ශනය කරන්න. 
            බුද්ධාලම්භන ප්‍රීතියෙන් යුතුව මෙම ඩිජිටල් වෙසක් කලාපයට එකතු වන්න.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
            className="relative z-20"
          >
            <div className="absolute -inset-4 bg-[#D4AF37]/20 blur-xl rounded-full z-[-1]" />
            <SubmitButton />
          </motion.div>
        </div>

        {/* 3D Lantern Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, delay: 0.3, ease: "easeOut" }}
          className="w-full flex justify-center lg:justify-end mt-10 lg:mt-0"
        >
          <VesakLantern3D />
        </motion.div>
      </div>

      {/* Floating vertical line at the bottom */}
      <motion.div 
        animate={{ y: [0, -10, 0] }} 
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-[#D4AF37]/50"
      >
        <div className="w-[1px] h-16 bg-gradient-to-b from-[#D4AF37]/50 to-transparent mx-auto" />
      </motion.div>
    </section>
  );
}
