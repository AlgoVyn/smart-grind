# Moving Average from Data Stream

## Problem Description

Given a stream of integers and a window size `size`, return the moving average of the last `size` values of the stream.

Implement the `MovingAverage` class:

- `MovingAverage(int size)`: Initializes the object with the window size `size`.
- `double next(int val)`: Returns the next value of the moving average of the last `size` values.

---

## Examples

**Example 1:**

**Input:**
```python
["MovingAverage", "next", "next", "next", "next"]
[[3], [1], [10], [3], [5]]
```

**Output:**
```python
[null, 1.0, 5.5, 4.666666666666667, 6.0]
```

**Explanation:**
```python
MovingAverage movingAverage = new MovingAverage(3);
movingAverage.next(1);    // 1.0
movingAverage.next(10);   // (1 + 10) / 2 = 5.5
movingAverage.next(3);    // (1 + 10 + 3) / 3 = 4.666...
movingAverage.next(5);    // (10 + 3 + 5) / 3 = 6.0
```

**Example 2:**

**Input:**
```python
["MovingAverage", "next", "next", "next", "next", "next"]
[[5], [1], [2], [3], [4], [5]]
```

**Output:**
```python
[null, 1.0, 1.5, 2.0, 3.0, 4.0]
```

**Explanation:**
```python
MovingAverage movingAverage = new MovingAverage(5);
movingAverage.next(1);    // 1.0
movingAverage.next(2);    // (1 + 2) / 2 = 1.5
movingAverage.next(3);    // (1 + 2 + 3) / 3 = 2.0
movingAverage.next(4);    // (1 + 2 + 3 + 4) / 4 = 3.0
movingAverage.next(5);    // (1 + 2 + 3 + 4 + 5) / 5 = 4.0
```

---

## Constraints

- `1 <= size <= 100`
- `1 <= val <= 100`
- At most 10^4 calls will be made to `next`.

---

## Solution 1: Simple Queue Approach

### Intuition

The most straightforward approach is to maintain a queue that stores the last `size` values. For each new value:
1. Add it to the queue.
2. If the queue size exceeds `size`, remove the oldest element.
3. Calculate the average by summing all elements in the queue and dividing by the queue size.

### Algorithm

```python
from collections import deque

class MovingAverage:

    def __init__(self, size: int):
        self.size = size
        self.queue = deque()
        self.sum = 0

    def next(self, val: int) -> float:
        self.queue.append(val)
        self.sum += val
        if len(self.queue) > self.size:
            removed = self.queue.popleft()
            self.sum -= removed
        return self.sum / len(self.queue)
```

### Explanation

1. **Initialization**: Create a deque to store the values and initialize `sum` to 0.
2. **next(val)**:
   - Append the new value to the queue.
   - Add the value to `sum`.
   - If the queue size exceeds `size`, remove the oldest element (from the left) and subtract it from `sum`.
   - Return the average: `sum / len(queue)`.

### Complexity Analysis

| Metric | Complexity |
|--------|------------|
| Time (next) | **O(1)** - All operations are O(1) |
| Space | **O(size)** - Storing at most `size` elements |

---

## Solution 2: Circular Buffer (Optimization for Large Window Size)

### Intuition

When the window size is very large (up to 10^5 or more), using a deque with O(size) space might be inefficient. We can use a circular buffer (array with two pointers) to achieve O(1) space per element while maintaining O(1) time operations.

### Algorithm

```python
from typing import List

class MovingAverage:

    def __init__(self, size: int):
        self.size = size
        self.window = [0] * size
        self.head = 0
        self.count = 0
        self.sum = 0

    def next(self, val: int) -> float:
        self.sum += val
        self.window[self.head] = val
        self.head = (self.head + 1) % self.size
        
        if self.count < self.size:
            self.count += 1
        else:
            # Window is full, remove the oldest element
            tail = (self.head) % self.size
            self.sum -= self.window[tail]
        
        return self.sum / self.count
```

