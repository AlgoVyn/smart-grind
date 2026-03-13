# Odd Even Linked List

## Problem Description

Given the head of a singly linked list, group all the nodes with odd indices together followed by the nodes with even indices, and return the reordered list.
The first node is considered odd, and the second node is even, and so on.
Note that the relative order inside both the even and odd groups should remain as it was in the input.
You must solve the problem in O(1) extra space complexity and O(n) time complexity.

**LeetCode Link:** [LeetCode 328 - Odd Even Linked List](https://leetcode.com/problems/odd-even-linked-list/)

---

## Examples

**Example 1:**

**Input:** `head = [1,2,3,4,5]`  
**Output:** `[1,3,5,2,4]`

---

**Example 2:**

**Input:** `head = [2,1,3,5,6,4,7]`  
**Output:** `[2,3,6,7,1,5,4]`

---

## Constraints

- The number of nodes in the linked list is in the range `[0, 10^4]`
- `-10^6 <= Node.val <= 10^6`

---

## Pattern: Linked List - Two Pointers

This problem demonstrates the **Two Pointers** pattern for linked list manipulation. The key is using pointers to rearrange nodes in-place without creating new nodes.

### Core Concept

- **Pointer Manipulation**: Rearrange next pointers in-place
- **Separate Lists**: Maintain odd and even lists
- **In-Place**: O(1) space complexity
- **Single Pass**: O(n) time complexity

### When to Use This Pattern

This pattern is applicable when:
1. Rearranging linked list nodes
2. Grouping nodes by position
3. In-place list modification

---

## Intuition

The key insight is that we need to rearrange the linked list by changing the next pointers, not by creating new nodes. We can do this in a single pass by maintaining four pointers:

1. `odd` - points to the current odd node
2. `even` - points to the current even node
3. `evenHead` - keeps track of the first even node (to connect at the end)

The algorithm works by:
1. Connecting each odd node to the next odd node
2. Connecting each even node to the next even node
3. Connecting the last odd node to the first even node

---

## Multiple Approaches with Code

We'll cover three approaches:

1. **Single Pass (Optimal)** - O(n) time, O(1) space
2. **Two Pass** - O(n) time, O(1) space
3. **Index-based** - O(n) time, O(1) space

---

## Approach 1: Single Pass (Optimal)

This is the most efficient approach.

### Why It Works

We maintain two pointers - one for odd positions and one for even positions. By rearranging the next pointers, we can group all odd-indexed nodes together, then all even-indexed nodes.

### Algorithm Steps

1. Handle edge cases (0 or 1 node)
2. Initialize odd, even, and evenHead pointers
3. Loop while even and even.next exist:
   - Connect odd.next to even.next (next odd)
   - Move odd to the new odd node
   - Connect even.next to odd.next (next even)
   - Move even to the new even node
4. Connect the end of odd list to evenHead
5. Return the head

### Code Implementation

````carousel
```python
# Definition for singly-linked list.
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

class Solution:
    def oddEvenList(self, head: ListNode) -> ListNode:
        """
        Reorder linked list with odd then even nodes.
        
        Args:
            head: Head of the linked list
            
        Returns:
            Reordered linked list
        """
        if not head or not head.next:
            return head
        
        # Initialize pointers
        odd = head
        even = head.next
        even_head = even
        
        # Rearrange nodes
        while even and even.next:
            # Connect odd to next odd
            odd.next = even.next
            odd = odd.next
            
            # Connect even to next even
            even.next = odd.next
            even = even.next
        
        # Connect odd list to even list
        odd.next = even_head
        
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
    ListNode* oddEvenList(ListNode* head) {
        if (!head || !head->next) return head;
        
        ListNode* odd = head;
        ListNode* even = head->next;
        ListNode* evenHead = even;
        
        while (even && even->next) {
            odd->next = even->next;
            odd = odd->next;
            
            even->next = odd->next;
            even = even->next;
        }
        
        odd->next = evenHead;
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
class Solution {
    public ListNode oddEvenList(ListNode head) {
        if (head == null || head.next == null) return head;
        
        ListNode odd = head;
        ListNode even = head.next;
        ListNode evenHead = even;
        
        while (even != null && even.next != null) {
            odd.next = even.next;
            odd = odd.next;
            
            even.next = odd.next;
            even = even.next;
        }
        
        odd.next = evenHead;
        return head;
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
var oddEvenList = function(head) {
    if (!head || !head.next) return head;
    
    let odd = head;
    let even = head.next;
    const evenHead = even;
    
    while (even && even.next) {
        odd.next = even.next;
        odd = odd.next;
        
        even.next = odd.next;
        even = even.next;
    }
    
    odd.next = evenHead;
    return head;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) - Single pass through the list |
| **Space** | O(1) - Only pointer variables used |

---

## Approach 2: Using Array

This approach collects nodes into arrays and rebuilds.

### Why It Works

We can separate nodes into odd and even lists by traversing once and adding to respective arrays, then reconnect them.

### Code Implementation

````carousel
```python
class Solution:
    def oddEvenList_array(self, head: ListNode) -> ListNode:
        """
        Reorder using array approach.
        
        Args:
            head: Head of the linked list
            
        Returns:
            Reordered linked list
        """
        if not head or not head.next:
            return head
        
        odd_nodes = []
        even_nodes = []
        curr = head
        is_odd = True
        
        while curr:
            if is_odd:
                odd_nodes.append(curr)
            else:
                even_nodes.append(curr)
            is_odd = not is_odd
            curr = curr.next
        
        # Connect odd nodes
        for i in range(len(odd_nodes) - 1):
            odd_nodes[i].next = odd_nodes[i + 1]
        
        # Connect even nodes
        for i in range(len(even_nodes) - 1):
            even_nodes[i].next = even_nodes[i + 1]
        
        # Connect odd to even
        if odd_nodes:
            odd_nodes[-1].next = even_nodes[0] if even_nodes else None
        
        return head
```

<!-- slide -->
```cpp
class Solution {
public:
    ListNode* oddEvenList(ListNode* head) {
        if (!head || !head->next) return head;
        
        vector<ListNode*> odd, even;
        ListNode* curr = head;
        bool isOdd = true;
        
        while (curr) {
            if (isOdd) odd.push_back(curr);
            else even.push_back(curr);
            isOdd = !isOdd;
            curr = curr->next;
        }
        
        for (size_t i = 0; i + 1 < odd.size(); i++) {
            odd[i]->next = odd[i + 1];
        }
        
        for (size_t i = 0; i + 1 < even.size(); i++) {
            even[i]->next = even[i + 1];
        }
        
        if (!odd.empty() && !even.empty()) {
            odd.back()->next = even.front();
        }
        
        return head;
    }
};
```

<!-- slide -->
```java
class Solution {
    public ListNode oddEvenList(ListNode head) {
        if (head == null || head.next == null) return head;
        
        List<ListNode> odd = new ArrayList<>();
        List<ListNode> even = new ArrayList<>();
        ListNode curr = head;
        boolean isOdd = true;
        
        while (curr != null) {
            if (isOdd) odd.add(curr);
            else even.add(curr);
            isOdd = !isOdd;
            curr = curr.next;
        }
        
        for (int i = 0; i < odd.size() - 1; i++) {
            odd.get(i).next = odd.get(i + 1);
        }
        
        for (int i = 0; i < even.size() - 1; i++) {
            even.get(i).next = even.get(i + 1);
        }
        
        if (!odd.isEmpty() && !even.isEmpty()) {
            odd.get(odd.size() - 1).next = even.get(0);
        }
        
        return head;
    }
}
```

<!-- slide -->
```javascript
var oddEvenList = function(head) {
    if (!head || !head.next) return head;
    
    const odd = [];
    const even = [];
    let curr = head;
    let isOdd = true;
    
    while (curr) {
        if (isOdd) odd.push(curr);
        else even.push(curr);
        isOdd = !isOdd;
        curr = curr.next;
    }
    
    for (let i = 0; i < odd.length - 1; i++) {
        odd[i].next = odd[i + 1];
    }
    
    for (let i = 0; i < even.length - 1; i++) {
        even[i].next = even[i + 1];
    }
    
    if (odd.length > 0 && even.length > 0) {
        odd[odd.length - 1].next = even[0];
    }
    
    return head;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) - Traverse and reconnect |
| **Space** | O(n) - Storing nodes in arrays |

---

## Comparison of Approaches

| Aspect | Single Pass | Array |
|--------|-------------|-------|
| **Time Complexity** | O(n) | O(n) |
| **Space Complexity** | O(1) | O(n) |
| **Implementation** | Moderate | Simple |
| **LeetCode Optimal** | ✅ Yes | ❌ No |
| **Best For** | Interview favorite | Understanding |

**Best Approach:** The single pass approach (Approach 1) is optimal and required by the problem.

---

## Why Single Pass is Optimal

1. **O(1) Space**: Only uses pointer variables
2. **O(n) Time**: Single pass through the list
3. **In-place**: Doesn't create new nodes
4. **Required**: Problem specifically asks for O(1) space

---

## Related Problems

Based on similar themes (linked list rearrangement):

### Easy Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Reverse Linked List | [Link](https://leetcode.com/problems/reverse-linked-list/) | Basic reversal |
| Swap Nodes in Pairs | [Link](https://leetcode.com/problems/swap-nodes-in-pairs/) | Pair swapping |

### Medium Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Rotate List | [Link](https://leetcode.com/problems/rotate-list/) | List rotation |
| Reorder List | [Link](https://leetcode.com/problems/reorder-list/) | Complex rearrangement |

---

## Video Tutorial Links

### Single Pass Solution

- [NeetCode - Odd Even Linked List](https://www.youtube.com/watch?v=7M7xY2M7M5M) - Clear explanation
- [Pointer Rearrangement](https://www.youtube.com/watch?v=7M7xY2M7M5M) - Understanding pointers

---

## Follow-up Questions

### Q1: Why do we need to save evenHead?

**Answer:** We save the head of the even list because after rearranging, we lose the reference to it. We need it to connect the odd list to the even list at the end.

---

### Q2: What happens with a list of 1 or 2 nodes?

**Answer:** 
- 0 nodes: return head (null)
- 1 node: return head (already in correct order)
- 2 nodes: return head (already in correct order)

The algorithm handles these with the initial check.

---

### Q3: How would you modify to keep original structure after reordering?

**Answer:** After completing the rearrangement, you can swap the head and head.next pointers to restore the original structure if needed.

---

### Q4: Can this be done recursively?

**Answer:** Yes, but recursion uses O(n) stack space, violating the O(1) space requirement. It's not recommended for this problem.

---

### Q5: What edge cases should be tested?

**Answer:**
- Empty list (return null)
- Single node (return as-is)
- Two nodes (return as-is)
- Three nodes (1->2->3 becomes 1->3->2)
- Four nodes (1->2->3->4 becomes 1->3->2->4)
- Five nodes (1->2->3->4->5 becomes 1->3->5->2->4)

---

## Summary

The **Odd Even Linked List** problem demonstrates:

- **Single Pass**: O(n) time, O(1) space - Optimal
- **Array**: O(n) time, O(n) space - Simpler but more memory

The key insight is maintaining pointers to both odd and even positions simultaneously and rearranging the next pointers to group nodes by their original positions.

This is a classic linked list problem that tests understanding of pointer manipulation and in-place operations.

---

## Additional Resources

- [LeetCode Problem](https://leetcode.com/problems/odd-even-linked-list/)
- [Linked List Basics](https://en.wikipedia.org/wiki/Linked_list)
- [Pointer Manipulation](https://en.wikipedia.org/wiki/Pointer_(computer_programming))

---

## Common Pitfalls

### 1. Losing Reference to Even Head
**Issue:** Not saving the head of the even list before rearranging.

**Solution:** Store `evenHead = head.next` before starting the rearrangement.

### 2. Incorrect Loop Condition
**Issue:** Using wrong loop termination condition.

**Solution:** Loop should continue while `even and even.next` are not null.

### 3. Not Handling Edge Cases
**Issue:** Not checking for empty list or single node.

**Solution:** Add check at the beginning: `if not head or not head.next: return head`

### 4. Breaking Linked List
**Issue:** Not properly connecting the odd list to the even list at the end.

**Solution:** Always connect `odd.next = evenHead` after the loop.
