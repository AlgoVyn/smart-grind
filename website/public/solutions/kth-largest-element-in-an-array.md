# Kth Largest Element In An Array

## Problem Description

Given an integer array `nums` and an integer `k`, return the `kth` largest element in the array.

Note that it is the `kth` largest element in the sorted order, not the `kth` distinct element.

Can you solve it without sorting?

This is **LeetCode Problem #215** and is classified as a Medium difficulty problem. It is a fundamental problem that appears frequently in technical interviews and demonstrates understanding of various algorithmic paradigms including sorting, heaps, and divide-and-conquer.

### Understanding the Problem

The challenge is to find the kth largest element in an array, which is equivalent to:
- Finding the element at index `k-1` when the array is sorted in descending order
- Finding the element at index `n-k` when the array is sorted in ascending order

For example:
- In array `[3,2,1,5,6,4]` with k=2, the 2nd largest element is `5`
- In array `[3,2,3,1,2,4,5,5,6]` with k=4, the 4th largest element is `4`

### Why This Problem Matters

This problem tests several important algorithmic concepts:
- **Sorting algorithms** - Basic approach
- **Heap data structure** - Using priority queues
- **Quickselect algorithm** - Divide and conquer optimization
- **Order statistics** - Finding kth element efficiently

It's frequently asked by top tech companies including Google, Amazon, Meta, Microsoft, and Apple.

---

## Constraints

| Constraint | Description | Importance |
|------------|-------------|------------|
| `1 <= k <= nums.length <= 10^5` | Valid range for k and array size | Ensures k is always valid |
| `-10^4 <= nums[i] <= 10^4` | Element value range | Standard integer range |
| Need O(n) solution preferred | Time complexity expectation | Tests optimization skills |

---

## Examples

### Example 1:

**Input:** `nums = [3,2,1,5,6,4]`, `k = 2`  
**Output:** `5`

**Explanation:** 
- Sorted array in descending: [6, 5, 4, 3, 2, 1]
- 2nd largest element = 5

---

### Example 2:

**Input:** `nums = [3,2,3,1,2,4,5,5,6]`, `k = 4`  
**Output:** `4`

**Explanation:**
- Sorted array in descending: [6, 5, 5, 4, 3, 3, 2, 2, 1]
- 4th largest element = 4

---

### Example 3:

**Input:** `nums = [1]`, `k = 1`  
**Output:** `1`

---

## Follow up

Could you solve it without sorting? An O(n) time complexity solution is expected.

---

## Intuition

The key insight is that we don't need to fully sort the array to find the kth largest element. We only need to partially order the array.

### Key Observations

1. **Sorting Approach**: If we sort the array in descending order, the kth element is at index k-1. This is O(n log n) but works.

2. **Heap Approach**: A min-heap of size k keeps track of the k largest elements. The top of the heap is the kth largest.

3. **Quickselect Approach**: Similar to quicksort, we can partition the array and recursively focus on only one half, achieving average O(n) time.

4. **Order Statistics**: The median is a special case of order statistics (k = n/2). This problem generalizes that concept.

### Why Not Just Sort?

While sorting gives us the answer, it's inefficient because:
- We need only ONE element, not the entire sorted order
- Sorting is O(n log n) which is suboptimal for this specific problem
- We can use divide-and-conquer to achieve O(n) on average

---

## Multiple Approaches

### Approach 1: Sorting (Simple) ⭐

The simplest approach is to sort the array and return the kth element.

#### Algorithm

1. Sort the array in descending order (or ascending and use index n-k)
2. Return the element at index k-1

#### Implementation

