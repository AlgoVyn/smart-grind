# Merge Sort

## Category
Sorting Algorithms

## Description

Merge Sort is a divide-and-conquer sorting algorithm that divides the array into halves, recursively sorts them, and then merges the sorted halves. It guarantees O(n log n) time complexity in all cases—best, average, and worst—making it one of the most reliable sorting algorithms for large datasets.

The algorithm's stability (preserves relative order of equal elements) and predictable performance make it particularly valuable for sorting linked lists, external sorting of large files that don't fit in memory, and as a building block for more complex algorithms like merge sort-based inversion counting. While it requires O(n) auxiliary space, this trade-off provides guaranteed performance regardless of input distribution.

---

## Concepts

Merge Sort is built on fundamental divide-and-conquer principles.

### 1. Divide-and-Conquer Strategy

The three-step approach:

| Step | Action | Complexity |
|------|--------|------------|
| **Divide** | Split array into two halves | O(1) |
| **Conquer** | Recursively sort each half | 2 × T(n/2) |
| **Combine** | Merge two sorted halves | O(n) |

### 2. Recurrence Relation

The mathematical analysis:

```
T(n) = 2T(n/2) + O(n)

By Master Theorem:
T(n) = O(n log n)

Tree visualization:
       n                  cost: n
     /   \
   n/2   n/2             cost: n
   / \    / \
 n/4 n/4 n/4 n/4         cost: n
 ...                     ...
 log n levels, each costing n
```

### 3. Stability

Preservation of relative order:

| Property | Description |
|----------|-------------|
| **Stable** | Equal elements maintain original order |
| **Important for** | Multi-key sorting, data consistency |
| **Guaranteed** | Yes, always stable |

### 4. Space Complexity Trade-offs

| Variant | Space | Notes |
|---------|-------|-------|
| **Standard** | O(n) | Requires auxiliary array |
| **Linked List** | O(1) | In-place with pointer manipulation |
| **Bottom-up** | O(n) | Iterative, no recursion stack |
| **In-place** | O(1) | Complex, not practical |

---

## Frameworks

Structured approaches for implementing merge sort.

### Framework 1: Standard Recursive Merge Sort

```
┌─────────────────────────────────────────────────────────────┐
│  STANDARD MERGE SORT FRAMEWORK                                │
├─────────────────────────────────────────────────────────────┤
│  Input: Array arr of length n                                  │
│  Output: Sorted array                                          │
│                                                                │
│  MERGE_SORT(arr, left, right):                                │
│    If left >= right:                                           │
│      return  // Base case: single element                    │
│                                                                │
│    mid = (left + right) // 2                                  │
│    MERGE_SORT(arr, left, mid)   // Sort first half           │
│    MERGE_SORT(arr, mid+1, right)  // Sort second half        │
│    MERGE(arr, left, mid, right)   // Combine                │
│                                                                │
│  MERGE(arr, left, mid, right):                                 │
│    Create temp array of size (right - left + 1)             │
│    i = left, j = mid + 1, k = 0                              │
│                                                                │
│    While i <= mid AND j <= right:                           │
│      If arr[i] <= arr[j]:                                     │
│        temp[k] = arr[i], i++, k++                            │
│      Else:                                                     │
│        temp[k] = arr[j], j++, k++                            │
│                                                                │
│    Copy remaining elements from left half                     │
│    Copy remaining elements from right half                    │
│    Copy temp back to arr[left..right]                         │
└─────────────────────────────────────────────────────────────┘
```

**When to use**: Standard merge sort implementation.

### Framework 2: Bottom-Up Iterative Merge Sort

```
┌─────────────────────────────────────────────────────────────┐
│  BOTTOM-UP MERGE SORT FRAMEWORK                               │
├─────────────────────────────────────────────────────────────┤
│  Input: Array arr of length n                                  │
│  Output: Sorted array (in-place)                             │
│                                                                │
│  width = 1                                                       │
│  While width < n:                                             │
│    For i = 0 to n with step 2*width:                         │
│      left = i                                                   │
│      mid = min(i + width - 1, n - 1)                         │
│      right = min(i + 2*width - 1, n - 1)                     │
│                                                                │
│      MERGE(arr, left, mid, right)                            │
│                                                                │
│    width *= 2                                                 │
│                                                                │
│  Return arr                                                     │
│                                                                │
│  Note: No recursion, natural merge detection possible         │
└─────────────────────────────────────────────────────────────┘
```

