# Kth Largest Element

## Category
Heap / Priority Queue

## Description

The **Kth Largest Element** problem asks us to find the k-th largest element in an unsorted array. This is a fundamental problem that appears frequently in interviews and competitive programming. There are several approaches to solve this problem, each with different time and space trade-offs.

The key challenge is finding the k-th largest without fully sorting the array, which would be inefficient for large datasets. This problem demonstrates important algorithmic techniques including heap-based optimization and divide-and-conquer strategies.

---

## When to Use

Use the Kth Largest Element algorithm when you need to solve problems involving:

- **Top-K Problems**: Finding the k largest/smallest elements in a dataset
- **Order Statistics**: Finding elements at specific positions in unordered data
- **Streaming Data**: Processing elements one at a time while maintaining a collection of k largest elements
- **Optimization Scenarios**: When you need better than O(n log n) time complexity

### Comparison with Alternatives

| Approach | Time Complexity | Space Complexity | Best Use Case |
|----------|-----------------|------------------|---------------|
| **Min Heap (size k)** | O(n log k) | O(k) | When k << n, streaming data |
| **Max Heap (size n)** | O(n + k log n) | O(n) | When k is close to n |
| **Quickselect (Average)** | O(n) | O(1) | When average case matters more than worst case |
| **Quickselect (Worst)** | O(n²) | O(1) | Avoid unless data is nearly sorted |
| **Sorting** | O(n log n) | O(1) | When you need the full sorted array anyway |

### When to Choose Each Approach

- **Choose Min Heap (size k)** when:
  - k is small relative to n
  - Processing streaming/chunked data
  - Memory is limited
  - You need guaranteed O(n log k) performance

- **Choose Quickselect** when:
  - You need average O(n) time
  - Space is extremely limited
  - You can tolerate occasional O(n²) performance
  - The data fits in memory

- **Choose Sorting** when:
  - n is small
  - You need multiple order statistics
  - Simplicity is preferred over optimization

---

## Algorithm Explanation

### Core Concept

The fundamental insight behind finding the k-th largest element is understanding the relationship between:
- **k-th largest**: The element that would be at index `k-1` if the array were sorted in descending order
- **n - k + 1-th smallest**: The element at index `n - k` if sorted in ascending order

This duality allows us to apply both "k largest" and "k smallest" strategies.

### How It Works

#### Approach 1: Min Heap (Recommended for most cases)

The min heap approach maintains exactly k elements - the k largest ones seen so far.

1. **Initialize** an empty min heap
2. **Iterate** through each number in the array
3. **Push** the current number onto the heap
4. **If heap size exceeds k**, pop the smallest element
5. **After processing all elements**, the top of the heap is the k-th largest

**Why Min Heap?**
- A min heap of size k always contains the k largest elements seen so far
- The smallest element in this heap is the k-th largest overall
- We only need O(k) space, not O(n)

#### Approach 2: Quickselect (Average O(n))

Quickselect is a divide-and-conquer algorithm that works similar to quicksort:

1. **Choose a pivot** element
2. **Partition** the array around the pivot (like in quicksort)
3. **Determine** which partition contains the k-th largest
4. **Recursively** repeat on that partition until found

The key optimization is that we only recurse into one partition, unlike quicksort which processes both.

#### Approach 3: Max Heap (Building Complete Collection)

1. **Push all elements** onto a max heap: O(n)
2. **Extract max** k-1 times: O(k log n)
3. **Return** the next maximum

### Visual Representation

For array `[3, 2, 1, 5, 6, 4]` with k=2:

```
Min Heap Approach (k=2):
Step-by-step:
  Element | Heap Content | Explanation
  --------|--------------|-------------
     3    | [3]          | First element
     2    | [2, 3]       | Add 2, size=2
     1    | [1, 3]       | 1 < min(2), pop 2, push 1
     5    | [3, 5]       | 5 > 1, pop 1, push 5
     6    | [5, 6]       | 6 > 3, pop 3, push 6  
     4    | [4, 6]       | 4 < 5, pop 5, push 4

Result: heap[0] = 4 → Wait, this should be 5 for k=2

Correct trace:
  Element | Heap Content | Action
  --------|--------------|-------------
     3    | [3]          | First element
     2    | [2, 3]       | Add 2, heap=[2,3], size=2
     1    | [2, 3]       | 1<2? No, push 1→[1,3,2], pop→[2,3]
     5    | [3, 5]       | Push 5→[2,3,5], pop→[3,5]
     6    | [5, 6]       | Push 6→[3,5,6], pop→[5,6]
     4    | [4, 6]       | Push 4→[4,5,6], pop→[5,6]

Result: heap[0] = 5 ✓ (2nd largest is 5)

Quickselect Approach:
Target index = n - k = 6 - 2 = 4 (4th smallest = 2nd largest)

1. Choose pivot=4, partition → [3,2,1,4,5,6]
2. pivot_index=3 < 4, recurse right on [5,6]
3. Choose pivot=6, partition → [5,6]
4. pivot_index=4 = target, return nums[4] = 5 ✓
```

---

## Algorithm Steps

### Min Heap Approach (Most Common)

1. **Validate inputs**: Ensure k is valid (1 ≤ k ≤ n)
2. **Initialize heap**: Create an empty min heap
3. **Process elements**: For each number in the array:
   - Push number onto heap
   - If heap size > k, pop the smallest element
4. **Return result**: The root of the heap is the k-th largest

### Quickselect Approach (Average O(n))

1. **Calculate target**: target = len(nums) - k (convert to (n-k)-th smallest)
2. **Define partition function**:
   - Choose pivot (typically rightmost element)
   - Rearrange so elements ≤ pivot are on left
   - Return pivot's final index
3. **Define recursive quickselect**:
   - Partition the current range
   - If pivot_index == target: found it
   - If pivot_index < target: search right partition
   - If pivot_index > target: search left partition
