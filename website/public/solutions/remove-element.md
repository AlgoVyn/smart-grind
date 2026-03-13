# Remove Element

## Problem Description

Given an integer array `nums` and an integer `val`, remove all occurrences of `val` in-place. The relative order of the elements may be changed.

Return the number of elements in `nums` which are not equal to `val`.

Consider that the order of elements can be changed. It doesn't matter what values are set beyond the returned length.

**Link to problem:** [Remove Element - LeetCode 27](https://leetcode.com/problems/remove-element/)

## Constraints
- `0 <= nums.length <= 100`
- `0 <= nums[i] <= 50`
- `0 <= val <= 100`

---

## Pattern: Two Pointers (In-Place Removal)

This problem demonstrates the **Two Pointers** pattern for in-place array modification.

### Core Concept

- **Slow Pointer**: Tracks position for next valid element
- **Fast Pointer**: Iterates through all elements
- **In-Place**: Modify array without extra space

---

## Examples

### Example

**Input:** nums = [3,2,2,3], val = 3

**Output:** 2, nums = [2,2,_,_]

**Explanation:** After removing 3, remaining elements are [2, 2].

### Example 2

**Input:** nums = [0,1,2,2,3,0,4,2], val = 2

**Output:** 5, nums = [0,1,3,0,4,_,_,_]

---

## Intuition

The key insight is to use two pointers to build the result in-place:

1. **Fast pointer**: Scans all elements
2. **Slow pointer**: Points to where the next valid element should go
3. **When to copy**: Only when current element != val

---

## Multiple Approaches with Code

We'll cover three approaches:

1. **Two Pointers (Optimal)** - O(n) time, O(1) space
2. **Swap and Pop** - O(n) time, O(1) space, changes order
3. **Built-in Methods** - Using language features

---

## Approach 1: Two Pointers (Optimal)

This is the standard and most efficient approach.

### Algorithm Steps

1. Initialize slow = 0
2. Iterate through array with fast pointer
3. If nums[fast] != val, copy to nums[slow] and increment slow
4. Return slow

### Why It Works

The slow pointer always points to where the next valid element should be placed. We skip all elements equal to val.

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def removeElement(self, nums: List[int], val: int) -> int:
        """
        Remove all occurrences of val in-place.
        
        Args:
            nums: Input array
            val: Value to remove
            
        Returns:
            Number of elements not equal to val
        """
        slow = 0
        for fast in range(len(nums)):
            if nums[fast] != val:
                nums[slow] = nums[fast]
                slow += 1
        return slow
```

<!-- slide -->
```cpp
class Solution {
public:
    int removeElement(vector<int>& nums, int val) {
        int slow = 0;
        for (int fast = 0; fast < nums.size(); fast++) {
            if (nums[fast] != val) {
                nums[slow++] = nums[fast];
            }
        }
        return slow;
    }
};
```

<!-- slide -->
```java
class Solution {
    public int removeElement(int[] nums, int val) {
        int slow = 0;
        for (int fast = 0; fast < nums.length; fast++) {
            if (nums[fast] != val) {
                nums[slow++] = nums[fast];
            }
        }
        return slow;
    }
}
```

<!-- slide -->
```javascript
/**
 * @param {number[]} nums
 * @param {number} val
 * @return {number}
 */
var removeElement = function(nums, val) {
    let slow = 0;
    for (let fast = 0; fast < nums.length; fast++) {
        if (nums[fast] !== val) {
            nums[slow++] = nums[fast];
        }
    }
    return slow;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) - single pass |
| **Space** | O(1) - in-place |

---

## Approach 2: Swap and Pop

This approach swaps elements with the end and pops, useful when order doesn't matter.

### Algorithm Steps

1. Initialize index = 0
2. While index < length:
   - If nums[index] == val, swap with last element and pop
   - Else, increment index
3. Return new length

### Why It Works

We can discard elements from the end without affecting the result. Swapping is O(1).

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def removeElement_swap(self, nums: List[int], val: int) -> int:
        """
        Remove elements using swap and pop - doesn't preserve order.
        """
        index = 0
        n = len(nums)
        
        while index < n:
            if nums[index] == val:
                # Swap with last element
                nums[index] = nums[n - 1]
                n -= 1
            else:
                index += 1
        
        return n
```

<!-- slide -->
```cpp
class Solution {
public:
    int removeElementSwap(vector<int>& nums, int val) {
        int index = 0;
        int n = nums.size();
        
        while (index < n) {
            if (nums[index] == val) {
                nums[index] = nums[n - 1];
                n--;
            } else {
                index++;
            }
        }
        
        return n;
    }
};
```

<!-- slide -->
```java
class Solution {
    public int removeElementSwap(int[] nums, int val) {
        int index = 0;
        int n = nums.length;
        
        while (index < n) {
            if (nums[index] == val) {
                nums[index] = nums[n - 1];
                n--;
            } else {
                index++;
            }
        }
        
        return n;
    }
}
```

<!-- slide -->
```javascript
var removeElement = function(nums, val) {
    let index = 0;
    let n = nums.length;
    
    while (index < n) {
        if (nums[index] === val) {
            nums[index] = nums[n - 1];
            n--;
        } else {
            index++;
        }
    }
    
    return n;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) - in worst case |
| **Space** | O(1) - in-place |

---

## Approach 3: Using List Comprehension (Python-specific)

A concise Python approach.

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def removeElement_compact(self, nums: List[int], val: int) -> int:
        """
        Using list comprehension - modifies nums in-place for display.
        """
        i = 0
        for x in nums:
            if x != val:
                nums[i] = x
                i += 1
        return i
```

<!-- slide -->
```cpp
// C++ - Using std::remove (returns iterator to new end)
class Solution {
public:
    int removeElement(vector<int>& nums, int val) {
        nums.erase(remove(nums.begin(), nums.end(), val), nums.end());
        return nums.size();
    }
};
```

<!-- slide -->
```java
// Java - Using Stream (not truly in-place)
class Solution {
    public int removeElementStream(int[] nums, int val) {
        int count = 0;
        for (int num : nums) {
            if (num != val) {
                nums[count++] = num;
            }
        }
        return count;
    }
}
```

<!-- slide -->
```javascript
// JavaScript - Using filter (creates new array)
var removeElement = function(nums, val) {
    let count = 0;
    for (let i = 0; i < nums.length; i++) {
        if (nums[i] !== val) {
            nums[count++] = nums[i];
        }
    }
    return count;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) |
| **Space** | O(1) |

---

## Comparison of Approaches

| Aspect | Two Pointers | Swap and Pop | Built-in |
|--------|--------------|--------------|----------|
| **Time Complexity** | O(n) | O(n) | O(n) |
| **Space Complexity** | O(1) | O(1) | O(1) |
| **Order Preserved** | ✅ Yes | ❌ No | ✅ Yes |
| **Best For** | General case | Order doesn't matter | Quick solution |

**Best Approach:** Two pointers is the standard optimal solution.

---

## Why Two Pointers Works

The two-pointer approach is optimal because:

1. **Single Pass**: Each element is visited at most once
2. **In-Place**: No extra memory needed
3. **Order Preserved**: Maintains relative order of remaining elements
4. **Simple Logic**: Easy to understand and implement

---

## Related Problems

### Similar Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Remove Duplicates from Sorted Array | [Link](https://leetcode.com/problems/remove-duplicates-from-sorted-array/) | Similar two pointers |
| Move Zeroes | [Link](https://leetcode.com/problems/move-zeroes/) | In-place modification |
| Delete Node in a Linked List | [Link](https://leetcode.com/problems/delete-node-in-a-linked-list/) | In-place deletion |
| Remove All Adjacent Duplicates in String | [Link](https://leetcode.com/problems/remove-all-adjacent-duplicates-in-string/) | Stack-based removal |

### Pattern Reference

For more detailed explanations of the Two Pointers pattern, see:
- **[Two Pointers Pattern](/patterns/two-pointers)**

---

## Video Tutorial Links

Here are helpful YouTube tutorials explaining the problem and solutions:

### Two Pointers Technique

- [NeetCode - Remove Element](https://www.youtube.com/watch?v=7C_f7fD2p14) - Clear explanation
- [Two Pointers Pattern](https://www.youtube.com/watch?v=8Q1nQkVGYQ8) - Pattern explanation
- [In-Place Array Operations](https://www.youtube.com/watch?v=0lGNeO7xW7k) - Understanding in-place

### Related Concepts

- [Array Manipulation](https://www.youtube.com/watch?v=8jP8CCrj8cI) - Array techniques
- [Space Complexity](https://www.youtube.com/watch?v=vOS1QSXKq2Y) - Understanding O(1) space

---

## Follow-up Questions

### Q1: How would you modify to keep first k occurrences only?

**Answer:** Track count of occurrences. Only keep if count < k.

---

### Q2: What if the array is sorted?

**Answer:** For sorted arrays, you can use binary search to find the range of elements to remove, then use system arraycopy for faster movement.

---

### Q3: How does this compare to removeIf in Java?

**Answer:** Java's removeIf internally uses similar two-pointer approach but with more overhead due to iterator handling.

---

### Q4: Can you solve it without fast/slow pointers?

**Answer:** Yes, using swap-and-pop method. However, order is not preserved.

---

### Q5: What edge cases should be tested?

**Answer:**
- Empty array
- Array with all elements equal to val
- Array with no elements equal to val
- Single element array
- val not in array

---

### Q6: Why return slow pointer instead of length?

**Answer:** The slow pointer already tracks the count of valid elements after processing.

---

## Common Pitfalls

### 1. Off-by-One
**Issue**: Returning wrong count

**Solution**: slow pointer naturally counts valid elements

### 2. Order Preservation
**Issue**: Not maintaining original order

**Solution**: Two pointers preserve order; swap-and-pop doesn't

### 3. Array Modification
**Issue**: Not modifying array in-place

**Solution**: Copy elements to slow position, don't create new array

---

## Summary

The **Remove Element** problem demonstrates **Two Pointers**:
- Slow pointer tracks next valid position
- Fast pointer scans all elements
- O(n) time, O(1) space

This is a fundamental in-place array manipulation problem.

### Pattern Summary

This problem exemplifies the **Two Pointers** pattern, which is characterized by:
- Using multiple pointers for different purposes
- Building result in-place
- Single pass through data

For more details on this pattern, see the **[Two Pointers Pattern](/patterns/two-pointers)**.

---

## Additional Resources

- [LeetCode Problem Discussion](https://leetcode.com/problems/remove-element/discuss/) - Community solutions
- [Two Pointers - GeeksforGeeks](https://www.geeksforgeeks.org/two-pointer-technique/) - Detailed explanation
- [Array Operations](https://www.geeksforgeeks.org/array-data-structure/) - Understanding arrays
- [Pattern: Two Pointers](/patterns/two-pointers) - Comprehensive pattern guide
