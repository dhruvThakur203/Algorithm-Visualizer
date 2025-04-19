
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  PlayCircle, 
  PauseCircle, 
  RotateCcw, 
  ChevronRight,
  ChevronLeft,
  SkipForward,
  SkipBack
} from "lucide-react";
import { SortingAlgorithm } from "@/algorithms/sortingAlgorithms";
import { SearchingAlgorithm } from "@/algorithms/searchingAlgorithms";

interface ControlPanelProps {
  algorithmType: "sorting" | "searching";
  sortingAlgorithms: SortingAlgorithm[];
  searchingAlgorithms: SearchingAlgorithm[];
  selectedAlgorithm: string;
  arraySize: number;
  animationSpeed: number;
  isPlaying: boolean;
  targetValue: number;
  onAlgorithmTypeChange: (type: "sorting" | "searching") => void;
  onAlgorithmChange: (algorithm: string) => void;
  onArraySizeChange: (size: number) => void;
  onAnimationSpeedChange: (speed: number) => void;
  onGenerateNewArray: () => void;
  onPlayPause: () => void;
  onReset: () => void;
  onStepForward: () => void;
  onStepBackward: () => void;
  onSkipToStart: () => void;
  onSkipToEnd: () => void;
  onTargetValueChange: (value: number) => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  algorithmType,
  sortingAlgorithms,
  searchingAlgorithms,
  selectedAlgorithm,
  arraySize,
  animationSpeed,
  isPlaying,
  targetValue,
  onAlgorithmTypeChange,
  onAlgorithmChange,
  onArraySizeChange,
  onAnimationSpeedChange,
  onGenerateNewArray,
  onPlayPause,
  onReset,
  onStepForward,
  onStepBackward,
  onSkipToStart,
  onSkipToEnd,
  onTargetValueChange,
}) => {
  return (
    <div className="bg-white rounded-t-lg border-b shadow-md p-4">
      <Tabs defaultValue={algorithmType} onValueChange={(value) => onAlgorithmTypeChange(value as "sorting" | "searching")}>
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="sorting">Sorting Algorithms</TabsTrigger>
          <TabsTrigger value="searching">Searching Algorithms</TabsTrigger>
        </TabsList>

        <TabsContent value="sorting" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="sortingAlgorithm">Algorithm</Label>
              <Select value={selectedAlgorithm} onValueChange={onAlgorithmChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select algorithm" />
                </SelectTrigger>
                <SelectContent>
                  {sortingAlgorithms.map((algorithm) => (
                    <SelectItem key={algorithm.key} value={algorithm.key}>
                      {algorithm.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="arraySize">Array Size: {arraySize}</Label>
              <Slider
                id="arraySize"
                min={5}
                max={100}
                step={1}
                value={[arraySize]}
                onValueChange={(value) => onArraySizeChange(value[0])}
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="animationSpeed">Animation Speed</Label>
              <Slider
                id="animationSpeed"
                min={1}
                max={10}
                step={1}
                value={[animationSpeed]}
                onValueChange={(value) => onAnimationSpeedChange(value[0])}
                className="mt-2"
              />
            </div>

            <div className="flex items-end">
              <Button onClick={onGenerateNewArray} variant="outline" className="w-full">
                Generate New Array
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="searching" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="searchingAlgorithm">Algorithm</Label>
              <Select value={selectedAlgorithm} onValueChange={onAlgorithmChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select algorithm" />
                </SelectTrigger>
                <SelectContent>
                  {searchingAlgorithms.map((algorithm) => (
                    <SelectItem key={algorithm.key} value={algorithm.key}>
                      {algorithm.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="arraySize">Array Size: {arraySize}</Label>
              <Slider
                id="arraySize"
                min={5}
                max={50}
                step={1}
                value={[arraySize]}
                onValueChange={(value) => onArraySizeChange(value[0])}
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="targetValue">Target Value</Label>
              <Input
                id="targetValue"
                type="number"
                value={targetValue}
                onChange={(e) => onTargetValueChange(parseInt(e.target.value) || 0)}
                className="mt-2"
              />
            </div>

            <div className="flex items-end">
              <Button onClick={onGenerateNewArray} variant="outline" className="w-full">
                Generate New Array
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex justify-center mt-4 space-x-2">
        <Button 
          variant="outline" 
          size="icon"
          onClick={onSkipToStart}
          title="Skip to start"
        >
          <SkipBack className="h-4 w-4" />
        </Button>
        <Button 
          variant="outline" 
          size="icon"
          onClick={onStepBackward}
          title="Step backward"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button 
          variant="default" 
          size="icon"
          onClick={onPlayPause}
          title={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? (
            <PauseCircle className="h-4 w-4" />
          ) : (
            <PlayCircle className="h-4 w-4" />
          )}
        </Button>
        <Button 
          variant="outline" 
          size="icon"
          onClick={onStepForward}
          title="Step forward"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
        <Button 
          variant="outline" 
          size="icon"
          onClick={onSkipToEnd}
          title="Skip to end"
        >
          <SkipForward className="h-4 w-4" />
        </Button>
        <Button 
          variant="outline" 
          size="icon"
          onClick={onReset}
          title="Reset"
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default ControlPanel;
