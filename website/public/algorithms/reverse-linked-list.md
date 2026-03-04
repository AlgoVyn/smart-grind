# Reverse Linked List

## Category
Linked List

## Description

Reversing a linked list is a fundamental operation in computer science that involves changing the direction of the `next` pointers to make the list point in the opposite direction. This operation is essential for many algorithmic problems, including palindrome checking, reversing sublists, and implementing certain data structures like stacks.

The key insight is that we can reverse a linked list by iterating through it once and flipping each pointer. This can be done iteratively with O(1) space complexity, or recursively using the call stack.

---

## When to Use

Use the Reverse Linked List algorithm when you need to solve problems involving:

- **Complete List Reversal**: When you need to reverse an entire linked list
- **Partial List Reversal**: When you need to reverse a portion of a linked list (e.g., reversing nodes from position m to n)
- **Palindrome Detection**: When checking if a linked list represents a palindrome
- **Stack Implementation**: When you need LIFO (Last In First Out) behavior using a linked list
- **Data Structure Manipulation**: When implementing undo operations or maintaining history

### Comparison with Alternatives

| Approach | Time Complexity | Space Complexity | Best Use Case |
|----------|----------------|------------------|---------------|
| **Iterative (3-Pointer)** | O(n) | O(1) | General list reversal, memory-constrained environments |
| **Recursive** | O(n) | O(n) | When recursion is more natural, smaller lists |
| **In-place Reversal** | O(n) | O(1) | When modifying the original list is acceptable |
| **Copy & Reverse** | O(n) | O(n) | When original list must be preserved |

### When to Choose Each Approach

- **Choose Iterative** when:
  - Working with large lists where space matters
  - Memory is constrained
  - You need maximum efficiency

- **Choose Recursive** when:
  - The list is small
  - Code readability is prioritized
  - You're already in a recursive context

- **Choose Partial Reversal** when:
  - Only a portion of the list needs reversing
  - Working with sublists
  - Implementing algorithms like reverse groups

---

## Algorithm Explanation

### Core Concept

The key insight behind reversing a linked list is that we process one node at a time, flipping its `next` pointer to point to the previous node instead of the current next node. By the time we finish processing all nodes, we've completely reversed the list.

### How It Works

#### Iterative Approach (3-Pointer Technique):

1. **Initialize**: Set `prev = None`, `current = head`, `next = None`
2. **Iterate**: While `current` is not None:
   - Save `next = current.next` (preserve the rest of the list)
   - Reverse the link: `current.next = prev`
   - Move forward: `prev = current`, `current = next`
3. **Complete**: When `current` reaches None, `prev` points to the new head

#### Recursive Approach:

1. **Base Case**: If `head` is None or `head.next` is None, return `head`
2. **Recurse**: Call recursively on `head.next` to reverse the rest
3. **Reverse**: After recursion returns, set `head.next.next = head` and `head.next = None`
4. **Return**: Return the new head

### Visual Representation

For list `1 -> 2 -> 3 -> 4 -> 5`:

```
Initial:    prev=None, curr=1
            1 -> 2 -> 3 -> 4 -> 5 -> None

Step 1:     next=2
            1 <- prev, curr=2
            1 -> None, 2 -> 3 -> 4 -> 5 -> None

Step 2:     next=3
            2 -> 1 -> None, curr=3
            2 -> 1 -> None, 3 -> 4 -> 5 -> None

Step 3:     next=4
            3 -> 2 -> 1 -> None, curr=4
            
Step 4:     next=5
            4 -> 3 -> 2 -> 1 -> None, curr=5

Step 5:     next=None
            5 -> 4 -> 3 -> 2 -> 1 -> None (prev = new head)
```

### Why It Works

- We process one node at a time, never losing access to the rest of the list
- By saving `next` before reversing, we preserve the remaining list
- Each node's pointer is flipped exactly once
- The process is deterministic and completes in exactly n iterations

### Edge Cases to Consider

- **Empty List**: `head = None` → Return None immediately
- **Single Node**: `head.next = None` → Return head (no reversal needed)
- **Two Nodes**: Handle correctly with both pointers flipping
- **Circular Lists**: Not applicable (would create infinite loop)

---

## Algorithm Steps

### Iterative Reversal

