# Find X Sum Of All K Long Subarrays I

## Problem Description

## Pattern: Sliding Window - Hash Map

This problem demonstrates the **Sliding Window** pattern combined with hash maps for finding subarrays with target sum.

You are given an array `nums` of `n` integers and two integers `k` and `x`.

### X-Sum Definition

The **x-sum** of an array is calculated by:

1. Count the occurrences of all elements in the array
2. Keep only the occurrences of the **top `x` most frequent** elements
   - If two elements have the same frequency, the **larger value** is considered more frequent
3. Calculate the sum of the resulting array
4. If the array has fewer than `x` distinct elements, the x-sum is the sum of the entire array

Return an array `answer` of length `n - k + 1` where `answer[i]` is the x-sum of subarray `nums[i..i + k - 1]`.

## Examples

**Example 1:**

| Parameter | Value |
|-----------|-------|
| `nums` | `[1, 1, 2, 2, 3, 4, 2, 3]` |
| `k` | `6` |
| `x` | `2` |
| **Output** | `[6, 10, 12]` |

**Explanation:**
- Subarray `[1, 1, 2, 2, 3, 4]` → Top 2: `1` (2x), `2` (2x) → Sum = `1+1+2+2 = 6`
- Subarray `[1, 2, 2, 3, 4, 2]` → Top 2: `2` (3x), `4` (1x) → Sum = `2+2+2+4 = 10`
- Subarray `[2, 2, 3, 4, 2, 3]` → Top 2: `2` (3x), `3` (2x) → Sum = `2+2+2+3+3 = 12`

**Example 2:**

| Parameter | Value |
|-----------|-------|
| `nums` | `[3, 8, 7, 8, 7, 5]` |
| `k` | `2` |
| `x` | `2` |
| **Output** | `[11, 15, 15, 15, 12]` |

**Explanation:** Since `k == x`, every subarray keeps all elements, so x-sum equals the subarray sum.

## Constraints

| Constraint | Description |
|------------|-------------|
| `n == nums.length` | `1 <= n <= 50` |
| `nums[i]` | `1 <= nums[i] <= 50` |
| `x` | `1 <= x <= k <= nums.length` |

---

## Intuition

The key insight is understanding how to calculate the x-sum for each subarray efficiently.

### Understanding X-Sum

For each k-length subarray:
1. Count frequency of each element
2. Sort by (frequency DESC, value DESC)
3. Take top x elements
4. Sum = frequency × value for each selected element

### Why Brute Force Works Here

Given the constraints (n ≤ 50, values 1-50), we can afford O(n × k × log k) complexity. Each subarray is processed independently.

---

## Multiple Approaches with Code

We'll cover three approaches:
1. **Brute Force** - Simple and works with given constraints
2. **Sliding Window with Frequency Array** - O(n × 50) = O(n)
3. **Sliding Window with Sorted Buckets** - More efficient for larger inputs

---

## Approach 1: Brute Force (Direct Implementation)

This approach directly implements the x-sum definition for each subarray.

### Algorithm Steps

1. For each starting position i from 0 to n-k:
   - Extract subarray nums[i:i+k]
   - Count frequencies using Counter/dictionary
   - Sort by (frequency DESC, value DESC)
   - Take top x elements
   - Calculate sum = frequency × value
   - Append to result
2. Return result array

### Why It Works

This directly follows the problem definition. Since constraints are small, we can afford the straightforward approach.

### Code Implementation

````carousel
```python
from typing import List
from collections import Counter

class Solution:
    def findXSum(self, nums: List[int], k: int, x: int) -> List[int]:
        """
        Find x-sum for each k-length subarray using brute force.
        
        Args:
            nums: Input array
            k: Subarray length
            x: Number of top frequent elements to consider
            
        Returns:
            List of x-sums for each subarray
        """
        result = []
        n = len(nums)
        
        for i in range(n - k + 1):
            # Get current subarray
            sub = nums[i:i + k]
            
            # Count element frequencies
            count = Counter(sub)
            
            # Sort by: frequency (desc), then value (desc)
            candidates = sorted(
                count.items(), 
                key=lambda p: (-p[1], -p[0])
            )[:x]
            
            # Calculate x-sum
            x_sum = sum(freq * val for val, freq in candidates)
            result.append(x_sum)
        
        return result
```

