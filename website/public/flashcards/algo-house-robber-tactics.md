## House Robber: Tactics & Applications

What tactical patterns help solve House Robber variants?

<!-- front -->

---

### Tactic 1: State Machine DP

```python
def rob_state_machine(nums):
    """
    Model as state machine: robbed / not robbed
    """
    # States: 0 = not robbed previous, 1 = robbed previous
    # But we need to track if we can rob current
    
    # Simpler: just track last action
    robbed_prev = 0    # Max money if we robbed i-1
    not_robbed_prev = 0  # Max money if we didn't rob i-1
    
    for num in nums:
        # If we rob current, we couldn't have robbed previous
        robbed_curr = not_robbed_prev + num
        
        # If we don't rob current, we could have done anything before
        not_robbed_curr = max(robbed_prev, not_robbed_prev)
        
        robbed_prev, not_robbed_prev = robbed_curr, not_robbed_curr
    
    return max(robbed_prev, not_robbed_prev)
```

---

### Tactic 2: Divide and Conquer with DP

```python
def rob_divide_conquer(nums):
    """
    For very large arrays, can use divide and conquer
    But O(n) DP is already optimal
    """
    if not nums:
        return 0
    if len(nums) <= 2:
        return max(nums) if nums else 0
    
    mid = len(nums) // 2
    
    # Left half: normal
    left = rob_linear(nums[:mid])
    
    # Right half: normal
    right = rob_linear(nums[mid:])
    
    # But middle case: rob both sides?
    # Need special handling for boundary
    
    # Actually DP is better, this is just illustration
    return max(left, right, cross_boundary(nums, mid))

def cross_boundary(nums, mid):
    """Handle cases that cross the middle"""
    # Rob mid-2 and mid+1 but not mid-1 and mid
    # Or other combinations
    left_part = nums[:mid]
    right_part = nums[mid+1:]
    
    # Various boundary cases
    case1 = (left_part[-2] if len(left_part) >= 2 else 0) + \
            (right_part[1] if len(right_part) >= 2 else 0)
    
    return case1  # Simplified
```

---

### Tactic 3: House Robber as Maximum Independent Set

```python
def rob_as_independent_set(nums):
    """
    On a path graph, maximum independent set = house robber
    """
    # Path graph: vertices 0-1-2-3-4...
    # Independent set: no two adjacent
    
    # This is exactly house robber
    # Can use weighted MIS algorithm
    
    # Generalizes to trees (House Robber III)
    # Generalizes to arbitrary graphs (NP-hard)
    
    return rob_linear(nums)

# Tree maximum independent set
def tree_mis(root):
    """
    On tree: use post-order DP
    Same as House Robber III
    """
    def dfs(node):
        if not node:
            return (0, 0)
        
        left = dfs(node.left)
        right = dfs(node.right)
        
        in_set = node.val + left[1] + right[1]
        not_in_set = max(left) + max(right)
        
        return (in_set, not_in_set)
    
    return max(dfs(root))
```

---

### Tactic 4: Circular Array Transformation

```python
def handle_circular_generic(nums, solve_linear):
    """
    Generic pattern for circular array problems
    """
    if not nums:
        return 0
    if len(nums) == 1:
        return nums[0]
    
    # In circular problems, solution is usually:
    # max(exclude_first, exclude_last)
    # Because we can't have both first and last
    
    exclude_first = solve_linear(nums[1:])
    exclude_last = solve_linear(nums[:-1])
    
    return max(exclude_first, exclude_last)

# Apply to other circular problems
def circular_max_sum_non_adjacent(nums):
    """Circular version of max sum non-adjacent"""
    return handle_circular_generic(nums, max_sum_non_adjacent)
```

---

### Tactic 5: Space Optimization Pattern

```python
def space_optimized_dp(nums, transition):
    """
    Pattern for O(1) space when only need last k states
    """
    if not nums:
        return 0
    
    # For house robber, k=2 (need i-1 and i-2)
    k = 2
    dp = [0] * k
    
    for i, num in enumerate(nums):
        if i < k:
            dp[i] = num if i == 0 else max(dp[0], num)
        else:
            # Compute next value
            next_val = transition(num, dp)
            # Shift window
            dp = dp[1:] + [next_val]
    
    return dp[-1] if dp else 0

def house_robber_transition(num, dp_window):
    """Transition function for house robber"""
    # dp_window = [dp[i-2], dp[i-1]]
    return max(dp_window[1], num + dp_window[0])

# Generic pattern
def generic_rolling_dp(arr, init_fn, trans_fn):
    if not arr:
        return 0
    
    states = init_fn(arr[0])
    
    for x in arr[1:]:
        new_states = trans_fn(x, states)
        states = new_states
    
    return max(states) if isinstance(states, (list, tuple)) else states
```

<!-- back -->
