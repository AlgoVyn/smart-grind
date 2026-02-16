# Heap - Top K Elements (Selection/Frequency)

## Overview

The Heap - Top K Elements pattern is a fundamental technique used to efficiently find the K largest or smallest elements in a dataset, or to select elements based on frequency or other ranking criteria. This pattern leverages **priority queues (heaps)** to maintain a collection of the top K elements while iterating through the data, avoiding the need to sort the entire dataset.

This pattern is particularly valuable when:
- Dealing with **large datasets** where sorting would be inefficient (O(N log N))
- K is **significantly smaller than N** (K << N)
- Processing **streaming data** where elements arrive one at a time
- Finding elements based on **frequency**, distance, or other computed metrics

---

## Intuition

The key insight behind this pattern is that we don't need to process all elements equally. Instead of sorting the entire array, we can use a heap to **track only the K most relevant elements** at any given time.

### Why Heaps?

A **heap** is a binary tree-based data structure that provides O(1) access to the minimum (min-heap) or maximum (max-heap) element, with O(log N) insertion and deletion. This makes it ideal for " thekeep best K" problems.

### The Core Strategy

| Goal | Heap Type | Reason |
|------|------------|--------|
| Find K largest elements | **Min-heap** of size K | The smallest in heap = boundary for top K |
| Find K smallest elements | **Max-heap** of size K | The largest in heap = boundary for top K |
| Find K most frequent | **Min-heap** of size K | Based on frequency count |

---

## Approach 1: Min-Heap for Top K Largest Elements

### Algorithm

1. **Initialize** an empty min-heap
2. **Iterate** through each element in the array:
   - Push the element onto the heap
   - If heap size exceeds K, pop the smallest element
3. **Result**: The heap now contains exactly K elements - the K largest

### When to Use

- When you need the K largest elements
- When K is relatively small compared to N
- When you need elements in arbitrary order (not sorted)

### Code

````carousel
```python
import heapq
from typing import List

def find_k_largest(nums: List[int], k: int) -> List[int]:
    """
    Find the k largest elements in the array.
    
    Uses a min-heap of size k to keep track of the k largest elements.
    Time: O(N log k), Space: O(k)
    """
    if not nums or k <= 0:
        return []
    
    # Min-heap to keep track of k largest elements
    min_heap = []
    
    for num in nums:
        heapq.heappush(min_heap, num)
        
        # Maintain heap size of k
        if len(min_heap) > k:
            heapq.heappop(min_heap)
    
    return min_heap  # Contains k largest elements (unsorted)


def find_k_largest_sorted(nums: List[int], k: int) -> List[int]:
    """
    Find the k largest elements sorted in descending order.
    """
    heap = find_k_largest(nums, k)
    return sorted(heap, reverse=True)


# Example usage
if __name__ == "__main__":
    nums = [3, 1, 4, 1, 5, 9, 2, 6, 5, 3, 5]
    k = 3
    print(find_k_largest(nums, k))  # [9, 6, 5] (unsorted)
    print(find_k_largest_sorted(nums, k))  # [9, 6, 5] (sorted descending)
```

<!-- slide -->

```cpp
#include <vector>
#include <queue>
#include <algorithm>
#include <iostream>

/**
 * Find the k largest elements in the array.
 * Uses a min-heap of size k to keep track of the k largest elements.
 * Time: O(N log k), Space: O(k)
 */
std::vector<int> findKLargest(std::vector<int>& nums, int k) {
    if (nums.empty() || k <= 0) {
        return {};
    }
    
    // Min-heap (priority_queue with greater comparator)
    std::priority_queue<int, std::vector<int>, std::greater<int>> minHeap;
    
    for (int num : nums) {
        minHeap.push(num);
        
        // Maintain heap size of k
        if (minHeap.size() > k) {
            minHeap.pop();
        }
    }
    
    // Extract elements from heap
    std::vector<int> result;
    while (!minHeap.empty()) {
        result.push_back(minHeap.top());
        minHeap.pop();
    }
    
    return result;  // Contains k largest elements (unsorted)
}


std::vector<int> findKLargestSorted(std::vector<int>& nums, int k) {
    std::vector<int> result = findKLargest(nums, k);
    std::sort(result.begin(), result.end(), std::greater<int>());
    return result;
}


// Example usage
int main() {
    std::vector<int> nums = {3, 1, 4, 1, 5, 9, 2, 6, 5, 3, 5};
    int k = 3;
    
    std::vector<int> result = findKLargest(nums, k);
    // Output: 9, 6, 5 (unsorted)
    
    return 0;
}
```

<!-- slide -->

