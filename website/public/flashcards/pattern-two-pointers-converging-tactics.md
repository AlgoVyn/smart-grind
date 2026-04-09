## Two Pointers - Converging: Tactics

What are the advanced techniques for Converging Two Pointers?

<!-- front -->

---

### Tactic 1: Handling Duplicates

**Problem**: Input array may contain duplicates, leading to duplicate results

**Solution**: Skip duplicate values after processing

```python
def three_sum_with_dedup(nums):
    nums.sort()
    result = []
    
    for i in range(len(nums) - 2):
        # Skip duplicate first elements
        if i > 0 and nums[i] == nums[i - 1]:
            continue
        
        left, right = i + 1, len(nums) - 1
        
        while left < right:
            total = nums[i] + nums[left] + nums[right]
            
            if total == 0:
                result.append([nums[i], nums[left], nums[right]])
                
                # Skip duplicates for second element
                while left < right and nums[left] == nums[left + 1]:
                    left += 1
                # Skip duplicates for third element
                while left < right and nums[right] == nums[right - 1]:
                    right -= 1
                
                left += 1
                right -= 1
            # ... rest of logic
```

---

### Tactic 2: Four Sum and K-Sum Extension

**Pattern**: Reduce K-sum to (K-2)-sum recursively

```python
def four_sum(nums, target):
    nums.sort()
    result = []
    n = len(nums)
    
    for i in range(n - 3):
        if i > 0 and nums[i] == nums[i - 1]:
            continue
        
        for j in range(i + 1, n - 2):
            if j > i + 1 and nums[j] == nums[j - 1]:
                continue
            
            # Now two-sum with converging pointers
            left, right = j + 1, n - 1
            
            while left < right:
                total = nums[i] + nums[j] + nums[left] + nums[right]
                
                if total == target:
                    result.append([nums[i], nums[j], nums[left], nums[right]])
                    # Skip duplicates...
                    left += 1
                    right -= 1
                elif total < target:
                    left += 1
                else:
                    right -= 1
    
    return result
```

**Complexity**: O(n^(K-1)) for K-sum

---

### Tactic 3: Two Sum in BST

**Approach**: Use converging pointers with BST inorder traversal

```python
def find_target_in_bst(root, target):
    # Use two stacks for iterator pattern
    left_stack, right_stack = [], []
    
    # Initialize iterators
    left_node = root
    right_node = root
    
    while True:
        # Move left iterator forward (inorder)
        while left_node:
            left_stack.append(left_node)
            left_node = left_node.left
        
        # Move right iterator backward (reverse inorder)
        while right_node:
            right_stack.append(right_node)
            right_node = right_node.right
        
        if not left_stack or not right_stack:
            break
        
        left_val = left_stack[-1].val
        right_val = right_stack[-1].val
        
        if left_val >= right_val:
            break
        
        current_sum = left_val + right_val
        
        if current_sum == target:
            return True
        elif current_sum < target:
            # Move left forward
            node = left_stack.pop()
            left_node = node.right
        else:
            # Move right backward
            node = right_stack.pop()
            right_node = node.left
    
    return False
```

---

### Tactic 4: Closest Pair Variations

**Closest to Target**:

```python
def closest_pair(numbers, target):
    left, right = 0, len(numbers) - 1
    closest_sum = numbers[0] + numbers[1]
    
    while left < right:
        current_sum = numbers[left] + numbers[right]
        
        # Update if closer to target
        if abs(current_sum - target) < abs(closest_sum - target):
            closest_sum = current_sum
        
        if current_sum < target:
            left += 1
        else:
            right -= 1
    
    return closest_sum
```

---

### Tactic 5: Common Pitfalls

| Pitfall | Problem | Solution |
|---------|---------|----------|
| **Not sorting first** | Algorithm fails on unsorted | Sort: O(n log n) |
| **Off-by-one indices** | Wrong answer format | Check 0-based vs 1-based |
| **Integer overflow** | Large number sum | Use long/long long |
| **Not handling duplicates** | Duplicate results | Skip after finding match |
| **Infinite loop** | Not moving pointers | Ensure left++ or right-- always |
| **Same element twice** | Using same index | Maintain left < right |

---

### Tactic 6: When Array Isn't Sorted

**Option 1**: Sort first (changes indices)

**Option 2**: Use hash map for unsorted two sum

```python
# Hash map approach (O(n) time, O(n) space)
def two_sum_unsorted(nums, target):
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return None
```

**Trade-off**: Hash map uses O(n) space but preserves original indices

---

### Tactic 7: Valid Palindrome Pattern

```python
def is_palindrome(s):
    left, right = 0, len(s) - 1
    
    while left < right:
        # Skip non-alphanumeric
        while left < right and not s[left].isalnum():
            left += 1
        while left < right and not s[right].isalnum():
            right -= 1
        
        if s[left].lower() != s[right].lower():
            return False
        
        left += 1
        right -= 1
    
    return True
```

**Key addition**: Skip invalid characters while converging

<!-- back -->
