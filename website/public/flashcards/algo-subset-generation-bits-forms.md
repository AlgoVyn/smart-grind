## Title: Subset Generation (Bits) - Forms

What are the different manifestations of bit-based subset generation?

<!-- front -->

---

### Form 1: Complete Power Set

Generate all 2^n subsets including empty set:

```
Input: [1, 2, 3]
Output: [[], [1], [2], [1,2], [3], [1,3], [2,3], [1,2,3]]

Mask: 0 (000) → []
Mask: 1 (001) → [1]
Mask: 2 (010) → [2]
Mask: 3 (011) → [1,2]
Mask: 4 (100) → [3]
Mask: 5 (101) → [1,3]
Mask: 6 (110) → [2,3]
Mask: 7 (111) → [1,2,3]
```

---

### Form 2: Non-Empty Subsets Only

Skip mask = 0 to exclude empty set:

```python
for mask in range(1, 1 << n):  # Start from 1, not 0
    # Generate subset
```

---

### Form 3: Subsets of Size k (Combinations)

Filter by bit count:

```
Input: [1, 2, 3, 4], k = 2
Output: [[1,2], [1,3], [1,4], [2,3], [2,4], [3,4]]

Mask: 3  (0011) → bit_count = 2 → [1,2]
Mask: 5  (0101) → bit_count = 2 → [1,3]
Mask: 6  (0110) → bit_count = 2 → [2,3]
Mask: 9  (1001) → bit_count = 2 → [1,4]
Mask: 10 (1010) → bit_count = 2 → [2,4]
Mask: 12 (1100) → bit_count = 2 → [3,4]
```

```python
def subsets_of_size_k(nums, k):
    n = len(nums)
    result = []
    
    for mask in range(1 << n):
        if mask.bit_count() == k:  # Python 3.8+
            subset = [nums[i] for i in range(n) if mask & (1 << i)]
            result.append(subset)
    
    return result
```

---

### Form 4: Subsets with Target Sum

Filter during generation:

```
Input: [1, 2, 3], target = 3
Output: [[1,2], [3]]

Mask: 3 (011) → sum = 1+2 = 3 ✓
Mask: 4 (100) → sum = 3 = 3 ✓
```

```python
def subsets_with_sum(nums, target):
    n = len(nums)
    result = []
    
    for mask in range(1 << n):
        subset = []
        current_sum = 0
        for i in range(n):
            if mask & (1 << i):
                current_sum += nums[i]
                subset.append(nums[i])
        
        if current_sum == target:
            result.append(subset)
    
    return result
```

---

### Form 5: Meet-in-the-Middle Optimization

For n up to 40, split array and combine:

```python
def subsets_meet_in_middle(nums):
    """Generate all subset sums using meet-in-the-middle."""
    n = len(nums)
    mid = n // 2
    
    # Generate all subset sums for left half
    left_sums = []
    for mask in range(1 << mid):
        s = sum(nums[i] for i in range(mid) if mask & (1 << i))
        left_sums.append(s)
    
    # Generate all subset sums for right half
    right_sums = []
    for mask in range(1 << (n - mid)):
        s = sum(nums[mid + i] for i in range(n - mid) if mask & (1 << i))
        right_sums.append(s)
    
    return left_sums, right_sums
```

<!-- back -->
