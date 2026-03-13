# Contains Duplicate II

## Problem Description

Given an integer array `nums` and an integer `k`, return `true` if there are two distinct indices `i` and `j` in the array such that `nums[i] == nums[j]` and `abs(i - j) <= k`.

**Link to problem:** [Contains Duplicate II - LeetCode 219](https://leetcode.com/problems/contains-duplicate-ii/)

## Constraints
- `1 <= nums.length <= 10^5`
- `-10^9 <= nums[i] <= 10^9`
- `0 <= k <= 10^5`

---

## Pattern: Sliding Window with Hash Map

This problem is a classic example of the **Sliding Window** pattern combined with a **Hash Map**. The pattern involves maintaining a window of size k and using a hash map for O(1) lookups.

### Core Concept

The fundamental idea is:
- **Sliding Window**: Maintain a window of size k that slides through the array
- **Hash Map**: Store elements in the current window for O(1) lookup
- **Constraint**: Check if any duplicate is within distance k

---

## Examples

### Example

**Input:**
```
nums = [1,2,3,1], k = 3
```

**Output:**
```
true
```

**Explanation:** nums[0] = nums[3] = 1, and |0 - 3| = 3 <= k

### Example 2

**Input:**
```
nums = [1,0,1,1], k = 1
```

**Output:**
```
true
```

**Explanation:** nums[2] = nums[3] = 1, and |2 - 3| = 1 <= k

### Example 3

**Input:**
```
nums = [1,2,3,1,2,3], k = 2
```

**Output:**
```
false
```

**Explanation:** No two duplicates are within distance 2

---

## Intuition

The key insight is to maintain a sliding window of size k and check for duplicates within that window:

1. **Window Size**: The window should contain elements with indices in [i-k, i] for each position i
2. **Hash Map**: Use a set or map to store elements in the current window
3. **Sliding**: Remove elements that are now outside the window (more than k positions behind)

### Why Sliding Window?

- **Efficiency**: We only need to check elements within distance k
- **O(n) Time**: Each element is added and removed at most once

---

## Multiple Approaches with Code

We'll cover three approaches:

1. **Sliding Window with Set** - Optimal O(n) time, O(min(n,k)) space
2. **Hash Map Index Tracking** - Track the most recent index of each element
3. **Brute Force with Optimization** - Early termination

---

## Approach 1: Sliding Window with Set (Optimal)

This is the most efficient approach using a sliding window and a set.

### Algorithm Steps

1. Create an empty set to track elements in the current window
2. Iterate through the array with index i
3. If element is already in set, return true (duplicate within window)
4. Add element to set
5. If set size > k, remove the element at index i-k (outside window)
6. Return false if no duplicates found

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def containsNearbyDuplicate(self, nums: List[int], k: int) -> bool:
        """
        Check for duplicates within distance k using sliding window.
        
        Args:
            nums: List of integers
            k: Maximum distance between duplicate indices
            
        Returns:
            True if duplicates exist within distance k
        """
        seen = set()
        for i, num in enumerate(nums):
            if num in seen:
                return True
            seen.add(num)
            if len(seen) > k:
                seen.remove(nums[i - k])
        return False
```

<!-- slide -->
```cpp
class Solution {
public:
    bool containsNearbyDuplicate(vector<int>& nums, int k) {
        /**
         * Check for duplicates within distance k using sliding window.
         * 
         * Args:
         *     nums: List of integers
         *     k: Maximum distance between duplicate indices
         * 
         * Returns:
         *     True if duplicates exist within distance k
         */
        unordered_set<int> seen;
        for (int i = 0; i < nums.size(); i++) {
            if (seen.count(nums[i])) {
                return true;
            }
            seen.insert(nums[i]);
            if (seen.size() > k) {
                seen.erase(nums[i - k]);
            }
        }
        return false;
    }
};
```

<!-- slide -->
```java
class Solution {
    public boolean containsNearbyDuplicate(int[] nums, int k) {
        /**
         * Check for duplicates within distance k using sliding window.
         * 
         * Args:
         *     nums: List of integers
         *     k: Maximum distance between duplicate indices
         * 
         * Returns:
         *     True if duplicates exist within distance k
         */
        Set<Integer> seen = new HashSet<>();
        for (int i = 0; i < nums.length; i++) {
            if (seen.contains(nums[i])) {
                return true;
            }
            seen.add(nums[i]);
            if (seen.size() > k) {
                seen.remove(nums[i - k]);
            }
        }
        return false;
    }
}
```

<!-- slide -->
```javascript
/**
 * Check for duplicates within distance k using sliding window.
 * 
 * @param {number[]} nums - List of integers
 * @param {number} k - Maximum distance between duplicate indices
 * @return {boolean} - True if duplicates exist within distance k
 */
var containsNearbyDuplicate = function(nums, k) {
    const seen = new Set();
    for (let i = 0; i < nums.length; i++) {
        if (seen.has(nums[i])) {
            return true;
        }
        seen.add(nums[i]);
        if (seen.size() > k) {
            seen.delete(nums[i - k]);
        }
    }
    return false;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) - Each element is added and removed at most once |
| **Space** | O(min(n, k)) - Set contains at most k elements |

---

## Approach 2: Hash Map Index Tracking

This approach tracks the most recent index of each element.

### Algorithm Steps

1. Create a hash map to store the most recent index of each element
2. Iterate through the array
3. If element exists in map, check if current index - stored index <= k
4. Update the map with the current index
5. Return false if no duplicates found

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def containsNearbyDuplicate_map(self, nums: List[int], k: int) -> bool:
        """
        Check for duplicates using hash map to track indices.
        """
        index_map = {}
        for i, num in enumerate(nums):
            if num in index_map and i - index_map[num] <= k:
                return True
            index_map[num] = i
        return False
```

<!-- slide -->
```cpp
class Solution {
public:
    bool containsNearbyDuplicate(vector<int>& nums, int k) {
        unordered_map<int, int> indexMap;
        for (int i = 0; i < nums.size(); i++) {
            if (indexMap.count(nums[i]) && i - indexMap[nums[i]] <= k) {
                return true;
            }
            indexMap[nums[i]] = i;
        }
        return false;
    }
};
```

<!-- slide -->
```java
class Solution {
    public boolean containsNearbyDuplicate(int[] nums, int k) {
        Map<Integer, Integer> indexMap = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            if (indexMap.containsKey(nums[i]) && i - indexMap.get(nums[i]) <= k) {
                return true;
            }
            indexMap.put(nums[i], i);
        }
        return false;
    }
}
```

<!-- slide -->
```javascript
/**
 * Check for duplicates using hash map to track indices.
 * 
 * @param {number[]} nums - List of integers
 * @param {number} k - Maximum distance between duplicate indices
 * @return {boolean} - True if duplicates exist within distance k
 */
