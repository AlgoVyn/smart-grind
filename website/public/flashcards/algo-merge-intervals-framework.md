## Title: Merge Intervals Framework

What is the standard framework for interval problems?

<!-- front -->

---

### Merge Intervals Framework
```
MERGE_INTERVALS(intervals):
  if intervals empty: return []
  
  // Phase 1: Sort
  sort intervals by start time
  
  // Phase 2: Merge
  result = [intervals[0]]
  
  for each current in intervals[1:]:
    last = result[-1]
    
    if current.start <= last.end:    // Overlap
      last.end = max(last.end, current.end)  // Extend
    else:                            // No overlap
      result.append(current)
  
  return result
```

---

### Key Concepts
| Concept | Definition |
|---------|------------|
| Overlap | [a,b] and [c,d] overlap if c ≤ b |
| Containment | [a,b] contains [c,d] if a ≤ c and d ≤ b |
| Adjacent | Touching at endpoint [a,b] and [b,c] |
| Sort key | Primary: start, Secondary: end |

### Common Operations
| Operation | Approach |
|-----------|----------|
| Merge all | Sort + sweep |
| Insert interval | Binary search for position |
| Find overlap | Check start ≤ end |
| Interval intersection | max(starts), min(ends) |

---

### Related Problems
| Problem | Extension |
|---------|-----------|
| Insert interval | Find position with binary search |
| Remove covered | Don't merge if one covers another |
| Non-overlapping | Greedy by end time |
| Meeting rooms | Count max overlapping |
| Employee free time | Find gaps between merged |

<!-- back -->
