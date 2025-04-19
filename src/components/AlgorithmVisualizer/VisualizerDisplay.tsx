
import { useState, useEffect, useRef } from "react";
import { ArrayElement } from "@/algorithms/sortingAlgorithms";
import { SearchingResult } from "@/algorithms/searchingAlgorithms";

interface VisualizerDisplayProps {
  array: ArrayElement[];
  arraySteps: ArrayElement[][] | null;
  currentStep: number;
  isSearching: boolean;
  searchingInfo: SearchingResult | null;
}

const VisualizerDisplay: React.FC<VisualizerDisplayProps> = ({
  array,
  arraySteps,
  currentStep,
  isSearching,
  searchingInfo,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    
    return () => {
      window.removeEventListener("resize", updateDimensions);
    };
  }, []);

  const getBarColor = (element: ArrayElement) => {
    switch (element.state) {
      case "comparing":
        return "bg-yellow-500";
      case "swapping":
        return "bg-red-500";
      case "sorted":
        return "bg-green-500";
      case "pivot":
        return "bg-purple-500";
      default:
        return "bg-blue-500";
    }
  };

  const getMaxValue = () => {
    return Math.max(...array.map(item => item.value));
  };

  const maxValue = getMaxValue();
  const barWidth = Math.max(containerWidth / array.length - 4, 2);
  
  return (
    <div ref={containerRef} className="h-[400px] bg-slate-50 relative p-4">
      <div className="flex items-end justify-center h-full">
        {array.map((element, index) => {
          const height = (element.value / maxValue) * 90;
          return (
            <div
              key={index}
              className="flex-1 mx-[2px] min-w-[2px] transition-all duration-150 max-w-[100px] flex flex-col items-center"
              style={{ height: "100%" }}
            >
              <div
                className={`${getBarColor(element)} rounded-t-sm w-full`}
                style={{
                  height: `${height}%`,
                  maxWidth: `${barWidth}px`,
                  minWidth: "2px",
                  transition: "height 150ms ease-in-out"
                }}
              ></div>
              {array.length <= 20 && (
                <span className="text-xs mt-1 text-gray-600">{element.value}</span>
              )}
            </div>
          );
        })}
      </div>
      
      {isSearching && searchingInfo && (
        <div className="mt-4 text-center">
          <p className="font-semibold">
            {searchingInfo.isComplete ? (
              searchingInfo.foundIndex !== null ? (
                <span className="text-green-600">
                  Found at index {searchingInfo.foundIndex}!
                </span>
              ) : (
                <span className="text-red-600">
                  Not found in the array.
                </span>
              )
            ) : (
              <span className="text-blue-600">
                Searching...
              </span>
            )}
          </p>
        </div>
      )}

      <div className="absolute bottom-2 right-2 bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full text-xs text-gray-700 shadow">
        {arraySteps && (
          <span>
            Step: {currentStep + 1} / {arraySteps.length}
          </span>
        )}
      </div>
    </div>
  );
};

export default VisualizerDisplay;
