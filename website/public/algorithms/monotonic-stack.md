# Monotonic Stack

## Category
Arrays & Strings

## Description

A **Monotonic Stack** is a stack-based technique that maintains elements in monotonic (strictly increasing or decreasing) order. It is used to efficiently solve problems involving **next greater element**, **next smaller element**, and various other array processing challenges in **O(n) time** with **O(n) space**.

The key insight is that by maintaining a monotonic stack, we can determine relationships between elements without nested loops, achieving linear time complexity instead of O(n²). Each element is pushed onto the stack exactly once and popped at most once, guaranteeing linear time performance.

This pattern is essential for competitive programming and technical interviews, appearing frequently in problems from major tech companies.

---

## Concepts

The Monotonic Stack technique is built on several fundamental concepts that make it powerful for solving array relationship problems.

### 1. Stack State

The stack stores indices (not values) to track element positions. The **state** of the stack represents elements "waiting" to find their next greater/smaller element.

| Stack Type | Order | Use Case |
|------------|-------|----------|
| **Decreasing** | Top is smallest | Finding next greater element |
| **Increasing** | Top is largest | Finding next smaller element |

### 2. Lazy Evaluation

Instead of immediately finding answers, elements wait in the stack until a "trigger" element arrives:

```
Trigger condition:
- Decreasing stack: current > stack.top (current is greater)
- Increasing stack: current < stack.top (current is smaller)
```

### 3. Monotonic Invariants

The stack maintains a strict order invariant:

- **Decreasing**: `nums[stack[0]] >= nums[stack[1]] >= ... >= nums[stack[-1]]`
- **Increasing**: `nums[stack[0]] <= nums[stack[1]] <= ... <= nums[stack[-1]]`

### 4. Single Pass Processing

All operations happen in one pass through the array:

```
For each element i from 0 to n-1:
    While trigger condition met:
        Pop stack and record result
    Push i to stack
```

---

## Frameworks

Structured approaches for solving monotonic stack problems.

### Framework 1: Next Greater Element (Right Side)

```
┌─────────────────────────────────────────────────────┐
│  NEXT GREATER ELEMENT FRAMEWORK (Decreasing Stack)  │
├─────────────────────────────────────────────────────┤
│  1. Initialize empty stack and result array        │
│  2. Iterate through each index i:                  │
│     a. While stack not empty AND                   │
│        nums[stack.top] < nums[i]:                  │
│        - result[stack.pop] = nums[i]              │
│     b. Push i to stack                             │
│  3. Remaining indices have no greater element    │
│     (result remains -1 or default)                 │
└─────────────────────────────────────────────────────┘
```

**When to use**: Find first element to the right that is greater than current.

### Framework 2: Next Smaller Element (Right Side)

```
┌─────────────────────────────────────────────────────┐
│  NEXT SMALLER ELEMENT FRAMEWORK (Increasing Stack) │
├─────────────────────────────────────────────────────┤
│  1. Initialize empty stack and result array        │
│  2. Iterate through each index i:                  │
│     a. While stack not empty AND                   │
│        nums[stack.top] > nums[i]:                  │
│        - result[stack.pop] = nums[i]              │
│     b. Push i to stack                             │
│  3. Remaining indices have no smaller element      │
└─────────────────────────────────────────────────────┘
```

**When to use**: Find first element to the right that is smaller than current.

### Framework 3: Previous Greater/Left-Side Processing

```
┌─────────────────────────────────────────────────────┐
│  PREVIOUS GREATER FRAMEWORK (Left Side)            │
├─────────────────────────────────────────────────────┤
│  1. Initialize empty stack and result array        │
│  2. Iterate through each index i:                  │
│     a. Pop elements <= current (to find greater)  │
│     b. If stack not empty:                         │
│        - result[i] = nums[stack.top] (prev greater) │
│     c. Push i to stack                             │
│  3. All elements processed in single pass          │
└─────────────────────────────────────────────────────┘
```

