# Remove Duplicates From Sorted List

## Problem Description

Given the head of a **sorted** singly linked list, delete all duplicates such that each element appears only once. The list is guaranteed to be sorted in non-decreasing order, and you should return the modified linked list which will also be sorted.

This is LeetCode Problem **83** (Easy), and it tests your understanding of linked list manipulation and the properties of sorted data structures.

### Key Characteristics:
- The input linked list is **already sorted** in non-decreasing order
- Duplicate nodes will always be **adjacent** to each other
- We need to remove duplicates **in-place** without creating a new list
- The relative order of unique elements should be preserved

---

## Examples

### Example 1

**Input:**
```python
head = [1,1,2]
```

**Visual Representation:**
```
1 → 1 → 2
```

**Output:**
```python
[1,2]
```

**Visual Representation:**
```
1 → 2
```

**Explanation:** The two duplicate `1`s are merged into a single `1`, and the list is returned in sorted order.

---

### Example 2

**Input:**
```python
head = [1,1,2,3,3]
```

**Visual Representation:**
```
1 → 1 → 2 → 3 → 3
```

**Output:**
```python
[1,2,3]
```

**Visual Representation:**
```
1 → 2 → 3
```

**Explanation:** Duplicates of `1` and `3` are removed, leaving only unique values in sorted order.

---

### Example 3 (Edge Case - Empty List)

**Input:**
```python
head = []
```

**Output:**
```python
[]
```

**Explanation:** An empty list remains empty as there are no nodes to process.

---

### Example 4 (Edge Case - Single Element)

**Input:**
```python
head = [5]
```

**Output:**
```python
[5]
```

**Explanation:** A single element list has no duplicates, so it's returned as-is.

---

### Example 5 (All Duplicates)

**Input:**
```python
head = [2,2,2,2]
```

**Output:**
```python
[2]
```

**Explanation:** All consecutive duplicates are removed, leaving only one `2`.

---

## Intuition

The key insight is that **since the linked list is sorted, all duplicate values will be adjacent to each other**. This means we can solve the problem with a single pass through the list.

### Key Observations:
1. **Sorted Property**: In a sorted list, if there are duplicates, they will appear consecutively (e.g., 1, 1, 1, 2, 3, 3)
2. **Adjacent Comparison**: We only need to compare each node with its immediate next node to detect duplicates
3. **In-Place Modification**: We can remove duplicates by simply bypassing the duplicate nodes
4. **Single Pass**: We can solve this in O(n) time with a single traversal

### Why This Works:
When we traverse the list and find that `current.val == current.next.val`, we know that `current.next` is a duplicate. By setting `current.next = current.next.next`, we effectively skip the duplicate node. Since duplicates are guaranteed to be adjacent in a sorted list, this simple comparison is sufficient.

---

## Multiple Approaches

### Approach 1: Single-Pass Iterative (Optimal)

This is the most straightforward and efficient approach. We traverse the list once, comparing each node with its next node.

```python
from typing import Optional

# Definition for singly-linked list.
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

class Solution:
    def deleteDuplicates(self, head: Optional[ListNode]) -> Optional[ListNode]:
        """
        Remove duplicates from a sorted linked list using single-pass iteration.
        
        Time Complexity: O(n) - Single pass through the list
        Space Complexity: O(1) - Only uses constant extra space
        """
        current = head
        
        while current and current.next:
            # If current node value equals next node value, skip the next node
            if current.val == current.next.val:
                current.next = current.next.next  # Bypass the duplicate
            else:
                # Only move to next node if no duplicate was found
                current = current.next
        
        return head
```

**Step-by-Step Execution:**
1. Initialize `current` pointer at the head
2. While `current` and `current.next` exist:
   - If `current.val == current.next.val`: skip the duplicate by updating `current.next`
   - Else: move `current` to `current.next`
3. Return the modified head

**Example Trace (head = [1,1,2,3,3]):**
- Initial: `current` = 1 → 1 → 2 → 3 → 3 → null
- Iteration 1: `current.val(1) == current.next.val(1)` → `current.next` = 2
  - Result: `current` = 1 → 2 → 3 → 3 → null
