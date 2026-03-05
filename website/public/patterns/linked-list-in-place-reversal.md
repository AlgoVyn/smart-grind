# Linked List - In-place Reversal

## Problem Description

The In-place Reversal pattern reverses the order of nodes in a singly linked list without allocating additional data structures. By manipulating pointers directly, we can reverse an entire list, a sublist between two positions, or groups of k nodes — all in O(1) extra space. This pattern is foundational for many linked list problems.

### Key Characteristics

| Characteristic | Description |
|----------------|-------------|
| Time Complexity | O(n) - single pass through the list |
| Space Complexity | O(1) - only three pointer variables |
| Input | Head of a singly linked list, optional position parameters |
| Output | Head of the reversed linked list |
| Approach | Three-pointer technique with pointer redirection |

### When to Use

- Reversing an entire linked list
- Reversing only a portion (sublist) of a linked list
- Reversing nodes in k-groups
- Checking if a linked list is a palindrome
- Reordering nodes in specific patterns
- Any problem requiring backward traversal of a singly linked list

## Intuition

The core idea behind in-place reversal is **pointer redirection**. Each node's `next` pointer is flipped to point to its predecessor instead of its successor.

The "aha!" moments:

1. **Three pointers are sufficient**: `prev`, `current`, and `next_node` are all we need
2. **Save before overwriting**: Always store `current.next` before changing it
3. **Dummy node simplifies edge cases**: For sublist reversal, a dummy before head handles `left = 1`
4. **Iterative advancement**: Move `prev` and `current` forward after each flip
5. **Return `prev` as new head**: After reversal, `prev` points to the last node processed

## Solution Approaches

### Approach 1: Iterative Reversal (Three-Pointer) ✅ Recommended

#### Algorithm

1. Initialize `prev = null` and `current = head`
2. While `current` is not null:
   - Save `next_node = current.next` (preserve forward link)
   - Set `current.next = prev` (reverse the link)
   - Move `prev = current` (advance prev)
   - Move `current = next_node` (advance current)
3. Return `prev` as the new head

#### Implementation

````carousel
```python
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def reverse_list(head: ListNode) -> ListNode:
    """
    Reverse a singly linked list iteratively.
    LeetCode 206 - Reverse Linked List
    Time: O(n), Space: O(1)
    """
    prev = None
    current = head
    
    while current:
        next_node = current.next
        current.next = prev
        prev = current
        current = next_node
    
    return prev
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

class Solution {
public:
    ListNode* reverseList(ListNode* head) {
        // Reverse a singly linked list iteratively.
        // Time: O(n), Space: O(1)
        ListNode* prev = nullptr;
        ListNode* current = head;
        
        while (current) {
            ListNode* next_node = current->next;
            current->next = prev;
            prev = current;
            current = next_node;
        }
        
        return prev;
    }
};
```
<!-- slide -->
```java
class ListNode {
    int val;
    ListNode next;
    ListNode() {}
    ListNode(int val) { this.val = val; }
    ListNode(int val, ListNode next) { this.val = val; this.next = next; }
}

class Solution {
    public ListNode reverseList(ListNode head) {
        // Reverse a singly linked list iteratively.
        // Time: O(n), Space: O(1)
        ListNode prev = null;
        ListNode current = head;
        
        while (current != null) {
            ListNode nextNode = current.next;
            current.next = prev;
            prev = current;
            current = nextNode;
        }
        
        return prev;
    }
}
```
<!-- slide -->
```javascript
function ListNode(val, next) {
    this.val = (val === undefined ? 0 : val);
    this.next = (next === undefined ? null : next);
}

function reverseList(head) {
    // Reverse a singly linked list iteratively.
    // Time: O(n), Space: O(1)
    let prev = null;
    let current = head;
    
    while (current !== null) {
        const nextNode = current.next;
        current.next = prev;
        prev = current;
        current = nextNode;
    }
    
    return prev;
}
```
````

#### Time and Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(n) - single pass through all n nodes |
| Space | O(1) - only three pointer variables |

### Approach 2: Recursive Reversal

#### Algorithm