var containsNearbyDuplicate = function(nums, k) {
    const indexMap = new Map();
    for (let i = 0; i < nums.length; i++) {
        if (indexMap.has(nums[i]) && i - indexMap.get(nums[i]) <= k) {
            return true;
        }
        indexMap.set(nums[i], i);
    }
    return false;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) |
| **Space** | O(n) - In worst case, map stores all elements |

---

## Approach 3: Brute Force with Early Termination

A simple approach with O(n*k) time but early termination can be faster in practice.

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def containsNearbyDuplicate_brute(self, nums: List[int], k: int) -> bool:
        """
        Brute force with early termination.
        """
        n = len(nums)
        for i in range(n):
            for j in range(i + 1, min(i + k + 1, n)):
                if nums[i] == nums[j]:
                    return True
        return False
```

<!-- slide -->
```cpp
class Solution {
public:
    bool containsNearbyDuplicate(vector<int>& nums, int k) {
        int n = nums.size();
        for (int i = 0; i < n; i++) {
            for (int j = i + 1; j < min(i + k + 1, n); j++) {
                if (nums[i] == nums[j]) {
                    return true;
                }
            }
        }
        return false;
    }
};
```

<!-- slide -->
```java
class Solution {
    public boolean containsNearbyDuplicate(int[] nums, int k) {
        int n = nums.length;
        for (int i = 0; i < n; i++) {
            for (int j = i + 1; j < Math.min(i + k + 1, n); j++) {
                if (nums[i] == nums[j]) {
                    return true;
                }
            }
        }
        return false;
    }
}
```

<!-- slide -->
```javascript
/**
 * Brute force with early termination.
 * 
 * @param {number[]} nums - List of integers
 * @param {number} k - Maximum distance between duplicate indices
 * @return {boolean} - True if duplicates exist within distance k
 */
var containsNearbyDuplicate = function(nums, k) {
    const n = nums.length;
    for (let i = 0; i < n; i++) {
        for (let j = i + 1; j < Math.min(i + k + 1, n); j++) {
            if (nums[i] === nums[j]) {
                return true;
            }
        }
    }
    return false;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n * k) - In worst case |
| **Space** | O(1) |

---

## Comparison of Approaches

| Aspect | Sliding Window | Hash Map | Brute Force |
|--------|---------------|----------|-------------|
| **Time Complexity** | O(n) | O(n) | O(n * k) |
| **Space Complexity** | O(min(n,k)) | O(n) | O(1) |
| **Implementation** | Simple | Simple | Simple |
| **LeetCode Optimal** | ✅ Yes | ✅ Yes | ❌ No |
| **Best For** | Space-constrained | Understanding | Small k |

**Best Approach:** Both sliding window and hash map are optimal with O(n) time. Choose based on space requirements.

---

## Why Sliding Window is Optimal

The sliding window approach is optimal because:

1. **Efficient Window Management**: Elements outside the window are removed immediately
2. **O(1) Operations**: Set operations are constant time on average
3. **Single Pass**: Each element is visited exactly once
4. **Space Bounded**: Window size is limited by k, not array size

The key insight is that we only need to check elements within distance k, making the sliding window perfect for this problem.

---

## Related Problems

