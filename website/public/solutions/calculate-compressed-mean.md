# Calculate Compressed Mean

## Problem Description

Given a list of integers, calculate the arithmetic mean (compressed mean) of all elements.

The arithmetic mean is defined as the sum of all elements divided by the count of elements.

**Note:** This is a fundamental statistical problem. While not a specific LeetCode problem, it relates to basic mathematical operations on arrays.

---

## Examples

### Example

**Input:**
```python
nums = [1, 2, 3, 4, 5]
```

**Output:**
```python
3.0
```

**Explanation:** Sum = 1 + 2 + 3 + 4 + 5 = 15, Count = 5, Mean = 15/5 = 3.0

### Example 2

**Input:**
```python
nums = [10, 20, 30]
```

**Output:**
```python
20.0
```

**Explanation:** Sum = 10 + 20 + 30 = 60, Count = 3, Mean = 60/3 = 20.0

### Example 3

**Input:**
```python
nums = [5]
```

**Output:**
```python
5.0
```

**Explanation:** Single element, mean equals the element itself.

### Example 4

**Input:**
```python
nums = []
```

**Output:**
```python
0.0
```

**Explanation:** Empty list returns 0.0 as there's no mean for empty set.

### Example 5

**Input:**
```python
nums = [-1, -2, -3, -4]
```

**Output:**
```python
-2.5
```

**Explanation:** Sum = -1 + -2 + -3 + -4 = -10, Count = 4, Mean = -10/4 = -2.5

---

## Constraints

- `0 <= nums.length <= 10^6`
- `-10^9 <= nums[i] <= 10^9`
- The result should be returned as a float

---

## Pattern: Array Traversal / Mathematical

This is a fundamental example of **Array Traversal** and basic **Mathematical Operations**. The key insight is understanding how to compute arithmetic mean.

### Core Concept

- **Sum Calculation**: Accumulate all elements
- **Counting**: Track number of elements
- **Division**: Compute mean as sum/count
- **Edge Cases**: Handle empty arrays

---

## Intuition

The key insight for this problem is understanding the mathematical formula for arithmetic mean.

### Key Observations

1. **Mean Formula**: mean = (sum of elements) / (number of elements)

2. **Overflow Prevention**: For very large numbers, consider using larger data types or handling overflow

3. **Empty List**: Return 0.0 for empty list (mathematically undefined, but practical for programming)

4. **Precision**: The result is a float/double due to division

5. **Single Element**: If list has one element, mean equals that element

### Algorithm Overview

1. **Check Empty**: If list is empty, return 0.0
2. **Calculate Sum**: Sum all elements in the list
3. **Divide**: Divide sum by count of elements
4. **Return**: Return the result as float

---

## Multiple Approaches with Code

We'll cover two approaches:

1. **Simple Sum/Division** - Most common
2. **Running Mean (Streaming)** - For large datasets

---

## Approach 1: Simple Sum/Division - Optimal

### Algorithm Steps

1. Check if list is empty, return 0.0 if true
2. Calculate sum of all elements using built-in sum()
3. Divide sum by length of list
4. Return result as float

### Why It Works

This approach works because:
- The arithmetic mean is mathematically defined as sum/count
- Python's built-in sum() efficiently computes total
- Division automatically converts to float in Python

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def calculateCompressedMean(self, nums: List[int]) -> float:
        """
        Calculate the arithmetic mean of a list of integers.

        Args:
            nums: List of integers

        Returns:
            The arithmetic mean as a float, or 0.0 if the list is empty
        """
        # Handle empty list
        if not nums:
            return 0.0
        
        # Calculate and return mean
        return sum(nums) / len(nums)
```

<!-- slide -->
```cpp
#include <vector>
#include <numeric>

class Solution {
public:
    double calculateCompressedMean(std::vector<int>& nums) {
        // Handle empty list
        if (nums.empty()) {
            return 0.0;
        }
        
        // Calculate sum using accumulate
        long long sum = std::accumulate(nums.begin(), nums.end(), 0LL);
        
        // Return mean as double
        return static_cast<double>(sum) / nums.size();
    }
};
```

<!-- slide -->
```java
import java.util.List;

class Solution {
    public double calculateCompressedMean(int[] nums) {
        // Handle empty array
        if (nums == null || nums.length == 0) {
            return 0.0;
        }
        
        // Calculate sum
        long sum = 0;
        for (int num : nums) {
            sum += num;
        }
        
        // Return mean as double
        return (double) sum / nums.length;
    }
}
```

<!-- slide -->
```javascript
/**
 * @param {number[]} nums
 * @return {number}
 */
var calculateCompressedMean = function(nums) {
    // Handle empty array
    if (!nums || nums.length === 0) {
        return 0.0;
    }
    
    // Calculate sum
    const sum = nums.reduce((a, b) => a + b, 0);
    
    // Return mean
    return sum / nums.length;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) - iterate through all elements once |
| **Space** | O(1) - no additional space needed |

---

## Approach 2: Running Mean (Streaming)

### Algorithm Steps

1. Initialize sum and count to 0
2. For each element:
   - Add element to running sum
   - Increment count
3. Return sum/count as float

### Why It Works

The running mean approach works because:
- It processes elements one at a time
- Useful for streaming data or very large arrays
- Avoids storing all elements in memory at once

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def calculateCompressedMean(self, nums: List[int]) -> float:
        """Calculate mean using running sum."""
        if not nums:
            return 0.0
        
        # Calculate running sum
        total = 0
        count = 0
        
        for num in nums:
            total += num
            count += 1
        
        return total / count