````carousel
```python
from typing import List

class Solution:
    def findKthLargest(self, nums: List[int], k: int) -> int:
        """
        Find the kth largest element using sorting.
        
        Args:
            nums: List of integers
            k: The kth largest to find
            
        Returns:
            The kth largest element
        """
        # Sort in descending order and return k-1 index
        nums.sort(reverse=True)
        return nums[k - 1]
```
<!-- slide -->
```cpp
#include <vector>
#include <algorithm>
using namespace std;

class Solution {
public:
    int findKthLargest(vector<int>& nums, int k) {
        // Sort in descending order
        sort(nums.begin(), nums.end(), greater<int>());
        return nums[k - 1];
    }
};
```
<!-- slide -->
```java
import java.util.Arrays;

class Solution {
    public int findKthLargest(int[] nums, int k) {
        // Sort in descending order
        Arrays.sort(nums);
        return nums[nums.length - k];
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
var findKthLargest = function(nums, k) {
    // Sort in ascending order and return nums[n - k]
    nums.sort((a, b) => a - b);
    return nums[nums.length - k];
};
```
````

**Time Complexity:** O(n log n) - Sorting dominates  
**Space Complexity:** O(1) if in-place, O(n) if using extra space for sorting

---

### Approach 2: Quickselect (Average O(n)) ⭐⭐

Quickselect is a divide-and-conquer algorithm that selects the kth largest by partitioning the array.

#### Algorithm

1. Choose a pivot element
2. Partition the array around the pivot (like in quicksort)
3. After partitioning, the pivot is in its final sorted position
4. If pivot is at index k-1 (in descending order), return it
5. If pivot index > k-1, search left partition; otherwise search right

#### Implementation

