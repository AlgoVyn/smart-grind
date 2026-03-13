# Next Greater Element I

## Problem Description

The next greater element of some element x in an array is the first greater element that is to the right of x in the same array.

You are given two distinct 0-indexed integer arrays `nums1` and `nums2`, where `nums1` is a subset of `nums2`.

For each `0 <= i < nums1.length`, find the index `j` such that `nums1[i] == nums2[j]` and determine the next greater element of `nums2[j]` in `nums2`. If there is no next greater element, then the answer for this query is -1.

Return an array `ans` of length `nums1.length` such that `ans[i]` is the next greater element as described above.

**LeetCode Link:** [LeetCode 496 - Next Greater Element I](https://leetcode.com/problems/next-greater-element-i/)

---

## Examples

### Example 1

**Input:**
```python
nums1 = [4, 1, 2], nums2 = [1, 3, 4, 2]
```

**Output:**
```python
[-1, 3, -1]
```

**Explanation:**
The next greater element for each value of nums1 is as follows:
- 4 is underlined in nums2 = [1, 3, 4, 2]. There is no next greater element, so the answer is -1.
- 1 is underlined in nums2 = [1, 3, 4, 2]. The next greater element is 3.
- 2 is underlined in nums2 = [1, 3, 4, 2]. There is no next greater element, so the answer is -1.

### Example 2

**Input:**
```python
nums1 = [2, 4], nums2 = [1, 2, 3, 4]
```

**Output:**
```python
[3, -1]
```

**Explanation:**
The next greater element for each value of nums1 is as follows:
- 2 is underlined in nums2 = [1, 2, 3, 4]. The next greater element is 3.
- 4 is underlined in nums2 = [1, 2, 3, 4]. There is no next greater element, so the answer is -1.

---

## Constraints

- `1 <= nums1.length <= nums2.length <= 1000`
- `0 <= nums1[i], nums2[i] <= 10^4`
- All integers in nums1 and nums2 are unique.
- All the integers of nums1 also appear in nums2.

**Follow up:** Could you find an O(nums1.length + nums2.length) solution?

---

## Pattern: Monotonic Stack

This problem uses a **monotonic decreasing stack** to find the next greater element. We iterate through nums2, maintaining a stack of elements whose next greater element hasn't been found yet. When we encounter a larger element, we pop from the stack and record the greater element for each popped value.

---

## Intuition

The key insight for this problem is understanding that we need to find, for each element, the first element to its right that is greater than it. This is a classic "Next Greater Element" problem.

### Key Observations

1. **Monotonic Stack Property**: The stack maintains elements in decreasing order. When we find a greater element, it's the "next greater" for all smaller elements in the stack.

2. **Why it Works**: When processing nums2 from left to right:
   - Elements pushed onto stack are waiting to find their "next greater"
   - When we encounter a greater element, it automatically becomes the "next greater" for all smaller elements waiting in the stack

3. **Two-Step Process**: 
   - First: Build a map from nums2 (find next greater for each element)
   - Second: Use the map to answer queries from nums1

4. **Time Complexity**: The follow-up asks for O(n + m) - the monotonic stack achieves this because each element is pushed and popped at most once.

---

## Multiple Approaches with Code

We'll cover two approaches:

1. **Monotonic Stack** - Optimal solution (O(n + m))
2. **Brute Force** - For understanding (O(n × m))

---

## Approach 1: Monotonic Stack (Optimal)

### Algorithm Steps

1. Create an empty stack and a hash map
2. Iterate through nums2:
   - While stack is not empty AND current num > stack top:
     - Pop from stack and record current num as its next greater
   - Push current num onto stack
3. After iteration, elements remaining in stack have no next greater
4. Build result by looking up each num from nums1 in the map

### Why It Works

The monotonic decreasing stack ensures that when we find a greater element, it becomes the "next greater" for all smaller elements waiting in the stack. Each element is pushed once and popped at most once.

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def nextGreaterElement(self, nums1: List[int], nums2: List[int]) -> List[int]:
        """
        Find next greater element using monotonic stack.
        
        Time: O(n + m), Space: O(n + m)
        """
        stack = []
        next_greater = {}
        
        # Process nums2
        for num in nums2:
            # While current num is greater than stack top
            while stack and stack[-1] < num:
                next_greater[stack.pop()] = num
            stack.append(num)
        
        # Elements in stack have no next greater
        # Lookup for nums1
        return [next_greater.get(num, -1) for num in nums1]
```

<!-- slide -->
```cpp
#include <vector>
#include <unordered_map>
#include <stack>
using namespace std;

class Solution {
public:
    vector<int> nextGreaterElement(vector<int>& nums1, vector<int>& nums2) {
        stack<int> st;
        unordered_map<int, int> nextGreater;
        
        // Process nums2
        for (int num : nums2) {
            while (!st.empty() && st.top() < num) {
                nextGreater[st.top()] = num;
                st.pop();
            }
            st.push(num);
        }
        
        // Build result for nums1
        vector<int> result;
        for (int num : nums1) {
            if (nextGreater.find(num) != nextGreater.end()) {
                result.push_back(nextGreater[num]);
            } else {
                result.push_back(-1);
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
    public int[] nextGreaterElement(int[] nums1, int[] nums2) {
        Stack<Integer> stack = new Stack<>();
        Map<Integer, Integer> nextGreater = new HashMap<>();
        
        // Process nums2
        for (int num : nums2) {
            while (!stack.isEmpty() && stack.peek() < num) {
                nextGreater.put(stack.pop(), num);
            }
            stack.push(num);
        }
        
        // Build result for nums1
        int[] result = new int[nums1.length];
        for (int i = 0; i < nums1.length; i++) {
            result[i] = nextGreater.getOrDefault(nums1[i], -1);
        }
        
        return result;
    }
}
```

<!-- slide -->
```javascript
/**
 * @param {number[]} nums1
 * @param {number[]} nums2
 * @return {number[]}
 */
var nextGreaterElement = function(nums1, nums2) {
    const stack = [];
    const nextGreater = {};
    
    // Process nums2
    for (const num of nums2) {
        while (stack.length > 0 && stack[stack.length - 1] < num) {
            nextGreater[stack.pop()] = num;
        }
        stack.push(num);
    }
    
    // Build result for nums1
    return nums1.map(num => nextGreater[num] || -1);
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n + m), each element pushed and popped at most once |
| **Space** | O(n + m), for stack and map |

---

## Approach 2: Brute Force (For Understanding)

### Algorithm Steps

1. For each element in nums1:
   - Find its position in nums2
   - Scan rightward until finding a greater element or reaching end
2. Return -1 if no greater element found

### Why It Works

This is the straightforward approach - for each element, search for its next greater. It's correct but inefficient.

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def nextGreaterElement(self, nums1: List[int], nums2: List[int]) -> List[int]:
        """
        Brute force approach - for understanding only.
        
        Time: O(n * m), Space: O(1)
        """
        result = []
        
        for num in nums1:
            # Find position of num in nums2
            idx = nums2.index(num)
            
            # Search for next greater
            found = -1
            for j in range(idx + 1, len(nums2)):
                if nums2[j] > num:
                    found = nums2[j]
                    break
            
            result.append(found)
        
        return result
```

<!-- slide -->
```cpp
#include <vector>
using namespace std;

class Solution {
public:
    vector<int> nextGreaterElement(vector<int>& nums1, vector<int>& nums2) {
        vector<int> result;
        
        for (int num : nums1) {
            // Find position of num in nums2
            int idx = -1;
            for (int i = 0; i < nums2.size(); i++) {
                if (nums2[i] == num) {
                    idx = i;
                    break;
                }
            }
            
            // Search for next greater
            int found = -1;
            for (int j = idx + 1; j < nums2.size(); j++) {
                if (nums2[j] > num) {
                    found = nums2[j];
                    break;
                }
            }
            
            result.push_back(found);
        }
        
        return result;
    }
};
```

<!-- slide -->
```java
class Solution {
    public int[] nextGreaterElement(int[] nums1, int[] nums2) {
        int[] result = new int[nums1.length];
        
        for (int i = 0; i < nums1.length; i++) {
            int num = nums1[i];
            
            // Find position of num in nums2
            int idx = -1;
            for (int j = 0; j < nums2.length; j++) {
                if (nums2[j] == num) {
                    idx = j;
                    break;
                }
            }
            
            // Search for next greater
            int found = -1;
            for (int j = idx + 1; j < nums2.length; j++) {
                if (nums2[j] > num) {
                    found = nums2[j];
                    break;
                }
            }
            
            result[i] = found;
        }
        
        return result;
    }
}
```

<!-- slide -->
```javascript
/**
 * @param {number[]} nums1
 * @param {number[]} nums2
 * @return {number[]}
 */
var nextGreaterElement = function(nums1, nums2) {
    const result = [];
    
    for (const num of nums1) {
        // Find position of num in nums2
        const idx = nums2.indexOf(num);
        
        // Search for next greater
        let found = -1;
        for (let j = idx + 1; j < nums2.length; j++) {
            if (nums2[j] > num) {
                found = nums2[j];
                break;
            }
        }
        
        result.push(found);
    }
    
    return result;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n × m), for each element scan nums2 |
| **Space** | O(1), excluding result array |

---

## Comparison of Approaches

| Aspect | Monotonic Stack | Brute Force |
|--------|-----------------|--------------|
| **Time Complexity** | O(n + m) | O(n × m) |
| **Space Complexity** | O(n + m) | O(1) |
| **LeetCode Optimal** | ✅ | ❌ (too slow) |

**Best Approach:** Use Approach 1 (Monotonic Stack) for optimal solution.

---

## Common Pitfalls

- **Wrong stack condition**: Use `<` (not `<=`) to pop when strictly greater, but `<=` works for duplicates too.
- **Building map for nums1**: After processing nums2, use the map to look up next greater for each element in nums1.
- **Using .get() with default**: For elements without a next greater, return -1 as default.
- **Elements remaining in stack**: These elements have no next greater; they'll have no entry in the map.
- **Processing order**: Make sure to process nums2 first, then query with nums1.

---

## Related Problems

Based on similar themes (Monotonic Stack, Next Greater Element):

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Next Greater Element II | [Link](https://leetcode.com/problems/next-greater-element-ii/) | Circular array version |
| Next Greater Element III | [Link](https://leetcode.com/problems/next-greater-element-iii/) | Next greater permutation |
| Daily Temperatures | [Link](https://leetcode.com/problems/daily-temperatures/) | Similar pattern |
| Online Stock Span | [Link](https://leetcode.com/problems/online-stock-span/) | Related problem |

---

## Video Tutorial Links

Here are helpful YouTube tutorials explaining the problem and solutions:

1. **[NeetCode - Next Greater Element I](https://www.youtube.com/watch?v=5nKdvJ8ygZU)** - Clear explanation with visual examples
2. **[Monotonic Stack Pattern](https://www.youtube.com/watch?v=wc1GCrnYj7I)** - Understanding monotonic stack
3. **[LeetCode 496 - Solution Walkthrough](https://www.youtube.com/watch?v=68jBThz7-80)** - Detailed walkthrough

---

## Follow-up Questions

### Q1: How would you modify the solution for Next Greater Element II (circular array)?

**Answer:** Process nums2 twice - iterate through nums2 concatenated with nums2, or use modulo to simulate circular behavior. The logic remains the same but you process 2n elements.

---

### Q2: What if nums1 was not a subset of nums2?

**Answer:** You'd need to find each element's position in nums2 first, which adds O(n) lookup time. You could use a hash map to store positions: `pos[value] = index` for O(1) lookup.

---

### Q3: How would you find the "Next Smaller Element" instead?

**Answer:** Simply change the comparison from `<` to `>`. When current element is smaller than stack top, pop and record as next smaller.

---

### Q4: Can you solve this without extra space for the map?

**Answer:** Yes, but you'd need to store pairs of (value, next greater) or process nums1 during the nums2 traversal. However, the extra space is minimal (O(n)) and the solution is cleaner with the map.

---

### Q5: How would you handle duplicate values in nums2?

**Answer:** The current solution handles duplicates correctly because we use `<` (not `<=`). For each element, we find the next strictly greater element. If you want the next greater or equal, use `<=`.

---

## Summary

The **Next Greater Element I** problem demonstrates the power of the **Monotonic Stack** pattern for finding next greater elements efficiently.

Key takeaways:
1. Use a decreasing monotonic stack to track elements waiting for their next greater
2. Each element is pushed and popped at most once - O(n) time
3. Build a map from nums2, then query for nums1
4. Time complexity O(n + m), space O(n + m)

This problem is essential for understanding the monotonic stack pattern, which appears in many related problems.

### Pattern Summary

This problem exemplifies the **Monotonic Stack** pattern, characterized by:
- Maintaining elements in sorted order in the stack
- O(n) time complexity by processing each element once
- Finding next greater/smaller elements efficiently
- Useful for stock span, daily temperatures, and similar problems

For more details on this pattern and its variations, see the **[Monotonic Stack Pattern](/patterns/monotonic-stack)**.
