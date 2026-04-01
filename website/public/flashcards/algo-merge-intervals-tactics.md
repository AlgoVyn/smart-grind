## Title: Merge Intervals Tactics

What are the key implementation tactics for interval problems?

<!-- front -->

---

### Implementation Tactics

| Tactic | Benefit |
|--------|---------|
| Sort by start | Natural merge order |
| Sort by end | Greedy selection |
| Two pointers | Compare two sorted lists |
| Sweep line | Event-based processing |
| Custom class | Type safety |

### Sweep Line Pattern
```python
def sweep_line(intervals):
    """Generic sweep line for interval problems"""
    events = []
    for start, end in intervals:
        events.append((start, 1))  # +1 for start
        events.append((end, -1))   # -1 for end
    
    events.sort()  # sort by time, then type
    
    count = max_count = 0
    for time, typ in events:
        count += typ
        max_count = max(max_count, count)
    
    return max_count
```

---

### Common Pitfalls
| Pitfall | Issue | Fix |
|---------|-------|-----|
| [1,4] vs [4,5] | Adjacent overlap | Use ≤ not < |
| Equal start times | Sort stability | Secondary sort by end |
| Empty intervals | Edge case | Check len > 0 |
| Single interval | Return it | Handle trivial case |
| Integer overflow | Large coordinates | Use appropriate types |

### Python Tricks
```python
# Flatten intervals for sweep line
from itertools import chain
events = list(chain(*[((s, 1), (e, -1)) for s, e in intervals]))

# Or using heapq for chronological processing
import heapq
def min_rooms_heap(intervals):
    if not intervals:
        return 0
    
    intervals.sort()
    rooms = []  # min heap of end times
    
    for start, end in intervals:
        if rooms and rooms[0] <= start:
            heapq.heappop(rooms)
        heapq.heappush(rooms, end)
    
    return len(rooms)
```

---

### Performance Tips
```python
# Faster key extraction with itemgetter
from operator import itemgetter
intervals.sort(key=itemgetter(0))  # sort by start

# Or for list of objects
intervals.sort(key=lambda x: (x.start, x.end))
```

<!-- back -->
