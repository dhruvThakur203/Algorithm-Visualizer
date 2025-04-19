
import { ArrayElement, createElementArray } from "./sortingAlgorithms";

export type SearchingResult = {
  array: ArrayElement[];
  comparisons: number;
  isComplete: boolean;
  foundIndex: number | null;
  currentIndex: number | null;
};

export type SearchingAlgorithm = {
  name: string;
  key: string;
  description: string;
  timeComplexity: {
    best: string;
    average: string;
    worst: string;
  };
  spaceComplexity: string;
  steps: Array<SearchingResult>;
  generateSteps: (input: number[], target: number) => void;
  requiresSorted: boolean;
};

// Linear Search Algorithm
export const linearSearch: SearchingAlgorithm = {
  name: "Linear Search",
  key: "linearSearch",
  description:
    "A simple search algorithm that checks each element of the list until a match is found or the whole list has been searched.",
  timeComplexity: {
    best: "O(1)",
    average: "O(n)",
    worst: "O(n)",
  },
  spaceComplexity: "O(1)",
  steps: [],
  requiresSorted: false,
  generateSteps(input: number[], target: number) {
    const arr = createElementArray([...input]);
    const steps: SearchingResult[] = [];
    let comparisons = 0;

    steps.push({
      array: JSON.parse(JSON.stringify(arr)),
      comparisons,
      isComplete: false,
      foundIndex: null,
      currentIndex: null,
    });

    for (let i = 0; i < arr.length; i++) {
      // Mark current element
      arr[i].state = "comparing";
      steps.push({
        array: JSON.parse(JSON.stringify(arr)),
        comparisons: ++comparisons,
        isComplete: false,
        foundIndex: null,
        currentIndex: i,
      });

      if (arr[i].value === target) {
        // Target found
        arr[i].state = "sorted";
        steps.push({
          array: JSON.parse(JSON.stringify(arr)),
          comparisons,
          isComplete: true,
          foundIndex: i,
          currentIndex: i,
        });
        return;
      }

      // Reset state of current element if not found
      arr[i].state = "default";
    }

    // Target not found
    steps.push({
      array: JSON.parse(JSON.stringify(arr)),
      comparisons,
      isComplete: true,
      foundIndex: null,
      currentIndex: null,
    });

    this.steps = steps;
  },
};

// Binary Search Algorithm
export const binarySearch: SearchingAlgorithm = {
  name: "Binary Search",
  key: "binarySearch",
  description:
    "An efficient search algorithm that finds the position of a target value within a sorted array by repeatedly dividing the search interval in half.",
  timeComplexity: {
    best: "O(1)",
    average: "O(log n)",
    worst: "O(log n)",
  },
  spaceComplexity: "O(1)",
  steps: [],
  requiresSorted: true,
  generateSteps(input: number[], target: number) {
    // Make sure the input is sorted
    const sortedInput = [...input].sort((a, b) => a - b);
    const arr = createElementArray(sortedInput);
    const steps: SearchingResult[] = [];
    let comparisons = 0;

    steps.push({
      array: JSON.parse(JSON.stringify(arr)),
      comparisons,
      isComplete: false,
      foundIndex: null,
      currentIndex: null,
    });

    let left = 0;
    let right = arr.length - 1;

    while (left <= right) {
      // Mark the current search range
      for (let i = left; i <= right; i++) {
        arr[i].state = "comparing";
      }
      
      const mid = Math.floor((left + right) / 2);
      arr[mid].state = "pivot";
      
      steps.push({
        array: JSON.parse(JSON.stringify(arr)),
        comparisons: ++comparisons,
        isComplete: false,
        foundIndex: null,
        currentIndex: mid,
      });

      if (arr[mid].value === target) {
        // Target found
        arr.forEach(el => el.state = "default");
        arr[mid].state = "sorted";
        
        steps.push({
          array: JSON.parse(JSON.stringify(arr)),
          comparisons,
          isComplete: true,
          foundIndex: mid,
          currentIndex: mid,
        });
        
        this.steps = steps;
        return;
      } else if (arr[mid].value < target) {
        // Reset states
        arr.forEach(el => el.state = "default");
        left = mid + 1;
      } else {
        // Reset states
        arr.forEach(el => el.state = "default");
        right = mid - 1;
      }
    }

    // Target not found
    arr.forEach(el => el.state = "default");
    steps.push({
      array: JSON.parse(JSON.stringify(arr)),
      comparisons,
      isComplete: true,
      foundIndex: null,
      currentIndex: null,
    });

    this.steps = steps;
  },
};

