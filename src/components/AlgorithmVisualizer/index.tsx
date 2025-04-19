
import { useState, useEffect, useCallback, useRef } from "react";
import ControlPanel from "./ControlPanel";
import VisualizerDisplay from "./VisualizerDisplay";
import AlgorithmInfo from "./AlgorithmInfo";
import { ArrayElement, SortingAlgorithm, sortingAlgorithms } from "@/algorithms/sortingAlgorithms";
import { SearchingAlgorithm, searchingAlgorithms, SearchingResult } from "@/algorithms/searchingAlgorithms";
import { generateRandomArray } from "@/utils/visualizerHelpers";

const AlgorithmVisualizer = () => {
  const [algorithmType, setAlgorithmType] = useState<"sorting" | "searching">("sorting");
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<string>(sortingAlgorithms[0].key);
  const [arraySize, setArraySize] = useState<number>(30);
  const [animationSpeed, setAnimationSpeed] = useState<number>(5);
  const [array, setArray] = useState<number[]>([]);
  const [visualArray, setVisualArray] = useState<ArrayElement[]>([]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [stepCount, setStepCount] = useState<number>(0);
  const [targetValue, setTargetValue] = useState<number>(0);
  const [searchingInfo, setSearchingInfo] = useState<SearchingResult | null>(null);
  const [stats, setStats] = useState({ comparisons: 0, swaps: 0, time: 0 });
  
  const animationTimerRef = useRef<NodeJS.Timeout | null>(null);
  const executionStartTimeRef = useRef<number>(0);

  // Initialize algorithm and array
  useEffect(() => {
    generateNewArray();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Reset when algorithm type changes
  useEffect(() => {
    if (algorithmType === "sorting") {
      setSelectedAlgorithm(sortingAlgorithms[0].key);
    } else {
      setSelectedAlgorithm(searchingAlgorithms[0].key);
    }
    generateNewArray();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [algorithmType]);

  // Generate a new random array
  const generateNewArray = useCallback(() => {
    const newArray = generateRandomArray(arraySize, 5, 100);
    setArray(newArray);
    
    // Set a random target value for searching algorithms
    if (algorithmType === "searching") {
      // 50% chance to pick a value that exists in the array
      if (Math.random() > 0.5 && newArray.length > 0) {
        setTargetValue(newArray[Math.floor(Math.random() * newArray.length)]);
      } else {
        setTargetValue(Math.floor(Math.random() * 100) + 5);
      }
    }
    
    resetVisualization();
  }, [arraySize, algorithmType]);

  // Reset the visualization
  const resetVisualization = useCallback(() => {
    pauseAnimation();
    setCurrentStep(0);
    setStepCount(0);
    setStats({ comparisons: 0, swaps: 0, time: 0 });
    setSearchingInfo(null);
    
    // Reset visualization array
    setVisualArray(array.map(value => ({ value, state: "default" })));
  }, [array]);

  // Get the current algorithm object
  const getCurrentAlgorithm = useCallback((): SortingAlgorithm | SearchingAlgorithm | null => {
    if (algorithmType === "sorting") {
      return sortingAlgorithms.find(alg => alg.key === selectedAlgorithm) || null;
    } else {
      return searchingAlgorithms.find(alg => alg.key === selectedAlgorithm) || null;
    }
  }, [algorithmType, selectedAlgorithm]);

  // Run the algorithm
  const runAlgorithm = useCallback(() => {
    const algorithm = getCurrentAlgorithm();
    if (!algorithm) return;

    executionStartTimeRef.current = performance.now();

    if (algorithmType === "sorting") {
      (algorithm as SortingAlgorithm).generateSteps([...array]);
      setStepCount((algorithm as SortingAlgorithm).steps.length);
    } else {
      (algorithm as SearchingAlgorithm).generateSteps([...array], targetValue);
      setStepCount((algorithm as SearchingAlgorithm).steps.length);
    }

    const executionTime = Math.round(performance.now() - executionStartTimeRef.current);
    setStats(prev => ({ ...prev, time: executionTime }));

    // Set the first step
    setCurrentStep(0);
    updateVisualization(0);
  }, [algorithmType, array, getCurrentAlgorithm, targetValue]);

  // Update the visualization based on the current step
  const updateVisualization = useCallback((step: number) => {
    const algorithm = getCurrentAlgorithm();
    if (!algorithm) return;

    if (algorithmType === "sorting") {
      const sortingAlg = algorithm as SortingAlgorithm;
      if (sortingAlg.steps && sortingAlg.steps.length > 0) {
        const currentStepData = sortingAlg.steps[step];
        setVisualArray(currentStepData.array);
        setStats({
          comparisons: currentStepData.comparisons,
          swaps: currentStepData.swaps,
          time: stats.time
        });
      }
    } else {
      const searchingAlg = algorithm as SearchingAlgorithm;
      if (searchingAlg.steps && searchingAlg.steps.length > 0) {
        const currentStepData = searchingAlg.steps[step];
        setVisualArray(currentStepData.array);
        setSearchingInfo(currentStepData);
        setStats({
          comparisons: currentStepData.comparisons,
          swaps: 0, // Add default value for swaps in searching algorithms
          time: stats.time
        });
      }
    }
  }, [algorithmType, getCurrentAlgorithm, stats.time]);

  // Animation control: play/pause
  const togglePlayPause = useCallback(() => {
    if (isPlaying) {
      pauseAnimation();
    } else {
      playAnimation();
    }
  }, [isPlaying]);

  // Start animation
  const playAnimation = useCallback(() => {
    const algorithm = getCurrentAlgorithm();
    if (!algorithm) return;
    
    // If we're at the end, reset
    if (algorithmType === "sorting") {
      if (currentStep >= (algorithm as SortingAlgorithm).steps.length - 1) {
        setCurrentStep(0);
      }
    } else {
      if (currentStep >= (algorithm as SearchingAlgorithm).steps.length - 1) {
        setCurrentStep(0);
      }
    }
    
    setIsPlaying(true);
    
    // Run the algorithm if not started yet
    if (stepCount === 0) {
      runAlgorithm();
    }
    
    // Start animation
    const interval = 1100 - animationSpeed * 100; // 100ms to 1000ms
    animationTimerRef.current = setInterval(() => {
      setCurrentStep(prev => {
        const nextStep = prev + 1;
        // Check if we reached the end
        if (algorithmType === "sorting") {
          if (nextStep >= (algorithm as SortingAlgorithm).steps.length) {
            pauseAnimation();
            return prev;
          }
        } else {
          if (nextStep >= (algorithm as SearchingAlgorithm).steps.length) {
            pauseAnimation();
            return prev;
          }
        }
        updateVisualization(nextStep);
        return nextStep;
      });
    }, interval);
  }, [algorithmType, animationSpeed, currentStep, getCurrentAlgorithm, runAlgorithm, stepCount, updateVisualization]);

  // Pause animation
  const pauseAnimation = useCallback(() => {
    if (animationTimerRef.current) {
      clearInterval(animationTimerRef.current);
      animationTimerRef.current = null;
    }
    setIsPlaying(false);
  }, []);

  // Step forward
  const stepForward = useCallback(() => {
    pauseAnimation();
    
    const algorithm = getCurrentAlgorithm();
    if (!algorithm) return;
    
    // Run the algorithm if not started yet
    if (stepCount === 0) {
      runAlgorithm();
      return;
    }
    
    // Check if we can step forward
    let maxSteps = 0;
    if (algorithmType === "sorting") {
      maxSteps = (algorithm as SortingAlgorithm).steps.length - 1;
    } else {
      maxSteps = (algorithm as SearchingAlgorithm).steps.length - 1;
    }
    
    if (currentStep < maxSteps) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      updateVisualization(nextStep);
    }
  }, [algorithmType, currentStep, getCurrentAlgorithm, pauseAnimation, runAlgorithm, stepCount, updateVisualization]);

  // Step backward
  const stepBackward = useCallback(() => {
    pauseAnimation();
    
    // Check if we can step backward
    if (currentStep > 0) {
      const prevStep = currentStep - 1;
      setCurrentStep(prevStep);
      updateVisualization(prevStep);
    }
  }, [currentStep, pauseAnimation, updateVisualization]);

  // Skip to start
  const skipToStart = useCallback(() => {
    pauseAnimation();
    setCurrentStep(0);
    updateVisualization(0);
  }, [pauseAnimation, updateVisualization]);

  // Skip to end
  const skipToEnd = useCallback(() => {
    pauseAnimation();
    
    const algorithm = getCurrentAlgorithm();
    if (!algorithm) return;
    
    // Run the algorithm if not started yet
    if (stepCount === 0) {
      runAlgorithm();
      return;
    }
    
    let lastStep = 0;
    if (algorithmType === "sorting") {
      lastStep = (algorithm as SortingAlgorithm).steps.length - 1;
    } else {
      lastStep = (algorithm as SearchingAlgorithm).steps.length - 1;
    }
    
    setCurrentStep(lastStep);
    updateVisualization(lastStep);
  }, [algorithmType, getCurrentAlgorithm, pauseAnimation, runAlgorithm, stepCount, updateVisualization]);

  // Reset
  const reset = useCallback(() => {
    pauseAnimation();
    resetVisualization();
  }, [pauseAnimation, resetVisualization]);

  // Update visual array when array changes
  useEffect(() => {
    setVisualArray(array.map(value => ({ value, state: "default" })));
  }, [array]);

  // Update steps when algorithm or array changes
  useEffect(() => {
    resetVisualization();
  }, [selectedAlgorithm, resetVisualization]);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (animationTimerRef.current) {
        clearInterval(animationTimerRef.current);
      }
    };
  }, []);

  // Get array steps for current algorithm
  const getArraySteps = useCallback(() => {
    const algorithm = getCurrentAlgorithm();
    if (!algorithm) return null;
    
    if (algorithmType === "sorting") {
      return (algorithm as SortingAlgorithm).steps?.map(step => step.array) || null;
    } else {
      return (algorithm as SearchingAlgorithm).steps?.map(step => step.array) || null;
    }
  }, [algorithmType, getCurrentAlgorithm]);

  return (
    <div className="rounded-lg shadow-lg overflow-hidden">
      <ControlPanel
        algorithmType={algorithmType}
        sortingAlgorithms={sortingAlgorithms}
        searchingAlgorithms={searchingAlgorithms}
        selectedAlgorithm={selectedAlgorithm}
        arraySize={arraySize}
        animationSpeed={animationSpeed}
        isPlaying={isPlaying}
        targetValue={targetValue}
        onAlgorithmTypeChange={setAlgorithmType}
        onAlgorithmChange={setSelectedAlgorithm}
        onArraySizeChange={setArraySize}
        onAnimationSpeedChange={setAnimationSpeed}
        onGenerateNewArray={generateNewArray}
        onPlayPause={togglePlayPause}
        onReset={reset}
        onStepForward={stepForward}
        onStepBackward={stepBackward}
        onSkipToStart={skipToStart}
        onSkipToEnd={skipToEnd}
        onTargetValueChange={setTargetValue}
      />
      
      <VisualizerDisplay
        array={visualArray}
        arraySteps={getArraySteps()}
        currentStep={currentStep}
        isSearching={algorithmType === "searching"}
        searchingInfo={searchingInfo}
      />
      
      <AlgorithmInfo
        algorithm={getCurrentAlgorithm()}
        isSearching={algorithmType === "searching"}
        stats={stats}
      />
    </div>
  );
};

export default AlgorithmVisualizer;