````carousel
```python
from typing import List
import random

class Solution:
    def findKthLargest(self, nums: List[int], k: int) -> int:
        """
        Find the kth largest element using quickselect.
        
        Args:
            nums: List of integers
            k: The kth largest to find
            
        Returns:
            The kth largest element
        """
        # Convert to (n-k)th smallest problem
        return self.quickselect(nums, 0, len(nums) - 1, len(nums) - k)
    
    def quickselect(self, nums: List[int], left: int, right: int, target: int) -> int:
        """
        Quickselect algorithm to find the target index element.
        """
        if left == right:
            return nums[left]
        
        # Random pivot selection to avoid worst case
        pivot_idx = random.randint(left, right)
        pivot_idx = self.partition(nums, left, right, pivot_idx)
        
        if pivot_idx == target:
            return nums[pivot_idx]
        elif pivot_idx > target:
            return self.quickselect(nums, left, pivot_idx - 1, target)
        else:
            return self.quickselect(nums, pivot_idx + 1, right, target)
    
    def partition(self, nums: List[int], left: int, right: int, pivot_idx: int) -> int:
        """
        Partition array around pivot, returning pivot's final position.
        Moves all elements greater than pivot to the left.
        """
        pivot_val = nums[pivot_idx]
        # Move pivot to end
        nums[pivot_idx], nums[right] = nums[right], nums[pivot_idx]
        store_idx = left
        
        for i in range(left, right):
            if nums[i] < pivot_val:
                nums[store_idx], nums[i] = nums[i], nums[store_idx]
                store_idx += 1
        
        # Move pivot to its final place
        nums[right], nums[store_idx] = nums[store_idx], nums[right]
        return store_idx
```
<!-- slide -->
```cpp
#include <vector>
#include <cstdlib>
#include <ctime>
using namespace std;

class Solution {
public:
    int findKthLargest(vector<int>& nums, int k) {
        srand(time(0));
        int n = nums.size();
        return quickselect(nums, 0, n - 1, n - k);
    }
    
private:
    int quickselect(vector<int>& nums, int left, int right, int target) {
        if (left == right) return nums[left];
        
        int pivotIdx = left + rand() % (right - left + 1);
        pivotIdx = partition(nums, left, right, pivotIdx);
        
        if (pivotIdx == target) {
            return nums[pivotIdx];
        } else if (pivotIdx > target) {
            return quickselect(nums, left, pivotIdx - 1, target);
        } else {
            return quickselect(nums, pivotIdx + 1, right, target);
        }
    }
    
    int partition(vector<int>& nums, int left, int right, int pivotIdx) {
        int pivotVal = nums[pivotIdx];
        swap(nums[pivotIdx], nums[right]);
        int storeIdx = left;
        
        for (int i = left; i < right; i++) {
            if (nums[i] < pivotVal) {
                swap(nums[storeIdx], nums[i]);
                storeIdx++;
            }
        }
        
        swap(nums[right], nums[storeIdx]);
        return storeIdx;
    }
};
```
<!-- slide -->
```java
import java.util.Random;

class Solution {
    private Random random = new Random();
    
    public int findKthLargest(int[] nums, int k) {
        int n = nums.length;
        return quickselect(nums, 0, n - 1, n - k);
    }
    
    private int quickselect(int[] nums, int left, int right, int target) {
        if (left == right) return nums[left];
        
        int pivotIdx = left + random.nextInt(right - left + 1);
        pivotIdx = partition(nums, left, right, pivotIdx);
        
        if (pivotIdx == target) {
            return nums[pivotIdx];
        } else if (pivotIdx > target) {
            return quickselect(nums, left, pivotIdx - 1, target);
        } else {
            return quickselect(nums, pivotIdx + 1, right, target);
        }
    }
    
    private int partition(int[] nums, int left, int right, int pivotIdx) {
        int pivotVal = nums[pivotIdx];
        swap(nums, pivotIdx, right);
        int storeIdx = left;
        
        for (int i = left; i < right; i++) {
            if (nums[i] < pivotVal) {
                swap(nums, storeIdx, i);
                storeIdx++;
            }
        }
        
        swap(nums, right, storeIdx);
        return storeIdx;
    }
    
    private void swap(int[] nums, int i, int j) {
        int temp = nums[i];
        nums[i] = nums[j];
        nums[j] = temp;
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
var findKthLargest = function(nums, k) {
    const n = nums.length;
    return quickselect(nums, 0, n - 1, n - k);
    
    function quickselect(left, right, target) {
        if (left === right) return nums[left];
        
        const pivotIdx = left + Math.floor(Math.random() * (right - left + 1));
        const newPivotIdx = partition(left, right, pivotIdx);
        
        if (newPivotIdx === target) {
            return nums[newPivotIdx];
        } else if (newPivotIdx > target) {
            return quickselect(left, newPivotIdx - 1, target);
        } else {
            return quickselect(newPivotIdx + 1, right, target);
        }
    }
    
    function partition(left, right, pivotIdx) {
        const pivotVal = nums[pivotIdx];
        // Move pivot to end
        [nums[pivotIdx], nums[right]] = [nums[right], nums[pivotIdx]];
        let storeIdx = left;
        
        for (let i = left; i < right; i++) {
            if (nums[i] < pivotVal) {
                [nums[storeIdx], nums[i]] = [nums[i], nums[storeIdx]];
                storeIdx++;
            }
        }
        
        // Move pivot to final position
        [nums[right], nums[storeIdx]] = [nums[storeIdx], nums[right]];
        return storeIdx;
    }
};
```
````

**Time Complexity:** O(n) average, O(n²) worst case  
**Space Complexity:** O(1) - In-place partitioning

---

### Approach 3: Min-Heap (O(n + k log n)) ⭐⭐

Use a min-heap of size k to track the k largest elements.

#### Algorithm

1. Create a min-heap of size k
2. Insert first k elements into the heap
3. For remaining elements, if larger than heap top, replace
4. The top of the heap is the kth largest element

#### Implementation