4. **Handle base case**: When range has one element, return it

### Sorting Approach (Simple)

1. Sort array in descending order
2. Return element at index k-1
3. Time: O(n log n), Space: O(1)

---

## Implementation

### Template Code (Multiple Languages)

````carousel
```python
import heapq
from typing import List, Optional

def find_kth_largest(nums: List[int], k: int) -> int:
    """
    Find the k-th largest element in the array using min heap.
    
    Args:
        nums: List of integers (can contain duplicates)
        k: 1-indexed position (k=1 means largest element)
        
    Returns:
        The k-th largest element
        
    Time: O(n log k)
    Space: O(k)
    
    Example:
        >>> find_kth_largest([3, 2, 1, 5, 6, 4], 2)
        5
    """
    if not nums or k < 1 or k > len(nums):
        raise ValueError("Invalid input: k must be between 1 and len(nums)")
    
    # Min-heap approach: keep k largest elements
    # The smallest in heap = kth largest overall
    min_heap = []
    
    for num in nums:
        heapq.heappush(min_heap, num)
        
        # Maintain heap size of k
        if len(min_heap) > k:
            heapq.heappop(min_heap)
    
    return min_heap[0]


def find_kth_largest_quickselect(nums: List[int], k: int) -> int:
    """
    Find kth largest using quickselect algorithm.
    
    Average case: O(n), Worst case: O(n²)
    Space: O(1) - in-place
    
    Args:
        nums: List of integers (will be modified in-place)
        k: 1-indexed position
        
    Returns:
        The k-th largest element
    """
    if not nums or k < 1 or k > len(nums):
        raise ValueError("Invalid input")
    
    # Convert to (n-k)th smallest problem
    target = len(nums) - k
    
    def quickselect(left: int, right: int) -> int:
        pivot_index = partition(left, right)
        
        if pivot_index == target:
            return nums[pivot_index]
        elif pivot_index < target:
            return quickselect(pivot_index + 1, right)
        else:
            return quickselect(left, pivot_index - 1)
    
    def partition(left: int, right: int) -> int:
        # Choose rightmost element as pivot
        pivot = nums[right]
        i = left
        
        for j in range(left, right):
            if nums[j] <= pivot:
                nums[i], nums[j] = nums[j], nums[i]
                i += 1
        
        # Place pivot in its final sorted position
        nums[i], nums[right] = nums[right], nums[i]
        return i
    
    return quickselect(0, len(nums) - 1)


def find_kth_largest_max_heap(nums: List[int], k: int) -> int:
    """
    Find kth largest using max heap.
    
    Time: O(n + k log n)
    Space: O(n)
    
    Note: Only use when k is close to n (more efficient in that case)
    """
    import heapq
    
    # Negate values for max heap behavior
    max_heap = [-num for num in nums]
    heapq.heapify(max_heap)
    
    # Extract max k times
    for _ in range(k - 1):
        heapq.heappop(max_heap)
    
    return -max_heap[0]


def find_kth_largest_sorted(nums: List[int], k: int) -> int:
    """
    Simple sorting approach.
    
    Time: O(n log n)
    Space: O(1) if sorted in-place
    
    Use when simplicity is preferred or n is small
    """
    nums.sort(reverse=True)
    return nums[k - 1]


# Test examples
if __name__ == "__main__":
    test_cases = [
        ([3, 2, 1, 5, 6, 4], 2, 5),
        ([3, 2, 3, 1, 2, 4, 5, 5, 6], 4, 4),
        ([1], 1, 1),
        ([1, 2, 3, 4], 1, 4),
        ([1, 2, 3, 4], 4, 1),
    ]
    
    print("Testing all approaches:")
    print("-" * 50)
    
    for nums, k, expected in test_cases:
        result1 = find_kth_largest(nums.copy(), k)
        result2 = find_kth_largest_quickselect(nums.copy(), k)
        result3 = find_kth_largest_sorted(nums.copy(), k)
        
        print(f"nums={nums}, k={k}")
        print(f"  Min Heap: {result1} {'✓' if result1 == expected else '✗'}")
        print(f"  Quickselect: {result2} {'✓' if result2 == expected else '✗'}")
        print(f"  Sorted: {result3} {'✓' if result3 == expected else '✗'}")
        print()
```

