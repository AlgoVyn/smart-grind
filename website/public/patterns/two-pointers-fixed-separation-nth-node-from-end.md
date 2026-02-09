# Two Pointers - Fixed Separation (Nth Node from End)

## Overview

The **Fixed Separation** pattern is a powerful two-pointer technique used when you need to maintain a constant distance between two pointers while traversing a data structure. This pattern is particularly useful for finding the nth node from the end of a linked list, removing nodes at specific positions, and solving various linked list problems efficiently.

The core idea is elegant: by positioning two pointers `fast` and `slow` with a fixed gap of `n` nodes between them and moving them together, we can efficiently access elements at specific offsets without using extra space for storage.

## Key Concepts

- **Gap Creation**: Advance the fast pointer by n steps to establish separation
- **Simultaneous Movement**: Once separated, move both pointers one step at a time
- **Offset Access**: The slow pointer reaches the desired position when fast pointer hits the end
- **Dummy Node**: Optional helper node to simplify edge case handling
- **Single Pass**: The algorithm completes in O(n) time with O(1) space

## Intuition & Why It Works

The genius of this technique lies in relative positioning and the mathematical relationship between pointer movements:

**The Gap Concept:**
If you have two pointers `fast` and `slow` with `fast` ahead of `slow` by `n` nodes, when `fast` reaches the end of the list, `slow` will be exactly `n` nodes from the end.

**Simultaneous Termination:**
Instead of traversing the list multiple times, we make both pointers move together after establishing the initial gap. When the `fast` pointer reaches the end, the `slow` pointer automatically arrives at the desired position.

**Visual Explanation:**
```
Initial State:
fast → 1 → 2 → 3 → 4 → 5 → null
slow → 1 → 2 → 3 → 4 → 5 → null

After advancing fast by n=2 steps:
fast → 3 → 4 → 5 → null
slow → 1 → 2 → 3 → 4 → 5 → null

Move both pointers together:
fast → 4 → 5 → null
slow → 2 → 3 → 4 → 5 → null

fast → 5 → null
slow → 3 → 4 → 5 → null

fast → null (end reached)
slow → 4 → 5 → null ← This is the 2nd node from end!
```

## Algorithm Approaches

### Approach 1: Standard Fixed Separation

The classic approach where we advance the fast pointer by n steps first, then move both pointers together until fast reaches the end.

````carousel
```python
# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, val=0, next=None):
#         self.val = val
#         self.next = next

def find_nth_from_end(head, n):
    """
    Find the nth node from the end of a linked list.
    Returns the node, not its value.
    """
    if not head:
        return None
    
    fast = head
    slow = head
    
    # Move fast pointer n steps ahead
    for _ in range(n):
        if not fast:
            return None  # n is larger than list length
        fast = fast.next
    
    # Move both pointers until fast reaches end
    while fast:
        fast = fast.next
        slow = slow.next
    
    return slow  # slow is now at nth from end
```
<!-- slide -->
```cpp
struct ListNode {
    int val;
    ListNode *next;
    ListNode() : val(0), next(nullptr) {}
    ListNode(int x) : val(x), next(nullptr) {}
    ListNode(int x, ListNode *next) : val(x), next(next) {}
};

ListNode* findNthFromEnd(ListNode* head, int n) {
    /*
     * Find the nth node from the end of a linked list.
     * Returns the node, not its value.
     */
    if (!head) return nullptr;
    
    ListNode* fast = head;
    ListNode* slow = head;
    
    // Move fast pointer n steps ahead
    for (int i = 0; i < n; i++) {
        if (!fast) return nullptr;  // n is larger than list length
        fast = fast->next;
    }
    
    // Move both pointers until fast reaches end
    while (fast) {
        fast = fast->next;
        slow = slow->next;
    }
    
    return slow;  // slow is now at nth from end
}
```
<!-- slide -->
```java
/**
 * Definition for singly-linked list.
 * public class ListNode {
 *     int val;
 *     ListNode next;
 *     ListNode() {}
 *     ListNode(int val) { this.val = val; }
 *     ListNode(int val, ListNode next) { this.val = val; this.next = next; }
 * }
 */

public ListNode findNthFromEnd(ListNode head, int n) {
    /*
     * Find the nth node from the end of a linked list.
     * Returns the node, not its value.
     */
    if (head == null) return null;
    
    ListNode fast = head;
    ListNode slow = head;
    
    // Move fast pointer n steps ahead
    for (int i = 0; i < n; i++) {
        if (fast == null) return null;  // n is larger than list length
        fast = fast.next;
    }
    
    // Move both pointers until fast reaches end
    while (fast != null) {
        fast = fast.next;
        slow = slow.next;
    }
    
    return slow;  // slow is now at nth from end
}
```
<!-- slide -->
```javascript
/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val === undefined ? 0 : val);
 *     this.next = (next === undefined ? null : next);
 * }
 */

function findNthFromEnd(head, n) {
    /*
     * Find the nth node from the end of a linked list.
     * Returns the node, not its value.
     */
    if (!head) return null;
    
    let fast = head;
    let slow = head;
    
    // Move fast pointer n steps ahead
    for (let i = 0; i < n; i++) {
        if (!fast) return null;  // n is larger than list length
        fast = fast.next;
    }
    
    // Move both pointers until fast reaches end
    while (fast) {
        fast = fast.next;
        slow = slow.next;
    }
    
    return slow;  // slow is now at nth from end
}
```
````

