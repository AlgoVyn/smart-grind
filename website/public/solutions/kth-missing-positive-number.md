# Kth Missing Positive Number

## Problem Description
Given an array arr of positive integers sorted in a strictly increasing order, and an integer k.
Return the kth positive integer that is missing from this array.
 
Example 1:

Input: arr = [2,3,4,7,11], k = 5
Output: 9
Explanation: The missing positive integers are [1,5,6,8,9,10,12,13,...]. The 5th missing positive integer is 9.

Example 2:

Input: arr = [1,2,3,4], k = 2
Output: 6
Explanation: The missing positive integers are [5,6,7,...]. The 2nd missing positive integer is 6.

 
Constraints:

1 <= arr.length <= 1000
1 <= arr[i] <= 1000
1 <= k <= 1000
arr[i] < arr[j] for 1 <= i < j <= arr.length

 
Follow up:
Could you solve this problem in less than O(n) complexity?
## Solution

```python
from typing import List

class Solution:
    def findKthPositive(self, arr: List[int], k: int) -> int:
        left, right = 0, len(arr)
        while left < right:
            mid = (left + right) // 2
            missing = arr[mid] - (mid + 1)
            if missing < k:
                left = mid + 1
            else:
                right = mid
        return left + k
```

## Explanation
We use binary search to find the smallest index where the number of missing positive integers up to that index is at least k.

At each mid, calculate missing = arr[mid] - (mid + 1), which is the count of missing numbers before arr[mid].

If missing < k, we need more missing numbers, so search in the right half. Otherwise, search left.

After the loop, left is the index where the kth missing occurs. The kth missing positive is left + k.

Time complexity: O(log n), where n is the length of arr, due to binary search.
Space complexity: O(1), using constant space.
