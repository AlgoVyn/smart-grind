# Find Median From Data Stream

## Problem Description

The median is the middle value in an ordered integer list. If the size of the list is even, there is no middle value, and the median is the mean of the two middle values.

For example, for arr = [2,3,4], the median is 3.
For example, for arr = [2,3], the median is (2 + 3) / 2 = 2.5.

Implement the MedianFinder class:

- `MedianFinder()` initializes the MedianFinder object.
- `void addNum(int num)` adds the integer num from the data stream to the data structure.
- `double findMedian()` returns the median of all elements so far. Answers within 10^-5 of the actual answer will be accepted.

### Examples

**Example 1:**

**Input:**
```
["MedianFinder", "addNum", "addNum", "findMedian", "addNum", "findMedian"]
[[], [1], [2], [], [3], []]
```

**Output:**
```
[null, null, null, 1.5, null, 2.0]
```

**Explanation:**
```
MedianFinder medianFinder = new MedianFinder();
medianFinder.addNum(1);    // arr = [1]
medianFinder.addNum(2);    // arr = [1, 2]
medianFinder.findMedian(); // return 1.5 (i.e., (1 + 2) / 2)
medianFinder.addNum(3);    // arr[1, 2, 3]
medianFinder.findMedian(); // return 2.0
```

### Constraints

- -10^5 <= num <= 10^5
- There will be at least one element in the data structure before calling `findMedian`.
- At most 5 * 10^4 calls will be made to `addNum` and `findMedian`.

### Follow up

If all integer numbers from the stream are in the range [0, 100], how would you optimize your solution?
If 99% of all integer numbers from the stream are in the range [0, 100], how would you optimize your solution?

## Solution

```python
import heapq

class MedianFinder:

    def __init__(self):
        self.small = []  # max-heap for lower half (negated)
        self.large = []  # min-heap for upper half

    def addNum(self, num: int) -> None:
        heapq.heappush(self.small, -num)
        heapq.heappush(self.large, -heapq.heappop(self.small))
        if len(self.large) > len(self.small):
            heapq.heappush(self.small, -heapq.heappop(self.large))

    def findMedian(self) -> float:
        if len(self.small) > len(self.large):
            return -self.small[0]
        else:
            return (-self.small[0] + self.large[0]) / 2
```

## Explanation

To efficiently find the median in a stream of numbers, we use two heaps: a max-heap for the lower half of the numbers and a min-heap for the upper half.

1. Initialize two heaps: `small` as a max-heap (using negative values) for the lower half, and `large` as a min-heap for the upper half.

2. In `addNum(num)`:
   - Push the number onto the max-heap (negated).
   - Pop the largest from max-heap and push onto min-heap (negated back).
   - If min-heap has more elements than max-heap, move the smallest from min-heap back to max-heap.
   - This keeps the max-heap size equal to or one more than the min-heap size.

3. In `findMedian()`:
   - If max-heap has more elements, the median is the top of max-heap (negated back).
   - Otherwise, average the tops of both heaps.

This ensures balanced heaps and O(log n) time for addNum and O(1) for findMedian.

### Complexity

**Time Complexity:** O(log n) for addNum, O(1) for findMedian.

**Space Complexity:** O(n) for storing all numbers.
