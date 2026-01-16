# Two Sum

## Problem Description
Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.

You may assume that each input would have **exactly one solution**, and you may not use the same element twice.

You can return the answer in any order.

---

## Examples

**Example 1:**

**Input:**
```python
nums = [2, 7, 11, 15]
target = 9
```

**Output:**
```python
[0, 1]
```

**Explanation:** Because `nums[0] + nums[1] = 2 + 7 = 9`, we return `[0, 1]`.

**Example 2:**

**Input:**
```python
nums = [3, 2, 4]
target = 6
```

**Output:**
```python
[1, 2]
```

**Explanation:** Because `nums[1] + nums[2] = 2 + 4 = 6`, we return `[1, 2]`.

**Example 3:**

**Input:**
```python
nums = [3, 3]
target = 6
```

**Output:**
```python
[0, 1]
```

**Explanation:** Because `nums[0] + nums[1] = 3 + 3 = 6`, we return `[0, 1]`.

---

## Constraints

- `2 <= nums.length <= 10^4`
- `-10^9 <= nums[i] <= 10^9`
- `-10^9 <= target <= 10^9`
- Only one valid answer exists.

---

## Solution

### Approach 1: Brute Force

```python
class Solution:
    def twoSum(self, nums: List[int], target: int) -> List[int]:
        n = len(nums)
        for i in range(n):
            for j in range(i + 1, n):
                if nums[i] + nums[j] == target:
                    return [i, j]
        return []
```

### Approach 2: Two-pass Hash Table

```python
class Solution:
    def twoSum(self, nums: List[int], target: int) -> List[int]:
        num_map = {}
        # First pass: build the hash map
        for i, num in enumerate(nums):
            num_map[num] = i
        
        # Second pass: find complement
        for i, num in enumerate(nums):
            complement = target - num
            if complement in num_map and num_map[complement] != i:
                return [i, num_map[complement]]
        
        return []
```

### Approach 3: One-pass Hash Table (Optimal)

```python
class Solution:
    def twoSum(self, nums: List[int], target: int) -> List[int]:
        num_map = {}
        for i, num in enumerate(nums):
            complement = target - num
            if complement in num_map:
                return [num_map[complement], i]
            num_map[num] = i
        return []
```

---

## Explanation

### Intuition
For each number `nums[i]`, we need to find if there's another number `complement` such that:
```
nums[i] + complement = target
```
Which means:
```
complement = target - nums[i]
```

### Approach 1: Brute Force
- Check every pair of elements (O(n²) time)
- Return the pair that sums to target
- Simple but inefficient for large arrays

### Approach 2: Two-pass Hash Table
- First pass: Store each number and its index in a hash map
- Second pass: For each number, check if its complement exists
- Time: O(n), Space: O(n)

### Approach 3: One-pass Hash Table (Recommended)
- Build the hash map and check for complement in a single pass
- Most efficient approach
- Time: O(n), Space: O(n)

---

## Time Complexity

| Approach | Time Complexity | Space Complexity |
|----------|-----------------|------------------|
| Brute Force | O(n²) | O(1) |
| Two-pass Hash Table | O(n) | O(n) |
| One-pass Hash Table | O(n) | O(n) |

---

## Related Problems

1. **[3Sum](/solutions/3sum.md)** - Find all triplets in array that sum to zero
2. **[4Sum](/solutions/4sum.md)** - Find all quadruplets in array that sum to target
3. **[Two Sum II - Input array is sorted](/solutions/two-sum-ii-input-array-is-sorted.md)** - Same problem with sorted input using two pointers
4. **[Two Sum III - Data structure design](/solutions/design-hashmap.md)** - Design a class that supports add and find
5. **[Two Sum IV - Input is a BST](/solutions/binary-search-tree-iterator.md)** - Find if there are two elements in BST that sum to k

---

## Video Tutorial Links

1. [NeetCode - Two Sum Solution](https://www.youtube.com/watch?v=UXD13HA0bHE)
2. [BackToBackSWE - Two Sum Explained](https://www.youtube.com/watch?v=IHSzA0j84H4)
3. [WilliamFiset - Two Sum Problem](https://www.youtube.com/watch?v=XiB12b9C2xA)

---

## Follow-up Questions

1. **What if you need to return the values instead of indices?**
   - Modify the hash map to store values, or return `nums[i]` and `complement`

2. **What if there are multiple valid pairs?**
   - Return any valid pair, or modify to collect all pairs

3. **How would you solve this with sorted input in O(n) time?**
   - Use two pointers (left and right) moving towards each other

4. **How would you handle duplicate values in the array?**
   - The hash table approach handles duplicates naturally with proper index checking

5. **What if you need to find all pairs that sum to target?**
   - Store all indices for each value in a list, then generate all valid pairs

---

## LeetCode Link
[Two Sum - LeetCode](https://leetcode.com/problems/two-sum/)

