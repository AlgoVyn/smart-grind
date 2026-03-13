# Add Two Numbers

## Problem Description

You are given two non-empty linked lists representing two non-negative integers. The digits are stored in **reverse order**, and each of their nodes contains a single digit. Add the two numbers and return the sum as a linked list.

You may assume the two numbers do not contain any leading zero, except the number 0 itself.

**Link to problem:** [Add Two Numbers - LeetCode 2](https://leetcode.com/problems/add-two-numbers/)

---

## Pattern: Linked List - Digit Addition

This problem demonstrates how to handle digit-by-digit addition using a linked list, simulating the elementary addition process we do on paper.

### Core Concept

The key insight is that the digits are stored in reverse order, which makes the addition natural:
- We start from the least significant digit (head of the list)
- We add corresponding digits along with any carry from the previous position
- We create new nodes for each sum digit
- We continue until both lists are exhausted and there's no carry left

---

## Examples

### Example

**Input:**
```
l1 = [2,4,3], l2 = [5,6,4]
```

**Output:**
```
[7,0,8]
```

**Explanation:** 342 + 465 = 807.

### Example 2

**Input:**
```
l1 = [0], l2 = [0]
```

**Output:**
```
[0]
```

**Explanation:** 0 + 0 = 0.

### Example 3

**Input:**
```
l1 = [9,9,9,9,9,9,9], l2 = [9,9,9,9]
```

**Output:**
```
[8,9,9,9,0,0,0,1]
```

**Explanation:** 9999999 + 9999 = 10009998.

---

## Constraints

- The number of nodes in each linked list is in the range `[1, 100]`.
- `0 <= Node.val <= 9`
- It is guaranteed that the list represents a number that does not have leading zeros.

---

## Intuition

The fundamental approach is to simulate manual addition:

1. **Start from the beginning**: Since digits are in reverse order, the head of each list represents the least significant digit
2. **Process digit by digit**: Add corresponding digits from both lists plus any carry
3. **Handle different lengths**: If one list is longer, continue with the remaining digits
4. **Handle final carry**: If there's a carry after processing all digits, add a new node

This approach naturally handles:
- Different length numbers
- Carry propagation
- Building the result in the correct order

---

## Multiple Approaches with Code

We'll cover three approaches:

1. **Iterative (Optimal)** - O(n) time, O(1) extra space (excluding output)
2. **Recursive** - O(n) time, O(n) stack space
3. **Using Arrays** - Convert to numbers, add, then convert back (for small numbers)

---

## Approach 1: Iterative (Optimal)

This is the most efficient and commonly used approach. We traverse both lists once, adding corresponding digits and managing the carry.

### Algorithm Steps

1. Create a dummy node to simplify edge cases
2. Initialize `carry = 0` and point `curr` to the dummy node
3. While there are digits in either list or there's a carry:
   - Get values from both lists (0 if list is exhausted)
   - Calculate `total = val1 + val2 + carry`
   - Update `carry = total // 10`
   - Create a new node with `total % 10`
   - Move to the next nodes in both lists
4. Return `dummy.next` (skip the dummy node)

### Why It Works

The algorithm correctly simulates elementary addition:
- Each iteration processes one digit position
- Carry is properly propagated to the next position
- Different length lists are handled by treating missing digits as 0
- The final carry is handled by the loop condition

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
    def addTwoNumbers(self, l1: Optional[ListNode], l2: Optional[ListNode]) -> Optional[ListNode]:
        """
        Add two numbers represented as linked lists.
        
        Args:
            l1: First linked list (digits in reverse order)
            l2: Second linked list (digits in reverse order)
            
        Returns:
            Head of the resulting linked list
        """
        # Dummy node to simplify handling of the head
        dummy = ListNode(0)
        curr = dummy
        carry = 0
        
        # Process while there are digits or carry
        while l1 or l2 or carry:
            # Get values (0 if list is exhausted)
            val1 = l1.val if l1 else 0
            val2 = l2.val if l2 else 0
            
            # Calculate sum and new carry
            total = val1 + val2 + carry
            carry = total // 10
            
            # Create new node with the digit
            curr.next = ListNode(total % 10)
            curr = curr.next
            
            # Move to next nodes
            if l1:
                l1 = l1.next
            if l2:
                l2 = l2.next
        
        return dummy.next
```

<!-- slide -->
```cpp
/**
 * Definition for singly-linked list node
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
    ListNode* addTwoNumbers(ListNode* l1, ListNode* l2) {
        /**
         * Add two numbers represented as linked lists.
         * 
         * @param l1: First linked list (digits in reverse order)
         * @param l2: Second linked list (digits in reverse order)
         * @return: Head of the resulting linked list
         */
        // Dummy node to simplify handling of the head
        ListNode* dummy = new ListNode(0);
        ListNode* curr = dummy;
        int carry = 0;
        
        // Process while there are digits or carry
        while (l1 || l2 || carry) {
            // Get values (0 if list is exhausted)
            int val1 = l1 ? l1->val : 0;
            int val2 = l2 ? l2->val : 0;
            
            // Calculate sum and new carry
            int total = val1 + val2 + carry;
            carry = total / 10;
            
            // Create new node with the digit
            curr->next = new ListNode(total % 10);
            curr = curr->next;
            
            // Move to next nodes
            if (l1) l1 = l1->next;
            if (l2) l2 = l2->next;
        }
        
        return dummy->next;
    }
};
```

<!-- slide -->
```java
/**
 * Definition for singly-linked list
 * public class ListNode {
 *     int val;
 *     ListNode next;
 *     ListNode() {}
 *     ListNode(int val) { this.val = val; }
 *     ListNode(int val, ListNode next) { this.val = val; this.next = next; }
 * }
 */

