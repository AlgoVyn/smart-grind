## Subsets - Bit Mask Generation

**Question:** How do you generate all subsets using bit manipulation?

<!-- front -->

---

## Subsets: Bit Mask Approach

### The Idea
For n elements, there are 2^n subsets.
Use numbers 0 to 2^n-1 as bit masks.

### Implementation
```python
def subsets(nums):
    n = len(nums)
    result = []
    
    for mask in range(1 << n):  # 0 to 2^n - 1
        subset = []
        for i in range(n):
            if mask & (1 << i):
                subset.append(nums[i])
        result.append(subset)
    
    return result
```

### Visual
```
nums = [1, 2, 3]
n = 3 → 2^3 = 8 subsets

mask = 0 (000): []
mask = 1 (001): [1]
mask = 2 (010): [2]
mask = 3 (011): [1,2]
mask = 4 (100): [3]
mask = 5 (101): [1,3]
mask = 6 (110): [2,3]
mask = 7 (111): [1,2,3]
```

### Complexity
- **Time:** O(n × 2^n)
- **Space:** O(2^n) for result

### 💡 When to Use
- Need all subsets
- n is small (≤ 20)
- Need subset representation as bitmask

### Alternative: Lexicographic Order
```python
def subsets_lex(nums):
    nums.sort()
    result = [[]]
    
    for num in nums:
        result += [subset + [num] for subset in result]
    
    return result
```

<!-- back -->
