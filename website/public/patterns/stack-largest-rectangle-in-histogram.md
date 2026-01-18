# Stack - Largest Rectangle in Histogram

## Overview

The Largest Rectangle in Histogram pattern uses a monotonic stack to find the largest rectangular area in a histogram in linear time. This approach efficiently calculates areas by maintaining a stack of indices with increasing heights, computing areas when smaller heights are encountered.

This pattern should be used when:
- Finding maximum rectangular areas in bar charts
- Computing largest rectangles in matrices (2D extension)
- Solving problems involving area calculations with height constraints
- Optimizing space in histogram-based problems

Benefits include:
- O(n) time complexity compared to O(n^2) brute force
- Single pass through the data
- Can be extended to 2D matrices
- Handles edge cases like all equal heights or strictly increasing/decreasing

## Key Concepts

- **Monotonic Increasing Stack**: Maintains indices with strictly increasing heights
- **Area Calculation**: When popping, calculate area with height and width
- **Width Determination**: Distance between current position and previous smaller height
- **Sentinel Value**: Add zero height at end to handle remaining stack elements

## Template

```python
def largestRectangleArea(heights):
    # Stack to store indices with increasing heights
    stack = []
    max_area = 0
    # Add sentinel value to handle remaining elements
    heights.append(0)
    
    for i, h in enumerate(heights):
        # While current height is smaller than stack top height
        while stack and heights[stack[-1]] > h:
            # Pop the top index
            height = heights[stack.pop()]
            # Calculate width: from previous smaller to current position
            width = i if not stack else i - stack[-1] - 1
            # Update max area
            max_area = max(max_area, height * width)
        
        # Push current index
        stack.append(i)
    
    # Remove sentinel value
    heights.pop()
    return max_area
```

## Example Problems

1. **Largest Rectangle in Histogram** (LeetCode 84): Given an array of integers heights representing the histogram's bar height, return the area of the largest rectangle.
2. **Maximal Rectangle** (LeetCode 85): Given a rows x cols binary matrix, return the maximum area of a rectangle containing only 1's.
3. **Maximum Area of a Piece of Cake After Horizontal and Vertical Cuts** (LeetCode 1465): Find the maximum area of a piece of cake after making cuts.

## Time and Space Complexity

- **Time Complexity**: O(n), where n is the number of bars in the histogram
- **Space Complexity**: O(n) for the stack in worst case

## Common Pitfalls

- Forgetting to add the sentinel value (0) at the end
- Incorrect width calculation (should be i - stack[-1] - 1 when stack not empty)
- Not handling the case when stack becomes empty during width calculation
- Edge cases: empty histogram, single bar, all bars same height
- Modifying the original heights array (use a copy if needed)