## Reverse Linked List in K-Group

**Question:** How do you reverse nodes in groups of k in a linked list?

<!-- front -->

---

## Answer: Recursive with Pointers

### Solution
```python
def reverseKGroup(head, k):
    # Check if k nodes exist
    curr = head
    count = 0
    while curr and count < k:
        curr = curr.next
        count += 1
    
    if count < k:
        return head
    
    # Reverse k nodes
    prev = None
    curr = head
    
    for _ in range(k):
        next_node = curr.next
        curr.next = prev
        prev = curr
        curr = next_node
    
    # Connect rest to reversed head
    head.next = reverseKGroup(curr, k)
    
    return prev  # New head of reversed group
```

### Visual: Reversing in Groups
```
List: 1 → 2 → 3 → 4 → 5, k = 3

Group 1: Reverse 1→2→3
Step 1: null←1  2→3→4→5
Step 2: null←1←2  3→4→5
Step 3: null←1←2←3  4→5

Connect: 3.next = reverseKGroup(4→5, 3)
         3.next = 4→5 (less than k, return as-is)

Result: 3 → 2 → 1 → 4 → 5
```

### ⚠️ Tricky Parts

#### 1. Checking k Nodes Exist
```python
# Must check before reversing
curr = head
for i in range(k):
    if not curr:
        return head  # Not enough nodes
    curr = curr.next
```

#### 2. Connecting the Groups
```python
# After reversing k nodes:
# prev = new head (kth node)
# head = old head (1st node)
# curr = node after group

# Connect: old head points to result of recursive call
head.next = reverseKGroup(curr, k)

# Return: new head (prev)
return prev
```

#### 3. Iterative Approach
```python
def reverseKGroupIterative(head, k):
    dummy = ListNode(0)
    dummy.next = head
    
    prev_group = dummy
    
    while True:
        # Check k nodes exist
        kth = get_kth(prev_group, k)
        if not kth:
            break
        
        # Save for connection
        next_group = kth.next
        
        # Reverse group
        prev, curr = None, prev_group.next
        for _ in range(k):
            next_node = curr.next
            curr.next = prev
            prev = curr
            curr = next_node
        
        # Connect
        first = prev_group.next
        prev_group.next = prev
        first.next = next_group
        
        prev_group = first
    
    return dummy.next

def get_kth(start, k):
    while start and k > 0:
        start = start.next
        k -= 1
    return start
```

### Time & Space Complexity

| Method | Time | Space |
|--------|------|-------|
| Recursive | O(n) | O(n/k) call stack |
| Iterative | O(n) | O(1) |

### Common Mistakes

| Mistake | Fix |
|---------|-----|
| Not checking k nodes | Check before reversing |
| Lost pointer | Save curr.next before changing |
| Wrong connection | Connect both ends properly |

<!-- back -->
