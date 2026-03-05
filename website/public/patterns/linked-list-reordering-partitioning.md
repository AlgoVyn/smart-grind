# Linked List - Reordering / Partitioning

## Problem Description

The Reordering/Partitioning pattern rearranges nodes in a linked list based on specific criteria such as value, position (odd/even), or other properties, while maintaining relative order within partitions. This pattern enables in-place reorganization without additional data structures.

### Key Characteristics

| Characteristic | Description |
|----------------|-------------|
| Time Complexity | O(n) - single pass through the list |
| Space Complexity | O(1) - uses only a constant number of pointers |
| Input | A linked list and optionally a partition criteria |
| Output | The rearranged linked list |
| Approach | Multiple pointers with dummy nodes for partitions |

### When to Use

- Separating nodes by odd/even positions or values
- Partitioning around a pivot value
- Rearranging nodes in specific patterns (e.g., L0→Ln→L1→Ln-1...)
- Problems requiring in-place list reorganization
- Grouping nodes while preserving relative order within groups

## Intuition

The key insight is to use separate chains (dummy heads) for different partitions, then connect them at the end.

The "aha!" moments:

1. **Multiple dummy heads**: Use one dummy head per partition to build sublists independently
2. **Preserving order**: Always append to the tail of each partition to maintain relative order
3. **Connecting partitions**: Link the end of one partition to the start of the next
4. **Null termination**: Always set the last node's next to null to prevent cycles
5. **Single pass**: Process all nodes in one traversal for O(n) time

## Solution Approaches

### Approach 1: Odd-Even Partitioning ✅ Recommended

Group all odd-positioned nodes together followed by even-positioned nodes.

#### Algorithm

1. Create dummy heads for odd and even partitions
2. Traverse the list with a position tracker
3. Append each node to the appropriate partition based on position
4. Connect odd tail to even head, set even tail to null
5. Return odd dummy's next

#### Implementation

````carousel
```python
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def odd_even_list(head: ListNode) -> ListNode:
    """
    Group odd-positioned nodes followed by even-positioned nodes.
    LeetCode 328 - Odd Even Linked List
    Time: O(n), Space: O(1)
    """
    if not head or not head.next:
        return head
    
    # Dummy nodes for odd and even partitions
    odd_dummy = ListNode()
    even_dummy = ListNode()
    odd_tail = odd_dummy
    even_tail = even_dummy
    
    current = head
    is_odd = True
    
    # Partition nodes by position
    while current:
        if is_odd:
            odd_tail.next = current
            odd_tail = odd_tail.next
        else:
            even_tail.next = current
            even_tail = even_tail.next
        
        is_odd = not is_odd
        current = current.next
    
    # Connect partitions and terminate
    odd_tail.next = even_dummy.next
    even_tail.next = None
    
    return odd_dummy.next
```
<!-- slide -->
```cpp
struct ListNode {
    int val;
    ListNode *next;
    ListNode() : val(0), next(nullptr) {}
    ListNode(int x) : val(x), next(nullptr) {}
    ListNode(int x, ListNode *next) : val(x), next(next) {}
};

class Solution {
public:
    ListNode* oddEvenList(ListNode* head) {
        // Group odd-positioned nodes followed by even-positioned.
        // Time: O(n), Space: O(1)
        if (!head || !head->next) return head;
        
        ListNode oddDummy, evenDummy;
        ListNode *oddTail = &oddDummy, *evenTail = &evenDummy;
        ListNode *current = head;
        bool isOdd = true;
        
        while (current) {
            if (isOdd) {
                oddTail->next = current;
                oddTail = oddTail->next;
            } else {
                evenTail->next = current;
                evenTail = evenTail->next;
            }
            isOdd = !isOdd;
            current = current->next;
        }
        
        oddTail->next = evenDummy.next;
        evenTail->next = nullptr;
        
        return oddDummy.next;
    }
};
```
<!-- slide -->
```java
class ListNode {
    int val;
    ListNode next;
    ListNode() {}
    ListNode(int val) { this.val = val; }
    ListNode(int val, ListNode next) { this.val = val; this.next = next; }
}

class Solution {
    public ListNode oddEvenList(ListNode head) {
        // Group odd-positioned nodes followed by even-positioned.
        // Time: O(n), Space: O(1)
        if (head == null || head.next == null) return head;
        
        ListNode oddDummy = new ListNode();
        ListNode evenDummy = new ListNode();
        ListNode oddTail = oddDummy, evenTail = evenDummy;
        ListNode current = head;
        boolean isOdd = true;
        
        while (current != null) {
            if (isOdd) {
                oddTail.next = current;
                oddTail = oddTail.next;
            } else {
                evenTail.next = current;
                evenTail = evenTail.next;
            }
            isOdd = !isOdd;
            current = current.next;
        }
        
        oddTail.next = evenDummy.next;
        evenTail.next = null;
        
        return oddDummy.next;
    }
}
```
<!-- slide -->
```javascript
function ListNode(val, next) {
    this.val = (val === undefined ? 0 : val);
    this.next = (next === undefined ? null : next);
}

function oddEvenList(head) {
    // Group odd-positioned nodes followed by even-positioned.
    // Time: O(n), Space: O(1)
    if (!head || !head.next) return head;
    
    const oddDummy = new ListNode();
    const evenDummy = new ListNode();
    let oddTail = oddDummy, evenTail = evenDummy;
    let current = head;
    let isOdd = true;
    
    while (current) {
        if (isOdd) {
            oddTail.next = current;
            oddTail = oddTail.next;
        } else {
            evenTail.next = current;
            evenTail = evenTail.next;
        }
        isOdd = !isOdd;
        current = current.next;
    }
    
    oddTail.next = evenDummy.next;
    evenTail.next = null;
    
    return oddDummy.next;
}
```
````

