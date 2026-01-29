# Binary Search - On Answer / Condition Function

## Overview

Binary search on answer space, also known as **binary search on the result** or **condition-based binary search**, is a powerful algorithmic technique used when:

1. The problem requires finding an **optimal value** within a range
2. You can define a **condition function** that checks if a candidate value satisfies certain constraints
3. The condition is **monotonic** (if it holds for a value, it holds for all larger/smaller values)

Instead of searching for an element in an array, you search for the best answer by evaluating a feasibility condition. This pattern is commonly applied to problems like:
- Finding minimum time to complete tasks
- Finding maximum capacity for allocation
- Finding minimum/maximum threshold values
- Optimization problems with constraints

---

## Intuition

The key insight behind binary search on answer is the **monotonicity property**:

```
If a candidate answer X satisfies the condition, then any answer Y ≥ X (for minimization) 
or Y ≤ X (for maximization) will also satisfy the condition.
```

This creates a "boundary" between feasible and infeasible values:

```
[Feasible Values] | [Infeasible Values]
                  ↑
             Optimal Answer
```

**Example:** 
- If you can ship all packages within D days with a ship capacity of 1000, you can definitely do it with capacity 1500.
- But you cannot do it with capacity 500.

This monotonic relationship allows us to use binary search to find the boundary efficiently.

---

## Key Concepts

| Concept | Description |
|---------|-------------|
| **Answer Space** | The range of possible answers [low, high] that could be the solution |
| **Condition Function** | A helper function that takes a candidate answer and returns `True` if it satisfies the problem's requirements |
| **Monotonicity** | The condition must be monotonic; if it holds for a value, it should hold for all larger (or smaller) values |
| **Binary Search on Value** | Narrow down the possible answers by checking the condition at the midpoint |

---

## When to Use This Pattern

Use binary search on answer when:

- ✅ You need to find a **minimum** or **maximum** value that satisfies a condition
- ✅ You can **check feasibility** efficiently (O(n) or better)
- ✅ The feasibility condition is **monotonic**
- ✅ The search space is **large** (otherwise linear search might suffice)

**Don't use this pattern when:**
- ❌ The condition is **not monotonic**
- ❌ Checking feasibility is **very expensive**
- ❌ The problem requires finding **all solutions**, not just the optimal one

---

## Solution Approaches

### Approach 1: Classic Binary Search on Answer (Minimization)

The most common approach when finding the **minimum** feasible value.

#### Algorithm

1. **Define search bounds:**
   - `low` = minimum possible answer (often max element or 0)
   - `high` = maximum possible answer (often sum of elements or a large constant)

2. **Binary search loop:**
   ```
   while low < high:
       mid = low + (high - low) // 2
       if condition(mid) is True:
           high = mid  # mid works, try smaller
       else:
           low = mid + 1  # mid doesn't work, need larger
   ```

3. **Return `low`** (the smallest feasible value)

#### Code Templates

````carousel
```python
def binary_search_on_answer_min(nums, k):
    """
    Find the minimum feasible answer using binary search.
    
    Args:
        nums: Input array
        k: Parameter (number of subarrays, days, etc.)
    
    Returns:
        Minimum feasible answer
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

---

### Approach 2: Binary Search on Answer (Maximization)

Use this approach when finding the **maximum** feasible value.

#### Algorithm

1. **Define search bounds:**
   - `low` = minimum possible answer
   - `high` = maximum possible answer

2. **Binary search loop:**
   ```
   while low < high:
       mid = (low + high + 1) // 2  # Upper mid to avoid infinite loop
       if condition(mid) is True:
           low = mid  # mid works, try larger
       else:
           high = mid - 1  # mid doesn't work, need smaller
   ```

3. **Return `low`** (the largest feasible value)

#### Code Templates

````carousel
```python
def binary_search_on_answer_max(nums, k):
    """
    Find the maximum feasible answer using binary search.
    
    Args:
        nums: Input array
        k: Parameter
    
    Returns:
        Maximum feasible answer
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

```cpp
#include <vector>
#include <algorithm>
using namespace std;

class Solution {
private:
    bool condition(const vector<int>& nums, long long mid) {
        // Implementation depends on problem
        // Return True if mid is feasible
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

```java
import java.util.*;

class Solution {
    private boolean condition(int[] nums, long mid) {
        // Implementation depends on problem
        // Return True if mid is feasible
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

```javascript
/**
 * @param {number[]} nums
 * @return {number}
 */
var binarySearchOnAnswerMax = function(nums) {
    const condition = (mid) => {
        // Implementation depends on problem
        // Return True if mid is feasible
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

---

### Approach 3: Binary Search with Floating Point Precision

Use this approach when the answer needs **floating point precision**.

#### Algorithm

Same as Approach 1 or 2, but with:
- Floating point arithmetic
- Iterations based on precision required (e.g., 100 iterations or until `high - low < epsilon`)
- Different bound calculation

#### Code Template

````carousel
```python
def binary_search_floating_point(nums, k, precision=1e-6):
    """
    Find the minimum feasible answer with floating point precision.
    
    Args:
        nums: Input array
        k: Parameter
        precision: Required precision (default 1e-6)
    
    Returns:
        Minimum feasible answer with given precision
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

