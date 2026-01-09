# Design Hit Counter

## Problem Description
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

### Time Complexity:
- `hit()`: O(1), as appending to a list is constant time.
- `getHits()`: Amortized O(1) per operation, because each timestamp is added and removed at most once, making the total time across all operations linear in the number of hits. In the worst case for a single call, it could be O(n) if many old timestamps need to be removed.

### Space Complexity:
- O(n), where n is the number of hits in the past 5 minutes, as we store all recent timestamps.