1. **Initialize pointers**: Set `prev = None`, `current = head`
2. **Enter loop**: While `current` is not None:
3. **Save next**: Store `next_node = current.next`
4. **Reverse link**: Set `current.next = prev`
5. **Move prev**: Set `prev = current`
6. **Move current**: Set `current = next_node`
7. **Return**: Return `prev` (new head)

### Recursive Reversal

1. **Check base case**: If `head` is None or `head.next` is None, return `head`
2. **Recurse**: Call `reverseList(head.next)` and store result in `new_head`
3. **Reverse last link**: Set `head.next.next = head`
4. **Remove old link**: Set `head.next = None`
5. **Return**: Return `new_head`

### Partial Reversal (Reverse Between)

1. **Create dummy**: Add dummy node before head for edge cases
2. **Find prev**: Traverse to node before reversal point (left-1)
3. **Reverse portion**: For `right - left` times, move nodes:
   - Save `temp = current.next`
   - Move current's next forward
   - Insert temp after prev
4. **Return**: Return `dummy.next`

---

## Implementation

### Template Code (Iterative & Recursive)

````carousel
```python
class ListNode:
    """Definition for singly-linked list node."""
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next


def reverse_list(head):
    """
    Reverse a singly linked list iteratively.
    
    Args:
        head: Head of the linked list
    
    Returns:
        New head of the reversed list
    
    Time: O(n)
    Space: O(1)
    """
    prev = None
    current = head
    
    while current:
        next_node = current.next  # Save next
        current.next = prev       # Reverse link
        prev = current            # Move prev forward
        current = next_node       # Move current forward
    
    return prev


def reverse_list_recursive(head):
    """
    Reverse a singly linked list recursively.
    
    Time: O(n)
    Space: O(n) for call stack
    """
    # Base case: empty list or single node
    if not head or not head.next:
        return head
    
    # Reverse the rest of the list
    new_head = reverse_list_recursive(head.next)
    
    # Reverse the current node's pointer
    head.next.next = head
    head.next = None
    
    return new_head


def reverse_between(head, left, right):
    """
    Reverse a portion of the linked list from position left to right.
    1-indexed positions.
    
    Time: O(n)
    Space: O(1)
    """
    if not head or left == right:
        return head
    
    # Create dummy node to handle edge case of reversing from head
    dummy = ListNode(0)
    dummy.next = head
    
    # Find node before the reversal portion
    prev = dummy
    for _ in range(left - 1):
        prev = prev.next
    
    # Reverse the portion
    current = prev.next
    for _ in range(right - left):
        next_node = current.next
        current.next = next_node.next
        next_node.next = prev.next
        prev.next = next_node
    
    return dummy.next


# Example usage and demonstration
if __name__ == "__main__":
    # Create a linked list: 1 -> 2 -> 3 -> 4 -> 5
    def create_list(values):
        if not values:
            return None
        head = ListNode(values[0])
        current = head
        for val in values[1:]:
            current.next = ListNode(val)
            current = current.next
        return head
    
    def print_list(head):
        values = []
        while head:
            values.append(str(head.val))
            head = head.next
        print(" -> ".join(values) if values else "Empty")
    
    # Test iterative reversal
    print("Original list:")
    head = create_list([1, 2, 3, 4, 5])
    print_list(head)
    
    reversed_head = reverse_list(head)
    print("After iterative reversal:")
    print_list(reversed_head)
    
    # Test recursive reversal
    head = create_list([1, 2, 3, 4, 5])
    reversed_head = reverse_list_recursive(head)
    print("After recursive reversal:")
    print_list(reversed_head)
    
    # Test partial reversal
    head = create_list([1, 2, 3, 4, 5])
    reversed_head = reverse_between(head, 2, 4)
    print("After reversing positions 2-4:")
    print_list(reversed_head)
```

