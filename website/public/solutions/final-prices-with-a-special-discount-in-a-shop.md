# Final Prices With A Special Discount In A Shop

## Problem Description

You are given an integer array `prices` where `prices[i]` is the price of the ith item in a shop.

There is a special discount for items in the shop. If you buy the ith item, then you will receive a discount equivalent to `prices[j]` where `j` is the minimum index such that `j > i` and `prices[j] <= prices[i]`. Otherwise, you will not receive any discount at all.

Return an integer array `answer` where `answer[i]` is the final price you will pay for the ith item of the shop, considering the special discount.

**Link to problem:** [Final Prices With a Special Discount in a Shop - LeetCode 1475](https://leetcode.com/problems/final-prices-with-a-special-discount-in-a-shop/)

## Constraints
- `1 <= prices.length <= 500`
- `1 <= prices[i] <= 1000`

---

## Pattern: Monotonic Stack - Next Smaller Element

This problem is a classic example of the **Monotonic Stack - Next Smaller Element** pattern. The pattern uses a monotonically increasing/decreasing stack to efficiently find the next smaller (or greater) element for each position in an array.

### Core Concept

The fundamental idea is maintaining a stack of indices with monotonically increasing/decreasing values:
- **Next Smaller Element**: For each element, find the first smaller element to its right
- **Stack Invariant**: Stack maintains indices in increasing order of their corresponding values
- **Efficiency**: Each element is pushed and popped at most once, achieving O(n) time

---

## Examples

### Example

**Input:**
```
prices = [8,4,6,2,3]
```

**Output:**
```
[4,2,4,2,3]
```

**Explanation:**
- For item 0 with price=8, find next smaller to the right: prices[1]=4 ≤ 8. Discount = 4, final price = 8-4 = 4
- For item 1 with price=4, find next smaller to the right: prices[3]=2 ≤ 4. Discount = 2, final price = 4-2 = 2
- For item 2 with price=6, find next smaller to the right: prices[3]=2 ≤ 6. Discount = 2, final price = 6-2 = 4
- For item 3 with price=2, no smaller element to the right, no discount
- For item 4 with price=3, no smaller element to the right, no discount

### Example 2

**Input:**
```
prices = [1,2,3,4,5]
```

**Output:**
```
[1,2,3,4,5]
```

**Explanation:** Prices are strictly increasing, so no element has a smaller element to its right. No discounts applied.

### Example 3

**Input:**
```
prices = [10,1,1,6]
```

**Output:**
```
[9,0,1,6]
```

**Explanation:**
- For item 0 with price=10, find next smaller: prices[1]=1 ≤ 10. Discount = 1, final = 9
- For item 1 with price=1, find next smaller: prices[2]=1 ≤ 1. Discount = 1, final = 0
- For item 2 with price=1, no smaller to right, final = 1
- For item 3 with price=6, no smaller to right, final = 6

---

## Intuition

The key insight is that for each item, we need to find the first price to its right that is less than or equal to the current price. This is exactly the "Next Smaller Element" problem.

Two main approaches:
1. **Monotonic Stack (Optimal)**: O(n) time - iterate right to left, maintaining a stack of potential discounts
2. **Brute Force**: O(n²) time - for each element, scan right to find the smaller element

The monotonic stack works because:
- When processing from right to left, we maintain indices of elements in increasing order
- For each new element, we pop all indices with larger values (they can't be our answer)
- The remaining top of stack is the next smaller element

---

## Multiple Approaches with Code

We'll cover two approaches:

1. **Monotonic Stack (Optimal)** - O(n) time, O(n) space
2. **Brute Force** - O(n²) time, O(n) space

---

## Approach 1: Monotonic Stack (Optimal)

This is the optimal solution with O(n) time complexity. We use a monotonically increasing stack to find the next smaller element for each position.

### Algorithm Steps

1. Initialize an empty stack and answer array
2. Iterate from right to left (n-1 to 0):
   - While stack is not empty AND prices[stack.top] > prices[i], pop from stack
   - If stack is not empty, the top is the next smaller element
   - Set answer[i] = prices[i] - prices[stack.top] if stack exists, else prices[i]
   - Push current index onto stack
3. Return answer array

### Why It Works

The stack maintains indices in increasing order of their prices. When we encounter a new price, we remove all indices with higher prices (they can't be the "next smaller" for any future element). The remaining top gives us the answer.

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def finalPrices(self, prices: List[int]) -> List[int]:
        """
        Calculate final prices using monotonic stack.
        
        Args:
            prices: List of item prices
            
        Returns:
            List of final prices after discount
        """
        n = len(prices)
        answer = [0] * n
        stack = []
        
        for i in range(n - 1, -1, -1):
            # Pop elements with prices greater than current
            while stack and prices[stack[-1]] > prices[i]:
                stack.pop()
            
            # Calculate final price
            if stack:
                answer[i] = prices[i] - prices[stack[-1]]
            else:
                answer[i] = prices[i]
            
            stack.append(i)
        
        return answer
```

<!-- slide -->
```cpp
class Solution {
public:
    vector<int> finalPrices(vector<int>& prices) {
        int n = prices.size();
        vector<int> answer(n, 0);
        stack<int> st;
        
        for (int i = n - 1; i >= 0; i--) {
            // Pop elements with prices greater than current
            while (!st.empty() && prices[st.top()] > prices[i]) {
                st.pop();
            }
            
            // Calculate final price
            if (!st.empty()) {
                answer[i] = prices[i] - prices[st.top()];
            } else {
                answer[i] = prices[i];
            }
            
            st.push(i);
        }
        
        return answer;
    }
};
```

<!-- slide -->
```java
class Solution {
    public int[] finalPrices(int[] prices) {
        int n = prices.length;
        int[] answer = new int[n];
        Stack<Integer> stack = new Stack<>();
        
        for (int i = n - 1; i >= 0; i--) {
            // Pop elements with prices greater than current
            while (!stack.isEmpty() && prices[stack.peek()] > prices[i]) {
                stack.pop();
            }
            
            // Calculate final price
            if (!stack.isEmpty()) {
                answer[i] = prices[i] - prices[stack.peek()];
            } else {
                answer[i] = prices[i];
            }
            
            stack.push(i);
        }
        
        return answer;
    }
}
```

<!-- slide -->
```javascript
/**
 * @param {number[]} prices
 * @return {number[]}
 */
var finalPrices = function(prices) {
    const n = prices.length;
    const answer = new Array(n);
    const stack = [];
    
    for (let i = n - 1; i >= 0; i--) {
        // Pop elements with prices greater than current
        while (stack.length > 0 && prices[stack[stack.length - 1]] > prices[i]) {
            stack.pop();
        }
        
        // Calculate final price
        if (stack.length > 0) {
            answer[i] = prices[i] - prices[stack[stack.length - 1]];
        } else {
            answer[i] = prices[i];
        }
        
        stack.push(i);
    }
    
    return answer;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) - Each element pushed and popped at most once |
| **Space** | O(n) - Stack stores at most n indices |

---

## Approach 2: Brute Force

A simpler but less efficient approach. For each element, scan to the right to find the first smaller element.

### Algorithm Steps

1. Initialize answer array
2. For each index i from 0 to n-1:
   - Scan j from i+1 to n-1
   - Find first j where prices[j] <= prices[i]
   - If found, apply discount; otherwise no discount
3. Return answer array

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def finalPrices_bruteforce(self, prices: List[int]) -> List[int]:
        """
        Calculate final prices using brute force.
        
        Args:
            prices: List of item prices
            
        Returns:
            List of final prices after discount
        """
        n = len(prices)
        answer = [0] * n
        
        for i in range(n):
            discount = 0
            for j in range(i + 1, n):
                if prices[j] <= prices[i]:
                    discount = prices[j]
                    break
            answer[i] = prices[i] - discount
        
        return answer
```

<!-- slide -->
```cpp
class Solution {
public:
    vector<int> finalPrices(vector<int>& prices) {
        int n = prices.size();
        vector<int> answer(n, 0);
        
        for (int i = 0; i < n; i++) {
            int discount = 0;
            for (int j = i + 1; j < n; j++) {
                if (prices[j] <= prices[i]) {
                    discount = prices[j];
                    break;
                }
            }
            answer[i] = prices[i] - discount;
        }
        
        return answer;
    }
};
```

<!-- slide -->
```java
class Solution {
    public int[] finalPrices(int[] prices) {
        int n = prices.length;
        int[] answer = new int[n];
        
        for (int i = 0; i < n; i++) {
            int discount = 0;
            for (int j = i + 1; j < n; j++) {
                if (prices[j] <= prices[i]) {
                    discount = prices[j];
                    break;
                }
            }
            answer[i] = prices[i] - discount;
        }
        
        return answer;
    }
}
```

<!-- slide -->
```javascript
var finalPrices = function(prices) {
    const n = prices.length;
    const answer = new Array(n);
    
    for (let i = 0; i < n; i++) {
        let discount = 0;
        for (let j = i + 1; j < n; j++) {
            if (prices[j] <= prices[i]) {
                discount = prices[j];
                break;
            }
        }
        answer[i] = prices[i] - discount;
    }
    
    return answer;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n²) - Nested loops |
| **Space** | O(n) - Answer array |

---

## Comparison of Approaches

| Aspect | Monotonic Stack | Brute Force |
|--------|-----------------|-------------|
| **Time Complexity** | O(n) | O(n²) |
| **Space Complexity** | O(n) | O(n) |
| **Implementation** | Moderate | Simple |
| **LeetCode Optimal** | ✅ Yes | ❌ No |

**Best Approach:** Monotonic Stack is optimal with O(n) time complexity.

---

## Why Monotonic Stack is Optimal

The monotonic stack approach is optimal because:

1. **Single Pass**: Each element is processed exactly once
2. **Constant Operations per Element**: Each element is pushed and popped at most once
3. **No Redundant Comparisons**: Avoids comparing elements multiple times
4. **Industry Standard**: Widely used solution for next smaller/larger element problems
5. **Linear Time**: Achieves O(n) which is the theoretical lower bound for this problem

---

## Related Problems

Based on similar themes (monotonic stack, next element queries):

### Easy Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Next Greater Element I | [Link](https://leetcode.com/problems/next-greater-element-i/) | Find next greater element |
| Valid Parentheses | [Link](https://leetcode.com/problems/valid-parentheses/) | Stack-based validation |

### Medium Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Next Greater Element II | [Link](https://leetcode.com/problems/next-greater-element-ii/) | Circular array version |
| Daily Temperatures | [Link](https://leetcode.com/problems/daily-temperatures/) | Find next warmer day |
| Online Stock Span | [Link](https://leetcode.com/problems/online-stock-span/) | Stock price spans |
| Sum of Subarray Minimums | [Link](https://leetcode.com/problems/sum-of-subarray-minimums/) | Sum of all subarray minimums |

### Pattern Reference

For more detailed explanations of the Monotonic Stack pattern and its variations, see:
- **[Monotonic Stack Pattern](/patterns/monotonic-stack-next-smaller-greater)**

---

## Video Tutorial Links

Here are helpful YouTube tutorials explaining the problem and solutions:

### Monotonic Stack

- [NeetCode - Final Prices with a Special Discount](https://www.youtube.com/watch?v=8hQPLSSjkMY) - Clear explanation
- [Back to Back SWE - Monotonic Stack](https://www.youtube.com/watch?v=8Q1nQkVGYQ8) - Detailed walkthrough
- [Monotonic Stack Explained](https://www.youtube.com/watch?v=8hQPLSSjkMY) - Understanding the pattern

### Related Problems

- [Next Greater Element Problem](https://www.youtube.com/watch?v=8Q1nQkVGYQ8) - Similar concept
- [Daily Temperatures Solution](https://www.youtube.com/watch?v=8hQPLSSjkMY) - Application of pattern

---

## Follow-up Questions

### Q1: How would you modify for "next greater element" instead of smaller?

**Answer:** Change the comparison from `>` to `<` and maintain a decreasing stack. The logic is symmetric.

---

### Q2: How would you handle the circular array version (next smaller to the right in circular manner)?

**Answer:** Iterate twice through the array (length 2n) or use modulo arithmetic to wrap around. This is similar to "Next Greater Element II".

---

### Q3: What if we needed the sum of all final prices?

**Answer:** Simply sum all elements in the answer array after computing final prices. Time complexity remains O(n).

---

### Q4: How would you modify to find the sum of discounts for all items?

**Answer:** Track the discount value (prices[stack.top]) when computing each final price and accumulate. Same O(n) complexity.

---

### Q5: What if prices could be negative?

**Answer:** The algorithm still works because the comparison is based on relative values, not sign. The constraint says prices >= 1.

---

### Q6: How would you extend to find the "next smaller or equal" to the left?

**Answer:** Iterate left to right instead of right to left, and maintain a monotonically increasing stack. The direction flips.

---

### Q7: What edge cases should be tested?

**Answer:**
- Single element array
- All same prices
- Strictly increasing prices
- Strictly decreasing prices
- All discounts applied (alternating high-low)
- No discounts applied

---

### Q8: Can you solve it without extra space for the answer array?

**Answer:** Yes, modify the input array in-place by storing the result in prices[i] itself. Use a separate variable if you need to preserve original.

---

## Common Pitfalls

### 1. Stack Empty Check
**Issue**: Forgetting to check if stack is empty before accessing top

**Solution**: Always check if stack is non-empty before calculating discount

### 2. Comparison Direction
**Issue**: Using wrong comparison operator (should be `prices[stack.top] > prices[i]` for popping)

**Solution**: Remember we want next smaller, so we pop elements larger than current

### 3. Iterating Direction
**Issue**: Processing from left to right instead of right to left

**Solution**: Must iterate right-to-left to find "next smaller to the right"

### 4. Index vs Value
**Issue**: Confusing indices and values when accessing stack top

**Solution**: Remember stack stores indices, use prices[stack.top()] to get values

---

## Summary

The **Final Prices with a Special Discount** problem demonstrates the power of the monotonic stack pattern:

- **Monotonic Stack**: Optimal O(n) solution with single pass
- **Brute Force**: Simple but O(n²) time complexity
- **Key Insight**: Process right-to-left maintaining increasing stack

The monotonic stack is optimal because each element is pushed and popped at most once, achieving linear time complexity.

### Pattern Summary

This problem exemplifies the **Monotonic Stack - Next Smaller Element** pattern, which is characterized by:
- Processing array from right to left
- Maintaining a monotonically increasing/decreasing stack
- Finding next smaller/greater element in O(n)
- Each element pushed and popped at most once

For more details on this pattern, see the **[Monotonic Stack Pattern](/patterns/monotonic-stack-next-smaller-greater)**.

---

## Additional Resources

- [LeetCode Problem Discussion](https://leetcode.com/problems/final-prices-with-a-special-discount-in-a-shop/discuss/) - Community solutions
- [Monotonic Stack - GeeksforGeeks](https://www.geeksforgeeks.org/introduction-to-monotonic-stack/) - Detailed explanation
- [Stack Data Structure](https://www.geeksforgeeks.org/stack-data-structure/) - Understanding stacks
- [Next Element Queries](https://en.wikipedia.org/wiki/Next_element_query) - Learn about the problem class
