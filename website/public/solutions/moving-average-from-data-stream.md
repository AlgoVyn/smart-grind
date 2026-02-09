# Moving Average from Data Stream

## Problem Statement

Given a stream of integers and a window size `size`, calculate the moving average of all integers in the sliding window.

Implement the `MovingAverage` class:

- `MovingAverage(size)` Initializes the object with the window size `size`.
- `next(val)` Returns the moving average of the last `size` elements in the stream. If there are fewer than `size` elements, include all of them in the average.

---

### Input Format

- `int size`: The window size for the moving average.
- `int val`: The next integer value to add to the stream.

### Output Format

- `double`: The moving average value after adding the new element.

### Constraints

- `1 <= size <= 100`
- `1 <= val <= 1000`
- At most `10^4` calls will be made to `next()`.

---

## Examples

### Example 1

**Input:**
```python
movingAverage = MovingAverage(3)
print(movingAverage.next(1))   # 1.0
print(movingAverage.next(10))  # (1 + 10) / 2 = 5.5
print(movingAverage.next(3))   # (1 + 10 + 3) / 3 = 4.67
print(movingAverage.next(5))   # (10 + 3 + 5) / 3 = 6.0
```

**Output:**
```
1.0
5.5
4.66667
6.0
```

**Explanation:**
- After first call: [1] → avg = 1.0
- After second call: [1, 10] → avg = (1 + 10) / 2 = 5.5
- After third call: [1, 10, 3] → avg = (1 + 10 + 3) / 3 = 4.67
- After fourth call: [10, 3, 5] → avg = (10 + 3 + 5) / 3 = 6.0

---

### Example 2

**Input:**
```python
movingAverage = MovingAverage(5)
print(movingAverage.next(1))   # 1.0
print(movingAverage.next(2))    # (1 + 2) / 2 = 1.5
print(movingAverage.next(3))    # (1 + 2 + 3) / 3 = 2.0
print(movingAverage.next(4))    # (1 + 2 + 3 + 4) / 4 = 2.5
print(movingAverage.next(5))    # (1 + 2 + 3 + 4 + 5) / 5 = 3.0
print(movingAverage.next(6))    # (2 + 3 + 4 + 5 + 6) / 5 = 4.0
```

**Output:**
```
1.0
1.5
2.0
2.5
3.0
4.0
```

**Explanation:**
- Window fills up from 1 to 5 elements
- After the 6th element, the window slides to [2, 3, 4, 5, 6]

---

### Example 3

**Input:**
```python
movingAverage = MovingAverage(1)
print(movingAverage.next(10))   # 10.0
print(movingAverage.next(20))    # 20.0
print(movingAverage.next(30))    # 30.0
```

**Output:**
```
10.0
20.0
30.0
```

**Explanation:**
- Window size is 1, so each call returns the most recent element.

---

## Intuition

The moving average problem is about efficiently computing the average of a sliding window of numbers. The naive approach would be to:

1. Add the new number to a list
2. If the list exceeds `size`, remove the oldest element
3. Sum all elements and divide by the window size

However, this approach has O(`size`) time complexity per `next()` call because we need to sum all elements in the window each time.

The key insight is to maintain a running sum and update it incrementally:
- When adding a new value, add it to the running sum
- When the window is full and we're adding a new value, subtract the oldest value from the running sum
- The average is simply `running_sum / current_window_size`

This reduces the time complexity to O(1) per operation.

---

## Multiple Approaches with Code

We'll cover three approaches:

1. **Simple Queue with Running Sum** - Maintain a queue to track window elements and a running sum
2. **Circular Buffer (Optimized)** - Use a fixed-size array with a circular pointer
3. **Double-ended Queue (Deque)** - Use collections.deque for automatic element removal

---

### Approach 1: Simple Queue with Running Sum

#### Algorithm Steps

1. Initialize `size` (window size) and `window_sum` (running sum)
2. Initialize an empty queue to store the elements in the current window
3. When `next(val)` is called:
   - Add `val` to the running sum
   - Push `val` to the queue
   - If queue size exceeds `size`, pop the oldest element and subtract it from `running_sum`
   - Return `running_sum / queue.size()`

#### Code Implementation

