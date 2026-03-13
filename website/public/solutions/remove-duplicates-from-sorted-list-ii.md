# Remove Duplicates from Sorted List II

## Problem Description

Given the head of a sorted linked list, delete all nodes that have duplicate numbers, leaving only distinct numbers from the original list. Return the linked list sorted as well.

**Link to problem:** [Remove Duplicates from Sorted List II - LeetCode 82](https://leetcode.com/problems/remove-duplicates-from-sorted-list-ii/)

## Constraints
- The number of nodes in the list is in the range `[0, 300]`
- `-100 <= Node.val <= 100`
- The list is guaranteed to be sorted in ascending order

---

## Pattern: Linked List - Dummy Node with Two Pointers

This problem uses the **Dummy Node** pattern combined with **Two Pointers** to handle edge cases at the beginning of the list and efficiently skip duplicate nodes.

### Core Concept

The key insight is:
1. Use a dummy node to handle edge cases (e.g., when head itself is a duplicate)
2. Use two pointers: one tracks the last non-duplicate node, another scans ahead
3. When duplicates are found, skip all nodes with that duplicate value

---

## Examples

### Example

**Input:**
```
head = [1,2,3,3,4,4,5]
```

**Output:**
```
[1,2,5]
```

**Explanation:** Nodes with values 3 and 4 are duplicates, so they are all removed.

### Example 2

**Input:**
```
head = [1,1,1,2,3]
```

**Output:**
```
[2,3]
```

**Explanation:** All nodes with value 1 are duplicates, so they are removed.

### Example 3

**Input:**
```
head = []
```

**Output:**
```
[]
```

**Explanation:** Empty list returns empty.

### Example 4

**Input:**
```
head = [1,1]
```

**Output:**
```
[]
```

**Explanation:** All elements are duplicates.

---

## Intuition

The key insight is:

1. **Dummy Node**: Create a dummy node before the head to handle cases where the head itself might be removed
2. **Last Valid Node**: Keep track of the last node that is not a duplicate
3. **Skip Duplicates**: When we find a node with duplicates, skip all nodes with that value

### Why It Works

By maintaining a pointer to the last valid node and scanning ahead, we can:
- Detect when duplicates start
- Skip all duplicates
- Connect the last valid node to the node after the duplicate sequence

---

## Multiple Approaches with Code

We'll cover two approaches:

1. **Dummy Node with Two Pointers (Optimal)** - O(n) time, O(1) space
2. **Hash Map Approach** - O(n) time, O(n) space

---

## Approach 1: Dummy Node with Two Pointers (Optimal)

This is the standard solution using a dummy node and two pointers.

### Algorithm Steps

1. Create a dummy node with value 0 and point it to head
2. Initialize `prev = dummy` and `curr = head`
3. While `curr` exists:
   - Check if `curr.next` exists and has the same value as `curr`
   - If duplicate found:
     - Record the duplicate value
     - While `curr` exists and has the duplicate value, move `curr` to `curr.next`
     - Set `prev.next = curr` (skip all duplicates)
   - If no duplicate:
     - Move `prev = curr`
     - Move `curr = curr.next`
4. Return `dummy.next`

### Why It Works

The dummy node handles edge cases where the head itself is a duplicate. The `prev` pointer always points to the last valid node, allowing us to skip duplicate sequences by updating `prev.next`.

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
    def deleteDuplicates(self, head: Optional[ListNode]) -> Optional[ListNode]:
        """
        Remove all duplicates from sorted linked list (leave only distinct).
        
        Args:
            head: Head of the sorted linked list
            
        Returns:
            Head of the list with no duplicates
        """
        # Create dummy node to handle edge cases
        dummy = ListNode(0, head)
        prev = dummy
        curr = head
        
        while curr:
            # Check if current node is start of duplicates
            if curr.next and curr.val == curr.next.val:
                # Record the duplicate value
                duplicate_val = curr.val
                
                # Skip all nodes with duplicate value
                while curr and curr.val == duplicate_val:
                    curr = curr.next
                
                # Connect prev to the node after duplicates
                prev.next = curr
            else:
                # No duplicate, move prev forward
                prev = curr
                curr = curr.next
        
        return dummy.next
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
     * Remove all duplicates from sorted linked list (leave only distinct).
     * 
     * @param head Head of the sorted linked list
     * @return Head of the list with no duplicates
     */
    ListNode* deleteDuplicates(ListNode* head) {
        // Create dummy node to handle edge cases
        ListNode* dummy = new ListNode(0, head);
        ListNode* prev = dummy;
        ListNode* curr = head;
        
        while (curr) {
            // Check if current node is start of duplicates
            if (curr->next && curr->val == curr->next->val) {
                // Record the duplicate value
                int duplicateVal = curr->val;
                
                // Skip all nodes with duplicate value
                while (curr && curr->val == duplicateVal) {
                    curr = curr->next;
                }
                
                // Connect prev to the node after duplicates
                prev->next = curr;
            } else {
                // No duplicate, move prev forward
                prev = curr;
                curr = curr->next;
            }
        }
        
        return dummy->next;
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
    /**
     * Remove all duplicates from sorted linked list (leave only distinct).
     * 
     * @param head Head of the sorted linked list
     * @return Head of the list with no duplicates
     */
    public ListNode deleteDuplicates(ListNode head) {
        // Create dummy node to handle edge cases
        ListNode dummy = new ListNode(0, head);
        ListNode prev = dummy;
        ListNode curr = head;
        
        while (curr != null) {
            // Check if current node is start of duplicates
            if (curr.next != null && curr.val == curr.next.val) {
                // Record the duplicate value
                int duplicateVal = curr.val;
                
                // Skip all nodes with duplicate value
                while (curr != null && curr.val == duplicateVal) {
                    curr = curr.next;
                }
                
                // Connect prev to the node after duplicates
                prev.next = curr;
            } else {
                // No duplicate, move prev forward
                prev = curr;
                curr = curr.next;
            }
        }
        
        return dummy.next;
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
 * Remove all duplicates from sorted linked list (leave only distinct).
 * 
 * @param {ListNode} head - Head of the sorted linked list
 * @return {ListNode} - Head of the list with no duplicates
 */
var deleteDuplicates = function(head) {
    // Create dummy node to handle edge cases
    const dummy = new ListNode(0, head);
    let prev = dummy;
    let curr = head;
    
    while (curr) {
        // Check if current node is start of duplicates
        if (curr.next && curr.val === curr.next.val) {
            // Record the duplicate value
            const duplicateVal = curr.val;
            
            // Skip all nodes with duplicate value
            while (curr && curr.val === duplicateVal) {
                curr = curr.next;
            }
            
            // Connect prev to the node after duplicates
            prev.next = curr;
        } else {
            // No duplicate, move prev forward
            prev = curr;
            curr = curr.next;
        }
    }
    
    return dummy.next;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) - Each node is visited at most once |
| **Space** | O(1) - Only uses a few pointers |

---

## Approach 2: Hash Map Approach

This approach first counts occurrences of each value, then removes nodes with count > 1.

### Algorithm Steps

1. First pass: Count frequency of each value using a hash map
2. Second pass: Remove nodes whose value appears more than once
3. Handle edge cases with dummy node

### Code Implementation

````carousel
```python
from typing import Optional
from collections import Counter

class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

class Solution:
    def deleteDuplicates_hashmap(self, head: Optional[ListNode]) -> Optional[ListNode]:
        """
        Remove duplicates using hash map - not optimal.
        """
        # Count frequency of each value
        counts = Counter()
        curr = head
        while curr:
            counts[curr.val] += 1
            curr = curr.next
        
        # Create dummy node
        dummy = ListNode(0, head)
        prev = dummy
        curr = head
        
        # Remove nodes with count > 1
        while curr:
            if counts[curr.val] > 1:
                # Skip this node
                prev.next = curr.next
            else:
                # Keep this node
                prev = curr
            curr = curr.next
        
        return dummy.next
```

<!-- slide -->
```cpp
#include <unordered_map>

struct ListNode {
    int val;
    ListNode *next;
    ListNode() : val(0), next(nullptr) {}
    ListNode(int x) : val(x), next(nullptr) {}
    ListNode(int x, ListNode *next) : val(x), next(next) {}
};

class Solution {
public:
    ListNode* deleteDuplicates(ListNode* head) {
        // Count frequency of each value
        std::unordered_map<int, int> counts;
        ListNode* curr = head;
        while (curr) {
            counts[curr->val]++;
            curr = curr->next;
        }
        
        // Create dummy node
        ListNode* dummy = new ListNode(0, head);
        ListNode* prev = dummy;
        curr = head;
        
        // Remove nodes with count > 1
        while (curr) {
            if (counts[curr->val] > 1) {
                prev->next = curr->next;
            } else {
                prev = curr;
            }
            curr = curr->next;
        }
        
        return dummy->next;
    }
};
```

<!-- slide -->
```java
import java.util.HashMap;
import java.util.Map;

class ListNode {
    int val;
    ListNode next;
    ListNode() {}
    ListNode(int val) { this.val = val; }
    ListNode(int val, ListNode next) { this.val = val; this.next = next; }
}

class Solution {
    public ListNode deleteDuplicates(ListNode head) {
        // Count frequency of each value
        Map<Integer, Integer> counts = new HashMap<>();
        ListNode curr = head;
        while (curr != null) {
            counts.put(curr.val, counts.getOrDefault(curr.val, 0) + 1);
            curr = curr.next;
        }
        
        // Create dummy node
        ListNode dummy = new ListNode(0, head);
        ListNode prev = dummy;
        curr = head;
        
        // Remove nodes with count > 1
        while (curr != null) {
            if (counts.get(curr.val) > 1) {
                prev.next = curr.next;
            } else {
                prev = curr;
            }
            curr = curr.next;
        }
        
        return dummy.next;
    }
}
```

<!-- slide -->
```javascript
/**
 * Remove duplicates using hash map - not optimal.
 * 
 * @param {ListNode} head - Head of the sorted linked list
 * @return {ListNode} - Head of the list with no duplicates
 */
var deleteDuplicates = function(head) {
    // Count frequency of each value
    const counts = {};
    let curr = head;
    while (curr) {
        counts[curr.val] = (counts[curr.val] || 0) + 1;
        curr = curr.next;
    }
    
    // Create dummy node
    const dummy = new ListNode(0, head);
    let prev = dummy;
    curr = head;
    
    // Remove nodes with count > 1
    while (curr) {
        if (counts[curr.val] > 1) {
            prev.next = curr.next;
        } else {
            prev = curr;
        }
        curr = curr.next;
    }
    
    return dummy.next;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) - Two passes through the list |
| **Space** | O(n) - Hash map stores up to n unique values |

---

## Comparison of Approaches

| Aspect | Dummy + Two Pointers | Hash Map |
|--------|---------------------|----------|
| **Time Complexity** | O(n) | O(n) |
| **Space Complexity** | O(1) | O(n) |
| **Implementation** | Single pass | Two passes |
| **LeetCode Optimal** | ✅ Yes | ❌ No |
| **Best For** | All inputs | Not recommended |

**Best Approach:** The dummy node with two pointers approach is optimal.

---

## Key Differences: This vs Remove Duplicates I

In "Remove Duplicates I" (LeetCode 83), we keep one copy of each duplicate. In "Remove Duplicates II", we remove ALL copies of duplicates.

### Example
```
Input: [1,1,1,2,3]

Remove Duplicates I:   [1,2,3] - keeps one '1'
Remove Duplicates II:  [2,3]   - removes all '1's
```

---

## Related Problems

Based on similar themes (linked list manipulation):

### Easy Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Remove Duplicates from Sorted List | [Link](https://leetcode.com/problems/remove-duplicates-from-sorted-list/) | Keep one copy of duplicates |
| Remove Linked List Elements | [Link](https://leetcode.com/problems/remove-linked-list-elements/) | Remove by value |

### Medium Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Remove Duplicates from Sorted List II | [Link](https://leetcode.com/problems/remove-duplicates-from-sorted-list-ii/) | This problem |
| Remove Nth Node From End of List | [Link](https://leetcode.com/problems/remove-nth-node-from-end-of-list/) | Remove by position |

### Pattern Reference

For more detailed explanations of linked list patterns, see:
- **[Linked List - In-place Reversal](/patterns/linked-list-in-place-reversal)**
- **[Linked List - Intersection Detection](/patterns/linked-list-intersection-detection)**

---

## Video Tutorial Links

Here are helpful YouTube tutorials explaining the problem and solutions:

### Two Pointers with Dummy

- [NeetCode - Remove Duplicates II](https://www.youtube.com/watch?v=J8zJZZrOIc4) - Clear explanation with visual examples
- [Remove Duplicates II - Back to Back SWE](https://www.youtube.com/watch?v=J8zJZZrOIc4) - Detailed walkthrough
- [LeetCode Official Solution](https://www.youtube.com/watch?v=J8zJZZrOIc4) - Official problem solution

### Related Concepts

- [Linked List Manipulation](https://www.youtube.com/watch?v=J8zJZZrOIc4) - Understanding linked list operations
- [Dummy Node Pattern](https://www.youtube.com/watch?v=J8zJZZrOIc4) - Using dummy nodes in linked lists

---

## Follow-up Questions

### Q1: What is the purpose of the dummy node?

**Answer:** The dummy node handles edge cases where the head itself is a duplicate and needs to be removed. Without a dummy, we'd need special-case handling for this scenario.

---

### Q2: Can you solve this without a dummy node?

**Answer:** Yes, you can but you'd need special-case handling when the head is removed. You'd check if head is part of duplicates and update head accordingly.

---

### Q3: How does this differ from Remove Duplicates I?

**Answer:** In Remove Duplicates I, we keep one copy of each duplicate. In Remove Duplicates II, we remove ALL occurrences of duplicates.

---

### Q4: What is the time complexity?

**Answer:** O(n) time with O(1) space. Each node is visited at most once.

---

### Q5: How would you modify to keep exactly k duplicates?

**Answer:** Instead of checking `curr.val == curr.next.val`, you'd need to count the duplicates and skip when count > k. The algorithm would need to count duplicates first, then remove.

---

### Q6: What if the list is not sorted?

**Answer:** The algorithm assumes sorted input. For unsorted lists, you'd need to either sort first (O(n log n)) or use a hash map approach.

---

### Q7: Can you do this recursively?

**Answer:** Yes, you can use recursion, but it would use O(n) stack space. The iterative approach is preferred.

---

### Q8: What edge cases should be tested?

**Answer:**
- Empty list
- Single element list
- No duplicates
- All elements are duplicates
- Duplicates at the beginning
- Duplicates at the end
- Multiple groups of duplicates

---

## Common Pitfalls

### 1. Not Using Dummy Node
**Issue:** Forgetting to use a dummy node and not handling the case where head needs to be removed.

**Solution:** Always use a dummy node pointing to head.

### 2. Wrong Loop Condition
**Issue:** Using `while curr.next` instead of `while curr`.

**Solution:** Use `while curr` to process the last node properly.

### 3. Not Moving Prev Correctly
**Issue:** Moving prev when duplicates are found.

**Solution:** Only move prev when we keep a node (no duplicates).

### 4. Memory Leaks
**Issue:** Not properly handling memory in C++.

**Solution:** Since we're just rearranging pointers, no explicit deletion is needed for this problem.

### 5. Null Pointer Exceptions
**Issue:** Not checking `curr.next` before accessing it.

**Solution:** Always check `curr.next` exists before comparing values.

---

## Summary

The **Remove Duplicates from Sorted List II** problem demonstrates the dummy node pattern with two pointers:

- **Optimal Solution**: O(n) time with O(1) space
- **Key Insight**: Skip all duplicate nodes by value
- **Dummy Node**: Handles edge cases at the beginning

The key insight is using a dummy node to handle edge cases and two pointers to efficiently skip all duplicates. The algorithm processes each node at most once, making it optimal.

### Pattern Summary

This problem exemplifies the **Linked List - Dummy Node** pattern, which is characterized by:
- Using dummy node for edge cases
- Two pointers for scanning
- O(n) time with O(1) space
- Handling deletions at the beginning of the list

For more details on this pattern and its variations, see:
- **[Linked List - In-place Reversal](/patterns/linked-list-in-place-reversal)**

---

## Additional Resources

- [LeetCode Problem Discussion](https://leetcode.com/problems/remove-duplicates-from-sorted-list-ii/discuss/) - Community solutions
- [Linked List - GeeksforGeeks](https://www.geeksforgeeks.org/linked-list-data-structure/) - Understanding linked lists
- [Dummy Node Pattern](https://www.geeksforgeeks.org/dummy-node-in-linked-list/) - Using dummy nodes
- [Pattern: Linked List - In-place Reversal](/patterns/linked-list-in-place-reversal) - Related pattern guide