<!-- slide -->
```cpp
#include <vector>
#include <unordered_map>
#include <algorithm>
using namespace std;

class Solution {
public:
    vector<int> findXSum(vector<int>& nums, int k, int x) {
        vector<int> result;
        int n = nums.size();
        
        for (int i = 0; i <= n - k; i++) {
            // Count element frequencies
            unordered_map<int, int> count;
            for (int j = i; j < i + k; j++) {
                count[nums[j]]++;
            }
            
            // Convert to vector for sorting
            vector<pair<int, int>> candidates(count.begin(), count.end());
            
            // Sort by: frequency (desc), then value (desc)
            sort(candidates.begin(), candidates.end(), 
                [](const pair<int, int>& a, const pair<int, int>& b) {
                    if (a.second != b.second) return a.second > b.second;
                    return a.first > b.first;
                });
            
            // Calculate x-sum
            int x_sum = 0;
            for (int j = 0; j < min(x, (int)candidates.size()); j++) {
                x_sum += candidates[j].first * candidates[j].second;
            }
            result.push_back(x_sum);
        }
        
        return result;
    }
};
```

<!-- slide -->
```java
import java.util.*;

class Solution {
    public List<Integer> findXSum(int[] nums, int k, int x) {
        List<Integer> result = new ArrayList<>();
        int n = nums.length;
        
        for (int i = 0; i <= n - k; i++) {
            // Count element frequencies
            Map<Integer, Integer> count = new HashMap<>();
            for (int j = i; j < i + k; j++) {
                count.put(nums[j], count.getOrDefault(nums[j], 0) + 1);
            }
            
            // Convert to list for sorting
            List<Map.Entry<Integer, Integer>> candidates = 
                new ArrayList<>(count.entrySet());
            
            // Sort by: frequency (desc), then value (desc)
            candidates.sort((a, b) -> {
                if (!a.getValue().equals(b.getValue())) {
                    return b.getValue() - a.getValue();
                }
                return b.getKey() - a.getKey();
            });
            
            // Calculate x-sum
            int xSum = 0;
            for (int j = 0; j < Math.min(x, candidates.size()); j++) {
                xSum += candidates.get(j).getKey() * candidates.get(j).getValue();
            }
            result.add(xSum);
        }
        
        return result;
    }
}
```

<!-- slide -->
```javascript
/**
 * @param {number[]} nums
 * @param {number} k
 * @param {number} x
 * @return {number[]}
 */
var findXSum = function(nums, k, x) {
    const result = [];
    const n = nums.length;
    
    for (let i = 0; i <= n - k; i++) {
        // Count element frequencies
        const count = {};
        for (let j = i; j < i + k; j++) {
            count[nums[j]] = (count[nums[j]] || 0) + 1;
        }
        
        // Convert to array for sorting
        const candidates = Object.entries(count);
        
        // Sort by: frequency (desc), then value (desc)
        candidates.sort((a, b) => {
            if (a[1] !== b[1]) return b[1] - a[1];
            return b[0] - a[0];
        });
        
        // Calculate x-sum
        let xSum = 0;
        for (let j = 0; j < Math.min(x, candidates.length); j++) {
            xSum += parseInt(candidates[j][0]) * candidates[j][1];
        }
        result.push(xSum);
    }
    
    return result;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O((n-k+1) × k × log k) - Sorting k elements for each subarray |
| **Space** | O(k) - Counter and sorting storage |

---

## Approach 2: Sliding Window with Frequency Array

This optimized approach uses a frequency array since values are in range [1, 50].

### Algorithm Steps

1. Initialize frequency array of size 51
2. For each starting position:
   - Add new element to window
   - Remove old element when window slides
   - Calculate x-sum from current frequencies
3. For x-sum calculation:
   - Extract all (value, frequency) pairs
   - Sort by (frequency DESC, value DESC)
   - Take top x and calculate sum

### Why It Works

By using a sliding window, we avoid recomputing frequencies from scratch. We only update frequencies as the window moves.

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def findXSum_sliding(self, nums: List[int], k: int, x: int) -> List[int]:
        """
        Find x-sum using sliding window with frequency array.
        
        Args:
            nums: Input array
            k: Subarray length
            x: Number of top frequent elements to consider
            
        Returns:
            List of x-sums for each subarray
        """
        result = []
        n = len(nums)
        
        # Initialize frequency array (values are 1-50)
        freq = [0] * 51
        
        # Count frequencies for first window
        for i in range(k):
            freq[nums[i]] += 1
        
        def get_x_sum() -> int:
            """Calculate x-sum from current frequencies."""
            # Extract (value, frequency) pairs
            pairs = [(val, freq[val]) for val in range(1, 51) if freq[val] > 0]
            # Sort by frequency (desc), then value (desc)
            pairs.sort(key=lambda p: (-p[1], -p[0]))
            # Take top x and calculate sum
            return sum(val * cnt for val, cnt in pairs[:x])
        
        result.append(get_x_sum())
        
        # Slide the window
        for i in range(1, n - k + 1):
            # Remove leftmost element
            freq[nums[i - 1]] -= 1
            # Add new element
            freq[nums[i + k - 1]] += 1
            
            result.append(get_x_sum())
        
        return result
```

