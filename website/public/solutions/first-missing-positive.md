# First Missing Positive

## Problem Description

Given an unsorted integer array `nums`, find the smallest missing positive integer.

The algorithm should run in **O(n)** time complexity and use **O(1)** auxiliary space complexity.

**LeetCode Link:** [First Missing Positive - LeetCode](https://leetcode.com/problems/first-missing-positive/)

---

## Pattern: Array Index as Hash Key - In-place Marking

This problem demonstrates algorithmic problem-solving patterns.

## Intuition

The key insight for this problem is that we can use the array indices themselves as a hash table to track which positive integers are present, without using any extra space.

### Key Observations

1. **Range of Answer**: The smallest missing positive must be in the range [1, n+1] where n is the array length. This is because:
   - If all numbers 1 to n are present, the answer is n+1
   - Any number ≤ 0 or > n cannot be the answer

2. **Index as Marker**: Since the answer must be in [1, n], we can use index i to store whether number (i+1) is present.

3. **In-Place Swapping**: By swapping elements to their correct positions (value v goes to index v-1), we can place each number where it belongs.

### Why This Works

The key is recognizing that we only need to track numbers in the range [1, n]. By placing each valid number at its corresponding index, we can then scan the array to find the first position where the value doesn't match (i+1). This gives us the smallest missing positive.

### Algorithm Overview

1. **Swapping Phase**: For each element, if it's in range [1, n] and not already in correct position, swap it to its correct position.
2. **Finding Phase**: Scan array to find first index where nums[i] != i+1
3. **Edge Case**: If all positions are correct, return n+1

---

## Constraints

- `1 <= nums.length <= 10^5`
- `-2^31 <= nums[i] <= 2^31 - 1`

---

## Examples

### Example 1

**Input:**
```python
nums = [1, 2, 0]
```

**Output:**
```python
3
```

**Explanation:** The smallest missing positive is 3.

---

### Example 2

**Input:**
```python
nums = [3, 4, -1, 1]
```

**Output:**
```python
2
```

**Explanation:** 1 is present, but 2 is missing.

---

### Example 3

**Input:**
```python
nums = [7, 8, 9, 11, 12]
```

**Output:**
```python
1
```

**Explanation:** 1 is not present in the array.

---

## Follow up

Can you solve the problem in O(n) time and O(1) space without using extra space for the output?

---

## Solution Overview

The key insight is that we can use the array indices as a hash map to mark which positive integers are present. Since we only care about positive numbers in the range [1, n], we can place each number at its corresponding index by swapping elements.

---

## Approach 1: In-Place Marking with Swapping

This approach uses the array itself to store information about which numbers are present by placing each number in its correct position.

### Implementation

````carousel
```python
from typing import List

class Solution:
    def firstMissingPositive(self, nums: List[int]) -> int:
        n = len(nums)
        i = 0
        while i < n:
            correct_index = nums[i] - 1
            # Only swap if the number is within valid range [1, n]
            # and not already in the correct position
            if 1 <= nums[i] <= n and nums[i] != nums[correct_index]:
                nums[i], nums[correct_index] = nums[correct_index], nums[i]
            else:
                i += 1
        
        # Find the first index where the value doesn't match
        for i in range(n):
            if nums[i] != i + 1:
                return i + 1
        
        return n + 1
```
<!-- slide -->
```cpp
#include <vector>
using namespace std;

class Solution {
public:
    int firstMissingPositive(vector<int>& nums) {
        int n = nums.size();
        int i = 0;
        while (i < n) {
            int correctIndex = nums[i] - 1;
            if (nums[i] >= 1 && nums[i] <= n && nums[i] != nums[correctIndex]) {
                swap(nums[i], nums[correctIndex]);
            } else {
                i++;
            }
        }
        
        for (int i = 0; i < n; i++) {
            if (nums[i] != i + 1) {
                return i + 1;
            }
        }
        return n + 1;
    }
};
```
<!-- slide -->
```java
class Solution {
    public int firstMissingPositive(int[] nums) {
        int n = nums.length;
        int i = 0;
        while (i < n) {
            int correctIndex = nums[i] - 1;
            if (nums[i] >= 1 && nums[i] <= n && nums[i] != nums[correctIndex]) {
                int temp = nums[i];
                nums[i] = nums[correctIndex];
                nums[correctIndex] = temp;
            } else {
                i++;
            }
        }
        
        for (i = 0; i < n; i++) {
            if (nums[i] != i + 1) {
                return i + 1;
            }
        }
        return n + 1;
    }
}
```
<!-- slide -->
```javascript
/**
 * @param {number[]} nums
 * @return {number}
 */
var firstMissingPositive = function(nums) {
    const n = nums.length;
    let i = 0;
    while (i < n) {
        const correctIndex = nums[i] - 1;
        if (nums[i] >= 1 && nums[i] <= n && nums[i] !== nums[correctIndex]) {
            [nums[i], nums[correctIndex]] = [nums[correctIndex], nums[i]];
        } else {
            i++;
        }
    }
    
    for (i = 0; i < n; i++) {
        if (nums[i] !== i + 1) {
            return i + 1;
        }
    }
    return n + 1;
};
```
````

### Explanation

1. **Placement Phase**: Iterate through the array and place each valid positive integer (between 1 and n) at its correct index by swapping. A number `x` belongs at index `x-1`.

2. **Detection Phase**: After placement, the first index `i` where `nums[i] != i+1` indicates that `i+1` is the missing positive.

3. **Edge Case**: If all positions are correct, the missing positive is `n+1`.

### Time Complexity

- **O(n)**: Each element is swapped at most once, and we traverse the array a constant number of times.

### Space Complexity

- **O(1)**: Only uses constant extra space for indices.

---

## Approach 2: Negative Marking

This approach marks the presence of numbers by negating values at indices. However, it requires careful handling of duplicates.

### Implementation

````carousel
```python
from typing import List

class Solution:
    def firstMissingPositive(self, nums: List[int]) -> int:
        n = len(nums)
        
        # First pass: mark out-of-range and non-positive values
        for i in range(n):
            if nums[i] <= 0 or nums[i] > n:
                nums[i] = n + 1
        
        # Second pass: mark presence using negative values
        for i in range(n):
            val = abs(nums[i])
            if 1 <= val <= n:
                nums[val - 1] = -abs(nums[val - 1])
        
        # Find first positive (non-negative) value
        for i in range(n):
            if nums[i] > 0:
                return i + 1
        
        return n + 1
```
<!-- slide -->
```cpp
#include <vector>
#include <cstdlib>
using namespace std;

class Solution {
public:
    int firstMissingPositive(vector<int>& nums) {
        int n = nums.size();
        
        // Mark out-of-range values
        for (int i = 0; i < n; i++) {
            if (nums[i] <= 0 || nums[i] > n) {
                nums[i] = n + 1;
            }
        }
        
        // Mark presence
        for (int i = 0; i < n; i++) {
            int val = abs(nums[i]);
            if (val >= 1 && val <= n && nums[val - 1] > 0) {
                nums[val - 1] = -nums[val - 1];
            }
        }
        
        // Find first positive
        for (int i = 0; i < n; i++) {
            if (nums[i] > 0) {
                return i + 1;
            }
        }
        
        return n + 1;
    }
};
```
<!-- slide -->
```java
class Solution {
    public int firstMissingPositive(int[] nums) {
        int n = nums.length;
        
        // Mark out-of-range values
        for (int i = 0; i < n; i++) {
            if (nums[i] <= 0 || nums[i] > n) {
                nums[i] = n + 1;
            }
        }
        
        // Mark presence
        for (int i = 0; i < n; i++) {
            int val = Math.abs(nums[i]);
            if (val >= 1 && val <= n && nums[val - 1] > 0) {
                nums[val - 1] = -nums[val - 1];
            }
        }
        
        // Find first positive
        for (int i = 0; i < n; i++) {
            if (nums[i] > 0) {
                return i + 1;
            }
        }
        
        return n + 1;
    }
}
```
<!-- slide -->
```javascript
/**
 * @param {number[]} nums
 * @return {number}
 */
var firstMissingPositive = function(nums) {
    const n = nums.length;
    
    // Mark out-of-range values
    for (let i = 0; i < n; i++) {
        if (nums[i] <= 0 || nums[i] > n) {
            nums[i] = n + 1;
        }
    }
    
    // Mark presence
    for (let i = 0; i < n; i++) {
        const val = Math.abs(nums[i]);
        if (val >= 1 && val <= n && nums[val - 1] > 0) {
            nums[val - 1] = -Math.abs(nums[val - 1]);
        }
    }
    
    // Find first positive
    for (let i = 0; i < n; i++) {
        if (nums[i] > 0) {
            return i + 1;
        }
    }
    
    return n + 1;
};
```
````

### Explanation

1. **Mark Invalid Values**: First, replace all non-positive and out-of-range (>n) values with n+1.

2. **Mark Presence**: For each number in range [1, n], mark its presence by negating the value at index (number-1).

3. **Find Missing**: The first index with a positive value indicates the missing number.

### Time Complexity

- **O(n)**: Three linear passes through the array.

### Space Complexity

- **O(1)**: Modifies the array in-place.

---

## Approach 3: Using Hash Set (Extra Space)

For understanding purposes, we can also solve this using a hash set, though it uses O(n) extra space.

### Implementation

````carousel
```python
from typing import List

class Solution:
    def firstMissingPositive(self, nums: List[int]) -> int:
        num_set = set(nums)
        missing = 1
        while missing in num_set:
            missing += 1
        return missing
```
<!-- slide -->
```cpp
#include <unordered_set>
#include <vector>
using namespace std;

class Solution {
public:
    int firstMissingPositive(vector<int>& nums) {
        unordered_set<int> numSet(nums.begin(), nums.end());
        int missing = 1;
        while (numSet.count(missing)) {
            missing++;
        }
        return missing;
    }
};
```
<!-- slide -->
```java
import java.util.HashSet;

class Solution {
    public int firstMissingPositive(int[] nums) {
        HashSet<Integer> numSet = new HashSet<>();
        for (int num : nums) {
            numSet.add(num);
        }
        int missing = 1;
        while (numSet.contains(missing)) {
            missing++;
        }
        return missing;
    }
}
```
<!-- slide -->
```javascript
/**
 * @param {number[]} nums
 * @return {number}
 */
var firstMissingPositive = function(nums) {
    const numSet = new Set(nums);
    let missing = 1;
    while (numSet.has(missing)) {
        missing++;
    }
    return missing;
};
```
````

### Time Complexity

- **O(n)**: Building the set is O(n), and checking for missing is O(n) worst case.

### Space Complexity

- **O(n)**: Extra space for the hash set.

---

## Comparison of Approaches

| Approach | Time Complexity | Space Complexity | Notes |
|----------|-----------------|------------------|-------|
| In-Place Swapping | O(n) | O(1) | Most optimal, in-place |
| Negative Marking | O(n) | O(1) | In-place, careful with duplicates |
| Hash Set | O(n) | O(n) | Simple but uses extra space |

---

## Related Problems

- [Find All Numbers Disappeared in an Array](/solutions/find-all-numbers-disappeared-in-an-array.md)
- [Find All Duplicates in an Array](/solutions/find-all-duplicates-in-an-array.md)
- [Missing Number](/solutions/missing-number.md)
- [Find the Duplicate Number](/solutions/find-the-duplicate-number.md)

---

## Video Tutorials

- [NeetCode - First Missing Positive](https://www.youtube.com/watch?v=8g78sHdnnaA)
- [LeetCode Official Solution](https://www.youtube.com/watch?v=2B2g9pSsJ8M)
- [First Missing Positive - Detailed Explanation](https://www.youtube.com/watch?v=IHwKaKXfKaQ)

---

## Follow-up Questions

### Q1: Why do we only care about numbers in the range [1, n]?

**Answer:** The smallest missing positive must be in the range [1, n+1]. If all numbers from 1 to n are present, the answer is n+1. Numbers outside this range cannot be the answer because there are only n positions and at least one number from 1 to n+1 must be missing.

### Q2: Why does the swapping approach terminate?

**Answer:** Each swap places at least one element in its correct position. Since there are n positions and each position can be fixed at most once, the total number of swaps is bounded by n. Combined with the linear scans, this ensures O(n) time complexity.

### Q3: How do we handle duplicates in the negative marking approach?

**Answer:** We use `abs()` to get the original value and check if the target position is already negative before marking. This prevents multiple negative markings from causing issues with duplicates.

### Q4: Can we solve this without modifying the original array?

**Answer:** Yes, using a hash set (O(n) space) or by using extra boolean array (O(n) space). The optimal O(1) space solution requires in-place modification.

### Q5: What happens if the array contains only negative numbers?

**Answer:** The answer will always be 1, since 1 is the smallest positive integer and won't be present in an array of only negative numbers.

---

## Key Takeaways

1. **Index as Hash Key**: Use array indices to store information about presence/absence.
2. **In-Place Modification**: Solve with O(1) extra space by modifying the input.
3. **Range Optimization**: Focus only on the relevant range [1, n].
4. **Cycle Detection**: The swapping approach is similar to cycle detection in linked lists.

---

## Common Pitfalls

### 1. Not Handling Negative Numbers
**Issue**: Returning a large positive number instead of negative.

**Solution**: After constructing the result, check if the sign bit is set and convert to negative using two's complement rules.

### 2. Loop Order in State Machine
**Issue**: Updating twos after ones loses information.

**Solution**: Always update twos first, then ones. The order matters because twos depends on the previous state of ones.

### 3. Integer Overflow in Bit Shifting
**Issue**: Shifting 1 << 31 in Java/C++ causes overflow.

**Solution**: Use 1L in Java or cast to long before shifting. For 32-bit, shift by i where i < 32.

### 4. Wrong Modulo Operation
**Issue**: Using count / 3 instead of count % 3.

**Solution**: Use modulo (remainder) to get the single element's bit, not division.

---

## Summary

The **First Missing Positive** problem demonstrates the power of in-place array manipulation:

- **Index as Hash Key**: Use array indices to store information about presence/absence
- **In-Place Modification**: Solve with O(1) extra space by modifying the input
- **Range Optimization**: Focus only on the relevant range [1, n]
- **Cycle Detection**: The swapping approach is similar to cycle detection in linked lists

Key insights:
1. The smallest missing positive must be in range [1, n+1]
2. Use array indices as markers to track which numbers are present
3. The in-place swapping approach achieves O(n) time with O(1) space
4. Negative marking is an alternative approach that also works in-place

This problem is essential for understanding space optimization and index-based hashing.

### Pattern Summary

This problem exemplifies the **In-Place Array Marking** pattern, characterized by:
- Using array indices as hash keys
- Modifying input in-place to achieve O(1) space
- Focusing only on the relevant value range
- Cycle detection in arrays

For more details on similar patterns, see the **[In-Place Modification](/patterns/in-place-modification)** pattern.
