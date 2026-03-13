# Reverse Nodes in K-Group

## Problem Description

Given the head of a linked list, reverse the nodes of the list k at a time, and return the modified list. k is a positive integer and is less than or equal to the length of the linked list. If the number of nodes is not a multiple of k then the left-out nodes at the end should remain as they are.

You may not alter the values in the list's nodes; only nodes themselves may be changed.

## Examples

**Example 1:**

| Input | Output |
|-------|--------|
| `head = [1,2,3,4,5]`<br>`k = 2` | `[2,1,4,3,5]` |

**Example 2:**

| Input | Output |
|-------|--------|
| `head = [1,2,3,4,5]`<br>`k = 3` | `[3,2,1,4,5]` |

## Constraints

- The number of nodes in the list is `n`.
- `1 <= k <= n <= 5000`
- `0 <= Node.val <= 1000`

**Follow-up:** Can you solve the problem in O(1) extra memory space?

---

## Pattern: K-Group Reversal with Linked Lists

This problem demonstrates the **K-Group Reversal** pattern, which involves reversing nodes in groups of k while maintaining the overall structure of the linked list.

### Core Concept

The key idea is to:
1. Process the linked list in groups of k nodes
2. Reverse each group of k nodes in-place
3. Connect the reversed groups with the remaining nodes
4. Handle the edge case where less than k nodes remain

---

## Intuition

The key insight for this problem is that reversing nodes in groups of k requires carefully managing pointer connections while processing the linked list in chunks.

### Key Observations

1. **Group Processing**: We need to process the linked list in groups of k nodes. Each group should be reversed independently while maintaining connections to previous and next groups.

2. **Finding kth Node**: Using a pointer that advances k positions allows us to determine if we have enough nodes to reverse a complete group.

3. **Reversal Within Groups**: Standard linked list reversal is applied to each group of k nodes.

4. **Connection Management**: The critical part is correctly connecting the reversed group to the previous group (before it) and the next group (after it).

### Why Use a Dummy Node?

A dummy node simplifies edge cases like reversing from the head of the list. The dummy always points to the start of the processed portion, making it easy to return the final result.

### Algorithm Overview

1. Use a dummy node before the head
2. For each group: find kth node, reverse the k nodes, reconnect
3. Continue until fewer than k nodes remain
4. Return dummy.next

---

## Multiple Approaches with Code

We'll cover three approaches:

1. **Iterative Approach** - Optimal O(n) time, O(1) space
2. **Recursive Approach** - O(n) time, O(n) stack space
3. **Using a Stack** - O(n) time, O(k) space

---

## Approach 1: Iterative Approach (Optimal)

This is the most efficient approach with O(1) extra space. We reverse each group in-place by manipulating pointers.

### Algorithm Steps

1. **Use a dummy node** to simplify handling the head
2. **Track group boundaries**: prev_group_end and current group start
3. **Count k nodes** to check if we have enough nodes to reverse
4. **Reverse k nodes** by reversing pointers within the group
5. **Connect reversed group** to the previous and next parts
6. **Repeat** until all groups are processed

### Why It Works

By using a dummy node and carefully managing pointers, we can reverse each group without affecting other parts of the list.

### Code Implementation