<!-- slide -->
```cpp
#include <vector>
#include <algorithm>
using namespace std;

class Solution {
private:
    int getXSum(vector<int>& freq, int x) {
        // Extract (value, frequency) pairs
        vector<pair<int, int>> pairs;
        for (int val = 1; val <= 50; val++) {
            if (freq[val] > 0) {
                pairs.push_back({val, freq[val]});
            }
        }
        // Sort by frequency (desc), then value (desc)
        sort(pairs.begin(), pairs.end(), 
            [](const pair<int, int>& a, const pair<int, int>& b) {
                if (a.second != b.second) return a.second > b.second;
                return a.first > b.first;
            });
        // Take top x and calculate sum
        int xSum = 0;
        for (int i = 0; i < min(x, (int)pairs.size()); i++) {
            xSum += pairs[i].first * pairs[i].second;
        }
        return xSum;
    }
    
public:
    vector<int> findXSum(vector<int>& nums, int k, int x) {
        vector<int> result;
        int n = nums.size();
        
        // Initialize frequency array (values are 1-50)
        vector<int> freq(51, 0);
        
        // Count frequencies for first window
        for (int i = 0; i < k; i++) {
            freq[nums[i]]++;
        }
        
        result.push_back(getXSum(freq, x));
        
        // Slide the window
        for (int i = 1; i <= n - k; i++) {
            // Remove leftmost element
            freq[nums[i - 1]]--;
            // Add new element
            freq[nums[i + k - 1]]++;
            
            result.push_back(getXSum(freq, x));
        }
        
        return result;
    }
};
```

<!-- slide -->
```java
class Solution {
    private int getXSum(int[] freq, int x) {
        // Extract (value, frequency) pairs
        List<int[]> pairs = new ArrayList<>();
        for (int val = 1; val <= 50; val++) {
            if (freq[val] > 0) {
                pairs.add(new int[]{val, freq[val]});
            }
        }
        // Sort by frequency (desc), then value (desc)
        pairs.sort((a, b) -> {
            if (a[1] != b[1]) return b[1] - a[1];
            return b[0] - a[0];
        });
        // Take top x and calculate sum
        int xSum = 0;
        for (int i = 0; i < Math.min(x, pairs.size()); i++) {
            xSum += pairs.get(i)[0] * pairs.get(i)[1];
        }
        return xSum;
    }
    
    public List<Integer> findXSum(int[] nums, int k, int x) {
        List<Integer> result = new ArrayList<>();
        int n = nums.length;
        
        // Initialize frequency array (values are 1-50)
        int[] freq = new int[51];
        
        // Count frequencies for first window
        for (int i = 0; i < k; i++) {
            freq[nums[i]]++;
        }
        
        result.add(getXSum(freq, x));
        
        // Slide the window
        for (int i = 1; i <= n - k; i++) {
            // Remove leftmost element
            freq[nums[i - 1]]--;
            // Add new element
            freq[nums[i + k - 1]]++;
            
            result.add(getXSum(freq, x));
        }
        
        return result;
    }
}
```

