# Find The Duplicate Number

## Problem Description

Given an array of integers `nums` containing `n + 1` integers where each integer is in the range `[1, n]` inclusive.

There is only one repeated number in `nums`, return this repeated number.

You must solve the problem without modifying the array `nums` and using only constant extra space.

**Link to problem:** [Find The Duplicate Number - LeetCode 287](https://leetcode.com/problems/find-the-duplicate-number/)

## Constraints
- `1 <= n <= 10^5`
- `nums.length == n + 1`
- `1 <= nums[i] <= n`
- All the integers in `nums` appear only once except for precisely one integer which appears two or more times

---

## Pattern: Cycle Detection (Floyd's Tortoise and Hare)

This problem is a classic example of the **Cycle Detection** pattern using Floyd's Tortoise and Hare algorithm. The key insight is treating the array as a linked list where each value points to the next index.

### Core Concept

The fundamental idea is treating the array as a **linked list**:
- Index `i` points to index `nums[i]`
- Since values are in range `[1, n]` and array length is `n+1`, there must be a duplicate
- The duplicate creates a "cycle" because multiple indices point to the same location
- Finding the cycle start gives us the duplicate number

---

## Examples

### Example

**Input:**
```
nums = [1,3,4,2,2]
```

**Output:**
```
2
```

**Explanation:** The array has length 5 (n+1 where n=4). The duplicate number 2 appears twice. Using cycle detection, we find the cycle starts at index 2, which contains the value 2.

### Example 2

**Input:**
```
nums = [3,1,3,4,2]
```

**Output:**
```
3
```

**Explanation:** The duplicate number 3 appears twice. The cycle in the "linked list" representation starts at the position containing 3.

### Example 3

**Input:**
```
nums = [3,3,3,3,3]
```

**Output:**
```
3
```

**Explanation:** The number 3 is the only value that can appear (range [1,4]), and it appears 5 times.

---

## Intuition

The key insight comes from viewing the array as a directed graph:

1. **Array as Linked List**: Consider each index `i` as a node, and `nums[i]` as the pointer to the next node
2. **Cycle Formation**: Since there's a duplicate, multiple nodes point to the same location, creating a cycle
3. **Floyd's Algorithm**: Use two pointers - slow (moves 1 step) and fast (moves 2 steps) - they will meet inside the cycle
4. **Find Cycle Start**: Reset one pointer to start, move both one step at a time - they meet at the cycle start (the duplicate)

### Why This Works

- In a valid array with n+1 elements and values in [1,n], there must be at least one duplicate (Pigeonhole Principle)
- The duplicate creates multiple incoming "pointers" to the same index
- This forms a cycle in the "linked list" representation
- The entry point of the cycle is the duplicate number

---

## Multiple Approaches with Code

We'll cover three approaches:

1. **Floyd's Tortoise and Hare (Cycle Detection)** - Optimal O(n) time, O(1) space
2. **Binary Search** - O(n log n) time, O(1) space
3. **Set/Hash** - O(n) time, O(n) space (violates space constraint)

---

## Approach 1: Floyd's Tortoise and Hare (Optimal)

This is the most efficient approach with O(1) extra space. By treating the array as a linked list, we can detect the cycle and find its entry point.

### Algorithm Steps

1. **Phase 1 - Detect Cycle**:
   - Initialize slow and fast at first element
   - Move slow by 1 step, fast by 2 steps
   - Continue until they meet (both in cycle)

2. **Phase 2 - Find Cycle Start**:
   - Reset slow to first element
   - Move both slow and fast by 1 step
   - Where they meet is the cycle start (duplicate)

### Why It Works

The mathematical proof relies on:
- Let μ be distance to cycle start
- Let λ be cycle length
- After phase 1: slow traveled μ + aλ, fast traveled μ + bλ
- Since fast = 2 × slow: μ + bλ = 2(μ + aλ) → μ = (b - 2a)λ
- This means μ is a multiple of λ, so both pointers meet at cycle start

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def findDuplicate(self, nums: List[int]) -> int:
        """
        Find the duplicate number using Floyd's Tortoise and Hare algorithm.
        
        Args:
            nums: List of integers with one duplicate
            
        Returns:
            The duplicate number
        """
        # Phase 1: Find intersection point in cycle
        slow = nums[0]
        fast = nums[0]
        
        while True:
            slow = nums[slow]          # Move 1 step
            fast = nums[nums[fast]]    # Move 2 steps
            if slow == fast:
                break
        
        # Phase 2: Find the cycle start (duplicate)
        slow = nums[0]
        while slow != fast:
            slow = nums[slow]
            fast = nums[fast]
        
        return slow
```

<!-- slide -->
```cpp
class Solution {
public:
    int findDuplicate(vector<int>& nums) {
        /**
         * Find the duplicate number using Floyd's Tortoise and Hare algorithm.
         * 
         * @param nums - Vector of integers with one duplicate
         * @return The duplicate number
         */
        // Phase 1: Find intersection point in cycle
        int slow = nums[0];
        int fast = nums[0];
        
        while (true) {
            slow = nums[slow];
            fast = nums[nums[fast]];
            if (slow == fast) break;
        }
        
        // Phase 2: Find the cycle start (duplicate)
        slow = nums[0];
        while (slow != fast) {
            slow = nums[slow];
            fast = nums[fast];
        }
        
        return slow;
    }
};
```

<!-- slide -->
```java
class Solution {
    public int findDuplicate(int[] nums) {
        /**
         * Find the duplicate number using Floyd's Tortoise and Hare algorithm.
         * 
         * @param nums - Array of integers with one duplicate
         * @return The duplicate number
         */
        // Phase 1: Find intersection point in cycle
        int slow = nums[0];
        int fast = nums[0];
        
        while (true) {
            slow = nums[slow];
            fast = nums[nums[fast]];
            if (slow == fast) break;
        }
        
        // Phase 2: Find the cycle start (duplicate)
        slow = nums[0];
        while (slow != fast) {
            slow = nums[slow];
            fast = nums[fast];
        }
        
        return slow;
    }
}
```

<!-- slide -->
```javascript
/**
 * Find the duplicate number using Floyd's Tortoise and Hare algorithm.
 * 
 * @param {number[]} nums - Array of integers with one duplicate
 * @return {number} - The duplicate number
 */
var findDuplicate = function(nums) {
    // Phase 1: Find intersection point in cycle
    let slow = nums[0];
    let fast = nums[0];
    
    while (true) {
        slow = nums[slow];
        fast = nums[nums[fast]];
        if (slow === fast) break;
    }
    
    // Phase 2: Find the cycle start (duplicate)
    slow = nums[0];
    while (slow !== fast) {
        slow = nums[slow];
        fast = nums[fast];
    }
    
    return slow;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) - Each element is visited a constant number of times |
| **Space** | O(1) - Only two pointers used |

---

## Approach 2: Binary Search

This approach uses the counting technique. For a given `mid`, we count how many numbers are ≤ `mid`. If the duplicate is greater than `mid`, the count will be greater than `mid`.

### Algorithm Steps

1. Set low = 1, high = n-1
2. While low < high:
   - mid = (low + high) / 2
   - Count numbers ≤ mid in the array
   - If count > mid: duplicate is in [low, mid]
   - Else: duplicate is in [mid+1, high]
3. Return low

### Why It Works

Since there's a duplicate, for any value `mid`:
- If duplicate > mid: more than mid elements will be ≤ mid (including the duplicate)
- If duplicate ≤ mid: at most mid elements can be ≤ mid

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def findDuplicate_binary(self, nums: List[int]) -> int:
        """
        Find duplicate using binary search on value range.
        
        Args:
            nums: List of integers with one duplicate
            
        Returns:
            The duplicate number
        """
        n = len(nums) - 1  # Actual n (array has n+1 elements)
        low, high = 1, n
        
        while low < high:
            mid = (low + high) // 2
            count = sum(1 for num in nums if num <= mid)
            
            if count > mid:
                # Duplicate is in [low, mid]
                high = mid
            else:
                # Duplicate is in [mid+1, high]
                low = mid + 1
        
        return low
```

<!-- slide -->
```cpp
class Solution {
public:
    int findDuplicate(vector<int>& nums) {
        /**
         * Find duplicate using binary search on value range.
         * 
         * @param nums - Vector of integers with one duplicate
         * @return The duplicate number
         */
        int n = nums.size() - 1;
        int low = 1, high = n;
        
        while (low < high) {
            int mid = (low + high) / 2;
            int count = 0;
            for (int num : nums) {
                if (num <= mid) count++;
            }
            
            if (count > mid) {
                high = mid;
            } else {
                low = mid + 1;
            }
        }
        
        return low;
    }
};
```

<!-- slide -->
```java
class Solution {
    public int findDuplicate(int[] nums) {
        /**
         * Find duplicate using binary search on value range.
         * 
         * @param nums - Array of integers with one duplicate
         * @return The duplicate number
         */
        int n = nums.length - 1;
        int low = 1, high = n;
        
        while (low < high) {
            int mid = (low + high) / 2;
            int count = 0;
            for (int num : nums) {
                if (num <= mid) count++;
            }
            
            if (count > mid) {
                high = mid;
            } else {
                low = mid + 1;
            }
        }
        
        return low;
    }
}
```

<!-- slide -->
```javascript
/**
 * Find duplicate using binary search on value range.
 * 
 * @param {number[]} nums - Array of integers with one duplicate
 * @return {number} - The duplicate number
 */
var findDuplicate = function(nums) {
    const n = nums.length - 1;
    let low = 1, high = n;
    
    while (low < high) {
        const mid = Math.floor((low + high) / 2);
        const count = nums.filter(num => num <= mid).length;
        
        if (count > mid) {
            high = mid;
        } else {
            low = mid + 1;
        }
    }
    
    return low;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n log n) - Binary search over n values, each count is O(n) |
| **Space** | O(1) - Only constant extra space |

---

## Approach 3: Using Set (Simple but uses extra space)

A straightforward approach using a set to detect duplicates.

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def findDuplicate_set(self, nums: List[int]) -> int:
        """
        Find duplicate using a set.
        
        Note: This uses O(n) extra space, violating the constraint.
        """
        seen = set()
        for num in nums:
            if num in seen:
                return num
            seen.add(num)
        return -1
```

<!-- slide -->
```cpp
class Solution {
public:
    int findDuplicate(vector<int>& nums) {
        /**
         * Find duplicate using a set.
         * 
         * Note: This uses O(n) extra space, violating the constraint.
         */
        unordered_set<int> seen;
        for (int num : nums) {
            if (seen.count(num)) return num;
            seen.insert(num);
        }
        return -1;
    }
};
```

<!-- slide -->
```java
class Solution {
    public int findDuplicate(int[] nums) {
        Set<Integer> seen = new HashSet<>();
        for (int num : nums) {
            if (seen.contains(num)) return num;
            seen.add(num);
        }
        return -1;
    }
}
```

<!-- slide -->
```javascript
var findDuplicate = function(nums) {
    const seen = new Set();
    for (const num of nums) {
        if (seen.has(num)) return num;
        seen.add(num);
    }
    return -1;
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

| Aspect | Floyd's Algorithm | Binary Search | Set Approach |
|--------|-------------------|---------------|--------------|
| **Time Complexity** | O(n) | O(n log n) | O(n) |
| **Space Complexity** | O(1) | O(1) | O(n) |
| **Modifies Input** | No | No | No |
| **LeetCode Optimal** | ✅ Yes | ❌ No | ❌ No |
| **Best For** | Space-constrained | When values are limited | Simple implementation |

**Best Approach:** Floyd's Tortoise and Hare algorithm is optimal with O(n) time and O(1) space complexity, making it the preferred solution.

---

## Why Floyd's Algorithm is Optimal for This Problem

The Floyd's Tortoise and Hare approach is the optimal solution because:

1. **Constant Space**: Only two integer pointers used, meeting the O(1) space requirement
2. **Linear Time**: Each phase traverses the list a constant number of times
3. **No Modification**: Doesn't modify the input array
4. **Mathematically Proven**: The cycle detection is guaranteed to work
5. **Industry Standard**: Widely accepted solution for this classic problem
6. **Elegant**: Beautiful use of mathematics to solve a seemingly complex problem

The key insight is transforming the problem from "find duplicate in array" to "find cycle start in linked list" - a powerful example of problem reframing.

---

## Related Problems

Based on similar themes (cycle detection, array indexing, finding duplicates):

### Easy Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Linked List Cycle | [Link](https://leetcode.com/problems/linked-list-cycle/) | Detect if linked list has a cycle |
| Linked List Cycle II | [Link](https://leetcode.com/problems/linked-list-cycle-ii/) | Find cycle start in linked list |

### Medium Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Find the Duplicate Number | [Link](https://leetcode.com/problems/find-the-duplicate-number/) | This problem |
| First Missing Positive | [Link](https://leetcode.com/problems/first-missing-positive/) | Similar cycle detection approach |

### Pattern Reference

For more detailed explanations of the Cycle Detection pattern and its variations, see:
- **[Cycle Detection Pattern](/algorithms/floyd-warshall)** - Floyd's algorithm explained

---

## Video Tutorial Links

Here are helpful YouTube tutorials explaining the problem and solutions:

### Floyd's Tortoise and Hare

- [NeetCode - Find the Duplicate Number](https://www.youtube.com/watch?v=wjYnzkAhcNk) - Clear explanation with visual examples
- [Floyd's Algorithm Explained](https://www.youtube.com/watch?v=L3nF5U8g8xA) - Detailed walkthrough
- [LeetCode Official Solution](https://www.youtube.com/watch?v=wu3cVHRc4T0) - Official problem solution

### Binary Search Approach

- [Binary Search on Count](https://www.youtube.com/watch?v=xsOXKqJ8N6A) - Alternative approach explanation

---

## Follow-up Questions

### Q1: How can we prove that at least one duplicate number must exist in nums?

**Answer:** This is the Pigeonhole Principle. We have n+1 integers, each in range [1, n]. Since there are only n distinct possible values, having n+1 items guarantees at least one value appears twice.

---

### Q2: Can you solve the problem in linear runtime complexity without extra space?

**Answer:** Yes! Floyd's Tortoise and Hare algorithm achieves O(n) time and O(1) space by treating the array as a linked list and finding the cycle.

---

### Q3: What if we could modify the array?

**Answer:** If modification is allowed, we could mark visited indices by negating values: for each num, go to index num and negate the value there. If we visit an already negated index, we've found the duplicate. This is O(n) time and O(1) space.

---

### Q4: How would you find all duplicates in the array?

**Answer:** Use the marking approach: for each index i, mark nums[nums[i]-1] as negative. If nums[abs(nums[i])-1] is already negative, then abs(nums[i]) is a duplicate. Collect all such duplicates.

---

### Q5: What if the array values were in range [0, n] instead of [1, n]?

**Answer:** The algorithm would need slight modification. The cycle would start at index 0 (since 0 is now a valid value). The logic remains the same but starting positions might change.

---

### Q6: How would you handle this in a distributed system?

**Answer:** In distributed systems, you could use hashing to partition data. Each node counts occurrences of values in its partition, then combine results to find the duplicate.

---

### Q7: What edge cases should be tested?

**Answer:**
- Array with duplicate at the beginning: [1,1,2,3,4]
- Array with duplicate at the end: [1,2,3,4,4]
- All same elements: [2,2,2,2,2]
- Two duplicates (if allowed): [1,2,2,3,3]
- Minimal case: [1,1,2]

---

### Q8: How does this relate to finding a cycle in a graph?

**Answer:** This is exactly finding a cycle in a functional graph (each node has exactly one outgoing edge). The duplicate creates multiple incoming edges to the same node, forming a cycle.

---

## Common Pitfalls

### 1. Index vs Value Confusion
**Issue**: Confusing array indices with values in the linked list analogy.

**Solution**: Remember that nums[i] gives the "next node" index, not the current node's value for comparison purposes.

### 2. Initialization
**Issue**: Incorrect starting positions for slow and fast pointers.

**Solution**: Both start at nums[0], not at index 0. This is because we're treating the first element as the head of the linked list.

### 3. Phase 2 Reset
**Issue**: Forgetting to reset slow to nums[0] before finding the cycle start.

**Solution**: The second phase requires starting fresh from the beginning to find where the cycle begins.

### 4. Infinite Loop
**Issue**: Not handling the case where pointers might not meet.

**Solution**: The algorithm guarantees meeting because there's always a cycle (due to the duplicate). Use while True in phase 1.

### 5. Off-by-One Errors
**Issue**: Getting confused about whether to use 0-based or 1-based indexing.

**Solution**: Values are in [1, n], so think of them as 1-based for the cycle detection logic. The duplicate value IS the answer.

---

## Summary

The **Find The Duplicate Number** problem demonstrates the power of cycle detection algorithms:

- **Floyd's Algorithm**: Optimal with O(n) time and O(1) space
- **Binary Search**: O(n log n) time, O(1) space
- **Set Approach**: Simple but uses O(n) space

The key insight is treating the array as a linked list where each value points to the next index. The duplicate creates a cycle, and Floyd's algorithm efficiently finds its entry point.

This problem is an excellent demonstration of how mathematical algorithms (cycle detection) can solve seemingly unrelated problems through clever problem reframing.

### Pattern Summary

This problem exemplifies the **Cycle Detection** pattern, which is characterized by:
- Treating array as a linked list
- Using two pointers at different speeds
- Finding cycle entry point
- Achieving O(1) space complexity

For more details on this pattern and its variations, see the **[Cycle Detection Pattern](/algorithms/floyd-warshall)**.

---

## Additional Resources

- [LeetCode Problem Discussion](https://leetcode.com/problems/find-the-duplicate-number/discuss/) - Community solutions and explanations
- [Floyd's Tortoise and Hare Algorithm - Wikipedia](https://en.wikipedia.org/wiki/Cycle_detection) - Mathematical background
- [Pigeonhole Principle - Wikipedia](https://en.wikipedia.org/wiki/Pigeonhole_principle) - Proof of duplicate existence
- [Pattern: Cycle Detection](/algorithms/floyd-warshall) - Comprehensive pattern guide