````carousel
```python
from collections import deque
from typing import Double

class MovingAverage:
    def __init__(self, size: int):
        self.size = size
        self.window = deque()
        self.sum = 0.0

    def next(self, val: int) -> float:
        self.sum += val
        self.window.append(val)
        
        if len(self.window) > self.size:
            removed = self.window.popleft()
            self.sum -= removed
        
        return self.sum / len(self.window)
```

<!-- slide -->
```cpp
#include <queue>

class MovingAverage {
private:
    int size;
    std::queue<int> window;
    double sum;
    
public:
    MovingAverage(int size) : size(size), sum(0.0) {}
    
    double next(int val) {
        sum += val;
        window.push(val);
        
        if (window.size() > size) {
            sum -= window.front();
            window.pop();
        }
        
        return sum / window.size();
    }
};
```

<!-- slide -->
```java
import java.util.Queue;
import java.util.LinkedList;

class MovingAverage {
    private int size;
    private Queue<Integer> window;
    private double sum;
    
    public MovingAverage(int size) {
        this.size = size;
        this.window = new LinkedList<>();
        this.sum = 0.0;
    }
    
    public double next(int val) {
        sum += val;
        window.offer(val);
        
        if (window.size() > size) {
            sum -= window.poll();
        }
        
        return sum / window.size();
    }
}
```

<!-- slide -->
```javascript
class MovingAverage {
    constructor(size) {
        this.size = size;
        this.window = [];
        this.sum = 0;
    }
    
    next(val) {
        this.sum += val;
        this.window.push(val);
        
        if (this.window.length > this.size) {
            this.sum -= this.window.shift();
        }
        
        return this.sum / this.window.length;
    }
}
```
````

#### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(1) per `next()` call - constant time operations |
| **Space** | O(size) for storing the window elements |

---

### Approach 2: Circular Buffer (Optimized)

#### Algorithm Steps

1. Pre-allocate an array of size `size` to store elements
2. Use a pointer (`head`) to track the oldest element position
3. Use a count variable to track current window size
4. When `next(val)` is called:
   - Calculate the index: `(head + count) % size`
   - If window is full, subtract the element being overwritten from sum
   - Add new value to sum and store in array
   - Increment count (up to `size`)
   - Increment `head` if window is full
   - Return `sum / min(count, size)`

#### Code Implementation

````carousel
```python
from typing import List

class MovingAverage:
    def __init__(self, size: int):
        self.size = size
        self.window: List[float] = [0.0] * size
        self.head = 0
        self.count = 0
        self.sum = 0.0

    def next(self, val: int) -> float:
        idx = (self.head + self.count) % self.size
        
        if self.count < self.size:
            self.count += 1
        else:
            self.sum -= self.window[self.head]
            self.head = (self.head + 1) % self.size
        
        self.sum += val
        self.window[idx] = val
        
        return self.sum / self.count
```

<!-- slide -->
```cpp
#include <vector>

class MovingAverage {
private:
    int size;
    std::vector<int> window;
    int head;
    int count;
    double sum;
    
public:
    MovingAverage(int size) : size(size), window(size, 0), head(0), count(0), sum(0.0) {}
    
    double next(int val) {
        int idx = (head + count) % size;
        
        if (count < size) {
            count++;
        } else {
            sum -= window[head];
            head = (head + 1) % size;
        }
        
        sum += val;
        window[idx] = val;
        
        return sum / count;
    }
};
```

<!-- slide -->
```java
import java.util.ArrayList;
import java.util.List;

class MovingAverage {
    private int size;
    private List<Integer> window;
    private int head;
    private int count;
    private double sum;
    
    public MovingAverage(int size) {
        this.size = size;
        this.window = new ArrayList<>(size);
        for (int i = 0; i < size; i++) {
            window.add(0);
        }
        this.head = 0;
        this.count = 0;
        this.sum = 0.0;
    }
    
    public double next(int val) {
        int idx = (head + count) % size;
        
        if (count < size) {
            count++;
        } else {
            sum -= window.get(head);
            head = (head + 1) % size;
        }
        
        sum += val;
        window.set(idx, val);
        
        return sum / count;
    }
}
```

<!-- slide -->
```javascript
class MovingAverage {
    constructor(size) {
        this.size = size;
        this.window = new Array(size).fill(0);
        this.head = 0;
        this.count = 0;
        this.sum = 0;
    }
    
    next(val) {
        const idx = (this.head + this.count) % this.size;
        
        if (this.count < this.size) {
            this.count++;
        } else {
            this.sum -= this.window[this.head];
            this.head = (this.head + 1) % this.size;
        }
        
        this.sum += val;
        this.window[idx] = val;
        
        return this.sum / this.count;
    }
}
```
````

#### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(1) per `next()` call - constant time operations |
| **Space** | O(size) for the fixed-size array |

---

### Approach 3: Double-ended Queue (Deque)

#### Algorithm Steps

1. Use a deque to maintain the window elements
2. Maintain a running sum variable
3. When `next(val)` is called:
   - Add `val` to the running sum
   - Push `val` to the right of the deque
   - If deque size exceeds `size`, pop from the left and subtract from sum
   - Return `sum / deque.size()`

#### Code Implementation

````carousel
```python
from collections import deque
from typing import Deque

class MovingAverage:
    def __init__(self, size: int):
        self.size = size
        self.window: Deque[int] = deque()
        self.sum = 0.0

    def next(self, val: int) -> float:
        self.sum += val
        self.window.append(val)
        
        if len(self.window) > self.size:
            removed = self.window.popleft()
            self.sum -= removed
        
        return self.sum / len(self.window)
```

<!-- slide -->
```cpp
#include <deque>

class MovingAverage {
private:
    int size;
    std::deque<int> window;
    double sum;
    
public:
    MovingAverage(int size) : size(size), sum(0.0) {}
    
    double next(int val) {
        sum += val;
        window.push_back(val);
        
        if (window.size() > size) {
            sum -= window.front();
            window.pop_front();
        }
        
        return sum / window.size();
    }
};
```

<!-- slide -->
```java
import java.util.ArrayDeque;
import java.util.Deque;

class MovingAverage {
    private int size;
    private Deque<Integer> window;
    private double sum;
    
    public MovingAverage(int size) {
        this.size = size;
        this.window = new ArrayDeque<>();
        this.sum = 0.0;
    }
    
    public double next(int val) {
        sum += val;
        window.addLast(val);
        
        if (window.size() > size) {
            sum -= window.removeFirst();
        }
        
        return sum / window.size();
    }
}
```

<!-- slide -->
```javascript
class MovingAverage {
    constructor(size) {
        this.size = size;
        this.window = [];
        this.sum = 0;
    }
    
    next(val) {
        this.sum += val;
        this.window.push(val);
        
        if (this.window.length > this.size) {
            this.sum -= this.window.shift();
        }
        
        return this.sum / this.window.length;
    }
}
```
````

#### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(1) amortized per `next()` call |
| **Space** | O(size) for storing window elements |

---

### Comparison of Approaches

| Aspect | Simple Queue | Circular Buffer | Deque |
|--------|--------------|-----------------|-------|
| **Data Structure** | std::queue / deque | Fixed array | std::deque / ArrayDeque |
| **Time Complexity** | O(1) | O(1) | O(1) amortized |
| **Space Complexity** | O(size) | O(size) | O(size) |
| **Implementation** | Simple and readable | Memory efficient | Clean syntax |
| **Best For** | General use | Memory-constrained | Python/Java |
| **Dynamic Resizing** | Yes (implicit) | No (fixed) | Yes (implicit) |

All approaches achieve O(1) time complexity per operation. The choice depends on:
- **Simple Queue**: Most readable and intuitive
- **Circular Buffer**: Best memory efficiency (no dynamic allocation)
- **Deque**: Cleanest syntax in Python/Java

---

## Related Problems

Based on similar themes (sliding window, streaming data, running statistics):