```java
import java.util.*;
import java.lang.Math;

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

```javascript
/**
 * @param {number[]} nums
 * @param {number} k
 * @ precision
 * @param {number}return {number}
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

---

### Approach 4: Binary Search with Count Validation

Some problems require not just feasibility but also **tracking counts** or **validating specific conditions**.

#### Code Template

````carousel
```python
def binary_search_with_count(nums, k):
    """
    Find minimum answer with count validation.
    Returns both the answer and the count at that answer.
    """
    def check(mid):
        """
        Returns tuple: (is_feasible, count)
        """
        count = 1
        current_sum = 0
        
        for num in nums:
            current_sum += num
            if current_sum > mid:
                count += 1
                current_sum = num
        
        return count <= k, count
    
    low = max(nums)
    high = sum(nums)
    
    while low < high:
        mid = (low + high) // 2
        feasible, count = check(mid)
        
        if feasible:
            high = mid
        else:
            low = mid + 1
    
    return low, check(low)[1]
```

```cpp
#include <vector>
#include <algorithm>
#include <tuple>
using namespace std;

class Solution {
private:
    pair<bool, int> check(const vector<int>& nums, int k, long long mid) {
        int count = 1;
        long long current_sum = 0;
        
        for (int num : nums) {
            current_sum += num;
            if (current_sum > mid) {
                count++;
                current_sum = num;
            }
        }
        
        return {count <= k, count};
    }
    
public:
    pair<int, int> binarySearchWithCount(vector<int>& nums, int k) {
        long long low = *max_element(nums.begin(), nums.end());
        long long high = 0;
        for (int num : nums) high += num;
        
        while (low < high) {
            long long mid = low + (high - low) / 2;
            auto [feasible, count] = check(nums, k, mid);
            
            if (feasible) {
                high = mid;
            } else {
                low = mid + 1;
            }
        }
        
        return {(int)low, check(nums, k, low).second};
    }
};
```

```java
import java.util.*;

class Solution {
    private static class Result {
        boolean feasible;
        int count;
        
        Result(boolean feasible, int count) {
            this.feasible = feasible;
            this.count = count;
        }
    }
    
    private Result check(int[] nums, int k, long mid) {
        int count = 1;
        long currentSum = 0;
        
        for (int num : nums) {
            currentSum += num;
            if (currentSum > mid) {
                count++;
                currentSum = num;
            }
        }
        
        return new Result(count <= k, count);
    }
    
    public int[] binarySearchWithCount(int[] nums, int k) {
        long low = Arrays.stream(nums).max().getAsInt();
        long high = Arrays.stream(nums).sum();
        
        while (low < high) {
            long mid = low + (high - low) / 2;
            Result result = check(nums, k, mid);
            
            if (result.feasible) {
                high = mid;
            } else {
                low = mid + 1;
            }
        }
        
        return new int[]{(int)low, check(nums, k, low).count};
    }
}
```

```javascript
/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number[]}
 */
