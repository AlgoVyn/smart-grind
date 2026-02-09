# Reverse Linked List

## Problem Statement

Given the head of a singly linked list, reverse the list, and return the reversed list.

---

### Input Format

- `head`: A reference to the first node of a singly linked list (`ListNode` or `null`)

### Output Format

- A reference to the head of the reversed linked list

### Constraints

- The number of nodes in the list is in the range `[0, 5000]`
- `-5000 <= Node.val <= 5000`

**Follow-up:** A linked list can be reversed either iteratively or recursively. Could you implement both?

---

## Examples

### Example 1

**Input:**
```
head = [1, 2, 3, 4, 5]
```

**Output:**
```
[5, 4, 3, 2, 1]
```

**Explanation:**

```
Before: 1 → 2 → 3 → 4 → 5 → null
After:  5 → 4 → 3 → 2 → 1 → null
```

---

### Example 2

**Input:**
```
head = [1, 2]
```

**Output:**
```
[2, 1]
```

**Explanation:**

```
Before: 1 → 2 → null
After:  2 → 1 → null
```

---

### Example 3

**Input:**
```
head = []
```

**Output:**
```
[]
```

**Explanation:** An empty list is already reversed.

---

## Intuition

A singly linked list only has forward pointers — each node points to the next. To reverse the list, we need to flip every pointer so each node points to its predecessor instead.

The key insight is that we can do this **in a single pass** by maintaining a `prev` pointer. As we walk through the list, we redirect each node's `next` pointer from the node ahead to the node behind. After processing all nodes, the original tail becomes the new head.

**Step-by-step visualization for `[1, 2, 3]`:**

```
Step 0: prev=null       curr=1→2→3→null
Step 1: prev=1→null     curr=2→3→null       (1.next = null)
Step 2: prev=2→1→null   curr=3→null         (2.next = 1)
Step 3: prev=3→2→1→null curr=null           (3.next = 2)
Return prev → [3, 2, 1] ✓
```

---

## Multiple Approaches with Code

We'll cover three approaches:

1. **Iterative (Three-Pointer)** — The classic O(1) space solution
2. **Recursive** — Elegant approach using the call stack
3. **Stack-Based** — Conceptual approach using explicit stack (O(n) space)

---

### Approach 1: Iterative (Three-Pointer Technique)

This is the most common and interview-preferred approach. We use three pointers — `prev`, `current`, and `next_node` — to walk through the list and flip each link.

#### Algorithm Steps

1. Initialize `prev = null` and `current = head`
2. While `current` is not null:
   - Save `next_node = current.next` (preserve the forward link)
   - Set `current.next = prev` (reverse the link)
   - Move `prev = current` (advance prev)
   - Move `current = next_node` (advance current)
3. Return `prev` as the new head

#### Code Implementation

````carousel
```python
from typing import Optional

# Definition for singly-linked list.
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

class Solution:
    def reverseList(self, head: Optional[ListNode]) -> Optional[ListNode]:
        """
        Reverse a singly linked list iteratively.
        Time: O(n), Space: O(1)
        """
        prev = None
        current = head
        
        while current is not None:
            # Save the next node before we overwrite current.next
            next_node = current.next
            
            # Reverse the link
            current.next = prev
            
            # Move pointers forward
            prev = current
            current = next_node
        
        # prev is now the new head
        return prev
```

<!-- slide -->
```cpp
/**
 * Definition for singly-linked list.
 * struct ListNode {
 *     int val;
 *     ListNode *next;
 *     ListNode() : val(0), next(nullptr) {}
 *     ListNode(int x) : val(x), next(nullptr) {}
 *     ListNode(int x, ListNode *next) : val(x), next(next) {}
 * };
 */
class Solution {
public:
    ListNode* reverseList(ListNode* head) {
        // Reverse a singly linked list iteratively.
        // Time: O(n), Space: O(1)
        ListNode* prev = nullptr;
        ListNode* current = head;
        
        while (current != nullptr) {
            // Save the next node
            ListNode* next_node = current->next;
            
            // Reverse the link
            current->next = prev;
            
            // Move pointers forward
            prev = current;
            current = next_node;
        }
        
        return prev;
    }
};
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
class Solution {
    public ListNode reverseList(ListNode head) {
        // Reverse a singly linked list iteratively.
        // Time: O(n), Space: O(1)
        ListNode prev = null;
        ListNode current = head;
        
        while (current != null) {
            // Save the next node
            ListNode nextNode = current.next;
            
            // Reverse the link
            current.next = prev;
            
            // Move pointers forward
            prev = current;
            current = nextNode;
        }
        
        return prev;
    }
}
```

