import { useState, useEffect } from 'react';
import { Search, Check, Plus, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  pantoneCollections, 
  PantoneColor, 
  findPantoneColorByHex, 
  searchPantoneColors 
} from '@/lib/pantoneColors';

interface PantoneColorPickerProps {
  currentColor: string;
  onSelectColor: (color: string, name: string) => void;
  onClose?: () => void;
}

const PantoneColorPicker = ({ currentColor, onSelectColor, onClose }: PantoneColorPickerProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('Basic');
  const [hexInput, setHexInput] = useState(currentColor || '#000000');
  const [colorName, setColorName] = useState('');
  const [searchResults, setSearchResults] = useState<PantoneColor[]>([]);
  const [selectedColor, setSelectedColor] = useState<PantoneColor | null>(null);
  
  // Auto-suggest a color name when hex is changed
  useEffect(() => {
    if (hexInput) {
      const pantoneColor = findPantoneColorByHex(hexInput);
      if (pantoneColor) {
        setColorName(pantoneColor.name);
        setSelectedColor(pantoneColor);
      }
    }
  }, [hexInput]);
  
  // Search when search term changes
  useEffect(() => {
    if (searchTerm.length > 0) {
      const results = searchPantoneColors(searchTerm);
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  }, [searchTerm]);
  
  // Calculate contrasting text color for the swatch
  const getContrastColor = (hex: string) => {
    // Convert hex to RGB
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    
    // Calculate brightness (using relative luminance)
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    
    // Return black for light colors, white for dark colors
    return brightness > 128 ? '#000000' : '#ffffff';
  };
  
  return (
    <div className="space-y-4">
      {/* Color Preview and Input */}
      <div className="flex flex-col sm:flex-row gap-6">
        <div className="flex-shrink-0 flex flex-col items-center gap-2">
          <div 
            className="h-28 w-28 rounded-md border border-gray-200 dark:border-gray-700 relative shadow-md" 
            style={{ backgroundColor: hexInput }}
          >
            {selectedColor && (
              <div className="absolute bottom-0 left-0 right-0 flex flex-col items-center p-2 bg-black bg-opacity-75">
                <span className="text-sm text-white font-medium text-center">{selectedColor.name}</span>
                {selectedColor.pantoneCode && (
                  <span className="text-xs text-white/90 mt-0.5">{selectedColor.pantoneCode}</span>
                )}
              </div>
            )}
          </div>
          
          {selectedColor?.pantoneCode && (
            <Badge variant="outline" className="text-xs font-medium">
              {selectedColor.pantoneCode}
            </Badge>
          )}
        </div>
        
        <div className="flex-1 space-y-4">
          <div>
            <label htmlFor="hexInput" className="text-sm font-medium mb-1 block">Hex Color</label>
            <Input
              id="hexInput"
              value={hexInput}
              onChange={(e) => {
                setHexInput(e.target.value);
                if (!e.target.value.match(/^#?([0-9A-F]{6})$/i)) {
                  setSelectedColor(null);
                }
              }}
              placeholder="#000000"
              className="font-mono"
            />
          </div>
          <div>
            <label htmlFor="colorName" className="text-sm font-medium mb-1 block">Color Name</label>
            <Input
              id="colorName"
              value={colorName}
              onChange={(e) => setColorName(e.target.value)}
              placeholder="Enter a name for this color"
            />
          </div>
          
          {selectedColor && (
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-md p-3">
              <h4 className="text-sm font-medium mb-1">Selected Pantone Color</h4>
              <div className="text-sm text-gray-700 dark:text-gray-300">
                {selectedColor.name}
                {selectedColor.pantoneCode && <span className="block text-xs text-gray-500 dark:text-gray-400 mt-1">Code: {selectedColor.pantoneCode}</span>}
                {selectedColor.year && <span className="block text-xs text-gray-500 dark:text-gray-400">Year: {selectedColor.year}</span>}
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Search */}
      <div>
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search Pantone colors..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm('')}
              className="absolute right-2 top-2.5 h-4 w-4 text-muted-foreground hover:text-foreground"
            >
              <X size={16} />
            </button>
          )}
        </div>
        
        {/* Search Results */}
        {searchResults.length > 0 && (
          <div className="mt-2 border border-gray-200 dark:border-gray-700 rounded-md p-3">
            <h4 className="text-sm font-medium mb-2">Search Results</h4>
            <ScrollArea className="h-28">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                {searchResults.map((color, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setHexInput(color.hex);
                      setColorName(color.name);
                      setSelectedColor(color);
                    }}
                    className="h-12 rounded-md relative flex flex-col items-center justify-center border border-gray-200 dark:border-gray-700 overflow-hidden group"
                    style={{ backgroundColor: color.hex }}
                    title={`${color.name} (${color.hex})`}
                  >
                    {selectedColor?.hex === color.hex && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-25">
                        <Check className="h-4 w-4 text-white" />
                      </div>
                    )}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-black bg-opacity-75 flex flex-col items-center justify-center transition-opacity p-1">
                      <span className="text-xs text-white font-medium text-center">{color.name}</span>
                      {color.pantoneCode && (
                        <span className="text-[10px] text-white/90 mt-0.5">{color.pantoneCode}</span>
                      )}
                      {color.year && (
                        <span className="text-[10px] text-white/80 mt-0.5">{color.year}</span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}
      </div>
      
      {/* Pantone Libraries */}
      {searchResults.length === 0 && (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full h-auto flex flex-wrap">
            {pantoneCollections.map((collection) => (
              <TabsTrigger 
                key={collection.name}
                value={collection.name}
                className="flex-1 text-xs py-1.5"
              >
                {collection.name}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {pantoneCollections.map((collection) => (
            <TabsContent key={collection.name} value={collection.name} className="mt-2">
              <div className="border border-gray-200 dark:border-gray-700 rounded-md p-3">
                <h4 className="text-sm font-medium mb-1">{collection.name}</h4>
                <p className="text-xs text-muted-foreground mb-2">{collection.description}</p>
                <ScrollArea className="h-36">
                  <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
                    {collection.colors.map((color, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setHexInput(color.hex);
                          setColorName(color.name);
                          setSelectedColor(color);
                        }}
                        className="h-10 rounded-md relative flex items-center justify-center border border-gray-200 dark:border-gray-700 overflow-hidden group"
                        style={{ backgroundColor: color.hex }}
                        title={`${color.name} (${color.hex})`}
                      >
                        {selectedColor?.hex === color.hex && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-25">
                            <Check className="h-4 w-4" style={{ color: getContrastColor(color.hex) }} />
                          </div>
                        )}
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-black bg-opacity-75 flex flex-col items-center justify-center transition-opacity p-1">
                          <span className="text-xs text-white font-medium text-center">{color.name}</span>
                          {color.pantoneCode && (
                            <span className="text-[10px] text-white/90 mt-0.5">{color.pantoneCode}</span>
                          )}
                          {color.year && (
                            <span className="text-[10px] text-white/80 mt-0.5">{color.year}</span>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      )}
      
      {/* Action buttons */}
      <div className="flex justify-end gap-2 pt-2">
        {onClose && (
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
        )}
        <Button 
          onClick={() => onSelectColor(hexInput, colorName)}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Color
        </Button>
      </div>
    </div>
  );
};

export default PantoneColorPicker;