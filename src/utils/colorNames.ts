
// Basic color mapping
export const basicColors: { [key: string]: [number, number, number][] } = {
  red: [[255, 0, 0], [220, 20, 60], [178, 34, 34]],
  blue: [[0, 0, 255], [0, 0, 139], [135, 206, 235]],
  green: [[0, 255, 0], [34, 139, 34], [50, 205, 50]],
  yellow: [[255, 255, 0], [255, 215, 0], [240, 230, 140]],
  purple: [[128, 0, 128], [147, 112, 219], [186, 85, 211]],
  orange: [[255, 165, 0], [255, 140, 0], [255, 69, 0]],
  brown: [[165, 42, 42], [139, 69, 19], [160, 82, 45]],
  pink: [[255, 192, 203], [255, 20, 147], [219, 112, 147]],
  gray: [[128, 128, 128], [169, 169, 169], [192, 192, 192]],
  white: [[255, 255, 255], [245, 245, 245], [240, 240, 240]],
  black: [[0, 0, 0], [25, 25, 25], [45, 45, 45]]
};

// Detailed color names mapping
export const detailedColors: { [key: string]: [number, number, number] } = {
  "Crimson": [220, 20, 60],
  "Ruby Red": [155, 17, 30],
  "Navy Blue": [0, 0, 128],
  "Periwinkle": [204, 204, 255],
  "Forest Green": [34, 139, 34],
  "Sage": [176, 208, 176],
  "Golden Yellow": [255, 223, 0],
  "Royal Purple": [120, 81, 169],
  "Burnt Orange": [204, 85, 0],
  "Chocolate Brown": [123, 63, 0],
  "Hot Pink": [255, 105, 180],
  "Charcoal Gray": [54, 69, 79],
  "Ivory": [255, 255, 240],
  "Jet Black": [52, 52, 52]
};

export const findClosestColor = (r: number, g: number, b: number): [string, string] => {
  let closestBasic = '';
  let minBasicDistance = Infinity;
  
  // Find closest basic color
  for (const [colorName, values] of Object.entries(basicColors)) {
    for (const [r2, g2, b2] of values) {
      const distance = Math.sqrt(
        Math.pow(r - r2, 2) + 
        Math.pow(g - g2, 2) + 
        Math.pow(b - b2, 2)
      );
      if (distance < minBasicDistance) {
        minBasicDistance = distance;
        closestBasic = colorName;
      }
    }
  }

  // Find closest detailed color
  let closestDetailed = '';
  let minDetailedDistance = Infinity;
  
  for (const [colorName, [r2, g2, b2]] of Object.entries(detailedColors)) {
    const distance = Math.sqrt(
      Math.pow(r - r2, 2) + 
      Math.pow(g - g2, 2) + 
      Math.pow(b - b2, 2)
    );
    if (distance < minDetailedDistance) {
      minDetailedDistance = distance;
      closestDetailed = colorName;
    }
  }

  return [closestBasic, closestDetailed];
};
