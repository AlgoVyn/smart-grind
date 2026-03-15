## Rotate Array - Reversal Algorithm

**Question:** How does the 3-step reversal algorithm work for rotating an array?

<!-- front -->

---

## Rotate Array: Reversal Method

### The Trick: 3 Reversals
```
Original: [1,2,3,4,5,6,7], k = 3

Step 1: Reverse entire array
        [7,6,5,4,3,2,1]
        
Step 2: Reverse first k elements
        [5,6,7,4,3,2,1]
        
Step 3: Reverse remaining elements
        [5,6,7,1,2,3,4]
```

### Implementation
```python
def rotate(nums, k):
    n = len(nums)
    k = k % n  # Handle k > n
    
    def reverse(l, r):
        while l < r:
            nums[l], nums[r] = nums[r], nums[l]
            l += 1
            r -= 1
    
    reverse(0, n - 1)    # Reverse all
    reverse(0, k - 1)    # Reverse first k
    reverse(k, n - 1)    # Reverse remaining
```

### Why This Works
- After full reversal, last k elements are at front (reversed)
- Reversing them again puts them in correct order

### 💡 Key Point
Always do `k = k % n` to handle cases where `k > n`.

### Complexity
- **Time:** O(n)
- **Space:** O(1)

<!-- back -->
