import React, { useState, useEffect } from 'react';
import { Palette, Grid, Plus, Trash, Check, ArrowDownUp, AlertTriangle, Moon, Sun } from 'lucide-react';

// Import IBM Plex Sans Arabic font
const googleFontLink = () => {
  const link = document.createElement('link');
  link.href = 'https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@400;500;600;700&display=swap';
  link.rel = 'stylesheet';
  document.head.appendChild(link);
};

// Initialize the font
if (typeof document !== 'undefined') {
  googleFontLink();
}

const ColorContrastChecker = () => {
  // Project settings
  const [projectName, setProjectName] = useState("My Color Project");
  
  // Initial default colors
  const initialColors = [
    { id: 1, color: "#000000", name: "Black" },
    { id: 2, color: "#FFFFFF", name: "White" },
    { id: 3, color: "#1E40AF", name: "Blue" },
    { id: 4, color: "#B91C1C", name: "Red" }
  ];
  
  // States
  const [colors, setColors] = useState(initialColors);
  const [activeTab, setActiveTab] = useState('palette');
  const [foregroundId, setForegroundId] = useState(1);
  const [backgroundId, setBackgroundId] = useState(2);
  const [contrastRatio, setContrastRatio] = useState(0);
  const [complianceLevel, setComplianceLevel] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [newColorHex, setNewColorHex] = useState('#000000');
  const [newColorName, setNewColorName] = useState('');
  
  // Get foreground and background colors
  const foregroundColor = colors.find(c => c.id === foregroundId)?.color || "#000000";
  const backgroundColor = colors.find(c => c.id === backgroundId)?.color || "#FFFFFF";
  
  // Calculate contrast ratio between two colors
  const calculateContrastRatio = (color1, color2) => {
    // Convert hex to RGB
    const hexToRGB = (hex) => {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return [r, g, b];
    };

    // Calculate luminance
    const getLuminance = (rgb) => {
      const [r, g, b] = rgb.map(v => {
        v /= 255;
        return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
      });
      return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    };

    const rgb1 = hexToRGB(color1);
    const rgb2 = hexToRGB(color2);
    
    const luminance1 = getLuminance(rgb1);
    const luminance2 = getLuminance(rgb2);
    
    const brightest = Math.max(luminance1, luminance2);
    const darkest = Math.min(luminance1, luminance2);
    
    return (brightest + 0.05) / (darkest + 0.05);
  };
  
  // Get WCAG compliance level
  const getComplianceLevel = (ratio) => {
    if (ratio >= 7) return "AAA";
    if (ratio >= 4.5) return "AA";
    if (ratio >= 3) return "AA Large";
    return "Fail";
  };
  
  // Get badge style based on compliance
  const getBadgeClass = (ratio) => {
    if (ratio >= 7) return "text-green-800 bg-green-100";
    if (ratio >= 4.5) return "text-blue-800 bg-blue-100";
    if (ratio >= 3) return "text-yellow-800 bg-yellow-100";
    return "text-red-800 bg-red-100";
  };
  
  // Get status color for the compliance level
  const getComplianceStatusColor = (level) => {
    if (level === "AAA") return "text-green-600";
    if (level === "AA") return "text-blue-600";
    if (level === "AA Large") return "text-yellow-600";
    return "text-red-600";
  };
  
  // Update contrast ratio when colors change
  useEffect(() => {
    const ratio = calculateContrastRatio(foregroundColor, backgroundColor);
    setContrastRatio(ratio);
    setComplianceLevel(getComplianceLevel(ratio));
  }, [foregroundColor, backgroundColor]);
  
  // Add a new color
  const addColor = () => {
    if (colors.length >= 10) return;
    
    if (newColorHex) {
      const newId = Math.max(0, ...colors.map(c => c.id)) + 1;
      setColors([...colors, { 
        id: newId, 
        color: newColorHex, 
        name: newColorName || `Color ${newId}` 
      }]);
      setShowAddForm(false);
      setNewColorHex('#000000');
      setNewColorName('');
    }
  };
  
  // Remove a color
  const removeColor = (id) => {
    if (colors.length <= 2) return;
    
    const newColors = colors.filter(c => c.id !== id);
    setColors(newColors);
    
    // Update selected colors if necessary
    if (foregroundId === id) {
      setForegroundId(newColors[0].id);
    }
    
    if (backgroundId === id) {
      setBackgroundId(newColors[0].id);
    }
  };
  
  // Update color
  const updateColor = (id, newHex, newName) => {
    setColors(
      colors.map(c => 
        c.id === id 
          ? { ...c, color: newHex || c.color, name: newName !== undefined ? newName : c.name } 
          : c
      )
    );
  };
  
  // Swap foreground and background
  const swapColors = () => {
    setForegroundId(backgroundId);
    setBackgroundId(foregroundId);
  };
  
  // More states for matrix controls
  const [showMatrixAddForm, setShowMatrixAddForm] = useState(false);
  const [showMatrixDeleteMenu, setShowMatrixDeleteMenu] = useState(false);
  
  // More states for interaction tracking
  const [isAddingColor, setIsAddingColor] = useState(false);
  
  // Dark mode state
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  // Function to generate SVG for export
  const generateMatrixSVG = () => {
    // Set up SVG dimensions based on number of colors
    const cellSize = 80;
    const headerSize = 30;
    const width = headerSize + (colors.length * cellSize);
    const height = headerSize + (colors.length * cellSize);
    
    let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">`;
    
    // Add background
    svg += `<rect width="${width}" height="${height}" fill="${isDarkMode ? '#1f2937' : '#ffffff'}" />`;
    
    // Add grid lines
    for (let i = 0; i <= colors.length; i++) {
      // Horizontal lines
      svg += `<line x1="${headerSize}" y1="${headerSize + (i * cellSize)}" x2="${width}" y2="${headerSize + (i * cellSize)}" stroke="${isDarkMode ? '#4b5563' : '#e5e7eb'}" stroke-width="1" />`;
      // Vertical lines
      svg += `<line x1="${headerSize + (i * cellSize)}" y1="${headerSize}" x2="${headerSize + (i * cellSize)}" y2="${height}" stroke="${isDarkMode ? '#4b5563' : '#e5e7eb'}" stroke-width="1" />`;
    }
    
    // Add header cells with color squares
    colors.forEach((color, colIndex) => {
      // Column headers
      svg += `<rect x="${headerSize + (colIndex * cellSize) + 10}" y="${5}" width="${20}" height="${20}" fill="${color.color}" rx="2" />`;
      svg += `<text x="${headerSize + (colIndex * cellSize) + cellSize/2}" y="${headerSize - 5}" text-anchor="middle" font-family="IBM Plex Sans Arabic, sans-serif" font-size="12" fill="${isDarkMode ? '#d1d5db' : '#4b5563'}">${color.name}</text>`;
      
      // Row headers  
      svg += `<rect x="${5}" y="${headerSize + (colIndex * cellSize) + 10}" width="${20}" height="${20}" fill="${color.color}" rx="2" />`;
      svg += `<text x="${headerSize - 5}" y="${headerSize + (colIndex * cellSize) + cellSize/2}" text-anchor="end" alignment-baseline="middle" font-family="IBM Plex Sans Arabic, sans-serif" font-size="12" fill="${isDarkMode ? '#d1d5db' : '#4b5563'}">${color.name}</text>`;
    });
    
    // Add matrix cells
    colors.forEach((rowColor, rowIndex) => {
      colors.forEach((colColor, colIndex) => {
        const x = headerSize + (colIndex * cellSize);
        const y = headerSize + (rowIndex * cellSize);
        
        // If it's the same color (diagonal), add a diagonal line
        if (rowColor.id === colColor.id) {
          svg += `<rect x="${x}" y="${y}" width="${cellSize}" height="${cellSize}" fill="${isDarkMode ? '#374151' : '#f3f4f6'}" />`;
          svg += `<line x1="${x}" y1="${y}" x2="${x + cellSize}" y2="${y + cellSize}" stroke="${isDarkMode ? '#6b7280' : '#d1d5db'}" stroke-width="1" />`;
        } else {
          // Calculate contrast ratio
          const ratio = calculateContrastRatio(rowColor.color, colColor.color);
          const level = getComplianceLevel(ratio);
          
          // Determine badge colors based on compliance level
          let badgeFill;
          if (ratio >= 7) badgeFill = "#d1fae5"; // green
          else if (ratio >= 4.5) badgeFill = "#dbeafe"; // blue
          else if (ratio >= 3) badgeFill = "#fef3c7"; // yellow
          else badgeFill = "#fee2e2"; // red
          
          // Add background (BG color)
          svg += `<rect x="${x}" y="${y}" width="${cellSize}" height="${cellSize}" fill="${colColor.color}" />`;
          
          // Add foreground square (FG color)
          svg += `<rect x="${x + (cellSize/2) - 15}" y="${y + (cellSize/2) - 15}" width="30" height="30" fill="${rowColor.color}" />`;
          
          // Add ratio badge
          svg += `<rect x="${x + cellSize - 25}" y="${y + 5}" width="20" height="15" fill="${badgeFill}" rx="2" />`;
          svg += `<text x="${x + cellSize - 15}" y="${y + 15}" text-anchor="middle" font-family="IBM Plex Sans Arabic, sans-serif" font-size="10" fill="#000000">${ratio.toFixed(1)}</text>`;
          
          // Add compliance level badge
          svg += `<rect x="${x + 5}" y="${y + cellSize - 20}" width="30" height="15" fill="${badgeFill}" rx="2" />`;
          svg += `<text x="${x + 20}" y="${y + cellSize - 10}" text-anchor="middle" font-family="IBM Plex Sans Arabic, sans-serif" font-size="10" fill="#000000">${level}</text>`;
        }
      });
    });
    
    svg += '</svg>';
    return svg;
  };
  
  // Function to copy SVG to clipboard
  const copyMatrixAsSVG = () => {
    const svg = generateMatrixSVG();
    
    // Using the clipboard API if available
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(svg)
        .then(() => {
          alert('SVG copied to clipboard! You can now paste it into Adobe Illustrator.');
        })
        .catch(() => {
          alert('Failed to copy SVG. Your browser may not support this feature.');
        });
    } else {
      // Fallback for browsers without clipboard API
      const textArea = document.createElement('textarea');
      textArea.value = svg;
      document.body.appendChild(textArea);
      textArea.select();
      
      try {
        document.execCommand('copy');
        alert('SVG copied to clipboard! You can now paste it into Adobe Illustrator.');
      } catch (err) {
        alert('Failed to copy SVG. Your browser may not support this feature.');
      }
      
      document.body.removeChild(textArea);
    }
  };
  
  // Function to export matrix data as CSV
  const exportMatrixData = () => {
    let csv = 'Color Name,Color Value,';
    
    // Add column headers
    colors.forEach(color => {
      csv += `${color.name} (${color.color}),`;
    });
    csv += '\n';
    
    // Add rows
    colors.forEach(rowColor => {
      csv += `${rowColor.name},${rowColor.color},`;
      
      // Add contrast ratios
      colors.forEach(colColor => {
        const ratio = calculateContrastRatio(rowColor.color, colColor.color);
        const level = getComplianceLevel(ratio);
        csv += `${ratio.toFixed(2)}:1 (${level}),`;
      });
      
      csv += '\n';
    });
    
    // Create a download link
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${projectName.replace(/\s+/g, '-')}-contrast-matrix.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  return (
    <div className={`min-h-screen p-4 transition-colors duration-200 ${
      isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
    }`} style={{ fontFamily: "'IBM Plex Sans Arabic', sans-serif" }}>
      {/* Header and Project Name */}
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
          <div>
            <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>
              Color Contrast Checker
            </h1>
            <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Check color combinations for WCAG accessibility compliance
            </p>
          </div>
          <div className="flex items-center gap-3 mt-2 sm:mt-0">
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`p-2 rounded-full transition-colors ${
                isDarkMode 
                  ? 'bg-gray-800 text-yellow-500 hover:bg-gray-700' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <input
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              className={`px-3 py-1 border rounded-md text-sm font-medium transition-colors ${
                isDarkMode 
                  ? 'bg-gray-800 border-gray-700 text-gray-200 placeholder-gray-500' 
                  : 'bg-white border-gray-300 text-gray-800'
              }`}
              placeholder="Project Name"
            />
          </div>
        </div>
        
        {/* Tab Navigation */}
        <div className={`flex mb-6 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <button 
            onClick={() => setActiveTab('palette')}
            className={`py-2 px-4 flex items-center transition-colors ${
              activeTab === 'palette' 
                ? 'border-b-2 border-blue-500 text-blue-600' 
                : isDarkMode 
                  ? 'text-gray-400 hover:text-gray-200' 
                  : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Palette size={18} className="mr-2" />
            Color Palette
          </button>
          <button 
            onClick={() => setActiveTab('matrix')}
            className={`py-2 px-4 flex items-center transition-colors ${
              activeTab === 'matrix' 
                ? 'border-b-2 border-blue-500 text-blue-600' 
                : isDarkMode 
                  ? 'text-gray-400 hover:text-gray-200' 
                  : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Grid size={18} className="mr-2" />
            Contrast Matrix
          </button>
        </div>
        
        {/* Palette View */}
        {activeTab === 'palette' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Color Palette Section */}
            <div className="md:col-span-2">
              <div className={`rounded-lg shadow p-6 transition-colors ${
                isDarkMode ? 'bg-gray-800' : 'bg-white'
              }`}>
                <div className="flex justify-between items-center mb-4">
                  <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>
                    Color Palette
                  </h2>
                  {colors.length < 10 && (
                    <button
                      onClick={() => setShowAddForm(!showAddForm)}
                      className={`px-3 py-1 rounded-md flex items-center transition-colors ${
                        isDarkMode 
                          ? 'bg-blue-900 text-blue-100 hover:bg-blue-800' 
                          : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                      }`}
                    >
                      <Plus size={16} className="mr-1" /> Add Color
                    </button>
                  )}
                </div>
                
                {showAddForm && (
                  <div className={`mb-4 p-3 border rounded-md transition-colors ${
                    isDarkMode 
                      ? 'border-gray-700 bg-gray-900' 
                      : 'border-gray-200 bg-white'
                  }`}>
                    <div className="flex gap-2 mb-2">
                      <input
                        type="color"
                        value={newColorHex}
                        onChange={(e) => setNewColorHex(e.target.value)}
                        className="h-10 w-10 border-0 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={newColorHex}
                        onChange={(e) => setNewColorHex(e.target.value)}
                        className={`flex-1 px-2 py-1 border rounded transition-colors ${
                          isDarkMode 
                            ? 'bg-gray-800 border-gray-700 text-gray-200 placeholder-gray-500' 
                            : 'bg-white border-gray-300 text-gray-800'
                        }`}
                        placeholder="Hex color code"
                      />
                    </div>
                    <input
                      type="text"
                      value={newColorName}
                      onChange={(e) => setNewColorName(e.target.value)}
                      className={`w-full px-2 py-1 border rounded mb-2 transition-colors ${
                        isDarkMode 
                          ? 'bg-gray-800 border-gray-700 text-gray-200 placeholder-gray-500' 
                          : 'bg-white border-gray-300 text-gray-800'
                      }`}
                      placeholder="Color name (optional)"
                    />
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => setShowAddForm(false)}
                        className={`px-3 py-1 rounded-md transition-colors ${
                          isDarkMode 
                            ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        Cancel
                      </button>
                      <button 
                        onClick={addColor}
                        className={`px-3 py-1 rounded-md transition-colors ${
                          isDarkMode 
                            ? 'bg-green-900 text-green-100 hover:bg-green-800' 
                            : 'bg-green-100 text-green-700 hover:bg-green-200'
                        }`}
                      >
                        Add
                      </button>
                    </div>
                  </div>
                )}
                
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {colors.map(color => (
                    <div 
                      key={color.id} 
                      className={`border rounded-md overflow-hidden ${
                        foregroundId === color.id || backgroundId === color.id 
                          ? 'ring-2 ring-blue-500' 
                          : ''
                      } ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}
                    >
                      <div 
                        className="h-16 relative"
                        style={{ backgroundColor: color.color }} 
                        onClick={() => {
                          if (foregroundId === color.id) {
                            // Already selected as foreground, do nothing
                          } else if (backgroundId === color.id) {
                            // Swap if already selected as background
                            swapColors();
                          } else {
                            // Select as new foreground
                            setForegroundId(color.id);
                          }
                        }}
                      >
                        {foregroundId === color.id && (
                          <div className="absolute top-1 left-1 bg-white text-xs px-2 py-1 rounded font-bold">
                            FG
                          </div>
                        )}
                        {backgroundId === color.id && (
                          <div className="absolute top-1 right-1 bg-white text-xs px-2 py-1 rounded font-bold">
                            BG
                          </div>
                        )}
                      </div>
                      <div className={`p-2 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                        <div className="flex items-center justify-between mb-1">
                          <input
                            type="color"
                            value={color.color}
                            onChange={(e) => updateColor(color.id, e.target.value)}
                            className="h-6 w-6 border-0 cursor-pointer"
                          />
                          <input
                            type="text"
                            value={color.color}
                            onChange={(e) => updateColor(color.id, e.target.value)}
                            className={`w-20 text-xs px-1 py-1 border rounded transition-colors ${
                              isDarkMode 
                                ? 'bg-gray-700 border-gray-600 text-gray-200' 
                                : 'bg-white border-gray-300 text-gray-800'
                            }`}
                          />
                          {colors.length > 2 && (
                            <button 
                              onClick={() => removeColor(color.id)}
                              className="text-red-600 hover:text-red-800"
                              title="Remove color"
                            >
                              <Trash size={14} />
                            </button>
                          )}
                        </div>
                                                  <input
                          type="text"
                          value={color.name}
                          onChange={(e) => updateColor(color.id, null, e.target.value)}
                          className={`w-full mt-1 text-xs px-1 py-1 border rounded transition-colors ${
                            isDarkMode 
                              ? 'bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-500' 
                              : 'bg-white border-gray-300 text-gray-800'
                          }`}
                          placeholder="Color name"
                        />
                      </div>
                    </div>
                  ))}
                  
                  {/* Add Color Button */}
                  {colors.length < 10 && !showAddForm && (
                    <div 
                      className="border-2 border-dashed border-gray-300 rounded-md overflow-hidden hover:border-gray-400 transition-colors cursor-pointer"
                      onClick={() => setShowAddForm(true)}
                    >
                      <div className="h-16 flex items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors">
                        <Plus size={24} className="text-gray-400" />
                      </div>
                      <div className="p-2 bg-white flex items-center justify-center">
                        <span className="text-sm text-gray-500 font-medium">Add Color</span>
                      </div>
                    </div>
                  )}
                  
                  {/* Add Color Form */}
                  {showAddForm && (
                    <div className="border rounded-md overflow-hidden">
                      <div className="h-16 flex items-center justify-center p-2" style={{ backgroundColor: newColorHex }}>
                        <input
                          type="color"
                          value={newColorHex}
                          onChange={(e) => setNewColorHex(e.target.value)}
                          className="h-8 w-8 border-0 cursor-pointer rounded"
                        />
                      </div>
                      <div className="p-2 bg-white">
                        <input
                          type="text"
                          value={newColorHex}
                          onChange={(e) => setNewColorHex(e.target.value)}
                          className="w-full text-xs px-1 py-1 border rounded mb-1"
                          placeholder="Hex color code"
                        />
                        <input
                          type="text"
                          value={newColorName}
                          onChange={(e) => setNewColorName(e.target.value)}
                          className="w-full text-xs px-1 py-1 border rounded mb-1"
                          placeholder="Color name"
                        />
                        <div className="flex justify-between gap-1">
                          <button 
                            onClick={() => {
                              setShowAddForm(false);
                              setNewColorHex('#000000');
                              setNewColorName('');
                            }}
                            className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs flex items-center"
                          >
                            <Trash size={14} className="mr-1" /> Cancel
                          </button>
                          <button 
                            onClick={() => {
                              addColor();
                              setShowAddForm(false);
                            }}
                            className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs flex items-center"
                          >
                            <Check size={14} className="mr-1" /> Add
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="flex justify-center mt-4">
                  <button
                    onClick={swapColors}
                    className={`px-3 py-2 rounded-md flex items-center transition-colors ${
                      isDarkMode 
                        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <ArrowDownUp size={16} className="mr-2" /> Swap FG/BG
                  </button>
                </div>
                
                {/* Preview Section */}
                <div className={`mt-6 border-t pt-4 ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                  <h3 className={`text-lg font-semibold mb-3 ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>
                    Preview
                  </h3>
                  <div 
                    className="p-6 rounded-lg border"
                    style={{ backgroundColor: backgroundColor, color: foregroundColor }}
                  >
                    <p className="text-xl font-medium mb-2">Sample Text</p>
                    <p>This is how your text will look with the selected colors.</p>
                    <p className="mt-2 text-sm">The quick brown fox jumps over the lazy dog.</p>
                    
                    <div className="mt-4 grid grid-cols-2 gap-4">
                      <button 
                        className="py-2 px-4 rounded-md border"
                        style={{ borderColor: foregroundColor }}
                      >
                        Button Example
                      </button>
                      <div 
                        className="py-2 px-4 rounded-md text-center" 
                        style={{ backgroundColor: foregroundColor, color: backgroundColor }}
                      >
                        Inverted Colors
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Results Section */}
            <div className="md:col-span-1">
              <div className={`rounded-lg shadow p-6 h-full transition-colors ${
                isDarkMode ? 'bg-gray-800' : 'bg-white'
              }`}>
                <h2 className={`text-xl font-semibold mb-6 ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>
                  Contrast Results
                </h2>
                
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>Contrast Ratio</span>
                      <span className={`font-semibold text-xl ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>
                        {contrastRatio.toFixed(2)}:1
                      </span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500"
                        style={{ width: `${Math.min(100, (contrastRatio / 21) * 100)}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>WCAG Compliance</span>
                      <span className={`font-semibold ${getComplianceStatusColor(complianceLevel)}`}>
                        {complianceLevel === "Fail" ? (
                          <span className="flex items-center">
                            <AlertTriangle size={16} className="mr-1" />
                            {complianceLevel}
                          </span>
                        ) : (
                          <span className="flex items-center">
                            <Check size={16} className="mr-1" />
                            {complianceLevel}
                          </span>
                        )}
                      </span>
                    </div>
                    
                    <div className={`rounded-lg p-4 text-sm space-y-2 transition-colors ${
                      isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
                    }`}>
                      <div className={`flex justify-between ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                        <span>AAA (7:1+)</span>
                        <span>{contrastRatio >= 7 ? "✓" : "✗"}</span>
                      </div>
                      <div className={`flex justify-between ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                        <span>AA (4.5:1+)</span>
                        <span>{contrastRatio >= 4.5 ? "✓" : "✗"}</span>
                      </div>
                      <div className={`flex justify-between ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                        <span>AA Large (3:1+)</span>
                        <span>{contrastRatio >= 3 ? "✓" : "✗"}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className={`pt-4 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <h3 className={`font-medium mb-2 ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>
                      Accessibility Info
                    </h3>
                    {complianceLevel === "AAA" ? (
                      <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        Excellent! This contrast ratio meets the highest WCAG 2.1 level (AAA) and is accessible for all users.
                      </p>
                    ) : complianceLevel === "AA" ? (
                      <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        Good! This contrast ratio meets WCAG 2.1 level AA requirements for all text.
                      </p>
                    ) : complianceLevel === "AA Large" ? (
                      <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        This contrast is sufficient only for large text (18pt+) or bold text (14pt+) to meet WCAG 2.1 level AA.
                      </p>
                    ) : (
                      <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        This contrast ratio fails WCAG guidelines. Please adjust your colors for better accessibility.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Matrix View */}
        {activeTab === 'matrix' && (
          <div className={`rounded-lg shadow p-6 transition-colors ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="flex justify-between items-center mb-4">
              <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>
                Contrast Matrix
              </h2>
              <div className="flex space-x-2 items-center">
                {/* Export Buttons */}
                <div className="flex space-x-2 mr-4">
                  <button
                    onClick={copyMatrixAsSVG}
                    className={`px-4 py-2 rounded-md flex items-center transition-colors ${
                      isDarkMode 
                        ? 'bg-indigo-900 text-indigo-100 hover:bg-indigo-800' 
                        : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'
                    }`}
                    title="Copy matrix as SVG that can be pasted directly into Adobe Illustrator"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                      <path d="M12 17.5L12 21" />
                      <path d="M8.4 14.3L5.3 17.4" />
                      <path d="M4.2 11L1 11" />
                      <path d="M5.3 4.6L8.4 7.7" />
                      <path d="M12 2.5L12 6" />
                      <path d="M15.6 7.7L18.7 4.6" />
                      <path d="M20 11L23 11" />
                      <path d="M18.7 17.4L15.6 14.3" />
                      <circle cx="12" cy="11" r="3" />
                    </svg>
                    Copy SVG
                  </button>
                  <button
                    onClick={exportMatrixData}
                    className={`px-4 py-2 rounded-md flex items-center transition-colors ${
                      isDarkMode 
                        ? 'bg-purple-900 text-purple-100 hover:bg-purple-800' 
                        : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                    }`}
                    title="Export matrix data as CSV file"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="7 10 12 15 17 10" />
                      <line x1="12" y1="15" x2="12" y2="3" />
                    </svg>
                    Export
                  </button>
                </div>
                
                {/* Add Color Button */}
                {colors.length < 10 && (
                  <div 
                    className="relative"
                    onMouseLeave={() => {
                      if (showMatrixAddForm && !isAddingColor) {
                        setShowMatrixAddForm(false);
                        setNewColorHex('#000000');
                        setNewColorName('');
                      }
                    }}
                  >
                    <button
                      onClick={() => setShowMatrixAddForm(!showMatrixAddForm)}
                      className="px-4 py-2 bg-green-100 text-green-700 rounded-md flex items-center hover:bg-green-200 transition"
                    >
                      <Plus size={16} className="mr-1" /> Add Color
                    </button>
                    
                    {/* Add Color Form */}
                    {showMatrixAddForm && (
                      <div className="absolute right-0 top-10 bg-white shadow-lg rounded-md border border-gray-200 z-30 w-64 p-4">
                        <h3 className="text-sm font-semibold mb-3">Add New Color</h3>
                        <div className="flex flex-col gap-3">
                          <div className="flex gap-2">
                            <input
                              type="color"
                              value={newColorHex}
                              onChange={(e) => setNewColorHex(e.target.value)}
                              onClick={() => setIsAddingColor(true)}
                              onBlur={() => setIsAddingColor(false)}
                              className="h-10 w-10 border-0 cursor-pointer rounded"
                              title="Choose color"
                            />
                            <input
                              type="text"
                              value={newColorHex}
                              onChange={(e) => setNewColorHex(e.target.value)}
                              className="flex-1 px-2 py-1 border rounded"
                              placeholder="Hex color code"
                            />
                          </div>
                          <input
                            type="text"
                            value={newColorName}
                            onChange={(e) => setNewColorName(e.target.value)}
                            className="w-full px-2 py-1 border rounded"
                            placeholder="Color name (optional)"
                          />
                          <div className="flex justify-end gap-2 mt-2">
                            <button 
                              onClick={() => {
                                setShowMatrixAddForm(false);
                                setNewColorHex('#000000');
                                setNewColorName('');
                              }}
                              className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                            >
                              Cancel
                            </button>
                            <button 
                              onClick={() => {
                                addColor();
                                setShowMatrixAddForm(false);
                              }}
                              className="px-3 py-1 bg-green-100 text-green-700 rounded-md hover:bg-green-200"
                            >
                              Add
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
                
                {/* Delete Color Button with Dropdown */}
                <div 
                  className="relative"
                  onMouseLeave={() => setShowMatrixDeleteMenu(false)}
                >
                  <button
                    onClick={() => setShowMatrixDeleteMenu(!showMatrixDeleteMenu)}
                    className="px-4 py-2 bg-red-100 text-red-700 rounded-md flex items-center hover:bg-red-200 transition"
                  >
                    <Trash size={16} className="mr-1" /> Remove Color
                  </button>
                  
                  {showMatrixDeleteMenu && (
                    <div className="absolute right-0 top-10 bg-white shadow-lg rounded-md border border-gray-200 z-30 w-48">
                      <div className="p-2 bg-gray-50 text-xs font-semibold border-b">
                        Select color to remove
                      </div>
                      <div className="max-h-64 overflow-auto">
                        {colors.map(color => (
                          <div 
                            key={color.id}
                            className="flex items-center p-2 hover:bg-gray-50 cursor-pointer border-b"
                            onClick={() => {
                              removeColor(color.id);
                              setShowMatrixDeleteMenu(false);
                            }}
                          >
                            <div 
                              className="w-6 h-6 mr-2 rounded" 
                              style={{ backgroundColor: color.color }}
                            ></div>
                            <div className="text-sm">{color.name}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mb-4`}>
              <p>This matrix shows all possible combinations with background colors (outer squares) and foreground colors (inner squares).</p>
              <div className={`mt-2 p-3 border rounded-md transition-colors ${
                isDarkMode ? 'bg-blue-900 border-blue-800' : 'bg-blue-50 border-blue-200'
              }`}>
                <h3 className={`font-medium mb-1 ${isDarkMode ? 'text-blue-200' : 'text-gray-800'}`}>
                  WCAG Contrast Requirements:
                </h3>
                <ul className={`list-disc pl-5 text-xs space-y-1 ${isDarkMode ? 'text-blue-300' : 'text-gray-600'}`}>
                  <li><span className="font-semibold">AAA (7:1+)</span>: Highest level compliance for all text</li>
                  <li><span className="font-semibold">AA (4.5:1+)</span>: Standard compliance for normal text</li>
                  <li><span className="font-semibold">AA Large (3:1+)</span>: Compliance for large text (18pt+ or 14pt+ bold)</li>
                  <li><span className="font-semibold">Fail</span>: Does not meet accessibility standards</li>
                </ul>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr>
                    <th className={`p-2 border ${isDarkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-200 bg-gray-50'}`}>
                      <div className={`font-normal text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        BG → / FG ↓
                      </div>
                    </th>
                    {colors.map(color => (
                      <th key={color.id} className={`p-2 border ${isDarkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-200 bg-gray-50'}`}>
                        <div className="flex flex-col items-center">
                          <div 
                            className="w-10 h-10 rounded mb-1" 
                            style={{ backgroundColor: color.color }}
                          ></div>
                          <span className={`text-xs ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                            {color.name}
                          </span>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {colors.map(rowColor => (
                    <tr key={rowColor.id}>
                      <th className={`p-2 border ${isDarkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-200 bg-gray-50'}`}>
                        <div className="flex flex-col items-center">
                          <div 
                            className="w-10 h-10 rounded mb-1" 
                            style={{ backgroundColor: rowColor.color }}
                          ></div>
                          <span className={`text-xs ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                            {rowColor.name}
                          </span>
                        </div>
                      </th>
                      {colors.map(colColor => {
                        const ratio = calculateContrastRatio(rowColor.color, colColor.color);
                        const level = getComplianceLevel(ratio);
                        const badgeClass = getBadgeClass(ratio);
                        
                        return (
                          <td key={colColor.id} className={`p-1 border ${isDarkMode ? 'border-gray-600' : 'border-gray-200'}`}>
                            {rowColor.id === colColor.id ? (
                              // Same color cell (diagonal)
                              <div className={`w-16 h-16 flex items-center justify-center relative overflow-hidden ${
                                isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
                              }`}>
                                <div className="absolute top-0 left-0 w-full h-full rotate-45">
                                  <div className={`h-full w-0.5 ml-auto mr-auto ${isDarkMode ? 'bg-gray-400' : 'bg-gray-300'}`}></div>
                                </div>
                              </div>
                            ) : (
                              // Color combination cell
                              <div className="relative">
                                <div 
                                  className="w-16 h-16 flex items-center justify-center cursor-pointer"
                                  style={{ backgroundColor: colColor.color }}
                                  onClick={() => {
                                    setForegroundId(rowColor.id);
                                    setBackgroundId(colColor.id);
                                    setActiveTab('palette');
                                  }}
                                >
                                  <div 
                                    className="w-8 h-8"
                                    style={{ backgroundColor: rowColor.color }}
                                  ></div>
                                </div>
                                <div className={`absolute top-0 right-0 text-xs px-1 rounded ${badgeClass}`}>
                                  {ratio.toFixed(1)}
                                </div>
                                <div className={`absolute bottom-0 left-0 text-xs px-1 rounded ${badgeClass}`}>
                                  {level}
                                </div>
                              </div>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className={`mt-4 p-4 rounded-lg transition-colors ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <h3 className={`font-medium mb-2 text-sm ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                WCAG Compliance Legend
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded bg-green-100 mr-1"></div>
                  <span className={isDarkMode ? 'text-gray-200' : 'text-gray-700'}>AAA (7:1+)</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded bg-blue-100 mr-1"></div>
                  <span className={isDarkMode ? 'text-gray-200' : 'text-gray-700'}>AA (4.5:1+)</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded bg-yellow-100 mr-1"></div>
                  <span className={isDarkMode ? 'text-gray-200' : 'text-gray-700'}>AA Large (3:1+)</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded bg-red-100 mr-1"></div>
                  <span className={isDarkMode ? 'text-gray-200' : 'text-gray-700'}>Fail (&lt;3:1)</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ColorContrastChecker;