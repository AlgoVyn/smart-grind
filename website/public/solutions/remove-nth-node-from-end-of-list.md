# Remove Nth Node From End of List

## Problem Statement

Given the head of a linked list and an integer `n`, remove the `n`th node from the end of the list and return its head.

The nth node from the end is the (length - n + 1)th node from the beginning, where length is the total number of nodes in the list.

**Link to problem:** [Remove Nth Node From End of List](https://leetcode.com/problems/remove-nth-node-from-end-of-list/)

**Constraints:**
- The number of nodes in the list is in the range `[1, 30]`
- `1 <= n <= length of the linked list`
- `1 <= Node.val <= 10^4`

---

## Examples

### Example 1

**Input:**
```
head = [1,2,3,4,5], n = 2
```

**Output:**
```
[1,2,3,5]
```

**Explanation:** The linked list has 5 nodes. Removing the 2nd node from the end (value 4) results in [1,2,3,5].

---

### Example 2

**Input:**
```
head = [1], n = 1
```

**Output:**
```
[]
```

**Explanation:** Removing the only node results in an empty list.

---

### Example 3

**Input:**
```
head = [1,2], n = 1
```

**Output:**
```
[1]
```

**Explanation:** Removing the last node (value 2) leaves only [1].

---

### Example 4

**Input:**
```
head = [1,2,3], n = 3
```

**Output:**
```
[2,3]
```

**Explanation:** Removing the 3rd node from the end (which is the head, value 1) leaves [2,3].

---

## Intuition

The key challenge is removing a node from the end of a linked list without knowing the length upfront. Several approaches can solve this problem:

### Approach 1: Two Pointers (Optimal)

The most elegant solution uses the **two-pointer technique** with a dummy head:

1. **Create a Dummy Node:** Add a dummy node before the head to simplify edge cases (like removing the head itself)
2. **Initialize Two Pointers:** Both `fast` and `slow` start at the dummy node
3. **Move Fast Pointer:** Advance `fast` by `n + 1` steps to create a gap of `n` nodes between `slow` and `fast`
4. **Move Both Pointers:** Advance both `slow` and `fast` together until `fast` reaches the last node
5. **Remove Node:** `slow.next` is the node to remove; bypass it with `slow.next = slow.next.next`

**Why n + 1 steps for fast?**

By moving `fast` `n + 1` steps ahead, when `fast` reaches the end, `slow` will be positioned exactly before the node to remove. This allows us to easily bypass and remove the target node.

### Approach 2: Calculate Length First

A more straightforward approach:

1. **Count Length:** Traverse the list to find its length `L`
2. **Calculate Target Index:** The node to remove is at index `L - n` (0-indexed from head)
3. **Remove Node:** Traverse to the node before the target and bypass it

### Approach 3: Recursive (Stack-based)

Use the call stack to implicitly store nodes:

1. **Recursive Traversal:** Recursively traverse to the end of the list
2. **Count Backwards:** Increment a counter as the recursion unwinds
3. **Remove Node:** When counter equals `n`, remove the current node

---

## Multiple Approaches with Code

We'll cover three approaches:

1. **Two Pointers with Dummy Head** - Optimal O(n) time, O(1) space
2. **Calculate Length First** - O(n) time, O(1) space
3. **Recursive with Stack** - O(n) time, O(n) space (call stack)

---

## Approach 1: Two Pointers with Dummy Head

This is the optimal approach that uses two pointers to find and remove the nth node from the end in a single pass.

#### Algorithm Steps

1. Create a dummy node pointing to the head
2. Initialize both `fast` and `slow` pointers to the dummy node
3. Move `fast` pointer `n + 1` steps forward
4. Move both pointers together until `fast` reaches the last node
5. Remove the node by setting `slow.next = slow.next.next`
6. Return dummy.next as the new head

#### Code Implementation

````carousel
```python
# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, val=0, next=None):
#         self.val = val
#         self.next = next

class Solution:
    def removeNthFromEnd(self, head: Optional[ListNode], n: int) -> Optional[ListNode]:
        # Create dummy node to handle edge cases (like removing head)
        dummy = ListNode(0)
        dummy.next = head
        
        fast = dummy
        slow = dummy
        
        # Move fast n+1 steps ahead to create n-node gap
        for _ in range(n + 1):
            fast = fast.next
        
        # Move both pointers until fast reaches the end
        while fast:
            slow = slow.next
            fast = fast.next
        
        # Remove the nth node from end
        slow.next = slow.next.next
        
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
    ListNode* removeNthFromEnd(ListNode* head, int n) {
        // Create dummy node to handle edge cases
        ListNode* dummy = new ListNode(0);
        dummy->next = head;
        
        ListNode* fast = dummy;
        ListNode* slow = dummy;
        
        // Move fast n+1 steps ahead
        for (int i = 0; i <= n; i++) {
            fast = fast->next;
        }
        
        // Move both pointers together
        while (fast) {
            slow = slow->next;
            fast = fast->next;
        }
        
        // Remove the nth node from end
        ListNode* toDelete = slow->next;
        slow->next = slow->next->next;
        delete toDelete;
        
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
public class Solution {
    public ListNode removeNthFromEnd(ListNode head, int n) {
        // Create dummy node to handle edge cases
        ListNode dummy = new ListNode(0);
        dummy.next = head;
        
        ListNode fast = dummy;
        ListNode slow = dummy;
        
        // Move fast n+1 steps ahead
        for (int i = 0; i <= n; i++) {
            fast = fast.next;
        }
        
        // Move both pointers together
        while (fast != null) {
            slow = slow.next;
            fast = fast.next;
        }
        
        // Remove the nth node from end
        slow.next = slow.next.next;
        
        return dummy.next;
    }
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

/**
 * @param {ListNode} head
 * @param {number} n
 * @return {ListNode}
 */
var removeNthFromEnd = function(head, n) {
    // Create dummy node to handle edge cases
    const dummy = new ListNode(0);
    dummy.next = head;
    
    let fast = dummy;
    let slow = dummy;
    
    // Move fast n+1 steps ahead
    for (let i = 0; i <= n; i++) {
        fast = fast.next;
    }
    
    // Move both pointers together
    while (fast) {
        slow = slow.next;
        fast = fast.next;
    }
    
    // Remove the nth node from end
    slow.next = slow.next.next;
    
    return dummy.next;
};
```
````

#### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(L) - Single pass through the list where L is the length |
| **Space** | O(1) - Only dummy node and two pointers used |

---

## Approach 2: Calculate Length First

This approach first determines the length of the list, then removes the nth node from the end.

#### Algorithm Steps

1. Traverse the list to count the total number of nodes (length `L`)
2. Calculate the position to remove: `L - n` (0-indexed from head)
3. If removing head (position 0), return `head.next`
4. Traverse to the node before the target position
5. Bypass the target node by setting `prev.next = prev.next.next`

#### Code Implementation

````carousel
```python
# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, val=0, next=None):
#         self.val = val
#         self.next = next

class Solution:
    def removeNthFromEnd(self, head: Optional[ListNode], n: int) -> Optional[ListNode]:
        # First pass: count the length of the list
        length = 0
        current = head
        while current:
            length += 1
            current = current.next
        
        # If removing the head
        if length == n:
            return head.next
        
        # Second pass: find node before the one to remove
        target_pos = length - n
        current = head
        for _ in range(target_pos - 1):
            current = current.next
        
        # Remove the node
        current.next = current.next.next
        
        return head
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
    ListNode* removeNthFromEnd(ListNode* head, int n) {
        // First pass: count the length
        int length = 0;
        ListNode* current = head;
        while (current) {
            length++;
            current = current->next;
        }
        
        // If removing the head
        if (length == n) {
            ListNode* newHead = head->next;
            delete head;
            return newHead;
        }
        
        // Second pass: find node before target
        int targetPos = length - n;
        current = head;
        for (int i = 0; i < targetPos - 1; i++) {
            current = current->next;
        }
        
        // Remove the node
        ListNode* toDelete = current->next;
        current->next = current->next->next;
        delete toDelete;
        
        return head;
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
public class Solution {
    public ListNode removeNthFromEnd(ListNode head, int n) {
        // First pass: count the length
        int length = 0;
        ListNode current = head;
        while (current != null) {
            length++;
            current = current.next;
        }
        
        // If removing the head
        if (length == n) {
            return head.next;
        }
        
        // Second pass: find node before target
        int targetPos = length - n;
        current = head;
        for (int i = 0; i < targetPos - 1; i++) {
            current = current.next;
        }
        
        // Remove the node
        current.next = current.next.next;
        
        return head;
    }
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

/**
 * @param {ListNode} head
 * @param {number} n
 * @return {ListNode}
 */
var removeNthFromEnd = function(head, n) {
    // First pass: count the length
    let length = 0;
    let current = head;
    while (current) {
        length++;
        current = current.next;
    }
    
    // If removing the head
    if (length === n) {
        return head.next;
    }
    
    // Second pass: find node before target
    const targetPos = length - n;
    current = head;
    for (let i = 0; i < targetPos - 1; i++) {
        current = current.next;
    }
    
    // Remove the node
    current.next = current.next.next;
    
    return head;
};
```
````

#### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(L) - Two passes through the list |
| **Space** | O(1) - Only a few pointers used |

---

## Approach 3: Recursive with Stack

This approach uses the call stack to store nodes and then removes the nth node during the unwinding phase.

#### Algorithm Steps

1. Recursively traverse to the end of the list
2. Return 0 when reaching null (base case)
3. On the way back (unwinding), increment a counter
4. When counter equals `n`, remove the current node by skipping it

#### Code Implementation

````carousel
```python
# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, val=0, next=None):
#         self.val = val
#         self.next = next

class Solution:
    def removeNthFromEnd(self, head: Optional[ListNode], n: int) -> Optional[ListNode]:
        # Dummy node to simplify removal of head
        self.counter = 0
        dummy = ListNode(0)
        dummy.next = head
        
        def removeHelper(node):
            if not node:
                return 0
            
            self.counter += 1
            pos_from_end = removeHelper(node.next)
            
            # If this is the nth node from end
            if pos_from_end == n:
                # Remove this node by skipping it
                node.next = node.next.next
            
            return pos_from_end + 1
        
        removeHelper(dummy.next)
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
private:
    int counter = 0;
    
    int removeHelper(ListNode* node, int n) {
        if (!node) {
            return 0;
        }
        
        counter++;
        int posFromEnd = removeHelper(node->next, n);
        
        if (posFromEnd == n) {
            ListNode* toDelete = node->next;
            node->next = node->next->next;
            delete toDelete;
        }
        
        return posFromEnd + 1;
    }
    
public:
    ListNode* removeNthFromEnd(ListNode* head, int n) {
        ListNode* dummy = new ListNode(0);
        dummy->next = head;
        counter = 0;
        
        removeHelper(dummy->next, n);
        
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
public class Solution {
    private int counter = 0;
    
    private int removeHelper(ListNode node, int n) {
        if (node == null) {
            return 0;
        }
        
        counter++;
        int posFromEnd = removeHelper(node.next, n);
        
        if (posFromEnd == n) {
            node.next = node.next.next;
        }
        
        return posFromEnd + 1;
    }
    
    public ListNode removeNthFromEnd(ListNode head, int n) {
        ListNode dummy = new ListNode(0);
        dummy.next = head;
        counter = 0;
        
        removeHelper(dummy.next, n);
        
        return dummy.next;
    }
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

/**
 * @param {ListNode} head
 * @param {number} n
 * @return {ListNode}
 */
var removeNthFromEnd = function(head, n) {
    let counter = 0;
    
    function removeHelper(node) {
        if (!node) {
            return 0;
        }
        
        counter++;
        const posFromEnd = removeHelper(node.next);
        
        if (posFromEnd === n) {
            node.next = node.next.next;
        }
        
        return posFromEnd + 1;
    }
    
    const dummy = new ListNode(0);
    dummy.next = head;
    
    removeHelper(dummy.next);
    
    return dummy.next;
};
```
````

#### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(L) - Each node visited once |
| **Space** | O(L) - Call stack stores L nodes |

---

## Comparison of Approaches

| Aspect | Two Pointers | Calculate Length | Recursive Stack |
|--------|--------------|------------------|-----------------|
| **Time Complexity** | O(L) | O(L) | O(L) |
| **Space Complexity** | O(1) | O(1) | O(L) |
| **Passes Required** | 1 | 2 | 1 |
| **Implementation** | Moderate | Simple | Moderate |
| **Best For** | Production/Interviews | Simplicity | Learning recursion |
| **LeetCode Optimal** | ✅ Yes | ✅ Yes | ❌ No |

---

## Why Two Pointers is Optimal for This Problem

The two-pointer approach with a dummy head is the optimal solution because:

1. **Single Pass:** Visits each node at most once
2. **Constant Space:** Only a few pointers used regardless of list length
3. **Elegant Handling of Edge Cases:** Dummy node simplifies removing the head
4. **Industry Standard:** Widely accepted solution for this problem
5. **No Data Modification:** Original list structure remains intact

The "gap" created between slow and fast pointers allows us to position slow exactly before the node to remove, making deletion straightforward.

---

## Related Problems

Based on similar themes (linked list manipulation, two-pointer technique):

- **[Middle of the Linked List](https://leetcode.com/problems/middle-of-the-linked-list/)** - Slow/fast pointer technique
- **[Linked List Cycle](https://leetcode.com/problems/linked-list-cycle/)** - Cycle detection with two pointers
- **[Remove Linked List Elements](https://leetcode.com/problems/remove-linked-list-elements/)** - Removing nodes by value
- **[Delete Node in a Linked List](https://leetcode.com/problems/delete-node-in-a-linked-list/)** - Delete without head pointer
- **[Swapping Nodes in a Linked List](https://leetcode.com/problems/swapping-nodes-in-a-linked-list/)** - Two-pointer swapping
- **[Find the Length of Linked List](https://leetcode.com/problems/length-of-linked-list/)** - Basic traversal

---

## Pattern Documentation

For a comprehensive guide on the **Nth Node from End** pattern using two-pointer technique, including detailed explanations, multiple approaches, and templates in Python, C++, Java, and JavaScript, see:

- **[Nth Node from End Pattern](../patterns/two-pointers-fixed-separation-nth-node-from-end.md)** - Complete pattern documentation

---

## Video Tutorial Links

Here are some helpful YouTube tutorials explaining the problem and solutions:

- [Remove Nth Node From End of List - LeetCode 19](https://www.youtube.com/watch?v=XtYEE5f3IgA) - Detailed explanation by NeetCode
- [Remove Nth Node From End](https://www.youtube.com/watch?v=FiC0bJZ9i_w) - Clear walkthrough with examples
- [Two Pointer Technique Explained](https://www.youtube.com/watch?v=1U-fLhKVX1c) - Multiple approaches explained
- [Linked List Problems Solutions](https://www.youtube.com/watch?v=H0r-k_lgHPA) - Comprehensive linked list tutorial

---

## Followup Questions

### Q1: How do you handle removing the head node?

**Answer:** Creating a dummy node before the head simplifies this case. When the head needs to be removed, the dummy's next pointer simply skips over the original head. After removal, return `dummy.next` as the new head.

---

### Q2: Why do we move fast pointer n+1 steps instead of n steps?

**Answer:** Moving fast `n+1` steps creates a gap of exactly `n` nodes between slow and fast. When fast reaches the end (null), slow will be positioned at the node **before** the target node, allowing us to easily remove the target by bypassing it. If we only moved `n` steps, slow would be at the target node itself, making removal less straightforward.

---

### Q3: Can you solve this problem with only one pass without two pointers?

**Answer:** Yes, you can use recursion with a stack (the call stack acts as storage). However, this still uses O(L) space for the call stack. The two-pointer approach is the only solution that achieves O(1) space with a single pass.

---

### Q4: How would you modify the solution to remove every nth node?

**Answer:** You would need to track position during traversal. When `(position + 1) % n == 0`, mark the previous node to skip the current one. This requires either maintaining a count or using additional data structures to track nodes to remove.

---

### Q5: What if n is larger than the list length?

**Answer:** According to the problem constraints, n is always valid (1 <= n <= length). However, in production code, you should add a check and return the original list if n > length to handle invalid input gracefully.

---

### Q6: How do you remove multiple nodes from the end in one pass?

**Answer:** You could maintain a list of references to the last `k` nodes during traversal. After reaching the end, you would remove all but the first node in that list. Alternatively, use a queue to store references to the last `k+1` nodes.

---

### Q7: What's the difference between removing from front vs. back of a linked list?

**Answer:** Removing from the front is O(1) - just update the head pointer. Removing from the end is O(n) if no tail pointer is maintained, or O(1) if a tail pointer is available but you still need to update the previous node's next pointer (which requires traversal or a doubly linked list).

---

### Q8: How would you implement this for a doubly linked list?

**Answer:** For a doubly linked list, you can traverse backward from the tail. However, most LeetCode problems assume singly linked lists. With doubly linked lists, you can directly access the previous node via `node.prev` to remove it more easily.

---

### Q9: Can you use this approach for circular linked lists?

**Answer:** The two-pointer approach works for circular lists if you handle the termination condition differently. Instead of checking for null, you check if fast returns to the starting point. The dummy node approach may also need modification.

---

### Q10: How would you test edge cases for this problem?

**Answer:** Key edge cases to test:
- Single node list (n=1)
- Removing head from multi-node list
- Removing last node
- Removing middle node
- Large lists
- Lists with duplicate values

---

## Summary

The "Remove Nth Node From End of List" problem demonstrates the power of the two-pointer technique for linked list problems. This approach solves the problem optimally with O(n) time and O(1) space complexity.

**Key Takeaways:**
- Two pointers with a gap of n nodes can find the nth node from the end in one pass
- Dummy node simplifies edge cases, especially removing the head
- Always handle null checks to avoid crashes
- The n+1 step initialization for the fast pointer is crucial
- Multiple approaches exist with different trade-offs (time vs. space)

Understanding this problem builds a strong foundation for tackling more complex linked list problems and mastering the two-pointer pattern.

---

## Additional Resources

- [LeetCode Problem Discussion](https://leetcode.com/problems/remove-nth-node-from-end-of-list/discuss/) - Community solutions and explanations
- [Two Pointer Technique](https://www.geeksforgeeks.org/two-pointers-technique/) - Detailed explanation
- [Linked List Data Structure](https://www.geeksforgeeks.org/linked-list-data-structure/) - Understanding linked lists
- [Floyd's Cycle Finding Algorithm](https://en.wikipedia.org/wiki/Cycle_detection#Floyd's_tortoise_and_hare) - Related two-pointer algorithm
