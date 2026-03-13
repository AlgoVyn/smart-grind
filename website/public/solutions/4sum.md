# 4Sum

## Problem Description

Given an array `nums` of `n` integers, return an array of all the unique quadruplets `[nums[a], nums[b], nums[c], nums[d]]` such that:

- `0 <= a, b, c, d < n`
- `a, b, c, and d are distinct.`
- `nums[a] + nums[b] + nums[c] + nums[d] == target`

You may return the answer in any order.

**Note:** This is LeetCode Problem 18. You can find the original problem [here](https://leetcode.com/problems/4sum/).

---

## Examples

### Example

**Input:**
```python
nums = [1,0,-1,0,-2,2], target = 0
```

**Output:**
```python
[[-2,-1,1,2],[-2,0,0,2],[-1,0,0,1]]
```

**Explanation:**
All unique quadruplets that sum to 0 are:
- [-2, -1, 1, 2] = -2 + -1 + 1 + 2 = 0
- [-2, 0, 0, 2] = -2 + 0 + 0 + 2 = 0
- [-1, 0, 0, 1] = -1 + 0 + 0 + 1 = 0

### Example 2

**Input:**
```python
nums = [2,2,2,2,2], target = 8
```

**Output:**
```python
[[2,2,2,2]]
```

**Explanation:** Only one unique quadruplet [2,2,2,2] sums to 8.

---

## Constraints

- `1 <= nums.length <= 200`
- `-10^9 <= nums[i] <= 10^9`
- `-10^9 <= target <= 10^9`

---

## Pattern: Two Pointer with Sorting (kSum Generalization)

This problem is a classic example of the **Two Pointer** pattern extended from 2Sum and 3Sum. The key insight is to fix two elements and use two pointers to find the remaining pair.

### Core Concept

- **Sorting**: Enables two-pointer technique and duplicate skipping
- **Two-level nested loops**: Fix first two elements
- **Two-pointer search**: Find pairs for remaining two elements
- **Duplicate handling**: Skip duplicate values at each level
- **kSum generalization**: Can extend to any kSum

---

## Intuition

The key insight for this problem is extending the two-pointer technique from 3Sum to handle an additional dimension.

### Key Observations

1. **Sorting Enables Two Pointer**: After sorting, we can use two pointers to find pairs that sum to target efficiently

2. **Fix Two, Find Pair**: We fix two elements (i, j) and use two pointers to find the remaining two elements

3. **Duplicate Skipping**: To avoid duplicate quadruplets, we skip equal values at each loop level

4. **Early Termination**: We can skip iterations where minimum/maximum possible sums won't reach target

5. **Generalization**: This approach generalizes to any kSum with O(n^(k-1)) time

### Algorithm Overview

1. Sort the array
2. Fix first element (i), skip duplicates
3. Fix second element (j), skip duplicates  
4. Use two pointers (left, right) to find remaining pair
5. Adjust pointers based on comparison with target
6. Handle duplicates when match found

---

## Multiple Approaches with Code

We'll cover two approaches:

1. **Two Pointer (Optimal)** - Standard approach
2. **Hash Set Optimization** - Alternative O(n²) space approach

---

## Approach 1: Two Pointer (Optimal)

### Algorithm Steps

1. Sort the input array
2. For first element i from 0 to n-4:
   - Skip duplicates
   - For second element j from i+1 to n-3:
     - Skip duplicates
     - Set left = j + 1, right = n - 1
     - While left < right:
       - Calculate total = nums[i] + nums[j] + nums[left] + nums[right]
       - If total == target: add to result, skip duplicates, move both pointers
       - If total < target: move left right
       - If total > target: move right left

### Why It Works

The two pointer approach works because:
- Sorting enables efficient pair finding
- Fixing two elements reduces problem to 2Sum
- Two pointers search both directions to find matching pair
- Duplicate skipping ensures unique quadruplets

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def fourSum(self, nums: List[int], target: int) -> List[List[int]]:
        """
        Find all unique quadruplets that sum to target using two pointers.
        
        Args:
            nums: List of integers
            target: Target sum
            
        Returns:
            List of unique quadruplets
        """
        nums.sort()
        n = len(nums)
        result = []
        
        for i in range(n - 3):
            # Skip duplicates for first element
            if i > 0 and nums[i] == nums[i - 1]:
                continue
            
            # Early termination: minimum possible sum too large
            if nums[i] + nums[i + 1] + nums[i + 2] + nums[i + 3] > target:
                break
            # Early termination: maximum possible sum too small
            if nums[i] + nums[n - 3] + nums[n - 2] + nums[n - 1] < target:
                continue
            
            for j in range(i + 1, n - 2):
                # Skip duplicates for second element
                if j > i + 1 and nums[j] == nums[j - 1]:
                    continue
                
                # Early termination checks
                if nums[i] + nums[j] + nums[j + 1] + nums[j + 2] > target:
                    break
                if nums[i] + nums[j] + nums[n - 2] + nums[n - 1] < target:
                    continue
                
                left, right = j + 1, n - 1
                while left < right:
                    total = nums[i] + nums[j] + nums[left] + nums[right]
                    
                    if total == target:
                        result.append([nums[i], nums[j], nums[left], nums[right]])
                        
                        # Skip duplicates
                        while left < right and nums[left] == nums[left + 1]:
                            left += 1
                        while left < right and nums[right] == nums[right - 1]:
                            right -= 1
                        
                        left += 1
                        right -= 1
                    elif total < target:
                        left += 1
                    else:
                        right -= 1
        
        return result
```

<!-- slide -->
```cpp
#include <vector>
#include <algorithm>
using namespace std;

class Solution {
public:
    vector<vector<int>> fourSum(vector<int>& nums, long long target) {
        sort(nums.begin(), nums.end());
        int n = nums.size();
        vector<vector<int>> result;
        
        for (int i = 0; i < n - 3; i++) {
            // Skip duplicates for first element
            if (i > 0 && nums[i] == nums[i - 1]) continue;
            
            for (int j = i + 1; j < n - 2; j++) {
                // Skip duplicates for second element
                if (j > i + 1 && nums[j] == nums[j - 1]) continue;
                
                long long left = j + 1, right = n - 1;
                long long target2 = target - nums[i] - nums[j];
                
                while (left < right) {
                    long long sum = nums[left] + nums[right];
                    
                    if (sum == target2) {
                        result.push_back({nums[i], nums[j], nums[left], nums[right]});
                        
                        // Skip duplicates
                        while (left < right && nums[left] == nums[left + 1]) left++;
                        while (left < right && nums[right] == nums[right - 1]) right--;
                        
                        left++;
                        right--;
                    } else if (sum < target2) {
                        left++;
                    } else {
                        right--;
                    }
                }
            }
        }
        
        return result;
    }
};
```

<!-- slide -->
```java
import java.util.*;

class Solution {
    public List<List<Integer>> fourSum(int[] nums, long target) {
        Arrays.sort(nums);
        int n = nums.length;
        List<List<Integer>> result = new ArrayList<>();
        
        for (int i = 0; i < n - 3; i++) {
            // Skip duplicates for first element
            if (i > 0 && nums[i] == nums[i - 1]) continue;
            
            for (int j = i + 1; j < n - 2; j++) {
                // Skip duplicates for second element
                if (j > i + 1 && nums[j] == nums[j - 1]) continue;
                
                int left = j + 1, right = n - 1;
                long target2 = target - nums[i] - nums[j];
                
                while (left < right) {
                    int sum = nums[left] + nums[right];
                    
                    if (sum == target2) {
                        result.add(Arrays.asList(nums[i], nums[j], nums[left], nums[right]));
                        
                        // Skip duplicates
                        while (left < right && nums[left] == nums[left + 1]) left++;
                        while (left < right && nums[right] == nums[right - 1]) right--;
                        
                        left++;
                        right--;
                    } else if (sum < target2) {
                        left++;
                    } else {
                        right--;
                    }
                }
            }
        }
        
        return result;
    }
}
```

<!-- slide -->
```javascript
/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[][]}
 */
