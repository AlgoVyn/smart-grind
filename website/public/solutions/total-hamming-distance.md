# Total Hamming Distance

## Problem Description
The Hamming distance between two integers is the number of positions at which the corresponding bits are different.
Given an integer array nums, return the sum of Hamming distances between all the pairs of the integers in nums.
 
Example 1:

Input: nums = [4,14,2]
Output: 6
Explanation: In binary representation, the 4 is 0100, 14 is 1110, and 2 is 0010 (just
showing the four bits relevant in this case).
The answer will be:
HammingDistance(4, 14) + HammingDistance(4, 2) + HammingDistance(14, 2) = 2 + 2 + 2 = 6.

Example 2:

Input: nums = [4,14,4]
Output: 4

 
Constraints:

1 <= nums.length <= 104
0 <= nums[i] <= 109
The answer for the given input will fit in a 32-bit integer.
## Solution

```python
from typing import List

class Solution:
    def totalHammingDistance(self, nums: List[int]) -> int:
        total = 0
        n = len(nums)
        for i in range(32):
            count = 0
            for num in nums:
                if num & (1 << i):
                    count += 1
            total += count * (n - count)
        return total
```

## Explanation
This problem requires summing Hamming distances between all pairs.

### Step-by-Step Approach:
1. **Bit by Bit**: For each of 32 bits, count how many numbers have that bit set.

2. **Distance for Bit**: For each bit, distance contribution is count1 * count0.

3. **Sum**: Add for all bits.

### Time Complexity:
- O(n * 32), since n <= 10^4.

### Space Complexity:
- O(1).
