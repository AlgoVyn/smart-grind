# Kadane's Algorithm

## Category
Arrays & Strings

## Description

Kadane's Algorithm finds the **maximum sum of a contiguous subarray** (also known as the Maximum Subarray Problem) in O(n) time. This is a classic dynamic programming problem with an elegant greedy optimization that works by iterating through the array once, tracking the maximum sum ending at each position and the global maximum seen so far.

The algorithm is fundamental in competitive programming and technical interviews for solving a wide range of array problems efficiently. Its simplicity and optimal performance make it a go-to solution for maximum subarray problems.

---

## Concepts

The Kadane's Algorithm is built on several fundamental concepts that make it powerful for solving maximum subarray problems.

### 1. Local Optimum vs Global Optimum

At each position, Kadane's tracks two values:

| Value | Description | Purpose |
|-------|-------------|---------|
| **max_current** | Maximum sum ending at current index | Local optimum |
| **max_global** | Maximum sum seen so far across all positions | Global optimum |

### 2. Greedy Choice Property

At each position, we make a greedy decision:

```
Either extend the previous subarray OR start a new subarray at current position
max_current = max(nums[i], max_current + nums[i])
```

This greedy choice is optimal because extending a negative-sum prefix would only decrease the total.

### 3. Subarray State Tracking

The algorithm implicitly tracks subarray boundaries:

- When `nums[i] > max_current + nums[i]`: Start new subarray at `i`
- When `nums[i] <= max_current + nums[i]`: Extend existing subarray

### 4. Dynamic Programming Principle

Kadane's is a DP algorithm with O(1) space:

- **State**: Maximum sum ending at position `i`
- **Transition**: `dp[i] = max(nums[i], dp[i-1] + nums[i])`
- **Optimization**: Use rolling variables instead of array

---

## Frameworks

Structured approaches for solving maximum subarray problems.

### Framework 1: Basic Kadane's (Maximum Sum Only)

```
┌─────────────────────────────────────────────────────┐
│  BASIC KADANE'S ALGORITHM                             │
├─────────────────────────────────────────────────────┤
│  1. Initialize: max_current = max_global = nums[0]   │
│  2. Iterate i from 1 to n-1:                         │
│     a. max_current = max(nums[i], max_current + nums[i]) │
│     b. max_global = max(max_global, max_current)     │
│  3. Return max_global                                │
└─────────────────────────────────────────────────────┘
```

**When to use**: Only need the maximum sum value, not the subarray indices.

### Framework 2: Kadane's with Indices Tracking

```
┌─────────────────────────────────────────────────────┐
│  KADANE'S WITH INDICES TRACKING                       │
├─────────────────────────────────────────────────────┤
│  1. Initialize:                                      │
│     - max_current = max_global = nums[0]              │
│     - start = end = 0                                 │
│     - temp_start = 0                                  │
│  2. Iterate i from 1 to n-1:                         │
│     a. If nums[i] > max_current + nums[i]:         │
│        - max_current = nums[i]                       │
│        - temp_start = i                            │
│     b. Else:                                         │
│        - max_current += nums[i]                      │
│     c. If max_current > max_global:                │
│        - max_global = max_current                    │
│        - start = temp_start                          │
│        - end = i                                     │
│  3. Return (max_global, start, end)                  │
└─────────────────────────────────────────────────────┘
```

**When to use**: Need to find the actual subarray, not just the sum.

### Framework 3: Circular Array Maximum

```
┌─────────────────────────────────────────────────────┐
│  CIRCULAR ARRAY MAXIMUM SUM                           │
├─────────────────────────────────────────────────────┤
│  1. Find max subarray using normal Kadane's         │
│  2. If max < 0: return max (all negative case)      │
│  3. Find min subarray using inverted Kadane's:      │
│     - min_current = min(nums[i], min_current + nums[i]) │
│  4. Total sum = sum of all elements                  │
│  5. Return max(max_normal, total - min_normal)       │
│                                                      │
│  Key Insight: max_circular = total - min_subarray    │
└─────────────────────────────────────────────────────┘
```

**When to use**: Array is circular (subarray can wrap around the end).

---

## Forms

