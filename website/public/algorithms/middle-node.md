# Middle Node

## Category
Linked List

## Description

Finding the middle node of a linked list is a fundamental operation in linked list manipulation. The **fast and slow pointer** technique (also known as "tortoise and hare") provides an elegant O(n) time and O(1) space solution. This technique is widely used in competitive programming and technical interviews for its simplicity and efficiency.

The key insight is that by moving two pointers at different speeds through the list, we can find the middle node in a single pass without knowing the list's length in advance.

---

## When to Use

Use the fast and slow pointer technique when you need to solve problems involving:

- **Finding the middle of a linked list** - The primary use case
- **Detecting cycles in a linked list** - Floyd's cycle detection algorithm
- **Finding the nth node from the end** - Two-pointer approach
- **Palindrome linked list verification** - Combining with reversal
- **Linked list reordering problems** - Like reorganizing a list in specific ways

### Comparison with Alternatives

| Method | Time Complexity | Space Complexity | Notes |
|--------|-----------------|------------------|-------|
| **Fast & Slow Pointer** | O(n) | O(1) | Single pass, optimal |
| **Count then traverse** | O(n) + O(n) = O(n) | O(1) | Two passes |
| **Array storage** | O(n) | O(n) | Store nodes in array |
| **Recursive (count)** | O(n) | O(n) | Stack space for recursion |

### When to Choose Fast & Slow Pointer vs Other Methods

- **Choose Fast & Slow Pointer** when:
  - You need O(1) space complexity
  - You want a single-pass solution
  - You're dealing with cycle detection
  - The list length is unknown

- **Choose Array Storage** when:
  - Random access to nodes is frequently needed
  - Memory is not a concern
  - You need to preserve node references for later

- **Choose Count then Traverse** when:
  - Simplicity is preferred over optimization
  - The list is small

---

## Algorithm Explanation

### Core Concept

The fast and slow pointer technique leverages relative speed to find the middle of a linked list. When two pointers traverse a list where one moves twice as fast as the other, the slower pointer will be exactly at the middle when the faster pointer reaches the end.

### How It Works

1. **Initialize two pointers** at the head of the linked list:
   - **Slow pointer** (or "tortoise"): moves 1 step at a time
   - **Fast pointer** (or "hare"): moves 2 steps at a time

2. **Traverse the list** by moving both pointers simultaneously:
   - In each iteration, slow advances by 1 node
   - In each iteration, fast advances by 2 nodes

3. **Stop when** the fast pointer reaches the end:
   - Either `fast` is `None` (null)
   - Or `fast.next` is `None`

4. **The slow pointer** will now be at the middle node

### Why This Finds the Middle

When the fast pointer reaches the end, it has traveled exactly twice the distance of the slow pointer. If the list has `n` nodes:
- Fast pointer travels `n` nodes (or `n-1` for even lists)
- Slow pointer travels `n/2` nodes (or `n/2` for even lists)

This means the slow pointer is precisely at position `n/2`, which is the middle.

### Visual Representation

```
List: 1 -> 2 -> 3 -> 4 -> 5 -> None

Step 0: slow=1, fast=1
Step 1: slow=2, fast=3   (fast moves 2, slow moves 1)
Step 2: slow=3, fast=5   (fast moves 2, slow moves 1)
        fast.next = None → STOP
        Return slow (node 3)
```

For even-length lists (e.g., 4 nodes):
```
List: 1 -> 2 -> 3 -> 4 -> None

Step 0: slow=1, fast=1
Step 1: slow=2, fast=3   (fast moves 2, slow moves 1)
Step 2: slow=3, fast=None → fast.next is None, STOP
        Return slow (node 3) - the SECOND middle node
```

### Edge Cases

1. **Empty List** (`head = None`): Return `None` - the function handles this naturally since the while loop never executes

2. **Single Node** (`head.next = None`): Return the head node - slow and fast both start at head, loop doesn't execute, returns head

3. **Even Number of Nodes** (e.g., 4 nodes): Returns the **second middle** node (node at index 2, 0-indexed). For [1,2,3,4], returns node 3

4. **Odd Number of Nodes** (e.g., 5 nodes): Returns the exact middle node. For [1,2,3,4,5], returns node 3

---

## Algorithm Steps

