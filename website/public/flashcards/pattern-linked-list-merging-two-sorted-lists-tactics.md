## Linked List - Merging Two Sorted Lists: Tactics

What are practical tactics for solving merge two sorted lists problems?

<!-- front -->

---

### Tactic 1: Use Dummy Node Pattern

**The dummy node eliminates special-case handling for the head:**

```python
def merge_with_visualization(l1, l2):
    """Show why dummy node simplifies logic."""
    dummy = ListNode(0)  # Temporary anchor
    current = dummy
    
    # No need to check if this is the first node!
    # Just keep appending and move current
    while l1 and l2:
        if l1.val <= l2.val:
            current.next = l1
            l1 = l1.next
        else:
            current.next = l2
            l2 = l2.next
        current = current.next
    
    # Final result starts at dummy.next
    return dummy.next
```

**Without dummy, you'd need:**
```python
# Messy version - need to handle first node specially
if not head:
    head = l1 if l1.val <= l2.val else l2
else:
    current.next = ...
```

---

### Tactic 2: Stable Sort with `<=`

**Use `<=` not `<` to maintain relative order of equal elements:**

```python
# Stable: preserves order of equal elements
if l1.val <= l2.val:  # ✅ Correct
    current.next = l1

# Unstable: swaps equal elements unpredictably
if l1.val < l2.val:   # ❌ Avoid
    current.next = l1
```

**Example:**
```
List1: 1a → 3      (1a is first 1)
List2: 1b → 4      (1b is second 1)

With <=: 1a → 1b → 3 → 4  (stable)
With < : 1b → 1a → 3 → 4  (unstable)
```

---

### Tactic 3: Handle Edge Cases First

**Explicit null checks make code cleaner:**

```python
def merge_robust(l1, l2):
    """Handle all edge cases upfront."""
    # Edge cases
    if not l1:
        return l2
    if not l2:
        return l1
    
    # Main logic - now both lists are non-null
    dummy = ListNode(0)
    current = dummy
    
    while l1 and l2:
        # ... merge logic
        pass
    
    # Append remainder
    current.next = l1 if l1 else l2
    return dummy.next
```

---

### Tactic 4: Visual Debugging

**Trace through with a concrete example:**

```python
def merge_with_trace(l1, l2):
    """Print each step for debugging."""
    dummy = ListNode(0)
    current = dummy
    step = 0
    
    while l1 and l2:
        step += 1
        print(f"\nStep {step}:")
        print(f"  l1.val = {l1.val}, l2.val = {l2.val}")
        
        if l1.val <= l2.val:
            print(f"  → Pick l1.val = {l1.val}")
            current.next = l1
            l1 = l1.next
        else:
            print(f"  → Pick l2.val = {l2.val}")
            current.next = l2
            l2 = l2.next
        
        current = current.next
        print(f"  Result so far: {list_to_array(dummy.next)}")
    
    # Append remainder
    remainder = l1 if l1 else l2
    print(f"\nAppend remainder: {list_to_array(remainder) if remainder else 'None'}")
    current.next = remainder
    
    return dummy.next
```

---

### Tactic 5: Extension to k Lists

**Build up from pairwise merging:**

```python
from heapq import heappush, heappop

def merge_k_lists(lists):
    """
    Merge k sorted lists using min-heap.
    Time: O(N log k), Space: O(k)
    """
    dummy = ListNode(0)
    current = dummy
    
    # Min-heap: (value, list_index, node)
    # list_index breaks ties for nodes with same value
    heap = []
    for i, node in enumerate(lists):
        if node:
            heappush(heap, (node.val, i, node))
    
    while heap:
        val, i, node = heappop(heap)
        current.next = node
        current = current.next
        
        if node.next:
            heappush(heap, (node.next.val, i, node.next))
    
    return dummy.next


def merge_k_lists_divide_conquer(lists):
    """
    Merge k lists using divide-and-conquer.
    Time: O(N log k), Space: O(log k) recursion
    """
    if not lists:
        return None
    if len(lists) == 1:
        return lists[0]
    
    mid = len(lists) // 2
    left = merge_k_lists_divide_conquer(lists[:mid])
    right = merge_k_lists_divide_conquer(lists[mid:])
    
    return merge_two_lists(left, right)
```

---

### Tactic 6: Follow-Up Variations

| Question | Approach |
|----------|----------|
| Merge in descending order? | Reverse both first, or change comparison to `>=` |
| Merge without modifying inputs? | Create new nodes instead of rewiring |
| What if lists have cycles? | Detect cycles first (Floyd's), break them, then merge |
| Merge into one of the lists? | Use in-place merge, return head of that list |

<!-- back -->
