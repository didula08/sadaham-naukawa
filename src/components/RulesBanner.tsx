'use client';

import { useEffect, useState } from 'react';
import { X, ScrollText, ShieldCheck, AlertTriangle, Coins, Receipt, Eye, Clapperboard, Flame, User } from 'lucide-react';

const RULES_ACCEPTED_KEY = 'sadaham_rules_accepted';

export default function RulesBanner() {
  const [visible, setVisible] = useState(false);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    // Show the banner every time the user visits (or use sessionStorage to show once per session)
    const accepted = sessionStorage.getItem(RULES_ACCEPTED_KEY);
    if (!accepted) {
      // Small delay so hero section mounts first and the blur is visible
      const timer = setTimeout(() => setVisible(true), 200);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setClosing(true);
    setTimeout(() => {
      setVisible(false);
      setClosing(false);
      sessionStorage.setItem(RULES_ACCEPTED_KEY, 'true');
    }, 400);
  };

  if (!visible) return null;

  return (
    <>
      {/* ── Backdrop ── */}
      <div
        className={`rules-backdrop ${closing ? 'rules-backdrop--out' : 'rules-backdrop--in'}`}
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* ── Glass Modal ── */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="නීති රීති සහ රෙගුලාසි"
        className={`rules-modal ${closing ? 'rules-modal--out' : 'rules-modal--in'}`}
      >
        {/* Decorative top glow bar */}
        <div className="rules-modal__glow-bar" />

        {/* Header */}
        <div className="rules-modal__header">
          <div className="rules-modal__title-row">
            <span className="rules-modal__icon-wrap">
              <ScrollText size={22} />
            </span>
            <div>
              <h2 className="rules-modal__title">වෙසක් කූඩු තරඟය – නීති හා රෙගුලාසි</h2>
              <p className="rules-modal__subtitle">🏮 Vesak Lantern Competition – Rules &amp; Regulations</p>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="rules-modal__close"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Divider */}
        <div className="rules-modal__divider" />

        {/* Body – scrollable */}
        <div className="rules-modal__body">

          {/* Rule 1: Registration Fee */}
          <div className="rules-section">
            <div className="rules-section__heading">
              <Coins size={16} className="rules-section__icon" />
              <span>1. ලියාපදිංචි ගාස්තුව / Registration Fee</span>
            </div>
            <ul className="rules-list">
              <li>තරඟය සඳහා එක් කූඩුවක් ලියාපදිංචි කිරීම සඳහා රු. 300/- ක ගාස්තුවක් ගෙවිය යුතුය.</li>
              <li>A registration fee of Rs. 300/- must be paid for each lantern entry.</li>
            </ul>
          </div>

          {/* Rule 2: Payment Verification */}
          <div className="rules-section">
            <div className="rules-section__heading">
              <Receipt size={16} className="rules-section__icon" />
              <span>2. ගෙවීම් තහවුරු කිරීම / Payment Confirmation</span>
            </div>
            <ul className="rules-list">
              <li>ගෙවීමෙන් පසු රිසිට්පත (Payment Receipt) WhatsApp මගින් සංවිධායක වෙත යැවිය යුතුය.</li>
              <li>රිසිට්පත තහවුරු කළ පසු පමණක් ලියාපදිංචිය අනුමත කෙරේ.</li>
              <li>After making the payment, the payment receipt must be sent to the organizer via WhatsApp.</li>
              <li>Registration will be approved only after receipt verification.</li>
            </ul>
          </div>

          {/* Rule 3: Display */}
          <div className="rules-section">
            <div className="rules-section__heading">
              <Eye size={16} className="rules-section__icon" />
              <span>3. කූඩුව ප්‍රදර්ශනය කිරීම / Display of Entries</span>
            </div>
            <ul className="rules-list">
              <li>අනුමත කරන ලද කූඩු පමණක් වෙබ් අඩවියේ තරඟ පිටුවෙහි ප්‍රදර්ශනය කරනු ලැබේ.</li>
              <li>Only approved lantern entries will be displayed on the competition page of the website.</li>
            </ul>
          </div>

          {/* Rule 4: Originality */}
          <div className="rules-section">
            <div className="rules-section__heading">
              <User size={16} className="rules-section__icon" />
              <span>4. මුල් නිර්මාණයක් විය යුතුය / Original Creation</span>
            </div>
            <ul className="rules-list">
              <li>තරඟයට ඉදිරිපත් කරන කූඩුව තරඟකරුවාගේම නිර්මාණයක් විය යුතුය.</li>
              <li>The lantern submitted must be an original creation of the participant.</li>
            </ul>
          </div>

          {/* Rule 5: Video Links */}
          <div className="rules-section">
            <div className="rules-section__heading">
              <Clapperboard size={16} className="rules-section__icon" />
              <span>5. TikTok / YouTube සබැඳි / Video Links</span>
            </div>
            <ul className="rules-list">
              <li>තරඟකරුවන්ට තම වෙසක් කූඩුව සම්බන්ධ TikTok, YouTube හෝ වෙනත් වීඩියෝ සබැඳි (Links) එක් කළ යුතුය.</li>
              <li>Participants must provide TikTok, YouTube, or other video links related to their lantern entry.</li>
            </ul>
          </div>

          {/* Pahan Dalwima – How to Vote */}
          <div className="rules-section rules-section--highlight">
            <div className="rules-section__heading">
              <Flame size={16} className="rules-section__icon rules-section__icon--flame" />
              <span>🪔 පහන් දැල්වීම් ක්‍රියාවලිය / How to Light a Lamp (Vote)</span>
            </div>

            <p className="pahan-intro">
              ඔබ කැමති කූඩුවට <strong>පහන් දල්වා</strong> ඡන්දය දෙන්න! ජයග්‍රාහකයා තෝරාගන්නේ
              වැඩිම පහන් දැල්වීම් ලැබූ කූඩුවයි.
              <br />
              <span className="pahan-intro--en">Vote for your favourite lantern by lighting a lamp! The lantern with the most lights wins.</span>
            </p>

            {/* Step-by-step cards */}
            <div className="pahan-steps">

              <div className="pahan-step">
                <div className="pahan-step__num">1</div>
                <div className="pahan-step__body">
                  <div className="pahan-step__emoji">🔍</div>
                  <p className="pahan-step__si">කූඩුවක් තෝරන්න</p>
                  <p className="pahan-step__en">Browse &amp; pick a lantern you love</p>
                </div>
              </div>

              <div className="pahan-arrow">▼</div>

              <div className="pahan-step">
                <div className="pahan-step__num">2</div>
                <div className="pahan-step__body">
                  <div className="pahan-step__emoji">🏮</div>
                  <p className="pahan-step__si">කූඩුව ක්ලික් කරන්න</p>
                  <p className="pahan-step__en">Click on the lantern card to open it</p>
                </div>
              </div>

              <div className="pahan-arrow">▼</div>

              <div className="pahan-step">
                <div className="pahan-step__num">3</div>
                <div className="pahan-step__body">
                  <div className="pahan-step__emoji">🕯️</div>
                  <p className="pahan-step__si">"පහන් දල්වන්න" බොත්තම ක්ලික් කරන්න</p>
                  <p className="pahan-step__en">Press the <strong>"Light the Lamp"</strong> button</p>
                </div>
              </div>

              <div className="pahan-arrow">▼</div>

              <div className="pahan-step pahan-step--done">
                <div className="pahan-step__num pahan-step__num--done">✓</div>
                <div className="pahan-step__body">
                  <div className="pahan-step__emoji">🌟</div>
                  <p className="pahan-step__si">ඔබේ ඡන්දය ලියාපදිංචි විය!</p>
                  <p className="pahan-step__en">Your vote has been counted!</p>
                </div>
              </div>

            </div>

            {/* One-vote warning */}
            <div className="pahan-warning">
              <ShieldCheck size={14} className="pahan-warning__icon" />
              <div>
                <p className="pahan-warning__si">⚠️ එක් කූඩුවකට <strong>එක් වරක් පමණයි</strong> පහන් දල්වන්න හැකි.</p>
                <p className="pahan-warning__en">You can light a lamp for each lantern <strong>only once</strong>. Choose wisely!</p>
              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="rules-modal__footer">
          <p className="rules-modal__footer-note">
            ✦ &nbsp;ඔබ මෙම නීති රීතිවලට එකඟ වේ යැයි සලකා, ඔබේ ඉදිරිපත් කිරීම් ලබා ගන්නෙමු.
          </p>
          <button onClick={handleClose} className="rules-modal__accept-btn">
            <ShieldCheck size={16} />
            <span>තේරුණා — ඇතුළු වෙන්න (I Understand — Enter)</span>
          </button>
        </div>
      </div>

      {/* ── Scoped Styles ── */}
      <style>{`
        /* ---------- Backdrop ---------- */
        .rules-backdrop {
          position: fixed;
          inset: 0;
          z-index: 9998;
          background: rgba(11, 11, 12, 0.55);
          backdrop-filter: blur(14px) saturate(0.7);
          -webkit-backdrop-filter: blur(14px) saturate(0.7);
          transition: opacity 0.4s ease;
        }
        .rules-backdrop--in  { opacity: 1; animation: backdropIn 0.4s ease forwards; }
        .rules-backdrop--out { animation: backdropOut 0.4s ease forwards; }

        @keyframes backdropIn  { from { opacity: 0; } to { opacity: 1; } }
        @keyframes backdropOut { from { opacity: 1; } to { opacity: 0; } }

        /* ---------- Modal ---------- */
        .rules-modal {
          position: fixed;
          z-index: 9999;
          display: flex;
          flex-direction: column;
          width: min(700px, calc(100vw - 2rem));
          height: min(90vh, 860px);
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          border-radius: 20px;
          overflow: hidden;

          /* Glassmorphism */
          background: linear-gradient(
            135deg,
            rgba(30, 22, 10, 0.88) 0%,
            rgba(18, 14, 8, 0.92) 50%,
            rgba(25, 18, 5, 0.90) 100%
          );
          backdrop-filter: blur(28px) saturate(1.4);
          -webkit-backdrop-filter: blur(28px) saturate(1.4);
          border: 1px solid rgba(212, 175, 55, 0.30);
          box-shadow:
            0 0 0 1px rgba(255,215,0,0.08),
            0 8px 40px rgba(0,0,0,0.65),
            0 0 80px rgba(212,175,55,0.12),
            inset 0 1px 0 rgba(255,255,255,0.06);
        }
        .rules-modal--in  { animation: modalIn 0.45s cubic-bezier(0.34,1.56,0.64,1) forwards; }
        .rules-modal--out { animation: modalOut 0.38s cubic-bezier(0.4,0,0.2,1) forwards; }

        @keyframes modalIn {
          from { opacity: 0; transform: translate(-50%, calc(-50% + 28px)) scale(0.94); }
          to   { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        }
        @keyframes modalOut {
          from { opacity: 1; transform: translate(-50%, -50%) scale(1); }
          to   { opacity: 0; transform: translate(-50%, calc(-50% - 18px)) scale(0.96); }
        }

        /* ---------- Glow bar ---------- */
        .rules-modal__glow-bar {
          height: 3px;
          background: linear-gradient(90deg,
            transparent 0%,
            #D4AF37 20%,
            #FFD700 50%,
            #D4AF37 80%,
            transparent 100%);
          opacity: 0.85;
          flex-shrink: 0;
        }

        /* ---------- Header ---------- */
        .rules-modal__header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1.1rem 1.4rem 0.9rem;
          flex-shrink: 0;
        }
        .rules-modal__title-row {
          display: flex;
          align-items: center;
          gap: 0.8rem;
        }
        .rules-modal__icon-wrap {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          border-radius: 10px;
          background: linear-gradient(135deg, rgba(212,175,55,0.25), rgba(255,215,0,0.10));
          border: 1px solid rgba(212,175,55,0.35);
          color: #FFD700;
          flex-shrink: 0;
        }
        .rules-modal__title {
          font-size: 1.1rem;
          font-weight: 800;
          color: #FFD700;
          text-shadow: 0 0 12px rgba(212,175,55,0.5);
          line-height: 1.2;
          margin: 0;
        }
        .rules-modal__subtitle {
          font-size: 0.72rem;
          color: rgba(245,245,247,0.45);
          font-weight: 500;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          margin: 0;
        }
        .rules-modal__close {
          width: 34px;
          height: 34px;
          border-radius: 8px;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.12);
          color: rgba(245,245,247,0.65);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background 0.2s, color 0.2s, border-color 0.2s;
          flex-shrink: 0;
        }
        .rules-modal__close:hover {
          background: rgba(212,175,55,0.18);
          border-color: rgba(212,175,55,0.45);
          color: #FFD700;
        }

        /* ---------- Divider ---------- */
        .rules-modal__divider {
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(212,175,55,0.25), transparent);
          flex-shrink: 0;
        }

        /* ---------- Scrollable body ---------- */
        .rules-modal__body {
          flex: 1;
          overflow-y: auto;
          padding: 1rem 1.4rem;
          display: flex;
          flex-direction: column;
          gap: 0.9rem;
          scrollbar-width: thin;
          scrollbar-color: rgba(212,175,55,0.35) transparent;
        }
        .rules-modal__body::-webkit-scrollbar { width: 5px; }
        .rules-modal__body::-webkit-scrollbar-thumb {
          background: rgba(212,175,55,0.35);
          border-radius: 4px;
        }

        /* ---------- Rule sections ---------- */
        .rules-section {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(212,175,55,0.12);
          border-radius: 12px;
          padding: 0.75rem 1rem;
        }
        .rules-section__heading {
          display: flex;
          align-items: center;
          gap: 0.45rem;
          font-size: 0.8rem;
          font-weight: 700;
          color: #D4AF37;
          text-transform: uppercase;
          letter-spacing: 0.07em;
          margin-bottom: 0.55rem;
        }
        .rules-section__icon { color: #D4AF37; flex-shrink: 0; }
        .rules-section__icon--warn  { color: #f59e0b; }
        .rules-section__icon--flame { color: #f97316; }

        .rules-list {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 0.28rem;
        }
        .rules-list li {
          font-size: 0.82rem;
          color: rgba(245,245,247,0.78);
          line-height: 1.55;
          padding-left: 1rem;
          position: relative;
        }
        .rules-list li::before {
          content: '✦';
          position: absolute;
          left: 0;
          color: rgba(212,175,55,0.55);
          font-size: 0.55rem;
          top: 0.35em;
        }
        /* Sinhala lines slightly larger */
        .rules-list li:nth-child(odd) { font-size: 0.86rem; }

        /* ---------- Pahan Dalwima (How to Vote) ---------- */
        .rules-section--highlight {
          border-color: rgba(249, 115, 22, 0.30);
          background: linear-gradient(135deg, rgba(249,115,22,0.05) 0%, rgba(212,175,55,0.04) 100%);
        }
        .rules-section--highlight .rules-section__heading {
          color: #f97316;
        }

        .pahan-intro {
          font-size: 0.83rem;
          color: rgba(245,245,247,0.72);
          line-height: 1.6;
          margin: 0 0 0.9rem 0;
          padding: 0.55rem 0.75rem;
          background: rgba(255,255,255,0.03);
          border-left: 2px solid rgba(249,115,22,0.45);
          border-radius: 0 6px 6px 0;
        }
        .pahan-intro strong { color: #FFD700; }
        .pahan-intro--en {
          display: block;
          margin-top: 0.25rem;
          font-size: 0.76rem;
          color: rgba(245,245,247,0.45);
        }

        /* Step grid */
        .pahan-steps {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0;
          margin-bottom: 0.9rem;
        }

        .pahan-step {
          display: flex;
          align-items: center;
          gap: 0.7rem;
          width: 100%;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(212,175,55,0.15);
          border-radius: 10px;
          padding: 0.6rem 0.85rem;
          transition: border-color 0.2s, background 0.2s;
        }
        .pahan-step:hover {
          border-color: rgba(249,115,22,0.35);
          background: rgba(249,115,22,0.06);
        }
        .pahan-step--done {
          border-color: rgba(34,197,94,0.30);
          background: rgba(34,197,94,0.05);
        }
        .pahan-step--done:hover {
          border-color: rgba(34,197,94,0.50);
          background: rgba(34,197,94,0.09);
        }

        .pahan-step__num {
          width: 26px;
          height: 26px;
          border-radius: 50%;
          background: linear-gradient(135deg, #D4AF37, #f97316);
          color: #000;
          font-weight: 900;
          font-size: 0.75rem;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          box-shadow: 0 0 8px rgba(249,115,22,0.35);
        }
        .pahan-step__num--done {
          background: linear-gradient(135deg, #22c55e, #16a34a);
          box-shadow: 0 0 8px rgba(34,197,94,0.4);
        }

        .pahan-step__body {
          display: flex;
          align-items: center;
          gap: 0.55rem;
          flex: 1;
        }
        .pahan-step__emoji {
          font-size: 1.3rem;
          line-height: 1;
          flex-shrink: 0;
        }
        .pahan-step__si {
          font-size: 0.87rem;
          color: rgba(245,245,247,0.88);
          font-weight: 600;
          margin: 0;
          line-height: 1.3;
        }
        .pahan-step__en {
          font-size: 0.72rem;
          color: rgba(245,245,247,0.42);
          margin: 0;
          line-height: 1.3;
        }
        .pahan-step__body { flex-direction: column; align-items: flex-start; }

        /* Arrow connector */
        .pahan-arrow {
          color: rgba(249,115,22,0.45);
          font-size: 0.7rem;
          line-height: 1;
          padding: 2px 0;
          user-select: none;
        }

        /* One-vote warning */
        .pahan-warning {
          display: flex;
          align-items: flex-start;
          gap: 0.5rem;
          background: rgba(251,191,36,0.08);
          border: 1px solid rgba(251,191,36,0.28);
          border-radius: 8px;
          padding: 0.6rem 0.75rem;
        }
        .pahan-warning__icon {
          color: #fbbf24;
          flex-shrink: 0;
          margin-top: 2px;
        }
        .pahan-warning__si {
          font-size: 0.84rem;
          color: rgba(245,245,247,0.85);
          margin: 0 0 0.2rem 0;
          line-height: 1.4;
        }
        .pahan-warning__si strong { color: #fbbf24; }
        .pahan-warning__en {
          font-size: 0.74rem;
          color: rgba(245,245,247,0.45);
          margin: 0;
          line-height: 1.4;
        }
        .pahan-warning__en strong { color: rgba(251,191,36,0.75); }

        /* ---------- Footer ---------- */
        .rules-modal__footer {
          padding: 0.85rem 1.4rem 1.1rem;
          flex-shrink: 0;
          border-top: 1px solid rgba(212,175,55,0.12);
          display: flex;
          flex-direction: column;
          gap: 0.7rem;
          align-items: center;
        }
        .rules-modal__footer-note {
          font-size: 0.72rem;
          color: rgba(245,245,247,0.40);
          text-align: center;
          margin: 0;
          line-height: 1.5;
        }
        .rules-modal__accept-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.65rem 1.8rem;
          border-radius: 50px;
          background: linear-gradient(135deg, #D4AF37, #FFD700);
          color: #000;
          font-weight: 800;
          font-size: 0.82rem;
          cursor: pointer;
          border: none;
          letter-spacing: 0.02em;
          box-shadow: 0 0 0 0 rgba(255,215,0,0.5);
          transition: box-shadow 0.25s, transform 0.2s;
        }
        .rules-modal__accept-btn:hover {
          box-shadow: 0 0 22px rgba(255,215,0,0.55), 0 4px 16px rgba(0,0,0,0.35);
          transform: translateY(-1px);
        }
        .rules-modal__accept-btn:active {
          transform: translateY(0);
        }

        /* ---------- Responsive ---------- */
        @media (max-width: 480px) {
          .rules-modal { border-radius: 16px; width: calc(100vw - 1.5rem); height: min(92vh, 92vh); }
          .rules-modal__header { padding: 0.9rem 1rem 0.75rem; }
          .rules-modal__body { padding: 0.85rem 1rem; }
          .rules-modal__footer { padding: 0.75rem 1rem 1rem; }
          .rules-modal__accept-btn { font-size: 0.76rem; padding: 0.6rem 1.2rem; }
        }
      `}</style>
    </>
  );
}
