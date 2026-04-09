## Linked List - In-place Reversal: Tactics

What are practical tactics for solving linked list reversal problems?

<!-- front -->

---

### Tactic 1: Identify Problem Variant

**Quick classification to choose the right approach:**

```python
def classify_reversal_problem(description):
    """
    Determine which reversal pattern to use.
    """
    keywords = {
        'reverse entire': 'full_reversal',
        'reverse linked list': 'full_reversal',
        'between position': 'sublist_reversal',
        'reverse nodes from': 'sublist_reversal',
        'k group': 'k_group_reversal',
        'every k': 'k_group_reversal',
        'palindrome': 'find_middle_reverse_compare',
        'reorder': 'reverse_second_half_merge',
        'swap pairs': ' iterative_swap',
    }
    
    for keyword, pattern in keywords.items():
        if keyword in description.lower():
            return pattern
    
    return 'full_reversal'  # default
```

| Keyword | Approach | Key Technique |
|---------|----------|---------------|
| "reverse entire" / "reverse list" | Full reversal | Standard 3-pointer |
| "between position" / "from position" | Sublist reversal | Dummy + move-to-front |
| "k group" / "every k" | k-group reversal | Reverse k, connect groups |
| "palindrome" | Find middle + reverse + compare | Fast/slow pointer |
| "reorder" / "rearrange" | Reverse second half + merge | Split, reverse, interleave |
| "swap pairs" | Pairwise swap | Iterative node exchange |

---

### Tactic 2: Visual Debugging with Pointer States

**Trace through each iteration:**

```
List: 1 → 2 → 3 → 4 → null

Initial:  prev=null, current=1

Iter 1:   next_node=2
          1.next = null
          prev = 1, current = 2
          State: null ← 1    2 → 3 → 4

Iter 2:   next_node=3
          2.next = 1
          prev = 2, current = 3
          State: null ← 1 ← 2    3 → 4

Iter 3:   next_node=4
          3.next = 2
          prev = 3, current = 4
          State: null ← 1 ← 2 ← 3    4

Iter 4:   next_node=null
          4.next = 3
          prev = 4, current = null
          State: null ← 1 ← 2 ← 3 ← 4

Done: current is null, return prev = 4 ✓
```

**Code trace:**
```python
def reverse_with_trace(head):
    """Print each step for debugging."""
    prev = None
    current = head
    step = 0
    
    while current:
        step += 1
        next_node = current.next
        print(f"Step {step}: Save next_node = {next_node.val if next_node else 'null'}")
        
        current.next = prev
        print(f"         Flip: {current.val}.next → {prev.val if prev else 'null'}")
        
        prev = current
        current = next_node
        print(f"         Advance: prev={prev.val}, current={current.val if current else 'null'}")
    
    print(f"Done: Return prev = {prev.val}")
    return prev
```

---

### Tactic 3: Dummy Node for Sublist Problems

**Universal pattern for position-based reversal:**

```python
def reverse_sublist_template(head, left, right):
    """
    Template for reversing portion of linked list.
    """
    # ALWAYS use dummy for position-based problems
    dummy = ListNode(0)
    dummy.next = head
    
    # Find node BEFORE position left
    prev_left = dummy
    for _ in range(left - 1):
        prev_left = prev_left.next
    
    # current starts at position left
    current = prev_left.next
    
    # Reverse the sublist by moving nodes
    for _ in range(right - left):
        next_node = current.next
        
        # Extract next_node and insert after prev_left
        current.next = next_node.next
        next_node.next = prev_left.next
        prev_left.next = next_node
    
    return dummy.next
```

**Why dummy?**
- `left = 1`: Head changes, dummy.next handles it automatically
- `left > 1`: Works the same way
- Eliminates special case handling

---

### Tactic 4: k-Group Reversal Template

**Reverse every k nodes and connect groups:**

```python
def reverse_k_group(head: ListNode, k: int) -> ListNode:
    """
    Reverse every k nodes, connect reversed segments.
    """
    dummy = ListNode(0, head)
    group_prev = dummy
    
    while True:
        # Check if we have k nodes remaining
        kth = group_prev
        for _ in range(k):
            kth = kth.next
            if not kth:
                return dummy.next  # Less than k nodes left
        
        group_next = kth.next  # First node after this group
        
        # Reverse current group (standard reversal)
        prev = group_next      # Will become tail's next
        current = group_prev.next  # First node of group
        
        while current != group_next:
            next_node = current.next
            current.next = prev
            prev = current
            current = next_node
        
        # Update pointers for next iteration
        # group_prev was at node before group, now points to tail
        temp = group_prev.next  # This is now the tail (was head)
        group_prev.next = kth   # kth is now the head
        group_prev = temp       # Move to next group's previous
```

---

### Tactic 5: Palindrome Check (Reverse Second Half)

**Standard approach without extra space:**

```python
def is_palindrome(head: ListNode) -> bool:
    """
    Check if list is palindrome by reversing second half.
    Time: O(n), Space: O(1)
    """
    if not head or not head.next:
        return True
    
    # Step 1: Find middle using fast/slow pointer
    slow = fast = head
    while fast.next and fast.next.next:
        slow = slow.next
        fast = fast.next.next
    
    # Step 2: Reverse second half
    second_half_start = reverse_list(slow.next)
    
    # Step 3: Compare first and second half
    first = head
    second = second_half_start
    result = True
    
    while result and second:
        if first.val != second.val:
            result = False
        first = first.next
        second = second.next
    
    # Step 4: Restore list (optional but good practice)
    slow.next = reverse_list(second_half_start)
    
    return result
```

---

### Tactic 6: Reorder Pattern (Reverse + Interleave)

**Common for "reorder list" problems:**

```python
def reorder_list(head: ListNode) -> None:
    """
    Reorder: L0→Ln→L1→Ln-1→L2→Ln-2→...
    Pattern: Find middle, reverse second half, merge.
    """
    if not head or not head.next:
        return
    
    # Step 1: Find middle
    slow = fast = head
    while fast.next and fast.next.next:
        slow = slow.next
        fast = fast.next.next
    
    # Step 2: Reverse second half
    second = reverse_list(slow.next)
    slow.next = None  # Split into two lists
    
    # Step 3: Merge alternately
    first = head
    while second:
        # Save next pointers
        first_next = first.next
        second_next = second.next
        
        # Interleave
        first.next = second
        second.next = first_next
        
        # Advance
        first = first_next
        second = second_next
```

---

### Tactic 7: Edge Case Checklist

**Always test these cases:**

```python
def test_edge_cases(reverse_func):
    """
    Verify your reversal handles all edge cases.
    """
    test_cases = [
        (None, "Empty list"),
        (ListNode(1), "Single node"),
        (create_list([1, 2]), "Two nodes"),
        (create_list([1, 2, 3]), "Odd length"),
        (create_list([1, 2, 3, 4]), "Even length"),
    ]
    
    for head, desc in test_cases:
        try:
            result = reverse_func(head)
            print(f"✓ {desc}: PASSED")
        except Exception as e:
            print(f"✗ {desc}: FAILED - {e}")
```

| Edge Case | Common Bug | Fix |
|-----------|-----------|-----|
| Empty list | Null reference | `if not head: return head` |
| Single node | Unnecessary work | Works correctly, no special handling |
| Two nodes | Pointer confusion | Verify order: save, flip, advance |
| Odd/even length | Off-by-one | Test both in sublist problems |

<!-- back -->
