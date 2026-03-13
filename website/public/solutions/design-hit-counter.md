# Design Hit Counter

## Problem Description

Design a hit counter that counts the number of hits received in the past 5 minutes (i.e., the past 300 seconds).

The system should support the following operations:

- `hit(timestamp)`: Record a hit at the given timestamp.
- `getHits(timestamp)`: Return the number of hits that have occurred in the past 5 minutes (including the timestamp).

Each timestamp is an integer representing the time in seconds. It is guaranteed that every call to `hit(timestamp)` uses a timestamp that is non-decreasing (i.e., timestamps are in ascending order).

**Link to problem:** [Design Hit Counter - LeetCode 362](https://leetcode.com/problems/design-hit-counter/)

## Constraints
- `1 <= timestamp <= 10^9`
- All timestamps passed to `hit(timestamp)` are non-decreasing.
- `getHits(timestamp)` will always be called with a timestamp greater than or equal to all timestamps passed to `hit(timestamp)`.
- At most 10^4 calls will be made to `hit` and `getHits`.

---

## Pattern: Queue-Based Time Window

This problem demonstrates the **Queue-Based Time Window** pattern. The pattern uses a queue to maintain timestamps within a sliding time window.

### Core Concept

- **Sliding Window**: Maintain only hits within the last 300 seconds
- **Queue Storage**: Store timestamps of all hits
- **Efficient Removal**: Remove outdated timestamps when querying

---

## Examples

### Example

**Input:**
```
["HitCounter", "hit", "hit", "hit", "getHits", "hit", "getHits"]
[[], [1], [2], [3], [4], [300], [300]]
```

**Output:**
```
[null, null, null, null, 3, null, 4]
```

**Explanation:**
- hit(1): Record hit at timestamp 1
- hit(2): Record hit at timestamp 2
- hit(3): Record hit at timestamp 3
- getHits(4): Hits in [4-300, 4] = [1,2,3] → 3 hits
- hit(300): Record hit at timestamp 300
- getHits(300): Hits in [0, 300] = [1,2,3,300] → 4 hits

### Example 2

**Input:**
```
["HitCounter", "hit", "hit", "hit", "getHits", "getHits", "getHits"]
[[], [1], [2], [3], [301], [302], [303]]
```

**Output:**
```
[null, null, null, null, 2, 1, 0]
```

**Explanation:**
- hit(1), hit(2), hit(3): Record hits
- getHits(301): Hits in [1, 301] = timestamps 2,3 → 2 hits (timestamp 1 is outside 5-min window)
- getHits(302): Hits in [2, 302] = timestamp 3 → 1 hit
- getHits(303): Hits in [3, 303] = none → 0 hits

---

## Intuition

The key insight is maintaining a time window of 300 seconds:

1. **Queue Storage**: Store all hit timestamps in a queue
2. **Time Window**: Only keep timestamps within [timestamp - 300, timestamp]
3. **Efficient Queries**: Remove outdated timestamps when calculating hits

### Why Queue Works

- **FIFO**: Old timestamps naturally exit from the front
- **Order Preservation**: Timestamps are processed in order (non-decreasing)
- **Amortized O(1)**: Each timestamp is added and removed at most once

---

## Multiple Approaches with Code

We'll cover two approaches:

1. **Queue-Based (Optimal)** - O(1) amortized time, O(n) space
2. **Array-Based** - O(1) time, O(300) space

---

## Approach 1: Queue-Based (Optimal)

This is the standard approach using a queue to store timestamps.

### Algorithm Steps

1. Initialize an empty queue to store timestamps
2. For hit(timestamp): Add timestamp to the queue
3. For getHits(timestamp):
   - Remove all timestamps older than timestamp - 300
   - Return the remaining queue size

### Why It Works

The queue maintains all hits in chronological order. When querying, we remove timestamps that fall outside the 5-minute window. Each timestamp is added once and removed once, giving amortized O(1) time.

### Code Implementation

````carousel
```python
from collections import deque

class HitCounter:
    def __init__(self):
        self.hits = deque()

    def hit(self, timestamp: int) -> None:
        self.hits.append(timestamp)

    def getHits(self, timestamp: int) -> int:
        # Remove outdated hits (older than 5 minutes)
        while self.hits and self.hits[0] <= timestamp - 300:
            self.hits.popleft()
        return len(self.hits)
```

<!-- slide -->
```cpp
#include <queue>

class HitCounter {
private:
    std::queue<int> hits;
    
public:
    HitCounter() {
    }
    
    void hit(int timestamp) {
        hits.push(timestamp);
    }
    
    int getHits(int timestamp) {
        while (!hits.empty() && hits.front() <= timestamp - 300) {
            hits.pop();
        }
        return hits.size();
    }
};
```

<!-- slide -->
```java
class HitCounter {
    private Queue<Integer> hits;
    
    public HitCounter() {
        hits = new LinkedList<>();
    }
    
    public void hit(int timestamp) {
        hits.add(timestamp);
    }
    
    public int getHits(int timestamp) {
        while (!hits.isEmpty() && hits.peek() <= timestamp - 300) {
            hits.poll();
        }
        return hits.size();
    }
}
```

<!-- slide -->
```javascript
var HitCounter = function() {
    this.hits = [];
};

/**
 * Record a hit.
 * @param {number} timestamp 
 */
HitCounter.prototype.hit = function(timestamp) {
    this.hits.push(timestamp);
};

/**
 * Return the number of hits in the past 5 minutes.
 * @param {number} timestamp
 * @return {number}
 */
HitCounter.prototype.getHits = function(timestamp) {
    // Remove outdated hits (older than 5 minutes)
    while (this.hits.length > 0 && this.hits[0] <= timestamp - 300) {
        this.hits.shift();
    }
    return this.hits.length;
};
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time (hit)** | O(1) - append to queue |
| **Time (getHits)** | O(1) amortized - each timestamp removed at most once |
| **Space** | O(n) - where n is hits in last 5 minutes |

---

## Approach 2: Array-Based (Fixed Window)

This approach uses a fixed-size array for O(1) time complexity.

### Algorithm Steps

1. Use two arrays: one for timestamps, one for counts
2. For hit(timestamp): Increment count at timestamp % 300
3. For getHits(timestamp): Sum counts from timestamps in the window

### Why It Works

Using modulo 300 creates a circular buffer. We only need to check timestamps within the last 300 seconds, which can be done in O(1) by examining at most 300 positions.

### Code Implementation

````carousel
```python
class HitCounter:
    def __init__(self):
        self.times = [0] * 300
        self.hits = [0] * 300

    def hit(self, timestamp: int) -> None:
        idx = timestamp % 300
        if self.times[idx] != timestamp:
            self.times[idx] = timestamp
            self.hits[idx] = 1
        else:
            self.hits[idx] += 1

    def getHits(self, timestamp: int) -> int:
        total = 0
        for i in range(300):
            if timestamp - self.times[i] < 300:
                total += self.hits[i]
        return total
```

<!-- slide -->
```cpp
class HitCounter {
private:
    vector<int> times;
    vector<int> hits;
    
public:
    HitCounter() : times(300, 0), hits(300, 0) {
    }
    
    void hit(int timestamp) {
        int idx = timestamp % 300;
        if (times[idx] != timestamp) {
            times[idx] = timestamp;
            hits[idx] = 1;
        } else {
            hits[idx]++;
        }
    }
    
    int getHits(int timestamp) {
        int total = 0;
        for (int i = 0; i < 300; i++) {
            if (timestamp - times[i] < 300) {
                total += hits[i];
            }
        }
        return total;
    }
};
```

<!-- slide -->
```java
class HitCounter {
    private int[] times;
    private int[] hits;
    
    public HitCounter() {
        times = new int[300];
        hits = new int[300];
    }
    
    public void hit(int timestamp) {
        int idx = timestamp % 300;
        if (times[idx] != timestamp) {
            times[idx] = timestamp;
            hits[idx] = 1;
        } else {
            hits[idx]++;
        }
    }
    
    public int getHits(int timestamp) {
        int total = 0;
        for (int i = 0; i < 300; i++) {
            if (timestamp - times[i] < 300) {
                total += hits[i];
            }
        }
        return total;
    }
}
```

<!-- slide -->
```javascript
var HitCounter = function() {
    this.times = new Array(300).fill(0);
    this.hits = new Array(300).fill(0);
};

/**
 * Record a hit.
 * @param {number} timestamp 
 */
HitCounter.prototype.hit = function(timestamp) {
    const idx = timestamp % 300;
    if (this.times[idx] !== timestamp) {
        this.times[idx] = timestamp;
        this.hits[idx] = 1;
    } else {
        this.hits[idx]++;
    }
};

/**
 * Return the number of hits in the past 5 minutes.
 * @param {number} timestamp
 * @return {number}
 */
HitCounter.prototype.getHits = function(timestamp) {
    let total = 0;
    for (let i = 0; i < 300; i++) {
        if (timestamp - this.times[i] < 300) {
            total += this.hits[i];
        }
    }
    return total;
};
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time (hit)** | O(1) |
| **Time (getHits)** | O(300) = O(1) |
| **Space** | O(300) = O(1) |

---

## Comparison of Approaches

| Aspect | Queue-Based | Array-Based |
|--------|-------------|-------------|
| **Time (getHits)** | O(1) amortized | O(300) worst case |
| **Space** | O(n) | O(1) |
| **Implementation** | Simple | Slightly complex |
| **Best For** | Few hits, many queries | Many hits, frequent queries |

**Best Approach:** Queue-based is simpler and generally preferred. Array-based is better when there are many hits and you need guaranteed O(1) getHits.

---

## Why Queue-Based is Optimal

1. **Simple Implementation**: Easy to understand and maintain
2. **Amortized O(1)**: Each timestamp processed at most twice
3. **Memory Efficient**: Only stores needed timestamps
4. **Natural Fit**: FIFO perfectly models time-based data

---

## Related Problems

### Medium Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Design Hit Counter | [Link](https://leetcode.com/problems/design-hit-counter/) | Original problem |
| Design Twitter | [Link](https://leetcode.com/problems/design-twitter/) | Feed system design |
| Logger Rate Limiter | [Link](https://leetcode.com/problems/logger-rate-limiter/) | Rate limiting |

### Hard Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Data Stream as Disjoint Intervals | [Link](https://leetcode.com/problems/data-stream-as-disjoint-intervals/) | Stream with intervals |

---

## Video Tutorial Links

Here are helpful YouTube tutorials explaining the problem and solutions:

### Queue-Based Approach

- [NeetCode - Design Hit Counter](https://www.youtube.com/watch?v=3WKqdhcEa3Q) - Clear explanation
- [Queue Data Structure](https://www.youtube.com/watch?v=5ctZVk7OqGw) - Understanding queues

### Design Problems

- [System Design Interview Tips](https://www.youtube.com/watch?v=3WKqdhcEa3Q) - Design problem strategies
- [Sliding Window Techniques](https://www.youtube.com/watch?v=9yV6zqfz8vQ) - Window-based patterns

---

## Follow-up Questions

### Q1: How would you handle hit() calls with decreasing timestamps?

**Answer:** The problem guarantees non-decreasing timestamps. If not guaranteed, you'd need additional logic to insert timestamps in the correct position or use a different data structure.

---

### Q2: What if you need to track hits in multiple time windows (e.g., 1 min, 5 min, 1 hour)?

**Answer:** Maintain multiple queues or use a more sophisticated data structure like a hash map with timestamps as keys and counts as values.

---

### Q3: How would you handle concurrent access?

**Answer:** Add thread synchronization (locks/mutex) or use thread-safe data structures. In Python, you could use threading.Lock.

---

### Q4: What if timestamps are not sequential (gaps in time)?

**Answer:** The queue approach still works. We only remove timestamps outside the window, regardless of gaps.

---

### Q5: How would you optimize for very high hit frequency?

**Answer:** Use the array-based approach for O(1) getHits. Consider batching hits or using counters instead of storing individual timestamps.

---

## Common Pitfalls

### 1. Off-by-One Error in Time Window
**Issue**: Including timestamps exactly at the boundary.

**Solution**: Use `< timestamp - 300` (not `<=`) to exclude timestamps older than 300 seconds.

### 2. Not Removing Old Timestamps
**Issue**: Queue grows unbounded.

**Solution:** Always check and remove outdated timestamps in getHits.

### 3. Wrong Comparison
**Issue**: Comparing timestamp with wrong threshold.

**Solution:** Threshold is `timestamp - 300`, not `timestamp - 299`.

### 4. Memory Leaks
**Issue:** Not handling very old timestamps.

**Solution:** The sliding window naturally handles this by removing old entries.

### 5. Integer Overflow
**Issue:** Large timestamps.

**Solution:** Use appropriate integer types; Python handles large ints natively.

---

## Summary

The **Design Hit Counter** problem demonstrates the **Queue-Based Time Window** pattern:

- **Queue-Based**: O(1) amortized time, O(n) space
- **Array-Based**: O(1) time, O(1) space

The key insight is maintaining a sliding window of 300 seconds. The queue naturally handles time-based data with FIFO ordering.

This problem is an excellent demonstration of how to design data structures for time-based queries.

### Pattern Summary

This problem exemplifies the **Queue-Based Time Window** pattern, characterized by:
- Maintaining elements within a time range
- Sliding window operations
- Efficient removal of expired elements
- FIFO ordering for temporal data

For more details on this pattern and its variations, see the **[Sliding Window Pattern](/patterns/sliding-window)**.

---

## Additional Resources

- [LeetCode Problem Discussion](https://leetcode.com/problems/design-hit-counter/discuss/) - Community solutions
- [Queue Data Structure - GeeksforGeeks](https://www.geeksforgeeks.org/queue-data-structure/) - Understanding queues
- [Sliding Window Technique](https://www.geeksforgeeks.org/window-sliding-technique/) - Window patterns
