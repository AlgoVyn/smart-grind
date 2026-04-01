## Title: Sliding Window - Forms

What are the different manifestations of the sliding window pattern?

<!-- front -->

---

### Form 1: Fixed-Size Calculation Window

Window size is constant; calculate a metric for each window.

| Problem Type | State | Update Rule |
|--------------|-------|-------------|
| Sum/Average | Running sum | `sum += new - old` |
| Max/Min (brute) | Re-scan | O(k) per window |
| Max/Min (optimal) | Monotonic deque | Amortized O(1) |
| Count condition | Frequency map | Increment/decrement counts |

```python
def max_sum_subarray(arr, k):
    """Maximum sum of any subarray of size k."""
    n = len(arr)
    window_sum = sum(arr[:k])
    max_sum = window_sum
    
    for i in range(k, n):
        window_sum += arr[i] - arr[i - k]
        max_sum = max(max_sum, window_sum)
    
    return max_sum
```

---

### Form 2: Variable-Size Optimization Window

Window expands/contracts to find optimal subarray/substring.

| Problem Type | Expand When | Shrink When |
|--------------|-------------|-------------|
| Minimum size, sum >= target | Always | `sum >= target` |
| Longest k distinct | Always | `distinct > k` |
| Longest no repeat | Always | `char in window` |
| Minimum window substring | `have < need` | `have == need` |

```python
def longest_substring_k_distinct(s, k):
    """Longest substring with at most k distinct characters."""
    char_count = {}
    left = 0
    max_len = 0
    
    for right, char in enumerate(s):
        char_count[char] = char_count.get(char, 0) + 1
        
        while len(char_count) > k:
            char_count[s[left]] -= 1
            if char_count[s[left]] == 0:
                del char_count[s[left]]
            left += 1
        
        max_len = max(max_len, right - left + 1)
    
    return max_len
```

---

### Form 3: Multi-Window/Two-Window

Maintain two windows or compare windows.

```
Window A: Fixed size (pattern length)
Window B: Sliding through text
Compare: Are frequency maps equal?
```

**Example:** Find all anagrams, string permutation.

---

### Form 4: Circular/Wrapping Window

Window wraps around array end to beginning.

```
Array: [1, 2, 3, 4, 5] with window size 3
Windows: [1,2,3], [2,3,4], [3,4,5], [4,5,1], [5,1,2]
```

**Technique:** Duplicate array or use modulo arithmetic.

---

### Form 5: Counting Window

Count valid subarrays rather than finding optimal.

```
For each right, count valid left positions:
count += right - left + 1
```

**Example:** Count subarrays with at most k distinct.

```python
def count_subarrays_at_most_k(arr, k):
    """Count subarrays with at most k distinct elements."""
    freq = {}
    left = 0
    count = 0
    
    for right in range(len(arr)):
        freq[arr[right]] = freq.get(arr[right], 0) + 1
        
        while len(freq) > k:
            freq[arr[left]] -= 1
            if freq[arr[left]] == 0:
                del freq[arr[left]]
            left += 1
        
        # All subarrays ending at right with start in [left, right] are valid
        count += right - left + 1
    
    return count
```

<!-- back -->