1. **Check for empty list**: If `head` is `None`, return `None` immediately
2. **Initialize pointers**: Set both `slow` and `fast` to `head`
3. **Traverse with loop**: While `fast` is not `None` AND `fast.next` is not `None`:
   - Move `slow` one step: `slow = slow.next`
   - Move `fast` two steps: `fast = fast.next.next`
4. **Return result**: When loop terminates, `slow` points to the middle node; return `slow`

---

## Implementation

### Template Code (Fast & Slow Pointer)

````carousel
```python
class ListNode:
    """
    Definition for singly-linked list node.
    
    Attributes:
        val: The value stored in the node.
        next: Pointer to the next node in the linked list.
    """
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next


def middle_node(head: ListNode) -> ListNode:
    """
    Find the middle node of a singly linked list.
    
    Uses the fast and slow pointer technique where:
    - Slow pointer moves 1 step at a time
    - Fast pointer moves 2 steps at a time
    
    When fast reaches the end, slow will be at the middle.
    
    Args:
        head: The head of the linked list.
        
    Returns:
        The middle node of the linked list.
        - For odd length: returns the exact middle node
        - For even length: returns the second middle node
        - For empty list: returns None
        - For single node: returns that node
        
    Time: O(n)
    Space: O(1)
    
    Examples:
        >>> head = ListNode(1, ListNode(2, ListNode(3, ListNode(4, ListNode(5)))))
        >>> middle_node(head).val
        3
        
        >>> head = ListNode(1, ListNode(2, ListNode(3, ListNode(4))))
        >>> middle_node(head).val
        3
    """
    if not head:
        return None
    
    slow = head
    fast = head
    
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
    
    return slow
```

<!-- slide -->
```cpp
#include <iostream>
#include <cstddef>
using namespace std;

/**
 * Definition for singly-linked list node.
 */
struct ListNode {
    int val;
    ListNode* next;
    ListNode() : val(0), next(nullptr) {}
    ListNode(int x) : val(x), next(nullptr) {}
    ListNode(int x, ListNode* next) : val(x), next(next) {}
};

/**
 * Find the middle node of a singly linked list.
 * 
 * Uses the fast and slow pointer technique:
 * - Slow pointer moves 1 step at a time
 * - Fast pointer moves 2 steps at a time
 * 
 * Time: O(n)
 * Space: O(1)
 * 
 * @param head The head of the linked list
 * @return The middle node of the linked list
 */
ListNode* middleNode(ListNode* head) {
    if (!head) {
        return nullptr;
    }
    
    ListNode* slow = head;
    ListNode* fast = head;
    
    while (fast && fast->next) {
        slow = slow->next;
        fast = fast->next->next;
    }
    
    return slow;
}

// Helper function to create a linked list from vector
ListNode* createList(const vector<int>& vals) {
    if (vals.empty()) return nullptr;
    
    ListNode* head = new ListNode(vals[0]);
    ListNode* curr = head;
    
    for (size_t i = 1; i < vals.size(); i++) {
        curr->next = new ListNode(vals[i]);
        curr = curr->next;
    }
    
    return head;
}

// Helper function to print a linked list
void printList(ListNode* head) {
    while (head) {
        cout << head->val;
        if (head->next) cout << " -> ";
        head = head->next;
    }
    cout << endl;
}

// Test the implementation
int main() {
    // Test case 1: Odd length list
    vector<int> vals1 = {1, 2, 3, 4, 5};
    ListNode* head1 = createList(vals1);
    cout << "List 1: ";
    printList(head1);
    ListNode* mid1 = middleNode(head1);
    cout << "Middle node value: " << mid1->val << endl << endl;
    
    // Test case 2: Even length list
    vector<int> vals2 = {1, 2, 3, 4};
    ListNode* head2 = createList(vals2);
    cout << "List 2: ";
    printList(head2);
    ListNode* mid2 = middleNode(head2);
    cout << "Middle node value: " << mid2->val << " (second middle)" << endl;
    
    return 0;
}
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

/**
 * Find the middle node of a singly linked list.
 * 
 * Uses the fast and slow pointer technique:
 * - Slow pointer moves 1 step at a time
 * - Fast pointer moves 2 steps at a time
 * 
 * Time: O(n)
 * Space: O(1)
 * 
 * @param head The head of the linked list
 * @return The middle node of the linked list
 */
public ListNode middleNode(ListNode head) {
    if (head == null) {
        return null;
    }
    
    ListNode slow = head;
    ListNode fast = head;
    
    while (fast != null && fast.next != null) {
        slow = slow.next;
        fast = fast.next.next;
    }
    
    return slow;
}

// Helper method to create a linked list from array
private ListNode createList(int[] values) {
    if (values == null || values.length == 0) return null;
    
    ListNode head = new ListNode(values[0]);
    ListNode current = head;
    
    for (int i = 1; i < values.length; i++) {
        current.next = new ListNode(values[i]);
        current = current.next;
    }
    
    return head;
}

// Test the implementation
public static void main(String[] args) {
    Solution solution = new Solution();
    
    // Test case 1: Odd length list
    ListNode head1 = solution.createList(new int[]{1, 2, 3, 4, 5});
    ListNode mid1 = solution.middleNode(head1);
    System.out.println("List: 1 -> 2 -> 3 -> 4 -> 5");
    System.out.println("Middle node value: " + mid1.val);
    
    // Test case 2: Even length list
    ListNode head2 = solution.createList(new int[]{1, 2, 3, 4});
    ListNode mid2 = solution.middleNode(head2);
    System.out.println("\nList: 1 -> 2 -> 3 -> 4");
    System.out.println("Middle node value: " + mid2.val + " (second middle)");
}
```

