# Reorder List

## Problem Description

You are given the head of a singly linked list. The list can be represented as:

L0 → L1 → L2 → ... → Ln-1 → Ln

Reorder it to:

L0 → Ln → L1 → Ln-1 → L2 → Ln-2 → ...

You must do this in-place without altering the nodes' values.

**Link to problem:** [Reorder List - LeetCode 143](https://leetcode.com/problems/reorder-list/)

## Constraints
- The number of nodes in the list is in the range [1, 5 * 10^4]
- 1 <= Node.val <= 1000

---

## Pattern: Linked List Manipulation (Three Steps)

This problem requires combining multiple linked list techniques in three steps.

### Core Concept

1. **Find Middle**: Use slow/fast pointers to find the middle
2. **Reverse Second Half**: Reverse the linked list from middle
3. **Merge**: Interleave nodes from both halves

---

## Examples

### Example

**Input:** head = [1,2,3,4,5]

**Output:** [1,5,2,4,3]

### Example 2

**Input:** head = [1,2,3,4]

**Output:** [1,4,2,3]

---

## Intuition

The key insight for this problem is understanding how to reorder a linked list into a zigzag pattern (first → last → second → second-last → ...). The solution requires three distinct steps that each solve a sub-problem.

### Key Observations

1. **Finding the Middle**: Using the slow/fast pointer technique, we can find the middle of the linked list in one pass. When fast reaches the end, slow will be at the middle.

2. **Reversing the Second Half**: Once we have the middle, we need to reverse the second half of the list so we can interleave nodes from both ends.

3. **Interleaving Nodes**: By alternating between nodes from the first half and the reversed second half, we achieve the desired zigzag pattern.

### Why Three Steps?

- A single pass cannot accomplish this because we need to access nodes from both ends
- The middle divides the list into two parts that need to be processed differently
- Reversing enables us to traverse from the end while the first half is traversed from the start

---

## Multiple Approaches with Code

We'll cover two approaches:

1. **Three-Step Approach (Optimal)** - O(n) time, O(1) space
2. **Deque-based Approach** - O(n) time, O(n) space

---

## Approach: Three-Step Approach

### Algorithm Steps

1. Find middle using slow/fast pointers
2. Reverse second half
3. Merge both halves

### Code Implementation

````carousel
```python
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

class Solution:
    def reorderList(self, head: ListNode) -> None:
        if not head:
            return
        
        # Step 1: Find middle
        slow, fast = head, head
        while fast and fast.next:
            slow = slow.next
            fast = fast.next.next
        
        # Step 2: Reverse second half
        prev = None
        curr = slow
        while curr:
            next_temp = curr.next
            curr.next = prev
            prev = curr
            curr = next_temp
        
        # Step 3: Merge two halves
        first, second = head, prev
        while second.next:
            first_next = first.next
            second_next = second.next
            
            first.next = second
            second.next = first_next
            
            first = first_next
            second = second_next
```

<!-- slide -->
```cpp
class Solution {
public:
    void reorderList(ListNode* head) {
        if (!head) return;
        
        // Find middle
        ListNode* slow = head;
        ListNode* fast = head;
        while (fast->next && fast->next->next) {
            slow = slow->next;
            fast = fast->next->next;
        }
        
        // Reverse second half
        ListNode* prev = nullptr;
        ListNode* curr = slow;
        while (curr) {
            ListNode* next = curr->next;
            curr->next = prev;
            prev = curr;
            curr = next;
        }
        
        // Merge
        ListNode* first = head;
        ListNode* second = prev;
        while (second->next) {
            ListNode* firstNext = first->next;
            ListNode* secondNext = second->next;
            
            first->next = second;
            second->next = firstNext;
            
            first = firstNext;
            second = secondNext;
        }
    }
};
```

<!-- slide -->
```java
class Solution {
    public void reorderList(ListNode head) {
        if (head == null) return;
        
        // Find middle
        ListNode slow = head, fast = head;
        while (fast.next != null && fast.next.next != null) {
            slow = slow.next;
            fast = fast.next.next;
        }
        
        // Reverse second half
        ListNode prev = null, curr = slow;
        while (curr != null) {
            ListNode next = curr.next;
            curr.next = prev;
            prev = curr;
            curr = next;
        }
        
        // Merge
        ListNode first = head, second = prev;
        while (second.next != null) {
            ListNode firstNext = first.next;
            ListNode secondNext = second.next;
            
            first.next = second;
            second.next = firstNext;
            
            first = firstNext;
            second = secondNext;
        }
    }
}
```

<!-- slide -->
```javascript
var reorderList = function(head) {
    if (!head) return;
    
    // Find middle
    let slow = head, fast = head;
    while (fast.next && fast.next.next) {
        slow = slow.next;
        fast = fast.next.next;
    }
    
    // Reverse second half
    let prev = null, curr = slow;
    while (curr) {
        const next = curr.next;
        curr.next = prev;
        prev = curr;
        curr = next;
    }
    
    // Merge
    let first = head, second = prev;
    while (second.next) {
        const firstNext = first.next;
        const secondNext = second.next;
        
        first.next = second;
        second.next = firstNext;
        
        first = firstNext;
        second = secondNext;
    }
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) - three O(n) passes |
| **Space** | O(1) - in-place |

---

## Approach 2: Deque-based Approach

This approach uses a deque (double-ended queue) to collect all nodes, then rebuilds the list by alternately taking nodes from the front and back of the deque.

### Problem Description

Given the head of a singly linked list, reorder it to L0 → Ln → L1 → Ln-1 → L2 → Ln-2 → ... using a deque-based approach.

### Algorithm Steps

1. Traverse the list and store all nodes in a deque
2. Alternately take nodes from the front and back of the deque
3. Rebuild the list by connecting these nodes in the required order
4. Set the last node's next to None

### Why It Works

The deque allows O(1) access to both ends of the collection. By taking nodes alternately from front and back, we naturally create the required interleaving pattern: first, last, second, second-to-last, etc.

### Code Implementation

````carousel
```python
from collections import deque
from typing import Optional

class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

class Solution:
    def reorderList(self, head: Optional[ListNode]) -> None:
        if not head or not head.next:
            return
        
        # Step 1: Collect all nodes in a deque
        d = deque()
        current = head
        while current:
            d.append(current)
            current = current.next
        
        # Step 2: Rebuild the list alternately from front and back
        dummy = ListNode(0)
        current = dummy
        left = True  # Start from front
        
        while d:
            if left:
                node = d.popleft()
            else:
                node = d.pop()
            current.next = node
            current = node
            left = not left
        
        # Step 3: Important: set the last node's next to None
        current.next = None
```

<!-- slide -->
```cpp
class Solution {
public:
    void reorderList(ListNode* head) {
        if (!head || !head->next) return;
        
        // Collect all nodes in a deque
        deque<ListNode*> d;
        ListNode* current = head;
        while (current) {
            d.push_back(current);
            current = current->next;
        }
        
        // Rebuild the list alternately from front and back
        ListNode* dummy = new ListNode(0);
        current = dummy;
        bool left = true;
        
        while (!d.empty()) {
            ListNode* node;
            if (left) {
                node = d.front();
                d.pop_front();
            } else {
                node = d.back();
                d.pop_back();
            }
            current->next = node;
            current = node;
            left = !left;
        }
        
        // Set the last node's next to nullptr
        current->next = nullptr;
    }
};
```

<!-- slide -->
```java
class Solution {
    public void reorderList(ListNode head) {
        if (head == null || head.next == null) return;
        
        // Collect all nodes in a deque
        Deque<ListNode> d = new ArrayDeque<>();
        ListNode current = head;
        while (current != null) {
            d.add(current);
            current = current.next;
        }
        
        // Rebuild the list alternately from front and back
        ListNode dummy = new ListNode(0);
        current = dummy;
        boolean left = true;
        
        while (!d.isEmpty()) {
            ListNode node;
            if (left) {
                node = d.pollFirst();
            } else {
                node = d.pollLast();
            }
            current.next = node;
            current = node;
            left = !left;
        }
        
        // Set the last node's next to null
        current.next = null;
    }
}
```

<!-- slide -->
```javascript
var reorderList = function(head) {
    if (!head || !head.next) return;
    
    // Collect all nodes in a deque
    const d = [];
    let current = head;
    while (current) {
        d.push(current);
        current = current.next;
    }
    
    // Rebuild the list alternately from front and back
    let dummy = { val: 0, next: null };
    current = dummy;
    let left = true;
    
    while (d.length > 0) {
        let node;
        if (left) {
            node = d.shift();
        } else {
            node = d.pop();
        }
        current.next = node;
        current = node;
        left = !left;
    }
    
    // Set the last node's next to null
    current.next = null;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) - single pass to collect, O(n) to rebuild |
| **Space** | O(n) - storing all nodes in deque |

---

## Comparison of Approaches

| Aspect | Three-Step Approach | Deque-based |
|--------|---------------------|-------------|
| **Time Complexity** | O(n) | O(n) |
| **Space Complexity** | O(1) | O(n) |
| **Implementation** | Moderate - three phases | Simple - collect and rebuild |
| **In-place** | Yes | No (reuses nodes) |
| **Best For** | Space-constrained | Simplicity and readability |

**Best Approach:** The three-step approach is optimal with O(1) space, making it preferred for space-constrained environments. The deque-based approach is simpler to understand but uses more memory.

## Related Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Reverse Linked List | [Link](https://leetcode.com/problems/reverse-linked-list/) | Basic reversal |
| Middle of Linked List | [Link](https://leetcode.com/problems/middle-of-the-linked-list/) | Finding middle |

---

## Video Tutorial Links

- [NeetCode - Reorder List](https://www.youtube.com/watch?v=7C_f7fD2p14) - Clear explanation

---

## Follow-up Questions

### Q1: Why three steps?

**Answer:** Each step solves a sub-problem: finding middle, reversing, and merging.

### Q2: Can you do it in one pass?

**Answer:** Not efficiently. The three-step approach is optimal.

---

## Common Pitfalls

### 1. Middle Node Position
**Issue**: Not handling even/odd length lists correctly for middle.

**Solution**: For even list (4 nodes), slow ends at node 2 (0-indexed). This correctly splits into 2 and 2 nodes.

### 2. Null Pointer Exception
**Issue**: Not checking for null before accessing .next.

**Solution**: Always check `while fast and fast.next` in the first loop.

### 3. Head Modification
**Issue**: Modifying head during reversal.

**Solution**: Create copies/pointers before modifying. Keep reference to original head.

### 4. Second Half Start
**Issue**: Getting wrong start for second half after reversal.

**Solution**: After reversal, `prev` points to the start of the reversed portion.

### 5. Merge Termination
**Issue**: Wrong loop condition for merge.

**Solution**: Use `while second.next` to stop before null, or handle last node carefully.

---

## Why It Works

The three-step approach works because:

1. **Finding Middle**: Slow pointer moves 1 step, fast moves 2. When fast reaches end, slow is at middle.

2. **Reversing Second Half**: Standard linked list reversal in-place. After reversal, the second half is in reverse order.

3. **Interleaving**: By alternating nodes from first half and reversed second half, we achieve the desired order.

The key insight is that reversing the second half and then interleaving naturally creates the zigzag pattern.

---

## Summary

The **Reorder List** problem combines multiple techniques:
- **Three-Step Approach**: Find middle (slow/fast pointers), Reverse linked list, Merge two lists - O(n) time, O(1) space
- **Deque-based Approach**: Collect nodes in deque, alternately rebuild - O(n) time, O(n) space

The three-step approach is optimal for space, while deque-based is simpler to understand.

---

## Additional Resources

- [LeetCode Problem Discussion](https://leetcode.com/problems/reorder-list/discuss/)
