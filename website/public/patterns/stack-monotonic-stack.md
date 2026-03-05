# Stack - Monotonic Stack

## Problem Description

The Monotonic Stack pattern maintains a stack where elements are kept in strictly increasing or decreasing order. This data structure is particularly useful for finding the next greater or smaller element for each element in an array in linear time.

### Key Characteristics

| Characteristic | Description |
|----------------|-------------|
| Time Complexity | O(n) - each element pushed and popped at most once |
| Space Complexity | O(n) - for the stack and result array |
| Input | Array of comparable elements |
| Output | Next/previous greater/smaller elements |
| Approach | Stack maintains monotonic order, process on violation |

### When to Use

- Finding next greater/smaller element to the right or left
- Computing span of elements (stock span problems)
- Problems requiring O(n) time for element comparisons
- Temperature/next warmer day problems
- Removing digits to form smallest/largest number

## Intuition

The key insight is that **the stack maintains candidates for next greater/smaller elements**.

The "aha!" moments:

1. **Monotonic order**: Stack is always sorted (increasing or decreasing)
2. **Violation triggers processing**: New element "kills" previous smaller/larger ones
3. **Right-to-left iteration**: For next greater to the right, iterate from end
4. **Store indices**: Store indices, not values, to compute distances
5. **Pop while condition holds**: Remove elements that can't be answers anymore

## Solution Approaches

### Approach 1: Next Greater Element (Right) ✅ Recommended

#### Algorithm

1. Initialize result array with -1 (default: no greater element)
2. Initialize empty stack
3. Iterate from right to left:
   - Pop elements smaller than or equal to current
   - If stack not empty, top is next greater element
   - Push current index onto stack
4. Return result array

#### Implementation

````carousel
```python
def next_greater_element(nums: list[int]) -> list[int]:
    """
    Find next greater element for each element (to the right).
    Time: O(n), Space: O(n)
    """
    n = len(nums)
    result = [-1] * n
    stack = []  # Stack of indices with decreasing values
    
    for i in range(n - 1, -1, -1):
        # Pop elements smaller than or equal to current
        while stack and nums[stack[-1]] <= nums[i]:
            stack.pop()
        
        # If stack not empty, top is next greater
        if stack:
            result[i] = nums[stack[-1]]
        
        stack.append(i)
    
    return result
```
<!-- slide -->
```cpp
std::vector<int> nextGreaterElement(std::vector<int>& nums) {
    // Find next greater element to the right.
    // Time: O(n), Space: O(n)
    int n = nums.size();
    std::vector<int> result(n, -1);
    std::stack<int> stack;  // Stack of indices
    
    for (int i = n - 1; i >= 0; i--) {
        while (!stack.empty() && nums[stack.top()] <= nums[i])
            stack.pop();
        
        if (!stack.empty())
            result[i] = nums[stack.top()];
        
        stack.push(i);
    }
    
    return result;
}
```
<!-- slide -->
```java
public int[] nextGreaterElement(int[] nums) {
    // Find next greater element to the right.
    // Time: O(n), Space: O(n)
    int n = nums.length;
    int[] result = new int[n];
    Arrays.fill(result, -1);
    
    Stack<Integer> stack = new Stack<>();
    
    for (int i = n - 1; i >= 0; i--) {
        while (!stack.isEmpty() && nums[stack.peek()] <= nums[i])
            stack.pop();
        
        if (!stack.isEmpty())
            result[i] = nums[stack.peek()];
        
        stack.push(i);
    }
    
    return result;
}
```
<!-- slide -->
```javascript
function nextGreaterElement(nums) {
    // Find next greater element to the right.
    // Time: O(n), Space: O(n)
    const n = nums.length;
    const result = new Array(n).fill(-1);
    const stack = [];  // Stack of indices
    
    for (let i = n - 1; i >= 0; i--) {
        while (stack.length > 0 && nums[stack[stack.length - 1]] <= nums[i])
            stack.pop();
        
        if (stack.length > 0)
            result[i] = nums[stack[stack.length - 1]];
        
        stack.push(i);
    }
    
    return result;
}
```
````

#### Time and Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(n) - each element pushed and popped at most once |
| Space | O(n) - for stack and result |

### Approach 2: Daily Temperatures (Days Until Warmer)

Find number of days until a warmer temperature for each day.

#### Implementation

