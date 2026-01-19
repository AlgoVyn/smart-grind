# Container With Most Water

## Problem Description

You are given an integer array `height` of length `n`. There are `n` vertical lines drawn such that the two endpoints of the `i-th` line are `(i, 0)` and `(i, height[i])`.

Find two lines that together with the x-axis form a container, such that the container contains the most water.

Return the maximum amount of water a container can store.

Notice that you may not slant the container.

### Problem Visualization

Imagine you have vertical lines of different heights placed on a coordinate system, where each line starts at the x-axis (y=0) and extends up to its height. The container is formed by choosing two lines and the x-axis, and water can be poured into this container. The amount of water it can hold is determined by the shorter of the two lines and the distance between them.

For example, if you have lines with heights [1,8,6,2,5,4,8,3,7], the container formed by the 8 at index 1 and 7 at index 8 will hold 49 units of water:
- Height is min(8,7) = 7
- Width is 8 - 1 = 7
- Area = 7 * 7 = 49

---

## Examples

### Example 1

**Input:**
```python
height = [1,8,6,2,5,4,8,3,7]
```

**Output:**
```python
49
```

**Explanation:** 
The vertical lines are represented by array [1,8,6,2,5,4,8,3,7]. The optimal container is formed by:
- Left line at index 1 (height = 8)
- Right line at index 8 (height = 7)
- Height of container: min(8,7) = 7
- Width of container: 8 - 1 = 7
- Area: 7 * 7 = 49

This is the maximum possible area in this configuration.

### Example 2

**Input:**
```python
height = [1,1]
```

**Output:**
```python
1
```

**Explanation:** 
Only two lines are available, forming a container with:
- Height: min(1,1) = 1
- Width: 1 - 0 = 1
- Area: 1 * 1 = 1

### Example 3

**Input:**
```python
height = [4,3,2,1,4]
```

**Output:**
```python
16
```

**Explanation:** 
The optimal container is formed by the first and last lines:
- Left line at index 0 (height = 4)
- Right line at index 4 (height = 4)
- Height: min(4,4) = 4
- Width: 4 - 0 = 4
- Area: 4 * 4 = 16

---

## Constraints

- `n == height.length`
- `2 <= n <= 10^5`
- `0 <= height[i] <= 10^4`

---

## Intuition

The problem is about finding two vertical lines that, along with the x-axis, form a rectangle that can hold the maximum water. The area is determined by the **shorter line's height** and the **distance between them** (width). The formula for the area is:

```
Area = min(height[i], height[j]) * (j - i)
```

### Key Observations:

1. **Width Effect**: For a given height, the wider the container, the more water it can hold.
2. **Height Effect**: For a given width, the taller the container (specifically, the taller of the two lines), the more water it can hold.
3. **Limiting Factor**: The height of the container is always determined by the shorter of the two lines. If one line is much shorter than the other, it will be the bottleneck.

### Why Two-Pointer Approach Works:

The key insight is that to maximize area, we start with the **widest possible container** (leftmost and rightmost lines) and move the pointer pointing to the **shorter line inward**. This is because:

- Moving the pointer pointing to the taller line inward can't increase the height of the container
- It will only decrease the width, resulting in a smaller area
- Moving the shorter line inward has the potential to find a taller line, which could increase the container's height

This approach efficiently narrows down the possible containers while maintaining the maximum area found so far.

---

## Approach 1: Brute Force

### Algorithm

The brute force approach is straightforward but inefficient. It checks every possible pair of lines to find the container with maximum area.

1. **Iterate through all possible pairs of lines:** Use nested loops to generate all possible pairs (i, j) where i < j.
2. **Calculate area for each pair:** For each pair, compute the area using `min(height[i], height[j]) * (j - i)`.
3. **Track maximum area:** Keep updating the maximum area whenever a larger area is found.

### Code

```python
from typing import List

class Solution:
    def maxArea(self, height: List[int]) -> int:
        n = len(height)
        max_area = 0
        for i in range(n):
            for j in range(i + 1, n):
                # Calculate area for current pair
                current_height = min(height[i], height[j])
                current_width = j - i
                area = current_height * current_width
                # Update max area if current is larger
                if area > max_area:
                    max_area = area
        return max_area
```

### Complexity Analysis

- **Time Complexity:** O(n^2), where n is the number of lines. This is because we have to check all possible pairs, resulting in n*(n-1)/2 operations.
- **Space Complexity:** O(1), as we only use constant extra space for variables to track the maximum area and loop indices.

### Limitations

The brute force approach is not feasible for large input sizes. For n = 10^5, this approach would require around 5 billion operations, which would take an extremely long time.

---

## Approach 3: O(n log n) Optimization with Preprocessing

