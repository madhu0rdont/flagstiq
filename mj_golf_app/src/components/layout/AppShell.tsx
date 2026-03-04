import { Outlet } from 'react-router';

export function AppShell() {
  const year = new Date().getFullYear();

  return (
    <div className="flex min-h-dvh flex-col bg-surface text-text-dark">
      <main className="relative z-[1] flex-1 pb-6">
        <Outlet />
      </main>
      <footer className="border-t border-border bg-card px-4 py-3 text-center font-mono text-[0.65rem] tracking-wider uppercase text-sand pb-[env(safe-area-inset-bottom)]">
        &copy; {year} Madhukrishna Josyula. All rights reserved.
      </footer>
    </div>
  );
}
