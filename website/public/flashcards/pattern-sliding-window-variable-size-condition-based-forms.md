## Sliding Window Variable Size: Forms & Applications

What are the common forms and applications of variable-size sliding window?

<!-- front -->

---

### Form 1: Minimum Window Size

**Problem**: Find smallest subarray satisfying a condition

**Examples**:
- Minimum Size Subarray Sum (sum ≥ target)
- Minimum Window Substring (contains all characters)
- Smallest range covering elements from K lists

**Template**:
```python
while condition_satisfied:
    update_minimum()
    shrink_window()
```

---

### Form 2: Maximum Window Size

**Problem**: Find largest subarray satisfying a constraint

**Examples**:
- Longest Substring Without Repeating Characters
- Longest Substring with At Most K Distinct Characters
- Max Consecutive Ones III (flip at most K zeros)
- Fruit Into Baskets (at most 2 types)

**Template**:
```python
while condition_violated:
    shrink_window()
update_maximum()
```

---

### Form 3: Count Valid Subarrays

**Problem**: Count all subarrays meeting criteria

**Examples**:
- Subarrays with K Different Integers
- Count subarrays with sum equals K (with positives)
- Binary Subarrays With Sum
- Subarrays with max - min ≤ limit

**Template**:
```python
while condition_violated:
    shrink_window()
count += right - left + 1  # All ending at right are valid
```

---

### Form 4: Exact Sum / Target Matching

**Problem**: Find subarrays with exact sum/target

**Examples**:
- Subarray Sum Equals K
- Continuous Subarray Sum (multiple of K)
- Minimum Operations to Reduce X to Zero

**Approach**:
- With positives: Sliding window with `current_sum == target`
- With negatives: Prefix sum hashmap

---

### Form 5: Character-Based Constraints

**Problem**: String problems with character constraints

**Examples**:
- Longest Repeating Character Replacement
- Permutation in String
- Find All Anagrams in a String
- Longest Substring with At Least K Repeating Characters

**State Tracking**:
```python
char_count = defaultdict(int)
for right, char in enumerate(s):
    char_count[char] += 1
    # maintain window validity
    while not_valid():
        char_count[s[left]] -= 1
        left += 1
```

---

### Form 6: Range/Min-Max Constraints

**Problem**: Subarrays with bounded min-max difference

**Examples**:
- Longest Continuous Subarray With Absolute Diff ≤ Limit
- Count subarrays with max - min ≤ K

**State Tracking** (Two Deques):
```python
max_dq = deque()  # decreasing: front = max
min_dq = deque()  # increasing: front = min

while arr[max_dq[0]] - arr[min_dq[0]] > limit:
    if max_dq[0] == left: max_dq.popleft()
    if min_dq[0] == left: min_dq.popleft()
    left += 1
```

---

### Problem Mapping Table

| Problem | Form | Key Constraint | State |
|---------|------|----------------|-------|
| LeetCode 209: Min Size Subarray Sum | Minimum | sum ≥ target | current_sum |
| LeetCode 3: Longest Substring No Repeats | Maximum | all unique | last_index map |
| LeetCode 340: Longest K Distinct | Maximum | ≤ K distinct | char_count |
| LeetCode 904: Fruit Into Baskets | Maximum | ≤ 2 types | fruit_count |
| LeetCode 992: Subarrays with K Distinct | Count | exactly K | atMost(K) - atMost(K-1) |
| LeetCode 424: Longest Repeating Character Replace | Maximum | max_freq + k ≥ window | char_freq |
| LeetCode 1004: Max Consecutive Ones III | Maximum | ≤ k zeros flipped | zero_count |
| LeetCode 1438: Longest Subarray Diff ≤ Limit | Maximum | max - min ≤ limit | two deques |
| LeetCode 76: Min Window Substring | Minimum | contains all of t | char_needed |
| LeetCode 930: Binary Subarrays With Sum | Count | sum equals goal | prefix_count |

<!-- back -->