Different manifestations of Kadane's Algorithm.

### Form 1: Maximum Sum Subarray

The classic form - find contiguous subarray with largest sum.

| Variation | Return Value | When to Use |
|-----------|--------------|-------------|
| **Basic** | Maximum sum | Just need the value |
| **With indices** | (sum, start, end) | Need the subarray |
| **All maximums** | List of subarrays | Multiple solutions |

### Form 2: Maximum Product Subarray

Handles products (requires tracking both max and min).

| State | Update Rule | Why |
|-------|-------------|-----|
| **max_prod** | `max(nums[i], max_prod * nums[i], min_prod * nums[i])` | Positive × positive or negative × negative |
| **min_prod** | `min(nums[i], max_prod * nums[i], min_prod * nums[i])` | Negative × positive |

**Key difference**: Must track minimum because negative × negative can become maximum.

### Form 3: Circular Maximum

Array wraps around the end.

```
Two cases:
1. Maximum subarray doesn't wrap (normal Kadane's)
2. Maximum subarray wraps around

Case 2 Formula: total_sum - minimum_subarray_sum
```

### Form 4: Maximum Average Subarray (Fixed Size)

Find subarray of exactly size k with maximum average.

```
Use sliding window to find maximum sum of size k
Result = max_sum / k
```

### Form 5: Minimum Sum Subarray

Find subarray with smallest (most negative) sum.

```
Approach 1: Negate array, run Kadane's, negate result
Approach 2: Change max to min in the algorithm
```

---

## Tactics

Specific techniques and optimizations.

### Tactic 1: Track All Maximum Subarrays

When multiple subarrays have the same maximum sum:

```python
def find_all_max_subarrays(nums: list[int]) -> list[tuple]:
    """Find all subarrays with maximum sum."""
    if not nums:
        return []
    
    max_current = max_global = nums[0]
    current_start = 0
    max_subarrays = [(nums[0], 0, 0)]  # (sum, start, end)
    
    for i in range(1, len(nums)):
        if nums[i] > max_current + nums[i]:
            max_current = nums[i]
            current_start = i
        else:
            max_current += nums[i]
        
        if max_current > max_global:
            max_global = max_current
            max_subarrays = [(max_global, current_start, i)]
        elif max_current == max_global:
            max_subarrays.append((max_global, current_start, i))
    
    return max_subarrays
```

### Tactic 2: Longest Maximum Sum Subarray

When multiple subarrays have the same sum, find the longest:

```python
def longest_max_sum_subarray(nums: list[int]) -> tuple:
    """Find longest subarray with maximum sum."""
    if not nums:
        return 0, 0, -1, -1
    
    max_sum = nums[0]
    max_len = 1
    max_start = max_end = 0
    
    current_sum = nums[0]
    current_len = 1
    current_start = 0
    
    for i in range(1, len(nums)):
        if nums[i] > current_sum + nums[i]:
            current_sum = nums[i]
            current_len = 1
            current_start = i
        else:
            current_sum += nums[i]
            current_len += 1
        
        if current_sum > max_sum:
            max_sum, max_len = current_sum, current_len
            max_start, max_end = current_start, i
        elif current_sum == max_sum and current_len > max_len:
            max_len = current_len
            max_start, max_end = current_start, i
    
    return max_sum, max_len, max_start, max_end
```

### Tactic 3: Maximum Product with Zero Handling

Handle zeros in product subarray:

```python
def max_product_with_zeros(nums: list[int]) -> int:
    """Maximum product subarray handling zeros."""
    if not nums:
        return 0
    
    max_prod = min_prod = result = nums[0]
    
    for i in range(1, len(nums)):
        if nums[i] == 0:
            max_prod = min_prod = 1
            result = max(result, 0)
            continue
        
        if nums[i] < 0:
            max_prod, min_prod = min_prod, max_prod
        
        max_prod = max(nums[i], max_prod * nums[i])
        min_prod = min(nums[i], min_prod * nums[i])
        result = max(result, max_prod)
    
    return result
```

### Tactic 4: Two-Pass for Circular Array

Two approaches for circular maximum:

