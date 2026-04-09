## Binary Search - Find First/Last Occurrence: Tactics

What are the key tactical moves for solving first/last occurrence problems efficiently?

<!-- front -->

---

### Tactic 1: Use `>=` for First, `<=` for Last

```python
# First occurrence: use >= (left-biased)
if nums[mid] >= target:
    if nums[mid] == target:
        first = mid      # Save potential answer
    high = mid - 1       # Continue left

# Last occurrence: use <= (right-biased)  
if nums[mid] <= target:
    if nums[mid] == target:
        last = mid       # Save potential answer
    low = mid + 1        # Continue right
```

**Why**: The comparison operator biases the search direction even when equal.

---

### Tactic 2: Early Termination Optimization

```python
def search_range(nums, target):
    if not nums:
        return [-1, -1]
    
    first = find_first()
    if first == -1:           # Key optimization!
        return [-1, -1]       # Skip second search entirely
    
    last = find_last()
    return [first, last]
```

**Benefit**: If target doesn't exist, only one O(log n) search instead of two.

---

### Tactic 3: Count Occurrences Trick

```python
def count_occurrences(nums, target):
    """Count total occurrences in O(log n)."""
    first = find_first(nums, target)
    if first == -1:
        return 0
    last = find_last(nums, target)
    return last - first + 1   # Tactic: simple math!

# Example: [5,7,7,8,8,10], target=8
# first=3, last=4, count=4-3+1=2
```

---

### Tactic 4: Built-in Library Shortcuts

```python
# Python - bisect module
import bisect
left = bisect.bisect_left(nums, target)    # First position
right = bisect.bisect_right(nums, target) # Position after last

# C++ - STL
auto lower = lower_bound(nums.begin(), nums.end(), target);
auto upper = upper_bound(nums.begin(), nums.end(), target);

# Java - Arrays (less direct)
int idx = Arrays.binarySearch(nums, target);
```

---

### Tactic 5: Unified Lower Bound Logic

```python
def lower_bound(nums, target):
    """First position >= target (works for first occurrence too)."""
    low, high = 0, len(nums)
    while low < high:
        mid = low + (high - low) // 2
        if nums[mid] < target:
            low = mid + 1
        else:
            high = mid
    return low  # Returns len(nums) if not found

def upper_bound(nums, target):
    """First position > target."""
    low, high = 0, len(nums)
    while low < high:
        mid = low + (high - low) // 2
        if nums[mid] <= target:
            low = mid + 1
        else:
            high = mid
    return low
```

<!-- back -->
