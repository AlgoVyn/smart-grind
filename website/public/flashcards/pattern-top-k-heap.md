## Top K Elements: Heap vs Quickselect

**Question:** How do you find top K elements efficiently?

<!-- front -->

---

## Answer: Use Heap or Quickselect Based on Use Case

### Method 1: Heap (Recommended)
```python
import heapq

# For Kth largest (Kth from largest)
def findKthLargest(nums, k):
    # Min-heap of size k
    min_heap = nums[:k]
    heapq.heapify(min_heap)
    
    for num in nums[k:]:
        if num > min_heap[0]:
            heapq.heapreplace(min_heap, num)
    
    return min_heap[0]

# For top K largest
def topKLargest(nums, k):
    min_heap = nums[:k]
    heapq.heapify(min_heap)
    
    for num in nums[k:]:
        if num > min_heap[0]:
            heapq.heapreplace(min_heap, num)
    
    return sorted(min_heap, reverse=True)
```

### Method 2: Quickselect
```python
import random

def findKthLargest(nums, k):
    k = len(nums) - k  # Convert to index
    
    def quickSelect(left, right):
        pivot = random.choice(range(left, right + 1))
        pivotValue = nums[pivot]
        
        # Move pivot to end
        nums[pivot], nums[right] = nums[right], nums[pivot]
        store_index = left
        
        for i in range(left, right):
            if nums[i] < pivotValue:
                nums[store_index], nums[i] = nums[i], nums[store_index]
                store_index += 1
        
        nums[store_index], nums[right] = nums[right], nums[store_index]
        
        if store_index == k:
            return nums[store_index]
        elif store_index < k:
            return quickSelect(store_index + 1, right)
        else:
            return quickSelect(left, store_index - 1)
    
    return quickSelect(0, len(nums) - 1)
```

### Visual: Heap Approach
```
nums = [3, 2, 1, 5, 6, 4], k = 2

Find 2nd largest:

Step 1: heap = [3, 2] (first k elements)
Step 2: num=1, 1 > 3? No, skip
Step 3: num=5, 5 > 3? Yes, replace → heap = [5, 2]
Step 4: num=6, 6 > 2? Yes, replace → heap = [5, 6]
Step 5: num=4, 4 > 5? No

Result: min of heap = 5 (2nd largest)
```

### ⚠️ Tricky Parts

#### 1. Min-Heap vs Max-Heap
```python
# For Kth LARGEST → use MIN-heap
# Keep k smallest, the top of heap is the kth largest

# For Kth SMALLEST → use MAX-heap  
# Keep k largest, the top of heap is the kth smallest
```

#### 2. heapreplace vs heappop + heappush
```python
# heapreplace - O(log k) but doesn't require extra space
# More efficient when you want to update in place

# Alternative - less efficient
if num > min_heap[0]:
    heapq.heappop(min_heap)
    heapq.heappush(min_heap, num)
```

#### 3. Converting Index
```python
# Kth largest (1-indexed) → index = len(nums) - k
# Kth smallest (1-indexed) → index = k - 1

kth_largest = len(nums) - k  # For quickselect
```

### Comparison

| Method | Time | Space | Best For |
|--------|------|-------|----------|
| Sorting | O(n log n) | O(1) | Small n |
| Heap | O(n log k) | O(k) | Streaming data |
| Quickselect | O(n) avg, O(n²) worst | O(1) | Single query |

### When to Use Each

| Scenario | Method |
|----------|--------|
| Single query, large n | Quickselect |
| Multiple queries | Heap |
| Can't modify array | Heap |
| Need top k sorted | Heap |

### Common Mistakes

| Mistake | Fix |
|---------|-----|
| Using max-heap for kth largest | Use min-heap instead |
| Not handling duplicates | Use Counter or handle specially |
| Wrong index conversion | Remember: kth largest = n-k index |

<!-- back -->