var binarySearchWithCount = function(nums, k) {
    const check = (mid) => {
        let count = 1;
        let currentSum = 0;
        
        for (const num of nums) {
            currentSum += num;
            if (currentSum > mid) {
                count++;
                currentSum = num;
            }
        }
        
        return { feasible: count <= k, count };
    };
    
    const low = Math.max(...nums);
    const high = nums.reduce((a, b) => a + b, 0);
    
    while (low < high) {
        const mid = Math.floor((low + high) / 2);
        const result = check(mid);
        
        if (result.feasible) {
            high = mid;
        } else {
            low = mid + 1;
        }
    }
    
    return [low, check(low).count];
};
```
````

---

## Step-by-Step Example

### Problem: Split Array Largest Sum

Given an array `nums` and integer `k`, split the array into `k` subarrays to minimize the largest sum.

**Input:** `nums = [7,2,5,10,8]`, `k = 2`

**Expected Output:** `18`

### Execution Trace

| Iteration | low | high | mid | Can split with mid? | Action |
|-----------|-----|------|-----|---------------------|--------|
| 1 | 10 | 32 | 21 | ✅ Yes (2 subarrays) | high = 21 |
| 2 | 10 | 21 | 15 | ❌ No (3 subarrays) | low = 16 |
| 3 | 16 | 21 | 18 | ✅ Yes (2 subarrays) | high = 18 |
| 4 | 16 | 18 | 17 | ❌ No (3 subarrays) | low = 18 |
| **Result** | 18 | 18 | - | - | Return 18 |

### Detailed Step 3 (mid = 18)

```
Can we split with max sum = 18?

Current sum: 7 + 2 + 5 = 14 (≤ 18) ✓
Next element: 10 + 8 = 18 (≤ 18) ✓

Total subarrays: 2 ≤ k (2) ✓

Feasible!
```

---

## Time and Space Complexity

| Approach | Time Complexity | Space Complexity |
|----------|-----------------|------------------|
| Classic (Minimization) | O(n × log(S)) | O(1) |
| Classic (Maximization) | O(n × log(S)) | O(1) |
| Floating Point | O(n × log(S/precision)) | O(1) |
| With Count Validation | O(n × log(S)) | O(1) |

**Where:**
- `n` = size of input array
- `S` = range of possible answers (high - low)
- `precision` = required floating point precision

---

## Common Pitfalls

### 1. **Non-Monotonic Conditions**

❌ **Wrong:** If the condition function doesn't have a clear boundary between feasible and infeasible values.

✅ **Fix:** Ensure the condition is truly monotonic. Test with edge cases.

```python
# Example of non-monotonic (WRONG)
def condition_bad(mid):
    return mid % 2 == 0  # Not monotonic!

# Example of monotonic (CORRECT)
def condition_good(mid):
    return can_complete_in_time(mid)  # If works for 10, works for 15
```

### 2. **Boundary Issues**

❌ **Wrong:** Incorrectly setting low/high bounds or using wrong midpoint calculation.

✅ **Fix:** 
- For minimization: `low = max(nums)`, `high = sum(nums)`
- For maximization: `low = 0`, `high = max(nums)` or larger

```python
# Avoid integer overflow
mid = (low + high) // 2  # Correct
mid = (low + high) / 2   # Can cause issues with large integers

# Avoid infinite loop in maximization
mid = (low + high + 1) // 2  # Upper mid
```

### 3. **Off-by-One Errors**

❌ **Wrong:** Returning the wrong bound after binary search.

✅ **Fix:** Understand which bound represents the answer:
- For minimization: return `low` (smallest feasible)
- For maximization: return `low` (largest feasible)

### 4. **Condition Function Accuracy**

❌ **Wrong:** The condition function has bugs or doesn't accurately reflect constraints.

✅ **Fix:** 
- Thoroughly test the condition function independently
- Use assertions to verify expected behavior
- Consider edge cases (single element, all same values, etc.)

### 5. **Integer vs. Floating Point**

❌ **Wrong:** Using integer binary search for problems requiring precision.

✅ **Fix:** Use floating point binary search with precision threshold:
```python
while high - low > precision:
    mid = (low + high) / 2
    # ... rest of logic
