## Dutch National Flag: Tactics & Tricks

What are the essential tactics for applying the Dutch National Flag algorithm?

<!-- front -->

---

### Tactic 1: Pointer Invariants

```python
def sort_colors_invariants(nums):
    """
    Maintain these invariants:
    [0..low-1] = 0
    [low..mid-1] = 1  
    [mid..high] = unknown
    [high+1..n-1] = 2
    """
    low = mid = 0
    high = len(nums) - 1
    
    while mid <= high:
        if nums[mid] == 0:
            # Extends 0-region and 1-region
            nums[low], nums[mid] = nums[mid], nums[low]
            low += 1
            mid += 1
        elif nums[mid] == 1:
            # Extends 1-region
            mid += 1
        else:
            # Extends 2-region from right
            nums[mid], nums[high] = nums[high], nums[mid]
            high -= 1
            # Don't increment mid! New element at mid is unknown
```

---

### Tactic 2: Two-Way vs Three-Way

```python
def choose_partition_strategy(nums, pivot):
    """
    Decision framework
    """
    unique_values = len(set(nums))
    
    if unique_values == 2:
        # Two-way is simpler
        return two_way_partition(nums, pivot)
    elif unique_values == 3:
        # Dutch national flag
        return three_way_partition(nums, pivot)
    else:
        # Many unique values
        return standard_quicksort(nums)
```

---

### Tactic 3: Handle Duplicates in Quicksort

```python
def quicksort_with_dnf(nums, lo, hi):
    """
    Use DNF partition when many duplicates expected
    """
    if lo >= hi:
        return
    
    # Random pivot selection for safety
    import random
    pivot_idx = random.randint(lo, hi)
    nums[lo], nums[pivot_idx] = nums[pivot_idx], nums[lo]
    
    # 3-way partition
    lt, gt = lo, hi
    i = lo + 1
    
    while i <= gt:
        if nums[i] < nums[lt]:
            nums[i], nums[lt] = nums[lt], nums[i]
            lt += 1
            i += 1
        elif nums[i] > nums[lt]:
            nums[i], nums[gt] = nums[gt], nums[i]
            gt -= 1
        else:
            i += 1
    
    # Recurse on unequal regions only
    quicksort_with_dnf(nums, lo, lt - 1)
    quicksort_with_dnf(nums, gt + 1, hi)
```

---

### Tactic 4: One-Pass vs Multi-Pass

```python
def one_pass_sort(nums):
    """
    When k is small constant, one-pass DNF is optimal
    """
    # O(n) time, O(1) space
    pass

def multi_pass_sort(nums, k):
    """
    When k is large, counting sort may be better
    """
    # O(n + k) time, O(k) space
    # Better when k << n
    pass
```

---

### Tactic 5: Visualize the Partition

```python
def visualize_partition():
    """
    Mental model:
    
    Initial: [?, ?, ?, ?, ?, ?, ?]
             ↑low/mid              ↑high
    
    After some steps:
    [0, 0, 1, 1, ?, ?, ?, 2, 2]
          ↑low  ↑mid    ↑high
          
    Final:  [0, 0, 1, 1, 1, 2, 2]
                  ↑low        ↑mid/high
    
    Key: mid stops when it meets high
    """
    pass
```

<!-- back -->
