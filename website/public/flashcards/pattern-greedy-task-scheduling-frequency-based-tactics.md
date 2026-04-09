## Greedy Task Scheduling (Frequency Based): Tactics

What are practical tactics for solving frequency-based task scheduling problems?

<!-- front -->

---

### Tactic 1: Problem Classification

**Quick classification to choose the right approach:**

```python
def classify_scheduling_problem(description):
    """
    Determine which scheduling pattern to use.
    """
    keywords = {
        'cooldown': 'task_scheduler_heap',
        'n intervals': 'task_scheduler_heap',
        'idle time': 'task_scheduler_heap',
        'reorganize string': 'reorganize_string',
        'no adjacent': 'reorganize_string',
        'k distance apart': 'k_distance_heap',
        'rearrange string': 'reorganize_string',
    }
    
    for keyword, pattern in keywords.items():
        if keyword in description.lower():
            return pattern
    
    return 'unknown'
```

| Keyword | Approach | Time | Space |
|---------|----------|------|-------|
| "cooldown" / "n intervals" | Max heap + queue | O(n log m) | O(m) |
| "reorganize" / "no adjacent" | Max heap with prev | O(n log m) | O(m) |
| "k distance apart" | Max heap + wait queue | O(n log m) | O(m) |
| "minimum time" / "idle" | Math formula or heap | O(n) or O(n log m) | O(m) |

---

### Tactic 2: Visual Schedule Construction

**Draw the schedule to understand the pattern:**

```
Tasks: ['A','A','A','B','B','C'], n=2 (cooldown)

Frequencies: A=3, B=2, C=1

Constructing schedule:
┌─────┬─────┬─────┬─────┬─────┬─────┬─────┐
│  0  │  1  │  2  │  3  │  4  │  5  │  6  │
├─────┼─────┼─────┼─────┼─────┼─────┼─────┤
│  A  │  B  │  C  │  A  │  B  │  _  │  A  │
└─────┴─────┴─────┴─────┴─────┴─────┴─────┘
       ↑     ↑           ↑
   A needs   C fills   B ready
   cooldown  idle      again

Time slots: 7 (including 1 idle)
```

**Code trace:**
```python
def visualize_schedule(tasks, n):
    """Print schedule construction step by step."""
    freq = Counter(tasks)
    max_heap = [-c for c in freq.values()]
    heapq.heapify(max_heap)
    queue = deque()
    
    time = 0
    schedule = []
    
    while max_heap or queue:
        if max_heap:
            count = heapq.heappop(max_heap)
            count += 1
            task_char = chr(ord('A') + len(schedule) % 26)  # Simplified
            schedule.append(task_char)
            print(f"Time {time}: Execute {task_char} (remaining: {-count})")
            if count < 0:
                queue.append((count, time + n))
                print(f"         → {task_char} cooling until time {time + n}")
        else:
            schedule.append('_')
            print(f"Time {time}: IDLE (waiting for cooldown)")
        
        if queue and queue[0][1] == time:
            heapq.heappush(max_heap, queue.popleft()[0])
            print(f"         → Task ready from cooldown")
        
        time += 1
    
    print(f"\nFinal schedule: {schedule}")
    return time
```

---

### Tactic 3: Impossible Check for String Reorganization

**Quick validation before attempting to solve:**

```python
def can_reorganize(s: str) -> bool:
    """
    Check if reorganization is possible without adjacent duplicates.
    """
    freq = Counter(s)
    max_freq = max(freq.values())
    
    # Key insight: max_freq cannot exceed (len+1)/2
    # Otherwise, some same chars must be adjacent
    limit = (len(s) + 1) // 2
    
    if max_freq > limit:
        print(f"IMPOSSIBLE: max_freq({max_freq}) > limit({limit})")
        return False
    
    print(f"POSSIBLE: max_freq({max_freq}) <= limit({limit})")
    return True


# Examples:
# can_reorganize("aab") → True  (max_freq=2, limit=2)
# can_reorganize("aaab") → False (max_freq=3, limit=2)
```

