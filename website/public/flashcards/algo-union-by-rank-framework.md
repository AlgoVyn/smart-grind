## Title: Union Find (Union by Rank) - Frameworks

What are the structured approaches for Union-Find?

<!-- front -->

---

### Framework 1: Union Find with Rank and Path Compression

```
┌─────────────────────────────────────────────────────┐
│  UNION-FIND WITH RANK + PATH COMPRESSION            │
├─────────────────────────────────────────────────────┤
│  INITIALIZE:                                         │
│    1. parent[i] = i for all i (0 to n-1)           │
│    2. rank[i] = 0 for all i                          │
│                                                      │
│  FIND(x):                                            │
│    1. If parent[x] != x:                             │
│       parent[x] = find(parent[x]) // Compress       │
│    2. Return parent[x]                               │
│                                                      │
│  UNION(x, y):                                        │
│    1. rootX = find(x), rootY = find(y)               │
│    2. If same root: return                           │
│    3. If rank[rootX] < rank[rootY]:                 │
│       parent[rootX] = rootY                          │
│    4. Else if rank[rootX] > rank[rootY]:              │
│       parent[rootY] = rootX                          │
│    5. Else:                                          │
│       parent[rootY] = rootX                          │
│       rank[rootX] += 1                              │
└─────────────────────────────────────────────────────┘
```

---

### Framework 2: Union Find by Size

```
┌─────────────────────────────────────────────────────┐
│  UNION-FIND BY SIZE                                │
├─────────────────────────────────────────────────────┤
│  INITIALIZE:                                         │
│    1. parent[i] = i for all i                        │
│    2. size[i] = 1 for all i (track component size)  │
│                                                      │
│  UNION(x, y):                                        │
│    1. rootX = find(x), rootY = find(y)             │
│    2. If same root: return                           │
│    3. If size[rootX] < size[rootY]:                 │
│       parent[rootX] = rootY                          │
│       size[rootY] += size[rootX]                   │
│    4. Else:                                          │
│       parent[rootY] = rootX                          │
│       size[rootX] += size[rootY]                   │
└─────────────────────────────────────────────────────┘
```

**When to use:** When you need to track component sizes efficiently.

---

### Framework 3: Union Find with Additional Data

```
┌─────────────────────────────────────────────────────┐
│  UNION-FIND WITH COMPONENT DATA                     │
├─────────────────────────────────────────────────────┤
│  INITIALIZE:                                         │
│    1. parent[i] = i, rank[i] = 0                   │
│    2. extra_data[i] = initial_value for all i       │
│                                                      │
│  UNION(x, y):                                        │
│    1. Find roots and union by rank                   │
│    2. Merge extra_data:                              │
│       extra_data[new_root] = merge(                │
│           extra_data[rootX],                         │
│           extra_data[rootY]                         │
│       )                                              │
│                                                      │
│  GET_DATA(x):                                        │
│    1. Return extra_data[find(x)]                   │
└─────────────────────────────────────────────────────┘
```

**When to use:** When you need to track additional properties per component (min, max, sum).

<!-- back -->