var fourSum = function(nums, target) {
    nums.sort((a, b) => a - b);
    const n = nums.length;
    const result = [];
    
    for (let i = 0; i < n - 3; i++) {
        // Skip duplicates for first element
        if (i > 0 && nums[i] === nums[i - 1]) continue;
        
        for (let j = i + 1; j < n - 2; j++) {
            // Skip duplicates for second element
            if (j > i + 1 && nums[j] === nums[j - 1]) continue;
            
            let left = j + 1, right = n - 1;
            const target2 = target - nums[i] - nums[j];
            
            while (left < right) {
                const sum = nums[left] + nums[right];
                
                if (sum === target2) {
                    result.push([nums[i], nums[j], nums[left], nums[right]]);
                    
                    // Skip duplicates
                    while (left < right && nums[left] === nums[left + 1]) left++;
                    while (left < right && nums[right] === nums[right - 1]) right--;
                    
                    left++;
                    right--;
                } else if (sum < target2) {
                    left++;
                } else {
                    right--;
                }
            }
        }
    }
    
    return result;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n³) - three nested loops with two pointers |
| **Space** | O(1) - excluding result list |

---

## Approach 2: Hash Set Optimization

### Algorithm Steps

1. Sort array
2. Pre-compute all pair sums and store in hash map
3. For each pair, look for complementary pairs
4. Use set to avoid duplicates

### Why It Works

