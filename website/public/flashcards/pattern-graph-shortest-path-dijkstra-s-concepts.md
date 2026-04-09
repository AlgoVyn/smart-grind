## Graph - Shortest Path Dijkstra: Core Concepts

What are the fundamental concepts behind Dijkstra's algorithm?

<!-- front -->

---

### Core Principle

**Greedy Choice Property: The closest unvisited node's shortest path is finalized and will never change.**

```
Dijkstra's Insight:
┌─────────────────────────────────────────────────────────┐
│                                                         │
│   Source ──[3]──► A ──[2]──► B ──[4]──► C               │
│       ╲                                           ▲    │
│        ╲________[10]______________________________/    │
│                                                         │
│   When we pop A from PQ with distance 3:               │
│   - No other path to A can be shorter than 3           │
│   - All other paths go through unvisited nodes         │
│   - Those nodes have distance ≥ 3 (min-heap property)  │
│   - Adding non-negative edges can only increase cost   │
│                                                         │
│   → Distance to A is FINALIZED ✓                     │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

### The "Aha!" Moments

**Why does Dijkstra work?**

1. **Greedy choice**: Always process the closest unvisited node first - its distance is optimal
2. **Relaxation**: Update distances when a better path is found through the current node
3. **Priority queue**: Efficiently retrieve the minimum distance node in O(log V)
4. **Optimal substructure**: Shortest path to a node contains shortest paths to intermediate nodes
5. **Non-negative constraint**: Required for greedy choice to remain correct

---

### The Relaxation Operation

**Key operation: Update distance if a better path is found**

```
Before relaxation:
┌──────────┐         ┌──────────┐
│   Node   │───[5]────►│ Neighbor │
│  (dist=3)│           │ (dist=10)│
└──────────┘           └──────────┘

After checking edge weight 5:
New distance = 3 + 5 = 8 < 10

Update: dist[neighbor] = 8 ✓
```

```python
# Relaxation code
new_dist = dist[current] + edge_weight
if new_dist < dist[neighbor]:
    dist[neighbor] = new_dist
    heapq.heappush(pq, (new_dist, neighbor))
```

---

### Why Non-Negative Weights Are Required

```
With negative weights, greedy choice fails:

Source ──[5]──► A ──[-10]──► B
     ╲                        ▲
      ╰───────[100]───────────┘

Dijkstra's steps:
1. Pop A (dist=5) - mark as finalized
2. Cannot find better path to A later
3. But: Source → B → A would be 100 + (-10) = 90, then 90 + ?
   Actually: Source → A → B = 5 + (-10) = -5
   
Problem: Once A is finalized, we miss that B → A could be better
         if B's path gets improved later.

Non-negative weights prevent this - adding edges always increases cost.
```

---

### Outdated Entries in Priority Queue

**Why we need to skip outdated entries:**

```
Scenario:
1. Push (10, node) to PQ
2. Later find better path: dist[node] = 5, push (5, node)
3. PQ now has: [(5, node), ..., (10, node)]
4. Pop (5, node), process neighbors
5. Later pop (10, node) - but dist[node] is now 5!
6. Check: 10 > 5 → skip this outdated entry

Without check: Would reprocess node unnecessarily
With check: O(1) to skip, correct result maintained
```

---

### Time & Space Complexity

| Aspect | Complexity | Explanation |
|--------|------------|-------------|
| Time | O((V + E) log V) | Each node pushed/popped from heap |
| Space | O(V) | Distances array + priority queue |
| Best case | O(E log V) | When target is found early |

---

### Problem Identification Signals

| Signal | Pattern |
|--------|---------|
| "Shortest path" with weighted edges | Dijkstra |
| "Minimum cost" in a network | Dijkstra |
| "Network delay time" | Dijkstra |
| "Cheapest flight" within constraints | Modified Dijkstra |
| "Minimum effort path" | Dijkstra with max edge weight |
| Non-negative weights mentioned | Dijkstra (not Bellman-Ford) |

<!-- back -->
