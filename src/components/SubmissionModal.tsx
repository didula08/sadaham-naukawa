'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { addLantern } from '@/actions/lanternActions';
import { X, Loader2, Check, Upload, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SubmissionModal({ isOpen, onClose }: SubmissionModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [mounted, setMounted] = useState(false);
  const [receiptPreview, setReceiptPreview] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 4.5 * 1024 * 1024) {
        setError('රූපයේ ප්‍රමාණය 4.5MB ට වඩා අඩු විය යුතුය (Image size must be less than 4.5MB)');
        setReceiptPreview(null);
        e.target.value = ''; // Reset input
        return;
      }
      setError('');
      const reader = new FileReader();
      reader.onloadend = () => {
        setReceiptPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setReceiptPreview(null);
    }
  };

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
    setReceiptPreview(null);
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
                    ඔබගේ නිර්මාණය සාර්ථකව ඇතුළත් කරන ලදී. රුපියල් 300 ක ගෙවීම් රිසිට්පත පරිපාලක (Admin) විසින් පරීක්ෂා කර අනුමත කිරීමෙන් පසු ඔබේ නිර්මාණය වෙබ් අඩවියේ ප්‍රදර්ශනය කෙරේ. ජයග්‍රාහකයාට රුපියල් 10,000 ක මුදලක් පිරිනමනු ලැබේ!
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
                    මෙම තරඟයට නිර්මාණයක් ඇතුළත් කිරීමට රු. 300 ක මුදලක් පහත ගිණුමට බැර කර, එහි රිසිට්පත (Receipt) මෙහි අමුණන්න. (ජයග්‍රාහකයාට රු. 10,000 ක තෑග්ගක් හිමිවේ.)
                  </p>
                  <div className="bg-black/55 p-3 rounded-lg border border-white/5 space-y-1">
                    <p>🏦 <strong className="text-white">බැංකුව (Bank):</strong> ලංකා බැංකුව (Bank of Ceylon)</p>
                    <p>👤 <strong className="text-white">නම (Name):</strong> සදහම් නෞකාව වෙසක් කමිටුව</p>
                    <p>🔢 <strong className="text-white">ගිණුම් අංකය (Acc No):</strong> 1234567890</p>
                    <p>📍 <strong className="text-white">ශාඛාව (Branch):</strong> කොළඹ මධ්‍යම ශාඛාව (Colombo Central)</p>
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

                  {/* Payment Receipt Upload */}
                  <div className="border-b border-white/10 pb-4 mb-4">
                    <h3 className="text-sm font-bold text-[#D4AF37] uppercase tracking-wider mb-3">2. රිසිට්පත ඇමිණීම (Payment Receipt)</h3>
                    <div className="flex flex-col sm:flex-row gap-4 items-start">
                      <div className="w-full sm:flex-1">
                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-[#D4AF37]/40 rounded-xl cursor-pointer bg-black/40 hover:bg-[#D4AF37]/5 hover:border-[#D4AF37] transition-all">
                          <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center px-4">
                            <Upload className="w-8 h-8 text-[#D4AF37] mb-2" />
                            <p className="text-xs text-[#F5F5F7] font-semibold">රිසිට්පත මෙතැනට ඇද දමන්න හෝ තෝරන්න</p>
                            <p className="text-[10px] text-[#F5F5F7]/50 mt-1">PNG, JPG, JPEG (Max 4.5MB)</p>
                          </div>
                          <input
                            type="file"
                            name="receipt"
                            accept="image/*"
                            required
                            onChange={handleFileChange}
                            className="hidden"
                          />
                        </label>
                      </div>
                      
                      {receiptPreview && (
                        <div className="w-full sm:w-32 h-32 rounded-xl border border-[#D4AF37]/40 overflow-hidden relative bg-black flex items-center justify-center">
                          <img
                            src={receiptPreview}
                            alt="Receipt Preview"
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => setReceiptPreview(null)}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* User Bank Account Details (for 10,000 LKR Winner Prize) */}
                  <div>
                    <h3 className="text-sm font-bold text-[#D4AF37] uppercase tracking-wider mb-3">3. ඔබගේ බැංකු විස්තර (Your Bank details - for LKR 10,000 Prize)</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[#F5F5F7] text-xs mb-1">ගිණුම් හිමියාගේ නම (Account Name)</label>
                        <input
                          type="text"
                          name="bankAccountName"
                          required
                          className="w-full bg-black border border-[#D4AF37]/50 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#FFD700] focus:ring-1 focus:ring-[#FFD700] text-xs transition-all"
                          placeholder="නම (බැංකු පොතේ ඇති පරිදි)"
                        />
                      </div>
                      <div>
                        <label className="block text-[#F5F5F7] text-xs mb-1">බැංකුවේ නම (Bank Name)</label>
                        <input
                          type="text"
                          name="bankName"
                          required
                          className="w-full bg-black border border-[#D4AF37]/50 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#FFD700] focus:ring-1 focus:ring-[#FFD700] text-xs transition-all"
                          placeholder="උදා: People's Bank"
                        />
                      </div>
                      <div>
                        <label className="block text-[#F5F5F7] text-xs mb-1">ශාඛාව (Branch)</label>
                        <input
                          type="text"
                          name="bankBranch"
                          required
                          className="w-full bg-black border border-[#D4AF37]/50 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#FFD700] focus:ring-1 focus:ring-[#FFD700] text-xs transition-all"
                          placeholder="ශාඛාව"
                        />
                      </div>
                      <div>
                        <label className="block text-[#F5F5F7] text-xs mb-1">ගිණුම් අංකය (Account Number)</label>
                        <input
                          type="text"
                          name="bankAccountNumber"
                          required
                          className="w-full bg-black border border-[#D4AF37]/50 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#FFD700] focus:ring-1 focus:ring-[#FFD700] text-xs transition-all"
                          placeholder="ගිණුම් අංකය"
                        />
                      </div>
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