<!-- slide -->
```javascript
/**
 * Definition for singly-linked list node.
 */
class ListNode {
    constructor(val = 0, next = null) {
        this.val = val;
        this.next = next;
    }
}

/**
 * Find the middle node of a singly linked list.
 * 
 * Uses the fast and slow pointer technique:
 * - Slow pointer moves 1 step at a time
 * - Fast pointer moves 2 steps at a time
 * 
 * Time: O(n)
 * Space: O(1)
 * 
 * @param {ListNode} head - The head of the linked list
 * @returns {ListNode} The middle node of the linked list
 */
function middleNode(head) {
    if (!head) {
        return null;
    }
    
    let slow = head;
    let fast = head;
    
    while (fast && fast.next) {
        slow = slow.next;
        fast = fast.next.next;
    }
    
    return slow;
}

// Helper function to create a linked list from array
function createList(values) {
    if (!values || values.length === 0) return null;
    
    const head = new ListNode(values[0]);
    let current = head;
    
    for (let i = 1; i < values.length; i++) {
        current.next = new ListNode(values[i]);
        current = current.next;
    }
    
    return head;
}

// Helper function to print a linked list
function printList(head) {
    const values = [];
    while (head) {
        values.push(head.val);
        head = head.next;
    }
    console.log(values.join(' -> '));
}

// Test the implementation
// Test case 1: Odd length list
const head1 = createList([1, 2, 3, 4, 5]);
console.log("List: ", end = '');
printList(head1);
const mid1 = middleNode(head1);
console.log("Middle node value:", mid1.val);

// Test case 2: Even length list
const head2 = createList([1, 2, 3, 4]);
console.log("\nList: ", end = '');
printList(head2);
const mid2 = middleNode(head2);
console.log("Middle node value:", mid2.val, "(second middle)");
```
````

---

## Time Complexity Analysis

| Operation | Time Complexity | Description |
|-----------|----------------|-------------|
| **Traversal** | O(n) | Each node is visited at most once by slow pointer; fast visits at most n/2 nodes |
| **Overall** | O(n) | Single pass through the list |

### Detailed Breakdown

- **Best Case**: O(1) - For a list with 0 or 1 node, loop doesn't execute
- **Average Case**: O(n/2) iterations - For a list of n nodes
- **Worst Case**: O(n/2) iterations - Same as average case

The fast pointer moves approximately twice as fast as the slow pointer, so it reaches the end in roughly n/2 iterations. The slow pointer also advances in each iteration, so it makes approximately n/2 moves total.

---

## Space Complexity Analysis

| Component | Space Complexity | Description |
|-----------|------------------|--------------|
| **Slow Pointer** | O(1) | Single ListNode reference |
| **Fast Pointer** | O(1) | Single ListNode reference |
| **Total** | O(1) | Only two pointers regardless of input size |

### Key Points

- **No additional data structures** are used
- **Constant space** regardless of list length
- **In-place operation** - doesn't modify the list
- **Recursive alternative** would use O(n) stack space

---

## Common Variations

### 1. Find First Middle (Return First of Two Middles)

For even-length lists, return the first middle node instead of the second:

