# RLE Iterator

## LeetCode Link

[LeetCode Problem 900: RLE Iterator](https://leetcode.com/problems/rle-iterator/)

## Pattern:

RLE (Run-Length Encoding) Iterator

This problem uses **RLE Decoding with Pointer Tracking**. Track position in encoding array, decrement counts as elements are consumed.

---

## Common Pitfalls

- **Encoding pairs**: indices 0,2,4,... are counts; 1,3,5,... are values
- **Partial consumption**: When n < count, decrement count and return value
- **Return -1**: When no elements left to consume

---

## Problem Description

We can use run-length encoding (RLE) to encode a sequence of integers. In a run-length encoded array of even length encoding (0-indexed), for all even `i`, `encoding[i]` tells us the number of times that the non-negative integer value `encoding[i + 1]` is repeated in the sequence.

For example, the sequence `arr = [8,8,8,5,5]` can be encoded to be `encoding = [3,8,2,5]`. `encoding = [3,8,0,9,2,5]` and `encoding = [2,8,1,8,2,5]` are also valid RLE of `arr`.

Given a run-length encoded array, design an iterator that iterates through it. Implement the `RLEIterator` class:

- `RLEIterator(int[] encoded)` Initializes the object with the encoded array `encoded`.
- `int next(int n)` Exhausts the next `n` elements and returns the last element exhausted in this way. If there is no element left to exhaust, return -1 instead.

### Example

**Input:**
```python
["RLEIterator", "next", "next", "next", "next"]
[[[3, 8, 0, 9, 2, 5]], [2], [1], [1], [2]]
```

**Output:**
```python
[null, 8, 8, 5, -1]
```

**Explanation:**
```python
RLEIterator rLEIterator = new RLEIterator([3, 8, 0, 9, 2, 5]); // This maps to the sequence [8,8,8,5,5].
rLEIterator.next(2); // exhausts 2 terms of the sequence, returning 8. The remaining sequence is now [8, 5, 5].
rLEIterator.next(1); // exhausts 1 term of the sequence, returning 8. The remaining sequence is now [5, 5].
rLEIterator.next(1); // exhausts 1 term of the sequence, returning 5. The remaining sequence is now [5].
rLEIterator.next(2); // exhausts 2 terms, returning -1. This is because the first term exhausted was 5,
but the second term did not exist. Since the last term exhausted does not exist, we return -1.
```

## Constraints

- `2 <= encoding.length <= 1000`
- `encoding.length` is even.
- `0 <= encoding[i] <= 10^9`
- `1 <= n <= 10^9`
- At most 1000 calls will be made to `next`.

---

## Examples

### Example 1

**Input:**
```python
["RLEIterator", "next", "next", "next", "next"]
[[[3, 8, 0, 9, 2, 5]], [2], [1], [1], [2]]
```

**Output:**
```python
[null, 8, 8, 5, -1]
```

**Explanation:**
```python
RLEIterator rLEIterator = new RLEIterator([3, 8, 0, 9, 2, 5]); // This maps to the sequence [8,8,8,5,5].
rLEIterator.next(2); // exhausts 2 terms of the sequence, returning 8. The remaining sequence is now [8, 5, 5].
rLEIterator.next(1); // exhausts 1 term of the sequence, returning 8. The remaining sequence is now [5, 5].
rLEIterator.next(1); // exhausts 1 term of the sequence, returning 5. The remaining sequence is now [5].
rLEIterator.next(2); // exhausts 2 terms, returning -1. This is because the first term exhausted was 5,
but the second term did not exist. Since the last term exhausted does not exist, we return -1.
```

---

## Intuition

The key insight for this problem is understanding how RLE (Run-Length Encoding) works and how to efficiently iterate through it. 

### Key Observations

1. **RLE Structure**: The encoding array has pairs of [count, value] where count tells us how many times value appears consecutively.

2. **Pointer Tracking**: Instead of expanding the entire array, we can keep a pointer to the current position in the encoding and track how many elements we've consumed from the current run.

3. **Partial Consumption**: When `next(n)` is called, we may need to consume parts of multiple runs. If n is smaller than the current run's count, we just decrement the count and return the value.

4. **Skipping Completed Runs**: When the current run is fully consumed, we move to the next pair (skipping by 2 in the array index).

### Why It Works

The algorithm works because:
- We maintain state (current index and remaining count) across calls
- Each call to `next()` processes only what's needed
- We never need to store the expanded sequence
- Time complexity is O(1) amortized since each element is processed once

---

## Multiple Approaches with Code

We'll cover two approaches:

1. **Pointer Tracking (Optimal)** - Track position in encoding array
2. **Queue-based** - Convert to queue

---

## Approach 1: Pointer Tracking (Optimal)

### Code Implementation

````carousel
```python
class RLEIterator:
    def __init__(self, encoding):
        self.encoding = encoding
        self.index = 0
    
    def next(self, n):
        while self.index < len(self.encoding) and n > 0:
            count = self.encoding[self.index]
            val = self.encoding[self.index + 1]
            if n <= count:
                self.encoding[self.index] -= n
                return val
            else:
                n -= count
                self.index += 2
        return -1
```

<!-- slide -->
```cpp
class RLEIterator {
private:
    vector<int> encoding;
    int index;
    
public:
    RLEIterator(vector<int> encoding) {
        this->encoding = encoding;
        this->index = 0;
    }
    
    int next(int n) {
        while (index < encoding.size() && n > 0) {
            int count = encoding[index];
            int val = encoding[index + 1];
            if (n <= count) {
                encoding[index] -= n;
                return val;
            } else {
                n -= count;
                index += 2;
            }
        }
        return -1;
    }
};
```

<!-- slide -->
```java
class RLEIterator {
    private int[] encoding;
    private int index;
    
    public RLEIterator(int[] encoding) {
        this.encoding = encoding;
        this.index = 0;
    }
    
    public int next(int n) {
        while (index < encoding.length && n > 0) {
            int count = encoding[index];
            int val = encoding[index + 1];
            if (n <= count) {
                encoding[index] -= n;
                return val;
            } else {
                n -= count;
                index += 2;
            }
        }
        return -1;
    }
}
```

<!-- slide -->
```javascript
/**
 * @param {number[]} encoding
 */
var RLEIterator = function(encoding) {
    this.encoding = encoding;
    this.index = 0;
};

/**
 * @param {number} n
 * @return {number}
 */
RLEIterator.prototype.next = function(n) {
    while (this.index < this.encoding.length && n > 0) {
        const count = this.encoding[this.index];
        const val = this.encoding[this.index + 1];
        if (n <= count) {
            this.encoding[this.index] -= n;
            return val;
        } else {
            n -= count;
            this.index += 2;
        }
    }
    return -1;
};
```
````

---

## Approach 2: Queue-based

### Code Implementation

````carousel
```python
from collections import deque

class RLEIterator:
    def __init__(self, encoding):
        self.queue = deque()
        i = 0
        while i < len(encoding):
            count = encoding[i]
            val = encoding[i + 1]
            for _ in range(count):
                self.queue.append(val)
            i += 2
    
    def next(self, n):
        for _ in range(n):
            if not self.queue:
                return -1
            val = self.queue.popleft()
        return val
```

<!-- slide -->
```cpp
#include <queue>
using namespace std;

class RLEIterator {
private:
    queue<int> q;
    
public:
    RLEIterator(vector<int> encoding) {
        for (size_t i = 0; i < encoding.size(); i += 2) {
            int count = encoding[i];
            int val = encoding[i + 1];
            for (int j = 0; j < count; j++) {
                q.push(val);
            }
        }
    }
    
    int next(int n) {
        for (int i = 0; i < n; i++) {
            if (q.empty()) return -1;
            q.pop();
        }
        if (q.empty()) return -1;
        return q.front();
    }
};
```

<!-- slide -->
```java
import java.util.*;

class RLEIterator {
    private Queue<Integer> q;
    
    public RLEIterator(int[] encoding) {
        q = new LinkedList<>();
        for (int i = 0; i < encoding.length; i += 2) {
            int count = encoding[i];
            int val = encoding[i + 1];
            for (int j = 0; j < count; j++) {
                q.add(val);
            }
        }
    }
    
    public int next(int n) {
        for (int i = 0; i < n; i++) {
            if (q.isEmpty()) return -1;
            q.poll();
        }
        return q.isEmpty() ? -1 : q.peek();
    }
}
```

<!-- slide -->
```javascript
var RLEIterator = function(encoding) {
    this.queue = [];
    for (let i = 0; i < encoding.length; i += 2) {
        const count = encoding[i];
        const val = encoding[i + 1];
        for (let j = 0; j < count; j++) {
            this.queue.push(val);
        }
    }
};

RLEIterator.prototype.next = function(n) {
    for (let i = 0; i < n; i++) {
        if (this.queue.length === 0) return -1;
        this.queue.shift();
    }
    return this.queue.length === 0 ? -1 : this.queue[0];
};
```
````

### Complexity Analysis

| Approach | Constructor | Next | Space |
|----------|-------------|------|-------|
| Pointer | O(1) | O(1) amortized | O(1) |
| Queue | O(N) | O(n) | O(N) |

---

## Related Problems

| Problem | LeetCode | Description |
|---------|----------|-------------|
| [Decode String](/solutions/decode-string.md) | 394 | Similar encoding |
| [String Compression](/solutions/string-compression.md) | 443 | RLE |

---

## Video Tutorial Links

1. **[RLE Iterator - Explanation](https://www.youtube.com/watch?v=XXXXX)**

---

## Follow-up Questions

### Q1: How does the pointer tracking work?
**Answer:** Track position in encoding array, decrement counts as elements are consumed.

---

## Summary

---

## Solution (Original)

This problem implements an iterator for run-length encoded arrays. The `next(n)` method exhausts the next `n` elements and returns the last element exhausted, or -1 if insufficient elements.

## Approach

1. **Initialization:** Store the encoding array and set index to 0.

2. **Next Method:** While index is within bounds and `n > 0`:
   - Get current count and value.
   - If `n <= count`, reduce count by `n` and return value.
   - Else, subtract count from `n` and move index to next pair (`index += 2`).
   - If loop ends without returning, return -1.

### Time Complexity

- O(k), where k is the number of groups processed per call, but amortized O(1) per element since each group is processed once across all calls.

### Space Complexity

- O(m), where m is the length of encoding, for storing the array.