<!-- slide -->
```cpp
#include <iostream>
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
 * Reverse a singly linked list iteratively.
 * 
 * Time: O(n)
 * Space: O(1)
 */
ListNode* reverseList(ListNode* head) {
    ListNode* prev = nullptr;
    ListNode* current = head;
    
    while (current) {
        ListNode* next_node = current->next;  // Save next
        current->next = prev;                  // Reverse link
        prev = current;                         // Move prev forward
        current = next_node;                    // Move current forward
    }
    
    return prev;
}

/**
 * Reverse a singly linked list recursively.
 * 
 * Time: O(n)
 * Space: O(n) for call stack
 */
ListNode* reverseListRecursive(ListNode* head) {
    // Base case: empty list or single node
    if (!head || !head->next) {
        return head;
    }
    
    // Reverse the rest of the list
    ListNode* new_head = reverseListRecursive(head->next);
    
    // Reverse the current node's pointer
    head->next->next = head;
    head->next = nullptr;
    
    return new_head;
}

/**
 * Reverse a portion of the linked list from position left to right.
 * 1-indexed positions.
 * 
 * Time: O(n)
 * Space: O(1)
 */
ListNode* reverseBetween(ListNode* head, int left, int right) {
    if (!head || left == right) {
        return head;
    }
    
    // Create dummy node
    ListNode* dummy = new ListNode(0);
    dummy->next = head;
    
    // Find node before the reversal portion
    ListNode* prev = dummy;
    for (int i = 0; i < left - 1; i++) {
        prev = prev->next;
    }
    
    // Reverse the portion
    ListNode* current = prev->next;
    for (int i = 0; i < right - left; i++) {
        ListNode* next_node = current->next;
        current->next = next_node->next;
        next_node->next = prev->next;
        prev->next = next_node;
    }
    
    return dummy->next;
}

// Helper functions
void printList(ListNode* head) {
    while (head) {
        cout << head->val;
        if (head->next) cout << " -> ";
        head = head->next;
    }
    cout << endl;
}

ListNode* createList(const vector<int>& values) {
    if (values.empty()) return nullptr;
    ListNode* head = new ListNode(values[0]);
    ListNode* current = head;
    for (size_t i = 1; i < values.size(); i++) {
        current->next = new ListNode(values[i]);
        current = current->next;
    }
    return head;
}

int main() {
    // Test iterative reversal
    cout << "Original list: ";
    ListNode* head = createList({1, 2, 3, 4, 5});
    printList(head);
    
    ListNode* reversed = reverseList(head);
    cout << "After iterative reversal: ";
    printList(reversed);
    
    // Test partial reversal
    head = createList({1, 2, 3, 4, 5});
    reversed = reverseBetween(head, 2, 4);
    cout << "After reversing positions 2-4: ";
    printList(reversed);
    
    return 0;
}
```

