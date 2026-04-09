## Minimum Spanning Tree (Kruskal/Prim/DSU/Heap): Core Concepts

What are the fundamental concepts behind MST algorithms?

<!-- front -->

---

### Core Principle: The Cut Property

**For any cut of the graph, the minimum weight edge crossing the cut belongs to some MST.**

```
Cut Property Visualization:

    Cut divides graph into S and T
    
    S = {A, B}          T = {C, D, E}
         ┌───┐            ┌───┐
         │ A │───2───────│ C │
         └───┘            └───┘
           │\               /|
           │ \5           3/ │
           1  \           /  4
           │   \       /    │
         ┌───┐  \   /     ┌───┐
         │ B │───\/───────│ D │
         └───┘   /\       └───┘
                /  \
               / 6  \
            ┌───┐   ┌───┐
            │ E │   │...│
            └───┘   └───┘
            
    Minimum edge crossing cut: weight 2 (A-C)
    This edge MUST be in some MST!
```

**Why greedy works:** Picking the minimum edge crossing any cut never prevents finding the optimal MST.

---

### The "Aha!" Moments

**1. Why does greedy work for MST?**

The Cut Property guarantees that adding the minimum available edge (that doesn't create a cycle) preserves the possibility of reaching the global optimum. Unlike many greedy algorithms, MST algorithms always produce optimal solutions.

**2. Kruskal vs Prim - when to use which?**

| Factor | Kruskal | Prim |
|--------|---------|------|
| Graph representation | Edge list | Adjacency list |
| Preprocessing | Sort edges (O(E log E)) | Build heap (O(V)) |
| Best for | Sparse (E ≈ V) | Dense (E ≈ V²) |
| Code simplicity | Simpler | More complex |
| Implementation | Union-Find required | Heap required |

**3. Why Union-Find for Kruskal?**

Union-Find efficiently tracks connected components:
- `find(u) == find(v)` → Adding edge creates a cycle
- `union(u, v)` → Merge components
- Path compression makes operations nearly O(1)

---

### MST Construction Visualization

```
Graph:              Kruskal's Process:

A ──4── B           1. Sort: (A,C,1), (B,C,2), (C,D,3), (A,B,4)...
│      /│
1    2 5│           2. Add (A,C,1): Components {A,C}, {B}, {D}
│   /   │              ✓ No cycle
C ──3── D           3. Add (B,C,2): Components {A,B,C}, {D}
    7   6              ✓ No cycle
                    4. Add (C,D,3): Components {A,B,C,D}
                       ✓ No cycle
                    5. Skip (A,B,4): A and B already connected
                       ✗ Would create cycle A-C-B-A

MST Result:
A ──1── C
│      /
B ──2─/
      \
       3
        \
         D

Total weight: 1 + 2 + 3 = 6
```

---

### Union-Find Deep Dive

**Path Compression:**
```
Before find(4):          After find(4):
    0                       0
   /|                      /|\
  1 2                     1 2 3 4
  |                      
  3                      All nodes point directly to root!
  |
  4
```

**Union by Rank:**
- Always attach smaller tree under larger tree
- Keeps tree height O(log n) without path compression
- With path compression: O(α(n)) ≈ O(1)

---

### When to Use MST Pattern

| Signal | Pattern |
|--------|---------|
| "Connect all points with minimum cost" | Classic MST |
| "Minimum cost to connect all cities" | MST |
| "Network design with minimum wires" | MST |
| "Connect islands with bridges" | MST |
| "Virtual node" mentioned | MST with extra node |
| "Maximum spanning tree" | Same algo, reverse sort |

---

### Time & Space Complexity

**Kruskal's:**
- Sort edges: O(E log E)
- DSU operations: O(E α(V)) ≈ O(E)
- **Total: O(E log E)**
- **Space: O(V)** for DSU

**Prim's (Heap):**
- Each node extracted once: O(V log V)
- Each edge processed: O(E log V)
- **Total: O(E log V)**
- **Space: O(V)** for heap + visited

**Prim's (Array for dense):**
- Finding min: O(V) × V times = O(V²)
- **Total: O(V²)**
- **Space: O(V)**

---

### Problem Identification Signals

| Signal | Algorithm |
|--------|-----------|
| "Connect all points/nodes" | MST |
| "Minimum cost to build network" | MST |
| "Points given as coordinates" | Build edges + Kruskal/Prim |
| "Already have edge list" | Kruskal |
| "Dense graph / adjacency matrix" | Prim with array |
| "Sparse graph / adjacency list" | Prim with heap |
| "Virtual well/pipe" | Add virtual node, run MST |

<!-- back -->