````carousel
```python
# Definition for singly-linked list.
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

class Solution:
    def reverseKGroup(self, head: ListNode, k: int) -> ListNode:
        # Dummy node to simplify head handling
        dummy = ListNode(0)
        dummy.next = head
        
        # prev_group_end tracks the end of the previous reversed group
        prev_group_end = dummy
        
        while True:
            # Step 1: Check if there are at least k nodes remaining
            kth_node = prev_group_end
            for _ in range(k):
                kth_node = kth_node.next
                if not kth_node:
                    return dummy.next
            
            # Step 2: Save the next group's starting point
            next_group_start = kth_node.next
            
            # Step 3: Reverse the current group
            # First, disconnect the group from the rest
            kth_node.next = None
            
            # Now reverse from prev_group_end.next to kth_node
            group_start = prev_group_end.next
            prev = None
            curr = group_start
            while curr:
                next_node = curr.next
                curr.next = prev
                prev = curr
                curr = next_node
            
            # Step 4: Connect the reversed group
            # prev is now the new head of the reversed group
            prev_group_end.next = prev
            group_start.next = next_group_start
            
            # Step 5: Update prev_group_end for next iteration
            prev_group_end = group_start
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
    ListNode* reverseKGroup(ListNode* head, int k) {
        // Dummy node to simplify head handling
        ListNode* dummy = new ListNode(0);
        dummy->next = head;
        
        // prev_group_end tracks the end of the previous reversed group
        ListNode* prev_group_end = dummy;
        
        while (true) {
            // Step 1: Check if there are at least k nodes remaining
            ListNode* kth_node = prev_group_end;
            for (int i = 0; i < k; i++) {
                kth_node = kth_node->next;
                if (!kth_node) {
                    ListNode* result = dummy->next;
                    delete dummy;
                    return result;
                }
            }
            
            // Step 2: Save the next group's starting point
            ListNode* next_group_start = kth_node->next;
            
            // Step 3: Reverse the current group
            ListNode* group_start = prev_group_end->next;
            ListNode* prev = nullptr;
            ListNode* curr = group_start;
            
            while (curr != next_group_start) {
                ListNode* next_node = curr->next;
                curr->next = prev;
                prev = curr;
                curr = next_node;
            }
            
            // Step 4: Connect the reversed group
            prev_group_end->next = prev;
            group_start->next = next_group_start;
            
            // Step 5: Update prev_group_end for next iteration
            prev_group_end = group_start;
        }
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
    public ListNode reverseKGroup(ListNode head, int k) {
        // Dummy node to simplify head handling
        ListNode dummy = new ListNode(0);
        dummy.next = head;
        
        // prev_group_end tracks the end of the previous reversed group
        ListNode prevGroupEnd = dummy;
        
        while (true) {
            // Step 1: Check if there are at least k nodes remaining
            ListNode kthNode = prevGroupEnd;
            for (int i = 0; i < k; i++) {
                kthNode = kthNode.next;
                if (kthNode == null) {
                    return dummy.next;
                }
            }
            
            // Step 2: Save the next group's starting point
            ListNode nextGroupStart = kthNode.next;
            
            // Step 3: Reverse the current group
            ListNode groupStart = prevGroupEnd.next;
            ListNode prev = null;
            ListNode curr = groupStart;
            
            while (curr != nextGroupStart) {
                ListNode nextNode = curr.next;
                curr.next = prev;
                prev = curr;
                curr = nextNode;
            }
            
            // Step 4: Connect the reversed group
            prevGroupEnd.next = prev;
            groupStart.next = nextGroupStart;
            
            // Step 5: Update prev_group_end for next iteration
            prevGroupEnd = groupStart;
        }
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

var reverseKGroup = function(head, k) {
    // Dummy node to simplify head handling
    const dummy = new ListNode(0);
    dummy.next = head;
    
    // prev_group_end tracks the end of the previous reversed group
    let prevGroupEnd = dummy;
    
    while (true) {
        // Step 1: Check if there are at least k nodes remaining
        let kthNode = prevGroupEnd;
        for (let i = 0; i < k; i++) {
            kthNode = kthNode.next;
            if (!kthNode) {
                return dummy.next;
            }
        }
        
        // Step 2: Save the next group's starting point
        const nextGroupStart = kthNode.next;
        
        // Step 3: Reverse the current group
        let groupStart = prevGroupEnd.next;
        let prev = null;
        let curr = groupStart;
        
        while (curr !== nextGroupStart) {
            const nextNode = curr.next;
            curr.next = prev;
            prev = curr;
            curr = nextNode;
        }
        
        // Step 4: Connect the reversed group
        prevGroupEnd.next = prev;
        groupStart.next = nextGroupStart;
        
        // Step 5: Update prev_group_end for next iteration
        prevGroupEnd = groupStart;
    }
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) - Each node is visited a constant number of times |
| **Space** | O(1) - Only uses a constant number of pointers |

---

## Approach 2: Recursive Approach

This approach uses recursion to reverse groups of k nodes.

### Algorithm Steps

1. **Base case**: If less than k nodes remain, return head
2. **Recursive case**: Reverse first k nodes recursively
3. **Connect**: Link the reversed group with the rest of the list

### Why It Works

The recursive approach naturally divides the problem into smaller subproblems.

### Code Implementation

````carousel
```python
class Solution:
    def reverseKGroup(self, head: ListNode, k: int) -> ListNode:
        # Check if we have k nodes available
        curr = head
        count = 0
        while curr and count < k:
            curr = curr.next
            count += 1
        
        if count < k:
            return head
        
        # Reverse k nodes
        prev = None
        curr = head
        for _ in range(k):
            next_node = curr.next
            curr.next = prev
            prev = curr
            curr = next_node
        
        # Connect with the next part
        head.next = self.reverseKGroup(curr, k)
        
        return prev