<!-- slide -->
```javascript
/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */

/**
 * @param {ListNode} head
 * @return {ListNode}
 */
var reverseList = function(head) {
    // Reverse a singly linked list iteratively.
    // Time: O(n), Space: O(1)
    let prev = null;
    let current = head;
    
    while (current !== null) {
        // Save the next node
        const nextNode = current.next;
        
        // Reverse the link
        current.next = prev;
        
        // Move pointers forward
        prev = current;
        current = nextNode;
    }
    
    return prev;
};
```
````

#### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) — Single pass through all n nodes |
| **Space** | O(1) — Only three pointer variables used |

---

### Approach 2: Recursive

The recursive approach leverages the call stack to reach the end of the list first, then rewires pointers on the way back up. It's elegant but uses O(n) stack space.

#### Algorithm Steps

1. **Base case**: If `head` is null or `head.next` is null, return `head`
2. **Recurse**: Call `reverseList(head.next)` to reverse the rest of the list
3. **Rewire**: Set `head.next.next = head` (make the next node point back to current)
4. **Disconnect**: Set `head.next = null` (remove the old forward link)
5. **Return**: The `new_head` propagated from the base case is the new head

#### Visual Walkthrough

```
reverseList(1→2→3→null)
  reverseList(2→3→null)
    reverseList(3→null)
      return 3  ← base case (single node)
    head=2: 2.next.next = 2 → now 3→2
            2.next = null    → now 3→2→null
    return 3
  head=1: 1.next.next = 1 → now 2→1
          1.next = null    → now 3→2→1→null
  return 3
Result: 3→2→1→null ✓
```

#### Code Implementation

````carousel
```python
from typing import Optional

class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

class Solution:
    def reverseList(self, head: Optional[ListNode]) -> Optional[ListNode]:
        """
        Reverse a singly linked list recursively.
        Time: O(n), Space: O(n) due to call stack
        """
        # Base case: empty list or single node
        if head is None or head.next is None:
            return head
        
        # Recurse on the rest of the list
        new_head = self.reverseList(head.next)
        
        # Rewire: make the next node point back to current
        head.next.next = head
        
        # Disconnect the old forward link
        head.next = None
        
        # new_head is the tail of the original list (new head of reversed)
        return new_head
```

<!-- slide -->
```cpp
class Solution {
public:
    ListNode* reverseList(ListNode* head) {
        // Reverse a singly linked list recursively.
        // Time: O(n), Space: O(n) due to call stack
        
        // Base case: empty list or single node
        if (head == nullptr || head->next == nullptr) {
            return head;
        }
        
        // Recurse on the rest of the list
        ListNode* new_head = reverseList(head->next);
        
        // Rewire: make the next node point back to current
        head->next->next = head;
        
        // Disconnect the old forward link
        head->next = nullptr;
        
        return new_head;
    }
};
```

<!-- slide -->
```java
class Solution {
    public ListNode reverseList(ListNode head) {
        // Reverse a singly linked list recursively.
        // Time: O(n), Space: O(n) due to call stack
        
        // Base case: empty list or single node
        if (head == null || head.next == null) {
            return head;
        }
        
        // Recurse on the rest of the list
        ListNode newHead = reverseList(head.next);
        
        // Rewire: make the next node point back to current
        head.next.next = head;
        
        // Disconnect the old forward link
        head.next = null;
        
        return newHead;
    }
}
```

<!-- slide -->
```javascript
var reverseList = function(head) {
    // Reverse a singly linked list recursively.
    // Time: O(n), Space: O(n) due to call stack
    
    // Base case: empty list or single node
    if (head === null || head.next === null) {
        return head;
    }
    
    // Recurse on the rest of the list
    const newHead = reverseList(head.next);
    
    // Rewire: make the next node point back to current
    head.next.next = head;
    
    // Disconnect the old forward link
    head.next = null;
    
    return newHead;
};
```
````

#### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) — Each node is visited once during recursion |
| **Space** | O(n) — Call stack depth equals the number of nodes |

---

### Approach 3: Stack-Based

This approach uses an explicit stack to collect all nodes, then pops them to build the reversed list. While it uses O(n) space, it's useful for understanding the concept and can be adapted for problems where you need random access to nodes.

#### Algorithm Steps

1. Push all nodes onto a stack
2. Pop nodes one by one and link them together
3. Set the last node's `next` to null
4. Return the first popped node as the new head

#### Code Implementation

