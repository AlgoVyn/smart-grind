## Binary Lifting: Problem Forms

What are the different problem forms and variations that use binary lifting?

<!-- front -->

---

### Standard LCA Forms

| Form | Input | Output |
|------|-------|--------|
| **Two-node LCA** | u, v | w = LCA(u,v) |
| **Multiple node LCA** | Set S | w = LCA of all nodes in S |
| **LCA with updates** | Tree changes | Dynamic LCA queries |
| **LCA in forest** | Multiple roots | Root-specified LCA |

**Multi-node LCA:**
```python
def multi_lca(nodes, up, depth, LOG):
    """LCA of multiple nodes"""
    result = nodes[0]
    for node in nodes[1:]:
        result = lca(result, node, up, depth, LOG)
    return result
```

---

### K-th Ancestor Variants

| Variant | Query | Approach |
|---------|-------|----------|
| **Direct ancestor** | k-th ancestor of v | Binary decomposition |
| **Jump game** | Reachable from v in exactly k jumps | DP with bitset |
| **Ancestor at distance** | Node at distance d from v | Same as k-th ancestor |
| **K-th node on path** | Node k steps from u toward v | LCA-based |

**K-th node on path u-v:**
```python
def kth_node_on_path(u, v, k, up, depth, LOG):
    """k-th node from u toward v (0-indexed)"""
    w = lca(u, v, up, depth, LOG)
    dist_uw = depth[u] - depth[w]
    
    if k <= dist_uw:
        return kth_ancestor(u, k, up, LOG)
    else:
        # On v side
        dist_vw = depth[v] - depth[w]
        steps_from_v = dist_uw + dist_vw - k
        return kth_ancestor(v, steps_from_v, up, LOG)
```

---

### Path Query Forms

| Query | Storage | Implementation |
|-------|---------|------------------|
| **Min/Max on path** | min_up[v][i] | Combine with ancestor jump |
| **Sum on path** | sum_up[v][i] | Add during jumps |
| **XOR on path** | xor_up[v][i] | XOR during jumps |
| **Count frequencies** | Persistent segment tree | Heavy with binary lifting |

---

### Jump Pointer Problems

**Functional graph queries (each node has one outgoing edge):**
```python
# Find k-th successor in functional graph
def functional_graph_jump(start, k, up, LOG):
    """Same as kth_ancestor - each node has one parent"""
    return kth_ancestor(start, k, up, LOG)

# Cycle detection with binary lifting
# Floyd's cycle finding or use binary lifting for reachability
```

---

### Advanced Applications

| Problem | Technique |
|-----------|-----------|
| **Tree centroid decomposition** | Binary lifting on centroid tree |
| **Dynamic connectivity offline** | DSU + binary lifting on time |
| **LCA in trie** | Build parent pointers, apply lifting |
| **Suffix tree LCA** | Equals longest common prefix |
| **Tree isomorphism** | Hash subtrees, compare with lifting |

**Binary lifting on Euler tour:**
```python
# Combine with segment tree for O(log n) path aggregates
# while keeping O(log n) LCA
```

<!-- back -->
