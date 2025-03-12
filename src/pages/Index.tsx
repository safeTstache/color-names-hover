
import { useEffect, useState } from "react";
import { findClosestColor } from "../utils/colorNames";
import ColorTooltip from "../components/ColorTooltip";
import { useToast } from "@/components/ui/use-toast";

const Index = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [colors, setColors] = useState<[string, string]>(["", ""]);
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const handleKeyDown = async (e: KeyboardEvent) => {
      // Check for fn+control+shift+c (on macOS)
      // Note: 'e.metaKey' would represent the Command key, but we're using Control instead
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'c') {
        try {
          setIsTooltipVisible(true);
          const color = await getColorAtPoint(mousePos.x, mousePos.y);
          setColors(color);
        } catch (error) {
          toast({
            title: "Error",
            description: "Could not get the color at pointer position",
            variant: "destructive",
          });
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      // Hide tooltip when any of the modifier keys are released
      if (e.key === 'Control' || e.key === 'Shift') {
        setIsTooltipVisible(false);
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [mousePos]);

  const getColorAtPoint = async (x: number, y: number): Promise<[string, string]> => {
    // For this demo version, we'll return a random color
    // In a real implementation, you'd need to implement actual screen color picking
    const r = Math.floor(Math.random() * 255);
    const g = Math.floor(Math.random() * 255);
    const b = Math.floor(Math.random() * 255);
    return findClosestColor(r, g, b);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-bold text-gray-900">Color Picker</h1>
        <p className="text-lg text-gray-600">
          Press <kbd className="px-2 py-1 bg-gray-100 rounded-md">Control + Shift + C</kbd> to identify the color under your cursor
        </p>
        <p className="text-sm text-gray-500">(For macOS)</p>
      </div>
      <ColorTooltip
        x={mousePos.x}
        y={mousePos.y}
        basicColor={colors[0]}
        detailedColor={colors[1]}
        visible={isTooltipVisible}
      />
    </div>
  );
};

export default Index;
