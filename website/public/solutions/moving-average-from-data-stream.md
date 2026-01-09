# Moving Average From Data Stream

## Problem Description

Given a stream of integers and a window size, calculate the moving average of all integers in the sliding window.

Implement the `MovingAverage` class:

- `MovingAverage(int size)` Initializes the object with the size of the window size.
- `double next(int val)` Returns the moving average of the last size values of the stream.

## Examples

**Input:**
```python
["MovingAverage", "next", "next", "next", "next"]
[[3], [1], [10], [3], [5]]
```

**Output:**
```python
[null, 1.0, 5.5, 4.66667, 6.0]
```

**Explanation:**
```python
MovingAverage movingAverage = new MovingAverage(3);
movingAverage.next(1);  // return 1.0 = 1 / 1
movingAverage.next(10); // return 5.5 = (1 + 10) / 2
movingAverage.next(3);  // return 4.66667 = (1 + 10 + 3) / 3
movingAverage.next(5);  // return 6.0 = (10 + 3 + 5) / 3
```

## Constraints

- `1 <= size <= 1000`
- `-10^5 <= val <= 10^5`
- At most `10^4` calls will be made to `next`

## Solution

```python
from collections import deque

class MovingAverage:
    def __init__(self, size: int):
        """
        Initialize the moving average data structure.
        
        Uses a queue to store the last k elements and maintains
        a running sum for O(1) average calculation.
        """
        self.size = size
        self.queue = deque()
        self.sum = 0
    
    def next(self, val: int) -> float:
        """
        Add a new value and return the moving average.
        
        Maintains a fixed-size window of recent values.
        """
        self.queue.append(val)
        self.sum += val
        
        # Remove oldest element if window is full
        if len(self.queue) > self.size:
            self.sum -= self.queue.popleft()
        
        return self.sum / len(self.queue)
```

## Explanation

This problem requires calculating the moving average of the last `k` elements in a data stream.

### Algorithm Steps

1. **Queue data structure**: Use a deque to store the last `k` elements.

2. **Running sum**: Maintain a running sum for O(1) average calculation.

3. **Next operation**:
   - Add new value to queue and sum
   - If queue exceeds size, remove oldest element and subtract from sum
   - Return `sum / current_queue_size`

## Complexity Analysis

- **Time Complexity:** O(1) amortized for each `next` operation
- **Space Complexity:** O(k), for the queue
