interface SectionHeadingProps {
  title: string;
}

export function SectionHeading({ title }: SectionHeadingProps) {
  return (
    <div className="mb-3 mt-6 flex items-center gap-3">
      <span className="font-mono text-[0.6rem] tracking-[0.2em] uppercase text-sand">
        {title}
      </span>
      <div className="flex-1 divider-gradient" />
    </div>
  );
}