### Algorithm

The O(n log n) approach leverages sorting and preprocessing to efficiently find the maximum area. This approach is based on the observation that for each line at index `i` with height `h`, the optimal container involving this line will be with the farthest line to the left or right that has height ≥ `h`. Here's the detailed algorithm:

1. **Create position-height pairs**: First, we create a list of tuples where each tuple contains the height of a line and its original index. This preserves the positional information when we sort the array.
2. **Sort by height in descending order**: We sort these pairs from tallest to shortest. This allows us to consider lines in order of decreasing height.
3. **Track min and max indices**: As we iterate through the sorted list, we keep track of the minimum and maximum indices encountered so far. This helps us determine the farthest left and right lines that could form a container with the current line.
4. **Calculate maximum area**: For each line in the sorted list, we calculate the maximum possible width by finding the distance to the farthest line (either leftmost or rightmost) encountered so far. The area is then height × width.
5. **Update maximum area**: We keep track of the maximum area found during this process.

This approach ensures that each line is processed once, and the sorting step gives us the O(n log n) time complexity.

### Code

```python
from typing import List

class Solution:
    def maxArea(self, height: List[int]) -> int:
        # Create list of (height, index) pairs
        height_with_index = [(h, i) for i, h in enumerate(height)]
        
        # Sort pairs in descending order of height
        height_with_index.sort(reverse=True, key=lambda x: x[0])
        
        max_area = 0
        min_index = float('inf')
        max_index = -float('inf')
        
        for h, i in height_with_index:
            # Update the min and max indices encountered so far
            min_index = min(min_index, i)
            max_index = max(max_index, i)
            
            # Calculate possible areas with farthest left and farthest right lines
            area_left = h * (i - min_index)
            area_right = h * (max_index - i)
            
            # Update max area if current areas are larger
            max_area = max(max_area, area_left, area_right)
        
        return max_area
```

### Complexity Analysis

- **Time Complexity**: O(n log n), where n is the number of lines. The dominant time complexity comes from sorting the list of height-index pairs, which takes O(n log n) time. The subsequent iteration through the sorted list is O(n).
- **Space Complexity**: O(n), as we need to store the height-index pairs in a new list. This is required to preserve the positional information when sorting.

### Why This Approach Works

By sorting the lines in descending order of height, we ensure that when we process each line, all lines that could potentially form a taller container have already been considered. Tracking the minimum and maximum indices allows us to quickly find the farthest lines that can form a container with the current line, maximizing the width for each possible height.

---

## Approach 2: Two-Pointer Technique (Optimal)

### Algorithm

The two-pointer approach efficiently finds the maximum area in a single pass through the array. Here's how it works:

1. **Initialize pointers:** Start with two pointers at the ends of the array (left at 0, right at n-1), representing the widest possible container.
2. **Calculate area:** Compute the area for the current container.
3. **Update maximum area:** Keep track of the maximum area found.
4. **Move the shorter line inward:** This is the key optimization. By moving the pointer pointing to the shorter line, we have the potential to find a taller line, which could increase the container's height.
5. **Repeat:** Continue until the pointers meet.

### Code

```python
from typing import List

class Solution:
    def maxArea(self, height: List[int]) -> int:
        left, right = 0, len(height) - 1
        max_area = 0
        while left < right:
            # Calculate current container dimensions and area
            current_height = min(height[left], height[right])
            current_width = right - left
            current_area = current_height * current_width
            
            # Update max area if current is larger
            if current_area > max_area:
                max_area = current_area
            
            # Move the pointer pointing to the shorter line inward
            if height[left] < height[right]:
                left += 1
            else:
                right -= 1
        return max_area
```

### Complexity Analysis

- **Time Complexity:** O(n), where n is the number of lines. We process each line at most once, resulting in a single pass through the array.
- **Space Complexity:** O(1), as we use constant extra space for the two pointers and max area variable.

### Why This Approach Is Optimal

This approach ensures that we always move in the direction that has the potential to increase the container's height. By starting with the widest possible container and systematically narrowing it while keeping track of the maximum area, we efficiently find the optimal solution.

---

## Approach Comparison

Let's compare the three approaches to solve the Container With Most Water problem:

### Brute Force (O(n²))
- **Strategy**: Check every possible pair of lines
- **Strengths**: Simple to implement, no complex logic
- **Weaknesses**: Extremely inefficient for large n, O(n²) time complexity
- **Best For**: Small input sizes (<= 1000 elements)

### O(n log n) Optimization
- **Strategy**: Sort lines by height and track min/max indices
- **Strengths**: More efficient than brute force, works well for medium to large inputs
- **Weaknesses**: Requires O(n) additional space, sorting adds overhead
- **Best For**: Situations where two-pointer approach may be hard to understand or implement

