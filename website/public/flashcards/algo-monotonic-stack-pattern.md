## Monotonic Stack - When to Use

**Question:** What problems is monotonic stack best suited for?

<!-- front -->

---

## Monotonic Stack Use Cases

### Common Problems
1. **Next Greater/Smaller Element** - Find next element greater/smaller than current
2. **Largest Rectangle in Histogram** - Stack-based solution
3. **Daily Temperatures** - Days until warmer temperature

### Stack Types
| Type | Use When |
|------|----------|
| **Increasing Stack** | Finding next smaller element |
| **Decreasing Stack** | Finding next greater element |

### Template: Next Greater Element
```python
def next_greater_elements(nums):
    n = len(nums)
    result = [-1] * n
    stack = []  # indices
    
    # Process 2n elements for circular array
    for i in range(2 * n):
        curr = nums[i % n]
        
        while stack and nums[stack[-1]] < curr:
            idx = stack.pop()
            result[idx] = curr
        
        if i < n:
            stack.append(i)
    
    return result
```

### 💡 Key Insight
Monotonic stack maintains elements in **sorted order**, so we can find next greater/smaller in O(n).

### Time Complexity
**O(n)** - each element pushed and popped at most once.

<!-- back -->
