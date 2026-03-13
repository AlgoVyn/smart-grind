# Rotate Array

## Problem Description

Given an integer array `nums`, rotate the array to the right by `k` steps.

**Link to problem:** [Rotate Array - LeetCode 189](https://leetcode.com/problems/rotate-array/)

## Constraints
- `1 <= nums.length <= 10^5`
- `-2^31 <= nums[i] <= 2^31 - 1`
- `0 <= k <= 10^5`

---

## Pattern: Array Manipulation - Reversal

This problem is a classic example of the **Reversal** pattern. The key insight is that rotating can be done by reversing parts of the array.

### Core Concept

The fundamental idea is:
- **Rotation**: Moving elements k positions to the right (wrapping around)
- **Reversal**: Three reversals achieve the same result
- **Modulo**: Effective rotation is k % n

---

## Examples

### Example

**Input:**
```
nums = [1,2,3,4,5,6,7], k = 3
```

**Output:**
```
[5,6,7,1,2,3,4]
```

### Example 2

**Input:**
```
nums = [-1,-100,3,99], k = 2
```

**Output:**
```
[3,99,-1,-100]
```

---

## Intuition

The key insight for this problem is that rotating an array can be achieved efficiently using only reversals, without needing to move each element one by one.

### Key Observations

1. **Three Reversals Equivalent to Rotation**: Rotating an array by k positions is equivalent to:
   - Reversing the entire array
   - Reversing the first k elements
   - Reversing the remaining n-k elements

2. **Modulo Optimization**: Rotating by n positions returns the array to its original state, so we only need k = k % n effective rotations.

3. **In-Place Solution**: By reversing in place (swapping elements from both ends), we achieve O(1) space complexity.

### Why Reversal Works

For array [1,2,3,4,5,6,7] with k=3:
- Original: [1,2,3,4,5,6,7]
- Reverse all: [7,6,5,4,3,2,1]
- Reverse first k: [5,6,7,4,3,2,1]
- Reverse rest: [5,6,7,1,2,3,4] ✓

This works because the three reversals effectively "move" the first k elements to the end while preserving their internal order.

---

## Multiple Approaches with Code

We'll cover three approaches:

1. **Reversal** - O(n) time, O(1) space
2. **Cyclic Replacements** - O(n) time, O(1) space
3. **Extra Array** - O(n) time, O(n) space

---

## Approach 1: Reversal (Optimal)

This is the most space-efficient approach.

### Algorithm Steps

1. Handle edge case: if k == 0 or n == 1, return
2. Effective k = k % n
3. Reverse entire array
4. Reverse first k elements
5. Reverse remaining n-k elements

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def rotate(self, nums: List[int], k: int) -> None:
        """
        Rotate array using reversal algorithm.
        
        Args:
            nums: List to rotate
            k: Number of steps to rotate
        """
        n = len(nums)
        k = k % n
        
        def reverse(start, end):
            while start < end:
                nums[start], nums[end] = nums[end], nums[start]
                start += 1
                end -= 1
        
        # Reverse entire array
        reverse(0, n - 1)
        # Reverse first k elements
        reverse(0, k - 1)
        # Reverse remaining elements
        reverse(k, n - 1)
```

<!-- slide -->
```cpp
class Solution {
public:
    void rotate(vector<int>& nums, int k) {
        int n = nums.size();
        k = k % n;
        
        auto reverse = [&](int start, int end) {
            while (start < end) {
                swap(nums[start], nums[end]);
                start++;
                end--;
            }
        };
        
        reverse(0, n - 1);
        reverse(0, k - 1);
        reverse(k, n - 1);
    }
};
```

<!-- slide -->
```java
class Solution {
    public void rotate(int[] nums, int k) {
        int n = nums.length;
        k = k % n;
        
        reverse(nums, 0, n - 1);
        reverse(nums, 0, k - 1);
        reverse(nums, k, n - 1);
    }
    
    private void reverse(int[] nums, int start, int end) {
        while (start < end) {
            int temp = nums[start];
            nums[start] = nums[end];
            nums[end] = temp;
            start++;
            end--;
        }
    }
}
```

<!-- slide -->
```javascript
/**
 * @param {number[]} nums
 * @param {number} k
 * @return {void} Do not return anything, modify nums in-place instead.
 */
var rotate = function(nums, k) {
    const n = nums.length;
    k = k % n;
    
    const reverse = (start, end) => {
        while (start < end) {
            [nums[start], nums[end]] = [nums[end], nums[start]];
            start++;
            end--;
        }
    };
    
    reverse(0, n - 1);
    reverse(0, k - 1);
    reverse(k, n - 1);
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) - each element is swapped at most twice |
| **Space** | O(1) - in-place operations |

---

## Approach 2: Cyclic Replacements

Use GCD to determine cycle pattern.

### Code Implementation

````carousel
```python
from typing import List
import math

class Solution:
    def rotate_cyclic(self, nums: List[int], k: int) -> None:
        n = len(nums)
        k = k % n
        count = 0
        start = 0
        
        while count < n:
            current = start
            prev = nums[start]
            
            while True:
                next_idx = (current + k) % n
                temp = nums[next_idx]
                nums[next_idx] = prev
                prev = temp
                current = next_idx
                count += 1
                
                if current == start:
                    break
            
            start += 1
```

<!-- slide -->
```cpp
class Solution {
public:
    void rotate(vector<int>& nums, int k) {
        int n = nums.size();
        k = k % n;
        int count = 0;
        
        for (int start = 0; count < n; start++) {
            int current = start;
            int prev = nums[start];
            
            do {
                int next_idx = (current + k) % n;
                int temp = nums[next_idx];
                nums[next_idx] = prev;
                prev = temp;
                current = next_idx;
                count++;
            } while (current != start);
        }
    }
};
```

<!-- slide -->
```java
class Solution {
    public void rotate(int[] nums, int k) {
        int n = nums.length;
        k = k % n;
        int count = 0;
        
        for (int start = 0; count < n; start++) {
            int current = start;
            int prev = nums[start];
            
            do {
                int nextIdx = (current + k) % n;
                int temp = nums[nextIdx];
                nums[nextIdx] = prev;
                prev = temp;
                current = nextIdx;
                count++;
            } while (current != start);
        }
    }
}
```

<!-- slide -->
```javascript
var rotate = function(nums, k) {
    const n = nums.length;
    k = k % n;
    let count = 0;
    
    for (let start = 0; count < n; start++) {
        let current = start;
        let prev = nums[start];
        
        do {
            const nextIdx = (current + k) % n;
            const temp = nums[nextIdx];
            nums[nextIdx] = prev;
            prev = temp;
            current = nextIdx;
            count++;
        } while (current !== start);
    }
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) |
| **Space** | O(1) |

---

## Approach 3: Extra Array

Simple but uses O(n) space.

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def rotate_extra(self, nums: List[int], k: int) -> None:
        n = len(nums)
        k = k % n
        temp = nums[:]
        
        for i in range(n):
            nums[(i + k) % n] = temp[i]
```

<!-- slide -->
```cpp
class Solution {
public:
    void rotate(vector<int>& nums, int k) {
        int n = nums.size();
        k = k % n;
        vector<int> temp = nums;
        
        for (int i = 0; i < n; i++) {
            nums[(i + k) % n] = temp[i];
        }
    }
};
```

<!-- slide -->
```java
class Solution {
    public void rotate(int[] nums, int k) {
        int n = nums.length;
        k = k % n;
        int[] temp = nums.clone();
        
        for (int i = 0; i < n; i++) {
            nums[(i + k) % n] = temp[i];
        }
    }
}
```

<!-- slide -->
```javascript
var rotate = function(nums, k) {
    const n = nums.length;
    k = k % n;
    const temp = [...nums];
    
    for (let i = 0; i < n; i++) {
        nums[(i + k) % n] = temp[i];
    }
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) |
| **Space** | O(n) |

---

## Comparison

| Aspect | Reversal | Cyclic | Extra Array |
|--------|----------|--------|-------------|
| **Time** | O(n) | O(n) | O(n) |
| **Space** | O(1) | O(1) | O(n) |
| **Implementation** | Simple | Complex | Simple |

---

## Related Problems

| Problem | LeetCode Link |
|---------|---------------|
| Rotate String | [Link](https://leetcode.com/problems/rotate-string/) |
| Reverse Words in a String | [Link](https://leetcode.com/problems/reverse-words-in-a-string/) |

---

## Follow-up Questions

### Q1: Why do we use k = k % n?

**Answer:** Rotating n times returns to original, so we only need effective rotation.

### Q2: What's the reversal logic?

**Answer:** [1,2,3,4,5,6,7] → reverse all → [7,6,5,4,3,2,1] → reverse first k → [5,6,7,4,3,2,1] → reverse rest → [5,6,7,1,2,3,4]

### Q3: What if k is negative?

**Answer:** Problem states k >= 0. For negative k, you would rotate in the opposite direction.

### Q4: Can we rotate to the left instead?

**Answer:** Yes, left rotation by k is equivalent to right rotation by n-k.

---

## Video Tutorial Links

- [NeetCode - Rotate Array](https://www.youtube.com/watch?v=8hQPLSSjkMY) - Clear explanation
- [Reversal Algorithm Explained](https://www.youtube.com/watch?v=5xM48W6yG-sE) - Visual walkthrough
- [LeetCode Official](https://www.youtube.com/watch?v=0lGNeO7xW7k) - Official solution

---

## Common Pitfalls

### 1. k Value
**Issue**: Not taking k % n before processing.

**Solution**: Always compute k = k % n first to handle cases where k > n.

### 2. Reversal Order
**Issue**: Wrong reversal order leads to incorrect results.

**Solution**: Follow exact order: reverse all, reverse first k, reverse remaining.

### 3. Empty or Single Element
**Issue**: Not handling edge cases.

**Solution**: Check if n <= 1 or k == 0 and return early.

### 4. In-Place Modification
**Issue**: Creating new arrays when modification is required in-place.

**Solution**: Use the reversal algorithm for in-place O(1) space solution.

---

## Summary

The **Rotate Array** problem demonstrates the **Reversal** pattern:
- Reverse the entire array
- Reverse the first k elements
- Reverse the remaining n-k elements
- O(n) time, O(1) space
- Handles rotation efficiently in-place

This is a classic in-place array manipulation problem that teaches important concepts about array reversal and index manipulation.

---

## Additional Resources

- [LeetCode Problem Discussion](https://leetcode.com/problems/rotate-array/discuss/) - Community solutions
- [Array Rotation - GeeksforGeeks](https://www.geeksforgeeks.org/array-rotation/) - Various rotation techniques