class Solution {
    public ListNode addTwoNumbers(ListNode l1, ListNode l2) {
        /**
         * Add two numbers represented as linked lists.
         * 
         * @param l1: First linked list (digits in reverse order)
         * @param l2: Second linked list (digits in reverse order)
         * @return: Head of the resulting linked list
         */
        // Dummy node to simplify handling of the head
        ListNode dummy = new ListNode(0);
        ListNode curr = dummy;
        int carry = 0;
        
        // Process while there are digits or carry
        while (l1 != null || l2 != null || carry != 0) {
            // Get values (0 if list is exhausted)
            int val1 = (l1 != null) ? l1.val : 0;
            int val2 = (l2 != null) ? l2.val : 0;
            
            // Calculate sum and new carry
            int total = val1 + val2 + carry;
            carry = total / 10;
            
            // Create new node with the digit
            curr.next = new ListNode(total % 10);
            curr = curr.next;
            
            // Move to next nodes
            if (l1 != null) l1 = l1.next;
            if (l2 != null) l2 = l2.next;
        }
        
        return dummy.next;
    }
}
```

<!-- slide -->
```javascript
/**
 * Definition for singly-linked list
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */

/**
 * Add two numbers represented as linked lists.
 * 
 * @param {ListNode} l1 - First linked list (digits in reverse order)
 * @param {ListNode} l2 - Second linked list (digits in reverse order)
 * @return {ListNode} - Head of the resulting linked list
 */
