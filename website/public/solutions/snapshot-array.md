# Snapshot Array

## Problem Description
Implement a SnapshotArray that supports the following interface:

SnapshotArray(int length) initializes an array-like data structure with the given length. Initially, each element equals 0.
void set(index, val) sets the element at the given index to be equal to val.
int snap() takes a snapshot of the array and returns the snap_id: the total number of times we called snap() minus 1.
int get(index, snap_id) returns the value at the given index, at the time we took the snapshot with the given snap_id

 
Example 1:

Input: ["SnapshotArray","set","snap","set","get"]
[[3],[0,5],[],[0,6],[0,0]]
Output: [null,null,0,null,5]
Explanation: 
SnapshotArray snapshotArr = new SnapshotArray(3); // set the length to be 3
snapshotArr.set(0,5);  // Set array[0] = 5
snapshotArr.snap();  // Take a snapshot, return snap_id = 0
snapshotArr.set(0,6);
snapshotArr.get(0,0);  // Get the value of array[0] with snap_id = 0, return 5
 
Constraints:

1 <= length <= 5 * 104
0 <= index < length
0 <= val <= 109
0 <= snap_id < (the total number of times we call snap())
At most 5 * 104 calls will be made to set, snap, and get.

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

This problem implements a snapshot array with set, snap, and get operations, where get retrieves value at a specific snapshot.

### Step-by-Step Approach:

1. **Init**: snap_id = 0, history defaultdict of lists, current array of 0s.

2. **Set**: Update current[index] = val.

3. **Snap**: Append (snap_id, current[i]) to history[i] for all i, increment snap_id, return previous.

4. **Get**: In history[index], use bisect to find the largest snap_id <= given, return the val, or 0 if none.

### Time Complexity:
- Set: O(1)
- Snap: O(length)
- Get: O(log snaps)

### Space Complexity:
- O(length * snaps), worst case.
