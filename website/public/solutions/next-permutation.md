# Next Permutation

## Problem Description

A permutation of an array of integers is an arrangement of its members into a sequence or linear order.

For example, for `arr = [1,2,3]`, the following are all the permutations of `arr`: `[1,2,3]`, `[1,3,2]`, `[2, 1, 3]`, `[2, 3, 1]`, `[3,1,2]`, `[3,2,1]`.

The next permutation of an array of integers is the next lexicographically greater permutation of its integer. More formally, if all the permutations of the array are sorted in one container according to their lexicographical order, then the next permutation of that array is the permutation that follows it in the sorted container. If such arrangement is not possible, the array must be rearranged as the lowest possible order (i.e., sorted in ascending order).

For example, the next permutation of `arr = [1,2,3]` is `[1,3,2]`.

Similarly, the next permutation of `arr = [2,3,1]` is `[3,1,2]`.

While the next permutation of `arr = [3,2,1]` is `[1,2,3]` because `[3,2,1]` does not have a lexicographical larger rearrangement.

Given an array of integers `nums`, find the next permutation of `nums`.

The replacement must be in place and use only constant extra memory.

---

## Examples

### Example

**Input:**
```python
nums = [1, 2, 3]
```

**Output:**
```python
[1, 3, 2]
```

### Example 2

**Input:**
```python
nums = [3, 2, 1]
```

**Output:**
```python
[1, 2, 3]
```

### Example 3

**Input:**
```python
nums = [1, 1, 5]
```

**Output:**
```python
[1, 5, 1]
```

---

## Constraints

- `1 <= nums.length <= 100`
- `0 <= nums[i] <= 100`

---

## LeetCode Link

