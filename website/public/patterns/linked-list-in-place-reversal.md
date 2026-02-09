# Linked List - In-place Reversal

## Problem Statement

The In-place Reversal pattern is used to reverse the order of nodes in a singly linked list without allocating additional data structures. By manipulating pointers directly, we can reverse an entire list, a sublist between two positions, or groups of k nodes — all in O(1) extra space. This pattern is foundational for many linked list problems and appears frequently in coding interviews.

Common problem variations include:

- **Reverse Entire List**: Reverse all nodes so the tail becomes the new head
- **Reverse Sublist**: Reverse only the nodes between positions `left` and `right`
- **Reverse in K-Groups**: Reverse every k consecutive nodes, leaving remainders as-is
- **Palindrome Check**: Reverse the second half and compare with the first half

---

### Input Format

- `head`: A reference to the first node of a singly linked list (`ListNode` or `null`)
- Additional parameters vary by problem (e.g., `left`, `right`, `k`)

### Output Format

- A reference to the head of the modified linked list

### Constraints

- `0 ≤ n ≤ 5000` (typical upper bound for number of nodes)
- `-5000 ≤ Node.val ≤ 5000`
- Time complexity target: O(n)
- Space complexity target: O(1)

---

## Examples

### Example 1: Reverse Entire List

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

Each node's `next` pointer is flipped to point to its predecessor.

---

### Example 2: Reverse Sublist (positions 2 to 4)

**Input:**
```
head = [1, 2, 3, 4, 5], left = 2, right = 4
```

**Output:**
```
[1, 4, 3, 2, 5]
```

**Explanation:**

```
Before: 1 → 2 → 3 → 4 → 5 → null
After:  1 → 4 → 3 → 2 → 5 → null
             ↑ reversed ↑
```

Only nodes at positions 2, 3, and 4 are reversed; the rest remain unchanged.

---

### Example 3: Reverse in K-Groups (k = 3)

**Input:**
```
head = [1, 2, 3, 4, 5], k = 3
```

**Output:**
```
[3, 2, 1, 4, 5]
```

**Explanation:**

```
Before: 1 → 2 → 3 → 4 → 5 → null
After:  3 → 2 → 1 → 4 → 5 → null
        ↑ reversed ↑  (remaining 2 nodes < k, left as-is)
```

---

### Example 4: Edge Cases

**Input:**
```
head = [1]
```

**Output:**
```
[1]
```

**Explanation:** A single-node list is already reversed.

**Input:**
```
head = []
```

**Output:**
```
[]
```

**Explanation:** An empty list has nothing to reverse.

---

## Intuition

The core idea behind in-place reversal is **pointer redirection**. In a singly linked list, each node points forward to the next node. To reverse the list, we need each node to point backward to the previous node instead.

### Why It Works

Consider a list `1 → 2 → 3 → null`:

1. We walk through the list one node at a time
2. At each node, we save the next node (so we don't lose it), then flip the current node's `next` pointer to point backward
3. After processing all nodes, the last node we visited becomes the new head

**Step-by-step visualization:**

```
Step 0: prev=null, curr=1→2→3→null
Step 1: prev=1→null, curr=2→3→null       (1 now points to null)
Step 2: prev=2→1→null, curr=3→null       (2 now points to 1)
Step 3: prev=3→2→1→null, curr=null       (3 now points to 2)
Return prev → 3→2→1→null ✓
```

### Key Observations

1. **Three pointers are sufficient**: `prev`, `current`, and `next_node` are all we need to reverse links without losing track of the list
2. **Each node is visited exactly once**: The algorithm makes a single pass through the list
3. **No extra data structures**: Unlike using a stack or array, we modify pointers in-place
4. **Dummy node simplifies edge cases**: For sublist reversal, a dummy node before the head avoids special-casing when `left = 1`

---

## Multiple Approaches with Code

We'll cover three approaches for in-place linked list reversal:

1. **Iterative Reversal** — The classic three-pointer technique
2. **Recursive Reversal** — Elegant recursive approach using the call stack
3. **Sublist Reversal** — Reverse only a portion of the list between two positions

---

### Approach 1: Iterative Reversal (Three-Pointer Technique)

This is the most common and interview-preferred approach. We maintain three pointers — `prev`, `current`, and `next_node` — and walk through the list, flipping each link.

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

### Approach 2: Recursive Reversal

The recursive approach leverages the call stack to reverse the list. We recurse to the end of the list, then rewire pointers on the way back up.

#### Algorithm Steps

1. **Base case**: If `head` is null or `head.next` is null, return `head`
2. **Recurse**: Call `reverseList(head.next)` to reverse the rest of the list
3. **Rewire**: Set `head.next.next = head` (make the next node point back to current)
4. **Disconnect**: Set `head.next = null` (remove the old forward link)
5. **Return**: The `new_head` returned from recursion is the new head of the entire reversed list

#### Visual Walkthrough

```
reverseList(1→2→3→null)
  reverseList(2→3→null)
    reverseList(3→null)
      return 3  (base case)
    head=2, head.next.next=2 → 3→2, head.next=null → 3→2→null
    return 3
  head=1, head.next.next=1 → 2→1, head.next=null → 3→2→1→null
  return 3
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

### Approach 3: Sublist Reversal (Reverse Between Positions)

This approach reverses only the nodes between positions `left` and `right` (1-indexed). A dummy node simplifies edge cases when `left = 1`.

#### Algorithm Steps

1. Create a `dummy` node pointing to `head`
2. Move a pointer `prev_left` to the node just before position `left`
3. Set `current` to the node at position `left` (start of the sublist)
4. For `right - left` iterations:
   - Extract the node after `current` (`next_node`)
   - Move `next_node` to the front of the reversed sublist by rewiring pointers
5. Return `dummy.next`

#### Visual Walkthrough (left=2, right=4)

```
Initial:  dummy → 1 → 2 → 3 → 4 → 5 → null
                  ↑   ↑
             prev_left current

Step 1: Move 3 to front of sublist
          dummy → 1 → 3 → 2 → 4 → 5 → null

Step 2: Move 4 to front of sublist
          dummy → 1 → 4 → 3 → 2 → 5 → null

Result: [1, 4, 3, 2, 5]
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
    def reverseBetween(self, head: Optional[ListNode], left: int, right: int) -> Optional[ListNode]:
        """
        Reverse nodes between positions left and right (1-indexed).
        Time: O(n), Space: O(1)
        """
        if not head or left == right:
            return head
        
        # Dummy node to handle left=1 edge case
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
        // Reverse nodes between positions left and right (1-indexed).
        // Time: O(n), Space: O(1)
        if (!head || left == right) return head;
        
        // Dummy node to handle left=1 edge case
        ListNode dummy(0);
        dummy.next = head;
        
        // Move prev_left to the node just before position left
        ListNode* prev_left = &dummy;
        for (int i = 0; i < left - 1; i++) {
            prev_left = prev_left->next;
        }
        
        // current is the node at position left
        ListNode* current = prev_left->next;
        
        // Reverse the sublist by moving nodes to the front
        for (int i = 0; i < right - left; i++) {
            ListNode* next_node = current->next;
            current->next = next_node->next;
            next_node->next = prev_left->next;
            prev_left->next = next_node;
        }
        
        return dummy.next;
    }
};
```

<!-- slide -->
```java
class Solution {
    public ListNode reverseBetween(ListNode head, int left, int right) {
        // Reverse nodes between positions left and right (1-indexed).
        // Time: O(n), Space: O(1)
        if (head == null || left == right) return head;
        
        // Dummy node to handle left=1 edge case
        ListNode dummy = new ListNode(0);
        dummy.next = head;
        
        // Move prevLeft to the node just before position left
        ListNode prevLeft = dummy;
        for (int i = 0; i < left - 1; i++) {
            prevLeft = prevLeft.next;
        }
        
        // current is the node at position left
        ListNode current = prevLeft.next;
        
        // Reverse the sublist by moving nodes to the front
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
var reverseBetween = function(head, left, right) {
    // Reverse nodes between positions left and right (1-indexed).
    // Time: O(n), Space: O(1)
    if (!head || left === right) return head;
    
    // Dummy node to handle left=1 edge case
    const dummy = new ListNode(0);
    dummy.next = head;
    
    // Move prevLeft to the node just before position left
    let prevLeft = dummy;
    for (let i = 0; i < left - 1; i++) {
        prevLeft = prevLeft.next;
    }
    
    // current is the node at position left
    let current = prevLeft.next;
    
    // Reverse the sublist by moving nodes to the front
    for (let i = 0; i < right - left; i++) {
        const nextNode = current.next;
        current.next = nextNode.next;
        nextNode.next = prevLeft.next;
        prevLeft.next = nextNode;
    }
    
    return dummy.next;
};
```
````

#### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) — At most one full pass through the list |
| **Space** | O(1) — Only a constant number of pointers used |

---

### Comparison of Approaches

| Aspect | Iterative | Recursive | Sublist Reversal |
|--------|-----------|-----------|------------------|
| **Use Case** | Reverse entire list | Reverse entire list | Reverse a portion |
| **Time Complexity** | O(n) | O(n) | O(n) |
| **Space Complexity** | O(1) | O(n) call stack | O(1) |
| **Implementation** | Simple | Elegant | Moderate |
| **Interview Preference** | ★★★★★ | ★★★★ | ★★★★★ |
| **Best For** | General reversal | Understanding recursion | Partial reversal problems |

---

## General Code Templates

### Template 1: Reverse Entire Linked List (Iterative)

````carousel
```python
def reverse_linked_list(head):
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
ListNode* reverseList(ListNode* head) {
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
```

<!-- slide -->
```java
public ListNode reverseList(ListNode head) {
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
```

<!-- slide -->
```javascript
function reverseList(head) {
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

### Template 2: Reverse Sublist Between Two Positions

````carousel
```python
def reverse_between(head, left, right):
    dummy = ListNode(0)
    dummy.next = head
    prev_left = dummy
    
    for _ in range(left - 1):
        prev_left = prev_left.next
    
    current = prev_left.next
    for _ in range(right - left):
        next_node = current.next
        current.next = next_node.next
        next_node.next = prev_left.next
        prev_left.next = next_node
    
    return dummy.next
```

<!-- slide -->
```cpp
ListNode* reverseBetween(ListNode* head, int left, int right) {
    ListNode dummy(0);
    dummy.next = head;
    ListNode* prev_left = &dummy;
    
    for (int i = 0; i < left - 1; i++)
        prev_left = prev_left->next;
    
    ListNode* current = prev_left->next;
    for (int i = 0; i < right - left; i++) {
        ListNode* next_node = current->next;
        current->next = next_node->next;
        next_node->next = prev_left->next;
        prev_left->next = next_node;
    }
    
    return dummy.next;
}
```

<!-- slide -->
```java
public ListNode reverseBetween(ListNode head, int left, int right) {
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
```

<!-- slide -->
```javascript
function reverseBetween(head, left, right) {
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

### Template 3: Reverse Nodes in K-Groups

````carousel
```python
def reverse_k_group(head, k):
    dummy = ListNode(0)
    dummy.next = head
    prev_group_end = dummy
    
    while True:
        # Check if k nodes remain
        count, node = 0, prev_group_end.next
        while node and count < k:
            node = node.next
            count += 1
        if count < k:
            break
        
        # Reverse k nodes
        current = prev_group_end.next
        prev = None
        for _ in range(k):
            next_node = current.next
            current.next = prev
            prev = current
            current = next_node
        
        # Connect reversed group
        group_start = prev_group_end.next
        prev_group_end.next = prev
        group_start.next = current
        prev_group_end = group_start
    
    return dummy.next
```

<!-- slide -->
```cpp
ListNode* reverseKGroup(ListNode* head, int k) {
    ListNode dummy(0);
    dummy.next = head;
    ListNode* prevGroupEnd = &dummy;
    
    while (true) {
        // Check if k nodes remain
        int count = 0;
        ListNode* node = prevGroupEnd->next;
        while (node && count < k) {
            node = node->next;
            count++;
        }
        if (count < k) break;
        
        // Reverse k nodes
        ListNode* current = prevGroupEnd->next;
        ListNode* prev = nullptr;
        for (int i = 0; i < k; i++) {
            ListNode* next_node = current->next;
            current->next = prev;
            prev = current;
            current = next_node;
        }
        
        // Connect reversed group
        ListNode* groupStart = prevGroupEnd->next;
        prevGroupEnd->next = prev;
        groupStart->next = current;
        prevGroupEnd = groupStart;
    }
    
    return dummy.next;
}
```

<!-- slide -->
```java
public ListNode reverseKGroup(ListNode head, int k) {
    ListNode dummy = new ListNode(0);
    dummy.next = head;
    ListNode prevGroupEnd = dummy;
    
    while (true) {
        // Check if k nodes remain
        int count = 0;
        ListNode node = prevGroupEnd.next;
        while (node != null && count < k) {
            node = node.next;
            count++;
        }
        if (count < k) break;
        
        // Reverse k nodes
        ListNode current = prevGroupEnd.next;
        ListNode prev = null;
        for (int i = 0; i < k; i++) {
            ListNode nextNode = current.next;
            current.next = prev;
            prev = current;
            current = nextNode;
        }
        
        // Connect reversed group
        ListNode groupStart = prevGroupEnd.next;
        prevGroupEnd.next = prev;
        groupStart.next = current;
        prevGroupEnd = groupStart;
    }
    
    return dummy.next;
}
```

<!-- slide -->
```javascript
function reverseKGroup(head, k) {
    const dummy = new ListNode(0);
    dummy.next = head;
    let prevGroupEnd = dummy;
    
    while (true) {
        // Check if k nodes remain
        let count = 0;
        let node = prevGroupEnd.next;
        while (node && count < k) {
            node = node.next;
            count++;
        }
        if (count < k) break;
        
        // Reverse k nodes
        let current = prevGroupEnd.next;
        let prev = null;
        for (let i = 0; i < k; i++) {
            const nextNode = current.next;
            current.next = prev;
            prev = current;
            current = nextNode;
        }
        
        // Connect reversed group
        const groupStart = prevGroupEnd.next;
        prevGroupEnd.next = prev;
        groupStart.next = current;
        prevGroupEnd = groupStart;
    }
    
    return dummy.next;
}
```
````

---

## Related Problems

### LeetCode Problems

| Problem | Difficulty | Description |
|---------|------------|-------------|
| **[LeetCode 206: Reverse Linked List](https://leetcode.com/problems/reverse-linked-list/)** | Easy | Reverse the entire singly linked list |
| **[LeetCode 92: Reverse Linked List II](https://leetcode.com/problems/reverse-linked-list-ii/)** | Medium | Reverse nodes between positions left and right |
| **[LeetCode 25: Reverse Nodes in k-Group](https://leetcode.com/problems/reverse-nodes-in-k-group/)** | Hard | Reverse every k consecutive nodes |
| **[LeetCode 234: Palindrome Linked List](https://leetcode.com/problems/palindrome-linked-list/)** | Easy | Check palindrome by reversing the second half |
| **[LeetCode 24: Swap Nodes in Pairs](https://leetcode.com/problems/swap-nodes-in-pairs/)** | Medium | Swap every two adjacent nodes (k-group with k=2) |
| **[LeetCode 143: Reorder List](https://leetcode.com/problems/reorder-list/)** | Medium | Reverse second half and merge alternately |
| **[LeetCode 61: Rotate List](https://leetcode.com/problems/rotate-list/)** | Medium | Rotate the list to the right by k places |
| **[LeetCode 328: Odd Even Linked List](https://leetcode.com/problems/odd-even-linked-list/)** | Medium | Group odd-indexed and even-indexed nodes |
| **[LeetCode 2074: Reverse Nodes in Even Length Groups](https://leetcode.com/problems/reverse-nodes-in-even-length-groups/)** | Medium | Reverse nodes in groups of even length |
| **[LeetCode 2130: Maximum Twin Sum of a Linked List](https://leetcode.com/problems/maximum-twin-sum-of-a-linked-list/)** | Medium | Reverse second half and compute twin sums |

### Related Patterns

- **[Two Pointers - String Reversal](two-pointers-string-reversal.md)** — Similar reversal concept applied to arrays/strings
- **[Design - General/Specific](design-general-specific.md)** — Linked list design problems

---

## Video Tutorial Links

### Fundamentals

- [Reverse Linked List - Iterative AND Recursive (NeetCode)](https://www.youtube.com/watch?v=G0_I-ZF0S38) — Clear explanation of both iterative and recursive approaches
- [Reverse a Linked List (Take U Forward)](https://www.youtube.com/watch?v=iRtLEoL-r-g) — Step-by-step visualization with dry run
- [Reverse Linked List - LeetCode 206 (Kevin Naughton Jr.)](https://www.youtube.com/watch?v=sYd_-pAfbBw) — Concise Java walkthrough

### Advanced Topics

- [Reverse Linked List II - LeetCode 92 (NeetCode)](https://www.youtube.com/watch?v=RF_M9tX4Eag) — Sublist reversal explained
- [Reverse Nodes in k-Group - LeetCode 25 (NeetCode)](https://www.youtube.com/watch?v=1UOPsfP85V4) — Hard problem broken down step by step
- [Palindrome Linked List - LeetCode 234 (NeetCode)](https://www.youtube.com/watch?v=yOzXms1J6Nk) — Combining reversal with two-pointer technique
- [Swap Nodes in Pairs - LeetCode 24 (NeetCode)](https://www.youtube.com/watch?v=o811TZLAWOo) — Special case of k-group reversal

### Practice

- [Linked List Problems Playlist (NeetCode)](https://www.youtube.com/playlist?list=PLot-Xpze53leU0Ec0VkBhnf4npMRFiNcB) — Comprehensive linked list problem set
- [Linked List Interview Questions (Take U Forward)](https://www.youtube.com/playlist?list=PLgUwDviBIf0rAuz8tVcM0AymmhTRsfaLU) — Top interview problems

---

## Follow-up Questions

### Q1: When should I use iterative vs. recursive reversal?

**Answer:** Use **iterative** when O(1) space is required (most interview settings). Use **recursive** when the code clarity matters more than space, or when the problem naturally lends itself to recursion (e.g., reversing nested structures). For very long lists, recursive reversal risks stack overflow.

---

### Q2: How do I reverse a doubly linked list in-place?

**Answer:** For each node, swap its `next` and `prev` pointers:
```python
current = head
while current:
    current.prev, current.next = current.next, current.prev
    head = current  # Track the new head
    current = current.prev  # Move forward (prev is now next)
```

---

### Q3: How do I reverse every other k-group (alternating)?

**Answer:** Add a boolean flag that toggles after each group. When the flag is off, skip the group without reversing:
```python
should_reverse = True
while group_exists:
    if should_reverse:
        reverse_group()
    else:
        skip_group()
    should_reverse = not should_reverse
```

---

### Q4: What if I need to reverse a linked list with a cycle?

**Answer:** You must first detect and break the cycle (using Floyd's cycle detection), then reverse the acyclic list. Reversing a list with an active cycle would cause an infinite loop.

---

### Q5: How do I reverse only the first k nodes of a linked list?

**Answer:** This is a simplified version of the sublist reversal with `left = 1` and `right = k`. Use the iterative approach but stop after k iterations:
```python
prev = None
current = head
for _ in range(k):
    next_node = current.next
    current.next = prev
    prev = current
    current = next_node
head.next = current  # Connect the reversed part to the rest
return prev
```

---

### Q6: Can I reverse a linked list using a stack?

**Answer:** Yes, but it uses O(n) space. Push all nodes onto a stack, then pop them to build the reversed list. This defeats the purpose of in-place reversal but can be useful for understanding the concept:
```python
stack = []
current = head
while current:
    stack.append(current)
    current = current.next
dummy = ListNode(0)
current = dummy
while stack:
    current.next = stack.pop()
    current = current.next
current.next = None
return dummy.next
```

---

### Q7: How does the dummy node technique help in linked list problems?

**Answer:** A dummy node (sentinel node) placed before the head eliminates special-case handling when the head itself might change. For example, in sublist reversal when `left = 1`, the head changes. Without a dummy node, you'd need separate logic for this case. With a dummy node, the algorithm handles all cases uniformly.

---

### Q8: What are common mistakes when implementing in-place reversal?

**Answer:**
1. **Forgetting to save `next`**: Always store `current.next` before overwriting it
2. **Not handling null/single-node lists**: Check for empty or single-node lists upfront
3. **Returning wrong head**: The new head is `prev` (iterative) or the deepest recursive return
4. **Dangling pointers**: In sublist reversal, ensure the boundaries are correctly reconnected
5. **Off-by-one errors**: In position-based problems, carefully count whether positions are 0-indexed or 1-indexed