#### Time and Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(n) - single pass through the list |
| Space | O(1) - only pointer manipulation |

### Approach 2: Value-Based Partitioning

Partition list so nodes less than x come before nodes greater than or equal to x.

#### Implementation

````carousel
```python
def partition(head: ListNode, x: int) -> ListNode:
    """
    Partition list around value x.
    LeetCode 86 - Partition List
    Time: O(n), Space: O(1)
    """
    before_dummy = ListNode()
    after_dummy = ListNode()
    before_tail = before_dummy
    after_tail = after_dummy
    
    current = head
    while current:
        if current.val < x:
            before_tail.next = current
            before_tail = before_tail.next
        else:
            after_tail.next = current
            after_tail = after_tail.next
        current = current.next
    
    before_tail.next = after_dummy.next
    after_tail.next = None
    
    return before_dummy.next
```
<!-- slide -->
```cpp
class Solution {
public:
    ListNode* partition(ListNode* head, int x) {
        // Partition list around value x.
        ListNode beforeDummy, afterDummy;
        ListNode *beforeTail = &beforeDummy, *afterTail = &afterDummy;
        
        while (head) {
            if (head->val < x) {
                beforeTail->next = head;
                beforeTail = beforeTail->next;
            } else {
                afterTail->next = head;
                afterTail = afterTail->next;
            }
            head = head->next;
        }
        
        beforeTail->next = afterDummy.next;
        afterTail->next = nullptr;
        
        return beforeDummy.next;
    }
};
```
<!-- slide -->
```java
class Solution {
    public ListNode partition(ListNode head, int x) {
        // Partition list around value x.
        ListNode beforeDummy = new ListNode();
        ListNode afterDummy = new ListNode();
        ListNode beforeTail = beforeDummy, afterTail = afterDummy;
        
        while (head != null) {
            if (head.val < x) {
                beforeTail.next = head;
                beforeTail = beforeTail.next;
            } else {
                afterTail.next = head;
                afterTail = afterTail.next;
            }
            head = head.next;
        }
        
        beforeTail.next = afterDummy.next;
        afterTail.next = null;
        
        return beforeDummy.next;
    }
}
```
<!-- slide -->
```javascript
function partition(head, x) {
    // Partition list around value x.
    const beforeDummy = new ListNode();
    const afterDummy = new ListNode();
    let beforeTail = beforeDummy, afterTail = afterDummy;
    
    while (head) {
        if (head.val < x) {
            beforeTail.next = head;
            beforeTail = beforeTail.next;
        } else {
            afterTail.next = head;
            afterTail = afterTail.next;
        }
        head = head.next;
    }
    
    beforeTail.next = afterDummy.next;
    afterTail.next = null;
    
    return beforeDummy.next;
}
```
````

