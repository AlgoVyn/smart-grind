## Title: Rotate Array - Forms

What are the different manifestations of array rotation problems?

<!-- front -->

---

### Form 1: Right Rotation (Standard)

Rotate elements toward higher indices.

| Input | k | Steps | Result |
|-------|---|-------|--------|
| `[1,2,3,4,5,6,7]` | 3 | Reverse all → First 3 → Rest | `[5,6,7,1,2,3,4]` |
| `[-1,-100,3,99]` | 2 | Reverse all → First 2 → Rest | `[3,99,-1,-100]` |

```python
def rotate_right(nums, k):
    n = len(nums)
    k = k % n
    reverse(0, n-1)
    reverse(0, k-1)
    reverse(k, n-1)
```

---

### Form 2: Left Rotation

Rotate elements toward lower indices.

```
Left rotation by k = Right rotation by (n - k)

Or using modified reversal:
1. Reverse first k
2. Reverse remaining n-k
3. Reverse all
```

```python
def rotate_left(nums, k):
    n = len(nums)
    k = k % n
    reverse(0, k - 1)        # Reverse first k
    reverse(k, n - 1)        # Reverse remaining
    reverse(0, n - 1)        # Reverse all
```

---

### Form 3: String Rotation

Apply same logic to strings (convert to list first).

| String | k | Result |
|--------|---|--------|
| "hello" | 2 | "lohel" |
| "abcdef" | 3 | "defabc" |
| "rotate" | 4 | "aterot" |

```python
def rotate_string(s, k):
    chars = list(s)
    n = len(chars)
    k = k % n
    # Apply reversal algorithm
    return ''.join(chars)
```

---

### Form 4: Linked List Rotation

Rotate linked list by k places (LeetCode 61).

```
Approach:
1. Connect tail to head to form a cycle
2. Find new tail at position (n - k % n - 1)
3. Find new head at next position
4. Break the cycle at new tail
```

```python
def rotate_right_linked_list(head, k):
    if not head or not head.next or k == 0:
        return head
    
    # Find length and tail
    length, tail = 1, head
    while tail.next:
        tail = tail.next
        length += 1
    
    # Make circular
    tail.next = head
    
    # Find new tail and break
    new_tail_pos = length - k % length - 1
    new_tail = head
    for _ in range(new_tail_pos):
        new_tail = new_tail.next
    
    new_head = new_tail.next
    new_tail.next = None
    return new_head
```

---

### Form 5: 2D Array (Matrix) Rotation

Rotate matrix 90 degrees (different pattern).

```
Approach: Transpose + Reverse rows
1. Transpose matrix (swap across diagonal)
2. Reverse each row

Result: 90° clockwise rotation
```

<!-- back -->
