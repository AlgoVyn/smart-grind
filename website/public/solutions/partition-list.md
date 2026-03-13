# Partition List

## LeetCode Link

[LeetCode 86 - Partition List](https://leetcode.com/problems/partition-list/)

---

## Problem Description

Given the head of a linked list and a value `x`, partition it such that all nodes less than `x` come before nodes greater than or equal to `x`.

You should preserve the original relative order of the nodes in each of the two partitions.

---

## Examples

### Example 1

**Input:**
```
head = [1,4,3,2,5,2], x = 3
```

**Output:**
```
[1,2,2,4,3,5]
```

**Explanation:**
- Nodes with values < 3: 1, 2, 2 (original order preserved)
- Nodes with values >= 3: 4, 3, 5 (original order preserved)
- Combined: [1,2,2,4,3,5]

### Example 2

**Input:**
```
head = [2,1], x = 2
```

**Output:**
```
[1,2]
```

**Explanation:**
- 1 < 2, so 1 comes first
- 2 >= 2, so 2 comes second

---

## Constraints

- The number of nodes in the list is in the range `[0, 200]`
- `-100 <= Node.val <= 100`
- `-200 <= x <= 200`

---

## Pattern: Two List Separation (Dummy Nodes)

This problem uses **Dummy Nodes** to create two separate lists: one for values < x and one for values >= x, then merge them.

---

## Intuition

The key insight for this problem is creating two separate lists during a single traversal:

### Key Observations

1. **Two-Partition Approach**: Create two lists - one for smaller values, one for larger/equal values

2. **Dummy Nodes**: Use dummy nodes as starting points to simplify edge cases (empty lists, all nodes in one partition)

3. **In-Place Operation**: We rearrange pointers, not node values, maintaining O(1) space

4. **Order Preservation**: Appending to the end of each partition maintains original relative order

5. **Critical Step**: Must terminate the second list before connecting to avoid cycles

### Algorithm Overview

1. **Create two dummy nodes**: before_head and after_head
2. **Single traversal**: Process each node, appending to appropriate list
3. **Terminate after list**: Set after.next = None
4. **Connect lists**: before.next = after_head.next
5. **Return**: before_head.next

---

## Multiple Approaches with Code

We'll cover two approaches:

1. **Two Dummy Nodes** - Standard optimal solution
2. **In-Place Rearrangement** - Alternative approach

---

## Approach 1: Two Dummy Nodes (Optimal)

### Algorithm Steps

1. Create two dummy nodes: before and after
2. Traverse the original list
3. For each node, append to before list if val < x, otherwise to after list
4. Terminate the after list with None
5. Connect before list to after list
6. Return before_head.next

### Why It Works

- Dummy nodes provide stable starting points
- Single pass through the list
- Order is preserved by appending (not prepending)
- Clear separation of concerns

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
    def partition(self, head: Optional[ListNode], x: int) -> Optional[ListNode]:
        # Create dummy nodes for two partitions
        before = ListNode(0)  # For nodes < x
        after = ListNode(0)   # For nodes >= x
        before_head = before
        after_head = after
        
        # Traverse and partition
        while head:
            if head.val < x:
                before.next = head
                before = before.next
            else:
                after.next = head
                after = after.next
            head = head.next
        
        # Important: terminate the after list
        after.next = None
        
        # Connect the two lists
        before.next = after_head.next
        
        return before_head.next
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
    ListNode* partition(ListNode* head, int x) {
        // Create dummy nodes for two partitions
        ListNode* before = new ListNode(0);
        ListNode* after = new ListNode(0);
        ListNode* beforeHead = before;
        ListNode* afterHead = after;
        
        // Traverse and partition
        while (head) {
            if (head->val < x) {
                before->next = head;
                before = before->next;
            } else {
                after->next = head;
                after = after->next;
            }
            head = head->next;
        }
        
        // Important: terminate the after list
        after->next = nullptr;
        
        // Connect the two lists
        before->next = afterHead->next;
        
        return beforeHead->next;
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
    public ListNode partition(ListNode head, int x) {
        // Create dummy nodes for two partitions
        ListNode before = new ListNode(0);
        ListNode after = new ListNode(0);
        ListNode beforeHead = before;
        ListNode afterHead = after;
        
        // Traverse and partition
        while (head != null) {
            if (head.val < x) {
                before.next = head;
                before = before.next;
            } else {
                after.next = head;
                after = after.next;
            }
            head = head.next;
        }
        
        // Important: terminate the after list
        after.next = null;
        
        // Connect the two lists
        before.next = afterHead.next;
        
        return beforeHead.next;
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
 * @param {number} x
 * @return {ListNode}
 */
var partition = function(head, x) {
    // Create dummy nodes for two partitions
    const before = new ListNode(0);
    const after = new ListNode(0);
    let beforeHead = before;
    let afterHead = after;
    
    // Traverse and partition
    while (head) {
        if (head.val < x) {
            before.next = head;
            before = before.next;
        } else {
            after.next = head;
            after = after.next;
        }
        head = head.next;
    }
    
    // Important: terminate the after list
    after.next = null;
    
    // Connect the two lists
    before.next = afterHead.next;
    
    return beforeHead.next;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) — single pass through the list |
| **Space** | O(1) — only dummy nodes, no extra arrays |

---

## Approach 2: In-Place Rearrangement (Alternative)

### Algorithm Steps

1. Find the first node >= x to use as partition point
2. Insert subsequent nodes < x before this partition point

### Why It Works

This approach modifies pointers in-place without creating new lists. More complex but shows understanding of pointer manipulation.

### Code Implementation

````carousel
```python
from typing import Optional

class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

class Solution:
    def partition(self, head: Optional[ListNode], x: int) -> Optional[ListNode]:
        if not head:
            return head
        
        # Find first node >= x
        prev = head
        curr = head.next
        partition_node = None
        partition_prev = None
        
        while curr:
            if curr.val >= x and partition_node is None:
                partition_node = curr
                partition_prev = prev
            prev = curr
            curr = curr.next
        
        # No partition needed
        if partition_node is None:
            return head
        
        # Insert nodes < x before partition_node
        curr = head
        prev = None
        
        while curr != partition_node:
            if curr.val < x:
                # Remove from current position
                if prev:
                    prev.next = curr.next
                # Insert before partition_node
                curr.next = partition_node
                partition_prev.next = curr
                # Update partition_prev
                if prev:
                    partition_prev = curr
                else:
                    head = curr
                    break
                curr = prev.next if prev else head
            else:
                prev = curr
                curr = curr.next
        
        return head
```

<!-- slide -->
```cpp
class Solution {
public:
    ListNode* partition(ListNode* head, int x) {
        if (!head) return head;
        
        ListNode* dummy = new ListNode(0, head);
        ListNode* prev = dummy;
        ListNode* curr = head;
        
        // Find the first node >= x
        while (curr && curr->val < x) {
            prev = curr;
            curr = curr->next;
        }
        
        // Process nodes before partition point
        while (curr) {
            while (curr && curr->val < x) {
                // Move node to front
                prev->next = curr->next;
                curr->next = dummy->next;
                dummy->next = curr;
                curr = prev->next;
            }
            if (!curr) break;
            prev = curr;
            curr = curr->next;
        }
        
        return dummy->next;
    }
};
```

<!-- slide -->
```java
class Solution {
    public ListNode partition(ListNode head, int x) {
        if (head == null) return head;
        
        ListNode dummy = new ListNode(0, head);
        ListNode prev = dummy;
        ListNode curr = head;
        
        // Find the first node >= x
        while (curr != null && curr.val < x) {
            prev = curr;
            curr = curr.next;
        }
        
        // Process nodes
        while (curr != null) {
            while (curr != null && curr.val < x) {
                prev.next = curr.next;
                curr.next = dummy.next;
                dummy.next = curr;
                curr = prev.next;
            }
            if (curr == null) break;
            prev = curr;
            curr = curr.next;
        }
        
        return dummy.next;
    }
}
```

<!-- slide -->
```javascript
var partition = function(head, x) {
    if (!head) return head;
    
    const dummy = { val: 0, next: head };
    let prev = dummy;
    let curr = head;
    
    // Find first node >= x
    while (curr && curr.val < x) {
        prev = curr;
        curr = curr.next;
    }
    
    // Process remaining nodes
    while (curr) {
        while (curr && curr.val < x) {
            prev.next = curr.next;
            curr.next = dummy.next;
            dummy.next = curr;
            curr = prev.next;
        }
        if (!curr) break;
        prev = curr;
        curr = curr.next;
    }
    
    return dummy.next;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) — may traverse multiple times |
| **Space** | O(1) — no extra space |

---

## Comparison of Approaches

| Aspect | Two Dummy Nodes | In-Place Rearrangement |
|--------|-----------------|------------------------|
| **Time Complexity** | O(n) | O(n) |
| **Space Complexity** | O(1) | O(1) |
| **Implementation** | Simple | Complex |
| **Readability** | Clear | Less clear |

**Best Approach:** Use Approach 1 (Two Dummy Nodes) for simplicity and clarity.

---

## Why This Problem is Important

### Interview Relevance

- **Frequency**: Commonly asked in technical interviews
- **Companies**: Facebook, Microsoft, Amazon
- **Difficulty**: Easy/Medium
- **Concepts Tested**: Linked list manipulation, dummy nodes, two-pointer technique

### Learning Outcomes

1. **Dummy Node Pattern**: Learn to use dummy nodes for stable list operations
2. **Pointer Manipulation**: Master pointer rearrangements
3. **Order Preservation**: Understand how to maintain relative order

---

## Related Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Sort List | [Link](https://leetcode.com/problems/sort-list/) | Linked list sorting |
| Reorder List | [Link](https://leetcode.com/problems/reorder-list/) | List rearrangement |
| Merge Two Sorted Lists | [Link](https://leetcode.com/problems/merge-two-sorted-lists/) | List merging |

### Pattern Reference

For more details on linked list patterns, see:
- **[Linked List Intersection](/patterns/linked-list-intersection-detection)**

---

## Video Tutorial Links

1. **[NeetCode - Partition List](https://www.youtube.com/watch?v=KT1iU2J4V3Q)** - Clear explanation
2. **[Linked List Tutorial](https://www.youtube.com/watch?v=H0jRfb5alPM)** - Understanding linked lists

---

## Follow-up Questions

### Q1: How would you modify the solution to partition by a range instead of a single value?

**Answer:** Modify the condition to check if val is in range [x1, x2]. The same two-list approach works with modified conditions.

---

### Q2: What if you needed to do this in-place without extra space (no dummy nodes)?

**Answer:** Use the in-place rearrangement approach (Approach 2) which modifies pointers without creating new nodes.

---

### Q3: How would you handle stable partitioning for stable sort algorithms?

**Answer:** The current solution is stable - relative order is preserved within each partition. This is achieved by appending (not prepending) to each list.

---

### Q4: Can you solve this using recursion?

**Answer:** Not recommended for this problem as it would require O(n) stack space. Iterative solution is preferred.

---

## Common Pitfalls

### 1. Null Termination
**Issue**: Must set after.next = None before connecting lists to avoid cycles.

**Solution**: Always terminate the after list explicitly.

### 2. Order Preservation
**Issue**: Appending to lists maintains original relative order.

**Solution**: Use append (not prepend) to maintain order.

### 3. Edge Cases
**Issue**: Empty list or all values >= x or < x work correctly with dummy nodes.

**Solution**: Dummy nodes handle all edge cases gracefully.

---

## Summary

The **Partition List** problem demonstrates the power of the dummy node pattern:

- **Two-Partition Strategy**: Separate nodes into less-than and greater-or-equal groups
- **Dummy Nodes**: Provide stable starting points for both partitions
- **Single Pass**: O(n) time complexity with O(1) space
- **Order Preservation**: Maintains relative order within each partition

Key takeaways:
1. Use dummy nodes for clean list manipulation
2. Terminate the second list to avoid cycles
3. Append (not prepend) to maintain order
4. Single pass through the list

This problem is excellent for learning linked list manipulation techniques.

### Pattern Summary

This problem exemplifies the **Dummy Node** pattern, characterized by:
- Creating dummy nodes for stable operations
- Single traversal partitioning
- O(1) space complexity
- Order preservation

---

## Additional Resources

- [LeetCode 86 - Partition List](https://leetcode.com/problems/partition-list/) - Official problem page
- [Linked List - GeeksforGeeks](https://www.geeksforgeeks.org/data-structures/linked-list/) - Linked list basics
- [Pattern: Linked List](/patterns/linked-list-intersection-detection) - Related pattern