**When to use**: When recursion depth is a concern, or for natural merge sort.

### Framework 3: Linked List Merge Sort

```
┌─────────────────────────────────────────────────────────────┐
│  LINKED LIST MERGE SORT FRAMEWORK                             │
├─────────────────────────────────────────────────────────────┤
│  Input: Head of linked list                                    │
│  Output: Head of sorted list                                   │
│                                                                │
│  SORT_LIST(head):                                             │
│    If not head or not head.next:                               │
│      return head  // Base case                                 │
│                                                                │
│    // Find middle using slow/fast pointers                    │
│    slow, fast = head, head.next                               │
│    While fast and fast.next:                                   │
│      slow = slow.next                                         │
│      fast = fast.next.next                                    │
│                                                                │
│    mid = slow.next                                            │
│    slow.next = None  // Split list                            │
│                                                                │
│    left = SORT_LIST(head)                                     │
│    right = SORT_LIST(mid)                                     │
│                                                                │
│    return MERGE_LISTS(left, right)                             │
│                                                                │
│  MERGE_LISTS(l1, l2):                                         │
│    dummy = ListNode(0)                                         │
│    current = dummy                                             │
│                                                                │
│    While l1 and l2:                                           │
│      If l1.val <= l2.val:                                     │
│        current.next = l1, l1 = l1.next                         │
│      Else:                                                     │
│        current.next = l2, l2 = l2.next                         │
│      current = current.next                                     │
│                                                                │
│    current.next = l1 or l2                                     │
│    return dummy.next                                           │
└─────────────────────────────────────────────────────────────┘
```

**When to use**: Sorting linked lists (O(1) space).

---

## Forms

Different manifestations of merge sort.

### Form 1: Standard Merge Sort

Recursive array-based sorting.

| Aspect | Details |
|--------|---------|
| **Time** | O(n log n) all cases |
| **Space** | O(n) auxiliary |
| **Stable** | Yes |
| **Use** | General sorting, guaranteed performance |

### Form 2: Bottom-Up Merge Sort

Iterative array-based sorting.

| Aspect | Details |
|--------|---------|
| **Time** | O(n log n) |
| **Space** | O(n) |
| **Recursion** | None (iterative) |
| **Use** | Avoiding recursion stack limits |

### Form 3: Linked List Merge Sort

Pointer-based sorting.

| Aspect | Details |
|--------|---------|
| **Time** | O(n log n) |
| **Space** | O(1) auxiliary (recursion stack: O(log n)) |
| **Use** | Linked list sorting, minimal extra space |

### Form 4: Natural Merge Sort

Adaptive version for partially sorted data.

| Aspect | Details |
|--------|---------|
| **Time** | O(n log n) worst, O(n) best (already sorted) |
| **Approach** | Identify natural runs, merge them |
| **Use** | Nearly sorted data |

### Form 5: Modified for Counting

Count inversions or specific properties during merge.

| Aspect | Details |
|--------|---------|
| **Extension** | Count inversions, reverse pairs |
| **Modification** | Add counting logic during merge |
| **Use** | LeetCode 315, 493, etc. |

---

## Tactics

Specific techniques and optimizations.

### Tactic 1: Standard Merge Sort Implementation

Complete recursive implementation:

```python
def merge_sort(nums):
    """
    Merge sort - divide and conquer.
    Time: O(n log n), Space: O(n)
    """
    if len(nums) <= 1:
        return nums
    
    # Divide
    mid = len(nums) // 2
    left = merge_sort(nums[:mid])
    right = merge_sort(nums[mid:])
    
    # Conquer (merge)
    return merge(left, right)

def merge(left, right):
    """Merge two sorted arrays."""
    result = []
    i = j = 0
    
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            result.append(left[i])
            i += 1
        else:
            result.append(right[j])
            j += 1
    
    # Add remaining elements
    result.extend(left[i:])
    result.extend(right[j:])
    return result
```

### Tactic 2: In-Place Merge Sort

For arrays, not truly in-place but uses single temp array:

```python
def merge_sort_inplace(nums):
    """In-place merge sort using index ranges."""
    def sort(start, end):
        if end - start <= 1:
            return
        
        mid = (start + end) // 2
        sort(start, mid)
        sort(mid, end)
        merge(start, mid, end)
    
    def merge(start, mid, end):
        """Merge nums[start:mid] and nums[mid:end]."""
        temp = []
        i, j = start, mid
        
        while i < mid and j < end:
            if nums[i] <= nums[j]:
                temp.append(nums[i])
                i += 1
            else:
                temp.append(nums[j])
                j += 1
        
        temp.extend(nums[i:mid])
        temp.extend(nums[j:end])
        
        # Copy back
        for idx in range(start, end):
            nums[idx] = temp[idx - start]
    
    sort(0, len(nums))
    return nums
```

### Tactic 3: Bottom-Up Iterative Merge Sort

Non-recursive version:

```python
def merge_sort_bottom_up(nums):
    """Bottom-up merge sort without recursion."""
    n = len(nums)
    width = 1
    
    while width < n:
        for i in range(0, n, 2 * width):
            left = i
            mid = min(i + width, n)
            right = min(i + 2 * width, n)
            
            # Merge nums[left:mid] and nums[mid:right]
            temp = []
            l, r = left, mid
            while l < mid and r < right:
                if nums[l] <= nums[r]:
                    temp.append(nums[l])
                    l += 1
                else:
                    temp.append(nums[r])
                    r += 1
            temp.extend(nums[l:mid])
            temp.extend(nums[r:right])
            
            # Copy back
            for j in range(len(temp)):
                nums[left + j] = temp[j]
        
        width *= 2
    
    return nums
```

### Tactic 4: Linked List Sort

Sorting linked lists:

```python
def sort_list(head):
    """Sort linked list using merge sort."""
    if not head or not head.next:
        return head
    
    # Find middle using slow/fast pointers
    slow, fast = head, head.next
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
    
    mid = slow.next
    slow.next = None
    
    # Recursively sort halves
    left = sort_list(head)
    right = sort_list(mid)
    
    # Merge
    dummy = ListNode(0)
    current = dummy
    
    while left and right:
        if left.val <= right.val:
            current.next = left
            left = left.next
        else:
            current.next = right
            right = right.next
        current = current.next
    
    current.next = left or right
    return dummy.next
```

### Tactic 5: Count Inversions

Modified merge sort to count inversions:

```python
def count_inversions(nums):
    """Count inversions using modified merge sort."""
    count = [0]  # Use list for mutable reference
    
    def merge_count(start, end):
        if end - start <= 1:
            return nums[start:end]
        
        mid = (start + end) // 2
        left = merge_count(start, mid)
        right = merge_count(mid, end)
        
        # Merge and count
        result = []
        i = j = 0
        
        while i < len(left) and j < len(right):
            if left[i] <= right[j]:
                result.append(left[i])
                i += 1
            else:
                result.append(right[j])
                j += 1
                count[0] += len(left) - i  # All remaining in left are inversions
        
        result.extend(left[i:])
        result.extend(right[j:])
        return result
    
    merge_count(0, len(nums))
    return count[0]
```

---

## Python Templates

### Template 1: Standard Merge Sort

```python
def merge_sort(nums: list[int]) -> list[int]:
    """
    Merge sort - divide and conquer.
    
    Args:
        nums: List of integers to sort
    
    Returns:
        New sorted list
        
    Time: O(n log n)
    Space: O(n)
    """
    if len(nums) <= 1:
        return nums
    
    # Divide
    mid = len(nums) // 2
    left = merge_sort(nums[:mid])
    right = merge_sort(nums[mid:])
    
    # Conquer (merge)
    return merge(left, right)

def merge(left: list[int], right: list[int]) -> list[int]:
    """Merge two sorted arrays."""
    result = []
    i = j = 0
    
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            result.append(left[i])
            i += 1
        else:
            result.append(right[j])
            j += 1
    
    result.extend(left[i:])
    result.extend(right[j:])
    return result
```

### Template 2: In-Place Merge Sort