<!-- slide -->
```java
/**
 * Definition for singly-linked list.
 */
class ListNode {
    int val;
    ListNode next;
    ListNode() {}
    ListNode(int val) { this.val = val; }
    ListNode(int val, ListNode next) { 
        this.val = val; 
        this.next = next; 
    }
}

/**
 * Reverse Linked List Solution
 */
public class ReverseLinkedList {
    
    /**
     * Reverse a singly linked list iteratively.
     * 
     * Time: O(n)
     * Space: O(1)
     */
    public ListNode reverseList(ListNode head) {
        ListNode prev = null;
        ListNode current = head;
        
        while (current != null) {
            ListNode next_node = current.next;  // Save next
            current.next = prev;                 // Reverse link
            prev = current;                       // Move prev forward
            current = next_node;                  // Move current forward
        }
        
        return prev;
    }
    
    /**
     * Reverse a singly linked list recursively.
     * 
     * Time: O(n)
     * Space: O(n) for call stack
     */
    public ListNode reverseListRecursive(ListNode head) {
        // Base case: empty list or single node
        if (head == null || head.next == null) {
            return head;
        }
        
        // Reverse the rest of the list
        ListNode newHead = reverseListRecursive(head.next);
        
        // Reverse the current node's pointer
        head.next.next = head;
        head.next = null;
        
        return newHead;
    }
    
    /**
     * Reverse a portion of the linked list from position left to right.
     * 1-indexed positions.
     * 
     * Time: O(n)
     * Space: O(1)
     */
    public ListNode reverseBetween(ListNode head, int left, int right) {
        if (head == null || left == right) {
            return head;
        }
        
        // Create dummy node
        ListNode dummy = new ListNode(0);
        dummy.next = head;
        
        // Find node before the reversal portion
        ListNode prev = dummy;
        for (int i = 0; i < left - 1; i++) {
            prev = prev.next;
        }
        
        // Reverse the portion
        ListNode current = prev.next;
        for (int i = 0; i < right - left; i++) {
            ListNode next_node = current.next;
            current.next = next_node.next;
            next_node.next = prev.next;
            prev.next = next_node;
        }
        
        return dummy.next;
    }
    
    // Helper methods
    public void printList(ListNode head) {
        while (head != null) {
            System.out.print(head.val);
            if (head.next != null) System.out.print(" -> ");
            head = head.next;
        }
        System.out.println();
    }
    
    public ListNode createList(int[] values) {
        if (values.length == 0) return null;
        ListNode head = new ListNode(values[0]);
        ListNode current = head;
        for (int i = 1; i < values.length; i++) {
            current.next = new ListNode(values[i]);
            current = current.next;
        }
        return head;
    }
    
    public static void main(String[] args) {
        ReverseLinkedList solution = new ReverseLinkedList();
        
        // Test iterative reversal
        System.out.print("Original list: ");
        ListNode head = solution.createList(new int[]{1, 2, 3, 4, 5});
        solution.printList(head);
        
        ListNode reversed = solution.reverseList(head);
        System.out.print("After iterative reversal: ");
        solution.printList(reversed);
        
        // Test partial reversal
        head = solution.createList(new int[]{1, 2, 3, 4, 5});
        reversed = solution.reverseBetween(head, 2, 4);
        System.out.print("After reversing positions 2-4: ");
        solution.printList(reversed);
    }
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
 * Reverse a singly linked list iteratively.
 * 
 * Time: O(n)
 * Space: O(1)
 */
function reverseList(head) {
    let prev = null;
    let current = head;
    
    while (current !== null) {
        const next = current.next;  // Save next
        current.next = prev;         // Reverse link
        prev = current;              // Move prev forward
        current = next;               // Move current forward
    }
    
    return prev;
}

/**
 * Reverse a singly linked list recursively.
 * 
 * Time: O(n)
 * Space: O(n) for call stack
 */
function reverseListRecursive(head) {
    // Base case: empty list or single node
    if (!head || !head.next) {
        return head;
    }
    
    // Reverse the rest of the list
    const newHead = reverseListRecursive(head.next);
    
    // Reverse the current node's pointer
    head.next.next = head;
    head.next = null;
    
    return newHead;
}

/**
 * Reverse a portion of the linked list from position left to right.
 * 1-indexed positions.
 * 
 * Time: O(n)
 * Space: O(1)
 */
function reverseBetween(head, left, right) {
    if (!head || left === right) {
        return head;
    }
    
    // Create dummy node
    const dummy = new ListNode(0);
    dummy.next = head;
    
    // Find node before the reversal portion
    let prev = dummy;
    for (let i = 0; i < left - 1; i++) {
        prev = prev.next;
    }
    
    // Reverse the portion
    let current = prev.next;
    for (let i = 0; i < right - left; i++) {
        const nextNode = current.next;
        current.next = nextNode.next;
        nextNode.next = prev.next;
        prev.next = nextNode;
    }
    
    return dummy.next;
}

// Helper functions
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

function printList(head) {
    const values = [];
    while (head) {
        values.push(head.val);
        head = head.next;
    }
    console.log(values.join(' -> '));
}

// Example usage and demonstration
console.log("Original list:");
let head = createList([1, 2, 3, 4, 5]);
printList(head);

console.log("After iterative reversal:");
let reversed = reverseList(head);
printList(reversed);

console.log("After recursive reversal:");
head = createList([1, 2, 3, 4, 5]);
reversed = reverseListRecursive(head);
printList(reversed);

console.log("After reversing positions 2-4:");
head = createList([1, 2, 3, 4, 5]);
reversed = reverseBetween(head, 2, 4);
printList(reversed);
```
````

---

## Time Complexity Analysis

| Operation | Time Complexity | Description |
|-----------|----------------|-------------|
| **Iterative Reversal** | O(n) | Single pass through all n nodes |
| **Recursive Reversal** | O(n) | Each node visited once in recursion |
| **Partial Reversal** | O(n) | Traversal to left position + (right-left) operations |
| **Finding Node** | O(n) | Linear search if position not given |

### Detailed Breakdown

- **Iterative**: We traverse each node exactly once, performing O(1) work per node
- **Recursive**: Each recursive call processes one node, and there are n recursive calls
- **Partial**: First traverse to position left (O(left)), then reverse (right-left) nodes

---

## Space Complexity Analysis

| Approach | Space Complexity | Notes |
|----------|-----------------|-------|
| **Iterative** | O(1) | Only 3 pointers regardless of list size |
| **Recursive** | O(n) | Call stack depth equals list length |
| **Partial Reversal** | O(1) | Only pointers, no extra space |

