## Reorganize String

**Question:** Rearrange so no adjacent chars are same?

<!-- front -->

---

## Answer: Greedy + Max Heap

### Solution
```python
import heapq
from collections import Counter

def reorganizeString(s):
    freq = Counter(s)
    
    # Use max heap (negative frequencies)
    max_heap = [(-count, char) for char, count in freq.items()]
    heapq.heapify(max_heap)
    
    result = []
    prev_count, prev_char = 0, ''
    
    while max_heap:
        count, char = heapq.heappop(max_heap)
        
        # Add previous char back
        if prev_count < 0:
            heapq.heappush(max_heap, (prev_count, prev_char))
        
        # Add current char
        result.append(char)
        count += 1  # Because we stored negative
        
        # Update previous
        prev_count = count
        prev_char = char
    
    # Check if valid
    if len(result) == len(s):
        return ''.join(result)
    return ''
```

### Visual: Greedy Scheduling
```
s = "aaabbc"

Freq: a:3, b:2, c:1

Step 1: Pop a(-3), add 'a', push back (-2)
        result: a, heap: [(-2,b), (-1,c)]
        
Step 2: Pop b(-2), add 'b', push back (-1)
        result: ab, heap: [(-1,c), (-1,a)]

Step 3: Pop c(-1), add 'c', nothing to push
        result: abc

Step 4: Pop a(-1), add 'a'
        result: abca

Result: "ababcab" (valid!)
```

### ⚠️ Tricky Parts

#### 1. Why Always Take Most Frequent?
```python
# If we can't place most frequent without adjacency
# Then impossible to reorganize

# Greedy: always use most frequent available
# This maximizes chances of success
```

#### 2. Storing Negative Counts
```python
# Python heapq is min-heap
# Use negative to get max-heap behavior

# Alternative: use sorted list and pop(0)
```

### Time & Space Complexity

| Method | Time | Space |
|--------|------|-------|
| Heap | O(n log k) | O(k) |
| Sort | O(n log n) | O(1) |

### Common Mistakes

| Mistake | Fix |
|---------|-----|
| Not tracking prev | Need to defer char |
| Wrong negative | Count stored negative |
| Not checking result | Verify length matches |

<!-- back -->
