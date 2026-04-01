## Detect Cycle: Problem Forms

What are the variations and applications of cycle detection?

<!-- front -->

---

### Happy Number

```python
def is_happy(n: int) -> bool:
    """
    Happy number: sum of squared digits eventually reaches 1
    Unhappy: enters cycle, never reaches 1
    """
    def get_next(num):
        total = 0
        while num > 0:
            digit = num % 10
            total += digit * digit
            num //= 10
        return total
    
    slow = fast = n
    
    while True:
        slow = get_next(slow)
        fast = get_next(get_next(fast))
        
        if fast == 1:
            return True
        if slow == fast:
            return False
```

---

### Find Duplicate Number (Array)

```python
def find_duplicate(nums: list) -> int:
    """
    Array of n+1 integers in [1, n], find duplicate
    Treat as linked list: index → value → next index
    """
    # Phase 1: Find meeting
    slow = fast = nums[0]
    
    while True:
        slow = nums[slow]
        fast = nums[nums[fast]]
        if slow == fast:
            break
    
    # Phase 2: Find entry (duplicate)
    slow = nums[0]
    while slow != fast:
        slow = nums[slow]
        fast = nums[fast]
    
    return slow
```

---

### Circular Array Loop

```python
def circular_array_loop(nums: list) -> bool:
    """
    Detect if there's a cycle in array movement
    All steps in cycle must be same direction
    """
    n = len(nums)
    
    def next_idx(i):
        return ((i + nums[i]) % n + n) % n
    
    for i in range(n):
        if nums[i] == 0:
            continue
        
        slow, fast = i, i
        direction = nums[i] > 0
        
        while True:
            slow = next_idx(slow)
            if nums[slow] == 0 or (nums[slow] > 0) != direction:
                break
            
            fast = next_idx(fast)
            if nums[fast] == 0 or (nums[fast] > 0) != direction:
                break
            fast = next_idx(fast)
            if nums[fast] == 0 or (nums[fast] > 0) != direction:
                break
            
            if slow == fast:
                if slow != next_idx(slow):  # Not single element loop
                    return True
                break
        
        # Mark as visited
        j = i
        while nums[j] != 0 and (nums[j] > 0) == direction:
            next_j = next_idx(j)
            nums[j] = 0
            j = next_j
    
    return False
```

---

### Detect Cycle in Undirected Graph

```python
def has_cycle_undirected(graph, n):
    """
    DFS-based cycle detection
    """
    visited = [False] * n
    
    def dfs(node, parent):
        visited[node] = True
        
        for neighbor in graph[node]:
            if not visited[neighbor]:
                if dfs(neighbor, node):
                    return True
            elif neighbor != parent:
                return True
        
        return False
    
    for i in range(n):
        if not visited[i]:
            if dfs(i, -1):
                return True
    
    return False
```

---

### Periodicity Detection in Sequences

```python
def find_period(sequence, max_period=1000):
    """
    Find if a generated sequence is periodic
    """
    seen = {}
    
    for i, val in enumerate(sequence):
        if val in seen:
            start = seen[val]
            period = i - start
            return {'start': start, 'period': period}
        
        seen[val] = i
        
        if i > max_period * 2:  # Safety limit
            break
    
    return None  # No period found in range
```

<!-- back -->