### Space Optimization Tips

1. **Use iterative over recursive** when space is critical
2. **Consider tail recursion optimization** in some languages
3. **In-place modification** eliminates need for copy

---

## Common Variations

### 1. Reverse in Groups (k-group reversal)

Reverse nodes in groups of k. If remaining nodes are less than k, keep them as-is.

````carousel
```python
def reverse_k_group(head, k):
    """Reverse nodes in groups of k."""
    dummy = ListNode(0)
    dummy.next = head
    prev_group = dummy
    
    while True:
        # Check if there are k nodes remaining
        kth = prev_group
        for _ in range(k):
            if not kth.next:
                return dummy.next
            kth = kth.next
        
        # Save start of next group
        next_group = kth.next
        
        # Reverse current group
        prev, curr = prev_group.next, prev_group.next.next
        for _ in range(k):
            next_temp = curr.next
            curr.next = prev
            prev = curr
            curr = next_temp
        
        # Connect with previous and next groups
        first_of_group = prev_group.next
        prev_group.next = kth
        first_of_group.next = next_group
        prev_group = first_of_group
```

<!-- slide -->
```cpp
ListNode* reverseKGroup(ListNode* head, int k) {
    ListNode* dummy = new ListNode(0);
    dummy->next = head;
    ListNode* prev_group = dummy;
    
    while (true) {
        // Check if there are k nodes remaining
        ListNode* kth = prev_group;
        for (int i = 0; i < k; i++) {
            if (!kth->next) return dummy->next;
            kth = kth->next;
        }
        
        // Save start of next group
        ListNode* next_group = kth->next;
        
        // Reverse current group
        ListNode* prev = prev_group->next;
        ListNode* curr = prev->next;
        for (int i = 1; i < k; i++) {
            ListNode* next_temp = curr->next;
            curr->next = prev;
            prev = curr;
            curr = next_temp;
        }
        
        // Connect with previous and next groups
        ListNode* first_of_group = prev_group->next;
        prev_group->next = kth;
        first_of_group->next = next_group;
        prev_group = first_of_group;
    }
}
```

<!-- slide -->
```java
public ListNode reverseKGroup(ListNode head, int k) {
    ListNode dummy = new ListNode(0);
    dummy.next = head;
    ListNode prev_group = dummy;
    
    while (true) {
        // Check if there are k nodes remaining
        ListNode kth = prev_group;
        for (int i = 0; i < k; i++) {
            if (kth.next == null) return dummy.next;
            kth = kth.next;
        }
        
        // Save start of next group
        ListNode next_group = kth.next;
        
        // Reverse current group
        ListNode prev = prev_group.next;
        ListNode curr = prev.next;
        for (int i = 1; i < k; i++) {
            ListNode next_temp = curr.next;
            curr.next = prev;
            prev = curr;
            curr = next_temp;
        }
        
        // Connect with previous and next groups
        ListNode first_of_group = prev_group.next;
        prev_group.next = kth;
        first_of_group.next = next_group;
        prev_group = first_of_group;
    }
}
```

<!-- slide -->
```javascript
function reverseKGroup(head, k) {
    const dummy = new ListNode(0);
    dummy.next = head;
    let prev_group = dummy;
    
    while (true) {
        // Check if there are k nodes remaining
        let kth = prev_group;
        for (let i = 0; i < k; i++) {
            if (!kth.next) return dummy.next;
            kth = kth.next;
        }
        
        // Save start of next group
        const next_group = kth.next;
        
        // Reverse current group
        let prev = prev_group.next;
        let curr = prev.next;
        for (let i = 1; i < k; i++) {
            const next_temp = curr.next;
            curr.next = prev;
            prev = curr;
            curr = next_temp;
        }
        
        // Connect with previous and next groups
        const first_of_group = prev_group.next;
        prev_group.next = kth;
        first_of_group.next = next_group;
        prev_group = first_of_group;
    }
}
```
````

### 2. Reverse Alternating k Nodes

Reverse k nodes, then skip k nodes, repeat.

**Algorithm:**
1. Use a counter to track position in current segment
2. Reverse the first k nodes
3. Skip the next k nodes (just traverse without reversing)
4. Repeat until end of list

### 3. Spiral Matrix from Linked List

Create a matrix in spiral order from linked list values.

