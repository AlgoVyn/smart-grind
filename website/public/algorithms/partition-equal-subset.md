# Partition Equal Subset

## Category
Dynamic Programming

## Description

The **Partition Equal Subset Sum** problem asks whether a given array of positive integers can be partitioned into two subsets with equal sum. This is a classic dynamic programming problem that reduces to the **Subset Sum** problem - finding a subset that sums to exactly half of the total array sum.

---

## When to Use

Use the Partition Equal Subset algorithm when you need to solve problems involving:

- **Subset Sum with Target**: When you need to find if any subset sums to a specific value
- **Array Partitioning**: Dividing arrays into groups with equal properties (sum, count, etc.)
- **Resource Allocation**: Splitting resources equally between two parties
- **Dynamic Programming Practice**: As a stepping stone to more complex DP problems like Knapsack

### Comparison with Alternatives

| Approach | Time Complexity | Space Complexity | When to Use |
|----------|-----------------|------------------|-------------|
| **Brute Force (Recursion)** | O(2ⁿ) | O(n) | Never - only for understanding |
| **Memoization (Top-down)** | O(n × sum) | O(n × sum) | When you prefer recursive thinking |
| **Tabulation (Bottom-up)** | O(n × sum) | O(n × sum) | Standard DP approach |
| **Space-Optimized DP** | O(n × sum) | O(sum) | **Recommended** - best space efficiency |
| **Bitset Optimization** | O(n × sum/word_size) | O(sum/word_size) | For very tight space constraints |

### When to Use Each Approach

- **Choose Space-Optimized DP** when:
  - You need the most practical solution
  - Memory is a concern (reduces space from O(n×sum) to O(sum))
  - You're solving this in an interview or competition

- **Choose Bitset Optimization** when:
  - Dealing with very large sums and need maximum speed
  - Working in C++ where `std::bitset` or `boost::dynamic_bitset` is available
  - Space is extremely constrained

---

## Algorithm Explanation

### Core Concept

The key insight is that partitioning into two equal-sum subsets is equivalent to finding **one subset that sums to half of the total**:

- If total sum = S, we need to find a subset with sum = S/2
- If S is odd, partitioning is impossible (return False)
- The remaining elements automatically sum to S/2 if we find such a subset

This transforms the problem into the classic **0/1 Knapsack** variant:
- Items: Array elements
- Capacity: target = sum/2
- Goal: Fill knapsack exactly to capacity

### How It Works

#### Dynamic Programming Approach:

1. **State Definition**: `dp[i][s]` = True if sum `s` is achievable using first `i` elements
2. **Transition**: For each element, we have two choices:
   - **Include**: `dp[i][s] = dp[i-1][s - nums[i-1]]`
   - **Exclude**: `dp[i][s] = dp[i-1][s]`
3. **Space Optimization**: Since we only need the previous row, use a 1D array and iterate backwards

#### Visual Representation

For `nums = [1, 5, 11, 5]`, total = 22, target = 11:

```
Initial dp: [T, F, F, F, F, F, F, F, F, F, F, F]
              0  1  2  3  4  5  6  7  8  9  10 11

After num=1:  [T, T, F, F, F, F, F, F, F, F, F, F]
After num=5:  [T, T, F, F, F, T, T, F, F, F, F, F]
After num=11: [T, T, F, F, F, T, T, F, F, F, F, T] ✓ Target reached!
After num=5:  (would also work, but we can early exit)
```

### Why Backwards Iteration?

When using 1D DP, we iterate from target down to num to **prevent using the same element twice**:
- Forward iteration: `dp[s]` might use the updated `dp[s-num]` (same element used twice)
- Backward iteration: `dp[s-num]` is from the previous iteration (previous elements only)

---

## Algorithm Steps

### Space-Optimized Dynamic Programming

1. **Calculate Total Sum**: Sum all elements in the array
2. **Check Odd Sum**: If sum is odd, return False immediately
3. **Set Target**: target = sum / 2
4. **Initialize DP Array**: `dp[0] = True` (sum 0 is always achievable), rest are False
5. **Process Each Element**:
   - For each number, iterate from target down to the number
   - Update `dp[s] = dp[s] OR dp[s - num]`
   - If `dp[target]` becomes True, early exit with True
6. **Return Result**: Return `dp[target]`

### Bitset Approach (C++)