```python
def max_circular_sum_twopass(nums: list[int]) -> int:
    """Circular maximum using two passes."""
    if not nums:
        return 0
    
    # Pass 1: Normal maximum (Kadane's)
    max_normal = nums[0]
    max_current = nums[0]
    for i in range(1, len(nums)):
        max_current = max(nums[i], max_current + nums[i])
        max_normal = max(max_normal, max_current)
    
    # If all negative, return normal max
    if max_normal < 0:
        return max_normal
    
    # Pass 2: Minimum subarray
    min_normal = nums[0]
    min_current = nums[0]
    total = sum(nums)
    for i in range(1, len(nums)):
        min_current = min(nums[i], min_current + nums[i])
        min_normal = min(min_normal, min_current)
    
    return max(max_normal, total - min_normal)
```

### Tactic 5: Prefix Sum Alternative

When you need to query multiple ranges:

```python
from itertools import accumulate

def max_subarray_prefix_sum(nums: list[int]) -> int:
    """Alternative using prefix sums."""
    if not nums:
        return 0
    
    prefix = [0] + list(accumulate(nums))
    min_prefix = 0
    max_sum = nums[0]
    
    for i in range(1, len(prefix)):
        max_sum = max(max_sum, prefix[i] - min_prefix)
        min_prefix = min(min_prefix, prefix[i])
    
    return max_sum
```

---

## Python Templates

### Template 1: Basic Kadane's Algorithm (Maximum Sum)

```python
def max_subarray_sum(nums: list[int]) -> int:
    """
    Template for finding maximum subarray sum.
    Returns only the maximum sum value.
    
    Time: O(n)
    Space: O(1)
    """
    if not nums:
        return 0
    
    max_current = max_global = nums[0]
    
    for i in range(1, len(nums)):
        max_current = max(nums[i], max_current + nums[i])
        max_global = max(max_global, max_current)
    
    return max_global
```

### Template 2: Kadane's with Subarray Indices

```python
def max_subarray_with_indices(nums: list[int]) -> tuple:
    """
    Template for finding maximum subarray with indices.
    Returns (max_sum, start_index, end_index).
    
    Time: O(n)
    Space: O(1)
    """
    if not nums:
        return 0, -1, -1
    
    max_current = max_global = nums[0]
    start = end = 0
    temp_start = 0
    
    for i in range(1, len(nums)):
        if nums[i] > max_current + nums[i]:
            max_current = nums[i]
            temp_start = i
        else:
            max_current += nums[i]
        
        if max_current > max_global:
            max_global = max_current
            start = temp_start
            end = i
    
    return max_global, start, end
```

### Template 3: Maximum Product Subarray

```python
def max_product_subarray(nums: list[int]) -> int:
    """
    Template for maximum product subarray.
    Handles negatives by tracking both max and min.
    
    Time: O(n)
    Space: O(1)
    """
    if not nums:
        return 0
    
    max_prod = min_prod = result = nums[0]
    
    for i in range(1, len(nums)):
        if nums[i] < 0:
            max_prod, min_prod = min_prod, max_prod
        
        max_prod = max(nums[i], max_prod * nums[i])
        min_prod = min(nums[i], min_prod * nums[i])
        result = max(result, max_prod)
    
    return result
```

### Template 4: Maximum Sum Circular Subarray

```python
def max_circular_subarray(nums: list[int]) -> int:
    """
    Template for circular array maximum sum.
    Subarray can wrap around the end.
    
    Time: O(n)
    Space: O(1)
    """
    if not nums:
        return 0
    
    # Normal maximum subarray
    max_normal = nums[0]
    max_current = nums[0]
    for i in range(1, len(nums)):
        max_current = max(nums[i], max_current + nums[i])
        max_normal = max(max_normal, max_current)
    
    # All negative case
    if max_normal < 0:
        return max_normal
    
    # Minimum subarray (for circular case)
    min_normal = nums[0]
    min_current = nums[0]
    total = nums[0]
    for i in range(1, len(nums)):
        min_current = min(nums[i], min_current + nums[i])
        min_normal = min(min_normal, min_current)
        total += nums[i]
    
    return max(max_normal, total - min_normal)
```

