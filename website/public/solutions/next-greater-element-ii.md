# Next Greater Element II

## Problem Description

Given a circular integer array `nums` (i.e., the next element of `nums[nums.length - 1]` is `nums[0]`), return the next greater number for every element in nums.

The next greater number of a number `x` is the first greater number to its traversing-order next in the array, which means you could search circularly to find its next greater number. If it doesn't exist, return -1 for this number.

**LeetCode Link:** [LeetCode 503 - Next Greater Element II](https://leetcode.com/problems/next-greater-element-ii/)

---

## Examples

### Example 1

**Input:**
```python
nums = [1, 2, 1]
```

**Output:**
```python
[2, -1, 2]
```

**Explanation:**
The first 1's next greater number is 2.
The number 2 can't find next greater number.
The second 1's next greater number needs to search circularly, which is also 2.

### Example 2

**Input:**
```python
nums = [1, 2, 3, 4, 3]
```

**Output:**
```python
[2, 3, 4, -1, 4]
```

---

## Constraints

- `1 <= nums.length <= 10^4`
- `-10^9 <= nums[i] <= 10^9`

---

## Pattern: Monotonic Stack (Circular Array)

This problem uses the **Monotonic Decreasing Stack** pattern, extended to handle circular arrays by iterating 2*n times.

---

## Intuition

The key insight for this problem is understanding that we're working with a **circular array**. In a circular array, elements can wrap around - the "next" element after the last element is the first element.

### Key Observations

1. **Circular Wrap-around**: The next greater element might be before the current element in the array (due to circular nature)

2. **Two-Pass Trick**: By iterating through the array twice (2*n elements), we simulate circular behavior without actually duplicating the array:
   - First pass: Process all original elements
   - Second pass: Process elements again to find greater elements that wrap around

3. **Stack Stores Indices**: We store indices, not values, so we can map back to the original positions

4. **Only Push Once**: During the second iteration, we only process elements but don't push new indices to avoid duplicates

---

## Multiple Approaches with Code

We'll cover two approaches:

1. **Monotonic Stack with 2n iteration** - Optimal solution
2. **Brute Force** - For understanding

---

## Approach 1: Monotonic Stack with 2n Iteration (Optimal)

### Algorithm Steps

1. Create result array initialized with -1
2. Create an empty stack storing indices
3. Iterate through 2*n elements:
   - While stack not empty AND current element > element at stack top:
     - Pop index and set result[popped_index] = current element
   - Only push index when i < n (first pass only)
4. Return result

### Why It Works

The 2n iteration ensures each element can find its next greater even if that greater element is before it in the array (circular wrap). By only pushing during the first n iterations, we avoid duplicates.

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def nextGreaterElements(self, nums: List[int]) -> List[int]:
        """
        Find next greater elements in circular array using monotonic stack.
        
        Time: O(n), Space: O(n)
        """
        n = len(nums)
        result = [-1] * n
        stack = []  # stores indices
        
        for i in range(2 * n):
            # Use modulo to wrap around
            curr = nums[i % n]
            
            # While current is greater than element at stack top
            while stack and nums[stack[-1]] < curr:
                idx = stack.pop()
                result[idx] = curr
            
            # Only push during first pass
            if i < n:
                stack.append(i)
        
        return result
```

<!-- slide -->
```cpp
#include <vector>
#include <stack>
using namespace std;

class Solution {
public:
    vector<int> nextGreaterElements(vector<int>& nums) {
        int n = nums.size();
        vector<int> result(n, -1);
        stack<int> st;
        
        for (int i = 0; i < 2 * n; i++) {
            int curr = nums[i % n];
            
            while (!st.empty() && nums[st.top()] < curr) {
                int idx = st.top();
                st.pop();
                result[idx] = curr;
            }
            
            // Only push during first pass
            if (i < n) {
                st.push(i);
            }
        }
        
        return result;
    }
};
```

<!-- slide -->
```java
import java.util.*;

class Solution {
    public int[] nextGreaterElements(int[] nums) {
        int n = nums.length;
        int[] result = new int[n];
        Arrays.fill(result, -1);
        Stack<Integer> stack = new Stack<>();
        
        for (int i = 0; i < 2 * n; i++) {
            int curr = nums[i % n];
            
            while (!stack.isEmpty() && nums[stack.peek()] < curr) {
                int idx = stack.pop();
                result[idx] = curr;
            }
            
            // Only push during first pass
            if (i < n) {
                stack.push(i);
            }
        }
        
        return result;
    }
}
```

<!-- slide -->
```javascript
/**
 * @param {number[]} nums
 * @return {number[]}
 */
var nextGreaterElements = function(nums) {
    const n = nums.length;
    const result = new Array(n).fill(-1);
    const stack = [];
    
    for (let i = 0; i < 2 * n; i++) {
        const curr = nums[i % n];
        
        while (stack.length > 0 && nums[stack[stack.length - 1]] < curr) {
            const idx = stack.pop();
            result[idx] = curr;
        }
        
        // Only push during first pass
        if (i < n) {
            stack.push(i);
        }
    }
    
    return result;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n), each element pushed and popped at most once |
| **Space** | O(n), for stack and result array |

---

## Approach 2: Brute Force (For Understanding)

### Algorithm Steps

1. For each index i:
   - Start searching from (i+1) % n
   - Continue until finding a greater element or returning to i
2. If no greater found, result[i] = -1

### Why It Works

This is the straightforward approach - check circularly for each element. Works but inefficient.

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def nextGreaterElements(self, nums: List[int]) -> List[int]:
        """
        Brute force approach - for understanding only.
        
        Time: O(n^2), Space: O(n)
        """
        n = len(nums)
        result = [-1] * n
        
        for i in range(n):
            # Start searching from next element (circular)
            j = (i + 1) % n
            while j != i:
                if nums[j] > nums[i]:
                    result[i] = nums[j]
                    break
                j = (j + 1) % n
        
        return result
```

<!-- slide -->
```cpp
#include <vector>
using namespace std;

class Solution {
public:
    vector<int> nextGreaterElements(vector<int>& nums) {
        int n = nums.size();
        vector<int> result(n, -1);
        
        for (int i = 0; i < n; i++) {
            // Start searching from next element (circular)
            int j = (i + 1) % n;
            while (j != i) {
                if (nums[j] > nums[i]) {
                    result[i] = nums[j];
                    break;
                }
                j = (j + 1) % n;
            }
        }
        
        return result;
    }
};
```

<!-- slide -->
```java
class Solution {
    public int[] nextGreaterElements(int[] nums) {
        int n = nums.length;
        int[] result = new int[n];
        Arrays.fill(result, -1);
        
        for (int i = 0; i < n; i++) {
            // Start searching from next element (circular)
            int j = (i + 1) % n;
            while (j != i) {
                if (nums[j] > nums[i]) {
                    result[i] = nums[j];
                    break;
                }
                j = (j + 1) % n;
            }
        }
        
        return result;
    }
}
```

<!-- slide -->
```javascript
/**
 * @param {number[]} nums
 * @return {number[]}
 */
var nextGreaterElements = function(nums) {
    const n = nums.length;
    const result = new Array(n).fill(-1);
    
    for (let i = 0; i < n; i++) {
        // Start searching from next element (circular)
        let j = (i + 1) % n;
        while (j !== i) {
            if (nums[j] > nums[i]) {
                result[i] = nums[j];
                break;
            }
            j = (j + 1) % n;
        }
    }
    
    return result;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n²), for each element scan potentially whole array |
| **Space** | O(n), for result array |

---

## Comparison of Approaches

| Aspect | Monotonic Stack (2n) | Brute Force |
|--------|---------------------|-------------|
| **Time Complexity** | O(n) | O(n²) |
| **Space Complexity** | O(n) | O(n) |
| **LeetCode Optimal** | ✅ | ❌ (too slow) |

**Best Approach:** Use Approach 1 (Monotonic Stack) for optimal solution.

---

## Common Pitfalls

- **Index modulo**: Always use `i % n` when accessing nums to handle circular wrap-around
- **Stack not clearing**: Elements remain in stack after first pass - this is correct behavior
- **Off-by-one**: Only push indices during first pass (i < n) to avoid duplicates
- **Initializing result**: Remember to initialize result with -1 for elements with no greater

---

## Related Problems

Based on similar themes (Monotonic Stack, Circular Array):

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Next Greater Element I | [Link](https://leetcode.com/problems/next-greater-element-i/) | Non-circular version |
| Next Greater Element III | [Link](https://leetcode.com/problems/next-greater-element-iii/) | Next permutation |
| Daily Temperatures | [Link](https://leetcode.com/problems/daily-temperatures/) | Similar pattern |
| Car Fleet II | [Link](https://leetcode.com/problems/car-fleet-ii/) | Advanced version |

---

## Video Tutorial Links

Here are helpful YouTube tutorials explaining the problem and solutions:

1. **[NeetCode - Next Greater Element II](https://www.youtube.com/watch?v=ISw3K5eoD_M)** - Clear explanation with visual examples
2. **[LeetCode 503 - Solution Walkthrough](https://www.youtube.com/watch?v=8em2Z2eWmV8)** - Detailed walkthrough
3. **[Circular Array Pattern](https://www.youtube.com/watch?v=nKf1y1t3b8U)** - Understanding circular arrays

---

## Follow-up Questions

### Q1: How would you modify this to find "Next Smaller Element" in a circular array?

**Answer:** Change the comparison from `<` to `>`. When current element is smaller than the stack top, pop and record as next smaller.

---

### Q2: What if you needed to find the "Previous Greater Element" in a circular array?

**Answer:** Process the array in reverse order (from right to left), but still iterate 2n times with modulo. This finds the previous greater in circular manner.

---

### Q3: How would you handle very large arrays efficiently?

**Answer:** The monotonic stack solution is already O(n) time and space, which is optimal. For very large arrays, consider if you need the full result or just streaming queries.

---

### Q4: Can you solve this without the 2n iteration?

**Answer:** Yes, you could duplicate the array and use a standard next greater approach, but the 2n iteration is more space-efficient (O(n) vs O(2n)).

---

### Q5: What if elements can be equal - should we find "next greater or equal"?

**Answer:** Use `<=` instead of `<` in the comparison. This will treat equal elements as "greater" and pop them from the stack.

---

## Summary

The **Next Greater Element II** problem extends the **Monotonic Stack** pattern to handle **circular arrays**.

Key takeaways:
1. Iterate 2n times to simulate circular wrap-around
2. Only push indices during first n iterations
3. Use modulo for accessing elements: nums[i % n]
4. Time complexity O(n), space O(n)

This problem is essential for understanding how to handle circular data structures with the monotonic stack pattern.

### Pattern Summary

This problem exemplifies the **Monotonic Stack with Circular** pattern, characterized by:
- Using 2n iteration to handle circular nature
- Storing indices rather than values
- Finding next greater/smaller in O(n) time
- Common in stock span and temperature problems

For more details on this pattern and its variations, see the **[Monotonic Stack Pattern](/patterns/monotonic-stack)**.
