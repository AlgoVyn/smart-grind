## Greedy Task Scheduling (Frequency Based): Core Concepts

What are the fundamental principles of frequency-based task scheduling?

<!-- front -->

---

### Core Concept

Use a **greedy approach with max-heap and cooldown tracking** to schedule the most frequent tasks first, minimizing idle time between identical task executions.

**Key insight**: The most frequent task determines the minimum schedule length. Always execute the highest frequency available task to minimize idle slots.

---

### The Pattern

```
Schedule tasks ['A','A','A','B','B','C'] with cooldown n=2:

Frequencies: A=3, B=2, C=1

Time 0: Max heap = [A(3), B(2), C(1)]
        Execute A → A(2) goes to cooldown until time 3
        Schedule: [A]

Time 1: Max heap = [B(2), C(1)]
        Execute B → B(1) goes to cooldown until time 4
        Schedule: [A, B]

Time 2: Max heap = [C(1)]
        Execute C → C(0) done
        Schedule: [A, B, C]

Time 3: A ready! Max heap = [A(2)]
        Execute A → A(1) goes to cooldown until time 6
        Schedule: [A, B, C, A]

Time 4: B ready! Max heap = [B(1)]
        Execute B → B(0) done
        Schedule: [A, B, C, A, B]

Time 5: Idle (nothing ready)
        Schedule: [A, B, C, A, B, _]

Time 6: A ready! Max heap = [A(1)]
        Execute A → A(0) done
        Schedule: [A, B, C, A, B, _, A]

Result: 7 time units
```

---

### Key Principles

| Principle | Explanation | Why It Works |
|-----------|-------------|--------------|
| **Most frequent first** | Always pick highest frequency available task | Determines minimum schedule length |
| **Cooldown tracking** | Use queue to track when tasks become available | Enforces constraints between same tasks |
| **Greedy choice** | Execute best available task at each time | Locally optimal leads to globally optimal |
| **Idle slots** | Fill idle time with less frequent tasks | Minimizes total completion time |

---

### Mathematical Bound

```
Formula: max(total_tasks, (max_freq - 1) * (n + 1) + max_count)

Where:
- max_freq = highest frequency of any single task
- max_count = number of tasks with max_freq
- n = cooldown period

Example: tasks=['A','A','A','B','B','B'], n=2
- max_freq = 3 (both A and B)
- max_count = 2 (A and B both have freq 3)
- total_tasks = 6

Result: max(6, (3-1)*(2+1) + 2) = max(6, 8) = 8
```

---

### Common Applications

| Problem Type | Description | Example |
|--------------|-------------|---------|
| **Task Scheduler** | Schedule with cooldown constraint | LeetCode 621 |
| **Reorganize String** | No adjacent same characters | LeetCode 767 |
| **k Distance Apart** | Minimum distance between same chars | LeetCode 358 |
| **CPU Scheduling** | Process scheduling with priorities | Operating systems |

---

### Complexity

| Aspect | Complexity | Notes |
|--------|-----------|-------|
| **Time** | O(n log m) | Heap operations for m unique tasks |
| **Space** | O(m) | Frequency map, heap, and queue |
| **n** | Total tasks | Input size |
| **m** | Unique tasks | Distinct task types |

<!-- back -->
