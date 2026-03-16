## Sort Colors (Dutch National Flag)

**Question:** Sort array of 0s, 1s, 2s in-place in one pass?

<!-- front -->

---

## Answer: Three-Pointer Partition

### Solution
```python
def sortColors(nums):
    low = 0      # 0s region
    mid = 0     # Current element
    high = len(nums) - 1  # 2s region
    
    while mid <= high:
        if nums[mid] == 0:
            nums[low], nums[mid] = nums[mid], nums[low]
            low += 1
            mid += 1
        elif nums[mid] == 1:
            mid += 1
        else:  # nums[mid] == 2
            nums[mid], nums[high] = nums[high], nums[mid]
            high -= 1
            # Don't increment mid - need to check swapped element
```

### Visual: Three Regions
```
[0, 1, 2, 0, 1, 2, 0]

Initial: low=0, mid=0, high=6
         [0, 1, 2, 0, 1, 2, 0]
         ↑low   ↑mid         ↑high

mid=0 (0): swap low,mid → [0,1,2,0,1,2,0], low=1, mid=1
mid=1 (1): mid++ → mid=2
mid=2 (2): swap mid,high → [0,1,0,0,1,2,2], high=5
mid=2 (0): swap low,mid → [0,0,1,0,1,2,2], low=2, mid=3
... continue

Result: [0,0,0,1,1,2,2]
```

### ⚠️ Tricky Parts

#### 1. Why Not Increment Mid After Swapping 2?
```python
# When swapping 2 to mid:
# - new nums[mid] came from high (unknown value)
# - Must check it in next iteration

# When swapping 0 to mid:
# - new nums[mid] came from low (was already processed)
# - Can increment mid
```

#### 2. Three Regions
```python
# [0, low): all 0s
# [low, mid): all 1s
# [mid, high]: unknown
# (high, end]: all 2s
```

### Time & Space Complexity

| Method | Time | Space |
|--------|------|-------|
| Dutch flag | O(n) | O(1) |

### Common Mistakes

| Mistake | Fix |
|---------|-----|
| Increment mid after 2 | Don't increment after swap |
| Wrong pointer bounds | mid <= high condition |
| Only two pointers | Need three pointers |

<!-- back -->
