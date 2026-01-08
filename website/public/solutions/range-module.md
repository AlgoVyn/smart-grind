# Range Module

## Problem Description
[Link to problem](https://leetcode.com/problems/range-module/)

A Range Module is a module that tracks ranges of numbers. Design a data structure to track the ranges represented as half-open intervals and query about them.
A half-open interval [left, right) denotes all the real numbers x where left <= x < right.
Implement the RangeModule class:

RangeModule() Initializes the object of the data structure.
void addRange(int left, int right) Adds the half-open interval [left, right), tracking every real number in that interval. Adding an interval that partially overlaps with currently tracked numbers should add any numbers in the interval [left, right) that are not already tracked.
boolean queryRange(int left, int right) Returns true if every real number in the interval [left, right) is currently being tracked, and false otherwise.
void removeRange(int left, int right) Stops tracking every real number currently being tracked in the half-open interval [left, right).

 
Example 1:

Input
["RangeModule", "addRange", "removeRange", "queryRange", "queryRange", "queryRange"]
[[], [10, 20], [14, 16], [10, 14], [13, 15], [16, 17]]
Output
[null, null, null, true, false, true]

Explanation
RangeModule rangeModule = new RangeModule();
rangeModule.addRange(10, 20);
rangeModule.removeRange(14, 16);
rangeModule.queryRange(10, 14); // return True,(Every number in [10, 14) is being tracked)
rangeModule.queryRange(13, 15); // return False,(Numbers like 14, 14.03, 14.17 in [13, 15) are not being tracked)
rangeModule.queryRange(16, 17); // return True, (The number 16 in [16, 17) is still being tracked, despite the remove operation)

 
Constraints:

1 <= left < right <= 109
At most 104 calls will be made to addRange, queryRange, and removeRange.


## Solution

```python
from sortedcontainers import SortedList
class RangeModule:

    def __init__(self):
        self.intervals = SortedList()

    def addRange(self, left: int, right: int) -> None:
        i = self.intervals.bisect_left((left, float('inf')))
        while i < len(self.intervals) and self.intervals[i][0] <= right:
            left = min(left, self.intervals[i][0])
            right = max(right, self.intervals[i][1])
            self.intervals.pop(i)
        self.intervals.add((left, right))

    def queryRange(self, left: int, right: int) -> bool:
        i = self.intervals.bisect_left((left, float('inf')))
        if i > 0:
            prev = self.intervals[i-1]
            if prev[1] >= right:
                return True
        if i < len(self.intervals):
            curr = self.intervals[i]
            if curr[0] <= left and curr[1] >= right:
                return True
        return False

    def removeRange(self, left: int, right: int) -> None:
        i = self.intervals.bisect_left((left, float('inf')))
        while i < len(self.intervals) and self.intervals[i][0] < right:
            curr = self.intervals[i]
            if curr[0] < left:
                self.intervals.add((curr[0], left))
            if curr[1] > right:
                self.intervals.add((right, curr[1]))
            self.intervals.pop(i)
```

## Explanation
Use SortedList to maintain sorted intervals. Add merges overlapping, query checks coverage, remove splits intervals.

Time complexity: O(log n) per operation, Space O(n).
