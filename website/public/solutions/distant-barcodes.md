# Distant Barcodes

## Problem Description

In a warehouse, there is a row of barcodes, where the ith barcode is `barcodes[i]`.
Rearrange the barcodes so that no two adjacent barcodes are equal. You may return any answer, and it is guaranteed an answer exists.

**Link to problem:** [Distant Barcodes - LeetCode 1054](https://leetcode.com/problems/distant-barcodes/)

## Constraints
- `1 <= barcodes.length <= 10000`
- `1 <= barcodes[i] <= 10000`

---

## Pattern: Greedy with Max Heap

This problem is a classic example of the **Greedy with Priority Queue** pattern. The strategy is to always place the most frequent element first to minimize conflicts.

### Core Concept

The fundamental idea is:
- **Frequency-based**: The most frequent barcodes need more space
- **Greedy Choice**: Always place the most frequent remaining barcode
- **Two Slots**: Fill positions 0, 2, 4... first, then 1, 3, 5...

---

## Examples

### Example

**Input:**
```
barcodes = [1,1,1,2,2,2]
```

**Output:**
```
[2,1,2,1,2,1]
```

**Explanation:** No two adjacent barcodes are equal.

### Example 2

**Input:**
```
barcodes = [1,1,1,1,2,2,3,3]
```

**Output:**
```
[1,3,1,3,1,2,1,2]
```

**Explanation:** Another valid arrangement.

---

## Intuition

The key insight is to always use the most frequent element first. By placing the most frequent barcode in every other position, we ensure there's always room for other elements between occurrences.

### Why Greedy Works

- The most frequent element has the hardest constraint (needs most space)
- By satisfying its constraint first, we automatically satisfy others
- This is a classic "schedule most constrained first" approach

---

## Multiple Approaches with Code

We'll cover three approaches:

1. **Max Heap (Greedy)** - O(n log k) time, O(k) space
2. **Sorting by Frequency** - O(n log n) time, O(n) space
3. **Cyclic Fill** - Alternative implementation

---

## Approach 1: Max Heap (Greedy) - Optimal

This is the most common and efficient approach using a max heap.

### Algorithm Steps

1. Count frequency of each barcode
2. Create a max heap (by frequency)
3. Extract most frequent barcode, place it in result
4. If it matches the last placed, get the next most frequent
5. Put back the extracted barcode with decremented count
6. Repeat until heap is empty

### Code Implementation

````carousel
```python
from typing import List
import heapq
from collections import Counter

class Solution:
    def rearrangeBarcodes(self, barcodes: List[int]) -> List[int]:
        """
        Rearrange barcodes using max heap greedy approach.
        
        Args:
            barcodes: List of barcodes
            
        Returns:
            Rearranged barcodes with no adjacent equals
        """
        count = Counter(barcodes)
        heap = [(-c, b) for b, c in count.items()]
        heapq.heapify(heap)
        result = []
        
        while heap:
            neg_count, num = heapq.heappop(heap)
            
            # If matches last element, get next
            if result and result[-1] == num:
                if not heap:
                    break  # Should not happen per problem guarantee
                neg_count2, num2 = heapq.heappop(heap)
                result.append(num2)
                
                # Put back with decremented count
                if neg_count2 + 1 < 0:
                    heapq.heappush(heap, (neg_count2 + 1, num2))
                
                # Put back original
                heapq.heappush(heap, (neg_count, num))
            else:
                result.append(num)
                if neg_count + 1 < 0:
                    heapq.heappush(heap, (neg_count + 1, num))
        
        return result
```

<!-- slide -->
```cpp
class Solution {
public:
    vector<int> rearrangeBarcodes(vector<int>& barcodes) {
        /**
         * Rearrange barcodes using max heap greedy approach.
         * 
         * Args:
         *     barcodes: List of barcodes
         * 
         * Returns:
         *     Rearranged barcodes with no adjacent equals
         */
        unordered_map<int, int> count;
        for (int b : barcodes) count[b]++;
        
        // Max heap using negative counts
        priority_queue<pair<int, int>> pq; // (-count, barcode)
        for (auto& p : count) {
            pq.push({-p.second, p.first});
        }
        
        vector<int> result;
        while (!pq.empty()) {
            auto [negCount, num] = pq.top();
            pq.pop();
            
            if (!result.empty() && result.back() == num) {
                if (pq.empty()) break; // Should not happen
                auto [negCount2, num2] = pq.top();
                pq.pop();
                
                result.push_back(num2);
                if (negCount2 + 1 < 0) {
                    pq.push({negCount2 + 1, num2});
                }
                pq.push({negCount, num});
            } else {
                result.push_back(num);
                if (negCount + 1 < 0) {
                    pq.push({negCount + 1, num});
                }
            }
        }
        
        return result;
    }
};
```

<!-- slide -->
```java
class Solution {
    public int[] rearrangeBarcodes(int[] barcodes) {
        /**
         * Rearrange barcodes using max heap greedy approach.
         * 
         * Args:
         *     barcodes: List of barcodes
         * 
         * Returns:
         *     Rearranged barcodes with no adjacent equals
         */
        Map<Integer, Integer> count = new HashMap<>();
        for (int b : barcodes) {
            count.put(b, count.getOrDefault(b, 0) + 1);
        }
        
        // Max heap by frequency
        PriorityQueue<int[]> pq = new PriorityQueue<>((a, b) -> b[0] - a[0]);
        for (Map.Entry<Integer, Integer> entry : count.entrySet()) {
            pq.offer(new int[]{entry.getValue(), entry.getKey()});
        }
        
        int[] result = new int[barcodes.length];
        int i = 0;
        
        while (!pq.isEmpty()) {
            int[] top = pq.poll();
            int freq = top[0];
            int num = top[1];
            
            if (i > 0 && result[i - 1] == num) {
                // Get next element
                int[] next = pq.poll();
                result[i] = next[1];
                i++;
                
                if (next[0] - 1 > 0) {
                    pq.offer(new int[]{next[0] - 1, next[1]});
                }
                pq.offer(top);
            } else {
                result[i] = num;
                i++;
                if (freq - 1 > 0) {
                    pq.offer(new int[]{freq - 1, num});
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
 * Rearrange barcodes using max heap greedy approach.
 * 
 * @param {number[]} barcodes - List of barcodes
 * @return {number[]} - Rearranged barcodes with no adjacent equals
 */
var rearrangeBarcodes = function(barcodes) {
    const count = {};
    for (const b of barcodes) {
        count[b] = (count[b] || 0) + 1;
    }
    
    // Max heap
    const heap = Object.entries(count).map(([num, c]) => [-c, parseInt(num)]);
    heap.sort((a, b) => a[0] - b[0]);
    
    const result = [];
    
    while (heap.length) {
        let [negCount, num] = heap.pop();
        
        if (result.length > 0 && result[result.length - 1] === num) {
            if (heap.length === 0) break;
            let [negCount2, num2] = heap.pop();
            result.push(num2);
            
            if (negCount2 + 1 < 0) {
                heap.push([negCount2 + 1, num2]);
                heap.sort((a, b) => a[0] - b[0]);
            }
            
            heap.push([negCount, num]);
            heap.sort((a, b) => a[0] - b[0]);
        } else {
            result.push(num);
            if (negCount + 1 < 0) {
                heap.push([negCount + 1, num]);
                heap.sort((a, b) => a[0] - b[0]);
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
| **Time** | O(n log k) - where k is number of unique barcodes |
| **Space** | O(k) - for heap and count |

---

## Approach 2: Sorting by Frequency

Sort by frequency and then fill positions.

### Algorithm Steps

1. Count frequency of each barcode
2. Sort barcodes by frequency (descending)
3. Split into even and odd positions
4. Interleave the two halves

### Code Implementation

````carousel
```python
from typing import List
from collections import Counter

class Solution:
    def rearrangeBarcodes_sort(self, barcodes: List[int]) -> List[int]:
        """
        Rearrange by sorting based on frequency.
        """
        freq = sorted(Counter(barcodes).items(), key=lambda x: -x[1])
        
        result = [0] * len(barcodes)
        idx = 0
        
        for num, count in freq:
            for _ in range(count):
                result[idx] = num
                idx += 2
                if idx >= len(barcodes):
                    idx = 1
        
        return result
```

<!-- slide -->
```cpp
class Solution {
public:
    vector<int> rearrangeBarcodes(vector<int>& barcodes) {
        unordered_map<int, int> count;
        for (int b : barcodes) count[b]++;
        
        sort(barcodes.begin(), barcodes.end(), 
             [&](int a, int b) {
                 return count[a] > count[b];
             });
        
        vector<int> result(barcodes.size());
        int idx = 0;
        for (int b : barcodes) {
            result[idx] = b;
            idx += 2;
            if (idx >= result.size()) idx = 1;
        }
        return result;
    }
};
```

<!-- slide -->
```java
class Solution {
    public int[] rearrangeBarcodes(int[] barcodes) {
        Map<Integer, Integer> count = new HashMap<>();
        for (int b : barcodes) {
            count.put(b, count.getOrDefault(b, 0) + 1);
        }
        
        Arrays.sort(barcodes, (a, b) -> count.get(b) - count.get(a));
        
        int[] result = new int[barcodes.length];
        int idx = 0;
        for (int b : barcodes) {
            result[idx] = b;
            idx += 2;
            if (idx >= result.length) idx = 1;
        }
        return result;
    }
}
```

<!-- slide -->
```javascript
/**
 * Rearrange by sorting based on frequency.
 * 
 * @param {number[]} barcodes - List of barcodes
 * @return {number[]} - Rearranged barcodes
 */
var rearrangeBarcodes = function(barcodes) {
    const count = {};
    for (const b of barcodes) {
        count[b] = (count[b] || 0) + 1;
    }
    
    barcodes.sort((a, b) => count[b] - count[a]);
    
    const result = new Array(barcodes.length);
    let idx = 0;
    for (const b of barcodes) {
        result[idx] = b;
        idx += 2;
        if (idx >= result.length) idx = 1;
    }
    return result;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n log n) |
| **Space** | O(n) |

---

## Comparison of Approaches

| Aspect | Max Heap | Sorting | Cyclic Fill |
|--------|----------|---------|-------------|
| **Time Complexity** | O(n log k) | O(n log n) | O(n log n) |
| **Space Complexity** | O(k) | O(n) | O(n) |
| **Implementation** | Moderate | Simple | Simple |
| **LeetCode Optimal** | ✅ Yes | ✅ Yes | ✅ Yes |
| **Best For** | Large k | Simplicity | Understanding |

**Best Approach:** Max heap is optimal for large number of unique elements.

---

## Why Greedy Works

The greedy approach works because:
1. The most frequent element has the hardest constraint
2. By placing it first (every other position), we ensure enough space
3. This naturally leaves room for all other elements
4. It's provably optimal: any valid arrangement must separate the most frequent elements

---

## Related Problems

Based on similar themes (greedy, frequency sorting):

### Medium Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Reorganize String | [Link](https://leetcode.com/problems/reorganize-string/) | Similar problem |
| Task Scheduler | [Link](https://leetcode.com/problems/task-scheduler/) | Scheduling with constraints |
| Rearrange String k Distance Apart | [Link](https://leetcode.com/problems/rearrange-string-k-distance-apart/) | Similar to task scheduler |

### Hard Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Minimum Number of K Consecutive Bit Flips | [Link](https://leetcode.com/problems/minimum-number-of-k-consecutive-bit-flips/) | Advanced greedy |

### Pattern Reference

For more detailed explanations of the Greedy pattern, see:
- **[Greedy - Frequency Based](/patterns/greedy-frequency)**

---

## Video Tutorial Links

Here are helpful YouTube tutorials explaining the problem and solutions:

### Greedy Approaches

- [NeetCode - Distant Barcodes](https://www.youtube.com/watch?v=v3iF1R6gQ7A) - Clear explanation
- [Back to Back SWE - Reorganize String](https://www.youtube.com/watch?v=vF__6gJln6k) - Similar problem
- [LeetCode Official Solution](https://www.youtube.com/watch?v=1JBPgMTdQQs) - Official solution

---

## Follow-up Questions

### Q1: What if the most frequent element appears more than (n+1)/2 times?

**Answer:** The problem guarantees a solution exists, so this won't happen. If it did, no valid arrangement would be possible.

---

### Q2: How does this differ from the Reorganize String problem?

**Answer:** They're essentially the same problem! Distant Barcodes is a variant where adjacent elements just need to be different, not separated by k positions.

---

### Q3: Can you do it in O(n) time?

**Answer:** With counting sort, yes! Since barcodes[i] <= 10000, we can use bucket sort for O(n) time and O(max_value) space.

---

### Q4: What edge cases should be tested?

**Answer:**
- All same barcodes (impossible - won't be in input)
- All unique barcodes
- One very frequent barcode, rest unique
- Two equally frequent barcodes

---

### Q5: Why do we fill even positions first?

**Answer:** By filling positions 0, 2, 4... first, we create maximum gaps between elements, which provides the best chance to avoid adjacent duplicates.

---

## Common Pitfalls

### 1. Not Handling Frequency Decrease
**Issue**: Forgetting to decrement frequency after using an element.

**Solution**: Always push back with decremented count after using an element.

### 2. Matching Last Element
**Issue**: Not checking if the top element matches the last placed element.

**Solution**: Always check and get the second element if there's a conflict.

### 3. Empty Heap Check
**Issue**: Not handling the edge case when heap has only one element.

**Solution**: The problem guarantees a solution exists, so this case won't happen.

---

## Summary

The **Distant Barcodes** problem demonstrates greedy with frequency-based scheduling:

- **Max Heap**: Optimal with O(n log k) time
- **Sorting**: Simple with O(n log n) time
- **Cyclic Fill**: Alternative implementation

The key insight is to always place the most frequent element first, creating maximum separation.

This problem is an excellent example of the greedy approach when combined with priority queues.

### Pattern Summary

This problem exemplifies the **Greedy with Priority Queue** pattern, which is characterized by:
- Always satisfying the most constrained element first
- Using a heap to efficiently get the "most constrained" element
- Proving optimality through exchange arguments

For more details on this pattern, see the **[Greedy - Frequency Based](/patterns/greedy-frequency)**.

---

## Additional Resources

- [LeetCode Problem Discussion](https://leetcode.com/problems/distant-barcodes/discuss/) - Community solutions
- [Greedy Algorithm - GeeksforGeeks](https://www.geeksforgeeks.org/greedy-algorithms/) - Understanding greedy
- [Priority Queue - Wikipedia](https://en.wikipedia.org/wiki/Priority_queue) - Heap fundamentals
