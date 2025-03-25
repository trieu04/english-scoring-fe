import Icons from "@/components/icons";
import Logos from "@/components/logos";
import { SoundPlayer } from "@/components/media/sound-player";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export function TestPage() {
  return (
    <div>
      <h1>Test Page</h1>
      <h2>Icons and Logos</h2>
      <h3>Icons</h3>
      <div className="flex flex-wrap space-x-1">
        {Object.values(Icons).map((Icon, index) => (
          <div key={index} className="border">
            <Icon />
          </div>
        ))}
      </div>
      <h3>Logos</h3>
      <div className="flex flex-wrap space-x-1">
        {Object.values(Logos).map((Logo, index) => (
          <div key={index}>
            <Logo />
          </div>
        ))}
      </div>
      <h2>Component</h2>
      <h3>Button</h3>
      <div className="flex flex-wrap space-x-1">
        <Button size="lg">Lagre</Button>
        <Button>Default</Button>
        <Button size="sm">Small</Button>
        <Button disabled>Disabled</Button>
      </div>
      <h3>Button with icon</h3>
      <div className="flex flex-wrap space-x-1">
        <Button>
          <Icons.PlusIcon stroke="white" />
          <span>New Scoring</span>
        </Button>
      </div>
      <h3>Radio Group</h3>
      <RadioGroup defaultValue="option-one">
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="option-one" id="option-one" />
          <label htmlFor="option-one">Option One</label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="option-two" id="option-two" />
          <label htmlFor="option-two">Option Two</label>
        </div>
      </RadioGroup>
      <h2>Card</h2>
      <Card>
        <CardHeader>
          <CardTitle>
            <div className="flex items-center space-x-1">
              <Icons.ExamMultipleChoiceIcon />
              <span>Card Title</span>
            </div>
          </CardTitle>
          <CardDescription>Card Description</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Card Content</p>
        </CardContent>
      </Card>
      <h2>Sound Player</h2>
      <SoundPlayer currentTime={100} totalTime={200} />
      <div className="h-32"></div>
    </div>
  );
}
