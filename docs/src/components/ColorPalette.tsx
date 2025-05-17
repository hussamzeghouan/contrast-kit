import { useState } from 'react';
import { Trash, Edit, Palette } from 'lucide-react';
import { Color } from '@/hooks/useColorPalette';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface ColorPaletteProps {
  colors: Color[];
  addColor: (color: string, name: string) => boolean;
  removeColor: (id: number) => boolean;
  updateColor: (id: number, color?: string, name?: string) => void;
  onSelectAsForeground: (id: number) => void;
  onSelectAsBackground: (id: number) => void;
}

export const ColorPalette = ({
  colors,
  addColor,
  removeColor,
  updateColor,
  onSelectAsForeground,
  onSelectAsBackground
}: ColorPaletteProps) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newColorHex, setNewColorHex] = useState('#000000');
  const [newColorName, setNewColorName] = useState('');
  const [editingColorId, setEditingColorId] = useState<number | null>(null);
  const [editColorHex, setEditColorHex] = useState('');
  const [editColorName, setEditColorName] = useState('');

  // Handle adding a new color
  const handleAddColor = () => {
    if (newColorHex) {
      const success = addColor(newColorHex, newColorName);
      if (success) {
        setShowAddForm(false);
        setNewColorHex('#000000');
        setNewColorName('');
      }
    }
  };

  // Start editing a color
  const startEditing = (color: Color) => {
    setEditingColorId(color.id);
    setEditColorHex(color.color);
    setEditColorName(color.name);
  };

  // Save edits to a color
  const saveEditing = () => {
    if (editingColorId !== null) {
      updateColor(editingColorId, editColorHex, editColorName);
      setEditingColorId(null);
    }
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditingColorId(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
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
            className="text-blue-600 dark:text-blue-400"
          >
            <circle cx="19" cy="5" r="3"/>
            <circle cx="5" cy="12" r="3"/>
            <circle cx="12" cy="19" r="3"/>
            <line x1="5" y1="12" x2="12" y2="19"/>
            <line x1="12" y1="19" x2="19" y2="5"/>
          </svg>
          Color Palette
        </h2>
        
        <Button
          onClick={() => setShowAddForm(!showAddForm)}
          disabled={colors.length >= 10}
          className={`px-4 py-2 flex items-center gap-2 ${showAddForm ? 'bg-gray-500 hover:bg-gray-600' : 'bg-green-600 hover:bg-green-700'}`}
        >
          {showAddForm ? (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
              <span>Cancel</span>
            </>
          ) : (
            <>
              <Palette className="w-4 h-4" />
              <span>Add Color</span>
            </>
          )}
        </Button>
      </div>
      
      {showAddForm && (
        <Card className="p-4 bg-white dark:bg-gray-800 rounded-md shadow border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium mb-3">Add New Color</h3>
          <div className="space-y-4">
            <div>
              <label htmlFor="newColorHex" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Color Hex
              </label>
              <div className="flex gap-3">
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
                  className="pl-3 pr-10 py-2 flex-grow"
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
                className="pl-3 pr-10 py-2 w-full"
              />
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setShowAddForm(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddColor}>
                Add Color
              </Button>
            </div>
          </div>
        </Card>
      )}
      
      {/* Optimized color cards grid with smaller spacing */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {colors.map((color) => (
          <Card key={color.id} className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow">
            {editingColorId === color.id ? (
              <div className="p-4">
                <div className="mb-3">
                  <label className="block text-sm font-medium mb-1">Color</label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={editColorHex}
                      onChange={(e) => setEditColorHex(e.target.value)}
                      className="h-8 w-8 rounded"
                    />
                    <Input
                      type="text"
                      value={editColorHex}
                      onChange={(e) => setEditColorHex(e.target.value)}
                      className="flex-grow"
                    />
                  </div>
                </div>
                <div className="mb-3">
                  <label className="block text-sm font-medium mb-1">Name</label>
                  <Input
                    type="text"
                    value={editColorName}
                    onChange={(e) => setEditColorName(e.target.value)}
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" size="sm" onClick={cancelEditing}>
                    Cancel
                  </Button>
                  <Button size="sm" onClick={saveEditing}>
                    Save
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <div className="h-20 w-full" style={{ backgroundColor: color.color }}></div>
                <div className="p-4">
                  <div className="flex justify-between items-center mb-3">
                    <div className="font-medium">{color.name}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{color.color}</div>
                  </div>
                  <div className="flex justify-between gap-2">
                    <div className="flex gap-2">
                      <button 
                        className="p-2 rounded text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        onClick={() => startEditing(color)}
                      >
                        <Edit size={16} />
                      </button>
                      <button 
                        className="p-2 rounded text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                        onClick={() => removeColor(color.id)}
                        disabled={colors.length <= 2}
                      >
                        <Trash size={16} />
                      </button>
                    </div>
                    <div className="flex gap-1">
                      <button 
                        className="flex items-center gap-1 px-2 py-1 rounded hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-900"
                        onClick={() => onSelectAsForeground(color.id)}
                        title="Set as foreground color (text color)"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M4 7L12 3L20 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M7 10L17 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                          <path d="M9 14L15 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                          <path d="M11 18L13 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                        <span className="text-xs font-medium">Text</span>
                      </button>
                      <button 
                        className="flex items-center gap-1 px-2 py-1 rounded hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors text-purple-700 dark:text-purple-400 border border-purple-200 dark:border-purple-900"
                        onClick={() => onSelectAsBackground(color.id)}
                        title="Set as background color"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
                          <path d="M3 9L21 9" stroke="currentColor" strokeWidth="2"/>
                        </svg>
                        <span className="text-xs font-medium">BG</span>
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ColorPalette;
