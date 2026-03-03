import { Link } from 'react-router';
import { MapPin, Plus, Briefcase } from 'lucide-react';
import { TopBar } from '../components/layout/TopBar';
import { useAuth } from '../context/AuthContext';
import { useHandicap } from '../hooks/useHandicap';

export function HomePage() {
  const { user } = useAuth();
  const { handicap, courseCount } = useHandicap();

  const firstName = user?.displayName?.split(' ')[0] || user?.username || 'My';

  return (
    <>
      <TopBar title="MJ Golf" />
      <div className="px-4 py-6">
        <div className="mb-6">
          <h2 className="mb-1 text-2xl font-bold">{firstName}'s Yardage Book</h2>
          <p className="text-sm text-text-medium">Powered by real data and statistics.</p>
          {handicap !== null && (
            <div className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-card border border-border px-3 py-1.5 text-sm">
              <span className="font-semibold text-primary">{handicap}</span>
              <span className="text-text-medium">est. handicap</span>
              <span className="text-xs text-text-light">({courseCount} {courseCount === 1 ? 'course' : 'courses'})</span>
            </div>
          )}
        </div>

        <div className="mb-6 grid grid-cols-3 gap-2">
          <Link
            to="/play"
            className="flex flex-col items-center gap-1.5 rounded-xl bg-primary p-3 text-center text-sm font-medium text-white transition-colors hover:bg-primary-light"
          >
            <MapPin size={20} />
            <span>Play</span>
          </Link>
          <Link
            to="/practice"
            className="flex flex-col items-center gap-1.5 rounded-xl bg-primary p-3 text-center text-sm font-medium text-white transition-colors hover:bg-primary-light"
          >
            <Plus size={20} />
            <span>Practice</span>
          </Link>
          <Link
            to="/bag"
            className="flex flex-col items-center gap-1.5 rounded-xl bg-primary p-3 text-center text-sm font-medium text-white transition-colors hover:bg-primary-light"
          >
            <Briefcase size={20} />
            <span>Bag</span>
          </Link>
        </div>
      </div>
    </>
  );
}
