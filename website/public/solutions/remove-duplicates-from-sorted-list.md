# Remove Duplicates from Sorted List

## Problem Statement

Given the head of a sorted linked list, delete all duplicates such that each element appears only once. Return the sorted linked list as well.

**Link to problem:** [Remove Duplicates from Sorted List](https://leetcode.com/problems/remove-duplicates-from-sorted-list/)

---

## Examples

### Example 1

**Input:**
```
head = [1,1,2]
```

**Output:**
```
[1,2]
```

**Explanation:** The first 1 and second 1 are duplicates. Removing them results in [1,2].

---

### Example 2

**Input:**
```
head = [1,1,2,3,3]
```

**Output:**
```
[1,2,3]
```

**Explanation:** The first 1 and second 1 are duplicates. The second 2 is unique. The first 3 and second 3 are duplicates. Removing them results in [1,2,3].

---

### Example 3

**Input:**
```
head = []
```

**Output:**
```
[]
```

**Explanation:** Empty list returns empty list.

---

### Example 4

**Input:**
```
head = [1]
```

**Output:**
```
[1]
```

**Explanation:** Single element list has no duplicates.

---

## Intuition

The key insight is that the input list is **already sorted**, which means all duplicate elements will be **consecutive**. This property simplifies the problem significantly:

1. **Duplicate Pattern:** In a sorted list, if there are duplicates, they appear next to each other (e.g., `[1,1,2,3,3]`).
2. **Single Pass:** We can traverse the list once, comparing each node with its next node.
3. **In-place Modification:** When we find a duplicate, we skip the duplicate node by updating the `next` pointer.

The algorithm works by:
- Starting at the head of the list
- Comparing the current node's value with the next node's value
- If they are equal, skip the next node by setting `current.next = current.next.next`
- If they are different, move to the next node
- Continue until we reach the end of the list

---

## Multiple Approaches with Code

We'll cover three approaches:

1. **Iterative Single Pass** - Most optimal O(n) time, O(1) space
2. **Recursive Approach** - O(n) time, O(n) space
3. **Two Pointer Technique** - Alternative O(n) time, O(1) space approach

---

## Approach 1: Iterative Single Pass

This is the most straightforward approach. We iterate through the list once, comparing adjacent nodes and removing duplicates by adjusting pointers.

#### Algorithm Steps

1. Initialize a pointer `current` at the head of the list
2. While `current` and `current.next` are not null:
   - If `current.val == current.next.val`, skip the next node
   - Otherwise, move `current` to `current.next`
3. Return the head of the modified list

#### Code Implementation

 ````carousel
 ```python
 # Definition for singly-linked list.
 # class ListNode:
 #     def __init__(self, val=0, next=None):
 #         self.val = val
 #         self.next = next

 class Solution:
     def deleteDuplicates(self, head: Optional[ListNode]) -> Optional[ListNode]:
         current = head
         while current and current.next:
             if current.val == current.next.val:
                 # Skip the duplicate node
                 current.next = current.next.next
             else:
                 # Move to next node only when no duplicate
                 current = current.next
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
     ListNode* deleteDuplicates(ListNode* head) {
         ListNode* current = head;
         while (current && current->next) {
             if (current->val == current->next->val) {
                 // Skip the duplicate node
                 ListNode* temp = current->next;
                 current->next = current->next->next;
                 delete temp; // Free the memory
             } else {
                 // Move to next node only when no duplicate
                 current = current->next;
             }
         }
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
     public ListNode deleteDuplicates(ListNode head) {
         ListNode current = head;
         while (current != null && current.next != null) {
             if (current.val == current.next.val) {
                 // Skip the duplicate node
                 current.next = current.next.next;
             } else {
                 // Move to next node only when no duplicate
                 current = current.next;
             }
         }
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
 var deleteDuplicates = function(head) {
     let current = head;
     while (current && current.next) {
         if (current.val === current.next.val) {
             // Skip the duplicate node
             current.next = current.next.next;
         } else {
             // Move to next node only when no duplicate
             current = current.next;
         }
     }
     return head;
 };
 ```
 ````

#### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) - Single pass through the list |
| **Space** | O(1) - Only constant extra space used |

---

## Approach 2: Recursive Approach

This approach uses recursion to traverse and remove duplicates. The base case handles empty lists or single-node lists.

#### Algorithm Steps

1. Base case: if head is null or head.next is null, return head
2. Recursively process `head.next`
3. If `head.val == head.next.val`, skip `head.next` and return `head`
4. Otherwise, return `head`

#### Code Implementation

 ````carousel
 ```python
 # Definition for singly-linked list.
 # class ListNode:
 #     def __init__(self, val=0, next=None):
 #         self.val = val
 #         self.next = next

 class Solution:
     def deleteDuplicates(self, head: Optional[ListNode]) -> Optional[ListNode]:
         # Base case: empty list or single node
         if not head or not head.next:
             return head
         
         # Recursively process the rest of the list
         head.next = self.deleteDuplicates(head.next)
         
         # Check if current node is duplicate of next
         if head.val == head.next.val:
             # Skip the next node
             return head.next
         else:
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
     ListNode* deleteDuplicates(ListNode* head) {
         // Base case: empty list or single node
         if (!head || !head->next) {
             return head;
         }
         
         // Recursively process the rest of the list
         head->next = deleteDuplicates(head->next);
         
         // Check if current node is duplicate of next
         if (head->val == head->next->val) {
             // Skip the next node
             ListNode* temp = head->next;
             head->next = head->next->next;
             delete temp; // Free the memory
             return head;
         } else {
             return head;
         }
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
     public ListNode deleteDuplicates(ListNode head) {
         // Base case: empty list or single node
         if (head == null || head.next == null) {
             return head;
         }
         
         // Recursively process the rest of the list
         head.next = deleteDuplicates(head.next);
         
         // Check if current node is duplicate of next
         if (head.val == head.next.val) {
             // Skip the next node
             return head.next;
         } else {
             return head;
         }
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
 var deleteDuplicates = function(head) {
     // Base case: empty list or single node
     if (!head || !head.next) {
         return head;
     }
     
     // Recursively process the rest of the list
     head.next = deleteDuplicates(head.next);
     
     // Check if current node is duplicate of next
     if (head.val === head.next.val) {
         // Skip the next node
         return head.next;
     } else {
         return head;
     }
 };
 ```
 ````

#### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) - Each node is processed once |
| **Space** | O(n) - Recursion stack grows with list depth |

---

## Approach 3: Two Pointer Technique

This approach uses two pointers to track the last unique node found and the current node being processed.

#### Algorithm Steps

1. Initialize `prev` as null and `current` as head
2. While `current` is not null:
   - If `current.val != prev.val` (or `prev` is null), mark `current` as unique
   - Otherwise, skip `current` by linking `prev.next` to `current.next`
3. Update `prev` and `current` accordingly

#### Code Implementation

 ````carousel
 ```python
 # Definition for singly-linked list.
 # class ListNode:
 #     def __init__(self, val=0, next=None):
 #         self.val = val
 #         self.next = next

 class Solution:
     def deleteDuplicates(self, head: Optional[ListNode]) -> Optional[ListNode]:
         prev = None
         current = head
         
         while current:
             if prev is None or current.val != prev.val:
                 # Current node is unique, update prev
                 prev = current
             else:
                 # Current node is duplicate, skip it
                 prev.next = current.next
             current = current.next
         
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
     ListNode* deleteDuplicates(ListNode* head) {
         ListNode* prev = nullptr;
         ListNode* current = head;
         
         while (current) {
             if (prev == nullptr || current->val != prev->val) {
                 // Current node is unique, update prev
                 prev = current;
             } else {
                 // Current node is duplicate, skip it
                 prev->next = current->next;
                 delete current; // Free the memory
             }
             current = prev ? prev->next : nullptr;
         }
         
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
     public ListNode deleteDuplicates(ListNode head) {
         ListNode prev = null;
         ListNode current = head;
         
         while (current != null) {
             if (prev == null || current.val != prev.val) {
                 // Current node is unique, update prev
                 prev = current;
             } else {
                 // Current node is duplicate, skip it
                 prev.next = current.next;
             }
             current = current.next;
         }
         
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
 var deleteDuplicates = function(head) {
     let prev = null;
     let current = head;
     
     while (current) {
         if (prev === null || current.val !== prev.val) {
             // Current node is unique, update prev
             prev = current;
         } else {
             // Current node is duplicate, skip it
             prev.next = current.next;
         }
         current = current.next;
     }
     
     return head;
 };
 ```
 ````

#### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) - Single pass through the list |
| **Space** | O(1) - Only constant extra space used |

---

## Comparison of Approaches

| Aspect | Iterative Single Pass | Recursive Approach | Two Pointer Technique |
|--------|----------------------|--------------------|----------------------|
| **Time Complexity** | O(n) | O(n) | O(n) |
| **Space Complexity** | O(1) | O(n) | O(1) |
| **Implementation** | Simple and readable | Elegant but uses stack | Alternative perspective |
| **Best For** | Production code | Learning recursion | Understanding pointers |
| **Memory Usage** | Minimal | Stack overflow risk | Minimal |

---

## Related Problems

Based on similar themes (linked list manipulation, duplicates removal):

- **[Remove Duplicates from Sorted List II](https://leetcode.com/problems/remove-duplicates-from-sorted-list-ii/)** - Remove all nodes that have duplicate numbers, leaving only distinct numbers
- **[Remove Duplicates from Sorted Array](https://leetcode.com/problems/remove-duplicates-from-sorted-array/)** - Similar problem but for arrays instead of linked lists
- **[Linked List Cycle](https://leetcode.com/problems/linked-list-cycle/)** - Basic linked list manipulation
- **[Reverse Linked List](https://leetcode.com/problems/reverse-linked-list/)** - Fundamental linked list operation
- **[Merge Two Sorted Lists](https://leetcode.com/problems/merge-two-sorted-lists/)** - Another sorted linked list problem

---

## Video Tutorial Links

Here are some helpful YouTube tutorials explaining the problem and solutions:

- [Remove Duplicates from Sorted List - LeetCode Solution](https://www.youtube.com/watch?v=p10f3J5p9Vw) - Comprehensive explanation by NeetCode
- [Linked List Problems - Full Course](https://www.youtube.com/watch?v=Hj_rA0dhr2I) - FreeCodeCamp's complete linked list course
- [Remove Duplicates - LeetCode 83](https://www.youtube.com/watch?v=0vW5s7Bq6_k) - Detailed walkthrough with examples

---

## Followup Questions

### Q1: How would you modify the solution to remove all duplicates, not just consecutive ones?

**Answer:** If the list is not sorted, you would need to use a hash set to track seen values. Iterate through the list, and for each node, check if its value has been seen before. If yes, remove the node by updating the previous node's `next` pointer. This approach has O(n) time complexity but O(n) space complexity due to the hash set.

---

### Q2: How do you handle memory management in C++ when deleting nodes?

**Answer:** In C++, when you skip a duplicate node by updating the pointer, you should free the memory using `delete` operator to prevent memory leaks. The skipped node is stored in a temporary pointer, the `next` pointer is updated, and then `delete temp` is called to release the memory.

---

### Q3: What happens if the list is empty or has only one node?

**Answer:** All approaches handle these edge cases correctly:
- Empty list (head is null): The while loop condition fails immediately, and the function returns null.
- Single node list: The while loop condition `current && current.next` fails (since current.next is null), and the function returns the single node as is.

---

### Q4: Can you do this without using extra space?

**Answer:** Yes, the iterative single-pass approach uses O(1) extra space. Since the list is sorted, duplicates are always adjacent, so we can simply compare adjacent nodes and skip duplicates by updating pointers. No hash set or other data structure is needed.

---

### Q5: How would you count the number of unique elements in the list?

**Answer:** You can modify the solution to count unique elements by initializing a counter and incrementing it only when a new unique value is encountered. For example, in the iterative approach, increment the counter when `current.val != current.next.val` (or at the start if the list is not empty). The final count would be the number of unique elements.

---

### Q6: What if you need to return both the modified list and the count of duplicates removed?

**Answer:** You can maintain a counter variable initialized to 0. Each time you skip a duplicate node (when `current.val == current.next.val`), increment the counter. After the traversal completes, you have both the modified list and the count of duplicates removed (which equals the original length minus the final length).

---

## Summary

The "Remove Duplicates from Sorted List" problem is a classic linked list manipulation problem that leverages the sorted property to achieve an efficient O(n) time and O(1) space solution. The key insight is that in a sorted list, duplicates are always adjacent, allowing us to remove them in a single pass by comparing adjacent nodes and updating pointers accordingly.

The iterative single-pass approach is the most optimal solution for this problem, as it uses minimal memory and achieves linear time complexity. The recursive approach provides an alternative perspective but uses additional stack space. The two-pointer technique offers yet another way to think about the problem, maintaining a pointer to the last unique node.

Understanding this problem builds a strong foundation for tackling more complex linked list problems and helps develop intuition for pointer manipulation and in-place list modification techniques.

---

## Additional Resources

- [LeetCode Problem Discussion](https://leetcode.com/problems/remove-duplicates-from-sorted-list/discuss/) - Community solutions and explanations
- [Linked List Basics](https://www.geeksforgeeks.org/linked-list-vs-array/) - Understanding linked lists vs arrays
- [Pointer Manipulation in C++](https://www.learncpp.com/cpp-tutorial/pointers/) - Deep dive into pointers

