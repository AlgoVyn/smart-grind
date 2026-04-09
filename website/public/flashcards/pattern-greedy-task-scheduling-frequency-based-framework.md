## Greedy Task Scheduling (Frequency Based): Framework

What is the complete code template for solving frequency-based task scheduling problems?

<!-- front -->

---

### Framework: Max Heap with Cooldown Queue

```
┌─────────────────────────────────────────────────────────────┐
│  TASK SCHEDULING - TEMPLATE                                 │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Key Insight: Most frequent task determines min schedule    │
│                                                             │
│  1. Count frequencies:                                      │
│     - freq = Counter(tasks)                                 │
│                                                             │
│  2. Build max-heap (negate for Python):                   │
│     - max_heap = [-count for count in freq.values()]        │
│     - heapq.heapify(max_heap)                               │
│                                                             │
│  3. Initialize:                                             │
│     - time = 0                                                │
│     - cooldown_queue = deque()  # (count, available_time)   │
│                                                             │
│  4. While heap or queue not empty:                          │
│     - time++                                                  │
│     - If heap: pop most frequent, decrement, add to queue   │
│     - If queue front ready: push back to heap               │
│                                                             │
│  5. Return time                                               │
└─────────────────────────────────────────────────────────────┘
```

---

### Implementation: Task Scheduler (LeetCode 621)

```python
from collections import Counter, deque
import heapq

def least_interval(tasks: list[str], n: int) -> int:
    """
    Schedule tasks with n cooldown between identical tasks.
    Time: O(n log m), Space: O(m) where m is unique tasks
    """
    if n == 0:
        return len(tasks)
    
    # Count frequencies
    freq = Counter(tasks)
    
    # Max heap (negate for Python min-heap)
    max_heap = [-count for count in freq.values()]
    heapq.heapify(max_heap)
    
    time = 0
    cooldown_queue = deque()  # (remaining_count, available_time)
    
    while max_heap or cooldown_queue:
        time += 1
        
        if max_heap:
            count = heapq.heappop(max_heap)
            count += 1  # Decrement (less negative)
            
            if count < 0:  # Still tasks remaining
                cooldown_queue.append((count, time + n))
        
        # Check if any tasks are ready from cooldown
        if cooldown_queue and cooldown_queue[0][1] == time:
            heapq.heappush(max_heap, cooldown_queue.popleft()[0])
    
    return time
```

---

### Implementation: Reorganize String (LeetCode 767)

```python
def reorganize_string(s: str) -> str:
    """
    Reorganize string so no two adjacent characters are same.
    Time: O(n log m), Space: O(m)
    """
    freq = Counter(s)
    
    # Check if possible: max_freq > (len+1)/2 → impossible
    max_freq = max(freq.values())
    if max_freq > (len(s) + 1) // 2:
        return ""
    
    # Max heap: (-count, char)
    max_heap = [(-count, char) for char, count in freq.items()]
    heapq.heapify(max_heap)
    
    result = []
    prev_count, prev_char = 0, ''
    
    while max_heap:
        count, char = heapq.heappop(max_heap)
        result.append(char)
        
        # Push previous back if still has count
        if prev_count < 0:
            heapq.heappush(max_heap, (prev_count, prev_char))
        
        prev_count, prev_char = count + 1, char  # Decrement
    
    return ''.join(result)
```

---

### Key Framework Elements

| Element | Purpose | Example |
|---------|---------|---------|
| `Counter(tasks)` | Count frequencies | `{'A': 3, 'B': 2}` |
| `max_heap` | Get most frequent task quickly | Negated counts for Python |
| `cooldown_queue` | Track when tasks available | `(count, available_time)` |
| `time` | Current time unit | Increment each iteration |
| `max_freq > (n+1)/2` | Impossible check | For string reorganization |

---

### Alternative: Mathematical Formula

```python
def least_interval_math(tasks, n):
    """
    Calculate without simulation.
    Time: O(n), Space: O(m)
    """
    freq = Counter(tasks)
    max_freq = max(freq.values())
    max_count = sum(1 for v in freq.values() if v == max_freq)
    
    # Formula: max(total_tasks, (max_freq - 1) * (n + 1) + max_count)
    return max(len(tasks), (max_freq - 1) * (n + 1) + max_count)
```

<!-- back -->