**When to use**: Find first element to the left that is greater than current.

### Framework 4: Circular Array Processing

```
┌─────────────────────────────────────────────────────┐
│  CIRCULAR ARRAY FRAMEWORK                          │
├─────────────────────────────────────────────────────┤
│  1. Traverse array twice (i from 0 to 2n-1)        │
│  2. Use i % n to get actual index                  │
│  3. Process same as non-circular                   │
│  4. Stop early optimization:                       │
│     - If stack empty after first pass, break       │
│     - Only push indices < n during first pass      │
│  5. Ensure each element gets only first answer     │
└─────────────────────────────────────────────────────┘
```

**When to use**: Finding next greater/smaller in circular/wrap-around arrays.

---

## Forms

Different manifestations of the monotonic stack pattern.

### Form 1: Standard Next Element

Find next greater or smaller element for each position.

| Problem Type | Stack Type | Comparison |
|--------------|------------|------------|
| Next Greater (Right) | Decreasing | `nums[stack.top] < current` |
| Next Smaller (Right) | Increasing | `nums[stack.top] > current` |
| Previous Greater | Decreasing | Pop `<= current` |
| Previous Smaller | Increasing | Pop `>= current` |

### Form 2: Distance/Index Calculation

Calculate number of positions until next greater/smaller element.

```
Example: Daily Temperatures
Instead of storing values, store distance:
result[stack.pop()] = i - stack.pop()  # Days waited
```

### Form 3: Histogram/Area Calculation

Calculate areas with current element as the limiting height.

```
For each bar:
    - Find left boundary (previous smaller)
    - Find right boundary (next smaller)
    - Area = height × (right - left - 1)
```

### Form 4: Online/Streaming Processing

Process elements as they arrive in a stream.

```
class StockSpanner:
    - Stack stores (price, span) pairs
    - For new price, pop smaller prices and accumulate spans
```

### Form 5: Two-Pass for Both Directions

Find both next greater to left and right in two passes.

```
Pass 1 (left to right): Find next greater to right
Pass 2 (right to left): Find next greater to left
```

---

## Tactics

Specific techniques and optimizations.

### Tactic 1: Strict vs Non-Strict Comparison

Choose comparison based on problem requirements:

```python
# Strict greater (duplicates don't count as greater)
while stack and nums[stack[-1]] < current:
    result[stack.pop()] = current

# Non-strict (duplicates count as greater or equal)
while stack and nums[stack[-1]] <= current:
    result[stack.pop()] = current
```

### Tactic 2: Processing from Right to Left

Alternative approach for left-side queries:

```python
def next_greater_right_alternative(nums):
    """Process from right to left for right-side queries."""
    n = len(nums)
    result = [-1] * n
    stack = []  # Will contain elements in decreasing order
    
    for i in range(n - 1, -1, -1):
        # Pop smaller elements
        while stack and stack[-1] <= nums[i]:
            stack.pop()
        # Top is next greater to the right
        result[i] = stack[-1] if stack else -1
        stack.append(nums[i])
    
    return result
```

### Tactic 3: Sentinel Values for Area Problems

Add sentinel to flush the stack at the end:

```python
def largest_rectangle_histogram(heights):
    """Use sentinel 0 to flush remaining bars."""
    stack = []
    max_area = 0
    
    for i in range(len(heights) + 1):
        h = heights[i] if i < len(heights) else 0  # Sentinel
        
        while stack and heights[stack[-1]] > h:
            height = heights[stack.pop()]
            width = i if not stack else i - stack[-1] - 1
            max_area = max(max_area, height * width)
        
        stack.append(i)
    
    return max_area
```

### Tactic 4: Storing Pairs for Complex Tracking

Store additional data with indices:

```python
# Track (index, count) pairs
stack = []  # [(idx, count), ...]

# Track (index, current_min) for min tracking
stack = []  # [(idx, current_min), ...]
```

