## Title: Rotate Array - Core Concepts

What is the Rotate Array technique and when should it be used?

<!-- front -->

---

### Definition
Rotate array to the right by k positions in-place without using extra space. Uses the elegant reversal algorithm to achieve O(n) time and O(1) space complexity.

| Aspect | Details |
|--------|---------|
| **Time** | O(n) - three reversals |
| **Space** | O(1) - in-place |
| **Direction** | Right (or Left with modification) |

### Key Operations

| Step | Operation | Effect |
|------|-----------|--------|
| 1 | Reverse all | `[1,2,3,4,5]` → `[5,4,3,2,1]` |
| 2 | Reverse first k | `[5,4,3,2,1]` → `[3,4,5,2,1]` |
| 3 | Reverse remaining | `[3,4,5,2,1]` → `[3,4,5,1,2]` |

### Modular Arithmetic
```python
def normalize_k(n, k):
    return k % n  # Handle k >= n
```

| k Value | n | Effective k |
|---------|---|-------------|
| 3 | 7 | 3 |
| 10 | 7 | 3 (10 % 7) |
| 7 | 7 | 0 (full cycle) |

---

### Three Reversal Algorithm
```python
def rotate(nums, k):
    n = len(nums)
    k = k % n
    
    def reverse(start, end):
        while start < end:
            nums[start], nums[end] = nums[end], nums[start]
            start += 1
            end -= 1
    
    reverse(0, n - 1)      # Reverse all
    reverse(0, k - 1)      # Reverse first k
    reverse(k, n - 1)      # Reverse rest
```

### Mathematical Proof
For array `A` of n elements, rotating right by k:
1. After reverse all: `A[n-1], A[n-2], ..., A[0]`
2. After reverse first k: `A[k], A[k+1], ..., A[n-1], A[0], ..., A[k-1]`
3. After reverse rest: correct rotation achieved

---

### Variations & Edge Cases

| Variation | Implementation |
|-----------|----------------|
| **Left Rotation** | Reverse first k, reverse rest, reverse all |
| **String Rotation** | Convert to list, apply same algorithm |
| **Linked List** | Connect tail to head, find new tail position |

**Edge Cases:**
- k = 0: No rotation needed
- k >= n: Normalize with `k % n`
- Single element: Nothing to rotate
- Empty array: Return immediately

<!-- back -->
