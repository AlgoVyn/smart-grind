# Contains Duplicate Ii

## Problem Description
Given an integer array nums and an integer k, return true if there are two distinct indices i and j in the array such that nums[i] == nums[j] and abs(i - j) <= k.

## Examples

**Example 1:**

**Input:**
```python
nums = [1,2,3,1], k = 3
```

**Output:**
```python
true
```

**Example 2:**

**Input:**
```python
nums = [1,0,1,1], k = 1
```

**Output:**
```python
true
```

**Example 3:**

**Input:**
```python
nums = [1,2,3,1,2,3], k = 2
```

**Output:**
```python
false
```

## Constraints

- `1 <= nums.length <= 10^5`
- `-10^9 <= nums[i] <= 10^9`
- `0 <= k <= 10^5`

## Solution

```python
from typing import List

class Solution:
    def containsNearbyDuplicate(self, nums: List[int], k: int) -> bool:
        seen = set()
        for i, num in enumerate(nums):
            if num in seen:
                return True
            seen.add(num)
            if len(seen) > k:
                seen.remove(nums[i - k])
        return False
```

## Explanation
This solution checks if there are any duplicates within distance k. Use a sliding window set to keep track of the last k elements. For each number, if it's already in the set, return true. Add it to the set, and if the set size exceeds k, remove the oldest element.

## Time Complexity
**O(n)**, as each element is added and removed at most once.

## Space Complexity
**O(min(n, k))**, for the set.
