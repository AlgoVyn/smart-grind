# Plus One Linked List

## Problem Description

You are given a non-negative integer represented as a linked list, where each node contains a single digit. The digits are stored in reverse order, such that the head points to the least significant digit.

Add one to the integer represented by the linked list and return the resulting linked list.

## Examples

### Example

**Input:** `head = [1,2,3]`  
**Output:** `[1,2,4]`

**Explanation:** Adding 1 to 321 gives 324.

### Example 2

**Input:** `head = [9,9,9]`  
**Output:** `[1,0,0,0]`

**Explanation:** Adding 1 to 999 gives 1000.

### Example 3

**Input:** `head = [0]`  
**Output:** `[1]`

## Constraints

- The number of nodes in the list is between 1 and 30
- Each node contains a single digit (0-9)

---

## Pattern: Linked List Simulation with Carry

This problem is a classic example of the **Linked List Simulation with Carry** pattern. The pattern involves simulating mathematical operations on linked lists while handling carries.

### Core Concept

The fundamental idea is:
- **Find Rightmost Non-9**: Locate the rightmost digit that is not 9
- **Increment That Node**: Add 1 to that digit
- **Set Following 9s to 0**: All 9s after the incremented digit become 0

---

## Intuition

The key insight is:
1. If all digits are 9, we need a new leading 1
2. Otherwise, we only need to change digits from the rightmost non-9 onwards
3. Using a dummy node simplifies handling when head itself is 9

---

## Multiple Approaches with Code

We'll cover two approaches:

1. **Find Rightmost Non-9 (Optimal)** - O(n) time, O(1) space
2. **Recursive with Carry** - O(n) time, O(n) space (recursion stack)

---

## Approach 1: Find Rightmost Non-9 (Optimal)

This is the most space-efficient approach.

### Algorithm Steps

1. Create a dummy node pointing to head
2. Find the rightmost node that is not 9
3. Increment that node's value
4. Set all nodes after it to 0
5. Return dummy.next (or dummy if all were 9s)

### Code Implementation

````carousel
```python
from typing import Optional

# Definition for singly-linked list node
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

class Solution:
    def plusOne(self, head: Optional[ListNode]) -> Optional[ListNode]:
        """
        Add one to the number represented by linked list.
        
        Args:
            head: Head of linked list with digits in reverse order
            
        Returns: Head of linked list after adding one
        """
        # Create dummy node to handle case when head becomes 10
        dummy = ListNode(0)
        dummy.next = head
        
        # Find rightmost node that is not 9
        not_nine = dummy
        while head:
            if head.val != 9:
                not_nine = head
            head = head.next
        
        # Increment the rightmost non-9 node
        not_nine.val += 1
        
        # Set all nodes after not_nine to 0
        node = not_nine.next
        while node:
            node.val = 0
            node = node.next
        
        # Return dummy.next, or dummy if result is like 999 -> 1000
        return dummy.next if dummy.val == 0 else dummy
```

<!-- slide -->
```cpp
/**
 * Definition for singly-linked list node.
 */
struct ListNode {
    int val;
    ListNode *next;
    ListNode() : val(0), next(nullptr) {}
    ListNode(int x) : val(x), next(nullptr) {}
    ListNode(int x, ListNode *next) : val(x), next(next) {}
};

class Solution {
public:
    /**
     * Add one to the number represented by linked list.
     */
    ListNode* plusOne(ListNode* head) {
        // Create dummy node to handle case when head becomes 10
        ListNode* dummy = new ListNode(0);
        dummy->next = head;
        
        // Find rightmost node that is not 9
        ListNode* notNine = dummy;
        while (head) {
            if (head->val != 9) {
                notNine = head;
            }
            head = head->next;
        }
        
        // Increment the rightmost non-9 node
        notNine->val += 1;
        
        // Set all nodes after notNine to 0
        ListNode* node = notNine->next;
        while (node) {
            node->val = 0;
            node = node->next;
        }
        
        // Return dummy.next, or dummy if result is like 999 -> 1000
        return dummy->val == 0 ? dummy->next : dummy;
    }
};
```

<!-- slide -->
```java
/**
 * Definition for singly-linked list node.
 */
class ListNode {
    int val;
    ListNode next;
    ListNode() {}
    ListNode(int val) { this.val = val; }
    ListNode(int val, ListNode next) { this.val = val; this.next = next; }
}

class Solution {
    public ListNode plusOne(ListNode head) {
        // Create dummy node to handle case when head becomes 10
        ListNode dummy = new ListNode(0);
        dummy.next = head;
        
        // Find rightmost node that is not 9
        ListNode notNine = dummy;
        while (head != null) {
            if (head.val != 9) {
                notNine = head;
            }
            head = head.next;
        }
        
        // Increment the rightmost non-9 node
        notNine.val += 1;
        
        // Set all nodes after notNine to 0
        ListNode node = notNine.next;
        while (node != null) {
            node.val = 0;
            node = node.next;
        }
        
        // Return dummy.next, or dummy if result is like 999 -> 1000
        return dummy.val == 0 ? dummy.next : dummy;
    }
}
```

