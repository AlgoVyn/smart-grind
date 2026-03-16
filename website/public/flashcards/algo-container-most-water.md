## Container With Most Water

**Question:** Find container that holds most water between two lines?

<!-- front -->

---

## Answer: Two Pointer Greedy

### Solution
```python
def maxArea(height):
    left = 0
    right = len(height) - 1
    max_water = 0
    
    while left < right:
        # Calculate area
        width = right - left
        h = min(height[left], height[right])
        max_water = max(max_water, width * h)
        
        # Move shorter line inward
        if height[left] < height[right]:
            left += 1
        else:
            right -= 1
    
    return max_water
```

### Visual: Two Pointer Movement
```
Height: [1, 8, 6, 2, 5, 4, 8, 3, 7]

Start: left=0, right=8
       width=8, h=1 → area=8
       height[left]=1 < height[right]=7 → left++

left=1, right=8
       width=7, h=7 → area=49 ← max!
       height[left]=8 > height[right]=7 → right--

... continue

Result: 49 (between 8 and 7)
```

### ⚠️ Tricky Parts

#### 1. Why Move Shorter Line?
```python
# Area = width × min(height[left], height[right])
# Width always decreases when we move
# Only chance to increase area: increase min height

# Moving shorter line:
# - If it was limiting factor, might find taller line
# - If we move taller, min stays same, width decreases
```

#### 2. Greedy Works Because
```python
# All possibilities with shorter line are explored
# Moving taller line can never increase area
# When lines meet, we've checked all candidates
```

### Time & Space Complexity

| Method | Time | Space |
|--------|------|-------|
| Two Pointer | O(n) | O(1) |

### Common Mistakes

| Mistake | Fix |
|---------|-----|
| Not moving correctly | Move shorter line |
| Using max(height) | Use min(height[left], height[right]) |
| Not tracking max | Update max_area each iteration |

<!-- back -->
