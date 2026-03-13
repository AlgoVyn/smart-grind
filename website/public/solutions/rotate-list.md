# Rotate List

## Problem Description

Given the head of a linked list, rotate the list to the right by k places.

**Link to problem:** [Rotate List - LeetCode 61](https://leetcode.com/problems/rotate-list/)

## Constraints
- The number of nodes in the list is in the range [0, 500]
- -1000 <= Node.val <= 1000
- 0 <= k <= 2 * 10^9

---

## Pattern: Linked List - Rotation (Circular)

This problem uses a circular approach to rotate the linked list.

### Core Concept

- **Connect end to start**: Make the list circular
- **Find new tail**: k nodes from the end
- **Break circle**: Form the rotated list

---

## Examples

### Example

**Input:** head = [1,2,3,4,5], k = 2

**Output:** [4,5,1,2,3]

**Explanation:**
- Original: 1 → 2 → 3 → 4 → 5 → null
- After 1st rotation: 5 → 1 → 2 → 3 → 4 → null
- After 2nd rotation: 4 → 5 → 1 → 2 → 3 → null

### Example 2

**Input:** head = [0,1,2], k = 4

**Output:** [2,0,1]

**Explanation:** Rotating by 4 is same as rotating by 4 % 3 = 1

---

## Intuition

The key insight is:

1. Make the list circular by connecting tail to head
2. Find the new head position (k nodes from end)
3. Break the circle at the right position
4. Handle edge cases: empty list, single node, k = 0

---

## Multiple Approaches with Code

We'll cover two approaches:

1. **Circular Approach (Optimal)** - O(n) time, O(1) space
2. **Step-by-Step Rotation** - O(n × k) time, O(1) space

---

## Approach 1: Circular Approach (Optimal)

This is the standard and most efficient approach.

### Algorithm Steps

1. Handle edge cases (empty, single node, k=0)
2. Find length and connect tail to head
3. Calculate effective k = k % n
4. Find new tail (n - k - 1 steps from head)
5. Break the circle

### Code Implementation

````carousel
```python
from typing import Optional

class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

class Solution:
    def rotateRight(self, head: Optional[ListNode], k: int) -> Optional[ListNode]:
        """
        Rotate list to the right by k places.
        
        Args:
            head: Head of linked list
            k: Number of places to rotate
            
        Returns:
            Head of rotated list
        """
        if not head or not head.next or k == 0:
            return head
        
        # Count length and find tail
        n = 1
        tail = head
        while tail.next:
            tail = tail.next
            n += 1
        
        # Connect tail to head (circular)
        tail.next = head
        
        # Find new tail (n - k % n nodes from start)
        k = k % n
        new_tail = head
        for _ in range(n - k - 1):
            new_tail = new_tail.next
        
        # Break the circle
        head = new_tail.next
        new_tail.next = None
```

<!-- slide -->
```cpp

        
        return headclass Solution {
public:
    ListNode* rotateRight(ListNode* head, int k) {
        if (!head || !head->next || k == 0) return head;
        
        int n = 1;
        ListNode* tail = head;
        while (tail->next) {
            tail = tail->next;
            n++;
        }
        
        tail->next = head;
        k = k % n;
        
        ListNode* new_tail = head;
        for (int i = 0; i < n - k - 1; i++) {
            new_tail = new_tail->next;
        }
        
        head = new_tail->next;
        new_tail->next = nullptr;
        
        return head;
    }
};
```

<!-- slide -->
```java
class Solution {
    public ListNode rotateRight(ListNode head, int k) {
        if (head == null || head.next == null || k == 0) return head;
        
        int n = 1;
        ListNode tail = head;
        while (tail.next != null) {
            tail = tail.next;
            n++;
        }
        
        tail.next = head;
        k = k % n;
        
        ListNode newTail = head;
        for (int i = 0; i < n - k - 1; i++) {
            newTail = newTail.next;
        }
        
        head = newTail.next;
        newTail.next = null;
        
        return head;
    }
}
```

<!-- slide -->
```javascript
var rotateRight = function(head, k) {
    if (!head || !head.next || k === 0) return head;
    
    let n = 1;
    let tail = head;
    while (tail.next) {
        tail = tail.next;
        n++;
    }
    
    tail.next = head;
    k = k % n;
    
    let newTail = head;
    for (let i = 0; i < n - k - 1; i++) {
        newTail = newTail.next;
    }
    
    head = newTail.next;
    newTail.next = null;
    
    return head;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) - single pass |
| **Space** | O(1) - in-place |

---

## Approach 2: Using Array (Alternative)

Convert to array, rotate, and rebuild.

### Code Implementation

````carousel
```python
class Solution:
    def rotateRight_array(self, head: Optional[ListNode], k: int) -> Optional[ListNode]:
        """
        Rotate using array conversion.
        """
        if not head:
            return head
        
        # Convert to array
        arr = []
        curr = head
        while curr:
            arr.append(curr.val)
            curr = curr.next
        
        n = len(arr)
        k = k % n
        
        if k == 0:
            return head
        
        # Rebuild list
        new_head = ListNode(arr[-k])
        curr = new_head
        for i in range(-k + 1, 0):
            curr.next = ListNode(arr[i if i >= 0 else n + i])
            curr = curr.next
        
        for i in range(n - k):
            curr.next = ListNode(arr[i])
            curr = curr.next
        
        return new_head
```

<!-- slide -->
```cpp
// Same approach - using array conversion
class Solution {
public:
    // Implementation similar to Python
};
```

<!-- slide -->
```java
// Same approach - using array conversion
class Solution {
    // Implementation similar to Python
}
```

<!-- slide -->
```javascript
// Same approach - using array conversion
var rotateRight = function(head, k) {
    // Implementation similar to Python
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) |
| **Space** | O(n) |

---

## Comparison of Approaches

| Aspect | Circular | Array |
|--------|----------|-------|
| **Time Complexity** | O(n) | O(n) |
| **Space Complexity** | O(1) | O(n) |
| **In-place** | Yes | No |

Circular approach is optimal for this problem.

---

## Related Problems

### Similar Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Rotate Array | [Link](https://leetcode.com/problems/rotate-array/) | Similar rotation concept |
| Reverse Linked List II | [Link](https://leetcode.com/problems/reverse-linked-list-ii/) | Partial reversal |
| Split Linked List in Parts | [Link](https://leetcode.com/problems/split-linked-list-in-parts/) | List splitting |

### Pattern Reference

For more detailed explanations of linked list rotation, see:
- **[Linked List Rotation Pattern](/patterns/linked-list)**

---

## Video Tutorial Links

Here are helpful YouTube tutorials explaining the problem and solutions:

### Linked List Rotation

- [NeetCode - Rotate List](https://www.youtube.com/watch?v=7C_f7fD2p14) - Clear explanation
- [Linked List Rotation](https://www.youtube.com/watch?v=8Q1nQkVGYQ8) - Detailed walkthrough
- [LeetCode Solution](https://www.youtube.com/watch?v=0lGNeO7xW7k) - Official explanation

---

## Follow-up Questions

### Q1: Why use k = k % n?

**Answer:** Rotating by n returns to the same list. So k % n gives effective rotation.

---

### Q2: What if k = 0?

**Answer:** Return the original list. No rotation needed.

---

### Q3: How to handle negative k?

**Answer:** Problem states k >= 0. If negative were allowed, convert to positive: k = (n - abs(k) % n) % n.

---

### Q4: Can you rotate left instead of right?

**Answer:** Yes, left rotation by k = right rotation by (n - k).

---

### Q5: What edge cases should be tested?

**Answer:**
- Empty list
- Single node
- k = 0
- k = n
- k > n

---

## Common Pitfalls

### Common Mistakes to Avoid

1. **k larger than list length**: Handle the case where k is greater than the list length

2. **Circular rotation logic**: Make sure to connect the tail to the head correctly

3. **Null pointer dereferences**: Check for empty lists and single node lists

4. **Off-by-one in finding the new tail**: The new tail is at position (n - k - 1)

---

## Summary

The **Rotate List** problem demonstrates **Circular Linked List** manipulation:
- Connect tail to head
- Find new tail position
- Break the circle
- O(n) time, O(1) space

### Pattern Summary

This problem exemplifies linked list rotation, which involves:
- Making the list circular
- Finding the correct break point
- Maintaining O(1) space

For more details, see the **[Linked List Rotation Pattern](/patterns/linked-list)**.

---

## Additional Resources

- [LeetCode Problem Discussion](https://leetcode.com/problems/rotate-list/discuss/) - Community solutions
- [Linked List - GeeksforGeeks](https://www.geeksforgeeks.org/linked-list/) - Linked list operations
- [Pattern: Linked List](/patterns/linked-list) - Comprehensive pattern guide
