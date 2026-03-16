## Inclusion-Exclusion Principle

**Question:** Count elements in union of sets?

<!-- front -->

---

## Answer: Add Individual, Subtract Pairs, Add Triples

### Formula
```
|A ∪ B| = |A| + |B| - |A ∩ B|

|A ∪ B ∪ C| = |A| + |B| + |C| 
              - |A∩B| - |A∩C| - |B∩C| 
              + |A∩B∩C|
```

### Example: Count numbers divisible by 2, 3, or 5
```python
def count_divisible(n, divisors):
    # Count numbers ≤ n divisible by each divisor
    # Then apply inclusion-exclusion
    
    k = len(divisors)
    total = 0
    
    # Iterate through all subsets
    for mask in range(1, 1 << k):
        lcm = 1
        bits = 0
        
        for i in range(k):
            if mask & (1 << i):
                bits += 1
                lcm = lcm * divisors[i] // math.gcd(lcm, divisors[i])
        
        count = n // lcm
        
        if bits % 2 == 1:
            total += count   # Add odd-sized subsets
        else:
            total -= count   # Subtract even-sized subsets
    
    return total
```

### Visual: Three Sets
```
    A       B
   /\      /\
  /  \    /  \
 /    \  /    \
C-----C------C

|A∪B∪C| = |A|+|B|+|C| - |AB|-|AC|-|BC| + |ABC|
```

### ⚠️ Tricky Parts

#### 1. When to Add vs Subtract
```python
# Odd number of sets in subset → Add
# Even number of sets in subset → Subtract

# 1 set: +
# 2 sets: -
# 3 sets: +
```

#### 2. Computing LCM
```python
# For subset, need LCM, not just product
# lcm(a,b) = a*b / gcd(a,b)

# Use math.gcd or implement manually
```

### Time Complexity

| Method | Time | Space |
|--------|------|-------|
| Inclusion-Exclusion | O(2^k × k) | O(1) |

k = number of sets/divisors

### Common Mistakes

| Mistake | Fix |
|---------|-----|
| Not using LCM | Use LCM for subsets |
| Wrong sign | Add odd, subtract even |
| Missing empty subset | Start from 1, not 0 |

<!-- back -->
