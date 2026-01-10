# Snapshot Array

## Problem Description

Implement a SnapshotArray that supports the following interface:

- `SnapshotArray(int length)` initializes an array-like data structure with the given length. Initially, each element equals 0.
- `void set(index, val)` sets the element at the given index to be equal to val.
- `int snap()` takes a snapshot of the array and returns the snap_id: the total number of times we called snap() minus 1.
- `int get(index, snap_id)` returns the value at the given index, at the time we took the snapshot with the given snap_id

### Examples

**Example 1:**
```python
Input: ["SnapshotArray","set","snap","set","get"]
[[3],[0,5],[],[0,6],[0,0]]
Output: [null,null,0,null,5]
```

### Constraints

- `1 <= length <= 5 * 10^4`
- `0 <= index < length`
- `0 <= val <= 10^9`
- `0 <= snap_id < (the total number of times we call snap())`
- At most `5 * 10^4` calls will be made to set, snap, and get.

---

## Solution

```python
from collections import defaultdict
import bisect

class SnapshotArray:

    def __init__(self, length: int):
        self.snap_id = 0
        self.history = defaultdict(list)
        self.current = [0] * length

    def set(self, index: int, val: int) -> None:
        self.current[index] = val

    def snap(self) -> int:
        for i in range(len(self.current)):
            self.history[i].append((self.snap_id, self.current[i]))
        self.snap_id += 1
        return self.snap_id - 1

    def get(self, index: int, snap_id: int) -> int:
        if index not in self.history:
            return 0
        h = self.history[index]
        # Find the rightmost entry with snap_id <= given
        idx = bisect.bisect_right(h, (snap_id, float('inf'))) - 1
        if idx < 0:
            return 0
        return h[idx][1]
```

---

## Explanation

### Approach

Implement a snapshot array using a current array for latest values and a history map (defaultdict of lists) to store snapshots per index. Use binary search for efficient retrieval.

### Step-by-Step Explanation

1. **Initialization**: Set `snap_id` to 0, create a defaultdict for history, and a current array initialized to 0s.

2. **Set Operation**: Update the current array at the given index with the new value.

3. **Snap Operation**: For each index, append a tuple `(current snap_id, current value)` to the history list for that index. Increment `snap_id` and return the previous value.

4. **Get Operation**: For the given index and `snap_id`, use binary search on the history list to find the rightmost entry where `snap_id <= given snap_id`, and return the value. If no such entry, return 0.

### Time Complexity

- **Set**: O(1)
- **Snap**: O(length)
- **Get**: O(log snaps)

### Space Complexity

- **O(length * snaps)** in the worst case.
