# Two Pointers - Fast & Slow (Cycle Detection)

## Overview

The **Fast & Slow Pointer** pattern (also known as the **Tortoise and Hare** algorithm) is a powerful two-pointer technique used primarily for detecting cycles in linked structures. The core idea involves maintaining two pointers that move through a data structure at different speeds—typically the slow pointer advances by one step while the fast pointer advances by two steps.

This elegant technique leverages mathematical properties to solve problems that would otherwise require additional space for tracking visited nodes or complex state management.

## Key Concepts

- **Slow Pointer**: Advances one step at a time through the data structure
- **Fast Pointer**: Advances two steps at a time (or k steps for generalized versions)
- **Cycle Detection**: Identifying when a path loops back to a previously visited node
- **Meeting Point**: The point where fast and slow pointers coincide indicates a cycle
- **Entrance Finding**: Determining where the cycle begins using the Floyd's Tortoise and Hare algorithm

## Intuition & Why It Works

The genius of this technique lies in a simple mathematical observation: in a cyclic structure, a faster-moving pointer will eventually "lap" a slower-moving pointer. 

**Why Cycles Are Detectable:**
- Imagine two runners on a circular track starting from the same point
- One runner moves at speed 1 (slow), the other at speed 2 (fast)
- After the fast runner completes one full lap, the slow runner has only completed half
- Eventually, the fast runner catches up to the slow runner from behind

**Finding Cycle Entry:**
- Once a cycle is detected, reset one pointer to the start
- Move both pointers at the same speed (one step)
- The point where they meet again is the cycle entrance
- This works because the distance from the start to the cycle entrance equals the distance from the meeting point (inside the cycle) to the entrance

## Algorithm Approaches

### Approach 1: Basic Cycle Detection (Floyd's Algorithm)

This is the classic Floyd's Tortoise and Hare algorithm for detecting cycles in a linked list.

````carousel
```python
def has_cycle(head):
    """
    Detect if a cycle exists in a linked list.
    Returns True if cycle exists, False otherwise.
    """
    if not head or not head.next:
        return False
    
    slow = head
    fast = head
    
    while fast and fast.next:
        slow = slow.next          # Move 1 step
        fast = fast.next.next     # Move 2 steps
        
        if slow == fast:          # Pointers meet
            return True
    
    return False
```
<!-- slide -->
```cpp
bool hasCycle(ListNode* head) {
    if (!head || !head->next) return false;
    
    ListNode* slow = head;
    ListNode* fast = head;
    
    while (fast && fast->next) {
        slow = slow->next;           // Move 1 step
        fast = fast->next->next;     // Move 2 steps
        
        if (slow == fast) {          // Pointers meet
            return true;
        }
    }
    
    return false;
}
```
<!-- slide -->
```java
public boolean hasCycle(ListNode head) {
    if (head == null || head.next == null) {
        return false;
    }
    
    ListNode slow = head;
    ListNode fast = head;
    
    while (fast != null && fast.next != null) {
        slow = slow.next;           // Move 1 step
        fast = fast.next.next;      // Move 2 steps
        
        if (slow == fast) {         // Pointers meet
            return true;
        }
    }
    
    return false;
}
```
<!-- slide -->
```javascript
function hasCycle(head) {
    if (!head || !head.next) return false;
    
    let slow = head;
    let fast = head;
    
    while (fast && fast.next) {
        slow = slow.next;           // Move 1 step
        fast = fast.next.next;      // Move 2 steps
        
        if (slow === fast) {        // Pointers meet
            return true;
        }
    }
    
    return false;
}
```
````

### Approach 2: Find Cycle Start Node

This approach not only detects a cycle but also finds the exact node where the cycle begins.

````carousel
```python
def detect_cycle_start(head):
    """
    Find the starting node of a cycle in a linked list.
    Returns the node where the cycle begins, or None if no cycle.
    """
    if not head or not head.next:
        return None
    
    # Phase 1: Find meeting point
    slow = head
    fast = head
    
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        
        if slow == fast:
            break
    else:
        return None  # No cycle
    
    # Phase 2: Find cycle entrance
    slow = head
    while slow != fast:
        slow = slow.next
        fast = fast.next
    
    return slow
```
<!-- slide -->
```cpp
ListNode* detectCycleStart(ListNode* head) {
    if (!head || !head->next) return nullptr;
    
    // Phase 1: Find meeting point
    ListNode* slow = head;
    ListNode* fast = head;
    
    while (fast && fast->next) {
        slow = slow->next;
        fast = fast->next->next;
        
        if (slow == fast) break;
    }
    
    if (!fast || !fast->next) return nullptr;  // No cycle
    
    // Phase 2: Find cycle entrance
    slow = head;
    while (slow != fast) {
        slow = slow->next;
        fast = fast->next;
    }
    
    return slow;
}
```
<!-- slide -->
```java
public ListNode detectCycle(ListNode head) {
    if (head == null || head.next == null) {
        return null;
    }
    
    // Phase 1: Find meeting point
    ListNode slow = head;
    ListNode fast = head;
    
    while (fast != null && fast.next != null) {
        slow = slow.next;
        fast = fast.next.next;
        
        if (slow == fast) break;
    }
    
    if (fast == null || fast.next == null) {
        return null;  // No cycle
    }
    
    // Phase 2: Find cycle entrance
    slow = head;
    while (slow != fast) {
        slow = slow.next;
        fast = fast.next;
    }
    
    return slow;
}
```
<!-- slide -->
```javascript
function detectCycle(head) {
    if (!head || !head.next) return null;
    
    // Phase 1: Find meeting point
    let slow = head;
    let fast = head;
    
    while (fast && fast.next) {
        slow = slow.next;
        fast = fast.next.next;
        
        if (slow === fast) break;
    }
    
    if (!fast || !fast.next) return null;  // No cycle
    
    // Phase 2: Find cycle entrance
    slow = head;
    while (slow !== fast) {
        slow = slow.next;
        fast = fast.next;
    }
    
    return slow;
}
```
````