### Approach 2: Dummy Node with Deletion

When we need to delete the nth node from end, we use a dummy node to handle edge cases like removing the head node elegantly.

````carousel
```python
# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, val=0, next=None):
#         self.val = val
#         self.next = next

def remove_nth_from_end(head, n):
    """
    Remove the nth node from the end of the list.
    Returns the new head.
    """
    dummy = ListNode(0, head)
    fast = dummy
    slow = dummy
    
    # Move fast n+1 steps ahead to create n-node gap
    for _ in range(n + 1):
        fast = fast.next
    
    # Move both pointers until fast reaches end
    while fast:
        fast = fast.next
        slow = slow.next
    
    # Remove the nth node from end
    slow.next = slow.next.next
    
    return dummy.next
```
<!-- slide -->
```cpp
struct ListNode {
    int val;
    ListNode *next;
    ListNode() : val(0), next(nullptr) {}
    ListNode(int x) : val(x), next(nullptr) {}
    ListNode(int x, ListNode *next) : val(x), next(next) {}
};

ListNode* removeNthFromEnd(ListNode* head, int n) {
    /*
     * Remove the nth node from the end of the list.
     * Returns the new head.
     */
    ListNode* dummy = new ListNode(0, head);
    ListNode* fast = dummy;
    ListNode* slow = dummy;
    
    // Move fast n+1 steps ahead to create n-node gap
    for (int i = 0; i <= n; i++) {
        fast = fast->next;
    }
    
    // Move both pointers until fast reaches end
    while (fast) {
        fast = fast->next;
        slow = slow->next;
    }
    
    // Remove the nth node from end
    ListNode* toDelete = slow->next;
    slow->next = slow->next->next;
    delete toDelete;
    
    ListNode* result = dummy->next;
    delete dummy;
    return result;
}
```
<!-- slide -->
```java
/**
 * Definition for singly-linked list.
 * public class ListNode {
 *     int val;
 *     ListNode next;
 *     ListNode() {}
 *     ListNode(int val) { this.val = val; }
 *     ListNode(int val, ListNode next) { this.val = val; this.next = next; }
 * }
 */

public ListNode removeNthFromEnd(ListNode head, int n) {
    /*
     * Remove the nth node from the end of the list.
     * Returns the new head.
     */
    ListNode dummy = new ListNode(0, head);
    ListNode fast = dummy;
    ListNode slow = dummy;
    
    // Move fast n+1 steps ahead to create n-node gap
    for (int i = 0; i <= n; i++) {
        fast = fast.next;
    }
    
    // Move both pointers until fast reaches end
    while (fast != null) {
        fast = fast.next;
        slow = slow.next;
    }
    
    // Remove the nth node from end
    slow.next = slow.next.next;
    
    return dummy.next;
}
```
<!-- slide -->
```javascript
/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val === undefined ? 0 : val);
 *     this.next = (next === undefined ? null : next);
 * }
 */

function removeNthFromEnd(head, n) {
    /*
     * Remove the nth node from the end of the list.
     * Returns the new head.
     */
    const dummy = new ListNode(0, head);
    let fast = dummy;
    let slow = dummy;
    
    // Move fast n+1 steps ahead to create n-node gap
    for (let i = 0; i <= n; i++) {
        fast = fast.next;
    }
    
    // Move both pointers until fast reaches end
    while (fast) {
        fast = fast.next;
        slow = slow.next;
    }
    
    // Remove the nth node from end
    slow.next = slow.next.next;
    
    return dummy.next;
}
```
````

