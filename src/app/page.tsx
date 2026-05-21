import { getAllLanterns } from '@/actions/lanternActions';
import LanternCard from '@/components/LanternCard';
import HeroSection from '@/components/HeroSection';

export const revalidate = 0; // Disable caching to always get fresh data

export default async function Home() {
  const lanterns = await getAllLanterns();

  return (
    <main className="min-h-screen bg-[#0B0B0C] relative overflow-hidden">
      <HeroSection />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        <section>
          <div className="flex items-center gap-4 mb-10">
            <div className="h-[1px] flex-grow bg-gradient-to-r from-transparent to-[#D4AF37]/50"></div>
            <h2 className="text-2xl md:text-3xl font-bold text-[#D4AF37] gold-text-glow text-center">
              සියලුම නිර්මාණ (All Designs)
            </h2>
            <div className="h-[1px] flex-grow bg-gradient-to-l from-transparent to-[#D4AF37]/50"></div>
          </div>

          {lanterns.length === 0 ? (
            <div className="text-center py-20 border border-[#D4AF37]/20 rounded-2xl bg-black/50 backdrop-blur-sm">
              <p className="text-[#F5F5F7]/60 text-lg">දැනට නිර්මාණ කිසිවක් ඇතුළත් කර නොමැත.</p>
            </div>
          ) : (
            <div className="flex flex-wrap justify-center gap-8">
              {lanterns.map((lantern: any) => (
                <div key={lantern._id.toString()} className="w-full sm:w-[45%] lg:w-[31%] min-w-[320px] max-w-[460px]">
                  <LanternCard lantern={{...lantern, _id: lantern._id.toString()}} />
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
