# DP - Longest Increasing Subsequence (LIS)

## Problem Description

The Longest Increasing Subsequence (LIS) pattern finds the length of the longest subsequence of a sequence such that all elements of the subsequence are sorted in increasing order. This pattern is fundamental for sequence analysis, patience sorting, and related optimization problems.

### Key Characteristics

| Characteristic | Description |
|----------------|-------------|
| Time Complexity | O(n²) for DP, O(n log n) for optimized approach |
| Space Complexity | O(n) for both approaches |
| Input | Array of comparable elements |
| Output | Length of LIS or the actual subsequence |
| Approach | DP with patience sorting optimization |

### When to Use

- **LIS Problems**: Find longest increasing subsequence
- **Russian Doll Envelopes**: 2D LIS variation
- **Number of LIS**: Count all longest increasing subsequences
- **Box Stacking**: 3D variation of LIS
- **Patience Sorting**: Card game and related problems
- **Sequence Optimization**: Problems requiring ordered selection

## Intuition

The key insight is that dp[i] represents the length of the longest increasing subsequence ending at index i, and we can build this up from previous values.

The "aha!" moments:

1. **End-focused DP**: dp[i] = length of LIS ending at index i
2. **Compare all previous**: For each i, check all j < i where nums[j] < nums[i]
3. **Patience sorting**: Maintain piles where we can binary search
4. **Not necessarily contiguous**: Elements can skip over each other
5. **Reconstruction**: Track predecessors to rebuild the actual subsequence

## Solution Approaches

### Approach 1: Dynamic Programming (O(n²)) ✅ Recommended for understanding

Classic DP approach comparing each element with all previous elements.

#### Algorithm

1. Initialize dp array with 1 (each element is LIS of length 1)
2. For each i from 1 to n-1:
   - For each j from 0 to i-1:
     - If nums[j] < nums[i]: dp[i] = max(dp[i], dp[j] + 1)
3. Return max(dp)

#### Implementation

````carousel
```python
def length_of_lis(nums):
    """
    Find length of longest increasing subsequence.
    LeetCode 300 - Longest Increasing Subsequence
    
    Time: O(n²), Space: O(n)
    """
    if not nums:
        return 0
    
    n = len(nums)
    dp = [1] * n  # Each element is LIS of length 1 by itself
    
    for i in range(1, n):
        for j in range(i):
            if nums[j] < nums[i]:
                dp[i] = max(dp[i], dp[j] + 1)
    
    return max(dp)

def length_of_lis_with_path(nums):
    """Return LIS length and the actual subsequence."""
    if not nums:
        return 0, []
    
    n = len(nums)
    dp = [1] * n
    parent = [-1] * n  # Track predecessors
    
    for i in range(1, n):
        for j in range(i):
            if nums[j] < nums[i] and dp[j] + 1 > dp[i]:
                dp[i] = dp[j] + 1
                parent[i] = j
    
    # Find index of maximum LIS length
    max_len = max(dp)
    max_idx = dp.index(max_len)
    
    # Reconstruct the subsequence
    lis = []
    idx = max_idx
    while idx != -1:
        lis.append(nums[idx])
        idx = parent[idx]
    
    return max_len, lis[::-1]
```
<!-- slide -->
```cpp
#include <vector>
#include <algorithm>
using namespace std;

class Solution {
public:
    int lengthOfLIS(vector<int>& nums) {
        int n = nums.size();
        if (n == 0) return 0;
        
        vector<int> dp(n, 1);
        
        for (int i = 1; i < n; i++) {
            for (int j = 0; j < i; j++) {
                if (nums[j] < nums[i]) {
                    dp[i] = max(dp[i], dp[j] + 1);
                }
            }
        }
        
        return *max_element(dp.begin(), dp.end());
    }
};
```
<!-- slide -->
```java
class Solution {
    public int lengthOfLIS(int[] nums) {
        int n = nums.length;
        if (n == 0) return 0;
        
        int[] dp = new int[n];
        Arrays.fill(dp, 1);
        
        for (int i = 1; i < n; i++) {
            for (int j = 0; j < i; j++) {
                if (nums[j] < nums[i]) {
                    dp[i] = Math.max(dp[i], dp[j] + 1);
                }
            }
        }
        
        int maxLen = 0;
        for (int len : dp) maxLen = Math.max(maxLen, len);
        return maxLen;
    }
}
```
<!-- slide -->
```javascript
function lengthOfLIS(nums) {
    const n = nums.length;
    if (n === 0) return 0;
    
    const dp = new Array(n).fill(1);
    
    for (let i = 1; i < n; i++) {
        for (let j = 0; j < i; j++) {
            if (nums[j] < nums[i]) {
                dp[i] = Math.max(dp[i], dp[j] + 1);
            }
        }
    }
    
    return Math.max(...dp);
}
```
````

#### Time and Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(n²) |
| Space | O(n) |

### Approach 2: Patience Sorting with Binary Search (O(n log n))

Optimized approach using binary search to maintain the smallest tail of all increasing subsequences.