**Visual explanation:**
```
For "aaab": max_freq=3, limit=2

Slots to place:  _ _ _ _  (4 positions)
Must place 'a':  a _ a _ a  (needs 3 positions)
                
But we only have 4 positions, and 'a' needs every other slot.
Max possible: a _ a _ (only 2 a's with gaps)
              
So 3 a's cannot fit without adjacency → IMPOSSIBLE
```

---

### Tactic 4: Two-Pass Array Fill (Alternative Approach)

**For string reorganization without heap:**

```python
def reorganize_string_two_pass(s: str) -> str:
    """
    Fill even indices first, then odd indices.
    Guarantees no adjacent duplicates if possible.
    """
    freq = Counter(s)
    max_freq = max(freq.values())
    
    if max_freq > (len(s) + 1) // 2:
        return ""
    
    # Sort by frequency descending
    chars = sorted(freq.keys(), key=lambda x: freq[x], reverse=True)
    
    result = [''] * len(s)
    idx = 0
    
    # Fill even indices (0, 2, 4...) with most frequent
    for char in chars:
        for _ in range(freq[char]):
            if idx >= len(s):
                idx = 1  # Switch to odd indices
            result[idx] = char
            idx += 2
    
    return ''.join(result)


# Execution trace for "aaabbc":
# Sorted: [('a', 3), ('b', 2), ('c', 1)]
# 
# Fill even indices (0, 2, 4):
#   a at 0:  a _ _ _ _ _
#   a at 2:  a _ a _ _ _
#   a at 4:  a _ a _ a _
# 
# Fill odd indices (1, 3, 5):
#   b at 1:  a b a _ a _
#   b at 3:  a b a b a _
#   c at 5:  a b a b a c
```

---

### Tactic 5: Mathematical Formula Shortcut

**When you only need the time count, not the actual schedule:**

```python
def min_time_math_formula(tasks, n):
    """
    Calculate minimum time without building schedule.
    Much faster for large inputs.
    """
    freq = Counter(tasks)
    max_freq = max(freq.values())
    max_count = sum(1 for v in freq.values() if v == max_freq)
    
    # Part 1: Tasks create (max_freq - 1) groups
    # Each group has (n + 1) slots (including the task itself)
    part_count = max_freq - 1
    part_length = n + 1
    
    # Part 2: Count idle slots needed
    empty_slots = part_count * part_length
    available_tasks = len(tasks) - max_freq * max_count
    idles = max(0, empty_slots - available_tasks)
    
    # Final: tasks + idle time
    return len(tasks) + idles


# Derivation:
# A _ _ A _ _ A  (max_freq=3, n=2)
# 
# Groups: (A _ _) and (A _ _) and (A)
# Each full group: (n+1) = 3 slots
# Number of full groups: (max_freq-1) = 2
# 
# Required slots for structure: 2 * 3 + 1 (last A) = 7
# But if multiple tasks have max_freq, add them at end
```

---

### Tactic 6: Debugging Heap State

**Print heap and queue state for debugging:**

```python
def schedule_with_debug(tasks, n):
    """Debug version with state visualization."""
    freq = Counter(tasks)
    max_heap = [-c for c in freq.values()]
    heapq.heapify(max_heap)
    queue = deque()
    
    time = 0
    
    print(f"Initial freq: {dict(freq)}")
    print(f"Initial heap: {sorted(max_heap)}")
    print("-" * 40)
    
    while max_heap or queue:
        print(f"\nTime {time}:")
        print(f"  Heap: {sorted(max_heap)}")
        print(f"  Queue: {list(queue)}")
        
        if max_heap:
            count = heapq.heappop(max_heap)
            count += 1
            print(f"  → Pop {-count-1}, decrement to {-count}")
            if count < 0:
                queue.append((count, time + n))
                print(f"  → Add to queue (ready at time {time + n})")
        else:
            print(f"  → IDLE (heap empty)")
        
        if queue and queue[0][1] == time:
            ready = queue.popleft()
            heapq.heappush(max_heap, ready[0])
            print(f"  → Task ready from queue!")
        
        time += 1
    
    print(f"\nTotal time: {time}")
    return time
```

<!-- back -->
