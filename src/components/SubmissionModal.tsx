'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { addLantern } from '@/actions/lanternActions';
import { X, Loader2, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SubmissionModal({ isOpen, onClose }: SubmissionModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [mounted, setMounted] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Removed file input changes handler

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
      setIsSuccess(true);
    }
  };

  const handleClose = () => {
    setIsSuccess(false);
    setError('');
    onClose();
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
            className="w-full max-w-xl bg-[#0B0B0C] border border-[#D4AF37]/30 rounded-2xl p-6 gold-glow relative max-h-[90vh] overflow-y-auto"
          >
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 text-[#D4AF37] hover:text-[#FFD700] transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            {isSuccess ? (
              <div className="text-center py-10 space-y-6">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-20 h-20 bg-green-500/20 border border-green-500 rounded-full flex items-center justify-center mx-auto text-green-400"
                >
                  <Check className="w-10 h-10 animate-bounce" />
                </motion.div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-white">සාර්ථකයි! (Submitted!)</h3>
                  <p className="text-[#F5F5F7]/70 text-sm leading-relaxed max-w-md mx-auto">
                    ඔබගේ නිර්මාණය සාර්ථකව ඇතුළත් කරන ලදී. කරුණාකර රුපියල් 300 ක ගෙවීම් රිසිට්පත WhatsApp (+94 71 601 0533) මඟින් අප වෙත එවීමට කටයුතු කරන්න. පරිපාලක (Admin) විසින් එය පරීක්ෂා කර අනුමත කිරීමෙන් පසු ඔබේ නිර්මාණය වෙබ් අඩවියේ ප්‍රදර්ශනය කෙරේ. ජයග්‍රාහකයාට රුපියල් 10,000 ක මුදලක් පිරිනමනු ලැබේ!
                  </p>
                </div>
                <button
                  onClick={handleClose}
                  className="px-6 py-2.5 bg-gradient-to-r from-[#D4AF37] to-[#FFD700] text-black font-bold rounded-lg hover:shadow-[0_0_15px_rgba(255,215,0,0.5)] transition-all"
                >
                  හරි (OK)
                </button>
              </div>
            ) : (
              <>
                <h2 className="text-2xl font-bold text-[#D4AF37] mb-4 gold-text-glow text-center">
                  නිර්මාණයක් ඇතුළත් කිරීම (Submit Creation)
                </h2>

                {/* Entry Fee Instruction Card */}
                <div className="bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-xl p-4 text-xs text-[#ffe596] leading-relaxed mb-6 space-y-2">
                  <p className="font-bold text-center text-sm text-[#FFD700]">
                    💰 ඇතුළත් කිරීමේ ගාස්තුව: රු. 300 (Entry Fee: LKR 300)
                  </p>
                  <p className="text-center text-[#F5F5F7]/80">
                    මෙම තරඟයට නිර්මාණයක් ඇතුළත් කිරීමට රු. 300 ක මුදලක් පහත ගිණුමට බැර කර, එම ගෙවීම් රිසිට්පත WhatsApp මඟින් අප වෙත යොමු කරන්න. (ජයග්‍රාහකයාට රු. 10,000 ක තෑග්ගක් හිමිවේ.)
                  </p>
                  <div className="bg-black/55 p-3 rounded-lg border border-white/5 space-y-1">
                    <p>🏦 <strong className="text-white">බැංකුව (Bank):</strong> ලංකා බැංකුව (Bank of Ceylon)</p>
                    <p>👤 <strong className="text-white">නම (Name):</strong>P.D.D.N.Wijesuriya</p>
                    <p>🔢 <strong className="text-white">ගිණුම් අංකය (Acc No):</strong> 3496929</p>
                    <p>📍 <strong className="text-white">ශාඛාව (Branch):</strong> පූගොඩ</p>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
                  {/* Basic Creation Info */}
                  <div className="border-b border-white/10 pb-4 mb-4">
                    <h3 className="text-sm font-bold text-[#D4AF37] uppercase tracking-wider mb-3">1. නිර්මාණයේ විස්තර (Creation Info)</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-[#F5F5F7] text-sm mb-1">ඔබේ නම (Your Name)</label>
                        <input
                          type="text"
                          name="creatorName"
                          required
                          className="w-full bg-black border border-[#D4AF37]/50 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#FFD700] focus:ring-1 focus:ring-[#FFD700] text-sm transition-all"
                          placeholder="නම ඇතුළත් කරන්න"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[#F5F5F7] text-sm mb-1">නිර්මාණයේ මාතෘකාව (Title)</label>
                          <input
                            type="text"
                            name="title"
                            required
                            className="w-full bg-black border border-[#D4AF37]/50 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#FFD700] focus:ring-1 focus:ring-[#FFD700] text-sm transition-all"
                            placeholder="මාතෘකාව"
                          />
                        </div>
                        <div>
                          <label className="block text-[#F5F5F7] text-sm mb-1">වීඩියෝ සබැඳිය (Video - YouTube/TikTok)</label>
                          <input
                            type="url"
                            name="videoUrl"
                            required
                            className="w-full bg-black border border-[#D4AF37]/50 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#FFD700] focus:ring-1 focus:ring-[#FFD700] text-sm transition-all"
                            placeholder="https://youtube.com/..."
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[#F5F5F7] text-sm mb-1">විස්තරය (Description)</label>
                        <textarea
                          name="description"
                          required
                          rows={2}
                          className="w-full bg-black border border-[#D4AF37]/50 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#FFD700] focus:ring-1 focus:ring-[#FFD700] text-sm transition-all"
                          placeholder="ඔබේ නිර්මාණය පිළිබඳ විස්තරයක් ඇතුළත් කරන්න..."
                        ></textarea>
                      </div>
                    </div>
                  </div>

                  {/* Contact Details */}
                  <div className="border-b border-white/10 pb-4 mb-4">
                    <h3 className="text-sm font-bold text-[#D4AF37] uppercase tracking-wider mb-3">2. සම්බන්ධතා විස්තර (Contact Details)</h3>
                    <div className="space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[#F5F5F7] text-sm mb-1">
                            දුරකථන අංකය (Phone Number) <span className="text-red-400">*</span>
                          </label>
                          <input
                            type="tel"
                            name="phone"
                            required
                            className="w-full bg-black border border-[#D4AF37]/50 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#FFD700] focus:ring-1 focus:ring-[#FFD700] text-sm transition-all"
                            placeholder="07X XXX XXXX"
                          />
                        </div>
                        <div>
                          <label className="block text-[#F5F5F7] text-sm mb-1">
                            විද්‍යුත් තැපෑල (Email Address) <span className="text-red-400">*</span>
                          </label>
                          <input
                            type="email"
                            name="email"
                            required
                            className="w-full bg-black border border-[#D4AF37]/50 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#FFD700] focus:ring-1 focus:ring-[#FFD700] text-sm transition-all"
                            placeholder="example@gmail.com"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-[#F5F5F7] text-sm mb-1">
                          නිවාස ලිපිනය (Home Address) <span className="text-red-400">*</span>
                        </label>
                        <textarea
                          name="address"
                          required
                          rows={2}
                          className="w-full bg-black border border-[#D4AF37]/50 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#FFD700] focus:ring-1 focus:ring-[#FFD700] text-sm transition-all"
                          placeholder="ගෙදර ලිපිනය ඇතුළත් කරන්න..."
                        />
                      </div>
                    </div>
                  </div>

                  {/* Payment Receipt Instruction */}
                  <div className="border-b border-white/10 pb-4 mb-4">
                    <h3 className="text-sm font-bold text-[#D4AF37] uppercase tracking-wider mb-2">3. රිසිට්පත එවීම (Payment Receipt)</h3>
                    <div className="bg-[#D4AF37]/5 border border-[#D4AF37]/20 rounded-xl p-4 text-xs text-[#ffe596]/95 leading-relaxed space-y-2">
                      <p className="font-bold text-[#FFD700] text-xs">
                        📲 රිසිට්පත WhatsApp (+94 71 601 0533) මඟින් අප වෙත එවන්න:
                      </p>
                      <p>
                        මෙම තරඟයට නිර්මාණයක් ඇතුළත් කිරීමට රු. 300 ක මුදලක් ඉහත සඳහන් කළ ගිණුමට බැර කර, එම ගෙවීම් රිසිට්පත **WhatsApp (+94 71 601 0533)** මඟින් අප වෙත යොමු කරන්න.
                      </p>
                      <p className="text-[#F5F5F7]/70 italic border-t border-white/5 pt-2">
                        Please transfer the entry fee of LKR 300 to the bank account mentioned above, and send the payment receipt to us via WhatsApp (+94 71 601 0533).
                      </p>
                    </div>
                  </div>



                  {error && <p className="text-red-400 text-xs text-center font-semibold">{error}</p>}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-[#D4AF37] to-[#FFD700] text-black font-bold py-3 rounded-lg mt-4 hover:shadow-[0_0_15px_rgba(255,215,0,0.5)] transition-all flex items-center justify-center text-sm disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin mr-2" />
                        ඇතුළත් කරමින්... (Submitting...)
                      </>
                    ) : (
                      'ඇතුළත් කරන්න (Submit)'
                    )}
                  </button>
                </form>
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  return createPortal(modalContent, document.body);
}
