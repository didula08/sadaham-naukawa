'use client';

import { useState } from 'react';
import SubmissionModal from './SubmissionModal';
import { Plus } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SubmitButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <motion.button
        onClick={() => setIsModalOpen(true)}
        className="bg-gradient-to-r from-[#D4AF37] to-[#FFD700] text-black font-bold py-3 px-8 rounded-full shadow-[0_0_15px_rgba(212,175,55,0.4)] hover:shadow-[0_0_25px_rgba(255,215,0,0.6)] transition-all flex items-center gap-2 transform hover:scale-105"
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.95 }}
      >
        <Plus className="w-5 h-5" />
        ඔබේ නිර්මාණය ඇතුළත් කරන්න
      </motion.button>

      <SubmissionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