### Tactic 5: Sum of Subarray Minimums Technique

Calculate contribution of each element as minimum:

```python
def sum_subarray_mins(arr):
    """Calculate sum of minimums of all subarrays."""
    MOD = 10**9 + 7
    n = len(arr)
    
    # Find previous smaller (strict) and next smaller (non-strict)
    left = [0] * n  # Distance to previous smaller
    right = [0] * n  # Distance to next smaller
    
    stack = []
    for i in range(n):
        while stack and arr[stack[-1]] > arr[i]:
            stack.pop()
        left[i] = i - stack[-1] if stack else i + 1
        stack.append(i)
    
    stack = []
    for i in range(n - 1, -1, -1):
        while stack and arr[stack[-1]] >= arr[i]:
            stack.pop()
        right[i] = stack[-1] - i if stack else n - i
        stack.append(i)
    
    result = 0
    for i in range(n):
        result = (result + arr[i] * left[i] * right[i]) % MOD
    
    return result
```

### Tactic 6: Breaking Ties with Indices

When values are equal, use index to break ties in heap:

```python
import heapq

# Store (value, index) to break ties
heap = []
for i, val in enumerate(nums):
    heapq.heappush(heap, (val, i))
```

---

## Python Templates

### Template 1: Next Greater Element (Right)

```python
def next_greater_right(nums: list[int]) -> list[int]:
    """
    Find next greater element to the RIGHT of each element.
    Uses monotonic decreasing stack.
    
    Time: O(n), Space: O(n)
    """
    n = len(nums)
    result = [-1] * n
    stack = []  # Stores indices of elements in decreasing order
    
    for i in range(n):
        # Pop elements smaller than current (they found their answer)
        while stack and nums[stack[-1]] < nums[i]:
            result[stack.pop()] = nums[i]
        stack.append(i)
    
    # Remaining elements have no greater element to the right
    return result
```

### Template 2: Next Smaller Element (Right)

```python
def next_smaller_right(nums: list[int]) -> list[int]:
    """
    Find next smaller element to the RIGHT of each element.
    Uses monotonic increasing stack.
    
    Time: O(n), Space: O(n)
    """
    n = len(nums)
    result = [-1] * n
    stack = []  # Stores indices of elements in increasing order
    
    for i in range(n):
        # Pop elements greater than current
        while stack and nums[stack[-1]] > nums[i]:
            result[stack.pop()] = nums[i]
        stack.append(i)
    
    return result
```

### Template 3: Next Greater Element (Left)

```python
def next_greater_left(nums: list[int]) -> list[int]:
    """
    Find next greater element to the LEFT of each element.
    
    Time: O(n), Space: O(n)
    """
    n = len(nums)
    result = [-1] * n
    stack = []  # Monotonic decreasing
    
    for i in range(n):
        # Pop while current is >= stack top (for strict greater, use >)
        while stack and nums[stack[-1]] <= nums[i]:
            stack.pop()
        # Stack not empty = top is next greater to left
        if stack:
            result[i] = nums[stack[-1]]
        stack.append(i)
    
    return result
```

### Template 4: Next Greater Element (Circular)

```python
def next_greater_circular(nums: list[int]) -> list[int]:
    """
    Find next greater element in a CIRCULAR array.
    Wraps around to the beginning.
    
    Time: O(n), Space: O(n)
    """
    n = len(nums)
    result = [-1] * n
    stack = []
    
    for i in range(2 * n):
        curr = nums[i % n]
        
        while stack and nums[stack[-1]] < curr:
            idx = stack.pop()
            if result[idx] == -1:  # Only set once (first greater)
                result[idx] = curr
        
        if i < n:  # Only push indices from first pass
            stack.append(i % n)
        
        # Optimization: break if stack is empty after first pass
        if i >= n - 1 and not stack:
            break
    
    return result
```

### Template 5: Daily Temperatures

