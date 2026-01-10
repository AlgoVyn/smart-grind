# Smallest Number in Infinite Set

## Problem Description

Design a data structure that contains all positive integers starting from 1. Support two operations:

1. `popSmallest()` — Remove and return the smallest number in the set
2. `addBack(num)` — Add a number back to the set if it was previously removed

---

## Examples

**Example 1:**
```python
Operations: ["SmallestInfiniteSet", "addBack", "popSmallest", "popSmallest", "popSmallest", "addBack", "popSmallest", "popSmallest", "popSmallest"]
Arguments: [[], [2], [], [], [], [1], [], [], []]
Output: [null, null, 1, 2, 3, null, 1, 4, 5]
```

---

## Constraints

| Constraint | Description |
|------------|-------------|
| `1 <= num <= 1000` | Number value |
| At most 1000 calls | Total to `popSmallest` and `addBack` |

---

## Solution

```python
import heapq

class SmallestInfiniteSet:
    def __init__(self):
        self.heap = []           # Min-heap for added-back numbers
        self.present = set()     # Track numbers in heap
        self.next = 1            # Next number to pop if heap empty

    def popSmallest(self) -> int:
        if self.heap:
            num = heapq.heappop(self.heap)
            self.present.remove(num)
            return num
        else:
            num = self.next
            self.next += 1
            return num

    def addBack(self, num: int) -> None:
        if num >= self.next or num in self.present:
            return
        heapq.heappush(self.heap, num)
        self.present.add(num)
```

---

## Explanation

### Data Structures

| Structure | Purpose |
|-----------|---------|
| Min-heap | Store numbers that were popped and added back |
| Set | Track numbers in heap for O(1) lookup |
| Integer `next` | Next number to pop from infinite sequence |

### Time Complexity

| Operation | Time |
|-----------|------|
| `popSmallest()` | O(log n) |
| `addBack()` | O(log n) |

### Space Complexity

- **O(n)** — Heap and set store at most n elements

---

## Related Problems

- [Smallest Number in Infinite Set](https://leetcode.com/problems/smallest-number-in-infinite-set/)
