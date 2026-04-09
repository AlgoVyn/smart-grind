## Sliding Window Variable Size: Framework

What is the core framework for solving variable-size sliding window problems?

<!-- front -->

---

### The Core Framework

Variable-size sliding window uses **two adjustable pointers** (left and right) to find optimal subarrays/substrings based on dynamic conditions.

**Key Characteristic**: Both boundaries move - right expands, left contracts based on condition state.

---

### Universal Template Structure

```
Initialize left = 0, state = empty

For right from 0 to n-1:
    1. ADD arr[right] to state
    
    2. WHILE condition violated OR can optimize:
        - Update result if valid
        - REMOVE arr[left] from state  
        - left += 1
    
    3. Update result for current valid window

Return result
```

---

### Framework Variations

| Goal | Shrink Trigger | Update When |
|------|----------------|-------------|
| **Minimum Size** | Condition SATISFIED | While valid, shrink to find smaller |
| **Maximum Size** | Condition VIOLATED | After restoring validity |
| **Count All** | Condition VIOLATED | Add (right - left + 1) to count |
| **Exact Match** | State exceeds target | Reset or use prefix sums |

---

### State Tracking Components

| Component | Purpose | Example |
|-----------|---------|---------|
| `current_sum` | Track window sum | Sum-based problems |
| `char_count` | Frequency map | String problems |
| `max_deque` | Track window maximum | Monotonic queue |
| `min_deque` | Track window minimum | Range constraints |
| `prefix_map` | Store prefix sums | Negative numbers |

<!-- back -->
