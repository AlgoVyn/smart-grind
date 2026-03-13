# Intersection of Two Arrays

## Problem Description

Given two integer arrays `nums1` and `nums2`, return an array of their **intersection**. Each element in the result must be **unique**, and you may return the result in any order.

**Link to problem:** [Intersection of Two Arrays - LeetCode 349](https://leetcode.com/problems/intersection-of-two-arrays/)

## Constraints
- `1 <= nums1.length, nums2.length <= 1000`
- `0 <= nums1[i], nums2[i] <= 1000`

---

## Pattern: Set-Based Intersection

This problem demonstrates the **Set-Based Intersection** pattern. The pattern uses hash sets for efficient membership testing and intersection operations.

### Core Concept

- **Set Conversion**: Convert arrays to sets for O(1) lookup
- **Intersection**: Find common elements between sets
- **Uniqueness**: Sets naturally handle duplicates

---

## Examples

### Example

**Input:**
```
nums1 = [1, 2, 2, 1]
nums2 = [2, 2]
```

**Output:**
```
[2]
```

**Explanation:** The intersection of the two arrays is [2].

### Example 2

**Input:**
```
nums1 = [4, 9, 5]
nums2 = [9, 4, 9, 8, 4]
```

**Output:**
```
[9, 4]
```

**Explanation:** The intersection is [4, 9], order doesn't matter.

---

## Intuition

The key insight is using set operations for efficient intersection:

1. **Convert to Set**: Hash sets provide O(1) membership testing
2. **Find Intersection**: Iterate through smaller set and check membership in larger
3. **Handle Duplicates**: Sets automatically handle duplicates

### Why Set Works

- **Fast Lookup**: O(1) average time for checking if element exists
- **Automatic Deduplication**: Sets don't allow duplicates
- **Efficient Intersection**: Can iterate through smaller set for better performance

---

## Multiple Approaches with Code

We'll cover three approaches:

1. **Set Intersection (Optimal)** - O(n + m) time
2. **Two Pointers** - O(n log n + m log m) time
3. **Binary Search** - O(n log m) time

---

## Approach 1: Set Intersection (Optimal)

This is the simplest and most efficient approach.

### Algorithm Steps

1. Convert nums1 to a set for O(1) lookups
2. Create an empty result set
3. Iterate through nums2, add common elements to result
4. Convert result set to array

### Why It Works

Sets provide constant-time membership testing. By iterating through nums2 and checking if each element exists in nums1's set, we find all common elements efficiently.

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def intersection(self, nums1: List[int], nums2: List[int]) -> List[int]:
        set1 = set(nums1)
        result = set()
        
        for num in nums2:
            if num in set1:
                result.add(num)
        
        return list(result)
```

<!-- slide -->
```cpp
class Solution {
public:
    vector<int> intersection(vector<int>& nums1, vector<int>& nums2) {
        unordered_set<int> set1(nums1.begin(), nums1.end());
        unordered_set<int> result;
        
        for (int num : nums2) {
            if (set1.count(num)) {
                result.insert(num);
            }
        }
        
        return vector<int>(result.begin(), result.end());
    }
};
```

<!-- slide -->
```java
class Solution {
    public int[] intersection(int[] nums1, int[] nums2) {
        Set<Integer> set1 = new HashSet<>();
        for (int num : nums1) {
            set1.add(num);
        }
        
        Set<Integer> result = new HashSet<>();
        for (int num : nums2) {
            if (set1.contains(num)) {
                result.add(num);
            }
        }
        
        return result.stream().mapToInt(Integer::intValue).toArray();
    }
}
```

<!-- slide -->
```javascript
var intersection = function(nums1, nums2) {
    const set1 = new Set(nums1);
    const result = new Set();
    
    for (const num of nums2) {
        if (set1.has(num)) {
            result.add(num);
        }
    }
    
    return Array.from(result);
};
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n + m) - iterate through both arrays once |
| **Space** | O(n + m) - storing both sets |

---

## Approach 2: Two Pointers

This approach sorts both arrays and uses the two-pointer technique.

### Algorithm Steps

1. Sort both arrays
2. Use two pointers, one for each array
3. Move pointers based on comparison
4. Add to result when values match

### Why It Works

Sorting enables systematic comparison. When pointers have equal values, add to result. When one is smaller, advance that pointer.

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def intersection(self, nums1: List[int], nums2: List[int]) -> List[int]:
        nums1.sort()
        nums2.sort()
        
        i, j = 0, 0
        result = []
        
        while i < len(nums1) and j < len(nums2):
            if nums1[i] == nums2[j]:
                if not result or result[-1] != nums1[i]:
                    result.append(nums1[i])
                i += 1
                j += 1
            elif nums1[i] < nums2[j]:
                i += 1
            else:
                j += 1
        
        return result
