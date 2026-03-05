# Linked List - Merging Two Sorted Lists

## Problem Description

The Merging Two Sorted Lists pattern combines two sorted linked lists into a single sorted linked list. This pattern is fundamental for merge sort algorithms and problems requiring integration of multiple ordered sequences. The approach maintains sorted order efficiently while reusing existing nodes.

### Key Characteristics

| Characteristic | Description |
|----------------|-------------|
| Time Complexity | O(n + m) - where n and m are lengths of the two lists |
| Space Complexity | O(1) auxiliary - reuses existing nodes |
| Input | Two sorted linked lists in ascending order |
| Output | A single sorted linked list containing all elements |
| Approach | Simultaneous traversal with pointer manipulation |

### When to Use

- Combining multiple sorted data sources
- Implementing merge sort for linked lists
- Problems requiring ordered union of sequences
- Streaming data integration where order matters
- As a subroutine in more complex algorithms (merge k lists)

## Intuition

The key insight is to always pick the smaller element from the front of either list and append it to the result.

The "aha!" moments:

1. **Two-pointer technique**: One pointer for each list, compare and advance
2. **Dummy node**: Simplifies handling the head of the result list
3. **In-place merging**: Reuse existing nodes by rewiring pointers
4. **Appending remainder**: Once one list is exhausted, append the rest of the other
5. **Sorted invariant**: Both input lists are sorted, so merged result remains sorted

## Solution Approaches

### Approach 1: Iterative with Dummy Node ✅ Recommended

#### Algorithm

1. Create a dummy node as the starting point of the merged list
2. Initialize a `current` pointer to the dummy node
3. While both lists have nodes:
   - Compare the current nodes of both lists
   - Append the smaller node to the merged list
   - Advance the pointer of the list from which the node was taken
   - Move `current` forward
4. Append the remaining nodes from the non-empty list
5. Return `dummy.next` as the head of the merged list

#### Implementation

````carousel
```python
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def merge_two_lists(l1: ListNode, l2: ListNode) -> ListNode:
    """
    Merge two sorted linked lists.
    LeetCode 21 - Merge Two Sorted Lists
    Time: O(n + m), Space: O(1)
    """
    dummy = ListNode()
    current = dummy
    
    while l1 and l2:
        if l1.val <= l2.val:
            current.next = l1
            l1 = l1.next
        else:
            current.next = l2
            l2 = l2.next
        current = current.next
    
    # Append remaining nodes
    current.next = l1 if l1 else l2
    
    return dummy.next
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
    ListNode* mergeTwoLists(ListNode* l1, ListNode* l2) {
        // Merge two sorted linked lists.
        // Time: O(n + m), Space: O(1)
        ListNode dummy;
        ListNode* current = &dummy;
        
        while (l1 && l2) {
            if (l1->val <= l2->val) {
                current->next = l1;
                l1 = l1->next;
            } else {
                current->next = l2;
                l2 = l2->next;
            }
            current = current->next;
        }
        
        current->next = l1 ? l1 : l2;
        return dummy.next;
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
    public ListNode mergeTwoLists(ListNode l1, ListNode l2) {
        // Merge two sorted linked lists.
        // Time: O(n + m), Space: O(1)
        ListNode dummy = new ListNode();
        ListNode current = dummy;
        
        while (l1 != null && l2 != null) {
            if (l1.val <= l2.val) {
                current.next = l1;
                l1 = l1.next;
            } else {
                current.next = l2;
                l2 = l2.next;
            }
            current = current.next;
        }
        
        current.next = (l1 != null) ? l1 : l2;
        return dummy.next;
    }
}
```
<!-- slide -->
```javascript
function ListNode(val, next) {
    this.val = (val === undefined ? 0 : val);
    this.next = (next === undefined ? null : next);
}

function mergeTwoLists(l1, l2) {
    // Merge two sorted linked lists.
    // Time: O(n + m), Space: O(1)
    const dummy = new ListNode();
    let current = dummy;
    
    while (l1 && l2) {
        if (l1.val <= l2.val) {
            current.next = l1;
            l1 = l1.next;
        } else {
            current.next = l2;
            l2 = l2.next;
        }
        current = current.next;
    }
    
    current.next = l1 || l2;
    return dummy.next;
}
```
````

#### Time and Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(n + m) - each node visited exactly once |
| Space | O(1) - only pointer manipulation, no new nodes created |

### Approach 2: Recursive Solution

A clean recursive approach that merges by choosing the smaller head and recursively merging the rest.

#### Implementation

