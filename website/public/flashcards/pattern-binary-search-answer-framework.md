## Binary Search - On Answer: Framework

What is the complete code template for binary search on answer space?

<!-- front -->

---

### Framework 1: Binary Search on Answer Template

```
┌─────────────────────────────────────────────────────┐
│  BINARY SEARCH ON ANSWER - TEMPLATE                  │
├─────────────────────────────────────────────────────┤
│  1. Define check(x) function:                        │
│     - Returns True if x is a valid answer          │
│     - Returns False if x is not valid               │
│                                                      │
│  2. Determine search range:                          │
│     - left = minimum possible answer               │
│     - right = maximum possible answer               │
│                                                      │
│  3. Binary search:                                   │
│     While left < right:                             │
│        mid = left + (right - left) // 2            │
│        If check(mid) == True:                       │
│           - mid is valid, try smaller              │
│           - right = mid                             │
│        Else:                                        │
│           - mid is not valid, need larger           │
│           - left = mid + 1                          │
│                                                      │
│  4. Return left (minimum valid answer)             │
└─────────────────────────────────────────────────────┘
```

---

### Implementation

```python
def ship_within_days(weights, days):
    """Find minimum ship capacity to deliver within days."""
    
    def can_ship(capacity):
        """Check if can ship all packages within days using given capacity."""
        current_load = 0
        required_days = 1
        
        for weight in weights:
            if current_load + weight <= capacity:
                current_load += weight
            else:
                required_days += 1
                current_load = weight
                if required_days > days:
                    return False
        
        return True
    
    # Search range
    left = max(weights)  # At least the heaviest package
    right = sum(weights)  # Ship everything in one day
    
    while left < right:
        mid = left + (right - left) // 2
        
        if can_ship(mid):
            right = mid  # Can ship, try smaller capacity
        else:
            left = mid + 1  # Can't ship, need larger capacity
    
    return left
```

---

### Framework 2: Koko Eating Bananas

```python
def min_eating_speed(piles, h):
    """Find minimum eating speed to finish all bananas in h hours."""
    
    def can_eat(speed):
        """Check if can eat all bananas at given speed."""
        hours = 0
        for pile in piles:
            hours += (pile + speed - 1) // speed  # Ceiling division
            if hours > h:
                return False
        return hours <= h
    
    left, right = 1, max(piles)
    
    while left < right:
        mid = left + (right - left) // 2
        
        if can_eat(mid):
            right = mid
        else:
            left = mid + 1
    
    return left
```

---

### Key Pattern Elements

| Element | Purpose | Example |
|---------|---------|---------|
| check(x) | Validate candidate | O(n) verification |
| left | Minimum possible answer | Lower bound |
| right | Maximum possible answer | Upper bound |
| Direction | Smaller or larger | Based on check result |

<!-- back -->