<!-- slide -->
```cpp
#include <iostream>
#include <vector>
#include <queue>
#include <algorithm>
#include <stdexcept>
using namespace std;

/**
 * Find kth largest element using min heap.
 * 
 * Time: O(n log k)
 * Space: O(k)
 */
int findKthLargestMinHeap(const vector<int>& nums, int k) {
    if (nums.empty() || k < 1 || k > nums.size()) {
        throw invalid_argument("Invalid input");
    }
    
    // Min-heap: keeps k largest elements
    priority_queue<int, vector<int>, greater<int>> minHeap;
    
    for (int num : nums) {
        minHeap.push(num);
        if (minHeap.size() > k) {
            minHeap.pop();  // Remove smallest
        }
    }
    
    return minHeap.top();
}


/**
 * Find kth largest using quickselect.
 * 
 * Average: O(n), Worst: O(n²)
 * Space: O(1)
 */
int partition(vector<int>& nums, int left, int right);

int findKthLargestQuickselect(vector<int>& nums, int k) {
    if (nums.empty() || k < 1 || k > nums.size()) {
        throw invalid_argument("Invalid input");
    }
    
    int target = nums.size() - k;  // Convert to (n-k)th smallest
    
    int left = 0, right = nums.size() - 1;
    
    while (true) {
        int pivotIndex = partition(nums, left, right);
        
        if (pivotIndex == target) {
            return nums[pivotIndex];
        } else if (pivotIndex < target) {
            left = pivotIndex + 1;
        } else {
            right = pivotIndex - 1;
        }
    }
}

int partition(vector<int>& nums, int left, int right) {
    int pivot = nums[right];
    int i = left;
    
    for (int j = left; j < right; j++) {
        if (nums[j] <= pivot) {
            swap(nums[i], nums[j]);
            i++;
        }
    }
    
    swap(nums[i], nums[right]);
    return i;
}


/**
 * Find kth largest using sorting.
 * 
 * Time: O(n log n)
 * Space: O(1) or O(n) depending on sort
 */
int findKthLargestSorted(vector<int> nums, int k) {
    sort(nums.begin(), nums.end(), greater<int>());
    return nums[k - 1];
}


/**
 * Find kth largest using max heap.
 * 
 * Time: O(n + k log n)
 * Space: O(n)
 */
int findKthLargestMaxHeap(const vector<int>& nums, int k) {
    priority_queue<int> maxHeap(nums.begin(), nums.end());
    
    for (int i = 0; i < k - 1; i++) {
        maxHeap.pop();
    }
    
    return maxHeap.top();
}


int main() {
    // Test cases
    vector<vector<int>> testArrays = {
        {3, 2, 1, 5, 6, 4},
        {3, 2, 3, 1, 2, 4, 5, 5, 6},
        {1},
        {1, 2, 3, 4}
    };
    
    vector<int> testKs = {2, 4, 1, 1};
    vector<int> expected = {5, 4, 1, 4};
    
    cout << "Testing Kth Largest Element Algorithms" << endl;
    cout << "=======================================" << endl << endl;
    
    for (size_t t = 0; t < testArrays.size(); t++) {
        const auto& nums = testArrays[t];
        int k = testKs[t];
        int exp = expected[t];
        
        cout << "Test " << (t + 1) << ": nums = [";
        for (size_t i = 0; i < nums.size(); i++) {
            cout << nums[i] << (i < nums.size() - 1 ? ", " : "");
        }
        cout << "], k = " << k << endl;
        
        // Test min heap approach
        int result1 = findKthLargestMinHeap(nums, k);
        cout << "  Min Heap:     " << result1 << (result1 == exp ? " ✓" : " ✗") << endl;
        
        // Test quickselect
        vector<int> numsCopy = nums;
        int result2 = findKthLargestQuickselect(numsCopy, k);
        cout << "  Quickselect:  " << result2 << (result2 == exp ? " ✓" : " ✗") << endl;
        
        // Test sorted
        int result3 = findKthLargestSorted(nums, k);
        cout << "  Sorted:       " << result3 << (result3 == exp ? " ✓" : " ✗") << endl;
        
        // Test max heap
        int result4 = findKthLargestMaxHeap(nums, k);
        cout << "  Max Heap:     " << result4 << (result4 == exp ? " ✓" : " ✗") << endl;
        
        cout << endl;
    }
    
    return 0;
}
```

<!-- slide -->
```java
import java.util.PriorityQueue;
import java.util.Random;

/**
 * Kth Largest Element - Multiple Approaches
 * 
 * Time Complexities:
 * - Min Heap: O(n log k), Space: O(k)
 * - Quickselect: O(n) avg, O(n²) worst, Space: O(1)
 * - Max Heap: O(n + k log n), Space: O(n)
 */
public class KthLargest {
    
    /**
     * Find kth largest using min heap (recommended for most cases).
     * 
     * Time: O(n log k)
     * Space: O(k)
     */
    public static int findKthLargestMinHeap(int[] nums, int k) {
        if (nums == null || k < 1 || k > nums.length) {
            throw new IllegalArgumentException("Invalid input");
        }
        
        // Min-heap keeps k largest elements
        PriorityQueue<Integer> minHeap = new PriorityQueue<>();
        
        for (int num : nums) {
            minHeap.offer(num);
            if (minHeap.size() > k) {
                minHeap.poll();  // Remove smallest
            }
        }
        
        return minHeap.peek();
    }
    
    
    /**
     * Find kth largest using quickselect (average O(n)).
     * 
     * Time: O(n) average, O(n²) worst case
     * Space: O(1)
     */
    public static int findKthLargestQuickselect(int[] nums, int k) {
        if (nums == null || k < 1 || k > nums.length) {
            throw new IllegalArgumentException("Invalid input");
        }
        
        int target = nums.length - k;  // Convert to (n-k)th smallest
        return quickselect(nums, 0, nums.length - 1, target);
    }
    
    private static int quickselect(int[] nums, int left, int right, int target) {
        int pivotIndex = partition(nums, left, right);
        
        if (pivotIndex == target) {
            return nums[pivotIndex];
        } else if (pivotIndex < target) {
            return quickselect(nums, pivotIndex + 1, right, target);
        } else {
            return quickselect(nums, left, pivotIndex - 1, target);
        }
    }
    
    private static int partition(int[] nums, int left, int right) {
        // Use median-of-three pivot for better performance
        int pivot = nums[right];
        int i = left;
        
        for (int j = left; j < right; j++) {
            if (nums[j] <= pivot) {
                swap(nums, i, j);
                i++;
            }
        }
        
        swap(nums, i, right);
        return i;
    }
    
    private static void swap(int[] nums, int i, int j) {
        int temp = nums[i];
        nums[i] = nums[j];
        nums[j] = temp;
    }
    
    
    /**
     * Find kth largest using max heap.
     * 
     * Time: O(n + k log n)
     * Space: O(n)
     */
    public static int findKthLargestMaxHeap(int[] nums, int k) {
        PriorityQueue<Integer> maxHeap = new PriorityQueue<>((a, b) -> b - a);
        
        for (int num : nums) {
            maxHeap.offer(num);
        }
        
        for (int i = 0; i < k - 1; i++) {
            maxHeap.poll();
        }
        
        return maxHeap.peek();
    }
    
    
    /**
     * Find kth largest using sorting (simple approach).
     * 
     * Time: O(n log n)
     * Space: O(1) or O(n) depending on implementation
     */
    public static int findKthLargestSorted(int[] nums, int k) {
        Integer[] boxed = new Integer[nums.length];
        for (int i = 0; i < nums.length; i++) {
            boxed[i] = nums[i];
        }
        
        java.util.Arrays.sort(boxed, java.util.Collections.reverseOrder());
        
        return boxed[k - 1];
    }
    
    
    // Test the implementations
    public static void main(String[] args) {
        int[][] testArrays = {
            {3, 2, 1, 5, 6, 4},
            {3, 2, 3, 1, 2, 4, 5, 5, 6},
            {1},
            {1, 2, 3, 4}
        };
        
        int[] testKs = {2, 4, 1, 1};
        int[] expected = {5, 4, 1, 4};
        
        System.out.println("Testing Kth Largest Element Algorithms");
        System.out.println("=========================================\n");
        
        for (int t = 0; t < testArrays.length; t++) {
            int[] nums = testArrays[t];
            int k = testKs[t];
            int exp = expected[t];
            
            System.out.print("Test " + (t + 1) + ": nums = [");
            System.out.print(java.util.Arrays.toString(nums));
            System.out.println("], k = " + k);
            
            // Test min heap
            int result1 = findKthLargestMinHeap(nums.clone(), k);
            System.out.println("  Min Heap:     " + result1 + (result1 == exp ? " ✓" : " ✗"));
            
            // Test quickselect
            int result2 = findKthLargestQuickselect(nums.clone(), k);
            System.out.println("  Quickselect:  " + result2 + (result2 == exp ? " ✓" : " ✗"));
            
            // Test max heap
            int result3 = findKthLargestMaxHeap(nums.clone(), k);
            System.out.println("  Max Heap:     " + result3 + (result3 == exp ? " ✓" : " ✗"));
            
            // Test sorted
            int result4 = findKthLargestSorted(nums.clone(), k);
            System.out.println("  Sorted:       " + result4 + (result4 == exp ? " ✓" : " ✗"));
            
            System.out.println();
        }
    }
}
```