### Approach 3: Length Calculation (Two Pass)

Calculate the length of the linked list first, then access the node at position (length - n + 1).

````carousel
```python
# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, val=0, next=None):
#         self.val = val
#         self.next = next

def find_nth_from_end_length(head, n):
    """
    Find the nth node from the end using length calculation.
    First pass to count, second pass to find.
    """
    if not head:
        return None
    
    # First pass: count the length
    length = 0
    current = head
    while current:
        length += 1
        current = current.next
    
    # Calculate target position from head (0-indexed)
    target_pos = length - n
    
    # Second pass: find the node
    current = head
    for _ in range(target_pos):
        current = current.next
    
    return current
```
<!-- slide -->
```cpp
struct ListNode {
    int val;
    ListNode *next;
    ListNode() : val(0), next(nullptr) {}
    ListNode(int x) : val(x), next(nullptr) {}
    ListNode(int x, ListNode *next) : val(x), next(next) {}
};

ListNode* findNthFromEndLength(ListNode* head, int n) {
    /*
     * Find the nth node from the end using length calculation.
     * First pass to count, second pass to find.
     */
    if (!head) return nullptr;
    
    // First pass: count the length
    int length = 0;
    ListNode* current = head;
    while (current) {
        length++;
        current = current->next;
    }
    
    // Calculate target position from head (0-indexed)
    int targetPos = length - n;
    
    // Second pass: find the node
    current = head;
    for (int i = 0; i < targetPos; i++) {
        current = current->next;
    }
    
    return current;
}
```
<!-- slide -->
```java
/**
 * Definition for singly-linked list.
 * public class ListNode {
 *     int val;
 *     ListNode next;
 *     ListNode() {}
 *     ListNode(int val) { this.val = val; }
 *     ListNode(int val, ListNode next) { this.val = val; this.next = next; }
 * }
 */

public ListNode findNthFromEndLength(ListNode head, int n) {
    /*
     * Find the nth node from the end using length calculation.
     * First pass to count, second pass to find.
     */
    if (head == null) return null;
    
    // First pass: count the length
    int length = 0;
    ListNode current = head;
    while (current != null) {
        length++;
        current = current.next;
    }
    
    // Calculate target position from head (0-indexed)
    int targetPos = length - n;
    
    // Second pass: find the node
    current = head;
    for (int i = 0; i < targetPos; i++) {
        current = current.next;
    }
    
    return current;
}
```
<!-- slide -->
```javascript
/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val === undefined ? 0 : val);
 *     this.next = (next === undefined ? null : next);
 * }
 */

function findNthFromEndLength(head, n) {
    /*
     * Find the nth node from the end using length calculation.
     * First pass to count, second pass to find.
     */
    if (!head) return null;
    
    // First pass: count the length
    let length = 0;
    let current = head;
    while (current) {
        length++;
        current = current.next;
    }
    
    // Calculate target position from head (0-indexed)
    const targetPos = length - n;
    
    // Second pass: find the node
    current = head;
    for (let i = 0; i < targetPos; i++) {
        current = current.next;
    }
    
    return current;
}
```
````

