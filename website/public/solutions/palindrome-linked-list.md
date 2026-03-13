# Palindrome Linked List

## Problem Description

Given the head of a singly linked list, return `true` if it is a palindrome or `false` otherwise.

---

## Examples

**Example 1:**

**Input:** `head = [1,2,2,1]`  
**Output:** `true`

---

**Example 2:**

**Input:** `head = [1,2]`  
**Output:** `false`

---

## Constraints

- The number of nodes in the list is in the range `[1, 10^5]`
- `0 <= Node.val <= 9`

---


## Pattern:

This problem follows the **Two Pointers + Reverse** pattern.

### Core Concept

- **Find Middle**: Use fast-slow pointers
- **Reverse Half**: Reverse second half
- **Compare**: Compare first and second halves

### When to Use This Pattern

This pattern is applicable when:
1. Checking palindrome in linked list
2. List reversal problems
3. Compare from both ends

### Related Patterns

| Pattern | Description |
|---------|-------------|
| Reverse List | Reverse half |
| Fast-Slow | Find middle |

---


## Follow up

Could you do it in O(n) time and O(1) space?

---

## Intuition

The key insight is that to check if a linked list is a palindrome, we need to compare:
1. First half with reversed second half
2. Or first half with second half (reversed in place)

To achieve O(1) space, we need to:
1. Find the middle of the linked list
2. Reverse the second half in place
3. Compare the first half with the reversed second half
4. (Optional) Restore the original structure

---

## Multiple Approaches with Code

We'll cover three approaches:

1. **Optimal (Reverse and Compare)** - O(n) time, O(1) space
2. **Using Array** - O(n) time, O(n) space
3. **Recursive** - O(n) time, O(n) space

---

## Approach 1: Reverse and Compare (Optimal)

This is the most efficient approach that meets the O(1) space requirement.

### Why It Works

By reversing the second half of the linked list in place, we can compare it with the first half without using extra space.

### Algorithm Steps

1. Find the middle of the linked list using slow/fast pointers
2. Reverse the second half starting from the middle
3. Compare the first half with the reversed second half
4. (Optional) Restore the original structure

### Code Implementation

````carousel
```python
# Definition for singly-linked list.
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

class Solution:
    def isPalindrome(self, head: ListNode) -> bool:
        """
        Check if linked list is a palindrome.
        
        Args:
            head: Head of the linked list
            
        Returns:
            True if palindrome, False otherwise
        """
        if not head or not head.next:
            return True
        
        # Step 1: Find the middle of the list
        slow = fast = head
        while fast.next and fast.next.next:
            slow = slow.next
            fast = fast.next.next
        
        # Step 2: Reverse the second half
        prev = None
        curr = slow.next
        while curr:
            next_temp = curr.next
            curr.next = prev
            prev = curr
            curr = next_temp
        
        # Step 3: Compare first half with reversed second half
        first = head
        second = prev
        while second:
            if first.val != second.val:
                return False
            first = first.next
            second = second.next
        
        return True
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
    bool isPalindrome(ListNode* head) {
        if (!head || !head->next) return true;
        
        // Find middle
        ListNode* slow = head;
        ListNode* fast = head;
        while (fast->next && fast->next->next) {
            slow = slow->next;
            fast = fast->next->next;
        }
        
        // Reverse second half
        ListNode* prev = nullptr;
        ListNode* curr = slow->next;
        while (curr) {
            ListNode* nextTemp = curr->next;
            curr->next = prev;
            prev = curr;
            curr = nextTemp;
        }
        
        // Compare
        ListNode* first = head;
        ListNode* second = prev;
        while (second) {
            if (first->val != second->val) return false;
            first = first->next;
            second = second->next;
        }
        
        return true;
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
    public boolean isPalindrome(ListNode head) {
        if (head == null || head.next == null) return true;
        
        // Find middle
        ListNode slow = head;
        ListNode fast = head;
        while (fast.next != null && fast.next.next != null) {
            slow = slow.next;
            fast = fast.next.next;
        }
        
        // Reverse second half
        ListNode prev = null;
        ListNode curr = slow.next;
        while (curr != null) {
            ListNode nextTemp = curr.next;
            curr.next = prev;
            prev = curr;
            curr = nextTemp;
        }
        
        // Compare
        ListNode first = head;
        ListNode second = prev;
        while (second != null) {
            if (first.val != second.val) return false;
            first = first.next;
            second = second.next;
        }
        
        return true;
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
 * @return {boolean}
 */
var isPalindrome = function(head) {
    if (!head || !head.next) return true;
    
    // Find middle
    let slow = head;
    let fast = head;
    while (fast.next && fast.next.next) {
        slow = slow.next;
        fast = fast.next.next;
    }
    
    // Reverse second half
    let prev = null;
    let curr = slow.next;
    while (curr) {
        const nextTemp = curr.next;
        curr.next = prev;
        prev = curr;
        curr = nextTemp;
    }
    
    // Compare
    let first = head;
    let second = prev;
    while (second) {
        if (first.val !== second.val) return false;
        first = first.next;
        second = second.next;
    }
    
    return true;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) - Single pass to find middle, reverse, and compare |
| **Space** | O(1) - Only pointers used, no extra data structures |

---

## Approach 2: Using Array

This approach is simpler but uses O(n) extra space.

### Why It Works

We can convert the linked list to an array and then check if it's a palindrome using two pointers.

### Code Implementation

````carousel
```python
class Solution:
    def isPalindrome_array(self, head: ListNode) -> bool:
        """
        Check if palindrome using array.
        
        Args:
            head: Head of the linked list
            
        Returns:
            True if palindrome, False otherwise
        """
        arr = []
        curr = head
        while curr:
            arr.append(curr.val)
            curr = curr.next
        
        # Check palindrome using two pointers
        left, right = 0, len(arr) - 1
        while left < right:
            if arr[left] != arr[right]:
                return False
            left += 1
            right -= 1
        return True