1. **Base case**: If `head` is null or `head.next` is null, return `head`
2. **Recurse**: Call `reverseList(head.next)` to reverse the rest
3. **Rewire**: Set `head.next.next = head` (next node points back)
4. **Disconnect**: Set `head.next = null`
5. **Return**: The `new_head` from recursion is the head of reversed list

#### Implementation

````carousel
```python
def reverse_list_recursive(head: ListNode) -> ListNode:
    """
    Reverse a singly linked list recursively.
    Time: O(n), Space: O(n) for recursion stack
    """
    # Base case: empty list or single node
    if not head or not head.next:
        return head
    
    # Recurse on the rest of the list
    new_head = reverse_list_recursive(head.next)
    
    # Rewire: make the next node point back to current
    head.next.next = head
    
    # Disconnect the old forward link
    head.next = None
    
    return new_head
```
<!-- slide -->
```cpp
class Solution {
public:
    ListNode* reverseList(ListNode* head) {
        // Recursive reversal of linked list.
        if (!head || !head->next) return head;
        
        ListNode* new_head = reverseList(head->next);
        head->next->next = head;
        head->next = nullptr;
        
        return new_head;
    }
};
```
<!-- slide -->
```java
class Solution {
    public ListNode reverseList(ListNode head) {
        // Recursive reversal of linked list.
        if (head == null || head.next == null) return head;
        
        ListNode newHead = reverseList(head.next);
        head.next.next = head;
        head.next = null;
        
        return newHead;
    }
}
```
<!-- slide -->
```javascript
function reverseList(head) {
    // Recursive reversal of linked list.
    if (!head || !head.next) return head;
    
    const newHead = reverseList(head.next);
    head.next.next = head;
    head.next = null;
    
    return newHead;
}
```
````

#### Time and Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(n) - each node visited once |
| Space | O(n) - recursion stack depth |

### Approach 3: Sublist Reversal (Reverse Between Positions)

Reverse only the nodes between positions `left` and `right` (1-indexed).

#### Implementation

````carousel
```python
def reverse_between(head: ListNode, left: int, right: int) -> ListNode:
    """
    Reverse nodes between positions left and right (1-indexed).
    LeetCode 92 - Reverse Linked List II
    Time: O(n), Space: O(1)
    """
    if not head or left == right:
        return head
    
    dummy = ListNode(0)
    dummy.next = head
    
    # Move prev_left to the node just before position left
    prev_left = dummy
    for _ in range(left - 1):
        prev_left = prev_left.next
    
    # current is the node at position left
    current = prev_left.next
    
    # Reverse the sublist by moving nodes to the front
    for _ in range(right - left):
        next_node = current.next
        current.next = next_node.next
        next_node.next = prev_left.next
        prev_left.next = next_node
    
    return dummy.next
```
<!-- slide -->
```cpp
class Solution {
public:
    ListNode* reverseBetween(ListNode* head, int left, int right) {
        // Reverse nodes between positions left and right.
        if (!head || left == right) return head;
        
        ListNode dummy(0);
        dummy.next = head;
        ListNode* prevLeft = &dummy;
        
        for (int i = 0; i < left - 1; i++)
            prevLeft = prevLeft->next;
        
        ListNode* current = prevLeft->next;
        for (int i = 0; i < right - left; i++) {
            ListNode* nextNode = current->next;
            current->next = nextNode->next;
            nextNode->next = prevLeft->next;
            prevLeft->next = nextNode;
        }
        
        return dummy.next;
    }
};
```
<!-- slide -->
```java
class Solution {
    public ListNode reverseBetween(ListNode head, int left, int right) {
        // Reverse nodes between positions left and right.
        if (head == null || left == right) return head;
        
        ListNode dummy = new ListNode(0);
        dummy.next = head;
        ListNode prevLeft = dummy;
        
        for (int i = 0; i < left - 1; i++)
            prevLeft = prevLeft.next;
        
        ListNode current = prevLeft.next;
        for (int i = 0; i < right - left; i++) {
            ListNode nextNode = current.next;
            current.next = nextNode.next;
            nextNode.next = prevLeft.next;
            prevLeft.next = nextNode;
        }
        
        return dummy.next;
    }
}
```
<!-- slide -->
```javascript
function reverseBetween(head, left, right) {
    // Reverse nodes between positions left and right.
    if (!head || left === right) return head;
    
    const dummy = new ListNode(0);
    dummy.next = head;
    let prevLeft = dummy;
    
    for (let i = 0; i < left - 1; i++)
        prevLeft = prevLeft.next;
    
    let current = prevLeft.next;
    for (let i = 0; i < right - left; i++) {
        const nextNode = current.next;
        current.next = nextNode.next;
        nextNode.next = prevLeft.next;
        prevLeft.next = nextNode;
    }
    
    return dummy.next;
}
```
````