1. Initialize bitset with bit 0 set
2. For each number, left-shift the bitset and OR with original
3. Check if bit at target position is set

---

## Implementation

````carousel
```python
from typing import List

def can_partition(nums: List[int]) -> bool:
    """
    Check if array can be partitioned into two subsets with equal sum.
    Space-optimized dynamic programming approach.
    
    Args:
        nums: List of positive integers
    
    Returns:
        True if array can be partitioned into two equal-sum subsets
        
    Time Complexity: O(n × sum)
    Space Complexity: O(sum)
    """
    total = sum(nums)
    
    # If total is odd, cannot partition into equal halves
    if total % 2 != 0:
        return False
    
    target = total // 2
    n = len(nums)
    
    # dp[i] = True if sum i is achievable
    dp = [False] * (target + 1)
    dp[0] = True  # Sum 0 is always achievable (empty subset)
    
    for num in nums:
        # Iterate backwards to avoid using same element twice
        for s in range(target, num - 1, -1):
            dp[s] = dp[s] or dp[s - num]
        
        # Early exit if target is reached
        if dp[target]:
            return True
    
    return dp[target]


def can_partition_set(nums: List[int]) -> bool:
    """
    Alternative implementation using set for clarity.
    Slightly more space-efficient for sparse reachable sums.
    
    Time Complexity: O(n × sum) worst case, but often faster in practice
    Space Complexity: O(min(sum, 2^n)) - only stores reachable sums
    """
    total = sum(nums)
    if total % 2 != 0:
        return False
    
    target = total // 2
    reachable = {0}
    
    for num in nums:
        # Add new reachable sums by including current number
        new_reachable = {s + num for s in reachable if s + num <= target}
        reachable = reachable | new_reachable
        
        if target in reachable:
            return True
    
    return target in reachable


def can_partition_2d(nums: List[int]) -> bool:
    """
    Full 2D DP implementation for educational purposes.
    Easier to understand but uses more space.
    
    Time Complexity: O(n × sum)
    Space Complexity: O(n × sum)
    """
    total = sum(nums)
    if total % 2 != 0:
        return False
    
    target = total // 2
    n = len(nums)
    
    # dp[i][s] = True if sum s is achievable using first i elements
    dp = [[False] * (target + 1) for _ in range(n + 1)]
    dp[0][0] = True
    
    for i in range(1, n + 1):
        for s in range(target + 1):
            # Don't include nums[i-1]
            dp[i][s] = dp[i-1][s]
            
            # Include nums[i-1] if possible
            if s >= nums[i-1]:
                dp[i][s] = dp[i][s] or dp[i-1][s - nums[i-1]]
    
    return dp[n][target]


# Example usage and demonstration
if __name__ == "__main__":
    test_cases = [
        [1, 5, 11, 5],      # True: [1,5,5] and [11]
        [1, 2, 3, 5],       # False: sum=11 (odd)
        [1, 2, 5],          # False: sum=8, target=4, no subset sums to 4
        [3, 3, 3, 4, 5],    # True: [3,3,4] and [3,5]
        [2, 2, 1, 1],       # True: [2,1] and [2,1]
    ]
    
    print("Partition Equal Subset Sum Results:")
    print("=" * 50)
    
    for nums in test_cases:
        result = can_partition(nums)
        total = sum(nums)
        status = "✓ Can Partition" if result else "✗ Cannot Partition"
        print(f"Array: {nums}")
        print(f"Total Sum: {total}, Target: {total//2 if total%2==0 else 'N/A (odd)'}")
        print(f"Result: {status}")
        print("-" * 50)
```

