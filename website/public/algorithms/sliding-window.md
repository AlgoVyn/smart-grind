# Sliding Window

## Category
Arrays & Strings

## Description

The Sliding Window technique is used to perform operations on a specific window size of an array or string. It's particularly efficient for problems requiring **O(n)** time complexity instead of **O(n×k)** for nested loops. The technique maintains a "window" that slides through the data structure, adding new elements to one end and removing old elements from the other as it moves.

This pattern is fundamental in competitive programming and technical interviews for solving a wide range of array and string problems efficiently.

---

## Concepts

The Sliding Window technique is built on several fundamental concepts that make it powerful for solving array and string problems.

### 1. Window State

A window represents a contiguous subarray/substring defined by two boundaries (left and right pointers). The **state** of the window is the information needed to answer the problem question.

| State Type | Description | Example |
|------------|-------------|---------|
| **Sum** | Running total of elements | Sum of current window |
| **Frequency Map** | Count of elements | Character counts in substring |
| **Monotonic Deque** | Indices in sorted order | Max/min tracking |
| **Unique Count** | Number of distinct elements | Distinct characters |

### 2. Incremental Update

Instead of recalculating from scratch, update state incrementally:

```
New State = Old State - Outgoing Element + Incoming Element
```

This is the key to achieving O(n) time complexity.

### 3. Window Invariants

An invariant is a condition that must hold true for the window to be valid:

- **Fixed Size**: `right - left + 1 == k`
- **At Most K Distinct**: `distinct_count <= k`
- **Sum Constraint**: `window_sum >= target`
- **No Repeating**: All characters unique

### 4. Monotonicity

Many sliding window problems leverage monotonic properties:

- **Expanding** the window increases sum/count
- **Shrinking** the window decreases sum/count
- **Monotonic Deque** maintains elements in sorted order

---

## Frameworks

Structured approaches for solving sliding window problems.

### Framework 1: Fixed-Size Window Template

```
┌─────────────────────────────────────────────────────┐
│  FIXED-SIZE SLIDING WINDOW FRAMEWORK                │
├─────────────────────────────────────────────────────┤
│  1. Compute initial window (first k elements)      │
│  2. Process initial state                            │
│  3. Slide from index k to n-1:                     │
│     a. Remove leftmost element (i-k) from state    │
│     b. Add new element (i) to state                │
│     c. Update result                               │
│  4. Return final result                            │
└─────────────────────────────────────────────────────┘
```

**When to use**: Window size k is given; need max/min/sum of every window.

### Framework 2: Variable-Size Window Template

```
┌─────────────────────────────────────────────────────┐
│  VARIABLE-SIZE SLIDING WINDOW FRAMEWORK             │
├─────────────────────────────────────────────────────┤
│  1. Initialize left = 0, state = empty             │
│  2. Expand right from 0 to n-1:                    │
│     a. Add element at right to state               │
│     b. While state violates condition:             │
│        - Remove element at left from state         │
│        - Increment left                            │
│     c. Update optimal result                         │
│  3. Return optimal result                            │
└─────────────────────────────────────────────────────┘
```

**When to use**: Finding optimal (longest/shortest) subarray meeting a condition.

### Framework 3: Monotonic Deque Template

```
┌─────────────────────────────────────────────────────┐
│  MONOTONIC DEQUE FRAMEWORK (for Max/Min)            │
├─────────────────────────────────────────────────────┤
│  1. Initialize empty deque (stores indices)        │
│  2. For each element at index i:                   │
│     a. Remove indices < i-k (out of window)         │
│     b. While deque not empty AND                    │
│        element[deque.back] < element[i]:           │
│        - Pop from back                             │
│     c. Push i to back                              │
│     d. If i >= k-1: result = element[deque.front]  │
│  3. Return results array                             │
└─────────────────────────────────────────────────────┘
```

**When to use**: Need max/min in every window of size k efficiently.

---

## Forms

Different manifestations of the sliding window pattern.

### Form 1: Fixed-Size Calculation Window

Window size is constant; calculate a metric for each window.

| Problem Type | State | Update Rule |
|--------------|-------|-------------|
| Sum/Average | Running sum | `sum += new - old` |
| Max/Min (brute) | Re-scan | O(k) per window |
| Max/Min (optimal) | Monotonic deque | Amortized O(1) |
| Count condition | Frequency map | Increment/decrement counts |

### Form 2: Variable-Size Optimization Window

Window expands/contracts to find optimal subarray/substring.

