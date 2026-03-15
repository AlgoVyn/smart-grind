## Trapping Rain Water

**Question:** How do you calculate how much water can be trapped between bars?

<!-- front -->

---

## Answer: Two Pointers or Stack

### Approach 1: Two Pointers
```python
def trap(height):
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

### Approach 2: Stack
```python
def trap_stack(height):
    stack = []
    water = 0
    
    for i in range(len(height)):
        while stack and height[i] > height[stack[-1]]:
            top = stack.pop()
            if not stack:
                break
            distance = i - stack[-1] - 1
            bounded_height = min(height[i], height[stack[-1]]) - height[top]
            water += distance * bounded_height
        stack.append(i)
    
    return water
```

### Visual
```
Height:   [0,1,0,2,1,0,1,3,2,1,2,1]
         ┌─────────────────────┐
Water:   │   ║   ║║║  ║  ║   │
         └─────────────────────┘
Water: 6 units
```

### Complexity
- **Time:** O(n)
- **Space:** O(1) for two pointers, O(n) for stack

### Key Insight
Water at each position = min(max_left, max_right) - height[i]

### ⚠️ Common Mistakes
- Using single pointer instead of two
- Not handling edge cases (empty array, single element)

<!-- back -->