```python
def merge_sort_inplace(nums: list[int]) -> list[int]:
    """
    In-place merge sort.
    Modifies original array.
    
    Time: O(n log n)
    Space: O(n) for temp array during merge
    """
    def sort(start: int, end: int):
        if end - start <= 1:
            return
        
        mid = (start + end) // 2
        sort(start, mid)
        sort(mid, end)
        merge(start, mid, end)
    
    def merge(start: int, mid: int, end: int):
        """Merge nums[start:mid] and nums[mid:end]."""
        temp = []
        i, j = start, mid
        
        while i < mid and j < end:
            if nums[i] <= nums[j]:
                temp.append(nums[i])
                i += 1
            else:
                temp.append(nums[j])
                j += 1
        
        temp.extend(nums[i:mid])
        temp.extend(nums[j:end])
        
        # Copy back
        for idx in range(start, end):
            nums[idx] = temp[idx - start]
    
    sort(0, len(nums))
    return nums
```

### Template 3: Bottom-Up Merge Sort

```python
def merge_sort_bottom_up(nums: list[int]) -> list[int]:
    """
    Bottom-up merge sort (iterative).
    No recursion, suitable for large arrays.
    
    Time: O(n log n)
    Space: O(n)
    """
    n = len(nums)
    width = 1
    
    while width < n:
        for i in range(0, n, 2 * width):
            left = i
            mid = min(i + width, n)
            right = min(i + 2 * width, n)
            
            # Merge
            temp = []
            l, r = left, mid
            while l < mid and r < right:
                if nums[l] <= nums[r]:
                    temp.append(nums[l])
                    l += 1
                else:
                    temp.append(nums[r])
                    r += 1
            temp.extend(nums[l:mid])
            temp.extend(nums[r:right])
            
            # Copy back
            for j in range(len(temp)):
                nums[left + j] = temp[j]
        
        width *= 2
    
    return nums
```

### Template 4: Sort Linked List

```python
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def sort_list(head: ListNode) -> ListNode:
    """
    Sort linked list using merge sort.
    LeetCode 148: Sort List.
    
    Args:
        head: Head of linked list
    
    Returns:
        Head of sorted list
        
    Time: O(n log n)
    Space: O(1) auxiliary (recursion stack O(log n))
    """
    if not head or not head.next:
        return head
    
    # Find middle using slow/fast pointers
    slow, fast = head, head.next
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
    
    mid = slow.next
    slow.next = None
    
    # Sort halves
    left = sort_list(head)
    right = sort_list(mid)
    
    # Merge
    dummy = ListNode(0)
    current = dummy
    
    while left and right:
        if left.val <= right.val:
            current.next = left
            left = left.next
        else:
            current.next = right
            right = right.next
        current = current.next
    
    current.next = left or right
    return dummy.next
```

### Template 5: Count of Smaller After Self (Modified Merge Sort)

```python
def count_smaller(nums: list[int]) -> list[int]:
    """
    LeetCode 315: Count of Smaller Numbers After Self.
    Modified merge sort to count inversions.
    
    Args:
        nums: List of integers
    
    Returns:
        List where result[i] = count of smaller elements to the right
        
    Time: O(n log n)
    Space: O(n)
    """
    n = len(nums)
    result = [0] * n
    
    # Store (value, original_index)
    arr = [(nums[i], i) for i in range(n)]
    
    def merge_sort(start: int, end: int):
        if end - start <= 1:
            return arr[start:end]
        
        mid = (start + end) // 2
        left = merge_sort(start, mid)
        right = merge_sort(mid, end)
        
        # Merge and count
        merged = []
        i = j = 0
        
        while i < len(left) and j < len(right):
            if left[i][0] <= right[j][0]:
                merged.append(left[i])
                i += 1
            else:
                merged.append(right[j])
                # All remaining in left are smaller than right[j]
                result[left[i][1]] += len(left) - i
                j += 1
        
        merged.extend(left[i:])
        merged.extend(right[j:])
        return merged
    
    merge_sort(0, n)
    return result
```

### Template 6: Merge k Sorted Lists

