# Linked List - Intersection Detection

## Problem Description

The **Linked List - Intersection Detection** pattern is used to identify if a linked list contains a cycle (where a node points back to a previous node, creating a loop), or to find the intersection point of two linked lists. This pattern is crucial for validating linked list integrity and preventing infinite loops during traversal.

### Key Characteristics

| Characteristic | Description |
|----------------|-------------|
| **Input** | Head of linked list(s) |
| **Output** | Boolean (has cycle) or intersection node |
| **Key Insight** | Use two pointers moving at different speeds (Floyd's Cycle Detection) |
| **Time Complexity** | O(n) - single pass through the list |
| **Space Complexity** | O(1) - only two pointers |

### When to Use

- **Cycle detection**: Checking if a linked list has a loop/cycle
- **Finding cycle start**: Locating where the cycle begins in the list
- **Intersection of two lists**: Finding where two linked lists merge
- **Duplicate detection**: Identifying repeated elements in a sequence
- **Happy Number problem**: Detecting cycles in number transformations

---

## Intuition

### Core Insight

The key insight behind Floyd's Cycle Detection algorithm is that **if there's a cycle, two pointers moving at different speeds will eventually meet**:

1. **Two pointers**: `slow` moves 1 step at a time, `fast` moves 2 steps at a time
2. **Meeting condition**: If there's a cycle, `fast` will eventually catch up to `slow`
3. **No cycle**: If `fast` reaches null, there's no cycle
4. **Finding start**: Once they meet, reset one pointer to head and move both at same speed

### The "Aha!" Moments

1. **Why do they meet if there's a cycle?** In a cycle, `fast` gains 1 step on `slow` each iteration. Eventually, `fast` will lap `slow` and they meet.

2. **How do you find the cycle start?** Once `slow` and `fast` meet, reset `slow` to head. Move both at 1 step each. They'll meet at the cycle start. This is because: distance(head to start) = distance(meeting point to start).

3. **What about two list intersection?** If two lists intersect, they share the same tail. Make both pointers traverse both lists (switching when reaching end), they'll meet at intersection.

### Cycle Detection Visualization

```
List with cycle: 1 → 2 → 3 → 4 → 5
                     ↑_________|

Step 1: slow=1, fast=1
Step 2: slow=2, fast=3
Step 3: slow=3, fast=5
Step 4: slow=4, fast=4 ← MEET! (cycle detected)

To find start:
- Reset slow to head (1), keep fast at meeting point (4)
- Move both at 1 step: slow=1→2→3, fast=4→5→3
- They meet at 3, which is the cycle start!
```

---

## Solution Approaches

### Approach 1: Floyd's Cycle Detection (Fast & Slow Pointers) ⭐

The classic two-pointer approach for detecting cycles in O(1) space.

#### Algorithm

1. **Initialize**: `slow = head`, `fast = head` (or `head.next`)
2. **Move pointers**: 
   - `slow = slow.next` (1 step)
   - `fast = fast.next.next` (2 steps)
3. **Check for meeting**: If `slow == fast`, cycle detected
4. **Check for end**: If `fast` or `fast.next` is null, no cycle

#### Implementation

````carousel
```python
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def has_cycle(head: ListNode) -> bool:
    """
    Detect if linked list has a cycle using Floyd's algorithm.
    
    Args:
        head: Head of the linked list
        
    Returns:
        True if cycle exists, False otherwise
    """
    if not head or not head.next:
        return False
    
    slow = head
    fast = head.next  # or head (both work with different loop condition)
    
    while fast and fast.next:
        if slow == fast:
            return True
        slow = slow.next
        fast = fast.next.next
    
    return False


def detect_cycle_start(head: ListNode) -> ListNode:
    """
    Find the node where the cycle begins.
    Returns None if no cycle.
    """
    if not head or not head.next:
        return None
    
    # Phase 1: Detect if cycle exists
    slow = fast = head
    has_cycle = False
    
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        if slow == fast:
            has_cycle = True
            break
    
    if not has_cycle:
        return None
    
    # Phase 2: Find cycle start
    slow = head
    while slow != fast:
        slow = slow.next
        fast = fast.next
    
    return slow


def find_cycle_length(head: ListNode) -> int:
    """
    Find the length of the cycle if it exists.
    """
    if not head or not head.next:
        return 0
    
    slow = fast = head
    
    # Find meeting point
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        if slow == fast:
            break
    else:
        return 0  # No cycle
    
    # Count cycle length
    length = 1
    fast = fast.next
    while fast != slow:
        fast = fast.next
        length += 1
    
    return length
```

<!-- slide -->
```cpp
struct ListNode {
    int val;
    ListNode *next;
    ListNode(int x) : val(x), next(NULL) {}
};

class Solution {
public:
    bool hasCycle(ListNode *head) {
        if (!head || !head->next) return false;
        
        ListNode *slow = head;
        ListNode *fast = head->next;
        
        while (fast && fast->next) {
            if (slow == fast) return true;
            slow = slow->next;
            fast = fast->next->next;
        }
        
        return false;
    }
    
    ListNode *detectCycle(ListNode *head) {
        if (!head || !head->next) return nullptr;
        
        ListNode *slow = head;
        ListNode *fast = head;
        bool hasCycle = false;
        
        while (fast && fast->next) {
            slow = slow->next;
            fast = fast->next->next;
            if (slow == fast) {
                hasCycle = true;
                break;
            }
        }
        
        if (!hasCycle) return nullptr;
        
        slow = head;
        while (slow != fast) {
            slow = slow->next;
            fast = fast->next;
        }
        
        return slow;
    }
};
```

<!-- slide -->
```java
class ListNode {
    int val;
    ListNode next;
    ListNode(int x) {
        val = x;
        next = null;
    }
}

public class Solution {
    public boolean hasCycle(ListNode head) {
        if (head == null || head.next == null) return false;
        
        ListNode slow = head;
        ListNode fast = head.next;
        
        while (fast != null && fast.next != null) {
            if (slow == fast) return true;
            slow = slow.next;
            fast = fast.next.next;
        }
        
        return false;
    }
    
    public ListNode detectCycle(ListNode head) {
        if (head == null || head.next == null) return null;
        
        ListNode slow = head;
        ListNode fast = head;
        boolean hasCycle = false;
        
        while (fast != null && fast.next != null) {
            slow = slow.next;
            fast = fast.next.next;
            if (slow == fast) {
                hasCycle = true;
                break;
            }
        }
        
        if (!hasCycle) return null;
        
        slow = head;
        while (slow != fast) {
            slow = slow.next;
            fast = fast.next;
        }
        
        return slow;
    }
}
```

<!-- slide -->
```javascript
/**
 * Definition for singly-linked list.
 * function ListNode(val) {
 *     this.val = val;
 *     this.next = null;
 * }
 */

/**
 * @param {ListNode} head
 * @return {boolean}
 */
var hasCycle = function(head) {
    if (!head || !head.next) return false;
    
    let slow = head;
    let fast = head.next;
    
    while (fast && fast.next) {
        if (slow === fast) return true;
        slow = slow.next;
        fast = fast.next.next;
    }
    
    return false;
};

/**
 * @param {ListNode} head
 * @return {ListNode}
 */
var detectCycle = function(head) {
    if (!head || !head.next) return null;
    
    let slow = head;
    let fast = head;
    let hasCycle = false;
    
    while (fast && fast.next) {
        slow = slow.next;
        fast = fast.next.next;
        if (slow === fast) {
            hasCycle = true;
            break;
        }
    }
    
    if (!hasCycle) return null;
    
    slow = head;
    while (slow !== fast) {
        slow = slow.next;
        fast = fast.next;
    }
    
    return slow;
};
```
````

---

### Approach 2: Two List Intersection

Finding the intersection node of two linked lists using the two-pointer technique.

#### Algorithm

1. **Initialize**: `p1 = headA`, `p2 = headB`
2. **Traverse both lists**:
   - When `p1` reaches end, redirect to `headB`
   - When `p2` reaches end, redirect to `headA`
3. **They will meet** at intersection point (or both null if no intersection)

#### Implementation

````carousel
```python
def get_intersection_node(headA: ListNode, headB: ListNode) -> ListNode:
    """
    Find intersection node of two linked lists.
    Returns None if no intersection.
    """
    if not headA or not headB:
        return None
    
    p1, p2 = headA, headB
    
    while p1 != p2:
        p1 = p1.next if p1 else headB
        p2 = p2.next if p2 else headA
    
    return p1  # Returns intersection node or None


def get_intersection_node_with_length(headA: ListNode, headB: ListNode) -> ListNode:
    """
    Alternative: Calculate lengths, advance longer list, then compare.
    """
    def get_length(head):
        length = 0
        while head:
            length += 1
            head = head.next
        return length
    
    lenA, lenB = get_length(headA), get_length(headB)
    
    # Advance the longer list
    while lenA > lenB:
        headA = headA.next
        lenA -= 1
    while lenB > lenA:
        headB = headB.next
        lenB -= 1
    
    # Compare nodes
    while headA != headB:
        headA = headA.next
        headB = headB.next
    
    return headA
```

<!-- slide -->
```cpp
ListNode *getIntersectionNode(ListNode *headA, ListNode *headB) {
    if (!headA || !headB) return nullptr;
    
    ListNode *p1 = headA;
    ListNode *p2 = headB;
    
    while (p1 != p2) {
        p1 = p1 ? p1->next : headB;
        p2 = p2 ? p2->next : headA;
    }
    
    return p1;
}
```

<!-- slide -->
```java
public ListNode getIntersectionNode(ListNode headA, ListNode headB) {
    if (headA == null || headB == null) return null;
    
    ListNode p1 = headA;
    ListNode p2 = headB;
    
    while (p1 != p2) {
        p1 = (p1 == null) ? headB : p1.next;
        p2 = (p2 == null) ? headA : p2.next;
    }
    
    return p1;
}
```

<!-- slide -->
```javascript
/**
 * @param {ListNode} headA
 * @param {ListNode} headB
 * @return {ListNode}
 */
var getIntersectionNode = function(headA, headB) {
    if (!headA || !headB) return null;
    
    let p1 = headA;
    let p2 = headB;
    
    while (p1 !== p2) {
        p1 = p1 ? p1.next : headB;
        p2 = p2 ? p2.next : headA;
    }
    
    return p1;
};
```
````

---

### Approach 3: Hash Set Approach

Alternative using extra space but simpler logic.

#### Implementation

````carousel
```python
def has_cycle_hash_set(head: ListNode) -> bool:
    """
    Detect cycle using hash set - O(n) space.
    """
    visited = set()
    current = head
    
    while current:
        if current in visited:
            return True
        visited.add(current)
        current = current.next
    
    return False


def get_intersection_node_hash(headA: ListNode, headB: ListNode) -> ListNode:
    """
    Find intersection using hash set.
    """
    visited = set()
    
    current = headA
    while current:
        visited.add(current)
        current = current.next
    
    current = headB
    while current:
        if current in visited:
            return current
        current = current.next
    
    return None
```

<!-- slide -->
```cpp
bool hasCycleHash(ListNode *head) {
    unordered_set<ListNode*> visited;
    
    while (head) {
        if (visited.count(head)) return true;
        visited.insert(head);
        head = head->next;
    }
    
    return false;
}
```

<!-- slide -->
```java
public boolean hasCycleHash(ListNode head) {
    Set<ListNode> visited = new HashSet<>();
    
    while (head != null) {
        if (visited.contains(head)) return true;
        visited.add(head);
        head = head.next;
    }
    
    return false;
}
```

<!-- slide -->
```javascript
var hasCycleHash = function(head) {
    const visited = new Set();
    
    while (head) {
        if (visited.has(head)) return true;
        visited.add(head);
        head = head.next;
    }
    
    return false;
};
```
````

---

## Complexity Analysis

| Approach | Time Complexity | Space Complexity | Best For |
|----------|----------------|------------------|----------|
| **Floyd's (Fast/Slow)** | O(n) | O(1) | **General use** - no extra space |
| **Two List Intersection** | O(n + m) | O(1) | Finding merge point of two lists |
| **Hash Set** | O(n) | O(n) | Simplicity, when space allows |

**Where:**
- `n` = length of first list
- `m` = length of second list (for intersection)

---

## Related Problems

### Easy Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| **Linked List Cycle** | [Link](https://leetcode.com/problems/linked-list-cycle/) | Basic cycle detection |
| **Intersection of Two Linked Lists** | [Link](https://leetcode.com/problems/intersection-of-two-linked-lists/) | Find merge point |
| **Middle of the Linked List** | [Link](https://leetcode.com/problems/middle-of-the-linked-list/) | Fast/slow pointer pattern |
| **Happy Number** | [Link](https://leetcode.com/problems/happy-number/) | Cycle in number transformation |

### Medium Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| **Linked List Cycle II** | [Link](https://leetcode.com/problems/linked-list-cycle-ii/) | Find cycle start |
| **Palindrome Linked List** | [Link](https://leetcode.com/problems/palindrome-linked-list/) | Fast/slow to find middle |
| **Reorder List** | [Link](https://leetcode.com/problems/reorder-list/) | Find middle + reverse + merge |
| **Remove Nth Node From End** | [Link](https://leetcode.com/problems/remove-nth-node-from-end-of-list/) | Fast/slow with gap |

### Hard Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| **Find the Duplicate Number** | [Link](https://leetcode.com/problems/find-the-duplicate-number/) | Array as linked list + Floyd's |

---

## Video Tutorial Links

1. [Linked List Cycle - NeetCode](https://www.youtube.com/watch?v=gBTe7lFR3vc) - Floyd's algorithm explained
2. [Intersection of Two Linked Lists](https://www.youtube.com/watch?v=D0X0BONOQhI) - Two-pointer technique
3. [Fast and Slow Pointers Pattern](https://www.youtube.com/watch?v=5mEwhZqDs4A) - General pattern
4. [Happy Number and Cycle Detection](https://www.youtube.com/watch?v=9YTjXqqJEFE) - Applications

---

## Summary

### Key Takeaways

1. **Floyd's Cycle Detection**: Two pointers (slow=1x, fast=2x) will meet if there's a cycle
2. **Finding cycle start**: After meeting, reset one to head, move both at 1x speed
3. **Two list intersection**: Traverse both lists, switch heads when reaching end
4. **O(1) space is possible**: Both problems solvable without extra space
5. **Fast/slow pattern is versatile**: Also used for finding middle, removing nth from end

### Common Pitfalls

| Pitfall | Solution |
|---------|----------|
| **Null checks** | Always check `head` and `head.next` before starting |
| **Fast pointer null check** | Check both `fast` and `fast.next` in while condition |
| **Wrong initialization** | Start `fast` at `head` or `head.next` depending on approach |
| **Infinite loop** | Ensure pointers always advance in cycle detection |
| **Modifying the list** | Don't change `next` pointers unless necessary |

### Follow-up Questions

**Q1: Why does the math work for finding cycle start?**

Let: a = distance from head to cycle start, b = distance from start to meeting point, c = distance from meeting point back to start.
- Slow travels: a + b
- Fast travels: a + b + c + b = a + 2b + c
- Since fast is 2x: 2(a + b) = a + 2b + c → a = c
- So distance from head to start equals distance from meeting point to start

**Q2: How do you find the length of the cycle?**

Once slow and fast meet, keep one pointer fixed and move the other until they meet again, counting steps.

**Q3: Can you use this for arrays?**

Yes! Treat array values as next pointers. This is how "Find the Duplicate Number" works - array values point to indices.

**Q4: What if the list has a very long tail before the cycle?**

Floyd's algorithm still works in O(n) time. The slow pointer will reach the cycle, and fast will eventually catch up.

---

## Pattern Source

For more linked list patterns, see:
- **[Linked List - In-Place Reversal](/patterns/linked-list-in-place-reversal)**
- **[Linked List - Merge Two Sorted](/patterns/linked-list-merging-two-sorted-lists)**
- **[Two Pointers - Fast/Slow](/patterns/two-pointers-fast-slow-cycle-detection)**
- **[Linked List Cycle Solution](/solutions/linked-list-cycle)**

---

## Additional Resources

- [LeetCode Linked List Cycle](https://leetcode.com/problems/linked-list-cycle/)
- [LeetCode Intersection of Two Linked Lists](https://leetcode.com/problems/intersection-of-two-linked-lists/)
- [Floyd's Cycle Detection - Wikipedia](https://en.wikipedia.org/wiki/Cycle_detection)
- [GeeksforGeeks - Detect Loop](https://www.geeksforgeeks.org/detect-loop-in-a-linked-list/)
