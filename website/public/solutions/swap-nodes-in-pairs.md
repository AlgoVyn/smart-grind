# Swap Nodes in Pairs

## Problem Description

Given a linked list, swap every two adjacent nodes and return its head. You must solve the problem without modifying the values in the list's nodes (i.e., only nodes themselves may be changed).

---

## Examples

### Example 1

**Input:** `head = [1,2,3,4]`  
**Output:** `[2,1,4,3]`

### Example 2

**Input:** `head = []`  
**Output:** `[]`

### Example 3

**Input:** `head = [1]`  
**Output:** `[1]`

### Example 4

**Input:** `head = [1,2,3]`  
**Output:** `[2,1,3]`

---

## Constraints

- The number of nodes in the list is in the range `[0, 100]`.
- `0 <= Node.val <= 100`

---

## LeetCode Link

[LeetCode Problem 24: Swap Nodes in Pairs](https://leetcode.com/problems/swap-nodes-in-pairs/)

---

## Pattern: Linked List In-Place Manipulation

This problem follows the **Linked List In-Place Manipulation** pattern.

### Core Concept

- **Dummy Node**: Simplifies edge cases (empty list, single node, first pair)
- **Pointer Tracking**: Track three nodes: prev, first, second
- **In-Place**: Only rearrange pointers, not values
- **Pattern**: prev -> second -> first -> next pair

### When to Use This Pattern

This pattern is applicable when:
1. Swapping nodes in linked list without changing values
2. Reordering linked list structure
3. Pair-wise linked list operations

### Alternative Patterns

| Pattern | Description |
|---------|-------------|
| Recursive | Use recursion to swap pairs |
| Value Swap | Simply swap values (not allowed here) |

---

## Intuition

The key insight for swapping nodes in pairs is using **pointer manipulation** rather than value swapping:

> We need to rearrange the pointers so that each pair of adjacent nodes is swapped, without touching the values.

### Key Observations

1. **Dummy Node**: Using a dummy node simplifies edge cases (empty list, single node, first pair swap)

2. **Pointer Tracking**: We need to track three nodes: the node before the pair, the first node, and the second node

3. **In-Place**: We only rearrange pointers, not values - this is crucial for the problem requirements

4. **Pattern**: The swap pattern is consistent: prev -> second -> first -> next pair

### Why It Works

The algorithm works because:
1. We maintain references to all necessary nodes before making changes
2. We update pointers in the correct order to avoid losing references
3. After each pair swap, we move to the next pair using the updated pointers

---

## Multiple Approaches with Code

We'll cover two approaches:
1. **Iterative with Dummy Node** - Optimal solution
2. **Recursive** - Alternative approach

---

## Approach 1: Iterative with Dummy Node (Optimal)

### Algorithm Steps

1. Create a dummy node pointing to the head
2. Maintain a `prev` pointer starting at dummy
3. While there are at least two nodes ahead:
   - Get the first and second nodes
   - Swap: prev.next = second, first.next = second.next, second.next = first
   - Move prev to first (now the second node of the swapped pair)
4. Return dummy.next

### Why It Works

The dummy node simplifies the algorithm by providing a stable starting point. We always swap pairs relative to the previous node, making edge cases (like swapping the first pair) easy to handle.

### Code Implementation

````carousel
```python
from typing import Optional

# Definition for singly-linked list.
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next


class Solution:
    def swapPairs(self, head: Optional[ListNode]) -> Optional[ListNode]:
        """
        Swap every two adjacent nodes in a linked list.
        
        Args:
            head: Head of the linked list
            
        Returns:
            Head of the modified linked list
        """
        # Dummy node simplifies edge cases
        dummy = ListNode(0)
        dummy.next = head
        prev = dummy
        
        # While there are at least two nodes to swap
        while prev.next and prev.next.next:
            # Get the two nodes to swap
            first = prev.next
            second = first.next
            
            # Perform the swap
            prev.next = second
            first.next = second.next
            second.next = first
            
            # Move prev to the end of the swapped pair
            prev = first
        
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
    ListNode* swapPairs(ListNode* head) {
        // Dummy node simplifies edge cases
        ListNode* dummy = new ListNode(0);
        dummy->next = head;
        ListNode* prev = dummy;
        
        // While there are at least two nodes to swap
        while (prev->next && prev->next->next) {
            // Get the two nodes to swap
            ListNode* first = prev->next;
            ListNode* second = first->next;
            
            // Perform the swap
            prev->next = second;
            first->next = second->next;
            second->next = first;
            
            // Move prev to the end of the swapped pair
            prev = first;
        }
        
        ListNode* result = dummy->next;
        delete dummy;
        return result;
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
    public ListNode swapPairs(ListNode head) {
        // Dummy node simplifies edge cases
        ListNode dummy = new ListNode(0);
        dummy.next = head;
        ListNode prev = dummy;
        
        // While there are at least two nodes to swap
        while (prev.next != null && prev.next.next != null) {
            // Get the two nodes to swap
            ListNode first = prev.next;
            ListNode second = first.next;
            
            // Perform the swap
            prev.next = second;
            first.next = second.next;
            second.next = first;
            
            // Move prev to the end of the swapped pair
            prev = first;
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
 * @return {ListNode}
 */
var swapPairs = function(head) {
    // Dummy node simplifies edge cases
    const dummy = new ListNode(0);
    dummy.next = head;
    let prev = dummy;
    
    // While there are at least two nodes to swap
    while (prev.next && prev.next.next) {
        // Get the two nodes to swap
        const first = prev.next;
        const second = first.next;
        
        // Perform the swap
        prev.next = second;
        first.next = second.next;
        second.next = first;
        
        // Move prev to the end of the swapped pair
        prev = first;
    }
    
    return dummy.next;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) - Traverse the list once |
| **Space** | O(1) - Constant extra space |

---

## Approach 2: Recursive

### Algorithm Steps

1. Base case: if head is null or head.next is null, return head
2. Recursively swap the rest of the list starting from head.next.next
3. Rearrange pointers: set head.next to the result of recursion
4. Swap head and head.next
5. return the new head

### Why It Works

The recursive approach naturally processes pairs. After recursively handling the rest of the list, we just need to swap the current pair and return the new head.

### Code Implementation

````carousel
```python
from typing import Optional

class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next


class Solution:
    def swapPairs(self, head: Optional[ListNode]) -> Optional[ListNode]:
        """
        Swap pairs recursively.
        """
        # Base case: no node or single node
        if not head or not head.next:
            return head
        
        # Recursively swap the rest
        new_head = self.swapPairs(head.next.next)
        
        # Swap current pair
        first = head
        second = head.next
        
        second.next = first
        first.next = new_head
        
        return second
```

<!-- slide -->
```cpp
class Solution {
public:
    ListNode* swapPairs(ListNode* head) {
        // Base case: no node or single node
        if (!head || !head->next) return head;
        
        // Recursively swap the rest
        ListNode* newHead = swapPairs(head->next->next);
        
        // Swap current pair
        ListNode* second = head->next;
        second->next = head;
        head->next = newHead;
        
        return second;
    }
};
```

<!-- slide -->
```java
class Solution {
    public ListNode swapPairs(ListNode head) {
        // Base case: no node or single node
        if (head == null || head.next == null) return head;
        
        // Recursively swap the rest
        ListNode newHead = swapPairs(head.next.next);
        
        // Swap current pair
        ListNode second = head.next;
        second.next = head;
        head.next = newHead;
        
        return second;
    }
}
```

<!-- slide -->
```javascript
var swapPairs = function(head) {
    // Base case: no node or single node
    if (!head || !head.next) return head;
    
    // Recursively swap the rest
    const newHead = swapPairs(head.next.next);
    
    // Swap current pair
    const second = head.next;
    second.next = head;
    head.next = newHead;
    
    return second;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) - Visit each node once |
| **Space** | O(n) - Recursion stack |

---

## Comparison of Approaches

| Aspect | Iterative | Recursive |
|--------|-----------|-----------|
| **Time Complexity** | O(n) | O(n) |
| **Space Complexity** | O(1) | O(n) |
| **Implementation** | Moderate | Simple |
| **LeetCode Optimal** | ✅ | ✅ |

**Best Approach:** Use the iterative approach for O(1) space complexity.

---

## Why This Problem is Important

### Interview Relevance

- **Frequency**: Commonly asked in technical interviews
- **Companies**: Microsoft, Amazon, Apple
- **Difficulty**: Medium
- **Concepts Tested**: Linked List Manipulation, Pointers, In-Place Operations

### Learning Outcomes

1. **Pointer Manipulation**: Master handling linked list pointers
2. **Edge Cases**: Learn to handle empty lists and odd-length lists
3. **In-Place Operations**: Understand modifying structure without changing values

---

## Related Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Reverse Linked List | [Link](https://leetcode.com/problems/reverse-linked-list/) | Basic list reversal |
| Reverse Nodes in K-Group | [Link](https://leetcode.com/problems/reverse-nodes-in-k-group/) | Swap in groups of k |
| Odd Even Linked List | [Link](https://leetcode.com/problems/odd-even-linked-list/) | Reorder list |

### Pattern Reference

For more detailed explanations of the Linked List pattern, see:
- **[Linked List Pattern](/patterns/linked-list-addition-of-numbers)**

---

## Video Tutorial Links

Here are helpful YouTube tutorials explaining the problem and solutions:

1. **[NeetCode - Swap Nodes in Pairs](https://www.youtube.com/watch?v=o1E-S2fnnCw)** - Clear explanation with visual examples
2. **[Swap Nodes in Pairs - LeetCode 24](https://www.youtube.com/watch?v=o1E-S2fnnCw)** - Detailed walkthrough
3. **[Linked List Tutorial](https://www.youtube.com/watch?v=HChr0pFdNzo)** - Understanding linked lists

---

## Follow-up Questions

### Q1: How would you modify the solution to swap nodes in groups of k?

**Answer:** You would extend the logic to handle groups of k nodes. This is the "Reverse Nodes in K-Group" problem. You'd need to check if k nodes are available, then apply a similar reversal pattern.

---

### Q2: What if you needed to swap every two nodes starting from the second node?

**Answer:** You could either modify the starting position of the dummy or handle an initial skip before entering the swap loop.

---

### Q3: Can you solve this without a dummy node?

**Answer:** Yes, you can handle the first pair separately and then use the same logic for subsequent pairs. The dummy node simply makes the code cleaner.

---

### Q4: How would you handle the case where you need to swap values instead of nodes?

**Answer:** This would be much simpler - you would just swap the `val` fields of the two nodes. However, the problem specifically requires swapping nodes, not values.

---

## Common Pitfalls

### 1. Losing Reference
**Issue**: Losing reference to next nodes during swap.

**Solution**: Store pointers to all three nodes (prev, first, second) before making changes.

### 2. Wrong Order
**Issue**: Wrong order of pointer updates causing cycles.

**Solution**: Update in correct sequence: prev->next->next->next.

### 3. Not Handling Odd Length
**Issue**: Last node not processed correctly.

**Solution**: Check if node and node.next exist before attempting swap.

### 4. Off-by-One in Loop
**Issue**: Loop condition wrong, skipping last pair or causing errors.

**Solution**: Ensure both prev.next and prev.next.next are not null.

---

## Summary

The **Swap Nodes in Pairs** problem demonstrates the **Linked List In-Place Manipulation** pattern.

### Key Takeaways

1. **Dummy Node**: Simplifies edge cases
2. **Pointer Tracking**: Maintain prev, first, second pointers
3. **Correct Order**: Update pointers in the right sequence
4. **In-Place**: Only modify pointers, not values

### Pattern Summary

This problem exemplifies the **Linked List Manipulation** pattern, characterized by:
- In-place node modifications
- Pointer manipulation
- Handling edge cases with dummy nodes

For more details on this pattern, see the **[Linked List Pattern](/patterns/linked-list-addition-of-numbers)**.

---

## Additional Resources

- [LeetCode Problem 24](https://leetcode.com/problems/swap-nodes-in-pairs/) - Official problem page
- [Linked List - GeeksforGeeks](https://www.geeksforgeeks.org/linked-list/) - Detailed linked list explanation
- [Pattern: Linked List](/patterns/linked-list-addition-of-numbers) - Comprehensive pattern guide
