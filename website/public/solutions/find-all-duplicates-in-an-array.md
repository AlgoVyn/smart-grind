# Find All Duplicates In An Array

## Problem Description

Given an integer array nums of length n where all the integers of nums are in the range [1, n] and each integer appears at most twice, return an array of all the integers that appears twice.

You must write an algorithm that runs in O(n) time and uses only constant auxiliary space, excluding the space needed to store the output.

**Link to problem:** [Find All Duplicates in an Array - LeetCode 442](https://leetcode.com/problems/find-all-duplicates-in-an-array/)

---

## Examples

### Example

**Input:**
```
nums = [4,3,2,7,8,2,3,1]
```

**Output:**
```
[2,3]
```

**Explanation:** Both 2 and 3 appear twice in the array.

---

### Example 2

**Input:**
```
nums = [1,1,2]
```

**Output:**
```
[1]
```

---

### Example 3

**Input:**
```
nums = [1]
```

**Output:**
```
[]
```

---

## Constraints

- n == nums.length
- 1 <= n <= 10^5
- 1 <= nums[i] <= n
- Each element in nums appears once or twice.

---

## Pattern: Array Index as Hash Key (In-place Marking)

This problem is a classic example of the **Array Index as Hash Key** pattern. The key insight is to use the array values as indices to track element occurrences without extra space.

### Core Concept

Since all numbers are in range [1, n] (where n is array length), we can use the array itself as a hash table:
- Use `nums[i]` as an index by subtracting 1 (converting to 0-based index)
- Mark visited positions by negating or changing values
- Detect duplicates when we encounter already marked indices

---

## Intuition

The fundamental insight is that:
1. **Range Matching**: Values are in [1, n], indices are in [0, n-1]
2. **Index as Marker**: Each value can be mapped to an index by subtracting 1
3. **In-place Marking**: We can mark visited indices by negating the value at that index
4. **Duplicate Detection**: If we encounter a value whose index is already marked, it's a duplicate

### Visual Example

For `nums = [4,3,2,7,8,2,3,1]`:

```
Step 1: i=0, num=4, index=3
        nums[3] = 7 → not negative → mark it → nums[3] = -7
        nums = [4,3,2,-7,8,2,3,1]

Step 2: i=1, num=3, index=2
        nums[2] = 2 → not negative → mark it → nums[2] = -2
        nums = [4,3,-2,-7,8,2,3,1]

Step 3: i=2, num=-2 (abs=2), index=1
        nums[1] = 3 → not negative → mark it → nums[1] = -3
        nums = [4,-3,-2,-7,8,2,3,1]

Step 4: i=3, num=-7 (abs=7), index=6
        nums[6] = 3 → not negative → mark it → nums[6] = -3
        nums = [4,-3,-2,-7,8,2,-3,1]

Step 5: i=4, num=8, index=7
        nums[7] = 1 → not negative → mark it → nums[7] = -1
        nums = [4,-3,-2,-7,8,2,-3,-1]

Step 6: i=5, num=2, index=1
        nums[1] = -3 → negative! → duplicate found → add 2 to result
        nums = [4,-3,-2,-7,8,2,-3,-1]

Step 7: i=6, num=-3 (abs=3), index=2
        nums[2] = -2 → negative! → duplicate found → add 3 to result

Final result: [2, 3]
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

1. Iterate through each element in the array
2. For each element, get its absolute value and calculate the index (value - 1)
3. Check if the value at that index is negative:
   - If negative, we've seen this number before → it's a duplicate → add to result
   - If positive, negate it to mark as visited
4. Return the result list

### Why It Works

The algorithm works because:
- Each number maps to a unique index (since numbers are in [1, n])
- When we first see a number, we mark its corresponding position as visited (by negating)
- When we see the same number again, the position is already marked (negative), revealing the duplicate
- We use absolute value to handle already negated numbers

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def findDuplicates(self, nums: List[int]) -> List[int]:
        """
        Find all duplicate numbers in the array using in-place marking.
        
        Args:
            nums: List of integers where each appears once or twice
            
        Returns:
            List of duplicate numbers
        """
        result = []
        
        for num in nums:
            # Get absolute value to handle already negated numbers
            index = abs(num) - 1
            
            # Check if we've seen this number before
            if nums[index] < 0:
                # Already visited - this is a duplicate
                result.append(abs(num))
            else:
                # Mark as visited by negating
                nums[index] = -nums[index]
        
        return result
```

<!-- slide -->
```cpp
#include <vector>
#include <cstdlib>
using namespace std;

class Solution {
public:
    vector<int> findDuplicates(vector<int>& nums) {
        vector<int> result;
        
        for (int i = 0; i < nums.size(); i++) {
            // Get absolute value and calculate index
            int index = abs(nums[i]) - 1;
            
            // Check if we've seen this number before
            if (nums[index] < 0) {
                // Already visited - this is a duplicate
                result.push_back(abs(nums[i]));
            } else {
                // Mark as visited by negating
                nums[index] = -nums[index];
            }
        }
        
        return result;
    }
};
```

<!-- slide -->
import java.util.*;

class Solution {
    public List<Integer> findDuplicates(int[] nums) {
        List<Integer> result = new ArrayList<>();
        
        for (int i = 0; i < nums.length; i++) {
            // Get absolute value and calculate index
            int index = Math.abs(nums[i]) - 1;
            
            // Check if we've seen this number before
            if (nums[index] < 0) {
                // Already visited - this is a duplicate
                result.add(Math.abs(nums[i]));
            } else {
                // Mark as visited by negating
                nums[index] = -nums[index];
            }
        }
        
        return result;
    }
}

<!-- slide -->
```javascript
/**
 * @param {number[]} nums
 * @return {number[]}
 */
var findDuplicates = function(nums) {
    const result = [];
    
    for (let i = 0; i < nums.length; i++) {
        // Get absolute value and calculate index
        const index = Math.abs(nums[i]) - 1;
        
        // Check if we've seen this number before
        if (nums[index] < 0) {
            // Already visited - this is a duplicate
            result.push(Math.abs(nums[i]));
        } else {
            // Mark as visited by negating
            nums[index] = -nums[index];
        }
    }
    
    return result;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) - Each element is visited once |
| **Space** | O(1) - Only result list uses extra space |

---

## Approach 2: Cycle Sort

This approach places each number in its correct index position, similar to the classic cycle sort algorithm.

### Algorithm Steps

1. Iterate through the array starting from index 0
2. For each position i, check if nums[i] is at its correct position (nums[i] == i + 1)
3. If not, swap nums[i] with nums[nums[i] - 1] until the correct number is in place
4. After sorting, iterate through and collect indices where nums[i] != i + 1

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def findDuplicates_cycle(self, nums: List[int]) -> List[int]:
        """
        Find duplicates using cycle sort approach.
        """
        result = []
        
        # Cycle sort: place each number in its correct position
        i = 0
        while i < len(nums):
            correct_pos = nums[i] - 1
            if nums[i] != nums[correct_pos]:
                # Swap nums[i] with nums[correct_pos]
                nums[i], nums[correct_pos] = nums[correct_pos], nums[i]
            else:
                i += 1
        
        # Find duplicates: numbers not at correct position
        for i in range(len(nums)):
            if nums[i] != i + 1:
                result.append(nums[i])
        
        return result
```

<!-- slide -->
```cpp
#include <vector>
#include <algorithm>
using namespace std;

class Solution {
public:
    vector<int> findDuplicates(vector<int>& nums) {
        vector<int> result;
        int n = nums.size();
        
        // Cycle sort
        int i = 0;
        while (i < n) {
            int correctPos = nums[i] - 1;
            if (nums[i] != nums[correctPos]) {
                swap(nums[i], nums[correctPos]);
            } else {
                i++;
            }
        }
        
        // Find duplicates
        for (int i = 0; i < n; i++) {
            if (nums[i] != i + 1) {
                result.push_back(nums[i]);
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
    public List<Integer> findDuplicates(int[] nums) {
        List<Integer> result = new ArrayList<>();
        int n = nums.length;
        
        // Cycle sort
        int i = 0;
        while (i < n) {
            int correctPos = nums[i] - 1;
            if (nums[i] != nums[correctPos]) {
                // Swap
                int temp = nums[i];
                nums[i] = nums[correctPos];
                nums[correctPos] = temp;
            } else {
                i++;
            }
        }
        
        // Find duplicates
        for (i = 0; i < n; i++) {
            if (nums[i] != i + 1) {
                result.add(nums[i]);
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
var findDuplicates = function(nums) {
    const result = [];
    const n = nums.length;
    
    // Cycle sort
    let i = 0;
    while (i < n) {
        const correctPos = nums[i] - 1;
        if (nums[i] !== nums[correctPos]) {
            [nums[i], nums[correctPos]] = [nums[correctPos], nums[i]];
        } else {
            i++;
        }
    }
    
    // Find duplicates
    for (let i = 0; i < n; i++) {
        if (nums[i] !== i + 1) {
            result.push(nums[i]);
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

This is a simpler approach using a set to track seen elements.

### Algorithm Steps

1. Create an empty set to track seen numbers
2. Create a result list
3. Iterate through each number:
   - If in seen set → duplicate → add to result
   - Otherwise → add to seen set
4. Return the result

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def findDuplicates_set(self, nums: List[int]) -> List[int]:
        """
        Find duplicates using a set (extra space approach).
        """
        seen = set()
        result = []
        
        for num in nums:
            if num in seen:
                result.append(num)
            else:
                seen.add(num)
        
        return result
```

<!-- slide -->
```cpp
#include <vector>
#include <unordered_set>
using namespace std;

class Solution {
public:
    vector<int> findDuplicates(vector<int>& nums) {
        unordered_set<int> seen;
        vector<int> result;
        
        for (int num : nums) {
            if (seen.count(num)) {
                result.push_back(num);
            } else {
                seen.insert(num);
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
    public List<Integer> findDuplicates(int[] nums) {
        Set<Integer> seen = new HashSet<>();
        List<Integer> result = new ArrayList<>();
        
        for (int num : nums) {
            if (seen.contains(num)) {
                result.add(num);
            } else {
                seen.add(num);
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
var findDuplicates = function(nums) {
    const seen = new Set();
    const result = [];
    
    for (const num of nums) {
        if (seen.has(num)) {
            result.push(num);
        } else {
            seen.add(num);
        }
    }
    
    return result;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) - Single pass through array |
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

1. **Value-to-Index Mapping**: Since all values are in [1, n], each value maps to a unique index (value - 1)
2. **Marking by Negation**: By negating the value at the mapped index, we mark it as "visited"
3. **Duplicate Detection**: When we encounter the same value again, the mapped index is already negative
4. **Absolute Value**: Using abs() handles the case where the value might have been negated on a previous iteration

---

## Related Problems

Based on similar themes (array indexing, in-place marking, finding missing/duplicate):

### Same Pattern (Array Index as Hash Key)

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Find All Numbers Disappeared | [Link](https://leetcode.com/problems/find-all-numbers-disappeared-in-an-array/) | Find missing numbers |
| Find the Duplicate Number | [Link](https://leetcode.com/problems/find-the-duplicate-number/) | Find single duplicate |
| Missing Number | [Link](https://leetcode.com/problems/missing-number/) | Find missing number |

### Similar Concepts

| Problem | LeetCode Link | Related Technique |
|---------|---------------|-------------------|
| Set Mismatch | [Link](https://leetcode.com/problems/set-mismatch/) | Find duplicate and missing |
| First Missing Positive | [Link](https://leetcode.com/problems/first-missing-positive/) | In-place array marking |
| Find Duplicate Subtrees | [Link](https://leetcode.com/problems/find-duplicate-subtrees/) | Tree serialization |

### Pattern Reference

For more detailed explanations of the Array Index as Hash Key pattern, see:
- **[Array Index as Hash Key Pattern](/patterns/array-index-as-hash-key)**

---

## Video Tutorial Links

Here are helpful YouTube tutorials explaining the problem and solutions:

### In-place Marking Approach

- [NeetCode - Find All Duplicates in an Array](https://www.youtube.com/watch?v=8hQPLSSjkMY) - Clear explanation with visual examples
- [Find Duplicates - Back to Back SWE](https://www.youtube.com/watch?v=8Q1nQkVGYQ8) - Detailed walkthrough
- [LeetCode Official Solution](https://www.youtube.com/watch?v=0jN2cIoXK7Q) - Official problem solution
- [Cycle Sort Explained](https://www.youtube.com/watch?v=ys1WjLu0G1Q) - Understanding cycle sort

### Additional Resources

- [In-place Array Manipulation](https://www.youtube.com/watch?v=1AJ4ldc2E1Q) - Array manipulation techniques
- [Hash Table Alternatives](https://www.youtube.com/watch?v=6h7Glr1D9fI) - Space-efficient solutions

---

## Follow-up Questions

### Q1: What is the time and space complexity of the in-place marking approach?

**Answer:** Time complexity is O(n) since we traverse the array once. Space complexity is O(1) auxiliary space (excluding the output list), as we only use the array itself to mark visited elements.

---

### Q2: How would you modify the solution to handle elements appearing up to k times?

**Answer:** Use counting instead of binary marking. For each element, increment a counter at the mapped index. When the counter reaches k, you've found a k-times-occurring element. Alternatively, use modular arithmetic: mark with value + n, then check if value > n.

---

### Q3: What if you cannot modify the input array?

**Answer:** Use the Set approach with O(n) extra space, or use Floyd's Tortoise and Hare (cycle detection) algorithm which also works without modification but has O(n) time complexity.

---

### Q4: How does this relate to finding the single duplicate in "Find the Duplicate Number"?

**Answer:** The approach is identical! That problem uses the same in-place marking technique but only needs to return one duplicate (since there's exactly one). This problem needs to return all duplicates.

---

### Q5: How would you restore the original array after finding duplicates?

**Answer:** Iterate through the array and take the absolute value of each element to restore original values: `nums[i] = abs(nums[i])`. Alternatively, you can work on a copy of the array.

---

### Q6: Can you use this approach for elements appearing more than twice?

**Answer:** The basic approach works for any frequency. For elements appearing k times, you can use the same technique but need to track counts differently. One approach is to add n to the value instead of negating, so `nums[index] += n`. Then duplicates are detected when the value exceeds 2n.

---

### Q7: What edge cases should be tested?

**Answer:**
- Single element array: [1] → []
- All elements duplicate twice: [1,1,2,2] → [1,2]
- No duplicates: [1,2,3] → []
- Two duplicates: [4,3,2,7,8,2,3,1] → [2,3]
- Maximum n: large array within constraints

---

### Q8: How would you handle negative numbers in the array?

**Answer:** This problem guarantees positive numbers in [1, n]. If negative numbers were allowed, you'd need a different approach - perhaps using a hash set or adding an offset to make all numbers positive.

---

## Common Pitfalls

### 1. Not Using Absolute Value
**Issue**: Forgetting to use abs() when accessing array elements that may have been negated.

**Solution**: Always use `abs(nums[i])` or `abs(num)` to handle already marked (negated) values.

### 2. Modifying the Original Array
**Issue**: The in-place marking modifies the input array.

**Solution**: If the original array must be preserved, work on a copy or restore values after processing using `abs()`.

### 3. Index Out of Bounds
**Issue**: Not ensuring values are within [1, n] range before using as indices.

**Solution:** The problem guarantees values in [1, n], but always validate in production code.

### 4. Wrong Marking Logic
**Issue**: Checking if nums[index] > 0 instead of < 0 for detecting duplicates.

**Solution:** The check should be: if nums[index] < 0, it's already visited (duplicate).

### 5. Not Handling Single Element
**Issue:** Edge case where array has only one element.

**Solution:** The algorithm naturally handles this - single element has no duplicate.

### 6. Confusing with Find Duplicate Number
**Issue:** Using the same approach incorrectly for a different problem.

**Solution:** This problem needs all duplicates, while "Find the Duplicate Number" needs just one. The marking approach works for both but return values differ.

---

## Summary

The **Find All Duplicates in an Array** problem demonstrates the powerful **Array Index as Hash Key** pattern:

- **In-place Marking**: Optimal O(n) time, O(1) space solution
- **Cycle Sort**: Alternative O(n) time, O(1) space approach
- **Set Approach**: Simple O(n) time, O(n) space solution

The key insight is using the array values as indices to track element occurrences without extra space. This is a fundamental technique in array manipulation problems where values are bounded by the array length.

For more details on this pattern and its variations, see the **[Array Index as Hash Key Pattern](/patterns/array-index-as-hash-key)**.
