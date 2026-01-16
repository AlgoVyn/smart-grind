# Two Sum II - Input array is sorted

## Problem Description

Given a 1-indexed array of integers `numbers` that is already **sorted in non-decreasing order**, determine if there exist two elements such that they add up to a given integer `target`. Return the indices of two numbers such that they add up to `target`.

**Important Notes:**
- The array is **1-indexed** (as per LeetCode convention)
- Return the indices as `[index1, index2]` where `1 <= index1 < index2 <= len(numbers)`
- There is exactly **one solution** (no multiple answers to choose from)
- You may **not use the same element twice**
- The array is already sorted in **non-decreasing order**

---

## Examples

**Example 1:**

**Input:**
```python
numbers = [2, 7, 11, 15]
target = 9
```

**Output:**
```python
[1, 2]
```

**Explanation:** Because `numbers[1] + numbers[2] = 2 + 7 = 9`, we return `[1, 2]`.

**Example 2:**

**Input:**
```python
numbers = [2, 3, 4]
target = 6
```

**Output:**
```python
[1, 3]
```

**Explanation:** Because `numbers[1] + numbers[3] = 2 + 4 = 6`, we return `[1, 3]`.

**Example 3:**

**Input:**
```python
numbers = [-1, 0]
target = -1
```

**Output:**
```python
[1, 2]
```

**Explanation:** Because `numbers[1] + numbers[2] = -1 + 0 = -1`, we return `[1, 2]`.

---

## Constraints

- `2 <= numbers.length <= 3 * 10^4`
- `-1000 <= numbers[i] <= 1000`
- `-1000 <= target <= 1000`
- The array is sorted in **non-decreasing order**
- Only **one valid answer** exists

---

## Solution

### Approach 1: Two Pointers (Optimal) ✅ Recommended

```python
class Solution:
    def twoSum(self, numbers: List[int], target: int) -> List[int]:
        left, right = 0, len(numbers) - 1
        
        while left < right:
            current_sum = numbers[left] + numbers[right]
            
            if current_sum == target:
                # Convert 0-indexed to 1-indexed for LeetCode
                return [left + 1, right + 1]
            elif current_sum < target:
                left += 1  # Need a larger sum, move right
            else:
                right -= 1  # Need a smaller sum, move left
        
        return []  # No solution found (shouldn't happen per constraints)
```

### Approach 2: Binary Search

```python
class Solution:
    def twoSum(self, numbers: List[int], target: int) -> List[int]:
        for i in range(len(numbers)):
            left, right = i + 1, len(numbers) - 1
            while left <= right:
                mid = (left + right) // 2
                current_sum = numbers[i] + numbers[mid]
                
                if current_sum == target:
                    return [i + 1, mid + 1]
                elif current_sum < target:
                    left = mid + 1
                else:
                    right = mid - 1
        
        return []  # No solution found
```

### Approach 3: Hash Map (Less Efficient but Works)

```python
class Solution:
    def twoSum(self, numbers: List[int], target: int) -> List[int]:
        num_map = {}
        for i, num in enumerate(numbers):
            complement = target - num
            if complement in num_map:
                return [num_map[complement] + 1, i + 1]
            num_map[num] = i
        return []
```

---

## Explanation

### Intuition

The key insight is that the array is **sorted in non-decreasing order**. This allows us to use the **Two Pointers technique**:

- If we have two pointers at opposite ends (smallest and largest elements)
- If their sum is **too small**, we need to increase the sum → move the **left pointer right**
- If their sum is **too large**, we need to decrease the sum → move the **right pointer left**
- If we find the exact sum, return the indices

This works because:
1. Moving the **left pointer** increases the sum (since array is sorted)
2. Moving the **right pointer** decreases the sum (since array is sorted)
3. We explore all possible pairs in **O(n)** time

### Why Two Pointers Work

Consider the sorted array `[2, 7, 11, 15]` and target `9`:

1. **Initial state**: `left=0 (2)`, `right=3 (15)` → sum=17 > 9 → move `right` left
2. **Step 2**: `left=0 (2)`, `right=2 (11)` → sum=13 > 9 → move `right` left
3. **Step 3**: `left=0 (2)`, `right=1 (7)` → sum=9 → **FOUND!**

Each step eliminates possibilities:
- When sum is too large, all elements from `right` to end are also too large
- When sum is too small, all elements from `left` to start are also too small

