# Flashcards: Heap - Scheduling / Minimum Cost (Greedy with Priority Queue) - Tactics

## Card 1: Implementing Max Heap in Python

**Front:**
How do you implement a max heap in Python using `heapq` (which only provides min heap)?

**Back:**
**Negate values** to simulate max heap behavior:

```python
import heapq

max_heap = []
heapq.heappush(max_heap, -value)      # Push negated
largest = -heapq.heappop(max_heap)    # Pop and negate back
```

**For custom objects**, negate the comparison key:
```python
heapq.heappush(max_heap, (-priority, item))
```

**Tags:** python, max-heap, implementation, heapq

---

## Card 2: K-Constraint Enforcement Pattern

**Front:**
What is the code pattern for enforcing "exactly K elements" using a heap?

**Back:**
```python
heap = []
running_sum = 0

for item in sorted_items:
    heapq.heappush(heap, -item)  # Max heap
    running_sum += item
    
    # Enforce K constraint: remove largest if exceeded
    if len(heap) > k:
        removed = -heapq.heappop(heap)
        running_sum -= removed
    
    # Process when we have exactly K
    if len(heap) == k:
        calculate_result(running_sum)
```

**Tags:** k-constraint, pattern, code-template

---

## Card 3: Sort + Single Pass Technique

**Front:**
What is the "Sort + Single Pass" technique used in Minimum Cost to Hire K Workers?

**Back:**
1. **Preprocess**: Sort all items by a key (e.g., ratio)
2. **Single pass**: Iterate through sorted items once
3. **Maintain state**: Use heap to track best K items seen so far
4. **Update answer**: Calculate result at each valid state

```python
workers = sorted([(w/q, q) for w, q in zip(wage, quality)])
heap = []
for ratio, q in workers:
    # Add to heap, enforce constraint, calculate if valid
```

**Why it works**: Sorted order ensures we consider items in optimal sequence

**Tags:** sort-pass, technique, single-pass

---

## Card 4: Two-Pointer with Heaps (IPO Pattern)

**Front:**
What is the "Two-Pointer with Heaps" technique used in the IPO problem?

**Back:**
```python
# Sort by capital requirement
projects = sorted(zip(capital, profits))
idx = 0  # Pointer for affordable projects
available = []  # Max heap for profits

for _ in range(k):
    # Move pointer: add all now-affordable projects
    while idx < n and projects[idx][0] <= w:
        heapq.heappush(available, -projects[idx][1])
        idx += 1
    
    # Select most profitable
    if available:
        w += -heapq.heappop(available)
```

**Key**: One pointer tracks progress, heap tracks current best options

**Tags:** two-pointer, ipo, dynamic-availability

---

## Card 5: Running Sum Maintenance

**Front:**
Why maintain a running sum alongside the heap, and what are the pitfalls?

**Back:**
**Purpose**: Avoid O(K) sum calculation by tracking incrementally

```python
heap = []
total = 0

# Add: push and increment
heapq.heappush(heap, -q)
total += q

# Remove: pop and decrement
if len(heap) > k:
    total += heapq.heappop(heap)  # Note: already negated!
```

**Pitfalls**:
- Forgetting to update sum when popping
- Double-negation errors with max heap
- Off-by-one in size check
- Not handling empty heap case

**Tags:** running-sum, optimization, pitfalls