```python
import heapq
from typing import List, Optional

def merge_k_lists(lists: List[Optional[ListNode]]) -> Optional[ListNode]:
    """
    LeetCode 23: Merge k Sorted Lists.
    
    Args:
        lists: List of sorted linked lists
    
    Returns:
        Merged sorted list
        
    Time: O(N log k) where N is total nodes, k is number of lists
    Space: O(k)
    """
    # Min heap: (value, list_index, node)
    heap = []
    for i, lst in enumerate(lists):
        if lst:
            heapq.heappush(heap, (lst.val, i, lst))
    
    dummy = ListNode(0)
    current = dummy
    
    while heap:
        val, idx, node = heapq.heappop(heap)
        current.next = node
        current = current.next
        
        if node.next:
            heapq.heappush(heap, (node.next.val, idx, node.next))
    
    return dummy.next
```

---

## When to Use

Use Merge Sort when you need to solve problems involving:

- **Stable Sorting**: Preserving relative order of equal elements
- **Guaranteed Performance**: O(n log n) in all cases
- **Linked Lists**: Sorting without random access
- **External Sorting**: Data too large for memory
- **Counting Inversions**: Modified merge sort for specific counts
- **Parallel Processing**: Divide step allows parallelization

### Comparison with Other Sorts

| Algorithm | Time (Best/Avg/Worst) | Space | Stable | Best For |
|-----------|----------------------|-------|--------|----------|
| **Merge** | n log n / n log n / n log n | O(n) | Yes | Linked lists, stability |
| **Quick** | n log n / n log n / n² | O(log n) | No | Arrays, cache performance |
| **Heap** | n log n / n log n / n log n | O(1) | No | Memory constrained |
| **Insertion** | n / n² / n² | O(1) | Yes | Small n, nearly sorted |
| **Tim** | n / n log n / n log n | O(n) | Yes | Python's built-in |

### When to Choose Each Algorithm

- **Choose Merge Sort** when:
  - Stability is required
  - Guaranteed O(n log n) needed
  - Sorting linked lists
  - External sorting needed

- **Choose Quick Sort** when:
  - Average case performance is priority
  - In-place sorting needed
  - Array has good cache locality

- **Choose Heap Sort** when:
  - Space is extremely constrained
  - In-place sorting needed
  - Stability not required

