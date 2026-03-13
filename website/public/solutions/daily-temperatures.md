# Daily Temperatures

## Problem Description

Given an array of integers `temperatures` represents the daily temperatures, return an array `answer` such that `answer[i]` is the number of days you have to wait after the `ith` day to get a warmer temperature. If there is no future day for which this is possible, keep `answer[i] == 0` instead.

**Link to problem:** [Daily Temperatures - LeetCode 739](https://leetcode.com/problems/daily-temperatures/)

---

## Examples

**Example 1:**

| Input | Output |
|-------|--------|
| `temperatures = [73,74,75,71,69,72,76,73]` | `[1,1,4,2,1,1,0,0]` |

**Explanation:** 
- Day 0 (73°): Next warmer is day 1 → wait 1 day
- Day 1 (74°): Next warmer is day 2 → wait 1 day
- Day 2 (75°): Next warmer is day 6 → wait 4 days
- Day 3 (71°): Next warmer is day 5 → wait 2 days
- Day 4 (69°): Next warmer is day 5 → wait 1 day
- Day 5 (72°): Next warmer is day 6 → wait 1 day
- Day 6 (76°): No warmer → 0
- Day 7 (73°): No warmer → 0

**Example 2:**

| Input | Output |
|-------|--------|
| `temperatures = [30,40,50,60]` | `[1,1,1,0]` |

**Example 3:**

| Input | Output |
|-------|--------|
| `temperatures = [30,60,90]` | `[1,1,0]` |

---

## Constraints

- `1 <= temperatures.length <= 10^5`
- `30 <= temperatures[i] <= 100`

---

## Pattern: Monotonic Stack

This problem demonstrates the **Monotonic Stack** pattern, which is used to find the next greater (or smaller) element for each position in an array.

### Core Concept

1. Maintain a stack of indices with **decreasing** temperatures
2. When a warmer temperature is found, pop and calculate days waited
3. This avoids comparing each day with all future days (O(n²))

---

## Intuition

### Why Monotonic Stack Works

- We need the **next greater element** for each position
- Instead of checking all future days for each current day, use a stack
- The stack maintains candidates waiting for warmer temperatures
- When a warmer day arrives, it resolves all waiting positions

### Visual Example

```
temperatures: [73, 74, 75, 71, 69, 72, 76, 73]

Day 0 (73): Stack empty → push 0
Day 1 (74): 74 > 73 → pop 0, answer[0] = 1 → push 1
Day 2 (75): 75 > 74 → pop 1, answer[1] = 1 → push 2
Day 3 (71): 71 < 75 → push 3
Day 4 (69): 69 < 71 → push 4
Day 5 (72): 72 > 69 → pop 4, answer[4] = 1
           72 > 71 → pop 3, answer[3] = 2 → push 5
Day 6 (76): 76 > 72 → pop 5, answer[5] = 1 → push 6
Day 7 (73): 73 < 76 → push 7

Result: [1,1,4,2,1,1,0,0]
```

---

## Multiple Approaches with Code

## Approach 1: Monotonic Stack (Optimal)

This is the classic O(n) solution using a decreasing stack.

````carousel
```python
from typing import List

class Solution:
    def dailyTemperatures(self, temperatures: List[int]) -> List[int]:
        """
        Find days until warmer temperature using monotonic stack.
        
        Args:
            temperatures: List of daily temperatures
            
        Returns:
            List of days until warmer temperature
        """
        n = len(temperatures)
        ans = [0] * n
        stack = []  # Store indices with decreasing temperatures
        
        for i in range(n):
            # While current temperature is warmer than stack top
            while stack and temperatures[stack[-1]] < temperatures[i]:
                prev = stack.pop()
                ans[prev] = i - prev
            
            stack.append(i)
        
        return ans
```
<!-- slide -->
```cpp
#include <vector>
#include <stack>
using namespace std;

class Solution {
public:
    vector<int> dailyTemperatures(vector<int>& temperatures) {
        int n = temperatures.size();
        vector<int> ans(n, 0);
        stack<int> st;  // Store indices with decreasing temperatures
        
        for (int i = 0; i < n; i++) {
            // While current temperature is warmer than stack top
            while (!st.empty() && temperatures[st.top()] < temperatures[i]) {
                int prev = st.top();
                st.pop();
                ans[prev] = i - prev;
            }
            st.push(i);
        }
        
        return ans;
    }
};
```
<!-- slide -->
```java
import java.util.Stack;

class Solution {
    public int[] dailyTemperatures(int[] temperatures) {
        int n = temperatures.length;
        int[] ans = new int[n];
        Stack<Integer> stack = new Stack<>();  // Store indices
        
        for (int i = 0; i < n; i++) {
            // While current temperature is warmer than stack top
            while (!stack.isEmpty() && temperatures[stack.peek()] < temperatures[i]) {
                int prev = stack.pop();
                ans[prev] = i - prev;
            }
            stack.push(i);
        }
        
        return ans;
    }
}
```
<!-- slide -->
```javascript
/**
 * @param {number[]} temperatures
 * @return {number[]}
 */
var dailyTemperatures = function(temperatures) {
    const n = temperatures.length;
    const ans = new Array(n).fill(0);
    const stack = [];  // Store indices
    
    for (let i = 0; i < n; i++) {
        // While current temperature is warmer than stack top
        while (stack.length && temperatures[stack[stack.length - 1]] < temperatures[i]) {
            const prev = stack.pop();
            ans[prev] = i - prev;
        }
        stack.push(i);
    }
    
    return ans;
};
```
````

### Complexity Analysis

| Complexity | Value |
|------------|-------|
| **Time** | O(n) - each index pushed and popped at most once |
| **Space** | O(n) - worst case stack size |

---

## Approach 2: Brute Force (Inefficient)

Check each future day for each position - O(n²).

````carousel
```python
from typing import List

class Solution:
    def dailyTemperatures_brute(self, temperatures: List[int]) -> List[int]:
        """
        Brute force approach - O(n²).
        """
        n = len(temperatures)
        ans = [0] * n
        
        for i in range(n):
            for j in range(i + 1, n):
                if temperatures[j] > temperatures[i]:
                    ans[i] = j - i
                    break
        
        return ans
```
<!-- slide -->
```cpp
class Solution {
public:
    vector<int> dailyTemperatures(vector<int>& temperatures) {
        int n = temperatures.size();
        vector<int> ans(n, 0);
        
        for (int i = 0; i < n; i++) {
            for (int j = i + 1; j < n; j++) {
                if (temperatures[j] > temperatures[i]) {
                    ans[i] = j - i;
                    break;
                }
            }
        }
        
        return ans;
    }
};
```
<!-- slide -->
```java
class Solution {
    public int[] dailyTemperatures(int[] temperatures) {
        int n = temperatures.length;
        int[] ans = new int[n];
        
        for (int i = 0; i < n; i++) {
            for (int j = i + 1; j < n; j++) {
                if (temperatures[j] > temperatures[i]) {
                    ans[i] = j - i;
                    break;
                }
            }
        }
        
        return ans;
    }
}
```
<!-- slide -->
```javascript
/**
 * @param {number[]} temperatures
 * @return {number[]}
 */
var dailyTemperatures = function(temperatures) {
    const n = temperatures.length;
    const ans = new Array(n).fill(0);
    
    for (let i = 0; i < n; i++) {
        for (let j = i + 1; j < n; j++) {
            if (temperatures[j] > temperatures[i]) {
                ans[i] = j - i;
                break;
            }
        }
    }
    
    return ans;
};
```
````

### Complexity Analysis

| Complexity | Value |
|------------|-------|
| **Time** | O(n²) - nested loops |
| **Space** | O(n) - result array |

---

## Approach 3: Reverse Traversal with Tracking

Traverse from right, keep track of the minimum future temperature index.

````carousel
```python
from typing import List

class Solution:
    def dailyTemperatures_reverse(self, temperatures: List[int]) -> List[int]:
        """
        Reverse traversal approach.
        """
        n = len(temperatures)
        ans = [0] * n
        
        # Start from the second-to-last element
        for i in range(n - 2, -1, -1):
            j = i + 1
            # Skip positions that can't reach warmer
            while j < n and temperatures[j] <= temperatures[i]:
                if ans[j] == 0:
                    break
                j += ans[j]
            
            if j < n and temperatures[j] > temperatures[i]:
                ans[i] = j - i
        
        return ans
```
<!-- slide -->
```cpp
class Solution {
public:
    vector<int> dailyTemperatures(vector<int>& temperatures) {
        int n = temperatures.size();
        vector<int> ans(n, 0);
        
        // Start from the second-to-last element
        for (int i = n - 2; i >= 0; i--) {
            int j = i + 1;
            // Skip positions that can't reach warmer
            while (j < n && temperatures[j] <= temperatures[i]) {
                if (ans[j] == 0) break;
                j += ans[j];
            }
            
            if (j < n && temperatures[j] > temperatures[i]) {
                ans[i] = j - i;
            }
        }
        
        return ans;
    }
};
```
<!-- slide -->
```java
class Solution {
    public int[] dailyTemperatures(int[] temperatures) {
        int n = temperatures.length;
        int[] ans = new int[n];
        
        // Start from the second-to-last element
        for (int i = n - 2; i >= 0; i--) {
            int j = i + 1;
            // Skip positions that can't reach warmer
            while (j < n && temperatures[j] <= temperatures[i]) {
                if (ans[j] == 0) break;
                j += ans[j];
            }
            
            if (j < n && temperatures[j] > temperatures[i]) {
                ans[i] = j - i;
            }
        }
        
        return ans;
    }
}
```
<!-- slide -->
```javascript
/**
 * @param {number[]} temperatures
 * @return {number[]}
 */
var dailyTemperatures = function(temperatures) {
    const n = temperatures.length;
    const ans = new Array(n).fill(0);
    
    // Start from the second-to-last element
    for (let i = n - 2; i >= 0; i--) {
        let j = i + 1;
        // Skip positions that can't reach warmer
        while (j < n && temperatures[j] <= temperatures[i]) {
            if (ans[j] === 0) break;
            j += ans[j];
        }
        
        if (j < n && temperatures[j] > temperatures[i]) {
            ans[i] = j - i;
        }
    }
    
    return ans;
};
```
````

### Complexity Analysis

| Complexity | Value |
|------------|-------|
| **Time** | O(n) amortized |
| **Space** | O(n) |

---

## Comparison of Approaches

| Approach | Time | Space | Notes |
|----------|------|-------|-------|
| **Monotonic Stack** | O(n) | O(n) | Best, most common |
| **Brute Force** | O(n²) | O(n) | Simple but slow |
| **Reverse + Jump** | O(n) | O(n) | Alternative |

**Best Approach:** Monotonic Stack (Approach 1) is the standard O(n) solution.

---

## Why This Problem is Important

### Interview Relevance

- **Frequency**: Commonly asked in technical interviews
- **Companies**: Google, Amazon, Meta, Microsoft
- **Difficulty**: Medium
- **Concepts**: Monotonic stack, next greater element

### Key Insights

1. Monotonic stack finds next greater/smaller in O(n)
2. Stack stores indices, temperatures for comparison
3. Each element pushed/popped at most once

---

## Related Problems

### Same Pattern (Next Greater Element)

| Problem | LeetCode Link | Difficulty |
|---------|---------------|-------------|
| Next Greater Element I | [Link](https://leetcode.com/problems/next-greater-element-i/) | Easy |
| Next Greater Element II | [Link](https://leetcode.com/problems/next-greater-element-ii/) | Medium |
| Next Smaller Element | [Link](https://leetcode.com/problems/next-smaller-element/) | Medium |

### Similar Concepts

| Problem | LeetCode Link | Difficulty | Related Technique |
|---------|---------------|------------|-------------------|
| Stock Span | [Link](https://leetcode.com/problems/online-stock-span/) | Medium | Monotonic stack |
| Largest Rectangle | [Link](https://leetcode.com/problems/largest-rectangle-in-histogram/) | Hard | Monotonic stack |

---

## Video Tutorial Links

### Recommended Tutorials

1. **[NeetCode - Daily Temperatures](https://www.youtube.com/watch?v/cTbibC5jeFA)** - Clear explanation
2. **[LeetCode Official Solution](https://www.youtube.com/watch?v=cTbibC5jeFA)** - Official walkthrough

### Additional Resources

- **[Monotonic Stack - GeeksforGeeks](https://www.geeksforgeeks.org/stack-set-1/)** - Stack guide
- **[Next Greater Element](https://www.geeksforgeeks.org/next-greater-element/)** - Pattern explanation

---

## Follow-up Questions

### Q1: How would you modify this for Celsius to Fahrenheit conversion?

**Answer:** The algorithm doesn't change - it only compares relative values. Simply convert the temperatures first if needed.

---

### Q2: Can you solve this with O(1) extra space?

**Answer:** No, this problem requires O(n) space in the worst case because each day might need to wait for the last day.

---

### Q3: What if temperatures can be equal?

**Answer:** Currently, the solution uses `<` (strictly greater). Change to `<=` if you want the first day with temperature >= current.

---

### Q4: How does this relate to the stock span problem?

**Answer:** Both use monotonic stack. Stock span tracks consecutive days with lower prices, while daily temperatures tracks days until higher temperature.

---

### Q5: What edge cases should be tested?

**Answer:**
- Decreasing temperatures (all zeros)
- Increasing temperatures (1, 2, 3, ...)
- Constant temperatures
- Single element
- Two elements

---

## Common Pitfalls

### 1. Wrong Comparison Direction
**Issue:** Using `>` instead of `<`.

**Solution:** We want to find the next greater, so use `<` when popping from stack (current is greater).

### 2. Not Initializing Answer
**Issue:** Forgetting to initialize answer array with zeros.

**Solution:** Initialize `ans = [0] * n` as default is 0 (no warmer day).

### 3. Stack Stores Temperatures Instead of Indices
**Issue:** Storing temperatures makes it hard to calculate days.

**Solution:** Always store indices in the stack for easy day calculation.

---

## Summary

The **Daily Temperatures** problem demonstrates:

- **Monotonic Stack**: O(n) solution for next greater element
- **Space-Time Tradeoff**: Use stack to avoid O(n²)
- **Pattern Recognition**: Common in many problems

Key takeaways:
1. Maintain decreasing stack of indices
2. Pop when warmer temperature found
3. Each element pushed/popped at most once
4. O(n) time, O(n) space

---

## Additional Resources

- [LeetCode Problem Discussion](https://leetcode.com/problems/daily-temperatures/discuss/)
- [Pattern: Monotonic Stack](/patterns/monotonic-stack)
