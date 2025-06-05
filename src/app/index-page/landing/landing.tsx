import Icons from "@/components/icons";
import Logos from "@/components/logos";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";

export function LandingComponent() {
  return (
    <div className="w-full h-screen flex flex-col items-center justify-center bg-dscl-blue1">
      <Logos.EnglishScoringLogo className="w-1/2 h-1/2" />
      <Link to="/login">
        <Button>
          Get Started
          <Icons.ChevronLeftIcon className="rotate-180 stroke-dscl-white" />
        </Button>
      </Link>
    </div>
  );
}