### Approach 1: Two Pointers (Recommended)
- **Time**: O(n) - single pass through the array
- **Space**: O(1) - constant extra space
- **Best for**: Sorted arrays, minimal space usage

### Approach 2: Binary Search
- **Time**: O(n log n) - outer loop O(n), inner binary search O(log n)
- **Space**: O(1) - constant extra space
- **Use when**: You want to practice binary search, though less optimal

### Approach 3: Hash Map
- **Time**: O(n) - single pass
- **Space**: O(n) - hash map storage
- **Note**: Doesn't take advantage of sorted property, but still works

---

## Time Complexity

| Approach | Time Complexity | Space Complexity | Notes |
|----------|-----------------|------------------|-------|
| Two Pointers | O(n) | O(1) | **Optimal for sorted arrays** |
| Binary Search | O(n log n) | O(n) | Good for practice, not optimal |
| Hash Map | O(n) | O(n) | Works but ignores sorted property |

Where **n** is the length of the array.

---

## Comparison with Original Two Sum

| Feature | Two Sum (Original) | Two Sum II (Sorted) |
|---------|-------------------|---------------------|
| Input Array | Unsorted | Sorted in non-decreasing order |
| Index Convention | 0-indexed | 1-indexed |
| Best Solution | Hash Map (O(n)) | Two Pointers (O(n), O(1) space) |
| Multiple Solutions | May exist | Exactly one solution guaranteed |

---

## Related Problems

1. **[Two Sum](/solutions/two-sum.md)** - Original unsorted version
2. **[3Sum](/solutions/3sum.md)** - Find all triplets that sum to zero
3. **[4Sum](/solutions/4sum.md)** - Find all quadruplets that sum to target
4. **[Two Sum III - Data structure design](/solutions/design-hashmap.md)** - Design a class with add and find operations
5. **[Two Sum IV - Input is a BST](/solutions/binary-search-tree-iterator.md)** - Find two elements in BST that sum to target
6. **[3Sum Closest](/solutions/3sum-closest.md)** - Find three numbers closest to target sum
7. **[3Sum Smaller](/solutions/3sum-smaller.md)** - Count triplets with sum less than target

---

## Video Tutorial Links

1. **[NeetCode - Two Sum II Solution](https://www.youtube.com/watch?v=L4o5j_8Y6yM)** - Clear explanation with visual examples
2. **[BackToBackSWE - Two Sum II](https://www.youtube.com/watch?v=cQWrOYy4pZM)** - Detailed walkthrough of two pointers approach
3. **[WilliamFiset - Two Pointers Technique](https://www.youtube.com/watch?v=yn5vS0rBtxw)** - Comprehensive guide on two pointers pattern
4. **[Happy Coding - Two Sum II](https://www.youtube.com/watch?v=ZlRDRS0IuFw)** - Alternative explanation with binary search approach

---

## Follow-up Questions

1. **What if the array could contain duplicates?**
   - The two pointers approach still works perfectly with duplicates
   - Example: `[3, 3, 3, 3]` with target `6` → first pair `[1, 2]` is valid

2. **How would you modify the solution to find all pairs that sum to target?**
   - The problem states exactly one solution, but if multiple existed:
   - Use a hash map to store all indices for each value
   - Generate all valid pairs respecting `i < j`

3. **What if the array is sorted in decreasing order?**
   - Reverse the array first, OR
   - Swap the pointer movement logic (left decreases sum, right increases sum)

4. **How would you handle this in O(log n) space?**
   - The two pointers approach already uses O(1) space
   - Hash map uses O(n) space, which is less optimal

5. **Can you solve this with binary search instead of two pointers?**
   - Yes! For each element, binary search for its complement
   - Time: O(n log n), Space: O(1)
   - See Approach 2 in the solution section

6. **What if you need to return the values instead of indices?**
   - Modify return statement to `[numbers[left], numbers[right]]`
   - Note: In LeetCode, indices are required, not values

7. **How does the 1-indexed vs 0-indexed affect the solution?**
   - Internally use 0-indexed (easier for array access)
   - Add 1 to indices before returning to match LeetCode format
   - This is purely for display purposes

---

## LeetCode Link
[Two Sum II - Input array is sorted - LeetCode](https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/)
