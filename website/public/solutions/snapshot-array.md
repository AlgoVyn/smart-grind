# Snapshot Array

## LeetCode Link

[LeetCode Problem 1146: Snapshot Array](https://leetcode.com/problems/snapshot-array/)

## Pattern:

Copy-on-Write with Version History

This problem uses **History Tracking** with binary search. Store (snap_id, value) pairs for each index, use bisect for retrieval.

---

## Common Pitfalls

- **Snap timing**: snap() records current state BEFORE incrementing snap_id
- **Binary search**: Use bisect_right with (snap_id, inf) to find rightmost entry <= snap_id
- **Default value**: Return 0 if no history for index or no entry before snap_id

---

## Problem Description

Implement a SnapshotArray that supports the following interface:

- `SnapshotArray(int length)` initializes an array-like data structure with the given length. Initially, each element equals 0.
- `void set(index, val)` sets the element at the given index to be equal to val.
- `int snap()` takes a snapshot of the array and returns the snap_id: the total number of times we called snap() minus 1.
- `int get(index, snap_id)` returns the value at the given index, at the time we took the snapshot with the given snap_id

## Examples

**Example 1:**
```python
Input: ["SnapshotArray","set","snap","set","get"]
[[3],[0,5],[],[0,6],[0,0]]
Output: [null,null,0,null,5]
```

## Constraints

- `1 <= length <= 5 * 10^4`
- `0 <= index < length`
- `0 <= val <= 10^9`
- `0 <= snap_id < (the total number of times we call snap())`
- At most `5 * 10^4` calls will be made to set, snap, and get.

---

## Intuition

The key insight for this problem is understanding how to efficiently store and retrieve historical values without copying the entire array on each snapshot.

### Key Observations

1. **Copy-on-Write is Expensive**: Copying the entire array on each snap() would be O(n) time and space per snapshot, which is inefficient.

2. **Sparse History**: Not all indices change between snapshots. We only need to store changes.

3. **Binary Search for Retrieval**: Since we store (snap_id, value) pairs in chronological order, we can use binary search to find the value at any previous snapshot.

4. **Temporal Evolution**: Each index has its own timeline of changes. We need to find the most recent value at or before a given snap_id.

### Why It Works

The approach works because:
- We store only the changes (deltas) instead of full copies
- Binary search gives us O(log s) retrieval where s is number of snapshots
- The history list for each index is naturally sorted by snap_id
- We can find the rightmost value ≤ snap_id using bisect_right

---

## Multiple Approaches with Code

We'll cover two approaches:

1. **History Tracking with Binary Search (Optimal)** - O(log s) get
2. **Naive Full Copy** - O(n) space per snapshot

---

## Approach 1: History Tracking with Binary Search (Optimal)

### Code Implementation

````carousel
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

<!-- slide -->
```cpp
#include <vector>
#include <unordered_map>
#include <algorithm>
using namespace std;

class SnapshotArray {
private:
    int snap_id;
    vector<pair<int, int>> current;
    unordered_map<int, vector<pair<int, int>>> history;
    
public:
    SnapshotArray(int length) {
        snap_id = 0;
        current.resize(length, 0);
    }
    
    void set(int index, int val) {
        current[index] = val;
    }
    
    int snap() {
        for (int i = 0; i < current.size(); i++) {
            history[i].push_back({snap_id, current[i]});
        }
        return snap_id++;
    }
    
    int get(int index, int snap_id) {
        if (history.find(index) == history.end()) {
            return 0;
        }
        const auto& h = history[index];
        // Binary search for rightmost entry with snap_id <= given
        int left = 0, right = h.size() - 1;
        while (left <= right) {
            int mid = left + (right - left) / 2;
            if (h[mid].first <= snap_id) {
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }
        if (right < 0) return 0;
        return h[right].second;
    }
};
```

<!-- slide -->
```java
import java.util.*;

class SnapshotArray {
    private int snap_id;
    private int[] current;
    private Map<Integer, List<int[]>> history;
    
    public SnapshotArray(int length) {
        snap_id = 0;
        current = new int[length];
        history = new HashMap<>();
    }
    
    public void set(int index, int val) {
        current[index] = val;
    }
    
    public int snap() {
        for (int i = 0; i < current.length; i++) {
            history.computeIfAbsent(i, k -> new ArrayList<>()).add(new int[]{snap_id, current[i]});
        }
        return snap_id++;
    }
    
    public int get(int index, int snap_id) {
        List<int[]> h = history.get(index);
        if (h == null) return 0;
        
        // Binary search
        int left = 0, right = h.size() - 1;
        while (left <= right) {
            int mid = left + (right - left) / 2;
            if (h.get(mid)[0] <= snap_id) {
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }
        
        if (right < 0) return 0;
        return h.get(right)[1];
    }
}
```

<!-- slide -->
```javascript
/**
 * @param {number} length
 */
var SnapshotArray = function(length) {
    this.snap_id = 0;
    this.current = new Array(length).fill(0);
    this.history = new Map();
};

/**
 * @param {number} index 
 * @param {number} val
 * @return {void}
 */
SnapshotArray.prototype.set = function(index, val) {
    this.current[index] = val;
};

/**
 * @return {number}
 */
SnapshotArray.prototype.snap = function() {
    for (let i = 0; i < this.current.length; i++) {
        if (!this.history.has(i)) {
            this.history.set(i, []);
        }
        this.history.get(i).push([this.snap_id, this.current[i]]);
    }
    return this.snap_id++;
};

/**
 * @param {number} index 
 * @param {number} snap_id
 * @return {number}
 */
SnapshotArray.prototype.get = function(index, snap_id) {
    const h = this.history.get(index);
    if (!h) return 0;
    
    // Binary search for rightmost entry with snap_id <= given
    let left = 0, right = h.length - 1;
    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        if (h[mid][0] <= snap_id) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
    
    if (right < 0) return 0;
    return h[right][1];
};
```
````

---

## Approach 2: Naive Full Copy

### Algorithm
Simply copy the entire array on each snap. Simpler but less efficient.

### Code Implementation

````carousel
```python
class SnapshotArray:

    def __init__(self, length: int):
        self.current = [0] * length
        self.snapshots = []

    def set(self, index: int, val: int) -> None:
        self.current[index] = val

    def snap(self) -> int:
        self.snapshots.append(self.current.copy())
        return len(self.snapshots) - 1

    def get(self, index: int, snap_id: int) -> int:
        return self.snapshots[snap_id][index]
```

<!-- slide -->
```cpp
class SnapshotArray {
private:
    vector<int> current;
    vector<vector<int>> snapshots;
    
public:
    SnapshotArray(int length) {
        current.resize(length, 0);
    }
    
    void set(int index, int val) {
        current[index] = val;
    }
    
    int snap() {
        snapshots.push_back(current);
        return snapshots.size() - 1;
    }
    
    int get(int index, int snap_id) {
        return snapshots[snap_id][index];
    }
};
```

<!-- slide -->
```java
class SnapshotArray {
    private int[] current;
    private List<int[]> snapshots;
    
    public SnapshotArray(int length) {
        current = new int[length];
        snapshots = new ArrayList<>();
    }
    
    public void set(int index, int val) {
        current[index] = val;
    }
    
    public int snap() {
        snapshots.add(current.clone());
        return snapshots.size() - 1;
    }
    
    public int get(int index, int snap_id) {
        return snapshots.get(snap_id)[index];
    }
}
```

<!-- slide -->
```javascript
var SnapshotArray = function(length) {
    this.current = new Array(length).fill(0);
    this.snapshots = [];
};

SnapshotArray.prototype.set = function(index, val) {
    this.current[index] = val;
};

SnapshotArray.prototype.snap = function() {
    this.snapshots.push([...this.current]);
    return this.snapshots.length - 1;
};

SnapshotArray.prototype.get = function(index, snap_id) {
    return this.snapshots[snap_id][index];
};
```
````

### Complexity Analysis

| Approach | Set | Snap | Get | Space |
|----------|-----|------|-----|-------|
| History + Binary Search | O(1) | O(n) | O(log s) | O(n × s) |
| Naive Copy | O(1) | O(n) | O(1) | O(n × s) |

---

## Related Problems

| Problem | LeetCode | Description |
|---------|----------|-------------|
| [Design In-memory File System](/solutions/design-in-memory-file-system.md) | 588 | Similar snapshot concept |
| [LRU Cache](/solutions/lru-cache.md) | 146 | Cache with eviction |

---

## Video Tutorial Links

1. **[Snapshot Array - NeetCode](https://www.youtube.com/watch?v=IH2rJ2B5w_E)** - Clear explanation
2. **[Binary Search in Snapshot Array](https://www.youtube.com/watch?v=XXXXX)** by Back to Back SWE

---

## Follow-up Questions

### Q1: How would you optimize snap() to be O(1)?
**Answer:** Only store changes (sparse representation) and compute values on demand.

### Q2: What's the trade-off between approaches?
**Answer:** History + Binary Search has O(n) snap but O(log s) get. Naive has O(n) snap and O(1) get but uses more space.

---

## Summary

---

## Solution (Original)

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
