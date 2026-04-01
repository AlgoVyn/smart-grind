# Merge Two Sorted Lists

## Category
Linked List

## Description

Merge Two Sorted Lists is a classic algorithm problem where we combine two **already sorted** linked lists (or arrays) into a single sorted data structure. This is a fundamental operation in merge sort and appears frequently in technical interviews and real-world applications.

The key insight is that since both input lists are sorted, we can efficiently merge them by always selecting the smaller of the two current elements—similar to the merge step in the merge sort algorithm.

---

## Concepts

The Merge Two Sorted Lists technique is built on several fundamental concepts.

### 1. Sorted Input Invariant

Both inputs maintain the sorted property:

| List | Property | Implication |
|------|----------|-------------|
| **List 1** | Sorted ascending | Head contains minimum of List 1 |
| **List 2** | Sorted ascending | Head contains minimum of List 2 |
| **Result** | Will be sorted | Next element always minimum of two heads |

### 2. Two-Pointer Technique

Maintain pointers to current elements in both lists:

```
Pointer 1 → Current element in List 1
Pointer 2 → Current element in List 2

At each step:
- Compare *Pointer 1 vs *Pointer 2
- Attach smaller to result
- Advance that pointer
```

### 3. Dummy Node Pattern

Use a placeholder to simplify edge cases:

```
Dummy → [placeholder] → [merged elements...]
         ↑
        Tail pointer always points here
```

Eliminates special cases for empty result list.

### 4. Remaining Elements Optimization

When one list exhausted, attach remainder directly:

```
List 1: [1, 3, 5]  → exhausted
List 2: [2, 4, 6, 8, 10]
Result: [1, 2, 3, 4, 5] → attach [6, 8, 10] directly
```

---

## Frameworks

Structured approaches for merging sorted lists.

### Framework 1: Iterative Merge Template

```
┌─────────────────────────────────────────────────────┐
│  ITERATIVE MERGE FRAMEWORK                          │
├─────────────────────────────────────────────────────┤
│  1. Create dummy node as placeholder                │
│  2. Initialize tail = dummy                         │
│  3. While both lists have nodes:                    │
│     a. Compare list1.val vs list2.val              │
│     b. Attach smaller node to tail.next            │
│     c. Advance pointer of chosen list            │
│     d. Advance tail pointer                        │
│  4. Attach remaining non-empty list (if any)      │
│  5. Return dummy.next (skip placeholder)          │
└─────────────────────────────────────────────────────┘
```

**When to use**: General case, O(1) space required, production code.

### Framework 2: Recursive Merge Template

```
┌─────────────────────────────────────────────────────┐
│  RECURSIVE MERGE FRAMEWORK                          │
├─────────────────────────────────────────────────────┤
│  1. Base cases:                                     │
│     - If list1 is null, return list2               │
│     - If list2 is null, return list1               │
│  2. Compare list1.val vs list2.val                 │
│  3. If list1.val <= list2.val:                     │
│     a. list1.next = merge(list1.next, list2)       │
│     b. Return list1                                │
│  4. Else:                                           │
│     a. list2.next = merge(list1, list2.next)       │
│     b. Return list2                                │
└─────────────────────────────────────────────────────┘
```

**When to use**: Clean code preferred, stack space acceptable.

### Framework 3: In-Place Array Merge Template

```
┌─────────────────────────────────────────────────────┐
│  IN-PLACE ARRAY MERGE FRAMEWORK                     │
├─────────────────────────────────────────────────────┤
│  Given: nums1 with extra space, nums2, sizes m, n │
│  1. Initialize pointers:                            │
│     - p1 = m - 1 (last valid element in nums1)     │
│     - p2 = n - 1 (last element in nums2)           │
│     - p = m + n - 1 (end of merged result)          │
│  2. While p2 >= 0:                                  │
│     a. If p1 >= 0 and nums1[p1] > nums2[p2]:       │
│        - nums1[p] = nums1[p1]                       │
│        - p1 -= 1                                    │
│     b. Else:                                        │
│        - nums1[p] = nums2[p2]                       │
│        - p2 -= 1                                    │
│     c. p -= 1                                       │
│  3. nums1 now contains merged sorted array        │
└─────────────────────────────────────────────────────┘
```

