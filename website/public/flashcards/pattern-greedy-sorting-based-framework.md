## Greedy - Sorting Based: Framework

What is the complete code template for sorting-based greedy solutions?

<!-- front -->

---

### Framework 1: Assign Cookies (Two Arrays)

```
┌─────────────────────────────────────────────────────┐
│  ASSIGN COOKIES - GREEDY TEMPLATE                     │
├─────────────────────────────────────────────────────┤
│  1. Sort both arrays (greed factors, cookie sizes)    │
│  2. Initialize pointers: child = 0, cookie = 0        │
│  3. While child < len(greed) and cookie < len(sizes):│
│     a. If sizes[cookie] >= greed[child]:             │
│        - child += 1 (satisfied)                       │
│     b. cookie += 1 (always advance cookie)            │
│  4. Return child (number satisfied)                   │
└─────────────────────────────────────────────────────┘
```

---

### Framework 2: Boats to Save People (Two Pointers from Ends)

```
┌─────────────────────────────────────────────────────┐
│  BOATS TO SAVE PEOPLE - GREEDY TEMPLATE               │
├─────────────────────────────────────────────────────┤
│  1. Sort people by weight (ascending)                 │
│  2. Initialize pointers:                              │
│     - left = 0 (lightest), right = n-1 (heaviest)     │
│     - boats = 0                                       │
│  3. While left <= right:                              │
│     a. If people[left] + people[right] <= limit:      │
│        - left += 1 (pair them)                         │
│     b. right -= 1 (heaviest always goes)             │
│     c. boats += 1                                     │
│  4. Return boats                                      │
└─────────────────────────────────────────────────────┘
```

---

### Implementation: Assign Cookies

```python
def find_content_children(greed, cookies):
    """
    LeetCode 455: Assign Cookies
    Time: O(n log n), Space: O(1) or O(n) for sort
    """
    greed.sort()
    cookies.sort()
    
    child = cookie = 0
    
    while child < len(greed) and cookie < len(cookies):
        if cookies[cookie] >= greed[child]:
            child += 1  # Child satisfied
        cookie += 1   # Move to next cookie
    
    return child
```

---

### Implementation: Boats to Save People

```python
def num_rescue_boats(people, limit):
    """
    LeetCode 881: Boats to Save People
    Time: O(n log n), Space: O(1) or O(n)
    """
    people.sort()
    
    left, right = 0, len(people) - 1
    boats = 0
    
    while left <= right:
        if people[left] + people[right] <= limit:
            left += 1  # Lightest can share
        right -= 1     # Heaviest always goes
        boats += 1
    
    return boats
```

---

### Key Pattern Elements

| Element | Purpose | Common Usage |
|---------|---------|--------------|
| `sort()` | Reveals structure for greedy choice | Both single and dual arrays |
| Two pointers (start) | Sequential processing | Assign cookies, merging |
| Two pointers (ends) | Pairing extremes | Boats, two sum, container |
| Greedy condition | Locally optimal choice | After sorting, choice is obvious |

<!-- back -->
