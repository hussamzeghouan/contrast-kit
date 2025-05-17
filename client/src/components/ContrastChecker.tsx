import { useState, useEffect } from 'react';
import { ArrowDownUp, Check, AlertTriangle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Color } from '@/hooks/useColorPalette';
import { calculateContrastRatio, getComplianceLevel, getBadgeClass } from '@/lib/contrastCalculator';

interface ContrastCheckerProps {
  colors: Color[];
  foregroundId: number;
  backgroundId: number;
  onSelectForeground: (id: number) => void;
  onSelectBackground: (id: number) => void;
  onSwapColors: () => void;
}

export const ContrastChecker = ({
  colors,
  foregroundId,
  backgroundId,
  onSelectForeground,
  onSelectBackground,
  onSwapColors
}: ContrastCheckerProps) => {
  const [contrastRatio, setContrastRatio] = useState<number>(0);
  const [complianceLevel, setComplianceLevel] = useState<string>('');
  
  const foreground = colors.find(c => c.id === foregroundId);
  const background = colors.find(c => c.id === backgroundId);
  
  const foregroundColor = foreground?.color || "#000000";
  const backgroundColor = background?.color || "#FFFFFF";
  
  // Update contrast ratio when colors change
  useEffect(() => {
    if (foregroundColor && backgroundColor) {
      const ratio = calculateContrastRatio(foregroundColor, backgroundColor);
      setContrastRatio(ratio);
      setComplianceLevel(getComplianceLevel(ratio));
    }
  }, [foregroundColor, backgroundColor]);

  const badgeClass = getBadgeClass(complianceLevel);
  
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold flex items-center gap-2">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="20" 
          height="20" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          className="text-purple-600 dark:text-purple-400"
        >
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
          <polyline points="22 4 12 14.01 9 11.01"/>
        </svg>
        Contrast Checker
      </h2>
      
      {/* Enhanced layout with text preview at the top */}
      <div className="space-y-6">
        {/* Preview Area Moved to Top - Enhanced size */}
        <Card className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="p-6 sm:p-10 flex items-center justify-center" style={{ backgroundColor }}>
            <div className="p-5 sm:p-8 rounded-lg text-center w-full max-w-md">
              <div className="text-2xl sm:text-4xl font-bold tracking-tight" style={{ color: foregroundColor }}>
                Aa Text Preview
              </div>
              <div className="mt-4 text-base sm:text-lg font-medium" style={{ color: foregroundColor }}>
                The quick brown fox jumps over the lazy dog
              </div>
              <div className="mt-3 text-sm sm:text-base" style={{ color: foregroundColor }}>
                WCAG Contrast Ratio: <span className="font-semibold">{contrastRatio.toFixed(2)}:1</span>
              </div>
            </div>
          </div>
        </Card>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-medium mb-5">Color Selection</h3>
            
            <div className="space-y-6">
              {/* Foreground Color */}
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <div className="p-2 rounded-md bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M4 7L12 3L20 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M7 10L17 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      <path d="M9 14L15 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      <path d="M11 18L13 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    <span className="font-semibold text-blue-700 dark:text-blue-400">TEXT</span> Color (Foreground)
                  </label>
                  {foreground && (
                    <div className="ml-auto flex items-center gap-2 text-truncate overflow-hidden max-w-32 xl:max-w-xs">
                      <div className="h-5 w-5 rounded flex-shrink-0" style={{ backgroundColor: foregroundColor }}></div>
                      <span className="text-xs font-medium truncate">{foreground.name} ({foregroundColor})</span>
                    </div>
                  )}
                </div>
                
                <div className="flex flex-wrap gap-2 pl-2 border-l-4 border-blue-500 dark:border-blue-700 pt-2 pb-2">
                  {colors.map(color => (
                    <button 
                      key={color.id}
                      className={`h-8 w-8 md:h-10 md:w-10 rounded-full shadow-sm ${
                        color.id === foregroundId 
                          ? 'ring-2 ring-blue-500 dark:ring-blue-400 ring-offset-2 dark:ring-offset-gray-800' 
                          : 'border border-gray-200 dark:border-gray-700'
                      }`}
                      style={{ backgroundColor: color.color }}
                      onClick={() => onSelectForeground(color.id)}
                      aria-label={`Set ${color.name} as foreground (text) color`}
                      title={`${color.name} (${color.color})`}
                    ></button>
                  ))}
                </div>
              </div>
              
              {/* Background Color */}
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <div className="p-2 rounded-md bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
                      <path d="M3 9L21 9" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                  </div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    <span className="font-semibold text-purple-700 dark:text-purple-400">BACKGROUND</span> Color
                  </label>
                  {background && (
                    <div className="ml-auto flex items-center gap-2 text-truncate overflow-hidden max-w-32 xl:max-w-xs">
                      <div className="h-5 w-5 rounded flex-shrink-0" style={{ backgroundColor: backgroundColor }}></div>
                      <span className="text-xs font-medium truncate">{background.name} ({backgroundColor})</span>
                    </div>
                  )}
                </div>
                
                <div className="flex flex-wrap gap-2 pl-2 border-l-4 border-purple-500 dark:border-purple-700 pt-2 pb-2">
                  {colors.map(color => (
                    <button 
                      key={color.id}
                      className={`h-8 w-8 md:h-10 md:w-10 rounded-full shadow-sm ${
                        color.id === backgroundId 
                          ? 'ring-2 ring-purple-500 dark:ring-purple-400 ring-offset-2 dark:ring-offset-gray-800' 
                          : 'border border-gray-200 dark:border-gray-700'
                      }`}
                      style={{ backgroundColor: color.color }}
                      onClick={() => onSelectBackground(color.id)}
                      aria-label={`Set ${color.name} as background color`}
                      title={`${color.name} (${color.color})`}
                    ></button>
                  ))}
                </div>
              </div>
              
              {/* Swap Colors Button */}
              <div className="pt-3">
                <Button 
                  variant="outline"
                  onClick={onSwapColors}
                  className="w-full px-4 py-3 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 hover:bg-gradient-to-r hover:from-blue-100 hover:to-purple-100 dark:hover:from-blue-900/30 dark:hover:to-purple-900/30 border border-dashed border-gray-300 dark:border-gray-600"
                >
                  <ArrowDownUp className="h-5 w-5 mr-2 text-blue-700 dark:text-blue-400" />
                  <span className="text-gradient bg-gradient-to-r from-blue-700 to-purple-700 dark:from-blue-400 dark:to-purple-400 font-medium">Swap Text & Background</span>
                </Button>
              </div>
            </div>
          </Card>
          
          {/* Contrast Results */}
          <Card className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-lg font-medium">Contrast Results</h3>
              <div className={`px-4 py-1.5 rounded-full text-sm font-semibold ${badgeClass}`}>
                {complianceLevel}
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-900/40 rounded-md">
                <span className="font-medium">Contrast Ratio</span>
                <span className="text-lg font-semibold bg-white dark:bg-gray-800 px-3 py-1 rounded-md shadow-sm">
                  {contrastRatio.toFixed(2)}:1
                </span>
              </div>
              
              <div className="grid grid-cols-1 gap-3">
                <div className="flex justify-between items-center p-3 border border-gray-200 dark:border-gray-700 rounded-md">
                  <span className="text-sm md:text-base text-gray-700 dark:text-gray-300">Normal Text (AA)</span>
                  <span className={`flex items-center gap-1 px-2 py-1 rounded-md ${contrastRatio >= 4.5 ? 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400' : 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400'}`}>
                    {contrastRatio >= 4.5 ? <Check className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
                    {contrastRatio >= 4.5 ? 'Pass' : 'Fail'}
                  </span>
                </div>
                
                <div className="flex justify-between items-center p-3 border border-gray-200 dark:border-gray-700 rounded-md">
                  <span className="text-sm md:text-base text-gray-700 dark:text-gray-300">Normal Text (AAA)</span>
                  <span className={`flex items-center gap-1 px-2 py-1 rounded-md ${contrastRatio >= 7 ? 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400' : 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400'}`}>
                    {contrastRatio >= 7 ? <Check className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
                    {contrastRatio >= 7 ? 'Pass' : 'Fail'}
                  </span>
                </div>
                
                <div className="flex justify-between items-center p-3 border border-gray-200 dark:border-gray-700 rounded-md">
                  <span className="text-sm md:text-base text-gray-700 dark:text-gray-300">Large Text (AA)</span>
                  <span className={`flex items-center gap-1 px-2 py-1 rounded-md ${contrastRatio >= 3 ? 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400' : 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400'}`}>
                    {contrastRatio >= 3 ? <Check className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
                    {contrastRatio >= 3 ? 'Pass' : 'Fail'}
                  </span>
                </div>
                
                <div className="flex justify-between items-center p-3 border border-gray-200 dark:border-gray-700 rounded-md">
                  <span className="text-sm md:text-base text-gray-700 dark:text-gray-300">Large Text (AAA)</span>
                  <span className={`flex items-center gap-1 px-2 py-1 rounded-md ${contrastRatio >= 4.5 ? 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400' : 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400'}`}>
                    {contrastRatio >= 4.5 ? <Check className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
                    {contrastRatio >= 4.5 ? 'Pass' : 'Fail'}
                  </span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
      
      {/* WCAG Compliance Guide */}
      <Card className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-5">
        <h3 className="text-lg font-medium mb-3">WCAG Compliance Levels</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md">
            <div className="flex items-center gap-2 mb-1">
              <div className="px-2 py-0.5 bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-400 rounded-md text-sm font-medium">AAA</div>
              <div className="font-medium text-green-800 dark:text-green-400">7:1+</div>
            </div>
            <p className="text-sm text-green-700 dark:text-green-300">Enhanced contrast for all text sizes</p>
          </div>
          
          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md">
            <div className="flex items-center gap-2 mb-1">
              <div className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-400 rounded-md text-sm font-medium">AA</div>
              <div className="font-medium text-blue-800 dark:text-blue-400">4.5:1+</div>
            </div>
            <p className="text-sm text-blue-700 dark:text-blue-300">Standard contrast for normal text</p>
          </div>
          
          <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md">
            <div className="flex items-center gap-2 mb-1">
              <div className="px-2 py-0.5 bg-yellow-100 dark:bg-yellow-900/40 text-yellow-800 dark:text-yellow-400 rounded-md text-sm font-medium">AA Large</div>
              <div className="font-medium text-yellow-800 dark:text-yellow-400">3:1+</div>
            </div>
            <p className="text-sm text-yellow-700 dark:text-yellow-300">Minimum for large text (18pt+)</p>
          </div>
          
          <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
            <div className="flex items-center gap-2 mb-1">
              <div className="px-2 py-0.5 bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-400 rounded-md text-sm font-medium">Fail</div>
              <div className="font-medium text-red-800 dark:text-red-400">&lt;3:1</div>
            </div>
            <p className="text-sm text-red-700 dark:text-red-300">Insufficient contrast for accessibility</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ContrastChecker;