````carousel
```python
from typing import Optional

class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

class Solution:
    def reverseList(self, head: Optional[ListNode]) -> Optional[ListNode]:
        """
        Reverse a singly linked list using a stack.
        Time: O(n), Space: O(n)
        """
        if not head:
            return head
        
        # Push all nodes onto the stack
        stack = []
        current = head
        while current:
            stack.append(current)
            current = current.next
        
        # Pop nodes and link them together
        new_head = stack.pop()
        current = new_head
        while stack:
            current.next = stack.pop()
            current = current.next
        
        # Terminate the list
        current.next = None
        
        return new_head
```

<!-- slide -->
```cpp
#include <stack>

class Solution {
public:
    ListNode* reverseList(ListNode* head) {
        // Reverse a singly linked list using a stack.
        // Time: O(n), Space: O(n)
        if (!head) return head;
        
        // Push all nodes onto the stack
        std::stack<ListNode*> stk;
        ListNode* current = head;
        while (current) {
            stk.push(current);
            current = current->next;
        }
        
        // Pop nodes and link them together
        ListNode* new_head = stk.top();
        stk.pop();
        current = new_head;
        while (!stk.empty()) {
            current->next = stk.top();
            stk.pop();
            current = current->next;
        }
        
        // Terminate the list
        current->next = nullptr;
        
        return new_head;
    }
};
```

<!-- slide -->
```java
import java.util.Stack;

class Solution {
    public ListNode reverseList(ListNode head) {
        // Reverse a singly linked list using a stack.
        // Time: O(n), Space: O(n)
        if (head == null) return head;
        
        // Push all nodes onto the stack
        Stack<ListNode> stack = new Stack<>();
        ListNode current = head;
        while (current != null) {
            stack.push(current);
            current = current.next;
        }
        
        // Pop nodes and link them together
        ListNode newHead = stack.pop();
        current = newHead;
        while (!stack.isEmpty()) {
            current.next = stack.pop();
            current = current.next;
        }
        
        // Terminate the list
        current.next = null;
        
        return newHead;
    }
}
```

<!-- slide -->
```javascript
var reverseList = function(head) {
    // Reverse a singly linked list using a stack.
    // Time: O(n), Space: O(n)
    if (!head) return head;
    
    // Push all nodes onto the stack
    const stack = [];
    let current = head;
    while (current) {
        stack.push(current);
        current = current.next;
    }
    
    // Pop nodes and link them together
    const newHead = stack.pop();
    current = newHead;
    while (stack.length > 0) {
        current.next = stack.pop();
        current = current.next;
    }
    
    // Terminate the list
    current.next = null;
    
    return newHead;
};
```
````

#### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) — Two passes: one to push, one to pop |
| **Space** | O(n) — Stack stores all n nodes |

---

### Comparison of Approaches

| Aspect | Iterative | Recursive | Stack-Based |
|--------|-----------|-----------|-------------|
| **Time Complexity** | O(n) | O(n) | O(n) |
| **Space Complexity** | O(1) | O(n) call stack | O(n) explicit stack |
| **Implementation** | Simple | Elegant | Straightforward |
| **Interview Preference** | ★★★★★ | ★★★★ | ★★★ |
| **Stack Overflow Risk** | None | Yes (deep lists) | None |
| **Best For** | Production code | Understanding recursion | Conceptual clarity |

---

## Related Problems

### LeetCode Problems

