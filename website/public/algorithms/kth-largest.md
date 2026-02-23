# Kth Largest Element

## Category
Heap / Priority Queue

## Description
Find kth largest element using min heap.

---

## When to Use
Use this algorithm when you need to solve problems involving:
- heap / priority queue related operations
- Efficient traversal or search operations
- Optimization problems where this pattern applies

---

## Algorithm Steps
1. Understand the problem constraints and requirements
2. Identify the input and expected output
3. Apply the core algorithm logic
4. Handle edge cases appropriately
5. Optimize for the given constraints

---

## Algorithm Explanation

The Kth Largest Element problem asks to find the k-th largest element in an unsorted array. There are several approaches:

**Approach 1: Heap-based (Min Heap)**
- Maintain a min-heap of size k
- Keep only the k largest elements
- The smallest in the heap is the kth largest
- Time: O(n log k), Space: O(k)

**Approach 2: Quickselect (Average O(n))**
- Similar to quicksort but only recurse into one partition
- Average case: O(n), Worst case: O(n²)
- In-place, space: O(1)

**Approach 3: Sorting**
- Sort the array and pick kth from end
- Time: O(n log n)

**Which to use?**
- Use heap when k is small relative to n
- Use quickselect when you need average O(n) and can tolerate worst case
- Use sorting for simplicity when n is small

**Key Insight for Heap:**
- For kth largest, we want k largest elements
- Min-heap of size k keeps only the k largest
- The top of min-heap = smallest among k largest = kth largest

---

## Implementation

```python
import heapq

def find_kth_largest(nums, k):
    """
    Find the k-th largest element in the array.
    
    Args:
        nums: List of integers
        k: 1-indexed (k=1 means largest)
        
    Returns:
        The k-th largest element
        
    Time: O(n log k)
    Space: O(k)
    """
    # Min-heap approach
    # Keep k largest elements, top of heap is kth largest
    min_heap = []
    
    for num in nums:
        heapq.heappush(min_heap, num)
        
        # Keep only k elements in heap
        if len(min_heap) > k:
            heapq.heappop(min_heap)
    
    return min_heap[0]


# Quickselect - Average O(n)
def find_kth_largest_quickselect(nums, k):
    """
    Find kth largest using quickselect algorithm.
    
    Time: O(n) average, O(n²) worst case
    Space: O(1)
    """
    # Convert to (n-k)th smallest
    target = len(nums) - k
    
    def quickselect(left, right):
        pivot_index = partition(left, right)
        
        if pivot_index == target:
            return nums[pivot_index]
        elif pivot_index < target:
            return quickselect(pivot_index + 1, right)
        else:
            return quickselect(left, pivot_index - 1)
    
    def partition(left, right):
        # Choose rightmost element as pivot
        pivot = nums[right]
        i = left
        
        for j in range(left, right):
            if nums[j] <= pivot:
                nums[i], nums[j] = nums[j], nums[i]
                i += 1
        
        nums[i], nums[right] = nums[right], nums[i]
        return i
    
    return quickselect(0, len(nums) - 1)


# Alternative: Using sorted (simple but O(n log n))
def find_kth_largest_sorted(nums, k):
    """Simple sorting approach - O(n log n)."""
    nums.sort(reverse=True)
    return nums[k - 1]
```

```javascript
function kthLargest() {
    // Kth Largest Element implementation
    // Time: O(n log k)
    // Space: O(k)
}
```

---

## Example

**Input:**
```
nums = [3, 2, 1, 5, 6, 4]
k = 2
```

**Output:**
```
5
```

**Explanation:**
- Sorted array: [6, 5, 4, 3, 2, 1]
- 2nd largest = 5

**Heap Process:**
- After processing all elements with k=2:
- Heap contains [5, 6] (the 2 largest)
- Top of min-heap = 5

**Additional Examples:**
```
Input: nums = [3, 2, 3, 1, 2, 4, 5, 5, 6], k = 4
Output: 4

Input: nums = [1], k = 1
Output: 1

Input: nums = [1, 2, 3, 4], k = 1
Output: 4 (the largest)

Input: nums = [1, 2, 3, 4], k = 4
Output: 1 (the smallest)
```

---

## Time Complexity
**O(n log k)**

---

## Space Complexity
**O(k)**

---

## Common Variations
- Iterative vs Recursive implementation
- Space-optimized versions
- Modified versions for specific constraints

---

## Related Problems
- Practice problems that use this algorithm pattern
- Similar algorithms in the same category

---

## Tips
- Always consider edge cases
- Think about time vs space trade-offs
- Look for opportunities to optimize
