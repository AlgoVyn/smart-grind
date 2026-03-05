# Binary Search - On Answer / Condition Function

## Problem Description

The Binary Search on Answer pattern is used to find an optimal value within a range when you can define a **condition function** that checks if a candidate value satisfies certain constraints. This technique is powerful for optimization problems where the condition is **monotonic**.

This pattern is commonly applied to problems like:
- Finding minimum time to complete tasks
- Finding maximum capacity for allocation
- Finding minimum/maximum threshold values
- Optimization problems with constraints

### Key Characteristics

| Characteristic | Description |
|----------------|-------------|
| Time Complexity | O(n × log(S)) where S is the search space range |
| Space Complexity | O(1) - Constant extra space |
| Input | Array/problem data and constraint parameters |
| Output | Optimal value satisfying the condition |
| Approach | Binary search on answer space with feasibility check |

### When to Use

- Finding a **minimum** or **maximum** value that satisfies a condition
- You can **check feasibility** efficiently (O(n) or better)
- The feasibility condition is **monotonic**
- The search space is **large** (otherwise linear search might suffice)

**Don't use when:**
- The condition is **not monotonic**
- Checking feasibility is **very expensive**
- The problem requires finding **all solutions**, not just the optimal one

## Intuition

The key insight behind binary search on answer is the **monotonicity property**:

If a candidate answer X satisfies the condition, then any answer Y ≥ X (for minimization) or Y ≤ X (for maximization) will also satisfy the condition.

The "aha!" moments:
1. **Monotonicity is key**: If condition holds for X, it holds for all larger/smaller values
2. **Boundary exists**: There's a clear boundary between feasible and infeasible values
3. **Condition function**: Encapsulate feasibility check in a helper function
4. **Search space bounds**: Define proper low and high bounds for binary search
5. **Min vs Max**: Use different midpoint calculations for minimization vs maximization

## Solution Approaches

### Approach 1: Binary Search on Answer (Minimization) ✅ Recommended

#### Algorithm
1. **Define search bounds:**
   - `low` = minimum possible answer (often max element or 0)
   - `high` = maximum possible answer (often sum of elements)

2. **Binary search loop:**
   - While `low < high`:
     - `mid = (low + high) // 2`
     - If `condition(mid)` is True: `high = mid` (try smaller)
     - Else: `low = mid + 1` (need larger)

3. **Return `low`** (the smallest feasible value)

#### Implementation

````carousel
```python
def binary_search_on_answer_min(nums, k):
    """
    Find the minimum feasible answer using binary search.
    Example: Split Array Largest Sum (LeetCode 410)
    
    Time: O(n * log(S)), Space: O(1)
    """
    def condition(mid):
        """Check if mid is a feasible answer"""
        count = 1
        current_sum = 0
        
        for num in nums:
            current_sum += num
            if current_sum > mid:
                count += 1
                current_sum = num
                if count > k:
                    return False
        
        return True
    
    # Define search bounds
    low = max(nums)  # Minimum possible answer
    high = sum(nums)  # Maximum possible answer
    
    # Binary search
    while low < high:
        mid = (low + high) // 2
        if condition(mid):
            high = mid
        else:
            low = mid + 1
    
    return low
```
<!-- slide -->
```cpp
#include <vector>
#include <algorithm>
using namespace std;

class Solution {
private:
    bool condition(const vector<int>& nums, int k, long long mid) {
        int count = 1;
        long long current_sum = 0;
        
        for (int num : nums) {
            current_sum += num;
            if (current_sum > mid) {
                count++;
                current_sum = num;
                if (count > k) return false;
            }
        }
        return true;
    }
    
public:
    int binarySearchOnAnswer(vector<int>& nums, int k) {
        long long low = *max_element(nums.begin(), nums.end());
        long long high = 0;
        for (int num : nums) high += num;
        
        while (low < high) {
            long long mid = low + (high - low) / 2;
            if (condition(nums, k, mid)) {
                high = mid;
            } else {
                low = mid + 1;
            }
        }
        
        return (int)low;
    }
};
```
<!-- slide -->
```java
import java.util.*;

class Solution {
    private boolean condition(int[] nums, int k, long mid) {
        int count = 1;
        long currentSum = 0;
        
        for (int num : nums) {
            currentSum += num;
            if (currentSum > mid) {
                count++;
                currentSum = num;
                if (count > k) return false;
            }
        }
        return true;
    }
    
    public int binarySearchOnAnswer(int[] nums, int k) {
        long low = Arrays.stream(nums).max().getAsInt();
        long high = Arrays.stream(nums).sum();
        
        while (low < high) {
            long mid = low + (high - low) / 2;
            if (condition(nums, k, mid)) {
                high = mid;
            } else {
                low = mid + 1;
            }
        }
        
        return (int)low;
    }
}
```
<!-- slide -->
```javascript
/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number}
 */
var binarySearchOnAnswer = function(nums, k) {
    const condition = (mid) => {
        let count = 1;
        let currentSum = 0;
        
        for (const num of nums) {
            currentSum += num;
            if (currentSum > mid) {
                count++;
                currentSum = num;
                if (count > k) return false;
            }
        }
        return true;
    };
    
    const low = Math.max(...nums);
    const high = nums.reduce((a, b) => a + b, 0);
    
    while (low < high) {
        const mid = Math.floor((low + high) / 2);
        if (condition(mid)) {
            high = mid;
        } else {
            low = mid + 1;
        }
    }
    
    return low;
};
```
````