```java
import java.util.*;

public class TopKElements {
    
    /**
     * Find the k largest elements in the array.
     * Uses a min-heap of size k to keep track of the k largest elements.
     * Time: O(N log k), Space: O(k)
     */
    public static List<Integer> findKLargest(int[] nums, int k) {
        if (nums == null || nums.length == 0 || k <= 0) {
            return new ArrayList<>();
        }
        
        // Min-heap using PriorityQueue
        PriorityQueue<Integer> minHeap = new PriorityQueue<>();
        
        for (int num : nums) {
            minHeap.add(num);
            
            // Maintain heap size of k
            if (minHeap.size() > k) {
                minHeap.poll();
            }
        }
        
        return new ArrayList<>(minHeap);  // Contains k largest elements (unsorted)
    }
    
    
    /**
     * Find the k largest elements sorted in descending order.
     */
    public static List<Integer> findKLargestSorted(int[] nums, int k) {
        List<Integer> result = findKLargest(nums, k);
        Collections.sort(result, Collections.reverseOrder());
        return result;
    }
    
    
    public static void main(String[] args) {
        int[] nums = {3, 1, 4, 1, 5, 9, 2, 6, 5, 3, 5};
        int k = 3;
        
        System.out.println(findKLargest(nums, k));  // [9, 6, 5] (unsorted)
        System.out.println(findKLargestSorted(nums, k));  // [9, 6, 5] (sorted)
    }
}
```

<!-- slide -->

```javascript
/**
 * Find the k largest elements in the array.
 * Uses a min-heap of size k to keep track of the k largest elements.
 * Time: O(N log k), Space: O(k)
 * @param {number[]} nums
 * @param {number} k
 * @returns {number[]}
 */
function findKLargest(nums, k) {
    if (!nums || nums.length === 0 || k <= 0) {
        return [];
    }
    
    // Min-heap using array with custom heapify
    const minHeap = [];
    
    for (const num of nums) {
        minHeap.push(num);
        
        // Heapify up after insertion
        let i = minHeap.length - 1;
        while (i > 0) {
            const parent = Math.floor((i - 1) / 2);
            if (minHeap[parent] <= minHeap[i]) break;
            [minHeap[parent], minHeap[i]] = [minHeap[i], minHeap[parent]];
            i = parent;
        }
        
        // Maintain heap size of k
        if (minHeap.length > k) {
            // Remove smallest element (root)
            const smallest = minHeap[0];
            const last = minHeap.pop();
            if (minHeap.length > 0) {
                minHeap[0] = last;
                // Heapify down
                let i = 0;
                while (true) {
                    const left = 2 * i + 1;
                    const right = 2 * i + 2;
                    let smallestIdx = i;
                    if (left < minHeap.length && minHeap[left] < minHeap[smallestIdx]) {
                        smallestIdx = left;
                    }
                    if (right < minHeap.length && minHeap[right] < minHeap[smallestIdx]) {
                        smallestIdx = right;
                    }
                    if (smallestIdx === i) break;
                    [minHeap[i], minHeap[smallestIdx]] = [minHeap[smallestIdx], minHeap[i]];
                    i = smallestIdx;
                }
            }
        }
    }
    
    return minHeap;  // Contains k largest elements (unsorted)
}


/**
 * Find the k largest elements sorted in descending order.
 */
function findKLargestSorted(nums, k) {
    const result = findKLargest(nums, k);
    return result.sort((a, b) => b - a);
}


// Example usage
const nums = [3, 1, 4, 1, 5, 9, 2, 6, 5, 3, 5];
const k = 3;
console.log(findKLargest(nums, k));  // [9, 6, 5] (unsorted)
console.log(findKLargestSorted(nums, k));  // [9, 6, 5] (sorted)
```
````

### Complexity Analysis

| Aspect | Complexity |
|--------|------------|
| **Time** | O(N log K) - each element causes at most one heap operation |
| **Space** | O(K) - the heap stores at most K elements |

---

## Approach 2: Max-Heap for Top K Smallest Elements

### Algorithm

1. **Initialize** an empty max-heap (or use negative values with min-heap)
2. **Iterate** through each element:
   - Push the element onto the heap
   - If heap size exceeds K, pop the largest element
3. **Result**: The heap contains the K smallest elements

### When to Use

