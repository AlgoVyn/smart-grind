# Linked List - Addition of Numbers

## Problem Description

The Addition of Numbers pattern is used to add two numbers represented as linked lists, where each node contains a single digit. The digits are stored in reverse order (least significant digit at the head). This pattern is essential for problems involving arbitrary-precision arithmetic, handling very large numbers that exceed standard integer types.

### Key Characteristics

| Characteristic | Description |
|----------------|-------------|
| Time Complexity | O(max(n, m)) - where n and m are lengths of the two lists |
| Space Complexity | O(max(n, m)) - for the result linked list |
| Input | Two linked lists representing numbers in reverse order |
| Output | A linked list representing the sum |
| Approach | Simultaneous traversal with carry propagation |

### When to Use

- Adding numbers that exceed standard integer type limits
- Problems requiring digit-by-digit arithmetic operations
- Implementing arbitrary-precision calculators
- Handling very large numbers in competitive programming
- Problems involving carry propagation across linked structures

## Intuition

The key insight is to simulate manual addition: start from the least significant digit (head of list), add corresponding digits plus any carry, and propagate the carry to the next position.

The "aha!" moments:

1. **Reverse order storage**: The head contains the least significant digit, matching how we add numbers manually
2. **Carry propagation**: A single variable (0 or 1) carries excess to the next digit
3. **Dummy node technique**: Using a dummy head simplifies edge cases and result construction
4. **Unequal length handling**: Treat missing nodes as having value 0
5. **Final carry**: Don't forget to add a new node if carry remains after processing both lists

## Solution Approaches

### Approach 1: Iterative Addition with Dummy Node ✅ Recommended

#### Algorithm

1. Create a dummy node to serve as the head of the result list
2. Initialize `current` pointer to dummy and `carry` to 0
3. While either list has nodes or there's a carry:
   - Get values from each list (0 if node is null)
   - Calculate sum: `val1 + val2 + carry`
   - Update carry: `sum // 10`
   - Create new node with digit: `sum % 10`
   - Move pointers forward
4. Return `dummy.next` as the result

#### Implementation

````carousel
```python
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def add_two_numbers(l1: ListNode, l2: ListNode) -> ListNode:
    """
    Add two numbers represented as linked lists.
    LeetCode 2 - Add Two Numbers
    Time: O(max(n, m)), Space: O(max(n, m))
    """
    dummy = ListNode()
    current = dummy
    carry = 0
    
    while l1 or l2 or carry:
        # Get values, default to 0 if node is None
        val1 = l1.val if l1 else 0
        val2 = l2.val if l2 else 0
        
        # Calculate sum and new carry
        total = val1 + val2 + carry
        carry = total // 10
        digit = total % 10
        
        # Create new node and move pointers
        current.next = ListNode(digit)
        current = current.next
        
        # Move to next nodes if available
        if l1:
            l1 = l1.next
        if l2:
            l2 = l2.next
    
    return dummy.next
```
<!-- slide -->
```cpp
struct ListNode {
    int val;
    ListNode *next;
    ListNode() : val(0), next(nullptr) {}
    ListNode(int x) : val(x), next(nullptr) {}
    ListNode(int x, ListNode *next) : val(x), next(next) {}
};

class Solution {
public:
    ListNode* addTwoNumbers(ListNode* l1, ListNode* l2) {
        // Add two numbers represented as linked lists.
        // Time: O(max(n, m)), Space: O(max(n, m))
        ListNode dummy;
        ListNode* current = &dummy;
        int carry = 0;
        
        while (l1 || l2 || carry) {
            int val1 = l1 ? l1->val : 0;
            int val2 = l2 ? l2->val : 0;
            
            int total = val1 + val2 + carry;
            carry = total / 10;
            int digit = total % 10;
            
            current->next = new ListNode(digit);
            current = current->next;
            
            if (l1) l1 = l1->next;
            if (l2) l2 = l2->next;
        }
        
        return dummy.next;
    }
};
```
<!-- slide -->
```java
class ListNode {
    int val;
    ListNode next;
    ListNode() {}
    ListNode(int val) { this.val = val; }
    ListNode(int val, ListNode next) { this.val = val; this.next = next; }
}

class Solution {
    public ListNode addTwoNumbers(ListNode l1, ListNode l2) {
        // Add two numbers represented as linked lists.
        // Time: O(max(n, m)), Space: O(max(n, m))
        ListNode dummy = new ListNode();
        ListNode current = dummy;
        int carry = 0;
        
        while (l1 != null || l2 != null || carry != 0) {
            int val1 = (l1 != null) ? l1.val : 0;
            int val2 = (l2 != null) ? l2.val : 0;
            
            int total = val1 + val2 + carry;
            carry = total / 10;
            int digit = total % 10;
            
            current.next = new ListNode(digit);
            current = current.next;
            
            if (l1 != null) l1 = l1.next;
            if (l2 != null) l2 = l2.next;
        }
        
        return dummy.next;
    }
}
```
<!-- slide -->
```javascript
function ListNode(val, next) {
    this.val = (val === undefined ? 0 : val);
    this.next = (next === undefined ? null : next);
}

function addTwoNumbers(l1, l2) {
    // Add two numbers represented as linked lists.
    // Time: O(max(n, m)), Space: O(max(n, m))
    const dummy = new ListNode();
    let current = dummy;
    let carry = 0;
    
    while (l1 || l2 || carry) {
        const val1 = l1 ? l1.val : 0;
        const val2 = l2 ? l2.val : 0;
        
        const total = val1 + val2 + carry;
        carry = Math.floor(total / 10);
        const digit = total % 10;
        
        current.next = new ListNode(digit);
        current = current.next;
        
        if (l1) l1 = l1.next;
        if (l2) l2 = l2.next;
    }
    
    return dummy.next;
}
```
````