| Problem | Difficulty | Description |
|---------|------------|-------------|
| **[LeetCode 206: Reverse Linked List](https://leetcode.com/problems/reverse-linked-list/)** | Easy | This problem — reverse the entire list |
| **[LeetCode 92: Reverse Linked List II](https://leetcode.com/problems/reverse-linked-list-ii/)** | Medium | Reverse nodes between positions left and right |
| **[LeetCode 25: Reverse Nodes in k-Group](https://leetcode.com/problems/reverse-nodes-in-k-group/)** | Hard | Reverse every k consecutive nodes |
| **[LeetCode 234: Palindrome Linked List](https://leetcode.com/problems/palindrome-linked-list/)** | Easy | Check palindrome by reversing the second half |
| **[LeetCode 24: Swap Nodes in Pairs](https://leetcode.com/problems/swap-nodes-in-pairs/)** | Medium | Swap every two adjacent nodes |
| **[LeetCode 143: Reorder List](https://leetcode.com/problems/reorder-list/)** | Medium | Reverse second half and merge alternately |
| **[LeetCode 61: Rotate List](https://leetcode.com/problems/rotate-list/)** | Medium | Rotate the list to the right by k places |
| **[LeetCode 328: Odd Even Linked List](https://leetcode.com/problems/odd-even-linked-list/)** | Medium | Group odd-indexed and even-indexed nodes |
| **[LeetCode 2130: Maximum Twin Sum of a Linked List](https://leetcode.com/problems/maximum-twin-sum-of-a-linked-list/)** | Medium | Reverse second half and compute twin sums |
| **[LeetCode 2074: Reverse Nodes in Even Length Groups](https://leetcode.com/problems/reverse-nodes-in-even-length-groups/)** | Medium | Reverse nodes in groups of even length |

---

## Video Tutorial Links

### Problem Walkthroughs

- [Reverse Linked List - Iterative AND Recursive (NeetCode)](https://www.youtube.com/watch?v=G0_I-ZF0S38) — Clear explanation of both approaches with animations
- [Reverse a Linked List (Take U Forward)](https://www.youtube.com/watch?v=iRtLEoL-r-g) — Detailed dry run and visualization
- [Reverse Linked List - LeetCode 206 (Kevin Naughton Jr.)](https://www.youtube.com/watch?v=sYd_-pAfbBw) — Concise Java walkthrough

### Related Problem Tutorials

- [Reverse Linked List II - LeetCode 92 (NeetCode)](https://www.youtube.com/watch?v=RF_M9tX4Eag) — Sublist reversal explained
- [Reverse Nodes in k-Group - LeetCode 25 (NeetCode)](https://www.youtube.com/watch?v=1UOPsfP85V4) — Hard problem broken down step by step
- [Palindrome Linked List - LeetCode 234 (NeetCode)](https://www.youtube.com/watch?v=yOzXms1J6Nk) — Combining reversal with two-pointer technique

### Fundamentals

- [Linked List Problems Playlist (NeetCode)](https://www.youtube.com/playlist?list=PLot-Xpze53leU0Ec0VkBhnf4npMRFiNcB) — Comprehensive linked list problem set
- [Linked List Interview Questions (Take U Forward)](https://www.youtube.com/playlist?list=PLgUwDviBIf0rAuz8tVcM0AymmhTRsfaLU) — Top interview problems

---

## Follow-up Questions

### Q1: When should I use iterative vs. recursive reversal?

**Answer:** Use **iterative** when O(1) space is required (most interview settings and production code). Use **recursive** when code clarity matters more than space, or when the problem naturally lends itself to recursion. For very long lists (n > 10,000), recursive reversal risks stack overflow in languages without tail-call optimization.

---

### Q2: How do I reverse a doubly linked list in-place?

**Answer:** For each node, swap its `next` and `prev` pointers:
```python
current = head
while current:
    current.prev, current.next = current.next, current.prev
    head = current
    current = current.prev  # prev is now the original next
```

---

### Q3: What if the list has a cycle?

**Answer:** You must first detect and break the cycle (using Floyd's cycle detection algorithm), then reverse the acyclic list. Attempting to reverse a list with an active cycle would cause an infinite loop.

---

### Q4: How do I reverse only the first k nodes?

**Answer:** Use the iterative approach but stop after k iterations, then connect the reversed portion to the remaining list:
```python
prev = None
current = head
for _ in range(k):
    next_node = current.next
    current.next = prev
    prev = current
    current = next_node
head.next = current  # Connect reversed part to the rest
return prev
```

---

### Q5: Can this be done without modifying the original list?

**Answer:** Yes — create new nodes with the same values in reverse order. This uses O(n) space but preserves the original list. Alternatively, collect values into an array, reverse the array, and build a new list.

---

### Q6: What are the most common mistakes?

**Answer:**
1. **Forgetting to save `current.next`** before overwriting it — this loses the rest of the list
2. **Returning `head` instead of `prev`** — the original head is now the tail
3. **Not handling empty or single-node lists** — always check for null
4. **Infinite loop in recursive approach** — forgetting to set `head.next = null` creates a cycle between the last two nodes

---

### Q7: How does this pattern extend to more complex problems?

**Answer:** The in-place reversal technique is a building block for:
- **Palindrome check**: Reverse the second half, compare, optionally restore
- **Reorder list**: Split, reverse second half, merge alternately
- **K-group reversal**: Apply the basic reversal in a loop with group boundary tracking
- **Rotate list**: Find the new tail, break and reconnect

---

### Q8: What is the relationship between reversing a linked list and a stack?

**Answer:** Reversing a linked list is conceptually equivalent to pushing all elements onto a stack and popping them. The stack's LIFO (Last-In-First-Out) property naturally produces the reversed order. The iterative three-pointer approach achieves the same result without the O(n) space overhead of an actual stack.
