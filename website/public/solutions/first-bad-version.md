# First Bad Version

## Problem Description

You are a product manager and currently leading a team to develop a new product. Unfortunately, the latest version of your product fails the quality check. Since each version is developed based on the previous version, all the versions after a bad version are also bad.
Suppose you have n versions [1, 2, ..., n] and you want to find out the first bad one, which causes all the following ones to be bad.
You are given an API bool isBadVersion(version) which returns whether version is bad. Implement a function to find the first bad version. You should minimize the number of calls to the API.

**Link to problem:** [First Bad Version - LeetCode 278](https://leetcode.com/problems/first-bad-version/)

---

## Examples

### Example

**Input:** n = 5, bad = 4

**Output:** 4

**Explanation:**
```
call isBadVersion(3) -> false
call isBadVersion(5) -> true
call isBadVersion(4) -> true
```
Then 4 is the first bad version.

### Example 2

**Input:** n = 1, bad = 1

**Output:** 1

---

## Constraints

- `1 <= bad <= n <= 2^31 - 1`

---

## Pattern: Binary Search - Left Boundary

This problem demonstrates the **Binary Search** pattern for finding the left boundary (first occurrence). The key is finding the smallest index where a condition becomes true.

### Core Concept

- **Monotonic Property**: Once a version is bad, all following versions are bad
- **Left Boundary**: Find first index where isBadVersion returns true
- **Binary Search**: O(log n) calls to API
- **Search Space**: Reduce half the range each iteration

---

## Intuition

### Key Observations

1. **Monotonic Property**: The array has a special property - once we find a bad version, all versions after it are also bad. This creates a monotonic (true, true, ..., true, false, false, ..., false) pattern.

2. **Binary Search Applicability**: Because of the monotonic property, we can use binary search to efficiently find the first true (bad version).

3. **Left Boundary Search**: We're not just searching for any bad version - we need the FIRST one. This requires careful handling of the search boundaries.

### Why Binary Search Works

- If `isBadVersion(mid)` is **true**: The first bad version is at `mid` or before (to the left). We set `right = mid`.
- If `isBadVersion(mid)` is **false**: The first bad version is after `mid`. We set `left = mid + 1`.
- When `left == right`, we've found the first bad version.

### Visual Example

```
n = 5, bad = 4
Versions: [G, G, G, B, B]
           1  2  3  4  5

Step 1: left=1, right=5, mid=3
        isBadVersion(3) = false (G)
        → first bad is after 3
        → left = 4

Step 2: left=4, right=5, mid=4
        isBadVersion(4) = true (B)
        → first bad is at 4 or before
        → right = 4

Step 3: left=4, right=4
        Return 4
```

---

## Multiple Approaches with Code

## Approach 1: Binary Search (Optimal)

The classic O(log n) solution using binary search to find the left boundary.

#### Algorithm

1. Initialize `left = 1`, `right = n`
2. While `left < right`:
   - Calculate `mid = left + (right - left) // 2` (avoid overflow)
   - If `isBadVersion(mid)` is true: first bad is ≤ mid, set `right = mid`
   - Otherwise: first bad is > mid, set `left = mid + 1`
3. Return `left` (or `right`, they're equal)

#### Code Implementation

````carousel
```python
# The isBadVersion API is already defined for you.
# def isBadVersion(version: int) -> bool:

class Solution:
    def firstBadVersion(self, n: int) -> int:
        """
        Find the first bad version using binary search.
        
        Args:
            n: Total number of versions
            
        Returns:
            The first bad version number
        """
        left, right = 1, n
        
        while left < right:
            mid = left + (right - left) // 2
            if isBadVersion(mid):
                right = mid  # First bad is at mid or before
            else:
                left = mid + 1  # First bad is after mid
        
        return left
```
<!-- slide -->
```cpp
// The isBadVersion API is already defined for you.
// bool isBadVersion(int version);

class Solution {
public:
    int firstBadVersion(int n) {
        int left = 1, right = n;
        
        while (left < right) {
            int mid = left + (right - left) / 2;
            if (isBadVersion(mid)) {
                right = mid;  // First bad is at mid or before
            } else {
                left = mid + 1;  // First bad is after mid
            }
        }
        
        return left;
    }
};
```
<!-- slide -->
```java
/* The isBadVersion API is already defined for you.
 * boolean isBadVersion(int version);
 */

class Solution extends VersionControl {
    public int firstBadVersion(int n) {
        int left = 1, right = n;
        
        while (left < right) {
            int mid = left + (right - left) / 2;
            if (isBadVersion(mid)) {
                right = mid;  // First bad is at mid or before
            } else {
                left = mid + 1;  // First bad is after mid
            }
        }
        
        return left;
    }
}
```
<!-- slide -->
```javascript
/**
 * Definition for isBadVersion API
 * @param {integer} version
 * @return {boolean} returns if version is bad
 * var isBadVersion = function(version) { ... }
 */

/**
 * @param {number} n
 * @return {number}
 */
var firstBadVersion = function(n) {
    let left = 1, right = n;
    
    while (left < right) {
        const mid = left + Math.floor((right - left) / 2);
        if (isBadVersion(mid)) {
            right = mid;  // First bad is at mid or before
        } else {
            left = mid + 1;  // First bad is after mid
        }
    }
    
    return left;
};
```
````

#### Complexity Analysis

| Complexity | Value |
|------------|-------|
| **Time** | O(log n) - binary search reduces search space by half each iteration |
| **Space** | O(1) - only uses constant extra space |

---

## Approach 2: Linear Scan (Brute Force)

Check each version starting from 1 until finding the first bad version.

#### Algorithm

1. For each version from 1 to n:
   - If `isBadVersion(i)` returns true, return i
2. If none found, return n (shouldn't happen per constraints)

#### Code Implementation

````carousel
```python
class Solution:
    def firstBadVersion(self, n: int) -> int:
        """
        Find first bad version using linear scan (brute force).
        """
        for i in range(1, n + 1):
            if isBadVersion(i):
                return i
        return n
```
<!-- slide -->
```cpp
class Solution {
public:
    int firstBadVersion(int n) {
        for (int i = 1; i <= n; i++) {
            if (isBadVersion(i)) {
                return i;
            }
        }
        return n;
    }
};
```
<!-- slide -->
```java
class Solution extends VersionControl {
    public int firstBadVersion(int n) {
        for (int i = 1; i <= n; i++) {
            if (isBadVersion(i)) {
                return i;
            }
        }
        return n;
    }
}
```
<!-- slide -->
```javascript
var firstBadVersion = function(n) {
    for (let i = 1; i <= n; i++) {
        if (isBadVersion(i)) {
            return i;
        }
    }
    return n;
};
```
````

#### Complexity Analysis

| Complexity | Value |
|------------|-------|
| **Time** | O(n) - worst case checks all versions |
| **Space** | O(1) - no extra space |

---

## Comparison of Approaches

| Approach | Time | Space | Notes |
|----------|------|-------|-------|
| **Binary Search** | O(log n) | O(1) | Optimal, interview standard |
| **Linear Scan** | O(n) | O(1) | Simple but inefficient |

**Best Approach:** Binary Search (Approach 1) is the optimal solution and what interviewers expect.

---

## Why This Problem is Important

### Interview Relevance

- **Frequency**: Commonly asked in technical interviews
- **Companies**: Google, Meta, Amazon, Microsoft
- **Difficulty**: Easy (but tests important concepts)
- **Concepts**: Binary search, boundary conditions, API usage

### Learning Outcomes

1. **Binary Search Mastery**: Learn to implement binary search correctly
2. **Boundary Handling**: Understand when to use `<` vs `<=`
3. **Left vs Right Boundary**: Distinguish between finding first/last occurrence
4. **Overflow Prevention**: Handle large numbers safely

---

## Related Problems

### Same Pattern (Binary Search)

| Problem | LeetCode Link | Difficulty |
|---------|---------------|------------|
| Search Insert Position | [Link](https://leetcode.com/problems/search-insert-position/) | Easy |
| Sqrt(x) | [Link](https://leetcode.com/problems/sqrtx/) | Easy |
| Find Peak Element | [Link](https://leetcode.com/problems/find-peak-element/) | Medium |

### Similar Concepts

| Problem | LeetCode Link | Difficulty | Related Technique |
|---------|---------------|------------|-------------------|
| Search in Rotated Array | [Link](https://leetcode.com/problems/search-in-rotated-sorted-array/) | Medium | Binary Search |
| Find Minimum in Rotated Array | [Link](https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/) | Medium | Binary Search |

---

## Video Tutorial Links

### Recommended Tutorials

1. **[NeetCode - First Bad Version](https://www.youtube.com/watch?v=C2acD3P5nF8)** - Clear explanation with examples
2. **[Binary Search - First Bad Version](https://www.youtube.com/watch?v=6zD9R/8)** - Detailed walkthrough

### Additional Resources

- **[Binary Search - GeeksforGeeks](https://www.geeksforgeeks.org/binary-search/)** - Comprehensive guide
- **[LeetCode Official Solution](https://leetcode.com/problems/first-bad-version/solution/)** - Official explanations

---

## Follow-up Questions

### Q1: How would you modify the solution to find the last good version?

**Answer:** Use right boundary search instead:
```python
left, right = 1, n
while left < right:
    mid = left + (right - left + 1) // 2  # Round up
    if isBadVersion(mid):
        left = mid  # Last good is at mid or after
    else:
        right = mid - 1
return left
```

---

### Q2: What if the API has a cost associated with each call?

**Answer:** The binary search solution already minimizes calls to O(log n). If costs vary, consider caching results or using a modified search that accounts for cost.

---

### Q3: How would you handle very large n (close to 2^31 - 1)?

**Answer:** The binary search solution handles this naturally. Use `left + (right - left) // 2` to avoid overflow. Python handles big integers automatically.

---

### Q4: Can you solve this without using binary search?

**Answer:** Yes, linear scan works but is O(n). There's no better alternative since we have no information about the distribution of bad versions.

---

### Q5: What edge cases should be tested?

**Answer:**
- n = 1 (single version)
- First version is bad (bad = 1)
- Last version is bad (bad = n)
- All versions are bad
- Middle version is bad

---

## Common Pitfalls

### 1. Using Wrong Loop Condition
**Issue:** Using `left <= right` instead of `left < right`.

**Solution:** Use `<` to avoid infinite loop when left == right.

### 2. Integer Overflow in Mid Calculation
**Issue:** Using `(left + right) // 2` can overflow for large n.

**Solution:** Use `left + (right - left) // 2`.

### 3. Confusing Left and Right Update
**Issue:** Using wrong direction when isBadVersion(mid) is true/false.

**Solution:** If mid is bad → `right = mid`, else → `left = mid + 1`.

### 4. Not Starting from 1
**Issue:** Some implementations start from 0.

**Solution:** Versions are 1-indexed, so start with left=1.

### 5. Using Wrong Mid Calculation for Left Boundary
**Issue:** Using ceiling division instead of floor.

**Solution:** Use `left + (right - left) // 2` (floor division).

---

## Summary

The **First Bad Version** problem is a classic binary search application for finding the left boundary. Key takeaways:

1. **Binary Search is Optimal**: O(log n) time complexity
2. **Left Boundary Pattern**: When `isBadVersion(mid)` is true, search left (`right = mid`)
3. **Avoid Overflow**: Use `left + (right - left) // 2`
4. **Correct Loop Condition**: Use `left < right`, not `<=`
5. **O(1) Space**: Only constant extra space needed

This problem tests understanding of binary search variants and careful boundary handling - essential skills for technical interviews.

### Pattern Summary

This problem exemplifies the **Binary Search - Left Boundary** pattern:
- Monotonic property enables binary search
- Finding first occurrence requires special handling
- Boundary conditions are critical
- Foundation for many other binary search problems

For more details on binary search patterns, see the **[Binary Search Pattern](/patterns/binary-search)**.

---

## LeetCode Link

[First Bad Version - LeetCode](https://leetcode.com/problems/first-bad-version/)
