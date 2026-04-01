## House Robber: Frameworks

What are the standard DP frameworks for House Robber variants?

<!-- front -->

---

### Linear Houses Framework

```python
def rob_linear(nums):
    """
    Standard house robber on linear street
    """
    if not nums:
        return 0
    if len(nums) == 1:
        return nums[0]
    
    # Space-optimized: only track last two
    prev2 = nums[0]
    prev1 = max(nums[0], nums[1])
    
    for i in range(2, len(nums)):
        current = max(prev1, nums[i] + prev2)
        prev2 = prev1
        prev1 = current
    
    return prev1

# Alternative: DP array (clearer)
def rob_linear_dp(nums):
    if not nums:
        return 0
    
    n = len(nums)
    dp = [0] * n
    dp[0] = nums[0]
    
    for i in range(1, n):
        take = nums[i] + (dp[i-2] if i >= 2 else 0)
        skip = dp[i-1]
        dp[i] = max(take, skip)
    
    return dp[-1]
```

---

### Circular Houses Framework

```python
def rob_circular(nums):
    """
    Houses in circle: cannot rob both first and last
    """
    if not nums:
        return 0
    if len(nums) == 1:
        return nums[0]
    
    # Two cases: exclude first OR exclude last
    def rob_range(start, end):
        """Rob linear subarray nums[start:end]"""
        prev2 = 0
        prev1 = 0
        
        for i in range(start, end):
            current = max(prev1, nums[i] + prev2)
            prev2 = prev1
            prev1 = current
        
        return prev1
    
    # Case 1: Rob from house 0 to n-2 (exclude last)
    # Case 2: Rob from house 1 to n-1 (exclude first)
    return max(rob_range(0, len(nums) - 1), rob_range(1, len(nums)))
```

---

### Tree Houses Framework

```python
class TreeNode:
    def __init__(self, val=0):
        self.val = val
        self.left = None
        self.right = None

def rob_tree(root):
    """
    Binary tree houses, cannot rob adjacent (parent-child)
    Returns (rob, not_rob) for subtree
    """
    def dfs(node):
        if not node:
            return (0, 0)  # (if rob this, if not rob this)
        
        left = dfs(node.left)
        right = dfs(node.right)
        
        # If we rob this node, cannot rob children
        rob = node.val + left[1] + right[1]
        
        # If we don't rob this node, can choose for children
        not_rob = max(left) + max(right)
        
        return (rob, not_rob)
    
    return max(dfs(root))
```

---

### Multiple Houses with Constraints

```python
def rob_with_constraints(nums, constraints):
    """
    nums[i] = money in house i
    constraints[i] = list of houses that become unavailable if i is robbed
    """
    n = len(nums)
    dp = [0] * (n + 1)
    
    for i in range(n):
        # Option 1: Don't rob house i
        dp[i+1] = max(dp[i+1], dp[i])
        
        # Option 2: Rob house i
        # Find next available house after constraints
        next_available = i + 1
        for blocked in constraints[i]:
            next_available = max(next_available, blocked + 1)
        
        if next_available <= n:
            dp[next_available] = max(dp[next_available], dp[i] + nums[i])
    
    return max(dp)
```

---

### Matrix/2D Houses

```python
def rob_2d(matrix):
    """
    Houses in 2D grid, cannot rob adjacent (including diagonally)
    Equivalent to maximum independent set on grid graph
    """
    rows, cols = len(matrix), len(matrix[0])
    
    # Convert to independent set problem
    # Or use state compression DP per row
    
    # Simplified: each row is independent
    row_max = [rob_linear(row) for row in matrix]
    return sum(row_max)

# Alternative: knapsack-like
def rob_2d_knapsack(matrix):
    """
    Each house has weight 1, value = money
    Constraint: no two selected are adjacent (4-neighbor)
    """
    # Use DP with bitmask for each row
    # State: which columns are robbed in previous row
    pass
```

<!-- back -->
