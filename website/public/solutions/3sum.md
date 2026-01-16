# 3Sum

## Problem Description

Given an integer array `nums`, return all the **unique triplets** `[nums[i], nums[j], nums[k]]` such that:
- `i != j`, `i != k`, and `j != k` (three distinct indices)
- `nums[i] + nums[j] + nums[k] == 0` (their sum equals zero)

The solution set must not contain duplicate triplets.

This is one of the most classic and frequently asked interview problems. It tests your ability to:
1. Handle edge cases (empty arrays, arrays with no valid triplets)
2. Avoid duplicates systematically
3. Optimize from brute force to efficient solutions
4. Use the two-pointer technique effectively

---

## Examples

**Example 1:**
```python
Input: nums = [-1,0,1,2,-1,-4]
Output: [[-1,-1,2],[-1,0,1]]
Explanation: 
- [-1, -1, 2] sums to 0
- [-1, 0, 1] sums to 0
```

**Example 2:**
```python
Input: nums = []
Output: []
Explanation: Empty array has no triplets
```

**Example 3:**
```python
Input: nums = [0]
Output: []
Explanation: Array with less than 3 elements has no triplets
```

**Example 4:**
```python
Input: nums = [0,0,0,0]
Output: [[0,0,0]]
Explanation: All zeros, but only one unique triplet exists
```

**Example 5:**
```python
Input: nums = [-2,-1,0,1,2]
Output: [[-2,-1,3],[-2,0,2],[-1,0,1]]
```

---

## Constraints

- `0 <= nums.length <= 3000`
- `-10^5 <= nums[i] <= 10^5`

---

## Intuition

The key insight to solve this problem efficiently is to **reduce the 3-sum problem to a 2-sum problem**:

1. **Fix one element**: Choose an element at index `i` as the first element of our triplet
2. **Solve 2-sum**: For the remaining subarray, find all pairs that sum to `-nums[i]`
3. **Avoid duplicates**: Skip duplicate values to ensure unique triplets

By sorting the array first, we can:
- Use the two-pointer technique to find pairs that sum to a target
- Easily skip duplicate values by checking adjacent elements
- Systematically explore the solution space without missing any combinations

---

## Approach 1: Brute Force (O(n³))

### Algorithm
1. Use three nested loops to iterate through all possible triplets
2. Check if each triplet sums to zero
3. Add valid triplets to a set to avoid duplicates (or check before adding)

### Code
```python
from typing import List

class Solution:
    def threeSum_bruteforce(self, nums: List[int]) -> List[List[int]]:
        n = len(nums)
        triplets = set()  # Use set to automatically handle duplicates
        
        for i in range(n):
            for j in range(i + 1, n):
                for k in range(j + 1, n):
                    if nums[i] + nums[j] + nums[k] == 0:
                        triplet = tuple(sorted([nums[i], nums[j], nums[k]]))
                        triplets.add(triplet)
        
        return [list(t) for t in triplets]
```

### Time Complexity
**O(n³)** - Three nested loops iterate through all possible triplets

### Space Complexity
**O(n²)** - In worst case, we store O(n²) triplets in the set

---

## Approach 2: Hash Set (O(n²))

### Algorithm
1. Sort the array
2. Iterate through array with index `i`
3. For each `i`, use a hash set to find pairs in the remaining array that sum to `-nums[i]`
4. Skip duplicates by checking `nums[i] == nums[i-1]`

### Code
```python
from typing import List

class Solution:
    def threeSum_hashset(self, nums: List[int]) -> List[List[int]]:
        nums.sort()
        result = []
        n = len(nums)
        
        for i in range(n):
            if i > 0 and nums[i] == nums[i - 1]:
                continue
                
            target = -nums[i]
            seen = set()
            
            j = i + 1
            while j < n:
                complement = target - nums[j]
                if complement in seen:
                    result.append([nums[i], complement, nums[j]])
                    # Skip duplicates for the third element
                    while j + 1 < n and nums[j] == nums[j + 1]:
                        j += 1
                seen.add(nums[j])
                j += 1
        
        return result
```

### Time Complexity
**O(n²)** - Sorting is O(n log n), outer loop O(n), inner hash set operations O(1) average

### Space Complexity
**O(n)** - Hash set stores up to O(n) elements

---

## Approach 3: Two Pointers (Optimal) ⭐

### Algorithm
1. Sort the array
2. Iterate through each element at index `i`
3. Use two pointers (`left` and `right`) to find pairs that sum to `-nums[i]`
4. Skip duplicates by checking adjacent elements

### Code
```python
from typing import List

class Solution:
    def threeSum(self, nums: List[int]) -> List[List[int]]:
        nums.sort()
        result = []
        n = len(nums)
        
        for i in range(n - 2):
            # Skip duplicates for the first element
            if i > 0 and nums[i] == nums[i - 1]:
                continue
            
            # If smallest possible sum is > 0, break early
            if nums[i] + nums[i + 1] + nums[i + 2] > 0:
                break
            
            # If largest possible sum is < 0, continue to next i
            if nums[i] + nums[n - 1] + nums[n - 2] < 0:
                continue
            
            left, right = i + 1, n - 1
            while left < right:
                total = nums[i] + nums[left] + nums[right]
                
                if total < 0:
                    left += 1
                elif total > 0:
                    right -= 1
                else:
                    result.append([nums[i], nums[left], nums[right]])
                    
                    # Skip duplicates for second element
                    while left < right and nums[left] == nums[left + 1]:
                        left += 1
                    
                    # Skip duplicates for third element
                    while left < right and nums[right] == nums[right - 1]:
                        right -= 1
                    
                    left += 1
                    right -= 1
        
        return result
```