```

<!-- slide -->
```cpp
class Solution {
public:
    vector<int> intersection(vector<int>& nums1, vector<int>& nums2) {
        sort(nums1.begin(), nums1.end());
        sort(nums2.begin(), nums2.end());
        
        int i = 0, j = 0;
        vector<int> result;
        
        while (i < nums1.size() && j < nums2.size()) {
            if (nums1[i] == nums2[j]) {
                if (result.empty() || result.back() != nums1[i]) {
                    result.push_back(nums1[i]);
                }
                i++;
                j++;
            } else if (nums1[i] < nums2[j]) {
                i++;
            } else {
                j++;
            }
        }
        
        return result;
    }
};
```

<!-- slide -->
```java
class Solution {
    public int[] intersection(int[] nums1, int[] nums2) {
        Arrays.sort(nums1);
        Arrays.sort(nums2);
        
        int i = 0, j = 0;
        List<Integer> result = new ArrayList<>();
        
        while (i < nums1.length && j < nums2.length) {
            if (nums1[i] == nums2[j]) {
                if (result.isEmpty() || result.get(result.size() - 1) != nums1[i]) {
                    result.add(nums1[i]);
                }
                i++;
                j++;
            } else if (nums1[i] < nums2[j]) {
                i++;
            } else {
                j++;
            }
        }
        
        return result.stream().mapToInt(Integer::intValue).toArray();
    }
}
```

<!-- slide -->
```javascript
var intersection = function(nums1, nums2) {
    nums1.sort((a, b) => a - b);
    nums2.sort((a, b) => a - b);
    
    let i = 0, j = 0;
    const result = [];
    
    while (i < nums1.length && j < nums2.length) {
        if (nums1[i] === nums2[j]) {
            if (result.length === 0 || result[result.length - 1] !== nums1[i]) {
                result.push(nums1[i]);
            }
            i++;
            j++;
        } else if (nums1[i] < nums2[j]) {
            i++;
        } else {
            j++;
        }
    }
    
    return result;
};
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n log n + m log m) - dominated by sorting |
| **Space** | O(1) extra (excluding output) |

---

## Approach 3: Binary Search

This approach sorts one array and uses binary search on the other.

### Algorithm Steps

1. Sort nums1
2. For each element in nums2, binary search in nums1
3. Add to result if found and not duplicate

### Why It Works

Binary search provides O(log n) lookup. This is useful when one array is much smaller than the other.

### Code Implementation

````carousel
```python
from typing import List
import bisect

class Solution:
    def intersection(self, nums1: List[int], nums2: List[int]) -> List[int]:
        nums1.sort()
        result = set()
        
        for num in nums2:
            idx = bisect.bisect_left(nums1, num)
            if idx < len(nums1) and nums1[idx] == num:
                result.add(num)
        
        return list(result)
```

<!-- slide -->
```cpp
class Solution {
public:
    vector<int> intersection(vector<int>& nums1, vector<int>& nums2) {
        sort(nums1.begin(), nums1.end());
        
        vector<int> result;
        for (int num : nums2) {
            if (binary_search(nums1.begin(), nums1.end(), num)) {
                if (result.empty() || result.back() != num) {
                    result.push_back(num);
                }
            }
        }
        
        return result;
    }
};
```

<!-- slide -->
```java
class Solution {
    public int[] intersection(int[] nums1, int[] nums2) {
        Arrays.sort(nums1);
        
        Set<Integer> result = new HashSet<>();
        
        for (int num : nums2) {
            if (binarySearch(nums1, num)) {
                result.add(num);
            }
        }
        
        return result.stream().mapToInt(Integer::intValue).toArray();
    }
    
    private boolean binarySearch(int[] arr, int target) {
        int left = 0, right = arr.length - 1;
        while (left <= right) {
            int mid = left + (right - left) / 2;
            if (arr[mid] == target) return true;
            else if (arr[mid] < target) left = mid + 1;
            else right = mid - 1;
        }
        return false;
    }
}
```

