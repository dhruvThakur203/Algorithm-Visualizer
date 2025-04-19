
export type ArrayElement = {
  value: number;
  state: "default" | "comparing" | "sorted" | "swapping" | "pivot";
};

export type SortingResult = {
  array: ArrayElement[];
  comparisons: number;
  swaps: number;
  isComplete: boolean;
};

export type SortingAlgorithm = {
  name: string;
  key: string;
  description: string;
  timeComplexity: {
    best: string;
    average: string;
    worst: string;
  };
  spaceComplexity: string;
  steps: Array<{
    array: ArrayElement[];
    comparisons: number;
    swaps: number;
    isComplete: boolean;
  }>;
  generateSteps: (input: number[]) => void;
};

// Helper functions
export const createElementArray = (arr: number[]): ArrayElement[] => {
  return arr.map((value) => ({
    value,
    state: "default",
  }));
};

// Bubble Sort Algorithm
export const bubbleSort: SortingAlgorithm = {
  name: "Bubble Sort",
  key: "bubbleSort",
  description:
    "A simple comparison-based sorting algorithm that repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order.",
  timeComplexity: {
    best: "O(n)",
    average: "O(n²)",
    worst: "O(n²)",
  },
  spaceComplexity: "O(1)",
  steps: [],
  generateSteps(input: number[]) {
    const arr = createElementArray([...input]);
    const steps: SortingResult[] = [];
    let comparisons = 0;
    let swaps = 0;

    steps.push({
      array: JSON.parse(JSON.stringify(arr)),
      comparisons,
      swaps,
      isComplete: false,
    });

    for (let i = 0; i < arr.length; i++) {
      let swapped = false;
      
      for (let j = 0; j < arr.length - i - 1; j++) {
        // Mark elements being compared
        arr[j].state = "comparing";
        arr[j + 1].state = "comparing";
        steps.push({
          array: JSON.parse(JSON.stringify(arr)),
          comparisons: ++comparisons,
          swaps,
          isComplete: false,
        });

        if (arr[j].value > arr[j + 1].value) {
          // Mark elements being swapped
          arr[j].state = "swapping";
          arr[j + 1].state = "swapping";
          steps.push({
            array: JSON.parse(JSON.stringify(arr)),
            comparisons,
            swaps,
            isComplete: false,
          });

          // Swap elements
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
          swaps++;
          swapped = true;
          
          steps.push({
            array: JSON.parse(JSON.stringify(arr)),
            comparisons,
            swaps,
            isComplete: false,
          });
        }

        // Reset states
        arr[j].state = "default";
        arr[j + 1].state = "default";
      }

      // Mark the last element as sorted
      arr[arr.length - i - 1].state = "sorted";
      steps.push({
        array: JSON.parse(JSON.stringify(arr)),
        comparisons,
        swaps,
        isComplete: false,
      });

      if (!swapped) {
        // If no swapping occurred in this pass, the array is sorted
        for (let k = 0; k < arr.length - i - 1; k++) {
          arr[k].state = "sorted";
        }
        break;
      }
    }

    // Mark all elements as sorted for the final state
    arr.forEach((element) => (element.state = "sorted"));
    steps.push({
      array: JSON.parse(JSON.stringify(arr)),
      comparisons,
      swaps,
      isComplete: true,
    });

    this.steps = steps;
  },
};

