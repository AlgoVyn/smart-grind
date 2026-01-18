# Binary Search - On Answer / Condition Function

## Overview

Binary search on answer space, also known as binary search on the result or condition-based binary search, is used when the problem requires finding an optimal value within a range, and you can define a condition function that checks if a candidate value satisfies certain constraints. Instead of searching for an element in an array, you search for the best answer by evaluating a feasibility condition. This pattern is powerful for optimization problems where the search space is monotonic (either increasing or decreasing). It's commonly applied to problems like finding the minimum time, maximum capacity, or optimal allocation, offering logarithmic time complexity for large ranges.

## Key Concepts

- **Answer Space Definition**: Define the possible range of answers (low and high bounds).
- **Condition Function**: A helper function that takes a candidate answer and returns true if it meets the problem's requirements.
- **Monotonicity**: The condition must be monotonic; if it holds for a value, it should hold for all larger (or smaller) values depending on the problem.
- **Binary Search on Value**: Narrow down the possible answers by checking the condition at the midpoint.

## Template

```python
def binary_search_on_answer(low, high, condition_func):
    """
    Performs binary search on the answer space using a condition function.
    
    Args:
    low (int): The lower bound of the possible answers.
    high (int): The upper bound of the possible answers.
    condition_func (function): A function that takes a candidate answer and returns True if it satisfies the condition.
    
    Returns:
    int: The optimal answer that satisfies the condition.
    """
    while low < high:
        mid = low + (high - low) // 2
        
        if condition_func(mid):
            # If condition is satisfied, try for a smaller answer (for minimization)
            high = mid
        else:
            # If not satisfied, need a larger answer
            low = mid + 1
    
    return low  # low will be the smallest answer that satisfies the condition
```

## Example Problems

1. **Capacity to Ship Packages Within D Days**: Given weights of packages and days, find the minimum capacity of a ship. Use binary search on possible capacities with a condition to check if shipping is possible within D days.
2. **Koko Eating Bananas**: Find the minimum eating speed for Koko to eat all bananas within H hours. Binary search on eating speeds, checking if she can finish in time.
3. **Split Array Largest Sum**: Given an array and m subarrays, find the minimum largest sum. Search on possible sums, verifying if the array can be split into m subarrays without exceeding the sum.

## Time and Space Complexity

- **Time Complexity**: O(log R * C), where R is the range of possible answers (high - low), and C is the time complexity of the condition function.
- **Space Complexity**: O(1), excluding the space used by the condition function.

## Common Pitfalls

- **Non-Monotonic Conditions**: Ensure the condition function is monotonic; otherwise, binary search won't work.
- **Boundary Issues**: Incorrectly setting low and high can lead to infinite loops or wrong answers.
- **Condition Function Accuracy**: The condition must accurately reflect the problem constraints; bugs here will propagate to the result.
- **Integer vs. Floating Point**: For problems requiring precision, consider floating-point binary search if needed.