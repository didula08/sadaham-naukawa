'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { addLantern } from '@/actions/lanternActions';
import { X, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SubmissionModal({ isOpen, onClose }: SubmissionModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const result = await addLantern(formData);

    setLoading(false);
    if (result.error) {
      setError(result.error);
    } else {
      onClose();
    }
  };

  if (!mounted) return null;

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full max-w-lg bg-[#0B0B0C] border border-[#D4AF37]/30 rounded-2xl p-6 gold-glow relative max-h-[90vh] overflow-y-auto"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-[#D4AF37] hover:text-[#FFD700] transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <h2 className="text-2xl font-bold text-[#D4AF37] mb-6 gold-text-glow text-center">
              නිර්මාණයක් ඇතුළත් කිරීම
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[#F5F5F7] mb-1">ඔබේ නම (Your Name)</label>
                <input
                  type="text"
                  name="creatorName"
                  required
                  className="w-full bg-black border border-[#D4AF37]/50 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#FFD700] focus:ring-1 focus:ring-[#FFD700] transition-all"
                  placeholder="ඔබේ නම ඇතුළත් කරන්න"
                />
              </div>

              <div>
                <label className="block text-[#F5F5F7] mb-1">නිර්මාණයේ මාතෘකාව (Decoration Title)</label>
                <input
                  type="text"
                  name="title"
                  required
                  className="w-full bg-black border border-[#D4AF37]/50 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#FFD700] focus:ring-1 focus:ring-[#FFD700] transition-all"
                  placeholder="මාතෘකාව"
                />
              </div>

              <div>
                <label className="block text-[#F5F5F7] mb-1">විස්තරය (Description)</label>
                <textarea
                  name="description"
                  required
                  rows={3}
                  className="w-full bg-black border border-[#D4AF37]/50 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#FFD700] focus:ring-1 focus:ring-[#FFD700] transition-all"
                  placeholder="ඔබේ නිර්මාණය පිළිබඳ විස්තරයක්"
                ></textarea>
              </div>

              <div>
                <label className="block text-[#F5F5F7] mb-1">වීඩියෝ සබැඳිය (Video Link - YouTube/TikTok)</label>
                <input
                  type="url"
                  name="videoUrl"
                  required
                  className="w-full bg-black border border-[#D4AF37]/50 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#FFD700] focus:ring-1 focus:ring-[#FFD700] transition-all"
                  placeholder="https://youtube.com/..."
                />
                <p className="text-xs text-[#F5F5F7]/60 mt-1">
                  විනාඩි 3කට අඩු වීඩියෝවක් ඇතුළත් කරන්න.
                </p>
              </div>

              {error && <p className="text-red-400 text-sm text-center">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-[#D4AF37] to-[#FFD700] text-black font-bold py-3 rounded-lg mt-4 hover:shadow-[0_0_15px_rgba(255,215,0,0.5)] transition-all flex items-center justify-center"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  'ඇතුළත් කරන්න (Submit)'
                )}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  return createPortal(modalContent, document.body);
}
