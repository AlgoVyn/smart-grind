# Middle of the Linked List

## Problem Description

## Pattern: Fast and Slow Pointers - Middle Node Detection

This problem demonstrates algorithmic problem-solving patterns.

Given the head of a singly linked list, return the **middle node** of the linked list.

If there are **two middle nodes**, return the **second middle node**.

**Link to problem:** [Middle of the Linked List - LeetCode 876](https://leetcode.com/problems/middle-of-the-linked-list/)

---

## Examples

**Example 1:**

| Input | Output |
|-------|--------|
| `head = [1,2,3,4,5]` | `[3,4,5]` |

**Explanation:** The middle node is node 3 (value 3).

**Example 2:**

| Input | Output |
|-------|--------|
| `head = [1,2,3,4,5,6]` | `[4,5,6]` |

**Explanation:** Since the list has two middle nodes (values 3 and 4), we return the second one (value 4).

---

## Constraints

- The number of nodes in the list is in the range `[1, 100]`
- `1 <= Node.val <= 100`

---

## Intuition

The key insight is using two pointers moving at different speeds:
- **Slow pointer**: Moves one step at a time
- **Fast pointer**: Moves two steps at a time

When the fast pointer reaches the end, the slow pointer will be at the middle. This works because:
- For odd-length lists: fast reaches the last node
- For even-length lists: fast becomes null (or reaches last node), and slow is at the second middle

---

## Solution Approaches

## Approach 1: Slow and Fast Pointers (Optimal)

This is the classic "tortoise and hare" technique. By moving the fast pointer twice as fast as the slow pointer, when the fast pointer reaches the end, the slow pointer is exactly at the middle.

#### Algorithm

1. Initialize both slow and fast pointers at the head
2. Move slow by one step and fast by two steps in each iteration
3. Continue until fast reaches the end (fast is null or fast.next is null)
4. Return slow, which points to the middle node

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
    def middleNode(self, head: Optional[ListNode]) -> Optional[ListNode]:
        """
        Find the middle of a linked list using the slow and fast pointer technique.
        
        Time Complexity: O(n) - single pass
        Space Complexity: O(1) - constant extra space
        """
        slow = fast = head
        
        # Move slow by 1 and fast by 2
        # When fast reaches the end, slow is at the middle
        while fast and fast.next:
            slow = slow.next
            fast = fast.next.next
        
        return slow
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
    ListNode* middleNode(ListNode* head) {
        ListNode* slow = head;
        ListNode* fast = head;
        
        // Move slow by 1 and fast by 2
        while (fast && fast->next) {
            slow = slow->next;
            fast = fast->next->next;
        }
        
        return slow;
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
    public ListNode middleNode(ListNode head) {
        ListNode slow = head;
        ListNode fast = head;
        
        // Move slow by 1 and fast by 2
        while (fast != null && fast.next != null) {
            slow = slow.next;
            fast = fast.next.next;
        }
        
        return slow;
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
var middleNode = function(head) {
    let slow = head;
    let fast = head;
    
    // Move slow by 1 and fast by 2
    while (fast && fast.next) {
        slow = slow.next;
        fast = fast.next.next;
    }
    
    return slow;
};
```
````

---

## Approach 2: Count and Traverse

A simpler approach: first count the number of nodes, then traverse to the middle index.

#### Algorithm

1. First pass: count the number of nodes
2. Second pass: traverse to the middle index (n/2)
3. Return the node at that position

#### Code Implementation

````carousel
```python
from typing import Optional

class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

class Solution:
    def middleNode(self, head: Optional[ListNode]) -> Optional[ListNode]:
        # Count the number of nodes
        count = 0
        current = head
        while current:
            count += 1
            current = current.next
        
        # Traverse to the middle
        middle = count // 2
        current = head
        for _ in range(middle):
            current = current.next
        
        return current
```

<!-- slide -->
```cpp
class Solution {
public:
    ListNode* middleNode(ListNode* head) {
        int count = 0;
        ListNode* current = head;
        
        while (current) {
            count++;
            current = current->next;
        }
        
        int middle = count / 2;
        current = head;
        for (int i = 0; i < middle; i++) {
            current = current->next;
        }
        
        return current;
    }
};
```

<!-- slide -->
```java
class Solution {
    public ListNode middleNode(ListNode head) {
        int count = 0;
        ListNode current = head;
        
        while (current != null) {
            count++;
            current = current.next;
        }
        
        int middle = count / 2;
        current = head;
        for (int i = 0; i < middle; i++) {
            current = current.next;
        }
        
        return current;
    }
}
```

<!-- slide -->
```javascript
var middleNode = function(head) {
    let count = 0;
    let current = head;
    
    while (current) {
        count++;
        current = current.next;
    }
    
    const middle = Math.floor(count / 2);
    current = head;
    for (let i = 0; i < middle; i++) {
        current = current.next;
    }
    
    return current;
};
```
````

---

## Approach 3: Array Indexing

Store all nodes in an array, then directly access the middle node by index.

#### Algorithm

1. Traverse the linked list and store each node in an array
2. The middle node is at index `n/2`
3. Return that node

#### Code Implementation

````carousel
```python
from typing import Optional, List

class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

class Solution:
    def middleNode(self, head: Optional[ListNode]) -> Optional[ListNode]:
        nodes = []
        current = head
        
        # Store all nodes in array
        while current:
            nodes.append(current)
            current = current.next
        
        # Return middle node
        return nodes[len(nodes) // 2]
```

<!-- slide -->
```cpp
class Solution {
public:
    ListNode* middleNode(ListNode* head) {
        vector<ListNode*> nodes;
        ListNode* current = head;
        
        while (current) {
            nodes.push_back(current);
            current = current->next;
        }
        
        return nodes[nodes.size() / 2];
    }
};
```

<!-- slide -->
```java
class Solution {
    public ListNode middleNode(ListNode head) {
        ListNode[] nodes = new ListNode[100];
        int count = 0;
        ListNode current = head;
        
        while (current != null) {
            nodes[count++] = current;
            current = current.next;
        }
        
        return nodes[count / 2];
    }
}
```

<!-- slide -->
```javascript
var middleNode = function(head) {
    const nodes = [];
    let current = head;
    
    while (current) {
        nodes.push(current);
        current = current.next;
    }
    
    return nodes[Math.floor(nodes.length / 2)];
};
```
````

---

## Complexity Analysis

| Approach | Time Complexity | Space Complexity |
|----------|-----------------|------------------|
| Slow & Fast Pointers | O(n) | O(1) |
| Count and Traverse | O(n) | O(1) |
| Array Indexing | O(n) | O(n) |

The slow and fast pointer approach is optimal because it achieves O(n) time and O(1) space.

---

## Comparison of Approaches

| Aspect | Two Pointers | Count + Traverse | Array Indexing |
|--------|--------------|------------------|----------------|
| **Time** | O(n) | O(n) | O(n) |
| **Space** | O(1) | O(1) | O(n) |
| **Passes** | 1 | 2 | 1 |
| **Implementation** | Moderate | Simple | Simple |
| **LeetCode Optimal** | ✅ Yes | ❌ No | ❌ No |

---

## Why Two Pointers Works

### Odd Length List (e.g., 1 → 2 → 3 → 4 → 5)

```
Start:  slow=1, fast=1
Step 1: slow=2, fast=3
Step 2: slow=3, fast=5 (last node)
Step 3: fast.next = null, loop exits
Return slow = node 3 ✓
```

### Even Length List (e.g., 1 → 2 → 3 → 4 → 5 → 6)

```
Start:  slow=1, fast=1
Step 1: slow=2, fast=3
Step 2: slow=3, fast=5
Step 3: slow=4, fast=null (fast.next is null)
Loop exits
Return slow = node 4 (second middle) ✓
```

---

## Related Problems

### Same Pattern (Two Pointers)

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Remove Nth Node From End of List | [Link](https://leetcode.com/problems/remove-nth-node-from-end-of-list/) | Find and remove nth node from end |
| Linked List Cycle | [Link](https://leetcode.com/problems/linked-list-cycle/) | Detect if list has a cycle |
| Linked List Cycle II | [Link](https://leetcode.com/problems/linked-list-cycle-ii/) | Find cycle start point |

### Similar Concepts

| Problem | LeetCode Link | Related Technique |
|---------|---------------|-------------------|
| Reorder List | [Link](https://leetcode.com/problems/reorder-list/) | Multiple passes with pointers |
| Rotate List | [Link](https://leetcode.com/problems/rotate-list/) | K-step rotation |
| Swap Nodes in Pairs | [Link](https://leetcode.com/problems/swap-nodes-in-pairs/) | Pointer manipulation |

### Pattern Reference

For more details on linked list manipulation, see:
- **[Linked List - In-Place Reversal Pattern](/patterns/linked-list-in-place-reversal)**
- **[Two Pointers - Fixed Separation Pattern](/patterns/two-pointers-fixed-separation-nth-node-from-end)**

---

## Video Tutorial Links

### Slow and Fast Pointers

- [NeetCode - Middle of Linked List](https://www.youtube.com/watch?v=o6C0L6D4qUE) - Clear visual explanation
- [Back to Back SWE - Middle of Linked List](https://www.youtube.com/watch?v=o4H5ep0kS4M) - Detailed walkthrough

### Linked List Fundamentals

- [Linked List Basics](https://www.youtube.com/watch?v=od-3R9aLhxw) - Understanding linked lists
- [Two Pointer Technique](https://www.youtube.com/watch?v=v3W97W3p4Q8) - General two-pointer patterns

### LeetCode Solutions

- [LeetCode Official Solution](https://www.youtube.com/watch?v=4Q5c9h1V2sI) - Official explanation
- [Blind 75 Solutions](https://www.youtube.com/watch?v=p-9HJH3X4X0) - Interview prep

---

## Follow-up Questions

### Q1: How would you modify the solution to return the first middle node for even-length lists?

**Answer:** Change the loop condition to `while fast.next and fast.next.next` instead of `while fast and fast.next`. This will make fast stop at the second-to-last node for even lists, leaving slow at the first middle node.

---

### Q2: How would you find the middle node if you could only traverse the list once and couldn't use extra space?

**Answer:** This is exactly what the slow-fast pointer approach does! It uses only two pointers and makes a single pass through the list.

---

### Q3: How would you modify the solution to find the node at position k from the middle?

**Answer:** First find the middle using two pointers, then move k steps from that position. Alternatively, use a modified two-pointer approach where the fast pointer is k steps ahead of the slow pointer.

---

### Q4: What if the linked list is stored in an array and you can't modify it?

**Answer:** If the list is represented as an array, you can simply access the element at index `n/2` directly. This is O(1) access time for arrays.

---

### Q5: How would you handle a doubly linked list differently?

**Answer:** For a doubly linked list, you could also traverse from both ends moving toward the middle. This would require maintaining two backward pointers, but wouldn't provide any advantage over the standard approach.

---

### Q6: How would you find the middle node in a circular linked list?

**Answer:** The same two-pointer approach works for circular linked lists as well. However, you need to detect if there's a cycle first. Use the cycle detection algorithm, then apply the middle-finding logic.

---

### Q7: What edge cases should be tested?

**Answer:**
- Empty list (head is null)
- Single node list
- Two-node list
- Odd number of nodes
- Even number of nodes
- Very large list

---

### Q8: How would you find the middle node in a skip list (linked list with express lanes)?

**Answer:** In a skip list, you can use the higher-level pointers to reach near the middle faster. The algorithm would start from the top-most level and descend only when the next node would go past the middle.

---

## Common Pitfalls

### 1. Off-by-One Errors
**Issue:** Incorrect handling of even-length lists (first vs second middle).

**Solution:** Understand that `fast && fast.next` condition gives the second middle, while `fast.next && fast.next.next` gives the first middle.

### 2. Null Pointer Exceptions
**Issue:** Not checking for null pointers before accessing next.

**Solution:** Always check both `fast` and `fast.next` before moving pointers.

### 3. Modifying Original List
**Issue:** Accidentally modifying the linked list while finding the middle.

**Solution:** Only read values, don't modify the list structure.

### 4. Single Node Edge Case
**Issue:** Not handling single-node lists correctly.

**Solution:** The algorithm naturally handles this since slow and fast both start at head.

---

## Summary

The **Middle of the Linked List** problem demonstrates the power of the two-pointer (tortoise and hare) technique:

- **Two Pointers**: Optimal O(n) time and O(1) space
- **Count + Traverse**: Simple but requires two passes
- **Array Indexing**: Easiest but uses O(n) space

The key insight is that by moving the fast pointer twice as fast as the slow pointer, when the fast pointer reaches the end, the slow pointer is exactly at the middle. This elegant solution is frequently used in linked list problems.

### Pattern Summary

This problem exemplifies the **Two Pointers** pattern for linked lists, characterized by:
- Using pointers at different speeds
- Single-pass solutions
- O(1) space complexity
- Handling both odd and even length lists

For more details on linked list patterns, see the **[Linked List - In-Place Reversal Pattern](/patterns/linked-list-in-place-reversal)** and **[Two Pointers - Fixed Separation Pattern](/patterns/two-pointers-fixed-separation-nth-node-from-end)**.

---

## Additional Resources

- [LeetCode Problem Discussion](https://leetcode.com/problems/middle-of-the-linked-list/discuss/) - Community solutions
- [Linked List Basics - GeeksforGeeks](https://www.geeksforgeeks.org/data-structures/linked-list/) - Understanding linked lists
- [Two Pointer Technique - HackerRank](https://www.youtube.com/watch?v=o4H5ep0kS4M) - Video explanation
