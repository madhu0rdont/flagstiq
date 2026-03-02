import { useMemo, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { MultiClubTrajectoryChart } from './MultiClubTrajectoryChart';
import { MultiClubDispersionChart } from './MultiClubDispersionChart';
import { YardageSummaryTable } from './YardageSummaryTable';
import { Toggle } from '../ui/Toggle';
import { useYardageBookShots } from '../../hooks/useYardageBook';
import { computeXScale } from '../flight/flight-math';
import { buildDistributions } from '../../services/monte-carlo';

export function DetailsTab() {
  const clubs = useYardageBookShots();
  const [excludeMishits, setExcludeMishits] = useState(false);

  const realClubs = useMemo(
    () => (clubs ?? []).filter((c) => !c.imputed),
    [clubs]
  );

  const mishitCount = useMemo(
    () => realClubs.flatMap((c) => c.shots).filter((s) => s.quality === 'mishit').length,
    [realClubs]
  );

  const filteredClubs = useMemo(
    () =>
      (clubs ?? [])
        .map((c) => ({
          ...c,
          shots: !c.imputed && excludeMishits ? c.shots.filter((s) => s.quality !== 'mishit') : c.shots,
        }))
        .filter((c) => c.shots.length > 0),
    [clubs, excludeMishits]
  );

  const realShotCount = useMemo(
    () => filteredClubs.filter((c) => !c.imputed).flatMap((c) => c.shots).length,
    [filteredClubs]
  );

  const allShots = useMemo(
    () => filteredClubs.flatMap((c) => c.shots),
    [filteredClubs]
  );

  const xScale = useMemo(() => computeXScale(allShots), [allShots]);

  const distributions = useMemo(
    () => buildDistributions(filteredClubs),
    [filteredClubs]
  );

  const imputedDistributions = useMemo(
    () => distributions.filter((d) =>
      filteredClubs.some((c) => c.clubId === d.clubId && c.imputed)
    ),
    [distributions, filteredClubs]
  );

  const realClubCount = filteredClubs.filter((c) => !c.imputed).length;
  const imputedClubCount = filteredClubs.filter((c) => c.imputed).length;
  const [chartsOpen, setChartsOpen] = useState(false);

  if (!clubs || clubs.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-text-muted">
        No shot data yet. Log practice sessions to see detailed analytics.
      </p>
    );
  }

  return (
    <>
      <div className="mb-3 flex items-center justify-between">
        <p className="text-xs text-text-muted">
          {realClubCount} club{realClubCount !== 1 ? 's' : ''} &middot; {realShotCount} shots
          {imputedClubCount > 0 && ` · ${imputedClubCount} estimated`}
        </p>

        {mishitCount > 0 && (
          <Toggle
            checked={excludeMishits}
            onChange={setExcludeMishits}
            label={`Exclude mishits (${mishitCount})`}
          />
        )}
      </div>

      {/* Collapsible flight charts */}
      <div className="mb-4 rounded-xl border border-border overflow-hidden">
        <button
          onClick={() => setChartsOpen(!chartsOpen)}
          className="flex w-full items-center justify-between px-3 py-2.5 text-sm font-medium text-text-medium hover:bg-surface transition"
        >
          Flight Visuals
          <ChevronDown
            size={16}
            className={`text-text-muted transition-transform ${chartsOpen ? 'rotate-180' : ''}`}
          />
        </button>
        {chartsOpen && (
          <div className="flex flex-col gap-2 px-3 pb-3">
            <div className="w-full rounded-xl border border-border overflow-hidden shadow-[var(--shadow-card)]">
              <MultiClubTrajectoryChart clubs={filteredClubs} xScale={xScale} />
            </div>
            <div className="w-full rounded-xl border border-border overflow-hidden shadow-[var(--shadow-card)]">
              <MultiClubDispersionChart clubs={filteredClubs} xScale={xScale} imputedDistributions={imputedDistributions} />
            </div>
          </div>
        )}
      </div>

      {/* Summary table */}
      <YardageSummaryTable clubs={filteredClubs} distributions={distributions} />
    </>
  );
}
