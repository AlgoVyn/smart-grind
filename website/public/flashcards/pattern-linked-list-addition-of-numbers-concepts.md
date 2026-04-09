## Linked List Addition of Numbers: Core Concepts

What are the fundamental concepts behind adding numbers stored in linked lists?

<!-- front -->

---

### Problem Definition

Add two numbers represented as linked lists, where each node contains a single digit. Digits are stored in **reverse order** (least significant digit at the head).

**Example:**
```
List 1: 2 -> 4 -> 3   represents 342
List 2: 5 -> 6 -> 4   represents 465
Result: 7 -> 0 -> 8   represents 807
```

---

### Key Insight: Reverse Order Storage

The **"aha!" moment**: Linked lists store digits in reverse order, which matches how humans add numbers manually (from right to left).

```
Manual Addition:     Linked List:
    342               2 -> 4 -> 3
  + 465             + 5 -> 6 -> 4
  -----             -----------
    807               7 -> 0 -> 8
```

This eliminates the need to reverse lists before processing.

---

### Carry Propagation

A single variable (0 or 1) carries excess to the next digit position.

```
Position:    0     1     2
          2→4→3 + 5→6→4
          ↓     ↓     ↓
Digit 0:  2+5=7, carry=0
Digit 1:  4+6=10, digit=0, carry=1  ← overflow handled
Digit 2:  3+4+1(carry)=8, carry=0
Final:    7→0→8
```

---

### Dummy Node Technique

Using a dummy head simplifies edge cases and result construction.

```
Without dummy:           With dummy:
┌─────────┐             ┌─────────┐
│ Handle  │             │ dummy   │
│ empty   │             │    ↓    │
│ input   │             │ result  │
│ cases   │             │    ↓    │
│ first   │             │ node1   │
│         │             │    ↓    │
│ Special │             │ node2   │
│ return  │             │    ↓    │
│ logic   │             │ ...     │
└─────────┘             └─────────┘
        ↓                        ↓
    Complex                 Simple:
    code                    return dummy.next
```

---

### Complexity Analysis

| Aspect | Value | Explanation |
|--------|-------|-------------|
| Time | O(max(n, m)) | Traverse the longer list once |
| Space | O(max(n, m)) | Result linked list size |
| Input | Two linked lists | Digits in reverse order |
| Output | Linked list | Sum in reverse order |

---

### When to Use This Pattern

- Adding numbers that exceed standard integer type limits
- Problems requiring digit-by-digit arithmetic operations
- Implementing arbitrary-precision calculators
- Handling very large numbers in competitive programming
- Problems involving carry propagation across linked structures

<!-- back -->