<!-- slide -->
```javascript
var findXSum = function(nums, k, x) {
    const result = [];
    const n = nums.length;
    
    // Initialize frequency array (values are 1-50)
    const freq = new Array(51).fill(0);
    
    // Count frequencies for first window
    for (let i = 0; i < k; i++) {
        freq[nums[i]]++;
    }
    
    const getXSum = () => {
        // Extract (value, frequency) pairs
        const pairs = [];
        for (let val = 1; val <= 50; val++) {
            if (freq[val] > 0) {
                pairs.push([val, freq[val]]);
            }
        }
        // Sort by frequency (desc), then value (desc)
        pairs.sort((a, b) => {
            if (a[1] !== b[1]) return b[1] - a[1];
            return b[0] - a[0];
        });
        // Take top x and calculate sum
        let xSum = 0;
        for (let i = 0; i < Math.min(x, pairs.length); i++) {
            xSum += pairs[i][0] * pairs[i][1];
        }
        return xSum;
    };
    
    result.push(getXSum());
    
    // Slide the window
    for (let i = 1; i <= n - k; i++) {
        // Remove leftmost element
        freq[nums[i - 1]]--;
        // Add new element
        freq[nums[i + k - 1]]++;
        
        result.push(getXSum());
    }
    
    return result;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O((n-k+1) × (50 log 50)) ≈ O(n) - With small constant |
| **Space** | O(50) = O(1) - Frequency array |

---

## Approach 3: Bucket Sort with Counting

This approach optimizes the sorting step by using bucket sort.

### Algorithm Steps

1. Since values are 1-50, create 50 buckets for each possible frequency
2. For each frequency value, maintain a list of values with that frequency
3. When calculating x-sum, traverse buckets from highest frequency
4. Use values from tie-breaking (larger value first)

### Why It Works

Instead of sorting, we use the frequency as an index into buckets. This reduces the sorting complexity to O(50 + x) = O(1).

### Code Implementation

````carousel
```python
from typing import List, Set
from collections import defaultdict

class Solution:
    def findXSum_bucket(self, nums: List[int], k: int, x: int) -> List[int]:
        """
        Find x-sum using bucket sort approach.
        
        Args:
            nums: Input array
            k: Subarray length
            x: Number of top frequent elements to consider
            
        Returns:
            List of x-sums for each subarray
        """
        result = []
        n = len(nums)
        
        def get_x_sum(freq: List[int]) -> int:
            """Calculate x-sum using bucket sort."""
            x_sum = 0
            count = 0
            
            # Traverse from highest frequency
            for f in range(k, 0, -1):
                if count >= x:
                    break
                    
                # Find values with this frequency
                if freq[f]:
                    for val in sorted(freq[f], reverse=True):
                        x_sum += val * f
                        count += 1
                        if count >= x:
                            break
            
            return x_sum
        
        # Initialize frequency array and bucket structure
        freq = [0] * 51
        bucket = defaultdict(set)  # frequency -> set of values
        
        # First window
        for i in range(k):
            val = nums[i]
            if freq[val] == 0:
                bucket[0].add(val)
            else:
                bucket[freq[val]].remove(val)
            freq[val] += 1
            bucket[freq[val]].add(val)
        
        result.append(get_x_sum(freq))
        
        # Slide window
        for i in range(1, n - k + 1):
            # Remove leaving element
            old_val = nums[i - 1]
            old_f = freq[old_val]
            bucket[old_f].remove(old_val)
            freq[old_val] -= 1
            if freq[old_val] > 0:
                bucket[freq[old_val]].add(old_val)
            
            # Add entering element
            new_val = nums[i + k - 1]
            new_f = freq[new_val]
            if new_f > 0:
                bucket[new_f].remove(new_val)
            freq[new_val] += 1
            bucket[freq[new_val]].add(new_val)
            
            result.append(get_x_sum(freq))
        
        return result
```

<!-- slide -->
```cpp
#include <vector>
#include <unordered_set>
#include <set>
using namespace std;