```python
def daily_temperatures(temps: list[int]) -> list[int]:
    """
    LeetCode 739: Daily Temperatures
    Find number of days to wait for warmer temperature.
    
    Time: O(n), Space: O(n)
    """
    n = len(temps)
    result = [0] * n
    stack = []  # Store indices
    
    for i in range(n):
        # Pop colder days, they're done waiting
        while stack and temps[stack[-1]] < temps[i]:
            prev_idx = stack.pop()
            result[prev_idx] = i - prev_idx
        stack.append(i)
    
    # Remaining indices already have 0 (no warmer day)
    return result
```

### Template 6: Largest Rectangle in Histogram

```python
def largest_rectangle_histogram(heights: list[int]) -> int:
    """
    LeetCode 84: Largest Rectangle in Histogram
    Find largest rectangle in histogram.
    
    Time: O(n), Space: O(n)
    
    Adds sentinel (0 height) at end to flush stack.
    """
    n = len(heights)
    stack = []  # Store indices of increasing heights
    max_area = 0
    
    for i in range(n + 1):
        h = heights[i] if i < n else 0  # Sentinel
        
        while stack and heights[stack[-1]] > h:
            height = heights[stack.pop()]
            width = i if not stack else i - stack[-1] - 1
            max_area = max(max_area, height * width)
        
        stack.append(i)
    
    return max_area
```

### Template 7: Online Stock Span

```python
class StockSpanner:
    """
    LeetCode 901: Online Stock Span
    Monotonic decreasing stack with span tracking.
    """
    
    def __init__(self):
        # Stack of (price, span) pairs
        self.stack = []
    
    def next(self, price: int) -> int:
        """
        Return span of current price.
        Span = number of consecutive days with price <= current.
        """
        span = 1
        
        # Pop smaller/equal prices and accumulate their spans
        while self.stack and self.stack[-1][0] <= price:
            span += self.stack.pop()[1]
        
        self.stack.append((price, span))
        return span
```

### Template 8: Sum of Subarray Minimums

```python
def sum_subarray_mins(arr: list[int]) -> int:
    """
    LeetCode 907: Sum of Subarray Minimums
    Calculate contribution of each element as minimum.
    
    Time: O(n), Space: O(n)
    """
    MOD = 10**9 + 7
    n = len(arr)
    
    # left[i] = number of subarrays where arr[i] is minimum and leftmost
    left = [0] * n
    # right[i] = number of subarrays where arr[i] is minimum and rightmost
    right = [0] * n
    
    # Previous strictly smaller
    stack = []
    for i in range(n):
        while stack and arr[stack[-1]] > arr[i]:
            stack.pop()
        left[i] = i - stack[-1] if stack else i + 1
        stack.append(i)
    
    # Next smaller or equal (to avoid double counting)
    stack = []
    for i in range(n - 1, -1, -1):
        while stack and arr[stack[-1]] >= arr[i]:
            stack.pop()
        right[i] = stack[-1] - i if stack else n - i
        stack.append(i)
    
    result = 0
    for i in range(n):
        result = (result + arr[i] * left[i] * right[i]) % MOD
    
    return result
```

---

## When to Use

Use the Monotonic Stack algorithm when you need to solve problems involving:

- **Finding Next Greater/Smaller Elements**: For each element, find the first element to its left/right that is greater/smaller
- **Range Minimum/Maximum Queries**: Processing queries that ask for minimum/maximum in sliding windows
- **Stack-based Array Problems**: Problems that naturally involve comparing adjacent elements
- **Efficient O(n) Solutions**: When you need linear time instead of quadratic brute force

### Comparison with Alternatives

| Approach | Time Complexity | Space | Best For |
|----------|-----------------|-------|----------|
| **Brute Force** | O(n²) | O(1) | Small arrays, simplicity |
| **Monotonic Stack** | O(n) | O(n) | Next greater/smaller element problems |
| **Two-Pass Hash Map** | O(n) | O(n) | Caching results, simpler debugging |
| **Segment Tree** | O(n log n) build, O(log n) query | O(n) | Dynamic updates + queries |

