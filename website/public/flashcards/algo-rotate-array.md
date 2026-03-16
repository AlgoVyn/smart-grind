## Rotate Array: In-Place Rotation

**Question:** How do you rotate an array efficiently without extra space?

<!-- front -->

---

## Answer: Three Reversals

### Solution
```python
def rotate(nums, k):
    k = k % len(nums)  # Handle k > len
    
    # Reverse entire array
    nums.reverse()
    
    # Reverse first k elements
    nums[:k] = reversed(nums[:k])
    
    # Reverse remaining elements
    nums[k:] = reversed(nums[k:])
```

### Visual: Three Reversals
```
nums = [1,2,3,4,5,6,7], k = 3

Original: [1,2,3,4,5,6,7]

Step 1: Reverse all:
        [7,6,5,4,3,2,1]

Step 2: Reverse first 3:
        [5,6,7,4,3,2,1]

Step 3: Reverse last 4:
        [5,6,7,1,2,3,4]

Final: [5,6,7,1,2,3,4] ✓
```

### ⚠️ Tricky Parts

#### 1. k > Array Length
```python
# Must use k % len(nums)!
k = k % len(nums)

# Example: rotate [1,2,3], k=4
# Same as rotate [1,2,3], k=1
```

#### 2. In-Place Requirement
```python
# Can't use O(n) extra space
# Must use reversal!

# Alternative: cyclic replacements (more complex)
```

#### 3. Edge Cases
```python
# k = 0 → no rotation
if k == 0:
    return

# Empty array or single element
if len(nums) <= 1:
    return
```

### Cyclic Replacement (Alternative)
```python
def rotate(nums, k):
    n = len(nums)
    k = k % n
    
    if k == 0:
        return
    
    start = 0
    count = 0
    
    while count < n:
        current = start
        prev = nums[start]
        
        while True:
            next_idx = (current + k) % n
            nums[next_idx], prev = prev, nums[next_idx]
            current = next_idx
            count += 1
            
            if current == start:
                break
        
        start += 1
```

### Time & Space Complexity

| Method | Time | Space |
|--------|------|-------|
| Three Reversals | O(n) | O(1) |
| Cyclic | O(n) | O(1) |
| Extra Array | O(n) | O(n) |

### Common Mistakes

| Mistake | Fix |
|---------|-----|
| Not doing k % len | Always mod by length |
| Forgetting to reverse | Use three reversals |
| Wrong reversal order | Remember the pattern |

<!-- back -->