[LeetCode Problem 31: Next Permutation](https://leetcode.com/problems/next-permutation/)

---

## Pattern: Array Manipulation - Lexicographical Order

This problem demonstrates the **Array Manipulation** pattern for generating the next lexicographical permutation. The key is understanding the algorithm for finding the next permutation.

### Core Concept

- **Find Pivot**: Find rightmost element smaller than next element
- **Find Swap Target**: Find smallest element larger than pivot from right
- **Reverse Tail**: Reverse the descending suffix to get smallest arrangement
- **In-Place**: O(1) extra space

---

## Intuition

The key insight is understanding the lexicographical ordering of permutations:

> The next permutation is the smallest arrangement that is strictly greater than the current arrangement.

### Key Observations

1. **Descending Suffix**: When the entire array is in descending order, it's the last permutation. The next is the first (sorted ascending).

2. **Pivot Point**: Find the rightmost element where `nums[i] < nums[i+1]`. This is where we need to make a change.

3. **Swap with Smallest Larger**: From the right side of pivot, find the smallest element larger than the pivot. This creates the minimal increase.

4. **Reverse Suffix**: After swapping, reverse the suffix (which is in descending order) to get the smallest arrangement.

### Why the Algorithm Works

The algorithm works because:
1. The suffix after the pivot is in descending order (largest possible permutation)
2. Swapping with the next larger element creates the smallest increase
3. Reversing the suffix puts it in ascending order (smallest arrangement)

This gives us the lexicographically next permutation.

---

## Multiple Approaches with Code

We'll cover two approaches:
1. **Standard Algorithm** - Optimal in-place solution
2. **Using Library Functions** - Simpler approach (for understanding)

---

## Approach 1: Standard Algorithm (Optimal)

### Algorithm Steps

1. Find the largest index `i` such that `nums[i] < nums[i+1]` (from right)
2. If no such index exists, reverse the entire array (last permutation)
3. Find the smallest index `j > i` such that `nums[j] > nums[i]`
4. Swap `nums[i]` and `nums[j]`
5. Reverse the subarray from `i+1` to the end

### Why It Works

This algorithm systematically finds the next lexicographical permutation:
- The pivot marks where we can make an improvement
- Finding the smallest larger element ensures minimal increase
- Reversing the suffix arranges it in the smallest order

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def nextPermutation(self, nums: List[int]) -> None:
        """
        Transform nums to the next permutation in-place.
        
        Algorithm:
        1. Find largest index i where nums[i] < nums[i+1]
        2. Find largest index j where nums[j] > nums[i]
        3. Swap nums[i] and nums[j]
        4. Reverse nums[i+1:]
        """
        n = len(nums)
        
        # Step 1: Find the pivot (largest index i where nums[i] < nums[i+1])
        i = n - 2
        while i >= 0 and nums[i] >= nums[i + 1]:
            i -= 1
        
        if i >= 0:
            # Step 2: Find the smallest element larger than nums[i]
            j = n - 1
            while nums[j] <= nums[i]:
                j -= 1
            
            # Step 3: Swap pivot with this element
            nums[i], nums[j] = nums[j], nums[i]
        
        # Step 4: Reverse the suffix
        nums[i + 1:] = reversed(nums[i + 1:])
```

<!-- slide -->
```cpp
#include <vector>
#include <algorithm>
using namespace std;

class Solution {
public:
    void nextPermutation(vector<int>& nums) {
        int n = nums.size();
        
        // Step 1: Find the pivot
        int i = n - 2;
        while (i >= 0 && nums[i] >= nums[i + 1]) {
            i--;
        }
        
        if (i >= 0) {
            // Step 2: Find the element to swap
            int j = n - 1;
            while (nums[j] <= nums[i]) {
                j--;
            }
            
            // Step 3: Swap
            swap(nums[i], nums[j]);
        }
        
        // Step 4: Reverse the suffix
        reverse(nums.begin() + i + 1, nums.end());
    }
};
```

<!-- slide -->
```java
import java.util.*;

class Solution {
    public void nextPermutation(int[] nums) {
        int n = nums.length;
        
        // Step 1: Find the pivot
        int i = n - 2;
        while (i >= 0 && nums[i] >= nums[i + 1]) {
            i--;
        }
        
        if (i >= 0) {
            // Step 2: Find the element to swap
            int j = n - 1;
            while (nums[j] <= nums[i]) {
                j--;
            }
            
            // Step 3: Swap
            int temp = nums[i];
            nums[i] = nums[j];
            nums[j] = temp;
        }
        
        // Step 4: Reverse the suffix
        int left = i + 1;
        int right = n - 1;
        while (left < right) {
            int temp = nums[left];
            nums[left] = nums[right];
            nums[right] = temp;
            left++;
            right--;
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
var nextPermutation = function(nums) {
    const n = nums.length;
    
    // Step 1: Find the pivot
    let i = n - 2;
    while (i >= 0 && nums[i] >= nums[i + 1]) {
        i--;
    }
    
    if (i >= 0) {
        // Step 2: Find the element to swap
        let j = n - 1;
        while (nums[j] <= nums[i]) {
            j--;
        }
        
        // Step 3: Swap
        [nums[i], nums[j]] = [nums[j], nums[i]];
    }
    
    // Step 4: Reverse the suffix
    let left = i + 1;
    let right = n - 1;
    while (left < right) {
        [nums[left], nums[right]] = [nums[right], nums[left]];
        left++;
        right--;
    }
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) - Linear scans and reversal |
| **Space** | O(1) - In-place modification |

---

## Approach 2: Using Sorting (Simpler but Less Optimal)

### Algorithm Steps

1. Find the pivot as before
2. If pivot exists, sort the remaining elements in ascending order
3. This is conceptually simpler but less efficient

### Why It Works

Sorting after finding the pivot ensures we get the smallest arrangement of the remaining elements, which is equivalent to reversing.

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def nextPermutation(self, nums: List[int]) -> None:
        n = len(nums)
        
        # Find pivot
        i = n - 2
        while i >= 0 and nums[i] >= nums[i + 1]:
            i -= 1
        
        if i >= 0:
            # Find element to swap and sort remaining
            j = n - 1
            while nums[j] <= nums[i]:
                j -= 1
            nums[i], nums[j] = nums[j], nums[i]
        
        # Sort remaining (ascending is same as reversing for this case)
        nums[i + 1:] = sorted(nums[i + 1:])
```

<!-- slide -->
```cpp
#include <vector>
#include <algorithm>
using namespace std;

class Solution {
public:
    void nextPermutation(vector<int>& nums) {
        int n = nums.size();
        int i = n - 2;
        while (i >= 0 && nums[i] >= nums[i + 1]) i--;
        
        if (i >= 0) {
            int j = n - 1;
            while (nums[j] <= nums[i]) j--;
            swap(nums[i], nums[j]);
        }
        
        sort(nums.begin() + i + 1, nums.end());
    }
};
```

<!-- slide -->
```java
import java.util.*;

class Solution {
    public void nextPermutation(int[] nums) {
        int n = nums.length;
        int i = n - 2;
        while (i >= 0 && nums[i] >= nums[i + 1]) i--;
        
        if (i >= 0) {
            int j = n - 1;
            while (nums[j] <= nums[i]) j--;
            int temp = nums[i];
            nums[i] = nums[j];
            nums[j] = temp;
        }
        
        Arrays.sort(nums, i + 1, n);
    }
}
```

<!-- slide -->
```javascript
var nextPermutation = function(nums) {
    const n = nums.length;
    let i = n - 2;
    while (i >= 0 && nums[i] >= nums[i + 1]) i--;
    
    if (i >= 0) {
        let j = n - 1;
        while (nums[j] <= nums[i]) j--;
        [nums[i], nums[j]] = [nums[j], nums[i]];
    }
    
    // Sort remaining elements
    const remaining = nums.splice(i + 1).sort((a, b) => a - b);
    nums.push(...remaining);
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n log n) - Due to sorting |
| **Space** | O(1) - In-place (ignoring sort's space) |

---

## Comparison of Approaches

| Aspect | Standard Algorithm | Using Sort |
|--------|-------------------|------------|
| **Time Complexity** | O(n) | O(n log n) |
| **Space Complexity** | O(1) | O(1) |
| **Implementation** | Moderate | Simple |

**Best Approach:** Use the standard algorithm (Approach 1) for optimal O(n) time complexity.

---

## Why This Problem is Important

### Interview Relevance

- **Frequency**: Commonly asked in technical interviews
- **Companies**: Microsoft, Amazon, Apple, Google
- **Difficulty**: Medium
- **Concepts Tested**: Array Manipulation, In-Place Operations, Permutations

### Learning Outcomes

1. **In-Place Manipulation**: Master modifying arrays without extra space
2. **Algorithm Design**: Understand the structure of permutations
3. **Edge Cases**: Handle various boundary conditions

---

## Related Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Permutations | [Link](https://leetcode.com/problems/permutations/) | Generate all permutations |
| Permutations II | [Link](https://leetcode.com/problems/permutations-ii/) | Generate unique permutations |
| Palindrome Permutation II | [Link](https://leetcode.com/problems/palindrome-permutation-ii/) | Generate palindrome permutations |

### Pattern Reference

For more detailed explanations of the Array Manipulation pattern, see:
- **[Array Manipulation Pattern](/patterns)**

---

## Video Tutorial Links

Here are helpful YouTube tutorials explaining the problem and solutions:

1. **[NeetCode - Next Permutation](https://www.youtube.com/watch?v=qu2bFgX6zMw)** - Clear explanation with visual examples
2. **[Next Permutation - LeetCode 31](https://www.youtube.com/watch?v=qu2bFgX6zMw)** - Detailed walkthrough
3. **[Permutation Algorithm Explained](https://www.youtube.com/watch?v=nC1jX8VmzN0)** - Understanding permutations

---

## Follow-up Questions

### Q1: How would you find the previous permutation?

**Answer:** You would reverse the algorithm - find the first decreasing pair from the right, swap with the largest smaller element, then reverse the suffix.

---

### Q2: What if you needed to find the kth permutation directly?

**Answer:** You can use factorial number system. The position of each digit can be calculated using factorials, allowing O(n) time to find any permutation.

---

### Q3: Can you generate all permutations iteratively without recursion?

**Answer:** Yes, you can use the next permutation algorithm repeatedly to generate all permutations starting from the sorted order.

---

### Q4: How does the algorithm handle duplicate elements?

**Answer:** The algorithm works the same way with duplicates. The key is that `nums[i] >= nums[i+1]` (with >=) ensures we find the correct pivot even with duplicates.

---

## Common Pitfalls

### 1. Wrong Pivot Finding Condition
**Issue**: Using `nums[i] <= nums[i+1]` instead of `nums[i] >= nums[i+1]`

**Solution**: Find where nums[i] < nums[i+1] (strictly decreasing to increasing)

### 2. Not Handling Last Permutation
**Issue**: Not reversing when no pivot found

**Solution**: If i < 0, reverse entire array (already smallest permutation)

### 3. Finding Wrong Swap Target
**Issue**: Starting j from wrong position or wrong condition

**Solution**: Start from end, find first element > nums[i]

### 4. Forgetting to Reverse the Tail
**Issue**: Swapping but not reversing the remaining elements

**Solution**: Always reverse the suffix after swapping

---

## Summary

The **Next Permutation** problem demonstrates the **Array Manipulation** pattern for generating the next lexicographical permutation.

### Key Takeaways

1. **Find Pivot**: Find rightmost element smaller than next element
2. **Find Swap Target**: Find smallest element larger than pivot from right
3. **Reverse Tail**: Reverse the descending suffix to get smallest arrangement
4. **In-Place**: O(1) extra space solution

### Pattern Summary

This problem exemplifies the **Array Manipulation** pattern, characterized by:
- Rearranging elements in-place
- Understanding mathematical properties (permutations)
- Single pass through data with O(1) space

For more details on this pattern, see the **[Array Manipulation](/patterns/array-manipulation)**.

---

## Additional Resources

- [LeetCode Problem 31](https://leetcode.com/problems/next-permutation/) - Official problem page
- [Permutation - Wikipedia](https://en.wikipedia.org/wiki/Permutation) - Mathematical background
- [Pattern: Array Manipulation](/patterns/array-manipulation) - Comprehensive pattern guide