### When to Choose Monotonic Stack vs Other Approaches

- **Choose Monotonic Stack** when:
  - You need to find next greater/smaller element for every position
  - The problem involves histogram/rectangle calculations
  - You need O(n) time with single pass through the array
  - The problem naturally has a "stackable" property (nested intervals)

- **Choose Brute Force** when:
  - Array size is very small (< 100 elements)
  - Simplicity is more important than efficiency
  - Problem doesn't have monotonic property

- **Choose Segment Tree** when:
  - You need both queries and updates
  - Range queries on dynamic data
  - More complex aggregation needed

---

## Algorithm Explanation

### Core Concept

The fundamental principle behind the Monotonic Stack is **delayed processing with stack-based tracking**. Instead of immediately finding the answer for each element, we maintain a stack of candidates that "wait" until a suitable element arrives.

### How It Works

#### For Next Greater Element (using decreasing stack):

```
Array: [2, 1, 2, 4, 3]

Step-by-step:
┌─────┬────────────┬─────────┬───────────────────────────────┐
│ i   │ Current    │ Stack   │ Action                        │
├─────┼────────────┼─────────┼───────────────────────────────┤
│ 0   │ nums[0]=2  │ [0]     │ Push index 0 (value 2)        │
│ 1   │ nums[1]=1  │ [0,1]   │ 1 < 2, can't pop, push 1      │
│ 2   │ nums[2]=2  │ [0]     │ 2 > 1: pop idx 1→result[1]=2  │
│     │            │         │ 2 = 2: can't pop (not <)      │
│     │            │         │ Push index 2                  │
│ 3   │ nums[3]=4  │ []      │ 4 > 2: pop idx 2→result[2]=4  │
│     │            │         │ 4 > 2: pop idx 0→result[0]=4  │
│     │            │         │ Push index 3                  │
│ 4   │ nums[4]=3  │ [3,4]   │ 3 < 4, can't pop, push 4      │
└─────┴────────────┴─────────┴───────────────────────────────┘

Result: [4, 2, 4, -1, -1]
```

### Visual Representation

```
Monotonic Decreasing Stack (for Next Greater):

Input: [2, 1, 2, 4, 3]

Processing element 4 (at index 3):
┌─────────────────────────────────────────────────┐
│ Stack (before): [2@0, 1@1, 2@2]                  │
│ Current: 4                                        │
│                                                   │
│ Pop 2@2 → result[2] = 4                          │
│ Pop 1@1 → result[1] = 4                          │
│ Pop 2@0 → result[0] = 4                          │
│                                                   │
│ Stack (after): [4@3]                             │
└─────────────────────────────────────────────────┘
```

### Why O(n) Time?

Each element is pushed onto the stack **exactly once** and popped **at most once**. Since there are n elements, the total operations are O(n).

### Key Properties

- **Single Pass**: Process array from left to right (or right to left)
- **Stack Stores Indices**: We store indices, not values, to track positions
- **Lazy Evaluation**: Elements wait in stack until a "better" element arrives
- **No Backtracking**: Once processed, we never revisit elements

### Limitations

- **Only for sequential relationships**: Cannot handle non-contiguous queries
- **O(n) space**: Requires linear extra space for the stack
- **Specific ordering**: Only works for monotonic comparisons

---

## Practice Problems

### Problem 1: Next Greater Element I