````carousel
```python
def middle_node_first(head):
    """Return first middle for even-length lists."""
    if not head:
        return None
    
    slow = head
    fast = head
    
    # Stop when fast reaches last node, not when it goes past
    while fast.next and fast.next.next:
        slow = slow.next
        fast = fast.next.next
    
    return slow
```

<!-- slide -->
```cpp
ListNode* middleNodeFirst(ListNode* head) {
    // Return first middle for even-length lists
    if (!head) return nullptr;
    
    ListNode* slow = head;
    ListNode* fast = head;
    
    // Stop when fast reaches last node
    while (fast->next && fast->next->next) {
        slow = slow->next;
        fast = fast->next->next;
    }
    
    return slow;
}
```

<!-- slide -->
```java
public ListNode middleNodeFirst(ListNode head) {
    // Return first middle for even-length lists
    if (head == null) return null;
    
    ListNode slow = head;
    ListNode fast = head;
    
    while (fast.next != null && fast.next.next != null) {
        slow = slow.next;
        fast = fast.next.next;
    }
    
    return slow;
}
```

<!-- slide -->
```javascript
function middleNodeFirst(head) {
    // Return first middle for even-length lists
    if (!head) return null;
    
    let slow = head;
    let fast = head;
    
    while (fast.next && fast.next.next) {
        slow = slow.next;
        fast = fast.next.next;
    }
    
    return slow;
}
```
````

### 2. Find Middle Using Count then Traverse (Two-Pass)

Simpler but uses two passes:

````carousel
```python
def middle_node_two_pass(head):
    """Two-pass approach: count first, then traverse."""
    if not head:
        return None
    
    # First pass: count nodes
    count = 0
    curr = head
    while curr:
        count += 1
        curr = curr.next
    
    # Second pass: go to middle
    middle_idx = count // 2
    curr = head
    for _ in range(middle_idx):
        curr = curr.next
    
    return curr
```
````

### 3. Recursive Approach

Uses recursion but requires O(n) stack space:

````carousel
```python
def middle_node_recursive(head):
    """Recursive approach using helper function."""
    
    def count_and_find(node, count=[0]):
        """Returns (middle_node, position)."""
        if not node:
            return (None, count[0])
        
        middle, total = count_and_find(node.next, count)
        count[0] += 1
        
        # When we've traversed half, this is the middle
        if count[0] == total // 2 + 1:
            return (node, total)
        
        return (middle, total)
    
    result, _ = count_and_find(head)
    return result
```
````

### 4. Cycle Detection (Floyd's Algorithm)

The same technique can detect cycles in linked lists:

