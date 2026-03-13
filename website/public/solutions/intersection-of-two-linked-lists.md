# Intersection of Two Linked Lists

## Problem Description

Given the heads of two singly linked-lists `headA` and `headB`, return the node at which the two lists intersect. If the two linked lists have no intersection at all, return `null`.

The test cases are generated such that there are **no cycles** anywhere in the entire linked structure. Note that the linked lists must retain their original structure after the function returns.

**LeetCode Link:** [Intersection of Two Linked Lists - LeetCode](https://leetcode.com/problems/intersection-of-two-linked-lists/)

---

## Custom Judge

The judge provides the following inputs:
- `intersectVal` - The value of the node where intersection occurs (0 if no intersection)
- `listA` - The first linked list
- `listB` - The second linked list
- `skipA` - Number of nodes to skip in listA to reach the intersected node
- `skipB` - Number of nodes to skip in listB to reach the intersected node

---

## Examples

### Example 1

| Input | Output |
|-------|--------|
| `intersectVal = 8`, `listA = [4,1,8,4,5]`, `listB = [5,6,1,8,4,5]`, `skipA = 2`, `skipB = 3` | `Intersected at '8'` |

**Explanation:** The intersected node's value is 8. From head of A: `[4,1,8,4,5]` (2 nodes before intersection). From head of B: `[5,6,1,8,4,5]` (3 nodes before intersection).

> **Note:** Nodes with value 1 in A and B are different references. Only the node with value 8 points to the same memory location.

### Example 2

| Input | Output |
|-------|--------|
| `intersectVal = 2`, `listA = [1,9,1,2,4]`, `listB = [3,2,4]`, `skipA = 3`, `skipB = 1` | `Intersected at '2'` |

### Example 3

| Input | Output |
|-------|--------|
| `intersectVal = 0`, `listA = [2,6,4]`, `listB = [1,5]` | `No intersection` |

---

## Constraints

- The number of nodes of listA is in the range `[1, 10⁴]`
- The number of nodes of listB is in the range `[1, 10⁴]`
- `1 <= Node.val <= 10⁵`
- `0 <= skipA <= m` (where m is length of listA)
- `0 <= skipB <= n` (where n is length of listB)
- `intersectVal == listA[skipA] == listB[skipB]` if lists intersect

**Follow up:** Could you write a solution that runs in O(m + n) time and uses only O(1) memory?

---

## Pattern: Two Pointers with Path Alignment (Crossing Technique)

This problem uses the **Two Pointers** pattern where both pointers traverse both lists. By redirecting each pointer to the head of the other list when it reaches the end, both pointers travel the same total distance and meet at the intersection point if one exists.

### Core Concept

- **Two Pointers**: Traverse both lists simultaneously
- **Path Alignment**: When one pointer reaches end, redirect to other list's head
- **Meeting Point**: Both pointers travel same total distance and meet

### When to Use This Pattern

This pattern is applicable when:
1. Finding intersection in linked structures
2. Problems requiring synchronized traversal
3. Cases where we need O(1) space

---

## Intuition

The key insight for this problem is that if we make both pointers travel the same total distance, they will either meet at the intersection or both reach the end.

### Key Observations

1. **Same Total Distance**: If lists intersect, both pointers will travel:
   - Pointer A: len(A) + len(B - intersection)
   - Pointer B: len(B) + len(A - intersection)
   
   These are equal!

2. **Two-Round Traversal**: Each pointer traverses both lists (one after the other)

3. **Meeting Points**:
   - If lists intersect: they meet at the intersection node
   - If lists don't intersect: both reach null at the same time

4. **No Extra Space**: The "crossing" technique uses only two pointers!

### Algorithm Overview

1. Initialize two pointers at heads of both lists
2. Traverse both lists simultaneously
3. When pointer reaches end, redirect to other list's head
4. When pointers meet (or both become null), return the node

---

## Multiple Approaches with Code

We'll cover three approaches:

1. **Two Pointers (Optimal)** - O(1) space
2. **Hash Set** - O(m + n) time, O(m) space
3. **Calculate Lengths** - Two-pass approach

---

## Approach 1: Two Pointers (Optimal)

### Algorithm Steps

1. Initialize pointers pA and pB at headA and headB
2. While pA != pB:
   - If pA is null, set pA to headB; otherwise pA = pA.next
   - If pB is null, set pB to headA; otherwise pB = pB.next
3. Return pA (or pB, they're equal)

### Why It Works

This approach works because:
- Both pointers travel the same total distance
- After traversing their own list, each continues on the other's list
- They meet at the intersection or both become null

### Code Implementation

````carousel
```python
from typing import Optional

class ListNode:
    def __init__(self, x):
        self.val = x
        self.next = None

class Solution:
    def getIntersectionNode(self, headA: ListNode, headB: ListNode) -> Optional[ListNode]:
        """
        Find intersection node using two pointers.
        
        Args:
            headA: Head of first linked list
            headB: Head of second linked list
            
        Returns:
            Intersection node or null if no intersection
        """
        if not headA or not headB:
            return None
        
        pA, pB = headA, headB
        
        while pA != pB:
            # If pA reaches end, redirect to headB
            # Otherwise, move to next node
            pA = pA.next if pA else headB
            
            # If pB reaches end, redirect to headA
            # Otherwise, move to next node
            pB = pB.next if pB else headA
        
        # Either intersection node or None
        return pA
```

<!-- slide -->
```cpp
/**
 * Definition for singly-linked list.
 * struct ListNode {
 *     int val;
 *     ListNode *next;
 *     ListNode(int x) : val(x), next(NULL) {}
 * };
 */
class Solution {
public:
    ListNode *getIntersectionNode(ListNode *headA, ListNode *headB) {
        if (!headA || !headB) {
            return NULL;
        }
        
        ListNode *pA = headA;
        ListNode *pB = headB;
        
        while (pA != pB) {
            pA = pA ? pA->next : headB;
            pB = pB ? pB->next : headA;
        }
        
        return pA;
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
 *     ListNode(int x) {
 *         val = x;
 *         next = null;
 *     }
 * }
 */
public class Solution {
    public ListNode getIntersectionNode(ListNode headA, ListNode headB) {
        if (headA == null || headB == null) {
            return null;
        }
        
        ListNode pA = headA;
        ListNode pB = headB;
        
        while (pA != pB) {
            pA = (pA == null) ? headB : pA.next;
            pB = (pB == null) ? headA : pB.next;
        }
        
        return pA;
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
 * @param {ListNode} headA
 * @param {ListNode} headB
 * @return {ListNode}
 */
var getIntersectionNode = function(headA, headB) {
    if (!headA || !headB) {
        return null;
    }
    
    let pA = headA;
    let pB = headB;
    
    while (pA !== pB) {
        pA = pA ? pA.next : headB;
        pB = pB ? pB.next : headA;
    }
    
    return pA;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(m + n) - each pointer traverses at most both lists |
| **Space** | O(1) - only two pointers used |

---

## Approach 2: Hash Set

### Algorithm Steps

1. Traverse listA and add all nodes to a hash set
2. Traverse listB and check if any node exists in the set
3. Return the first match or null

### Why It Works

Using a hash set allows O(1) lookup to check if a node from listB was seen in listA.

### Code Implementation

````carousel
```python
from typing import Optional

class ListNode:
    def __init__(self, x):
        self.val = x
        self.next = None

class Solution:
    def getIntersectionNode(self, headA: ListNode, headB: ListNode) -> Optional[ListNode]:
        """
        Find intersection using hash set.
        """
        if not headA or not headB:
            return None
        
        # Store all nodes from listA
        nodes = set()
        current = headA
        while current:
            nodes.add(id(current))  # Use id() for object reference
            current = current.next
        
        # Check listB for nodes in set
        current = headB
        while current:
            if id(current) in nodes:
                return current
            current = current.next
        
        return None
```

<!-- slide -->
```cpp
class Solution {
public:
    ListNode *getIntersectionNode(ListNode *headA, ListNode *headB) {
        if (!headA || !headB) return NULL;
        
        unordered_set<ListNode*> nodes;
        ListNode* curr = headA;
        
        while (curr) {
            nodes.insert(curr);
            curr = curr->next;
        }
        
        curr = headB;
        while (curr) {
            if (nodes.count(curr)) {
                return curr;
            }
            curr = curr->next;
        }
        
        return NULL;
    }
};
```

<!-- slide -->
```java
public class Solution {
    public ListNode getIntersectionNode(ListNode headA, ListNode headB) {
        if (headA == null || headB == null) return null;
        
        Set<ListNode> nodes = new HashSet<>();
        ListNode curr = headA;
        
        while (curr != null) {
            nodes.add(curr);
            curr = curr.next;
        }
        
        curr = headB;
        while (curr != null) {
            if (nodes.contains(curr)) {
                return curr;
            }
            curr = curr.next;
        }
        
        return null;
    }
}
```

<!-- slide -->
```javascript
var getIntersectionNode = function(headA, headB) {
    if (!headA || !headB) return null;
    
    const nodes = new Set();
    let curr = headA;
    
    while (curr) {
        nodes.add(curr);
        curr = curr.next;
    }
    
    curr = headB;
    while (curr) {
        if (nodes.has(curr)) {
            return curr;
        }
        curr = curr.next;
    }
    
    return null;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(m + n) - traverse both lists |
| **Space** | O(m) - hash set storing listA nodes |

---

## Approach 3: Calculate Lengths

### Algorithm Steps

1. Calculate lengths of both lists
2. Align the longer list by advancing pointer by the difference
3. Traverse both lists together until they meet

### Code Implementation

````carousel
```python
from typing import Optional

class ListNode:
    def __init__(self, x):
        self.val = x
        self.next = None

class Solution:
    def getIntersectionNode(self, headA: ListNode, headB: ListNode) -> Optional[ListNode]:
        """
        Find intersection by calculating lengths.
        """
        def get_length(node):
            length = 0
            while node:
                length += 1
                node = node.next
            return length
        
        lenA = get_length(headA)
        lenB = get_length(headB)
        
        # Align the lists
        pA, pB = headA, headB
        
        # Advance longer list
        if lenA > lenB:
            for _ in range(lenA - lenB):
                pA = pA.next
        elif lenB > lenA:
            for _ in range(lenB - lenA):
                pB = pB.next
        
        # Traverse together
        while pA and pB:
            if pA == pB:
                return pA
            pA = pA.next
            pB = pB.next
        
        return None
```

<!-- slide -->
```cpp
class Solution {
public:
    ListNode *getIntersectionNode(ListNode *headA, ListNode *headB) {
        auto getLength = [](ListNode* node) {
            int len = 0;
            while (node) {
                len++;
                node = node->next;
            }
            return len;
        };
        
        int lenA = getLength(headA);
        int lenB = getLength(headB);
        
        ListNode *pA = headA, *pB = headB;
        
        // Align
        if (lenA > lenB) {
            for (int i = 0; i < lenA - lenB; i++) pA = pA->next;
        } else {
            for (int i = 0; i < lenB - lenA; i++) pB = pB->next;
        }
        
        // Traverse together
        while (pA && pB) {
            if (pA == pB) return pA;
            pA = pA->next;
            pB = pB->next;
        }
        
        return NULL;
    }
};
```

<!-- slide -->
```java
public class Solution {
    private int getLength(ListNode node) {
        int len = 0;
        while (node != null) {
            len++;
            node = node.next;
        }
        return len;
    }
    
    public ListNode getIntersectionNode(ListNode headA, ListNode headB) {
        int lenA = getLength(headA);
        int lenB = getLength(headB);
        
        ListNode pA = headA, pB = headB;
        
        // Align
        if (lenA > lenB) {
            for (int i = 0; i < lenA - lenB; i++) pA = pA.next;
        } else {
            for (int i = 0; i < lenB - lenA; i++) pB = pB.next;
        }
        
        // Traverse together
        while (pA != null && pB != null) {
            if (pA == pB) return pA;
            pA = pA.next;
            pB = pB.next;
        }
        
        return null;
    }
}
```

<!-- slide -->
```javascript
var getIntersectionNode = function(headA, headB) {
    const getLength = (node) => {
        let len = 0;
        while (node) {
            len++;
            node = node.next;
        }
        return len;
    };
    
    const lenA = getLength(headA);
    const lenB = getLength(headB);
    
    let pA = headA, pB = headB;
    
    // Align
    if (lenA > lenB) {
        for (let i = 0; i < lenA - lenB; i++) pA = pA.next;
    } else {
        for (let i = 0; i < lenB - lenA; i++) pB = pB.next;
    }
    
    // Traverse together
    while (pA && pB) {
        if (pA === pB) return pA;
        pA = pA.next;
        pB = pB.next;
    }
    
    return null;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(m + n) - two passes to get lengths + one pass to find intersection |
| **Space** | O(1) - only pointers |

---

## Comparison of Approaches

| Aspect | Two Pointers | Hash Set | Length Calculation |
|--------|-------------|----------|-------------------|
| **Time Complexity** | O(m + n) | O(m + n) | O(m + n) |
| **Space Complexity** | O(1) ✅ | O(m) | O(1) |
| **Implementation** | Elegant | Simple | Moderate |
| **Follow-up Optimal** | ✅ Yes | ❌ No | ✅ Yes |

**Best Approach:** Use Approach 1 (Two Pointers) as it meets the O(1) space requirement elegantly.

---

## Why This Problem is Important

### Interview Relevance

- **Frequency**: Commonly asked in technical interviews
- **Companies**: Amazon, Google, Microsoft, Apple
- **Difficulty**: Easy/Medium
- **Concepts Tested**: Linked lists, Two pointers, Space optimization

### Learning Outcomes

1. **Elegant Problem Solving**: The two-pointer crossing technique is elegant
2. **Space Optimization**: Learn to achieve O(1) space
3. **Linked List Manipulation**: Master pointer traversal

---

## Related Problems

Based on similar themes (linked lists, two pointers):

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Linked List Cycle | [Link](https://leetcode.com/problems/linked-list-cycle/) | Detect cycle in linked list |
| Palindrome Linked List | [Link](https://leetcode.com/problems/palindrome-linked-list/) | Check if palindrome |
| Remove Nth Node From End | [Link](https://leetcode.com/problems/remove-nth-node-from-end-of-list/) | Two pointers technique |

### Pattern Reference

For more detailed explanations, see:
- **[Two Pointers Pattern](/patterns/two-pointers)**

---

## Video Tutorial Links

Here are helpful YouTube tutorials explaining the problem and solutions:

### Recommended Tutorials

1. **[Intersection of Two Linked Lists - NeetCode](https://www.youtube.com/watch?v=IpBXN9y19Cs)** - Clear explanation
2. **[LeetCode 160 - Intersection of Two Linked Lists](https://www.youtube.com/watch?v=DOcczJlzfnE)** - Detailed walkthrough

---

## Follow-up Questions

### Q1: How would you modify the solution if the lists could have cycles?

**Answer:** You'd need to first detect if either list has a cycle, and handle that case separately. The problem states there are no cycles.

---

### Q2: What if you needed to return all intersecting nodes (not just the first)?

**Answer:** You'd need to traverse and collect all nodes that appear in both lists, which would require additional space.

---

### Q3: Can you solve this without redirecting to the other list's head?

**Answer:** Yes, the length calculation approach achieves the same result without redirecting, but requires two passes.

---

## Common Pitfalls

### 1. Not Handling Null Pointers
**Issue**: Always check if headA or headB is null before processing.

**Solution**: Add null checks at the start.

### 2. Confusing When to Redirect
**Issue**: Remember that each pointer redirects exactly once - when it reaches the end of its original list.

**Solution**: Use the ternary operator pattern: `pA = pA ? pA.next : headB`

### 3. Using O(m+n) Space
**Issue**: The optimal solution uses O(1) space by redirecting pointers, not by storing visited nodes.

**Solution**: Use the two-pointer crossing technique.

### 4. Wrong Comparison
**Issue**: Ensure you're comparing node references (not values) to detect intersection.

**Solution**: Use `pA == pB` (reference comparison), not `pA.val == pB.val`

---

## Summary

The **Intersection of Two Linked Lists** problem demonstrates elegant two-pointer technique:

Key takeaways:
1. Make both pointers travel the same total distance
2. Redirect each pointer to the other list's head when it reaches the end
3. They meet at the intersection or both become null
4. Achieve O(1) space while maintaining O(m + n) time

This problem is essential for understanding how to solve linked list problems with optimal space complexity.

### Pattern Summary

This problem exemplifies the **Two Pointers with Path Alignment** pattern, characterized by:
- Synchronized traversal of multiple sequences
- Path redirection to equalize distances
- O(1) space solution for problems that seem to need more
- Elegant handling of edge cases

For more details on this pattern, see the **[Two Pointers Pattern](/patterns/two-pointers)**.

---

## Additional Resources

- [LeetCode Problem 160](https://leetcode.com/problems/intersection-of-two-linked-lists/) - Official problem page
- [Linked List Basics - GeeksforGeeks](https://www.geeksforgeeks.org/linked-list-set-1-introduction/) - Linked list explanation
- [Pattern: Two Pointers](/patterns/two-pointers) - Comprehensive pattern guide