<!-- slide -->
```javascript
/**
 * Kth Largest Element - Multiple Approaches
 * 
 * Time Complexities:
 * - Min Heap: O(n log k), Space: O(k)
 * - Quickselect: O(n) avg, O(n²) worst, Space: O(1)
 * - Max Heap: O(n + k log n), Space: O(n)
 */

/**
 * Find kth largest using min heap (recommended for most cases).
 * 
 * @param {number[]} nums - Array of numbers
 * @param {number} k - 1-indexed position (k=1 means largest)
 * @returns {number} The kth largest element
 * 
 * Time: O(n log k)
 * Space: O(k)
 */
function findKthLargestMinHeap(nums, k) {
    if (!nums || k < 1 || k > nums.length) {
        throw new Error('Invalid input');
    }
    
    // Min-heap implementation
    class MinHeap {
        constructor() {
            this.heap = [];
        }
        
        push(val) {
            this.heap.push(val);
            this.bubbleUp(this.heap.length - 1);
        }
        
        pop() {
            if (this.heap.length === 0) return null;
            const top = this.heap[0];
            const bottom = this.heap.pop();
            if (this.heap.length > 0) {
                this.heap[0] = bottom;
                this.bubbleDown(0);
            }
            return top;
        }
        
        peek() {
            return this.heap[0];
        }
        
        size() {
            return this.heap.length;
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
            while (true) {
                const leftChild = 2 * idx + 1;
                const rightChild = 2 * idx + 2;
                let smallest = idx;
                
                if (leftChild < this.heap.length && 
                    this.heap[leftChild] < this.heap[smallest]) {
                    smallest = leftChild;
                }
                if (rightChild < this.heap.length && 
                    this.heap[rightChild] < this.heap[smallest]) {
                    smallest = rightChild;
                }
                if (smallest === idx) break;
                
                [this.heap[idx], this.heap[smallest]] = 
                    [this.heap[smallest], this.heap[idx]];
                idx = smallest;
            }
        }
    }
    
    const minHeap = new MinHeap();
    
    for (const num of nums) {
        minHeap.push(num);
        if (minHeap.size() > k) {
            minHeap.pop();
        }
    }
    
    return minHeap.peek();
}


/**
 * Find kth largest using quickselect algorithm.
 * 
 * @param {number[]} nums - Array of numbers (will be modified)
 * @param {number} k - 1-indexed position
 * @returns {number} The kth largest element
 * 
 * Time: O(n) average, O(n²) worst
 * Space: O(1)
 */
function findKthLargestQuickselect(nums, k) {
    if (!nums || k < 1 || k > nums.length) {
        throw new Error('Invalid input');
    }
    
    const target = nums.length - k;  // Convert to (n-k)th smallest
    
    function partition(left, right) {
        const pivot = nums[right];
        let i = left;
        
        for (let j = left; j < right; j++) {
            if (nums[j] <= pivot) {
                [nums[i], nums[j]] = [nums[j], nums[i]];
                i++;
            }
        }
        
        [nums[i], nums[right]] = [nums[right], nums[i]];
        return i;
    }
    
    function quickselect(left, right) {
        const pivotIndex = partition(left, right);
        
        if (pivotIndex === target) {
            return nums[pivotIndex];
        } else if (pivotIndex < target) {
            return quickselect(pivotIndex + 1, right);
        } else {
            return quickselect(left, pivotIndex - 1);
        }
    }
    
    return quickselect(0, nums.length - 1);
}


/**
 * Find kth largest using max heap.
 * 
 * @param {number[]} nums - Array of numbers
 * @param {number} k - 1-indexed position
 * @returns {number} The kth largest element
 * 
 * Time: O(n + k log n)
 * Space: O(n)
 */
function findKthLargestMaxHeap(nums, k) {
    // Using built-in max heap via negation
    const maxHeap = [...nums].sort((a, b) => b - a);
    
    return maxHeap[k - 1];
}


/**
 * Find kth largest using sorting (simple approach).
 * 
 * @param {number[]} nums - Array of numbers
 * @param {number} k - 1-indexed position
 * @returns {number} The kth largest element
 * 
 * Time: O(n log n)
 * Space: O(n)
 */
function findKthLargestSorted(nums, k) {
    const sorted = [...nums].sort((a, b) => b - a);
    return sorted[k - 1];
}


// Test examples
const testCases = [
    { nums: [3, 2, 1, 5, 6, 4], k: 2, expected: 5 },
    { nums: [3, 2, 3, 1, 2, 4, 5, 5, 6], k: 4, expected: 4 },
    { nums: [1], k: 1, expected: 1 },
    { nums: [1, 2, 3, 4], k: 1, expected: 4 },
    { nums: [1, 2, 3, 4], k: 4, expected: 1 },
];

console.log('Testing Kth Largest Element Algorithms');
console.log('=========================================\n');

for (const { nums, k, expected } of testCases) {
    console.log(`nums = [${nums.join(', ')}], k = ${k}`);
    
    const result1 = findKthLargestMinHeap([...nums], k);
    console.log(`  Min Heap:     ${result1} ${result1 === expected ? '✓' : '✗'}`);
    
    const result2 = findKthLargestQuickselect([...nums], k);
    console.log(`  Quickselect:  ${result2} ${result2 === expected ? '✓' : '✗'}`);
    
    const result3 = findKthLargestMaxHeap([...nums], k);
    console.log(`  Max Heap:     ${result3} ${result3 === expected ? '✓' : '✗'}`);
    
    const result4 = findKthLargestSorted([...nums], k);
    console.log(`  Sorted:       ${result4} ${result4 === expected ? '✓' : '✗'}`);
    
    console.log();
}
```
````