### Approach 3: Find Middle of Linked List

A variant of the fast-slow technique used to find the middle element of a linked list.

````carousel
```python
def find_middle(head):
    """
    Find the middle node of a linked list.
    Returns the second middle node if even number of nodes.
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
ListNode* findMiddle(ListNode* head) {
    if (!head) return nullptr;
    
    ListNode* slow = head;
    ListNode* fast = head;
    
    while (fast && fast->next) {
        slow = slow->next;
        fast = fast->next->next;
    }
    
    return slow;
}
```
<!-- slide -->
```java
public ListNode middleNode(ListNode head) {
    if (head == null) return null;
    
    ListNode slow = head;
    ListNode fast = head;
    
    while (fast != null && fast.next != null) {
        slow = slow.next;
        fast = fast.next.next;
    }
    
    return slow;
}
```
<!-- slide -->
```javascript
function middleNode(head) {
    if (!head) return null;
    
    let slow = head;
    let fast = head;
    
    while (fast && fast.next) {
        slow = slow.next;
        fast = fast.next.next;
    }
    
    return slow;
}
```
````

### Approach 4: Happy Number Detection

Detecting if a number is "happy" using the fast-slow pointer technique on number transformations.

````carousel
```python
def is_happy(n):
    """
    Determine if a number is a happy number.
    A happy number eventually reaches 1 when replaced by the sum of 
    squares of its digits. If it loops endlessly in a cycle, it's not happy.
    """
    def get_next(num):
        total = 0
        while num > 0:
            digit = num % 10
            total += digit * digit
            num //= 10
        return total
    
    slow = n
    fast = get_next(n)
    
    while fast != 1 and slow != fast:
        slow = get_next(slow)
        fast = get_next(get_next(fast))
    
    return fast == 1
```
<!-- slide -->
```cpp
int getNext(int num) {
    int total = 0;
    while (num > 0) {
        int digit = num % 10;
        total += digit * digit;
        num /= 10;
    }
    return total;
}

bool isHappy(int n) {
    int slow = n;
    int fast = getNext(n);
    
    while (fast != 1 && slow != fast) {
        slow = getNext(slow);
        fast = getNext(getNext(fast));
    }
    
    return fast == 1;
}
```
<!-- slide -->
```java
private int getNext(int num) {
    int total = 0;
    while (num > 0) {
        int digit = num % 10;
        total += digit * digit;
        num /= 10;
    }
    return total;
}

public boolean isHappy(int n) {
    int slow = n;
    int fast = getNext(n);
    
    while (fast != 1 && slow != fast) {
        slow = getNext(slow);
        fast = getNext(getNext(fast));
    }
    
    return fast == 1;
}
```
<!-- slide -->
```javascript
function getNext(num) {
    let total = 0;
    while (num > 0) {
        const digit = num % 10;
        total += digit * digit;
        num = Math.floor(num / 10);
    }
    return total;
}

function isHappy(n) {
    let slow = n;
    let fast = getNext(n);
    
    while (fast !== 1 && slow !== fast) {
        slow = getNext(slow);
        fast = getNext(getNext(fast));
    }
    
    return fast === 1;
}
```
````

### Approach 5: Detect Cycle in Array/Function

Finding duplicates or cycles in arrays using the array itself as a linked structure.

