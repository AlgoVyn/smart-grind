## Prim's Algorithm: Core Concepts

What are the fundamental principles of Prim's algorithm for Minimum Spanning Trees?

<!-- front -->

---

### Core Concept

Prim's algorithm grows the MST from a starting node, always adding the cheapest edge that connects a new vertex to the growing tree.

**Key insight**: At each step, maintain a cut between tree and non-tree vertices, pick minimum crossing edge.

---

### Algorithm Steps

1. Start with any vertex in the MST
2. Find minimum weight edge connecting MST to outside vertex
3. Add that edge and vertex to MST
4. Repeat until all vertices included

---

### Visual: Prim's Execution

```
Graph:        Execution:
A--4--B       Start: A in MST
|     |       Step 1: min edge from A is A-C (2)
2     1       Add C to MST
|     |       Step 2: edges from {A,C}: A-B(4), C-B(3), C-D(5)
C--3--B--5--D  Pick C-B (3)
    |         Step 3: edges from {A,C,B}: B-D(5), B-E(1)
    1         Pick B-E (1)
    |         Step 4: add D via B-D or E-D
    E--2--D   

Final MST: A-C (2), C-B (3), B-E (1), E-D (2) = 8
```

---

### Cut Property

Any minimum weight edge crossing a cut is in some MST.

```
Cut divides vertices into S and V-S
        S | V-S
        --+--
       /  |  \
      A---2---B
       \  |  /
        \ 3 /
         \|/
          C

If (A,B) is minimum weight crossing edge, it's in MST.
```

---

### Complexity Analysis

| Implementation | Time | Space | Best For |
|----------------|------|-------|----------|
| Array + linear scan | O(V²) | O(V) | Dense graphs |
| Binary heap | O(E log V) | O(V) | Sparse graphs |
| Fibonacci heap | O(E + V log V) | O(V) | Theoretical |

<!-- back -->