The hash set approach works because:
- Reduces to O(n²) for pair finding
- Uses hash map for O(1) lookups
- Trades space for time

### Code Implementation

````carousel
```python
from typing import List
from collections import defaultdict

class Solution:
    def fourSum(self, nums: List[int], target: int) -> List[List[int]]:
        """Using hash set - O(n²) space."""
        nums.sort()
        n = len(nums)
        result = set()
        
        # Store all pair sums
        pair_sum = defaultdict(list)
        for i in range(n - 1):
            for j in range(i + 1, n):
                pair_sum[nums[i] + nums[j]].append((i, j))
        
        # Look for complementary pairs
        for i in range(n - 1):
            for j in range(i + 1, n):
                complement = target - nums[i] - nums[j]
                if complement in pair_sum:
                    for k, l in pair_sum[complement]:
                        if l > j:  # Ensure distinct indices
                            result.add((nums[i], nums[j], nums[k], nums[l]))
        
        return [list(quad) for quad in result]
```

<!-- slide -->
```cpp
#include <vector>
#include <unordered_map>
#include <set>
using namespace std;

class Solution {
public:
    vector<vector<int>> fourSum(vector<int>& nums, long long target) {
        sort(nums.begin(), nums.end());
        int n = nums.size();
        set<vector<int>> result;
        
        // Store all pair sums
        unordered_map<long long, vector<pair<int, int>>> pairSum;
        for (int i = 0; i < n - 1; i++) {
            for (int j = i + 1; j < n; j++) {
                pairSum[nums[i] + nums[j]].push_back({i, j});
            }
        }
        
        // Look for complementary pairs
        for (int i = 0; i < n - 1; i++) {
            for (int j = i + 1; j < n; j++) {
                long long complement = target - nums[i] - nums[j];
                if (pairSum.find(complement) != pairSum.end()) {
                    for (auto& [k, l] : pairSum[complement]) {
                        if (l > j) {
                            result.insert({nums[i], nums[j], nums[k], nums[l]});
                        }
                    }
                }
            }
        }
        
        return vector<vector<int>>(result.begin(), result.end());
    }
};
```

<!-- slide -->
```java
import java.util.*;

class Solution {
    public List<List<Integer>> fourSum(int[] nums, long target) {
        Arrays.sort(nums);
        int n = nums.length;
        Set<List<Integer>> result = new HashSet<>();
        
        // Store all pair sums
        Map<Long, List<int[]>> pairSum = new HashMap<>();
        for (int i = 0; i < n - 1; i++) {
            for (int j = i + 1; j < n; j++) {
                long sum = (long) nums[i] + nums[j];
                pairSum.computeIfAbsent(sum, k -> new ArrayList<>()).add(new int[]{i, j});
            }
        }
        
        // Look for complementary pairs
        for (int i = 0; i < n - 1; i++) {
            for (int j = i + 1; j < n; j++) {
                long complement = target - nums[i] - nums[j];
                if (pairSum.containsKey(complement)) {
                    for (int[] pair : pairSum.get(complement)) {
                        if (pair[1] > j) {
                            List<Integer> quad = Arrays.asList(nums[i], nums[j], nums[pair[0]], nums[pair[1]]);
                            result.add(quad);
                        }
                    }
                }
            }
        }
        
        return new ArrayList<>(result);
    }
}
```

