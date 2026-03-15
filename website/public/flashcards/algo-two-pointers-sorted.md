## Two Pointers on Sorted Array

**Question:** In a sorted array two-sum problem, which pointer do you move when `sum > target`?

<!-- front -->

---

## Answer: Move the RIGHT pointer leftward

### Why?
Since the array is sorted in ascending order:
- **Decreasing** the right pointer **reduces** the sum
- **Increasing** the left pointer **increases** the sum

### Logic Flow
```python
if sum == target:
    found solution
elif sum < target:
    left += 1  # need larger sum
else:
    right -= 1  # need smaller sum
```

### ⚠️ Common Mistake
Moving the wrong pointer leads to **O(n²)** time instead of **O(n)**.

### ✅ Key Pattern
| Pointer | Effect on Sum | When to Move |
|---------|---------------|--------------|
| Left ↑  | Increases     | sum < target |
| Right ↓ | Decreases     | sum > target |

<!-- back -->
