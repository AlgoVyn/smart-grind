## Linked List: Pointer Manipulation

**Question:** How do you correctly manipulate pointers in linked lists?

<!-- front -->

---

## Answer: Draw It Out, Track Each Step

### Basic Node Structure
```python
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next
```

### ⚠️ Critical Rules

#### Rule 1: Never Lose the Rest of the List
```python
# WRONG - lose rest of list!
node.next = node.next.next  # If node.next is None, error!

# CORRECT - check first
if node.next:
    node.next = node.next.next
```

#### Rule 2: Use Dummy Node for Head Manipulation
```python
# When adding/removing from head, use dummy
def delete_head(head):
    dummy = ListNode(0, head)  # Point to actual head
    dummy.next = dummy.next.next
    return dummy.next

# Or simpler:
def delete_head(head):
    if head:
        return head.next
    return head
```

#### Rule 3: Check for None at Each Step
```python
# Always check before accessing
def traverse_and_print(head):
    current = head
    while current:  # Stops at None automatically!
        print(current.val)
        current = current.next
```

### Common Operations

#### Insert at Beginning
```python
def insert_beginning(head, val):
    new_node = ListNode(val)
    new_node.next = head
    return new_node  # New head!
```

#### Insert at End
```python
def insert_end(head, val):
    new_node = ListNode(val)
    
    if not head:
        return new_node
    
    current = head
    while current.next:  # Find last node
        current = current.next
    
    current.next = new_node
    return head
```

#### Delete Node (by value)
```python
def delete_node(head, val):
    dummy = ListNode(0, head)
    current = dummy
    
    while current.next:
        if current.next.val == val:
            current.next = current.next.next
            break
        current = current.next
    
    return dummy.next
```

### Visual: Reversing a Linked List

```
Before: 1 → 2 → 3 → None
        ↑
       curr

Step 1: None ← 1   2 → 3 → None
              ↑    ↑
            prev  curr

Step 2: None ← 1 ← 2   3 → None
                  ↑    ↑
                prev  curr

Step 3: None ← 1 ← 2 ← 3   None
                      ↑    ↑
                    prev  curr

Result: 3 → 2 → 1 → None
```

### Code: Reverse Linked List
```python
def reverse_list(head):
    prev = None
    current = head
    
    while current:
        next_temp = current.next  # Save next!
        current.next = prev      # Reverse link
        prev = current           # Move prev
        current = next_temp      # Move current
    
    return prev
```

### ⚠️ Tricky Parts

#### 1. Forgetting to Save Next
```python
# WRONG - lose rest of list!
current = current.next  # Lost reference!

# CORRECT - save first
next_temp = current.next
# ... do something with current ...
current = next_temp
```

#### 2. Not Handling Empty List
```python
# WRONG - crash on empty
head.next.val  # AttributeError!

# CORRECT
if not head or not head.next:
    return ...
```

#### 3. Wrong Order of Operations
```python
# For reversing:
# Must save next BEFORE changing current.next!
next_temp = current.next  # 1. Save
current.next = prev       # 2. Reverse
prev = current            # 3. Move prev
current = next_temp       # 4. Move current
```

#### 4. Not Returning Correct Head
```python
# After modifications, might need new head
# For insert at beginning: return new_node
# For reverse: return prev (not current!)
```

### Fast-Slow Pointer Patterns

#### Find Middle
```python
def middle_node(head):
    slow = fast = head
    
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
    
    return slow  # Middle!
```

#### Detect Cycle
```python
def has_cycle(head):
    slow = fast = head
    
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        
        if slow == fast:
            return True
    
    return False
```

#### Find Kth from End
```python
def kth_from_end(head, k):
    fast = slow = head
    
    # Move fast k steps ahead
    for _ in range(k):
        if not fast:
            return None
        fast = fast.next
    
    # Move both until fast reaches end
    while fast:
        slow = slow.next
        fast = fast.next
    
    return slow
```

### Common Mistakes Summary

| Mistake | Problem | Fix |
|---------|---------|-----|
| Not saving next | Lose list | Save next_temp first |
| No None check | Crash | Check before access |
| Wrong head return | Wrong result | Track correct head |
| Modifying during loop | Unpredictable | Use temporary variables |
| Forgetting dummy | Lose nodes | Use dummy for edge cases |

### When to Use Dummy Node
- Deleting from head
- Adding to beginning
- When head might change

```python
# Example: Delete all occurrences
def delete_all(head, val):
    dummy = ListNode(0, head)
    prev = dummy
    current = head
    
    while current:
        if current.val == val:
            prev.next = current.next
        else:
            prev = current
        current = current.next
    
    return dummy.next
```

<!-- back -->