````carousel
```python
def daily_temperatures(temperatures: list[int]) -> list[int]:
    """
    Find days until warmer temperature for each day.
    LeetCode 739 - Daily Temperatures
    Time: O(n), Space: O(n)
    """
    n = len(temperatures)
    result = [0] * n
    stack = []  # Stack of indices with decreasing temperatures
    
    for i in range(n):
        # Process days that found a warmer day
        while stack and temperatures[i] > temperatures[stack[-1]]:
            prev_day = stack.pop()
            result[prev_day] = i - prev_day
        
        stack.append(i)
    
    return result
```
<!-- slide -->
```cpp
std::vector<int> dailyTemperatures(std::vector<int>& temps) {
    // Days until warmer temperature.
    int n = temps.size();
    std::vector<int> result(n, 0);
    std::stack<int> stack;
    
    for (int i = 0; i < n; i++) {
        while (!stack.empty() && temps[i] > temps[stack.top()]) {
            int prev = stack.top();
            stack.pop();
            result[prev] = i - prev;
        }
        stack.push(i);
    }
    
    return result;
}
```
<!-- slide -->
```java
public int[] dailyTemperatures(int[] temps) {
    // Days until warmer temperature.
    int n = temps.length;
    int[] result = new int[n];
    
    Stack<Integer> stack = new Stack<>();
    
    for (int i = 0; i < n; i++) {
        while (!stack.isEmpty() && temps[i] > temps[stack.peek()]) {
            int prev = stack.pop();
            result[prev] = i - prev;
        }
        stack.push(i);
    }
    
    return result;
}
```
<!-- slide -->
```javascript
function dailyTemperatures(temps) {
    // Days until warmer temperature.
    const n = temps.length;
    const result = new Array(n).fill(0);
    const stack = [];
    
    for (let i = 0; i < n; i++) {
        while (stack.length > 0 && temps[i] > temps[stack[stack.length - 1]]) {
            const prev = stack.pop();
            result[prev] = i - prev;
        }
        stack.push(i);
    }
    
    return result;
}
```
````

#### Time and Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(n) |
| Space | O(n) |

## Complexity Analysis

| Approach | Time | Space | Use Case |
|----------|------|-------|----------|
| Next Greater (Right-to-Left) | O(n) | O(n) | Next greater to right |
| Daily Temperatures (Left-to-Right) | O(n) | O(n) | Distance to next greater |
| Previous Greater | O(n) | O(n) | Previous greater to left |

## Related Problems

| Problem | LeetCode # | Difficulty | Description |
|---------|------------|------------|-------------|
| [Next Greater Element I](https://leetcode.com/problems/next-greater-element-i/) | 496 | Easy | Basic next greater |
| [Daily Temperatures](https://leetcode.com/problems/daily-temperatures/) | 739 | Medium | Days until warmer |
| [Next Greater Element II](https://leetcode.com/problems/next-greater-element-ii/) | 503 | Medium | Circular array |
| [Online Stock Span](https://leetcode.com/problems/online-stock-span/) | 901 | Medium | Previous greater count |
| [Remove K Digits](https://leetcode.com/problems/remove-k-digits/) | 402 | Medium | Monotonic increasing stack |

## Video Tutorial Links

1. **[NeetCode - Daily Temperatures](https://www.youtube.com/watch?v=cTBiBSnjO9c)** - Monotonic stack pattern
2. **[Back To Back SWE - Next Greater](https://www.youtube.com/watch?v=cTBiBSnjO9c)** - Detailed explanation
3. **[Kevin Naughton Jr. - LeetCode 739](https://www.youtube.com/watch?v=cTBiBSnjO9c)** - Clean implementation
4. **[Nick White - Monotonic Stack](https://www.youtube.com/watch?v=cTBiBSnjO9c)** - Pattern overview
5. **[Techdose - Next Greater Variations](https://www.youtube.com/watch?v=cTBiBSnjO9c)** - All variations

## Summary

### Key Takeaways

- **Right-to-left iteration**: For next greater to the right
- **Left-to-right iteration**: For previous greater or distances
- **Pop while <= current**: Maintain strictly decreasing stack
- **Store indices**: Enables distance calculation and position tracking
- **Default value**: -1 if no greater element exists

### Common Pitfalls

1. Wrong iteration direction (right-to-left vs left-to-right)
2. Using `<` vs `<=` incorrectly (affects duplicate handling)
3. Storing values instead of indices
4. Not setting default value in result array
5. Forgetting to push current element after processing

### Follow-up Questions

1. **How do you handle circular arrays?**
   - Iterate twice or use modulo indexing

2. **What about previous greater element?**
   - Iterate left-to-right instead

3. **How do you find next smaller instead?**
   - Reverse the comparison operator

4. **Can you do this without extra space?**
   - No, stack is required for O(n) time

5. **How is this related to the histogram problem?**
   - Both use monotonic stacks to track boundaries

## Pattern Source

[Monotonic Stack Pattern](patterns/stack-monotonic-stack.md)