- **[LeetCode 346: Moving Average from Data Stream](https://leetcode.com/problems/moving-average-from-data-stream/)** - This problem
- **[LeetCode 243: Shortest Word Distance](https://leetcode.com/problems/shortest-word-distance/)** - Sliding window approach
- **[LeetCode 239: Sliding Window Maximum](https://leetcode.com/problems/sliding-window-maximum/)** - Sliding window with deque optimization
- **[LeetCode 480: Sliding Window Median](https://leetcode.com/problems/sliding-window-median/)** - Advanced sliding window with two heaps
- **[LeetCode 438: Find All Anagrams in a String](https://leetcode.com/problems/find-all-anagrams-in-a-string/)** - Sliding window with frequency counting
- **[LeetCode 567: Permutation in String](https://leetcode.com/problems/permutation-in-string/)** - Sliding window with constant size

---

## Video Tutorial Links

Here are some helpful YouTube tutorials explaining the problem and solutions:

- [Moving Average from Data Stream - Leetcode 346 (NeetCode)](https://www.youtube.com/watch?v=xaEs0mm4dQY) - Detailed explanation with visualization
- [LeetCode 346: Moving Average from Data Stream](https://www.youtube.com/watch?v=gaMqdm0m93c) - Simple queue-based solution
- [Moving Average from Data Stream - LeetCode Solution](https://www.youtube.com/watch?v=Z3vI2uL7vGw) - Multiple approaches
- [Data Stream Moving Average - LeetCode 346](https://www.youtube.com/watch?v=eYnlK-Bs7W0) - Java implementation
- [Moving Average Problem - LeetCode 346](https://www.youtube.com/watch?v=V2aZDp6gLQQ) - Python solution walkthrough

---

## Followup Questions

### Q1: How would you calculate the moving average if you needed to support weighted elements (more recent values have higher weight)?

**Answer:** Use exponential moving average (EMA) with the formula: `EMA(t) = α × val(t) + (1 - α) × EMA(t-1)`, where α is a smoothing factor (e.g., α = 2/(window+1)). This gives more weight to recent values without maintaining a full window.

---

### Q2: What if the window size changes dynamically during execution?

**Answer:** You would need to adjust the data structure to handle variable window sizes. Options include:
- Resizing the underlying array when window size changes
- Using a dynamic structure like std::list or LinkedList
- Maintaining a running sum and recalculating when window shrinks

---

### Q3: How would you handle integer overflow for the running sum?

**Answer:** Use a larger data type (e.g., long long in C++, long in Java, or Python's arbitrary-precision integers). In languages with fixed-size integers, check for overflow before each addition.

---

### Q4: How would you modify the solution to return a running median instead of mean?

**Answer:** You would need two heaps (max-heap for lower half, min-heap for upper half) to maintain the median. When adding a new element, balance the heaps and handle rebalancing when window exceeds size.

---

### Q5: What are the advantages of using a circular buffer over a simple queue?

**Answer:** Circular buffer offers better memory locality and cache performance. It avoids dynamic memory allocation/deallocation and has predictable memory usage. However, it requires careful index management.

---

### Q6: How would you make the solution thread-safe for concurrent access?

**Answer:** Use synchronization primitives (mutex/lock) around the `next()` method. For read-heavy workloads, consider using atomic operations or lock-free data structures. In Java, you could use the `synchronized` keyword or `ReentrantLock`.

---

### Q7: How would you calculate the standard deviation along with the moving average?

**Answer:** You would need to maintain:
- Running sum of values
- Running sum of squared values

Then use the formula: `std = sqrt(sum(x²)/n - (sum(x)/n)²)`, but be careful about numerical precision with floating-point arithmetic.

---

### Q8: What if you need to support querying the moving average at different window sizes simultaneously?

**Answer:** Maintain multiple MovingAverage instances with different window sizes. Alternatively, use a data structure that supports multiple window sizes (like a balanced BST storing timestamps and values) to answer queries in O(log n) time.

---

### Q9: How would you handle very large window sizes (e.g., millions of elements)?

**Answer:** For extremely large windows:
- Use memory-mapped files or disk-based storage
- Compress historical data (e.g., keep only summaries)
- Use streaming algorithms that don't store all elements
- Consider approximate methods like reservoir sampling

---

### Q10: How would you detect and remove outliers from the moving average calculation?

**Answer:** Options include:
- Maintain a frequency map and use mode/median instead of mean
- Use trimmed mean (remove highest/lowest X% of values)
- Use winsorized mean (cap extreme values at percentile thresholds)
- Maintain a separate data structure for outlier detection (e.g., z-score calculation)

---

### Q11: What if you need to reset the moving average window without recreating the object?

**Answer:** Add a `reset()` method that clears the window and running sum. This is useful for real-time systems that need to restart monitoring without object recreation overhead.

---

### Q12: How would you optimize for very high-frequency data streams?

**Answer:** Optimization strategies include:
- Pre-allocate all memory to avoid dynamic allocation
- Use SIMD instructions for batch processing
- Minimize function calls and use inline functions
- Use lock-free data structures for concurrent access
- Batch multiple updates and compute averages periodically
