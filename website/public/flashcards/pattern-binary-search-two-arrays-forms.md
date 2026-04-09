## Binary Search - Two Sorted Arrays: Forms

What are the different variations of k-th element search in two sorted arrays?

<!-- front -->

---

### Form 1: K-th Element

```python
def find_kth(A, B, k):
    if len(A) > len(B):
        A, B = B, A
    
    m, n = len(A), len(B)
    left, right = 0, m
    
    while left <= right:
        i = (left + right) // 2
        j = k - i
        
        A_left = A[i - 1] if i > 0 else float('-inf')
        A_right = A[i] if i < m else float('inf')
        B_left = B[j - 1] if j > 0 else float('-inf')
        B_right = B[j] if j < n else float('inf')
        
        if A_left <= B_right and B_left <= A_right:
            return max(A_left, B_left)
        elif A_left > B_right:
            right = i - 1
        else:
            left = i + 1
```

---

### Form 2: Median (Odd Total)

```python
def find_median_odd(A, B):
    total = len(A) + len(B)
    return find_kth(A, B, total // 2 + 1)
```

---

### Form 3: Median (Even Total)

```python
def find_median_even(A, B):
    total = len(A) + len(B)
    left = find_kth(A, B, total // 2)
    right = find_kth(A, B, total // 2 + 1)
    return (left + right) / 2
```

---

### Form 4: Recursive Alternative

```python
def find_kth_recursive(A, B, k):
    """Recursive elimination approach."""
    # Ensure A is shorter
    if len(A) > len(B):
        return find_kth_recursive(B, A, k)
    
    if not A:
        return B[k - 1]
    if k == 1:
        return min(A[0], B[0])
    
    # Compare k//2-th elements
    i = min(k // 2, len(A))
    j = min(k // 2, len(B))
    
    if A[i - 1] < B[j - 1]:
        # Eliminate first i elements of A
        return find_kth_recursive(A[i:], B, k - i)
    else:
        # Eliminate first j elements of B
        return find_kth_recursive(A, B[j:], k - j)
```

---

### Form Comparison

| Form | Approach | Complexity | Notes |
|------|----------|------------|-------|
| K-th (Iterative) | Binary search partition | O(log(min(m,n))) | Preferred |
| K-th (Recursive) | Eliminate k/2 elements | O(log k) | Cleaner but O(log k) = O(log(m+n)) |
| Median Odd | K-th with k = (m+n)//2 + 1 | Same as K-th | Single call |
| Median Even | Two K-th calls | 2 × K-th time | Two middle elements |

<!-- back -->
