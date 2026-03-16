## Task Scheduler

**Question:** Minimum time to finish tasks with cooldown?

<!-- front -->

---

## Answer: Greedy + Math

### Solution
```python
def leastInterval(tasks, n):
    # Count frequencies
    freq = Counter(tasks)
    
    # Maximum frequency
    max_freq = max(freq.values())
    
    # Count tasks with max frequency
    max_count = sum(1 for v in freq.values() if v == max_freq)
    
    # Formula
    partitions = max_freq - 1
    available = partitions * (n - max_count + 1)
    remaining = len(tasks) - max_freq * max_count
    
    idle = max(0, available - remaining)
    
    return len(tasks) + idle
```

### Visual: Task Scheduling
```
tasks = ["A","A","A","B","B","B"], n = 2

A:3, B:3 (max_freq=2, max_count=2)

Partitions = 2 - 1 = 1
Available = 1 * (2 - 2 + 1) = 1
Remaining = 6 - 2*2 = 2
Idle = max(0, 1-2) = 0

Result: 6 + 0 = 8

Schedule: A B B A B _ A
         A B B A B _ A
```

### ⚠️ Tricky Parts

#### 1. Why This Works
```python
# Most frequent tasks define the schedule
# A _ _ A _ _ A (n=2, 3 As)

# Fill gaps with other tasks
# If no other tasks → idle slots

# Formula: (max_freq-1) * (n - max_count + 1)
#   = slots between max-freq tasks
#   + remaining tasks to fill
```

#### 2. Edge Cases
```python
# If n = 0: return len(tasks)
# If all tasks same: return len(tasks)
# If other tasks fill gaps: no idle
```

### Time & Space Complexity

| Method | Time | Space |
|--------|------|-------|
| Count + Formula | O(n) | O(1) |
| Priority Queue | O(n log n) | O(n) |

### Common Mistakes

| Mistake | Fix |
|---------|-----|
| Using heap | Greedy formula works |
| Not handling max_count | Need for multiple max-freq |
| Wrong idle calc | max(0, available - remaining) |

<!-- back -->