````carousel
```python
def has_cycle(head):
    """Detect if linked list has a cycle using fast and slow pointers."""
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
````

---

## Practice Problems

### Problem 1: Middle of the Linked List

**Problem:** [LeetCode 876 - Middle of the Linked List](https://leetcode.com/problems/middle-of-the-linked-list/)

**Description:** Given the head of a singly linked list, return the middle node. If there are two middle nodes, return the second middle node.

**How to Apply the Technique:**
- Use the fast and slow pointer approach directly
- This is the canonical problem for this technique
- Time: O(n), Space: O(1)

---

### Problem 2: Delete Middle Node

**Problem:** [LeetCode 2095 - Delete the Middle Node of a Linked List](https://leetcode.com/problems/delete-the-middle-node-of-a-linked-list/)

**Description:** You are given the head of a linked list. Delete the middle node, and return the head of the modified linked list.

**How to Apply the Technique:**
- Use fast and slow to find the middle
- Keep a "previous" pointer one step behind slow
- When slow is at middle, use previous.next = slow.next to delete
- Handle edge cases: 1 or 2 nodes

---

### Problem 3: Convert Binary Search Tree to Sorted Doubly Linked List

**Problem:** [LeetCode 426 - Convert Binary Search Tree to Sorted Doubly Linked List](https://leetcode.com/problems/convert-binary-search-tree-to-sorted-doubly-linked-list/)

**Description:** Convert a BST to a sorted circular doubly-linked list in-place.

**How to Apply the Technique:**
- Use in-order traversal with a "previous" pointer (similar concept)
- The previous pointer acts like our slow pointer
- Connect nodes as we traverse

---

### Problem 4: Find the Middle of Linked List II (First Middle)

**Problem:** Variation of LeetCode 876

**Description:** Given the head of a linked list, return the first middle node (for even-length lists, return the first of the two middle nodes).

**How to Apply the Technique:**
- Modify the loop condition to: `while fast.next and fast.next.next`
- This stops when fast reaches the last node instead of going past

---

### Problem 5: Linked List Cycle II

**Problem:** [LeetCode 142 - Linked List Cycle II](https://leetcode.com/problems/linked-list-cycle-ii/)

**Description:** Given the head of a linked list, return the node where the cycle begins. If there is no cycle, return null.

**How to Apply the Technique:**
- Use fast and slow to detect if cycle exists
- Once detected, reset one pointer to head
- Move both one step at a time; they'll meet at cycle start
- Mathematical proof: distance from head to cycle start = distance from meeting point to cycle start

---

## Video Tutorial Links

### Fundamentals

- [Middle of Linked List - Fast and Slow Pointer (Take U Forward)](https://www.youtube.com/watch?v=o9RH-4W2Jpw) - Comprehensive explanation of the technique
- [Linked List Middle Element (WilliamFiset)](https://www.youtube.com/watch?v=2L1R3cMyG8k) - Detailed implementation walkthrough
- [Fast and Slow Pointer Technique (NeetCode)](https://www.youtube.com/watch?v=o4bPC1o63M4) - Multiple applications

### Related Problems

- [Floyd's Cycle Detection Algorithm](https://www.youtube.com/watch?v=46COp1r3qCM) - Detecting cycles in linked lists
- [Linked List Cycle II - Finding Cycle Start](https://www.youtube.com/watch?v=9kpX0MYkrTk) - Advanced application
- [Delete Middle of Linked List](https://www.youtube.com/watch?v=e9YqxXK3J8s) - Practical variation

---

## Follow-up Questions

### Q1: How do you find the kth node from the end using fast and slow pointers?

**Answer:** 
1. Move the fast pointer k steps ahead of the slow pointer
2. Then move both pointers together until fast reaches the end
3. Slow will be k nodes from the end
4. Time: O(n), Space: O(1)

### Q2: What happens if the fast pointer moves 3 steps instead of 2?

**Answer:**
- For finding the middle: You would overshoot and get incorrect results
- For cycle detection: It still works but may take longer
- The key is that fast must move at least 2x faster than slow to guarantee termination
- Other multiples (3, 4, etc.) work for cycle detection but may have different detection characteristics

### Q3: Can this technique be applied to arrays or only linked lists?

**Answer:**
- Primarily designed for linked lists due to sequential access
- For arrays, you can simply use indices to simulate pointers
- The concept works but is less useful for arrays since random access is O(1)
- For arrays, you can just use `arr[n/2]` to get the middle

### Q4: How do you handle finding the middle in a circular linked list?

**Answer:**
- The algorithm works the same way
- But you need a stopping condition based on cycle detection
- You must detect when you've looped back to the starting point
- Use Floyd's cycle detection combined with middle finding

### Q5: What's the difference between returning the first vs second middle for even-length lists?

**Answer:**
- **Standard (second middle)**: Loop condition `while fast and fast.next`
- **First middle**: Loop condition `while fast.next and fast.next.next`
- For list [1,2,3,4]:
  - Second middle returns node 3
  - First middle returns node 2
- The choice depends on problem requirements

---

## Summary

The fast and slow pointer technique is an elegant solution for finding the middle of a linked list. Key takeaways:

- **Single pass**: O(n) time complexity with just one traversal
- **Constant space**: O(1) space - only two pointers needed
- **Versatile**: Can be adapted for cycle detection, kth-from-end, and more
- **Simple implementation**: Clean and easy to understand

When to use:
- ✅ Finding middle of linked list
- ✅ Detecting cycles (Floyd's algorithm)
- ✅ Finding kth node from end
- ✅ Palindrome verification
- ❌ When you need random access (use array instead)
- ❌ When you need first middle for even lists (modify condition)

This technique is essential for linked list problems and frequently appears in technical interviews and competitive programming.

---

## Related Algorithms

- [Linked List Cycle Detection](./detect-cycle.md) - Floyd's algorithm for cycle detection
- [Nth Node from End](./two-pointers-fixed-separation-nth-node-from-end.md) - Finding kth element from end
- [Linked List Reversal](./linked-list-in-place-reversal.md) - In-place list reversal
- [Palindrome Linked List](./linked-list-palindrome.md) - Checking if list is palindrome
