# Count Triplets That Can Form Two Arrays Of Equal Xor

## Problem Description
Given an array of integers arr.
We want to select three indices i, j and k where (0 <= i < j <= k < arr.length).
Let's define a and b as follows:

a = arr[i] ^ arr[i + 1] ^ ... ^ arr[j - 1]
b = arr[j] ^ arr[j + 1] ^ ... ^ arr[k]

Note that ^ denotes the bitwise-xor operation.
Return the number of triplets (i, j and k) Where a == b.

---

## Examples

**Example 1:**

**Input:**
```python
arr = [2,3,1,6,7]
```

**Output:**
```python
4
```

**Explanation:** The triplets are (0,1,2), (0,2,2), (2,3,4) and (2,4,4)

**Example 2:**

**Input:**
```python
arr = [1,1,1,1,1]
```

**Output:**
```python
10
```

---

## Constraints

- `1 <= arr.length <= 300`
- `1 <= arr[i] <= 10^8`

---

## Solution

```python
from typing import List

class Solution:
    def countTriplets(self, arr: List[int]) -> int:
        n = len(arr)
        prefix = [0] * (n + 1)
        for i in range(n):
            prefix[i + 1] = prefix[i] ^ arr[i]
        
        count = 0
        for i in range(n):
            for k in range(i + 1, n):
                if prefix[i] == prefix[k + 1]:
                    count += (k - i)
        return count
```

---

## Explanation
The condition a == b simplifies to the XOR from i to k being zero, i.e., prefix[k+1] ^ prefix[i] == 0, or prefix[i] == prefix[k+1].

1. Compute the prefix XOR array where prefix[0] = 0, and prefix[i+1] = prefix[i] ^ arr[i].
2. For each pair i < k, check if prefix[i] == prefix[k+1]. If yes, then for each j from i+1 to k, the triplet (i, j, k) satisfies the condition, so add (k - i) to the count.
3. Return the total count.

---

## Time Complexity
**O(n^2)**, acceptable since n <= 300.

---

## Space Complexity
**O(n)**, for the prefix array.
