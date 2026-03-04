import { Link } from 'react-router';

interface Tab {
  key: string;
  label: string;
  to: string;
}

interface TabBarProps {
  tabs: Tab[];
  activeTab: string;
}

export function TabBar({ tabs, activeTab }: TabBarProps) {
  return (
    <div className="flex border-b border-border">
      {tabs.map((tab) => (
        <Link
          key={tab.key}
          to={tab.to}
          replace
          className={`flex-1 py-2.5 text-center font-mono text-xs tracking-wide font-medium transition ${
            activeTab === tab.key
              ? 'border-b-2 border-fairway text-forest'
              : 'text-text-muted hover:text-text-medium'
          }`}
        >
          {tab.label}
        </Link>
      ))}
    </div>
  );
}