| Problem Type | Expand When | Shrink When |
|--------------|-------------|-------------|
| Minimum size, sum >= target | Always | `sum >= target` |
| Longest k distinct | Always | `distinct > k` |
| Longest no repeat | Always | `char in window` |
| Minimum window substring | `have < need` | `have == need` |

### Form 3: Multi-Window/Two-Window

Maintain two windows or compare windows.

```
Window A: Fixed size (pattern length)
Window B: Sliding through text
Compare: Are frequency maps equal?
```

**Example**: Find all anagrams, string permutation.

### Form 4: Circular/Wrapping Window

Window wraps around array end to beginning.

```
Array: [1, 2, 3, 4, 5] with window size 3
Windows: [1,2,3], [2,3,4], [3,4,5], [4,5,1], [5,1,2]
```

**Technique**: Duplicate array or use modulo arithmetic.

### Form 5: Counting Window

Count valid subarrays rather than finding optimal.

```
For each right, count valid left positions:
count += right - left + 1
```

**Example**: Count subarrays with at most k distinct.

---

## Tactics

Specific techniques and optimizations.

### Tactic 1: Two-Hashmap Comparison

For anagram/pattern matching problems:

```python
def are_maps_equal(map1, map2):
    if len(map1) != len(map2):
        return False
    for key in map1:
        if map1[key] != map2.get(key, 0):
            return False
    return True
```

**Optimization**: Use "have/need" counters instead of full comparison.

### Tactic 2: Character Array vs Hashmap

For ASCII/256-character strings:

```python
# Faster than dict for small charsets
freq = [0] * 256  # or 128 for ASCII
freq[ord(c)] += 1
```

### Tactic 3: Early Exit Optimization

```python
# Stop early if impossible to find better result
if remaining_elements + current_length < best_length:
    break  # Can't improve
```

### Tactic 4: Window State Caching

Cache expensive computations:

```python
# Precompute properties
can_split = [can_split_at(i) for i in range(n)]

# Use in sliding window
for right in range(n):
    if can_split[right]:
        update_state()
```

### Tactic 5: Handling Negatives

For arrays with negative numbers, prefix sums with hashmap:

```python
prefix_map = {0: -1}  # sum -> earliest index
for i, num in enumerate(arr):
    prefix_sum += num
    if prefix_sum - target in prefix_map:
        min_len = min(min_len, i - prefix_map[prefix_sum - target])
    if prefix_sum not in prefix_map:
        prefix_map[prefix_sum] = i
```

### Tactic 6: Sliding Window with Other Patterns

| Combination | Use Case |
|-------------|----------|
| Sliding Window + Binary Search | Find threshold satisfying condition |
| Sliding Window + Deque | Max/min in window |
| Sliding Window + Heap | Median in window |
| Sliding Window + DP | Optimal substructure problems |


### Tactic 7: Filtered String Optimization

For minimum window substring problems, filter the source string to only include characters present in the pattern:

```python
# Filter s to only include characters present in t
dict_t = Counter(t)
filtered_s = [(i, char) for i, char in enumerate(s) if char in dict_t]

# Now apply sliding window on filtered_s instead of s
# This reduces the window size significantly in many cases
```

**When to use**: When the pattern contains few distinct characters compared to the source string.

### Tactic 8: Two-Window Comparison Technique

For problems comparing two windows (e.g., checking if one is a permutation of another):

```python
def check_permutation(s: str, pattern: str) -> bool:
    """Check if any substring of s is a permutation of pattern."""
    if len(pattern) > len(s):
        return False
    
    # Build frequency arrays for both
    pattern_count = [0] * 26
    window_count = [0] * 26
    
    # Initialize first window
    for i in range(len(pattern)):
        pattern_count[ord(pattern[i]) - ord('a')] += 1
        window_count[ord(s[i]) - ord('a')] += 1
    
    if pattern_count == window_count:
        return True
    
    # Slide and compare
    for i in range(len(pattern), len(s)):
        window_count[ord(s[i]) - ord('a')] += 1
        window_count[ord(s[i - len(pattern)]) - ord('a')] -= 1
        if window_count == pattern_count:
            return True
    
    return False
```

### Tactic 9: Match Count Instead of Full Comparison

Instead of comparing entire frequency arrays, track how many characters have satisfied their requirements:

```python
def min_window_optimized(s: str, t: str) -> str:
    """Optimized minimum window using match count."""
    if not s or not t:
        return ""
    
    # Build target frequency
    target_count = [0] * 128
    window_count = [0] * 128
    match_count = 0
    unique_chars = 0
    
    for char in t:
        if target_count[ord(char)] == 0:
            unique_chars += 1
        target_count[ord(char)] += 1
    
    left = 0
    min_len = float('inf')
    min_start = 0
    
    for right in range(len(s)):
        char = ord(s[right])
        window_count[char] += 1
        
        # Check if we satisfied a character requirement
        if window_count[char] == target_count[char]:
            match_count += 1
        
        # Shrink while valid
        while match_count == unique_chars:
            if right - left + 1 < min_len:
                min_len = right - left + 1
                min_start = left
            
            left_char = ord(s[left])
            window_count[left_char] -= 1
            if window_count[left_char] < target_count[left_char]:
                match_count -= 1
            left += 1
    
    return s[min_start:min_start + min_len] if min_len != float('inf') else ""
```

### Tactic 10: Prefix Sum with HashMap for Exact Sum

For finding subarrays with exact sum (works with negative numbers):

```python
from collections import defaultdict

def subarray_sum_equals_k(arr: list[int], k: int) -> int:
    """
    Count subarrays with sum exactly k.
    Works with both positive and negative numbers.
    """
    prefix_count = defaultdict(int)
    prefix_count[0] = 1  # Empty prefix
    
    prefix_sum = 0
    count = 0
    
    for num in arr:
        prefix_sum += num
        # Number of subarrays ending at current position with sum k
        count += prefix_count[prefix_sum - k]
        prefix_count[prefix_sum] += 1
    
    return count
```

### Tactic 11: Deque for Max/Min Tracking with Indices

Use a monotonic deque to efficiently track max/min in a sliding window:

```python
from collections import deque

def max_in_window(arr: list[int], k: int) -> list[int]:
    """Find maximum in each window of size k using monotonic deque."""
    if not arr or k <= 0:
        return []
    
    dq = deque()  # Stores indices, values in decreasing order
    result = []
    
    for i, num in enumerate(arr):
        # Remove indices outside the window from front
        while dq and dq[0] <= i - k:
            dq.popleft()
        
        # Remove elements smaller than current from back
        while dq and arr[dq[-1]] < num:
            dq.pop()
        
        dq.append(i)
        
        # Start adding to result once window is full
        if i >= k - 1:
            result.append(arr[dq[0]])
    
    return result
```

**Key insight**: The front of the deque always holds the maximum for the current window.
---

## Python Templates

### Template 1: Fixed-Size Window (Sum)

```python
def fixed_window_sum(arr: list[int], k: int) -> int:
    """
    Template for fixed-size window problems.
    Returns maximum sum of any subarray of size k.
    """
    if not arr or k <= 0 or k > len(arr):
        return 0
    
    # Initialize first window
    window_sum = sum(arr[:k])
    max_sum = window_sum
    
    # Slide the window
    for i in range(k, len(arr)):
        # Remove outgoing element, add incoming element
        window_sum += arr[i] - arr[i - k]
        max_sum = max(max_sum, window_sum)
    
    return max_sum
```

### Template 2: Fixed-Size Window (Max with Deque)

```python
from collections import deque

def fixed_window_max(arr: list[int], k: int) -> list[int]:
    """
    Template for finding max in each window using monotonic deque.
    Returns list of maximums for each window of size k.
    """
    if not arr or k == 0:
        return []
    
    dq = deque()  # Stores indices in decreasing order of values
    result = []
    
    for i, num in enumerate(arr):
        # Remove indices out of window
        while dq and dq[0] < i - k + 1:
            dq.popleft()
        
        # Remove smaller elements (they can't be max)
        while dq and arr[dq[-1]] < num:
            dq.pop()
        
        dq.append(i)
        
        # Start recording once window is full
        if i >= k - 1:
            result.append(arr[dq[0]])
    
    return result
```

### Template 3: Variable-Size Window (Longest)

```python
def longest_substring_k_distinct(s: str, k: int) -> int:
    """
    Template for variable-size window: longest with at most k distinct.
    """
    if not s or k == 0:
        return 0
    
    char_count = {}
    left = 0
    max_len = 0
    
    for right, char in enumerate(s):
        # Expand: add current character
        char_count[char] = char_count.get(char, 0) + 1
        
        # Shrink: while condition violated
        while len(char_count) > k:
            char_count[s[left]] -= 1
            if char_count[s[left]] == 0:
                del char_count[s[left]]
            left += 1
        
        # Update optimal result
        max_len = max(max_len, right - left + 1)
    
    return max_len
```