#### Implementation

````carousel
```python
import bisect

def length_of_lis_optimized(nums):
    """
    O(n log n) solution using patience sorting with binary search.
    LeetCode 300 - Longest Increasing Subsequence
    
    Time: O(n log n), Space: O(n)
    """
    if not nums:
        return 0
    
    # tails[i] = smallest tail of all increasing subsequences of length i+1
    tails = []
    
    for num in nums:
        # Find the first element in tails >= num
        idx = bisect.bisect_left(tails, num)
        
        if idx == len(tails):
            tails.append(num)  # Extend longest subsequence
        else:
            tails[idx] = num   # Replace to maintain smaller tail
    
    return len(tails)

# Manual binary search implementation
def length_of_lis_binary_search(nums):
    """Without using bisect library."""
    if not nums:
        return 0
    
    tails = []
    
    for num in nums:
        left, right = 0, len(tails)
        
        # Binary search for insertion point
        while left < right:
            mid = (left + right) // 2
            if tails[mid] < num:
                left = mid + 1
            else:
                right = mid
        
        if left == len(tails):
            tails.append(num)
        else:
            tails[left] = num
    
    return len(tails)
```
<!-- slide -->
```cpp
#include <vector>
#include <algorithm>
using namespace std;

class Solution {
public:
    int lengthOfLIS(vector<int>& nums) {
        vector<int> tails;
        
        for (int num : nums) {
            auto it = lower_bound(tails.begin(), tails.end(), num);
            
            if (it == tails.end()) {
                tails.push_back(num);
            } else {
                *it = num;
            }
        }
        
        return tails.size();
    }
};
```
<!-- slide -->
```java
class Solution {
    public int lengthOfLIS(int[] nums) {
        List<Integer> tails = new ArrayList<>();
        
        for (int num : nums) {
            int idx = binarySearch(tails, num);
            
            if (idx == tails.size()) {
                tails.add(num);
            } else {
                tails.set(idx, num);
            }
        }
        
        return tails.size();
    }
    
    private int binarySearch(List<Integer> tails, int target) {
        int left = 0, right = tails.size();
        
        while (left < right) {
            int mid = left + (right - left) / 2;
            if (tails.get(mid) < target) {
                left = mid + 1;
            } else {
                right = mid;
            }
        }
        
        return left;
    }
}
```
<!-- slide -->
```javascript
function lengthOfLIS(nums) {
    const tails = [];
    
    for (const num of nums) {
        let left = 0, right = tails.length;
        
        // Binary search
        while (left < right) {
            const mid = Math.floor((left + right) / 2);
            if (tails[mid] < num) {
                left = mid + 1;
            } else {
                right = mid;
            }
        }
        
        if (left === tails.length) {
            tails.push(num);
        } else {
            tails[left] = num;
        }
    }
    
    return tails.length;
}
```
````

#### Time and Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(n log n) |
| Space | O(n) |

### Approach 3: Number of Longest Increasing Subsequences

Count how many LIS exist in the array.

#### Implementation

````carousel
```python
def find_number_of_lis(nums):
    """
    Count number of longest increasing subsequences.
    LeetCode 673 - Number of Longest Increasing Subsequence
    
    Time: O(n²), Space: O(n)
    """
    n = len(nums)
    if n == 0:
        return 0
    
    # dp[i] = length of LIS ending at i
    # count[i] = number of LIS ending at i
    dp = [1] * n
    count = [1] * n
    
    for i in range(n):
        for j in range(i):
            if nums[j] < nums[i]:
                if dp[j] + 1 > dp[i]:
                    dp[i] = dp[j] + 1
                    count[i] = count[j]
                elif dp[j] + 1 == dp[i]:
                    count[i] += count[j]
    
    max_len = max(dp)
    result = 0
    for i in range(n):
        if dp[i] == max_len:
            result += count[i]
    
    return result
```
<!-- slide -->
```cpp
#include <vector>
#include <algorithm>
using namespace std;

class Solution {
public:
    int findNumberOfLIS(vector<int>& nums) {
        int n = nums.size();
        if (n == 0) return 0;
        
        vector<int> dp(n, 1), count(n, 1);
        
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < i; j++) {
                if (nums[j] < nums[i]) {
                    if (dp[j] + 1 > dp[i]) {
                        dp[i] = dp[j] + 1;
                        count[i] = count[j];
                    } else if (dp[j] + 1 == dp[i]) {
                        count[i] += count[j];
                    }
                }
            }
        }
        
        int maxLen = *max_element(dp.begin(), dp.end());
        int result = 0;
        for (int i = 0; i < n; i++) {
            if (dp[i] == maxLen) result += count[i];
        }
        
        return result;
    }
};
```
<!-- slide -->
```java
class Solution {
    public int findNumberOfLIS(int[] nums) {
        int n = nums.length;
        if (n == 0) return 0;
        
        int[] dp = new int[n];
        int[] count = new int[n];
        Arrays.fill(dp, 1);
        Arrays.fill(count, 1);
        
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < i; j++) {
                if (nums[j] < nums[i]) {
                    if (dp[j] + 1 > dp[i]) {
                        dp[i] = dp[j] + 1;
                        count[i] = count[j];
                    } else if (dp[j] + 1 == dp[i]) {
                        count[i] += count[j];
                    }
                }
            }
        }
        
        int maxLen = 0;
        for (int len : dp) maxLen = Math.max(maxLen, len);
        
        int result = 0;
        for (int i = 0; i < n; i++) {
            if (dp[i] == maxLen) result += count[i];
        }
        
        return result;
    }
}
```
<!-- slide -->
```javascript
function findNumberOfLIS(nums) {
    const n = nums.length;
    if (n === 0) return 0;
    
    const dp = new Array(n).fill(1);
    const count = new Array(n).fill(1);
    
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < i; j++) {
            if (nums[j] < nums[i]) {
                if (dp[j] + 1 > dp[i]) {
                    dp[i] = dp[j] + 1;
                    count[i] = count[j];
                } else if (dp[j] + 1 === dp[i]) {
                    count[i] += count[j];
                }
            }
        }
    }
    
    const maxLen = Math.max(...dp);
    let result = 0;
    for (let i = 0; i < n; i++) {
        if (dp[i] === maxLen) result += count[i];
    }
    
    return result;
}
```
````

