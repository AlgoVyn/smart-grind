## Permutations: Framework

What are the complete implementations for permutation generation?

<!-- front -->

---

### Backtracking (All Permutations)

```python
def generate_permutations(nums):
    """
    Generate all permutations using backtracking.
    Time: O(n × n!), Space: O(n) recursion
    """
    result = []
    
    def backtrack(current, remaining):
        if not remaining:
            result.append(current[:])
            return
        
        for i in range(len(remaining)):
            # Choose
            current.append(remaining[i])
            
            # Explore (remaining without element i)
            backtrack(current, remaining[:i] + remaining[i+1:])
            
            # Unchoose
            current.pop()
    
    backtrack([], nums)
    return result
```

---

### Next Permutation (In-Place)

```python
def next_permutation(nums):
    """
    Transform to next lexicographic permutation.
    Rearranges in-place, returns None (modifies input).
    """
    n = len(nums)
    
    # Step 1: Find rightmost ascent
    i = n - 2
    while i >= 0 and nums[i] >= nums[i + 1]:
        i -= 1
    
    if i >= 0:
        # Step 2: Find smallest element > nums[i] to the right
        j = n - 1
        while nums[j] <= nums[i]:
            j -= 1
        
        # Step 3: Swap
        nums[i], nums[j] = nums[j], nums[i]
    
    # Step 4: Reverse suffix
    left, right = i + 1, n - 1
    while left < right:
        nums[left], nums[right] = nums[right], nums[left]
        left += 1
        right -= 1
```

---

### Previous Permutation

```python
def prev_permutation(nums):
    """Transform to previous lexicographic permutation"""
    n = len(nums)
    
    # Find rightmost descent
    i = n - 2
    while i >= 0 and nums[i] <= nums[i + 1]:
        i -= 1
    
    if i >= 0:
        # Find largest element < nums[i] to the right
        j = n - 1
        while nums[j] >= nums[i]:
            j -= 1
        
        nums[i], nums[j] = nums[j], nums[i]
    
    # Reverse suffix
    left, right = i + 1, n - 1
    while left < right:
        nums[left], nums[right] = nums[right], nums[left]
        left += 1
        right -= 1
```

---

### Permutation Rank (Lehmer Code)

```python
def permutation_rank(perm):
    """
    Calculate lexicographic rank of permutation (0-indexed).
    """
    n = len(perm)
    rank = 0
    
    # Binary Indexed Tree or Fenwick tree for efficiency
    # Simplified: O(n^2) version
    
    for i in range(n):
        # Count smaller unused elements to the right
        count = 0
        for j in range(i + 1, n):
            if perm[j] < perm[i]:
                count += 1
        
        # Add contribution: count * (n-i-1)!
        rank += count * factorial(n - i - 1)
    
    return rank

def factorial(n):
    result = 1
    for i in range(2, n + 1):
        result *= i
    return result
```

---

### K-th Permutation (Factorial Number System)

```python
def get_permutation(n, k):
    """
    Get k-th permutation (1-indexed) of [1, 2, ..., n].
    Time: O(n^2) or O(n log n) with BIT.
    """
    # Convert to 0-indexed
    k -= 1
    
    # Available numbers
    available = list(range(1, n + 1))
    result = []
    
    # Factorial precomputation
    fact = [1] * (n + 1)
    for i in range(2, n + 1):
        fact[i] = fact[i-1] * i
    
    for i in range(n, 0, -1):
        # Determine which number to use
        idx = k // fact[i - 1]
        k %= fact[i - 1]
        
        result.append(available.pop(idx))
    
    return result

# Usage: get_permutation(4, 9) → [2, 3, 1, 4]
```

<!-- back -->
