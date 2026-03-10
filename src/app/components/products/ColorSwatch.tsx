import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";

interface ColorSwatchProps {
  color?: string;
  colorHex?: string;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

export function ColorSwatch({ color, colorHex, size = "md", showLabel = false }: ColorSwatchProps) {
  if (!colorHex && !color) return null;

  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-10 h-10",
  };

  const element = (
    <div
      className={`${sizeClasses[size]} rounded-full border-2 border-gray-300 shadow-sm cursor-pointer hover:scale-110 transition-transform`}
      style={{ backgroundColor: colorHex || "#CCCCCC" }}
      title={color}
    />
  );

  if (showLabel && color) {
    return (
      <div className="flex items-center gap-2">
        {element}
        <span className="text-sm">{color}</span>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          {element}
        </TooltipTrigger>
        <TooltipContent>
          <p>{color || colorHex}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
