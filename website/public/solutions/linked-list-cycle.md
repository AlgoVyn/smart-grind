# Linked List Cycle

## Problem Statement

Given the head of a linked list, determine if the linked list has a cycle in it.

A **cycle** exists in a linked list if some node can be reached again by continuously following the `next` pointer. Internally, a cycle is caused by a node's `next` pointer pointing to a previous node in the list.

**Link to problem:** [Linked List Cycle](https://leetcode.com/problems/linked-list-cycle/)

**Constraints:**
- The number of nodes in the list is in the range `[0, 10^4]`
- `-10^5 <= Node.val <= 10^5`
- `pos` is `-1` or a valid index in the linked list

---

## Examples

### Example 1

**Input:**
```
head = [3,2,0,-4], pos = 1
```

**Output:**
```
true
```

**Explanation:** There is a cycle in the linked list, where the tail connects to the 1st node (0-indexed).

---

### Example 2

**Input:**
```
head = [1,2], pos = 0
```

**Output:**
```
true
```

**Explanation:** There is a cycle in the linked list, where the tail connects to the 0th node.

---

### Example 3

**Input:**
```
head = [1], pos = -1
```

**Output:**
```
false
```

**Explanation:** There is no cycle in the linked list (tail's next pointer points to null).

---

## Intuition

The key insight for detecting a cycle in a linked list is to recognize that we need to detect if we've visited a node before. However, we can't modify the nodes or use O(n) extra space for a visited set (which would work but is suboptimal).

The elegant solution uses **Floyd's Cycle-Finding Algorithm** (also known as the **tortoise and hare** algorithm):

1. **Two Pointers at Different Speeds:**
   - Slow pointer moves 1 step at a time
   - Fast pointer moves 2 steps at a time

2. **Why This Works:**
   - If there's no cycle: fast pointer reaches the end (null) first
   - If there is a cycle: both pointers will eventually enter the cycle
   - Once in the cycle, the fast pointer gains 1 step on the slow pointer each iteration
   - Eventually, fast pointer will catch up to slow pointer

3. **Mathematical Proof:**
   - Let the distance from head to cycle entry be `a`
   - Let the cycle length be `b`
   - When slow enters cycle, fast is already `k` steps ahead in the cycle
   - Each iteration, fast gains 1 step on slow
   - After `k` iterations, they meet, proving cycle exists

4. **Optimality:**
   - Time: O(n) - each node visited at most twice
   - Space: O(1) - only two pointers used
   - This is the most optimal approach

---

## Multiple Approaches with Code

We'll cover three approaches:

1. **Floyd's Cycle Detection (Two Pointers)** - Optimal O(n) time, O(1) space
2. **Hash Set (Visited Markers)** - O(n) time, O(n) space
3. **Modify Node Values** - O(n) time, O(1) space (modifies data)

---

## Approach 1: Floyd's Cycle Detection (Two Pointers)

This is the optimal approach that uses two pointers moving at different speeds to detect a cycle without using extra space.

#### Algorithm Steps

1. Initialize two pointers: `slow` and `fast`, both starting at the head
2. While `fast` is not null and `fast.next` is not null:
   - Move `slow` by one step: `slow = slow.next`
   - Move `fast` by two steps: `fast = fast.next.next`
   - If `slow == fast`, return `true` (cycle detected)
3. If loop exits, return `false` (no cycle)

#### Code Implementation

 ````carousel
 ```python
 # Definition for singly-linked list.
 # class ListNode:
 #     def __init__(self, x):
 #         self.val = x
 #         self.next = None

 class Solution:
     def hasCycle(self, head: Optional[ListNode]) -> bool:
         if not head or not head.next:
             return False
         
         slow = head
         fast = head
         
         while fast and fast.next:
             slow = slow.next
             fast = fast.next.next
             
             if slow == fast:
                 return True
         
         return False
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
     bool hasCycle(ListNode *head) {
         if (!head || !head->next) {
             return false;
         }
         
         ListNode *slow = head;
         ListNode *fast = head;
         
         while (fast && fast->next) {
             slow = slow->next;
             fast = fast->next->next;
             
             if (slow == fast) {
                 return true;
             }
         }
         
         return false;
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
     public boolean hasCycle(ListNode head) {
         if (head == null || head.next == null) {
             return false;
         }
         
         ListNode slow = head;
         ListNode fast = head;
         
         while (fast != null && fast.next != null) {
             slow = slow.next;
             fast = fast.next.next;
             
             if (slow == fast) {
                 return true;
             }
         }
         
         return false;
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
     if (!head || !head.next) {
         return false;
     }
     
     let slow = head;
     let fast = head;
     
     while (fast && fast.next) {
         slow = slow.next;
         fast = fast.next.next;
         
         if (slow === fast) {
             return true;
         }
     }
     
     return false;
 };
 ```
 ````

#### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) - Each node is visited at most twice (once by slow, once by fast) |
| **Space** | O(1) - Only two pointers used regardless of list size |

---

## Approach 2: Hash Set (Visited Markers)

This approach uses a hash set to track all visited nodes. If we encounter a node that's already in the set, a cycle exists.

#### Algorithm Steps

1. Create an empty hash set to store visited nodes
2. Traverse the linked list from head:
   - If current node is null, return false (no cycle)
   - If current node is already in the set, return true (cycle detected)
   - Add current node to the set
   - Move to next node
3. Return false if traversal completes without finding cycle

#### Code Implementation

 ````carousel
 ```python
 # Definition for singly-linked list.
 # class ListNode:
 #     def __init__(self, x):
 #         self.val = x
 #         self.next = None

 class Solution:
     def hasCycle(self, head: Optional[ListNode]) -> bool:
         visited = set()
         current = head
         
         while current:
             if current in visited:
                 return True
             visited.add(current)
             current = current.next
         
         return False
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
     bool hasCycle(ListNode *head) {
         unordered_set<ListNode*> visited;
         ListNode* current = head;
         
         while (current) {
             if (visited.find(current) != visited.end()) {
                 return true;
             }
             visited.insert(current);
             current = current->next;
         }
         
         return false;
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
     public boolean hasCycle(ListNode head) {
         Set<ListNode> visited = new HashSet<>();
         ListNode current = head;
         
         while (current != null) {
             if (visited.contains(current)) {
                 return true;
             }
             visited.add(current);
             current = current.next;
         }
         
         return false;
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
     const visited = new Set();
     let current = head;
     
     while (current) {
         if (visited.has(current)) {
             return true;
         }
         visited.add(current);
         current = current.next;
     }
     
     return false;
 };
 ```
 ````

#### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) - Each node visited exactly once |
| **Space** | O(n) - Hash set stores all visited nodes |

---

## Approach 3: Modify Node Values

This approach temporarily modifies node values to mark visited nodes. It's O(1) space but modifies the data, which may not be acceptable in all scenarios.

#### Algorithm Steps

1. Traverse the linked list from head:
   - If current node is null, return false (no cycle)
   - If current node's value is modified (use a sentinel value like Integer.MIN_VALUE), return true
   - Mark current node's value as visited
   - Move to next node
2. Return false if traversal completes without finding cycle

#### Code Implementation

 ````carousel
 ```python
 # Definition for singly-linked list.
 # class ListNode:
 #     def __init__(self, x):
 #         self.val = x
 #         self.next = None

 class Solution:
     def hasCycle(self, head: Optional[ListNode]) -> bool:
         # Use a special value to mark visited nodes
         VISITED = float('-inf')
         
         current = head
         while current:
             if current.val == VISITED:
                 return True
             current.val = VISITED
             current = current.next
         
         return False
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
     bool hasCycle(ListNode *head) {
         // Use INT_MIN to mark visited nodes
         const int VISITED = INT_MIN;
         
         ListNode* current = head;
         while (current) {
             if (current->val == VISITED) {
                 return true;
             }
             current->val = VISITED;
             current = current->next;
         }
         
         return false;
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
     public boolean hasCycle(ListNode head) {
         // Use Integer.MIN_VALUE to mark visited nodes
         final int VISITED = Integer.MIN_VALUE;
         
         ListNode current = head;
         while (current != null) {
             if (current.val == VISITED) {
                 return true;
             }
             current.val = VISITED;
             current = current.next;
         }
         
         return false;
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
     // Use a sentinel value to mark visited nodes
     const VISITED = Number.MIN_SAFE_INTEGER;
     
     let current = head;
     while (current) {
         if (current.val === VISITED) {
             return true;
         }
         current.val = VISITED;
         current = current.next;
     }
     
     return false;
 };
 ```
 ````

#### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) - Each node visited exactly once |
| **Space** | O(1) - No additional data structures used |

**Warning:** This approach modifies the input data, which may not be acceptable in production code or interview settings.

---

## Comparison of Approaches

| Aspect | Floyd's Cycle | Hash Set | Modify Values |
|--------|---------------|----------|---------------|
| **Time Complexity** | O(n) | O(n) | O(n) |
| **Space Complexity** | O(1) | O(n) | O(1) |
| **Modifies Input** | No | No | Yes |
| **Implementation** | Moderate | Simple | Simple |
| **Best For** | Production/Interviews | Simplicity | Space-constrained, data mutable |
| **LeetCode Optimal** | ✅ Yes | ❌ No | ❌ No |

---

## Why Floyd's Cycle Detection is Optimal for This Problem

Floyd's Cycle Detection algorithm is the optimal choice because:

1. **Optimal Time:** O(n) time where n is the number of nodes
2. **Constant Space:** O(1) space with only two pointers
3. **No Data Modification:** Original linked list remains unchanged
4. **Elegant Proof:** Mathematical guarantee of correctness
5. **Industry Standard:** Widely accepted solution for cycle detection

The algorithm works because in any cycle, a faster pointer will eventually lap a slower pointer, just like in a circular race track.

---

## Related Problems

Based on similar themes (linked list cycle detection, Floyd's algorithm):

- **[Linked List Cycle II](https://leetcode.com/problems/linked-list-cycle-ii/)** - Find the node where cycle begins
- **[Happy Number](https://leetcode.com/problems/happy-number/)** - Detect cycles in number sequences
- **[Circular Array Loop](https://leetcode.com/problems/circular-array-loop/)** - Detect cycles in arrays
- **[Find the Duplicate Number](https://leetcode.com/problems/find-the-duplicate-number/)** - Cycle detection application
- **[Middle of the Linked List](https://leetcode.com/problems/middle-of-the-linked-list/)** - Slow/fast pointer technique
- **[Remove Nth Node From End of List](https://leetcode.com/problems/remove-nth-node-from-end-of-list/)** - Two-pointer technique
- **[Palindrome Linked List](https://leetcode.com/problems/palindrome-linked-list/)** - Linked list manipulation
- **[Intersecting Linked Lists](https://leetcode.com/problems/intersection-of-two-linked-lists/)** - Find intersection point

---

## Pattern Documentation

For a comprehensive guide on the **Cycle Detection** pattern using Floyd's algorithm, including detailed explanations, multiple approaches, and templates in Python, C++, Java, and JavaScript, see:

- **[Cycle Detection Pattern](../patterns/cycle-detection-floyd.md)** - Complete pattern documentation

---

## Video Tutorial Links

Here are some helpful YouTube tutorials explaining the problem and solutions:

- [Linked List Cycle - LeetCode 141](https://www.youtube.com/watch?v=9pY3R8Pj1qw) - Detailed explanation by NeetCode
- [Floyd's Cycle Detection Algorithm](https://www.youtube.com/watch?v=Cs24vrabORU) - Tortoise and Hare explained
- [Detect Cycle in Linked List](https://www.youtube.com/watch?v=MFO7jtTSS4I) - Clear walkthrough with examples
- [Linked List Cycle Solution](https://www.youtube.com/watch?v=apuou83kQbs) - Multiple approaches explained

---

## Followup Questions

### Q1: How would you find the starting node of the cycle?

**Answer:** After detecting a cycle using Floyd's algorithm, you can find the cycle start by:
1. Reset one pointer to the head
2. Move both pointers one step at a time
3. The point where they meet is the cycle start
This works because the distance from head to cycle start equals the distance from the meeting point to cycle start within the cycle.

---

### Q2: How would you calculate the length of the cycle?

**Answer:** Once cycle is detected:
1. Keep one pointer at the meeting point
2. Move the other pointer until it returns to the meeting point, counting steps
3. The count is the cycle length
Alternatively, use two pointers to measure the circumference.

---

### Q3: Can you detect a cycle with only one pointer?

**Answer:** No, you need at least two pointers with different speeds to detect cycles without modifying the list or using extra space. With one pointer, you can't distinguish between continuing forward and looping back.

---

### Q4: What if the linked list is extremely long? Is there a faster approach?

**Answer:** Floyd's algorithm is already optimal at O(n). You cannot do better than O(n) because you must at least traverse to determine if there's a cycle. In the worst case (cycle at the end), you must visit all nodes.

---

### Q5: How would you handle this in a concurrent environment where other threads might modify the list?

**Answer:** In concurrent environments:
1. Use proper locking (mutexes) during traversal
2. Consider using atomic operations or read-copy-update (RCU) patterns
3. Be aware that even with locks, you might detect false cycles if the list is modified during traversal
4. Consider copying the list first (expensive but safe)

---

### Q6: What's the difference between this and the "Flyod's Cycle Finding" algorithm?

**Answer:** They are the same algorithm! "Floyd's Cycle Finding Algorithm" and "Floyd's Tortoise and Hare" are different names for the same technique. It's attributed to Robert Floyd, who invented it in 1963.

---

### Q7: How would you detect a cycle in a doubly linked list?

**Answer:** In a doubly linked list, you can use similar approaches:
1. Floyd's algorithm still works (check slow == fast)
2. Alternatively, check if any node's `next` points to a previous node in the traversal
3. You can also check if `node.prev.next == node` for any node

---

### Q8: What if the list contains a self-loop (node points to itself)?

**Answer:** Floyd's algorithm handles self-loops correctly:
- Slow and fast both start at head
- After one iteration: slow at node 1, fast at node 1 (if head.next is head)
- Since slow == fast, cycle detected immediately

---

### Q9: How would you handle a very large linked list that might cause stack overflow with recursion?

**Answer:** Floyd's algorithm uses iteration, not recursion, so it won't cause stack overflow. All three approaches discussed are iterative and use constant or linear space without recursion.

---

### Q10: Can you use this algorithm for detecting cycles in graphs?

**Answer:** Floyd's algorithm can be adapted for cycle detection in certain directed graphs (like detecting cycles in a functional graph where each node has exactly one outgoing edge). However, for general graphs, you need DFS with visited markers or other graph cycle detection algorithms.

---

## Summary

The "Linked List Cycle" problem demonstrates the elegance of Floyd's Cycle Detection Algorithm (Tortoise and Hare). This approach solves the problem optimally with O(n) time and O(1) space complexity.

**Key Takeaways:**
- Floyd's algorithm is the optimal solution for cycle detection
- Two pointers with different speeds can detect cycles without extra space
- The mathematical guarantee ensures correctness
- Always check for null pointers to avoid crashes
- This pattern extends to related problems like finding cycle starts and lengths

Understanding this problem builds a strong foundation for tackling more complex linked list problems and cycle detection scenarios.

---

## Additional Resources

- [LeetCode Problem Discussion](https://leetcode.com/problems/linked-list-cycle/discuss/) - Community solutions and explanations
- [Floyd's Cycle Finding Algorithm](https://en.wikipedia.org/wiki/Cycle_detection#Floyd's_tortoise_and_hare) - Wikipedia article
- [Linked List Data Structure](https://www.geeksforgeeks.org/linked-list-data-structure/) - Understanding linked lists
- [Tortoise and Hare Algorithm](https://www.geeksforgeeks.org/how-does-floyds-cycle-finding-algorithm-work/) - Detailed explanation
