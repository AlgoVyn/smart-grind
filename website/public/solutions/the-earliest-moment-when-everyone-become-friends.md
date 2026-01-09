# The Earliest Moment When Everyone Become Friends

## Problem Description
## Solution

```python
class UnionFind:
    def __init__(self, n):
        self.parent = list(range(n))
        self.rank = [0] * n
        self.components = n
    
    def find(self, x):
        if self.parent[x] != x:
            self.parent[x] = self.find(self.parent[x])
        return self.parent[x]
    
    def union(self, x, y):
        px, py = self.find(x), self.find(y)
        if px != py:
            if self.rank[px] < self.rank[py]:
                self.parent[px] = py
            elif self.rank[px] > self.rank[py]:
                self.parent[py] = px
            else:
                self.parent[py] = px
                self.rank[px] += 1
            self.components -= 1

def earliestAcq(logs, n):
    logs.sort()
    uf = UnionFind(n)
    for time, a, b in logs:
        uf.union(a, b)
        if uf.components == 1:
            return time
    return -1
```

## Explanation
This problem finds the earliest time when all people become friends based on friendship logs. It uses Union-Find (Disjoint Set Union) to track connected components, processing logs in chronological order.

### Step-by-Step Approach:
1. **Sort Logs:**
   - Sort the logs by timestamp to process friendships in order.

2. **Initialize Union-Find:**
   - Create a UnionFind structure with n components (one for each person).

3. **Process Each Log:**
   - For each log (time, a, b), union a and b.
   - After union, check if components == 1. If yes, return the current time.

4. **Return Result:**
   - If all logs are processed without components reaching 1, return -1.

### Time Complexity:
- O(m log m + m α(n)), where m is the number of logs (for sorting), and α(n) is the inverse Ackermann function (nearly constant for union operations).

### Space Complexity:
- O(n), for the UnionFind parent and rank arrays.
