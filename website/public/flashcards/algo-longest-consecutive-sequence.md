## Longest Consecutive Sequence

**Question:** Find length of longest consecutive sequence in unsorted array?

<!-- front -->

---

## Answer: HashSet + Sequence Building

### Solution
```python
def longestConsecutive(nums):
    if not nums:
        return 0
    
    num_set = set(nums)
    max_length = 0
    
    for num in num_set:
        # Only start at beginning of sequence
        if num - 1 not in num_set:
            current = num
            length = 1
            
            while current + 1 in num_set:
                current += 1
                length += 1
            
            max_length = max(max_length, length)
    
    return max_length
```

### Visual: Sequence Detection
```
Input: [100, 4, 200, 1, 3, 2]

Using set: {1,2,3,4,100,200}

Starting points (num-1 not in set):
- 1: 1→2→3→4 → length 4
- 100: 100 → length 1  
- 200: 200 → length 1

Result: 4
```

### ⚠️ Tricky Parts

#### 1. Why Check num-1?
```python
# Only start counting from sequence beginning
# Avoids O(n²) by not reprocessing middle elements

# Without check:
# [1,2,3,4] would start at 1,2,3,4 → O(n²)

# With check:
# Only start at 1 → O(n)
```

#### 2. Why Use Set?
```python
# O(1) lookups
# Remove need for sorting O(n log n)
```

### Time & Space Complexity

| Method | Time | Space |
|--------|------|-------|
| HashSet | O(n) | O(n) |
| Sort first | O(n log n) | O(1) |

### Common Mistakes

| Mistake | Fix |
|---------|-----|
| Not checking sequence start | Check num - 1 not in set |
| Using list instead of set | Use set for O(1) lookup |
| Sorting unnecessarily | Use HashSet approach |

<!-- back -->
