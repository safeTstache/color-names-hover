
import { useEffect, useState } from "react";
import { findClosestColor } from "../utils/colorNames";
import ColorTooltip from "../components/ColorTooltip";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";

declare global {
  interface Window {
    require: any;
  }
}

const Index = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [colors, setColors] = useState<[string, string]>(["", ""]);
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);
  const [isPickerActive, setIsPickerActive] = useState(false);
  const { toast } = useToast();
  const [isElectron, setIsElectron] = useState(false);

  useEffect(() => {
    // Check if running in Electron
    setIsElectron(window.navigator.userAgent.toLowerCase().indexOf(' electron/') > -1);
    
    // Setup Electron IPC listener if we're in Electron
    if (isElectron) {
      const { ipcRenderer } = window.require('electron');
      
      ipcRenderer.on('prepare-color-pick', () => {
        setIsPickerActive(true);
        toast({
          title: "Color Picker Activated",
          description: "Click anywhere on the screen to pick a color",
        });
      });
      
      // Cleanup listener
      return () => {
        ipcRenderer.removeAllListeners('prepare-color-pick');
      };
    }
  }, [isElectron]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    const handleClick = async (e: MouseEvent) => {
      if (isPickerActive) {
        e.preventDefault();
        
        try {
          // In a real application with electron, we would get the actual screen color
          // For this demo, we'll simulate it with a random color
          const r = Math.floor(Math.random() * 255);
          const g = Math.floor(Math.random() * 255);
          const b = Math.floor(Math.random() * 255);
          
          const colorInfo = findClosestColor(r, g, b);
          setColors(colorInfo);
          setIsTooltipVisible(true);
          
          // Hide tooltip after 3 seconds
          setTimeout(() => {
            setIsTooltipVisible(false);
          }, 3000);
          
          // Reset picker state
          setIsPickerActive(false);
          
          // Log color information
          console.log(`Picked color: RGB(${r}, ${g}, ${b}), Name: ${colorInfo[0]}`);
          
          // In Electron mode, hide the app after picking
          if (isElectron) {
            const { ipcRenderer } = window.require('electron');
            setTimeout(() => {
              ipcRenderer.send('minimize-app');
            }, 3000);
          }
          
          // Show toast notification
          toast({
            title: "Color Picked",
            description: `${colorInfo[0]} (${colorInfo[1]})`,
          });
        } catch (error) {
          console.error("Error picking color:", error);
          toast({
            title: "Error",
            description: "Could not get the color at pointer position",
            variant: "destructive",
          });
          setIsPickerActive(false);
        }
      }
    };

    // Add event listeners
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('click', handleClick);

    // Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleClick);
    };
  }, [isPickerActive, isElectron]);

  // Function to activate the color picker manually (for web mode)
  const activateColorPicker = () => {
    setIsPickerActive(true);
    toast({
      title: "Color Picker Activated",
      description: "Click anywhere on the screen to pick a color",
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="text-center space-y-6 p-8 bg-white rounded-lg shadow-md max-w-md">
        <h1 className="text-4xl font-bold text-gray-900">Color Picker</h1>
        
        {isPickerActive && (
          <div className="bg-blue-100 text-blue-800 p-4 rounded-md">
            Click anywhere to pick a color
          </div>
        )}
        
        {isElectron ? (
          <p className="text-lg text-gray-600">
            Press <kbd className="px-2 py-1 bg-gray-100 rounded-md">Control + Shift + C</kbd> to identify the color under your cursor
          </p>
        ) : (
          <Button onClick={activateColorPicker} className="w-full">
            Activate Color Picker
          </Button>
        )}
        
        <p className="text-sm text-gray-500">
          {isElectron 
            ? "Works system-wide! Press the shortcut anywhere on your screen." 
            : "(Only works in this browser window)"}
        </p>
        
        {isTooltipVisible && (
          <div className="mt-4 p-4 border rounded bg-gray-50">
            <div 
              className="w-full h-12 rounded mb-2"
              style={{ backgroundColor: `#${colors[1].replace(/[^0-9A-Fa-f]/g, '')}` }}
            ></div>
            <p className="font-bold">{colors[0]}</p>
            <p className="text-gray-500">{colors[1]}</p>
          </div>
        )}
      </div>
      
      <ColorTooltip
        x={mousePos.x}
        y={mousePos.y}
        basicColor={colors[0]}
        detailedColor={colors[1]}
        visible={isTooltipVisible && isPickerActive}
      />
    </div>
  );
};

export default Index;