**Approach:**
1. Calculate matrix dimensions from list length
2. Use four pointers (top, bottom, left, right) to track boundaries
3. Fill matrix in spiral order: top row → right column → bottom row → left column
4. Update boundaries after each fill

### 4. Palindrome Linked List

Use reversal to check if a linked list is a palindrome:
1. Find middle using slow/fast pointers
2. Reverse second half
3. Compare first half with reversed second half
4. (Optional) Restore the list

````carousel
```python
def is_palindrome(head):
    """Check if linked list is palindrome using reversal."""
    if not head or not head.next:
        return True
    
    # Find middle
    slow = fast = head
    while fast.next and fast.next.next:
        slow = slow.next
        fast = fast.next.next
    
    # Reverse second half
    second_half = reverse_list(slow.next)
    
    # Compare
    first, second = head, second_half
    result = True
    while second:
        if first.val != second.val:
            result = False
            break
        first = first.next
        second = second.next
    
    # Restore (optional)
    slow.next = reverse_list(second_half)
    return result
```

<!-- slide -->
```cpp
bool isPalindrome(ListNode* head) {
    if (!head || !head->next) return true;
    
    // Find middle
    ListNode *slow = head, *fast = head;
    while (fast->next && fast->next->next) {
        slow = slow->next;
        fast = fast->next->next;
    }
    
    // Reverse second half and compare
    ListNode* secondHalf = reverseList(slow->next);
    ListNode* first = head;
    ListNode* second = secondHalf;
    bool result = true;
    
    while (second) {
        if (first->val != second->val) {
            result = false;
            break;
        }
        first = first->next;
        second = second->next;
    }
    
    // Restore
    slow->next = reverseList(secondHalf);
    return result;
}
```

<!-- slide -->
```java
public boolean isPalindrome(ListNode head) {
    if (head == null || head.next == null) return true;
    
    // Find middle
    ListNode slow = head, fast = head;
    while (fast.next != null && fast.next.next != null) {
        slow = slow.next;
        fast = fast.next.next;
    }
    
    // Reverse second half
    ListNode secondHalf = reverseList(slow.next);
    
    // Compare
    ListNode first = head, second = secondHalf;
    boolean result = true;
    while (second != null) {
        if (first.val != second.val) {
            result = false;
            break;
        }
        first = first.next;
        second = second.next;
    }
    
    // Restore
    slow.next = reverseList(secondHalf);
    return result;
}
```

<!-- slide -->
```javascript
function isPalindrome(head) {
    if (!head || !head.next) return true;
    
    // Find middle
    let slow = head, fast = head;
    while (fast.next && fast.next.next) {
        slow = slow.next;
        fast = fast.next.next;
    }
    
    // Reverse second half
    const secondHalf = reverseList(slow.next);
    
    // Compare
    let first = head, second = secondHalf;
    let result = true;
    while (second) {
        if (first.val !== second.val) {
            result = false;
            break;
        }
        first = first.next;
        second = second.next;
    }
    
    // Restore
    slow.next = reverseList(secondHalf);
    return result;
}
```
````

---

## Practice Problems

### Problem 1: Reverse Linked List