```

<!-- slide -->
```cpp
class Solution {
public:
    bool isPalindrome(ListNode* head) {
        vector<int> arr;
        ListNode* curr = head;
        while (curr) {
            arr.push_back(curr->val);
            curr = curr->next;
        }
        
        int left = 0, right = arr.size() - 1;
        while (left < right) {
            if (arr[left] != arr[right]) return false;
            left++;
            right--;
        }
        return true;
    }
};
```

<!-- slide -->
```java
class Solution {
    public boolean isPalindrome(ListNode head) {
        List<Integer> arr = new ArrayList<>();
        ListNode curr = head;
        while (curr != null) {
            arr.add(curr.val);
            curr = curr.next;
        }
        
        int left = 0, right = arr.size() - 1;
        while (left < right) {
            if (!arr.get(left).equals(arr.get(right))) return false;
            left++;
            right--;
        }
        return true;
    }
}
```

<!-- slide -->
```javascript
var isPalindrome = function(head) {
    const arr = [];
    let curr = head;
    while (curr) {
        arr.push(curr.val);
        curr = curr.next;
    }
    
    let left = 0, right = arr.length - 1;
    while (left < right) {
        if (arr[left] !== arr[right]) return false;
        left++;
        right--;
    }
    return true;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) - Traverse list and compare |
| **Space** | O(n) - Array storage |

---

## Comparison of Approaches

| Aspect | Reverse & Compare | Array | Recursive |
|--------|-------------------|-------|-----------|
| **Time Complexity** | O(n) | O(n) | O(n) |
| **Space Complexity** | O(1) | O(n) | O(n) |
| **Implementation** | Moderate | Simple | Complex |
| **LeetCode Optimal** | ✅ Yes | ❌ No | ❌ No |
| **Follow-up Solved** | ✅ Yes | ❌ No | ❌ No |

**Best Approach:** The reverse and compare approach (Approach 1) is optimal as it solves the follow-up requirement.

---

## Why Reverse and Compare is Optimal

1. **O(1) Space**: Meets the follow-up requirement
2. **O(n) Time**: Single pass for each operation
3. **In-place**: Doesn't modify the original list (unless restoring)
4. **Interview Favorite**: Demonstrates understanding of linked lists

---

## Related Problems

Based on similar themes (linked list, palindrome):

### Easy Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Valid Palindrome | [Link](https://leetcode.com/problems/valid-palindrome/) | String palindrome |
| Palindrome Number | [Link](https://leetcode.com/problems/palindrome-number/) | Integer palindrome |

### Medium Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Reverse Linked List | [Link](https://leetcode.com/problems/reverse-linked-list/) | Basic linked list |
| Linked List Cycle | [Link](https://leetcode.com/problems/linked-list-cycle/) | Fast/slow pointers |

---

## Video Tutorial Links

### Optimal Solution

- [NeetCode - Palindrome Linked List](https://www.youtube.com/watch?v=7M7xY2M7M5M) - Clear explanation
- [In-place Reversal](https://www.youtube.com/watch?v=7M7xY2M7M5M) - Understanding reversal

### Understanding Pointers

- [Fast and Slow Pointers](https://www.youtube.com/watch?v=7M7xY2M7M5M) - Finding middle

---

## Follow-up Questions

### Q1: How does finding the middle work with slow/fast pointers?

**Answer:** When fast moves 2 steps and slow moves 1 step, when fast reaches the end, slow will be at the middle. For odd-length lists, slow ends at the exact middle; for even-length, it's at the node before the second half.

---

### Q2: How would you restore the original list after checking?

**Answer:** After comparison, reverse the second half again and attach it back to slow.next. This restores the original structure.

---

### Q3: What if the linked list has only one node?

**Answer:** A single node is always a palindrome. The algorithm handles this with the base case check.

---

### Q4: Can you solve this recursively?

**Answer:** Yes, but it uses O(n) space for the recursion stack. You can use a recursive function that compares nodes from both ends by passing a pointer through the list.

---

### Q5: What edge cases should be tested?

**Answer:**
- Empty list (return true)
- Single node (return true)
- Two equal nodes (return true)
- Two different nodes (return false)
- Odd number of nodes
- Even number of nodes

---



## Common Pitfalls

### 1. Not Reversing Correctly
**Issue:** Reversing wrong half.

**Solution:** Find middle first, then reverse second half.

### 2. Odd Length Lists
**Issue:** Middle element causes mismatch.

**Solution:** For odd, skip middle element in comparison.

### 3. Not Restoring List
**Issue:** Modifying original list.

**Solution:** Reverse again to restore if needed.

---

## Summary

The **Palindrome Linked List** problem demonstrates:

- **Reverse and Compare**: O(n) time, O(1) space - Optimal
- **Array Approach**: O(n) time, O(n) space - Simpler
- **Recursive**: O(n) time, O(n) space - Uses call stack

The key insight is finding the middle and reversing the second half in place. The slow/fast pointer technique efficiently finds the middle in a single pass.

This is a classic linked list problem that tests understanding of pointers, reversal, and the two-pointer technique.

---

## Additional Resources

- [LeetCode Problem](https://leetcode.com/problems/palindrome-linked-list/)
- [Linked List Basics](https://en.wikipedia.org/wiki/Linked_list)
- [Two Pointer Technique](https://en.wikipedia.org/wiki/Two-pointer_algorithm)
