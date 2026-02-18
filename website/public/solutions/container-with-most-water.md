# Container With Most Water

## Problem Description

You are given an integer array `height` of length `n`. There are `n` vertical lines drawn such that the two endpoints of the ith line are `(i, 0)` and `(i, height[i])`.

Find two lines that together with the x-axis form a container, such that the container contains the most water.

Return the maximum amount of water a container can store.

**Notice** that you may not slant the container.

This is **LeetCode Problem #11** and is classified as a Medium difficulty problem. It is a classic two-pointer problem that appears frequently in technical interviews and demonstrates understanding of the two-pointer technique, greedy algorithms, and optimization strategies.

### Understanding the Problem

The problem can be visualized as finding two vertical lines in a histogram that can hold the most water. The amount of water between two lines at positions `i` and `j` is calculated as:

```
water = min(height[i], height[j]) * (j - i)
```

This formula represents:
- The height of water is limited by the shorter line (since water would spill over)
- The width is the distance between the two lines

### Why This Problem Matters

This problem demonstrates several important algorithmic concepts:
- **Two-pointer technique** - Efficient O(n) solution
- **Greedy approach** - Making locally optimal decisions
- **Optimal substructure** - Global optimum from local optima
- **Time-space tradeoffs** - Comparing brute force vs optimized approaches

It's frequently asked by top tech companies including Google, Amazon, Meta, Microsoft, Apple, and Goldman Sachs.

---

## Constraints

| Constraint | Description | Importance |
|------------|-------------|------------|
| `n == height.length` | Array length | Valid input |
| `2 <= n <= 10^5` | Minimum 2 lines | Ensures valid container |
| `0 <= height[i] <= 10^4` | Height values | Non-negative |
| Need O(n) solution | Time complexity expectation | Tests optimization skills |

---

## Examples

### Example 1:

**Input:** `height = [1,8,6,2,5,4,8,3,7]`  
**Output:** `49`

**Explanation:** 
- The maximum water is held between lines at index 1 (height 8) and index 8 (height 7)
- Water = min(8, 7) × (8 - 1) = 7 × 7 = 49

---

### Example 2:

**Input:** `height = [1,1]`  
**Output:** `1`

**Explanation:**
- Only two lines, water = min(1, 1) × (1 - 0) = 1

---

### Example 3:

**Input:** `height = [4,3,2,1,4]`  
**Output:** `16`

**Explanation:**
- Maximum water between index 0 and index 4
- Water = min(4, 4) × (4 - 0) = 4 × 4 = 16

---

## Follow up

Can you solve it in O(n) time complexity? Can you solve it with O(1) space complexity?

---

## Intuition

### Key Observations

1. **Water Formula**: The water between two lines at positions `i` and `j` is `min(height[i], height[j]) * (j - i)`. The limiting factor is always the shorter line.

2. **Brute Force**: Try all pairs - O(n²) time, O(1) space. Works but not optimal.

3. **Two Pointer Insight**: Start with the widest container (first and last lines). The width is maximum, but the height is limited by the shorter line. Moving the pointer at the shorter line might find a taller line that could increase water volume.