- When you need the K smallest elements
- When working with min-heap only (like Python's heapq)

### Code

````carousel
```python
import heapq
from typing import List

def find_k_smallest(nums: List[int], k: int) -> List[int]:
    """
    Find the k smallest elements in the array.
    
    Uses a max-heap (implemented with negative values and min-heap).
    Time: O(N log k), Space: O(k)
    """
    if not nums or k <= 0:
        return []
    
    # Use negative values to simulate max-heap with min-heap
    max_heap = []
    
    for num in nums:
        heapq.heappush(max_heap, -num)
        
        if len(max_heap) > k:
            heapq.heappop(max_heap)
    
    # Convert back from negative values
    return [-x for x in max_heap]


def find_k_smallest_sorted(nums: List[int], k: int) -> List[int]:
    """Find the k smallest elements sorted in ascending order."""
    heap = find_k_smallest(nums, k)
    return sorted(heap)


# Example usage
if __name__ == "__main__":
    nums = [3, 1, 4, 1, 5, 9, 2, 6, 5, 3, 5]
    k = 3
    print(find_k_smallest(nums, k))  # [1, 2, 3] (unsorted)
    print(find_k_smallest_sorted(nums, k))  # [1, 2, 3] (sorted)
```

<!-- slide -->

```cpp
#include <vector>
#include <queue>
#include <algorithm>

/**
 * Find the k smallest elements in the array.
 * Uses a max-heap to keep track of the k smallest elements.
 * Time: O(N log k), Space: O(k)
 */
std::vector<int> findKSmallest(std::vector<int>& nums, int k) {
    if (nums.empty() || k <= 0) {
        return {};
    }
    
    // Max-heap (default priority_queue is max-heap)
    std::priority_queue<int> maxHeap;
    
    for (int num : nums) {
        maxHeap.push(num);
        
        if (maxHeap.size() > k) {
            maxHeap.pop();
        }
    }
    
    // Extract elements from heap
    std::vector<int> result;
    while (!maxHeap.empty()) {
        result.push_back(maxHeap.top());
        maxHeap.pop();
    }
    
    return result;
}


std::vector<int> findKSmallestSorted(std::vector<int>& nums, int k) {
    std::vector<int> result = findKSmallest(nums, k);
    std::sort(result.begin(), result.end());
    return result;
}
```

<!-- slide -->

```java
import java.util.*;

public class TopKSmallest {
    
    /**
     * Find the k smallest elements in the array.
     * Uses a max-heap to keep track of the k smallest elements.
     * Time: O(N log k), Space: O(k)
     */
    public static List<Integer> findKSmallest(int[] nums, int k) {
        if (nums == null || nums.length == 0 || k <= 0) {
            return new ArrayList<>();
        }
        
        // Max-heap using Collections.reverseOrder()
        PriorityQueue<Integer> maxHeap = new PriorityQueue<>(Collections.reverseOrder());
        
        for (int num : nums) {
            maxHeap.add(num);
            
            if (maxHeap.size() > k) {
                maxHeap.poll();
            }
        }
        
        return new ArrayList<>(maxHeap);
    }
    
    
    public static void main(String[] args) {
        int[] nums = {3, 1, 4, 1, 5, 9, 2, 6, 5, 3, 5};
        int k = 3;
        
        System.out.println(findKSmallest(nums, k));  // [1, 2, 3] (unsorted)
    }
}
```

<!-- slide -->

```javascript
/**
 * Find the k smallest elements in the array.
 * Uses a max-heap to keep track of the k smallest elements.
 * Time: O(N log k), Space: O(k)
 * @param {number[]} nums
 * @param {number} k
 * @returns {number[]}
 */
function findKSmallest(nums, k) {
    if (!nums || nums.length === 0 || k <= 0) {
        return [];
    }
    
    // Max-heap using negative values to simulate
    const maxHeap = [];
    
    for (const num of nums) {
        // Store negative to simulate max-heap
        maxHeap.push(-num);
        maxHeap.sort((a, b) => b - a);  // Sort descending for max-heap behavior
        
        if (maxHeap.length > k) {
            maxHeap.pop();  // Remove largest (most negative)
        }
    }
    
    // Convert back from negative values
    return maxHeap.map(x => -x);
}


// Alternative using custom heap implementation
function findKSmallestWithHeap(nums, k) {
    if (!nums || nums.length === 0 || k <= 0) return [];
    
    // Max-heap (store negative for comparison)
    const heap = [];
    
    for (const num of nums) {
        // For max-heap, we want largest at top, so negate
        const neg = -num;
        
        heap.push(neg);
        heap.sort((a, b) => b - a);
        
        if (heap.length > k) {
            heap.pop();
        }
    }
    
    return heap.map(x => -x);
}


const nums = [3, 1, 4, 1, 5, 9, 2, 6, 5, 3, 5];
const k = 3;
console.log(findKSmallest(nums, k));  // [1, 2, 3]
```
````

### Complexity Analysis

| Aspect | Complexity |
|--------|------------|
| **Time** | O(N log K) |
| **Space** | O(K) |

---

## Approach 3: Top K Frequent Elements

### Algorithm

1. **Count frequencies** using a hash map (or Counter)
2. **Use a min-heap** of size K based on frequency
3. **Iterate** through frequency pairs:
   - Push (frequency, element) onto heap
   - If heap size exceeds K, pop the element with lowest frequency
4. **Result**: Heap contains K most frequent elements

### When to Use

- When elements have associated frequencies or counts
- When you need the most common/repeated elements
- For problems like "top k popular search queries"

### Code

````carousel
```python
import heapq
from collections import Counter
from typing import List, Tuple

def top_k_frequent(nums: List[int], k: int) -> List[int]:
    """
    Find the k most frequent elements.
    
    Algorithm:
    1. Count frequencies using Counter
    2. Use min-heap of size k to keep top k frequent
    3. Return elements (not sorted)
    
    Time: O(N log k), Space: O(N) for frequency map + O(k) for heap
    """
    if not nums or k <= 0:
        return []
    
    # Step 1: Count frequencies
    freq = Counter(nums)
    
    # Step 2: Use min-heap to keep top k frequent
    # Heap stores (frequency, element) - min-heap by frequency
    min_heap = []
    for num, count in freq.items():
        heapq.heappush(min_heap, (count, num))
        
        if len(min_heap) > k:
            heapq.heappop(min_heap)
    
    # Step 3: Extract elements
    return [num for count, num in min_heap]


def top_k_frequent_sorted(nums: List[int], k: int) -> List[int]:
    """Return top k frequent elements sorted by frequency (descending)."""
    heap = top_k_frequent(nums, k)
    return sorted(heap, key=lambda x: freq[x], reverse=True)


# Alternative: Using bucket sort (O(N) for unique elements)
def top_k_frequent_bucket(nums: List[int], k: int) -> List[int]:
    """
    Find k most frequent elements using bucket sort.
    
    Time: O(N), Space: O(N)
    Works well when N >> number of unique elements
    """
    if not nums or k <= 0:
        return []
    
    # Count frequencies
    freq = Counter(nums)
    n = len(nums)
    
    # Bucket sort: buckets[i] contains elements with frequency i
    buckets = [[] for _ in range(n + 1)]
    for num, count in freq.items():
        buckets[count].append(num)
    
    # Collect top k from highest frequency
    result = []
    for count in range(n, 0, -1):
        for num in buckets[count]:
            result.append(num)
            if len(result) == k:
                return result
    
    return result


# Example usage
if __name__ == "__main__":
    nums = [1, 1, 1, 2, 2, 3]
    k = 2
    print(top_k_frequent(nums, k))  # [1, 2]
    print(top_k_frequent_bucket(nums, k))  # [1, 2]
```

<!-- slide -->

```cpp
#include <vector>
#include <unordered_map>
#include <queue>
#include <algorithm>

/**
 * Find the k most frequent elements.
 * Uses min-heap of size k to keep top k frequent.
 * Time: O(N log k), Space: O(N)
 */
std::vector<int> topKFrequent(std::vector<int>& nums, int k) {
    if (nums.empty() || k <= 0) {
        return {};
    }
    
    // Step 1: Count frequencies
    std::unordered_map<int, int> freq;
    for (int num : nums) {
        freq[num]++;
    }
    
    // Step 2: Use min-heap to keep top k frequent
    // (frequency, element) - min-heap by frequency
    auto cmp = [](const std::pair<int, int>& a, const std::pair<int, int>& b) {
        return a.first > b.first;  // min-heap by frequency
    };
    std::priority_queue<std::pair<int, int>, std::vector<std::pair<int, int>>, decltype(cmp)> minHeap(cmp);
    
    for (auto& [num, count] : freq) {
        minHeap.push({count, num});
        if (minHeap.size() > k) {
            minHeap.pop();
        }
    }
    
    // Step 3: Extract elements
    std::vector<int> result;
    while (!minHeap.empty()) {
        result.push_back(minHeap.top().second);
        minHeap.pop();
    }
    
    return result;
}


/**
 * Find k most frequent elements using bucket sort.
 * Time: O(N), Space: O(N)
 */
std::vector<int> topKFrequentBucket(std::vector<int>& nums, int k) {
    if (nums.empty() || k <= 0) {
        return {};
    }
    
    // Count frequencies
    std::unordered_map<int, int> freq;
    for (int num : nums) {
        freq[num]++;
    }
    
    int n = nums.size();
    
    // Bucket sort: buckets[i] contains elements with frequency i
    std::vector<std::vector<int>> buckets(n + 1);
    for (auto& [num, count] : freq) {
        buckets[count].push_back(num);
    }
    
    // Collect top k from highest frequency
    std::vector<int> result;
    for (int count = n; count > 0 && result.size() < k; count--) {
        for (int num : buckets[count]) {
            result.push_back(num);
            if (result.size() == k) break;
        }
    }
    
    return result;
}
```

<!-- slide -->

```java
import java.util.*;

public class TopKFrequent {
    
    /**
     * Find the k most frequent elements.
     * Uses min-heap of size k to keep top k frequent.
     * Time: O(N log k), Space: O(N)
     */
    public static List<Integer> topKFrequent(int[] nums, int k) {
        if (nums == null || nums.length == 0 || k <= 0) {
            return new ArrayList<>();
        }
        
        // Step 1: Count frequencies
        Map<Integer, Integer> freq = new HashMap<>();
        for (int num : nums) {
            freq.put(num, freq.getOrDefault(num, 0) + 1);
        }
        
        // Step 2: Use min-heap to keep top k frequent
        // (frequency, element) - min-heap by frequency
        PriorityQueue<int[]> minHeap = new PriorityQueue<>((a, b) -> a[0] - b[0]);
        
        for (Map.Entry<Integer, Integer> entry : freq.entrySet()) {
            int count = entry.getValue();
            int num = entry.getKey();
            minHeap.add(new int[]{count, num});
            
            if (minHeap.size() > k) {
                minHeap.poll();
            }
        }
        
        // Step 3: Extract elements
        List<Integer> result = new ArrayList<>();
        while (!minHeap.isEmpty()) {
            result.add(minHeap.poll()[1]);
        }
        
        return result;
    }
    
    
    /**
     * Find k most frequent elements using bucket sort.
     * Time: O(N), Space: O(N)
     */
    public static List<Integer> topKFrequentBucket(int[] nums, int k) {
        if (nums == null || nums.length == 0 || k <= 0) {
            return new ArrayList<>();
        }
        
        // Count frequencies
        Map<Integer, Integer> freq = new HashMap<>();
        for (int num : nums) {
            freq.put(num, freq.getOrDefault(num, 0) + 1);
        }
        
        int n = nums.length;
        
        // Bucket sort: buckets[i] contains elements with frequency i
        List<List<Integer>> buckets = new ArrayList<>(n + 1);
        for (int i = 0; i <= n; i++) {
            buckets.add(new ArrayList<>());
        }
        
        for (Map.Entry<Integer, Integer> entry : freq.entrySet()) {
            int count = entry.getValue();
            buckets.get(count).add(entry.getKey());
        }
        
        // Collect top k from highest frequency
        List<Integer> result = new ArrayList<>();
        for (int count = n; count > 0 && result.size() < k; count--) {
            for (int num : buckets.get(count)) {
                result.add(num);
                if (result.size() == k) break;
            }
        }
        
        return result;
    }
    
    
    public static void main(String[] args) {
        int[] nums = {1, 1, 1, 2, 2, 3};
        int k = 2;
        System.out.println(topKFrequent(nums, k));  // [1, 2]
    }
}
```

<!-- slide -->

```javascript
/**
 * Find the k most frequent elements.
 * Uses min-heap of size k to keep top k frequent.
 * Time: O(N log k), Space: O(N)
 * @param {number[]} nums
 * @param {number} k
 * @returns {number[]}
 */
function topKFrequent(nums, k) {
    if (!nums || nums.length === 0 || k <= 0) {
        return [];
    }
    
    // Step 1: Count frequencies
    const freq = new Map();
    for (const num of nums) {
        freq.set(num, (freq.get(num) || 0) + 1);
    }
    
    // Step 2: Use min-heap to keep top k frequent
    // Using array and sorting as a simple heap substitute
    const heap = [];
    
    for (const [num, count] of freq) {
        heap.push({ count, num });
        // Sort to maintain min-heap by frequency
        heap.sort((a, b) => a.count - b.count);
        
        if (heap.length > k) {
            heap.shift();  // Remove smallest frequency
        }
    }
    
    // Step 3: Extract elements
    return heap.map(item => item.num);
}


/**
 * Find k most frequent elements using bucket sort.
 * Time: O(N), Space: O(N)
 */
function topKFrequentBucket(nums, k) {
    if (!nums || nums.length === 0 || k <= 0) {
        return [];
    }
    
    // Count frequencies
    const freq = new Map();
    for (const num of nums) {
        freq.set(num, (freq.get(num) || 0) + 1);
    }
    
    const n = nums.length;
    
    // Bucket sort: buckets[i] contains elements with frequency i
    const buckets = Array.from({ length: n + 1 }, () => []);
    
    for (const [num, count] of freq) {
        buckets[count].push(num);
    }
    
    // Collect top k from highest frequency
    const result = [];
    for (let count = n; count > 0 && result.length < k; count--) {
        for (const num of buckets[count]) {
            result.push(num);
            if (result.length === k) break;
        }
    }
    
    return result;
}


const nums = [1, 1, 1, 2, 2, 3];
const k = 2;
console.log(topKFrequent(nums, k));  // [1, 2]
```
````

### Complexity Analysis

| Approach | Time | Space |
|----------|------|-------|
| Heap-based | O(N log K) | O(N + K) |
| Bucket Sort | O(N) | O(N) |

---

## Approach 4: QuickSelect (Average O(N))

### Algorithm

1. **Convert** the problem to finding the (N-K)th smallest element
2. **Use QuickSelect** - a partition-based algorithm similar to QuickSort
3. **Recursively** partition until the pivot is at the correct position

### When to Use

- When you need O(N) average time complexity
- When you can modify the original array
- When K is not very small relative to N

### Code

````carousel
```python
import random
from typing import List

def quick_select_kth_largest(nums: List[int], k: int) -> int:
    """
    Find the kth largest element using QuickSelect.
    Time: O(N) average, O(N²) worst case, Space: O(1)
    """
    if not nums or k <= 0 or k > len(nums):
        return -1
    
    # Convert to (n-k)th smallest
    target = len(nums) - k
    
    def partition(left, right, pivot_idx):
        pivot_value = nums[pivot_idx]
        # Move pivot to end
        nums[pivot_idx], nums[right] = nums[right], nums[pivot_idx]
        store_idx = left
        
        for i in range(left, right):
            if nums[i] < pivot_value:
                nums[store_idx], nums[i] = nums[i], nums[store_idx]
                store_idx += 1
        
        # Move pivot to its final place
        nums[right], nums[store_idx] = nums[store_idx], nums[right]
        return store_idx
    
    def select(left, right):
        if left == right:
            return nums[left]
        
        # Random pivot for better average performance
        pivot_idx = random.randint(left, right)
        pivot_idx = partition(left, right, pivot_idx)
        
        if pivot_idx == target:
            return nums[pivot_idx]
        elif pivot_idx < target:
            return select(pivot_idx + 1, right)
        else:
            return select(left, pivot_idx - 1)
    
    return select(0, len(nums) - 1)


def quick_select_top_k(nums: List[int], k: int) -> List[int]:
    """Find top k largest elements using QuickSelect."""
    if not nums or k <= 0:
        return []
    
    n = len(nums)
    target = n - k
    
    # Copy and process
    arr = nums.copy()
    
    def partition(left, right, pivot_idx):
        pivot_value = arr[pivot_idx]
        arr[pivot_idx], arr[right] = arr[right], arr[pivot_idx]
        store_idx = left
        
        for i in range(left, right):
            if arr[i] < pivot_value:
                arr[store_idx], arr[i] = arr[i], arr[store_idx]
                store_idx += 1
        
        arr[right], arr[store_idx] = arr[store_idx], arr[right]
        return store_idx
    
    def select(left, right):
        if left == right:
            return
        
        pivot_idx = random.randint(left, right)
        pivot_idx = partition(left, right, pivot_idx)
        
        if pivot_idx == target:
            return
        elif pivot_idx < target:
            select(pivot_idx + 1, right)
        else:
            select(left, pivot_idx - 1)
    
    select(0, n - 1)
    
    # Return top k (from target to end), sorted descending
    return sorted(arr[target:], reverse=True)


# Example usage
if __name__ == "__main__":
    nums = [3, 1, 4, 1, 5, 9, 2, 6, 5, 3, 5]
    k = 3
    print(quick_select_kth_largest(nums, k))  # 6
    print(quick_select_top_k(nums, k))  # [9, 6, 5]
```

<!-- slide -->

```cpp
#include <vector>
#include <algorithm>
#include <cstdlib>
#include <ctime>

/**
 * Find the kth largest element using QuickSelect.
 * Time: O(N) average, O(N²) worst case, Space: O(1)
 */
int quickSelectKthLargest(std::vector<int>& nums, int k) {
    if (nums.empty() || k <= 0 || k > nums.size()) {
        return -1;
    }
    
    int n = nums.size();
    int target = n - k;
    
    std::srand(std::time(nullptr));
    
    int partition(int left, int right, int pivot_idx) {
        int pivot_value = nums[pivot_idx];
        std::swap(nums[pivot_idx], nums[right]);
        int store_idx = left;
        
        for (int i = left; i < right; i++) {
            if (nums[i] < pivot_value) {
                std::swap(nums[store_idx], nums[i]);
                store_idx++;
            }
        }
        
        std::swap(nums[right], nums[store_idx]);
        return store_idx;
    }
    
    std::function<int(int, int)> select = [&](int left, int right) -> int {
        if (left == right) {
            return nums[left];
        }
        
        int pivot_idx = left + std::rand() % (right - left + 1);
        pivot_idx = partition(left, right, pivot_idx);
        
        if (pivot_idx == target) {
            return nums[pivot_idx];
        } else if (pivot_idx < target) {
            return select(pivot_idx + 1, right);
        } else {
            return select(left, pivot_idx - 1);
        }
    };
    
    return select(0, n - 1);
}
```

<!-- slide -->

```java
import java.util.*;

public class QuickSelect {
    
    /**
     * Find the kth largest element using QuickSelect.
     * Time: O(N) average, O(N²) worst case, Space: O(1)
     */
    public static int quickSelectKthLargest(int[] nums, int k) {
        if (nums == null || k <= 0 || k > nums.length) {
            return -1;
        }
        
        int n = nums.length;
        int target = n - k;
        
        return quickSelect(nums, 0, n - 1, target);
    }
    
    private static int quickSelect(int[] nums, int left, int right, int target) {
        if (left == right) {
            return nums[left];
        }
        
        Random random = new Random();
        int pivotIdx = left + random.nextInt(right - left + 1);
        pivotIdx = partition(nums, left, right, pivotIdx);
        
        if (pivotIdx == target) {
            return nums[pivotIdx];
        } else if (pivotIdx < target) {
            return quickSelect(nums, pivotIdx + 1, right, target);
        } else {
            return quickSelect(nums, left, pivotIdx - 1, target);
        }
    }
    
    private static int partition(int[] nums, int left, int right, int pivotIdx) {
        int pivotValue = nums[pivotIdx];
        // Move pivot to end
        swap(nums, pivotIdx, right);
        int storeIdx = left;
        
        for (int i = left; i < right; i++) {
            if (nums[i] < pivotValue) {
                swap(nums, storeIdx, i);
                storeIdx++;
            }
        }
        
        // Move pivot to final position
        swap(nums, storeIdx, right);
        return storeIdx;
    }
    
    private static void swap(int[] nums, int i, int j) {
        int temp = nums[i];
        nums[i] = nums[j];
        nums[j] = temp;
    }
}
```

<!-- slide -->

```javascript
/**
 * Find the kth largest element using QuickSelect.
 * Time: O(N) average, O(N²) worst case, Space: O(1)
 * @param {number[]} nums
 * @param {number} k
 * @returns {number}
 */
function quickSelectKthLargest(nums, k) {
    if (!nums || k <= 0 || k > nums.length) {
        return -1;
    }
    
    const n = nums.length;
    const target = n - k;
    
    function partition(left, right, pivotIdx) {
        const pivotValue = nums[pivotIdx];
        // Move pivot to end
        [nums[pivotIdx], nums[right]] = [nums[right], nums[pivotIdx]];
        let storeIdx = left;
        
        for (let i = left; i < right; i++) {
            if (nums[i] < pivotValue) {
                [nums[storeIdx], nums[i]] = [nums[i], nums[storeIdx]];
                storeIdx++;
            }
        }
        
        // Move pivot to final position
        [nums[right], nums[storeIdx]] = [nums[storeIdx], nums[right]];
        return storeIdx;
    }
    
    function select(left, right) {
        if (left === right) {
            return nums[left];
        }
        
        const pivotIdx = Math.floor(Math.random() * (right - left + 1)) + left;
        const newPivotIdx = partition(left, right, pivotIdx);
        
        if (newPivotIdx === target) {
            return nums[newPivotIdx];
        } else if (newPivotIdx < target) {
            return select(newPivotIdx + 1, right);
        } else {
            return select(left, newPivotIdx - 1);
        }
    }
    
    return select(0, n - 1);
}


const nums = [3, 1, 4, 1, 5, 9, 2, 6, 5, 3, 5];
const k = 3;
console.log(quickSelectKthLargest(nums, k));  // 6
```
````

### Complexity Analysis

| Aspect | Average | Worst Case |
|--------|---------|------------|
| **Time** | O(N) | O(N²) |
| **Space** | O(1) | O(N) |

---

## Comparison of Approaches

| Approach | Time | Space | Best When |
|----------|------|-------|-----------|
| **Min-Heap (Top K Largest)** | O(N log K) | O(K) | K << N, unsorted output needed |
| **Max-Heap (Top K Smallest)** | O(N log K) | O(K) | K << N, unsorted output needed |
| **Heap + Frequency** | O(N log K) | O(N + K) | Elements have frequencies |
| **Bucket Sort** | O(N) | O(N) | Frequency range is bounded |
| **QuickSelect** | O(N) avg | O(1) | Need kth element, can modify array |

---

## Step-by-Step Example

Let's trace through finding **top 3 largest** elements in `[3, 1, 4, 1, 5, 9, 2, 6]`:

### Min-Heap Approach

```
Step 1: []        - Empty heap
Step 2: [3]       - Add 3, size=1 ≤ 3
Step 3: [1, 3]    - Add 1, heapify
Step 4: [1, 3, 4] - Add 4, heapify  
Step 5: [1, 3, 4] - Add 1, heapify, pop smallest (1), heap: [1, 3, 4]
Step 6: [1, 3, 4] - Add 5, push 5, pop smallest (1), heap: [3, 4, 5]
Step 7: [2, 3, 4] - Add 2, push 2, pop smallest (1), heap: [2, 3, 4]
Step 8: [2, 3, 4] - Add 6, push 6, pop smallest (2), heap: [3, 4, 6]

Final heap: [3, 4, 6] → These are the top 3 largest!
```

---

## Common Pitfalls and Solutions

### 1. Forgetting to Maintain Heap Size

**❌ Wrong:**
```python
heapq.heappush(heap, num)  # Always pushes, never removes
```

**✅ Correct:**
```python
heapq.heappush(heap, num)
if len(heap) > k:
    heapq.heappop(heap)
```

### 2. Not Handling Edge Cases

**❌ Wrong:**
```python
def top_k(nums, k):
    heap = []
    for num in nums:  # Fails when nums is empty
        ...
```

**✅ Correct:**
```python
def top_k(nums, k):
    if not nums or:
        return []
 k <= 0    ...
```

### 3. Max-Heap in Python

**❌ Wrong:**
```python
# Python's heapq is min-heap only
heapq.heappush(max_heap, num)  # This is min-heap behavior
```

**✅ Correct:**
```python
# Use negative values for max-heap
heapq.heappush(max_heap, -num)  # Negate on push
result = [-x for x in max_heap]  # Negate on pop
```

### 4. Sorting After Extraction

Remember that heap extraction gives **unsorted** results. If you need sorted output:

```python
# For largest: sorted ascending
result = sorted(heap)  # Smallest to largest

# For smallest: sort descending
result = sorted(heap, reverse=True)
```

---

## Related Problems

### LeetCode Problems

| Problem | Difficulty | Pattern |
|---------|------------|---------|
| [Kth Largest Element in an Array](https://leetcode.com/problems/kth-largest-element-in-an-array/) | Medium | Top K Largest |
| [Top K Frequent Elements](https://leetcode.com/problems/top-k-frequent-elements/) | Medium | Top K Frequent |
| [K Closest Points to Origin](https://leetcode.com/problems/k-closest-points-to-origin/) | Medium | Top K by Distance |
| [Find K Closest Elements](https://leetcode.com/problems/find-k-closest-elements/) | Medium | Top K by Distance |
| [Kth Largest Element in a Stream](https://leetcode.com/problems/kth-largest-element-in-a-stream/) | Easy | Top K Stream |
| [Sort Characters By Frequency](https://leetcode.com/problems/sort-characters-by-frequency/) | Medium | Top K Frequent |
| [Least Number of Unique Integers after K Removals](https://leetcode.com/problems/least-number-of-unique-integers-after-k-removals/) | Medium | Top K Frequent |
| [Find Subsequence of Length K With the Largest Sum](https://leetcode.com/problems/find-subsequence-of-length-k-with-the-largest-sum/) | Easy | Top K Largest |

---

## Video Tutorials

### Core Concepts

- **[Heap Data Structure - Abdul Bari](https://www.youtube.com/watch?v=HqPJF2L5h9U)** - Complete heap tutorial
- **[Priority Queues in Python - Corey Schafer](https://www.youtube.com/watch?v=wptevkG8eTw)** - Python heapq implementation
- **[Heap Sort - Visualgo](https://visualgo.net/en/heap)** - Interactive heap visualization

### Problem-Specific

- **[Kth Largest Element - NeetCode](https://www.youtube.com/watch?v=XEmy13g1Rxc)** - Complete solution walkthrough
- **[Top K Frequent Elements - NeetCode](https://www.youtube.com/watch?v=YPTqJI208lM)** - Detailed explanation
- **[K Closest Points to Origin - NeetCode](https://www.youtube.com/watch?v=1idX3R2VUmM)** - Distance-based heap

### Advanced

- **[QuickSelect Algorithm - Back to Back SWE](https://www.youtube.com/watch?v=np48-BBbMts)** - Average O(N) approach
- **[Heap vs QuickSelect - When to Use Which](https://www.youtube.com/watch?v=ks3SD1Wj0L0)** - Algorithm comparison

---

## Summary

The **Heap - Top K Elements** pattern is an essential tool in your algorithmic toolkit. Key takeaways:

1. **Use a min-heap** when finding K largest elements
2. **Use a max-heap** when finding K smallest elements  
3. **Combine with frequency counting** for "most frequent" problems
4. **Consider QuickSelect** for O(N) average time when appropriate
5. **Always handle edge cases** - empty arrays, K out of bounds

The pattern's O(N log K) complexity makes it optimal when K is small relative to N, which is common in many real-world scenarios like:
- Finding top search queries
- Recommendation systems
- Nearest neighbor searches
- Performance monitoring (top N slowest operations)

Master this pattern, and you'll be able to efficiently solve a wide variety of selection and ranking problems!
