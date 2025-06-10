import Logos from "@/components/logos";

export function HeaderComponent() {
  return (
    <header className="flex items-center h-[var(--header-height)] sticky top-0 bg-dscl-blue1 mb-2">
      <div className="mx-3">
        <Logos.EnglishScoringLogo />
      </div>
    </header>
  );
}
