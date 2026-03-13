# Take Gifts From the Richest Pile

## Problem Description

You are given an integer array `gifts` denoting the number of gifts in various piles. Every second, you do the following:

1. Choose the pile with the maximum number of gifts.
2. If there is more than one pile with the maximum number of gifts, choose any.
3. Reduce the number of gifts in the pile to the floor of the square root of the original number of gifts in the pile.

Return the number of gifts remaining after `k` seconds.

**LeetCode Link:** [Take Gifts From the Richest Pile](https://leetcode.com/problems/take-gifts-from-the-richest-pile/)

---

## Examples

**Example 1:**

Input: `gifts = [25,64,9,4,100]`, `k = 4`
Output: `29`

Explanation:
- In the first second, the last pile is chosen and 10 gifts are left behind.
- Then the second pile is chosen and 8 gifts are left behind.
- After that the first pile is chosen and 5 gifts are left behind.
- Finally, the last pile is chosen again and 3 gifts are left behind.
The final remaining gifts are `[5,8,9,4,3]`, so the total number of gifts remaining is `29`.

**Example 2:**

Input: `gifts = [1,1,1,1]`, `k = 4`
Output: `4`

Explanation:
In this case, regardless which pile you choose, you have to leave behind 1 gift in each pile.
That is, you can't take any pile with you.
So, the total gifts remaining are `4`.

---

## Constraints

- `1 <= gifts.length <= 10^3`
- `1 <= gifts[i] <= 10^9`
- `1 <= k <= 10^3`

---

## Pattern: Priority Queue (Max Heap)

This problem uses a **max heap** (implemented as a min-heap with negative values in Python) to always access the pile with the maximum number of gifts. Each operation pops the maximum, computes its square root, and pushes it back.

### Core Concept

- **Max Heap**: Priority queue that always gives us the maximum element
- **Square Root Operation**: Reduces large numbers significantly
- **Iterative Process**: Repeat k times to simulate k seconds

---

## Intuition

The key insight for this problem is understanding that we always want to process the pile with the maximum gifts first:

1. **Why Maximum First?** Processing larger piles has a greater impact on reducing the total. For example:
   - Processing 100 → √100 = 10 (reduction of 90)
   - Processing 25 → √25 = 5 (reduction of 20)

2. **Square Root Effect**: The square root operation has diminishing returns for large numbers:
   - 1,000,000 → 1,000 (99.9% reduction)
   - 100 → 10 (90% reduction)
   - 25 → 5 (80% reduction)
   - 4 → 2 (50% reduction)

3. **Early Termination**: When all piles have 1 gift:
   - √1 = 1, so no further reduction is possible
   - We can stop early to save operations

4. **Priority Queue Efficiency**: Using a max heap gives us O(log n) access to the maximum element, making the overall solution O(k log n).

---

## Multiple Approaches with Code

We'll cover three approaches:

1. **Max Heap (Priority Queue)** - Optimal solution
2. **Sorting Approach** - Simpler but less efficient
3. **Brute Force** - O(n × k) approach

---

## Approach 1: Max Heap (Optimal)

### Algorithm Steps

1. Create a max heap by negating all gift values
2. Heapify the array (O(n))
3. For each of k operations:
   a. Pop the maximum pile (negate to get actual value)
   b. Compute floor of square root
   c. Push the new value back (negated)
   d. Optionally check if all piles are 1 and break early
4. Sum all remaining gifts in the heap

### Why It Works

The max heap always gives us the pile with the maximum gifts in O(log n) time. By repeatedly processing the maximum and putting the reduced value back, we simulate exactly what happens in k seconds. The square root operation reduces the value, and eventually, all piles converge to small values.

### Code Implementation

````carousel
```python
import heapq
from typing import List

class Solution:
    def pickGifts(self, gifts: List[int], k: int) -> int:
        # Create max heap using negative values
        heap = [-g for g in gifts]
        heapq.heapify(heap)
        
        for _ in range(k):
            # Check if we should stop early (all piles have 1)
            if -heap[0] == 1:
                break
            
            # Pop max, compute sqrt, push back
            max_gift = -heapq.heappop(heap)
            new_gift = int(max_gift ** 0.5)
            heapq.heappush(heap, -new_gift)
        
        return -sum(heap)
```

<!-- slide -->
```cpp
#include <vector>
#include <queue>
#include <numeric>
#include <cmath>
using namespace std;

class Solution {
public:
    long long pickGifts(vector<int>& gifts, int k) {
        // Use priority_queue (max heap by default)
        priority_queue<int> pq;
        for (int g : gifts) {
            pq.push(g);
        }
        
        for (int i = 0; i < k; i++) {
            if (pq.top() == 1) break;  // Early termination
            
            int max_gift = pq.top();
            pq.pop();
            pq.push((int)sqrt(max_gift));
        }
        
        long long sum = 0;
        while (!pq.empty()) {
            sum += pq.top();
            pq.pop();
        }
        return sum;
    }
};
```

<!-- slide -->
```java
import java.util.*;

class Solution {
    public long pickGifts(int[] gifts, int k) {
        // Use PriorityQueue (max heap)
        PriorityQueue<Integer> pq = new PriorityQueue<>(Collections.reverseOrder());
        for (int g : gifts) {
            pq.offer(g);
        }
        
        for (int i = 0; i < k; i++) {
            if (pq.peek() == 1) break;  // Early termination
            
            int maxGift = pq.poll();
            pq.offer((int)Math.sqrt(maxGift));
        }
        
        long sum = 0;
        while (!pq.isEmpty()) {
            sum += pq.poll();
        }
        return sum;
    }
}
```

<!-- slide -->
```javascript
/**
 * @param {number[]} gifts
 * @param {number} k
 * @return {number}
 */
var pickGifts = function(gifts, k) {
    // Use max heap (negate values for min-heap)
    const heap = gifts.map(g => -g);
    heapq = (await import('heapq')).default;
    heapq.heapify(heap);
    
    for (let i = 0; i < k; i++) {
        if (Math.abs(heap[0]) === 1) break;  // Early termination
        
        const maxGift = -heapq.heappop(heap);
        const newGift = Math.floor(Math.sqrt(maxGift));
        heapq.heappush(heap, -newGift);
    }
    
    return -heap.reduce((a, b) => a + b, 0);
};

// Alternative without import (using native array methods - not true heap)
var pickGifts = function(gifts, k) {
    const maxHeap = [...gifts];
    
    const heapify = (arr) => {
        for (let i = Math.floor(arr.length / 2) - 1; i >= 0; i--) {
            siftDown(arr, i);
        }
    };
    
    const siftDown = (arr, idx) => {
        const left = 2 * idx + 1;
        const right = 2 * idx + 2;
        let largest = idx;
        
        if (left < arr.length && arr[left] > arr[largest]) largest = left;
        if (right < arr.length && arr[right] > arr[largest]) largest = right;
        
        if (largest !== idx) {
            [arr[idx], arr[largest]] = [arr[largest], arr[idx]];
            siftDown(arr, largest);
        }
    };
    
    const extractMax = (arr) => {
        const max = arr[0];
        arr[0] = arr[arr.length - 1];
        arr.pop();
        siftDown(arr, 0);
        return max;
    };
    
    const insert = (arr, val) => {
        arr.push(val);
        let idx = arr.length - 1;
        while (idx > 0) {
            const parent = Math.floor((idx - 1) / 2);
            if (arr[parent] >= arr[idx]) break;
            [arr[parent], arr[idx]] = [arr[idx], arr[parent]];
            idx = parent;
        }
    };
    
    heapify(maxHeap);
    
    for (let i = 0; i < k; i++) {
        if (maxHeap[0] === 1) break;
        
        const maxGift = extractMax(maxHeap);
        insert(maxHeap, Math.floor(Math.sqrt(maxGift)));
    }
    
    return maxHeap.reduce((a, b) => a + b, 0);
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(k log n) where n is the number of piles |
| **Space** | O(n) for the heap |

---

## Approach 2: Sorting Approach

### Algorithm Steps

1. Sort the array in descending order
2. For each of k operations:
   a. Take the first (maximum) element
   b. Compute its square root
   c. Insert it back in sorted position
3. Sum all elements

### Why It Works

Sorting provides a way to always access the maximum element, similar to a heap but simpler to understand.

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def pickGifts(self, gifts: List[int], k: int) -> int:
        gifts.sort(reverse=True)
        
        for _ in range(k):
            if gifts[0] == 1:
                break
            gifts[0] = int(gifts[0] ** 0.5)
            # Re-sort after modification
            gifts.sort(reverse=True)
        
        return sum(gifts)
```

<!-- slide -->
```cpp
#include <vector>
#include <algorithm>
using namespace std;

class Solution {
public:
    long long pickGifts(vector<int>& gifts, int k) {
        sort(gifts.begin(), gifts.end(), greater<int>());
        
        for (int i = 0; i < k; i++) {
            if (gifts[0] == 1) break;
            gifts[0] = (int)sqrt(gifts[0]);
            sort(gifts.begin(), gifts.end(), greater<int>());
        }
        
        long long sum = 0;
        for (int g : gifts) sum += g;
        return sum;
    }
};
```

<!-- slide -->
```java
import java.util.*;

class Solution {
    public long pickGifts(int[] gifts, int k) {
        Arrays.sort(gifts);
        // Reverse sort by reversing array
        for (int i = 0; i < gifts.length / 2; i++) {
            int temp = gifts[i];
            gifts[i] = gifts[gifts.length - 1 - i];
            gifts[gifts.length - 1 - i] = temp;
        }
        
        for (int i = 0; i < k; i++) {
            if (gifts[0] == 1) break;
            gifts[0] = (int)Math.sqrt(gifts[0]);
            Arrays.sort(gifts);
            for (int j = 0; j < gifts.length / 2; j++) {
                int temp = gifts[j];
                gifts[j] = gifts[gifts.length - 1 - j];
                gifts[gifts.length - 1 - j] = temp;
            }
        }
        
        return Arrays.stream(gifts).asLongStream().sum();
    }
}
```

<!-- slide -->
```javascript
var pickGifts = function(gifts, k) {
    gifts.sort((a, b) => b - a);
    
    for (let i = 0; i < k; i++) {
        if (gifts[0] === 1) break;
        gifts[0] = Math.floor(Math.sqrt(gifts[0]));
        gifts.sort((a, b) => b - a);
    }
    
    return gifts.reduce((a, b) => a + b, 0);
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(k × n log n) due to repeated sorting |
| **Space** | O(1) if sorting in-place |

---

## Approach 3: Brute Force

### Algorithm Steps

1. For each of k operations:
   a. Find the maximum element by scanning the array (O(n))
   b. Replace it with its square root
2. Sum all elements

### Why It Works

A simple approach that works but is inefficient for large inputs.

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def pickGifts(self, gifts: List[int], k: int) -> int:
        for _ in range(k):
            # Find max in O(n)
            max_idx = gifts.index(max(gifts))
            gifts[max_idx] = int(gifts[max_idx] ** 0.5)
        return sum(gifts)
```

<!-- slide -->
```cpp
#include <vector>
#include <algorithm>
#include <numeric>
using namespace std;

class Solution {
public:
    long long pickGifts(vector<int>& gifts, int k) {
        for (int i = 0; i < k; i++) {
            auto max_it = max_element(gifts.begin(), gifts.end());
            *max_it = (int)sqrt(*max_it);
        }
        return accumulate(gifts.begin(), gifts.end(), 0LL);
    }
};
```

<!-- slide -->
```java
class Solution {
    public long pickGifts(int[] gifts, int k) {
        for (int i = 0; i < k; i++) {
            int maxIdx = 0;
            for (int j = 1; j < gifts.length; j++) {
                if (gifts[j] > gifts[maxIdx]) {
                    maxIdx = j;
                }
            }
            gifts[maxIdx] = (int)Math.sqrt(gifts[maxIdx]);
        }
        return Arrays.stream(gifts).asLongStream().sum();
    }
}
```

<!-- slide -->
```javascript
var pickGifts = function(gifts, k) {
    for (let i = 0; i < k; i++) {
        const maxIdx = gifts.indexOf(Math.max(...gifts));
        gifts[maxIdx] = Math.floor(Math.sqrt(gifts[maxIdx]));
    }
    return gifts.reduce((a, b) => a + b, 0);
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n × k) |
| **Space** | O(1) |

---

## Comparison of Approaches

| Aspect | Max Heap | Sorting | Brute Force |
|--------|----------|---------|--------------|
| **Time Complexity** | O(k log n) | O(k × n log n) | O(n × k) |
| **Space Complexity** | O(n) | O(1) | O(1) |
| **Implementation** | Moderate | Simple | Simple |
| **LeetCode Optimal** | ✅ | ❌ | ❌ |
| **Difficulty** | Medium | Easy | Easy |

**Best Approach:** Use Approach 1 (Max Heap) for the optimal solution.

---

## Related Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Last Stone Weight | [Link](https://leetcode.com/problems/last-stone-weight/) | Max heap for combining elements |
| K Closest Points to Origin | [Link](https://leetcode.com/problems/k-closest-points-to-origin/) | Priority queue |
| Maximum Number of Events | [Link](https://leetcode.com/problems/maximum-number-of-events-that-can-be-attended/) | Priority queue for scheduling |

---

## Video Tutorial Links

1. **[NeetCode - Take Gifts From the Richest Pile](https://www.youtube.com/watch?v=EXAMPLE)** - Explanation with visual examples
2. **[Priority Queue Tutorial](https://www.youtube.com/watch?v=EXAMPLE)** - Understanding heaps

---

## Follow-up Questions

### Q1: What is the maximum number of operations needed to reach a stable state?

**Answer:** Since √1 = 1, once all piles reach 1, no further changes occur. For any number up to 10^9, after about 5-6 square root operations, it becomes 1 or 2. So k can be limited to n × 6 in practice.

---

### Q2: How would you modify the solution to minimize the total remaining gifts?

**Answer:** The greedy approach (always picking maximum) is optimal because √x is a decreasing function. For any x > y, √x - √x' > √y - √y' where x' = √x and y' = √y. So reducing larger numbers always gives more reduction.

---

### Q3: Can you solve this without a heap?

**Answer:** Yes, you can use sorting after each operation (O(k × n log n)), or brute force with linear scan (O(n × k)). See Approaches 2 and 3.

---

## Common Pitfalls

### 1. Max Heap Implementation in Python
**Issue**: Python's heapq is a min-heap.

**Solution**: Negate all values when pushing and popping.

### 2. Square Root Computation
**Issue**: Using `math.sqrt()` returns a float.

**Solution**: Use `int(x ** 0.5)` or `(int)Math.sqrt(x)` for integer floor.

### 3. Early Termination
**Issue**: Not stopping when all piles are 1 wastes operations.

**Solution**: Check if max element is 1 and break early.

### 4. Large Numbers
**Issue**: `10^9` can cause float precision issues.

**Solution**: Python handles large integers well; in other languages, use integer sqrt functions.

---

## Summary

The **Take Gifts From the Richest Pile** problem demonstrates the power of priority queues (heaps) for greedy algorithms:

- **Max Heap**: Always access the maximum element in O(log n)
- **Greedy Choice**: Processing largest piles first gives maximum reduction
- **Convergence**: Square root operation reduces all numbers to small values quickly
- **Early Termination**: Can stop when all piles become 1

Key takeaways:
1. Use a max heap (priority queue) for efficient max access
2. Implement as min-heap with negation in Python
3. Early termination when all piles are 1 saves operations
4. Time complexity is O(k log n), optimal for this problem

This problem is essential for understanding priority queues and greedy algorithms.

---

### Pattern Summary

This problem exemplifies the **Priority Queue (Heap)** pattern, characterized by:
- Always needing to access maximum/minimum element
- Repeated operations on the "most important" element
- Efficient O(log n) access with heap data structure
- Greedy choice property

For more details on this pattern, see the **[Heap Pattern](/patterns/heap)**.