4. **Greedy Strategy**: At each step, move the pointer pointing to the shorter line inward. This is because:
   - The current width is the maximum possible for this pair
   - To find potentially larger containers, we need to try other combinations
   - Moving the taller line can only decrease or keep the height (since we're limited by the shorter one)
   - Moving the shorter line gives us a chance to find a taller line

### Why Two Pointer Works

The two-pointer approach is optimal because:
1. We start with maximum width (widest possible container)
2. At each step, we intelligently choose which pointer to move
3. We never miss a potential maximum because:
   - For any pair (i, j), if height[i] <= height[j], moving i can only decrease or maintain the water level
   - By moving the pointer with smaller height, we explore configurations that could have higher water

---

## Multiple Approaches

### Approach 1: Two Pointer (Optimal) ⭐⭐

The optimal approach uses two pointers starting from both ends, moving inward strategically.

#### Algorithm

1. Initialize two pointers: `left` at start (index 0), `right` at end (index n-1)
2. Calculate water for current pair
3. Move the pointer with smaller height inward
4. Repeat until pointers meet
5. Track maximum water found

#### Implementation

````carousel
```python
from typing import List

class Solution:
    def maxArea(self, height: List[int]) -> int:
        """
        Find maximum water container using two pointer technique.
        
        Args:
            height: List of line heights
            
        Returns:
            Maximum water that can be stored
        """
        left = 0
        right = len(height) - 1
        max_water = 0
        
        while left < right:
            # Calculate current water
            width = right - left
            h = min(height[left], height[right])
            water = width * h
            
            # Update maximum
            max_water = max(max_water, water)
            
            # Move pointer with smaller height
            if height[left] < height[right]:
                left += 1
            else:
                right -= 1
        
        return max_water
```
<!-- slide -->
```cpp
#include <vector>
using namespace std;

class Solution {
public:
    int maxArea(vector<int>& height) {
        int left = 0;
        int right = height.size() - 1;
        int maxWater = 0;
        
        while (left < right) {
            int width = right - left;
            int h = min(height[left], height[right]);
            int water = width * h;
            
            maxWater = max(maxWater, water);
            
            if (height[left] < height[right]) {
                left++;
            } else {
                right--;
            }
        }
        
        return maxWater;
    }
};
```
<!-- slide -->
```java
class Solution {
    public int maxArea(int[] height) {
        int left = 0;
        int right = height.length - 1;
        int maxWater = 0;
        
        while (left < right) {
            int width = right - left;
            int h = Math.min(height[left], height[right]);
            int water = width * h;
            
            maxWater = Math.max(maxWater, water);
            
            if (height[left] < height[right]) {
                left++;
            } else {
                right--;
            }
        }
        
        return maxWater;
    }
}
```
<!-- slide -->
```javascript
/**
 * @param {number[]} height
 * @return {number}
 */
var maxArea = function(height) {
    let left = 0;
    let right = height.length - 1;
    let maxWater = 0;
    
    while (left < right) {
        const width = right - left;
        const h = Math.min(height[left], height[right]);
        const water = width * h;
        
        maxWater = Math.max(maxWater, water);
        
        if (height[left] < height[right]) {
            left++;
        } else {
            right--;
        }
    }
    
    return maxWater;
};
```
````

**Time Complexity:** O(n) - Single pass through array  
**Space Complexity:** O(1) - Only constant extra space

---

### Approach 2: Brute Force ⭐

Check all possible pairs to find maximum water.

#### Algorithm

1. For each pair of lines (i, j) where i < j
2. Calculate water = min(height[i], height[j]) * (j - i)
3. Track maximum water found

#### Implementation

````carousel
```python
from typing import List

class Solution:
    def maxArea(self, height: List[int]) -> int:
        """
        Find maximum water using brute force approach.
        
        Args:
            height: List of line heights
            
        Returns:
            Maximum water that can be stored
        """
        n = len(height)
        max_water = 0
        
        for i in range(n):
            for j in range(i + 1, n):
                width = j - i
                h = min(height[i], height[j])
                water = width * h
                max_water = max(max_water, water)
        
        return max_water
```
<!-- slide -->
```cpp
#include <vector>
#include <algorithm>
using namespace std;

class Solution {
public:
    int maxArea(vector<int>& height) {
        int n = height.size();
        int maxWater = 0;
        
        for (int i = 0; i < n; i++) {
            for (int j = i + 1; j < n; j++) {
                int width = j - i;
                int h = min(height[i], height[j]);
                int water = width * h;
                maxWater = max(maxWater, water);
            }
        }
        
        return maxWater;
    }
};
```
<!-- slide -->
```java
class Solution {
    public int maxArea(int[] height) {
        int n = height.length;
        int maxWater = 0;
        
        for (int i = 0; i < n; i++) {
            for (int j = i + 1; j < n; j++) {
                int width = j - i;
                int h = Math.min(height[i], height[j]);
                int water = width * h;
                maxWater = Math.max(maxWater, water);
            }
        }
        
        return maxWater;
    }
}
```
<!-- slide -->
```javascript
/**
 * @param {number[]} height
 * @return {number}
 */
var maxArea = function(height) {
    const n = height.length;
    let maxWater = 0;
    
    for (let i = 0; i < n; i++) {
        for (let j = i + 1; j < n; j++) {
            const width = j - i;
            const h = Math.min(height[i], height[j]);
            const water = width * h;
            maxWater = Math.max(maxWater, water);
        }
    }
    
    return maxWater;
};
```
````

**Time Complexity:** O(n²) - Check all pairs  
**Space Complexity:** O(1) - No extra space needed

---

### Approach 3: Optimized Brute Force with Early Termination

Optimize brute force by skipping pairs that can't beat current maximum.

#### Algorithm

1. Sort pairs by height (descending) - not feasible for unsorted input
2. Actually, use smarter pruning: if min(height[i], height[j]) * (n-1) <= maxWater, skip

#### Implementation

````carousel
```python
from typing import List

class Solution:
    def maxArea(self, height: List[int]) -> int:
        """
        Find maximum water with optimized brute force.
        
        Args:
            height: List of line heights
            
        Returns:
            Maximum water that can be stored
        """
        n = len(height)
        max_water = 0
        
        for i in range(n):
            for j in range(i + 1, n):
                width = j - i
                h = min(height[i], height[j])
                water = width * h
                max_water = max(max_water, water)
                
                # Early termination optimization (optional)
                # If both heights are small, remaining pairs won't help
                if height[i] <= height[j]:
                    # height[i] is limiting, skip ahead
                    break
                    
        return max_water
```
<!-- slide -->
```cpp
#include <vector>
#include <algorithm>
using namespace std;

class Solution {
public:
    int maxArea(vector<int>& height) {
        int n = height.size();
        int maxWater = 0;
        
        for (int i = 0; i < n; i++) {
            for (int j = i + 1; j < n; j++) {
                int width = j - i;
                int h = min(height[i], height[j]);
                int water = width * h;
                maxWater = max(maxWater, water);
                
                if (height[i] <= height[j]) {
                    break;
                }
            }
        }
        
        return maxWater;
    }
};
```
<!-- slide -->
```java
class Solution {
    public int maxArea(int[] height) {
        int n = height.length;
        int maxWater = 0;
        
        for (int i = 0; i < n; i++) {
            for (int j = i + 1; j < n; j++) {
                int width = j - i;
                int h = Math.min(height[i], height[j]);
                int water = width * h;
                maxWater = Math.max(maxWater, water);
                
                if (height[i] <= height[j]) {
                    break;
                }
            }
        }
        
        return maxWater;
    }
}
```
<!-- slide -->
```javascript
/**
 * @param {number[]} height
 * @return {number}
 */
var maxArea = function(height) {
    const n = height.length;
    let maxWater = 0;
    
    for (let i = 0; i < n; i++) {
        for (let j = i + 1; j < n; j++) {
            const width = j - i;
            const h = Math.min(height[i], height[j]);
            const water = width * h;
            maxWater = Math.max(maxWater, water);
            
            if (height[i] <= height[j]) {
                break;
            }
        }
    }
    
    return maxWater;
};
```
````

**Time Complexity:** O(n²) worst case, better average case  
**Space Complexity:** O(1) - No extra space

---

### Approach 4: Binary Search Variant (Alternative Perspective)

A variant using binary search-like approach.

#### Algorithm

1. Consider the array as having a maximum possible width
2. Use binary search to find optimal heights
3. This doesn't work directly but shows alternative thinking

Note: This approach doesn't provide O(n) improvement but shows different thinking patterns.

#### Implementation

````carousel
```python
from typing import List

class Solution:
    def maxArea(self, height: List[int]) -> int:
        """
        Binary search inspired approach - maintains max width exploration.
        
        Args:
            height: List of line heights
            
        Returns:
            Maximum water that can be stored
        """
        # This is essentially the two-pointer approach
        # as binary search doesn't work directly here
        return self.two_pointer(height)
    
    def two_pointer(self, height: List[int]) -> int:
        left = 0
        right = len(height) - 1
        max_water = 0
        
        while left < right:
            width = right - left
            h = min(height[left], height[right])
            max_water = max(max_water, width * h)
            
            if height[left] < height[right]:
                left += 1
            else:
                right -= 1
        
        return max_water
```
<!-- slide -->
```cpp
#include <vector>
#include <algorithm>
using namespace std;

class Solution {
public:
    int maxArea(vector<int>& height) {
        // Binary search doesn't directly apply, using two-pointer
        int left = 0;
        int right = height.size() - 1;
        int maxWater = 0;
        
        while (left < right) {
            int width = right - left;
            int h = min(height[left], height[right]);
            maxWater = max(maxWater, width * h);
            
            if (height[left] < height[right]) {
                left++;
            } else {
                right--;
            }
        }
        
        return maxWater;
    }
};
```
<!-- slide -->
```java
class Solution {
    public int maxArea(int[] height) {
        // Two-pointer approach
        int left = 0;
        int right = height.length - 1;
        int maxWater = 0;
        
        while (left < right) {
            int width = right - left;
            int h = Math.min(height[left], height[right]);
            maxWater = Math.max(maxWater, width * h);
            
            if (height[left] < height[right]) {
                left++;
            } else {
                right--;
            }
        }
        
        return maxWater;
    }
}
```
<!-- slide -->
```javascript
/**
 * @param {number[]} height
 * @return {number}
 */
var maxArea = function(height) {
    // Two-pointer - optimal solution
    let left = 0;
    let right = height.length - 1;
    let maxWater = 0;
    
    while (left < right) {
        const width = right - left;
        const h = Math.min(height[left], height[right]);
        maxWater = Math.max(maxWater, width * h);
        
        if (height[left] < height[right]) {
            left++;
        } else {
            right--;
        }
    }
    
    return maxWater;
};
```
````

**Time Complexity:** O(n)  
**Space Complexity:** O(1)

---

## Comparison of Approaches

| Approach | Time Complexity | Space Complexity | Pros | Cons |
|----------|-----------------|------------------|------|------|
| **Two Pointer** | O(n) | O(1) | Optimal, elegant | None |
| **Brute Force** | O(n²) | O(1) | Simple to understand | Too slow for large n |
| **Optimized BF** | O(n²) avg | O(1) | Better constant | Still not optimal |
| **Binary Search** | O(n) | O(1) | Alternative thinking | Essentially two-pointer |

**Recommendation:** 
- Two Pointer is the optimal solution
- Great for demonstrating algorithmic optimization
- Shows understanding of greedy approaches

---

## Explanation of Two Pointer Algorithm

### Why Moving the Shorter Line Works

The key insight is:

1. **Maximum Width**: We start with maximum possible width (first and last lines)
2. **Height Limitation**: Water height is limited by the shorter line
3. **Strategic Movement**: 
   - If height[left] < height[right], moving left can potentially find a taller line
   - If we moved right instead, the width decreases AND height stays the same (or decreases)
   - Moving the shorter line gives us a chance to increase height while potentially decreasing width

### Visual Example

For height = [1,8,6,2,5,4,8,3,7]:

```
Initial: left=0 (h=1), right=8 (h=7), water=1*7=7
Move left (1 < 7): left=1 (h=8), right=8 (h=7), water=7*7=49
Move right (8 > 7): left=1 (h=8), right=7 (h=3), water=6*3=18
Move right (8 > 3): left=1 (h=8), right=6 (h=8), water=5*8=40
... continue

Maximum = 49
```

---

## Complexity Analysis

### Time Complexity Breakdown

| Approach | Best | Average | Worst | Notes |
|----------|------|---------|-------|-------|
| **Two Pointer** | O(n) | O(n) | O(n) | Single pass |
| **Brute Force** | O(n²) | O(n²) | O(n²) | All pairs |
| **Optimized BF** | O(n) | O(n²) | O(n on input²) | Depends |

### Space Complexity Breakdown

| Approach | Space | Notes |
|----------|-------|-------|
| **Two Pointer** | O(1) | Only pointers |
| **Brute Force** | O(1) | No extra space |
| **Optimized BF** | O(1) | No extra space |

---

## Edge Cases and Common Pitfalls

### Edge Cases to Consider

1. **Two Elements Only:**
   ```
   height = [1,1] → Output: 1
   ```

2. **Decreasing Heights:**
   ```
   height = [4,3,2,1] → Output: 3 (between 4 and 3)
   ```

3. **Increasing Heights:**
   ```
   height = [1,2,3,4] → Output: 4 (between 1 and 4)
   ```

4. **All Same Heights:**
   ```
   height = [5,5,5,5,5] → Output: 20 (between first and last)
   ```

5. **Zero Height Lines:**
   ```
   height = [0,1,0,2,0] → Output: 2 (between indices 1 and 3)
   ```

6. **Single Zero Height:**
   ```
   height = [0,1] → Output: 0
   ```

### Common Mistakes to Avoid

1. **Wrong Formula**: 
   - Correct: min(height[i], height[j]) * (j - i)
   - Wrong: height[i] * height[j] (doesn't account for shorter line)

2. **Wrong Pointer Movement**:
   - Always move the pointer with smaller height
   - Not: move either pointer arbitrarily

3. **Off-by-One Errors**:
   - Remember: width = right - left (not right - left + 1)
   - Container needs at least 2 lines

4. **Integer Overflow**:
   - Use appropriate data types
   - height[i] ≤ 10^4, n ≤ 10^5, so max water = 10^4 × 10^5 = 10^9 (fits in 32-bit)

---

## Why This Problem is Important

### Interview Relevance

- **Frequency:** Extremely common in technical interviews
- **Companies:** Google, Amazon, Meta, Apple, Microsoft, Goldman Sachs, Bloomberg
- **Difficulty:** Medium, but tests fundamental algorithm knowledge
- **Variations:** Leads to many related problems

### Learning Outcomes

1. **Two-Pointer Technique**: Master this essential pattern
2. **Greedy Algorithms**: Understanding optimal substructure
3. **Proof of Correctness**: Why moving shorter line works
4. **Optimization**: From O(n²) to O(n)

---

## Related Problems

### Same Problem Category

| Problem | LeetCode # | Difficulty | Description |
|---------|------------|------------|-------------|
| [Trapping Rain Water](https://leetcode.com/problems/trapping-rain-water/) | 42 | Hard | Related water problems |
| [Container With Most Water II](https://leetcode.com/problems/container-with-most-water-ii/) | 1771 | Medium | 2D variation |
| [Maximum Area of a Piece of Cake](https://leetcode.com/problems/maximum-area-of-a-piece-of-cake-after-horizontal-and-vertical-cuts/) | 1775 | Medium | Similar concept |

### Similar Concepts

| Problem | LeetCode # | Difficulty | Description |
|---------|------------|------------|-------------|
| [Valid Palindrome](https://leetcode.com/problems/valid-palindrome/) | 125 | Easy | Two-pointer basic |
| [3Sum](https://leetcode.com/problems/3sum/) | 15 | Medium | Two-pointer + sorting |
| [Longest Mountain in Array](https://leetcode.com/problems/longest-mountain-in-array/) | 845 | Medium | Two-pointer advanced |
| [Shortest Distance to a Character](https://leetcode.com/problems/shortest-distance-to-a-character/) | 821 | Easy | Two-pointer |

---

## Video Tutorial Links

### Recommended Tutorials

1. **[Container With Most Water - NeetCode**
   - Clear explanation with multiple approaches
   - Visual demonstrations
   - Part of popular NeetCode playlist

2. **[Two Pointer Technique Explained](https://www.youtube.com/watch?v=0CPTt15F9j8)**
   - In-depth two-pointer tutorial
   - Step-by-step visualization

3. **[LeetCode 11 Solution - Tech Lead](https://www.youtube.com/watch?v=ZHQgplDCD1Q)**
   - Detailed walkthrough of the solution
   - Interview-focused approach

### Additional Resources

- **[LeetCode Official Solution](https://leetcode.com/problems/container-with-most-water/solutions/)** - Official solutions and community discussions
- **[GeeksforGeeks - Container With Most Water](https://www.geeksforgeeks.org/container-with-most-water/)** - Detailed explanations
- **[Two Pointer - Wikipedia](https://en.wikipedia.org/wiki/Two-pointers_technique)** - Theoretical background

---

## Follow-up Questions

### Basic Level

1. **What is the time complexity of the brute force approach?**
   - Time: O(n²) - checking all n*(n-1)/2 pairs
   - Space: O(1) - no extra space needed

2. **Why do we move the pointer with the smaller height?**
   - Moving the taller pointer would only decrease width while maintaining or decreasing height
   - Moving the shorter pointer gives chance to find a taller line that could increase water
   - This greedy choice never misses the optimal solution

3. **Can this problem be solved using binary search?**
   - Not directly - binary search requires sorted data or monotonic properties
   - The two-pointer approach is the optimal O(n) solution
   - Some try binary search but it doesn't provide better complexity

### Intermediate Level

4. **How would you prove the two-pointer algorithm is correct?**

   **Answer:** 
   - Start with maximum width (left=0, right=n-1)
   - For any pair (i, j), suppose height[i] < height[j]
   - All pairs (k, j) where k < i have width < (j - i) but height ≤ height[i]
   - Therefore, these cannot have more water than (i, j)
   - We can safely skip exploring pairs with index < i when j is fixed
   - By moving i forward, we explore potentially better combinations

5. **What if heights are in a circular array (Container With Most Water II)?**

   **Answer:**
   - Similar two-pointer approach works
   - Start with first and last elements
   - Move the pointer with smaller height
   - Track maximum across all iterations
   - O(n) time and O(1) space

6. **What's the relationship between this problem and Trapping Rain Water?**

   **Answer:**
   - Both involve calculating water between bars
   - Container: max area between any two bars
   - Trapping Rain Water: sum of water at all positions
   - Different formulas and approaches needed

### Advanced Level

7. **How would you find the pair of lines that actually forms the maximum container?**

   **Answer:**
   - Modify the two-pointer algorithm to track indices
   - Store (left, right, max_water) tuple
   - Update indices when max_water is updated
   - Same O(n) time complexity

8. **What if you need to find the top K containers with most water?**

   **Answer:**
   - Use priority queue approach
   - Insert all pairs, extract top K
   - Or: use modified two-pointer with heap exploration
   - More complex than single maximum

9. **How would you handle the case where heights can be negative?**

   **Answer:**
   - Problem states heights are non-negative (0 to 10^4)
   - If negative allowed, formula still works: min could be negative
   - Would need to handle edge cases differently

10. **What is the maximum possible answer for given constraints?**

    **Answer:**
    - Maximum height = 10^4
    - Maximum width = 10^5 - 1 = 99,999
    - Maximum area = 10^4 × 99,999 = 999,990,000 < 2^31
    - Fits in 32-bit signed integer

11. **How would you solve this in a distributed computing environment?**

    **Answer:**
    - Divide array into chunks across machines
    - Find maximum in each chunk
    - Need to consider cross-chunk pairs
    - More complex - essentially becomes finding max of min(height[i], height[j]) × distance
    - May need approximation algorithms for very large data

12. **What's the real-world application of this algorithm?**

    **Answer:**
    - Building design and architecture
    - Water resource management
    - Container/shipping optimization
    - Any scenario requiring maximizing capacity between two points
    - Resource allocation problems

---

## Summary

The **Container With Most Water** problem is a classic algorithmic challenge that demonstrates the power of the two-pointer technique. Key takeaways:

1. **Two Pointer is Optimal**: O(n) time, O(1) space - the best possible
2. **Greedy Choice**: Moving the shorter line is always safe
3. **Proof of Correctness**: Never miss optimal by moving shorter pointer
4. **Visual Understanding**: Think of it as finding maximum area under curve

### Recommended Approach for Interviews

**Two Pointer** is the definitive answer because:
- Shows understanding of algorithmic optimization
- Demonstrates greedy algorithm knowledge
- Can explain proof of correctness
- Follows up well with related questions

The problem is elegant in its simplicity and the insight that a greedy approach yields the optimal solution.

---

## LeetCode Link

[Container With Most Water - LeetCode](https://leetcode.com/problems/container-with-most-water/)