<!-- slide -->
```cpp
#include <iostream>
#include <vector>
#include <numeric>
#include <bitset>
using namespace std;

/**
 * Partition Equal Subset Sum - Space Optimized DP
 * 
 * Time Complexity: O(n × sum)
 * Space Complexity: O(sum)
 */
class PartitionEqualSubset {
public:
    bool canPartition(vector<int>& nums) {
        int total = accumulate(nums.begin(), nums.end(), 0);
        
        // If sum is odd, cannot partition equally
        if (total % 2 != 0) {
            return false;
        }
        
        int target = total / 2;
        
        // dp[i] = true if sum i is achievable
        vector<bool> dp(target + 1, false);
        dp[0] = true;
        
        for (int num : nums) {
            // Iterate backwards to avoid using same element twice
            for (int s = target; s >= num; s--) {
                dp[s] = dp[s] || dp[s - num];
            }
            
            // Early exit
            if (dp[target]) {
                return true;
            }
        }
        
        return dp[target];
    }
};

/**
 * Bitset Optimization (C++ specific)
 * Uses bit manipulation for faster operations
 * 
 * Time Complexity: O(n × sum / word_size)
 * Space Complexity: O(sum / word_size)
 */
class PartitionEqualSubsetBitset {
public:
    bool canPartition(vector<int>& nums) {
        int total = accumulate(nums.begin(), nums.end(), 0);
        
        if (total % 2 != 0) {
            return false;
        }
        
        int target = total / 2;
        
        // Use bitset for space efficiency
        // bitset[0] represents sum 0 is achievable
        vector<bool> bits(target + 1, false);
        bits[0] = true;
        
        for (int num : nums) {
            // Shift and OR: equivalent to adding num to all reachable sums
            for (int s = target; s >= num; s--) {
                bits[s] = bits[s] || bits[s - num];
            }
        }
        
        return bits[target];
    }
    
    // Alternative using std::bitset (for compile-time size)
    template<int MAX_SUM>
    bool canPartitionBitset(vector<int>& nums) {
        int total = accumulate(nums.begin(), nums.end(), 0);
        
        if (total % 2 != 0) {
            return false;
        }
        
        bitset<MAX_SUM> bs;
        bs[0] = 1;  // Sum 0 is achievable
        
        for (int num : nums) {
            bs |= (bs << num);
        }
        
        return bs[total / 2];
    }
};

/**
 * 2D DP Implementation (for educational purposes)
 */
class PartitionEqualSubset2D {
public:
    bool canPartition(vector<int>& nums) {
        int total = accumulate(nums.begin(), nums.end(), 0);
        
        if (total % 2 != 0) {
            return false;
        }
        
        int target = total / 2;
        int n = nums.size();
        
        // dp[i][s] = true if sum s achievable with first i elements
        vector<vector<bool>> dp(n + 1, vector<bool>(target + 1, false));
        dp[0][0] = true;
        
        for (int i = 1; i <= n; i++) {
            for (int s = 0; s <= target; s++) {
                // Don't include nums[i-1]
                dp[i][s] = dp[i-1][s];
                
                // Include nums[i-1]
                if (s >= nums[i-1]) {
                    dp[i][s] = dp[i][s] || dp[i-1][s - nums[i-1]];
                }
            }
        }
        
        return dp[n][target];
    }
};


int main() {
    vector<vector<int>> testCases = {
        {1, 5, 11, 5},      // true
        {1, 2, 3, 5},       // false (odd sum)
        {1, 2, 5},          // false
        {3, 3, 3, 4, 5},    // true
        {2, 2, 1, 1}        // true
    };
    
    PartitionEqualSubset solver;
    
    cout << "Partition Equal Subset Sum Results:" << endl;
    cout << "=====================================" << endl;
    
    for (auto& nums : testCases) {
        bool result = solver.canPartition(nums);
        int total = accumulate(nums.begin(), nums.end(), 0);
        
        cout << "Array: [";
        for (int i = 0; i < nums.size(); i++) {
            cout << nums[i];
            if (i < nums.size() - 1) cout << ", ";
        }
        cout << "]" << endl;
        
        cout << "Total: " << total;
        if (total % 2 == 0) {
            cout << ", Target: " << total / 2;
        } else {
            cout << " (odd - impossible)";
        }
        cout << endl;
        
        cout << "Result: " << (result ? "✓ Can Partition" : "✗ Cannot Partition") << endl;
        cout << "-------------------------------------" << endl;
    }
    
    return 0;
}
```

