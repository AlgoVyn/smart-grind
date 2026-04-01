## Activity Selection: Tactics & Tricks

What are the key tactics for solving activity selection problems efficiently and recognizing disguised variants?

<!-- front -->

---

### Tactic 1: Sort Strategy Selection

| Problem Goal | Sort Key | Rationale |
|--------------|----------|-----------|
| Max count | `end` ascending | Earliest finish = most room left |
| Min conflicts | `start` ascending | Identify bottlenecks |
| With deadlines | `deadline` ascending | Hard constraints first |
| Longest activity | `duration` descending | Special case, not greedy-optimal |

**Always verify:** Does your sort key match the optimization goal?

---

### Tactic 2: Multiple Resources (Minimum Rooms)

When activities need rooms, find **minimum rooms required**:

```python
def min_rooms(activities):
    events = []
    for start, end in activities:
        events.append((start, +1))  # Arrival
        events.append((end, -1))     # Departure
    
    events.sort()  # Sort by time, ends before starts if equal
    
    current = max_rooms = 0
    for time, delta in events:
        current += delta
        max_rooms = max(max_rooms, current)
    
    return max_rooms
```

**Complexity:** O(n log n)  
**Key insight:** This is the dual problem = graph coloring of interval graph

---

### Tactic 3: Recognizing Greedy vs DP

| Check | Greedy | DP Required |
|-------|--------|-------------|
| All weights equal? | Yes | No |
| Need max count? | Yes | No |
| Need max weight? | No | Yes |
| Arbitrary constraints? | No | Yes |

**Test:** If swapping two activities in the greedy solution improves it, greedy fails.

---

### Tactic 4: Fast Implementation

**For competitive programming (n ≤ 10⁶):**

```cpp
vector<pair<int,int>> acts;
sort(acts.begin(), acts.end(), [](auto& a, auto& b) {
    return a.second < b.second;
});

int cnt = 1, last = acts[0].second;
for (int i = 1; i < n; i++) {
    if (acts[i].first >= last) {
        cnt++;
        last = acts[i].second;
    }
}
```

**Micro-optimizations:**
- Use arrays not vectors for speed
- Pre-allocate result capacity
- Inline comparator

---

### Tactic 5: Disguised Variants

| Disguise | Reveal Technique |
|----------|------------------|
| "Maximum courses" | Map to intervals |
| "Non-overlapping intervals" | Direct equivalence |
| "Assign to minimum servers" | Sort by end, count conflicts |
| "Book conference rooms" | Check if intervals intersect |
| "Video stitching" | Cover [0, T] with minimum clips |

**Pattern:** Look for "choose maximum" + "no overlap" + "intervals"

<!-- back -->
