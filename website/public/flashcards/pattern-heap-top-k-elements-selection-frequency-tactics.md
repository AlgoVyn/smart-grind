## Heap - Top K Elements: Tactics

What are practical tactics for solving Top K Elements problems?

<!-- front -->

---

### Tactic 1: Python heapq with Negation for Max-Heap

**Problem:** Python's `heapq` only supports min-heap. How to find K smallest?

**Solution:** Negate values to simulate max-heap behavior.

```python
import heapq

def find_k_smallest(nums, k):
    """Find K smallest using min-heap with negation."""
    max_heap = []
    
    for num in nums:
        # Push negative (simulates max-heap)
        heapq.heappush(max_heap, -num)
        
        if len(max_heap) > k:
            heapq.heappop(max_heap)  # Removes largest (most negative)
    
    # Convert back from negative
    return [-x for x in max_heap]

# Alternative: Use key parameter with custom objects
# For complex objects, use tuples: (-priority, item)
```

---

### Tactic 2: Bucket Sort for O(N) Frequency Problems

**Problem:** Need O(N) time for top K frequent when frequencies are bounded.

**Solution:** Use array index as frequency bucket.

```python
def top_k_frequent_bucket(nums, k):
    """
    O(N) solution using bucket sort.
    Works when: max frequency <= N
    """
    from collections import Counter
    
    freq = Counter(nums)
    n = len(nums)
    
    # buckets[i] = elements with frequency i
    buckets = [[] for _ in range(n + 1)]
    for num, count in freq.items():
        buckets[count].append(num)
    
    # Collect from highest frequency
    result = []
    for count in range(n, 0, -1):
        for num in buckets[count]:
            result.append(num)
            if len(result) == k:
                return result
    
    return result
```

---

### Tactic 3: Custom Comparator for Complex Objects

**Problem:** Need to find top K based on multiple criteria.

**Solution:** Push tuples with comparison priority.

```python
def k_closest_points(points, k):
    """
    Find K closest points to origin.
    Distance = sqrt(x² + y²), but we compare squared distance.
    """
    min_heap = []
    
    for x, y in points:
        # Distance squared (avoid sqrt for comparison)
        dist = x * x + y * y
        
        # Push tuple: (distance, point)
        # Heap compares by first element, then second
        heapq.heappush(min_heap, (dist, [x, y]))
        
        if len(min_heap) > k:
            heapq.heappop(min_heap)
    
    return [point for dist, point in min_heap]
```

---

### Tactic 4: Handling Ties and Secondary Sorting

**Problem:** Need stable ordering when frequencies are equal.

**Solution:** Include secondary sort key in tuple.

```python
def top_k_frequent_with_tie_break(nums, k):
    """
    Top K frequent. On tie, smaller number comes first.
    """
    from collections import Counter
    
    freq = Counter(nums)
    min_heap = []
    
    for num, count in freq.items():
        # Tuple: (frequency, num)
        # Python compares tuples element by element
        # For max-heap effect: use (-count, num)
        heapq.heappush(min_heap, (count, num))
        
        if len(min_heap) > k:
            heapq.heappop(min_heap)
    
    # Sort by frequency desc, then by num asc
    result = sorted(min_heap, key=lambda x: (-x[0], x[1]))
    return [num for count, num in result]
```

---

### Tactic 5: Streaming/Online Kth Element

**Problem:** Data arrives continuously, need to track Kth largest in real-time.

**Solution:** Maintain fixed-size heap, update on each new element.

```python
class KthLargest:
    """
    Stream processor for Kth largest element.
    LeetCode 703: Kth Largest Element in a Stream
    """
    def __init__(self, k: int, nums: List[int]):
        self.k = k
        self.min_heap = []
        
        # Initialize with given nums
        for num in nums:
            self.add(num)
    
    def add(self, val: int) -> int:
        """Add new element and return current Kth largest."""
        heapq.heappush(self.min_heap, val)
        
        if len(self.min_heap) > self.k:
            heapq.heappop(self.min_heap)
        
        # Root is the Kth largest
        return self.min_heap[0]

# Usage:
# obj = KthLargest(3, [4, 5, 8, 2])
# obj.add(3)  # returns 4 (4th largest is 4)
# obj.add(5)  # returns 5
```

---

### Tactic 6: QuickSelect for Single Kth Element

**Problem:** Only need the Kth element (not all K elements), can modify array.

**Solution:** Use QuickSelect for O(N) average time.

```python
import random

def quickselect_kth_largest(nums, k):
    """
    Find Kth largest using QuickSelect.
    Average O(N) time, O(1) space.
    Modifies input array!
    """
    def partition(left, right, pivot_idx):
        pivot = nums[pivot_idx]
        nums[pivot_idx], nums[right] = nums[right], nums[pivot_idx]
        store_idx = left
        
        for i in range(left, right):
            if nums[i] < pivot:
                nums[store_idx], nums[i] = nums[i], nums[store_idx]
                store_idx += 1
        
        nums[right], nums[store_idx] = nums[store_idx], nums[right]
        return store_idx
    
    def select(left, right, k_smallest):
        if left == right:
            return nums[left]
        
        pivot_idx = random.randint(left, right)
        pivot_idx = partition(left, right, pivot_idx)
        
        if k_smallest == pivot_idx:
            return nums[k_smallest]
        elif k_smallest < pivot_idx:
            return select(left, pivot_idx - 1, k_smallest)
        else:
            return select(pivot_idx + 1, right, k_smallest)
    
    # Kth largest = (n - k)th smallest
    return select(0, len(nums) - 1, len(nums) - k)
```

---

### Tactic 7: Merge K Sorted Lists with Heap

**Problem:** Merge multiple sorted lists efficiently.

**Solution:** Use heap to track next element from each list.

```python
def merge_k_sorted_lists(lists):
    """
    Merge K sorted linked lists.
    Uses heap to get minimum of K heads.
    """
    # Heap stores: (value, list_index, element)
    # Need list_index as tie-breaker (lists may have same values)
    heap = []
    
    for i, lst in enumerate(lists):
        if lst:
            heapq.heappush(heap, (lst[0], i, lst))
    
    result = []
    while heap:
        val, idx, lst = heapq.heappop(heap)
        result.append(val)
        
        # Push next element from same list
        remaining = lst[1:]
        if remaining:
            heapq.heappush(heap, (remaining[0], idx, remaining))
    
    return result
```

<!-- back -->
