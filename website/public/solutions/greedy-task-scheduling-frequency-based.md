# Greedy - Task Scheduling (Frequency Based)

## Overview

The Greedy - Task Scheduling (Frequency Based) pattern is used for problems where tasks need to be scheduled based on their frequencies or priorities, often with constraints like cooldown periods between identical tasks. This pattern prioritizes scheduling the most frequent tasks first to minimize idle time or ensure efficient resource utilization.

When to use this pattern:
- When tasks have different frequencies and need optimal scheduling
- For problems with cooldown constraints between identical tasks
- In scenarios requiring maximum CPU utilization or minimum idle time

Benefits:
- Provides efficient scheduling that maximizes throughput
- Handles frequency-based priorities optimally
- Works well with cooldown and repetition constraints

## Key Concepts

- **Frequency Counting**: Count occurrences of each task
- **Priority Scheduling**: Schedule highest frequency tasks first
- **Cooldown Management**: Ensure minimum time between identical tasks
- **Greedy Choice**: Always pick the most frequent available task

## Template

```python
import heapq
from collections import Counter, deque

def least_interval(tasks, n):
    """
    Template for scheduling tasks with cooldown between identical tasks.
    
    Args:
    tasks (List[str]): List of tasks to schedule
    n (int): Cooldown period between identical tasks
    
    Returns:
    int: Minimum time units required to complete all tasks
    """
    if not tasks:
        return 0
    
    # Count frequencies
    freq = Counter(tasks)
    
    # Max heap for frequencies (negative for max heap)
    max_heap = [-count for count in freq.values()]
    heapq.heapify(max_heap)
    
    time = 0
    cooldown_queue = deque()  # (count, available_time)
    
    while max_heap or cooldown_queue:
        time += 1
        
        # If there are tasks ready to schedule
        if max_heap:
            count = heapq.heappop(max_heap)
            count += 1  # Decrease frequency (since negative)
            
            if count < 0:  # Still tasks left
                cooldown_queue.append((count, time + n))
        
        # Check if any tasks are ready from cooldown
        if cooldown_queue and cooldown_queue[0][1] == time:
            heapq.heappush(max_heap, cooldown_queue.popleft()[0])
    
    return time

def reorganize_string(s):
    """
    Template for reorganizing string so no two identical characters are adjacent.
    
    Args:
    s (str): Input string
    
    Returns:
    str: Reorganized string or "" if impossible
    """
    freq = Counter(s)
    max_heap = [(-count, char) for char, count in freq.items()]
    heapq.heapify(max_heap)
    
    result = []
    prev = None
    
    while max_heap:
        # Get most frequent
        count, char = heapq.heappop(max_heap)
        result.append(char)
        count += 1  # Decrease count
        
        # Push previous back if it exists
        if prev:
            heapq.heappush(max_heap, prev)
            prev = None
        
        # If current still has counts, save for next
        if count < 0:
            prev = (count, char)
    
    # If we used all characters and no leftover, success
    if len(result) == len(s):
        return ''.join(result)
    else:
        return ""
```

## Example Problems

1. **Task Scheduler (LeetCode 621)**: Given a list of tasks and a cooldown period, find the minimum time to complete all tasks.

2. **Reorganize String (LeetCode 767)**: Given a string, reorganize it so that no two identical characters are adjacent.

3. **Rearrange String k Distance Apart (LeetCode 358)**: Rearrange a string so that the same characters are at least k distance apart.

## Time and Space Complexity

- **Time Complexity**: O(n log m) where n is the number of tasks and m is the number of unique tasks, due to heap operations.
- **Space Complexity**: O(m) for the frequency counter and heap, where m is the number of unique tasks.

## Common Pitfalls

- **Cooldown Handling**: Properly manage the cooldown queue with available times.
- **Heap Usage**: Remember to use negative counts for max heap in Python.
- **Edge Cases**: Handle cases with no cooldown (n=0), single task, or impossible arrangements.
- **Frequency Ties**: When frequencies are equal, any order is fine.
- **Completing All Tasks**: Ensure all tasks are scheduled, even if it requires idle time.