**When to use**: Arrays with extra space, in-place requirement.

---

## Forms

Different manifestations of the merge pattern.

### Form 1: Linked List Merge

Standard two sorted linked lists:

| Operation | Time | Space |
|-----------|------|-------|
| Iterative | O(n + m) | O(1) |
| Recursive | O(n + m) | O(n + m) stack |

Key: Reuse existing nodes, just rewire pointers.

### Form 2: Array Merge

Two sorted arrays into new array:

| Operation | Time | Space |
|-----------|------|-------|
| Standard | O(n + m) | O(n + m) for result |
| In-place | O(n + m) | O(1) if extra space available |

Key: Handle from end to avoid overwriting.

### Form 3: K-Way Merge

Merge k sorted lists using heap:

```
Approach:
1. Push first element from each list into min-heap
2. Pop smallest, add to result
3. Push next from same list if exists
4. Repeat until heap empty
```

Time: O(N log k) where N = total elements, k = number of lists.

### Form 4: Sorted Stream Merge

Merge data streams that arrive continuously:

```
Pattern:
- Use priority queue to track current element from each stream
- Always output minimum
- Request next from that stream
- Repeat
```

### Form 5: Sorted File Merge

External sorting merge phase:

```
Application: Sorting large files that don't fit in memory
- Read chunks, sort in memory, write to temp files
- Merge sorted temp files using k-way merge
- Write final sorted output
```

---

## Tactics

Specific techniques and optimizations.

### Tactic 1: Dummy Node Eliminates Edge Cases

Without dummy:
```python
if not list1:
    return list2
if not list2:
    return list1
if list1.val <= list2.val:
    head = list1
    list1 = list1.next
else:
    head = list2
    list2 = list2.next
# ... continue
```

With dummy:
```python
dummy = ListNode(0)
tail = dummy
# ... simple loop
return dummy.next
```

### Tactic 2: Early Termination for Subarray Search

When searching for insertion point:
```python
def merge_with_insertion(list1, list2):
    """Insert nodes from list2 into appropriate positions in list1."""
    dummy = ListNode(0, list1)
    prev = dummy
    
    while list2:
        # Move prev to insertion point
        while prev.next and prev.next.val < list2.val:
            prev = prev.next
        
        # Insert list2 head at this position
        temp = list2.next
        list2.next = prev.next
        prev.next = list2
        list2 = temp
        
        # Move prev forward (optimization)
        prev = prev.next
    
    return dummy.next
```

### Tactic 3: Merge with Duplicates Handling

Handle equal values consistently:
```python
while list1 and list2:
    if list1.val <= list2.val:  # <= for stability
        tail.next = list1
        list1 = list1.next
    else:
        tail.next = list2
        list2 = list2.next
    tail = tail.next
```

### Tactic 4: Union of Sorted Arrays

Find union (unique elements):
```python
def union_sorted(arr1, arr2):
    """Find union of two sorted arrays."""
    result = []
    i, j = 0, 0
    
    while i < len(arr1) and j < len(arr2):
        # Skip duplicates in arr1
        while i > 0 and i < len(arr1) and arr1[i] == arr1[i-1]:
            i += 1
        # Skip duplicates in arr2
        while j > 0 and j < len(arr2) and arr2[j] == arr2[j-1]:
            j += 1
        
        if i >= len(arr1):
            result.extend(arr2[j:])
            break
        if j >= len(arr2):
            result.extend(arr1[i:])
            break
        
        if arr1[i] < arr2[j]:
            result.append(arr1[i])
            i += 1
        elif arr1[i] > arr2[j]:
            result.append(arr2[j])
            j += 1
        else:
            result.append(arr1[i])
            i += 1
            j += 1
    
    return result
```

### Tactic 5: Intersection of Sorted Arrays

Find common elements:
```python
def intersection_sorted(arr1, arr2):
    """Find intersection of two sorted arrays."""
    result = []
    i, j = 0, 0
    
    while i < len(arr1) and j < len(arr2):
        if arr1[i] < arr2[j]:
            i += 1
        elif arr1[i] > arr2[j]:
            j += 1
        else:
            # Found common element
            if not result or result[-1] != arr1[i]:  # Avoid duplicates
                result.append(arr1[i])
            i += 1
            j += 1
    
    return result
```

