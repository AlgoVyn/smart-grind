## Dutch National Flag (Sort Colors)

**Question:** You have 3 pointers: `low`, `mid`, `high`. What do you do when `arr[mid] == 1`?

<!-- front -->

---

## Answer: Increment `mid` only

### Three-Way Partition Logic
```python
if arr[mid] == 0:
    swap(arr[low], arr[mid])
    low += 1
    mid += 1
elif arr[mid] == 1:
    mid += 1  # already in correct place
else:  # arr[mid] == 2
    swap(arr[mid], arr[high])
    high -= 1
    # Don't increment mid!
```

### 💡 Key Insight
When swapping with `high`, **don't increment `mid`** because the swapped element from the end needs to be checked.

### Algorithm Invariant
- `[0, low)` → all 0s
- `[low, mid)` → all 1s  
- `[mid, high]` → unknown
- `(high, end]` → all 2s

<!-- back -->