#### Time and Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(n × log(S)) where S is the search space range |
| Space | O(1) - Constant extra space |

### Approach 2: Binary Search on Answer (Maximization)

#### Algorithm
1. **Define search bounds:**
   - `low` = minimum possible answer
   - `high` = maximum possible answer

2. **Binary search loop:**
   - While `low < high`:
     - `mid = (low + high + 1) // 2` (upper mid to avoid infinite loop)
     - If `condition(mid)` is True: `low = mid` (try larger)
     - Else: `high = mid - 1` (need smaller)

3. **Return `low`** (the largest feasible value)

#### Implementation

````carousel
```python
def binary_search_on_answer_max(nums, k):
    """
    Find the maximum feasible answer using binary search.
    
    Time: O(n * log(S)), Space: O(1)
    """
    def condition(mid):
        """Check if mid is a feasible answer"""
        # Implementation depends on problem
        # Return True if mid is feasible
        pass
    
    # Define search bounds
    low = 0  # Minimum possible answer
    high = max(nums)  # Maximum possible answer
    
    # Binary search
    while low < high:
        mid = (low + high + 1) // 2  # Upper mid
        if condition(mid):
            low = mid
        else:
            high = mid - 1
    
    return low
```
<!-- slide -->
```cpp
#include <vector>
#include <algorithm>
using namespace std;

class Solution {
private:
    bool condition(const vector<int>& nums, long long mid) {
        // Implementation depends on problem
        return true;
    }
    
public:
    int binarySearchOnAnswerMax(vector<int>& nums) {
        long long low = 0;
        long long high = *max_element(nums.begin(), nums.end());
        
        while (low < high) {
            long long mid = low + (high - low + 1) / 2;  // Upper mid
            if (condition(nums, mid)) {
                low = mid;
            } else {
                high = mid - 1;
            }
        }
        
        return (int)low;
    }
};
```
<!-- slide -->
```java
import java.util.*;

class Solution {
    private boolean condition(int[] nums, long mid) {
        // Implementation depends on problem
        return true;
    }
    
    public int binarySearchOnAnswerMax(int[] nums) {
        long low = 0;
        long high = Arrays.stream(nums).max().getAsInt();
        
        while (low < high) {
            long mid = low + (high - low + 1) / 2;  // Upper mid
            if (condition(nums, mid)) {
                low = mid;
            } else {
                high = mid - 1;
            }
        }
        
        return (int)low;
    }
}
```
<!-- slide -->
```javascript
/**
 * @param {number[]} nums
 * @return {number}
 */
var binarySearchOnAnswerMax = function(nums) {
    const condition = (mid) => {
        // Implementation depends on problem
        return true;
    };
    
    let low = 0;
    const high = Math.max(...nums);
    
    while (low < high) {
        const mid = Math.floor((low + high + 1) / 2);  // Upper mid
        if (condition(mid)) {
            low = mid;
        } else {
            high = mid - 1;
        }
    }
    
    return low;
};
```
````

