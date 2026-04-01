## Title: Kth Largest Tactics

What are the key implementation tactics for kth element selection?

<!-- front -->

---

### Quickselect Optimizations

| Tactic | Implementation |
|--------|----------------|
| Random pivot | Avoid worst-case on sorted input |
| Median-of-three | Better pivot selection |
| Tail recursion | Convert to loop for deep recursion |
| 3-way partition | Handle duplicates efficiently |

### Three-Way Partition
```python
def quickselect_3way(nums, k):
    if not nums:
        return None
    
    pivot = random.choice(nums)
    lt = [x for x in nums if x < pivot]
    eq = [x for x in nums if x == pivot]
    gt = [x for x in nums if x > pivot]
    
    if k < len(lt):
        return quickselect_3way(lt, k)
    elif k < len(lt) + len(eq):
        return pivot
    else:
        return quickselect_3way(gt, k - len(lt) - len(eq))
```

---

### Common Pitfalls
| Pitfall | Issue | Solution |
|---------|-------|----------|
| k vs k-1 | Off-by-one | Clarify 0-indexed vs 1-indexed |
| Duplicates | Wrong count | Use 3-way partition |
| Worst-case | O(n²) | Random pivot or introselect |
| Recursion depth | Stack overflow | Use iterative or limit recursion |
| Empty array | Error | Handle edge cases |

### Python Built-ins
```python
# Statistics module
import statistics
median = statistics.median(nums)  # Uses quickselect

# Heapq
heapq.nsmallest(k, nums)  # Returns k smallest
heapq.nlargest(k, nums)   # Returns k largest
```

<!-- back -->
