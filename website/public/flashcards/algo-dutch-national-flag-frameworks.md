## Dutch National Flag: Algorithm Framework

What are the complete implementations for the Dutch National Flag algorithm?

<!-- front -->

---

### Standard Implementation (0, 1, 2)

```python
def sort_colors(nums: list) -> None:
    """
    Sort array of 0s, 1s, and 2s in-place
    """
    low, mid, high = 0, 0, len(nums) - 1
    
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
```

---

### Generic Three-Way Partition

```python
def three_way_partition(nums: list, pivot: int) -> tuple:
    """
    Partition array into < pivot, = pivot, > pivot
    Returns: (lt, gt) boundaries
    """
    lt, i, gt = 0, 0, len(nums) - 1
    
    while i <= gt:
        if nums[i] < pivot:
            nums[lt], nums[i] = nums[i], nums[lt]
            lt += 1
            i += 1
        elif nums[i] > pivot:
            nums[i], nums[gt] = nums[gt], nums[i]
            gt -= 1
        else:
            i += 1
    
    return lt, gt
```

---

### Quickselect with 3-Way Partition

```python
def quickselect(nums: list, k: int) -> int:
    """
    Find kth smallest using 3-way partition
    """
    def partition(lo, hi):
        pivot = nums[lo]
        lt, i, gt = lo, lo, hi
        
        while i <= gt:
            if nums[i] < pivot:
                nums[lt], nums[i] = nums[i], nums[lt]
                lt += 1
                i += 1
            elif nums[i] > pivot:
                nums[i], nums[gt] = nums[gt], nums[i]
                gt -= 1
            else:
                i += 1
        
        return lt, gt
    
    lo, hi = 0, len(nums) - 1
    
    while True:
        lt, gt = partition(lo, hi)
        
        if k < lt:
            hi = lt - 1
        elif k > gt:
            lo = gt + 1
        else:
            return nums[k]
```

---

### Quicksort with 3-Way Partition

```python
def quicksort_3way(nums: list, lo: int = 0, hi: int = None) -> None:
    """
    Quicksort optimized for duplicates
    """
    if hi is None:
        hi = len(nums) - 1
    
    if lo >= hi:
        return
    
    pivot = nums[lo]
    lt, gt = lo, hi
    i = lo
    
    while i <= gt:
        if nums[i] < pivot:
            nums[lt], nums[i] = nums[i], nums[lt]
            lt += 1
            i += 1
        elif nums[i] > pivot:
            nums[i], nums[gt] = nums[gt], nums[i]
            gt -= 1
        else:
            i += 1
    
    quicksort_3way(nums, lo, lt - 1)
    quicksort_3way(nums, gt + 1, hi)
```

---

### Two-Way Variation (K-Way)

```python
def sort_k_colors(nums: list, k: int) -> None:
    """
    Sort array with k distinct values (0 to k-1)
    Using counting sort approach
    """
    # Count occurrences
    count = [0] * k
    for num in nums:
        count[num] += 1
    
    # Fill array
    idx = 0
    for color in range(k):
        for _ in range(count[color]):
            nums[idx] = color
            idx += 1

# Note: This is counting sort, O(n + k) time, still O(1) extra if k is constant
```

<!-- back -->