---

## Time Complexity Analysis

| Approach | Best Case | Average Case | Worst Case | Space Complexity |
|----------|-----------|--------------|------------|------------------|
| **Min Heap (size k)** | O(n log k) | O(n log k) | O(n log k) | O(k) |
| **Max Heap (size n)** | O(n + k log n) | O(n + k log n) | O(n + k log n) | O(n) |
| **Quickselect** | O(n) | O(n) | O(n²) | O(1) |
| **Sorting** | O(n log n) | O(n log n) | O(n log n) | O(1) |

### Detailed Breakdown

- **Min Heap**: For each of n elements, we perform at most one push (O(log k)) and possibly one pop (O(log k)). Total: O(n log k).

- **Quickselect**: Each partition reduces the problem size. On average, we process n + n/2 + n/4 + ... = 2n = O(n) elements.

- **Max Heap**: Building the heap takes O(n), then extracting k elements takes O(k log n).

### Choosing the Right Complexity

| If k is... | Recommended Approach | Rationale |
|------------|---------------------|-----------|
| Small (k << n) | Min Heap | O(n log k) is much better than O(n log n) |
| Large (k ≈ n) | Sorting | O(n log n) becomes comparable |
| Unknown/Streaming | Min Heap | Works with any k, constant memory |
| Need average O(n) | Quickselect | Fastest average performance |

---

## Space Complexity Analysis

| Approach | Space | Description |
|----------|-------|-------------|
| **Min Heap** | O(k) | Only stores k elements at any time |
| **Max Heap** | O(n) | Stores all n elements |
| **Quickselect** | O(1) | In-place partitioning (excluding recursion stack) |
| **Sorting** | O(1) or O(n) | In-place sort vs copy |

### Memory Optimization Tips

1. **For large n, small k**: Use min heap - only O(k) memory
2. **For very small k (k=1,2)**: Consider using two/six variables
3. **For quickselect**: Ensure recursion depth is manageable; consider iterative version

---

## Common Variations

### 1. Kth Smallest Element

Simply swap the heap type or adjust the target index:

````carousel
```python
import heapq

def find_kth_smallest(nums, k):
    """Find kth smallest using max heap - O(n log k)"""
    max_heap = [-x for x in nums]
    heapq.heapify(max_heap)
    
    for _ in range(k - 1):
        heapq.heappop(max_heap)
    
    return -heapq.heappop(max_heap)
```

<!-- slide -->
```cpp
#include <queue>
#include <vector>

int findKthSmallest(const std::vector<int>& nums, int k) {
    // Max heap for kth smallest
    std::priority_queue<int> maxHeap;
    
    for (int num : nums) {
        maxHeap.push(num);
        if (maxHeap.size() > k) {
            maxHeap.pop();
        }
    }
    
    return maxHeap.top();
}
```

<!-- slide -->
```java
import java.util.PriorityQueue;
import java.util.Collections;

public int findKthSmallest(int[] nums, int k) {
    // Max heap for kth smallest
    PriorityQueue<Integer> maxHeap = new PriorityQueue<>(Collections.reverseOrder());
    
    for (int num : nums) {
        maxHeap.offer(num);
        if (maxHeap.size() > k) {
            maxHeap.poll();
        }
    }
    
    return maxHeap.peek();
}
```

<!-- slide -->
```javascript
function findKthSmallest(nums, k) {
    // Max heap using negation trick
    const maxHeap = [];
    
    for (const num of nums) {
        maxHeap.push(-num);
        maxHeap.sort((a, b) => a - b); // Min heap on negatives = max heap
        if (maxHeap.length > k) {
            maxHeap.pop();
        }
    }
    
    return -maxHeap[0];
}
```
````

### 2. Find Top K Elements

Return the entire heap (sorted):