// Jump Search Algorithm
export const jumpSearch: SearchingAlgorithm = {
  name: "Jump Search",
  key: "jumpSearch",
  description:
    "A search algorithm that works by jumping ahead by fixed steps and then doing a linear search for the target.",
  timeComplexity: {
    best: "O(1)",
    average: "O(√n)",
    worst: "O(√n)",
  },
  spaceComplexity: "O(1)",
  steps: [],
  requiresSorted: true,
  generateSteps(input: number[], target: number) {
    // Make sure the input is sorted
    const sortedInput = [...input].sort((a, b) => a - b);
    const arr = createElementArray(sortedInput);
    const steps: SearchingResult[] = [];
    let comparisons = 0;

    steps.push({
      array: JSON.parse(JSON.stringify(arr)),
      comparisons,
      isComplete: false,
      foundIndex: null,
      currentIndex: null,
    });

    const n = arr.length;
    let blockSize = Math.floor(Math.sqrt(n));
    let prev = 0;
    let current = blockSize;

    // Find the block
    while (current <= n && arr[current - 1].value < target) {
      // Mark the current block
      for (let i = prev; i < current; i++) {
        arr[i].state = "comparing";
      }
      
      steps.push({
        array: JSON.parse(JSON.stringify(arr)),
        comparisons: ++comparisons,
        isComplete: false,
        foundIndex: null,
        currentIndex: current - 1,
      });

      // Reset states
      arr.forEach(el => el.state = "default");
      
      // Move to next block
      prev = current;
      current = current + blockSize;

      if (prev >= n) {
        steps.push({
          array: JSON.parse(JSON.stringify(arr)),
          comparisons,
          isComplete: true,
          foundIndex: null,
          currentIndex: null,
        });
        
        this.steps = steps;
        return;
      }
    }

    // Linear search in the identified block
    while (arr[prev].value < target) {
      arr[prev].state = "comparing";
      
      steps.push({
        array: JSON.parse(JSON.stringify(arr)),
        comparisons: ++comparisons,
        isComplete: false,
        foundIndex: null,
        currentIndex: prev,
      });

      // Reset state
      arr[prev].state = "default";
      
      prev++;

      if (prev === Math.min(current, n)) {
        steps.push({
          array: JSON.parse(JSON.stringify(arr)),
          comparisons,
          isComplete: true,
          foundIndex: null,
          currentIndex: null,
        });
        
        this.steps = steps;
        return;
      }
    }

    // Check if target is found
    arr[prev].state = "comparing";
    
    steps.push({
      array: JSON.parse(JSON.stringify(arr)),
      comparisons: ++comparisons,
      isComplete: false,
      foundIndex: null,
      currentIndex: prev,
    });

    if (arr[prev].value === target) {
      arr[prev].state = "sorted";
      
      steps.push({
        array: JSON.parse(JSON.stringify(arr)),
        comparisons,
        isComplete: true,
        foundIndex: prev,
        currentIndex: prev,
      });
    } else {
      arr[prev].state = "default";
      
      steps.push({
        array: JSON.parse(JSON.stringify(arr)),
        comparisons,
        isComplete: true,
        foundIndex: null,
        currentIndex: null,
      });
    }

    this.steps = steps;
  },
};

export const searchingAlgorithms = [linearSearch, binarySearch, jumpSearch];

export default searchingAlgorithms;
