"use client";

import { useTheme } from "next-themes";
import DotPattern from "@/components/ui/dot-pattern";
import Particles from "@/components/ui/particles";
import { cn } from "@/lib/utils";

export const BackgroundPattern = () => {
  const { resolvedTheme } = useTheme();
  const isLightTheme = resolvedTheme === "light";

  return (
    <>
      <DotPattern
        className={cn(
          "mask-[radial-gradient(ellipse,rgba(0,0,0,0.3)_30%,black_50%)]",
          isLightTheme ? "fill-foreground-600/30" : "fill-foreground-300/30"
        )}
        cr={3}
        cx={1}
        cy={1}
        height={20}
        width={24}
      />
      <Particles
        className="absolute inset-0"
        size={2.0}
        color={isLightTheme ? "#2563eb" : "#93c5fd"}
        ease={80}
        quantity={120}
        refresh
      />
    </>
  );
};