````carousel
```python
def find_top_k(nums, k):
    """Find all k largest elements"""
    import heapq
    
    min_heap = []
    
    for num in nums:
        heapq.heappush(min_heap, num)
        if len(min_heap) > k:
            heapq.heappop(min_heap)
    
    # Sort descending for output
    return sorted(min_heap, reverse=True)
```

<!-- slide -->
```cpp
#include <vector>
#include <queue>
#include <algorithm>

std::vector<int> findTopK(const std::vector<int>& nums, int k) {
    std::priority_queue<int, std::vector<int>, std::greater<int>> minHeap;
    
    for (int num : nums) {
        minHeap.push(num);
        if (minHeap.size() > k) {
            minHeap.pop();
        }
    }
    
    std::vector<int> result;
    while (!minHeap.empty()) {
        result.push_back(minHeap.top());
        minHeap.pop();
    }
    
    std::sort(result.rbegin(), result.rend());
    return result;
}
```

<!-- slide -->
```java
import java.util.PriorityQueue;
import java.util.List;
import java.util.ArrayList;
import java.util.Collections;

public List<Integer> findTopK(int[] nums, int k) {
    PriorityQueue<Integer> minHeap = new PriorityQueue<>();
    
    for (int num : nums) {
        minHeap.offer(num);
        if (minHeap.size() > k) {
            minHeap.poll();
        }
    }
    
    List<Integer> result = new ArrayList<>(minHeap);
    result.sort(Collections.reverseOrder());
    return result;
}
```

<!-- slide -->
```javascript
function findTopK(nums, k) {
    const minHeap = [...nums]
        .sort((a, b) => a - b)
        .slice(0, k);
    
    return minHeap.sort((a, b) => b - a);
}
```
````

### 3. Kth Largest in a Stream

Handle streaming data with fixed memory:

````carousel
```python
import heapq

class KthLargest:
    def __init__(self, k, nums):
        self.k = k
        self.min_heap = []
        
        for num in nums:
            self.add(num)
    
    def add(self, val):
        heapq.heappush(self.min_heap, val)
        if len(self.min_heap) > self.k:
            heapq.heappop(self.min_heap)
        return self.min_heap[0]
```

<!-- slide -->
```cpp
#include <queue>
#include <vector>

class KthLargest {
private:
    int k;
    std::priority_queue<int, std::vector<int>, std::greater<int>> minHeap;

public:
    KthLargest(int k, const std::vector<int>& nums) : k(k) {
        for (int num : nums) {
            add(num);
        }
    }
    
    int add(int val) {
        minHeap.push(val);
        if (minHeap.size() > k) {
            minHeap.pop();
        }
        return minHeap.top();
    }
};
```

<!-- slide -->
```java
import java.util.PriorityQueue;

class KthLargest {
    private int k;
    private PriorityQueue<Integer> minHeap;
    
    public KthLargest(int k, int[] nums) {
        this.k = k;
        this.minHeap = new PriorityQueue<>();
        
        for (int num : nums) {
            add(num);
        }
    }
    
    public int add(int val) {
        minHeap.offer(val);
        if (minHeap.size() > k) {
            minHeap.poll();
        }
        return minHeap.peek();
    }
}
```

<!-- slide -->
```javascript
class KthLargest {
    constructor(k, nums) {
        this.k = k;
        this.minHeap = [];
        
        for (const num of nums) {
            this.add(num);
        }
    }
    
    add(val) {
        this.minHeap.push(val);
        this.minHeap.sort((a, b) => a - b);
        
        if (this.minHeap.length > this.k) {
            this.minHeap.shift();
        }
        
        return this.minHeap[0];
    }
}
```
````

### 4. Duplicate Handling

When duplicates exist, use indices or counts:

````carousel
```python
from collections import Counter

def find_kth_largest_with_duplicates(nums, k):
    """Find kth largest considering duplicates"""
    count = Counter(nums)
    unique_nums = sorted(count.keys(), reverse=True)
    
    remaining = k
    for num in unique_nums:
        remaining -= count[num]
        if remaining <= 0:
            return num
    
    raise ValueError("Should not reach here")
```

<!-- slide -->
```cpp
#include <map>
#include <vector>

int findKthLargestWithDuplicates(const std::vector<int>& nums, int k) {
    std::map<int, int, std::greater<int>> count;
    
    for (int num : nums) {
        count[num]++;
    }
    
    int remaining = k;
    for (const auto& [num, cnt] : count) {
        remaining -= cnt;
        if (remaining <= 0) {
            return num;
        }
    }
    
    return -1;
}
```

<!-- slide -->
```java
import java.util.TreeMap;
import java.util.Collections;

public int findKthLargestWithDuplicates(int[] nums, int k) {
    TreeMap<Integer, Integer> count = new TreeMap<>(Collections.reverseOrder());
    
    for (int num : nums) {
        count.put(num, count.getOrDefault(num, 0) + 1);
    }
    
    int remaining = k;
    for (int num : count.keySet()) {
        remaining -= count.get(num);
        if (remaining <= 0) {
            return num;
        }
    }
    
    return -1;
}
```

<!-- slide -->
```javascript
function findKthLargestWithDuplicates(nums, k) {
    const count = new Map();
    
    for (const num of nums) {
        count.set(num, (count.get(num) || 0) + 1);
    }
    
    const sortedKeys = [...count.keys()].sort((a, b) => b - a);
    
    let remaining = k;
    for (const num of sortedKeys) {
        remaining -= count.get(num);
        if (remaining <= 0) {
            return num;
        }
    }
    
    return -1;
}
```
````

### 5. 2D Matrix Kth Largest

Find kth largest in a sorted matrix:

````carousel
```python
import heapq

def kth_smallest_in_sorted_matrix(matrix, k):
    """LeetCode 378: Kth Smallest Element in a Sorted Matrix"""
    n = len(matrix)
    min_heap = [(matrix[0][0], 0, 0)]
    visited = set([(0, 0)])
    
    while k > 0:
        val, i, j = heapq.heappop(min_heap)
        k -= 1
        
        if k == 0:
            return val
        
        if i + 1 < n and (i + 1, j) not in visited:
            heapq.heappush(min_heap, (matrix[i + 1][j], i + 1, j))
            visited.add((i + 1, j))
        
        if j + 1 < n and (i, j + 1) not in visited:
            heapq.heappush(min_heap, (matrix[i][j + 1], i, j + 1))
            visited.add((i, j + 1))
```

<!-- slide -->
```cpp
#include <vector>
#include <queue>
#include <set>

int kthSmallestInSortedMatrix(const std::vector<std::vector<int>>& matrix, int k) {
    int n = matrix.size();
    using Tuple = std::tuple<int, int, int>;
    std::priority_queue<Tuple, std::vector<Tuple>, std::greater<Tuple>> minHeap;
    std::set<std::pair<int, int>> visited;
    
    minHeap.push({matrix[0][0], 0, 0});
    visited.insert({0, 0});
    
    while (k > 0) {
        auto [val, i, j] = minHeap.top();
        minHeap.pop();
        k--;
        
        if (k == 0) return val;
        
        if (i + 1 < n && !visited.count({i + 1, j})) {
            minHeap.push({matrix[i + 1][j], i + 1, j});
            visited.insert({i + 1, j});
        }
        
        if (j + 1 < n && !visited.count({i, j + 1})) {
            minHeap.push({matrix[i][j + 1], i, j + 1});
            visited.insert({i, j + 1});
        }
    }
    
    return -1;
}
```

<!-- slide -->
```java
import java.util.PriorityQueue;
import java.util.Set;
import java.util.HashSet;

public int kthSmallest(int[][] matrix, int k) {
    int n = matrix.length;
    PriorityQueue<int[]> minHeap = new PriorityQueue<>((a, b) -> a[0] - b[0]);
    Set<String> visited = new HashSet<>();
    
    minHeap.offer(new int[]{matrix[0][0], 0, 0});
    visited.add("0,0");
    
    while (k > 0) {
        int[] curr = minHeap.poll();
        int val = curr[0], i = curr[1], j = curr[2];
        k--;
        
        if (k == 0) return val;
        
        if (i + 1 < n && !visited.contains((i + 1) + "," + j)) {
            minHeap.offer(new int[]{matrix[i + 1][j], i + 1, j});
            visited.add((i + 1) + "," + j);
        }
        
        if (j + 1 < n && !visited.contains(i + "," + (j + 1))) {
            minHeap.offer(new int[]{matrix[i][j + 1], i, j + 1});
            visited.add(i + "," + (j + 1));
        }
    }
    
    return -1;
}
```

<!-- slide -->
```javascript
function kthSmallest(matrix, k) {
    const n = matrix.length;
    const minHeap = [[matrix[0][0], 0, 0]];
    const visited = new Set(["0,0"]);
    
    const compare = (a, b) => a[0] - b[0];
    
    while (k > 0) {
        minHeap.sort(compare);
        const [val, i, j] = minHeap.shift();
        k--;
        
        if (k === 0) return val;
        
        if (i + 1 < n && !visited.has(`${i + 1},${j}`)) {
            minHeap.push([matrix[i + 1][j], i + 1, j]);
            visited.add(`${i + 1},${j}`);
        }
        
        if (j + 1 < n && !visited.has(`${i},${j + 1}`)) {
            minHeap.push([matrix[i][j + 1], i, j + 1]);
            visited.add(`${i},${j + 1}`);
        }
    }
    
    return -1;
}
```
````

---

## Practice Problems

### Problem 1: Kth Largest Element in an Array

