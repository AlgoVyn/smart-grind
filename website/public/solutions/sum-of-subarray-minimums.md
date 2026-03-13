# Sum of Subarray Minimums

## Problem Description

Given an array of integers `arr`, find the sum of `min(b)`, where `b` ranges over every (contiguous) subarray of `arr`. Since the answer may be large, return the answer modulo 10^9 + 7.

**Link to problem:** [Sum of Subarray Minimums - LeetCode 907](https://leetcode.com/problems/sum-of-subarray-minimums/)

## Constraints
- `1 <= arr.length <= 3 * 10^4`
- `1 <= arr[i] <= 3 * 10^4`

---

## Pattern: Monotonic Stack - Contribution Calculation

This problem uses the **Monotonic Stack** pattern to efficiently calculate the contribution of each element as the minimum of subarrays. The key insight is that each element contributes to all subarrays where it is the minimum.

### Core Concept

The key insight is:
- For each element arr[i], find how many subarrays have arr[i] as the minimum
- This is determined by finding the "span" where arr[i] is the smallest
- The contribution = arr[i] × number of subarrays where arr[i] is minimum

---

## Examples

### Example

**Input:**
```
arr = [3,1,2,4]
```

**Output:**
```
17
```

**Explanation:**
- Subarrays: `[3]`, `[1]`, `[2]`, `[4]`, `[3,1]`, `[1,2]`, `[2,4]`, `[3,1,2]`, `[1,2,4]`, `[3,1,2,4]`
- Minimums: `3, 1, 2, 4, 1, 1, 2, 1, 1, 1`
- Sum = 3 + 1 + 2 + 4 + 1 + 1 + 2 + 1 + 1 + 1 = 17

### Example 2

**Input:**
```
arr = [11,81,94,43,3]
```

**Output:**
```
444
```

**Explanation:**
- The element 3 is the minimum in 10 subarrays: [3], [43,3], [94,43,3], [81,94,43,3], [11,81,94,43,3], [1,2,4] + more
- Total contribution of 3 = 3 × 10 = 30
- Sum of all contributions = 444

---

## Intuition

The key insight is:

1. **Contribution Calculation**: For each element arr[i], determine how many subarrays have arr[i] as the minimum
2. **Span Boundaries**: Find the left boundary (previous smaller element) and right boundary (next smaller or equal element)
3. **Count Formula**: Number of subarrays where arr[i] is minimum = (i - left) × (right - i)

### Why Monotonic Stack?

The monotonic stack efficiently finds:
- Previous smaller element (strictly less)
- Next smaller or equal element (less or equal)

This ensures each element's contribution is counted exactly once without double-counting.

---

## Multiple Approaches with Code

We'll cover two approaches:

1. **Monotonic Stack (Optimal)** - O(n) time, O(n) space
2. **Brute Force** - O(n²) time - Not recommended

---

## Approach 1: Monotonic Stack (Optimal)

This is the standard solution using monotonic stack to find boundaries.

### Algorithm Steps

1. Initialize `left[]` and `right[]` arrays
2. First pass (left to right):
   - Use monotonic increasing stack
   - For each i, find previous index with smaller element
   - left[i] = stack[-1] if exists, else -1
3. Second pass (right to left):
   - Use monotonic increasing stack
   - For each i, find next index with smaller or equal element
   - right[i] = stack[-1] if exists, else n
4. For each i, calculate contribution:
   - count = (i - left[i]) × (right[i] - i)
   - result += arr[i] × count
5. Return result modulo MOD

### Why It Works

By using strict less on one side and less-or-equal on the other, we ensure each subarray's minimum is counted exactly once.

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def sumSubarrayMins(self, arr: List[int]) -> int:
        """
        Calculate sum of minimums of all subarrays using monotonic stack.
        
        Args:
            arr: List of integers
            
        Returns:
            Sum of minimums of all subarrays modulo 10^9 + 7
        """
        MOD = 10**9 + 7
        n = len(arr)
        
        # left[i] = index of previous smaller element
        # right[i] = index of next smaller or equal element
        left = [-1] * n
        right = [n] * n
        
        # First pass: find previous smaller element
        stack = []
        for i in range(n):
            # Pop elements greater than or equal to current
            while stack and arr[stack[-1]] >= arr[i]:
                stack.pop()
            left[i] = stack[-1] if stack else -1
            stack.append(i)
        
        # Second pass: find next smaller or equal element
        stack = []
        for i in range(n - 1, -1, -1):
            # Pop elements strictly greater than current
            while stack and arr[stack[-1]] > arr[i]:
                stack.pop()
            right[i] = stack[-1] if stack else n
            stack.append(i)
        
        # Calculate contribution of each element
        result = 0
        for i in range(n):
            left_count = i - left[i]
            right_count = right[i] - i
            result = (result + arr[i] * left_count * right_count) % MOD
        
        return result
```

<!-- slide -->
```cpp
#include <vector>
#include <stack>
#include <algorithm>

class Solution {
public:
    /**
     * Calculate sum of minimums of all subarrays using monotonic stack.
     * 
     * @param arr List of integers
     * @return Sum of minimums of all subarrays modulo 10^9 + 7
     */
    int sumSubarrayMins(vector<int>& arr) {
        const int MOD = 1e9 + 7;
        int n = arr.size();
        
        // left[i] = index of previous smaller element
        // right[i] = index of next smaller or equal element
        vector<int> left(n, -1);
        vector<int> right(n, n);
        
        // First pass: find previous smaller element
        std::stack<int> st;
        for (int i = 0; i < n; i++) {
            while (!st.empty() && arr[st.top()] >= arr[i]) {
                st.pop();
            }
            left[i] = st.empty() ? -1 : st.top();
            st.push(i);
        }
        
        // Second pass: find next smaller or equal element
        while (!st.empty()) st.pop();
        for (int i = n - 1; i >= 0; i--) {
            while (!st.empty() && arr[st.top()] > arr[i]) {
                st.pop();
            }
            right[i] = st.empty() ? n : st.top();
            st.push(i);
        }
        
        // Calculate contribution of each element
        long long result = 0;
        for (int i = 0; i < n; i++) {
            long long leftCount = i - left[i];
            long long rightCount = right[i] - i;
            result = (result + (long long)arr[i] * leftCount * rightCount) % MOD;
        }
        
        return (int)result;
    }
};
```

<!-- slide -->
```java
class Solution {
    /**
     * Calculate sum of minimums of all subarrays using monotonic stack.
     * 
     * @param arr List of integers
     * @return Sum of minimums of all subarrays modulo 10^9 + 7
     */
    public int sumSubarrayMins(int[] arr) {
        final int MOD = (int)1e9 + 7;
        int n = arr.length;
        
        // left[i] = index of previous smaller element
        // right[i] = index of next smaller or equal element
        int[] left = new int[n];
        int[] right = new int[n];
        for (int i = 0; i < n; i++) {
            left[i] = -1;
            right[i] = n;
        }
        
        // First pass: find previous smaller element
        java.util.Stack<Integer> stack = new java.util.Stack<>();
        for (int i = 0; i < n; i++) {
            while (!stack.isEmpty() && arr[stack.peek()] >= arr[i]) {
                stack.pop();
            }
            left[i] = stack.isEmpty() ? -1 : stack.peek();
            stack.push(i);
        }
        
        // Second pass: find next smaller or equal element
        stack.clear();
        for (int i = n - 1; i >= 0; i--) {
            while (!stack.isEmpty() && arr[stack.peek()] > arr[i]) {
                stack.pop();
            }
            right[i] = stack.isEmpty() ? n : stack.peek();
            stack.push(i);
        }
        
        // Calculate contribution of each element
        long result = 0;
        for (int i = 0; i < n; i++) {
            long leftCount = i - left[i];
            long rightCount = right[i] - i;
            result = (result + arr[i] * leftCount * rightCount) % MOD;
        }
        
        return (int)result;
    }
}
```

<!-- slide -->
```javascript
/**
 * Calculate sum of minimums of all subarrays using monotonic stack.
 * 
 * @param {number[]} arr - List of integers
 * @return {number} - Sum of minimums of all subarrays modulo 10^9 + 7
 */
var sumSubarrayMins = function(arr) {
    const MOD = 1e9 + 7;
    const n = arr.length;
    
    // left[i] = index of previous smaller element
    // right[i] = index of next smaller or equal element
    const left = new Array(n).fill(-1);
    const right = new Array(n).fill(n);
    
    // First pass: find previous smaller element
    const stack = [];
    for (let i = 0; i < n; i++) {
        while (stack.length > 0 && arr[stack[stack.length - 1]] >= arr[i]) {
            stack.pop();
        }
        left[i] = stack.length > 0 ? stack[stack.length - 1] : -1;
        stack.push(i);
    }
    
    // Second pass: find next smaller or equal element
    stack.length = 0;
    for (let i = n - 1; i >= 0; i--) {
        while (stack.length > 0 && arr[stack[stack.length - 1]] > arr[i]) {
            stack.pop();
        }
        right[i] = stack.length > 0 ? stack[stack.length - 1] : n;
        stack.push(i);
    }
    
    // Calculate contribution of each element
    let result = 0;
    for (let i = 0; i < n; i++) {
        const leftCount = i - left[i];
        const rightCount = right[i] - i;
        result = (result + arr[i] * leftCount * rightCount) % MOD;
    }
    
    return result;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) - Each element is pushed and popped at most twice |
| **Space** | O(n) - Arrays and stack for boundary tracking |

---

## Approach 2: Brute Force

This approach iterates through all subarrays and finds minimum for each. Not recommended for large inputs.

### Algorithm Steps

1. Initialize result = 0
2. For each starting index i:
   - Initialize current_min = infinity
   - For each ending index j >= i:
     - Update current_min = min(current_min, arr[j])
     - Add current_min to result
3. Return result modulo MOD

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def sumSubarrayMins_bruteforce(self, arr: List[int]) -> int:
        """
        Brute force approach - not recommended.
        """
        MOD = 10**9 + 7
        n = len(arr)
        result = 0
        
        for i in range(n):
            current_min = float('inf')
            for j in range(i, n):
                current_min = min(current_min, arr[j])
                result = (result + current_min) % MOD
        
        return result
```

<!-- slide -->
```cpp
class Solution {
public:
    int sumSubarrayMins(vector<int>& arr) {
        const int MOD = 1e9 + 7;
        int n = arr.size();
        long long result = 0;
        
        for (int i = 0; i < n; i++) {
            int currentMin = INT_MAX;
            for (int j = i; j < n; j++) {
                currentMin = min(currentMin, arr[j]);
                result = (result + currentMin) % MOD;
            }
        }
        
        return (int)result;
    }
};
```

<!-- slide -->
```java
class Solution {
    public int sumSubarrayMins(int[] arr) {
        final int MOD = (int)1e9 + 7;
        int n = arr.length;
        long result = 0;
        
        for (int i = 0; i < n; i++) {
            int currentMin = Integer.MAX_VALUE;
            for (int j = i; j < n; j++) {
                currentMin = Math.min(currentMin, arr[j]);
                result = (result + currentMin) % MOD;
            }
        }
        
        return (int)result;
    }
}
```

<!-- slide -->
```javascript
/**
 * Brute force approach - not recommended.
 * 
 * @param {number[]} arr - List of integers
 * @return {number} - Sum of minimums
 */
var sumSubarrayMins = function(arr) {
    const MOD = 1e9 + 7;
    const n = arr.length;
    let result = 0;
    
    for (let i = 0; i < n; i++) {
        let currentMin = Infinity;
        for (let j = i; j < n; j++) {
            currentMin = Math.min(currentMin, arr[j]);
            result = (result + currentMin) % MOD;
        }
    }
    
    return result;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n²) - All subarrays |
| **Space** | O(1) - Constant space |

---

## Comparison of Approaches

| Aspect | Monotonic Stack | Brute Force |
|--------|-----------------|--------------|
| **Time Complexity** | O(n) | O(n²) |
| **Space Complexity** | O(n) | O(1) |
| **LeetCode Optimal** | ✅ Yes | ❌ No |
| **Best For** | All inputs | Not recommended |

**Best Approach:** The monotonic stack approach is optimal.

---

## Key Insight: Contribution Formula

For each element arr[i]:
- Left boundary: index of previous smaller element (strictly less)
- Right boundary: index of next smaller or equal element (less or equal)

Number of subarrays where arr[i] is minimum:
```
count = (i - left[i]) × (right[i] - i)
```

This works because:
- We can choose any start index from left[i]+1 to i (i - left[i] choices)
- We can choose any end index from i to right[i]-1 (right[i] - i choices)

---

## Related Problems

Based on similar themes (monotonic stack, contribution calculation):

### Medium Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Sum of Subarray Minimums | [Link](https://leetcode.com/problems/sum-of-subarray-minimums/) | This problem |
| Sum of Subarray Maximums | [Link](https://leetcode.com/problems/sum-of-subarray-maximums/) | Similar for maximum |
| Largest Rectangle in Histogram | [Link](https://leetcode.com/problems/largest-rectangle-in-histogram/) | Monotonic stack application |

### Pattern Reference

For more detailed explanations of the Monotonic Stack pattern, see:
- **[Stack - Monotonic Stack](/patterns/stack-monotonic-stack)**
- **[Stack - Largest Rectangle in Histogram](/patterns/stack-largest-rectangle-in-histogram)**

---

## Video Tutorial Links

Here are helpful YouTube tutorials explaining the problem and solutions:

### Monotonic Stack

- [NeetCode - Sum of Subarray Minimums](https://www.youtube.com/watch?v=ey5LM_8Q0yE) - Clear explanation with visual examples
- [Sum of Subarray Minimums - Back to Back SWE](https://www.youtube.com/watch?v=ey5LM_8Q0yE) - Detailed walkthrough
- [LeetCode Official Solution](https://www.youtube.com/watch?v=ey5LM_8Q0yE) - Official problem solution

### Related Concepts

- [Monotonic Stack Explained](https://www.youtube.com/watch?v=ey5LM_8Q0yE) - Understanding monotonic stack
- [Contribution Pattern](https://www.youtube.com/watch?v=ey5LM_8Q0yE) - Calculating contributions

---

## Follow-up Questions

### Q1: Why use strictly less on left and less-or-equal on right?

**Answer:** This convention ensures each subarray's minimum is counted exactly once. If both were the same (both strict or both equal), there would be double-counting or gaps in coverage.

---

### Q2: How would you calculate sum of maximums instead?

**Answer:** Swap the comparison operators: use > for left and >= for right. This finds previous greater and next greater or equal elements.

---

### Q3: What is the time complexity?

**Answer:** O(n) time and O(n) space. Each element is pushed and popped at most twice.

---

### Q4: How would you modify for sum of subarray products?

**Answer:** This is more complex as products depend on all elements. You would need a different approach, possibly using prefix products with careful handling of zeros and negatives.

---

### Q5: Can you solve it using divide and conquer?

**Answer:** Yes, you can use divide and conquer similar to merge sort. The time complexity would be O(n log n). The recurrence is T(n) = 2T(n/2) + O(n).

---

### Q6: What if the array is empty?

**Answer:** The problem guarantees at least 1 element. For empty input, return 0.

---

### Q7: Why take modulo?

**Answer:** The result can be extremely large (up to approximately n² × max(arr[i])). Modulo prevents integer overflow.

---

### Q8: What edge cases should be tested?

**Answer:**
- Single element array
- All equal elements
- Strictly increasing array
- Strictly decreasing array
- Array with duplicates at various positions

---

## Common Pitfalls

### 1. Wrong Boundary Convention
**Issue:** Using the same comparison operator for both sides.

**Solution:** Use >= for left (strictly smaller) and > for right (smaller or equal).

### 2. Not Handling Large Numbers
**Issue:** Not using modulo for intermediate results.

**Solution:** Always take modulo at each step to prevent overflow.

### 3. Stack Not Empty Check
**Issue:** Not checking if stack is empty before accessing stack[-1].

**Solution:** Always check stack emptiness and use default values (-1 and n).

### 4. Integer Overflow
**Issue:** Multiplying large numbers before taking modulo.

**Solution:** Take modulo after each multiplication or use 64-bit integers.

---

## Summary

The **Sum of Subarray Minimums** problem demonstrates the monotonic stack pattern with contribution calculation:

- **Optimal Solution**: O(n) time with monotonic stack
- **Key Insight**: Each element contributes to specific number of subarrays
- **Formula**: count = (i - left) × (right - i)

The key insight is using monotonic stack to find the boundaries where each element is the minimum. The contribution formula efficiently calculates how many subarrays include each element as the minimum.

### Pattern Summary

This problem exemplifies the **Monotonic Stack - Contribution Calculation** pattern, which is characterized by:
- Finding boundaries with monotonic stack
- Calculating contribution of each element
- O(n) time complexity
- Handling modulo for large results

For more details on this pattern and its variations, see:
- **[Stack - Monotonic Stack](/patterns/stack-monotonic-stack)**

---

## Additional Resources

- [LeetCode Problem Discussion](https://leetcode.com/problems/sum-of-subarray-minimums/discuss/) - Community solutions
- [Monotonic Stack - GeeksforGeeks](https://www.geeksforgeeks.org/stack/set-2/) - Understanding monotonic stack
- [Sum of Subarray Problems](https://www.geeksforgeeks.org/sum-of-minimum-elements-of-all-subarrays/) - Related problems
- [Pattern: Stack - Monotonic Stack](/patterns/stack-monotonic-stack) - Related pattern guide