---

## Python Templates

### Template 1: Iterative Linked List Merge

```python
from typing import Optional

class ListNode:
    def __init__(self, val: int = 0, next: 'ListNode' = None):
        self.val = val
        self.next = next

def merge_two_lists(list1: Optional[ListNode], 
                  list2: Optional[ListNode]) -> Optional[ListNode]:
    """
    Template 1: Merge two sorted linked lists iteratively.
    Time: O(n + m), Space: O(1)
    """
    # Create dummy node to simplify edge cases
    dummy = ListNode(-1)
    tail = dummy
    
    # Compare and merge nodes from both lists
    while list1 and list2:
        if list1.val <= list2.val:
            tail.next = list1
            list1 = list1.next
        else:
            tail.next = list2
            list2 = list2.next
        tail = tail.next
    
    # Attach remaining nodes
    if list1:
        tail.next = list1
    if list2:
        tail.next = list2
    
    return dummy.next
```

### Template 2: Recursive Linked List Merge

```python
def merge_two_lists_recursive(list1: Optional[ListNode], 
                             list2: Optional[ListNode]) -> Optional[ListNode]:
    """
    Template 2: Merge two sorted linked lists recursively.
    Time: O(n + m), Space: O(n + m) for recursion stack
    """
    # Base cases
    if not list1:
        return list2
    if not list2:
        return list1
    
    # Compare and pick the smaller head
    if list1.val <= list2.val:
        list1.next = merge_two_lists_recursive(list1.next, list2)
        return list1
    else:
        list2.next = merge_two_lists_recursive(list1, list2.next)
        return list2
```

### Template 3: In-Place Array Merge

```python
def merge_sorted_arrays_inplace(nums1: list, m: int, nums2: list, n: int) -> None:
    """
    Template 3: Merge nums2 into nums1 in-place.
    nums1 has length m + n with last n positions empty.
    
    Time: O(m + n), Space: O(1)
    """
    # Start from the end
    p1, p2, p = m - 1, n - 1, m + n - 1
    
    while p2 >= 0:
        if p1 >= 0 and nums1[p1] > nums2[p2]:
            nums1[p] = nums1[p1]
            p1 -= 1
        else:
            nums1[p] = nums2[p2]
            p2 -= 1
        p -= 1
```

### Template 4: K-Way Merge with Heap

```python
import heapq
from typing import List, Optional

def merge_k_lists(lists: List[Optional[ListNode]]) -> Optional[ListNode]:
    """
    Template 4: Merge k sorted linked lists using min-heap.
    Time: O(N log k) where N is total nodes, k is number of lists
    Space: O(k) for the heap
    """
    dummy = ListNode(-1)
    tail = dummy
    
    # Min-heap: (value, list_index, node)
    heap = []
    
    # Initialize heap with first node from each list
    for i, head in enumerate(lists):
        if head:
            heapq.heappush(heap, (head.val, i, head))
    
    # Extract min and add next node from same list
    while heap:
        val, i, node = heapq.heappop(heap)
        tail.next = node
        tail = tail.next
        
        if node.next:
            heapq.heappush(heap, (node.next.val, i, node.next))
    
    return dummy.next
```

### Template 5: Merge Sort Helper

```python
def merge_sort_linked_list(head: Optional[ListNode]) -> Optional[ListNode]:
    """
    Template 5: Sort linked list using merge sort.
    Time: O(n log n), Space: O(log n) for recursion
    """
    if not head or not head.next:
        return head
    
    # Find middle using slow/fast pointers
    slow, fast = head, head.next
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
    
    mid = slow.next
    slow.next = None  # Split the list
    
    # Recursively sort both halves
    left = merge_sort_linked_list(head)
    right = merge_sort_linked_list(mid)
    
    # Merge sorted halves
    return merge_two_lists(left, right)
```

---

## When to Use

Use the Merge Two Sorted Lists algorithm when you need to solve problems involving:

- **Combining sorted sequences**: Merging two sorted arrays, lists, or files
- **Merge Sort**: The core merge step in the divide-and-conquer merge sort algorithm
- **External sorting**: When sorting large files that don't fit in memory
- **K-way merge**: Generalizing to merging k sorted sequences using a min-heap
- **Sorted stream combination**: Combining multiple sorted data streams

