# Merge Two Sorted Lists

## Category
Linked List

## Description
Merge two sorted linked lists into one sorted list.

---

## When to Use
Use this algorithm when you need to solve problems involving:
- linked list related operations
- Efficient traversal or search operations
- Optimization problems where this pattern applies

---

## Algorithm Explanation

Merge Two Sorted Lists is a classic linked list problem where we need to merge two already sorted linked lists into a single sorted linked list. The key insight is that since both input lists are already sorted, we can repeatedly pick the smaller of the two head nodes and attach it to the result list.

### Iterative Approach:
1. Create a dummy node to serve as the starting point of the merged list
2. Maintain a tail pointer that always points to the last node in the merged list
3. Compare nodes from both lists: pick the smaller one and attach it to the tail
4. Move the picked list's pointer forward
5. Continue until one list is exhausted
6. Attach the remaining nodes from the non-exhausted list

### Recursive Approach:
- Base cases: if either list is null, return the other list
- Recursive case: compare heads, the smaller becomes the next node of the recursive call
- Time complexity: O(n + m) for both approaches
- Space complexity: O(1) for iterative (excluding recursion stack O(n + m))

The iterative approach is generally preferred as it avoids recursive call overhead and stack space.

---

## Algorithm Steps
1. Create a dummy node with value 0 (or any placeholder)
2. Initialize tail pointer to dummy node
3. While both lists have nodes:
   - Compare current nodes from both lists
   - Attach the smaller node to tail
   - Move the chosen list's pointer forward
4. Attach any remaining nodes from the non-empty list
5. Return dummy.next (skip the dummy node)

---

## Implementation

```python
class ListNode:
    """Definition for singly-linked list node."""
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next


def merge_two_lists(list1: ListNode, list2: ListNode) -> ListNode:
    """
    Merge two sorted linked lists into one sorted list.
    
    Args:
        list1: Head of first sorted linked list
        list2: Head of second sorted linked list
        
    Returns:
        Head of the merged sorted linked list
        
    Time: O(n + m)
    Space: O(1)
    """
    # Create dummy node to simplify edge cases
    dummy = ListNode(-1)
    tail = dummy
    
    # Compare and merge nodes from both lists
    while list1 and list2:
        if list1.val <= list2.val:
            tail.next = list1
            list1 = list1.next
        else:
            tail.next = list2
            list2 = list2.next
        tail = tail.next
    
    # Attach remaining nodes from list1 (if any)
    if list1:
        tail.next = list1
    
    # Attach remaining nodes from list2 (if any)
    if list2:
        tail.next = list2
    
    return dummy.next


# Helper function to create linked list from list
def create_linked_list(arr: list) -> ListNode:
    """Create a linked list from a Python list."""
    if not arr:
        return None
    dummy = ListNode(0)
    current = dummy
    for val in arr:
        current.next = ListNode(val)
        current = current.next
    return dummy.next


# Helper function to convert linked list to Python list
def linked_list_to_list(node: ListNode) -> list:
    """Convert a linked list to Python list for display."""
    result = []
    while node:
        result.append(node.val)
        node = node.next
    return result
```

```javascript
function mergeSortedLists() {
    // Merge Two Sorted Lists implementation
    // Time: O(n + m)
    // Space: O(1)
}
```

---

## Example

**Input:**
```python
# Create two sorted linked lists:
# List 1: 1 -> 2 -> 4
# List 2: 1 -> 3 -> 4

list1 = create_linked_list([1, 2, 4])
list2 = create_linked_list([1, 3, 4])

# Merge them
result = merge_two_lists(list1, list2)
print(linked_list_to_list(result))
```

**Output:**
```
[1, 1, 2, 3, 4, 4]
```

**Explanation:**
- We compare nodes from both lists: 1 vs 1 (equal, pick from list1)
- Result: 1 -> list1 advances to 2
- Compare 2 vs 1, pick 1 from list2
- Result: 1 -> 1 -> list2 advances to 3
- Compare 2 vs 3, pick 2 from list1
- Result: 1 -> 1 -> 2 -> list1 advances to 4
- Compare 4 vs 3, pick 3 from list2
- Result: 1 -> 1 -> 2 -> 3 -> list2 advances to 4
- Compare 4 vs 4, pick 4 from list1
- Result: 1 -> 1 -> 2 -> 3 -> 4 -> list1 exhausted
- Attach remaining list2 node (4)
- Final: 1 -> 1 -> 2 -> 3 -> 4 -> 4

---

## Time Complexity
**O(n + m)**

---

## Space Complexity
**O(1)**

---

## Common Variations
- Iterative vs Recursive implementation
- Space-optimized versions
- Modified versions for specific constraints

---

## Related Problems
- Practice problems that use this algorithm pattern
- Similar algorithms in the same category

---

## Tips
- Always consider edge cases
- Think about time vs space trade-offs
- Look for opportunities to optimize