### Template 5: Maximum Average Subarray I (Fixed Size)

```python
def max_average_subarray(nums: list[int], k: int) -> float:
    """
    Template for maximum average of any subarray of size k.
    Uses sliding window approach.
    
    Time: O(n)
    Space: O(1)
    """
    if not nums or k <= 0 or k > len(nums):
        return 0.0
    
    window_sum = sum(nums[:k])
    max_sum = window_sum
    
    for i in range(k, len(nums)):
        window_sum += nums[i] - nums[i - k]
        max_sum = max(max_sum, window_sum)
    
    return max_sum / k
```

### Template 6: Best Time to Buy and Sell Stock (Kadane's Variant)

```python
def max_profit(prices: list[int]) -> int:
    """
    Template for maximum profit with single transaction.
    Equivalent to maximum difference where buy < sell.
    
    Time: O(n)
    Space: O(1)
    """
    if not prices:
        return 0
    
    min_price = prices[0]
    max_profit = 0
    
    for price in prices[1:]:
        min_price = min(min_price, price)
        max_profit = max(max_profit, price - min_price)
    
    return max_profit
```

### Template 7: Repeated Substring Pattern (KMP Application)

```python
def is_repeated_substring(s: str) -> bool:
    """
    Check if string is made of repeated substring using KMP LPS array.
    
    Time: O(n)
    Space: O(n)
    """
    n = len(s)
    if n <= 1:
        return False
    
    # Build LPS array
    lps = [0] * n
    length = 0
    i = 1
    
    while i < n:
        if s[i] == s[length]:
            length += 1
            lps[i] = length
            i += 1
        else:
            if length != 0:
                length = lps[length - 1]
            else:
                lps[i] = 0
                i += 1
    
    # Check if repeated
    return lps[-1] > 0 and n % (n - lps[-1]) == 0
```

---

## When to Use

Use Kadane's Algorithm when you need to solve problems involving:

- **Maximum/Minimum Subarray Problems**: Finding the contiguous subarray with the largest/smallest sum
- **Maximum Product Subarray**: Finding the contiguous subarray with the largest product (variation)
- **Best Time to Buy and Sell Stock**: Finding maximum profit with single transaction
- **Circular Array Problems**: Maximum sum in a circular array
- **Fixed Window Maximum Average**: Finding maximum average of any contiguous subarray of size k

### Comparison with Alternatives

| Approach | Time Complexity | Space Complexity | Use Case |
|----------|-----------------|------------------|----------|
| **Brute Force** | O(n³) or O(n²) | O(1) | Small arrays only |
| **Divide and Conquer** | O(n log n) | O(log n) | Academic purposes |
| **Kadane's Algorithm** | **O(n)** | **O(1)** | **Optimal for single pass** |
| **Prefix Sum + Min Prefix** | O(n) | O(n) | When needing subarray indices |

### When to Choose Kadane's vs Other Approaches

- **Choose Kadane's Algorithm** when:
  - You need the maximum sum of a contiguous subarray
  - You want optimal O(n) time with O(1) space
  - You're solving variations like maximum product or circular array

- **Choose Prefix Sum** when:
  - You need to answer multiple range sum queries
  - You need to find subarrays with specific sum values
  - The array is dynamic (supports updates)

- **Choose Divide and Conquer** when:
  - You're asked about the approach in interviews
  - You need to find both minimum and maximum subarrays simultaneously

---

## Algorithm Explanation

### Core Concept

The key insight behind Kadane's Algorithm is that **any optimal subarray will never include a prefix with a negative sum**. If a prefix has a negative sum, removing it would give us a larger (or equal) sum.

This can be formalized as:
- Let `max_current` = maximum sum of subarray ending at index `i`
- Let `max_global` = maximum sum of any subarray seen so far
- Transition: `max_current = max(nums[i], max_current + nums[i])`
- Update: `max_global = max(max_global, max_current)`

### How It Works

#### Single Pass Process:

1. **Initialize**: Start with `max_current = max_global = nums[0]`
2. **Iterate** through the array from index 1 to n-1
3. **At each position i**:
   - Either extend the previous subarray (add nums[i] to max_current)
   - Or start a new subarray at position i (use nums[i] alone)
   - Take the maximum of these two choices