````carousel
```python
from typing import List
import heapq

class Solution:
    def findKthLargest(self, nums: List[int], k: int) -> int:
        """
        Find the kth largest element using a min-heap.
        
        Args:
            nums: List of integers
            k: The kth largest to find
            
        Returns:
            The kth largest element
        """
        # Create a min-heap of size k
        min_heap = nums[:k]
        heapq.heapify(min_heap)
        
        # Process remaining elements
        for i in range(k, len(nums)):
            if nums[i] > min_heap[0]:
                heapq.heapreplace(min_heap, nums[i])
        
        # Top of heap is kth largest
        return min_heap[0]
```
<!-- slide -->
```cpp
#include <vector>
#include <queue>
using namespace std;

class Solution {
public:
    int findKthLargest(vector<int>& nums, int k) {
        // Min-heap of size k
        priority_queue<int, vector<int>, greater<int>> minHeap;
        
        // Add first k elements
        for (int i = 0; i < k; i++) {
            minHeap.push(nums[i]);
        }
        
        // Process remaining elements
        for (int i = k; i < nums.size(); i++) {
            if (nums[i] > minHeap.top()) {
                minHeap.pop();
                minHeap.push(nums[i]);
            }
        }
        
        return minHeap.top();
    }
};
```
<!-- slide -->
```java
import java.util.PriorityQueue;

class Solution {
    public int findKthLargest(int[] nums, int k) {
        // Min-heap (PriorityQueue in Java is min-heap by default)
        PriorityQueue<Integer> minHeap = new PriorityQueue<>();
        
        // Add first k elements
        for (int i = 0; i < k; i++) {
            minHeap.offer(nums[i]);
        }
        
        // Process remaining elements
        for (int i = k; i < nums.length; i++) {
            if (nums[i] > minHeap.peek()) {
                minHeap.poll();
                minHeap.offer(nums[i]);
            }
        }
        
        return minHeap.peek();
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
var findKthLargest = function(nums, k) {
    // Min-heap using a custom comparator
    const minHeap = new MinHeap();
    
    // Add first k elements
    for (let i = 0; i < k; i++) {
        minHeap.insert(nums[i]);
    }
    
    // Process remaining elements
    for (let i = k; i < nums.length; i++) {
        if (nums[i] > minHeap.peek()) {
            minHeap.replace(nums[i]);
        }
    }
    
    return minHeap.peek();
};

// MinHeap implementation for JavaScript
class MinHeap {
    constructor() {
        this.heap = [];
    }
    
    insert(val) {
        this.heap.push(val);
        this.bubbleUp(this.heap.length - 1);
    }
    
    peek() {
        return this.heap[0];
    }
    
    replace(val) {
        this.heap[0] = val;
        this.bubbleDown(0);
    }
    
    bubbleUp(idx) {
        while (idx > 0) {
            const parentIdx = Math.floor((idx - 1) / 2);
            if (this.heap[parentIdx] <= this.heap[idx]) break;
            [this.heap[parentIdx], this.heap[idx]] = [this.heap[idx], this.heap[parentIdx]];
            idx = parentIdx;
        }
    }
    
    bubbleDown(idx) {
        const length = this.heap.length;
        while (true) {
            const leftChild = 2 * idx + 1;
            const rightChild = 2 * idx + 2;
            let smallest = idx;
            
            if (leftChild < length && this.heap[leftChild] < this.heap[smallest]) {
                smallest = leftChild;
            }
            if (rightChild < length && this.heap[rightChild] < this.heap[smallest]) {
                smallest = rightChild;
            }
            if (smallest === idx) break;
            
            [this.heap[idx], this.heap[smallest]] = [this.heap[smallest], this.heap[idx]];
            idx = smallest;
        }
    }
}
```
````

**Time Complexity:** O(n + k log n) - Building heap is O(k), each of n-k elements does O(log k)  
**Space Complexity:** O(k) - For the heap

---

### Approach 4: Max-Heap (O(n log n))

Insert all elements into a max-heap and extract k times.

#### Algorithm

1. Create a max-heap with all elements
2. Extract maximum k times
3. The kth extracted element is the answer

#### Implementation