### Comparison with Alternatives

| Approach | Time Complexity | Space Complexity | Use Case |
|----------|----------------|------------------|----------|
| **Two Pointers (Iterative)** | O(n + m) | O(1) | Two sorted linked lists/arrays |
| **Recursive** | O(n + m) | O(n + m) stack | When recursion is preferred |
| **K-way Merge (Heap)** | O(N log k) | O(k) | k sorted sequences |
| **Naive Concatenation + Sort** | O((n+m) log(n+m)) | O(n + m) | When lists aren't pre-sorted |

### When to Choose Each Approach

- **Choose Two Pointers** when:
  - Working with linked lists (O(1) space is beneficial)
  - Both lists are already sorted
  - Memory is a constraint

- **Choose Recursive** when:
  - Code readability is prioritized
  - Stack overflow isn't a concern for small inputs
  - Implementing merge sort

- **Choose K-way Merge** when:
  - Merging more than two sorted sequences
  - Using a min-heap for optimal element selection

- **Choose Naive + Sort** when:
  - Lists aren't guaranteed to be sorted
  - Simplicity is preferred over efficiency

---

## Algorithm Explanation

### Core Concept

The fundamental principle behind merging two sorted lists is simple: **since both lists are sorted, the smallest remaining element must be at the head of one of the two lists**. By repeatedly picking the smaller head and advancing that list, we build a fully merged sorted result.

This is analogous to shuffling two sorted card decks into one sorted deck—you always pick the smaller of the top two cards.

### How It Works

#### Iterative Approach:

1. **Create a dummy node**: A placeholder node that simplifies edge case handling (empty lists, etc.)
2. **Maintain a tail pointer**: Points to the last node in our merged list
3. **Compare and pick**: At each step, compare the current nodes from both lists
4. **Attach and advance**: Attach the smaller node to the tail and move forward in that list
5. **Handle leftovers**: When one list is exhausted, attach the remaining nodes directly

#### Recursive Approach:

The recursive solution follows the same logic but uses the call stack to maintain state:
- **Base case**: If either list is empty, return the other list
- **Recursive case**: Compare heads, pick the smaller, and recursively merge the remainder

### Visual Representation

```
List 1: 1 -> 2 -> 4 -> NULL
List 2: 1 -> 3 -> 4 -> NULL

Step-by-step merge:
- Compare 1 (list1) vs 1 (list2): pick 1 from list1
- Compare 2 (list1) vs 1 (list2): pick 1 from list2  
- Compare 2 (list1) vs 3 (list2): pick 2 from list1
- Compare 4 (list1) vs 3 (list2): pick 3 from list2
- Compare 4 (list1) vs 4 (list2): pick 4 from list1
- List1 exhausted, attach remaining 4 from list2

Result: 1 -> 1 -> 2 -> 3 -> 4 -> 4 -> NULL
```

### Why the Dummy Node Approach Works

The dummy node eliminates special cases:
- Instead of checking if the merged list is empty before each attachment
- We always attach to the tail (which always exists)
- At the end, we simply return `dummy.next` to skip the placeholder

### Limitations

- **Requires sorted inputs**: Algorithm assumes both inputs are sorted
- **Sequential access**: Must process elements in order
- **Space for arrays**: Standard merge needs O(n+m) space unless in-place
- **Comparison-based**: Requires elements to be comparable

---

## Practice Problems

### Problem 1: Merge Two Sorted Lists

