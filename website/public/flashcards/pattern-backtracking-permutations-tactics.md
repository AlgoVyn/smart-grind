## Backtracking - Permutations: Tactics

What are the advanced techniques for generating permutations?

<!-- front -->

---

### Tactic 1: Next Permutation (Iterative)

```python
def next_permutation(nums):
    """Transform to next lexicographic permutation in-place."""
    n = len(nums)
    
    # Find first decreasing element from right
    i = n - 2
    while i >= 0 and nums[i] >= nums[i + 1]:
        i -= 1
    
    if i >= 0:
        # Find smallest element greater than nums[i]
        j = n - 1
        while nums[j] <= nums[i]:
            j -= 1
        nums[i], nums[j] = nums[j], nums[i]
    
    # Reverse elements after i
    left, right = i + 1, n - 1
    while left < right:
        nums[left], nums[right] = nums[right], nums[left]
        left += 1
        right -= 1
```

---

### Tactic 2: K-th Permutation (Factorial Number System)

```python
def get_permutation(n, k):
    """Find k-th permutation of [1,2,...,n] (1-indexed)."""
    from math import factorial
    
    nums = list(range(1, n + 1))
    k -= 1  # Convert to 0-indexed
    result = []
    
    for i in range(n, 0, -1):
        fact = factorial(i - 1)
        index = k // fact
        k %= fact
        result.append(nums.pop(index))
    
    return result
```

---

### Tactic 3: Common Pitfalls

| Pitfall | Issue | Fix |
|---------|-------|----- |
| No copy | Reference issues | `result.append(nums[:])` |
| Wrong swap back | Wrong state | Swap back immediately after recurse |
| Duplicate handling | Repeated permutations | Sort + skip used[i-1] condition |
| Not sorting | Duplicates not adjacent | Always sort when handling dups |

---

### Tactic 4: Previous Permutation

```python
def prev_permutation(nums):
    """Transform to previous lexicographic permutation."""
    n = len(nums)
    
    # Find first increasing from right
    i = n - 2
    while i >= 0 and nums[i] <= nums[i + 1]:
        i -= 1
    
    if i >= 0:
        j = n - 1
        while nums[j] >= nums[i]:
            j -= 1
        nums[i], nums[j] = nums[j], nums[i]
    
    # Reverse after i
    nums[i+1:] = reversed(nums[i+1:])
```

---

### Tactic 5: Permutation Index

```python
def permutation_index(nums):
    """Find the index of current permutation in sorted order."""
    from math import factorial
    n = len(nums)
    result = 0
    
    for i in range(n):
        count = sum(1 for j in range(i + 1, n) if nums[j] < nums[i])
        result += count * factorial(n - 1 - i)
    
    return result
```

<!-- back -->
