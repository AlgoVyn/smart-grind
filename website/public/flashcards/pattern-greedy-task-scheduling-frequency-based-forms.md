## Greedy Task Scheduling (Frequency Based): Forms

What are the different forms and variations of frequency-based task scheduling problems?

<!-- front -->

---

### Problem Variations

| Variation | Constraint | Approach | Complexity |
|-----------|------------|----------|------------|
| **Task Scheduler** | Cooldown n between same tasks | Max heap + queue | O(n log m) time, O(m) space |
| **Reorganize String** | No adjacent same characters | Max heap with prev | O(n log m) time, O(m) space |
| **k Distance Apart** | Same chars at least k apart | Max heap + wait queue | O(n log m) time, O(m) space |
| **Repeat Limit** | Max repeat limit per char | Greedy fill | O(n log m) time, O(m) space |
| **Maximum Weeks** | Schedule projects with counts | Math or heap | O(n) or O(n log m) time |

---

### Form 1: Task Scheduler with Cooldown (LeetCode 621)

```python
def least_interval(tasks: list[str], n: int) -> int:
    """
    LeetCode 621: Task Scheduler
    Minimum time to complete all tasks with n cooldown.
    """
    if n == 0:
        return len(tasks)
    
    freq = Counter(tasks)
    max_heap = [-count for count in freq.values()]
    heapq.heapify(max_heap)
    
    time = 0
    cooldown_queue = deque()
    
    while max_heap or cooldown_queue:
        time += 1
        
        if max_heap:
            count = heapq.heappop(max_heap)
            if count + 1 < 0:
                cooldown_queue.append((count + 1, time + n))
        
        if cooldown_queue and cooldown_queue[0][1] == time:
            heapq.heappush(max_heap, cooldown_queue.popleft()[0])
    
    return time

# Example: tasks=['A','A','A','B','B','B'], n=2
# Schedule: A B _ A B _ A B
# Result: 8
```

---

### Form 2: Reorganize String (LeetCode 767)

```python
def reorganize_string(s: str) -> str:
    """
    LeetCode 767: Reorganize String
    No two adjacent characters are the same.
    """
    freq = Counter(s)
    max_freq = max(freq.values())
    
    # Impossible check
    if max_freq > (len(s) + 1) // 2:
        return ""
    
    max_heap = [(-count, char) for char, count in freq.items()]
    heapq.heapify(max_heap)
    
    result = []
    prev_count, prev_char = 0, ''
    
    while max_heap:
        count, char = heapq.heappop(max_heap)
        result.append(char)
        
        if prev_count < 0:
            heapq.heappush(max_heap, (prev_count, prev_char))
        
        prev_count, prev_char = count + 1, char
    
    return ''.join(result)

# Example: s="aab"
# Result: "aba" or "aba"
```

---

### Form 3: k Distance Apart (LeetCode 358)

```python
def rearrange_string_k_distance(s: str, k: int) -> str:
    """
    LeetCode 358: Rearrange String k Distance Apart
    Same characters at least k distance apart.
    """
    if k <= 1:
        return s
    
    freq = Counter(s)
    max_heap = [(-count, char) for char, count in freq.items()]
    heapq.heapify(max_heap)
    
    result = []
    wait_queue = deque()  # (count, char, available_time)
    
    while max_heap or wait_queue:
        if not max_heap and wait_queue[0][2] > len(result):
            return ""  # Impossible
        
        if max_heap:
            count, char = heapq.heappop(max_heap)
            result.append(char)
            
            if count + 1 < 0:
                wait_queue.append((count + 1, char, len(result) + k - 1))
        else:
            result.append('_')  # Idle
        
        if wait_queue and wait_queue[0][2] == len(result) - 1:
            c, ch, _ = wait_queue.popleft()
            heapq.heappush(max_heap, (c, ch))
    
    return ''.join(result)

# Example: s="aabbcc", k=3
# Result: "abcabc"
```

---

### Form 4: String With Repeat Limit (LeetCode 2182)

```python
def repeat_limited_string(s: str, repeat_limit: int) -> str:
    """
    LeetCode 2182: Construct String With Repeat Limit
    No character repeats more than repeat_limit consecutively.
    """
    freq = Counter(s)
    max_heap = [(-ord(c), count) for c, count in freq.items()]
    heapq.heapify(max_heap)
    
    result = []
    
    while max_heap:
        neg_ord, count = heapq.heappop(max_heap)
        char = chr(-neg_ord)
        
        # Use up to repeat_limit of current char
        use = min(count, repeat_limit)
        result.extend([char] * use)
        remaining = count - use
        
        if remaining > 0:
            # Need different char next
            if not max_heap:
                break  # Cannot place remaining
            
            next_neg_ord, next_count = heapq.heappop(max_heap)
            next_char = chr(-next_neg_ord)
            result.append(next_char)
            
            # Push back both
            heapq.heappush(max_heap, (neg_ord, remaining))
            if next_count > 1:
                heapq.heappush(max_heap, (next_neg_ord, next_count - 1))
    
    return ''.join(result)

# Example: s="cczazcc", repeat_limit=3
# Result: "zzcccac"
```

---

### Form 5: Maximum Number of Weeks (LeetCode 1953)

```python
def number_of_weeks(milestones: list[int]) -> int:
    """
    LeetCode 1953: Maximum Number of Weeks
    Schedule projects without working same project two weeks in a row.
    """
    total = sum(milestones)
    max_milestone = max(milestones)
    
    # If max <= sum of rest, we can schedule all
    # Otherwise, we can only do: 2 * (total - max) + 1
    if max_milestone <= total - max_milestone:
        return total
    else:
        return 2 * (total - max_milestone) + 1

# Mathematical insight:
# If max > rest_sum, schedule alternates: max, other, max, other...
# We can place max (rest_sum + 1) times maximum
# Total = rest_sum (fill between) + (rest_sum + 1) = 2*rest_sum + 1

# Example: milestones=[1,2,3]
# total=6, max=3, rest=3
# max <= rest? Yes (3 <= 3)
# Result: 6 (all weeks possible)
```

---

### Decision Flowchart

```
Read problem statement
│
├─ "cooldown" or "n intervals" mentioned?
│   └─→ Use: Max heap + cooldown queue (Task Scheduler)
│
├─ "no adjacent" or "reorganize string"?
│   ├─ "k distance" or "distance apart" mentioned?
│   │   └─→ Use: Max heap with k-wait queue
│   ├─ "repeat limit" mentioned?
│   │   └─→ Use: Greedy with limit tracking
│   └─ Otherwise
│       └─→ Use: Max heap with prev tracking (Reorganize String)
│
├─ "maximum weeks" or "schedule projects"?
│   └─→ Use: Mathematical formula (compare max vs sum of rest)
│
└─ Need actual schedule or just time?
    ├─ Need schedule → Use heap approach
    └─ Time only → Use mathematical formula
```

---

### Quick Reference Table

| LeetCode | Problem | Key Constraint | Solution Pattern |
|----------|---------|----------------|------------------|
| 621 | Task Scheduler | Cooldown n | Heap + queue |
| 767 | Reorganize String | No adjacent same | Heap with prev |
| 358 | k Distance Apart | Minimum k distance | Heap + k-wait |
| 2182 | Repeat Limit | Max consecutive | Greedy fill |
| 1953 | Maximum Weeks | No consecutive same project | Math formula |

<!-- back -->