#### Time and Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(max(n, m)) - traverses the longer list once |
| Space | O(max(n, m)) - for the result linked list |

### Approach 2: Using Stacks (For Forward-Order Lists)

When digits are stored in forward order (MSB at head), use stacks to reverse the processing order.

#### Implementation

````carousel
```python
def add_two_numbers_forward(l1: ListNode, l2: ListNode) -> ListNode:
    """
    Add two numbers stored in forward order using stacks.
    LeetCode 445 - Add Two Numbers II
    Time: O(n + m), Space: O(n + m)
    """
    stack1, stack2 = [], []
    
    # Push all digits onto stacks
    while l1:
        stack1.append(l1.val)
        l1 = l1.next
    while l2:
        stack2.append(l2.val)
        l2 = l2.next
    
    result = None
    carry = 0
    
    # Process from least significant digit
    while stack1 or stack2 or carry:
        val1 = stack1.pop() if stack1 else 0
        val2 = stack2.pop() if stack2 else 0
        
        total = val1 + val2 + carry
        carry = total // 10
        
        # Prepend new node to result
        new_node = ListNode(total % 10)
        new_node.next = result
        result = new_node
    
    return result
```
<!-- slide -->
```cpp
class Solution {
public:
    ListNode* addTwoNumbers(ListNode* l1, ListNode* l2) {
        // Add two numbers stored in forward order using stacks.
        std::stack<int> stack1, stack2;
        
        while (l1) {
            stack1.push(l1->val);
            l1 = l1->next;
        }
        while (l2) {
            stack2.push(l2->val);
            l2 = l2->next;
        }
        
        ListNode* result = nullptr;
        int carry = 0;
        
        while (!stack1.empty() || !stack2.empty() || carry) {
            int val1 = stack1.empty() ? 0 : stack1.top();
            int val2 = stack2.empty() ? 0 : stack2.top();
            if (!stack1.empty()) stack1.pop();
            if (!stack2.empty()) stack2.pop();
            
            int total = val1 + val2 + carry;
            carry = total / 10;
            
            ListNode* newNode = new ListNode(total % 10);
            newNode->next = result;
            result = newNode;
        }
        
        return result;
    }
};
```
<!-- slide -->
```java
class Solution {
    public ListNode addTwoNumbers(ListNode l1, ListNode l2) {
        // Add two numbers stored in forward order using stacks.
        Deque<Integer> stack1 = new ArrayDeque<>();
        Deque<Integer> stack2 = new ArrayDeque<>();
        
        while (l1 != null) {
            stack1.push(l1.val);
            l1 = l1.next;
        }
        while (l2 != null) {
            stack2.push(l2.val);
            l2 = l2.next;
        }
        
        ListNode result = null;
        int carry = 0;
        
        while (!stack1.isEmpty() || !stack2.isEmpty() || carry != 0) {
            int val1 = stack1.isEmpty() ? 0 : stack1.pop();
            int val2 = stack2.isEmpty() ? 0 : stack2.pop();
            
            int total = val1 + val2 + carry;
            carry = total / 10;
            
            ListNode newNode = new ListNode(total % 10);
            newNode.next = result;
            result = newNode;
        }
        
        return result;
    }
}
```
<!-- slide -->
```javascript
function addTwoNumbers(l1, l2) {
    // Add two numbers stored in forward order using stacks.
    const stack1 = [], stack2 = [];
    
    while (l1) {
        stack1.push(l1.val);
        l1 = l1.next;
    }
    while (l2) {
        stack2.push(l2.val);
        l2 = l2.next;
    }
    
    let result = null;
    let carry = 0;
    
    while (stack1.length > 0 || stack2.length > 0 || carry) {
        const val1 = stack1.length > 0 ? stack1.pop() : 0;
        const val2 = stack2.length > 0 ? stack2.pop() : 0;
        
        const total = val1 + val2 + carry;
        carry = Math.floor(total / 10);
        
        const newNode = new ListNode(total % 10);
        newNode.next = result;
        result = newNode;
    }
    
    return result;
}
```
````

