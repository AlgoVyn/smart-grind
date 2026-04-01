## Permutations: Forms & Variations

What are the different forms and variations of permutation problems?

<!-- front -->

---

### Form 1: Permutations with Duplicates

```python
def permute_unique(nums):
    """
    Generate unique permutations when input has duplicates.
    """
    result = []
    nums.sort()  # Group duplicates together
    
    def backtrack(path, used):
        if len(path) == len(nums):
            result.append(path[:])
            return
        
        for i in range(len(nums)):
            if used[i]:
                continue
            # Skip duplicates: only use first unused duplicate
            if i > 0 and nums[i] == nums[i-1] and not used[i-1]:
                continue
            
            used[i] = True
            path.append(nums[i])
            backtrack(path, used)
            path.pop()
            used[i] = False
    
    backtrack([], [False] * len(nums))
    return result
```

---

### Form 2: Next Greater Number (Same Digits)

```python
def next_greater_number(n):
    """
    Find next greater number using same digits.
    Returns -1 if not possible.
    """
    digits = list(str(n))
    
    # Find rightmost ascent
    i = len(digits) - 2
    while i >= 0 and digits[i] >= digits[i + 1]:
        i -= 1
    
    if i < 0:
        return -1
    
    # Find smallest larger digit to the right
    j = len(digits) - 1
    while digits[j] <= digits[i]:
        j -= 1
    
    # Swap and reverse suffix
    digits[i], digits[j] = digits[j], digits[i]
    digits[i+1:] = reversed(digits[i+1:])
    
    result = int(''.join(digits))
    return result if result <= 2**31 - 1 else -1
```

---

### Form 3: Circular Permutations

```python
def circular_permutations(n):
    """
    Count circular arrangements of n distinct objects.
    Fixed rotations are considered the same.
    """
    # (n-1)! circular permutations
    from math import factorial
    return factorial(n - 1)

def necklace_count(n, k):
    """
    Count distinct necklaces with n beads, k colors.
    Uses Burnside's lemma (group theory).
    """
    # Simplified for prime n
    from math import gcd
    total = 0
    for i in range(n):
        total += k ** gcd(i, n)
    return total // n
```

---

### Form 4: Permutation Cycles

```python
def find_cycles(perm):
    """
    Decompose permutation into disjoint cycles.
    Returns list of cycles.
    """
    n = len(perm)
    visited = [False] * n
    cycles = []
    
    for i in range(n):
        if visited[i]:
            continue
        
        # Trace cycle starting from i
        cycle = []
        cur = i
        while not visited[cur]:
            visited[cur] = True
            cycle.append(cur)
            cur = perm[cur]
        
        cycles.append(cycle)
    
    return cycles

def compose_permutations(p1, p2):
    """
    Compose two permutations: (p1 ∘ p2)(i) = p1[p2[i]]
    """
    return [p1[p2[i]] for i in range(len(p1))]
```

---

### Form 5: Permutation Swaps

```python
def min_swaps_to_sort(perm):
    """
    Minimum swaps needed to sort permutation.
    Equals n - number_of_cycles.
    """
    n = len(perm)
    visited = [False] * n
    swaps = 0
    
    for i in range(n):
        if visited[i]:
            continue
        
        # Count cycle size
        cycle_size = 0
        cur = i
        while not visited[cur]:
            visited[cur] = True
            cur = perm[cur]
            cycle_size += 1
        
        # k-cycle needs k-1 swaps
        swaps += cycle_size - 1
    
    return swaps
```

<!-- back -->
