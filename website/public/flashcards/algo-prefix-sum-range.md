## Prefix Sum (Range Queries)

**Question:** How do you efficiently answer multiple range sum queries on an array?

<!-- front -->

---

## Answer: Precompute Prefix Sum Array

### Concept
Precompute cumulative sums to answer queries in O(1).

### Implementation
```python
class PrefixSum:
    def __init__(self, nums):
        # Build prefix sum array
        # pref[i] = sum of nums[0..i-1]
        self.pref = [0] * (len(nums) + 1)
        for i, num in enumerate(nums):
            self.pref[i + 1] = self.pref[i] + num
    
    def rangeSum(self, left, right):
        # Sum of nums[left..right] inclusive
        return self.pref[right + 1] - self.pref[left]
```

### Visual Example
```
nums:     [2, 4, 1, 3, 5]
pref:  [0, 2, 6, 7, 10, 15]
               ↑  ↑  ↑
               left=1, right=3
               sum = pref[4] - pref[1] = 10 - 2 = 8
```

### Complexity
- **Preprocessing:** O(n)
- **Query:** O(1)
- **Space:** O(n)

### Variations
- 2D Prefix Sum for matrix range queries
- Handling negative numbers (works the same!)

### ⚠️ Common Mistakes
- Using 0-based vs 1-based indexing incorrectly
- Off-by-one errors in prefix array

<!-- back -->