#### Time and Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(n²) |
| Space | O(n) |

## Complexity Analysis

| Approach | Time | Space | When to Use |
|----------|------|-------|-------------|
| Standard DP | O(n²) | O(n) | Small n, need reconstruction |
| Binary Search | O(n log n) | O(n) | Large n, only need length |
| Count LIS | O(n²) | O(n) | Need count of all LIS |
| Segment Tree | O(n log n) | O(n) | Advanced optimizations |

## Related Problems

| Problem | LeetCode # | Difficulty | Description |
|---------|------------|------------|-------------|
| [Longest Increasing Subsequence](https://leetcode.com/problems/longest-increasing-subsequence/) | 300 | Medium | Classic LIS |
| [Number of Longest Increasing Subsequence](https://leetcode.com/problems/number-of-longest-increasing-subsequence/) | 673 | Medium | Count all LIS |
| [Russian Doll Envelopes](https://leetcode.com/problems/russian-doll-envelopes/) | 354 | Hard | 2D LIS variation |
| [Maximum Length of Pair Chain](https://leetcode.com/problems/maximum-length-of-pair-chain/) | 646 | Medium | LIS on pairs |
| [Best Team With No Conflicts](https://leetcode.com/problems/best-team-with-no-conflicts/) | 1626 | Medium | Sort then LIS |
| [Longest Continuous Increasing Subsequence](https://leetcode.com/problems/longest-continuous-increasing-subsequence/) | 674 | Easy | Contiguous version |
| [Largest Divisible Subset](https://leetcode.com/problems/largest-divisible-subset/) | 368 | Medium | Sort then LIS |

## Video Tutorial Links

1. **[NeetCode - Longest Increasing Subsequence](https://www.youtube.com/watch?v=cjWnW0hdF1Y)** - Both approaches explained
2. **[Back To Back SWE - LIS](https://www.youtube.com/watch?v=CE2b_-XfVDM)** - Detailed walkthrough
3. **[Kevin Naughton Jr. - LIS](https://www.youtube.com/watch?v=HsjTfhz9b-8)** - Binary search approach
4. **[Abdul Bari - LIS](https://www.youtube.com/watch?v=Ns4LCeeOFS4)** - Algorithm theory
5. **[Techdose - LIS Variations](https://www.youtube.com/watch?v=66w3xE68LMY)** - All variations covered

## Summary

### Key Takeaways

- **dp[i] meaning**: Length of LIS ending at index i
- **O(n²) approach**: Compare each element with all previous elements
- **O(n log n) approach**: Patience sorting with binary search
- **tails array**: Maintains smallest tail for each length
- **Non-contiguous**: Elements don't need to be adjacent
- **Reconstruction**: Track parent pointers to rebuild sequence

### Common Pitfalls

- **Confusing subsequence with substring**: Subsequence allows gaps
- **Strict vs non-decreasing**: Use <= for non-decreasing, < for strict
- **Binary search bounds**: Use lower_bound (>=) not upper_bound (>)
- **Not handling duplicates**: Count LIS requires careful duplicate handling
- **Forgetting edge cases**: Empty array, single element array
- **Wrong initialization**: All dp values should start at 1

### Follow-up Questions

1. **How would you find the actual LIS sequence?**
   - Track parent pointers during DP, then backtrack from max element

2. **Can you solve this for decreasing subsequence?**
   - Negate all numbers or reverse comparison operator

3. **What about longest bitonic subsequence?**
   - Compute LIS from left and LIS from right, combine at each point

4. **How to handle very large arrays (10^6 elements)?**
   - Must use O(n log n) approach; O(n²) will TLE

## Pattern Source

[Longest Increasing Subsequence Pattern](patterns/dp-longest-increasing-subsequence-lis.md)
