import { getAllLanterns, getWinnerLantern } from '@/actions/lanternActions';
import HeroSection from '@/components/HeroSection';
import DhammapadaTicker from '@/components/DhammapadaTicker';
import LeaderboardSection from '@/components/LeaderboardSection';
import DesignsShowcase from '@/components/DesignsShowcase';
import { Trophy, Sparkles } from 'lucide-react';

export const dynamic = 'force-dynamic';
export const revalidate = 0; // Disable caching to always get fresh data

export default async function Home() {
  const lanterns = await getAllLanterns();
  const winner = await getWinnerLantern();

  return (
    <main className="min-h-screen bg-[#0B0B0C] relative overflow-hidden">
      <DhammapadaTicker />
      <HeroSection />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        
        {/* Winner Announcement Spotlight */}
        {winner && (
          <section className="mb-20 relative">
            <div className="absolute inset-0 bg-radial-gradient from-[#D4AF37]/15 to-transparent blur-[80px] -z-10 pointer-events-none" />
            
            <div className="bg-gradient-to-br from-[#1a140b] via-[#0E0B0F]/95 to-[#1a140b] border-2 border-[#D4AF37] rounded-3xl p-6 md:p-8 gold-glow relative overflow-hidden max-w-4xl mx-auto flex flex-col md:flex-row gap-8 items-center">
              
              {/* Corner winner badge */}
              <div className="absolute top-0 right-0 bg-gradient-to-l from-[#D4AF37] to-[#FFD700] text-black font-black px-6 py-2 rounded-bl-3xl shadow-lg flex items-center gap-1.5 text-xs md:text-sm uppercase tracking-wider">
                <Trophy className="w-4 h-4 fill-black text-black" />
                <span>Winner - LKR 10,000</span>
              </div>
              
              {/* Winner Thumbnail/Video Link */}
              <div className="w-full md:w-1/2 aspect-video bg-black rounded-2xl overflow-hidden border border-[#D4AF37]/35 relative group cursor-pointer flex-shrink-0">
                {(() => {
                  const ytMatch = winner.videoUrl.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=|shorts\/)|youtu\.be\/)([^"&?\/\s]{11})/);
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
              <div className="w-full md:w-1/2 flex flex-col justify-center space-y-4">
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
                  <p className="text-xs text-[#F5F5F7]/50 font-bold uppercase tracking-wider">නිර්මාණකරු (Creator)</p>
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
        {/* Popular Choice Leaderboard (Top 3) */}
        {lanterns.length > 0 && (
          <LeaderboardSection topLanterns={lanterns} />
        )}

        <section className="mt-16">
          <div className="flex items-center gap-4 mb-12">
            <div className="h-[1px] flex-grow bg-gradient-to-r from-transparent to-[#D4AF37]/50"></div>
            <h2 className="text-2xl md:text-4xl font-bold text-[#D4AF37] gold-text-glow text-center font-serif">
              සියලුම නිර්මාණ (All Designs)
            </h2>
            <div className="h-[1px] flex-grow bg-gradient-to-l from-transparent to-[#D4AF37]/50"></div>
          </div>

          <DesignsShowcase initialLanterns={lanterns} />
        </section>
      </div>
    </main>
  );
}
