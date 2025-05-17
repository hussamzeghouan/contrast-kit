import { useEffect, useRef, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuTrigger, 
  DropdownMenuItem 
} from '@/components/ui/dropdown-menu';
import { PlusCircle, Trash2, ChevronDown, CheckCircle2, Copy, Hash, Palette, Plus, Printer, Check } from 'lucide-react';
import { Color } from '@/hooks/useColorPalette';
import { 
  calculateContrastRatio, 
  getComplianceLevel, 
  generateMatrixSVG,
  generateMatrixCSV
} from '@/lib/contrastCalculator';
import { useToast } from '@/hooks/use-toast';

interface ContrastMatrixProps {
  colors: Color[];
  projectName: string;
  isDarkMode: boolean;
  addColor: (color: string, name: string) => boolean;
  removeColor: (id: number) => boolean;
  exportFullReport?: () => void;
}

export const ContrastMatrix = ({
  colors,
  projectName,
  isDarkMode,
  addColor,
  removeColor,
  exportFullReport
}: ContrastMatrixProps) => {
  const tableRef = useRef<HTMLDivElement>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newColorHex, setNewColorHex] = useState('#000000');
  const [newColorName, setNewColorName] = useState('');
  const { toast } = useToast(); // Hook for toast notifications

  const copySVGToClipboard = () => {
    const svg = generateMatrixSVG(colors, projectName, isDarkMode);
    
    // Using the clipboard API if available
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(svg)
        .then(() => {
          // Show toast notification instead of alert
          toast({
            title: "Success!",
            description: "SVG copied to clipboard. You can now paste it into a design tool.",
            action: (
              <div className="h-8 w-8 bg-green-50 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
            ),
          });
        })
        .catch((error) => {
          // Show error toast and fallback to download
          toast({
            title: "Clipboard access denied",
            description: "Downloading the SVG file instead.",
            variant: "destructive",
          });
          downloadSVG(svg);
        });
    } else {
      // Fallback for browsers without clipboard API
      toast({
        title: "Clipboard API not supported",
        description: "Downloading the SVG file instead.",
        variant: "destructive",
      });
      downloadSVG(svg);
    }
  };

  const downloadSVG = (svgContent: string) => {
    const blob = new Blob([svgContent], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${projectName.replace(/\s+/g, '-')}-contrast-matrix.svg`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportMatrixAsCSV = () => {
    const csv = generateMatrixCSV(colors);
    
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${projectName.replace(/\s+/g, '-')}-contrast-matrix.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Show toast notification for CSV download
    toast({
      title: "CSV Downloaded",
      description: "Your contrast matrix has been downloaded as a CSV file.",
      action: (
        <div className="h-8 w-8 bg-blue-50 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
          <CheckCircle2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
        </div>
      ),
    });
  };
  
  // Function to export the matrix as a printable page
  const exportMatrixPage = () => {
    // Create a new window for the matrix
    const newWindow = window.open('', '_blank');
    if (!newWindow) {
      toast({
        title: "Export Failed",
        description: "Unable to open a new window. Please check your browser settings.",
        variant: "destructive"
      });
      return;
    }
    
    // Generate HTML content for the matrix page
    const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Color Contrast Matrix - ${projectName}</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
          border-bottom: 1px solid #eee;
          padding-bottom: 20px;
        }
        .matrix-container {
          width: 100%;
          overflow: auto;
        }
        .matrix-explanation {
          margin: 20px 0;
          padding: 15px;
          background-color: #f9fafb;
          border-radius: 8px;
          border: 1px solid #e5e7eb;
        }
        .legend {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin: 20px 0;
        }
        .legend-item {
          display: flex;
          align-items: center;
          margin-right: 15px;
        }
        .legend-color {
          width: 20px;
          height: 20px;
          border-radius: 4px;
          margin-right: 5px;
        }
        .footer {
          text-align: center;
          margin-top: 30px;
          font-size: 12px;
          color: #6b7280;
          border-top: 1px solid #eee;
          padding-top: 20px;
        }
        .wcag-guidelines {
          margin-top: 40px;
          padding: 20px;
          background-color: #f9fafb;
          border-radius: 8px;
          border: 1px solid #e5e7eb;
        }
        .guideline-section {
          margin-bottom: 20px;
        }
        .guideline-title {
          font-weight: bold;
          margin-bottom: 10px;
        }
        .AAA-title { color: #10b981; }
        .AA-title { color: #3b82f6; }
        .UI-title { color: #a855f7; }
        @media print {
          body {
            padding: 0;
            margin: 0;
          }
          .print-hide {
            display: none;
          }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Color Contrast Matrix</h1>
        <p>${projectName} - ${new Date().toLocaleDateString()}</p>
      </div>
      
      <div class="matrix-explanation">
        <h3>How to read this matrix:</h3>
        <p>This matrix shows the contrast ratio between each pair of colors in your palette. Each cell contains both the contrast ratio and the WCAG compliance level.</p>
        <p>The <strong>rows</strong> represent the <strong>text color</strong>, and the <strong>columns</strong> represent the <strong>background color</strong>.</p>
      </div>
      
      <div class="legend">
        <div class="legend-item">
          <div class="legend-color" style="background-color: #d1fae5; border: 1px solid #10b981;"></div>
          <span>AAA (7:1+) - Passes all requirements</span>
        </div>
        <div class="legend-item">
          <div class="legend-color" style="background-color: #dbeafe; border: 1px solid #3b82f6;"></div>
          <span>AA (4.5:1+) - Passes AA for normal text</span>
        </div>
        <div class="legend-item">
          <div class="legend-color" style="background-color: #fef3c7; border: 1px solid #f59e0b;"></div>
          <span>AA Large (3:1+) - Passes only for large text</span>
        </div>
        <div class="legend-item">
          <div class="legend-color" style="background-color: #fee2e2; border: 1px solid #ef4444;"></div>
          <span>Fail (< 3:1) - Fails all requirements</span>
        </div>
      </div>
      
      <div class="matrix-container">
        ${generateMatrixSVG(colors, projectName, isDarkMode)}
      </div>
      
      <div class="wcag-guidelines">
        <h2>WCAG Guidelines</h2>
        
        <div class="guideline-section">
          <div class="guideline-title AAA-title">AAA Level (Enhanced)</div>
          <div>• <strong>7:1</strong> - Normal text</div>
          <div>• <strong>4.5:1</strong> - <strong>AAA Large</strong> - Large text (18pt+ or 14pt+ bold)</div>
        </div>
        
        <div class="guideline-section">
          <div class="guideline-title AA-title">AA Level (Minimum)</div>
          <div>• <strong>4.5:1</strong> - Normal text</div>
          <div>• <strong>3:1</strong> - <strong>AA Large</strong> - Large text (18pt+ or 14pt+ bold)</div>
        </div>
        
        <div class="guideline-section">
          <div class="guideline-title UI-title">Graphical Objects and UI Components</div>
          <div>• <strong>3:1</strong> - Required for all user interface components and graphical objects</div>
          <div>• This includes buttons, form controls, icons, charts, and infographics</div>
          <div>• WCAG 2.1 Success Criterion 1.4.11 (Non-text Contrast)</div>
        </div>
      </div>
      
      <div class="footer">
        <p>Generated by ContrastKit - a tool for accessible design</p>
        <p class="print-hide">
          <button onclick="window.print();" style="padding: 8px 15px; border: none; background-color: #3b82f6; color: white; border-radius: 4px; cursor: pointer;">
            Print Report
          </button>
        </p>
      </div>
    </body>
    </html>
    `;
    
    newWindow.document.open();
    newWindow.document.write(html);
    newWindow.document.close();
    
    // Show toast notification
    toast({
      title: "Matrix Exported",
      description: "Your contrast matrix has been generated in a new tab.",
      action: (
        <div className="h-8 w-8 bg-blue-50 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
          <CheckCircle2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
        </div>
      ),
    });
  };

  // Handle adding a new color
  const handleAddColor = () => {
    if (newColorHex) {
      const success = addColor(newColorHex, newColorName);
      if (success) {
        // Show success toast
        toast({
          title: "Color Added",
          description: `Added ${newColorName || newColorHex} to the color palette.`,
          action: (
            <div className="h-8 w-8 rounded-full flex items-center justify-center" style={{ backgroundColor: `${newColorHex}20` }}>
              <div className="h-5 w-5 rounded-full" style={{ backgroundColor: newColorHex }}></div>
            </div>
          ),
        });
        
        setShowAddForm(false);
        setNewColorHex('#000000');
        setNewColorName('');
      } else {
        // Show error toast
        toast({
          title: "Error Adding Color",
          description: "Could not add the color. It may already exist in the palette.",
          variant: "destructive",
        });
      }
    } else {
      // Show warning toast if no color hex
      toast({
        title: "Invalid Color",
        description: "Please provide a valid color hex code.",
        variant: "destructive",
      });
    }
  };

  // Get badge class based on compliance level
  const getBadgeClass = (level: string) => {
    switch (level) {
      case 'AAA':
        return "bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-400";
      case 'AA':
        return "bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-400";
      case 'AA Large':
        return "bg-yellow-100 dark:bg-yellow-900/40 text-yellow-800 dark:text-yellow-400";
      default:
        return "bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-400";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3">
        <h2 className="text-xl font-semibold">Contrast Matrix</h2>
        
        {/* Action buttons - mobile optimized */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {/* Add Color Button - Toggle functionality */}
          <Button 
            onClick={() => setShowAddForm(!showAddForm)} 
            className="bg-green-600 hover:bg-green-700 text-white h-10 px-2 sm:px-3"
          >
            <PlusCircle className="w-4 h-4 sm:mr-2" />
            <span className="hidden sm:inline">{showAddForm ? 'Cancel Add' : 'Add Color'}</span>
            <span className="sm:hidden text-xs ml-1">{showAddForm ? 'Cancel' : 'Add'}</span>
          </Button>

          {/* Color Management Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="h-10 px-2 sm:px-3">
                <ChevronDown className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">Manage Colors</span>
                <span className="sm:hidden text-xs ml-1">Manage</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
              <DropdownMenuItem 
                onClick={() => setShowAddForm(true)}
                className="text-blue-600 dark:text-blue-400 font-medium"
              >
                <Plus className="h-4 w-4 mr-2" />
                <span>Add New Color</span>
              </DropdownMenuItem>
              
              <DropdownMenuItem className="py-0 px-0">
                <div className="h-px w-full bg-gray-200 dark:bg-gray-700 my-1"></div>
              </DropdownMenuItem>
              
              <div className="px-2 py-1.5 text-xs text-gray-500 dark:text-gray-400 font-medium">
                REMOVE COLORS
              </div>
              
              {colors.map(color => (
                <DropdownMenuItem 
                  key={color.id} 
                  onClick={() => {
                    const success = removeColor(color.id);
                    if (success) {
                      // Show success toast for color removal
                      toast({
                        title: "Color Removed",
                        description: `Removed ${color.name || color.color} from the color palette.`,
                        action: (
                          <div className="h-8 w-8 bg-red-50 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                            <Trash2 className="h-5 w-5 text-red-600 dark:text-red-400" />
                          </div>
                        ),
                      });
                    } else if (colors.length <= 2) {
                      // Show warning toast if trying to remove with only 2 colors
                      toast({
                        title: "Cannot Remove Color",
                        description: "You need at least 2 colors in the palette.",
                        variant: "destructive",
                      });
                    }
                  }}
                  disabled={colors.length <= 2}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center overflow-hidden">
                    <div className="h-5 w-5 mr-2" style={{ 
                      backgroundColor: color.color,
                      border: color.color === '#FFFFFF' ? '1px solid #e5e7eb' : 'none' 
                    }}></div>
                    <span className="truncate max-w-[120px]">{color.name}</span>
                    <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">{color.color}</span>
                  </div>
                  <Trash2 className="w-4 h-4 text-red-500 flex-shrink-0 ml-2" />
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Button onClick={exportMatrixAsCSV} className="h-10 px-2 sm:px-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 sm:mr-2">
              <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
              <polyline points="14 2 14 8 20 8"/>
              <path d="M8 13h2"/>
              <path d="M8 17h2"/>
              <path d="M14 13h2"/>
              <path d="M14 17h2"/>
            </svg>
            <span className="hidden sm:inline">Export CSV</span>
            <span className="sm:hidden text-xs ml-1">CSV</span>
          </Button>
          <Button onClick={copySVGToClipboard} className="h-10 px-2 sm:px-3">
            <Copy className="w-4 h-4 sm:mr-2" />
            <span className="hidden sm:inline">Copy SVG</span>
            <span className="sm:hidden text-xs ml-1">Copy</span>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="h-10 px-2 sm:px-3">
                <Printer className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">Export</span>
                <span className="sm:hidden text-xs ml-1">Export</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={exportMatrixPage}>
                Matrix Only
              </DropdownMenuItem>
              {exportFullReport && (
                <DropdownMenuItem onClick={exportFullReport}>
                  Full Report
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      {/* Add Color Form - Mobile Friendly */}
      {showAddForm && (
        <Card className="p-3 sm:p-4 bg-white dark:bg-gray-800 rounded-md shadow border border-gray-200 dark:border-gray-700 mb-4">
          <h3 className="text-lg font-medium mb-3">Add New Color</h3>
          <div className="space-y-3 sm:space-y-4">
            <div>
              <label htmlFor="newColorHex" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Color Hex
              </label>
              <div className="flex gap-2 sm:gap-3">
                <input 
                  type="color" 
                  id="newColorHex" 
                  value={newColorHex} 
                  onChange={(e) => setNewColorHex(e.target.value)}
                  className="h-10 w-10 rounded border border-gray-300 dark:border-gray-700 bg-transparent"
                />
                <Input 
                  type="text" 
                  id="newColorHexText" 
                  value={newColorHex} 
                  onChange={(e) => setNewColorHex(e.target.value)}
                  className="pl-2 sm:pl-3 pr-2 sm:pr-10 py-2 flex-grow text-sm sm:text-base"
                />
              </div>
            </div>
            <div>
              <label htmlFor="newColorName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Color Name
              </label>
              <Input 
                type="text" 
                id="newColorName" 
                placeholder="Enter color name" 
                value={newColorName}
                onChange={(e) => setNewColorName(e.target.value)}
                className="pl-2 sm:pl-3 pr-2 sm:pr-10 py-2 w-full text-sm sm:text-base"
              />
            </div>
            <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 sm:gap-3 mt-4">
              <Button 
                variant="outline" 
                onClick={() => setShowAddForm(false)}
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleAddColor}
                className="w-full sm:w-auto mb-2 sm:mb-0"
              >
                Add Color
              </Button>
            </div>
          </div>
        </Card>
      )}
      
      {/* Contrast Matrix Table - Mobile Optimized */}
      <Card className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
        <div className="p-2 sm:p-0">
          <p className="text-xs sm:hidden text-gray-500 dark:text-gray-400 mb-2 italic">
            Swipe horizontally to see more colors →
          </p>
          
          {/* Centered divider effect for desktop - top border on middle column */}
          <div ref={tableRef} className="overflow-x-auto">
            <table className="min-w-full border-collapse">
              <thead>
                <tr>
                  <th className="p-2 sm:p-3 border-b border-r border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-left text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">
                    BG / FG
                  </th>
                  {colors.map((color, index) => (
                    <th 
                      key={color.id} 
                      className={`p-2 sm:p-3 border-b border-r border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 
                        ${Math.floor(colors.length/2) === index ? 'sm:border-t-2 sm:border-t-blue-500 dark:sm:border-t-blue-700' : ''}`}
                    >
                      <div className="flex flex-col items-center gap-1">
                        <div 
                          className="h-5 w-5 sm:h-6 sm:w-6 rounded border border-gray-300 dark:border-gray-700" 
                          style={{ 
                            backgroundColor: color.color,
                            borderColor: color.color === '#FFFFFF' || color.color === '#ffffff' ? '#d1d5db' : 'transparent'
                          }}
                        ></div>
                        <div className="text-xs font-medium">{color.name}</div>
                        <div className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-500">{color.color}</div>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {colors.map((rowColor, rowIndex) => (
                  <tr key={rowColor.id}>
                    <td className="p-2 sm:p-3 border-b border-r border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                      <div className="flex items-center gap-2">
                        <div 
                          className="h-5 w-5 sm:h-6 sm:w-6 rounded border border-gray-300 dark:border-gray-700" 
                          style={{ 
                            backgroundColor: rowColor.color,
                            borderColor: rowColor.color === '#FFFFFF' || rowColor.color === '#ffffff' ? '#d1d5db' : 'transparent'
                          }}
                        ></div>
                        <div>
                          <div className="text-xs sm:text-sm font-medium">{rowColor.name}</div>
                          <div className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-500">{rowColor.color}</div>
                        </div>
                      </div>
                    </td>
                    
                    {colors.map((colColor, colIndex) => {
                      // If it's the same color (diagonal), display diagonal stripes
                      if (rowColor.id === colColor.id) {
                        return (
                          <td 
                            key={colColor.id} 
                            className={`p-2 sm:p-3 border-b border-r border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-850 relative
                              ${Math.floor(colors.length/2) === colIndex ? 'sm:border-l-2 sm:border-l-blue-500 dark:sm:border-l-blue-700' : ''}
                            `}
                          >
                            <div className="h-12 sm:h-16 w-full relative overflow-hidden">
                              {/* Centered diagonal line */}
                              <div 
                                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] h-0.5 bg-gray-300 dark:bg-gray-600" 
                                style={{ transform: 'rotate(45deg)' }}
                              ></div>
                            </div>
                          </td>
                        );
                      }
                      
                      // Calculate contrast ratio and compliance level
                      const ratio = calculateContrastRatio(rowColor.color, colColor.color);
                      const level = getComplianceLevel(ratio);
                      const badgeClass = getBadgeClass(level);
                      
                      return (
                        <td 
                          key={colColor.id} 
                          className={`p-2 sm:p-3 border-b border-r border-gray-200 dark:border-gray-700
                            ${Math.floor(colors.length/2) === colIndex ? 'sm:border-l-2 sm:border-l-blue-500 dark:sm:border-l-blue-700' : ''}
                          `}
                          style={{ backgroundColor: colColor.color }}
                        >
                          <div className="relative">
                            <div className={`absolute top-0 right-0 px-1 sm:px-1.5 py-0.5 ${badgeClass} text-[10px] sm:text-xs font-medium rounded`}>
                              {ratio.toFixed(1)}:1
                            </div>
                            <div className="flex justify-center items-center h-12 sm:h-16 w-full">
                              <div 
                                className="h-8 w-8 sm:h-10 sm:w-10 flex items-center justify-center rounded-md" 
                                style={{ 
                                  backgroundColor: rowColor.color, 
                                  color: colColor.color
                                }}
                              >
                                Aa
                              </div>
                            </div>
                            <div className={`absolute bottom-0 left-0 px-1 sm:px-1.5 py-0.5 ${badgeClass} text-[10px] sm:text-xs font-medium rounded`}>
                              {level}
                            </div>
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ContrastMatrix;