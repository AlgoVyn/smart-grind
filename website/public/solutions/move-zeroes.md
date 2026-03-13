# Move Zeroes

## Problem Description

Given an integer array `nums`, move all `0`'s to the end of it while maintaining the relative order of the non-zero elements.

**Note:** You must do this in-place without making a copy of the array.

**LeetCode Link:** [LeetCode 283 - Move Zeroes](https://leetcode.com/problems/move-zeroes/)

---

## Examples

### Example

**Input:**
```python
nums = [0, 1, 0, 3, 12]
```

**Output:**
```python
[1, 3, 12, 0, 0]
```

### Example 2

**Input:**
```python
nums = [0]
```

**Output:**
```python
[0]
```

---

## Constraints

- `1 <= nums.length <= 10^4`
- `-2^31 <= nums[i] <= 2^31 - 1`

**Follow-up:** Could you minimize the total number of operations done?

---

## Pattern: Two Pointers - Partition

This problem demonstrates the **Two Pointers** pattern for in-place array partitioning. The key is using a pointer to track the position for the next non-zero element.

### Core Concept

- **Two Pointers**: One for tracking next non-zero position, one for iteration
- **In-Place**: Swap non-zero elements to their correct positions
- **Order Preservation**: Non-zero elements maintain relative order
- **Single Pass**: O(n) time complexity

### Why It Works

The algorithm works because:
1. last_non_zero tracks where next non-zero should go
2. When non-zero found, swap with position at last_non_zero
3. Increment last_non_zero after each placement
4. All zeros naturally fall to the end

---

## Intuition

The key insight is to use a two-pointer approach where:

1. One pointer (`last_non_zero`) tracks where the next non-zero element should be placed
2. Another pointer iterates through the array
3. When a non-zero element is found, we swap it to its correct position
4. After processing all elements, all zeros are naturally pushed to the end

This approach ensures:
- **In-place operation**: No extra array needed
- **Order preservation**: Non-zero elements maintain their relative order
- **Single pass**: O(n) time complexity

---

## Multiple Approaches with Code

We'll cover two approaches:

1. **Two Pointers (Optimal)** - O(n) time, O(1) space
2. **Count and Fill** - O(n) time, O(1) space

---

## Approach 1: Two Pointers (Optimal)

### Why It Works

We maintain a pointer `last_non_zero` that points to the position where the next non-zero element should be placed. As we iterate through the array, whenever we find a non-zero element, we swap it with the element at `last_non_zero` and increment the pointer.

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def moveZeroes(self, nums: List[int]) -> None:
        """
        Moves all zeros to the end of the array in-place.
        
        Uses a two-pointer approach where last_non_zero points to
        the position where the next non-zero element should be placed.
        """
        last_non_zero = 0
        
        for i in range(len(nums)):
            if nums[i] != 0:
                # Swap current non-zero element to its correct position
                nums[last_non_zero], nums[i] = nums[i], nums[last_non_zero]
                last_non_zero += 1
```

<!-- slide -->
```cpp
#include <vector>
using namespace std;

class Solution {
public:
    void moveZeroes(vector<int>& nums) {
        int lastNonZero = 0;
        
        for (int i = 0; i < nums.size(); i++) {
            if (nums[i] != 0) {
                swap(nums[lastNonZero], nums[i]);
                lastNonZero++;
            }
        }
    }
};
```

<!-- slide -->
```java
class Solution {
    public void moveZeroes(int[] nums) {
        int lastNonZero = 0;
        
        for (int i = 0; i < nums.length; i++) {
            if (nums[i] != 0) {
                int temp = nums[lastNonZero];
                nums[lastNonZero] = nums[i];
                nums[i] = temp;
                lastNonZero++;
            }
        }
    }
}
```

<!-- slide -->
```javascript
/**
 * @param {number[]} nums
 * @return {void} Do not return anything, modify nums in-place instead.
 */
var moveZeroes = function(nums) {
    let lastNonZero = 0;
    
    for (let i = 0; i < nums.length; i++) {
        if (nums[i] !== 0) {
            [nums[lastNonZero], nums[i]] = [nums[i], nums[lastNonZero]];
            lastNonZero++;
        }
    }
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) - Single pass through the array |
| **Space** | O(1) - Only pointer variables used |

---

## Approach 2: Count and Fill

### Why It Works

This approach counts the number of non-zero elements first, then fills the array with non-zero elements in order, and fills the remaining positions with zeros.

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def moveZeroes_count(self, nums: List[int]) -> None:
        """
        Move zeroes using count and fill approach.
        """
        # Count non-zero elements
        count = 0
        for num in nums:
            if num != 0:
                count += 1
        
        # Fill with non-zero elements
        index = 0
        for num in nums:
            if num != 0:
                nums[index] = num
                index += 1
        
        # Fill remaining with zeros
        while index < len(nums):
            nums[index] = 0
            index += 1
```

<!-- slide -->
```cpp
class Solution {
public:
    void moveZeroes(vector<int>& nums) {
        int count = 0;
        for (int num : nums) {
            if (num != 0) count++;
        }
        
        int index = 0;
        for (int num : nums) {
            if (num != 0) {
                nums[index++] = num;
            }
        }
        
        while (index < nums.size()) {
            nums[index++] = 0;
        }
    }
};
```

<!-- slide -->
```java
class Solution {
    public void moveZeroes(int[] nums) {
        int count = 0;
        for (int num : nums) {
            if (num != 0) count++;
        }
        
        int index = 0;
        for (int num : nums) {
            if (num != 0) {
                nums[index++] = num;
            }
        }
        
        while (index < nums.length) {
            nums[index++] = 0;
        }
    }
}
```

<!-- slide -->
```javascript
var moveZeroes = function(nums) {
    let count = 0;
    for (const num of nums) {
        if (num !== 0) count++;
    }
    
    let index = 0;
    for (const num of nums) {
        if (num !== 0) {
            nums[index++] = num;
        }
    }
    
    while (index < nums.length) {
        nums[index++] = 0;
    }
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) - Two passes through the array |
| **Space** | O(1) - Only counter variables |

---

## Comparison of Approaches

| Aspect | Two Pointers | Count and Fill |
|--------|--------------|----------------|
| **Time Complexity** | O(n) | O(n) |
| **Space Complexity** | O(1) | O(1) |
| **Implementation** | Single pass | Two passes |
| **LeetCode Optimal** | ✅ Yes | ✅ Yes |
| **Order Preservation** | ✅ Yes | ✅ Yes |

**Best Approach:** Two Pointers is more commonly used in interviews.

---

## Related Problems

### Related Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Remove Element | [Link](https://leetcode.com/problems/remove-element/) | Remove elements in-place |
| Remove Duplicates from Sorted Array | [Link](https://leetcode.com/problems/remove-duplicates-from-sorted-array/) | Remove duplicates |
| Sort Colors | [Link](https://leetcode.com/problems/sort-colors/) | Dutch national flag |
| Partition Array | [Link](https://www.lintcode.com/problem/partition-array/) | Partition based on condition |

### Pattern Reference

For more detailed explanations of the Two Pointers pattern, see:
- **[Two Pointers Pattern](/patterns/two-pointers)**

---

## Video Tutorial Links

### Recommended Tutorials

1. **[NeetCode - Move Zeroes](https://www.youtube.com/watch?v=1PAt1qK8k6w)** - Clear explanation with visual examples
2. **[Move Zeroes - LeetCode 283](https://www.youtube.com/watch?v=aqelpsb32-4)** - Detailed walkthrough
3. **[Two Pointers Technique](https://www.youtube.com/watch?v=onj-pFWTq2w)** - Understanding two pointers

---

## Follow-up Questions

### Q1: What's the difference between this approach and just collecting non-zero elements?

**Answer:** Collecting non-zero elements in a separate array and then filling would work but uses O(n) extra space. The two-pointer approach achieves the same result in-place.

---

### Q2: Can we optimize to avoid swapping when not needed?

**Answer:** Yes! We can check if `i != last_non_zero` before swapping. If they're equal, the element is already in its correct position, so we only increment the pointer without swapping.

---

### Q3: What happens with an array of all zeros?

**Answer:** The algorithm handles this correctly - `last_non_zero` stays at 0, and we never perform any swaps. The array remains all zeros.

---

### Q4: How would you modify to move all zeros to the beginning instead?

**Answer:** You would iterate from the end of the array and place zeros first, or simply reverse the final array after applying the current algorithm.

---

## Summary

The **Move Zeroes** problem demonstrates the **Two Pointers** pattern for in-place array partitioning. The key is using a pointer to track the position for the next non-zero element.

### Key Takeaways

1. **Two Pointers**: One for tracking next non-zero position, one for iteration
2. **In-Place**: Swap non-zero elements to their correct positions
3. **Order Preservation**: Non-zero elements maintain relative order
4. **Single Pass**: O(n) time complexity with O(1) space

### Pattern Summary

This problem exemplifies the **Two Pointers** pattern, characterized by:
- Using pointers to partition data in-place
- Making single pass through the data
- Preserving relative order of elements

For more details on this pattern, see the **[Two Pointers](/patterns/two-pointers)**.

---

## Common Pitfalls

### 1. Unnecessary Swaps
**Issue:** Swapping even when element is already in correct position.

**Solution:** The algorithm still works with swaps, but checking if i != last_non_zero can optimize.

### 2. Not Incrementing Pointer Correctly
**Issue:** Forgetting to increment last_non_zero after swap.

**Solution:** Always increment last_non_zero after placing a non-zero element.

### 3. Using Separate Pass for Zeros
**Issue:** Using two passes (first remove zeros, then append zeros).

**Solution:** Single pass algorithm is more efficient.

### 4. Not Handling All Zeros Case
**Issue:** Array with all zeros might not be handled correctly.

**Solution:** Algorithm handles it - last_non_zero stays at 0.