Based on similar themes (sliding window, hash table):

### Easy Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Contains Duplicate | [Link](https://leetcode.com/problems/contains-duplicate/) | Basic duplicate check |
| Valid Anagram | [Link](https://leetcode.com/problems/valid-anagram/) | Hash table basics |
| Unique Number of Occurrences | [Link](https://leetcode.com/problems/unique-number-of-occurrences/) | Frequency counting |

### Medium Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Longest Substring Without Repeating Characters | [Link](https://leetcode.com/problems/longest-substring-without-repeating-characters/) | Sliding window |
| Fruit Into Baskets | [Link](https://leetcode.com/problems/fruit-into-baskets/) | Sliding window variant |
| Max Consecutive Ones III | [Link](https://leetcode.com/problems/max-consecutive-ones-iii/) | Sliding window |

### Hard Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Sliding Window Maximum | [Link](https://leetcode.com/problems/sliding-window-maximum/) | Advanced sliding window |
| Minimum Window Substring | [Link](https://leetcode.com/problems/minimum-window-substring/) | Complex sliding window |

### Pattern Reference

For more detailed explanations of the Sliding Window pattern, see:
- **[Sliding Window Pattern](/patterns/sliding-window)**

---

## Video Tutorial Links

Here are helpful YouTube tutorials explaining the problem and solutions:

### Sliding Window Technique

- [NeetCode - Contains Duplicate II](https://www.youtube.com/watch?v=0ZJAB4kqLEU) - Clear explanation
- [Sliding Window Technique Explained](https://www.youtube.com/watch?v=M4N2kwH2p8M) - Pattern explanation
- [LeetCode Official Solution](https://www.youtube.com/watch?v=ypL7z4b5Pzc) - Official solution

### Hash Table Concepts

- [Hash Table Fundamentals](https://www.youtube.com/watch?v=shs0J3_j8O0) - Understanding hash tables
- [Set vs Map in Programming](https://www.youtube.com/watch?v=Y6Q94FVb4Xk) - Choosing the right data structure

---

## Follow-up Questions

### Q1: Can you solve it in O(1) extra space?

**Answer:** Not in the general case. You need to track elements in the current window, which requires O(min(n, k)) space. However, if k = 0, you can do it in O(1) space.

---

### Q2: What if k is larger than the array length?

**Answer:** The sliding window approach naturally handles this. The set will contain all elements up to min(i, k+1), so space is still O(min(n, k)).

---

### Q3: How would you modify to return the actual indices instead of just true/false?

**Answer:** Use a hash map to store the index of each element. When you find a duplicate, return the stored index and current index.

---

### Q4: What edge cases should be tested?

**Answer:**
- k = 0 (no distance allowed)
- k >= n (can check entire array)
- Array with all same elements
- Array with all unique elements
- Duplicate at the beginning and end
- Duplicate at adjacent positions

---

### Q5: How does this compare to Contains Duplicate I?

**Answer:** Contains Duplicate I only checks if any duplicate exists, regardless of distance. This problem adds the constraint that duplicates must be within distance k.

---

### Q6: What if we need to find the maximum distance between duplicates?

**Answer:** Use a hash map to track first and last occurrences of each element, then compute the maximum difference.

---

## Common Pitfalls

### 1. Window Size
**Issue**: Not properly maintaining window size.

**Solution**: Remove elements when window size exceeds k using index i-k.

### 2. Set vs Map
**Issue**: Using map when set is sufficient.

**Solution**: We only need to check existence, not track indices. Use set for O(1) lookup.

### 3. Boundary Conditions
**Issue**: Not handling k=0 or k larger than array length.

**Solution**: The algorithm handles these naturally, but verify with tests.

### 4. Duplicate Elements in Window
**Issue**: Not checking for duplicates before adding new element.

**Solution**: Check `if num in seen` before adding to catch duplicates immediately.

---

## Summary

The **Contains Duplicate II** problem demonstrates the power of combining sliding window with hash tables:

- **Sliding Window**: Optimal with O(n) time and O(min(n,k)) space
- **Hash Map**: Alternative with O(n) time and O(n) space
- **Brute Force**: Simple but O(n * k) time

The key insight is that we only need to track elements within distance k, making sliding window the natural choice.

This problem is an excellent example of the sliding window pattern combined with hash table operations.

### Pattern Summary

This problem exemplifies the **Sliding Window** pattern, which is characterized by:
- Maintaining a window of fixed or variable size
- Sliding the window through the data
- O(n) time complexity in optimal cases
- Efficient space usage

For more details on this pattern, see the **[Sliding Window Pattern](/patterns/sliding-window)**.

---

## Additional Resources

- [LeetCode Problem Discussion](https://leetcode.com/problems/contains-duplicate-ii/discuss/) - Community solutions
- [Sliding Window Technique - GeeksforGeeks](https://www.geeksforgeeks.org/window-sliding-technique/) - Detailed explanation
- [Hash Table Implementation - Wikipedia](https://en.wikipedia.org/wiki/Hash_table) - Understanding hash tables
