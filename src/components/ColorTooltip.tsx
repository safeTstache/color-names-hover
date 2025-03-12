
import { MousePointer2 } from "lucide-react";

interface ColorTooltipProps {
  x: number;
  y: number;
  basicColor: string;
  detailedColor: string;
  visible: boolean;
}

const ColorTooltip = ({ x, y, basicColor, detailedColor, visible }: ColorTooltipProps) => {
  if (!visible) return null;

  return (
    <div
      className="fixed z-50 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200 p-3 min-w-[200px]"
      style={{
        left: `${x + 20}px`,
        top: `${y + 20}px`,
        transform: 'translate(0, -50%)',
      }}
    >
      <div className="flex items-center gap-2 mb-2">
        <MousePointer2 className="w-4 h-4 text-gray-500" />
        <span className="text-sm text-gray-500">Color at pointer</span>
      </div>
      <div className="flex flex-col gap-1">
        <div className="text-lg font-semibold capitalize">{basicColor}</div>
        <div className="text-sm text-gray-600">{detailedColor}</div>
      </div>
    </div>
  );
};

export default ColorTooltip;