````carousel
```python
def find_duplicate(nums):
    """
    Find the duplicate number in an array nums where:
    - nums contains n + 1 integers between 1 and n (inclusive)
    - Only one duplicate exists (can be repeated multiple times)
    Treats array as a linked list where index -> value is the next pointer.
    """
    slow = nums[0]
    fast = nums[nums[0]]
    
    # Phase 1: Find intersection
    while slow != fast:
        slow = nums[slow]
        fast = nums[nums[fast]]
    
    # Phase 2: Find entrance
    slow = 0
    while slow != fast:
        slow = nums[slow]
        fast = nums[fast]
    
    return slow
```
<!-- slide -->
```cpp
int findDuplicate(vector<int>& nums) {
    int slow = nums[0];
    int fast = nums[nums[0]];
    
    // Phase 1: Find intersection
    while (slow != fast) {
        slow = nums[slow];
        fast = nums[nums[fast]];
    }
    
    // Phase 2: Find entrance
    slow = 0;
    while (slow != fast) {
        slow = nums[slow];
        fast = nums[fast];
    }
    
    return slow;
}
```
<!-- slide -->
```java
public int findDuplicate(int[] nums) {
    int slow = nums[0];
    int fast = nums[nums[0]];
    
    // Phase 1: Find intersection
    while (slow != fast) {
        slow = nums[slow];
        fast = nums[nums[fast]];
    }
    
    // Phase 2: Find entrance
    slow = 0;
    while (slow != fast) {
        slow = nums[slow];
        fast = nums[fast];
    }
    
    return slow;
}
```
<!-- slide -->
```javascript
function findDuplicate(nums) {
    let slow = nums[0];
    let fast = nums[nums[0]];
    
    // Phase 1: Find intersection
    while (slow !== fast) {
        slow = nums[slow];
        fast = nums[nums[fast]];
    }
    
    // Phase 2: Find entrance
    slow = 0;
    while (slow !== fast) {
        slow = nums[slow];
        fast = nums[fast];
    }
    
    return slow;
}
```
````

## Time and Space Complexity

| Approach | Time Complexity | Space Complexity | Use Case |
|----------|-----------------|------------------|----------|
| Basic Cycle Detection | O(n) | O(1) | Detect if cycle exists |
| Find Cycle Start | O(n) | O(1) | Find where cycle begins |
| Find Middle | O(n) | O(1) | Middle of linked list |
| Happy Number | O(log n) amortized | O(1) | Detect happy numbers |
| Duplicate in Array | O(n) | O(1) | Find duplicates in array |

**Where n is the number of elements/nodes**

## Common Pitfalls

1. **Null Pointer Checks**: Always verify `fast` and `fast.next` are not null before accessing their properties
2. **Single Node Lists**: Handle edge cases where the list has only one node
3. **Cycle at Head**: A cycle can start at the head node itself
4. **Infinite Loops**: Ensure your termination conditions are correct
5. **Speed Difference**: Using speed difference other than 2:1 requires mathematical adjustments

## Related Problems

### Easy Problems
- [Linked List Cycle](https://leetcode.com/problems/linked-list-cycle/) - Basic cycle detection
- [Happy Number](https://leetcode.com/problems/happy-number/) - Cycle detection in number transformation
- [Middle of the Linked List](https://leetcode.com/problems/middle-of-the-linked-list/) - Find middle using fast-slow pointers

### Medium Problems
- [Linked List Cycle II](https://leetcode.com/problems/linked-list-cycle-ii/) - Find cycle start node
- [Find the Duplicate Number](https://leetcode.com/problems/find-the-duplicate-number/) - Cycle detection in array
- [Circular Array Loop](https://leetcode.com/problems/circular-array-loop/) - Detect cycles in array

### Hard Problems
- [Find the Missing Number](https://leetcode.com/problems/find-the-missing-number/) - Using cycle detection
- [Linked List Cycle III](https://leetcode.com/problems/linked-list-cycle-iii/) - Advanced cycle problems

## Video Tutorials

- [Floyd's Tortoise and Hare Algorithm - Explained](https://www.youtube.com/watch?v=-YiQZi3mLq0)
- [Cycle Detection in Linked List - GeeksforGeeks](https://www.youtube.com/watch?v=LUM2B8Y83iA)
- [LeetCode Linked List Cycle II Solution](https://www.youtube.com/watch?v=6w60X7Jv390)
- [Fast and Slow Pointer Pattern - BacktoBack SWE](https://www.youtube.com/watch?v=G_B4e_8CU9w)

## Practice Strategy

1. **Start Simple**: Master the basic cycle detection on linked lists
2. **Understand the Math**: Grasp why finding cycle entrance works
3. **Explore Variants**: Apply the technique to arrays, numbers, and other structures
4. **Time Complexity Awareness**: Understand when this O(n) approach beats O(n) space solutions
5. **Advanced Applications**: Practice problems that combine fast-slow with other techniques

## Pattern Summary

The Fast & Slow Pointer pattern is one of the most elegant techniques in algorithm design. Its power lies in:

- **Constant Space**: Achieves O(1) space where naive solutions require O(n)
- **Single Pass**: Many variations require only one traversal
- **Versatility**: Applies to linked lists, arrays, functions, and mathematical sequences
- **Mathematical Foundation**: Built on proven mathematical properties of relative speeds

Master this pattern to efficiently solve cycle detection, middle finding, and duplicate detection problems.