- **Choose Tim Sort** when:
  - Using Python (it's the built-in)
  - Data may have runs (partially sorted)

---

## Algorithm Explanation

### Core Concept

Merge Sort applies the divide-and-conquer paradigm: break a large problem into smaller subproblems, solve them recursively, and combine their solutions. For sorting, this means splitting the array until we reach single elements (already sorted), then merging pairs of sorted arrays back together.

### How It Works

#### Step 1: Divide

Recursively split the array in half:
```
[3, 1, 4, 1, 5, 9, 2, 6]
→ [3, 1, 4, 1] and [5, 9, 2, 6]
→ [3, 1], [4, 1], [5, 9], [2, 6]
→ [3], [1], [4], [1], [5], [9], [2], [6]
```

#### Step 2: Conquer (Merge)

Merge sorted pairs:
```
[3], [1] → [1, 3]
[4], [1] → [1, 4]
[5], [9] → [5, 9]
[2], [6] → [2, 6]

[1, 3], [1, 4] → [1, 1, 3, 4]
[5, 9], [2, 6] → [2, 5, 6, 9]

[1, 1, 3, 4], [2, 5, 6, 9] → [1, 1, 2, 3, 4, 5, 6, 9]
```

### Visual Representation

**Merge Process:**
```
Left:  [1, 3, 5]    Right:  [2, 4, 6]
       ↑                    ↑
       i                    j

Result: []

Step 1: left[i]=1 < right[j]=2, add 1
Result: [1], i=1

Step 2: left[i]=3 > right[j]=2, add 2
Result: [1, 2], j=1

Step 3: left[i]=3 < right[j]=4, add 3
Result: [1, 2, 3], i=2

Continue until one array exhausted, then append remainder.
```

### Why Merge Sort Works

1. **Base Case**: Single element is sorted
2. **Inductive Step**: If halves are sorted, merge produces sorted whole
3. **Correctness**: By induction, final array is sorted
4. **Efficiency**: Divide tree has log n levels, each level does O(n) work

### Limitations

- **Space**: O(n) auxiliary space required
- **Not In-Place**: Standard version needs extra memory
- **Overhead**: Recursion and copying add constant factors

---

## Practice Problems

### Problem 1: Sort an Array

**Problem:** [LeetCode 912 - Sort an Array](https://leetcode.com/problems/sort-an-array/)

**Description:** Implement merge sort to sort array.

**How to Apply:**
- Direct application of merge sort
- Can also use quick sort or heap sort

---

### Problem 2: Sort List

**Problem:** [LeetCode 148 - Sort List](https://leetcode.com/problems/sort-list/)

**Description:** Sort linked list in O(n log n).

**How to Apply:**
- Merge sort is ideal for linked lists
- Find middle with slow/fast pointers
- Merge without extra space

---

### Problem 3: Merge k Sorted Lists

**Problem:** [LeetCode 23 - Merge k Sorted Lists](https://leetcode.com/problems/merge-k-sorted-lists/)

**Description:** Merge k sorted linked lists into one.

**How to Apply:**
- Merge pairs iteratively (like merge sort)
- Or use heap for O(N log k) solution

---

### Problem 4: Count of Smaller Numbers After Self

**Problem:** [LeetCode 315 - Count of Smaller Numbers After Self](https://leetcode.com/problems/count-of-smaller-numbers-after-self/)

**Description:** For each element, count smaller elements to its right.

**How to Apply:**
- Modified merge sort
- During merge, count elements remaining in left when taking from right

---

## Video Tutorial Links

### Fundamentals

- [Merge Sort - Abdul Bari](https://www.youtube.com/watch?v=4VqmGXwpLqc) - Visual explanation
- [Merge Sort Analysis - MIT OCW](https://www.youtube.com/watch?v=GfRQ2W0EwJE) - Theory
- [Sorting Algorithms - Algorithms](https://www.youtube.com/watch?v=8MsHNnZ4yE0) - Comparison

### Implementation

- [Merge Sort Python - CodeExplained](https://www.youtube.com/watch?v=cVZMah9kEjI) - Python implementation
- [Linked List Sort - NeetCode](https://www.youtube.com/watch?v=8MsHNnZ4yE0) - LeetCode solution

---

## Follow-up Questions

### Q1: Is merge sort always better than quick sort?

**Answer:** No. Quick sort is generally faster in practice due to better cache performance and lower constant factors. However, merge sort guarantees O(n log n) worst case (quick sort can be O(n²)), and merge sort is stable while standard quick sort is not.

---

### Q2: Can merge sort be done in-place?

**Answer:** In-place merge sort exists but is complex and not practical. The merge step naturally requires extra space. For linked lists, merge sort uses O(1) extra space (just pointer manipulation). For arrays, O(n) auxiliary space is standard.

---

### Q3: Why is merge sort used for external sorting?

**Answer:** External sorting handles data larger than memory. Merge sort naturally works with sequential access and can merge sorted chunks from disk. The merge step can process data in chunks that fit in memory, making it ideal for external storage.

---

### Q4: How can merge sort count inversions?

**Answer:** During the merge step, whenever we take an element from the right half, all remaining elements in the left half are inversions with that element. By counting these during each merge, we get total inversion count in O(n log n).

---

### Q5: What's the difference between top-down and bottom-up merge sort?

**Answer:** Top-down uses recursion to split, natural for understanding. Bottom-up starts with subarrays of size 1 and iteratively doubles the size, avoiding recursion overhead. Bottom-up can also be adapted to detect natural runs in data (natural merge sort), giving O(n) best case for nearly sorted data.

---

## Summary

Merge Sort is a reliable, stable, and efficient sorting algorithm with guaranteed O(n log n) performance. The key takeaways are:

1. **Divide-and-Conquer**: Split, sort, merge
2. **Stability**: Preserves order of equal elements
3. **Consistency**: O(n log n) in all cases
4. **Linked List Friendly**: O(1) space with pointers
5. **Extensible**: Easily modified for counting problems

**When to Use:**
- Need stable sort
- Sorting linked lists
- External sorting
- Counting inversions or similar statistics
- Guaranteed performance required

**Key Formula:**
```
T(n) = 2T(n/2) + O(n) = O(n log n)

Split → Sort Left → Sort Right → Merge
```

This algorithm is a fundamental tool in computer science, essential for both sorting and as a building block for more complex algorithms.
