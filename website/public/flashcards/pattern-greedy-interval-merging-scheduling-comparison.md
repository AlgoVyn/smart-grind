## Greedy - Interval Merging/Scheduling: Comparison

How do different interval algorithms compare and when should you use each?

<!-- front -->

---

### Algorithm Comparison Table

| Problem | Algorithm | Time | Space | Key Operation |
|---------|-----------|------|-------|---------------|
| Merge all overlapping | Sort + sweep | O(n log n) | O(n) | Extend end if overlap |
| Insert one interval | Three-phase scan | O(n) | O(n) | Before, merge, after |
| Min intervals to remove | Sort by end + greedy | O(n log n) | O(1) | Pick earliest ending |
| Max concurrent events | Min-heap | O(n log n) | O(n) | Track end times |
| Max concurrent (alt) | Sweep line | O(n log n) | O(n) | Start/end events |
| Intersection of two lists | Two pointers | O(n + m) | O(1)* | Advance smaller end |
| Employee free time | Merge all + gaps | O(n log n) | O(n) | Merge then find gaps |

*Excluding result storage

---

### Sort Order: Start vs End

| Sort By | Use For | Why |
|---------|---------|-----|
| **Start time** | Merge intervals, Meeting rooms, Intersection | Natural left-to-right processing |
| **End time** | Activity selection, Min removal | Earliest finishing leaves most room |
| **Both** | Sweep line | Start and end as separate events |

```
Why Activity Selection needs END time sorting:

Input: [[1, 100], [2, 3], [3, 4], [4, 5]]

If sorted by START: [1,100], [2,3], [3,4], [4,5]
  → Pick [1,100], then nothing else fits
  → Result: 1 interval (suboptimal!)

If sorted by END: [2,3], [3,4], [4,5], [1,100]
  → Pick [2,3], then [3,4], then [4,5]
  → Result: 3 intervals (optimal!)
```

---

### Greedy vs Dynamic Programming for Intervals

| Problem Type | Approach | Why |
|--------------|----------|-----|
| Standard merge | Greedy | No choices needed, deterministic |
| Activity selection | Greedy | Optimal substructure exists |
| Weighted interval scheduling | DP | Greedy fails with weights |
| Meeting rooms | Greedy (heap) | Resource allocation |
| Interval partitioning | Greedy | Graph coloring equivalence |

```
Weighted Interval Scheduling (needs DP):
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  Intervals with profits:                                   │
│  A: [1, 10] profit 10                                       │
│  B: [2, 3] profit 5                                        │
│  C: [4, 5] profit 5                                        │
│  D: [6, 7] profit 5                                        │
│                                                             │
│  Greedy (by end): B, C, D → profit 15                      │
│  Better: A → profit 10... wait, B+C+D = 15 > 10            │
│                                                             │
│  Actually: B+C+D = 15 is better in this case               │
│  But: [1,4] p=6, [3,5] p=6, [6,8] p=6 vs [1,8] p=10        │
│  Greedy would pick [1,4], [6,8] = 12, but [1,8] = 10       │
│  Actually greedy still wins... need better example         │
│                                                             │
│  Classic case where greedy fails:                          │
│  [1,4] w=5, [3,5] w=5, [6,8] w=5 vs [1,8] w=11           │
│  Greedy picks [1,4]+[6,8] = 10 < 11 optimal                │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

### Heap vs Sweep Line for Meeting Rooms

| Aspect | Min-Heap | Sweep Line |
|--------|----------|------------|
| **Concept** | Track when rooms free up | Count active meetings over time |
| **Implementation** | Push/pop end times | Generate and sort events |
| **Clarity** | More intuitive | Easier for complex conditions |
| **Extensions** | Harder (weighted) | Easier (weighted, conditions) |
| **Space** | O(k) where k=concurrent | O(2n) for events |
| **Time** | O(n log k) | O(n log n) |

**Recommendation:** Use heap for standard problems, sweep line for variants.

---

### Approach Decision Tree

```
What is the problem asking?
│
├── "Merge all overlapping"
│   └── Sort by start + sweep
│
├── "Insert one into sorted"
│   └── Three-phase scan (no re-sort)
│
├── "Maximum non-overlapping" or "minimum to remove"
│   └── Sort by END + greedy
│
├── "Meeting rooms required" or "concurrent maximum"
│   ├── Standard: Sort by start + min-heap
│   └── Complex conditions: Sweep line
│
├── "Find common time" or "intersection"
│   └── Two pointers (both sorted by start)
│
├── "Find free time" or "available slots"
│   └── Merge all busy intervals + find gaps
│
└── "Weighted" or "profit based"
    └── Dynamic programming (not greedy!)
```

---

### Python Implementation Choices

```python
# Sorting options
intervals.sort(key=lambda x: x[0])           # By start
intervals.sort(key=lambda x: x[1])           # By end
intervals.sort(key=lambda x: (x[0], -x[1]))  # Start asc, end desc

# Heap operations (meeting rooms)
import heapq
heapq.heappush(heap, end_time)
heapq.heappop(heap)  # Gets minimum end time

# Sweep line events
events = [(start, 1) for start, _ in intervals] + \
         [(end, -1) for _, end in intervals]
events.sort()  # Sorts by time, then delta

# Two pointers
while i < len(first) and j < len(second):
    # Process
    if first[i][1] < second[j][1]:
        i += 1
    else:
        j += 1
```

---

### Common Pitfalls Comparison

| Pitfall | Standard Merge | Activity Selection | Min Rooms |
|---------|---------------|-------------------|-----------|
| Wrong sort order | By end (works but suboptimal) | By start (wrong answer) | By end (still works) |
| `<` vs `<=` | May miss touching intervals | May skip valid intervals | Room count off by 1 |
| Not handling single interval | Edge case | Edge case | Returns 0 not 1 |
| Empty input | Return [] | Return 0 | Return 0 |
| Modifying while iterating | Safe (new list) | Safe | Heap must be separate |

<!-- back -->