<!-- slide -->
```java
import java.util.Arrays;

/**
 * Partition Equal Subset Sum - Space Optimized DP
 * 
 * Time Complexity: O(n × sum)
 * Space Complexity: O(sum)
 */
public class PartitionEqualSubset {
    
    public boolean canPartition(int[] nums) {
        int total = Arrays.stream(nums).sum();
        
        // If sum is odd, cannot partition equally
        if (total % 2 != 0) {
            return false;
        }
        
        int target = total / 2;
        
        // dp[i] = true if sum i is achievable
        boolean[] dp = new boolean[target + 1];
        dp[0] = true;
        
        for (int num : nums) {
            // Iterate backwards to avoid using same element twice
            for (int s = target; s >= num; s--) {
                dp[s] = dp[s] || dp[s - num];
            }
            
            // Early exit
            if (dp[target]) {
                return true;
            }
        }
        
        return dp[target];
    }
    
    /**
     * 2D DP Implementation for educational purposes
     */
    public boolean canPartition2D(int[] nums) {
        int total = Arrays.stream(nums).sum();
        
        if (total % 2 != 0) {
            return false;
        }
        
        int target = total / 2;
        int n = nums.length;
        
        // dp[i][s] = true if sum s achievable with first i elements
        boolean[][] dp = new boolean[n + 1][target + 1];
        dp[0][0] = true;
        
        for (int i = 1; i <= n; i++) {
            for (int s = 0; s <= target; s++) {
                // Don't include nums[i-1]
                dp[i][s] = dp[i-1][s];
                
                // Include nums[i-1]
                if (s >= nums[i-1]) {
                    dp[i][s] = dp[i][s] || dp[i-1][s - nums[i-1]];
                }
            }
        }
        
        return dp[n][target];
    }
    
    /**
     * Set-based approach using HashSet
     * Good for sparse sum spaces
     */
    public boolean canPartitionSet(int[] nums) {
        int total = Arrays.stream(nums).sum();
        
        if (total % 2 != 0) {
            return false;
        }
        
        int target = total / 2;
        java.util.Set<Integer> reachable = new java.util.HashSet<>();
        reachable.add(0);
        
        for (int num : nums) {
            java.util.Set<Integer> newReachable = new java.util.HashSet<>();
            for (int s : reachable) {
                if (s + num <= target) {
                    newReachable.add(s + num);
                }
            }
            reachable.addAll(newReachable);
            
            if (reachable.contains(target)) {
                return true;
            }
        }
        
        return reachable.contains(target);
    }
    
    /**
     * Recursive approach with memoization
     */
    public boolean canPartitionMemo(int[] nums) {
        int total = Arrays.stream(nums).sum();
        
        if (total % 2 != 0) {
            return false;
        }
        
        int target = total / 2;
        Boolean[][] memo = new Boolean[nums.length][target + 1];
        
        return canPartitionHelper(nums, 0, target, memo);
    }
    
    private boolean canPartitionHelper(int[] nums, int index, int remaining, Boolean[][] memo) {
        if (remaining == 0) {
            return true;
        }
        if (index >= nums.length || remaining < 0) {
            return false;
        }
        if (memo[index][remaining] != null) {
            return memo[index][remaining];
        }
        
        // Include current or skip
        boolean include = canPartitionHelper(nums, index + 1, remaining - nums[index], memo);
        boolean exclude = canPartitionHelper(nums, index + 1, remaining, memo);
        
        memo[index][remaining] = include || exclude;
        return memo[index][remaining];
    }
    
    public static void main(String[] args) {
        int[][] testCases = {
            {1, 5, 11, 5},      // true
            {1, 2, 3, 5},       // false
            {1, 2, 5},          // false
            {3, 3, 3, 4, 5},    // true
            {2, 2, 1, 1}        // true
        };
        
        PartitionEqualSubset solver = new PartitionEqualSubset();
        
        System.out.println("Partition Equal Subset Sum Results:");
        System.out.println("=====================================");
        
        for (int[] nums : testCases) {
            boolean result = solver.canPartition(nums);
            int total = Arrays.stream(nums).sum();
            
            System.out.print("Array: [");
            for (int i = 0; i < nums.length; i++) {
                System.out.print(nums[i]);
                if (i < nums.length - 1) System.out.print(", ");
            }
            System.out.println("]");
            
            System.out.print("Total: " + total);
            if (total % 2 == 0) {
                System.out.println(", Target: " + total / 2);
            } else {
                System.out.println(" (odd - impossible)");
            }
            
            System.out.println("Result: " + (result ? "✓ Can Partition" : "✗ Cannot Partition"));
            System.out.println("-------------------------------------");
        }
    }
}
```

