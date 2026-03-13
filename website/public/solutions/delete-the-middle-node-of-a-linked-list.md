# Delete The Middle Node Of A Linked List

## Problem Description

You are given the head of a linked list. Delete the middle node, and return the head of the modified linked list.

The middle node of a linked list of size n is the ⌊n / 2⌋th node from the start using 0-based indexing, where ⌊x⌋ denotes the largest integer less than or equal to x.

For n = 1, 2, 3, 4, and 5, the middle nodes are 0, 1, 1, 2, and 2 respectively.

**Link to problem:** [Delete The Middle Node Of A Linked List - LeetCode 2095](https://leetcode.com/problems/delete-the-middle-node-of-a-linked-list/)

## Constraints
- `1 <= n <= 10^5`
- `1 <= Node.val <= 10^5`
- The list has at least one node

---

## Pattern: Fast and Slow Pointers (Two Pointers)

This problem is a classic example of the **Fast and Slow Pointers** pattern. The pattern uses two pointers moving at different speeds to efficiently find the middle of a linked list.

### Core Concept

- **Slow Pointer**: Moves one step at a time
- **Fast Pointer**: Moves two steps at a time
- **Middle Detection**: When fast reaches the end, slow is at the middle
- **Previous Tracking**: Keep a reference to the node before slow for deletion

---

## Examples

### Example

**Input:**
```
head = [1,3,4,7,1,2,6]
```

**Output:**
```
[1,3,4,1,2,6]
```

**Explanation:**
- The linked list has 7 nodes: 1 → 3 → 4 → 7 → 1 → 2 → 6
- Middle node is at index 3 (⌊7/2⌋ = 3), which is node with value 7
- After deleting 7: 1 → 3 → 4 → 1 → 2 → 6

### Example 2

**Input:**
```
head = [1,2,3,4]
```

**Output:**
```
[1,2,4]
```

**Explanation:**
- The linked list has 4 nodes: 1 → 2 → 3 → 4
- Middle node is at index 2 (⌊4/2⌋ = 2), which is node with value 3
- After deleting 3: 1 → 2 → 4

### Example 3

**Input:**
```
head = [2,1]
```

**Output:**
```
[2]
```

**Explanation:**
- The linked list has 2 nodes: 2 → 1
- Middle node is at index 1 (⌊2/2⌋ = 1), which is node with value 1
- After deleting 1: [2]

---

## Intuition

The key insight is using two pointers with different speeds:

1. **Find Middle**: When fast reaches the end, slow is at the middle
2. **Track Previous**: Keep a pointer to the node before slow for deletion
3. **One Pass**: The entire algorithm runs in a single pass

### Why Two Pointers Work

- Fast pointer moves 2x speed, so when it reaches the end, slow has moved half the distance
- For odd-length lists: fast reaches null, slow is exactly at middle
- For even-length lists: fast reaches last node, slow is at first of the two middle nodes

---

## Multiple Approaches with Code

We'll cover two approaches:

1. **Fast and Slow Pointers (Optimal)** - O(n) time, O(1) space
2. **Count and Traverse** - O(n) time, O(1) space

---

## Approach 1: Fast and Slow Pointers (Optimal)

This is the optimal approach using two pointers moving at different speeds.

### Algorithm Steps

1. Initialize slow and fast pointers at head
2. Initialize prev pointer to None
3. Move fast two steps and slow one step until fast reaches end
4. During iteration, track the previous node
5. When fast reaches end, slow is at middle - delete it using prev

### Why It Works

The two-pointer technique efficiently finds the middle without knowing the list length. The fast pointer travels twice as fast, so when it reaches the end, the slow pointer has traveled exactly half the distance.

### Code Implementation

````carousel
```python
class Solution:
    def deleteMiddle(self, head: Optional[ListNode]) -> Optional[ListNode]:
        if not head or not head.next:
            return None
        
        slow = head
        fast = head
        prev = None
        
        while fast and fast.next:
            prev = slow
            slow = slow.next
            fast = fast.next.next
        
        # Delete the middle node
        prev.next = slow.next
        return head
```

<!-- slide -->
```cpp
class Solution {
public:
    ListNode* deleteMiddle(ListNode* head) {
        if (!head || !head->next) {
            return nullptr;
        }
        
        ListNode* slow = head;
        ListNode* fast = head;
        ListNode* prev = nullptr;
        
        while (fast && fast->next) {
            prev = slow;
            slow = slow->next;
            fast = fast->next->next;
        }
        
        // Delete the middle node
        prev->next = slow->next;
        delete slow;
        return head;
    }
};
```

<!-- slide -->
```java
class Solution {
    public ListNode deleteMiddle(ListNode head) {
        if (head == null || head.next == null) {
            return null;
        }
        
        ListNode slow = head;
        ListNode fast = head;
        ListNode prev = null;
        
        while (fast != null && fast.next != null) {
            prev = slow;
            slow = slow.next;
            fast = fast.next.next;
        }
        
        // Delete the middle node
        prev.next = slow.next;
        return head;
    }
}
```

<!-- slide -->
```javascript
var deleteMiddle = function(head) {
    if (!head || !head.next) {
        return null;
    }
    
    let slow = head;
    let fast = head;
    let prev = null;
    
    while (fast && fast.next) {
        prev = slow;
        slow = slow.next;
        fast = fast.next.next;
    }
    
    // Delete the middle node
    prev.next = slow.next;
    return head;
};
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) - single pass through the list |
| **Space** | O(1) - only pointer variables used |

---

## Approach 2: Count and Traverse

This approach first counts the nodes, then traverses to the middle.

### Algorithm Steps

1. First pass: Count total number of nodes
2. Calculate middle index: n/2
3. Second pass: Traverse to the node before middle
4. Delete the middle node

### Why It Works

Simple two-pass solution - first find the length, then find and delete the middle.

### Code Implementation

````carousel
```python
class Solution:
    def deleteMiddle(self, head: Optional[ListNode]) -> Optional[ListNode]:
        if not head or not head.next:
            return None
        
        # Count nodes
        count = 0
        curr = head
        while curr:
            count += 1
            curr = curr.next
        
        # Find middle (count // 2)
        mid = count // 2
        curr = head
        for _ in range(mid - 1):
            curr = curr.next
        
        # Delete middle node
        curr.next = curr.next.next
        return head
```

<!-- slide -->
```cpp
class Solution {
public:
    ListNode* deleteMiddle(ListNode* head) {
        if (!head || !head->next) {
            return nullptr;
        }
        
        // Count nodes
        int count = 0;
        ListNode* curr = head;
        while (curr) {
            count++;
            curr = curr->next;
        }
        
        // Find middle
        int mid = count / 2;
        curr = head;
        for (int i = 0; i < mid - 1; i++) {
            curr = curr->next;
        }
        
        // Delete middle node
        ListNode* toDelete = curr->next;
        curr->next = toDelete->next;
        delete toDelete;
        return head;
    }
};
```

<!-- slide -->
```java
class Solution {
    public ListNode deleteMiddle(ListNode head) {
        if (head == null || head.next == null) {
            return null;
        }
        
        // Count nodes
        int count = 0;
        ListNode curr = head;
        while (curr != null) {
            count++;
            curr = curr.next;
        }
        
        // Find middle
        int mid = count / 2;
        curr = head;
        for (int i = 0; i < mid - 1; i++) {
            curr = curr.next;
        }
        
        // Delete middle node
        curr.next = curr.next.next;
        return head;
    }
}
```

<!-- slide -->
```javascript
var deleteMiddle = function(head) {
    if (!head || !head.next) {
        return null;
    }
    
    // Count nodes
    let count = 0;
    let curr = head;
    while (curr) {
        count++;
        curr = curr.next;
    }
    
    // Find middle
    const mid = Math.floor(count / 2);
    curr = head;
    for (let i = 0; i < mid - 1; i++) {
        curr = curr.next;
    }
    
    // Delete middle node
    curr.next = curr.next.next;
    return head;
};
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) - two passes through the list |
| **Space** | O(1) - only counter and pointer variables used |

