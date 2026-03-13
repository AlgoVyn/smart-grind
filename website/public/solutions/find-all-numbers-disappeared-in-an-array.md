# Find All Numbers Disappeared In An Array

## Problem Description

Given an array nums of n integers where nums[i] is in the range [1, n], return an array of all the integers in the range [1, n] that do not appear in nums.

**Link to problem:** [Find All Numbers Disappeared in an Array - LeetCode 448](https://leetcode.com/problems/find-all-numbers-disappeared-in-an-array/)

---

## Examples

### Example

**Input:**
```
nums = [4,3,2,7,8,2,3,1]
```

**Output:**
```
[5,6]
```

**Explanation:** Numbers 5 and 6 are missing from the array.

---

### Example 2

**Input:**
```
nums = [1,1]
```

**Output:**
```
[2]
```

**Explanation:** Number 2 is missing from the array.

---

## Constraints

- n == nums.length
- 1 <= n <= 10^5
- 1 <= nums[i] <= n

---

## Follow-up

Could you do it without extra space and in O(n) runtime? You may assume the returned list does not count as extra space.

---

## Pattern: Array Index as Hash Key (In-place Marking)

This problem is a classic example of the **Array Index as Hash Key** pattern. The key insight is similar to "Find All Duplicates" but focused on finding missing numbers instead of duplicates.

### Core Concept

Since all numbers are in range [1, n] (where n is array length), we can:
- Use each number to mark its corresponding index as "visited" by negating the value
- After marking, indices with positive values indicate missing numbers (i + 1)

---

## Intuition

The fundamental insight is:

1. **Range Matching**: Values are in [1, n], indices are in [0, n-1]
2. **Mark Visited**: For each value v, mark index v-1 as visited (by negating)
3. **Find Missing**: After processing, indices with positive values represent missing numbers

### Visual Example

For `nums = [4,3,2,7,8,2,3,1]`:

```
Initial: nums = [4,3,2,7,8,2,3,1]

Step 1: i=0, num=4 → index=3
        nums[3] = 7 → negate → nums[3] = -7
        nums = [4,3,2,-7,8,2,3,1]

Step 2: i=1, num=3 → index=2
        nums[2] = 2 → negate → nums[2] = -2
        nums = [4,3,-2,-7,8,2,3,1]

Step 3: i=2, num=-2 → index=1
        nums[1] = 3 → negate → nums[1] = -3
        nums = [4,-3,-2,-7,8,2,3,1]

Step 4: i=3, num=-7 → index=6
        nums[6] = 3 → negate → nums[6] = -3
        nums = [4,-3,-2,-7,8,2,-3,1]

Step 5: i=4, num=8 → index=7
        nums[7] = 1 → negate → nums[7] = -1
        nums = [4,-3,-2,-7,8,2,-3,-1]

Step 6: i=5, num=2 → index=1
        nums[1] = -3 → already negative, don't change
        nums = [4,-3,-2,-7,8,2,-3,-1]

Step 7: i=6, num=-3 → index=2
        nums[2] = -2 → already negative, don't change

Step 8: i=7, num=-1 → index=0
        nums[0] = 4 → negate → nums[0] = -4
        nums = [-4,-3,-2,-7,8,2,-3,-1]

Now find indices with positive values:
- nums[4] = 8 (positive) → 5 is missing
- nums[5] = 2 (positive) → 6 is missing

Result: [5, 6]
```

---

## Multiple Approaches with Code

We'll cover three approaches:

1. **In-place Marking (Optimal)** - O(n) time, O(1) space
2. **Cycle Sort** - O(n) time, O(1) space
3. **Extra Space with Set** - O(n) time, O(n) space

---

## Approach 1: In-place Marking (Optimal)

This is the most space-efficient solution using the array itself to mark visited elements.

### Algorithm Steps

1. First pass: For each element, negate the value at index (abs(num) - 1) if positive
2. Second pass: For each index i, if nums[i] is positive, i + 1 is missing → add to result
3. Return the result list

### Why It Works

The algorithm works because:
- Each number maps to a unique index (since numbers are in [1, n])
- When we see a number v, we negate nums[v-1] to mark v as present
- After processing, indices that weren't visited (still positive) correspond to missing numbers

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def findDisappearedNumbers(self, nums: List[int]) -> List[int]:
        """
        Find all missing numbers using in-place marking.
        
        Args:
            nums: List of integers in range [1, n]
            
        Returns:
            List of missing numbers in the range [1, n]
        """
        result = []
        
        # First pass: mark visited elements by negating
        for num in nums:
            index = abs(num) - 1
            if nums[index] > 0:
                nums[index] = -nums[index]
        
        # Second pass: find indices with positive values (missing numbers)
        for i in range(len(nums)):
            if nums[i] > 0:
                result.append(i + 1)
        
        return result
```

<!-- slide -->
```cpp
#include <vector>
#include <cstdlib>
using namespace std;

class Solution {
public:
    vector<int> findDisappearedNumbers(vector<int>& nums) {
        vector<int> result;
        
        // First pass: mark visited elements by negating
        for (int i = 0; i < nums.size(); i++) {
            int index = abs(nums[i]) - 1;
            if (nums[index] > 0) {
                nums[index] = -nums[index];
            }
        }
        
        // Second pass: find indices with positive values (missing numbers)
        for (int i = 0; i < nums.size(); i++) {
            if (nums[i] > 0) {
                result.push_back(i + 1);
            }
        }
        
        return result;
    }
};
```

<!-- slide -->
```java
import java.util.*;

class Solution {
    public List<Integer> findDisappearedNumbers(int[] nums) {
        List<Integer> result = new ArrayList<>();
        
        // First pass: mark visited elements by negating
        for (int i = 0; i < nums.length; i++) {
            int index = Math.abs(nums[i]) - 1;
            if (nums[index] > 0) {
                nums[index] = -nums[index];
            }
        }
        
        // Second pass: find indices with positive values (missing numbers)
        for (int i = 0; i < nums.length; i++) {
            if (nums[i] > 0) {
                result.add(i + 1);
            }
        }
        
        return result;
    }
}
```

<!-- slide -->
```javascript
/**
 * @param {number[]} nums
 * @return {number[]}
 */
var findDisappearedNumbers = function(nums) {
    const result = [];
    
    // First pass: mark visited elements by negating
    for (let i = 0; i < nums.length; i++) {
        const index = Math.abs(nums[i]) - 1;
        if (nums[index] > 0) {
            nums[index] = -nums[index];
        }
    }
    
    // Second pass: find indices with positive values (missing numbers)
    for (let i = 0; i < nums.length; i++) {
        if (nums[i] > 0) {
            result.push(i + 1);
        }
    }
    
    return result;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) - Two passes through the array |
| **Space** | O(1) - Only result list uses extra space |

---

## Approach 2: Cycle Sort

This approach places each number in its correct index position, then finds indices with incorrect values.

### Algorithm Steps

1. Use cycle sort to place each number at its correct position (nums[i] should be i + 1)
2. After sorting, iterate through and collect indices where nums[i] != i + 1
3. Return the result

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def findDisappearedNumbers_cycle(self, nums: List[int]) -> List[int]:
        """
        Find missing numbers using cycle sort.
        """
        result = []
        n = len(nums)
        
        # Cycle sort: place each number in its correct position
        i = 0
        while i < n:
            correct_pos = nums[i] - 1
            if nums[i] != nums[correct_pos] and correct_pos < n:
                # Swap nums[i] with nums[correct_pos]
                nums[i], nums[correct_pos] = nums[correct_pos], nums[i]
            else:
                i += 1
        
        # Find indices where value is incorrect (missing numbers)
        for i in range(n):
            if nums[i] != i + 1:
                result.append(i + 1)
        
        return result
```

<!-- slide -->
```cpp
#include <vector>
#include <algorithm>
using namespace std;

class Solution {
public:
    vector<int> findDisappearedNumbers(vector<int>& nums) {
        vector<int> result;
        int n = nums.size();
        
        // Cycle sort
        int i = 0;
        while (i < n) {
            int correctPos = nums[i] - 1;
            if (nums[i] != nums[correctPos] && correctPos < n) {
                swap(nums[i], nums[correctPos]);
            } else {
                i++;
            }
        }
        
        // Find missing numbers
        for (int i = 0; i < n; i++) {
            if (nums[i] != i + 1) {
                result.push_back(i + 1);
            }
        }
        
        return result;
    }
};
```

<!-- slide -->
```java
import java.util.*;

class Solution {
    public List<Integer> findDisappearedNumbers(int[] nums) {
        List<Integer> result = new ArrayList<>();
        int n = nums.length;
        
        // Cycle sort
        int i = 0;
        while (i < n) {
            int correctPos = nums[i] - 1;
            if (nums[i] != nums[correctPos] && correctPos < n) {
                // Swap
                int temp = nums[i];
                nums[i] = nums[correctPos];
                nums[correctPos] = temp;
            } else {
                i++;
            }
        }
        
        // Find missing numbers
        for (i = 0; i < n; i++) {
            if (nums[i] != i + 1) {
                result.add(i + 1);
            }
        }
        
        return result;
    }
}
```

<!-- slide -->
```javascript
/**
 * @param {number[]} nums
 * @return {number[]}
 */
var findDisappearedNumbers = function(nums) {
    const result = [];
    const n = nums.length;
    
    // Cycle sort
    let i = 0;
    while (i < n) {
        const correctPos = nums[i] - 1;
        if (nums[i] !== nums[correctPos] && correctPos < n) {
            [nums[i], nums[correctPos]] = [nums[correctPos], nums[i]];
        } else {
            i++;
        }
    }
    
    // Find missing numbers
    for (let i = 0; i < n; i++) {
        if (nums[i] !== i + 1) {
            result.push(i + 1);
        }
    }
    
    return result;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) - Each element is moved at most once |
| **Space** | O(1) - In-place modification |

---

## Approach 3: Using Extra Space (Set)

This is a simpler approach using a set to track all numbers, then finding missing ones.

### Algorithm Steps

1. Create a set of all numbers in the array
2. Iterate from 1 to n
3. Numbers not in the set are missing → add to result
4. Return the result

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def findDisappearedNumbers_set(self, nums: List[int]) -> List[int]:
        """
        Find missing numbers using a set (extra space approach).
        """
        num_set = set(nums)
        result = []
        
        for i in range(1, len(nums) + 1):
            if i not in num_set:
                result.append(i)
        
        return result
```

<!-- slide -->
```cpp
#include <vector>
#include <unordered_set>
using namespace std;

class Solution {
public:
    vector<int> findDisappearedNumbers(vector<int>& nums) {
        unordered_set<int> numSet(nums.begin(), nums.end());
        vector<int> result;
        
        for (int i = 1; i <= nums.size(); i++) {
            if (numSet.find(i) == numSet.end()) {
                result.push_back(i);
            }
        }
        
        return result;
    }
};
```

<!-- slide -->
```java
import java.util.*;

class Solution {
    public List<Integer> findDisappearedNumbers(int[] nums) {
        Set<Integer> numSet = new HashSet<>();
        for (int num : nums) {
            numSet.add(num);
        }
        
        List<Integer> result = new ArrayList<>();
        for (int i = 1; i <= nums.length; i++) {
            if (!numSet.contains(i)) {
                result.add(i);
            }
        }
        
        return result;
    }
}
```

<!-- slide -->
```javascript
/**
 * @param {number[]} nums
 * @return {number[]}
 */
var findDisappearedNumbers = function(nums) {
    const numSet = new Set(nums);
    const result = [];
    
    for (let i = 1; i <= nums.length; i++) {
        if (!numSet.has(i)) {
            result.push(i);
        }
    }
    
    return result;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) - Set creation and iteration |
| **Space** | O(n) - Set stores up to n elements |

---

## Comparison of Approaches

| Aspect | In-place Marking | Cycle Sort | Set Approach |
|--------|-----------------|------------|---------------|
| **Time Complexity** | O(n) | O(n) | O(n) |
| **Space Complexity** | O(1) | O(1) | O(n) |
| **Modifies Input** | Yes | Yes | No |
| **Implementation** | Simple | Moderate | Simple |
| **LeetCode Optimal** | ✅ Yes | ❌ No | ❌ No |

**Best Approach:** In-place Marking is optimal with O(n) time and O(1) space, and is the most commonly used solution.

---

## Why In-place Marking Works

The algorithm works because of these key observations:

1. **Value-to-Index Mapping**: Since all values are in [1, n], each value v maps to index v-1
2. **Marking Presence**: When we see value v, we negate nums[v-1] to indicate v is present
3. **Missing Detection**: After processing, indices that weren't negated (still positive) correspond to missing numbers
4. **Two-Pass Design**: First pass marks, second pass collects missing values

---

## Relationship with Find Duplicates

This problem is closely related to "Find All Duplicates in an Array" (LeetCode 442):

| Aspect | Find Duplicates | Find Missing |
|--------|-----------------|--------------|
| Goal | Find numbers appearing twice | Find numbers not appearing |
| Detection | Index already negative | Index stays positive |
| Result | Values with negative index | Indices with positive value |

Both use the same core technique of using array indices as markers!

---

## Related Problems

Based on similar themes (array indexing, in-place marking, finding missing/duplicate):

### Same Pattern (Array Index as Hash Key)

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Find All Duplicates | [Link](https://leetcode.com/problems/find-all-duplicates-in-an-array/) | Find duplicate numbers |
| Find the Duplicate Number | [Link](https://leetcode.com/problems/find-the-duplicate-number/) | Find single duplicate |
| Missing Number | [Link](https://leetcode.com/problems/missing-number/) | Find single missing number |

### Similar Concepts

| Problem | LeetCode Link | Related Technique |
|---------|---------------|-------------------|
| Set Mismatch | [Link](https://leetcode.com/problems/set-mismatch/) | Find duplicate and missing |
| First Missing Positive | [Link](https://leetcode.com/problems/first-missing-positive/) | In-place array marking |
| Find Lucky Integer | [Link](https://leetcode.com/problems/find-lucky-integer-in-an-array/) | Frequency counting |

### Pattern Reference

For more detailed explanations of the Array Index as Hash Key pattern, see:
- **[Array Index as Hash Key Pattern](/patterns/array-index-as-hash-key)**

---

## Video Tutorial Links

Here are helpful YouTube tutorials explaining the problem and solutions:

### In-place Marking Approach

- [NeetCode - Find All Numbers Disappeared](https://www.youtube.com/watch?v=8hQPLSSjkMY) - Clear explanation with visual examples
- [Find Missing Numbers - Back to Back SWE](https://www.youtube.com/watch?v=8Q1nQkVGYQ8) - Detailed walkthrough
- [LeetCode Official Solution](https://www.youtube.com/watch?v=0jN2cIoXK7Q) - Official problem solution
- [Cycle Sort for Missing Numbers](https://www.youtube.com/watch?v=ys1WjLu0G1Q) - Cycle sort approach

### Additional Resources

- [In-place Array Manipulation](https://www.youtube.com/watch?v=1AJ4ldc2E1Q) - Array manipulation techniques
- [Array Indexing Tricks](https://www.youtube.com/watch?v=6h7Glr1D9fI) - Advanced indexing

---

## Follow-up Questions

### Q1: What is the time and space complexity of the in-place marking approach?

**Answer:** Time complexity is O(n) since we traverse the array twice. Space complexity is O(1) auxiliary space (excluding the output list), as we only use the array itself to mark visited elements.

---

### Q2: How would you modify the solution to handle numbers appearing multiple times?

**Answer:** The current solution already handles multiple occurrences - duplicates just mark the same index multiple times. The algorithm works correctly regardless of frequency. For tracking frequency counts, you'd need a different approach.

---

### Q3: What if you cannot modify the input array?

**Answer:** Use the Set approach with O(n) extra space, or copy the array first then modify the copy. Alternatively, use Floyd's Tortoise and Hare algorithm which also works without modification.

---

### Q4: How does this relate to "Find All Duplicates in an Array"?

**Answer:** These are complementary problems! Find Duplicates finds indices that were visited (negative values), while Find Missing finds indices that weren't visited (positive values). The core technique is identical.

---

### Q5: How would you restore the original array after finding missing numbers?

**Answer:** Iterate through the array and take the absolute value of each element: `nums[i] = abs(nums[i])`. This restores all values to their original positive form.

---

### Q6: Can you use this approach for a different range like [0, n-1]?

**Answer:** Yes! Simply adjust the mapping: index = nums[i] instead of nums[i] - 1. The output would then be indices with positive values (since index 0 would correspond to value 0).

---

### Q7: What edge cases should be tested?

**Answer:**
- All numbers present: [1,2,3] → []
- One number missing: [1,3] → [2]
- All numbers missing except duplicates: [1,1,1] → [2,3]
- Maximum n: large array within constraints
- Single element present: [1] → []
- Single element missing: [] → [1]

---

### Q8: How would you handle negative numbers in the input?

**Answer:** This problem guarantees positive numbers in [1, n]. If negative numbers were allowed, you'd need a different approach - perhaps using a hash set or adding an offset to make all numbers positive for indexing.

---

## Common Pitfalls

### 1. Double Negation Not Handled
**Issue:** Trying to negate an already negative value unnecessarily.

**Solution:** Always check `if nums[index] > 0` before negating. If already negative, it's already been marked.

### 2. Wrong Index Calculation
**Issue:** Using `num` instead of `abs(num)` for index calculation.

**Solution:** Use `abs(num) - 1` to handle values that may have been negated in previous iterations.

### 3. Modifying Input Array
**Issue:** The in-place marking modifies the original array.

**Solution:** If the original array must be preserved, work on a copy or restore values after processing using `abs()`.

### 4. Confusing Positive and Negative Logic
**Issue:** Forgetting that positive values indicate missing numbers, not negative.

**Solution:** Remember: after marking, positive indices = missing numbers, negative indices = present numbers.

### 5. Not Handling Range [0, n-1]
**Issue:** Assuming the range is always [1, n].

**Solution:** For range [0, n-1], use `index = num` instead of `num - 1`.

### 6. Single Pass Instead of Two Passes
**Issue:** Trying to do everything in one pass.

**Solution:** This algorithm requires two passes - one to mark, one to collect missing numbers.

---

## Summary

The **Find All Numbers Disappeared in an Array** problem demonstrates the powerful **Array Index as Hash Key** pattern:

- **In-place Marking**: Optimal O(n) time, O(1) space solution
- **Cycle Sort**: Alternative O(n) time, O(1) space approach
- **Set Approach**: Simple O(n) time, O(n) space solution

The key insight is using the array values as indices to track element presence without extra space. This is a fundamental technique in array manipulation problems where values are bounded by the array length.

This problem is closely related to "Find All Duplicates" - both use the same core marking technique but look for different results (unvisited vs. re-visited indices).

For more details on this pattern and its variations, see the **[Array Index as Hash Key Pattern](/patterns/array-index-as-hash-key)**.