**Problem:** [LeetCode 496 - Next Greater Element I](https://leetcode.com/problems/next-greater-element-i/)

**Description:** You are given two integer arrays `nums1` and `nums2` (where `nums1` is a subset of `nums2`). For each element in `nums1`, find the next greater element in `nums2`.

**How to Apply Monotonic Stack:**
- First, build next greater map for all elements in `nums2` using monotonic stack in O(n)
- Then simply look up each element from `nums1` in O(m) where m = len(nums1)
- Total: O(n + m)

---

### Problem 2: Daily Temperatures

**Problem:** [LeetCode 739 - Daily Temperatures](https://leetcode.com/problems/daily-temperatures/)

**Description:** Given an array of daily temperatures, return an array where `answer[i]` is the number of days to wait for a warmer temperature.

**How to Apply Monotonic Stack:**
- Use monotonic decreasing stack (stores indices)
- When a warmer temperature arrives, pop and calculate days waited
- Continue until stack is empty or current temp is not warmer
- Time: O(n), Space: O(n)

---

### Problem 3: Largest Rectangle in Histogram

**Problem:** [LeetCode 84 - Largest Rectangle in Histogram](https://leetcode.com/problems/largest-rectangle-in-histogram/)

**Description:** Given an array representing bar heights in a histogram, find the largest rectangle area.

**How to Apply Monotonic Stack:**
- Use monotonic increasing stack
- Add sentinel (height 0) at end to "flush" the stack
- When popping a bar, calculate area with current bar as shortest
- Width = distance to next smaller bar in stack
- Time: O(n), Space: O(n)

---

### Problem 4: Sum of Subarray Minimums

**Problem:** [LeetCode 907 - Sum of Subarray Minimums](https://leetcode.com/problems/sum-of-subarray-minimums/)

**Description:** Given an array, find the sum of minimums of all subarrays.

**How to Apply Monotonic Stack:**
- For each element, find how many subarrays where it's the minimum
- Use two passes: count subarrays where element is "next smaller" on left/right
- Contribution = arr[i] × left_count × right_count
- Time: O(n), Space: O(n)

---

### Problem 5: Online Stock Span

**Problem:** [LeetCode 901 - Online Stock Span](https://leetcode.com/problems/online-stock-span/)

**Description:** Define span as number of consecutive days (including today) with price ≤ today's price. Implement a stock span class.

**How to Apply Monotonic Stack:**
- Use decreasing stack (larger prices at bottom)
- For each price, pop smaller/equal prices, accumulate span
- Stack stores (price, span) pairs
- Time: O(n) amortized, Space: O(n)

---

### Problem 6: Next Greater Element II (Circular)

**Problem:** [LeetCode 503 - Next Greater Element II](https://leetcode.com/problems/next-greater-element-ii/)

**Description:** Given a circular array, find the next greater element for each element. The array is circular, meaning the next element of the last element is the first element.

**How to Apply Monotonic Stack:**
- Traverse array twice (2n iterations)
- Use modulo to handle circular indexing
- Only push indices during first pass
- Time: O(n), Space: O(n)

---

### Problem 7: Remove Nodes From Linked List

**Problem:** [LeetCode 2487 - Remove Nodes From Linked List](https://leetcode.com/problems/remove-nodes-from-linked-list/)

**Description:** Remove every node which has a node with a greater value anywhere to the right side of it.

**How to Apply Monotonic Stack:**
- Use stack to track nodes in decreasing order
- For each node, pop nodes with smaller values
- Remaining nodes form the result
- Time: O(n), Space: O(n)

---

## Video Tutorial Links

### Fundamentals

- [Monotonic Stack - Introduction (Take U Forward)](https://www.youtube.com/watch?v=vxhG9bjSm6I) - Comprehensive introduction
- [Monotonic Stack Implementation (NeetCode)](https://www.youtube.com/watch?v=cT8xSso4yg0) - Practical implementation
- [Next Greater Element (WilliamFiset)](https://www.youtube.com/watch?v=DuX6R8Q4riU) - Detailed explanation

### Problem-Specific

- [Largest Rectangle in Histogram](https://www.youtube.com/watch?v=zx5x3bKzg1o) - LeetCode 84 solution
- [Daily Temperatures](https://www.youtube.com/watch?v=WTpI1L9P-Ss) - LeetCode 739 solution
- [Stock Span Problem](https://www.youtube.com/watch?v=0lZhr1cR4fQ) - Classic monotonic stack application

### Advanced

- [Sum of Subarray Minimums](https://www.youtube.com/watch?v=xH4VSxfgP5I) - Advanced monotonic stack
- [Monotonic Stack Patterns](https://www.youtube.com/watch?v=RRM2L-VBhOA) - Common patterns and variations

---

## Follow-up Questions

### Q1: When should I use a monotonic decreasing vs increasing stack?

**Answer:**
- **Decreasing Stack** (largest at bottom): When finding **next greater** element
- **Increasing Stack** (smallest at bottom): When finding **next smaller** element

The stack always keeps the "waiting" elements in monotonic order. When a new element arrives that breaks the monotonic property, those waiting elements have found their answer.

---

### Q2: Can Monotonic Stack be used for left-side queries?

**Answer:** Yes! You have two options:
1. **Reverse iteration**: Process array from right to left
2. **Adapt comparison**: Process left to right but change the comparison logic (see `next_greater_left` example)

The key insight for left-side: pop elements that would block the current element from seeing them as the "next greater to left."

---

### Q3: What if I need both next greater and next smaller?

**Answer:** Run the algorithm twice (O(2n) = O(n)), or modify to track both in single pass with two stacks. For most problems, two passes is cleaner and still linear.

```python
# Two separate passes
next_greater = next_greater_right(nums)
next_smaller = next_smaller_right(nums)
```

---

### Q4: How do I handle duplicate elements?

**Answer:** Depends on requirement:
- **Strict** (`<` or `>`): Duplicates don't count as "greater" or "smaller"
- **Non-strict** (`<=` or `>=`): Duplicates count
- Example: For "next greater or equal", use `while stack and nums[stack[-1]] <= nums[i]`

For sum of subarray minimums, use strict on one side and non-strict on the other to avoid double counting.

---

### Q5: Can Monotonic Stack be used for minimum instead of maximum?

**Answer:** Yes! Simply flip the comparison:
- For **next smaller**: Use increasing stack, pop when `nums[top] > nums[i]`
- For **next greater**: Use decreasing stack, pop when `nums[top] < nums[i]`

The algorithm is symmetric.

---

### Q6: Why does the algorithm use O(n) space?

**Answer:** In the worst case (strictly increasing or decreasing array), the stack will contain all n elements:
- Strictly increasing array (next greater): Each element waits, stack grows to n
- Strictly decreasing array (next smaller): Each element waits, stack grows to n

This is the worst case, but the algorithm still processes each element only once.

---

### Q7: How does Monotonic Stack compare to using a heap?

**Answer:**

| Aspect | Monotonic Stack | Heap |
|--------|-----------------|------|
| Time | O(n) guaranteed | O(n log n) |
| Space | O(n) | O(n) |
| Query type | Next greater/smaller | Global min/max |
| Use case | Sequential relationships | Priority-based selection |

Use stack for finding relationships between adjacent elements, heap for selecting minimum among all elements.

---

## Summary

The Monotonic Stack is an elegant technique for solving **next greater/smaller element** problems in **O(n) time**. Key takeaways:

- **Linear Time**: Each element pushed/popped at most once → O(n)
- **Stack-Based**: Maintains monotonic order to efficiently find relationships
- **Versatile**: Works for left/right queries, circular arrays, and more
- **Common Applications**: Daily Temperatures, Largest Rectangle in Histogram, Stock Span

When to use:
- ✅ Finding next greater/smaller element for each position
- ✅ Histogram/rectangle problems
- ✅ Problems with "waiting" element patterns
- ❌ When you need random access to results (use hash map instead)
- ❌ When space is extremely constrained (O(n) required)

This technique is essential for competitive programming and technical interviews, especially in problems involving array relationships and range queries.
