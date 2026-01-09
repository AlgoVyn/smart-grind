# Distant Barcodes

## Problem Description
In a warehouse, there is a row of barcodes, where the ith barcode is barcodes[i].
Rearrange the barcodes so that no two adjacent barcodes are equal. You may return any answer, and it is guaranteed an answer exists.
 
Example 1:
Input: barcodes = [1,1,1,2,2,2]
Output: [2,1,2,1,2,1]
Example 2:
Input: barcodes = [1,1,1,1,2,2,3,3]
Output: [1,3,1,3,1,2,1,2]

 
Constraints:

1 <= barcodes.length <= 10000
1 <= barcodes[i] <= 10000
## Solution

```python
from typing import List
import heapq
from collections import Counter

class Solution:
    def rearrangeBarcodes(self, barcodes: List[int]) -> List[int]:
        count = Counter(barcodes)
        heap = [(-c, b) for b, c in count.items()]
        heapq.heapify(heap)
        result = []
        while heap:
            neg_count, num = heapq.heappop(heap)
            if result and result[-1] == num:
                if not heap:
                    break  # impossible, but guaranteed
                neg_count2, num2 = heapq.heappop(heap)
                result.append(num2)
                if neg_count2 + 1 < 0:
                    heapq.heappush(heap, (neg_count2 + 1, num2))
                heapq.heappush(heap, (neg_count, num))
            else:
                result.append(num)
                if neg_count + 1 < 0:
                    heapq.heappush(heap, (neg_count + 1, num))
        return result
```

## Explanation
Use a max heap (with negative counts) to always pick the most frequent barcode. If it matches the last in result, pick the next most frequent instead, and push back the first one.

Decrement counts and push back if still >0.

Time complexity: O(n log k) where k is number of unique barcodes.

Space complexity: O(n + k)
