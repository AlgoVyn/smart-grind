## Sorting Algorithms: When to Use What

**Question:** How do you choose the right sorting algorithm?

<!-- front -->

---

## Answer: Know the Trade-offs

### Comparison Table

| Algorithm | Time (Avg) | Time (Worst) | Space | Stable | Use Case |
|-----------|------------|--------------|-------|---------|----------|
| Quick Sort | O(n log n) | O(n²) | O(log n) | No | General purpose |
| Merge Sort | O(n log n) | O(n log n) | O(n) | ✓ | External sort |
| Heap Sort | O(n log n) | O(n log n) | O(1) | No | Memory constrained |
| Insertion Sort | O(n²) | O(n²) | O(1) | ✓ | Nearly sorted |
| Bubble Sort | O(n²) | O(n²) | O(1) | ✓ | Educational |
| Counting Sort | O(n + k) | O(n + k) | O(k) | ✓ | Integer range |
| Radix Sort | O(nk) | O(nk) | O(n + k) | ✓ | Many digits |
| Bucket Sort | O(n + k) | O(n²) | O(n + k) | ✓ | Uniform distribution |

### Quick Sort
```python
def quicksort(arr):
    if len(arr) <= 1:
        return arr
    
    pivot = arr[len(arr) // 2]
    left = [x for x in arr if x < pivot]
    middle = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]
    
    return quicksort(left) + middle + quicksort(right)
```

### Merge Sort
```python
def merge_sort(arr):
    if len(arr) <= 1:
        return arr
    
    mid = len(arr) // 2
    left = merge_sort(arr[:mid])
    right = merge_sort(arr[mid:])
    
    return merge(left, right)

def merge(left, right):
    result = []
    i = j = 0
    
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            result.append(left[i])
            i += 1
        else:
            result.append(right[j])
            j += 1
    
    result.extend(left[i:])
    result.extend(right[j:])
    return result
```

### ⚠️ Tricky Parts

#### 1. Quick Sort Worst Case
```python
# WRONG - pivot selection can cause O(n²)
# If array is already sorted and pick first/last as pivot
pivot = arr[0]  # Bad!

# CORRECT - use middle or random pivot
pivot = arr[len(arr) // 2]  # Good!
# Or: pivot = random.choice(arr)
```

#### 2. Stability Matters
```python
# Stable sort preserves order of equal elements
# Example: Sort by name, then by age
# With unstable sort: may lose name order

# Stable: Merge Sort, Insertion Sort, Bubble Sort
# Unstable: Quick Sort, Heap Sort

# Python's sort is stable!
# So: sorted(people, key=lambda x: x.age)
# Then: sorted(..., key=lambda x: x.name)
# Both sorts preserved!
```

#### 3. In-Place vs Extra Space
```python
# Quick Sort can be in-place:
def quicksort_inplace(arr, low, high):
    if low < high:
        pi = partition(arr, low, high)
        quicksort_inplace(arr, low, pi - 1)
        quicksort_inplace(arr, pi + 1, high)

# Merge Sort always needs O(n) extra space
```

#### 4. When to Use Each

| Situation | Algorithm | Reason |
|----------|-----------|--------|
| General purpose | Quick Sort | Fast average case |
| Need stability | Merge Sort | Preserves order |
| Memory limited | Heap Sort | O(1) extra space |
| Nearly sorted | Insertion Sort | O(n) for nearly sorted |
| Integers in range | Counting Sort | O(n + k) |
| Strings, fixed length | Radix Sort | Character by character |
| Floating point | Quick Sort | Good cache locality |

### When Insertion Sort is Best
```python
# Almost sorted array
# [4, 1, 2, 3, 5, 6, 7]
# Insertion sort: O(n)!

# Also good for small arrays (< 10 elements)
# Quick Sort overhead not worth it
```

### Python's Sorted
```python
# Uses Tim Sort (hybrid of merge + insertion)
# Time: O(n log n) worst case too!
# Space: O(n)
# Stable: YES!

# Custom sort
sorted(arr, reverse=True)
sorted(arr, key=lambda x: x.name)
sorted(arr, key=lambda x: (-x.grade, x.name))  # Multi-level
```

### ⚠️ Common Mistakes

| Mistake | Problem | Fix |
|---------|---------|-----|
| Using wrong pivot | O(n²) | Use middle/random pivot |
| Forgetting stability | Order lost | Use stable sort |
| Extra space | Memory waste | Use in-place when needed |
| Not handling edge cases | Errors | Check empty/single element |
| Not using built-in | Slower | Use sorted() in Python |

### Visual: Partition Step
```
Quick Sort Partition:

[5, 3, 8, 4, 2, 7, 1, 6]
          ↑
        pivot

After partition:

[3, 4, 2, 1] [5] [8, 7, 6]
  < pivot      =    > pivot

Recursively sort left and right
```

### When NOT to Use Comparison Sort
- Integer keys with limited range → Counting Sort
- Strings of similar length → Radix Sort
- Almost sorted → Insertion Sort

<!-- back -->