**Problem:** [LeetCode 206 - Reverse Linked List](https://leetcode.com/problems/reverse-linked-list/)

**Description:** Given the head of a singly linked list, reverse the list, and return the reversed list.

**How to Apply:**
- Use the iterative 3-pointer technique
- Handle edge cases: empty list, single node
- Return the new head pointer

---

### Problem 2: Reverse Linked List II

**Problem:** [LeetCode 92 - Reverse Linked List II](https://leetcode.com/problems/reverse-linked-list-ii/)

**Description:** Given the head of a singly linked list and two integers left and right, reverse the nodes of the list from position left to position right, and return the reversed list.

**How to Apply:**
- Use dummy node for edge cases
- Locate the node before reversal point
- Reverse exactly (right - left + 1) nodes

---

### Problem 3: Palindrome Linked List

**Problem:** [LeetCode 234 - Palindrome Linked List](https://leetcode.com/problems/palindrome-linked-list/)

**Description:** Given the head of a singly linked list, return true if it is a palindrome or false otherwise.

**How to Apply:**
- Find middle using slow/fast pointers
- Reverse the second half
- Compare first half with reversed second half
- Optionally restore the list

---

### Problem 4: Reverse Nodes in k-Group

**Problem:** [LeetCode 25 - Reverse Nodes in k-Group](https://leetcode.com/problems/reverse-nodes-in-k-group/)

**Description:** Given the head of a linked list, reverse each group of k nodes, and return the modified list. If the number of nodes is not a multiple of k, the last group should remain as-is.

**How to Apply:**
- For each group: check if k nodes available
- Reverse k nodes in place
- Connect reversed group with previous and next groups

---

### Problem 5: Swap Nodes in Pairs

**Problem:** [LeetCode 24 - Swap Nodes in Pairs](https://leetcode.com/problems/swap-nodes-in-pairs/)

**Description:** Given a linked list, swap every two adjacent nodes and return its head.

**How to Apply:**
- Use a variation of in-place reversal
- Process two nodes at a time
- Update pointers to maintain list structure

---

## Video Tutorial Links

### Fundamentals

- [Reverse Linked List - Iterative (Take U Forward)](https://www.youtube.com/watch?v=G0_I-ZF0S20) - Complete iterative solution
- [Reverse Linked List - Recursive (Take U Forward)](https://www.youtube.com/watch?v=KYH83T7eqT4) - Recursive approach explained
- [Reverse Linked List II (NeetCode)](https://www.youtube.com/watch?v=oIRm4yT4lX0) - Partial reversal

### Advanced Topics

- [Reverse Nodes in k-Group](https://www.youtube.com/watch?v=1L88h1oPB8I) - K-group reversal
- [Palindrome Linked List](https://www.youtube.com/watch?v=yOzX4dR7zWQ) - Using reversal for palindrome check
- [Linked List Patterns (NeetCode)](https://www.youtube.com/watch?v=8165Eyt_r5Tw) - Common linked list patterns

---

## Follow-up Questions

### Q1: How do you reverse a linked list in place without using extra space?

**Answer:** Use the iterative 3-pointer approach:
- Maintain `prev`, `current`, and `next` pointers
- For each node, reverse its `next` pointer to point to `prev`
- Move all pointers forward by one position
- This achieves O(1) space complexity

### Q2: What are the differences between iterative and recursive approaches?

**Answer:**
| Aspect | Iterative | Recursive |
|--------|-----------|-----------|
| Space | O(1) | O(n) |
| Speed | Faster (no function call overhead) | Slightly slower |
| Readability | More explicit | More elegant |
| Stack Risk | None | Possible stack overflow for large lists |

### Q3: How do you handle edge cases in linked list reversal?

**Answer:**
- **Empty list (head = null)**: Return null immediately
- **Single node**: Return head as-is (reversing doesn't change anything)
- **Two nodes**: Works with standard algorithm
- **Circular lists**: Not applicable - check for cycle first

### Q4: Can you reverse a linked list using only two pointers?

**Answer:** Yes, but with a modified approach:
- Use only `prev` and `current` pointers
- For each iteration, save `current.next` before overwriting
- This is essentially the same as the 3-pointer approach

### Q5: How do you reverse a portion of a linked list between positions m and n?

**Answer:**
1. Create a dummy node before head
2. Traverse to the node at position m-1 (the node before reversal starts)
3. Reverse n-m+1 nodes starting from position m
4. Reconnect the reversed portion with the rest of the list

---

## Summary

Reversing a linked list is a fundamental operation with numerous applications in algorithm problems. Key takeaways:

- **Core technique**: Process one node at a time, flipping the `next` pointer to the previous node
- **Iterative approach**: O(n) time, O(1) space - preferred for most cases
- **Recursive approach**: O(n) time, O(n) space - elegant but uses more memory
- **Partial reversal**: Useful for sublist manipulation problems
- **Key insight**: Always save `next` before reversing to preserve the rest of the list

When to use:
- ✅ Complete list reversal
- ✅ Partial list reversal (sublist problems)
- ✅ Palindrome checking
- ✅ Stack implementation
- ❌ When you need O(1) space AND have severe recursion limits (use iterative)

This algorithm is essential for technical interviews and competitive programming, forming the foundation for many more complex linked list operations.

---

## Related Algorithms

- [Two Pointers](./two-pointers.md) - Finding middle, cycle detection
- [Fast Slow Pointers](./fast-slow-pointers.md) - Cycle detection, palindrome
- [Merge Sorted Lists](./merge-sorted-lists.md) - List manipulation patterns
- [DFS Preorder](./dfs-preorder.md) - Tree/list traversal patterns
