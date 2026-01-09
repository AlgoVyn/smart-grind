# Finding Mk Average

## Problem Description

You are given two integers, m and k, and a stream of integers. You are tasked to implement a data structure that calculates the MKAverage for the stream.
The MKAverage can be calculated using these steps:
- If the number of the elements in the stream is less than m you should consider the MKAverage to be -1. Otherwise, copy the last m elements of the stream to a separate container.
- Remove the smallest k elements and the largest k elements from the container.
- Calculate the average value for the rest of the elements rounded down to the nearest integer.

Implement the MKAverage class:
- MKAverage(int m, int k) Initializes the MKAverage object with an empty stream and the two integers m and k.
- void addElement(int num) Inserts a new element num into the stream.
- int calculateMKAverage() Calculates and returns the MKAverage for the current stream rounded down to the nearest integer.

### Examples

**Example 1:**

**Input:**
```
["MKAverage", "addElement", "addElement", "calculateMKAverage", "addElement", "calculateMKAverage", "addElement", "addElement", "addElement", "calculateMKAverage"]
[[3, 1], [3], [1], [], [10], [], [5], [5], [5], []]
```

**Output:**
```
[null, null, null, -1, null, 3, null, null, null, 5]
```

**Explanation:**
```
MKAverage obj = new MKAverage(3, 1);
obj.addElement(3);        // current elements are [3]
obj.addElement(1);        // current elements are [3,1]
obj.calculateMKAverage(); // return -1, because m = 3 and only 2 elements exist.
obj.addElement(10);       // current elements are [3,1,10]
obj.calculateMKAverage(); // The last 3 elements are [3,1,10].
                          // After removing smallest and largest 1 element the container will be [3].
                          // The average of [3] equals 3/1 = 3, return 3
obj.addElement(5);        // current elements are [3,1,10,5]
obj.addElement(5);        // current elements are [3,1,10,5,5]
obj.addElement(5);        // current elements are [3,1,10,5,5,5]
obj.calculateMKAverage(); // The last 3 elements are [5,5,5].
                          // After removing smallest and largest 1 element the container will be [5].
                          // The average of [5] equals 5/1 = 5, return 5
```

### Constraints

- 3 <= m <= 10^5
- 1 < k*2 < m
- 1 <= num <= 10^5
- At most 10^5 calls will be made to addElement and calculateMKAverage.

## Solution

```python
from typing import List
from collections import deque

class MKAverage:
    def __init__(self, m: int, k: int):
        self.m = m
        self.k = k
        self.stream = deque()
    
    def addElement(self, num: int) -> None:
        self.stream.append(num)
        if len(self.stream) > self.m:
            self.stream.popleft()
    
    def calculateMKAverage(self) -> int:
        if len(self.stream) < self.m:
            return -1
        lst = sorted(self.stream)
        total = sum(lst[self.k : self.m - self.k])
        return total // (self.m - 2 * self.k)
```

### Approach

This problem requires implementing a data structure to calculate the MK average for a stream of numbers, considering the last m elements, removing the smallest and largest k, and averaging the rest.

1. **Data structure:**
   - Use a deque to maintain the last m elements of the stream.
   - When adding an element, append to the deque; if size exceeds m, remove the oldest.

2. **Calculate MK average:**
   - If fewer than m elements, return -1.
   - Sort the current m elements.
   - Sum the elements from index k to m-k-1 (excluding smallest and largest k).
   - Return the integer division of the sum by (m - 2*k).

3. **Efficiency considerations:**
   - Sorting takes O(m log m), acceptable since m <= 10^5 and calls <= 10^5, but may be tight in Python.

### Complexity

**Time Complexity:** addElement O(1), calculateMKAverage O(m log m) for sorting.

**Space Complexity:** O(m) for the deque.