<!-- slide -->
```javascript
/**
 * Partition Equal Subset Sum - Space Optimized DP
 * 
 * Time Complexity: O(n × sum)
 * Space Complexity: O(sum)
 */
function canPartition(nums) {
    const total = nums.reduce((a, b) => a + b, 0);
    
    // If sum is odd, cannot partition equally
    if (total % 2 !== 0) {
        return false;
    }
    
    const target = total / 2;
    
    // dp[i] = true if sum i is achievable
    const dp = new Array(target + 1).fill(false);
    dp[0] = true;
    
    for (const num of nums) {
        // Iterate backwards to avoid using same element twice
        for (let s = target; s >= num; s--) {
            dp[s] = dp[s] || dp[s - num];
        }
        
        // Early exit
        if (dp[target]) {
            return true;
        }
    }
    
    return dp[target];
}

/**
 * Set-based approach
 * Good for sparse sum spaces
 */
function canPartitionSet(nums) {
    const total = nums.reduce((a, b) => a + b, 0);
    
    if (total % 2 !== 0) {
        return false;
    }
    
    const target = total / 2;
    let reachable = new Set([0]);
    
    for (const num of nums) {
        const newReachable = new Set();
        for (const s of reachable) {
            if (s + num <= target) {
                newReachable.add(s + num);
            }
        }
        reachable = new Set([...reachable, ...newReachable]);
        
        if (reachable.has(target)) {
            return true;
        }
    }
    
    return reachable.has(target);
}

/**
 * 2D DP Implementation for educational purposes
 */
function canPartition2D(nums) {
    const total = nums.reduce((a, b) => a + b, 0);
    
    if (total % 2 !== 0) {
        return false;
    }
    
    const target = total / 2;
    const n = nums.length;
    
    // dp[i][s] = true if sum s achievable with first i elements
    const dp = Array(n + 1).fill(null).map(() => Array(target + 1).fill(false));
    dp[0][0] = true;
    
    for (let i = 1; i <= n; i++) {
        for (let s = 0; s <= target; s++) {
            // Don't include nums[i-1]
            dp[i][s] = dp[i-1][s];
            
            // Include nums[i-1]
            if (s >= nums[i-1]) {
                dp[i][s] = dp[i][s] || dp[i-1][s - nums[i-1]];
            }
        }
    }
    
    return dp[n][target];
}

/**
 * Recursive approach with memoization
 */
function canPartitionMemo(nums) {
    const total = nums.reduce((a, b) => a + b, 0);
    
    if (total % 2 !== 0) {
        return false;
    }
    
    const target = total / 2;
    const memo = new Map();
    
    function helper(index, remaining) {
        if (remaining === 0) return true;
        if (index >= nums.length || remaining < 0) return false;
        
        const key = `${index},${remaining}`;
        if (memo.has(key)) return memo.get(key);
        
        const include = helper(index + 1, remaining - nums[index]);
        const exclude = helper(index + 1, remaining);
        const result = include || exclude;
        
        memo.set(key, result);
        return result;
    }
    
    return helper(0, target);
}

// Example usage and demonstration
const testCases = [
    [1, 5, 11, 5],      // true
    [1, 2, 3, 5],       // false
    [1, 2, 5],          // false
    [3, 3, 3, 4, 5],    // true
    [2, 2, 1, 1]        // true
];

console.log("Partition Equal Subset Sum Results:");
console.log("=====================================");

for (const nums of testCases) {
    const result = canPartition(nums);
    const total = nums.reduce((a, b) => a + b, 0);
    
    console.log(`Array: [${nums.join(', ')}]`);
    
    if (total % 2 === 0) {
        console.log(`Total: ${total}, Target: ${total / 2}`);
    } else {
        console.log(`Total: ${total} (odd - impossible)`);
    }
    
    console.log(`Result: ${result ? '✓ Can Partition' : '✗ Cannot Partition'}`);
    console.log("-------------------------------------");
}
```
````

---

## Time Complexity Analysis

| Operation | Time Complexity | Description |
|-----------|----------------|-------------|
| **Sum Calculation** | O(n) | Single pass to compute total sum |
| **DP Array Initialization** | O(sum) | Creating array of size target+1 |
| **Main DP Loop** | O(n × sum) | Outer loop over n elements, inner loop over sum |
| **Total** | **O(n × sum)** | Dominated by the nested loops |

### Detailed Breakdown

- **Best Case**: O(n) - if sum is odd, we return immediately after computing sum
- **Average Case**: O(n × sum) - typical scenario
- **Worst Case**: O(n × sum) - when we need to process all elements and all sum values

