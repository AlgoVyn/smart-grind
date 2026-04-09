## Heap - Top K Elements: Forms

What are the different variations of Top K Elements problems?

<!-- front -->

---

### Form 1: K Largest Elements

Find the K largest values in an unsorted array.

```python
def k_largest(nums, k):
    """Find K largest elements using min-heap."""
    min_heap = []
    
    for num in nums:
        heapq.heappush(min_heap, num)
        if len(min_heap) > k:
            heapq.heappop(min_heap)
    
    return min_heap  # Unsorted

# Example:
# nums = [3, 1, 4, 1, 5, 9, 2, 6], k = 3
# Result: [4, 6, 9] (any order)
```

**When to use:** Top K values, leaderboard, highest scores.

---

### Form 2: K Smallest Elements

Find the K smallest values (use max-heap via negation in Python).

```python
def k_smallest(nums, k):
    """Find K smallest elements."""
    max_heap = []
    
    for num in nums:
        heapq.heappush(max_heap, -num)  # Negate for max-heap
        if len(max_heap) > k:
            heapq.heappop(max_heap)
    
    return [-x for x in max_heap]  # Un-negate

# Example:
# nums = [3, 1, 4, 1, 5, 9, 2, 6], k = 3
# Result: [1, 2, 3] (any order)
```

**When to use:** Bottom K values, lowest prices, minimum thresholds.

---

### Form 3: K Most Frequent Elements

Find elements that appear most frequently.

```python
def k_frequent(nums, k):
    """Find K most frequent elements."""
    from collections import Counter
    
    freq = Counter(nums)
    min_heap = []
    
    for num, count in freq.items():
        heapq.heappush(min_heap, (count, num))
        if len(min_heap) > k:
            heapq.heappop(min_heap)
    
    return [num for count, num in min_heap]

# Example:
# nums = [1, 1, 1, 2, 2, 3], k = 2
# Result: [1, 2] (1 appears 3 times, 2 appears 2 times)
```

**When to use:** Popular items, trending topics, word frequency.

---

### Form 4: K Closest Elements (by distance/value)

Find K elements closest to a target value or point.

```python
def k_closest_to_target(nums, k, target):
    """Find K elements closest to target value."""
    max_heap = []  # By distance (furthest at root)
    
    for num in nums:
        dist = abs(num - target)
        heapq.heappush(max_heap, (-dist, num))  # Negate for max-heap
        if len(max_heap) > k:
            heapq.heappop(max_heap)
    
    return [num for dist, num in max_heap]


def k_closest_points(points, k, origin=(0, 0)):
    """Find K closest points to origin."""
    ox, oy = origin
    min_heap = []
    
    for x, y in points:
        dist_sq = (x - ox)**2 + (y - oy)**2  # Squared distance
        heapq.heappush(min_heap, (-dist_sq, [x, y]))
        if len(min_heap) > k:
            heapq.heappop(min_heap)
    
    return [point for dist, point in min_heap]

# Example:
# points = [[1,3],[-2,2]], k = 1, origin = [0,0]
# distances: sqrt(10) ≈ 3.16, sqrt(8) ≈ 2.83
# Result: [[-2, 2]] (closest)
```

**When to use:** Nearest neighbors, location-based search, similarity matching.

---

### Form 5: K Largest/Smallest by Custom Criteria

Use custom comparator or tuple for complex objects.

```python
def k_by_custom_criteria(objects, k, key_func):
    """Generic template for custom comparison."""
    min_heap = []
    
    for obj in objects:
        # Use tuple: (priority, unique_id, obj)
        # unique_id ensures consistent ordering on ties
        priority = key_func(obj)
        heapq.heappush(min_heap, (priority, id(obj), obj))
        
        if len(min_heap) > k:
            heapq.heappop(min_heap)
    
    return [obj for _, _, obj in min_heap]

# Example: Top K employees by salary
def k_highest_paid(employees, k):
    return k_by_custom_criteria(
        employees, 
        k, 
        key_func=lambda e: e.salary
    )

# Example: K youngest students
def k_youngest(students, k):
    # Negate age for min-heap (youngest = smallest age)
    return k_by_custom_criteria(
        students,
        k,
        key_func=lambda s: -s.age
    )
```

---

### Form Comparison

| Form | Heap Type | Key Value | Example Use Case |
|------|-----------|-----------|------------------|
| K largest | Min-heap | Element value | Leaderboard |
| K smallest | Max-heap | Element value | Lowest prices |
| K frequent | Min-heap | Frequency count | Trending topics |
| K closest | Max-heap | Distance | Nearest stores |
| K by custom | Min/Max | Custom metric | Top performers |

---

### Form Selection Flowchart

```
Top K Problem
      │
      ▼
┌───────────────────┐
│ What is the     │
│ ranking criteria?│
└─────────┬─────────┘
          │
    ┌─────┼─────┬────────┐
    ▼     ▼     ▼        ▼
  Value  Freq  Distance  Custom
    │     │       │        │
    ▼     ▼       ▼        ▼
 K largest K freq K closest K by key
    │       │       │        │
    └───────┴───────┴────────┘
              │
              ▼
    ┌───────────────────────┐
    │  Use heap with size K │
    │  Push: element        │
    │  Pop: if size > K     │
    └───────────────────────┘
```

<!-- back -->