var addTwoNumbers = function(l1, l2) {
    // Dummy node to simplify handling of the head
    const dummy = new ListNode(0);
    let curr = dummy;
    let carry = 0;
    
    // Process while there are digits or carry
    while (l1 || l2 || carry) {
        // Get values (0 if list is exhausted)
        const val1 = l1 ? l1.val : 0;
        const val2 = l2 ? l2.val : 0;
        
        // Calculate sum and new carry
        const total = val1 + val2 + carry;
        carry = Math.floor(total / 10);
        
        // Create new node with the digit
        curr.next = new ListNode(total % 10);
        curr = curr.next;
        
        // Move to next nodes
        if (l1) l1 = l1.next;
        if (l2) l2 = l2.next;
    }
    
    return dummy.next;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(max(m, n)) - We traverse each node at most once |
| **Space** | O(max(m, n)) - For the result linked list |

---

## Approach 2: Recursive

This approach uses recursion to process the lists, which can be more intuitive but uses more memory due to the call stack.

### Algorithm Steps

1. Base case: If both lists are null and carry is 0, return null
2. Calculate sum of current digits and carry
3. Create a new node with the digit
4. Recursively call for next nodes
5. Return the node

### Code Implementation

````carousel
```python
class Solution:
    def addTwoNumbers_recursive(self, l1: Optional[ListNode], l2: Optional[ListNode]) -> Optional[ListNode]:
        """
        Add two numbers using recursion.
        
        Args:
            l1: First linked list
            l2: Second linked list
            
        Returns:
            Head of the resulting linked list
        """
        def helper(l1, l2, carry):
            # Base case: both lists exhausted and no carry
            if not l1 and not l2 and not carry:
                return None
            
            # Calculate sum
            total = (l1.val if l1 else 0) + (l2.val if l2 else 0) + carry
            
            # Create node
            node = ListNode(total % 10)
            
            # Recurse
            node.next = helper(
                l1.next if l1 else None,
                l2.next if l2 else None,
                total // 10
            )
            
            return node
        
        return helper(l1, l2, 0)
```

<!-- slide -->
```cpp
class Solution {
public:
    ListNode* addTwoNumbers(ListNode* l1, ListNode* l2) {
        /**
         * Add two numbers using recursion.
         */
        function<ListNode*(ListNode*, ListNode*, int)> helper = 
            [&](ListNode* l1, ListNode* l2, int carry) -> ListNode* {
                // Base case
                if (!l1 && !l2 && !carry) return nullptr;
                
                // Calculate sum
                int total = (l1 ? l1->val : 0) + (l2 ? l2->val : 0) + carry;
                
                // Create node
                ListNode* node = new ListNode(total % 10);
                
                // Recurse
                node->next = helper(
                    l1 ? l1->next : nullptr,
                    l2 ? l2->next : nullptr,
                    total / 10
                );
                
                return node;
            };
        
        return helper(l1, l2, 0);
    }
};
```

<!-- slide -->
```java
class Solution {
    public ListNode addTwoNumbersRecursive(ListNode l1, ListNode l2) {
        /**
         * Add two numbers using recursion.
         */
        return helper(l1, l2, 0);
    }
    
    private ListNode helper(ListNode l1, ListNode l2, int carry) {
        // Base case
        if (l1 == null && l2 == null && carry == 0) return null;
        
        // Calculate sum
        int total = (l1 != null ? l1.val : 0) + (l2 != null ? l2.val : 0) + carry;
        
        // Create node
        ListNode node = new ListNode(total % 10);
        
        // Recurse
        node.next = helper(
            l1 != null ? l1.next : null,
            l2 != null ? l2.next : null,
            total / 10
        );
        
        return node;
    }
}
```

<!-- slide -->
```javascript
/**
 * Add two numbers using recursion.
 * 
 * @param {ListNode} l1 - First linked list
 * @param {ListNode} l2 - Second linked list
 * @return {ListNode} - Head of the resulting linked list
 */
var addTwoNumbersRecursive = function(l1, l2) {
    const helper = (l1, l2, carry) => {
        // Base case
        if (!l1 && !l2 && !carry) return null;
        
        // Calculate sum
        const total = (l1 ? l1.val : 0) + (l2 ? l2.val : 0) + carry;
        
        // Create node
        const node = new ListNode(total % 10);
        
        // Recurse
        node.next = helper(
            l1 ? l1.next : null,
            l2 ? l2.next : null,
            Math.floor(total / 10)
        );
        
        return node;
    };
    
    return helper(l1, l2, 0);
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(max(m, n)) - Each node processed once |
| **Space** | O(max(m, n)) - Call stack depth |

---

## Approach 3: Using Arrays (For Small Numbers)

This approach converts the linked lists to arrays/numbers, adds them, and converts back. Only suitable for small numbers due to integer overflow.

### Code Implementation

````carousel
```python
class Solution:
    def addTwoNumbers_arrays(self, l1: Optional[ListNode], l2: Optional[ListNode]) -> Optional[ListNode]:
        """
        Add using array conversion (for small numbers only).
        """
        def list_to_array(node):
            arr = []
            while node:
                arr.append(node.val)
                node = node.next
            return arr
        
        # Convert to arrays
        arr1 = list_to_array(l1)
        arr2 = list_to_array(l2)
        
        # Convert to numbers and add
        num1 = sum(d * (10**i) for i, d in enumerate(arr1))
        num2 = sum(d * (10**i) for i, d in enumerate(arr2))
        total = num1 + num2
        
        # Convert back to linked list
        if total == 0:
            return ListNode(0)
        
        dummy = ListNode()
        curr = dummy
        while total > 0:
            curr.next = ListNode(total % 10)
            curr = curr.next
            total //= 10
        
        return dummy.next
```

<!-- slide -->
```cpp
class Solution {
public:
    ListNode* addTwoNumbersArrays(ListNode* l1, ListNode* l2) {
        /**
         * Add using array conversion (for small numbers only).
         */
        // Convert to string/number
        long long num1 = 0, num2 = 0;
        int multiplier = 1;
        
        while (l1) {
            num1 += l1->val * multiplier;
            l1 = l1->next;
            multiplier *= 10;
        }
        
        multiplier = 1;
        while (l2) {
            num2 += l2->val * multiplier;
            l2 = l2->next;
            multiplier *= 10;
        }
        
        long long total = num1 + num2;
        
        // Convert back to linked list
        if (total == 0) return new ListNode(0);
        
        ListNode* dummy = new ListNode();
        ListNode* curr = dummy;
        
        while (total > 0) {
            curr->next = new ListNode(total % 10);
            curr = curr->next;
            total /= 10;
        }
        
        return dummy->next;
    }
};
```

<!-- slide -->
```java
class Solution {
    public ListNode addTwoNumbersArrays(ListNode l1, ListNode l2) {
        /**
         * Add using array conversion (for small numbers only).
         */
        // Convert to numbers
        long num1 = 0, num2 = 0;
        int multiplier = 1;
        
        while (l1 != null) {
            num1 += l1.val * multiplier;
            l1 = l1.next;
            multiplier *= 10;
        }
        
        multiplier = 1;
        while (l2 != null) {
            num2 += l2.val * multiplier;
            l2 = l2.next;
            multiplier *= 10;
        }
        
        long total = num1 + num2;
        
        // Convert back to linked list
        if (total == 0) return new ListNode(0);
        
        ListNode dummy = new ListNode();
        ListNode curr = dummy;
        
        while (total > 0) {
            curr.next = new ListNode((int)(total % 10));
            curr = curr.next;
            total /= 10;
        }
        
        return dummy.next;
    }
}
```

<!-- slide -->
```javascript
/**
 * Add using array conversion (for small numbers only).
 * 
 * @param {ListNode} l1 - First linked list
 * @param {ListNode} l2 - Second linked list
 * @return {ListNode} - Head of the resulting linked list
 */
var addTwoNumbersArrays = function(l1, l2) {
    // Convert to numbers
    let num1 = 0, num2 = 0;
    let multiplier = 1;
    
    while (l1) {
        num1 += l1.val * multiplier;
        l1 = l1.next;
        multiplier *= 10;
    }
    
    multiplier = 1;
    while (l2) {
        num2 += l2.val * multiplier;
        l2 = l2.next;
        multiplier *= 10;
    }
    
    let total = num1 + num2;
    
    // Convert back to linked list
    if (total === 0) return new ListNode(0);
    
    const dummy = new ListNode();
    let curr = dummy;
    
    while (total > 0) {
        curr.next = new ListNode(total % 10);
        curr = curr.next;
        total = Math.floor(total / 10);
    }
    
    return dummy.next;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) - Traversing lists |
| **Space** | O(1) - Excluding output |

**Warning:** This approach can cause integer overflow for large numbers. Use only when input size is guaranteed to be small.

---

## Comparison of Approaches

| Aspect | Iterative | Recursive | Array Conversion |
|--------|-----------|-----------|------------------|
| **Time Complexity** | O(n) | O(n) | O(n) |
| **Space Complexity** | O(n) | O(n) | O(1)* |
| **Implementation** | Moderate | Simple | Simple |
| **LeetCode Optimal** | ✅ Yes | ❌ No | ❌ No |
| **Overflow Risk** | No | No | Yes |
| **Best For** | General use | Understanding | Very small numbers |

*Excluding output space

**Best Approach:** The iterative approach is optimal and recommended for interviews and production code.

---

## Why This Problem is Important

This problem is a classic linked list problem because it demonstrates:

1. **Linked List Manipulation**: Creating nodes, traversing, and connecting nodes
2. **Edge Case Handling**: Different lengths, carry propagation, dummy nodes
3. **Simulation**: Simulating a real-world process (addition)
4. **Memory Management**: Understanding space complexity

---

## Related Problems

Based on similar themes (linked lists, number manipulation):

### Easy Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Plus One | [Link](https://leetcode.com/problems/plus-one/) | Add one to a number represented as array |
| Add Strings | [Link](https://leetcode.com/problems/add-strings/) | Add two non-negative integers as strings |
| Sum of Two Integers | [Link](https://leetcode.com/problems/sum-of-two-integers/) | Add without + or - operator |

### Medium Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Multiply Strings | [Link](https://leetcode.com/problems/multiply-strings/) | Multiply two numbers as strings |
| Add Two Numbers II | [Link](https://leetcode.com/problems/add-two-numbers-ii/) | Same problem but digits in normal order |
| Add Binary | [Link](https://leetcode.com/problems/add-binary/) | Add two binary strings |

---

## Video Tutorial Links

Here are helpful YouTube tutorials explaining the problem and solutions:

### Problem Explanation

- [NeetCode - Add Two Numbers](https://www.youtube.com/watch?v=LLPuC5VWjRM) - Clear explanation with visual examples
- [Back to Back SWE - Add Two Numbers](https://www.youtube.com/watch?v=GCax5k3G6Jw) - Detailed walkthrough
- [LeetCode Official Solution](https://www.youtube.com/watch?v=0M6R6fVqt1c) - Official problem solution

### Related Concepts

- [Linked List Basics](https://www.youtube.com/watch?v=VOpI1tGaeL4) - Understanding linked lists
- [Understanding Carry in Addition](https://www.youtube.com/watch?v=7iuUw03E3tI) - How addition works with carry

---

## Follow-up Questions

### Q1: How would you solve Add Two Numbers II where digits are in forward order?

**Answer:** You could either:
1. Reverse both lists first, apply the standard algorithm, then reverse the result
2. Use stacks to process from the end (more space but avoids modifying input)
3. Recursively process from the end

---

### Q2: How would you handle very large numbers that exceed integer limits?

**Answer:** Use string-based addition (like Add Strings problem) or work with the linked list representation directly without converting to numbers. The iterative solution naturally handles arbitrarily large numbers.

---

### Q3: Can you modify the solution to use O(1) extra space (excluding the output)?

**Answer:** The current iterative solution already uses O(1) extra space (just a few pointers and a carry variable). The output space is unavoidable since we must create a new list.

---

### Q4: What if you need to modify one of the input lists instead of creating a new one?

**Answer:** You can modify the lists in-place by reusing nodes from the longer list. This saves space but modifies the input, which may not be desirable.

---

### Q5: How would you handle more than two numbers?

**Answer:** Extend the algorithm to process multiple lists by:
1. Using a min-heap to always process the smallest current digit
2. Or pairwise adding: add first two, then add result with third, etc.
3. Or maintain an array of current digits and handle carry separately

---

### Q6: What edge cases should be tested?

**Answer:**
- Both lists are empty (not allowed by constraints, but handle gracefully)
- Lists of different lengths
- Carry propagation (e.g., 999 + 1 = 1000)
- Single digit lists
- Zero values (0 + 0 = 0)
- Maximum length lists

---

## Common Pitfalls

### 1. Forgetting the Final Carry
**Issue:** Not handling the case where carry is non-zero after processing all digits.

**Solution:** Include `carry` in the loop condition: `while l1 or l2 or carry`.

### 2. Not Handling Different Lengths
**Issue:** Assuming both lists have the same length.

**Solution:** Use `val if node else 0` to handle missing digits.

### 3. Creating the Dummy Node Incorrectly
**Issue:** Returning the dummy node instead of dummy.next.

**Solution:** Return `dummy.next` as the actual head of the result.

### 4. Not Moving to Next Nodes
**Issue:** Forgetting to advance l1 and l2 pointers.

**Solution:** Always advance both pointers (if they exist) in each iteration.

---

## Summary

The **Add Two Numbers** problem demonstrates the fundamentals of linked list manipulation:

- **Iterative Approach**: Optimal with O(n) time and O(1) extra space
- **Recursive Approach**: More intuitive but uses more memory
- **Array Conversion**: Only suitable for small numbers

The key insight is that since digits are stored in reverse order, we can naturally process them from the least significant digit, just like manual addition.

This problem is an excellent demonstration of simulating a real-world process (addition) using data structures, and it's a common interview question.

### Pattern Summary

This problem exemplifies the **Linked List - Digit Addition** pattern, which is characterized by:
- Processing elements from the head (least significant)
- Managing carry between positions
- Handling different length inputs
- Creating a new linked list for output

---

## Additional Resources

- [LeetCode Problem Discussion](https://leetcode.com/problems/add-two-numbers/discuss/) - Community solutions and explanations
- [Linked List - GeeksforGeeks](https://www.geeksforgeeks.org/data-structures/linked-list/) - Understanding linked lists
- [Understanding Big Integer Addition](https://www.geeksforgeeks.org/how-to-add-two-large-numbers-using-string/) - Adding large numbers