**Problem:** [LeetCode 21 - Merge Two Sorted Lists](https://leetcode.com/problems/merge-two-sorted-lists/)

**Description:** Merge two sorted linked lists and return it as a sorted list.

**How to Apply Merge:**
- Use the two-pointer iterative approach with a dummy node
- Each comparison picks the smaller head
- Attach remaining nodes when one list is exhausted

---

### Problem 2: Merge K Sorted Lists

**Problem:** [LeetCode 23 - Merge K Sorted Lists](https://leetcode.com/problems/merge-k-sorted-lists/)

**Description:** Merge k sorted linked lists and return it as one sorted list.

**How to Apply Merge:**
- Use a min-heap to efficiently find the smallest element among k lists
- Push first element from each list into heap
- Pop smallest, push next from same list
- Repeat until heap is empty

---

### Problem 3: Merge Sorted Array

**Problem:** [LeetCode 88 - Merge Sorted Array](https://leetcode.com/problems/merge-sorted-array/)

**Description:** Merge nums1 and nums2 into a single array sorted in non-decreasing order.

**How to Apply Merge:**
- Use three pointers, starting from the end of arrays
- Fill nums1 from the back to avoid overwriting
- Compare elements and place larger one at current position

---

### Problem 4: Sort List (Merge Sort)

**Problem:** [LeetCode 148 - Sort List](https://leetcode.com/problems/sort-list/)

**Description:** Sort a linked list in O(n log n) time using constant space complexity.

**How to Apply Merge:**
- Use merge sort: find middle, split, recursively sort, then merge
- The merge step is exactly the "merge two sorted lists" algorithm
- Combine with in-place splitting using slow/fast pointers

---

### Problem 5: Intersection of Two Linked Lists

**Problem:** [LeetCode 160 - Intersection of Two Linked Lists](https://leetcode.com/problems/intersection-of-two-linked-lists/)

**Description:** Find the intersection node of two singly linked lists.

**How to Apply Merge:**
- While not directly merging, this problem uses similar pointer manipulation
- Align longer list by advancing difference, then traverse together
- Understanding merge helps with list manipulation concepts

---

## Video Tutorial Links

### Fundamentals

- [Merge Two Sorted Lists - LeetCode (NeetCode)](https://www.youtube.com/watch?v=1K-JSeq-5xs) - Clear explanation with animations
- [Merge Two Sorted Lists - Floyd's Cycle Detection](https://www.youtube.com/watch?v=0B-dF1UkBiI) - Iterative approach walkthrough
- [Merge Sort Explained](https://www.youtube.com/watch?v=4VqmGXwpJqc) - How merge fits into merge sort

### Related Topics

- [K-Way Merge using Heap](https://www.youtube.com/watch?v=3BhbVCX6wNQ) - Generalization to k lists
- [Linked List Merge Sort](https://www.youtube.com/watch?v=3BhbVCX6wNQ) - Practical application
- [In-Place Array Merge](https://www.youtube.com/watch?v=h3R0T2J2jXU) - Merging without extra space

---

## Follow-up Questions

### Q1: Can you implement merge iteratively without a dummy node?

**Answer:** Yes, but it requires handling edge cases separately. The dummy node approach is preferred for cleaner code.

---

### Q2: How would you handle merging with duplicate values?

**Answer:** The iterative approach naturally handles duplicates by using `<=` (or `<` for strict inequality). Using `<=` ensures stability—the first list's element comes first when values are equal.

---

### Q3: What if the lists are sorted in descending order?

**Answer:** Simply reverse both lists first, apply the merge algorithm, then reverse the result. Alternatively, modify the comparison from `<=` to `>=`.

---

### Q4: How does this differ from merging arrays vs linked lists?

**Answer:**
- **Arrays**: Can merge from the end to achieve O(1) extra space (no need for dummy node)
- **Linked Lists**: Must use forward traversal with dummy node for O(1) space
- Both have the same O(n + m) time complexity

---

### Q5: How would you merge more than two sorted lists efficiently?

**Answer:** Use a min-heap (priority queue):
1. Push the first element from each list into the heap
2. Pop the smallest, add it to result, push the next from that list
3. Repeat until heap is empty
4. Time: O(N log k) where N = total elements, k = number of lists

---

## Summary

Merge Two Sorted Lists is a fundamental algorithm that forms the building block for many complex operations. Key takeaways:

- **Core principle**: Always pick the smaller of the two current elements
- **Two-pointer technique**: Efficient O(n + m) time with O(1) space
- **Dummy node pattern**: Simplifies edge case handling
- **Versatile application**: Used in merge sort, k-way merge, and many real-world scenarios

When to use:
- ✅ Combining two sorted sequences
- ✅ Implementing merge sort
- ✅ Merging sorted data streams
- ✅ K-way merge with heap optimization

This algorithm is essential for technical interviews and competitive programming. Master both iterative and recursive approaches, as each has specific use cases and trade-offs.