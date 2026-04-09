## Binary Search - Rotated Array: Core Concepts

What are the fundamental principles of binary search on rotated sorted arrays?

<!-- front -->

---

### Core Concept

Use **modified binary search that determines which half is sorted** to find elements in a rotated sorted array.

**Key insight**: In a rotated sorted array, at least one half is always sorted. Determine which half and search accordingly.

---

### The Pattern

```
Array: [4, 5, 6, 7, 0, 1, 2] (rotated at pivot)

Step 1: left=0 (4), right=6 (2), mid=3 (7)
        arr[left]=4 <= arr[mid]=7 → Left half is sorted!
        
        Target 0:
        0 < 4 → Not in left sorted half
        0 must be in right half
        left = mid + 1 = 4

Step 2: left=4 (0), right=6 (2), mid=5 (1)
        arr[left]=0 <= arr[mid]=1 → Left half sorted
        
        Target 0:
        0 >= 0 and 0 <= 1 → In left half!
        right = mid - 1? Actually, 0 is at left
        
        Found: arr[left] == 0 ✓
```

---

### Identifying Sorted Half

| Condition | Sorted Half | Action |
|-----------|-------------|--------|
| `arr[left] <= arr[mid]` | Left half | Check if target in [left, mid] |
| `arr[mid] <= arr[right]` | Right half | Check if target in [mid, right] |

**Note**: `<=` handles duplicates

---

### Common Applications

| Problem Type | Description | Example |
|--------------|-------------|---------|
| Search in Rotated | Find target | Search in Rotated Sorted Array |
| Find Minimum | Find minimum element | Find Minimum in Rotated |
| Find Pivot | Find rotation point | Find Pivot Index |
| Search with Duplicates | Handle duplicates | Search with Duplicates |
| Rotation Count | Count rotations | Find Rotation Count |

---

### Complexity

| Aspect | Complexity | Notes |
|--------|-----------|-------|
| Time | O(log n) | Without duplicates |
| Time (with dups) | O(n) worst case | All same elements |
| Space | O(1) | Iterative |

<!-- back -->
