## Plus One

**Question:** Add one to array representing large integer?

<!-- front -->

---

## Answer: Handle Carry from Right

### Solution
```python
def plusOne(digits):
    n = len(digits)
    
    # Process from right to left
    for i in range(n - 1, -1, -1):
        if digits[i] < 9:
            digits[i] += 1
            return digits
        
        # digit[i] == 9, set to 0 and carry
        digits[i] = 0
    
    # All digits were 9, need new array
    return [1] + digits
```

### Visual: Plus One
```
[1, 2, 3] + 1
i=2: 3<9 → 3+1=4
Return [1,2,4]

[1, 2, 9] + 1
i=2: 9=9 → 0, carry
i=1: 2<9 → 2+1=3
Return [1,3,0]

[9, 9, 9] + 1
i=2: 9=9 → 0
i=1: 9=9 → 0
i=0: 9=9 → 0
All 9s → return [1,0,0,0]
```

### ⚠️ Tricky Parts

#### 1. Why Check < 9?
```python
# If digit < 9, just increment and return
# If digit == 9, becomes 0 with carry

# We can only have carry propagate
# until we find digit < 9
```

#### 2. New Array Case
```python
# If all digits are 9
# e.g., [9, 9, 9] → [1, 0, 0, 0]
# Need to create new array

# Can also do: return [1] + [0] * len(digits)
```

### Time & Space Complexity

| Method | Time | Space |
|--------|------|-------|
| Single pass | O(n) | O(1) worst O(n) |

### Common Mistakes

| Mistake | Fix |
|---------|-----|
| Not handling carry | Process from right |
| Creating new array early | Only when all 9s |
| Wrong return type | Return list of ints |

<!-- back -->
