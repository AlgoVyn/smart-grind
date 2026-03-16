## Monotonic Stack Pattern

**Question:** When and how to use monotonic stacks?

<!-- front -->

---

## Answer: Decreasing/Increasing Stack

### When to Use
```python
# Problems involving:
# - Next greater/smaller element
# - Largest rectangle in histogram
# - Stock span
# - Daily temperatures
```

### Template (Next Greater)
```python
def nextGreaterElements(nums):
    n = len(nums)
    result = [-1] * n
    stack = []  # stores indices
    
    # Process twice for circular
    for i in range(2 * n):
        while stack and nums[i % n] > nums[stack[-1]]:
            result[stack.pop()] = nums[i % n]
        
        if i < n:
            stack.append(i)
    
    return result
```

### Visual: Monotonic Decreasing Stack
```
nums = [2, 1, 2, 4, 3]

Index: 0  1  2  3  4
Value: 2  1  2  4  3

Processing:
i=0: stack=[0] 
i=1: 1<2 → stack=[0,1]
i=2: 2>1 → result[1]=2, pop → 2>2? no → stack=[0,2]
i=3: 4>2 → result[2]=4, pop → 4>2? no → 4>2? no → stack=[0,3]
i=4: 3<4 → stack=[0,3,4]

Result: [2, 2, 4, -1, -1]
```

### ⚠️ Tricky Parts

#### 1. Decreasing vs Increasing
```python
# Decreasing (top is smallest):
# - Next Greater Element
# Stack: [2,1] means 2<1 is wrong order

# Increasing (top is largest):
# - Next Smaller Element
# Stack: [1,2] means 1>2 is wrong order
```

#### 2. Circular Arrays
```python
# Process array twice: range(2*n)
# Use i % n to get actual value
# Only push first pass indices: if i < n
```

### Common Problems

| Problem | Stack Type | Variation |
|---------|------------|-----------|
| Next Greater | Decreasing | - |
| Next Smaller | Increasing | - |
| Daily Temperatures | Increasing | Return index diff |
| Largest Rectangle | Increasing | Use heights + sentinel |

### Common Mistakes

| Mistake | Fix |
|---------|-----|
| Wrong stack order | Decide decreasing vs increasing |
| Not handling empty | Check while stack |
| Forgetting circular | Process twice if needed |

<!-- back -->
