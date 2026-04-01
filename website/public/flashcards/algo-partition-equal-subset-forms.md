## Partition Equal Subset: Forms & Variations

What are the different forms and variations of partition problems?

<!-- front -->

---

### Form 1: Standard Partition

```python
# Given: [1, 5, 11, 5]
# Can we partition into two equal sum subsets?
# Answer: Yes → [1, 5, 5] and [11]

def partition_standard(nums):
    total = sum(nums)
    if total % 2 != 0:
        return False
    return subset_sum_exists(nums, total // 2)
```

---

### Form 2: Partition to K Equal Sum Subsets

```python
def can_partition_k_subsets(nums, k):
    """
    Partition into k subsets with equal sums.
    Backtracking with pruning.
    """
    total = sum(nums)
    if total % k != 0:
        return False
    
    target = total // k
    nums.sort(reverse=True)  # Pruning: try large first
    
    # k buckets, each needs to reach target
    buckets = [0] * k
    
    def backtrack(index):
        if index == len(nums):
            return all(b == target for b in buckets)
        
        for i in range(k):
            if buckets[i] + nums[index] <= target:
                buckets[i] += nums[index]
                if backtrack(index + 1):
                    return True
                buckets[i] -= nums[index]
            
            # Pruning: if bucket is empty, no need to try other empty buckets
            if buckets[i] == 0:
                break
        
        return False
    
    return backtrack(0)
```

---

### Form 3: Minimum Difference Partition

```python
def min_partition_difference(nums):
    """
    Partition into two subsets to minimize |sum1 - sum2|.
    When equal partition is impossible.
    """
    total = sum(nums)
    target = total // 2
    
    # Find closest sum to target
    dp = [False] * (target + 1)
    dp[0] = True
    
    for num in nums:
        for s in range(target, num - 1, -1):
            dp[s] = dp[s] or dp[s - num]
    
    # Find largest achievable sum <= target
    for s in range(target, -1, -1):
        if dp[s]:
            sum1 = s
            sum2 = total - s
            return abs(sum2 - sum1)
    
    return total  # Shouldn't reach here
```

---

### Form 4: Count Partition Ways

```python
def count_partitions(nums):
    """
    Count number of ways to partition into two equal sum subsets.
    """
    total = sum(nums)
    if total % 2 != 0:
        return 0
    
    target = total // 2
    
    # dp[s] = number of ways to achieve sum s
    dp = [0] * (target + 1)
    dp[0] = 1
    
    for num in nums:
        for s in range(target, num - 1, -1):
            dp[s] += dp[s - num]
    
    return dp[target] // 2  # Divide by 2 as each partition counted twice
```

---

### Form 5: Partition With Constraints

```python
def can_partition_constrained(nums, max_size, max_element):
    """
    Partition with additional constraints:
    - Subset size <= max_size
    - No element > max_element
    """
    total = sum(nums)
    if total % 2 != 0:
        return False
    
    target = total // 2
    n = len(nums)
    
    # dp[i][s][k] = can achieve sum s with k elements using first i
    # Space can be optimized to 2D
    from collections import defaultdict
    dp = defaultdict(lambda: defaultdict(set))
    dp[0][0].add(0)  # sum 0 with 0 elements
    
    for num in nums:
        if num > max_element:
            continue
        new_dp = defaultdict(lambda: defaultdict(set))
        for s in dp:
            for k in dp[s]:
                for count in dp[s][k]:
                    # Don't take
                    new_dp[s][k].add(count)
                    # Take
                    if s + num <= target and count + 1 <= max_size:
                        new_dp[s + num][k + 1].add(count + 1)
        dp = new_dp
    
    return len(dp[target]) > 0
```

<!-- back -->
