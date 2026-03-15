## Longest Increasing Subsequence (Patience Sorting)

**Question:** How do you find the length of the longest increasing subsequence in O(n log n) time?

<!-- front -->

---

## Answer: Binary Search with Tails Array

### Key Insight
Maintain an array `tails` where `tails[i]` is the smallest tail element for increasing subsequences of length `i+1`.

### Solution
```python
def length_of_lis(nums):
    tails = []
    
    for num in nums:
        # Find position to replace/append
        pos = bisect_left(tails, num)
        
        if pos == len(tails):
            # num is larger than all tails, extend
            tails.append(num)
        else:
            # Replace to maintain smallest tail
            tails[pos] = num
    
    return len(tails)
```

### Visual Walkthrough
```
nums = [10, 9, 2, 5, 3, 7, 101, 18]

Step 1: 10 → tails = [10]
Step 2: 9  → replace → tails = [9]
Step 3: 2  → replace → tails = [2]
Step 4: 5  → append  → tails = [2, 5]
Step 5: 3  → replace → tails = [2, 3]
Step 6: 7  → append  → tails = [2, 3, 7]
Step 7: 101→ append  → tails = [2, 3, 7, 101]
Step 8: 18 → replace → tails = [2, 3, 7, 18]

Result: 4 (length of tails)
```

### Complexity
- **Time:** O(n log n) - binary search for each element
- **Space:** O(n)

### How to Reconstruct the Sequence
```python
def lis_sequence(nums):
    tails = []
    indices = []  # Store which nums form the sequence
    
    for num in nums:
        pos = bisect_left(tails, num)
        if pos == len(tails):
            tails.append(num)
        else:
            tails[pos] = num
        indices.append(pos)
    
    # Backtrack to find actual sequence
    result = []
    pos = len(tails) - 1
    for i in range(len(nums) - 1, -1, -1):
        if indices[i] == pos:
            result.append(nums[i])
            pos -= 1
            if pos < 0:
                break
    
    return result[::-1]
```

### Alternative: DP (O(n²))
```python
def lis_dp(nums):
    n = len(nums)
    dp = [1] * n
    
    for i in range(1, n):
        for j in range(i):
            if nums[j] < nums[i]:
                dp[i] = max(dp[i], dp[j] + 1)
    
    return max(dp)
```

### ⚠️ Key Points
- Uses `bisect_left` (not `bisect`) for strict increasing
- `tails` is NOT the actual LIS, just has correct length
- For non-decreasing, use `bisect_right`

<!-- back -->
