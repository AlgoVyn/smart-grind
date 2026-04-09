## Greedy - Jump Game Reachability/Minimization: Forms

What are the different problem forms and variations of Jump Game patterns?

<!-- front -->

---

### Form 1: Classic Jump Game I

**Problem:** Can reach last index?
**Pattern:** Single farthest tracking

```python
def can_jump(nums: list[int]) -> bool:
    farthest = 0
    for i, jump in enumerate(nums):
        if i > farthest:
            return False
        farthest = max(farthest, i + jump)
    return True
```

**Example:**
- Input: `[2,3,1,1,4]` → Output: `True`
- Input: `[3,2,1,0,4]` → Output: `False`

---

### Form 2: Classic Jump Game II

**Problem:** Minimum jumps to reach end?
**Pattern:** Track current_end and farthest

```python
def jump(nums: list[int]) -> int:
    n = len(nums)
    if n <= 1:
        return 0
    
    jumps = current_end = farthest = 0
    
    for i in range(n - 1):
        farthest = max(farthest, i + nums[i])
        if i == current_end:
            jumps += 1
            current_end = farthest
    
    return jumps
```

**Example:**
- Input: `[2,3,1,1,4]` → Output: `2` (0→1→4)

---

### Form 3: Jump Game with Index Constraints (III)

**Problem:** Can reach index with value 0, starting from `start`?
**Pattern:** BFS/DFS with ±jump movement
**Constraint:** Can only jump to `i + nums[i]` or `i - nums[i]`

```python
from collections import deque

def can_reach(nums, start):
    n = len(nums)
    visited = [False] * n
    queue = deque([start])
    
    while queue:
        i = queue.popleft()
        if nums[i] == 0:
            return True
        
        for nxt in [i + nums[i], i - nums[i]]:
            if 0 <= nxt < n and not visited[nxt]:
                visited[nxt] = True
                queue.append(nxt)
    
    return False
```

---

### Form 4: Interval Coverage (Video Stitching)

**Problem:** Minimum clips to cover [0, T]?
**Pattern:** Sort + greedy extension (Jump Game variant)

```python
def video_stitching(clips, T):
    clips.sort()  # Sort by start time
    
    end = 0       # Current coverage end
    farthest = 0  # Farthest reachable
    jumps = 0     # Clips used
    i = 0
    
    while end < T:
        # Find all clips starting at or before 'end'
        while i < len(clips) and clips[i][0] <= end:
            farthest = max(farthest, clips[i][1])
            i += 1
        
        if farthest <= end:  # Cannot extend coverage
            return -1
        
        jumps += 1
        end = farthest
    
    return jumps
```

---

### Form 5: Minimum Taps to Water Garden

**Problem:** Minimum taps to water entire garden?
**Pattern:** Convert to Jump Game II

```python
def min_taps(n, ranges):
    # Convert to max reach array
    max_reach = [0] * (n + 1)
    
    for i, r in enumerate(ranges):
        left = max(0, i - r)
        right = min(n, i + r)
        max_reach[left] = max(max_reach[left], right)
    
    # Now solve as Jump Game II
    jumps = current_end = farthest = 0
    
    for i in range(n):
        farthest = max(farthest, max_reach[i])
        
        if i == current_end:
            jumps += 1
            current_end = farthest
            
            if current_end >= n:
                return jumps
    
    return -1
```

---

### Form Selection Guide

| Problem Characteristics | Form to Use |
|------------------------|-------------|
| Array = max jump lengths, reach end? | Form 1: Jump Game I |
| Array = max jump lengths, min jumps? | Form 2: Jump Game II |
| Can jump ±value from position | Form 3: BFS/DFS |
| Intervals to cover range | Form 4: Interval Greedy |
| Points with coverage radius | Form 5: Convert to Jump Game |

<!-- back -->