### Template 4: Variable-Size Window (Minimum)

```python
def min_subarray_sum(arr: list[int], target: int) -> int:
    """
    Template for variable-size window: minimum length with sum >= target.
    """
    if not arr:
        return 0
    
    left = 0
    current_sum = 0
    min_len = float('inf')
    
    for right in range(len(arr)):
        # Expand: add element
        current_sum += arr[right]
        
        # Shrink: while condition satisfied, find minimum
        while current_sum >= target:
            min_len = min(min_len, right - left + 1)
            current_sum -= arr[left]
            left += 1
    
    return min_len if min_len != float('inf') else 0
```

### Template 5: Window with Character Matching

```python
def find_anagrams(s: str, pattern: str) -> list[int]:
    """
    Template for pattern matching with sliding window.
    Returns starting indices of all anagrams of pattern in s.
    """
    if len(pattern) > len(s):
        return []
    
    # Build frequency maps
    pattern_count = {}
    window_count = {}
    
    for char in pattern:
        pattern_count[char] = pattern_count.get(char, 0) + 1
    
    for i in range(len(pattern)):
        char = s[i]
        window_count[char] = window_count.get(char, 0) + 1
    
    result = []
    if window_count == pattern_count:
        result.append(0)
    
    # Slide window
    for i in range(len(pattern), len(s)):
        # Add new character
        char_in = s[i]
        window_count[char_in] = window_count.get(char_in, 0) + 1
        
        # Remove old character
        char_out = s[i - len(pattern)]
        window_count[char_out] -= 1
        if window_count[char_out] == 0:
            del window_count[char_out]
        
        # Check match
        if window_count == pattern_count:
            result.append(i - len(pattern) + 1)
    
    return result
```

### Template 6: Optimized Window Matching

```python
def min_window_substring(s: str, t: str) -> str:
    """
    Template for minimum window substring.
    Uses 'have' and 'need' counters for efficiency.
    """
    if not s or not t or len(t) > len(s):
        return ""
    
    # Build target frequency map
    target_count = {}
    for char in t:
        target_count[char] = target_count.get(char, 0) + 1
    
    need = len(target_count)  # Number of unique chars needed
    have = 0
    window_count = {}
    
    result = ""
    result_len = float('inf')
    left = 0
    
    for right in range(len(s)):
        char = s[right]
        window_count[char] = window_count.get(char, 0) + 1
        
        # Check if we satisfied one more character requirement
        if char in target_count and window_count[char] == target_count[char]:
            have += 1
        
        # Shrink while we have a valid window
        while have == need:
            # Update result if smaller
            if right - left + 1 < result_len:
                result_len = right - left + 1
                result = s[left:right + 1]
            
            # Remove leftmost character
            left_char = s[left]
            window_count[left_char] -= 1
            if left_char in target_count and window_count[left_char] < target_count[left_char]:
                have -= 1
            left += 1
    
    return result
```

### Template 7: Counting Valid Subarrays

```python
def count_subarrays_at_most_k_distinct(arr: list[int], k: int) -> int:
    """
    Template for counting subarrays with at most k distinct elements.
    Key insight: count_at_most(k) - count_at_most(k-1) = count_exact(k)
    """
    def at_most_k(arr, k):
        if k < 0:
            return 0
        
        count = 0
        left = 0
        freq = {}
        
        for right in range(len(arr)):
            freq[arr[right]] = freq.get(arr[right], 0) + 1
            
            while len(freq) > k:
                freq[arr[left]] -= 1
                if freq[arr[left]] == 0:
                    del freq[arr[left]]
                left += 1
            
            # All subarrays ending at right, starting at [left..right] are valid
            count += right - left + 1
        
        return count
    
    return at_most_k(arr, k)
```

### Template 8: Longest Substring Without Repeating Characters

```python
def longest_substring_no_repeating(s: str) -> int:
    """
    Find the length of the longest substring without repeating characters.
    Uses hashmap to track last seen index of each character.
    Time: O(n), Space: O(min(m, n)) where m is charset size
    """
    if not s:
        return 0
    
    char_index = {}  # char -> last seen index
    left = 0
    max_len = 0
    
    for right, char in enumerate(s):
        # If char is repeated and within current window, move left
        if char in char_index and char_index[char] >= left:
            left = char_index[char] + 1
        
        char_index[char] = right
        max_len = max(max_len, right - left + 1)
    
    return max_len
```

