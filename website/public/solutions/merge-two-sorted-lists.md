# Merge Two Sorted Lists

## Problem Description

You are given the heads of two sorted linked lists `list1` and `list2`.

Merge the two lists into one sorted list. The list should be made by splicing together the nodes of the first two lists.

Return the head of the merged linked list.

**Link to problem:** [Merge Two Sorted Lists - LeetCode 21](https://leetcode.com/problems/merge-two-sorted-lists/)

## Constraints
- The number of nodes in both lists is in the range [0, 50]
- `-100 <= Node.val <= 100`
- Both `list1` and `list2` are sorted in non-decreasing order

---

## Pattern: Linked List - Merge

This problem is a classic example of the **Merge Two Sorted Lists** pattern. The pattern involves comparing elements from two sorted sequences and building a merged sorted sequence.

### Core Concept

- **Dummy Node**: Use a dummy node to simplify edge cases
- **Comparison**: Compare nodes from both lists and attach the smaller one
- **Iterate**: Continue until one list is exhausted
- **Attach Remaining**: Attach remaining nodes from the non-exhausted list

---

## Examples

### Example

**Input:**
```
list1 = [1,2,4], list2 = [1,3,4]
```

**Output:**
```
[1,1,2,3,4,4]
```

**Explanation:**
```
1 → 2 → 4
1 → 3 → 4
─────────
1 → 1 → 2 → 3 → 4 → 4
```

### Example 2: Both Empty

**Input:**
```
list1 = [], list2 = []
```

**Output:**
```
[]
```

### Example 3: One Empty

**Input:**
```
list1 = [], list2 = [0]
```

**Output:**
```
[0]
```

### Example 4: Single Elements

**Input:**
```
list1 = [1], list2 = [2]
```

**Output:**
```
[1,2]
```

---

## Intuition

The key insight is that both input lists are already sorted. We can build the result by always choosing the smaller of the two current nodes:

1. **Iterative Approach**: Use two pointers and a dummy node
2. **Recursive Approach**: Recursively merge smaller heads
3. **In-Place**: Modify pointers without extra allocation

The iterative approach is preferred for its O(1) space complexity, while recursion provides a clean, elegant solution.

---

## Multiple Approaches with Code

We'll cover three approaches:

1. **Iterative with Dummy Node (Optimal)** - O(n + m) time, O(1) space
2. **Recursive** - O(n + m) time, O(n + m) space
3. **In-Place Merge** - O(n + m) time, O(1) space

---

## Approach 1: Iterative with Dummy Node (Optimal)

This is the standard optimal solution with O(1) extra space.

### Algorithm Steps

1. Create a dummy node to simplify head handling
2. Maintain a pointer to the current end of the result list
3. Compare nodes from both lists and attach the smaller one
4. Continue until one list is exhausted
5. Attach remaining nodes from the other list

### Why It Works

The dummy node acts as a placeholder for the start, eliminating the need for special-case handling for the first node. We always pick the smaller current node, maintaining sorted order.

### Code Implementation

````carousel
```python
from typing import Optional

# Definition for singly-linked list.
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

class Solution:
    def mergeTwoLists(self, list1: Optional[ListNode], list2: Optional[ListNode]) -> Optional[ListNode]:
        """
        Merge two sorted linked lists iteratively.
        
        Args:
            list1: First sorted linked list
            list2: Second sorted linked list
            
        Returns:
            Head of merged sorted list
        """
        # Dummy node simplifies head handling
        dummy = ListNode(-1)
        current = dummy
        
        # Compare and merge
        while list1 and list2:
            if list1.val <= list2.val:
                current.next = list1
                list1 = list1.next
            else:
                current.next = list2
                list2 = list2.next
            current = current.next
        
        # Attach remaining nodes
        current.next = list1 or list2
        
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
    ListNode* mergeTwoLists(ListNode* list1, ListNode* list2) {
        // Dummy node
        ListNode dummy(-1);
        ListNode* current = &dummy;
        
        // Compare and merge
        while (list1 && list2) {
            if (list1->val <= list2->val) {
                current->next = list1;
                list1 = list1->next;
            } else {
                current->next = list2;
                list2 = list2->next;
            }
            current = current->next;
        }
        
        // Attach remaining nodes
        current->next = list1 ? list1 : list2;
        
        return dummy.next;
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
    public ListNode mergeTwoLists(ListNode list1, ListNode list2) {
        // Dummy node
        ListNode dummy = new ListNode(-1);
        ListNode current = dummy;
        
        // Compare and merge
        while (list1 != null && list2 != null) {
            if (list1.val <= list2.val) {
                current.next = list1;
                list1 = list1.next;
            } else {
                current.next = list2;
                list2 = list2.next;
            }
            current = current.next;
        }
        
        // Attach remaining nodes
        current.next = (list1 != null) ? list1 : list2;
        
        return dummy.next;
    }
}
```

<!-- slide -->
```javascript
/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val);
 *     this.next = (next===undefined ? null : next);
 * }
 */
/**
 * @param {ListNode} list1
 * @param {ListNode} list2
 * @return {ListNode}
 */
var mergeTwoLists = function(list1, list2) {
    // Dummy node
    const dummy = new ListNode(-1);
    let current = dummy;
    
    // Compare and merge
    while (list1 && list2) {
        if (list1.val <= list2.val) {
            current.next = list1;
            list1 = list1.next;
        } else {
            current.next = list2;
            list2 = list2.next;
        }
        current = current.next;
    }
    
    // Attach remaining nodes
    current.next = list1 || list2;
    
    return dummy.next;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n + m) - each node visited once |
| **Space** | O(1) - only pointers used (excluding output) |

---

## Approach 2: Recursive

A clean, elegant solution using recursion.

### Algorithm Steps

1. Base cases: if either list is null, return the other
2. Compare heads of both lists
3. Recursively merge the smaller head with the result of merging remaining lists

### Code Implementation

````carousel
```python
from typing import Optional

class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

class Solution:
    def mergeTwoLists_recursive(self, list1: Optional[ListNode], list2: Optional[ListNode]) -> Optional[ListNode]:
        """
        Merge using recursion.
        """
        # Base cases
        if not list1:
            return list2
        if not list2:
            return list1
        
        # Choose smaller head and recursively merge
        if list1.val <= list2.val:
            list1.next = self.mergeTwoLists_recursive(list1.next, list2)
            return list1
        else:
            list2.next = self.mergeTwoLists_recursive(list1, list2.next)
            return list2
```

<!-- slide -->
```cpp
class Solution {
public:
    ListNode* mergeTwoLists(ListNode* list1, ListNode* list2) {
        // Base cases
        if (!list1) return list2;
        if (!list2) return list1;
        
        // Choose smaller and recurse
        if (list1->val <= list2->val) {
            list1->next = mergeTwoLists(list1->next, list2);
            return list1;
        } else {
            list2->next = mergeTwoLists(list1, list2->next);
            return list2;
        }
    }
};
```

<!-- slide -->
```java
class Solution {
    public ListNode mergeTwoLists(ListNode list1, ListNode list2) {
        // Base cases
        if (list1 == null) return list2;
        if (list2 == null) return list1;
        
        // Choose smaller and recurse
        if (list1.val <= list2.val) {
            list1.next = mergeTwoLists(list1.next, list2);
            return list1;
        } else {
            list2.next = mergeTwoLists(list1, list2.next);
            return list2;
        }
    }
}
```

<!-- slide -->
```javascript
var mergeTwoLists = function(list1, list2) {
    // Base cases
    if (!list1) return list2;
    if (!list2) return list1;
    
    // Choose smaller and recurse
    if (list1.val <= list2.val) {
        list1.next = mergeTwoLists(list1.next, list2);
        return list1;
    } else {
        list2.next = mergeTwoLists(list1, list2.next);
        return list2;
    }
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n + m) - each node visited once |
| **Space** | O(n + m) - recursion stack depth |

---

## Approach 3: In-Place Merge

Merge without creating new nodes by rearranging existing pointers.

### Code Implementation

````carousel
```python
from typing import Optional

class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

class Solution:
    def mergeTwoLists_inplace(self, list1: Optional[ListNode], list2: Optional[ListNode]) -> Optional[ListNode]:
        """
        In-place merge by rearranging pointers.
        """
        if not list1:
            return list2
        if not list2:
            return list1
        
        # Ensure list1 starts with smaller value
        if list1.val > list2.val:
            list1, list2 = list2, list1
        
        head = list1
        while list1.next and list2:
            if list1.next.val <= list2.val:
                list1 = list1.next
            else:
                # Insert list2 node between list1 and list1.next
                temp = list2
                list2 = list2.next
                temp.next = list1.next
                list1.next = temp
                list1 = list1.next
        
        # Attach remaining list2 if any
        if not list1.next:
            list1.next = list2
        
        return head
```

<!-- slide -->
```cpp
class Solution {
public:
    ListNode* mergeTwoLists(ListNode* list1, ListNode* list2) {
        if (!list1) return list2;
        if (!list2) return list1;
        
        // Ensure list1 starts smaller
        if (list1->val > list2->val) swap(list1, list2);
        
        ListNode* head = list1;
        while (list1->next && list2) {
            if (list1->next->val <= list2->val) {
                list1 = list1->next;
            } else {
                ListNode* temp = list2;
                list2 = list2->next;
                temp->next = list1->next;
                list1->next = temp;
                list1 = list1->next;
            }
        }
        
        if (!list1->next) list1->next = list2;
        return head;
    }
};
```

<!-- slide -->
```java
class Solution {
    public ListNode mergeTwoLists(ListNode list1, ListNode list2) {
        if (list1 == null) return list2;
        if (list2 == null) return list1;
        
        // Ensure list1 starts smaller
        if (list1.val > list2.val) {
            ListNode temp = list1;
            list1 = list2;
            list2 = temp;
        }
        
        ListNode head = list1;
        while (list1.next != null && list2 != null) {
            if (list1.next.val <= list2.val) {
                list1 = list1.next;
            } else {
                ListNode temp = list2;
                list2 = list2.next;
                temp.next = list1.next;
                list1.next = temp;
                list1 = list1.next;
            }
        }
        
        if (list1.next == null) list1.next = list2;
        return head;
    }
}
```

<!-- slide -->
```javascript
var mergeTwoLists = function(list1, list2) {
    if (!list1) return list2;
    if (!list2) return list1;
    
    // Ensure list1 starts smaller
    if (list1.val > list2.val) {
        [list1, list2] = [list2, list1];
    }
    
    const head = list1;
    while (list1.next && list2) {
        if (list1.next.val <= list2.val) {
            list1 = list1.next;
        } else {
            const temp = list2;
            list2 = list2.next;
            temp.next = list1.next;
            list1.next = temp;
            list1 = list1.next;
        }
    }
    
    if (!list1.next) list1.next = list2;
    return head;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n + m) - each node visited at most once |
| **Space** | O(1) - no extra allocation |

---

## Comparison of Approaches

| Aspect | Iterative | Recursive | In-Place |
|--------|-----------|-----------|----------|
| **Time** | O(n + m) | O(n + m) | O(n + m) |
| **Space** | O(1) | O(n + m) | O(1) |
| **Implementation** | Simple | Elegant | Complex |
| **LeetCode Optimal** | ✅ Yes | ✅ Yes | ✅ Yes |

**Best Approach:** Iterative with dummy node is recommended for its simplicity and O(1) space.

---

## Related Problems

### Easy Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Merge Sorted Array | [Link](https://leetcode.com/problems/merge-sorted-array/) | Merge arrays instead of lists |

### Medium Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Merge K Sorted Lists | [Link](https://leetcode.com/problems/merge-k-sorted-lists/) | Merge k sorted lists |
| Sort List | [Link](https://leetcode.com/problems/sort-list/) | Sort linked list |

---

## Video Tutorial Links

### Solution Approaches

- [NeetCode - Merge Two Sorted Lists](https://www.youtube.com/watch?v=OGJmWhroVjc) - Clear explanation
- [Iterative Solution Walkthrough](https://www.youtube.com/watch?v=8Q1nQkVGYQ8) - Step-by-step
- [Recursive Solution](https://www.youtube.com/watch?v=8hQPLSSjkMY) - Understanding recursion

### Related Content

- [Linked List Basics](https://www.youtube.com/watch?v=8hQPLSSjkMY) - Understanding linked lists
- [Merge Sort for Linked Lists](https://www.youtube.com/watch?v=8Q1nQkVGYQ8) - Sorting application

---

## Follow-up Questions

### Q1: Why use a dummy node?

**Answer:** The dummy node simplifies handling the head of the merged list. Without it, you'd need special-case code for the first node insertion. It provides a stable starting point for the result list.

---

### Q2: Can you do it without a dummy node?

**Answer:** Yes, you can track the head manually and handle the first insertion separately. However, this adds complexity and the dummy node solution is cleaner.

---

### Q3: What if you need to merge in descending order?

**Answer:** Simply reverse both lists first, use the same merge algorithm, then reverse the result. Or change the comparison from `<=` to `>=`.

---

### Q4: How would you handle very large lists efficiently?

**Answer:** The iterative approach with O(1) space is ideal for large lists. The recursion would cause stack overflow for very long lists.

---

### Q5: What edge cases should be tested?

**Answer:**
- Both lists empty
- One list empty
- Both have single elements
- Lists with duplicate values
- Lists of vastly different lengths
- Negative values in lists

---

### Q6: How does this relate to merge sort?

**Answer:** This algorithm is the core merge step of merge sort for linked lists. It's also used in the merge phase of many divide-and-conquer algorithms.

---

### Q7: Can you merge more than two lists?

**Answer:** Yes, use a min-heap to track the smallest element from each list (similar to merge k sorted lists problem).

---

### Q8: How would you implement for arrays instead of linked lists?

**Answer:** The algorithm is similar but you need to handle array indices. See "Merge Sorted Array" problem.

---

## Common Pitfalls

### 1. Not Handling Null Lists
**Issue**: Forgetting to check if either list is null

**Solution**: Always check for null before accessing list properties

### 2. Forgetting Remaining Nodes
**Issue**: Not attaching remaining nodes after one list is exhausted

**Solution**: Add `current.next = list1 or list2` at the end

### 3. Infinite Loop
**Issue**: Not advancing pointers correctly in the loop

**Solution**: Always advance both `current` and the selected list pointer

### 4. Space Complexity
**Issue**: Creating new nodes instead of rearranging pointers

**Solution**: Reuse existing nodes by redirecting pointers

---

## Summary

The **Merge Two Sorted Lists** problem demonstrates fundamental linked list manipulation:

- **Iterative**: Optimal O(n + m) with O(1) space
- **Recursive**: Elegant O(n + m) but uses O(n + m) stack space
- **In-Place**: Achieves O(1) space by rearranging pointers

The iterative approach with dummy node is the standard solution due to its simplicity and optimal space complexity.

### Pattern Summary

This problem exemplifies the **Linked List Merge** pattern, which is characterized by:
- Using a dummy node to simplify edge cases
- Comparing elements from sorted sequences
- Building result by linking nodes
- Attaching remaining elements at the end

For more details on linked list patterns, see the **[Linked List Basics](/patterns/linked-list)**.

---

## Additional Resources

- [LeetCode Problem Discussion](https://leetcode.com/problems/merge-two-sorted-lists/discuss/) - Community solutions
- [Linked List Operations - GeeksforGeeks](https://www.geeksforgeeks.org/linked-list-set-2-inserting-a-node/) - Linked list basics
- [Merge Sort](https://www.geeksforgeeks.org/merge-sort/) - The sorting algorithm using this merge
- [Pointers and References](https://en.wikipedia.org/wiki/Pointer_(computer_programming)) - Understanding pointer manipulation
