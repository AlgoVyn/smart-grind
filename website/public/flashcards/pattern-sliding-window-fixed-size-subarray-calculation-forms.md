## Sliding Window - Fixed Size: Forms

What are the different forms and variations of fixed-size sliding window problems?

<!-- front -->

---

### Problem Variations

| Variation | Calculation | Data Structure | Example |
|-----------|-------------|----------------|---------|
| **Maximum Sum** | Running sum, track max | Single variable | LC 643, 209 |
| **All Averages** | Running sum, store all / k | Array for results | Generate all k-averages |
| **Count Condition** | Running count of matches | Counter variable | Vowels in window, distinct chars |
| **Sliding Window Maximum** | Track max element | Monotonic deque | LC 239 |
| **Minimum Window Value** | Running sum, track min | Single variable | Min sum subarray |
| **Product (log transform)** | Log sum, track max | Math operations | Max product subarray |

---

### Form 1: Maximum Sum Subarray (Size k)

```python
def max_sum_subarray_size_k(arr, k):
    """
    LeetCode 643: Maximum Average Subarray I (variant)
    Classic fixed-size sliding window.
    """
    if not arr or k <= 0 or k > len(arr):
        return 0
    
    window_sum = sum(arr[:k])
    max_sum = window_sum
    
    for i in range(k, len(arr)):
        window_sum += arr[i] - arr[i - k]
        max_sum = max(max_sum, window_sum)
    
    return max_sum

# Example: [1, 4, 2, 10, 23, 3, 1, 0, 20], k = 4
# Windows: [1,4,2,10]=17, [4,2,10,23]=39, [2,10,23,3]=38, ...
# Answer: 39 (subarray [4, 2, 10, 23])
```

---

### Form 2: Averages of All Subarrays (Size k)

```python
def find_averages(arr, k):
    """
    Calculate average of every subarray of size k.
    Return list of all averages.
    """
    if not arr or k <= 0 or k > len(arr):
        return []
    
    result = []
    window_sum = sum(arr[:k])
    result.append(window_sum / k)
    
    for i in range(k, len(arr)):
        window_sum += arr[i] - arr[i - k]
        result.append(window_sum / k)
    
    return result

# Example: [1, 3, 2, 6, -1, 4, 1, 8, 2], k = 5
# Averages: [2.2, 2.8, 2.4, 3.6, 2.8]
# First: (1+3+2+6-1)/5 = 11/5 = 2.2
# Second: (3+2+6-1+4)/5 = 14/5 = 2.8
```

---

### Form 3: Maximum Vowels in Substring (Size k)

```python
def max_vowels(s, k):
    """
    LeetCode 1456: Maximum Number of Vowels in Substring
    Count-based sliding window.
    """
    vowels = set('aeiou')
    
    # Count vowels in first window
    window_count = sum(1 for c in s[:k] if c in vowels)
    max_count = window_count
    
    for i in range(k, len(s)):
        # Remove outgoing
        if s[i - k] in vowels:
            window_count -= 1
        # Add incoming
        if s[i] in vowels:
            window_count += 1
        
        max_count = max(max_count, window_count)
    
    return max_count

# Example: s = "abciiidef", k = 3
# Windows: "abc"=1, "bci"=1, "cii"=2, "iii"=3, "iid"=2, "ide"=2, "def"=1
# Answer: 3
```

---

### Form 4: Sliding Window Maximum

```python
from collections import deque

def sliding_window_max(nums, k):
    """
    LeetCode 239: Sliding Window Maximum
    Find max in each window using monotonic deque.
    """
    if not nums or k <= 0:
        return []
    
    dq = deque()  # Decreasing order of values
    result = []
    
    for i in range(len(nums)):
        # Remove out-of-window elements
        while dq and dq[0] < i - k + 1:
            dq.popleft()
        
        # Remove smaller elements from back
        while dq and nums[dq[-1]] < nums[i]:
            dq.pop()
        
        dq.append(i)
        
        # Start adding results after first k-1 elements
        if i >= k - 1:
            result.append(nums[dq[0]])
    
    return result

# Example: [1, 3, -1, -3, 5, 3, 6, 7], k = 3
# Max of: [1,3,-1]=3, [3,-1,-3]=3, [-1,-3,5]=5, [-3,5,3]=5, [5,3,6]=6, [3,6,7]=7
# Answer: [3, 3, 5, 5, 6, 7]
```

---

### Form 5: Grumpy Bookstore Owner

```python
def max_satisfied(customers, grumpy, k):
    """
    LeetCode 1052: Grumpy Bookstore Owner
    Window with conditional calculation.
    """
    n = len(customers)
    
    # Base satisfaction (when not grumpy)
    base_satisfied = sum(c for c, g in zip(customers, grumpy) if g == 0)
    
    # Additional satisfied using window on grumpy periods
    window_extra = sum(customers[i] for i in range(k) if grumpy[i] == 1)
    max_extra = window_extra
    
    for i in range(k, n):
        # Remove outgoing if it was grumpy
        if grumpy[i - k] == 1:
            window_extra -= customers[i - k]
        # Add incoming if it's grumpy
        if grumpy[i] == 1:
            window_extra += customers[i]
        
        max_extra = max(max_extra, window_extra)
    
    return base_satisfied + max_extra

# Combines fixed base calculation with sliding window on conditional subset
```

---

### Form 6: Contains Duplicate II (Distance k)

```python
def contains_nearby_duplicate(nums, k):
    """
    LeetCode 219: Contains Duplicate II
    Window with hash set for O(1) lookup.
    """
    window = set()
    
    for i in range(len(nums)):
        # Remove element leaving window
        if i > k:
            window.remove(nums[i - k - 1])
        
        # Check if current exists in window
        if nums[i] in window:
            return True
        
        window.add(nums[i])
    
    return False

# Example: [1, 2, 3, 1], k = 3
# Window at i=3: {2, 3, 1} (size 3)
# nums[3]=1 is in window → True
```

---

### Decision Flowchart

```
Read problem statement
│
├─ "maximum sum" or "maximum average" with fixed size k
│   └─→ Use: Basic sliding window sum (Form 1, 2)
│
├─ "maximum in each window" or "sliding window max"
│   └─→ Use: Monotonic deque (Form 4)
│
├─ "count of X in substring" with fixed length
│   └─→ Use: Running counter (Form 3)
│
├─ "contains duplicate within distance k"
│   └─→ Use: Hash set window (Form 6)
│
└─ Window with conditions or exemptions
    └─→ Use: Conditional window update (Form 5)
```

---

### Quick Reference Table

| LeetCode | Problem | Key Pattern | Form |
|----------|---------|-------------|------|
| 643 | Max Average Subarray I | Running sum / k | Form 2 |
| 239 | Sliding Window Maximum | Monotonic deque | Form 4 |
| 1456 | Max Vowels in Substring | Count in window | Form 3 |
| 1052 | Grumpy Bookstore Owner | Conditional window | Form 5 |
| 219 | Contains Duplicate II | Hash set window | Form 6 |
| 1876 | Substrings of Size 3 | Simple check | Form 3 variant |

<!-- back -->
