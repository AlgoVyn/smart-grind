# Reverse Linked List II

## Problem Description

Given the head of a singly linked list and two integers `left` and `right` where `left <= right`, reverse the nodes of the list from position `left` to position `right`, and return the reversed list.

**LeetCode Link:** [LeetCode 92 - Reverse Linked List II](https://leetcode.com/problems/reverse-linked-list-ii/)

---

## Examples

### Example 1

**Input:**
```python
head = [1, 2, 3, 4, 5]
left = 2
right = 4
```

**Output:**
```python
[1, 4, 3, 2, 5]
```

**Explanation:**
Reverse nodes 2 through 4: [2->3->4] becomes [4->3->2]

### Example 2

**Input:**
```python
head = [5]
left = 1
right = 1
```

**Output:**
```python
[5]
```

**Explanation:**
Single node remains unchanged.

---

## Constraints

- The number of nodes in the list is `n`.
- `1 <= n <= 500`
- `-500 <= Node.val <= 500`
- `1 <= left <= right <= n`

**Follow-up:** Could you do it in one pass?

---

## Pattern: Linked List Partial Reversal

This problem uses **In-place Linked List Manipulation**. Use dummy node, move to left position, then reverse by inserting nodes after prev.

---

## Intuition

The key insight for this problem is understanding how to **reverse a subsegment** of a linked list in place:

> We need to reverse only a portion of the list while keeping the rest unchanged.

### Key Observations

1. **Dummy Node**: Use a dummy node before the head to simplify edge cases when `left = 1`.

2. **Two Steps**:
   - Step 1: Navigate to the node before the reversal point
   - Step 2: Reverse the segment by "moving" nodes

3. **In-place Reversal**: We don't create new nodes; we just rearrange the `next` pointers.

4. **Insertion Technique**: Instead of traditional reversal, we can insert each node right after the `prev` node.

### Algorithm Overview

1. **Create dummy node**: Point to head to handle `left = 1` case
2. **Move prev**: Traverse to node before reversal point
3. **Reverse segment**: For each of (right-left) nodes, move it after prev
4. **Return**: Head is at dummy.next

---

## Multiple Approaches with Code

We'll cover two approaches:

1. **Insertion-based** - Standard optimal solution
2. **Traditional Reversal** - Alternative approach

---

## Approach 1: Insertion-based (Optimal)

### Algorithm Steps

1. Create dummy node pointing to head
2. Move prev to node before left position
3. For each iteration (right-left times):
   - Save next node
   - Move current after prev
4. Return dummy.next

### Why It Works

This approach "moves" nodes from their current position to right after prev, effectively reversing the segment.

### Code Implementation

````carousel
```python
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next


class Solution:
    def reverseBetween(self, head: ListNode, left: int, right: int) -> ListNode:
        """
        Reverse a portion of linked list from position left to right.
        
        Args:
            head: Head of linked list
            left: Starting position (1-indexed)
            right: Ending position (1-indexed)
            
        Returns:
            Head of modified linked list
        """
        if not head or left == right:
            return head
        
        # Create dummy node to handle edge case when left = 1
        dummy = ListNode(0, head)
        prev = dummy
        
        # Move prev to node before left position
        for _ in range(left - 1):
            prev = prev.next
        
        current = prev.next
        
        # Reverse the segment by inserting nodes after prev
        for _ in range(right - left):
            # Save next node
            temp = current.next
            current.next = temp.next
            
            # Insert temp after prev
            temp.next = prev.next
            prev.next = temp
        
        return dummy.next
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
    ListNode* reverseBetween(ListNode* head, int left, int right) {
        if (!head || left == right) return head;
        
        // Create dummy node
        ListNode* dummy = new ListNode(0, head);
        ListNode* prev = dummy;
        
        // Move prev to node before left position
        for (int i = 0; i < left - 1; i++) {
            prev = prev->next;
        }
        
        ListNode* current = prev->next;
        
        // Reverse the segment
        for (int i = 0; i < right - left; i++) {
            ListNode* temp = current->next;
            current->next = temp->next;
            temp->next = prev->next;
            prev->next = temp;
        }
        
        return dummy->next;
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
    public ListNode reverseBetween(ListNode head, int left, int right) {
        if (head == null || left == right) return head;
        
        // Create dummy node
        ListNode dummy = new ListNode(0, head);
        ListNode prev = dummy;
        
        // Move prev to node before left position
        for (int i = 0; i < left - 1; i++) {
            prev = prev.next;
        }
        
        ListNode current = prev.next;
        
        // Reverse the segment
        for (int i = 0; i < right - left; i++) {
            ListNode temp = current.next;
            current.next = temp.next;
            temp.next = prev.next;
            prev.next = temp;
        }
        
        return dummy.next;
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
 * @param {number} left
 * @param {number} right
 * @return {ListNode}
 */
var reverseBetween = function(head, left, right) {
    if (!head || left === right) return head;
    
    // Create dummy node
    const dummy = new ListNode(0, head);
    let prev = dummy;
    
    // Move prev to node before left position
    for (let i = 0; i < left - 1; i++) {
        prev = prev.next;
    }
    
    let current = prev.next;
    
    // Reverse the segment
    for (let i = 0; i < right - left; i++) {
        const temp = current.next;
        current.next = temp.next;
        temp.next = prev.next;
        prev.next = temp;
    }
    
    return dummy.next;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) - single pass for most cases |
| **Space** | O(1) - constant extra space |

---

## Approach 2: Traditional Reversal

### Algorithm Steps

1. Create dummy and get to start position
2. Reverse the segment traditionally (swap next pointers)
3. Reconnect the ends

### Why It Works

Same concept as reversing entire list, applied to a segment.

### Code Implementation

````carousel
```python
class Solution:
    def reverseBetween(self, head: ListNode, left: int, right: int) -> ListNode:
        if not head or left == right:
            return head
        
        dummy = ListNode(0, head)
        prev = dummy
        
        # Move to node before left
        for _ in range(left - 1):
            prev = prev.next
        
        # Start reversing
        current = prev.next
        reverse_prev = None
        
        # Reverse the segment
        for _ in range(right - left + 1):
            next_node = current.next
            current.next = reverse_prev
            reverse_prev = current
            current = next_node
        
        # Reconnect: prev points to new head of reversed segment
        prev.next.next = current  # old head now points beyond reversed segment
        prev.next = reverse_prev   # connect to new head
        
        return dummy.next
```

<!-- slide -->
```cpp
// Similar approach in C++
```

<!-- slide -->
```java
// Similar approach in Java
```

<!-- slide -->
```javascript
// Similar approach in JavaScript
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) |
| **Space** | O(1) |