### Template 9: Subarray Sum Equals K (Prefix Sum)

```python
from collections import defaultdict

def subarray_sum_equals_k(arr: list[int], k: int) -> int:
    """
    Count subarrays with sum exactly k.
    Works with both positive and negative numbers.
    Time: O(n), Space: O(n)
    """
    prefix_count = defaultdict(int)
    prefix_count[0] = 1  # Empty prefix sum
    
    prefix_sum = 0
    count = 0
    
    for num in arr:
        prefix_sum += num
        # If prefix_sum - k exists, those subarrays have sum k
        count += prefix_count[prefix_sum - k]
        prefix_count[prefix_sum] += 1
    
    return count


def subarray_sum_equals_k_positive(arr: list[int], k: int) -> int:
    """
    Count subarrays with sum exactly k for positive integers only.
    Uses sliding window approach.
    Time: O(n), Space: O(1)
    """
    count = 0
    current_sum = 0
    left = 0
    
    for right in range(len(arr)):
        current_sum += arr[right]
        
        while current_sum > k and left <= right:
            current_sum -= arr[left]
            left += 1
        
        if current_sum == k:
            count += 1
    
    return count
```

### Template 10: Minimum Window Substring (Optimized)

```python
def min_window_substring_optimized(s: str, t: str) -> str:
    """
    Find minimum window in s containing all characters of t.
    Uses filtered string optimization.
    Time: O(|s| + |t|), Space: O(|s| + |t|)
    """
    if not s or not t:
        return ""
    
    from collections import Counter
    
    # Build target frequency map
    dict_t = Counter(t)
    required = len(dict_t)
    
    # Filter s to only include characters present in t
    filtered_s = [(i, char) for i, char in enumerate(s) if char in dict_t]
    
    left = 0
    formed = 0
    window_counts = {}
    
    min_len = float('inf')
    min_left = 0
    min_right = 0
    
    for right in range(len(filtered_s)):
        char = filtered_s[right][1]
        window_counts[char] = window_counts.get(char, 0) + 1
        
        if window_counts[char] == dict_t[char]:
            formed += 1
        
        # Contract window while valid
        while left <= right and formed == required:
            char_left = filtered_s[left][1]
            
            # Update minimum
            end = filtered_s[right][0]
            start = filtered_s[left][0]
            if end - start + 1 < min_len:
                min_len = end - start + 1
                min_left = start
                min_right = end
            
            window_counts[char_left] -= 1
            if window_counts[char_left] < dict_t[char_left]:
                formed -= 1
            left += 1
    
    return s[min_left:min_right + 1] if min_len != float('inf') else ""
```

### Template 11: Sliding Window Median (with Two Heaps)

```python
import heapq

def sliding_window_median(nums: list[int], k: int) -> list[float]:
    """
    Find median in each sliding window of size k.
    Uses two heaps (max heap for lower half, min heap for upper half).
    Time: O(n log k), Space: O(k)
    """
    if not nums or k == 0:
        return []
    
    # Max heap for lower half (negated values for Python)
    lower = []  # max heap (negated)
    # Min heap for upper half
    upper = []  # min heap
    
    def balance_heaps():
        # Ensure lower has equal or one more element than upper
        if len(lower) > len(upper) + 1:
            val = -heapq.heappop(lower)
            heapq.heappush(upper, val)
        elif len(upper) > len(lower):
            val = heapq.heappop(upper)
            heapq.heappush(lower, -val)
    
    def get_median():
        if len(lower) > len(upper):
            return float(-lower[0])
        return (-lower[0] + upper[0]) / 2.0
    
    result = []
    window = {}  # Lazy deletion map
    
    for i in range(len(nums)):
        # Add new element
        if not lower or nums[i] <= -lower[0]:
            heapq.heappush(lower, -nums[i])
        else:
            heapq.heappush(upper, nums[i])
        
        balance_heaps()
        
        # Remove element leaving window
        if i >= k:
            out_num = nums[i - k]
            window[out_num] = window.get(out_num, 0) + 1
            
            # Check if out_num is at top of either heap
            if out_num <= -lower[0]:
                # Lazy delete from lower
                pass
            else:
                # Lazy delete from upper
                pass
            
            # Clean up tops if needed
            while lower and window.get(-lower[0], 0) > 0:
                window[-lower[0]] -= 1
                heapq.heappop(lower)
            while upper and window.get(upper[0], 0) > 0:
                window[upper[0]] -= 1
                heapq.heappop(upper)
        
        # Record median
        if i >= k - 1:
            result.append(get_median())
    
    return result
```