### Time Complexity
**O(n²)** - Sorting O(n log n), outer loop O(n), two-pointer scan O(n)

### Space Complexity
**O(1)** - In-place sorting, only O(1) extra space for pointers

---

## Step-by-Step Example

Let's trace through `nums = [-1, 0, 1, 2, -1, -4]`:

**Step 1: Sort the array**
```
[-4, -1, -1, 0, 1, 2]
```

**Step 2: Iterate with i = 0 (value = -4)**
- Target for pair: 4
- `left = 1` (-1), `right = 5` (2), sum = -3 → move `left` right
- `left = 2` (-1), `right = 5` (2), sum = -3 → move `left` right
- `left = 3` (0), `right = 5` (2), sum = -2 → move `left` right
- `left = 4` (1), `right = 5` (2), sum = -1 → move `left` right
- `left == right`, no triplet found

**Step 3: Iterate with i = 1 (value = -1)**
- Skip if i > 0 and nums[i] == nums[i-1]? No (-1 != -4)
- Target for pair: 1
- `left = 2` (-1), `right = 5` (2), sum = 0 → **FOUND triplet [-1, -1, 2]**
- Skip duplicates: `left` moves past second -1, `right` stays
- `left = 3` (0), `right = 5` (2), sum = 1 → move `right` left
- `left = 3` (0), `right = 4` (1), sum = 0 → **FOUND triplet [-1, 0, 1]**
- Skip duplicates, move both pointers, exit loop

**Step 4: Iterate with i = 2 (value = -1)**
- Skip: nums[2] == nums[1] == -1 → **skip this i**

**Result: [[-1, -1, 2], [-1, 0, 1]]** ✓

---

## Key Optimizations

1. **Early Termination**: If `nums[i] + nums[i+1] + nums[i+2] > 0`, break early (all further triplets will be > 0)
2. **Skip Impossible**: If `nums[i] + nums[n-2] + nums[n-1] < 0`, continue (no triplet can sum to 0)
3. **Duplicate Skipping**: Skip duplicate values at each level to ensure uniqueness

---

## Time Complexity Comparison

| Approach | Time Complexity | Space Complexity | Notes |
|----------|-----------------|------------------|-------|
| Brute Force | O(n³) | O(n²) | Simple but inefficient |
| Hash Set | O(n²) | O(n) | Good, but set overhead |
| Two Pointers | O(n²) | O(1) | **Optimal** - most efficient |

---

## Related Problems

1. **[3Sum Closest](3sum-closest.md)** - Find three integers whose sum is closest to target
2. **[3Sum Smaller](3sum-smaller.md)** - Count triplets with sum less than target
3. **[4Sum](4sum.md)** - Find all unique quadruplets that sum to target
5. **[Two Sum](binary-search.md)** - Find two numbers that add up to target
6. **[Array Two Pointer Pattern](binary-search-on-sorted-array-list.md)** - General two-pointer techniques

---

## Video Tutorials

- [NeetCode - 3Sum Solution](https://www.youtube.com/watch?v=vvH9DC4G3O0)
- [Back to Back SWE - 3Sum](https://www.youtube.com/watch?v=jzZsG5O4qdM)
- [LeetCode Official Solution](https://www.youtube.com/watch?v=jzZsG5O4qdM)
- [Abdul Bari - Two Pointer Technique](https://www.youtube.com/watch?v=onLoLV6yC1o)

---

## Follow-up Questions

1. **What if the array contains duplicate triplets?** - How would you handle/remove them?
2. **How would you modify the solution to find k-sum?** - Generalize to find any number of elements
3. **What if you need to count triplets instead of listing them?** - Optimize for counting only
4. **How would you handle large numbers that might cause overflow?** - Consider using long integers
5. **Can you solve this with a hash map approach?** - Compare with the two-pointer approach
6. **What if duplicates are not to be skipped?** - How would the solution change?
7. **How would you parallelize this computation?** - Consider MapReduce or GPU approaches

---

## Common Mistakes to Avoid

1. **Forgetting to skip duplicates** - Results in duplicate triplets
2. **Not sorting the array** - Two-pointer technique won't work
3. **Index out of bounds** - Ensure `i < n-2` and proper pointer initialization
4. **Not handling edge cases** - Empty arrays, arrays with less than 3 elements
5. **Early termination logic** - Be careful with the break/continue conditions

---

## References

- [LeetCode 15 - 3Sum](https://leetcode.com/problems/3sum/)
- Two Pointer Technique: Common pattern for sorted arrays
- Hash Set/Dictionary: Useful for membership testing in O(1) average time
