## Title: XOR Trick - Problem Forms

What are the standard problem forms that use XOR tricks?

<!-- front -->

---

### Form 1: Single Number (Pairs)

**Pattern:** Every element appears twice except one

```python
def single_number(nums):
    result = 0
    for num in nums:
        result ^= num
    return result

# Time: O(n), Space: O(1)
# Cannot use with more than one unique element
```

| Constraint | Solution |
|------------|----------|
| Appears twice | XOR all |
| Appears 3x | Count bits or use math |
| Appears 4x | XOR still works if 4 is even |

---

### Form 2: Single Number III (Two Uniques)

**Pattern:** Every element appears twice except two different elements

```python
def single_number_iii(nums):
    # Get XOR of the two unique numbers
    xor = 0
    for num in nums:
        xor ^= num
    
    # Find rightmost set bit (where they differ)
    diff = xor & -xor
    
    # Split into two groups and XOR each
    a = b = 0
    for num in nums:
        if num & diff:
            a ^= num
        else:
            b ^= num
    
    return [a, b]
```

**Why it works:** The diff bit separates the two unique numbers into different groups. Within each group, pairs cancel out, leaving only the unique number.

---

### Form 3: Missing Number

**Pattern:** Array contains n-1 numbers from 1..n, find missing

```python
def missing_number(nums, n):
    # Method 1: XOR
    result = n  # Start with n (not in array indices)
    for i in range(n):
        result ^= (i + 1) ^ nums[i]
    return result

# Example: [1, 2, 4], n=4
# result = 4 ^ 1^1 ^ 2^2 ^ 3^4 = 4 ^ 0 ^ 0 ^ 7 = 4 ^ 7 = 3

# Method 2: Sum (may overflow)
# missing = n*(n+1)//2 - sum(nums)

# Method 3: Index XOR
# for i, num in enumerate(nums):
#     result ^= (i + 1) ^ num
# return result ^ (n + 1)  # if 0..n instead of 1..n
```

---

### Form 4: XOR Queries on Array

**Pattern:** Answer multiple subarray XOR queries

```python
def xor_queries(arr, queries):
    """
    queries: [(left, right), ...]
    Returns XOR of arr[left..right] for each query
    """
    # Build prefix XOR
    prefix = [0]
    for num in arr:
        prefix.append(prefix[-1] ^ num)
    
    # Answer queries in O(1) each
    result = []
    for left, right in queries:
        result.append(prefix[right + 1] ^ prefix[left])
    
    return result

# Prefix: [0, a0, a0^a1, a0^a1^a2, ...]
# xor(L, R) = prefix[R+1] ^ prefix[L]
```

---

### Form 5: Find Duplicate and Missing

**Pattern:** Array has one duplicate and one missing number

```python
def find_error_nums(nums):
    """
    nums: contains n numbers from 1..n
    One number appears twice, one is missing
    Return [duplicate, missing]
    """
    n = len(nums)
    
    # XOR approach
    xor = 0
    for i, num in enumerate(nums):
        xor ^= (i + 1) ^ num
    # xor = duplicate ^ missing
    
    # Find rightmost set bit
    diff = xor & -xor
    
    # Group XOR
    dup = miss = 0
    for i, num in enumerate(nums):
        if (i + 1) & diff:
            dup ^= (i + 1)
        else:
            miss ^= (i + 1)
        
        if num & diff:
            dup ^= num
        else:
            miss ^= num
    
    # Verify which is duplicate
    for num in nums:
        if num == dup:
            return [dup, miss]
    return [miss, dup]
```

<!-- back -->