### Two-Pointer Technique (O(n))
- **Strategy**: Start with widest container, move shorter line inward
- **Strengths**: Optimal time complexity, constant space, very efficient
- **Weaknesses**: Requires understanding of the key insight about moving pointers
- **Best For**: All input sizes, especially large n (up to 10⁵ elements)

### Performance Comparison

For n = 1000:
- Brute Force: ~500,000 operations
- O(n log n): ~10,000 operations
- Two-Pointer: 1000 operations

For n = 10⁵:
- Brute Force: ~5 billion operations (impractical)
- O(n log n): ~1.7 million operations (fast)
- Two-Pointer: 100,000 operations (very fast)

### When to Choose Each Approach

| Approach | Time Complexity | Space Complexity | Use Case |
|----------|----------------|-----------------|----------|
| Brute Force | O(n²) | O(1) | Small inputs, quick prototyping |
| O(n log n) | O(n log n) | O(n) | Educational purposes, understanding alternative methods |
| Two-Pointer | O(n) | O(1) | Production code, large inputs, optimal performance |

---

## Related Problems

The Container With Most Water problem introduces concepts that are useful in solving other related problems:

- **[Trapping Rain Water](https://leetcode.com/problems/trapping-rain-water/)**: Similar to finding container areas but with the added complexity of accounting for multiple "containers" stacked together. This problem uses a similar two-pointer approach or dynamic programming.
  
- **[Max Area of Island](https://leetcode.com/problems/max-area-of-island/)**: A grid-based area maximization problem that uses depth-first search (DFS) or breadth-first search (BFS) to find the largest connected component of land.

- **[Largest Rectangle in Histogram](https://leetcode.com/problems/largest-rectangle-in-histogram/)**: Another classic area maximization problem that uses a stack-based approach to efficiently find the largest rectangle in a histogram.

- **[Watering Plants](https://leetcode.com/problems/watering-plants/)**: A problem that shares the "two-pointer" approach intuition for optimal water distribution.

- **[Minimum Number of Refueling Stops](https://leetcode.com/problems/minimum-number-of-refueling-stops/)**: Uses a greedy approach with a priority queue, which shares some optimization intuition with this problem.

---

## Video Tutorial Links

These video tutorials provide detailed explanations and visual walkthroughs of the Container With Most Water problem:

- **[LeetCode Solution - Container With Most Water](https://www.youtube.com/watch?v=UuiTKBwPgUo)** (NeetCode) - Clear explanation of the two-pointer technique with visual examples.
  
- **[Two Pointer Approach Explained](https://www.youtube.com/watch?v=4ZlRH0eK-qQ)** (Kevin Naughton Jr.) - Step-by-step breakdown of both brute force and optimal approaches.

- **[Container With Most Water | LeetCode 11 | Python](https://www.youtube.com/watch?v=ZHQg07n_tbg)** (Tech With Tim) - Visual demonstration of how the two-pointer approach works with animated examples.

- **[LeetCode 11 Container With Most Water (Optimization Approach)](https://www.youtube.com/watch?v=jWOYlC9AZ4w)** (Coding Decoded) - Focus on understanding why the two-pointer approach works through mathematical reasoning.

---

## Follow-up Questions

These questions test your understanding of the problem and the two-pointer approach:

1. **What if the lines can be slanted? How would the approach change?**  
   If lines can be slanted, the container would be a trapezoid, not a rectangle. The area calculation would involve the average of the two heights times the width, and the approach might need to consider all possible pairs with more complex geometry, potentially increasing complexity.

2. **How to handle negative heights? (Though constraints say non-negative)**  
   Negative heights don't make sense for water containers, as heights are non-negative. If allowed, treat them as zero or adjust the min function to handle negative values, but the problem assumes non-negative.

3. **What if we need to find the second maximum area?**  
   Track the top two areas during the two-pointer or brute force iteration, updating both max1 and max2 accordingly.

4. **Why does moving the shorter line inward always lead to the optimal solution?**  
   Explain the mathematical reasoning behind why moving the pointer pointing to the shorter line is the right approach.

5. **What if all lines have the same height? How will the two-pointer approach work?**  
   Describe how the algorithm would behave and what the maximum area would be.

6. **What's the worst-case scenario for the two-pointer approach?**  
   Identify the input configuration that would require the most steps and why.

7. **How would you implement this problem in a language with array limitations (like JavaScript vs Python)?**  
   Discuss any language-specific considerations.

8. **What if you can use more than two lines to form the container?**  
   How would the problem and approach change if we allowed containers with multiple vertical lines?
