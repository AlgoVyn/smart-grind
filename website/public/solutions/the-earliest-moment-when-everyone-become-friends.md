# The Earliest Moment When Everyone Become Friends

## Problem Description

There are `n` people, numbered from `0` to `n-1`. You are given a list of logs where each log is a pair of timestamps and two different person indices: `logs[i] = [timestamp_i, person_i, person_j]`, meaning that person `person_i` and person `person_j` became friends at time `timestamp_i`.

A moment is a time when every pair of people have become friends. More formally, a moment `t` is a time when for every pair of people `(i, j)`, there is a path of friendships connecting `i` and `j` using the logs with timestamp `<= t`.

Return the earliest moment when everyone becomes friends. If it's impossible for everyone to become friends, return `-1`.

**Example 1:**

Input: `logs = [[20190101,0,1],[20190102,1,2],[20190104,2,0]]`, `n = 3`
Output: `20190104`
Explanation: At time 20190104, person 0 is friends with person 1 (via log at 20190101), person 1 is friends with person 2 (via log at 20190102), and person 2 is friends with person 0 (via log at 20190104). Therefore, all three people are connected.

**Example 2:**

Input: `logs = [[20190101,0,1],[20190101,2,3]]`, `n = 4`
Output: `-1`
Explanation: Even though person 0 is friends with person 1, and person 2 is friends with person 3, there is no connection between these two groups.

---

## Constraints

- `2 <= n <= 1000`
- `1 <= logs.length <= 10^4`
- `logs[i][0]` is the timestamp.
- `logs[i][1]` and `logs[i][2]` are different person indices.
- `logs` are not necessarily sorted and may contain duplicates.

---

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

---

## Explanation

This problem finds the earliest time when all people become friends based on friendship logs. It uses Union-Find (Disjoint Set Union) to track connected components, processing logs in chronological order.

### Step-by-Step Approach:

1. **Sort Logs:**
   - Sort the logs by timestamp to process friendships in order.

2. **Initialize Union-Find:**
   - Create a UnionFind structure with n components (one for each person).

3. **Process Each Log:**
   - For each log `(time, a, b)`, union a and b.
   - After union, check if `components == 1`. If yes, return the current time.

4. **Return Result:**
   - If all logs are processed without components reaching 1, return `-1`.

### Time Complexity:

- O(m log m + m α(n)), where m is the number of logs (for sorting), and α(n) is the inverse Ackermann function (nearly constant for union operations).

### Space Complexity:

- O(n), for the UnionFind parent and rank arrays.