<!-- slide -->
```javascript
/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[][]}
 */
var fourSum = function(nums, target) {
    nums.sort((a, b) => a - b);
    const n = nums.length;
    const result = new Set();
    
    // Store all pair sums
    const pairSum = new Map();
    for (let i = 0; i < n - 1; i++) {
        for (let j = i + 1; j < n; j++) {
            const sum = nums[i] + nums[j];
            if (!pairSum.has(sum)) {
                pairSum.set(sum, []);
            }
            pairSum.get(sum).push([i, j]);
        }
    }
    
    // Look for complementary pairs
    for (let i = 0; i < n - 1; i++) {
        for (let j = i + 1; j < n; j++) {
            const complement = target - nums[i] - nums[j];
            if (pairSum.has(complement)) {
                for (const [k, l] of pairSum.get(complement)) {
                    if (l > j) {
                        result.add([nums[i], nums[j], nums[k], nums[l]]);
                    }
                }
            }
        }
    }
    
    return Array.from(result).map(q => [...q]);
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n²) for building map + O(n²) for searching = O(n²) |
| **Space** | O(n²) for storing pair sums |

---

## Comparison of Approaches

| Aspect | Two Pointer | Hash Set |
|--------|-------------|----------|
| **Time Complexity** | O(n³) | O(n²) |
| **Space Complexity** | O(1) | O(n²) |
| **Implementation** | Simpler | More complex |
| **LeetCode Optimal** | ✅ (more common) | ❌ (more memory) |
| **Difficulty** | Medium | Hard |

**Best Approach:** Use Approach 1 (Two Pointer) for its simplicity and practical efficiency.

---

## Why This Problem is Important

### Interview Relevance

- **Frequency**: Commonly asked in technical interviews
- **Companies**: Google, Facebook, Amazon, Microsoft
- **Difficulty**: Medium
- **Concepts Tested**: Two Pointers, Sorting, kSum Generalization, Duplicate Handling

### Learning Outcomes

1. **Two Pointer Mastery**: Extend 2Sum/3Sum solution to 4Sum
2. **kSum Generalization**: Learn recursive pattern for any kSum
3. **Duplicate Handling**: Properly skip duplicate values
4. **Optimization**: Early termination and pruning techniques

---

## Related Problems

Based on similar themes (two pointer, kSum):

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| 2Sum | [Link](https://leetcode.com/problems/two-sum/) | Find pair with target sum |
| 3Sum | [Link](https://leetcode.com/problems/3sum/) | Find all unique triplets |
| 3Sum Closest | [Link](https://leetcode.com/problems/3sum-closest/) | Find triplet closest to target |
| 4Sum II | [Link](https://leetcode.com/problems/4sum-ii/) | Four arrays sum to zero |

### Pattern Reference

For more detailed explanations of the Two Pointer pattern, see:
- **[Two Pointer Pattern](/patterns/two-pointer)**

---

## Video Tutorial Links

Here are helpful YouTube tutorials:

### Recommended Tutorials

1. **[NeetCode - 4Sum](https://www.youtube.com/watch?v=1Sq5c1h25-Q)** - Clear explanation
2. **[4Sum - LeetCode 18](https://www.youtube.com/watch?v=9p2w9X0i8yQ)** - Detailed walkthrough
3. **[Two Pointer Technique](https://www.youtube.com/watch?v=aS_eyezmjmq4)** - Two pointers explained

---

## Follow-up Questions

### Q1: How would you generalize this to kSum?

**Answer:** Use recursion to handle k-2 elements, then use two-pointer for the last two. Time complexity would be O(n^(k-1)).

### Q2: How can you optimize to O(n²) using a hash set?

**Answer:** Pre-compute all pair sums and store in a hash map, then look for complement pairs. However, this uses O(n²) space.

### Q3: How would you handle large arrays more efficiently?

**Answer:** Use early termination when minimum possible sum exceeds target, or maximum possible sum is less than target. Also skip duplicate values at each level.

### Q4: What if you need to return indices instead of values?

**Answer:** Store original indices before sorting, or use a different approach with hash maps that preserves index information.

---

## Common Pitfalls

### 1. Missing Duplicate Handling
**Issue:** Not skipping duplicate values, resulting in duplicate quadruplets.

**Solution:** Check at each loop level: `if i > 0 and nums[i] == nums[i - 1]: continue`

### 2. Incorrect Loop Bounds
**Issue:** Using wrong range boundaries causing index out of bounds.

**Solution:** First loop: `range(n - 3)`, second loop: `range(i + 1, n - 2)`

### 3. Not Handling Integer Overflow
**Issue:** Adding large integers can cause overflow in some languages.

**Solution:** Use long integers in Python/Java, or use early termination checks.

### 4. Incorrect Two-Pointer Movement
**Issue:** Not moving both pointers after finding a match, causing infinite loops.

**Solution:** Always move both pointers after processing a valid quadruplet.

### 5. Not Using Early Termination
**Issue:** Running unnecessary iterations for large/small targets.

**Solution:** Check if minimum/maximum possible sums can reach target before continuing loops.

---

## Summary

The **4Sum** problem demonstrates the **Two Pointer with Sorting** pattern:

- **Sorting first**: Enables two-pointer approach and duplicate skipping
- **Two-level nested loops**: Fix first two elements
- **Two-pointer search**: Find pairs for remaining two elements
- **Duplicate handling**: Skip duplicate values at each level
- **Time complexity**: O(n³) - optimal for this problem

Key takeaways:
1. Extend 3Sum solution to handle additional dimension
2. Skip duplicates at each loop level
3. Use early termination for optimization
4. Can generalize to any kSum problem

This pattern extends to:
- 2Sum, 3Sum problems
- Any kSum generalization
- Finding combinations with target sum

---

## Additional Resources

- [LeetCode Problem 18](https://leetcode.com/problems/4sum/) - Official problem page
- [Two Pointers - GeeksforGeeks](https://www.geeksforgeeks.org/two-pointer-technique/) - Detailed explanation
- [kSum Generalization](https://www.geeksforgeeks.org/combinational-sum/) - kSum concepts
- [Pattern: Two Pointer](/patterns/two-pointer) - Comprehensive pattern guide
