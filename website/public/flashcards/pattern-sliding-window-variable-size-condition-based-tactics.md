## Sliding Window Variable Size: Tactics

What are the key implementation tactics for variable-size sliding window problems?

<!-- front -->

---

### Tactic 1: Shrink When Met vs Shrink When Violated

**Minimum Size Problems** (shrink when condition satisfied):
```python
while current_sum >= target:
    min_len = min(min_len, right - left + 1)
    current_sum -= arr[left]
    left += 1
```

**Maximum Size Problems** (shrink when condition violated):
```python
while distinct_count > k:
    char_count[s[left]] -= 1
    if char_count[s[left]] == 0:
        distinct_count -= 1
    left += 1
max_len = max(max_len, right - left + 1)
```

---

### Tactic 2: Efficient State Tracking

**Hash Map for Character Frequencies**:
```python
char_count = defaultdict(int)
for right, char in enumerate(s):
    char_count[char] += 1
    # ... process window
    while len(char_count) > k:
        char_count[s[left]] -= 1
        if char_count[s[left]] == 0:
            del char_count[s[left]]
        left += 1
```

**Two Deques for Min/Max Tracking**:
```python
max_dq = deque()  # decreasing
min_dq = deque()  # increasing

while max_dq and arr[max_dq[-1]] < arr[right]:
    max_dq.pop()
max_dq.append(right)

while min_dq and arr[min_dq[-1]] > arr[right]:
    min_dq.pop()
min_dq.append(right)

# Current max = arr[max_dq[0]], min = arr[min_dq[0]]
```

---

### Tactic 3: Counting Valid Subarrays

Add `(right - left + 1)` for each valid position:
```python
count = 0
for right in range(n):
    # add arr[right] to state
    while condition_violated:
        # remove arr[left] from state
        left += 1
    # All subarrays ending at right, starting at [left..right] are valid
    count += right - left + 1
```

---

### Tactic 4: Exactly K Distinct = At Most K - At Most (K-1)

```python
def count_exactly_k(arr, k):
    return count_at_most_k(arr, k) - count_at_most_k(arr, k - 1)
```

---

### Tactic 5: Handling Negative Numbers

Use **Prefix Sum + Hash Map** instead of sliding window:
```python
prefix_count = defaultdict(int)
prefix_count[0] = 1
prefix_sum = 0
count = 0

for num in arr:
    prefix_sum += num
    count += prefix_count[prefix_sum - target]
    prefix_count[prefix_sum] += 1
```

---

### Tactic 6: Track Window Indices for Result

```python
result_start, result_end = 0, 0
min_length = float('inf')

while current_sum >= target:
    if right - left + 1 < min_length:
        min_length = right - left + 1
        result_start, result_end = left, right
    current_sum -= arr[left]
    left += 1

return arr[result_start:result_end + 1]
```

---

### Quick Tactic Reference

| Problem Type | Key Tactic | Pattern |
|--------------|------------|---------|
| Min size subarray sum | Shrink while ≥ target | while sum ≥ target |
| Longest K distinct | Shrink while > K distinct | while distinct > k |
| Longest no repeats | Jump left to after repeat | left = max(left, last_index[char] + 1) |
| Count subarrays | Add (right-left+1) | count += right - left + 1 |
| Max-min ≤ limit | Two deques for min/max | Maintain monotonic deques |
| Exactly K distinct | atMost(K) - atMost(K-1) | Transform to at-most |

<!-- back -->
