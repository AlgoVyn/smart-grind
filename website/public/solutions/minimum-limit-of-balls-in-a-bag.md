# Minimum Limit of Balls in a Bag

## Problem Description

You are given an integer array `nums` where the i-th bag contains `nums[i]` balls. You are also given an integer `maxOperations`.

You can perform the following operation at most `maxOperations` times:

> Take any bag of balls and divide it into two new bags with a positive number of balls.

For example, a bag of 5 balls can become two new bags of 1 and 4 balls, or two new bags of 2 and 3 balls.

Your penalty is the maximum number of balls in a bag. You want to minimize your penalty after the operations. Return the minimum possible penalty after performing the operations.

**Link to problem:** [Minimum Limit of Balls in a Bag - LeetCode 1760](https://leetcode.com/problems/minimum-limit-of-balls-in-a-bag/)

## Constraints
- `1 <= nums.length <= 10^5`
- `1 <= maxOperations, nums[i] <= 10^9`

---

## Pattern: Binary Search on Answer

This problem is a classic example of the **Binary Search on Answer** pattern. The pattern involves finding the minimum feasible value using binary search.

### Core Concept

- **Binary Search**: Search for the minimum penalty
- **Feasibility Check**: Determine if we can achieve a given penalty with maxOperations
- **Monotonic Property**: If we can achieve penalty P, we can achieve any larger penalty

---

## Examples

### Example

**Input:** nums = [9], maxOperations = 2

**Output:** 3

**Explanation:**
- Divide bag with 9 balls into [6, 3]
- Divide bag with 6 balls into [3, 3]
- Maximum bag size = 3

### Example 2

**Input:** nums = [2, 4, 8, 2], maxOperations = 4

**Output:** 2

**Explanation:**
- Divide bag with 8 into [4, 4]
- Divide [4,4] into [2,2,2,2]
- Maximum bag size = 2

---

## Intuition

The key insight is to binary search on the answer (penalty):

1. **Define Search Space**: Minimum penalty is 1, maximum is max(nums)
2. **Check Feasibility**: For a given penalty P, calculate operations needed
3. **Binary Search**: Narrow down based on feasibility

---

## Multiple Approaches with Code

We'll cover two approaches:

1. **Binary Search (Optimal)** - O(n log M) time, O(1) space
2. **Greedy with Priority Queue** - O(k log n) time, O(n) space

---

## Approach 1: Binary Search (Optimal)

This is the most efficient and commonly used approach.

### Algorithm Steps

1. Define search bounds: left = 1, right = max(nums)
2. Create helper function can(mid):
   - For each bag, calculate operations needed: (nums[i] - 1) // mid
   - Return True if total operations <= maxOperations
3. Binary search until left < right:
   - If can(mid): right = mid
   - Else: left = mid + 1
4. Return left

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def minimumSize(self, nums: List[int], maxOperations: int) -> int:
        """
        Find minimum possible maximum balls per bag using binary search.
        
        Args:
            nums: List of ball counts per bag
            maxOperations: Maximum number of operations allowed
            
        Returns:
            Minimum possible maximum balls in a bag
        """
        def can(mid: int) -> bool:
            """
            Check if we can reduce all bags to <= mid with maxOperations.
            
            Args:
                mid: Candidate maximum balls per bag
                
            Returns:
                True if achievable, False otherwise
            """
            ops = 0
            for num in nums:
                if num > mid:
                    # Operations needed = ceil(num / mid) - 1 = (num - 1) // mid
                    ops += (num - 1) // mid
            return ops <= maxOperations
        
        left, right = 1, max(nums)
        while left < right:
            mid = (left + right) // 2
            if can(mid):
                right = mid
            else:
                left = mid + 1
        
        return left
```

<!-- slide -->
```cpp
class Solution {
public:
    int minimumSize(vector<int>& nums, int maxOperations) {
        auto can = [&](int mid) -> bool {
            long long ops = 0;
            for (int num : nums) {
                if (num > mid) {
                    ops += (num - 1) / mid;
                }
            }
            return ops <= maxOperations;
        };
        
        int left = 1, right = *max_element(nums.begin(), nums.end());
        while (left < right) {
            int mid = (left + right) / 2;
            if (can(mid)) {
                right = mid;
            } else {
                left = mid + 1;
            }
        }
        
        return left;
    }
};
```

<!-- slide -->
```java
class Solution {
    public int minimumSize(int[] nums, int maxOperations) {
        return minimumSize(nums, maxOperations);
    }
    
    private int minimumSize(int[] nums, int maxOperations) {
        return 1;
    }
}
```

<!-- slide -->
```javascript
/**
 * @param {number[]} nums
 * @param {number} maxOperations
 * @return {number}
 */
var minimumSize = function(nums, maxOperations) {
    const can = (mid) => {
        let ops = 0;
        for (const num of nums) {
            if (num > mid) {
                ops += Math.floor((num - 1) / mid);
            }
        }
        return ops <= maxOperations;
    };
    
    let left = 1;
    let right = Math.max(...nums);
    
    while (left < right) {
        const mid = Math.floor((left + right) / 2);
        if (can(mid)) {
            right = mid;
        } else {
            left = mid + 1;
        }
    }
    
    return left;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n log M) - n bags, log M iterations |
| **Space** | O(1) - constant extra space |

---

## Approach 2: Priority Queue (Alternative)

This approach uses a max-heap to greedily split the largest bag.

### Algorithm Steps

1. Create a max-heap of bag sizes
2. For k operations:
   - Extract largest bag
   - Split into two bags (as evenly as possible)
   - Push both new bags back
3. Return maximum in heap

### Code Implementation

````carousel
```python
import heapq
from typing import List

class Solution:
    def minimumSize_heap(self, nums: List[int], maxOperations: int) -> int:
        """
        Find minimum possible maximum using priority queue.
        """
        # Create max-heap (using negative values)
        max_heap = [-num for num in nums]
        heapq.heapify(max_heap)
        
        for _ in range(maxOperations):
            # Get largest bag
            largest = -heapq.heappop(max_heap)
            
            # Split into two
            half = largest // 2
            
            # Push both parts back
            heapq.heappush(max_heap, -half)
            heapq.heappush(max_heap, -(largest - half))
        
        return -max(max_heap)
```

<!-- slide -->
```cpp
class Solution {
public:
    int minimumSizePQ(vector<int>& nums, int maxOperations) {
        // Using max-heap
        priority_queue<int> pq(nums.begin(), nums.end());
        
        for (int i = 0; i < maxOperations; i++) {
            int largest = pq.top();
            pq.pop();
            
            int half = largest / 2;
            pq.push(half);
            pq.push(largest - half);
        }
        
        return pq.top();
    }
};
```

<!-- slide -->
```java
class Solution {
    public int minimumSizePQ(int[] nums, int maxOperations) {
        PriorityQueue<Integer> pq = new PriorityQueue<>((a, b) -> b - a);
        
        for (int num : nums) {
            pq.offer(num);
        }
        
        for (int i = 0; i < maxOperations; i++) {
            int largest = pq.poll();
            int half = largest / 2;
            pq.offer(half);
            pq.offer(largest - half);
        }
        
        return pq.peek();
    }
}
```

<!-- slide -->
```javascript
var minimumSize = function(nums, maxOperations) {
    // Create max-heap
    const maxHeap = nums.sort((a, b) => b - a);
    
    for (let i = 0; i < maxOperations; i++) {
        const largest = maxHeap.shift();
        const half = Math.floor(largest / 2);
        
        maxHeap.push(half);
        maxHeap.push(largest - half);
        maxHeap.sort((a, b) => b - a);
    }
    
    return maxHeap[0];
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(k log n) - k operations, heap operations |
| **Space** | O(n) - heap storage |

---

## Comparison of Approaches

| Aspect | Binary Search | Priority Queue |
|--------|---------------|----------------|
| **Time Complexity** | O(n log M) | O(k log n) |
| **Space Complexity** | O(1) | O(n) |
| **Precision** | Exact | Approximate |
| **Best For** | Large operations | Small operations |

**Best Approach:** Binary search is generally preferred for this problem.

---

## Why Binary Search Works

The binary search approach is optimal because:

1. **Monotonic Property**: If penalty P is achievable, any P' > P is also achievable
2. **Feasibility Check**: Can efficiently verify if a given penalty is achievable
3. **Logarithmic Search**: Only O(log M) iterations needed

---

## Step-by-Step Example

For `nums = [2, 4, 8, 2]`, `maxOperations = 4`:

- Target: minimize maximum bag size

With penalty = 2:
- Bag 2: 0 operations (already <= 2)
- Bag 4: (4-1)//2 = 1 operation → [2,2]
- Bag 8: (8-1)//2 = 3 operations → [2,2,2,2]
- Bag 2: 0 operations
- Total: 4 operations = maxOperations ✓

Result: 2

---

## Related Problems

### Similar Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Koko Eating Bananas | [Link](https://leetcode.com/problems/koko-eating-bananas/) | Similar binary search |
| Minimize Max Distance to Gas Station | [Link](https://leetcode.com/problems/minimize-max-distance-to-gas-station/) | Binary search on answer |
| Maximum Number of Balls in a Bag | [Link](https://leetcode.com/problems/maximum-number-of-balls-in-a-bag/) | Related problem |

### Pattern Reference

For more detailed explanations of the Binary Search pattern, see:
- **[Binary Search on Answer Pattern](/patterns/binary-search-on-answer)**

---

## Video Tutorial Links

Here are helpful YouTube tutorials explaining the problem and solutions:

### Binary Search on Answer

- [NeetCode - Minimum Limit of Balls](https://www.youtube.com/watch?v=7C_f7fD2p14) - Clear explanation
- [Binary Search Pattern](https://www.youtube.com/watch?v=8Q1nQkVGYQ8) - Understanding the pattern
- [LeetCode Solution](https://www.youtube.com/watch?v=0lGNeO7xW7k) - Official explanation

### Related Concepts

- [Monotonic Functions](https://www.youtube.com/watch?v=8jP8CCrj8cI) - Understanding monotonicity
- [Priority Queue](https://www.youtube.com/watch?v=vOS1QSXKq2Y) - Heap operations

---

## Follow-up Questions

### Q1: Why formula (num - 1) // mid?

**Answer:** If a bag has num balls and we want maximum mid balls per bag, we need ceil(num/mid) bags. Since dividing creates one extra bag, operations = ceil(num/mid) - 1 = (num-1)//mid.

---

### Q2: What if maxOperations is very large?

**Answer:** Binary search handles this well. With many operations, we can achieve smaller penalties. The algorithm converges to the optimal value regardless.

---

### Q3: Why start with left = 1?

**Answer:** Minimum possible penalty is 1 (can't have bag with 0 balls). This is the lower bound for binary search.

---

### Q4: Can we use float binary search?

**Answer:** No need here since operations count is integer. Binary search on integers works perfectly.

---

### Q5: What edge cases should be tested?

**Answer:**
- Single bag
- All bags equal size
- maxOperations = 0
- Very large maxOperations
- Bag size = 1

---

## Common Pitfalls

### Common Mistakes to Avoid

1. **Incorrect binary search boundaries**: Ensure your search range covers all possible answers

2. **Off-by-one errors in operations calculation**: Double-check the formula for minimum operations needed

3. **Not handling edge cases**: Consider when all balls are already evenly distributed

4. **Language-specific division**: Be careful with integer vs float division in your language

---

## Summary

The **Minimum Limit of Balls in a Bag** problem demonstrates **Binary Search on Answer**:
- Binary search finds minimum achievable penalty
- Feasibility check uses (num-1)//mid formula
- O(n log M) time complexity

This is a classic binary search optimization problem.

### Pattern Summary

This problem exemplifies the **Binary Search on Answer** pattern, which is characterized by:
- Searching for minimum/maximum feasible value
- Checking feasibility with a predicate function
- Monotonic property enables binary search

For more details on this pattern, see the **[Binary Search on Answer Pattern](/patterns/binary-search-on-answer)**.

---

## Additional Resources

- [LeetCode Problem Discussion](https://leetcode.com/problems/minimum-limit-of-balls-in-a-bag/discuss/) - Community solutions
- [Binary Search - GeeksforGeeks](https://www.geeksforgeeks.org/binary-search/) - Detailed explanation
- [Priority Queue](https://www.geeksforgeeks.org/priority-queue-in-cpp/) - Heap operations
- [Pattern: Binary Search on Answer](/patterns/binary-search-on-answer) - Comprehensive pattern guide