4. **Update global maximum** if current subarray sum is better
5. **Return** the global maximum

### Visual Representation

For array `[-2, 1, -3, 4, -1, 2, 1, -5, 4]`:

```
Index:    0    1    2    3    4    5    6    7    8
Value:   -2    1   -3    4   -1    2    1   -5    4

max_current: -2    1   -2    4    3    5    6    1    4
max_global:  -2    1    1    4    4    5    6    6    6
                          ↑         ↑         ↑
                        start=3  start=3   start=3
                                   end=6     end=6

Maximum subarray: [4, -1, 2, 1] = 6 (indices 3-6)
```

### Why Greedy Works

The greedy choice (starting fresh when the prefix sum becomes negative) is optimal because:
- If `max_current + nums[i] < nums[i]`, then `max_current < 0`
- Any subarray containing this negative prefix would be smaller than starting fresh
- Therefore, discarding the negative prefix never loses us the optimal solution

### Limitations

- **Only works for contiguous subarrays**: Cannot handle non-contiguous subarrays
- **Requires at least one element**: Empty array handling needs special care
- **Not suitable for minimization directly**: Needs modification (negate array or use different approach)
- **Single pass constraint**: Cannot easily find the actual subarray indices in some variations

---

## Practice Problems

### Problem 1: Maximum Subarray

