## Trapping Rain Water

**Question:** How much water can be trapped between bars?

<!-- front -->

---

## Answer: Two Pointers

### Solution
```python
def trap(height):
    if not height:
        return 0
    
    left, right = 0, len(height) - 1
    left_max, right_max = 0, 0
    water = 0
    
    while left < right:
        if height[left] < height[right]:
            if height[left] >= left_max:
                left_max = height[left]
            else:
                water += left_max - height[left]
            left += 1
        else:
            if height[right] >= right_max:
                right_max = height[right]
            else:
                water += right_max - height[right]
            right -= 1
    
    return water
```

### Visual: Water Trapping
```
height = [0,1,0,2,1,0,1,3,2,1,2,1]

Visual representation:
         |
   |     | |
| | |   | |
| | | | | |
|_|_|_|_|_|__

Water = 6 units
```

### ⚠️ Tricky Parts

#### 1. Why Two Pointers Work
```python
# Water at position = min(max_left, max_right) - height

# The side with smaller height determines water:
# - If left < right: water limited by left_max
# - If right <= left: water limited by right_max

# Because we only need the smaller side!
```

#### 2. Stack Approach
```python
def trapStack(height):
    stack = []
    water = 0
    
    for i in range(len(height)):
        while stack and height[i] > height[stack[-1]]:
            top = stack.pop()
            if not stack:
                break
            distance = i - stack[-1] - 1
            bounded = min(height[i], height[stack[-1]]) - height[top]
            water += distance * bounded
        
        stack.append(i)
    
    return water
```

#### 3. DP Approach
```python
def trapDP(height):
    if not height:
        return 0
    
    n = len(height)
    left_max = [0] * n
    right_max = [0] * n
    
    # Fill left_max
    left_max[0] = height[0]
    for i in range(1, n):
        left_max[i] = max(left_max[i-1], height[i])
    
    # Fill right_max
    right_max[n-1] = height[n-1]
    for i in range(n-2, -1, -1):
        right_max[i] = max(right_max[i+1], height[i])
    
    # Calculate water
    water = 0
    for i in range(n):
        water += min(left_max[i], right_max[i]) - height[i]
    
    return water
```

### Time & Space Complexity

| Method | Time | Space |
|--------|------|-------|
| Two Pointers | O(n) | O(1) |
| DP | O(n) | O(n) |
| Stack | O(n) | O(n) |

### Common Mistakes

| Mistake | Fix |
|---------|-----|
| Wrong direction | Use two pointers from ends |
| Off-by-one | Check left < right, not <= |
| Wrong condition | height[left] < height[right] |

<!-- back -->
