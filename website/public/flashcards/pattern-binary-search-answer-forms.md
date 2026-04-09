## Binary Search - On Answer: Forms

What are the different variations of binary search on answer?

<!-- front -->

---

### Form 1: Split Array Largest Sum

```python
def split_array(nums, m):
    """Split array into m subarrays, minimize largest sum."""
    
    def can_split(max_sum):
        """Check if can split into m subarrays with each sum <= max_sum."""
        current_sum = 0
        splits = 1
        
        for num in nums:
            if current_sum + num <= max_sum:
                current_sum += num
            else:
                splits += 1
                current_sum = num
                if splits > m:
                    return False
        
        return True
    
    left, right = max(nums), sum(nums)
    
    while left < right:
        mid = left + (right - left) // 2
        
        if can_split(mid):
            right = mid
        else:
            left = mid + 1
    
    return left
```

---

### Form 2: Minimize Max Distance to Gas Station

```python
def minmax_gas_dist(stations, k):
    """Add k gas stations to minimize max distance between stations."""
    
    def can_achieve(max_dist):
        """Check if can achieve max distance with k stations."""
        needed = 0
        for i in range(1, len(stations)):
            dist = stations[i] - stations[i - 1]
            needed += (dist // max_dist)
            if needed > k:
                return False
        return needed <= k
    
    left, right = 0, stations[-1] - stations[0]
    
    while left < right:
        mid = left + (right - left) / 2  # Float binary search
        
        if can_achieve(mid):
            right = mid
        else:
            left = mid + 1e-6  # Precision handling
    
    return left
```

---

### Form 3: Find K-th Smallest Pair Distance

```python
def smallest_distance_pair(nums, k):
    """Find k-th smallest distance among all pairs."""
    nums.sort()
    n = len(nums)
    
    def count_pairs(max_dist):
        """Count pairs with distance <= max_dist."""
        count = 0
        j = 0
        for i in range(n):
            while j < n and nums[j] - nums[i] <= max_dist:
                j += 1
            count += j - i - 1
        return count
    
    left, right = 0, nums[-1] - nums[0]
    
    while left < right:
        mid = left + (right - left) // 2
        
        if count_pairs(mid) >= k:
            right = mid
        else:
            left = mid + 1
    
    return left
```

---

### Form 4: Capacity To Ship Packages

```python
def ship_within_days(weights, days):
    def can_ship(capacity):
        current, required_days = 0, 1
        for w in weights:
            if current + w <= capacity:
                current += w
            else:
                required_days += 1
                current = w
        return required_days <= days
    
    left, right = max(weights), sum(weights)
    
    while left < right:
        mid = (left + right) // 2
        if can_ship(mid):
            right = mid
        else:
            left = mid + 1
    
    return left
```

---

### Form Comparison

| Form | Check Function | Search Space | Output |
|------|----------------|--------------|--------|
| Split Array | Count splits needed | [max, sum] | Min largest sum |
| Gas Station | Count stations needed | [0, max_dist] | Min max distance |
| K-th Pair | Count pairs <= mid | [0, max_diff] | K-th distance |
| Ship Capacity | Count days needed | [max, sum] | Min capacity |

<!-- back -->