// Quick Sort Algorithm
export const quickSort: SortingAlgorithm = {
  name: "Quick Sort",
  key: "quickSort",
  description:
    "A divide-and-conquer algorithm that selects a 'pivot' element and partitions the array around the pivot, placing smaller elements to the left and larger elements to the right.",
  timeComplexity: {
    best: "O(n log n)",
    average: "O(n log n)",
    worst: "O(n²)",
  },
  spaceComplexity: "O(log n)",
  steps: [],
  generateSteps(input: number[]) {
    const arr = createElementArray([...input]);
    const steps: SortingResult[] = [];
    let comparisons = 0;
    let swaps = 0;

    steps.push({
      array: JSON.parse(JSON.stringify(arr)),
      comparisons,
      swaps,
      isComplete: false,
    });

    const quickSortRecursive = (
      arr: ArrayElement[],
      left: number,
      right: number
    ) => {
      if (left >= right) return;

      // Select pivot
      const pivotIndex = right;
      arr[pivotIndex].state = "pivot";
      steps.push({
        array: JSON.parse(JSON.stringify(arr)),
        comparisons,
        swaps,
        isComplete: false,
      });

      let i = left - 1;

      for (let j = left; j < right; j++) {
        arr[j].state = "comparing";
        steps.push({
          array: JSON.parse(JSON.stringify(arr)),
          comparisons: ++comparisons,
          swaps,
          isComplete: false,
        });

        if (arr[j].value <= arr[pivotIndex].value) {
          i++;
          
          if (i !== j) {
            arr[i].state = "swapping";
            arr[j].state = "swapping";
            steps.push({
              array: JSON.parse(JSON.stringify(arr)),
              comparisons,
              swaps,
              isComplete: false,
            });

            // Swap
            [arr[i], arr[j]] = [arr[j], arr[i]];
            swaps++;
            
            steps.push({
              array: JSON.parse(JSON.stringify(arr)),
              comparisons,
              swaps,
              isComplete: false,
            });
            
            arr[i].state = "default";
          }
        }
        
        arr[j].state = "default";
      }

      // Place pivot in the correct position
      i++;
      if (i !== pivotIndex) {
        arr[i].state = "swapping";
        steps.push({
          array: JSON.parse(JSON.stringify(arr)),
          comparisons,
          swaps,
          isComplete: false,
        });

        // Swap
        [arr[i], arr[pivotIndex]] = [arr[pivotIndex], arr[i]];
        swaps++;
        
        steps.push({
          array: JSON.parse(JSON.stringify(arr)),
          comparisons,
          swaps,
          isComplete: false,
        });
      }

      arr[i].state = "sorted";
      arr.forEach(el => el.state = "default");
      arr[i].state = "sorted";
      
      steps.push({
        array: JSON.parse(JSON.stringify(arr)),
        comparisons,
        swaps,
        isComplete: false,
      });

      // Recursively sort the subarrays
      quickSortRecursive(arr, left, i - 1);
      quickSortRecursive(arr, i + 1, right);
    };

    quickSortRecursive(arr, 0, arr.length - 1);

    // Mark all elements as sorted for the final state
    arr.forEach((element) => (element.state = "sorted"));
    steps.push({
      array: JSON.parse(JSON.stringify(arr)),
      comparisons,
      swaps,
      isComplete: true,
    });

    this.steps = steps;
  },
};

// Selection Sort Algorithm
export const selectionSort: SortingAlgorithm = {
  name: "Selection Sort",
  key: "selectionSort",
  description:
    "A simple sorting algorithm that repeatedly finds the minimum element from the unsorted part and puts it at the beginning.",
  timeComplexity: {
    best: "O(n²)",
    average: "O(n²)",
    worst: "O(n²)",
  },
  spaceComplexity: "O(1)",
  steps: [],
  generateSteps(input: number[]) {
    const arr = createElementArray([...input]);
    const steps: SortingResult[] = [];
    let comparisons = 0;
    let swaps = 0;

    steps.push({
      array: JSON.parse(JSON.stringify(arr)),
      comparisons,
      swaps,
      isComplete: false,
    });

    for (let i = 0; i < arr.length - 1; i++) {
      let minIndex = i;
      arr[i].state = "comparing";
      
      steps.push({
        array: JSON.parse(JSON.stringify(arr)),
        comparisons,
        swaps,
        isComplete: false,
      });

      for (let j = i + 1; j < arr.length; j++) {
        arr[j].state = "comparing";
        steps.push({
          array: JSON.parse(JSON.stringify(arr)),
          comparisons: ++comparisons,
          swaps,
          isComplete: false,
        });

        if (arr[j].value < arr[minIndex].value) {
          if (minIndex !== i) {
            arr[minIndex].state = "default";
          }
          minIndex = j;
        } else {
          arr[j].state = "default";
        }
        
        steps.push({
          array: JSON.parse(JSON.stringify(arr)),
          comparisons,
          swaps,
          isComplete: false,
        });
      }

      if (minIndex !== i) {
        arr[i].state = "swapping";
        arr[minIndex].state = "swapping";
        
        steps.push({
          array: JSON.parse(JSON.stringify(arr)),
          comparisons,
          swaps,
          isComplete: false,
        });

        // Swap
        [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
        swaps++;
        
        steps.push({
          array: JSON.parse(JSON.stringify(arr)),
          comparisons,
          swaps,
          isComplete: false,
        });
      }

      arr[i].state = "sorted";
      if (minIndex !== i) {
        arr[minIndex].state = "default";
      }
      
      steps.push({
        array: JSON.parse(JSON.stringify(arr)),
        comparisons,
        swaps,
        isComplete: false,
      });
    }

    // Mark the last element as sorted
    arr[arr.length - 1].state = "sorted";
    
    steps.push({
      array: JSON.parse(JSON.stringify(arr)),
      comparisons,
      swaps,
      isComplete: true,
    });

    this.steps = steps;
  },
};

export const sortingAlgorithms = [bubbleSort, quickSort, selectionSort];

export default sortingAlgorithms;