### Template 12: Count Subarrays with At Most K Distinct

```python
from collections import defaultdict

def count_subarrays_at_most_k_distinct(arr: list[int], k: int) -> int:
    """
    Count subarrays with at most k distinct integers.
    Key insight: For each right, all subarrays ending at right 
    with left in [window_left, right] are valid.
    Time: O(n), Space: O(k)
    """
    if k < 0:
        return 0
    
    freq = defaultdict(int)
    left = 0
    count = 0
    distinct = 0
    
    for right in range(len(arr)):
        if freq[arr[right]] == 0:
            distinct += 1
        freq[arr[right]] += 1
        
        while distinct > k:
            freq[arr[left]] -= 1
            if freq[arr[left]] == 0:
                distinct -= 1
            left += 1
        
        # All subarrays ending at right with start in [left, right] are valid
        count += right - left + 1
    
    return count


def count_subarrays_exactly_k_distinct(arr: list[int], k: int) -> int:
    """
    Count subarrays with exactly k distinct integers.
    Uses: at_most(k) - at_most(k-1)
    """
    return (count_subarrays_at_most_k_distinct(arr, k) - 
            count_subarrays_at_most_k_distinct(arr, k - 1))
```

### Template 13: Minimum Size Subarray with Sum at Least K (Handles Negatives)

```python
from collections import deque

def shortest_subarray_with_sum_at_least_k(arr: list[int], k: int) -> int:
    """
    Find shortest subarray with sum >= k.
    Handles negative numbers using prefix sums + monotonic deque.
    Time: O(n), Space: O(n)
    """
    n = len(arr)
    # Build prefix sum array
    prefix = [0] * (n + 1)
    for i in range(n):
        prefix[i + 1] = prefix[i] + arr[i]
    
    min_len = float('inf')
    dq = deque()  # Monotonic deque storing indices
    
    for i in range(n + 1):
        # Check if we can form valid subarray
        while dq and prefix[i] - prefix[dq[0]] >= k:
            min_len = min(min_len, i - dq.popleft())
        
        # Maintain monotonicity (increasing prefix sums)
        while dq and prefix[i] <= prefix[dq[-1]]:
            dq.pop()
        
        dq.append(i)
    
    return min_len if min_len != float('inf') else -1
```

### Template 14: Longest Substring with Exactly K Distinct

```python
def longest_substring_exactly_k_distinct(s: str, k: int) -> int:
    """
    Find longest substring with exactly k distinct characters.
    Uses: longest_at_most(k) - longest_at_most(k-1)
    Time: O(n), Space: O(k)
    """
    def at_most_k_distinct(s: str, k: int) -> int:
        if k < 0:
            return 0
        
        freq = {}
        left = 0
        max_len = 0
        distinct = 0
        
        for right in range(len(s)):
            if freq.get(s[right], 0) == 0:
                distinct += 1
            freq[s[right]] = freq.get(s[right], 0) + 1
            
            while distinct > k:
                freq[s[left]] -= 1
                if freq[s[left]] == 0:
                    distinct -= 1
                left += 1
            
            max_len = max(max_len, right - left + 1)
        
        return max_len
    
    return at_most_k_distinct(s, k) - at_most_k_distinct(s, k - 1)
```

---

## When to Use

Use the Sliding Window algorithm when you need to solve problems involving:

- **Subarray/Substring Problems**: Finding patterns, maximums, minimums, or sums within contiguous elements
- **Efficient Traversal**: When you need to process all elements but want to avoid redundant computations
- **Two-Pointer Scenarios**: When you need to maintain a range/interval that expands or contracts
- **String Matching**: Finding anagrams, substrings, or patterns in strings

### Comparison with Alternatives

| Approach | Time Complexity | Space Complexity | Best Use Case |
|----------|----------------|-------------------|---------------|
| **Sliding Window** | O(n) | O(k) or O(1) | Fixed/variable size windows, O(n) traversal |
| **Brute Force** | O(n×k) | O(1) | Small inputs, simple problems |
| **Prefix Sum + Window** | O(n) | O(n) | When you need random access to sums |
| **Two Pointers** | O(n) | O(1) | Sorted arrays, when direction changes |

### When to Choose Sliding Window vs Other Approaches