**Problem:** [LeetCode 215 - Kth Largest Element in an Array](https://leetcode.com/problems/kth-largest-element-in-an-array/)

**Description:** Given an integer array `nums` and integer `k`, return the `k-th` largest element. Note that it is the `k-th` largest element in sorted order, not the `k-th` distinct element.

**How to Apply the Technique:**
- Use min heap of size k for O(n log k) solution
- Use quickselect for average O(n) solution
- Choose based on whether worst-case guarantees matter

**Solution Approach:**

````carousel
```python
# Min heap approach - most straightforward
def findKthLargest(nums, k):
    min_heap = []
    for num in nums:
        heapq.heappush(min_heap, num)
        if len(min_heap) > k:
            heapq.heappop(min_heap)
    return min_heap[0]
```

<!-- slide -->
```cpp
int findKthLargest(vector<int>& nums, int k) {
    priority_queue<int, vector<int>, greater<int>> minHeap;
    for (int num : nums) {
        minHeap.push(num);
        if (minHeap.size() > k) minHeap.pop();
    }
    return minHeap.top();
}
```

<!-- slide -->
```java
public int findKthLargest(int[] nums, int k) {
    PriorityQueue<Integer> minHeap = new PriorityQueue<>();
    for (int num : nums) {
        minHeap.offer(num);
        if (minHeap.size() > k) minHeap.poll();
    }
    return minHeap.peek();
}
```

<!-- slide -->
```javascript
var findKthLargest = function(nums, k) {
    const minHeap = [];
    for (const num of nums) {
        minHeap.push(num);
        minHeap.sort((a, b) => a - b);
        if (minHeap.length > k) minHeap.shift();
    }
    return minHeap[0];
};
```
````

---

### Problem 2: Kth Largest Element in a Stream

**Problem:** [LeetCode 703 - Kth Largest Element in a Stream](https://leetcode.com/problems/kth-largest-element-in-a-stream/)

**Description:** Design a class `KthLargest` with a constructor that takes an integer `k` and an integer array `nums`, and an `add` method that returns the kth largest element.

**How to Apply the Technique:**
- Use a min heap of size k to maintain only k largest elements seen so far
- This is the classic "streaming" variation of the problem

---

### Problem 3: Kth Smallest Element in a Sorted Matrix

**Problem:** [LeetCode 378 - Kth Smallest Element in a Sorted Matrix](https://leetcode.com/problems/kth-smallest-element-in-a-sorted-matrix/)

**Description:** Given an `n x n` matrix where each row and column is sorted in ascending order, return the `k-th` smallest element in the matrix.

**How to Apply the Technique:**
- Use a min heap starting from top-left (or top-right) element
- Track visited cells to avoid duplicates
- Extract minimum k times to find answer

---

### Problem 4: Find K Pairs with Smallest Sums

**Problem:** [LeetCode 373 - Find K Pairs with Smallest Sums](https://leetcode.com/problems/find-k-pairs-with-smallest-sums/)

**Description:** Given two sorted arrays `nums1` and `nums2`, return the k pairs with the smallest sums.

**How to Apply the Technique:**
- Use a min heap initialized with pairs from nums1[0] to nums1[k-1]
- Each heap entry contains (sum, index1, index2)
- Extract k pairs, adding new candidates after each extraction

---

### Problem 5: Top K Frequent Elements

**Problem:** [LeetCode 347 - Top K Frequent Elements](https://leetcode.com/problems/top-k-frequent-elements/)

**Description:** Given an integer array `nums` and an integer `k`, return the `k` most frequent elements.

**How to Apply the Technique:**
- First, count frequencies using a hash map
- Use a min heap of size k to track top k frequent elements
- This combines frequency counting with the kth largest pattern

---

## Video Tutorial Links

### Fundamentals

- [Kth Largest Element - Heap Approach (Take U Forward)](https://www.youtube.com/watch?v=3BymHM1JJe0) - Comprehensive min heap explanation
- [Quickselect Algorithm (WilliamFiset)](https://www.youtube.com/watch?v=HzvJ82cFCps) - Detailed quickselect visualization
- [Kth Largest Element - LeetCode Solution (NeetCode)](https://www.youtube.com/watch?v=XEmxdkObWt4) - Practical implementation

### Advanced Topics

- [Quickselect vs QuickSort](https://www.youtube.com/watch?v=Y3ZM1rmM5jM) - Understanding the difference
- [Heap vs Quickselect](https://www.youtube.com/watch?v=6Y_G1tHiqes) - When to use which approach
- [Streaming Kth Largest](https://www.youtube.com/watch?v=hOjms7X70sE) - Handling data streams

### Related Problems

- [Kth Smallest in Sorted Matrix](https://www.youtube.com/watch?v=Nvj6N2b6xF8) - 2D variation
- [Top K Frequent Elements](https://www.youtube.com/watch?v=YPTqJIyQ7xQ) - Combining with frequency counting

---

## Follow-up Questions

### Q1: What if k = 1 (finding the maximum)?

**Answer:** For k = 1, all approaches simplify:
- Min heap of size 1: O(n) - just track the maximum seen
- Max heap: O(n) to build, O(1) to extract
- Quickselect: Still O(n) average
- Simply iterating: O(n), O(1) space - most efficient!

### Q2: What if k = n (finding the minimum)?

**Answer:** Similarly, the problem becomes finding the minimum:
- Swap min/max heap strategies
- Quickselect still works with adjusted target
- Consider if you even need a heap - linear scan works

### Q3: How do you handle duplicates?

**Answer:** Several approaches:
1. **Binary search on answer**: Count elements ≥ candidate
2. **Use a counter**: Track frequencies, adjust for duplicates
3. **Return duplicates**: Just use the heap approach directly
4. **Sort and skip**: For small n, sort and handle duplicates

### Q4: Can you find median using this approach?

**Answer:** Yes! The median is essentially:
- For odd n: k = n/2 + 1 (kth smallest)
- For even n: Average of k = n/2 and k = n/2 + 1
- Use the kth largest approach twice or use a specialized median finder

### Q5: What about negative numbers?

**Answer:** All approaches handle negatives correctly:
- Heap operations work with negative numbers
- Quickselect partitioning works with comparisons
- No special handling needed - just ensure comparison logic is correct

### Q6: How do you handle very large k (close to n)?

**Answer:** Consider these strategies:
- **Sorting becomes competitive**: O(n log n) vs O(n log k) when k ≈ n
- **Max heap**: O(n + k log n) can be better when k > n/2
- **Calculate (n-k+1)th smallest**: Could be more efficient

---

## Summary

The Kth Largest Element is a fundamental problem that tests understanding of various algorithmic techniques. Key takeaways:

| Approach | Time | Space | When to Use |
|----------|------|-------|-------------|
| **Min Heap (size k)** | O(n log k) | O(k) | Most cases, streaming |
| **Quickselect** | O(n) avg, O(n²) worst | O(1) | Space-critical, avg performance |
| **Max Heap** | O(n + k log n) | O(n) | k close to n |
| **Sorting** | O(n log n) | O(1) | Small n, simplicity |

When to use:
- ✅ Stream processing with memory constraints → Min Heap
- ✅ Need guaranteed performance → Min Heap  
- ✅ Average O(n) is critical → Quickselect
- ✅ k close to n → Sorting or Max Heap
- ❌ Don't use naive approach for large n

This problem pattern appears frequently in interviews and competitive programming, making it essential to master. The techniques learned here apply to many other problems like top-k elements, medians, and order statistics.

---

## Related Algorithms

- [Heap Sort](./heap-sort.md) - Full sorting using heap data structure
- [Quicksort](./quicksort.md) - Sorting algorithm that inspired quickselect
- [Top K Elements](./top-k-elements.md) - Finding top k elements
- [Median of Two Arrays](./median-of-two-sorted-arrays.md) - Related order statistic problem
