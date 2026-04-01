## Title: Kth Largest Forms

What are the different forms and variations of kth element problems?

<!-- front -->

---

### Problem Variations
| Variation | Approach |
|-----------|----------|
| Kth largest | A[n-k] after sorting, or quickselect |
| Kth smallest | A[k-1] after sorting |
| Median | Quickselect with k = n//2 |
| Top k elements | Heap or quickselect with partition |
| Kth in sorted matrix | Binary search on value |
| Kth in BST | Inorder traversal |
| Kth in two sorted arrays | Binary search |

### Top K Variations
```python
# K largest elements - unsorted
heapq.nlargest(k, nums)  # O(n log k)

# K largest - sorted result
sorted(heapq.nlargest(k, nums))  # O(n log k + k log k)

# K smallest
heapq.nsmallest(k, nums)
```

---

### Kth in Two Sorted Arrays
```python
def kth_two_sorted(A, B, k):
    """O(log k) using binary search"""
    if len(A) > len(B):
        A, B = B, A
    if not A:
        return B[k-1]
    if k == 1:
        return min(A[0], B[0])
    
    i = min(k//2, len(A))
    j = min(k//2, len(B))
    
    if A[i-1] < B[j-1]:
        return kth_two_sorted(A[i:], B, k - i)
    else:
        return kth_two_sorted(A, B[j:], k - j)
```

---

### Kth Largest in Data Stream
```python
class KthLargest:
    def __init__(self, k, nums):
        self.k = k
        self.min_heap = nums[:k]
        heapq.heapify(self.min_heap)
        for num in nums[k:]:
            self.add(num)
    
    def add(self, val):
        if len(self.min_heap) < self.k:
            heapq.heappush(self.min_heap, val)
        elif val > self.min_heap[0]:
            heapq.heapreplace(self.min_heap, val)
        return self.min_heap[0]
```

<!-- back -->
