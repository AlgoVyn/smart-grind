## Add Two Numbers (Linked List)

**Question:** Add two numbers represented as linked lists?

<!-- front -->

---

## Answer: Iterate with Carry

### Solution
```python
def addTwoNumbers(l1, l2):
    dummy = ListNode(0)
    current = dummy
    carry = 0
    
    while l1 or l2 or carry:
        val1 = l1.val if l1 else 0
        val2 = l2.val if l2 else 0
        
        total = val1 + val2 + carry
        carry = total // 10
        current.next = ListNode(total % 10)
        
        current = current.next
        l1 = l1.next if l1 else None
        l2 = l2.next if l2 else None
    
    return dummy.next
```

### Visual: Addition
```
l1: 2 → 4 → 3  (342)
l2: 5 → 6 → 4  (465)

Step 1: 2+5+0=7 → node.val=7
Step 2: 4+6+0=10 → node.val=0, carry=1
Step 3: 3+4+1=8 → node.val=8

Result: 7 → 0 → 8 (708)
```

### ⚠️ Tricky Parts

#### 1. Why Use Dummy Node?
```python
# Don't know what first digit will be
# Could have carry creating extra digit

# Dummy simplifies: always attach to dummy.next
# Then return dummy.next
```

#### 2. Continue While Condition
```python
# Need to process when:
# - l1 has more digits
# - l2 has more digits  
# - carry is non-zero at end

# while l1 or l2 or carry:
```

### Time & Space Complexity

| Method | Time | Space |
|--------|------|-------|
| Single pass | O(max(m,n)) | O(max(m,n)) |

### Common Mistakes

| Mistake | Fix |
|---------|-----|
| Not handling carry | Check carry at end |
| Not handling different lengths | Use 0 for missing digits |
| Wrong modulo | Use total % 10 |

<!-- back -->