- **Choose Sliding Window** when:
  - You're processing consecutive elements (subarrays/substrings)
  - Window size is given or can be determined
  - You need O(n) instead of O(n×k) complexity
  - Problem involves max/min/sum within each window

- **Choose Two Pointers** when:
  - Arrays are sorted
  - You need to find pairs/subsets that satisfy conditions
  - Direction can change based on conditions

- **Choose Brute Force** when:
  - Input size is very small
  - Problem is simple and complexity doesn't matter

---

## Algorithm Explanation

### Core Concept

The key insight behind Sliding Window is that instead of recalculating results from scratch for each window position, we can **update the result incrementally** by:
1. **Removing** the leftmost element that just left the window
2. **Adding** the new element that just entered the window

This transforms O(n×k) operations into O(n) by reusing computations.

### How It Works

#### Fixed Window Size:
1. Initialize window with first k elements
2. Process the current window (calculate sum, find max/min, etc.)
3. Slide the window one step at a time:
   - Subtract the element leaving the window
   - Add the new element entering the window
4. Repeat until all elements are processed

#### Variable Window Size:
1. Expand the window by moving the right pointer
2. Shrink the window from the left when conditions are met
3. Track the best result during expansion/shrinking
4. Continue until the right pointer reaches the end

### Visual Representation

For array `[1, 3, -1, -3, 5, 3, 6, 7]` with window size k=3:

```
Window slides through array:
Index:  0   1   2   3   4   5   6   7
Array: [1,  3, -1, -3,  5,  3,  6,  7]

Window [0-2]: [1,  3, -1] → max = 3
   ↓ slide
Window [1-3]: [3, -1, -3] → max = 3
   ↓ slide
Window [2-4]: [-1, -3, 5] → max = 5
   ↓ slide
Window [3-5]: [-3, 5,  3] → max = 5
   ↓ slide
Window [4-6]: [5,  3,  6] → max = 6
   ↓ slide
Window [5-7]: [3,  6,  7] → max = 7
```

### Why It Works

- **No redundant calculations**: Each element is added and removed at most once
- **Linear time**: Each element is processed O(1) times
- **Optimal for stream processing**: Works great for data streams or large files

### Limitations

- **Only works for contiguous elements**: Cannot skip elements within the window
- **Window size constraints**: Some problems require specific window sizes
- **State-dependent problems**: Some variations require careful state management

---

## Practice Problems

### Problem 1: Maximum Sliding Window

