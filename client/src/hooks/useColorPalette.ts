import { useState, useEffect } from 'react';

export interface Color {
  id: number;
  color: string;
  name: string;
}

export const useColorPalette = (initialColors: Color[] = []) => {
  const [colors, setColors] = useState<Color[]>(initialColors.length > 0 ? initialColors : [
    { id: 1, color: "#000000", name: "Black" },
    { id: 2, color: "#FFFFFF", name: "White" },
    { id: 3, color: "#1E40AF", name: "Blue" },
    { id: 4, color: "#B91C1C", name: "Red" }
  ]);

  // Add a new color to the palette
  const addColor = (color: string, name: string) => {
    if (colors.length >= 10) return false; // Maximum 10 colors

    const newId = Math.max(0, ...colors.map(c => c.id)) + 1;
    setColors([...colors, {
      id: newId,
      color,
      name: name || `Color ${newId}`
    }]);
    return true;
  };

  // Remove a color from the palette
  const removeColor = (id: number) => {
    if (colors.length <= 2) return false; // Minimum 2 colors
    setColors(colors.filter(c => c.id !== id));
    return true;
  };

  // Update an existing color
  const updateColor = (id: number, color?: string, name?: string) => {
    setColors(
      colors.map(c => 
        c.id === id 
          ? { 
              ...c, 
              color: color || c.color, 
              name: name !== undefined ? name : c.name 
            } 
          : c
      )
    );
  };

  // Get a color by ID
  const getColorById = (id: number) => {
    return colors.find(c => c.id === id);
  };

  return {
    colors,
    addColor,
    removeColor,
    updateColor,
    getColorById
  };
};
