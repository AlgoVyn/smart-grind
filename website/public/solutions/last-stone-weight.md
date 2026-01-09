# Last Stone Weight

## Problem Description

You are given an array of integers `stones` where `stones[i]` is the weight of the `ith` stone.

We are playing a game with the stones. On each turn, we **choose the heaviest two stones** and smash them together. Suppose the heaviest two stones have weights `x` and `y` with `x <= y`. The result of this smash is:

- If `x == y`, **both stones are destroyed**
- If `x != y`, the stone of weight `x` is destroyed, and the stone of weight `y` has new weight `y - x`

At the end of the game, there is **at most one stone left**. Return the weight of the last remaining stone. If there are no stones left, return `0`.

### Examples

**Example 1:**
```
Input: stones = [2,7,4,1,8,1]
Output: 1
```
1. Combine 7 and 8 to get 1 → `[2,4,1,1,1]`
2. Combine 2 and 4 to get 2 → `[2,1,1,1]`
3. Combine 2 and 1 to get 1 → `[1,1,1]`
4. Combine 1 and 1 to get 0 → `[1]`
5. Last stone weight = 1

**Example 2:**
```
Input: stones = [1]
Output: 1
```

### Constraints

- `1 <= stones.length <= 30`
- `1 <= stones[i] <= 1000`

## Solution

```python
import heapq
from typing import List

class Solution:
    def lastStoneWeight(self, stones: List[int]) -> int:
        stones = [-s for s in stones]
        heapq.heapify(stones)
        while len(stones) > 1:
            y = -heapq.heappop(stones)
            x = -heapq.heappop(stones)
            if x != y:
                heapq.heappush(stones, -(y - x))
        return -stones[0] if stones else 0
```

## Explanation

We use a **max-heap** to always access the two heaviest stones. Since Python's `heapq` is a min-heap, we **negate** the values.

While there are at least two stones:
1. Pop the two largest (negated, so smallest in heap)
2. Compute the difference if not equal
3. Push back the new stone (negated)

At the end, if stones left, return its weight; otherwise, return `0`.

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time**   | `O(n log n)` — due to heap operations |
| **Space**  | `O(n)` — for the heap |