---

## Comparison of Approaches

| Aspect | Fast/Slow Pointers | Count and Traverse |
|--------|-------------------|-------------------|
| **Time Complexity** | O(n) - single pass | O(n) - two passes |
| **Space Complexity** | O(1) | O(1) |
| **Implementation** | Slightly complex | Simple |
| **LeetCode Optimal** | ✅ Yes | ❌ No |
| **Best For** | Single-pass requirement | Simplicity |

**Best Approach:** Fast and slow pointers (Approach 1) is optimal as it achieves the goal in a single pass.

---

## Why Fast/Slow Pointers is Optimal

1. **Single Pass**: Traverses the list only once
2. **Constant Space**: Only uses a few pointer variables
3. **Efficient**: No need to count nodes first
4. **Industry Standard**: Commonly used for middle element problems

---

## Related Problems

### Easy Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Remove Nth Node From End of List | [Link](https://leetcode.com/problems/remove-nth-node-from-end-of-list/) | Remove nth node from end |
| Middle of the Linked List | [Link](https://leetcode.com/problems/middle-of-the-linked-list/) | Find middle of linked list |

### Medium Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Remove Nth Node From End of List II | [Link](https://leetcode.com/problems/remove-nth-node-from-end-of-list-ii/) | Remove nth from end (no dummy) |
| Delete Node in a Linked List | [Link](https://leetcode.com/problems/delete-node-in-a-linked-list/) | Delete given node only |

---

## Video Tutorial Links

Here are helpful YouTube tutorials explaining the problem and solutions:

### Fast and Slow Pointers

- [NeetCode - Delete Middle Node](https://www.youtube.com/watch?v=OLQxY3JG-yk) - Clear explanation with visual examples
- [Fast and Slow Pointer Technique](https://www.youtube.com/watch?v=7B8c6c5eP0c) - Understanding the technique
- [LeetCode Official Solution](https://www.youtube.com/watch?v=YLJ-GUvVPaw) - Official problem solution

### Linked List Basics

- [Linked List Data Structure](https://www.youtube.com/watch?v=njTh_OwMljA) - Understanding linked lists
- [Two Pointers Pattern Explained](https://www.youtube.com/watch?v=GbZd8sGzsjQ) - Two pointers pattern

---

## Follow-up Questions

### Q1: How do you handle edge cases like single node or two nodes?

**Answer:** For a single node (head.next is null), return None. For two nodes, the middle is the second node, so we delete head.next.

---

### Q2: Can you delete the middle without tracking the previous node?

**Answer:** Not directly - you need the previous node to update its next pointer. However, you could copy the next node's value to the middle node and delete the next node instead (like in "Delete Node in a Linked List" problem).

---

### Q3: What if you need to delete the second middle in an even-length list?

**Answer:** Currently, for even-length lists (e.g., 4 nodes), slow points to the second of the two middle nodes (index 2). This is the desired behavior as per the problem's definition (⌊n/2⌋).

---

### Q4: How would you modify for a doubly linked list?

**Answer:** Similar approach, but update both next and prev pointers when deleting. You'd track prev instead of maintaining a separate previous pointer.

---

### Q5: What edge cases should be tested?

**Answer:**
- Single node list (returns None)
- Two node list (deletes second node)
- Odd number of nodes
- Even number of nodes
- Very large lists (n = 10^5)

---

## Common Pitfalls

### 1. Not Handling Edge Cases
**Issue**: Forgetting to handle single node or two-node lists.

**Solution**: Check if head.next is None before proceeding.

### 2. Wrong Previous Node Tracking
**Issue**: Not updating prev pointer correctly.

**Solution**: Update prev before moving slow: `prev = slow` before `slow = slow.next`

### 3. Fast Pointer Initialization
**Issue**: Wrong fast pointer starting position.

**Solution**: Start both at head; the condition `fast and fast.next` handles the logic correctly.

### 4. Null Pointer Exception
**Issue**: Not checking for null before accessing next.

**Solution**: The while condition `fast and fast.next` ensures both are valid.

### 5. Return Value
**Issue**: Returning None instead of head for edge cases.

**Solution**: Handle single/two-node cases explicitly at the start.

---

## Summary

The **Delete The Middle Node Of A Linked List** problem demonstrates the power of the **Fast and Slow Pointers** pattern:

- **Fast/Slow Pointers**: O(n) time, O(1) space - optimal solution
- **Count and Traverse**: O(n) time, O(1) space - alternative solution

The key insight is that by moving one pointer twice as fast as the other, we can find the middle in a single pass. When the fast pointer reaches the end, the slow pointer is exactly at the middle.

This problem is an excellent demonstration of how the two-pointer pattern efficiently solves linked list problems.

### Pattern Summary

This problem exemplifies the **Fast and Slow Pointers** pattern, characterized by:
- Using two pointers at different speeds
- Finding middle elements in linear time
- Cycle detection
- Single-pass solutions

For more details on this pattern and its variations, see the **[Fast and Slow Pointers Pattern](/patterns/fast-slow-pointers)**.

---

## Additional Resources

- [LeetCode Problem Discussion](https://leetcode.com/problems/delete-the-middle-node-of-a-linked-list/discuss/) - Community solutions
- [Linked List Operations - GeeksforGeeks](https://www.geeksforgeeks.org/linked-list/) - Understanding linked lists
- [Two Pointers Technique](https://www.geeksforgeeks.org/two-pointers-technique/) - Two pointers pattern