---

## Comparison of Approaches

| Aspect | Insertion-based | Traditional Reversal |
|--------|-----------------|---------------------|
| **Time Complexity** | O(n) | O(n) |
| **Space Complexity** | O(1) | O(1) |
| **Implementation** | Simpler | More complex |

**Best Approach:** Insertion-based is simpler and more commonly used.

---

## Why This Problem is Important

### Interview Relevance

- **Frequency**: Commonly asked in technical interviews
- **Companies**: Google, Meta, Amazon, Microsoft
- **Difficulty**: Medium
- **Concepts Tested**: Linked List Manipulation, In-place Operations

### Learning Outcomes

1. **Linked List Manipulation**: Master pointer manipulation
2. **Edge Case Handling**: Learn to use dummy nodes
3. **Partial Reversal**: Understand reversing segments vs entire list

---

## Related Problems

Based on similar themes (Linked List):

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Reverse Linked List | [Link](https://leetcode.com/problems/reverse-linked-list/) | Reverse entire list |
| Reverse Linked List Recursive | [Link](https://leetcode.com/problems/reverse-linked-list-recursive/) | Recursive reversal |
| Palindrome Linked List | [Link](https://leetcode.com/problems/palindrome-linked-list/) | Check palindrome |

### Pattern Reference

For more details on Linked List problems, see:
- **[Linked List Pattern](/patterns/linked-list)**

---

## Video Tutorial Links

Here are helpful YouTube tutorials explaining the problem and solutions:

### Recommended Tutorials

1. **[NeetCode - Reverse Linked List II](https://www.youtube.com/watch?v=example)** - Clear explanation
2. **[Linked List Reversal](https://www.youtube.com/watch?v=example)** - Understanding reversal
3. **[LeetCode 92 Solution](https://www.youtube.com/watch?v=example)** - Full solution

---

## Follow-up Questions

### Q1: How would you do this recursively?

**Answer:** Use recursion to reach the left position, then reverse recursively, then reconnect.

---

### Q2: What if left and right could be equal to 1?

**Answer:** The solution already handles this with the dummy node approach.

---

### Q3: How would you modify for a doubly linked list?

**Answer:** Update both next and prev pointers during reversal.

---

## Common Pitfalls

### 1. Dummy Node
**Issue**: Not using dummy node causes issues when left = 1.

**Solution**: Always use dummy = ListNode(0, head).

### 2. Range
**Issue**: Wrong number of reversals.

**Solution**: Loop from left to right-1, i.e., (right-left) iterations.

### 3. One-based Indexing
**Issue**: Forgetting to adjust for 1-indexed positions.

**Solution**: Move prev by left-1 steps to get to correct position.

---

## Summary

The **Reverse Linked List II** problem demonstrates in-place linked list manipulation.

Key takeaways:
1. Use dummy node for edge cases
2. Move prev to position before reversal
3. Insert nodes after prev to reverse segment
4. O(n) time, O(1) space

This problem is essential for understanding partial linked list reversal.

### Pattern Summary

This problem exemplifies the **Linked List Partial Reversal** pattern, characterized by:
- Using dummy node
- Partial segment reversal
- In-place pointer manipulation

For more details on this pattern, see the **[Linked List Pattern](/patterns/linked-list)**.

---

## Additional Resources

- [LeetCode Problem 92](https://leetcode.com/problems/reverse-linked-list-ii/) - Official problem page
- [Linked List - GeeksforGeeks](https://www.geeksforgeeks.org/data-structures/linked-list/) - Detailed explanation
- [Pattern: Linked List](/patterns/linked-list) - Comprehensive pattern guide