#### Time and Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(n) - single pass |
| Space | O(1) - only pointers |

## Complexity Analysis

| Approach | Time | Space | When to Use |
|----------|------|-------|-------------|
| Odd-Even Partition | O(n) | O(1) | Position-based grouping |
| Value-Based Partition | O(n) | O(1) | Pivot-based separation |
| Reorder (L0→Ln→L1→Ln-1) | O(n) | O(1) | Reordering pattern |

## Related Problems

| Problem | LeetCode # | Difficulty | Description |
|---------|------------|------------|-------------|
| [Odd Even Linked List](https://leetcode.com/problems/odd-even-linked-list/) | 328 | Medium | Group by position parity |
| [Partition List](https://leetcode.com/problems/partition-list/) | 86 | Medium | Partition by value |
| [Reorder List](https://leetcode.com/problems/reorder-list/) | 143 | Medium | L0→Ln→L1→Ln-1 pattern |
| [Swap Nodes in Pairs](https://leetcode.com/problems/swap-nodes-in-pairs/) | 24 | Medium | Swap adjacent nodes |
| [Reverse Linked List II](https://leetcode.com/problems/reverse-linked-list-ii/) | 92 | Medium | Reverse sublist |

## Video Tutorial Links

1. **[NeetCode - Odd Even Linked List](https://www.youtube.com/watch?v=C4guMZJ2EdQ)** - Position-based partitioning
2. **[Back To Back SWE - Partition List](https://www.youtube.com/watch?v=C4guMZJ2EdQ)** - Value-based partitioning
3. **[Kevin Naughton Jr. - LeetCode 328](https://www.youtube.com/watch?v=C4guMZJ2EdQ)** - Clean implementation
4. **[Nick White - Reorder List](https://www.youtube.com/watch?v=C4guMZJ2EdQ)** - Advanced reordering
5. **[Techdose - Partition List](https://www.youtube.com/watch?v=C4guMZJ2EdQ)** - Detailed walkthrough

## Summary

### Key Takeaways

- **Multiple dummy heads** simplify building separate partitions
- **Always maintain tail pointers** to append efficiently
- **Null-terminate the last partition** to prevent cycles
- **Relative order is preserved** within each partition
- **Single pass** achieves O(n) time for all partitioning patterns

### Common Pitfalls

1. Forgetting to null-terminate the last partition (creates cycles)
2. Not handling edge cases (empty list, single node)
3. Modifying the wrong partition's tail pointer
4. Returning the wrong dummy's next (return dummy, not dummy.next)
5. Not preserving relative order within partitions

### Follow-up Questions

1. **How would you partition into three groups (< x, = x, > x)?**
   - Use three dummy heads instead of two

2. **What if you need to maintain the original list order across partitions?**
   - This approach already maintains relative order within partitions

3. **How would you reverse the order within each partition?**
   - Use the in-place reversal technique while building partitions

4. **Can you do this without dummy nodes?**
   - Yes, but requires handling more edge cases for the first element of each partition

5. **How would you merge k sorted partitions?**
   - Similar approach: build k chains, then link them sequentially

## Pattern Source

[Reordering / Partitioning Pattern](patterns/linked-list-reordering-partitioning.md)