<!-- slide -->
```javascript
/**
 * Definition for singly-linked list node.
 */
function ListNode(val, next) {
    this.val = (val === undefined ? 0 : val);
    this.next = (next === undefined ? null : next);
}

/**
 * Add one to the number represented by linked list.
 * 
 * @param {ListNode} head - Head of linked list with digits in reverse order
 * @return {ListNode} - Head of linked list after adding one
 */
var plusOne = function(head) {
    // Create dummy node to handle case when head becomes 10
    const dummy = new ListNode(0);
    dummy.next = head;
    
    // Find rightmost node that is not 9
    let notNine = dummy;
    while (head) {
        if (head.val !== 9) {
            notNine = head;
        }
        head = head.next;
    }
    
    // Increment the rightmost non-9 node
    notNine.val += 1;
    
    // Set all nodes after notNine to 0
    let node = notNine.next;
    while (node) {
        node.val = 0;
        node = node.next;
    }
    
    // Return dummy.next, or dummy if result is like 999 -> 1000
    return dummy.val === 0 ? dummy.next : dummy;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) - Two passes through the list |
| **Space** | O(1) - Only dummy node and pointers |

---

## Approach 2: Recursive with Carry

This approach uses recursion to handle the carry.

### Algorithm Steps

1. Recursively process from the end of the list
2. If current node is not 9, increment and return
3. If current node is 9, set to 0 and propagate carry
4. If all nodes are 9, create new head with value 1

### Code Implementation

````carousel
```python
class Solution:
    def plusOne_recursive(self, head: Optional[ListNode]) -> Optional[ListNode]:
        """
        Recursive approach.
        """
        if not head:
            return ListNode(1)
        
        head.next = self.plusOne_recursive(head.next)
        
        if head.val != 9:
            head.val += 1
            return head
        else:
            head.val = 0
            return head
```

<!-- slide -->
```cpp
class Solution {
public:
    ListNode* plusOne(ListNode* head) {
        if (!head) return new ListNode(1);
        
        head->next = plusOne(head->next);
        
        if (head->val != 9) {
            head->val += 1;
            return head;
        } else {
            head->val = 0;
            return head;
        }
    }
};
```

<!-- slide -->
```java
class Solution {
    public ListNode plusOne(ListNode head) {
        if (head == null) return new ListNode(1);
        
        head.next = plusOne(head.next);
        
        if (head.val != 9) {
            head.val += 1;
            return head;
        } else {
            head.val = 0;
            return head;
        }
    }
}
```

<!-- slide -->
```javascript
var plusOne = function(head) {
    if (!head) return new ListNode(1);
    
    head.next = plusOne(head.next);
    
    if (head.val !== 9) {
        head.val += 1;
        return head;
    } else {
        head.val = 0;
        return head;
    }
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) |
| **Space** | O(n) - Recursion stack |

---

## Comparison of Approaches

| Aspect | Find Rightmost Non-9 | Recursive |
|--------|---------------------|-----------|
| **Time Complexity** | O(n) | O(n) |
| **Space Complexity** | O(1) | O(n) |
| **Implementation** | Iterative | Recursive |
| **LeetCode Optimal** | ✅ Yes | ❌ No |

---

## Related Problems

| Problem | LeetCode Link |
|---------|---------------|
| Plus One | [Link](https://leetcode.com/problems/plus-one/) |
| Add Two Numbers | [Link](https://leetcode.com/problems/add-two-numbers/) |
| Linked List Addition | [Link](https://leetcode.com/problems/plus-one-linked-list/) |

---

## Video Tutorial Links

- [NeetCode - Plus One Linked List](https://www.youtube.com/watch?v=0lGNeO7xW7k)
- [Solution Explanation](https://www.youtube.com/watch?v=8Q1nQkVGYQ8)

---

## Follow-up Questions

### Q1: How to handle subtraction of one?

**Answer:** Similar approach - find rightmost non-0 and decrement, set following digits to 9.

### Q2: How to add arbitrary number k?

**Answer:** Modify to propagate k instead of 1, handling multi-digit carries.

---

## Common Pitfalls

### 1. Not Handling All-9 Cases
A common mistake is not properly handling cases where all digits are 9 (e.g., 999 → 1000). Always use a dummy node to simplify this edge case.

### 2. Forgetting to Reset Nodes After Increment
When you increment a non-9 node to 10, you must set it to 0 and propagate the carry. Don't forget to reset all subsequent 9s to 0.

### 3. Memory Leaks in C++
When creating new nodes for all-9 cases, ensure proper memory management to avoid leaks.

### 4. Off-by-One Errors
Be careful with loop conditions when finding the rightmost non-9 node. The dummy node helps avoid edge case errors.

### 5. Not Returning the Correct Head
For inputs like [9], the result should be [1,0], not [0]. The dummy node approach naturally handles this.

---

## Summary

The optimal approach finds the rightmost non-9 digit and increments it, achieving O(n) time and O(1) space.
