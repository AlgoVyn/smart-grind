# Kth Missing Positive Number

## Problem Description

Given a sorted array `arr` of **distinct positive integers** and an integer `k`, return the kth positive integer that is **missing** from this array.

---

## Examples

### Example

| Input | Output |
|-------|--------|
| `arr = [2,3,4,7,11], k = 5` | `9` |

**Explanation:** The missing positive integers are `[1,5,6,8,9,10,12,13,...]`. The 5th missing is `9`.

### Example 2

| Input | Output |
|-------|--------|
| `arr = [1,2,3,4], k = 2` | `6` |

**Explanation:** The missing positive integers are `[5,6,7,...]`. The 2nd missing is `6`.

---

## Constraints

| Constraint | Description |
|------------|-------------|
| `1 ≤ arr.length ≤ 10^3` | Array length |
| `1 ≤ arr[i] ≤ 10^3` | Element values |
| `1 ≤ k ≤ 10^3` | Missing count |
| `arr[i] < arr[j]` for `i < j` | Strictly increasing |

---

## LeetCode Link

[LeetCode Problem 1539: Kth Missing Positive Number](https://leetcode.com/problems/kth-missing-positive-number/)

---

## Pattern: Binary Search on Derived Metrics

This problem follows the **Binary Search on Derived Metrics** pattern, where we binary search on a computed value rather than the array itself.

### Core Concept

- **Missing Count Formula**: `missing = arr[i] - (i + 1)` gives count of missing numbers up to index i
- **Monotonic Property**: Missing count increases monotonically with index
- **Binary Search Target**: Find smallest index where `missing >= k`

### When to Use This Pattern

This pattern is applicable when:
1. Array is sorted
2. There's a monotonic derived metric
3. Need to find kth element in transformed space

### Alternative Patterns

| Pattern | Description |
|---------|-------------|
| Linear Scan | O(n) - iterate and count |
| Hash Set | Mark presence, find missing |

---

## Intuition

The key insight is using **binary search** to find the kth missing positive number efficiently. The key formula is:

> At index `i`, the count of missing numbers is `arr[i] - (i + 1)`

This works because:
- At position `i` in a sorted array of distinct integers, the minimum value should be `i + 1`
- Any value greater than `i + 1` means some numbers are missing

### Key Observations

1. **Missing Count Formula**: `missing = arr[i] - (i + 1)` gives count of missing numbers up to index i
2. **Binary Search Target**: Find smallest index where `missing >= k`
3. **Final Answer**: If index = n (beyond array), answer is `arr[n-1] + (k - missing_at_end)`

### Why Binary Search Works

The missing count is monotonically increasing with index. This allows us to binary search for the boundary where missing count crosses k.

---

## Multiple Approaches with Code

We'll cover two approaches:
1. **Binary Search** - Optimal solution with O(log n) time
2. **Linear Scan** - Simpler approach with O(n) time

---

## Approach 1: Binary Search (Optimal)

### Algorithm Steps

1. Use binary search to find the smallest index where `missing >= k`
2. The missing count at index `i` is `arr[i] - (i + 1)`
3. If `missing < k`, search right; otherwise search left
4. After finding the position, the answer is `left + k`

### Why It Works

The binary search efficiently locates where the kth missing number would be. Since the array is sorted and contains distinct positive integers, the count of missing numbers is monotonically increasing with the index. This allows us to binary search on this derived metric.

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def findKthPositive(self, arr: List[int], k: int) -> int:
        """
        Find the kth missing positive number using binary search.
        
        Args:
            arr: Sorted array of distinct positive integers
            k: The kth missing positive number to find
            
        Returns:
            The kth missing positive integer
        """
        left, right = 0, len(arr)
        while left < right:
            mid = (left + right) // 2
            # Count missing numbers up to arr[mid]
            missing = arr[mid] - (mid + 1)
            if missing < k:
                left = mid + 1
            else:
                right = mid
        return left + k
```

<!-- slide -->
```cpp
#include <vector>
using namespace std;

class Solution {
public:
    int findKthPositive(vector<int>& arr, int k) {
        int left = 0, right = arr.size();
        while (left < right) {
            int mid = (left + right) / 2;
            int missing = arr[mid] - (mid + 1);
            if (missing < k) {
                left = mid + 1;
            } else {
                right = mid;
            }
        }
        return left + k;
    }
};
```

<!-- slide -->
```java
class Solution {
    public int findKthPositive(int[] arr, int k) {
        int left = 0, right = arr.length;
        while (left < right) {
            int mid = (left + right) / 2;
            int missing = arr[mid] - (mid + 1);
            if (missing < k) {
                left = mid + 1;
            } else {
                right = mid;
            }
        }
        return left + k;
    }
}
```

<!-- slide -->
```javascript
/**
 * @param {number[]} arr
 * @param {number} k
 * @return {number}
 */
var findKthPositive = function(arr, k) {
    let left = 0, right = arr.length;
    while (left < right) {
        const mid = Math.floor((left + right) / 2);
        const missing = arr[mid] - (mid + 1);
        if (missing < k) {
            left = mid + 1;
        } else {
            right = mid;
        }
    }
    return left + k;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(log n) - Binary search on array |
| **Space** | O(1) - Constant extra space |

---

## Approach 2: Linear Scan

### Algorithm Steps

1. Iterate through the array
2. Track expected number (starts at 1)
3. When current number doesn't match expected, count as missing
4. If we've found k missing numbers, return expected
5. If we exhaust the array, the answer is beyond all elements

### Why It Works

This is a straightforward approach that simulates counting missing numbers. While less efficient than binary search, it clearly demonstrates the concept.

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def findKthPositive(self, arr: List[int], k: int) -> int:
        """
        Find kth missing positive number using linear scan.
        """
        missing = 0
        expected = 1
        for num in arr:
            while num != expected:
                missing += 1
                if missing == k:
                    return expected
                expected += 1
            expected += 1
        # If not found in array, it's beyond all elements
        while missing < k:
            missing += 1
            expected += 1
        return expected - 1
```

<!-- slide -->
```cpp
#include <vector>
using namespace std;

class Solution {
public:
    int findKthPositive(vector<int>& arr, int k) {
        int missing = 0;
        int expected = 1;
        for (int num : arr) {
            while (num != expected) {
                missing++;
                if (missing == k) return expected;
                expected++;
            }
            expected++;
        }
        while (missing < k) {
            missing++;
            expected++;
        }
        return expected - 1;
    }
};
```

<!-- slide -->
```java
class Solution {
    public int findKthPositive(int[] arr, int k) {
        int missing = 0;
        int expected = 1;
        for (int num : arr) {
            while (num != expected) {
                missing++;
                if (missing == k) return expected;
                expected++;
            }
            expected++;
        }
        while (missing < k) {
            missing++;
            expected++;
        }
        return expected - 1;
    }
}
```

<!-- slide -->
```javascript
/**
 * @param {number[]} arr
 * @param {number} k
 * @return {number}
 */
var findKthPositive = function(arr, k) {
    let missing = 0;
    let expected = 1;
    for (const num of arr) {
        while (num !== expected) {
            missing++;
            if (missing === k) return expected;
            expected++;
        }
        expected++;
    }
    while (missing < k) {
        missing++;
        expected++;
    }
    return expected - 1;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) - Linear scan through array |
| **Space** | O(1) - Constant extra space |

---

## Comparison of Approaches

| Aspect | Binary Search | Linear Scan |
|--------|---------------|-------------|
| **Time Complexity** | O(log n) | O(n) |
| **Space Complexity** | O(1) | O(1) |
| **Implementation** | Moderate | Simple |
| **LeetCode Optimal** | ✅ | ✅ |

**Best Approach:** Binary Search is optimal for this problem with O(log n) time complexity.

---

## Why This Problem is Important

### Interview Relevance

- **Frequency**: Commonly asked in technical interviews
- **Companies**: Amazon, Google, Microsoft, Apple
- **Difficulty**: Easy/Medium
- **Concepts Tested**: Binary Search, Array Manipulation, Mathematical Reasoning

### Learning Outcomes

1. **Binary Search Mastery**: Learn to binary search on derived metrics
2. **Mathematical Thinking**: Understand the relationship between index and missing count
3. **Optimization**: From O(n) to O(log n)

---

## Related Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Missing Number | [Link](https://leetcode.com/problems/missing-number/) | Find missing number in array |
| First Missing Positive | [Link](https://leetcode.com/problems/first-missing-positive/) | Find smallest missing positive |
| Find All K Missing Numbers | [Link](https://leetcode.com/problems/find-all-k-missing-numbers/) | Find all k missing numbers |

### Pattern Reference

For more detailed explanations of the Binary Search pattern, see:
- **[Binary Search Pattern](/patterns/binary-search-find-first-last-occurrence)**

---

## Video Tutorial Links

Here are helpful YouTube tutorials explaining the problem and solutions:

1. **[NeetCode - Kth Missing Positive Number](https://www.youtube.com/watch?v=byF48rLBv5I)** - Clear explanation with visual examples
2. **[Kth Missing Positive Number - LeetCode 1539](https://www.youtube.com/watch?v=byF48rLBv5I)** - Detailed walkthrough
3. **[Binary Search Explained](https://www.youtube.com/watch?v=Mo33MjsM1iE)** - Understanding binary search

---

## Follow-up Questions

### Q1: How would you modify the solution if the array was not sorted?

**Answer:** You would need to first sort the array (O(n log n)), then apply binary search. Alternatively, use a hash set to find missing numbers.

---

### Q2: What if the array could contain duplicates?

**Answer:** The current formula `arr[i] - (i + 1)` would not work correctly. You would need to handle duplicates by removing them first or using a different approach.

---

### Q3: Can you solve this in O(1) space without modifying the array?

**Answer:** Yes, the binary search approach already uses O(1) space and doesn't modify the input array.

---

### Q4: How would you find all k missing positive numbers?

**Answer:** You would need to modify the algorithm to continue after finding the first k, or use the linear scan approach and collect all missing numbers until you have k.

---

## Common Pitfalls

### 1. Wrong Missing Count Formula
**Issue**: Using `arr[i] - i` instead of `arr[i] - (i + 1)`

**Solution**: Remember the formula accounts for 1-based counting of positive integers.

### 2. Off-by-One in Final Answer
**Issue**: Adding wrong offset to the result

**Solution**: The final answer is `left + k`, where `left` is the index after binary search.

### 3. Not Handling Case Beyond Array
**Issue**: When k is larger than all missing numbers in the array

**Solution**: After binary search, if `left` equals array length, calculate answer as `arr[n-1] + (k - missing_at_last_index)`

---

## Summary

The **Kth Missing Positive Number** problem demonstrates efficient binary search on a derived metric:

- **Optimal Approach**: Binary Search with O(log n) time
- **Key Formula**: `missing = arr[i] - (i + 1)`
- **Final Answer**: `left + k` where left is the binary search result

The binary search finds the position where k or more numbers are missing, then calculates the exact kth missing number.

### Pattern Summary

This problem exemplifies the **Binary Search on Derived Metrics** pattern, characterized by:
- Transforming the problem into a monotonic function
- Binary searching on the derived metric
- Calculating final answer from the search result

For more details on this pattern and its variations, see the **[Binary Search Pattern](/patterns/binary-search-find-first-last-occurrence)**.

---

## Additional Resources

- [LeetCode Problem 1539](https://leetcode.com/problems/kth-missing-positive-number/) - Official problem page
- [Binary Search - GeeksforGeeks](https://www.geeksforgeeks.org/binary-search/) - Detailed binary search explanation
- [Pattern: Binary Search](/patterns/binary-search-find-first-last-occurrence) - Comprehensive pattern guide