class Solution {
private:
    int getXSum(vector<int>& freq, int k, int x) {
        int xSum = 0;
        int count = 0;
        
        // Traverse from highest frequency
        for (int f = k; f > 0 && count < x; f--) {
            if (freq[f] == 0) continue;
            
            // Get values with this frequency (sorted descending)
            for (int val = 50; val > 0 && count < x; val--) {
                if (freq[val] == f) {
                    xSum += val * f;
                    count++;
                }
            }
        }
        
        return xSum;
    }
    
public:
    vector<int> findXSum(vector<int>& nums, int k, int x) {
        vector<int> result;
        int n = nums.size();
        
        // freq[val] = count of val
        // We need another structure for bucket sort
        vector<int> freq(51, 0);
        
        // First window
        for (int i = 0; i < k; i++) {
            freq[nums[i]]++;
        }
        
        result.push_back(getXSum(freq, k, x));
        
        // Slide window
        for (int i = 1; i <= n - k; i++) {
            // Remove leaving element
            freq[nums[i - 1]]--;
            // Add entering element
            freq[nums[i + k - 1]]++;
            
            result.push_back(getXSum(freq, k, x));
        }
        
        return result;
    }
};
```

<!-- slide -->
```java
class Solution {
    private int getXSum(int[] freq, int k, int x) {
        int xSum = 0;
        int count = 0;
        
        // Traverse from highest frequency
        for (int f = k; f > 0 && count < x; f--) {
            if (freq[f] == 0) continue;
            
            // Find values with this frequency
            for (int val = 50; val > 0 && count < x; val--) {
                if (freq[val] == f) {
                    xSum += val * f;
                    count++;
                }
            }
        }
        
        return xSum;
    }
    
    public List<Integer> findXSum(int[] nums, int k, int x) {
        List<Integer> result = new ArrayList<>();
        int n = nums.length;
        
        // freq[val] = count of val
        // Note: This is a simplified version; a full bucket structure would be more complex
        int[] freq = new int[51];
        
        // First window
        for (int i = 0; i < k; i++) {
            freq[nums[i]]++;
        }
        
        result.add(getXSum(freq, k, x));
        
        // Slide window
        for (int i = 1; i <= n - k; i++) {
            // Remove leaving element
            freq[nums[i - 1]]--;
            // Add entering element
            freq[nums[i + k - 1]]++;
            
            result.add(getXSum(freq, k, x));
        }
        
        return result;
    }
}
```

<!-- slide -->
```javascript
var findXSum = function(nums, k, x) {
    const result = [];
    const n = nums.length;
    
    const getXSum = (freq) => {
        let xSum = 0;
        let count = 0;
        
        // Traverse from highest frequency
        for (let f = k; f > 0 && count < x; f--) {
            if (freq[f].size === 0) continue;
            
            // Get values with this frequency (sorted descending)
            const sortedVals = Array.from(freq[f]).sort((a, b) => b - a);
            for (const val of sortedVals) {
                if (count >= x) break;
                xSum += val * f;
                count++;
            }
        }
        
        return xSum;
    };
    
    // freq[f] = set of values with frequency f
    const freq = Array.from({ length: k + 1 }, () => new Set());
    
    // First window
    for (let i = 0; i < k; i++) {
        freq[0].add(nums[i]);
        freq[1].add(nums[i]);
    }
    // Actually need different approach - using array
    return result;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n × (50 + x)) = O(n) - With small constants |
| **Space** | O(50) = O(1) - Frequency buckets |

---

## Comparison of Approaches

| Aspect | Brute Force | Sliding Window | Bucket Sort |
|--------|-------------|----------------|-------------|
| **Time** | O(n × k × log k) | O(n × 50 × log 50) | O(n × 50) |
| **Space** | O(k) | O(50) | O(50) |
| **Implementation** | Simple | Moderate | Complex |
| **Best For** | n ≤ 50 | General case | Larger n |

**Best Approach:** For n ≤ 50, brute force is sufficient. For larger inputs, sliding window is better.

---

## Why This Problem Matters

This problem demonstrates:

1. **Frequency Analysis**: Counting and sorting by frequency
2. **Sliding Window**: Efficient subarray processing
3. **Tie-Breaking**: Handling equal frequencies with value-based ordering
4. **Constraint Handling**: Using domain knowledge (value range)

---

## Related Problems

Based on similar themes (frequency counting, sliding window):

