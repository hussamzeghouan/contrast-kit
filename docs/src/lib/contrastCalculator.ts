// Convert hex to RGB
export const hexToRGB = (hex: string): [number, number, number] => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return [r, g, b];
};

// Calculate luminance for RGB values
export const getLuminance = (rgb: [number, number, number]): number => {
  const [r, g, b] = rgb.map(v => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

// Calculate contrast ratio between two colors
export const calculateContrastRatio = (color1: string, color2: string): number => {
  const rgb1 = hexToRGB(color1);
  const rgb2 = hexToRGB(color2);
  
  const luminance1 = getLuminance(rgb1);
  const luminance2 = getLuminance(rgb2);
  
  const brightest = Math.max(luminance1, luminance2);
  const darkest = Math.min(luminance1, luminance2);
  
  return (brightest + 0.05) / (darkest + 0.05);
};

// Get WCAG compliance level based on contrast ratio
export const getComplianceLevel = (ratio: number): 'AAA' | 'AA' | 'AA Large' | 'Fail' => {
  if (ratio >= 7) return "AAA";
  if (ratio >= 4.5) return "AA";
  if (ratio >= 3) return "AA Large";
  return "Fail";
};

// Get badge class for styling based on compliance level
export const getBadgeClass = (level: string): string => {
  switch (level) {
    case 'AAA':
      return "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400";
    case 'AA':
      return "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400";
    case 'AA Large':
      return "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400";
    default:
      return "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400";
  }
};

// Generate an SVG for exporting the contrast matrix
export const generateMatrixSVG = (
  colors: { id: number; color: string; name: string }[],
  projectName: string,
  isDarkMode: boolean
): string => {
  // Set up SVG dimensions based on number of colors
  const cellSize = 100;  // Cell size for main matrix
  const headerSize = 90; // Header size with additional space
  const margin = 30;    // Margin around the entire SVG
  const topMargin = 50; // Extra top margin to avoid title overlap
  const width = margin * 2 + headerSize + (colors.length * cellSize);
  const height = margin + topMargin + headerSize + (colors.length * cellSize);
  
  // Start SVG with proper XML declaration for better compatibility
  let svg = `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <title>Color Contrast Matrix</title>
  <desc>WCAG Accessibility Contrast Checker Matrix</desc>
  <defs>
    <pattern id="diagonalHatch" patternUnits="userSpaceOnUse" width="8" height="8">
      <path d="M-2,2 l4,-4 M0,8 l8,-8 M6,10 l4,-4" 
        stroke="${isDarkMode ? '#6b7280' : '#d1d5db'}" 
        stroke-width="1" />
    </pattern>
  </defs>`;
  
  // Add background
  svg += `
  <rect width="${width}" height="${height}" fill="${isDarkMode ? '#1f2937' : '#ffffff'}" />`;
  
  // Add title and metadata - positioned above the matrix
  svg += `
  <g id="title" transform="translate(${margin}, 25)">
    <text x="0" y="0" font-family="Arial, sans-serif" font-size="16" font-weight="bold" fill="${isDarkMode ? '#f9fafb' : '#111827'}">${projectName} - Color Contrast Matrix</text>
  </g>`;
  
  // Create a grid container with proper transform - using topMargin
  svg += `
  <g id="contrast-matrix" transform="translate(${margin}, ${topMargin})">`;
  
  // Add grid lines
  svg += `
    <g id="grid-lines">`;
  for (let i = 0; i <= colors.length; i++) {
    // Horizontal lines
    svg += `
      <line x1="${headerSize}" y1="${headerSize + (i * cellSize)}" x2="${headerSize + (colors.length * cellSize)}" y2="${headerSize + (i * cellSize)}" stroke="${isDarkMode ? '#4b5563' : '#e5e7eb'}" stroke-width="1" />`;
    // Vertical lines
    svg += `
      <line x1="${headerSize + (i * cellSize)}" y1="${headerSize}" x2="${headerSize + (i * cellSize)}" y2="${headerSize + (colors.length * cellSize)}" stroke="${isDarkMode ? '#4b5563' : '#e5e7eb'}" stroke-width="1" />`;
  }
  svg += `
    </g>`;
  
  // Add header cells with color squares - improved layout based on specifications
  svg += `
    <g id="headers">`;
  
  // Add Top-Left corner header cell with "Text / BG" label
  svg += `
    <g id="header-corner" transform="translate(0, 0)">
      <rect x="0" y="0" width="${headerSize}" height="${headerSize}" fill="${isDarkMode ? '#111827' : '#f9fafb'}" stroke="${isDarkMode ? '#374151' : '#e5e7eb'}" stroke-width="1" />
      <text x="${headerSize/2}" y="${headerSize/2}" text-anchor="middle" dominant-baseline="middle" font-family="Arial, sans-serif" font-size="13" font-weight="bold" fill="${isDarkMode ? '#f9fafb' : '#111827'}">Text / BG</text>
    </g>`;
  
  colors.forEach((color, colIndex) => {
    // Column headers (Background Colors) - using same structure as Side Headers
    const swatchSize = 16; // 16px square as per spec
    svg += `
      <g id="column-header-${colIndex}" transform="translate(${headerSize + (colIndex * cellSize)}, 0)">
        <rect x="0" y="0" width="${cellSize}" height="${headerSize}" fill="${isDarkMode ? '#1f2937' : '#f9fafb'}" stroke="${isDarkMode ? '#374151' : '#e5e7eb'}" stroke-width="1" />
        
        <!-- Left-aligned layout with padding like the side headers -->
        <g transform="translate(12, ${headerSize/2})">
          <!-- Color swatch left-aligned -->
          <rect x="0" y="${-swatchSize/2}" width="${swatchSize}" height="${swatchSize}" fill="${color.color}" rx="2" stroke="${color.color === '#FFFFFF' || color.color === '#ffffff' ? '#d1d5db' : 'transparent'}" stroke-width="1" />
          
          <!-- Color name next to swatch with 8px spacing -->
          <text x="${swatchSize + 8}" y="-4" text-anchor="start" font-family="Arial, sans-serif" font-size="13" font-weight="600" fill="${isDarkMode ? '#d1d5db' : '#4b5563'}">${color.name}</text>
          
          <!-- Hex code below name with 5px spacing -->
          <text x="${swatchSize + 8}" y="14" text-anchor="start" font-family="Arial, sans-serif" font-size="11" fill="${isDarkMode ? '#9ca3af' : '#6b7280'}">${color.color}</text>
        </g>
      </g>`;
    
    // Row headers (Text Colors) - following spec
    svg += `
      <g id="row-header-${colIndex}" transform="translate(0, ${headerSize + (colIndex * cellSize)})">
        <rect x="0" y="0" width="${headerSize}" height="${cellSize}" fill="${isDarkMode ? '#1f2937' : '#f9fafb'}" stroke="${isDarkMode ? '#374151' : '#e5e7eb'}" stroke-width="1" />
        
        <!-- Left-aligned layout with padding -->
        <g transform="translate(12, ${cellSize/2})">
          <!-- Color swatch left-aligned -->
          <rect x="0" y="${-swatchSize/2}" width="${swatchSize}" height="${swatchSize}" fill="${color.color}" rx="2" stroke="${color.color === '#FFFFFF' || color.color === '#ffffff' ? '#d1d5db' : 'transparent'}" stroke-width="1" />
          
          <!-- Color name next to swatch with 8px spacing -->
          <text x="${swatchSize + 8}" y="-4" text-anchor="start" font-family="Arial, sans-serif" font-size="13" font-weight="600" fill="${isDarkMode ? '#d1d5db' : '#4b5563'}">${color.name}</text>
          
          <!-- Hex code below name with 5px spacing -->
          <text x="${swatchSize + 8}" y="14" text-anchor="start" font-family="Arial, sans-serif" font-size="11" fill="${isDarkMode ? '#9ca3af' : '#6b7280'}">${color.color}</text>
        </g>
      </g>`;
  });
  svg += `
    </g>`;
  
  // Add matrix cells
  svg += `
    <g id="matrix-cells">`;
  colors.forEach((rowColor, rowIndex) => {
    colors.forEach((colColor, colIndex) => {
      const x = headerSize + (colIndex * cellSize);
      const y = headerSize + (rowIndex * cellSize);
      
      // If it's the same color (diagonal), add a centered diagonal line
      if (rowColor.id === colColor.id) {
        svg += `
      <g id="cell-${rowIndex}-${colIndex}" transform="translate(${x}, ${y})">
        <rect width="${cellSize}" height="${cellSize}" fill="${isDarkMode ? '#374151' : '#f3f4f6'}" stroke="${isDarkMode ? '#4b5563' : '#e5e7eb'}" stroke-width="1" />
        
        <!-- Centered diagonal line -->
        <line x1="0" y1="0" x2="${cellSize}" y2="${cellSize}" 
          stroke="${isDarkMode ? '#6b7280' : '#d1d5db'}" 
          stroke-width="1.5" />
      </g>`;
      } else {
        // Calculate contrast ratio
        const ratio = calculateContrastRatio(rowColor.color, colColor.color);
        const level = getComplianceLevel(ratio);
        
        // Determine badge colors based on compliance level
        let badgeFill, textFill, borderColor;
        if (ratio >= 7) {
          badgeFill = "#d1fae5"; // green bg
          textFill = "#065f46";  // green text
          borderColor = "#10b981"; // green border
        } else if (ratio >= 4.5) {
          badgeFill = "#dbeafe"; // blue bg
          textFill = "#1e40af";  // blue text
          borderColor = "#3b82f6"; // blue border
        } else if (ratio >= 3) {
          badgeFill = "#fef3c7"; // yellow bg
          textFill = "#92400e";  // yellow text
          borderColor = "#f59e0b"; // yellow border
        } else {
          badgeFill = "#fee2e2"; // red bg
          textFill = "#991b1b";  // red text
          borderColor = "#ef4444"; // red border
        }
        
        // Make text color darker on light badges for better readability
        const badgeTextColor = "#000000";
        
        svg += `
      <g id="cell-${rowIndex}-${colIndex}" transform="translate(${x}, ${y})">
        <!-- Cell border -->
        <rect width="${cellSize}" height="${cellSize}" fill="${colColor.color}" stroke="${isDarkMode ? '#4b5563' : '#e5e7eb'}" stroke-width="1" />
        
        <!-- Center sample with foreground color -->
        <g transform="translate(${cellSize/2}, ${cellSize/2})">
          <rect x="-22" y="-22" width="44" height="44" fill="${rowColor.color}" rx="6" stroke="${rowColor.color === '#FFFFFF' ? '#d1d5db' : 'none'}" stroke-width="1" />
          <text font-family="Arial, sans-serif" font-size="22" font-weight="bold" fill="${colColor.color}" x="0" y="8" text-anchor="middle" dominant-baseline="middle">Aa</text>
        </g>
        
        <!-- Ratio badge (top right) -->
        <g transform="translate(${cellSize - 36}, 10)">
          <rect width="32" height="20" rx="4" fill="${badgeFill}" stroke="${borderColor}" stroke-width="0.5" />
          <text x="16" y="15" text-anchor="middle" font-family="Arial, sans-serif" font-size="11" font-weight="bold" fill="${badgeTextColor}">${Math.round(ratio)}:1</text>
        </g>
        
        <!-- Level badge (bottom left) -->
        <g transform="translate(7, ${cellSize - 30})">
          <rect width="${Math.max(level.length * 9, 28)}" height="20" rx="4" fill="${badgeFill}" stroke="${borderColor}" stroke-width="0.5" />
          <text x="${Math.max(level.length * 9, 28) / 2}" y="15" text-anchor="middle" font-family="Arial, sans-serif" font-size="11" font-weight="bold" fill="${badgeTextColor}">${level}</text>
        </g>
      </g>`;
      }
    });
  });
  // Calculate total height used by the matrix
  const matrixHeight = headerSize + (colors.length * cellSize);
  const guidelinesSectionY = matrixHeight + 40; // Add 40px spacing
  
  // Add WCAG Guidelines section
  svg += `
    <!-- WCAG Guidelines Section -->
    <g id="wcag-guidelines" transform="translate(20, ${guidelinesSectionY})">
      <!-- Section Title -->
      <text x="0" y="0" font-family="Arial, sans-serif" font-size="18" font-weight="bold" fill="${isDarkMode ? '#f9fafb' : '#111827'}">WCAG Guidelines</text>
      
      <!-- AAA Section -->
      <g transform="translate(0, 35)">
        <text x="0" y="0" font-family="Arial, sans-serif" font-size="15" font-weight="bold" fill="#22c55e">AAA Level (Enhanced)</text>
        <text x="0" y="25" font-family="Arial, sans-serif" font-size="14" fill="${isDarkMode ? '#f9fafb' : '#111827'}">• <tspan font-weight="bold">7:1</tspan> - Normal text</text>
        <text x="0" y="50" font-family="Arial, sans-serif" font-size="14" fill="${isDarkMode ? '#f9fafb' : '#111827'}">• <tspan font-weight="bold">4.5:1</tspan> - <tspan font-weight="bold">AAA Large</tspan> - Large text (18pt+ or 14pt+ bold)</text>
      </g>
      
      <!-- AA Section -->
      <g transform="translate(400, 35)">
        <text x="0" y="0" font-family="Arial, sans-serif" font-size="15" font-weight="bold" fill="#3b82f6">AA Level (Minimum)</text>
        <text x="0" y="25" font-family="Arial, sans-serif" font-size="14" fill="${isDarkMode ? '#f9fafb' : '#111827'}">• <tspan font-weight="bold">4.5:1</tspan> - Normal text</text>
        <text x="0" y="50" font-family="Arial, sans-serif" font-size="14" fill="${isDarkMode ? '#f9fafb' : '#111827'}">• <tspan font-weight="bold">3:1</tspan> - <tspan font-weight="bold">AA Large</tspan> - Large text (18pt+ or 14pt+ bold)</text>
      </g>
      
      <!-- UI Components Section -->
      <g transform="translate(0, 120)">
        <text x="0" y="0" font-family="Arial, sans-serif" font-size="15" font-weight="bold" fill="#a855f7">Graphical Objects and UI Components</text>
        <text x="0" y="25" font-family="Arial, sans-serif" font-size="14" fill="${isDarkMode ? '#f9fafb' : '#111827'}">• <tspan font-weight="bold">3:1</tspan> - Required for all user interface components and graphical objects</text>
        <text x="0" y="50" font-family="Arial, sans-serif" font-size="14" fill="${isDarkMode ? '#f9fafb' : '#111827'}">• This includes buttons, form controls, icons, charts, and infographics</text>
        <text x="0" y="75" font-family="Arial, sans-serif" font-size="14" fill="${isDarkMode ? '#f9fafb' : '#111827'}">• WCAG 2.1 Success Criterion 1.4.11 (Non-text Contrast)</text>
      </g>
      
      <!-- Footer note -->
      <g transform="translate(0, 210)">
        <text x="0" y="0" font-family="Arial, sans-serif" font-size="12" fill="${isDarkMode ? '#9ca3af' : '#6b7280'}">Generated by ContrastKit - a tool for accessible design</text>
        <text x="0" y="20" font-family="Arial, sans-serif" font-size="12" fill="${isDarkMode ? '#9ca3af' : '#6b7280'}">Date: ${new Date().toLocaleDateString()}</text>
      </g>
    </g>
    </g>
  </g>
</svg>`;
  
  return svg;
};

// Generate CSV data for export
export const generateMatrixCSV = (
  colors: { id: number; color: string; name: string }[]
): string => {
  // Add metadata and headers as comments
  let csv = '# Color Contrast Matrix - WCAG Accessibility Report\n';
  csv += '# Generated on ' + new Date().toISOString().split('T')[0] + '\n';
  csv += '# Contrast ratios and WCAG compliance levels (AAA: ≥7.0, AA: ≥4.5, AA Large: ≥3.0)\n\n';
  
  // First column header (empty for alignment)
  csv += 'Foreground / Background,';
  
  // Add column headers (Background colors)
  colors.forEach(color => {
    // Escape quotes in names to avoid CSV parsing issues
    const escapedName = color.name.replace(/"/g, '""');
    csv += `"${escapedName} (${color.color})",`;
  });
  csv += '\n';
  
  // Add rows
  colors.forEach(rowColor => {
    // First column is the row header (Foreground color)
    const escapedName = rowColor.name.replace(/"/g, '""');
    csv += `"${escapedName} (${rowColor.color})",`;
    
    // Add contrast ratios for each combination
    colors.forEach(colColor => {
      if (rowColor.id === colColor.id) {
        // Same color (diagonal) - mark as N/A
        csv += '"N/A",';
      } else {
        const ratio = calculateContrastRatio(rowColor.color, colColor.color);
        const level = getComplianceLevel(ratio);
        
        // Format: 4.50:1 (AA)
        csv += `"${Math.round(ratio)}:1 (${level})",`;
      }
    });
    
    csv += '\n';
  });
  
  // Add a summary section
  csv += '\n# Summary of Color Combinations\n';
  csv += 'Foreground,Background,Contrast Ratio,WCAG Level,Pass/Fail\n';
  
  // List all combinations with their compliance level
  for (let i = 0; i < colors.length; i++) {
    for (let j = 0; j < colors.length; j++) {
      if (i !== j) { // Skip same color combinations
        const fgColor = colors[i];
        const bgColor = colors[j];
        const ratio = calculateContrastRatio(fgColor.color, bgColor.color);
        const level = getComplianceLevel(ratio);
        const passFail = ratio >= 4.5 ? 'Pass' : (ratio >= 3 ? 'Pass (Large Text Only)' : 'Fail');
        
        const fgEscaped = fgColor.name.replace(/"/g, '""');
        const bgEscaped = bgColor.name.replace(/"/g, '""');
        
        csv += `"${fgEscaped} (${fgColor.color})","${bgEscaped} (${bgColor.color})",${Math.round(ratio)}:1,${level},${passFail}\n`;
      }
    }
  }
  
  // Add WCAG Guidelines section
  csv += '\n\n# WCAG Guidelines\n';
  
  // AAA Level Guidelines
  csv += '\nAAA Level (Enhanced)\n';
  csv += '7:1 - Normal text\n';
  csv += '4.5:1 - AAA Large - Large text (18pt+ or 14pt+ bold)\n';
  
  // AA Level Guidelines
  csv += '\nAA Level (Minimum)\n';
  csv += '4.5:1 - Normal text\n';
  csv += '3:1 - AA Large - Large text (18pt+ or 14pt+ bold)\n';
  
  // UI Components Guidelines
  csv += '\nGraphical Objects and UI Components\n';
  csv += '3:1 - Required for all user interface components and graphical objects\n';
  csv += 'This includes buttons, form controls, icons, charts, and infographics\n';
  csv += 'WCAG 2.1 Success Criterion 1.4.11 (Non-text Contrast)\n';
  
  // Add footer
  csv += '\nGenerated by ContrastKit - a tool for accessible design\n';
  csv += 'Date: ' + new Date().toLocaleDateString() + '\n';
  
  return csv;
};
