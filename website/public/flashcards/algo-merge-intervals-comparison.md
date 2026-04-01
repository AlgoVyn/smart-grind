## Title: Merge Intervals Comparison

How does Merge Intervals compare to other interval algorithms?

<!-- front -->

---

### Algorithm Comparison
| Problem | Algorithm | Time | Space |
|---------|-----------|------|-------|
| Merge all | Sort + sweep | O(n log n) | O(n) |
| Insert one | Binary search | O(n) | O(n) |
| Min to remove | Greedy by end | O(n log n) | O(1) |
| Max concurrent | Sweep line | O(n log n) | O(n) |
| Intersection | Two pointers | O(n + m) | O(1) |

### Greedy vs DP for Intervals
| Problem | Approach | Why |
|---------|----------|-----|
| Non-overlapping | Greedy | Optimal substructure |
| Weighted interval scheduling | DP | Greedy fails |
| Interval partitioning | Greedy | Earliest deadline |
| Interval coloring | Greedy | Graph coloring special case |

### Python Interval Libraries
```python
# Using built-in sorted with custom key
intervals.sort(key=lambda x: (x[0], -x[1]))  # start asc, end desc

# intervaltree library (third-party)
# from intervaltree import IntervalTree
# t = IntervalTree()
# t[begin:end] = data
```

---

### Related Data Structures
| Structure | Use Case |
|-----------|----------|
| Interval Tree | Point queries, overlapping |
| Segment Tree | Range queries, updates |
| Fenwick Tree | Prefix sums on intervals |
| Sweep Line | Event processing |

<!-- back -->