````carousel
```python
from typing import List
import heapq

class Solution:
    def findKthLargest(self, nums: List[int], k: int) -> int:
        """
        Find the kth largest element using a max-heap.
        
        Args:
            nums: List of integers
            k: The kth largest to find
            
        Returns:
            The kth largest element
        """
        # Convert to max-heap by negating values
        max_heap = [-num for num in nums]
        heapq.heapify(max_heap)
        
        # Extract k times
        for _ in range(k):
            result = -heapq.heappop(max_heap)
        
        return result
```
<!-- slide -->
```cpp
#include <vector>
#include <queue>
using namespace std;

class Solution {
public:
    int findKthLargest(vector<int>& nums, int k) {
        // Max-heap
        priority_queue<int> maxHeap(nums.begin(), nums.end());
        
        // Extract k times
        for (int i = 0; i < k - 1; i++) {
            maxHeap.pop();
        }
        
        return maxHeap.top();
    }
};
```
<!-- slide -->
```java
import java.util.PriorityQueue;

class Solution {
    public int findKthLargest(int[] nums, int k) {
        // Max-heap (use Collections.reverseOrder for max)
        PriorityQueue<Integer> maxHeap = new PriorityQueue<>(Collections.reverseOrder());
        
        // Add all elements
        for (int num : nums) {
            maxHeap.offer(num);
        }
        
        // Extract k times
        for (int i = 0; i < k - 1; i++) {
            maxHeap.poll();
        }
        
        return maxHeap.peek();
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
var findKthLargest = function(nums, k) {
    // Max-heap using custom comparator
    const maxHeap = new MaxHeap();
    
    // Add all elements
    for (const num of nums) {
        maxHeap.insert(num);
    }
    
    // Extract k times
    for (let i = 0; i < k - 1; i++) {
        maxHeap.extract();
    }
    
    return maxHeap.peek();
};

// MaxHeap implementation for JavaScript
class MaxHeap {
    constructor() {
        this.heap = [];
    }
    
    insert(val) {
        this.heap.push(val);
        this.bubbleUp(this.heap.length - 1);
    }
    
    peek() {
        return this.heap[0];
    }
    
    extract() {
        const max = this.heap[0];
        const last = this.heap.pop();
        if (this.heap.length > 0) {
            this.heap[0] = last;
            this.bubbleDown(0);
        }
        return max;
    }
    
    bubbleUp(idx) {
        while (idx > 0) {
            const parentIdx = Math.floor((idx - 1) / 2);
            if (this.heap[parentIdx] >= this.heap[idx]) break;
            [this.heap[parentIdx], this.heap[idx]] = [this.heap[idx], this.heap[parentIdx]];
            idx = parentIdx;
        }
    }
    
    bubbleDown(idx) {
        const length = this.heap.length;
        while (true) {
            const leftChild = 2 * idx + 1;
            const rightChild = 2 * idx + 2;
            let largest = idx;
            
            if (leftChild < length && this.heap[leftChild] > this.heap[largest]) {
                largest = leftChild;
            }
            if (rightChild < length && this.heap[rightChild] > this.heap[largest]) {
                largest = rightChild;
            }
            if (largest === idx) break;
            
            [this.heap[idx], this.heap[largest]] = [this.heap[largest], this.heap[idx]];
            idx = largest;
        }
    }
}
```
````

**Time Complexity:** O(n + k log n) - Building heap O(n), each of k extracts O(log n)  
**Space Complexity:** O(n) - For the heap

---

### Approach 5: Sorting + Index (Simplest)

A simple variation that sorts in ascending order and uses index calculation.

#### Implementation

````carousel
```python
from typing import List

class Solution:
    def findKthLargest(self, nums: List[int], k: int) -> int:
        """
        Find the kth largest by sorting in ascending order.
        """
        nums.sort()
        return nums[len(nums) - k]
```
<!-- slide -->
```cpp
#include <vector>
#include <algorithm>
using namespace std;

class Solution {
public:
    int findKthLargest(vector<int>& nums, int k) {
        sort(nums.begin(), nums.end());
        return nums[nums.size() - k];
    }
};
```
<!-- slide -->
```java
import java.util.Arrays;

class Solution {
    public int findKthLargest(int[] nums, int k) {
        Arrays.sort(nums);
        return nums[nums.length - k];
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
var findKthLargest = function(nums, k) {
    nums.sort((a, b) => a - b);
    return nums[nums.length - k];
};
```
````