- Iteration 2: `current.val(1) != current.next.val(2)` → `current` = 2
- Iteration 3: `current.val(2) != current.next.val(3)` → `current` = 3
- Iteration 4: `current.val(3) == current.next.val(3)` → `current.next` = null
  - Result: `current` = 3 → null
- Final: Return head → 1 → 2 → 3 → null

---

### Approach 2: Dummy Head Approach

This approach uses a dummy node to simplify edge case handling, particularly useful when the head itself might be removed.

```python
from typing import Optional

# Definition for singly-linked list.
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

class Solution:
    def deleteDuplicates(self, head: Optional[ListNode]) -> Optional[ListNode]:
        """
        Remove duplicates using a dummy head node for simpler edge case handling.
        
        Time Complexity: O(n)
        Space Complexity: O(1)
        """
        dummy = ListNode(0, head)  # Dummy node pointing to head
        current = dummy
        
        while current.next and current.next.next:
            if current.next.val == current.next.next.val:
                # Skip all duplicates
                duplicate_val = current.next.val
                while current.next and current.next.val == duplicate_val:
                    current.next = current.next.next
            else:
                current = current.next
        
        return dummy.next
```

**Advantages:**
- Handles edge cases more gracefully
- Can be extended to remove all occurrences of duplicates (like Problem 82)
- More intuitive for beginners

**Disadvantages:**
- Slightly more complex code
- Uses a tiny bit more memory for the dummy node

---

### Approach 3: Recursive Approach

While not the most efficient for this problem, a recursive solution demonstrates understanding of recursion on linked lists.

```python
from typing import Optional

# Definition for singly-linked list.
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

class Solution:
    def deleteDuplicates(self, head: Optional[ListNode]) -> Optional[ListNode]:
        """
        Recursive approach to remove duplicates from sorted linked list.
        
        Time Complexity: O(n)
        Space Complexity: O(n) - due to recursion stack
        """
        if not head or not head.next:
            return head
        
        # Recursively process the rest of the list
        head.next = self.deleteDuplicates(head.next)
        
        # If current node is duplicate of next, skip current
        if head.next and head.val == head.next.val:
            return head.next
        
        return head
```

**How it Works:**
1. Base case: if head is null or head.next is null, return head
2. Recursively process `head.next`
3. After recursion, check if current head is duplicate of new head.next
4. Return the appropriate node

**Trace (head = [1,1,2,3,3]):**
- `deleteDuplicates([1,1,2,3,3])`:
  - `head.next = deleteDuplicates([1,2,3,3])`
    - `head.next = deleteDuplicates([2,3,3])`
      - `head.next = deleteDuplicates([3,3])`
        - `head.next = deleteDuplicates([3])`
          - Returns [3]
        - `head.val(3) == head.next.val(3)` → return `head.next` = [3]
      - `head.val(2) != head.next.val(3)` → return [2,3]
    - `head.val(1) != head.next.val(2)` → return [1,2,3]
  - `head.val(1) == head.next.val(1)` → return `head.next` = [1,2,3]
- Final result: [1,2,3]

---

## Complexity Analysis

### Time Complexity Breakdown

| Operation | Count | Complexity |
|-----------|-------|------------|
| Initial comparison | n-1 | O(1) × (n-1) |
| Node skipping (when duplicate found) | Varies | O(k) where k is duplicate count |
| Moving to next node | n - D | O(1) × (n - D) |

**Total: O(n)** where n is the number of nodes in the list.

**Why O(n)?** Each node is visited at most once. When duplicates are found, we skip them by updating the pointer, but this doesn't require additional visits.

### Space Complexity Breakdown

| Data Structure | Space Used |
|---------------|------------|
| Input list | O(n) (given) |
| Output list | O(1) (in-place modification) |
| Extra variables | O(1) (only current pointer) |
| Recursion stack (if recursive) | O(n) |

**Total: O(1)** for iterative approaches (optimal).

### Comparison of Approaches

| Approach | Time | Space | Pros | Cons |
|----------|------|-------|------|------|
| Single-Pass Iterative | O(n) | O(1) | Simple, optimal | None significant |
| Dummy Head | O(n) | O(1) | Handles edge cases well | Slightly more complex |
| Recursive | O(n) | O(n) | Elegant, demonstrates recursion | Stack overflow risk |

---

## Related Problems