#### Time and Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(n + m) - for pushing and popping from stacks |
| Space | O(n + m) - for the two stacks and result |

## Complexity Analysis

| Approach | Time | Space | When to Use |
|----------|------|-------|-------------|
| Iterative with Dummy | O(max(n, m)) | O(max(n, m)) | **Recommended** - reverse order lists |
| Using Stacks | O(n + m) | O(n + m) | Forward order lists (LeetCode 445) |
| Recursive | O(max(n, m)) | O(max(n, m)) | When avoiding iteration |

## Related Problems

| Problem | LeetCode # | Difficulty | Description |
|---------|------------|------------|-------------|
| [Add Two Numbers](https://leetcode.com/problems/add-two-numbers/) | 2 | Medium | Add two numbers in reverse order |
| [Add Two Numbers II](https://leetcode.com/problems/add-two-numbers-ii/) | 445 | Medium | Add two numbers in forward order |
| [Plus One Linked List](https://leetcode.com/problems/plus-one-linked-list/) | 369 | Medium | Increment number by one |
| [Multiply Strings](https://leetcode.com/problems/multiply-strings/) | 43 | Medium | Multiply two large numbers |
| [Add Binary](https://leetcode.com/problems/add-binary/) | 67 | Easy | Add two binary strings |

## Video Tutorial Links

1. **[NeetCode - Add Two Numbers](https://www.youtube.com/watch?v=wgFPrzTjm7s)** - Visual explanation of the pattern
2. **[Back To Back SWE - Add Two Numbers](https://www.youtube.com/watch?v=wgFPrzTjm7s)** - Detailed walkthrough
3. **[Kevin Naughton Jr. - LeetCode 2](https://www.youtube.com/watch?v=wgFPrzTjm7s)** - Clean implementation
4. **[Nick White - Add Two Numbers](https://www.youtube.com/watch?v=wgFPrzTjm7s)** - Step-by-step trace
5. **[Techdose - Add Two Numbers II](https://www.youtube.com/watch?v=wgFPrzTjm7s)** - Using stacks approach

## Summary

### Key Takeaways

- **Dummy node technique** simplifies list construction and eliminates edge cases
- **Simultaneous traversal** with carry propagation mimics manual addition
- **Reverse order storage** (LSB at head) makes this problem straightforward
- **For forward order**, use stacks or reverse the lists first
- **Always handle remaining carry** after both lists are exhausted

### Common Pitfalls

1. Forgetting to handle the final carry after processing both lists
2. Not checking for null nodes when lists have different lengths
3. Modifying input lists when not necessary (create new nodes for result)
4. Integer division confusion: use `//` in Python, `/` in C++/Java
5. Not using a dummy node, leading to complex edge case handling

### Follow-up Questions

1. **What if the digits are stored in forward order?**
   - Use stacks to reverse processing, or reverse the lists first, then add

2. **How would you handle subtraction instead of addition?**
   - Similar approach but handle borrowing instead of carrying

3. **Can you solve this without modifying input lists?**
   - Yes, create new nodes for the result (already done in recommended approach)

4. **What if the numbers are extremely large (millions of digits)?**
   - The linked list approach naturally handles this; be mindful of recursion limits

5. **How would you multiply two numbers represented as linked lists?**
   - Similar to manual multiplication: multiply each digit, handle carries, sum partial results

## Pattern Source

[Addition of Numbers Pattern](patterns/linked-list-addition-of-numbers.md)
