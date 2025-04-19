
/**
 * Generates a random array of integers
 * @param size The size of the array
 * @param min The minimum value (inclusive)
 * @param max The maximum value (inclusive)
 * @returns A random array of integers
 */
export const generateRandomArray = (
  size: number,
  min: number = 1,
  max: number = 100
): number[] => {
  return Array.from({ length: size }, () =>
    Math.floor(Math.random() * (max - min + 1)) + min
  );
};

/**
 * Delays execution for a specified amount of time
 * @param ms The number of milliseconds to delay
 * @returns A promise that resolves after the specified delay
 */
export const delay = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};