### Space-Optimized vs 2D DP

| Approach | Time | Space | Notes |
|----------|------|-------|-------|
| 2D DP | O(n × sum) | O(n × sum) | Easier to understand and debug |
| 1D DP | O(n × sum) | O(sum) | **Recommended** - same time, less space |
| Memoization | O(n × sum) | O(n × sum) | Good for sparse cases |

---

## Space Complexity Analysis

| Approach | Space Complexity | Components |
|----------|------------------|------------|
| **Space-Optimized (1D)** | **O(sum)** | Single boolean array of size target+1 |
| **2D DP** | O(n × sum) | 2D boolean array |
| **Memoization** | O(n × sum) | Recursion stack + memo table |
| **Set-based** | O(min(sum, 2ⁿ)) | Only stores reachable sums |

### Why Backwards Iteration Saves Space

By iterating backwards, we can use a single array instead of storing all n rows:
- `dp[s]` depends only on `dp[s]` (current state) and `dp[s-num]` (previous state)
- Backwards iteration ensures `dp[s-num]` hasn't been updated yet in this iteration
- This reduces space from O(n × sum) to O(sum)

---

## Common Variations

### 1. Count Number of Partitions

Instead of just checking if partition is possible, count how many ways:

````carousel
```python
def count_partitions(nums: List[int]) -> int:
    """
    Count number of ways to partition array into two equal-sum subsets.
    
    Time Complexity: O(n × sum)
    Space Complexity: O(sum)
    """
    total = sum(nums)
    
    if total % 2 != 0:
        return 0
    
    target = total // 2
    
    # dp[i] = number of ways to achieve sum i
    dp = [0] * (target + 1)
    dp[0] = 1  # One way to make sum 0 (empty subset)
    
    for num in nums:
        for s in range(target, num - 1, -1):
            dp[s] += dp[s - num]
    
    return dp[target]
```
````

### 2. Partition with Minimum Difference

When equal partition is impossible, find the minimum possible difference:

````carousel
```python
def min_partition_difference(nums: List[int]) -> int:
    """
    Find minimum difference between two subset sums.
    
    Time Complexity: O(n × sum)
    Space Complexity: O(sum)
    """
    total = sum(nums)
    target = total // 2
    
    # dp[s] = True if sum s is achievable
    dp = [False] * (target + 1)
    dp[0] = True
    
    for num in nums:
        for s in range(target, num - 1, -1):
            dp[s] = dp[s] or dp[s - num]
    
    # Find the largest achievable sum <= total/2
    for s in range(target, -1, -1):
        if dp[s]:
            # One subset sums to s, other sums to total - s
            return (total - s) - s
    
    return total  # Should never reach here
```
````

### 3. Partition into K Equal Sum Subsets

Generalization to k subsets instead of 2:

````carousel
```python
def can_partition_k_subsets(nums: List[int], k: int) -> bool:
    """
    Check if array can be partitioned into k subsets with equal sum.
    
    Time Complexity: O(k × 2^n) - exponential, uses backtracking with pruning
    Space Complexity: O(n) - recursion depth
    """
    total = sum(nums)
    
    if total % k != 0:
        return False
    
    target = total // k
    nums.sort(reverse=True)  # Sort descending for better pruning
    
    used = [False] * len(nums)
    
    def backtrack(start_index, current_sum, groups_formed):
        if groups_formed == k - 1:
            return True  # Last group automatically has correct sum
        
        if current_sum == target:
            return backtrack(0, 0, groups_formed + 1)
        
        for i in range(start_index, len(nums)):
            if used[i] or current_sum + nums[i] > target:
                continue
            
            used[i] = True
            if backtrack(i + 1, current_sum + nums[i], groups_formed):
                return True
            used[i] = False
            
            # Pruning: if current_sum is 0 and this fails, skip rest
            if current_sum == 0:
                break
        
        return False
    
    return backtrack(0, 0, 0)
```
````

### 4. Find Actual Partition (Not Just Boolean)

Return the actual subsets instead of just True/False:

````carousel
```python
def find_partition(nums: List[int]) -> Tuple[List[int], List[int]]:
    """
    Find the actual partition of array into two equal-sum subsets.
    Returns ([], []) if partition is impossible.
    
    Time Complexity: O(n × sum)
    Space Complexity: O(n × sum) for tracking choices
    """
    total = sum(nums)
    
    if total % 2 != 0:
        return [], []
    
    target = total // 2
    n = len(nums)
    
    # dp[i][s] = True if sum s achievable with first i elements
    dp = [[False] * (target + 1) for _ in range(n + 1)]
    dp[0][0] = True
    
    for i in range(1, n + 1):
        for s in range(target + 1):
            dp[i][s] = dp[i-1][s]  # Don't include
            if s >= nums[i-1] and dp[i-1][s - nums[i-1]]:
                dp[i][s] = True  # Include
    
    if not dp[n][target]:
        return [], []
    
    # Backtrack to find which elements were included
    subset1 = []
    subset2 = []
    s = target
    
    for i in range(n, 0, -1):
        if dp[i-1][s]:
            # nums[i-1] was not included
            subset2.append(nums[i-1])
        else:
            # nums[i-1] was included
            subset1.append(nums[i-1])
            s -= nums[i-1]
    
    return subset1, subset2
```
````

---

## Practice Problems

### Problem 1: Partition Equal Subset Sum