**Problem:** [LeetCode 239 - Sliding Window Maximum](https://leetcode.com/problems/sliding-window-maximum/)

**Description:** You are given an array of integers `nums`, and there is a sliding window of size `k` which moves from the very left to the very right. You can only see the `k` numbers in the window. Return the max sliding window as an array.

**How to Apply Sliding Window:**
- Use a monotonic decreasing deque to maintain potential maximums
- Remove elements from front that are outside the window
- Remove elements from back that are smaller than current (they can never be max)
- Front of deque is always the maximum for current window

---

### Problem 2: Longest Substring Without Repeating Characters

**Problem:** [LeetCode 3 - Longest Substring Without Repeating Characters](https://leetcode.com/problems/longest-substring-without-repeating-characters/)

**Description:** Given a string `s`, find the length of the longest substring without repeating characters.

**How to Apply Sliding Window:**
- Use a hashmap to track last seen index of each character
- Expand right pointer, contract left pointer when duplicate found
- Track maximum window size during iteration
- Time: O(n), Space: O(min(m, n))

---

### Problem 3: Minimum Size Subarray Sum

**Problem:** [LeetCode 209 - Minimum Size Subarray Sum](https://leetcode.com/problems/minimum-size-subarray-sum/)

**Description:** Given an array of positive integers `nums` and a positive integer `target`, return the minimal length of a contiguous subarray whose sum is at least `target`.

**How to Apply Sliding Window:**
- Expand window by adding elements until sum >= target
- Shrink window from left to find minimum length
- Track minimum length found
- Time: O(n), Space: O(1)

---

### Problem 4: Find All Anagrams in a String

**Problem:** [LeetCode 438 - Find All Anagrams in a String](https://leetcode.com/problems/find-all-anagrams-in-a-string/)

**Description:** Given two strings `s` and `p`, return an array of all the start indices of `p`'s anagrams in `s`.

**How to Apply Sliding Window:**
- Use fixed-size window equal to pattern length
- Maintain frequency counts for both pattern and window
- Compare counts to identify anagrams
- Slide window one character at a time
- Time: O(n + m), Space: O(m)

---

### Problem 5: Maximum Average Subarray

**Problem:** [LeetCode 643 - Maximum Average Subarray I](https://leetcode.com/problems/maximum-average-subarray-i/)

**Description:** You are given an integer array `nums` consisting of `n` elements, and an integer `k`. Find a contiguous subarray whose length is `k` and has the maximum average value.

**How to Apply Sliding Window:**
- Calculate initial sum of first k elements
- Slide window by subtracting element leaving and adding element entering
- Track maximum sum (or average)
- Time: O(n), Space: O(1)

---

## Video Tutorial Links

### Fundamentals

- [Sliding Window Pattern - Introduction (Take U Forward)](https://www.youtube.com/watch?v=9trI0mriUyI) - Comprehensive introduction to sliding windows
- [Sliding Window Technique (WilliamFiset)](https://www.youtube.com/watch?v=M1Fy86AuwBs) - Detailed explanation with visualizations
- [Fixed Size Sliding Window (NeetCode)](https://www.youtube.com/watch?v=Tkpp2C3v3gU) - Practical implementation guide

### Advanced Topics

- [Variable Size Sliding Window](https://www.youtube.com/watch?v=Kkmv2e30HWs) - Expanding and shrinking windows
- [Monotonic Deque for Sliding Window](https://www.youtube.com/watch?v=5uyJb2j3G7U) - Efficient max/min queries
- [Sliding Window Maximum - LeetCode 239](https://www.youtube.com/watch?v=2kmB6M3BzsQ) - Complete problem solution

### Problem-Specific

- [Longest Substring Without Repeating - LeetCode 3](https://www.youtube.com/watch?v=4wg3Q9bU5xg) - Hashmap + sliding window
- [Minimum Window Substring - LeetCode 76](https://www.youtube.com/watch?v=e1FZ8x5h7jU) - Classic sliding window problem
- [Sliding Window Median - LeetCode 480](https://www.youtube.com/watch?v=eyLE9PZyXo0) - Advanced sliding window with data structures

---

## Follow-up Questions

### Q1: What is the difference between sliding window and two pointers?

**Answer:** Sliding Window is a specialized form of two pointers where:
- Both pointers define a **contiguous window** that moves together
- Window size can be fixed or variable
- Common operations: add to one end, remove from other

Two Pointers is more general:
- Pointers can move independently
- Not necessarily defining a contiguous range
- Can move in different directions based on conditions

### Q2: When should I use a deque for sliding window problems?

**Answer:** Use a deque when you need to efficiently find:
- **Maximum/Minimum** in each window
- Elements that satisfy monotonic properties

The deque maintains indices in decreasing/increasing order, allowing O(1) access to the optimal element while each element is pushed/popped at most once (O(n) total).

### Q3: Can sliding window handle negative numbers?

**Answer:** Yes, with some considerations:
- **For sum-based problems**: Works exactly the same, handles negatives correctly
- **For max/min with deque**: Still works - the monotonic property holds regardless of sign
- **For two-pointer variable window**: May need adjustment depending on conditions

### Q4: What if the window size is not given?

**Answer:** Use **variable window** approach:
- Expand right pointer continuously
- Shrink left pointer when condition is violated
- Track best result during expansion/shrinking
- Examples: longest substring without repeating, minimum subarray with sum >= target

### Q5: How do you handle edge cases in sliding window?

**Answer:** Common edge cases to consider:
- **Empty array/string**: Return empty result or 0
- **Window size = 0**: Return empty result
- **Window size > array length**: Return result for single window or empty
- **Single element window**: Often a base case to handle separately
- **All same/different elements**: Verify algorithm handles duplicates correctly

---

## Summary

The Sliding Window technique is a powerful algorithmic pattern for solving array and string problems efficiently. Key takeaways:

- **Efficient traversal**: Reduces O(n×k) to O(n) by reusing computations
- **Two main types**: Fixed window size and variable window size
- **Key data structures**: Deque for max/min, hashmap for character tracking
- **Linear time**: Each element is processed at most twice

When to use:
- ✅ Subarray/Substring problems with contiguous elements
- ✅ Finding max/min/sum within sliding windows
- ✅ Pattern matching (anagrams, substrings)
- ✅ When you need O(n) instead of O(n×k) complexity
- ❌ When elements are not contiguous
- ❌ When window boundaries are unpredictable

This technique is essential for competitive programming and technical interviews, appearing frequently in problems from major tech companies.