### Easy Problems
- [**Remove Duplicates From Sorted List II (82)**](https://leetcode.com/problems/remove-duplicates-from-sorted-list-ii/) - Remove ALL nodes with duplicates (harder variant)
- [**Remove Duplicates From Sorted Array (26)**](https://leetcode.com/problems/remove-duplicates-from-sorted-array/) - Array version of this problem
- [**Remove Duplicates From Sorted Array II (80)**](https://leetcode.com/problems/remove-duplicates-from-sorted-array-ii/) - Allow at most 2 duplicates in array

### Medium Problems
- [**Merge Two Sorted Lists (21)**](https://leetcode.com/problems/merge-two-sorted-lists/) - Merge two sorted linked lists
- [**Sort List (148)**](https://leetcode.com/problems/sort-list/) - Sort a linked list
- [**Remove Duplicates From Sorted List II (82)**](https://leetcode.com/problems/remove-duplicates-from-sorted-list-ii/) - See above

### Problem Patterns
- **Two Pointers**: [Remove Nth Node From End of List](https://leetcode.com/problems/remove-nth-node-from-end-of-list/)
- **In-place Modification**: [Reverse Linked List](https://leetcode.com/problems/reverse-linked-list/)
- **Linked List Basics**: [Linked List Cycle](https://leetcode.com/problems/linked-list-cycle/)

---

## Video Tutorial Links

### English Tutorials
1. **NeetCode - Remove Duplicates from Sorted List**
   - YouTube: [NeetCode Remove Duplicates from Sorted List](https://www.youtube.com/watch?v=p10f2jpY5jE)
   - Duration: ~8 minutes
   - Rating: Highly recommended for visual explanation

2. **Fraz - Remove Duplicates from Sorted List**
   - YouTube: [Fraz Remove Duplicates](https://www.youtube.com/watch?v=100TqG44X-8)
   - Duration: ~10 minutes
   - Includes multiple approaches

3. **Abdul Bari - Linked List Explanation**
   - YouTube: [Abdul Bari Linked List](https://www.youtube.com/watch?v=nJ3D2eQ2t-8)
   - Great for fundamental understanding

### Hindi Tutorials
1. **CodeHelp - Remove Duplicates**
   - YouTube: [CodeHelp by Babbar](https://www.youtube.com/watch?v=0vLuuwCq8bU)

### Problem Discussion
1. **LeetCode Official Solution**
   - Link: [LeetCode 83 Solution](https://leetcode.com/problems/remove-duplicates-from-sorted-list/solutions/)
   - Contains multiple language implementations

---

## Followup Questions

### Level 1: Basic Variations
1. **What if the list wasn't sorted?** How would your approach change?
2. **Can you modify the solution to remove ALL occurrences of duplicates** (not just consecutive ones)?
3. **How would you count the number of duplicates removed?**

### Level 2: Intermediate Variations
1. **Implement a function to return a list of unique values** instead of the modified linked list.
2. **Add a count of how many times each value appears** in the linked list.
3. **Modify the solution to work with a doubly linked list** that has previous pointers.

### Level 3: Advanced Variations
1. **Remove Duplicates From Sorted List II (Problem 82)**: Remove ALL nodes that have duplicates, keeping only unique elements.
2. **What if you had to do this without any extra variables** (not even temporary pointers)?
3. **Design an algorithm that can handle streaming input** where you receive nodes one at a time and need to maintain a sorted, deduplicated list.

### Practical Application Questions
1. **In what real-world scenarios would you encounter this problem?**
2. **How would you test this function** to ensure correctness?
3. **What edge cases must you consider** when implementing this in production code?

---

## Summary

This problem is a classic linked list manipulation exercise that tests your understanding of:
- **Sorted data properties**: Duplicates are adjacent
- **In-place modification**: Using pointer manipulation
- **Single-pass algorithms**: O(n) time complexity
- **Edge case handling**: Empty lists, single elements, all duplicates

The solution is elegant and efficient, demonstrating how understanding data properties can lead to optimal algorithms. The core insight—that sorted lists have adjacent duplicates—allows us to solve this with a simple single-pass approach.

**Remember**: The key to solving this problem is recognizing that the sorted property guarantees duplicates are next to each other, making the solution straightforward!