**Problem:** [LeetCode 416 - Partition Equal Subset Sum](https://leetcode.com/problems/partition-equal-subset-sum/)

**Description:** Given a non-empty array `nums` containing only positive integers, find if the array can be partitioned into two subsets such that the sum of elements in both subsets is equal.

**How to Apply:** Direct application of the space-optimized DP approach shown above.

---

### Problem 2: Target Sum

**Problem:** [LeetCode 494 - Target Sum](https://leetcode.com/problems/target-sum/)

**Description:** You are given an integer array `nums` and an integer `target`. You want to build an expression out of nums by adding one of the symbols '+' and '-' before each integer in nums and then concatenate all the integers.

**How to Apply:** Transform to subset sum problem: Find subset P such that `sum(P) - sum(nums-P) = target`. This simplifies to `2*sum(P) = target + sum(nums)`, so we need subset with sum = `(target + sum(nums)) / 2`.

---

### Problem 3: Last Stone Weight II

**Problem:** [LeetCode 1049 - Last Stone Weight II](https://leetcode.com/problems/last-stone-weight-ii/)

**Description:** You are given an array of integers `stones` where `stones[i]` is the weight of the i-th stone. We are playing a game with the stones. On each turn, we choose any two stones and smash them together.

**How to Apply:** This reduces to finding the minimum partition difference. We want to partition stones into two groups with sums as close as possible, then the difference is the remaining weight.

---

### Problem 4: Partition to K Equal Sum Subsets

**Problem:** [LeetCode 698 - Partition to K Equal Sum Subsets](https://leetcode.com/problems/partition-to-k-equal-sum-subsets/)

**Description:** Given an integer array `nums` and an integer `k`, return true if it is possible to divide this array into `k` non-empty subsets whose sums are all equal.

**How to Apply:** Use backtracking with pruning as shown in Variation 3. The DP approach becomes infeasible for k > 2 due to exponential state space.

---

### Problem 5: Ones and Zeroes

**Problem:** [LeetCode 474 - Ones and Zeroes](https://leetcode.com/problems/ones-and-zeroes/)

**Description:** You are given an array of binary strings `strs` and two integers `m` and `n`. Return the size of the largest subset of `strs` such that there are at most `m` 0's and `n` 1's in the subset.

**How to Apply:** This is a 2D variant of the subset sum / knapsack problem. Instead of one constraint (sum), we have two constraints (count of 0s and 1s).

---

## Video Tutorial Links

### Fundamentals

- [Partition Equal Subset Sum - Dynamic Programming (NeetCode)](https://www.youtube.com/watch?v=IsvocB5BJhw) - Comprehensive explanation with visualizations
- [0/1 Knapsack Problem (Aditya Verma)](https://www.youtube.com/watch?v=ntCGbPMeqgg) - Understanding the knapsack pattern that this problem follows
- [Subset Sum Problem (Take U Forward)](https://www.youtube.com/watch?v=34l1kTIQCIA) - Detailed walkthrough of subset sum DP

### Advanced Topics

- [Target Sum Problem (NeetCode)](https://www.youtube.com/watch?v=g0npyaQtAQM) - Extension that uses similar transformation technique
- [Last Stone Weight II (LeetCode Discuss)](https://www.youtube.com/watch?v=q-0wnOWDVPo) - Advanced variation with partition difference minimization
- [DP Patterns: Subset Sum (Back To Back SWE)](https://www.youtube.com/watch?v=s6FhG--P7z0) - Understanding DP patterns

### Practice and Problem Solving

- [Dynamic Programming Playlist (Aditya Verma)](https://www.youtube.com/playlist?list=PL_z_8CaSLPWekqhdCPmFohncHwz8TY2Go) - Complete DP playlist including knapsack variations
- [LeetCode 416 Walkthrough (Nick White)](https://www.youtube.com/watch?v=obhWqDfzwQQ) - Step-by-step solution walkthrough

---

## Follow-up Questions

### Q1: Can we use BFS or DFS instead of DP?

**Answer:** Yes, but it's less efficient:
- **BFS/DFS approach**: Explore all possible subsets (2ⁿ possibilities)
- **Time Complexity**: O(2ⁿ) - exponential
- **When to use**: Only for very small n (n ≤ 20) or when you need to enumerate all partitions
- **DP is preferred**: O(n × sum) is pseudo-polynomial and much faster for typical constraints

### Q2: What if the array contains negative numbers or zero?

**Answer:** 
- **Zero**: Doesn't affect the solution - can be placed in either subset
- **Negative numbers**: The problem changes significantly:
  - Target sum can be achieved in multiple ways
  - Need to track both positive and negative ranges in DP
  - DP array needs offset: `dp[s + offset]` where offset = sum of absolute values
  - Time complexity becomes O(n × total_range) where total_range includes negatives

### Q3: How does this relate to the Knapsack problem?

**Answer:** This IS the 0/1 Knapsack problem in disguise:
- **Knapsack**: Maximize value with weight constraint
- **Partition Equal Subset**: Find exact weight (sum/2) with boolean constraint
- **Transformation**:
  - Items = array elements
  - Item weight = element value
  - Item value = 1 (or any constant)
  - Knapsack capacity = target = sum/2
  - Goal: Fill knapsack exactly to capacity

### Q4: Can we optimize further if we know the array is sorted?

**Answer:** Sorting helps in some variations:
- **Early termination**: If `nums[i] > target`, skip it
- **Pruning in k-partition**: Sorting descending helps backtracking explore larger elements first
- **No asymptotic improvement**: DP complexity remains O(n × sum)
- **Practical improvement**: Can reduce constants and early exit in some cases

### Q5: What are the constraints where this solution becomes infeasible?

**Answer:** 
- **Large sum**: If sum > 10⁵ or 10⁶, O(n × sum) may be too slow
- **Large n with small sum**: DP is still efficient
- **Alternatives for large sums**:
  - **Meet-in-the-middle**: Split array, enumerate subsets of each half (O(2^(n/2)))
  - **Bitset optimization**: Faster in practice for C++ (bit parallelism)
  - **Greedy heuristics**: For approximate solutions

---

## Summary

The **Partition Equal Subset Sum** problem is a fundamental dynamic programming problem that demonstrates the power of transforming a complex partitioning problem into a simpler subset sum problem. Key takeaways:

- **Key Insight**: Partitioning into two equal sums ⇔ Finding one subset with sum = total/2
- **DP State**: `dp[s]` = whether sum `s` is achievable
- **Transition**: For each element, update achievable sums by including or excluding
- **Space Optimization**: Use 1D array with backwards iteration to achieve O(sum) space
- **Time Complexity**: O(n × sum) - pseudo-polynomial

When to use:
- ✅ Finding if array can be split into equal-sum groups
- ✅ Subset sum problems with specific target
- ✅ As building block for more complex partition problems
- ❌ When sum is extremely large (use meet-in-the-middle instead)
- ❌ When you need to partition into more than 2 subsets (use backtracking)

This problem is essential for understanding:
- 0/1 Knapsack pattern
- Space optimization in DP
- Problem transformation techniques

---

## Related Algorithms

- [0/1 Knapsack](./knapsack-01.md) - The parent pattern
- [Coin Change](./coin-change.md) - Unbounded knapsack variant
- [Combination Sum](./combination-sum.md) - Finding subsets that sum to target
- [Subset Sum](./subset-sum.md) - Generalized version
- [Minimum Subset Sum Difference](./minimum-subset-sum-difference.md) - Optimization variant