**Problem:** [LeetCode 53 - Maximum Subarray](https://leetcode.com/problems/maximum-subarray/)

**Description:** Given an integer array `nums`, find the subarray with the largest sum and return its sum.

**How to Apply Kadane's Algorithm:**
- This is the classic application of Kadane's algorithm
- The greedy approach: at each position, decide whether to extend or start fresh
- Track `maxCurrent` and `maxGlobal` throughout the iteration

---

### Problem 2: Maximum Product Subarray

**Problem:** [LeetCode 152 - Maximum Product Subarray](https://leetcode.com/problems/maximum-product-subarray/)

**Description:** Given an integer array `nums`, find the subarray with the largest product and return that product.

**How to Apply Kadane's Variation:**
- Need to track both maximum AND minimum at each step
- When encountering a negative number, max and min swap roles
- Reason: negative × negative = positive can become the new maximum

---

### Problem 3: Maximum Sum Circular Subarray

**Problem:** [LeetCode 918 - Maximum Sum Circular Subarray](https://leetcode.com/problems/maximum-sum-circular-subarray/)

**Description:** Given a circular integer array `nums`, return the maximum possible sum of a non-empty subarray of `nums`.

**How to Apply Kadane's Variation:**
- Two cases: maximum subarray is normal (doesn't wrap) OR wraps around
- Use Kadane's for normal case
- For wrapped case: `total_sum - minimum_subarray`
- Answer = max(normal_max, total_sum - normal_min), unless all numbers are negative

---

### Problem 4: Best Time to Buy and Sell Stock

**Problem:** [LeetCode 121 - Best Time to Buy and Sell Stock](https://leetcode.com/problems/best-time-to-buy-and-sell-stock/)

**Description:** Given an array `prices` where `prices[i]` is the price of a stock on day `i`, find the maximum profit you can achieve.

**How to Apply Kadane's Algorithm:**
- Transform to finding maximum difference where buy comes before sell
- Equivalent to: max(prices[j] - prices[i]) where j > i
- Can be solved by tracking minimum price seen so far and maximum profit
- Similar greedy approach: at each day, best profit = max(current profit, price - min price so far)

---

### Problem 5: Maximum Average Subarray I

**Problem:** [LeetCode 643 - Maximum Average Subarray I](https://leetcode.com/problems/maximum-average-subarray-i/)

**Description:** Given an integer array `nums` and an integer `k`, find the subarray of length `k` with the maximum average.

**How to Apply Kadane's Algorithm:**
- Fixed sliding window of size k
- Use Kadane's approach to find maximum sum of any k-length window
- Result = max_sum / k

---

### Problem 6: Maximum Subarray Sum After One Operation

**Problem:** [LeetCode 1746 - Maximum Subarray Sum After One Operation](https://leetcode.com/problems/maximum-subarray-sum-after-one-operation/)

**Description:** Given an integer array, you can perform one operation where you square one element. Find the maximum subarray sum possible.

**How to Apply Kadane's:**
- Track two states: max sum without operation, max sum with operation used
- Apply modified DP approach

---

## Video Tutorial Links

### Fundamentals

- [Kadane's Algorithm - Maximum Subarray (Take U Forward)](https://www.youtube.com/watch?v=2F4r0N2u4vU) - Comprehensive introduction
- [Kadane's Algorithm Explained (NeetCode)](https://www.youtube.com/watch?v=2W2y2X8X7Qw) - Detailed explanation with examples
- [Maximum Subarray Problem (WilliamFiset)](https://www.youtube.com/watch?v=zb72gK9jGNY) - Visual explanation

### Variations

- [Maximum Product Subarray (NeetCode)](https://www.youtube.com/watch?v=xuoQq4f3-Js) - Handling negative numbers
- [Circular Maximum Subarray](https://www.youtube.com/watch?v=v0dJ4x4Y4cM) - Wrapping around edge case
- [Best Time to Buy and Sell Stock](https://www.youtube.com/watch?v=1mx0t6IlNWY) - Stock profit problem

---

## Follow-up Questions

### Q1: Why does Kadane's Algorithm work? What is the mathematical proof?

**Answer:** The proof relies on the following observation:
- Let `S[i]` be the maximum sum subarray ending at index `i`
- If `S[i-1] < 0`, then any subarray ending at `i` that includes elements up to `i-1` will have a smaller sum than just `[nums[i]]`
- Therefore, the optimal subarray ending at `i` either:
  1. Is just `[nums[i]]` (starting fresh), or
  2. Extends the optimal subarray ending at `i-1` (if `S[i-1] >= 0`)
- This gives us the recurrence: `S[i] = max(nums[i], S[i-1] + nums[i])`
- By induction, this produces the global maximum.

---

### Q2: How do you handle an empty array or all negative numbers?

**Answer:**
- **Empty array**: Return 0 or appropriate sentinel value
- **All negative**: Return the largest (least negative) single element, not 0
- This is because Kadane's correctly handles this case: `max(nums[i], maxCurrent + nums[i])` will always pick the single element when all numbers are negative

---

### Q3: Can Kadane's Algorithm be modified to find the minimum subarray sum?

**Answer:** Yes! Simply negate the array first, find maximum subarray, then negate back:
- `min_sum = -max_subarray([-x for x in nums])`
- Alternatively, just change `max` to `min` in the recurrence

---

### Q4: How would you modify Kadane's to find the subarray with maximum sum AND minimum length?

**Answer:**
- Track both sum and length at each step
- When finding a new maximum sum, update the indices
- When finding an equal sum but with shorter length, also update
- The greedy approach still works because we're making optimal local decisions

---

### Q5: What is the difference between Kadane's and the divide-and-conquer approach?

**Answer:**
- **Kadane's**: O(n) time, O(1) space - single pass, greedy
- **Divide and Conquer**: O(n log n) time - divide array in half, combine results
- Divide and conquer can find both min and max subarrays simultaneously
- In practice, Kadane's is preferred for this specific problem

---

## Summary

Kadane's Algorithm is the **optimal solution** for finding the maximum sum of a contiguous subarray. Key takeaways:

- **Single pass O(n)**: Much faster than brute force O(n²) or O(n³)
- **O(1) space**: Only needs a few variables
- **Greedy choice**: At each step, either extend or start fresh - this local optimal leads to global optimal
- **Versatile**: Can be adapted for variations (product, circular, etc.)

When to use:
- ✅ Finding maximum contiguous subarray sum
- ✅ Maximum product subarray (with tracking min and max)
- ✅ Circular array maximum (with inversion trick)
- ✅ Fixed window maximum average
- ❌ Non-contiguous subarrays (use different approach)
- ❌ Subarrays with constraints beyond sum (need DP)

This algorithm is a fundamental technique in competitive programming and technical interviews, often serving as a building block for more complex dynamic programming problems.