**Time Complexity:** O(n log n)  
**Space Complexity:** O(1) or O(n) depending on sort implementation

---

## Comparison of Approaches

| Approach | Time Complexity | Space Complexity | Pros | Cons |
|----------|-----------------|------------------|------|------|
| **Sorting** | O(n log n) | O(1) | Simple, easy to implement | Not optimal for large n |
| **Quickselect** | O(n) avg, O(n²) worst | O(1) | Fast on average | Worst case can be slow |
| **Min-Heap** | O(n + k log n) | O(k) | Good for streaming data | Extra space for heap |
| **Max-Heap** | O(n + k log n) | O(n) | Simple concept | More space than needed |
| **BFPRT** | O(n) guaranteed | O(1) | Optimal worst case | Complex implementation |

**Recommendation:** 
- For interviews: Quickselect is preferred (shows understanding of optimization)
- For production: Min-heap is practical, especially when data comes in streams
- For guaranteed O(n): Consider implementing BFPRT algorithm

---

## Explanation of Quickselect Algorithm

### Why Quickselect Works

Quickselect is based on the partitioning step of quicksort. The key insight is:

1. **Partitioning**: After partitioning, the pivot element is in its final sorted position
2. **Target Position**: If we want kth largest (index k-1 in descending), we look for n-k in ascending
3. **Recursion**: We only need to search the partition that contains our target

### Visual Example

For array `[3,2,1,5,6,4]` with k=2 (finding 2nd largest = 5):

```
Initial: [3,2,1,5,6,4], target index = 4 (n-k = 6-2)

Choose pivot = 4, partition:
[3,2,1,4,5,6]
         ^
      pivot at index 3

Target is 4, pivot is 3 < 4, search right:
Search in [5,6], target index = 4

Choose pivot = 6, partition:
[5,6]
        ^
      pivot at index 5

Target is 4, pivot is 5 > 4, search left:
Search in [5], target index = 4

Now pivot at index 4 = target! Return nums[4] = 5
```

### Avoiding Worst Case

The worst case occurs when we always pick the smallest or largest element as pivot. To avoid this:

1. **Random Pivot**: Pick a random element as pivot
2. **Median of Medians**: Use BFPRT algorithm for guaranteed O(n)

---

## Complexity Analysis

### Time Complexity Breakdown

| Approach | Best | Average | Worst | Notes |
|----------|------|---------|-------|-------|
| Sorting | O(n log n) | O(n log n) | O(n log n) | Always same |
| Quickselect | O(n) | O(n) | O(n²) | Depends on pivot |
| Min-Heap | O(n + k log n) | O(n + k log n) | O(n + k log n) | k ≤ n |
| Max-Heap | O(n + k log n) | O(n + k log n) | O(n + k log n) | Always same |
| BFPRT | O(n) | O(n) | O(n) | Complex constant |

### Space Complexity Breakdown

| Approach | Space | Notes |
|----------|-------|-------|
| Sorting | O(1) / O(n) | Depends on implementation |
| Quickselect | O(1) | In-place |
| Min-Heap | O(k) | Only stores k elements |
| Max-Heap | O(n) | Stores all elements |
| BFPRT | O(1) | In-place |

---

## Edge Cases and Common Pitfalls

### Edge Cases to Consider

1. **Single Element Array:**
   ```
   nums = [1], k = 1 → Output: 1
   ```

2. **All Same Elements:**
   ```
   nums = [2,2,2,2], k = 3 → Output: 2
   ```

3. **Negative Numbers:**
   ```
   nums = [-5, -1, -3], k = 1 → Output: -1
   ```

4. **k = 1 (Maximum):**
   ```
   nums = [1,2,3], k = 1 → Output: 3
   ```

5. **k = n (Minimum):**
   ```
   nums = [1,2,3], k = 3 → Output: 1
   ```

6. **Large k Value:**
   ```
   nums = [1,2,3,4,5], k = 5 → Output: 1
   ```

### Common Mistakes to Avoid

