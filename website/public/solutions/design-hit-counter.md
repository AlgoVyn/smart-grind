# Design Hit Counter

## Problem Description
Design a hit counter that counts the number of hits received in the past 5 minutes (i.e., the past 300 seconds).

The system should support the following operations:

- `hit(timestamp)`: Record a hit at the given timestamp.
- `getHits(timestamp)`: Return the number of hits that have occurred in the past 5 minutes (including the timestamp).

Each timestamp is an integer representing the time in seconds. It is guaranteed that every call to `hit(timestamp)` uses a timestamp that is non-decreasing (i.e., timestamps are in ascending order).

## Examples

**Example 1:**

**Input:**
```python
["HitCounter", "hit", "hit", "hit", "getHits", "hit", "getHits"]
[[], [1], [2], [3], [4], [300], [300]]
```

**Output:**
```python
[null, null, null, null, 3, null, 4]
```

**Explanation:**
```python
HitCounter counter = new HitCounter();
counter.hit(1);       // hit at timestamp 1
counter.hit(2);       // hit at timestamp 2
counter.hit(3);       // hit at timestamp 3
counter.getHits(4);   // get hits at timestamp 4, returns 3 (hits at 1, 2, 3)
counter.hit(300);     // hit at timestamp 300
counter.getHits(300); // get hits at timestamp 300, returns 4 (hits at 1, 2, 3, 300)
```

**Example 2:**

**Example with older timestamps being removed:**

**Input:**
```python
["HitCounter", "hit", "hit", "hit", "getHits", "getHits", "getHits"]
[[], [1], [2], [3], [301], [302], [303]]
```

**Output:**
```python
[null, null, null, null, 2, 1, 0]
```

**Explanation:**
```python
HitCounter counter = new HitCounter();
counter.hit(1);       // hit at timestamp 1
counter.hit(2);       // hit at timestamp 2
counter.hit(3);       // hit at timestamp 3
counter.getHits(301); // hits at timestamps 1, 2, 3 are outside 5-minute window, returns 2 (hits at 2, 3)
counter.getHits(302); // hits at timestamps 1, 2 are outside 5-minute window, returns 1 (hit at 3)
counter.getHits(303); // all hits are outside 5-minute window, returns 0
```

## Constraints

- `1 <= timestamp <= 10^9`
- All timestamps passed to `hit(timestamp)` are non-decreasing.
- `getHits(timestamp)` will always be called with a timestamp greater than or equal to all timestamps passed to `hit(timestamp)`.
- At most 10^4 calls will be made to `hit` and `getHits`.

## Solution

```python
from collections import deque

class HitCounter:

    def __init__(self):
        self.hits = deque()

    def hit(self, timestamp: int) -> None:
        self.hits.append(timestamp)

    def getHits(self, timestamp: int) -> int:
        while self.hits and self.hits[0] <= timestamp - 300:
            self.hits.popleft()
        return len(self.hits)
```

## Explanation
The hit counter is implemented using a list (or deque) to store the timestamps of all hits. This allows us to efficiently track and remove outdated hits when querying the number of hits in the past 5 minutes (300 seconds).

### Step-by-Step Explanation:
1. **Initialization**: Create an empty list to store timestamps.

2. **hit(timestamp)**: Append the given timestamp to the list. This operation is O(1).

3. **getHits(timestamp)**:
   - While the list is not empty and the first timestamp is older than `timestamp - 300` (i.e., outside the 5-minute window), remove it from the front.
   - Return the current length of the list, which represents the number of hits in the past 5 minutes.

**Time Complexity:**
- `hit()`: O(1), as appending to a list is constant time.
- `getHits()`: Amortized O(1) per operation, because each timestamp is added and removed at most once, making the total time across all operations linear in the number of hits. In the worst case for a single call, it could be O(n) if many old timestamps need to be removed.

**Space Complexity:** O(n), where n is the number of hits in the past 5 minutes, as we store all recent timestamps.