```

<!-- slide -->
```cpp
class Solution {
public:
    ListNode* reverseKGroup(ListNode* head, int k) {
        // Check if we have k nodes available
        ListNode* curr = head;
        int count = 0;
        while (curr && count < k) {
            curr = curr->next;
            count++;
        }
        
        if (count < k) {
            return head;
        }
        
        // Reverse k nodes
        ListNode* prev = nullptr;
        ListNode* currNode = head;
        for (int i = 0; i < k; i++) {
            ListNode* nextNode = currNode->next;
            currNode->next = prev;
            prev = currNode;
            currNode = nextNode;
        }
        
        // Connect with the next part
        head->next = reverseKGroup(currNode, k);
        
        return prev;
    }
};
```

<!-- slide -->
```java
class Solution {
    public ListNode reverseKGroup(ListNode head, int k) {
        // Check if we have k nodes available
        ListNode curr = head;
        int count = 0;
        while (curr != null && count < k) {
            curr = curr.next;
            count++;
        }
        
        if (count < k) {
            return head;
        }
        
        // Reverse k nodes
        ListNode prev = null;
        ListNode currNode = head;
        for (int i = 0; i < k; i++) {
            ListNode nextNode = currNode.next;
            currNode.next = prev;
            prev = currNode;
            currNode = nextNode;
        }
        
        // Connect with the next part
        head.next = reverseKGroup(currNode, k);
        
        return prev;
    }
}
```

<!-- slide -->
```javascript
var reverseKGroup = function(head, k) {
    // Check if we have k nodes available
    let curr = head;
    let count = 0;
    while (curr !== null && count < k) {
        curr = curr.next;
        count++;
    }
    
    if (count < k) {
        return head;
    }
    
    // Reverse k nodes
    let prev = null;
    let currNode = head;
    for (let i = 0; i < k; i++) {
        const nextNode = currNode.next;
        currNode.next = prev;
        prev = currNode;
        currNode = nextNode;
    }
    
    // Connect with the next part
    head.next = reverseKGroup(currNode, k);
    
    return prev;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) - Each node is visited once |
| **Space** | O(n/k) - Recursion stack depth |

---

## Approach 3: Using a Stack

This approach uses a stack to temporarily store nodes in each group.

### Algorithm Steps

1. Process k nodes at a time using a stack
2. Pop nodes from stack to rebuild the reversed group
3. Connect groups together

### Why It Works

The stack's LIFO property naturally reverses the order of nodes.

### Code Implementation

````carousel
```python
class Solution:
    def reverseKGroup_stack(self, head: ListNode, k: int) -> ListNode:
        dummy = ListNode(0)
        prev_group_tail = dummy
        curr = head
        
        while curr:
            # Collect k nodes
            stack = []
            count = 0
            while curr and count < k:
                stack.append(curr)
                curr = curr.next
                count += 1
            
            # If we don't have k nodes, connect remaining
            if count < k:
                prev_group_tail.next = head
                break
            
            # Reverse using stack
            while stack:
                node = stack.pop()
                prev_group_tail.next = node
                prev_group_tail = node
            
            # Set next of last node to remaining list
            prev_group_tail.next = curr
            head = curr
        
        return dummy.next
```

<!-- slide -->
```cpp
class Solution {
public:
    ListNode* reverseKGroup(ListNode* head, int k) {
        ListNode* dummy = new ListNode(0);
        ListNode* prevGroupTail = dummy;
        ListNode* curr = head;
        
        while (curr) {
            // Collect k nodes
            vector<ListNode*> stack;
            int count = 0;
            while (curr && count < k) {
                stack.push_back(curr);
                curr = curr->next;
                count++;
            }
            
            // If we don't have k nodes, connect remaining
            if (count < k) {
                prevGroupTail->next = head;
                break;
            }
            
            // Reverse using stack (pop in reverse order)
            for (int i = k - 1; i >= 0; i--) {
                prevGroupTail->next = stack[i];
                prevGroupTail = stack[i];
            }
            
            // Set next of last node to remaining list
            prevGroupTail->next = curr;
            head = curr;
        }
        
        return dummy->next;
    }
};
```

