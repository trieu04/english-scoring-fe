import EnglishScoringLogo from "@/assets/logos/english-scoring-logo.svg?react";
import AI4LIFELogo from "@/assets/logos/ai4life-logo.svg?react";
import AI4LIFELogoCircle from "@/assets/logos/ai4life-logo-circle.svg?react";

const Logos = {
  EnglishScoringLogo,
  AI4LIFELogo,
  AI4LIFELogoCircle,
  HeaderLogo,
};

export { Logos };
export default Logos;

function HeaderLogo() {
  return (
    <div className="flex">
      <Logos.AI4LIFELogoCircle className="h-8 w-auto" />
      <Logos.EnglishScoringLogo className="h-8 w-auto ml-4 mt-1" />
    </div>
  );
}
