import * as React from "react";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { cn } from "@/lib/utils";
import Icons from "../icons";

function RadioGroup({ ref, className, ...props }: React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root> & { ref?: React.RefObject<React.ElementRef<typeof RadioGroupPrimitive.Root> | null> }) {
  return (
    <RadioGroupPrimitive.Root
      className={cn("grid gap-2", className)}
      {...props}
      ref={ref}
    />
  );
}
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName;

function RadioGroupItem({ ref, className, ...props }: React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item> & { ref?: React.RefObject<React.ElementRef<typeof RadioGroupPrimitive.Item> | null> }) {
  return (
    <RadioGroupPrimitive.Item
      ref={ref}
      className={cn(
        "aspect-square h-4 w-4 rounded-full border-2 border-dscl-main text-primary ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
        <Icons.CircleIcon className="h-2.5 w-2.5 fill-dscl-main text-current" stroke="0" />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  );
}
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName;

export { RadioGroup, RadioGroupItem };
