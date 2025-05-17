import { useState, useEffect } from 'react';
import { Palette, Moon, Sun, ArrowDownUp, Check, X, HelpCircle, Plus, Trash, Edit2, Download, Copy, Edit, Hash, Trash2, Printer, CheckCircle2 } from 'lucide-react';
import { useColorPalette, Color } from '@/hooks/useColorPalette';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { calculateContrastRatio, getComplianceLevel, hexToRGB, generateMatrixSVG, generateMatrixCSV } from '@/lib/contrastCalculator';
import { useToast } from '@/hooks/use-toast';


const ContrastKit = () => {
  // Project settings
  const [projectName, setProjectName] = useState("My Color Project");
  const { toast } = useToast();
  
  // Color palette state
  const { 
    colors, 
    addColor, 
    removeColor, 
    updateColor 
  } = useColorPalette([
    { id: 1, color: '#000000', name: 'Black' },
    { id: 2, color: '#FFFFFF', name: 'White' },
    { id: 3, color: '#3B82F6', name: 'Blue' },
    { id: 4, color: '#EF4444', name: 'Red' },
  ]);
  
  // Active tab and section states
  const [activeTab, setActiveTab] = useState('analyzer');
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showColorForm, setShowColorForm] = useState(false);
  
  // New color form state
  const [newColorHex, setNewColorHex] = useState('#6366F1');
  const [newColorName, setNewColorName] = useState('');
  
  // Foreground and background colors for checker
  const [foregroundId, setForegroundId] = useState(1); // Black by default
  const [backgroundId, setBackgroundId] = useState(2); // White by default
  
  // Dark mode detection
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return document.documentElement.classList.contains('dark');
    }
    return false;
  });
  
  // Function to generate a comprehensive report with both matrix and analyzer
  const exportFullReport = () => {
    const foreground = colors.find(c => c.id === foregroundId);
    const background = colors.find(c => c.id === backgroundId);
    
    if (!foreground || !background) return;
    
    const ratio = calculateContrastRatio(foreground.color, background.color);
    const level = getComplianceLevel(ratio);
    
    // Create a new window for the full report
    const newWindow = window.open('', '_blank');
    if (!newWindow) {
      toast({
        title: "Export Failed",
        description: "Unable to open a new window. Please check your browser settings.",
        variant: "destructive"
      });
      return;
    }
    
    // Generate HTML content for the full report page
    const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Color Contrast Report - ${projectName}</title>
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
        .section {
          margin-bottom: 40px;
          padding-bottom: 40px;
          border-bottom: 1px solid #eee;
        }
        h1, h2, h3 {
          color: #111827;
        }
        .section-title {
          font-size: 24px;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .section-icon {
          width: 24px;
          height: 24px;
          display: inline-block;
        }
        .colors-display {
          display: flex;
          justify-content: space-between;
          margin-bottom: 30px;
        }
        .color-block {
          width: 48%;
          border-radius: 8px;
          height: 100px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          color: white;
          font-weight: bold;
          border: 1px solid #ddd;
        }
        .demo-text {
          padding: 20px;
          border-radius: 8px;
          margin-bottom: 30px;
          font-size: 16px;
        }
        .result-section {
          margin-bottom: 30px;
        }
        .contrast-ratio {
          font-size: 24px;
          font-weight: bold;
          text-align: center;
          margin-bottom: 15px;
        }
        .compliance-badge {
          display: inline-block;
          padding: 5px 15px;
          border-radius: 20px;
          font-weight: bold;
          color: white;
        }
        .AAA { background-color: #10b981; }
        .AA { background-color: #3b82f6; }
        .AA-Large { background-color: #f59e0b; }
        .Fail { background-color: #ef4444; }
        .result-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
          margin-top: 20px;
        }
        .result-item {
          padding: 15px;
          border-radius: 8px;
          background-color: #f9fafb;
          border: 1px solid #e5e7eb;
        }
        .result-item-special {
          padding: 15px;
          border-radius: 8px;
          background-color: #f3e8ff;
          border-left: 4px solid #a855f7;
          grid-column: span 2;
          margin-bottom: 15px;
        }
        .result-header {
          font-weight: bold;
          display: flex;
          justify-content: space-between;
          margin-bottom: 5px;
        }
        .pass { color: #10b981; }
        .fail { color: #ef4444; }
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
        .page-break {
          page-break-before: always;
        }
        @media print {
          body {
            padding: 0;
            margin: 0;
          }
          .print-hide {
            display: none;
          }
          .page-break {
            page-break-before: always;
          }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Color Contrast Report</h1>
        <p>${projectName} - ${new Date().toLocaleDateString()}</p>
      </div>
      
      <div class="section">
        <div class="section-title">
          <svg class="section-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M2 12h20"></path>
            <path d="M10 16v-4a2 2 0 0 0-2-2H4"></path>
            <path d="M10 8V6c0-1.1.9-2 2-2h8"></path>
            <path d="M14 22v-5c0-1.1.9-2 2-2h4"></path>
            <path d="M4 22V4"></path>
          </svg>
          <span>Color Contrast Analysis</span>
        </div>
        
        <div class="colors-display">
          <div class="color-block" style="background-color: ${foreground.color}">
            <div>Text Color</div>
            <div>${foreground.name}</div>
            <div>${foreground.color}</div>
          </div>
          <div class="color-block" style="background-color: ${background.color}">
            <div>Background Color</div>
            <div>${background.name}</div>
            <div>${background.color}</div>
          </div>
        </div>
        
        <div class="demo-text" style="background-color: ${background.color}; color: ${foreground.color}">
          <h3>Sample Text Preview</h3>
          <p>This is how your text will look with the selected color combination. The quick brown fox jumps over the lazy dog.</p>
          <p><strong>This is bold text to simulate headings and important content.</strong></p>
        </div>
        
        <div class="result-section">
          <div class="contrast-ratio">
            Contrast Ratio: ${Math.round(ratio)}:1
          </div>
          <div style="text-align: center; margin-bottom: 20px;">
            <span class="compliance-badge ${level.replace(' ', '-')}">${level}</span>
          </div>
          
          <div class="result-item-special">
            <div class="result-header">
              <span>UI Components & Graphical Objects</span>
              <span class="${ratio >= 3 ? 'pass' : 'fail'}">${ratio >= 3 ? 'Pass' : 'Fail'}</span>
            </div>
            <div style="font-size: 14px; color: #4b5563;">
              Requires 3:1 or higher - WCAG 2.1 Success Criterion 1.4.11 (Non-text Contrast)
            </div>
            <div style="font-size: 12px; color: #6b7280; margin-top: 5px;">
              Applies to buttons, form controls, icons, charts, and component boundaries
            </div>
          </div>
          
          <h3>Text Contrast Requirements</h3>
          <div class="result-grid">
            <div class="result-item">
              <div class="result-header">
                <span>Normal Text (AA)</span>
                <span class="${ratio >= 4.5 ? 'pass' : 'fail'}">${ratio >= 4.5 ? 'Pass' : 'Fail'}</span>
              </div>
              <div style="font-size: 12px; color: #6b7280;">
                Requires 4.5:1 or higher
              </div>
            </div>
            
            <div class="result-item">
              <div class="result-header">
                <span>Normal Text (AAA)</span>
                <span class="${ratio >= 7 ? 'pass' : 'fail'}">${ratio >= 7 ? 'Pass' : 'Fail'}</span>
              </div>
              <div style="font-size: 12px; color: #6b7280;">
                Requires 7:1 or higher
              </div>
            </div>
            
            <div class="result-item">
              <div class="result-header">
                <span>AA Large Text</span>
                <span class="${ratio >= 3 ? 'pass' : 'fail'}">${ratio >= 3 ? 'Pass' : 'Fail'}</span>
              </div>
              <div style="font-size: 12px; color: #6b7280;">
                Requires 3:1 or higher
              </div>
            </div>
            
            <div class="result-item">
              <div class="result-header">
                <span>AAA Large Text</span>
                <span class="${ratio >= 4.5 ? 'pass' : 'fail'}">${ratio >= 4.5 ? 'Pass' : 'Fail'}</span>
              </div>
              <div style="font-size: 12px; color: #6b7280;">
                Requires 4.5:1 or higher
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="page-break"></div>
      
      <div class="section">
        <div class="section-title">
          <svg class="section-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect>
            <rect width="3" height="9" x="7" y="7"></rect>
            <rect width="3" height="5" x="14" y="7"></rect>
          </svg>
          <span>Color Contrast Matrix</span>
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
      </div>
      
      <div class="page-break"></div>
      
      <div class="section">
        <div class="section-title">
          <svg class="section-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M12 8v4"></path>
            <path d="M12 16h.01"></path>
          </svg>
          <span>WCAG Guidelines</span>
        </div>
        
        <div class="wcag-guidelines">
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
      title: "Full Report Generated",
      description: "Your comprehensive contrast report has been generated in a new tab.",
      action: (
        <div className="h-8 w-8 bg-blue-50 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
          <CheckCircle2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
        </div>
      ),
    });
  };
  
  // Function to export the analyzer results as a printable page
  const exportAnalyzerPage = () => {
    const foreground = colors.find(c => c.id === foregroundId);
    const background = colors.find(c => c.id === backgroundId);
    
    if (!foreground || !background) return;
    
    const ratio = calculateContrastRatio(foreground.color, background.color);
    const level = getComplianceLevel(ratio);
    
    // Create a new window with just the analyzer content
    const newWindow = window.open('', '_blank');
    if (!newWindow) {
      toast({
        title: "Export Failed",
        description: "Unable to open a new window. Please check your browser settings.",
        variant: "destructive"
      });
      return;
    }
    
    // Generate HTML content for the analyzer page
    const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Color Contrast Analyzer - ${foreground.name} on ${background.name}</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
          border-bottom: 1px solid #eee;
          padding-bottom: 20px;
        }
        .colors-display {
          display: flex;
          justify-content: space-between;
          margin-bottom: 30px;
        }
        .color-block {
          width: 48%;
          border-radius: 8px;
          height: 100px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          color: white;
          font-weight: bold;
          border: 1px solid #ddd;
        }
        .demo-text {
          padding: 20px;
          border-radius: 8px;
          margin-bottom: 30px;
          font-size: 16px;
        }
        .result-section {
          margin-bottom: 30px;
        }
        .contrast-ratio {
          font-size: 24px;
          font-weight: bold;
          text-align: center;
          margin-bottom: 15px;
        }
        .compliance-badge {
          display: inline-block;
          padding: 5px 15px;
          border-radius: 20px;
          font-weight: bold;
          color: white;
        }
        .AAA { background-color: #10b981; }
        .AA { background-color: #3b82f6; }
        .AA-Large { background-color: #f59e0b; }
        .Fail { background-color: #ef4444; }
        .result-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
          margin-top: 20px;
        }
        .result-item {
          padding: 15px;
          border-radius: 8px;
          background-color: #f9fafb;
          border: 1px solid #e5e7eb;
        }
        .result-item-special {
          padding: 15px;
          border-radius: 8px;
          background-color: #f3e8ff;
          border-left: 4px solid #a855f7;
          grid-column: span 2;
          margin-bottom: 15px;
        }
        .result-header {
          font-weight: bold;
          display: flex;
          justify-content: space-between;
          margin-bottom: 5px;
        }
        .pass { color: #10b981; }
        .fail { color: #ef4444; }
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
        <h1>Color Contrast Analyzer</h1>
        <p>${new Date().toLocaleDateString()}</p>
      </div>
      
      <div class="colors-display">
        <div class="color-block" style="background-color: ${foreground.color}">
          <div>Text Color</div>
          <div>${foreground.name}</div>
          <div>${foreground.color}</div>
        </div>
        <div class="color-block" style="background-color: ${background.color}">
          <div>Background Color</div>
          <div>${background.name}</div>
          <div>${background.color}</div>
        </div>
      </div>
      
      <div class="demo-text" style="background-color: ${background.color}; color: ${foreground.color}">
        <h3>Sample Text Preview</h3>
        <p>This is how your text will look with the selected color combination. The quick brown fox jumps over the lazy dog.</p>
        <p><strong>This is bold text to simulate headings and important content.</strong></p>
      </div>
      
      <div class="result-section">
        <div class="contrast-ratio">
          Contrast Ratio: ${Math.round(ratio)}:1
        </div>
        <div style="text-align: center; margin-bottom: 20px;">
          <span class="compliance-badge ${level.replace(' ', '-')}">${level}</span>
        </div>
        
        <div class="result-item-special">
          <div class="result-header">
            <span>UI Components & Graphical Objects</span>
            <span class="${ratio >= 3 ? 'pass' : 'fail'}">${ratio >= 3 ? 'Pass' : 'Fail'}</span>
          </div>
          <div style="font-size: 14px; color: #4b5563;">
            Requires 3:1 or higher - WCAG 2.1 Success Criterion 1.4.11 (Non-text Contrast)
          </div>
          <div style="font-size: 12px; color: #6b7280; margin-top: 5px;">
            Applies to buttons, form controls, icons, charts, and component boundaries
          </div>
        </div>
        
        <h3>Text Contrast Requirements</h3>
        <div class="result-grid">
          <div class="result-item">
            <div class="result-header">
              <span>Normal Text (AA)</span>
              <span class="${ratio >= 4.5 ? 'pass' : 'fail'}">${ratio >= 4.5 ? 'Pass' : 'Fail'}</span>
            </div>
            <div style="font-size: 12px; color: #6b7280;">
              Requires 4.5:1 or higher
            </div>
          </div>
          
          <div class="result-item">
            <div class="result-header">
              <span>Normal Text (AAA)</span>
              <span class="${ratio >= 7 ? 'pass' : 'fail'}">${ratio >= 7 ? 'Pass' : 'Fail'}</span>
            </div>
            <div style="font-size: 12px; color: #6b7280;">
              Requires 7:1 or higher
            </div>
          </div>
          
          <div class="result-item">
            <div class="result-header">
              <span>AA Large Text</span>
              <span class="${ratio >= 3 ? 'pass' : 'fail'}">${ratio >= 3 ? 'Pass' : 'Fail'}</span>
            </div>
            <div style="font-size: 12px; color: #6b7280;">
              Requires 3:1 or higher
            </div>
          </div>
          
          <div class="result-item">
            <div class="result-header">
              <span>AAA Large Text</span>
              <span class="${ratio >= 4.5 ? 'pass' : 'fail'}">${ratio >= 4.5 ? 'Pass' : 'Fail'}</span>
            </div>
            <div style="font-size: 12px; color: #6b7280;">
              Requires 4.5:1 or higher
            </div>
          </div>
        </div>
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
      title: "Analyzer Exported",
      description: "Your contrast analyzer report has been generated in a new tab.",
      action: (
        <div className="h-8 w-8 bg-blue-50 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
          <Check className="h-5 w-5 text-blue-600 dark:text-blue-400" />
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
          <Check className="h-5 w-5 text-blue-600 dark:text-blue-400" />
        </div>
      ),
    });
  };
  
  // Update dark mode state when theme changes
  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach(mutation => {
        if (mutation.attributeName === 'class') {
          setIsDarkMode(document.documentElement.classList.contains('dark'));
        }
      });
    });
    
    observer.observe(document.documentElement, { attributes: true });
    
    return () => {
      observer.disconnect();
    };
  }, []);
  
  // Compute contrast details
  const foreground = colors.find(c => c.id === foregroundId) || colors[0];
  const background = colors.find(c => c.id === backgroundId) || colors[1];
  const contrastRatio = calculateContrastRatio(foreground.color, background.color);
  const complianceLevel = getComplianceLevel(contrastRatio);
  
  // Handle theme toggle
  const toggleTheme = () => {
    document.documentElement.classList.toggle('dark');
  };
  
  // Swap foreground and background colors
  const swapColors = () => {
    const tempFg = foregroundId;
    setForegroundId(backgroundId);
    setBackgroundId(tempFg);
  };
  
  // Handle adding a new color
  const handleAddColor = () => {
    if (newColorHex) {
      const name = newColorName.trim() || `Color ${colors.length + 1}`;
      const success = addColor(newColorHex, name);
      if (success) {
        toast({
          title: "Color added",
          description: `${name} (${newColorHex}) has been added to your palette.`,
        });
        setNewColorHex('#6366F1');
        setNewColorName('');
        setShowColorPicker(false);
      }
    }
  };
  
  // Handle removing a color
  const handleRemoveColor = (id: number) => {
    const colorToRemove = colors.find(c => c.id === id);
    if (colorToRemove && colors.length > 2) {
      const success = removeColor(id);
      if (success) {
        toast({
          title: "Color removed",
          description: `${colorToRemove.name} has been removed from your palette.`,
        });
        
        // If we remove the current foreground or background, reset to defaults
        if (id === foregroundId) {
          setForegroundId(colors[0]?.id !== id ? colors[0]?.id : colors[1]?.id);
        }
        if (id === backgroundId) {
          setBackgroundId(colors[1]?.id !== id ? colors[1]?.id : colors[0]?.id);
        }
      }
    } else {
      toast({
        title: "Cannot remove color",
        description: "You must have at least 2 colors in your palette.",
        variant: "destructive"
      });
    }
  };
  
  // Handle exporting the contrast matrix
  const exportMatrix = (format: 'svg' | 'csv') => {
    try {
      const filename = `${projectName.replace(/\s+/g, '-').toLowerCase()}-contrast-matrix`;
      
      if (format === 'svg') {
        const svgContent = generateMatrixSVG(colors, projectName, isDarkMode);
        const blob = new Blob([svgContent], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `${filename}.svg`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        toast({
          title: "SVG exported",
          description: "The contrast matrix has been exported as an SVG file.",
        });
      } else {
        const csvContent = generateMatrixCSV(colors);
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `${filename}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        toast({
          title: "CSV exported",
          description: "The contrast matrix has been exported as a CSV file.",
        });
      }
    } catch (error) {
      toast({
        title: "Export failed",
        description: "There was an error exporting your contrast matrix.",
        variant: "destructive"
      });
    }
  };
  
  // Get compliance status classes
  const getStatusClass = (level: string) => {
    switch (level) {
      case 'AAA':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'AA':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'AA Large':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      default:
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Navbar */}
      <nav className="sticky top-0 z-10 bg-blue-600 dark:bg-blue-800 shadow-md px-4 py-4">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center">
          {/* Logo & Title */}
          <div className="flex items-center gap-3 mb-3 md:mb-0">
            <div className="p-1.5 bg-white/10 rounded-md">
              <Palette className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-white">ContrastKit</h1>
          </div>
          
          {/* Project Name & Theme Toggle */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <Input 
                type="text" 
                id="projectName" 
                value={projectName} 
                onChange={(e) => setProjectName(e.target.value)}
                className="max-w-[250px] h-9 text-sm bg-white/10 border-white/20 text-white placeholder:text-white/70"
                placeholder="Project name"
              />
            </div>
            
            <Button 
              size="icon" 
              variant="outline" 
              onClick={toggleTheme} 
              className="h-9 w-9 border-white/20 text-white hover:bg-white/10 hover:text-white"
            >
              {isDarkMode ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </nav>
      
      {/* Main Content */}
      <main className="flex-grow px-4 py-6">
        <div className="max-w-7xl mx-auto">
          <Tabs defaultValue="analyzer" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full bg-white dark:bg-gray-800 p-1 rounded-xl mb-6 flex flex-wrap gap-2">
              <TabsTrigger 
                value="analyzer" 
                className="flex-1 data-[state=active]:text-white data-[state=active]:bg-blue-600 rounded-lg"
              >
                Analyzer
              </TabsTrigger>
              <TabsTrigger 
                value="matrix" 
                className="flex-1 data-[state=active]:text-white data-[state=active]:bg-blue-600 rounded-lg"
              >
                Contrast Matrix
              </TabsTrigger>
            </TabsList>
            
            {/* Analyzer Tab */}
            <TabsContent value="analyzer" className="pt-2">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left column - Color Palette */}
                <div className="lg:col-span-7 space-y-6">
                  {/* Color Palette Card */}
                  <Card className="overflow-hidden bg-white dark:bg-gray-800">
                    <div className="p-5 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                      <h2 className="text-xl font-semibold">Color Palette</h2>
                      <Button
                        variant={showColorPicker ? "outline" : "default"}
                        onClick={() => setShowColorPicker(!showColorPicker)}
                        className={`h-9 ${showColorPicker ? "" : "bg-green-600 hover:bg-green-700"}`}
                      >
                        {showColorPicker ? (
                          <>
                            <X className="h-4 w-4 mr-2" />
                            <span>Cancel</span>
                          </>
                        ) : (
                          <>
                            <Plus className="h-4 w-4 mr-2" />
                            <span>Add Color</span>
                          </>
                        )}
                      </Button>
                    </div>
                    
                    {/* Color Picker Form */}
                    {showColorPicker && (
                      <div className="p-5 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                          <div className="md:col-span-3 flex items-center">
                            <input 
                              type="color" 
                              value={newColorHex} 
                              onChange={(e) => setNewColorHex(e.target.value)} 
                              className="w-16 h-16 rounded cursor-pointer"
                            />
                          </div>
                          <div className="md:col-span-9 space-y-3">
                            <div>
                              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                                Color Hex
                              </label>
                              <Input 
                                type="text" 
                                value={newColorHex} 
                                onChange={(e) => setNewColorHex(e.target.value)}
                                className="h-9"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                                Color Name
                              </label>
                              <div className="flex gap-2">
                                <Input 
                                  type="text" 
                                  value={newColorName} 
                                  placeholder="Enter color name" 
                                  onChange={(e) => setNewColorName(e.target.value)}
                                  className="h-9 flex-grow"
                                />
                                <Button onClick={handleAddColor} className="h-9 bg-green-600 hover:bg-green-700">
                                  Add
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* Colors Grid - Updated for 2 cards per row on mobile */}
                    <div className="p-5">
                      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {colors.map((color) => (
                          <div 
                            key={color.id} 
                            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden shadow-sm hover:shadow transition-shadow"
                          >
                            <div 
                              className="h-12 w-full"
                              style={{ backgroundColor: color.color }}
                            ></div>
                            <div className="p-2 md:p-3">
                              <div className="flex justify-between items-start">
                                <div className="truncate mr-2">
                                  <div className="font-medium text-xs md:text-sm truncate">{color.name}</div>
                                  <div className="text-xs text-gray-500 dark:text-gray-400 truncate">{color.color}</div>
                                </div>
                                <div className="flex-shrink-0">
                                  <button
                                    className="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md"
                                    onClick={() => handleRemoveColor(color.id)}
                                    disabled={colors.length <= 2}
                                    title="Remove color"
                                  >
                                    <Trash className="h-3.5 w-3.5 md:h-4 md:w-4" />
                                  </button>
                                </div>
                              </div>
                              <div className="flex gap-1.5 md:gap-2 mt-2 md:mt-3">
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className={`flex-1 h-7 md:h-8 text-xs ${foregroundId === color.id ? 'border-blue-500 bg-blue-50 text-blue-700 dark:border-blue-400 dark:bg-blue-900/20 dark:text-blue-400' : ''}`}
                                  onClick={() => setForegroundId(color.id)}
                                >
                                  Text
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className={`flex-1 h-7 md:h-8 text-xs ${backgroundId === color.id ? 'border-purple-500 bg-purple-50 text-purple-700 dark:border-purple-400 dark:bg-purple-900/20 dark:text-purple-400' : ''}`}
                                  onClick={() => setBackgroundId(color.id)}
                                >
                                  BG
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </Card>
                </div>
                
                {/* Right column - Contrast Checker */}
                <div className="lg:col-span-5 space-y-6">
                  {/* Color Preview Card */}
                  <Card className="overflow-hidden bg-white dark:bg-gray-800">
                    <div 
                      className="p-8 flex flex-col items-center justify-center text-center space-y-4"
                      style={{ backgroundColor: background.color }}
                    >
                      <div className="text-4xl font-bold" style={{ color: foreground.color }}>
                        Aa
                      </div>
                      <div className="text-xl font-medium" style={{ color: foreground.color }}>
                        The quick brown fox
                      </div>
                      <div style={{ color: foreground.color }}>
                        jumps over the lazy dog
                      </div>
                    </div>
                    
                    <div className="p-5 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex justify-between items-center mb-5">
                        <div className="flex gap-3 items-center">
                          <div 
                            className="h-8 w-8 rounded-full shadow border border-gray-200 dark:border-gray-700" 
                            style={{ backgroundColor: foreground.color }}
                          ></div>
                          <div>
                            <div className="font-medium text-sm">{foreground.name}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">{foreground.color}</div>
                          </div>
                        </div>
                        
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={swapColors} 
                          className="h-8 px-2"
                        >
                          <ArrowDownUp className="h-4 w-4 mr-2" />
                          <span>Swap</span>
                        </Button>
                        
                        <div className="flex gap-3 items-center">
                          <div>
                            <div className="font-medium text-sm text-right">{background.name}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 text-right">{background.color}</div>
                          </div>
                          <div 
                            className="h-8 w-8 rounded-full shadow border border-gray-200 dark:border-gray-700" 
                            style={{ backgroundColor: background.color }}
                          ></div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between mb-4">
                        <div className="text-lg font-semibold">
                          Contrast Ratio: <span className="text-blue-600 dark:text-blue-400">{Math.round(contrastRatio)}:1</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="flex items-center gap-1"
                              >
                                <Printer className="h-4 w-4" />
                                <span>Export</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={exportAnalyzerPage}>
                                Analyzer Only
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={exportFullReport}>
                                Full Report
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                          <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusClass(complianceLevel)}`}>
                            {complianceLevel}
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 gap-3 mb-4">
                        <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg border-l-4 border-purple-500">
                          <div className="flex items-center justify-between mb-1">
                            <div className="text-sm font-semibold text-purple-800 dark:text-purple-300">UI Components & Graphical Objects</div>
                            {contrastRatio >= 3 ? (
                              <div className="text-green-600 dark:text-green-400 flex items-center">
                                <Check className="h-4 w-4 mr-1" />
                                <span className="text-sm">Pass</span>
                              </div>
                            ) : (
                              <div className="text-red-600 dark:text-red-400 flex items-center">
                                <X className="h-4 w-4 mr-1" />
                                <span className="text-sm">Fail</span>
                              </div>
                            )}
                          </div>
                          <div className="text-xs text-purple-700 dark:text-purple-300">
                            Requires 3:1 or higher - WCAG 2.1 Success Criterion 1.4.11 (Non-text Contrast)
                          </div>
                          <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                            Applies to buttons, form controls, icons, charts, and component boundaries
                          </div>
                        </div>
                      </div>
                      
                      <h3 className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Text Contrast Requirements</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="p-3 bg-gray-50 dark:bg-gray-900/40 rounded-lg">
                          <div className="flex items-center justify-between mb-1">
                            <div className="text-sm font-medium">Normal Text (AA)</div>
                            {contrastRatio >= 4.5 ? (
                              <div className="text-green-600 dark:text-green-400 flex items-center">
                                <Check className="h-4 w-4 mr-1" />
                                <span className="text-sm">Pass</span>
                              </div>
                            ) : (
                              <div className="text-red-600 dark:text-red-400 flex items-center">
                                <X className="h-4 w-4 mr-1" />
                                <span className="text-sm">Fail</span>
                              </div>
                            )}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            Requires 4.5:1 or higher
                          </div>
                        </div>
                        
                        <div className="p-3 bg-gray-50 dark:bg-gray-900/40 rounded-lg">
                          <div className="flex items-center justify-between mb-1">
                            <div className="text-sm font-medium">Normal Text (AAA)</div>
                            {contrastRatio >= 7 ? (
                              <div className="text-green-600 dark:text-green-400 flex items-center">
                                <Check className="h-4 w-4 mr-1" />
                                <span className="text-sm">Pass</span>
                              </div>
                            ) : (
                              <div className="text-red-600 dark:text-red-400 flex items-center">
                                <X className="h-4 w-4 mr-1" />
                                <span className="text-sm">Fail</span>
                              </div>
                            )}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            Requires 7:1 or higher
                          </div>
                        </div>
                        
                        <div className="p-3 bg-gray-50 dark:bg-gray-900/40 rounded-lg">
                          <div className="flex items-center justify-between mb-1">
                            <div className="text-sm font-medium">AA Large Text</div>
                            {contrastRatio >= 3 ? (
                              <div className="text-green-600 dark:text-green-400 flex items-center">
                                <Check className="h-4 w-4 mr-1" />
                                <span className="text-sm">Pass</span>
                              </div>
                            ) : (
                              <div className="text-red-600 dark:text-red-400 flex items-center">
                                <X className="h-4 w-4 mr-1" />
                                <span className="text-sm">Fail</span>
                              </div>
                            )}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            Requires 3:1 or higher
                          </div>
                        </div>
                        
                        <div className="p-3 bg-gray-50 dark:bg-gray-900/40 rounded-lg">
                          <div className="flex items-center justify-between mb-1">
                            <div className="text-sm font-medium">AAA Large Text</div>
                            {contrastRatio >= 4.5 ? (
                              <div className="text-green-600 dark:text-green-400 flex items-center">
                                <Check className="h-4 w-4 mr-1" />
                                <span className="text-sm">Pass</span>
                              </div>
                            ) : (
                              <div className="text-red-600 dark:text-red-400 flex items-center">
                                <X className="h-4 w-4 mr-1" />
                                <span className="text-sm">Fail</span>
                              </div>
                            )}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            Requires 4.5:1 or higher
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                  
                  {/* WCAG Guidelines Card */}
                  <Card className="bg-white dark:bg-gray-800 overflow-hidden">
                    <div className="p-5 border-b border-gray-200 dark:border-gray-700">
                      <h2 className="text-xl font-semibold flex items-center gap-2">
                        <HelpCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        WCAG Guidelines
                      </h2>
                    </div>
                    <div className="p-5">
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        <p className="mb-3">The Web Content Accessibility Guidelines (WCAG) define minimum contrast requirements:</p>
                        
                        <div className="space-y-3">
                          <div className="bg-gray-50 dark:bg-gray-900/50 p-3 rounded-lg">
                            <div className="font-semibold text-green-600 dark:text-green-400 mb-1">AAA Level (Enhanced)</div>
                            <div className="flex flex-col space-y-1">
                              <div>• <span className="font-medium">7:1</span> - Normal text</div>
                              <div>• <span className="font-medium">4.5:1</span> - <span className="font-medium">AAA Large</span> - Large text (18pt+ or 14pt+ bold)</div>
                            </div>
                          </div>
                          
                          <div className="bg-gray-50 dark:bg-gray-900/50 p-3 rounded-lg">
                            <div className="font-semibold text-blue-600 dark:text-blue-400 mb-1">AA Level (Minimum)</div>
                            <div className="flex flex-col space-y-1">
                              <div>• <span className="font-medium">4.5:1</span> - Normal text</div>
                              <div>• <span className="font-medium">3:1</span> - <span className="font-medium">AA Large</span> - Large text (18pt+ or 14pt+ bold)</div>
                            </div>
                          </div>
                          
                          <div className="bg-gray-50 dark:bg-gray-900/50 p-3 rounded-lg">
                            <div className="font-semibold text-purple-600 dark:text-purple-400 mb-1">Graphical Objects and UI Components</div>
                            <div className="flex flex-col space-y-1">
                              <div>• <span className="font-medium">3:1</span> - Required for all user interface components and graphical objects</div>
                              <div>• This includes buttons, form controls, icons, charts, and infographics</div>
                              <div>• Applies to boundaries and visual information required to identify components and states</div>
                            </div>
                          </div>
                          
                          <div className="mt-3 text-xs text-gray-500 dark:text-gray-400">
                            <p>Large text is defined as 18pt and larger, or 14pt and larger if bold.</p>
                            <p>These guidelines help ensure content is readable for people with visual impairments.</p>
                            <p className="mt-1">The 3:1 ratio for UI components is required by WCAG 2.1 Success Criterion 1.4.11 (Non-text Contrast).</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            </TabsContent>
            
            {/* Matrix Tab */}
            <TabsContent value="matrix" className="pt-2">
              <Card className="bg-white dark:bg-gray-800 overflow-hidden">
                <div className="p-5 border-b border-gray-200 dark:border-gray-700 flex flex-wrap justify-between items-center gap-4">
                  <div className="flex items-center gap-4">
                    <h2 className="text-xl font-semibold">Contrast Matrix</h2>
                    
                    <div className="flex gap-2">
                      {/* Add color with hex button */}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowColorForm(true)}
                        className="h-8 w-8 p-0 rounded-full bg-green-100 hover:bg-green-200 text-green-700 dark:bg-green-900/30 dark:hover:bg-green-800/50 dark:text-green-400"
                        title="Add color with hex code"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                      
                      {/* Remove color dropdown */}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 p-0 rounded-full bg-red-100 hover:bg-red-200 text-red-700 dark:bg-red-900/30 dark:hover:bg-red-800/50 dark:text-red-400"
                            title="Remove colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                          <div className="px-2 py-1.5 text-xs text-gray-500 dark:text-gray-400">
                            Select color to remove:
                          </div>
                          {colors.map(color => (
                            <DropdownMenuItem 
                              key={color.id} 
                              onClick={() => handleRemoveColor(color.id)}
                              disabled={colors.length <= 2}
                              className="flex items-center"
                            >
                              <div 
                                className="h-4 w-4 mr-2" 
                                style={{ 
                                  backgroundColor: color.color,
                                  border: color.color === '#FFFFFF' ? '1px solid #e5e7eb' : 'none' 
                                }} 
                              />
                              <span className="flex-grow">{color.name}</span>
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        const svgData = generateMatrixSVG(colors, projectName, isDarkMode);
                        navigator.clipboard.writeText(svgData);
                        toast({
                          title: "SVG Copied",
                          description: "Matrix SVG has been copied to clipboard",
                        });
                      }}
                      className="flex items-center gap-2"
                    >
                      <Copy className="h-4 w-4" />
                      <span>Copy SVG</span>
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => exportMatrix('svg')}
                      className="flex items-center gap-2"
                    >
                      <Download className="h-4 w-4" />
                      <span>Export SVG</span>
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => exportMatrix('csv')}
                      className="flex items-center gap-2"
                    >
                      <Download className="h-4 w-4" />
                      <span>Export CSV</span>
                    </Button>

                  </div>
                </div>
                
                <div className="px-5 py-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/40">
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                    <div className="text-sm font-medium">Contrast Ratio Guide:</div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                      <div className="flex items-center">
                        <div className="rounded px-1.5 py-0.5 text-xs font-bold bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 mr-1.5">7:1+</div>
                        <span className="text-sm text-gray-700 dark:text-gray-300">AAA</span>
                      </div>
                      <div className="flex items-center">
                        <div className="rounded px-1.5 py-0.5 text-xs font-bold bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 mr-1.5">4.5:1+</div>
                        <span className="text-sm text-gray-700 dark:text-gray-300">AA</span>
                      </div>
                      <div className="flex items-center">
                        <div className="rounded px-1.5 py-0.5 text-xs font-bold bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 mr-1.5">3:1+</div>
                        <span className="text-sm text-gray-700 dark:text-gray-300">AA Large</span>
                      </div>
                      <div className="flex items-center">
                        <div className="rounded px-1.5 py-0.5 text-xs font-bold bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 mr-1.5">&lt;3:1</div>
                        <span className="text-sm text-gray-700 dark:text-gray-300">Fail</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="p-5 overflow-x-auto">
                  <div className="text-sm text-gray-500 dark:text-gray-400 mb-3 italic">
                    Tip: Scroll horizontally if needed to view the full matrix
                  </div>
                  <div className="min-w-[640px]">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr>
                          <th className="p-2 border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/40 text-left sticky left-0 z-10">
                            <div className="font-semibold text-sm">
                              {projectName}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              Foreground / Background
                            </div>
                          </th>
                          {colors.map(bgColor => (
                            <th key={bgColor.id} className="p-2 border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/40 min-w-[90px]">
                              <div className="flex flex-col items-center">
                                <div 
                                  className="h-14 w-14" 
                                  style={{ 
                                    backgroundColor: bgColor.color,
                                    border: bgColor.color === '#FFFFFF' ? '1px solid #e5e7eb' : 'none' 
                                  }}
                                  title={`${bgColor.name} (${bgColor.color})`}
                                ></div>
                                <div className="text-xs font-medium mt-2 truncate max-w-[80px] mx-auto">{bgColor.name}</div>
                                <div className="text-[10px] text-gray-500 dark:text-gray-400">{bgColor.color}</div>
                              </div>
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {colors.map(fgColor => (
                          <tr key={fgColor.id}>
                            <th className="p-2 border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/40 sticky left-0 z-10">
                              <div className="flex items-center gap-3">
                                <div 
                                  className="h-12 w-12" 
                                  style={{ 
                                    backgroundColor: fgColor.color,
                                    border: fgColor.color === '#FFFFFF' ? '1px solid #e5e7eb' : 'none' 
                                  }}
                                  title={`${fgColor.name} (${fgColor.color})`}
                                ></div>
                                <div>
                                  <div className="text-xs font-medium truncate max-w-[100px] text-left">{fgColor.name}</div>
                                  <div className="text-[10px] text-gray-500 dark:text-gray-400">{fgColor.color}</div>
                                </div>
                              </div>
                            </th>
                            {colors.map(bgColor => {
                              const ratio = calculateContrastRatio(fgColor.color, bgColor.color);
                              const level = getComplianceLevel(ratio);
                              
                              return (
                                <td 
                                  key={`${fgColor.id}-${bgColor.id}`} 
                                  className="p-0 border border-gray-200 dark:border-gray-700 relative"
                                  style={{ width: '90px', height: '90px' }}
                                >
                                  {fgColor.id === bgColor.id ? (
                                    <div className="w-full h-full relative">
                                      {/* Full-size square for same color */}
                                      <div className="absolute inset-0" 
                                        style={{ 
                                          backgroundColor: bgColor.color,
                                          border: bgColor.color === '#FFFFFF' ? '1px solid #e5e7eb' : 'none' 
                                        }}>
                                      </div>
                                      {/* Diagonal line to indicate same color */}
                                      <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="w-full border-t-2 border-dashed border-gray-400 dark:border-gray-500"></div>
                                      </div>
                                      
                                      {/* Label */}
                                      <div className="absolute inset-x-0 bottom-2 text-center">
                                        <span className="text-xs px-1.5 py-0.5 rounded bg-white bg-opacity-90 dark:bg-gray-800 dark:bg-opacity-90 text-gray-600 dark:text-gray-300">
                                          Same Color
                                        </span>
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="w-full h-full relative">
                                      {/* Full-size outer square (background color) */}
                                      <div className="absolute inset-0" 
                                        style={{ 
                                          backgroundColor: bgColor.color,
                                          border: bgColor.color === '#FFFFFF' ? '1px solid #e5e7eb' : 'none' 
                                        }}>
                                      </div>
                                      
                                      {/* Inner square (foreground color) - 50% of outer square, perfectly centered */}
                                      <div className="absolute left-1/4 top-1/4 right-1/4 bottom-1/4" 
                                        style={{ 
                                          backgroundColor: fgColor.color,
                                          border: fgColor.color === '#FFFFFF' ? '1px solid #e5e7eb' : 'none' 
                                        }}>
                                      </div>
                                      
                                      {/* Contrast ratio in top-right corner */}
                                      <div className="absolute top-1 right-1 pointer-events-none">
                                        <div className={`px-2 py-0.5 rounded text-xs font-bold shadow-sm ${
                                          ratio >= 7 ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 
                                          (ratio >= 4.5 ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' : 
                                          (ratio >= 3 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'))
                                        }`}>
                                          {Math.round(ratio)}:1
                                        </div>
                                      </div>
                                      
                                      {/* Accessibility level at bottom */}
                                      <div className="absolute inset-x-0 bottom-2 text-center">
                                        <span className={`text-xs px-1.5 py-0.5 rounded-full ${getStatusClass(level)}`}>
                                          {level}
                                        </span>
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
                </div>
              </Card>
            </TabsContent>

          </Tabs>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="py-6 px-4 border-t border-gray-200 dark:border-gray-800 text-center">
        <div className="max-w-7xl mx-auto space-y-2">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Designed with ❤️ for all creative minds
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Created by <a href="https://linktr.ee/hsm_ze" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">Hussam Zeghouan</a>
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 flex justify-center space-x-4">
            <a href="https://instagram.com/hsm_ze" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">Instagram</a>
            <span className="text-gray-400">|</span>
            <a href="https://www.behance.net/hsm_ze" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">Behance</a>
            <span className="text-gray-400">|</span>
            <a href="https://linktr.ee/hsm_ze" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">Linktree</a>
          </p>
        </div>
      </footer>

      {/* Add Color Dialog */}
      <Dialog open={showColorForm} onOpenChange={setShowColorForm}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Add New Color</DialogTitle>
            <p className="text-sm text-muted-foreground">
              Enter a custom color
            </p>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4">
            <div className="md:col-span-3 flex items-center justify-center">
              <input 
                type="color" 
                value={newColorHex} 
                onChange={(e) => setNewColorHex(e.target.value)} 
                className="w-20 h-20 rounded cursor-pointer"
              />
            </div>
            <div className="md:col-span-9 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                  Color Hex
                </label>
                <Input 
                  type="text" 
                  value={newColorHex} 
                  onChange={(e) => setNewColorHex(e.target.value)}
                  className="h-9"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                  Color Name
                </label>
                <Input 
                  type="text" 
                  value={newColorName} 
                  placeholder="Enter color name" 
                  onChange={(e) => setNewColorName(e.target.value)}
                  className="h-9"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowColorForm(false)}
            >
              Cancel
            </Button>
            <Button 
              onClick={() => {
                const success = addColor(newColorHex, newColorName || `Color ${colors.length + 1}`);
                if (success) {
                  toast({
                    title: "Color Added",
                    description: `${newColorName || newColorHex} has been added to your palette.`,
                  });
                  setShowColorForm(false);
                  setNewColorHex('#000000');
                  setNewColorName('');
                } else {
                  toast({
                    title: "Cannot Add Color",
                    description: "Maximum of 10 colors reached.",
                    variant: "destructive"
                  });
                }
              }}
            >
              Add Color
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ContrastKit;