````carousel
```python
def merge_two_lists_recursive(l1: ListNode, l2: ListNode) -> ListNode:
    """
    Merge two sorted linked lists recursively.
    Time: O(n + m), Space: O(n + m) for recursion stack
    """
    # Base cases
    if not l1:
        return l2
    if not l2:
        return l1
    
    # Choose smaller head and recursively merge
    if l1.val <= l2.val:
        l1.next = merge_two_lists_recursive(l1.next, l2)
        return l1
    else:
        l2.next = merge_two_lists_recursive(l1, l2.next)
        return l2
```
<!-- slide -->
```cpp
class Solution {
public:
    ListNode* mergeTwoLists(ListNode* l1, ListNode* l2) {
        // Recursive merge of two sorted linked lists.
        if (!l1) return l2;
        if (!l2) return l1;
        
        if (l1->val <= l2->val) {
            l1->next = mergeTwoLists(l1->next, l2);
            return l1;
        } else {
            l2->next = mergeTwoLists(l1, l2->next);
            return l2;
        }
    }
};
```
<!-- slide -->
```java
class Solution {
    public ListNode mergeTwoLists(ListNode l1, ListNode l2) {
        // Recursive merge of two sorted linked lists.
        if (l1 == null) return l2;
        if (l2 == null) return l1;
        
        if (l1.val <= l2.val) {
            l1.next = mergeTwoLists(l1.next, l2);
            return l1;
        } else {
            l2.next = mergeTwoLists(l1, l2.next);
            return l2;
        }
    }
}
```
<!-- slide -->
```javascript
function mergeTwoLists(l1, l2) {
    // Recursive merge of two sorted linked lists.
    if (!l1) return l2;
    if (!l2) return l1;
    
    if (l1.val <= l2.val) {
        l1.next = mergeTwoLists(l1.next, l2);
        return l1;
    } else {
        l2.next = mergeTwoLists(l1, l2.next);
        return l2;
    }
}
```
````

#### Time and Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(n + m) |
| Space | O(n + m) - recursion stack depth |

## Complexity Analysis

| Approach | Time | Space | When to Use |
|----------|------|-------|-------------|
| Iterative | O(n + m) | O(1) | **Recommended** - no recursion overhead |
| Recursive | O(n + m) | O(n + m) | For elegant, concise code |

## Related Problems

| Problem | LeetCode # | Difficulty | Description |
|---------|------------|------------|-------------|
| [Merge Two Sorted Lists](https://leetcode.com/problems/merge-two-sorted-lists/) | 21 | Easy | Basic merge operation |
| [Merge k Sorted Lists](https://leetcode.com/problems/merge-k-sorted-lists/) | 23 | Hard | Extend to k lists using divide-and-conquer |
| [Sort List](https://leetcode.com/problems/sort-list/) | 148 | Medium | Merge sort for linked lists |
| [Intersection of Two Linked Lists](https://leetcode.com/problems/intersection-of-two-linked-lists/) | 160 | Easy | Find common node |
| [Add Two Numbers](https://leetcode.com/problems/add-two-numbers/) | 2 | Medium | Related linked list manipulation |

## Video Tutorial Links

1. **[NeetCode - Merge Two Sorted Lists](https://www.youtube.com/watch?v=XIdigk956u0)** - Clear iterative and recursive solutions
2. **[Back To Back SWE - Merge Two Sorted Lists](https://www.youtube.com/watch?v=XIdigk956u0)** - Detailed explanation
3. **[Kevin Naughton Jr. - LeetCode 21](https://www.youtube.com/watch?v=XIdigk956u0)** - Clean implementation
4. **[Nick White - Merge k Sorted Lists](https://www.youtube.com/watch?v=XIdigk956u0)** - Extension to k lists
5. **[Techdose - Merge k Sorted Lists](https://www.youtube.com/watch?v=XIdigk956u0)** - Priority queue approach

## Summary

### Key Takeaways

- **Dummy node technique** eliminates special case handling for the head
- **In-place merging** reuses existing nodes for O(1) space complexity
- **Always append remainder** of the non-exhausted list at the end
- **Use `<=` for stable sort** to maintain relative order of equal elements
- **Recursive solution** is elegant but uses O(n+m) stack space

### Common Pitfalls

1. Forgetting to move the `current` pointer after appending a node
2. Not handling null list inputs at the beginning
3. Creating new nodes instead of rewiring pointers (unnecessary space usage)
4. Returning `dummy` instead of `dummy.next`
5. Not appending the remainder of the non-exhausted list

### Follow-up Questions

1. **How would you merge k sorted lists?**
   - Use divide-and-conquer (pairwise merge) or a min-heap

2. **What if you need to merge in descending order?**
   - Reverse both lists first, or change comparison to `>=`

3. **How would you merge without modifying the input lists?**
   - Create new nodes instead of rewiring pointers

4. **Can you solve this with O(1) space for k lists?**
   - Yes, using iterative pairwise merging

5. **What if the lists have cycles?**
   - Detect cycles first (Floyd's algorithm), break them, then merge

## Pattern Source

[Merging Two Sorted Lists Pattern](patterns/linked-list-merging-two-sorted-lists.md)