#### Time and Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(n) - at most one full pass through the list |
| Space | O(1) - only constant number of pointers |

## Complexity Analysis

| Approach | Time | Space | When to Use |
|----------|------|-------|-------------|
| Iterative | O(n) | O(1) | **Recommended** - most interviews |
| Recursive | O(n) | O(n) | When code clarity matters |
| Sublist Reversal | O(n) | O(1) | Partial reversal problems |

## Related Problems

| Problem | LeetCode # | Difficulty | Description |
|---------|------------|------------|-------------|
| [Reverse Linked List](https://leetcode.com/problems/reverse-linked-list/) | 206 | Easy | Reverse entire list |
| [Reverse Linked List II](https://leetcode.com/problems/reverse-linked-list-ii/) | 92 | Medium | Reverse sublist between positions |
| [Reverse Nodes in k-Group](https://leetcode.com/problems/reverse-nodes-in-k-group/) | 25 | Hard | Reverse every k nodes |
| [Palindrome Linked List](https://leetcode.com/problems/palindrome-linked-list/) | 234 | Easy | Check palindrome by reversing second half |
| [Swap Nodes in Pairs](https://leetcode.com/problems/swap-nodes-in-pairs/) | 24 | Medium | Swap every two adjacent nodes |
| [Reorder List](https://leetcode.com/problems/reorder-list/) | 143 | Medium | Reverse second half and merge alternately |

## Video Tutorial Links

1. **[NeetCode - Reverse Linked List](https://www.youtube.com/watch?v=G0_I-ZF0S38)** - Iterative and recursive approaches
2. **[Back To Back SWE - Reverse Linked List](https://www.youtube.com/watch?v=iRtLEoL-r-g)** - Step-by-step visualization
3. **[Kevin Naughton Jr. - LeetCode 206](https://www.youtube.com/watch?v=sYd_-pAfbBw)** - Concise walkthrough
4. **[Nick White - Reverse Linked List II](https://www.youtube.com/watch?v=RF_M9tX4Eag)** - Sublist reversal
5. **[Techdose - Reverse Nodes in k-Group](https://www.youtube.com/watch?v=1UOPsfP85V4)** - Hard problem breakdown

## Summary

### Key Takeaways

- **Three-pointer technique** is the standard: `prev`, `current`, `next`
- **Always save `next` first** before overwriting `current.next`
- **Dummy node** eliminates edge cases when head might change
- **Iterative approach** is preferred for O(1) space
- **Sublist reversal** moves nodes one by one to the front

### Common Pitfalls

1. Forgetting to save `current.next` before overwriting
2. Not handling null/single-node lists
3. Returning `current` instead of `prev` after reversal
4. Off-by-one errors in position-based problems
5. Creating cycles by not setting `head.next = null` in recursive approach

### Follow-up Questions

1. **When should I use iterative vs recursive?**
   - Use iterative when O(1) space is required; recursive for clarity

2. **How do I reverse a doubly linked list?**
   - Swap `next` and `prev` pointers for each node

3. **How do I reverse every k nodes?**
   - Reverse k nodes, connect to previous group, repeat

4. **Can I reverse using a stack?**
   - Yes, but uses O(n) space; defeats in-place goal

5. **How do I detect if a list is a palindrome?**
   - Reverse second half, compare with first half

## Pattern Source

[In-place Reversal Pattern](patterns/linked-list-in-place-reversal.md)