## Time and Space Complexity

| Approach | Time Complexity | Space Complexity | Use Case |
|----------|-----------------|------------------|----------|
| Standard Fixed Separation | O(n) | O(1) | Find nth from end |
| Dummy Node with Deletion | O(n) | O(1) | Remove nth from end |
| Length Calculation | O(n) | O(1) | Simple two-pass solution |

**Where n is the number of nodes in the linked list**

## Common Pitfalls

1. **Off-by-One Errors**: Remember to advance `fast` by `n` steps (or `n+1` for deletion) to maintain proper separation
2. **Null Pointer Checks**: Always check if `fast` becomes `null` during the initial advancement phase
3. **Empty List**: Handle `null` head gracefully at the start
4. **Removing Head Node**: When `n` equals the list length, we need to remove the head - use dummy node to simplify
5. **Single Node Cases**: Consider when `n` equals the list length (removing the only node)
6. **Memory Leaks (C++)**: Don't forget to delete the removed node and the dummy node

## Related Problems

### Easy Problems
- [Middle of the Linked List](https://leetcode.com/problems/middle-of-the-linked-list/) - Find middle using slow-fast pointers
- [Remove Linked List Elements](https://leetcode.com/problems/remove-linked-list-elements/) - Removing nodes by value

### Medium Problems
- [Remove Nth Node From End of List](https://leetcode.com/problems/remove-nth-node-from-end-of-list/) - Primary problem for this pattern
- [Delete the Middle Node of a Linked List](https://leetcode.com/problems/delete-the-middle-node-of-a-linked-list/) - Remove middle node
- [Remove Duplicates from Sorted List II](https://leetcode.com/problems/remove-duplicates-from-sorted-list-ii/) - Remove all duplicates
- [Partition List](https://leetcode.com/problems/partition-list/) - Partition around a value
- [Rotate List](https://leetcode.com/problems/rotate-list/) - Rotate list to the right by k positions
- [Swapping Nodes in a Linked List](https://leetcode.com/problems/swapping-nodes-in-a-linked-list/) - Swap nodes without swapping values

### Hard Problems
- [Reverse Nodes in k-Group](https://leetcode.com/problems/reverse-nodes-in-k-group/) - Reverse nodes in groups of k

## Video Tutorials

- [Remove Nth Node From End of List - LeetCode 19](https://www.youtube.com/watch?v=XiSoE0f80q4)
- [Two Pointers Technique Explained](https://www.youtube.com/watch?v=73rK9WjPCjI)
- [Linked List nth Node from End - Interview Problem](https://www.youtube.com/watch?v=Lhu5I2Cy9X4)
- [Fast and Slow Pointer Pattern](https://www.youtube.com/watch?v=G_B4e_8CU9w)

## Practice Strategy

1. **Master the Basics**: Start with finding the nth node from end without deletion
2. **Add Complexity**: Progress to removing the nth node with dummy node handling
3. **Understand Edge Cases**: Practice with single node, head removal, and n=1 cases
4. **Combine Patterns**: Learn to combine with reversal and other linked list operations
5. **Time Complexity Awareness**: Understand when single-pass solutions beat two-pass approaches

## Pattern Summary

The Fixed Separation pattern is one of the most elegant techniques for linked list problems. Its power lies in:

- **Constant Space**: Achieves O(1) space regardless of list length
- **Single Pass**: Many variations require only one traversal
- **Versatility**: Extends to deletion, swapping, and other linked list operations
- **Elegant Edge Handling**: Dummy node simplifies head removal and other edge cases

Master this pattern to efficiently solve nth node from end problems and build a foundation for more complex linked list algorithms.