#### Time and Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(n × log(S)) where S is the search space range |
| Space | O(1) - Constant extra space |

### Approach 3: Binary Search with Floating Point Precision

#### Algorithm
1. Define search bounds with floating point values
2. Binary search until `high - low < epsilon` (required precision)
3. Return `high` or `low` (they're very close)

#### Implementation

````carousel
```python
def binary_search_floating_point(nums, k, precision=1e-6):
    """
    Find the minimum feasible answer with floating point precision.
    
    Time: O(n * log(S/precision)), Space: O(1)
    """
    def condition(mid):
        """Check if mid is a feasible answer"""
        count = 1
        current_sum = 0.0
        
        for num in nums:
            current_sum += num
            if current_sum > mid:
                count += 1
                current_sum = num
                if count > k:
                    return False
        
        return True
    
    # Define search bounds
    low = max(nums)  # Minimum possible answer
    high = sum(nums)  # Maximum possible answer
    
    # Binary search with precision
    while high - low > precision:
        mid = (low + high) / 2
        if condition(mid):
            high = mid
        else:
            low = mid
    
    return high  # or low, they're very close
```
<!-- slide -->
```cpp
#include <vector>
#include <algorithm>
#include <cmath>
using namespace std;

class Solution {
private:
    bool condition(const vector<int>& nums, int k, double mid) {
        int count = 1;
        double current_sum = 0;
        
        for (int num : nums) {
            current_sum += num;
            if (current_sum > mid) {
                count++;
                current_sum = num;
                if (count > k) return false;
            }
        }
        return true;
    }
    
public:
    double binarySearchFloatingPoint(vector<int>& nums, int k, double precision=1e-6) {
        double low = *max_element(nums.begin(), nums.end());
        double high = 0;
        for (int num : nums) high += num;
        
        while (high - low > precision) {
            double mid = (low + high) / 2;
            if (condition(nums, k, mid)) {
                high = mid;
            } else {
                low = mid;
            }
        }
        
        return high;
    }
};
```
<!-- slide -->
```java
import java.util.*;

class Solution {
    private boolean condition(int[] nums, int k, double mid) {
        int count = 1;
        double currentSum = 0;
        
        for (int num : nums) {
            currentSum += num;
            if (currentSum > mid) {
                count++;
                currentSum = num;
                if (count > k) return false;
            }
        }
        return true;
    }
    
    public double binarySearchFloatingPoint(int[] nums, int k, double precision) {
        double low = Arrays.stream(nums).max().getAsInt();
        double high = Arrays.stream(nums).sum();
        
        while (high - low > precision) {
            double mid = (low + high) / 2;
            if (condition(nums, k, mid)) {
                high = mid;
            } else {
                low = mid;
            }
        }
        
        return high;
    }
}
```
<!-- slide -->
```javascript
/**
 * @param {number[]} nums
 * @param {number} k
 * @param {number} precision
 * @return {number}
 */
var binarySearchFloatingPoint = function(nums, k, precision = 1e-6) {
    const condition = (mid) => {
        let count = 1;
        let currentSum = 0;
        
        for (const num of nums) {
            currentSum += num;
            if (currentSum > mid) {
                count++;
                currentSum = num;
                if (count > k) return false;
            }
        }
        return true;
    };
    
    const low = Math.max(...nums);
    const high = nums.reduce((a, b) => a + b, 0);
    
    while (high - low > precision) {
        const mid = (low + high) / 2;
        if (condition(mid)) {
            high = mid;
        } else {
            low = mid;
        }
    }
    
    return high;
};
```
````

#### Time and Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(n × log(S/precision)) - Depends on required precision |
| Space | O(1) - Constant extra space |

## Complexity Analysis

| Approach | Time | Space | Notes |
|----------|------|-------|-------|
| Minimization | O(n × log(S)) | O(1) | For finding minimum feasible value |
| Maximization | O(n × log(S)) | O(1) | For finding maximum feasible value |
| Floating Point | O(n × log(S/precision)) | O(1) | For precision-based answers |

**Where:**
- `n` = size of input array
- `S` = range of possible answers (high - low)
- `precision` = required floating point precision

## Related Problems

| Problem | LeetCode # | Difficulty | Description |
|---------|------------|------------|-------------|
| [Split Array Largest Sum](https://leetcode.com/problems/split-array-largest-sum/) | 410 | Hard | Minimize maximum subarray sum |
| [Capacity to Ship Packages Within D Days](https://leetcode.com/problems/capacity-to-ship-packages-within-d-days/) | 1011 | Medium | Find minimum ship capacity |
| [Koko Eating Bananas](https://leetcode.com/problems/koko-eating-bananas/) | 875 | Medium | Find minimum eating speed |
| [Find the Smallest Divisor Given a Threshold](https://leetcode.com/problems/find-the-smallest-divisor-given-a-threshold/) | 1283 | Medium | Find minimum divisor |
| [Minimum Time to Complete Trips](https://leetcode.com/problems/minimum-time-to-complete-trips/) | 2187 | Medium | Find minimum time per trip |
| [Maximum Candies You Can Get](https://leetcode.com/problems/maximum-candies-you-can-get/) | 2611 | Hard | Maximize minimum candies |
| [Magnetic Force Between Two Balls](https://leetcode.com/problems/magnetic-force-between-two-balls/) | 1552 | Medium | Maximize minimum magnetic force |
| [Aggressive Cows](https://www.spoj.com/problems/AGGRCOW/) | - | Medium | Classic binary search on answer |

## Video Tutorial Links

1. **[Binary Search on Answer - Pattern Explanation](https://www.youtube.com/watch?v=Si3PIaXE5uE)** - AlgoExpert
2. **[Split Array Largest Sum - Binary Search Solution](https://www.youtube.com/watch?v=hmV1s1q5k9I)** - Nick White
3. **[LeetCode 410 - Split Array Largest Sum](https://www.youtube.com/watch?v=oah_ZBjuKtQ)** - Back to Back SWE
4. **[Koko Eating Bananas](https://www.youtube.com/watch?v=QAU3tTNxNnw)** - NeetCode
5. **[Capacity to Ship Packages](https://www.youtube.com/watch?v=MerHYr7K2r4)** - take U forward

## Summary

### Key Takeaways
- **Identify monotonicity**: If condition(X) is true, condition(Y) should be true for all Y ≥ X (minimization) or Y ≤ X (maximization)
- **Define proper bounds**: Set `low` to the minimum feasible value and `high` to the maximum possible value
- **Implement accurate condition function**: The condition function must accurately reflect problem constraints
- **Choose correct midpoint**: Use upper mid `(low + high + 1) // 2` for maximization to avoid infinite loops
- **Return correct bound**: For minimization, `low` is the smallest feasible; for maximization, `low` is the largest feasible

### Common Pitfalls
- **Non-monotonic conditions**: Ensure the condition has a clear boundary between feasible and infeasible
- **Boundary issues**: Incorrectly setting low/high bounds or using wrong midpoint calculation
- **Off-by-one errors**: Returning the wrong bound after binary search
- **Condition function accuracy**: Thoroughly test the condition function independently
- **Integer overflow**: Use `mid = low + (high - low) // 2` to prevent overflow

### Follow-up Questions
1. **How would you modify the solution if subarrays must have a minimum length constraint?**
   - Answer: Track subarray length during feasibility check and ensure enough elements remain

2. **Can you implement this using a greedy approach instead of binary search?**
   - Answer: Pure greedy cannot guarantee optimal; the feasibility check itself uses greedy strategy

3. **How would you track the actual split points (not just the sum)?**
   - Answer: Modify feasibility check to return split indices, run once more after binary search

4. **What if you need to minimize the sum of squares of subarray sums?**
   - Answer: This becomes a different problem; use dynamic programming instead

5. **How would you handle this problem if the array could be split into at most k subarrays?**
   - Answer: Use `<= k` in feasibility check, naturally handles "at most k"

## Pattern Source

[Binary Search on Answer Pattern](patterns/binary-search-on-answer-condition-function.md)
