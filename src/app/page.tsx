import { getAllLanterns, getWinnerLantern } from '@/actions/lanternActions';
import HeroSection from '@/components/HeroSection';
import DhammapadaTicker from '@/components/DhammapadaTicker';
import TabbedContent from '@/components/TabbedContent';
import RulesBanner from '@/components/RulesBanner';

export const dynamic = 'force-dynamic';
export const revalidate = 0; // Disable caching to always get fresh data

export default async function Home() {
  const lanterns = await getAllLanterns();
  const winner = await getWinnerLantern();

  return (
    <main className="min-h-screen bg-[#0B0B0C] relative overflow-hidden">
      <RulesBanner />
      <DhammapadaTicker />
      <HeroSection />

      <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-24 py-16 relative z-10">
        <TabbedContent winner={winner} lanterns={lanterns} />
      </div>
    </main>
  );
}