```

<!-- slide -->
```cpp
class Solution {
public:
    double calculateCompressedMean(std::vector<int>& nums) {
        if (nums.empty()) return 0.0;
        
        long long total = 0;
        size_t count = 0;
        
        for (int num : nums) {
            total += num;
            count++;
        }
        
        return static_cast<double>(total) / count;
    }
};
```

<!-- slide -->
```java
class Solution {
    public double calculateCompressedMean(int[] nums) {
        if (nums == null || nums.length == 0) return 0.0;
        
        long total = 0;
        int count = 0;
        
        for (int num : nums) {
            total += num;
            count++;
        }
        
        return (double) total / count;
    }
}
```

<!-- slide -->
```javascript
var calculateCompressedMean = function(nums) {
    if (!nums || nums.length === 0) return 0.0;
    
    let total = 0;
    let count = 0;
    
    for (const num of nums) {
        total += num;
        count++;
    }
    
    return total / count;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) - iterate through all elements once |
| **Space** | O(1) - only two variables needed |

---

## Comparison of Approaches

| Aspect | Simple Sum/Division | Running Mean |
|--------|---------------------|--------------|
| **Time Complexity** | O(n) | O(n) |
| **Space Complexity** | O(1) | O(1) |
| **Implementation** | Simple | Simple |
| **Readability** | More Pythonic | More explicit |
| **Best For** | Small-medium arrays | Streaming/large data |

**Best Approach:** Use Approach 1 (Simple Sum/Division) for its simplicity and efficiency.

---

## Why This Problem is Important

### Interview Relevance

- **Frequency**: Basic concept, often used as warm-up
- **Companies**: Any technical interview
- **Difficulty**: Easy
- **Concepts Tested**: Basic math, array operations, edge cases

### Learning Outcomes

1. **Array Operations**: Master sum and length operations
2. **Edge Cases**: Handle empty arrays properly
3. **Type Conversion**: Understand float/double division
4. **Precision**: Consider numeric precision for large numbers

---

## Related Problems

Based on similar themes (mathematical operations on arrays):

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Average of Levels in Binary Tree | [Link](https://leetcode.com/problems/average-of-levels-in-binary-tree/) | Average at each level |
| Maximum Average Subarray I | [Link](https://leetcode.com/problems/maximum-average-subarray-i/) | Max average subarray |
| Find Numbers with Even Number of Digits | [Link](https://leetcode.com/problems/find-numbers-with-even-number-of-digits/) | Digit counting |

---

## Video Tutorial Links

Here are helpful resources for understanding mean and statistical operations:

### Recommended Tutorials

1. **[Arithmetic Mean Explained](https://www.youtube.com/watch?v=L4p4dHxzXQE)** - Basic statistics
2. **[Handling Large Numbers](https://www.youtube.com/watch?v=13M9R5MmSsc)** - Overflow handling

---

## Follow-up Questions

### Q1: How would you handle very large numbers that might overflow?

**Answer:** Use larger data types (long long in C++, long in Java, BigInt in JavaScript). In Python, integers have arbitrary precision.

### Q2: What if you need integer division instead of float?

**Answer:** Use integer division operator (// in Python, / with casting to int in other languages). Note: this truncates the decimal part.

### Q3: How would you calculate mean for streaming data without storing all values?

**Answer:** Use running mean approach: maintain running sum and count, compute sum/count at the end or incrementally.

### Q4: How do you handle floating point precision issues?

**Answer:** For critical applications, consider using Decimal in Python or BigDecimal in Java. For most cases, standard float/double is sufficient.

---

## Common Pitfalls

### 1. Not Handling Empty List
**Issue:** Division by zero or incorrect behavior with empty list.

**Solution:** Check if list is empty and return 0.0 before division.

### 2. Integer Division
**Issue:** Getting integer result instead of float.

**Solution:** Ensure at least one operand is float: `sum / float(len)` or use appropriate casting.

### 3. Overflow
**Issue:** Sum exceeding integer limits for large arrays.

**Solution:** Use long/long long types for sum accumulation.

### 4. Not Converting Type
**Issue:** Getting wrong type in the result.

**Solution:** Explicitly convert to float/double when returning.

### 5. Off-by-One
**Issue:** Incorrect count due to indexing errors.

**Solution:** Use len() / .size() / length for correct count.

---

## Summary

The **Calculate Compressed Mean** problem demonstrates **Basic Mathematical Operations** on arrays:

- **Mean Formula**: sum / count
- **Edge Cases**: Handle empty arrays
- **Type Conversion**: Return float/double
- **Time complexity**: O(n) - optimal

Key takeaways:
1. Sum all elements, divide by count
2. Handle empty list by returning 0.0
3. Use appropriate types to avoid overflow
4. Return result as float/double

This extends to:
- Statistical calculations (median, mode, variance)
- Streaming data processing
- Large-scale numerical operations

---

## Additional Resources

- [Arithmetic Mean - Wikipedia](https://en.wikipedia.org/wiki/Arithmetic_mean) - Mathematical background
- [Statistical Functions](https://www.geeksforgeeks.org/statistical-functions-python/) - Python statistics
- [Overflow Handling](https://www.geeksforgeeks.org/integer-overflow/) - Understanding overflow
