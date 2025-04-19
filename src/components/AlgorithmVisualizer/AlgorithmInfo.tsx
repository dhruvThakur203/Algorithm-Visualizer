
import { SortingAlgorithm } from "@/algorithms/sortingAlgorithms";
import { SearchingAlgorithm } from "@/algorithms/searchingAlgorithms";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface AlgorithmInfoProps {
  algorithm: SortingAlgorithm | SearchingAlgorithm | null;
  isSearching: boolean;
  stats: {
    comparisons: number;
    swaps?: number;
    time: number;
  };
}

const AlgorithmInfo: React.FC<AlgorithmInfoProps> = ({
  algorithm,
  isSearching,
  stats,
}) => {
  if (!algorithm) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-white rounded-b-lg">
      <Card className="border shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle>{algorithm.name}</CardTitle>
          <CardDescription>Algorithm details</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 mb-4">{algorithm.description}</p>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-semibold mb-1">Time Complexity</h4>
              <ul className="text-xs space-y-1">
                <li><span className="font-medium">Best:</span> {algorithm.timeComplexity.best}</li>
                <li><span className="font-medium">Average:</span> {algorithm.timeComplexity.average}</li>
                <li><span className="font-medium">Worst:</span> {algorithm.timeComplexity.worst}</li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold mb-1">Space Complexity</h4>
              <p className="text-xs">{algorithm.spaceComplexity}</p>
              
              {isSearching && 'requiresSorted' in algorithm && algorithm.requiresSorted && (
                <p className="text-xs text-amber-600 mt-2 font-medium">Requires sorted array</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="border shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle>Execution Statistics</CardTitle>
          <CardDescription>Real-time performance data</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 p-3 rounded-lg">
                <h4 className="text-xs text-gray-500">Comparisons</h4>
                <p className="text-2xl font-semibold">{stats.comparisons}</p>
              </div>
              
              {!isSearching && stats.swaps !== undefined && (
                <div className="bg-slate-50 p-3 rounded-lg">
                  <h4 className="text-xs text-gray-500">Swaps</h4>
                  <p className="text-2xl font-semibold">{stats.swaps}</p>
                </div>
              )}
              
              <div className="bg-slate-50 p-3 rounded-lg">
                <h4 className="text-xs text-gray-500">Execution Time</h4>
                <p className="text-2xl font-semibold">{stats.time} ms</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AlgorithmInfo;
