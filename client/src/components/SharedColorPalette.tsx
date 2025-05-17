import { useState } from 'react';
import { PlusCircle, Trash, Share, Globe, Check, X } from 'lucide-react';
import { useWebSocket } from '@/hooks/useWebSocket';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Color } from '@/hooks/useColorPalette';

interface SharedColorPaletteProps {
  localColors: Color[];
  onAddToLocalPalette: (color: string, name: string) => boolean;
}

export const SharedColorPalette = ({ localColors, onAddToLocalPalette }: SharedColorPaletteProps) => {
  const { connected, sharedColors, shareColor, removeSharedColor, error } = useWebSocket();
  const { toast } = useToast();
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [selectedLocalColor, setSelectedLocalColor] = useState<Color | null>(null);
  
  // Handle sharing a local color
  const handleShareColor = () => {
    if (selectedLocalColor) {
      shareColor({
        color: selectedLocalColor.color,
        name: selectedLocalColor.name
      });
      setShowShareDialog(false);
      setSelectedLocalColor(null);
      toast({
        title: "Color Shared",
        description: `${selectedLocalColor.name} has been shared with other users.`,
      });
    }
  };
  
  // Handle adding a shared color to local palette
  const handleAddToLocalPalette = (color: Color) => {
    const success = onAddToLocalPalette(color.color, color.name);
    if (success) {
      toast({
        title: "Color Added",
        description: `${color.name} has been added to your local palette.`,
      });
    } else {
      toast({
        title: "Cannot Add Color",
        description: "Maximum number of colors reached in your local palette.",
        variant: "destructive"
      });
    }
  };
  
  // Check if a shared color already exists in local palette
  const isInLocalPalette = (sharedColor: Color) => {
    return localColors.some(
      c => c.color.toLowerCase() === sharedColor.color.toLowerCase()
    );
  };
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold">Shared Color Palette</h3>
          {connected ? (
            <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
              <Globe className="h-3 w-3 mr-1" />
              Connected
            </Badge>
          ) : (
            <Badge variant="outline" className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
              <X className="h-3 w-3 mr-1" />
              Disconnected
            </Badge>
          )}
        </div>
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setShowShareDialog(true)}
          disabled={!connected}
          className="flex items-center gap-1"
        >
          <Share className="h-4 w-4 mr-1" />
          Share Color
        </Button>
      </div>
      
      {/* Don't show WebSocket errors to user - they're often due to network issues that can't be fixed by the user */}
      {/* Instead, just show a friendly message if disconnected */}
      {!connected && (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 dark:bg-amber-950 dark:border-amber-800 dark:text-amber-200 p-3 rounded-md text-sm">
          Not connected to collaboration server. Shared palette features will be disabled.
        </div>
      )}
      
      {sharedColors.length === 0 ? (
        <div className="border border-dashed border-gray-300 dark:border-gray-700 rounded-md p-4 text-center">
          <p className="text-muted-foreground text-sm">No shared colors yet. Share a color to get started!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {sharedColors.map((color) => (
            <Card key={color.id} className="overflow-hidden">
              <div 
                className="h-24 w-full" 
                style={{ backgroundColor: color.color }}
              ></div>
              <CardHeader className="py-3">
                <CardTitle className="text-base flex items-center justify-between">
                  <span>{color.name}</span>
                  <span className="text-xs font-mono text-muted-foreground">
                    {color.color.toUpperCase()}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardFooter className="pt-0 pb-3 flex justify-between">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeSharedColor(color.id)}
                      >
                        <Trash className="h-4 w-4 text-red-500" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Remove from shared palette</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant={isInLocalPalette(color) ? "ghost" : "secondary"}
                        size="sm"
                        onClick={() => handleAddToLocalPalette(color)}
                        disabled={isInLocalPalette(color)}
                      >
                        {isInLocalPalette(color) ? (
                          <Check className="h-4 w-4 text-green-500" />
                        ) : (
                          <PlusCircle className="h-4 w-4 mr-1" />
                        )}
                        {isInLocalPalette(color) ? 'Added' : 'Add to Palette'}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{isInLocalPalette(color) 
                        ? 'Already in your palette' 
                        : 'Add to your local palette'}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
      
      {/* Dialog for sharing a local color */}
      <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Share Color</DialogTitle>
            <DialogDescription>
              Select a color from your palette to share with others.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {localColors.map((color) => (
                <button
                  key={color.id}
                  onClick={() => setSelectedLocalColor(color)}
                  className={`h-16 rounded-md relative flex flex-col items-center justify-center overflow-hidden group border-2 transition-all
                    ${selectedLocalColor?.id === color.id 
                      ? 'border-blue-500 dark:border-blue-400 ring-2 ring-blue-300 dark:ring-blue-700' 
                      : 'border-transparent hover:border-gray-200 dark:hover:border-gray-700'
                    }`}
                  style={{ backgroundColor: color.color }}
                >
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-black bg-opacity-50 flex items-center justify-center transition-opacity">
                    <span className="text-xs text-white font-medium truncate px-1">{color.name}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowShareDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleShareColor}
              disabled={!selectedLocalColor}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Share className="h-4 w-4 mr-2" />
              Share Color
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SharedColorPalette;