## Partition Equal Subset: Comparison

How do different partition subset sum approaches compare?

<!-- front -->

---

### Algorithm Comparison

| Method | Time | Space | Best For | Notes |
|--------|------|-------|----------|-------|
| 1D DP | O(n × target) | O(target) | General case | Standard solution |
| Bitset | O(n × target / word_size) | O(target / 64) | Dense cases | 10-50x faster |
| Recursive + Memo | O(n × target) | O(n × target) | Clarity | Stack overhead |
| Meet-in-Middle | O(2^(n/2)) | O(2^(n/2)) | n > 30, large target | Exponential but smaller base |

---

### DP vs Backtracking

| Aspect | DP | Backtracking |
|--------|----|--------------|
| Time | O(n × target) | O(2^n) worst |
| Space | O(target) | O(n) stack |
| Use when | target is reasonable | Very constrained |
| Guarantees | Always polynomial | Can be fast with pruning |

---

### Optimization Priority

| Bottleneck | Optimization | Impact |
|------------|------------|--------|
| Time | Bitset DP | 10-50x |
| Space | 1D instead of 2D | n× reduction |
| Both | Early termination | Problem dependent |
| Large n | Meet-in-the-middle | Exponential → sub-exponential |

---

### When to Use Each Approach

| Scenario | Recommended | Why |
|----------|-------------|-----|
| n ≤ 20, target small | Any method works | Simple is fine |
| n ≤ 100, target ≤ 10^4 | 1D DP | Standard, reliable |
| n ≤ 100, target ≤ 10^5 | Bitset DP | Fastest |
| n > 30, target huge | Meet-in-middle | Avoids target factor |
| Need actual subset | 2D DP with backtrack | Path reconstruction |

---

### Common Constraints and Limits

| Constraint | Typical Limit | Approach |
|------------|---------------|----------|
| n | 200 | 1D DP |
| n | 30 | Meet-in-middle |
| target | 10^4-10^5 | Bitset |
| nums[i] | 10^5 | Bitset or DP |
| sum(nums) | 10^5 | Standard DP |

```python
# Quick decision tree:
if n <= 20:
    use = "any"
elif n <= 30 and target > 10**5:
    use = "meet_in_middle"
elif target <= 10**5:
    use = "bitset_dp"
else:
    use = "1d_dp_with_optimizations"
```

<!-- back -->