```

---

## Related Problems

### LeetCode Problems

| Problem | Difficulty | Link | Pattern Application |
|---------|------------|------|---------------------|
| Split Array Largest Sum | Hard | [LeetCode 410](https://leetcode.com/problems/split-array-largest-sum/) | Minimize maximum subarray sum |
| Capacity to Ship Packages Within D Days | Medium | [LeetCode 1011](https://leetcode.com/problems/capacity-to-ship-packages-within-d-days/) | Find minimum ship capacity |
| Koko Eating Bananas | Medium | [LeetCode 875](https://leetcode.com/problems/koko-eating-bananas/) | Find minimum eating speed |
| Find the Smallest Divisor Given a Threshold | Medium | [LeetCode 1283](https://leetcode.com/problems/find-the-smallest-divisor-given-a-threshold/) | Find minimum divisor |
| Minimum Time to Complete Trips | Medium | [LeetCode 2187](https://leetcode.com/problems/minimum-time-to-complete-trips/) | Find minimum time per trip |
| Maximum Candies You Can Get | Hard | [LeetCode 2611](https://leetcode.com/problems/maximum-candies-you-can-get/) | Maximize minimum candies |
| Maximum Number of Tasks Assignable | Hard | [LeetCode 2742](https://leetcode.com/problems/maximum-number-of-tasks-assignable/) | Maximize assignable tasks |
| Minimum Total Distance Traveled | Hard | [LeetCode 2463](https://leetcode.com/problems/minimum-total-distance-traveled/) | Minimize total distance |

### GFG Problems

| Problem | Link | Pattern Application |
|---------|------|---------------------|
| Allocate minimum number of pages | [GFG](https://practice.geeksforgeeks.org/problems/allocate-minimum-number-of-pages0937/1) | Minimize maximum pages per student |
| Split the array into k subarrays | [GFG](https://www.geeksforgeeks.org/split-the-given-array-into-k-subarrays-such-that-sum-of-each-subarray-is-minimum/) | Minimize largest subarray sum |
| Painter's Partition Problem | [GFG](https://www.geeksforgeeks.org/painters-partition-problem/) | Minimize maximum partition time |

---

## Video Tutorial Links

### Binary Search on Answer Pattern

1. **[Binary Search on Answer - Pattern Explanation](https://www.youtube.com/watch?v=Si3PIaXE5uE)** by AlgoExpert
   - Comprehensive explanation of the pattern with examples

2. **[Split Array Largest Sum - Binary Search Solution](https://www.youtube.com/watch?v=hmV1s1q5k9I)** by Nick White
   - Step-by-step implementation in Python

3. **[LeetCode 410 - Split Array Largest Sum](https://www.youtube.com/watch?v=oah_ZBjuKtQ)** by Back to Back SWE
   - Detailed explanation with multiple approaches

### Specific Problem Solutions

4. **[Koko Eating Bananas](https://www.youtube.com/watch?v=QAU3tTNxNnw)** by NeetCode
   - Binary search approach for eating speed problem

5. **[Capacity to Ship Packages](https://www.youtube.com/watch?v=MerHYr7K2r4)** by take U forward
   - Binary search on answer for shipping problem

6. **[Find Smallest Divisor](https://www.youtube.com/watch?v=C70y20Dk2D0)** by LeetCode
   - Similar pattern with divisor problem

---

## Follow-up Questions

### 1. How would you modify the solution if subarrays must have a minimum length constraint?

**Answer:** Track the length of current subarray during the feasibility check. When starting a new subarray, ensure enough elements remain to satisfy the minimum length requirement.

```python
def can_split_with_min_length(nums, k, max_sum, min_len):
    count = 1
    current_sum = 0
    current_len = 0
    
    for i, num in enumerate(nums):
        remaining = len(nums) - i - 1
        remaining_elements = len(nums) - i - 1
        needed_elements = (count + 1) * min_len
        
        if remaining_elements < needed_elements - min_len:
            # Not enough elements left for remaining subarrays
            return False
            
        current_sum += num
        current_len += 1
        
        if current_sum > max_sum or (current_len >= min_len and i < len(nums) - 1):
            if count + 1 > k:
                return False
            count += 1
            current_sum = num
            current_len = 1
    
    return True
```

### 2. Can you implement this using a greedy approach instead of binary search?

**Answer:** A pure greedy approach cannot guarantee the optimal solution because local optimization doesn't lead to global optimization. Binary search on answer is necessary to find the minimum possible maximum sum. However, the feasibility check itself uses a greedy strategy.

### 3. How would you track the actual split points (not just the sum)?

**Answer:** Modify the feasibility check to return the split indices. When creating a new subarray, record the starting index. After binary search completes, run the feasibility check once more to capture and return the actual split positions.

```python
def get_splits(nums, max_sum):
    splits = [0]  # Start of each subarray
    current_sum = 0
    
    for i, num in enumerate(nums):
        current_sum += num
        if current_sum > max_sum:
            splits.append(i)  # Start new subarray at index i
            current_sum = num
    
    return splits