<!-- slide -->
```javascript
var intersection = function(nums1, nums2) {
    nums1.sort((a, b) => a - b);
    
    const result = new Set();
    
    for (const num of nums2) {
        if (binarySearch(nums1, num)) {
            result.add(num);
        }
    }
    
    return Array.from(result);
};

function binarySearch(arr, target) {
    let left = 0, right = arr.length - 1;
    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        if (arr[mid] === target) return true;
        else if (arr[mid] < target) left = mid + 1;
        else right = mid - 1;
    }
    return false;
}
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n log n + m log n) - sort + m binary searches |
| **Space** | O(n) - sorted array storage |

---

## Comparison of Approaches

| Aspect | Set Intersection | Two Pointers | Binary Search |
|--------|------------------|---------------|---------------|
| **Time Complexity** | O(n + m) | O(n log n + m log m) | O(n log n + m log n) |
| **Space Complexity** | O(n + m) | O(1) | O(n) |
| **Implementation** | Simplest | Moderate | Complex |
| **Best For** | General case | Already sorted | Small nums2 |

**Best Approach:** Set intersection is optimal for most cases due to its simplicity and O(n + m) time complexity.

---

## Why Set Intersection is Optimal

1. **Simple Implementation**: Easy to understand and maintain
2. **Best Time Complexity**: O(n + m) is optimal for this problem
3. **Handles Duplicates**: Automatically deduplicates
4. **No Special Cases**: Works with any input distribution

---

## Related Problems

### Easy Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Intersection of Two Arrays II | [Link](https://leetcode.com/problems/intersection-of-two-arrays-ii/) | With duplicates |
| Unique Elements | [Link](https://leetcode.com/problems/unique-element-in-sorted-array/) | Single unique |

### Medium Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Intersection of Three Sorted Arrays | [Link](https://leetcode.com/problems/intersection-of-three-sorted-arrays/) | Three arrays |
| Find the Intersection of Two Arrays | [Link](https://leetcode.com/problems/find-the-intersection-of-two-arrays/) | With count limits |

---

## Video Tutorial Links

Here are helpful YouTube tutorials explaining the problem and solutions:

### Set-Based Approach

- [NeetCode - Intersection of Two Arrays](https://www.youtube.com/watch?v=4C8qK9wv6Pk) - Clear explanation
- [Set Operations](https://www.youtube.com/watch?v=rT5zCHk0MQk) - Understanding sets

### Alternative Approaches

- [Two Pointers Technique](https://www.youtube.com/watch?v=KL7y2ohV4j0) - Two pointers pattern
- [Binary Search Explained](https://www.youtube.com/watch?v=zeMrW37z80E) - Binary search

---

## Follow-up Questions

### Q1: What if arrays contain duplicates that should be counted multiple times?

**Answer:** Use multiset or hash map to count frequencies. See "Intersection of Two Arrays II".

---

### Q2: How would you handle very large arrays that don't fit in memory?

**Answer:** Use external sorting or process in chunks. Read files in batches and maintain running intersection.

---

### Q3: What's the difference between intersection and union?

**Answer:** Intersection is common elements; union is all unique elements from both arrays. Use set operations accordingly.

---

### Q4: How would you find the intersection of more than two arrays?

**Answer:** Start with the smallest set and iteratively intersect with other sets, or use a hash map to count occurrences across all arrays.

---

### Q5: What edge cases should be tested?

**Answer:**
- Empty arrays
- Arrays with no common elements
- Arrays with all common elements
- Arrays with duplicates
- Single-element arrays

---

## Common Pitfalls

### 1. Not Handling Duplicates
**Issue:** Result contains duplicates.

**Solution:** Use set to automatically deduplicate.

### 2. Wrong Iteration Order
**Issue:** Inefficient when one array is much larger.

**Solution:** Iterate through the smaller array for better cache performance.

### 3. Modifying Input
**Issue:** Sorting original arrays when not intended.

**Solution:** Make copies if needed, or use set approach that doesn't modify input.

### 4. Not Converting Set to List
**Issue:** Returning set instead of array.

**Solution:** Convert result set to appropriate return type.

### 5. Time Limit Exceeded
**Issue:** Using O(n²) approach.

**Solution:** Use set-based approach for O(n + m) time.

---

## Summary

The **Intersection of Two Arrays** problem demonstrates the **Set-Based Intersection** pattern:

- **Set Intersection**: O(n + m) time - optimal solution
- **Two Pointers**: O(n log n + m log m) time - alternative solution
- **Binary Search**: O(n log n + m log n) time - alternative solution

The key insight is using hash sets for O(1) membership testing, which provides the optimal time complexity for finding common elements.

This problem is an excellent demonstration of how set operations simplify common algorithmic problems.

### Pattern Summary

This problem exemplifies the **Set-Based Intersection** pattern, characterized by:
- Hash set for O(1) lookups
- Automatic deduplication
- Efficient membership testing
- Simple implementation

For more details on this pattern and its variations, see the **[Set Operations Pattern](/patterns/set-operations)**.

---

## Additional Resources

- [LeetCode Problem Discussion](https://leetcode.com/problems/intersection-of-two-arrays/discuss/) - Community solutions
- [Hash Set - GeeksforGeeks](https://www.geeksforgeeks.org/hash-set-in-java/) - Understanding sets
- [Set Theory Basics](https://en.wikipedia.org/wiki/Set_theory) - Mathematical set operations