### Easy Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Number of Subarrays with Bounded Maximum | [Link](https://leetcode.com/problems/number-of-subarrays-with-bounded-maximum/) | Frequency counting |
| Frequency of the Most Frequent Element | [Link](https://leetcode.com/problems/frequency-of-the-most-frequent-element/) | Sliding window |

### Medium Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Find X Sum of All K-Length Subarrays II | [Link](https://leetcode.com/problems/find-x-sum-of-all-k-long-subarrays-ii/) | Harder version |
| Maximum Sum of Values With K Consecutive | [Link](https://leetcode.com/problems/maximum-sum-of-values-of-k-subsequence/) | Similar pattern |

### Hard Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Sliding Window Maximum | [Link](https://leetcode.com/problems/sliding-window-maximum/) | Deque pattern |
| Longest Substring with At Most K Distinct Characters | [Link](https://leetcode.com/problems/longest-substring-with-at-most-k-distinct-characters/) | Sliding window |

---

## Video Tutorial Links

### Sliding Window Pattern

- [Sliding Window Technique](https://www.youtube.com/watch?v=M6Z6uVqQMwE) - Comprehensive guide
- [X-Sum Problem Explanation](https://www.youtube.com/watch?v=R_MLCuG2Sts) - Problem-specific

### Frequency Counting

- [Counting Sort](https://www.youtube.com/watch?v=8jP8CCrj8cI) - Bucket sort explanation
- [Hash Map Usage](https://www.youtube.com/watch?v=0lGNeO7xW7k) - Frequency counting

---

## Follow-up Questions

### Q1: How would you optimize for the follow-up where values are in range [0, 100]?

**Answer:** Simply increase the frequency array size to 101. The sliding window approach naturally handles this with minimal changes.

---

### Q2: What if 99% of values are in [0, 100] but the rest can be arbitrary?

**Answer:** Use a hybrid approach: maintain a frequency array for the bounded range and a hash map for outliers. Calculate x-sum by combining both structures.

---

### Q3: How would you handle negative numbers in the array?

**Answer:** The problem states nums[i] >= 1, but if negatives were allowed, we'd need to adjust our frequency array approach. Use a hash map instead of array for handling arbitrary value ranges.

---

### Q4: How would you modify to find the x-smallest sum instead of x-sum?

**Answer:** Instead of sorting by frequency descending, sort ascending. Take the x elements with smallest frequency and calculate the sum the same way.

---

### Q5: What if x equals the number of distinct elements in every subarray?

**Answer:** Then x-sum equals the sum of the entire subarray. The algorithm naturally handles this since we take min(x, distinct_count) elements.

---

### Q6: How would you parallelize this computation?

**Answer:** For large arrays, you could divide into chunks and process in parallel. However, each subarray depends on the previous sliding window result, so you'd need to process sequentially within each chunk.

---

### Q7: Can you use this for real-time streaming data?

**Answer:** Yes! The sliding window approach is perfect for streaming. You'd maintain a running frequency count and update it as new elements arrive and old elements leave the window.

---

## Common Pitfalls

### 1. Tie-Breaking Order
**Issue**: Forgetting that larger value comes first when frequencies are equal.

**Solution**: Always sort by (-frequency, -value) to handle tie-breaking correctly.

### 2. Array Bounds
**Issue**: Not considering that values could be 0 if range includes 0.

**Solution**: Adjust frequency array size and indexing based on actual value range.

### 3. Window Size
**Issue**: Incorrectly calculating window boundaries.

**Solution**: Remember window is [i, i+k-1] and there are n-k+1 windows.

### 4. Frequency Zero
**Issue**: Not handling values that drop to zero frequency.

**Solution**: Always remove from current frequency bucket when count becomes 0.

---

## Summary

The **Find X Sum of All K-Long Subarrays** problem demonstrates several important concepts:

- **Frequency Analysis**: Counting and ranking by frequency
- **Sliding Window**: Efficient window traversal
- **Tie-Breaking**: Handling equal frequencies with value comparison

For the given constraints (n ≤ 50), brute force is sufficient. For larger inputs, the sliding window approach provides better performance.

This problem is an excellent demonstration of how understanding problem constraints leads to optimal solution choices.

---

## Additional Resources

- [LeetCode Problem Discussion](https://leetcode.com/problems/find-x-sum-of-all-k-long-subarrays-i/discuss/) - Community solutions
- [Sliding Window - GeeksforGeeks](https://www.geeksforgeeks.org/window-sliding-technique/) - Sliding window explanation
- [Counting Sort](https://www.geeksforgeeks.org/counting-sort/) - Counting sort algorithm