```

### 4. What if you need to minimize the sum of squares of subarray sums instead of the largest sum?

**Answer:** This becomes a different optimization problem. Binary search on answer won't work directly because the objective is not monotonic in the same way. Use dynamic programming instead:

```python
def min_sum_of_squares(nums, k):
    n = len(nums)
    prefix = [0] * (n + 1)
    for i in range(n):
        prefix[i + 1] = prefix[i] + nums[i]
    
    def get_sum(i, j):
        return prefix[j + 1] - prefix[i]
    
    dp = [[float('inf')] * (k + 1) for _ in range(n + 1)]
    dp[0][0] = 0
    
    for i in range(1, n + 1):
        for j in range(1, min(i, k) + 1):
            for p in range(j - 1, i):
                current_sum = get_sum(p, i - 1)
                dp[i][j] = min(dp[i][j], dp[p][j - 1] + current_sum * current_sum)
    
    return dp[n][k]
```

### 5. How would you handle this problem if the array could be split into at most k subarrays (not exactly k)?

**Answer:** The solution remains the same! The feasibility check uses `<= k`, so it naturally handles "at most k" subarrays. Using fewer subarrays produces smaller or equal maximum sums, which is acceptable.

### 6. Can you solve this problem using a priority queue/heap approach?

**Answer:** A heap-based approach can find a valid split but not necessarily the optimal one. Strategy: use a max-heap of subarray sums, repeatedly split the largest subarray until you have k subarrays. This is greedy and suboptimal but works for approximation.

```python
import heapq

def split_with_heap(nums, k):
    # Greedy heap-based approach (NOT optimal)
    # Split largest subarray each time
    # This is only an approximation, not guaranteed optimal
    pass  # Implementation omitted for brevity
```

### 7. What if you need to output all possible ways to achieve the minimized largest sum?

**Answer:** After finding the optimal value X, use backtracking/DFS to find all split combinations where each subarray sum ≤ X. Use pruning: if accumulating sum exceeds X, backtrack.

```python
def find_all_splits(nums, max_sum):
    results = []
    
    def backtrack(start, current_splits):
        if start == len(nums):
            results.append(current_splits.copy())
            return
        
        current_sum = 0
        for end in range(start, len(nums)):
            current_sum += nums[end]
            if current_sum > max_sum:
                break
            current_splits.append((start, end))
            backtrack(end + 1, current_splits)
            current_splits.pop()
    
    backtrack(0, [])
    return results
```

---

## Summary

Binary search on answer is a powerful pattern for optimization problems with monotonic conditions. Key takeaways:

1. **Identify monotonicity**: If condition(X) is true, then condition(Y) should be true for all Y ≥ X (minimization) or Y ≤ X (maximization).

2. **Define proper bounds**: Set `low` to the minimum feasible value and `high` to the maximum possible value.

3. **Implement accurate condition function**: The condition function must accurately reflect problem constraints.

4. **Choose correct midpoint**: Use upper mid for maximization to avoid infinite loops.

5. **Consider edge cases**: Test with single elements, all equal elements, and boundary values.

This pattern provides **O(log S)** time complexity where S is the search space, making it efficient for large ranges where linear search would be too slow.

---

## Template Quick Reference

### Minimization Template

```python
def solve(nums, k):
    def can(mid):
        count = 1
        current = 0
        for num in nums:
            current += num
            if current > mid:
                count += 1
                current = num
                if count > k:
                    return False
        return True
    
    low, high = max(nums), sum(nums)
    while low < high:
        mid = (low + high) // 2
        if can(mid):
            high = mid
        else:
            low = mid + 1
    return low
```

### Maximization Template

```python
def solve(nums, k):
    def can(mid):
        # Return True if mid is feasible
        pass
    
    low, high = 0, max(nums)
    while low < high:
        mid = (low + high + 1) // 2
        if can(mid):
            low = mid
        else:
            high = mid - 1
    return low
```