<!-- slide -->
```java
class Solution {
    public ListNode reverseKGroup(ListNode head, int k) {
        ListNode dummy = new ListNode(0);
        ListNode prevGroupTail = dummy;
        ListNode curr = head;
        
        while (curr != null) {
            // Collect k nodes
            ListNode[] stack = new ListNode[k];
            int count = 0;
            while (curr != null && count < k) {
                stack[count] = curr;
                curr = curr.next;
                count++;
            }
            
            // If we don't have k nodes, connect remaining
            if (count < k) {
                prevGroupTail.next = head;
                break;
            }
            
            // Reverse using stack (pop in reverse order)
            for (int i = k - 1; i >= 0; i--) {
                prevGroupTail.next = stack[i];
                prevGroupTail = stack[i];
            }
            
            // Set next of last node to remaining list
            prevGroupTail.next = curr;
            head = curr;
        }
        
        return dummy.next;
    }
}
```

<!-- slide -->
```javascript
var reverseKGroup = function(head, k) {
    const dummy = new ListNode(0);
    let prevGroupTail = dummy;
    let curr = head;
    
    while (curr) {
        // Collect k nodes
        const stack = [];
        let count = 0;
        while (curr !== null && count < k) {
            stack.push(curr);
            curr = curr.next;
            count++;
        }
        
        // If we don't have k nodes, connect remaining
        if (count < k) {
            prevGroupTail.next = head;
            break;
        }
        
        // Reverse using stack (pop in reverse order)
        while (stack.length > 0) {
            const node = stack.pop();
            prevGroupTail.next = node;
            prevGroupTail = node;
        }
        
        // Set next of last node to remaining list
        prevGroupTail.next = curr;
        head = curr;
    }
    
    return dummy.next;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) - Each node is processed once |
| **Space** | O(k) - Stack stores at most k nodes |

---

## Comparison of Approaches

| Aspect | Iterative | Recursive | Stack |
|--------|-----------|-----------|-------|
| **Time Complexity** | O(n) | O(n) | O(n) |
| **Space Complexity** | O(1) | O(n/k) | O(k) |
| **LeetCode Optimal** | ✅ Yes | ❌ No | ❌ No |
| **Implementation** | Complex | Elegant | Simple |

**Best Approach:** The iterative approach is optimal as it uses O(1) extra space while maintaining O(n) time complexity.

---

## Why Iterative Approach is Optimal

The iterative approach is optimal because:

1. **Constant Space**: Only uses a fixed number of pointers, O(1) space
2. **Linear Time**: Each node is visited a constant number of times
3. **No Recursion Limit**: Unlike recursive approach, not limited by call stack
4. **In-Place**: Modifies links without creating new nodes
5. **Predictable Performance**: No stack overflow concerns

---

## Related Problems

Based on similar themes (linked list manipulation, reversal patterns):

### Easy Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Reverse Linked List | [Link](https://leetcode.com/problems/reverse-linked-list/) | Basic linked list reversal |
| Swap Nodes in Pairs | [Link](https://leetcode.com/problems/swap-nodes-in-pairs/) | Swap adjacent nodes |

### Medium Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Reverse Linked List II | [Link](https://leetcode.com/problems/reverse-linked-list-ii/) | Reverse sublist |
| Rotate List | [Link](https://leetcode.com/problems/rotate-list/) | Rotate list by k positions |

### Hard Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Reverse Nodes in K-Group | This problem | The current problem |

### Pattern Reference

For more detailed explanations of linked list manipulation patterns, see:
- **[Linked List - Add Two Numbers](/patterns/linked-list-addition-of-numbers)**

---

## Video Tutorial Links

Here are helpful YouTube tutorials explaining the problem and solutions:

### K-Group Reversal

- [NeetCode - Reverse Nodes in K-Group](https://www.youtube.com/watch?v=1VEGiM8IWDE) - Clear explanation with visual examples
- [Reverse Nodes in K-Group - Back to Back SWE](https://www.youtube.com/watch?v=Qq0X2tGc8sM) - Detailed walkthrough
- [LeetCode Official Solution](https://www.youtube.com/watch?v=o8118G1lPew) - Official problem solution

### Related Linked List Problems

- [Reverse Linked List](https://www.youtube.com/watch?v=G0_I-YFgnS8) - Basic reversal
- [Swap Nodes in Pairs](https://www.youtube.com/watch?v=oES4YBqhFR0) - Similar pattern
- [Linked List Deep Dive](https://www.youtube.com/watch?v=6w60i1H4c8s) - Complete guide

---

## Follow-up Questions

### Q1: Can you solve it in O(1) extra memory space?

**Answer:** Yes! The iterative approach uses only a constant number of pointers without any additional data structures. This satisfies the O(1) space requirement.

---

### Q2: How would you modify the solution to reverse every alternate k nodes?

**Answer:** Add a boolean flag to track whether to reverse or skip each group. Toggle the flag after each group processing.

---

### Q3: What if you need to return the list reversed in the opposite direction (last group first)?

**Answer:** Simply reverse the order of group processing - start from the end and work backwards. This would require either recursion or storing groups.

---

### Q4: How would you handle k = 1 or k = n edge cases?

**Answer:** 
- k = 1: No reversal needed, return the original list
- k = n: Reverse the entire list

The algorithm naturally handles these cases.

---

### Q5: What is the maximum value of k that can be handled?

**Answer:** Since constraints say k <= n <= 5000, the algorithm can handle any valid k. For very large k, the iterative approach uses O(1) space while the stack approach would need more memory.

---

### Q6: How would you modify the solution to also reverse the remaining nodes if less than k remain?

**Answer:** Change the condition from returning early to also reversing the remaining nodes when count < k.

---

### Q7: What edge cases should be tested?

**Answer:**
- k = 1 (no reversal)
- k = n (reverse entire list)
- n not divisible by k (remaining nodes)
- Single node list
- Empty list (though constraint says n >= 1)
- k = n-1 (one node remains)

---

### Q8: How does this problem relate to real-world applications?

**Answer:** This problem is useful in scenarios like:
- Reversing chunks of data in file systems
- Reordering data packets in networking
- Implementing certain encryption/decryption schemes

---

### Q9: How would you implement this with doubly linked list?

**Answer:** The approach would be similar, but you'd need to update both next and previous pointers. The algorithm would be slightly more complex but still O(n) time and O(1) space.

---

### Q10: What if nodes have additional properties that need to be preserved?

**Answer:** Since we only modify pointers (next) and don't create new nodes or change values, all node properties are preserved. This is a key advantage of pointer manipulation.

---

## Common Pitfalls

### 1. Not Handling Remaining Nodes
**Issue**: Forgetting to connect the remaining nodes after the last full group.

**Solution**: Always save the next group start before reversing and reconnect after.

### 2. Incorrect Pointer Updates
**Issue**: Losing reference to next nodes during reversal.

**Solution**: Always save next_node before changing pointers.

### 3. Dummy Node Not Connected
**Issue**: Forgetting to return dummy.next as the new head.

**Solution**: The dummy.next always points to the correct new head.

### 4. Off-by-One Errors
**Issue**: Incorrect counting in the k-node check.

**Solution**: Carefully trace through with small examples.

### 5. Not Updating Group End Pointer
**Issue**: Using the same pointer for all groups.

**Solution**: Update prev_group_end to point to the new end after each group.

---

## Summary

The **Reverse Nodes in K-Group** problem demonstrates advanced linked list manipulation:

- **Iterative approach**: Optimal with O(n) time and O(1) space
- **Recursive approach**: Elegant but uses O(n/k) stack space
- **Stack approach**: Simple but uses O(k) space

The key insight is that by carefully managing pointers and using a dummy node, we can reverse each group in-place without affecting other parts of the list.

This problem is an excellent demonstration of how pointer manipulation can solve complex linked list problems efficiently.

### Pattern Summary

This problem exemplifies the **K-Group Reversal** pattern, which is characterized by:
- Processing elements in fixed-size groups
- In-place reversal using pointer manipulation
- Maintaining O(1) space complexity
- Handling edge cases for incomplete groups

For more details on linked list patterns, see the **[Linked List - Add Two Numbers Pattern](/patterns/linked-list-addition-of-numbers)**.

---

## Additional Resources

- [LeetCode Problem Discussion](https://leetcode.com/problems/reverse-nodes-in-k-group/discuss/) - Community solutions
- [Linked List Operations - GeeksforGeeks](https://www.geeksforgeeks.org/data-structures/linked-list/) - Linked list basics
- [In-place Linked List Reversal](https://www.geeksforgeeks.org/reverse-a-linked-list/) - Reversal techniques
- [Pattern: Linked List - Add Two Numbers](/patterns/linked-list-addition-of-numbers) - Comprehensive pattern guide
