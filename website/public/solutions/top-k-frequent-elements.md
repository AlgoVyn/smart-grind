# Top K Frequent Elements

## Problem Description

Given an integer array `nums` and an integer `k`, return the `k` most frequent elements. You may return the answer in any order.

---

## Examples

### Example 1

**Input:** `nums = [1,1,1,2,2,3]`, `k = 2`

**Output:** `[1,2]`

**Explanation:** Both 1 and 2 appear 3 and 2 times respectively.

### Example 2

**Input:** `nums = [1]`, `k = 1`

**Output:** `[1]`

### Example 3

**Input:** `nums = [1,2,1,2,1,2,3,1,3,2]`, `k = 2`

**Output:** `[1,2]`

---

## Constraints

- `1 <= nums.length <= 10^5`
- `-10^4 <= nums[i] <= 10^4`
- `k` is in the range `[1, the number of unique elements in the array]`.
- It is guaranteed that the answer is unique.

**Follow up:** Your algorithm's time complexity must be better than O(n log n), where n is the array's size.

---

## LeetCode Link

[LeetCode Problem 347: Top K Frequent Elements](https://leetcode.com/problems/top-k-frequent-elements/)

---

## Pattern: Bucket Sort

This problem follows the **Bucket Sort** pattern for frequency-based selection.

### Core Concept

- **Frequency Range**: Frequency can only be from 1 to n (array length)
- **Bucket Indexing**: Use frequency as index into bucket array
- **Direct Placement**: Elements go directly to bucket[frequency]
- **Reverse Iterate**: Get top k from highest frequency

### When to Use This Pattern

This pattern is applicable when:
1. Finding top k elements by frequency
2. Problems with bounded value range
3. Achieving O(n) better than O(n log n)

### Alternative Patterns

| Pattern | Description |
|---------|-------------|
| Heap/Priority Queue | O(n log k) - maintain top k |
| Quickselect | O(n) average - partition-based |

---

## Intuition

The key insight is using **bucket sort** based on frequency:

> Since frequency can only range from 1 to n, we can use buckets where index = frequency and value = elements with that frequency.

### Key Observations

1. **Frequency Range**: Frequency of any element can be from 1 to n (array length).

2. **Bucket Sort**: Instead of sorting by value, we sort by frequency using buckets.

3. **Two Main Approaches**:
   - Heap: O(n log k) - maintain k largest elements
   - Bucket Sort: O(n) - direct indexing by frequency

4. **Optimal**: Bucket sort achieves O(n) time complexity, better than O(n log n).

### Why Bucket Sort Works

Since maximum frequency is at most n (array length), we can create n+1 buckets where bucket[i] contains all elements with frequency i. We then iterate from highest frequency to find k elements.

---

## Multiple Approaches with Code

We'll cover two approaches:
1. **Bucket Sort** - Optimal O(n) solution
2. **Heap/Priority Queue** - O(n log k) solution

---

## Approach 1: Bucket Sort (Optimal)

### Algorithm Steps

1. Count frequency of each element using Counter/HashMap
2. Create buckets array of size n+1 (frequencies from 0 to n)
3. Place each element in bucket corresponding to its frequency
4. Iterate from highest frequency down, collecting elements until k found

### Why It Works

The key insight is that frequency has a bounded range (1 to n). We can directly index into an array using frequency, achieving O(n) time.

### Code Implementation

````carousel
```python
from typing import List
from collections import Counter

class Solution:
    def topKFrequent(self, nums: List[int], k: int) -> List[int]:
        """
        Find top k frequent elements using bucket sort.
        
        Args:
            nums: Input array of integers
            k: Number of most frequent elements to return
            
        Returns:
            List of k most frequent elements
        """
        # Step 1: Count frequencies
        count = Counter(nums)
        n = len(nums)
        
        # Step 2: Create buckets (index = frequency)
        buckets = [[] for _ in range(n + 1)]
        for num, freq in count.items():
            buckets[freq].append(num)
        
        # Step 3: Collect k elements from highest frequency
        result = []
        for freq in range(n, 0, -1):
            for num in buckets[freq]:
                result.append(num)
                if len(result) == k:
                    return result
        
        return result
```

<!-- slide -->
```cpp
#include <vector>
#include <unordered_map>
using namespace std;

class Solution {
public:
    vector<int> topKFrequent(vector<int>& nums, int k) {
        // Step 1: Count frequencies
        unordered_map<int, int> count;
        for (int num : nums) {
            count[num]++;
        }
        
        int n = nums.size();
        
        // Step 2: Create buckets
        vector<vector<int>> buckets(n + 1);
        for (auto& [num, freq] : count) {
            buckets[freq].push_back(num);
        }
        
        // Step 3: Collect k elements
        vector<int> result;
        for (int freq = n; freq > 0 && result.size() < k; freq--) {
            for (int num : buckets[freq]) {
                result.push_back(num);
                if (result.size() == k) break;
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
    public int[] topKFrequent(int[] nums, int k) {
        // Step 1: Count frequencies
        Map<Integer, Integer> count = new HashMap<>();
        for (int num : nums) {
            count.put(num, count.getOrDefault(num, 0) + 1);
        }
        
        int n = nums.length;
        
        // Step 2: Create buckets
        List<Integer>[] buckets = new List[n + 1];
        for (int i = 0; i <= n; i++) {
            buckets[i] = new ArrayList<>();
        }
        
        for (Map.Entry<Integer, Integer> entry : count.entrySet()) {
            buckets[entry.getValue()].add(entry.getKey());
        }
        
        // Step 3: Collect k elements
        List<Integer> result = new ArrayList<>();
        for (int freq = n; freq > 0 && result.size() < k; freq--) {
            for (int num : buckets[freq]) {
                result.add(num);
                if (result.size() == k) break;
            }
        }
        
        return result.stream().mapToInt(Integer::intValue).toArray();
    }
}
```

<!-- slide -->
```javascript
/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number[]}
 */
var topKFrequent = function(nums, k) {
    // Step 1: Count frequencies
    const count = {};
    for (const num of nums) {
        count[num] = (count[num] || 0) + 1;
    }
    
    const n = nums.length;
    
    // Step 2: Create buckets
    const buckets = Array.from({ length: n + 1 }, () => []);
    for (const [num, freq] of Object.entries(count)) {
        buckets[freq].push(Number(num));
    }
    
    // Step 3: Collect k elements
    const result = [];
    for (let freq = n; freq > 0 && result.length < k; freq--) {
        for (const num of buckets[freq]) {
            result.push(num);
            if (result.length === k) break;
        }
    }
    
    return result;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) - Count + bucket placement + collection |
| **Space** | O(n) - For count map and buckets |

---

## Approach 2: Heap/Priority Queue

### Algorithm Steps

1. Count frequency of each element
2. Use a min-heap of size k
3. For each element, add to heap (keeping only top k)
4. Extract elements from heap

### Why It Works

The heap maintains the k most frequent elements at all times. By using a min-heap of size k, we keep the smallest among the top k, and any more frequent element replaces it.

### Code Implementation

````carousel
```python
from typing import List
import heapq
from collections import Counter

class Solution:
    def topKFrequent(self, nums: List[int], k: int) -> List[int]:
        """
        Find top k frequent elements using heap.
        """
        # Count frequencies
        count = Counter(nums)
        
        # Use heap to keep top k
        # heap stores (-freq, num) for max-heap behavior
        heap = [(-freq, num) for num, freq in count.items()]
        heapq.heapify(heap)
        
        # Extract top k
        return [heapq.heappop(heap)[1] for _ in range(k)]
```

<!-- slide -->
```cpp
#include <vector>
#include <unordered_map>
#include <queue>
using namespace std;

class Solution {
public:
    vector<int> topKFrequent(vector<int>& nums, int k) {
        // Count frequencies
        unordered_map<int, int> count;
        for (int num : nums) {
            count[num]++;
        }
        
        // Min-heap of size k
        auto cmp = [](pair<int,int> a, pair<int,int> b) {
            return a.second > b.second;
        };
        priority_queue<pair<int,int>, vector<pair<int,int>>, decltype(cmp)> pq(cmp);
        
        for (auto& [num, freq] : count) {
            pq.push({num, freq});
            if (pq.size() > k) pq.pop();
        }
        
        // Extract result
        vector<int> result;
        while (!pq.empty()) {
            result.push_back(pq.top().first);
            pq.pop();
        }
        
        return result;
    }
};
```

<!-- slide -->
```java
import java.util.*;

class Solution {
    public int[] topKFrequent(int[] nums, int k) {
        // Count frequencies
        Map<Integer, Integer> count = new HashMap<>();
        for (int num : nums) {
            count.put(num, count.getOrDefault(num, 0) + 1);
        }
        
        // Min-heap of size k
        PriorityQueue<Integer> pq = new PriorityQueue<>(
            (a, b) -> count.get(a) - count.get(b)
        );
        
        for (int num : count.keySet()) {
            pq.add(num);
            if (pq.size() > k) pq.poll();
        }
        
        // Extract result
        int[] result = new int[k];
        for (int i = 0; i < k; i++) {
            result[i] = pq.poll();
        }
        
        return result;
    }
}
```

<!-- slide -->
```javascript
var topKFrequent = function(nums, k) {
    // Count frequencies
    const count = {};
    for (const num of nums) {
        count[num] = (count[num] || 0) + 1;
    }
    
    // Min-heap using priority queue
    const pq = [];
    
    for (const num of Object.keys(count)) {
        const freq = count[num];
        pq.push({ num: Number(num), freq });
        pq.sort((a, b) => a.freq - b.freq);
        if (pq.length > k) pq.shift();
    }
    
    return pq.map(item => item.num);
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n log k) - Building heap and maintaining size k |
| **Space** | O(n) - For count map |

---

## Comparison of Approaches

| Aspect | Bucket Sort | Heap |
|--------|-------------|------|
| **Time Complexity** | O(n) | O(n log k) |
| **Space Complexity** | O(n) | O(n) |
| **Implementation** | Moderate | Simple |

**Best Approach:** Bucket sort is optimal with O(n) time complexity.

---

## Why This Problem is Important

### Interview Relevance

- **Frequency**: Very commonly asked in technical interviews
- **Companies**: Google, Facebook, Amazon, Microsoft
- **Difficulty**: Medium
- **Concepts Tested**: Bucket Sort, Heap, Hash Map, Frequency Counting

### Learning Outcomes

1. **Bucket Sort**: Learn when bucket sort is applicable
2. **Heap Usage**: Understand heap for top-k problems
3. **Optimization**: Achieve better than O(n log n)

---

## Related Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Kth Largest Element | [Link](https://leetcode.com/problems/kth-largest-element-in-an-array/) | Find kth largest |
| Frequency Stack | [Link](https://leetcode.com/problems/maximum-frequency-stack/) | Stack with frequencies |
| Sort Characters by Frequency | [Link](https://leetcode.com/problems/sort-characters-by-frequency/) | Sort by frequency |

### Pattern Reference

For more detailed explanations of the Bucket Sort pattern, see:
- **[Bucket Sort Pattern](/patterns)**

---

## Video Tutorial Links

Here are helpful YouTube tutorials explaining the problem and solutions:

1. **[NeetCode - Top K Frequent Elements](https://www.youtube.com/watch?v=YPTqJI wGqE)** - Clear explanation
2. **[Top K Frequent - LeetCode 347](https://www.youtube.com/watch?v=YPTqJI wGqE)** - Detailed walkthrough
3. **[Bucket Sort Explained](https://www.youtube.com/watch?v=7uG2sU6sJvo)** - Understanding bucket sort

---

## Follow-up Questions

### Q1: How would you handle the case where k equals the number of unique elements?

**Answer:** Return all unique elements sorted by frequency.

---

### Q2: What if you needed the elements in sorted order by frequency?

**Answer:** After getting the result, sort by frequency descending.

---

### Q3: Can you solve this using quickselect?

**Answer:** Yes, you can use quickselect with frequency as the key, achieving O(n) average time.

---

### Q4: How would you handle ties (same frequency)?

**Answer:** The problem guarantees unique answers, but if ties existed, you could return any of the tied elements.

---

## Common Pitfalls

### 1. Wrong Bucket Index
**Issue**: Using element as bucket index instead of frequency.

**Solution**: Bucket index = frequency, bucket value = elements.

### 2. Not Handling k
**Issue**: Not returning exactly k elements.

**Solution**: Collect elements from highest frequency until k.

### 3. Order of Result
**Issue**: Not maintaining any order in result.

**Solution**: Any order is typically accepted per problem statement.

### 4. Space Complexity
**Issue**: Creating too many buckets.

**Solution**: Only need n+1 buckets (frequency 0 to n).

---

## Summary

The **Top K Frequent Elements** problem demonstrates the **Bucket Sort** pattern for frequency-based selection.

### Key Takeaways

1. **Bucket Sort**: Use buckets indexed by frequency for O(n)
2. **Frequency Range**: Bounded (1 to n) enables direct indexing
3. **Two Approaches**: Bucket sort O(n) or heap O(n log k)
4. **Follow Up**: O(n log n) is not sufficient for large n

### Pattern Summary

This problem exemplifies the **Bucket Sort** pattern, characterized by:
- Direct indexing by key (frequency)
- Bounded range enables O(n)
- Alternative with heap for top-k selection

For more details on this pattern, see the **[Bucket Sort Pattern](/patterns)**.

---

## Additional Resources

- [LeetCode Problem 347](https://leetcode.com/problems/top-k-frequent-elements/) - Official problem page
- [Bucket Sort - GeeksforGeeks](https://www.geeksforgeeks.org/bucket-sort-2/) - Detailed explanation
- [Pattern: Bucket Sort](/patterns) - Comprehensive pattern guide
