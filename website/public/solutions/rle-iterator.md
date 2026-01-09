# RLE Iterator

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

### Constraints

- `2 <= encoding.length <= 1000`
- `encoding.length` is even.
- `0 <= encoding[i] <= 10^9`
- `1 <= n <= 10^9`
- At most 1000 calls will be made to `next`.

---

## Solution

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

---

## Explanation

This problem implements an iterator for run-length encoded arrays. The `next(n)` method exhausts the next `n` elements and returns the last element exhausted, or -1 if insufficient elements.

### Approach

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