1. **Using Wrong Index:**
   - Remember: kth largest = index k-1 in descending order
   - Or: index n-k in ascending order

2. **Not Handling Duplicates:**
   - [3,3,3] with k=2 should return 3, not skip duplicates

3. **Modifying Original Array:**
   - If not allowed, make a copy before partitioning

4. **Stack Overflow:**
   - For very large arrays with quickselect, use iterative version

---

## Why This Problem is Important

### Interview Relevance

- **Frequency:** Extremely common in technical interviews
- **Companies:** Google, Amazon, Meta, Apple, Microsoft, Bloomberg, Goldman Sachs
- **Difficulty:** Medium, but tests fundamental algorithm knowledge
- **Variations:** Leads to many related problems

### Learning Outcomes

1. **Algorithm Selection:** Learn to choose the right algorithm based on constraints
2. **Heap Operations:** Master heap data structure and priority queues
3. **Divide and Conquer:** Understand quicksort-based algorithms
4. **Optimization:** Learn to optimize from O(n log n) to O(n)

---

## Related Problems

### Same Problem Category

| Problem | LeetCode # | Difficulty | Description |
|---------|------------|------------|-------------|
| [Kth Largest Element in a Stream](https://leetcode.com/problems/kth-largest-element-in-a-stream/) | 703 | Easy | Kth largest in streaming data |
| [Find K Pairs with Smallest Sums](https://leetcode.com/problems/find-k-pairs-with-smallest-sums/) | 373 | Medium | K pairs with smallest sums |
| [Top K Frequent Elements](https://leetcode.com/problems/top-k-frequent-elements/) | 347 | Medium | K most frequent elements |
| [Find K Closest Elements](https://leetcode.com/problems/find-k-closest-elements/) | 658 | Medium | K closest elements |

### Similar Concepts

| Problem | LeetCode # | Difficulty | Description |
|---------|------------|------------|-------------|
| [Median of Two Sorted Arrays](https://leetcode.com/problems/median-of-two-sorted-arrays/) | 4 | Hard | Median (k = n/2) |
| [Wiggle Subsequence](https://leetcode.com/problems/wiggle-subsequence/) | 376 | Medium | Related to sorting |
| [Sort Colors](https://leetcode.com/problems/sort-colors/) | 75 | Medium | Dutch National Flag |
| [Kth Smallest Element in a BST](https://leetcode.com/problems/kth-smallest-element-in-a-bst/) | 230 | Medium | Kth in BST |

---

## Video Tutorial Links

### Recommended Tutorials

1. **[Kth Largest Element - NeetCode](https://www.youtube.com/watch?v=XEmh13-lX0U)**
   - Clear explanation with multiple approaches
   - Visual demonstrations
   - Part of popular NeetCode playlist

2. **[Quickselect Algorithm Explained](https://www.youtube.com/watch?v=hGK5nTFdKKY)**
   - In-depth quickselect tutorial
   - Step-by-step visualization

3. **[LeetCode 215 Solution - Tech Lead](https://www.youtube.com/watch?v=YDyW1zN3-a8)**
   - Detailed walkthrough of the solution
   - Interview-focused approach

4. **[Heap/Priority Queue Tutorial](https://www.youtube.com/watch?v=_wpQBu8KVqg)**
   - Heap fundamentals
   - Practical examples

### Additional Resources

- **[LeetCode Official Solution](https://leetcode.com/problems/kth-largest-element-in-an-array/solutions/)** - Official solutions and community discussions
- **[GeeksforGeeks - Kth Largest Element](https://www.geeksforgeeks.org/kth-smallestlargest-element-in-unsorted-array/)** - Detailed explanations
- **[Quickselect - Wikipedia](https://en.wikipedia.org/wiki/Quickselect)** - Theoretical background

---

## Follow-up Questions

### Basic Level

1. **What is the time complexity of the sorting approach?**
   - Time: O(n log n) - Sorting dominates
   - Space: O(1) for in-place sort or O(n) depending on implementation

2. **Why is quickselect faster than sorting on average?**
   - Sorting arranges ALL elements in order (O(n log n))
   - Quickselect only arranges elements around the target position (O(n))
   - We stop early once we find the kth element

3. **What is the difference between min-heap and max-heap approaches?**
   - Min-heap of size k: Keeps k largest, top is answer, O(k) space
   - Max-heap with k extracts: Stores all, extracts k times, O(n) space
   - Min-heap is more space-efficient

### Intermediate Level

4. **How would you handle the worst case of quickselect?**

   **Answer:** Use one of these strategies:
   - Random pivot selection (recommended for interviews)
   - Median of medians (BFPRT algorithm) - guarantees O(n)
   - Deterministic selection algorithm

5. **How would you find the median (k = n/2) more efficiently?**

   **Answer:** 
   - The median is a special case where k = n/2
   - Can use the same quickselect algorithm
   - Alternatively, use two heaps: max-heap for lower half, min-heap for upper half
   - This is how priority queues maintain median in streaming data

6. **What's the relationship between this problem and top K frequent elements?**

   **Answer:** 
   - Similar pattern: both use heap of size K
   - Top K Frequent: Use hash map + min-heap of size K
   - This problem: Direct comparison with heap
   - Both achieve O(n + k log k) complexity

### Advanced Level

7. **How would you implement the BFPRT algorithm for guaranteed O(n)?**

   **Answer:** BFPRT (Blum-Floyd-Pratt-Rivest-Tarjan) algorithm:
   - Divide array into groups of 5
   - Find median of each group (O(n))
   - Recursively find median of medians (O(n/5))
   - Use this as pivot for partitioning
   - Guarantees O(n) worst case with higher constant factor

8. **How would you solve this in a streaming scenario where data comes in one element at a time?**

   **Answer:** 
   - Use a min-heap of size k
   - Maintain k largest seen so far
   - For each new element: if larger than heap top, replace
   - Space: O(k), Time: O(n log k) for n elements
   - This is exactly the min-heap approach

9. **How would you handle duplicate values correctly?**

   **Answer:**
   - The problem asks for kth largest, not kth distinct largest
   - [3,3,3] with k=2 should return 3
   - Our implementations handle this correctly
   - Be careful with solutions that use Sets to remove duplicates

10. **What if you need to find kth smallest instead of largest?**

    **Answer:**
    - Simply swap the comparison operators
    - Or: kth smallest = (n-k+1)th largest
    - Min-heap approach: use max-heap instead

11. **How would you parallelize this problem for very large datasets?**

    **Answer:**
    - Divide array into chunks
    - Find kth largest in each chunk using the heap approach
    - Merge results using k-way merge
    - Or: Sample the data and use approximation algorithms

12. **What's the real-world application of this algorithm?**

    **Answer:**
    - Ranking systems (top K results)
    - Order statistics in databases
    - Data streaming (maintaining top K)
    - Statistical analysis (percentiles, quartiles)
    - Search algorithms (K-best solutions)

---

## Summary

The **Kth Largest Element in an Array** problem is a classic algorithmic challenge with multiple solution approaches. Key takeaways:

1. **Sorting Works but Not Optimal**: O(n log n) but simple to implement
2. **Quickselect is Optimal (Average)**: O(n) average time with O(1) space
3. **Heap Approach is Practical**: O(n + k log n), good for streaming data
4. **Understand the Indexing**: kth largest = index n-k in ascending order
5. **Avoid Worst Case**: Use random pivot in quickselect

### Recommended Approach for Interviews

**Quickselect** is typically the preferred answer because:
- Shows understanding of algorithm optimization
- Demonstrates knowledge of divide-and-conquer
- Can discuss space-time tradeoffs
- Follows up well with "how to avoid worst case"

For production code with unknown input distribution, the **min-heap approach** is often preferred due to its predictability and simplicity.

---

## LeetCode Link

[Kth Largest Element In An Array - LeetCode](https://leetcode.com/problems/kth-largest-element-in-an-array/)