### Explanation

1. **Initialization**: Create an array of fixed `size`, initialize pointers and counters.
2. **next(val)**:
   - Add the new value to `sum`.
   - Store the value at the current head position.
   - Move the head pointer circularly.
   - If the window is full, remove the oldest element (at the tail position) from `sum`.
   - Return the average.

### Complexity Analysis

| Metric | Complexity |
|--------|------------|
| Time (next) | **O(1)** |
| Space | **O(size)** - Fixed size array |

---

## Solution 3: Using Only Sum (No Storage)

### Intuition

If we only need the moving average and don't need to access individual elements, we can store only the sum and use a queue for element removal.

### Algorithm

```python
from collections import deque

class MovingAverage:

    def __init__(self, size: int):
        self.size = size
        self.queue = deque()
        self.running_sum = 0

    def next(self, val: int) -> float:
        self.running_sum += val
        self.queue.append(val)
        
        if len(self.queue) > self.size:
            self.running_sum -= self.queue.popleft()
        
        return self.running_sum / len(self.queue)
```

### Explanation

This is essentially the same as Solution 1, with a slightly cleaner implementation by maintaining a running sum.

### Complexity Analysis

| Metric | Complexity |
|--------|------------|
| Time (next) | **O(1)** |
| Space | **O(size)** |

---

## Solution 4: Lazy Evaluation (For Read-Heavy Workloads)

### Intuition

If `next()` is called less frequently than updates, we can avoid calculating the average until it's requested.

### Algorithm

```python
from collections import deque

class MovingAverage:

    def __init__(self, size: int):
        self.size = size
        self.queue = deque()
        self.sum = 0
        self.dirty = True
        self.cached_avg = 0

    def next(self, val: int) -> float:
        self.queue.append(val)
        self.sum += val
        
        if len(self.queue) > self.size:
            self.sum -= self.queue.popleft()
            self.dirty = True
        
        if self.dirty:
            self.cached_avg = self.sum / len(self.queue)
            self.dirty = False
        
        return self.cached_avg
```

### Complexity Analysis

| Metric | Complexity |
|--------|------------|
| Time (next) | **O(1)** amortized |
| Space | **O(size)** |

---

## Comparison of Approaches

| Approach | Time (next) | Space | Pros | Cons |
|----------|-------------|-------|------|------|
| Simple Queue | O(1) | O(size) | Simple, readable | O(size) space |
| Circular Buffer | O(1) | O(size) | Memory efficient, cache friendly | More complex |
| Running Sum | O(1) | O(size) | Clean code | Same as queue |
| Lazy Evaluation | O(1) amortized | O(size) | Good for read-heavy | Slight overhead |

---

## Related Problems

1. **[Design Hit Counter](/solutions/design-hit-counter.md)** - Similar sliding window problem
2. **[Find Median from Data Stream](/solutions/find-median-from-data-stream.md)** - Data stream statistics
3. **[Continuous Subarrays](/solutions/continuous-subarrays.md)** - Sliding window with subarray sums
4. **[Maximum Average Subarray](/solutions/maximum-average-subarray.md)** - Finding maximum average subarray

---

## Video Tutorials

1. [Moving Average from Data Stream - LeetCode 346](https://www.youtube.com/watch?v=)
2. [Sliding Window Technique Explained](https://www.youtube.com/watch?v=)
3. [Queue Implementation in Python](https://www.youtube.com/watch?v=)

---

## Additional Notes

- The running sum optimization is crucial for performance in large data streams.
- The circular buffer approach is particularly useful when memory is constrained.
- Always consider the constraints on `size` and the number of operations when choosing an approach.
- For very large window sizes, consider using a more memory-efficient data structure like a circular buffer.

---

## Follow-up Questions

1. How would you modify the solution to handle a variable window size?
2. Can you implement a weighted moving average where recent values have more importance?
3. How would you extend this to support multiple moving averages with different window sizes simultaneously?

