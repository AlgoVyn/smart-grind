## Title: Trie - Frameworks

What are the structured approaches for using Tries?

<!-- front -->

---

### Framework 1: Basic Trie Operations

```
┌─────────────────────────────────────────────────────┐
│  BASIC TRIE OPERATIONS FRAMEWORK                     │
├─────────────────────────────────────────────────────┤
│  INSERT(word):                                       │
│    1. Start at root                                  │
│    2. For each char in word:                         │
│       a. If char not in children, create new node   │
│       b. Move to child node                          │
│    3. Mark final node as is_end = true              │
│                                                      │
│  SEARCH(word):                                       │
│    1. Start at root                                  │
│    2. For each char in word:                         │
│       a. If char not in children, return False      │
│       b. Move to child node                          │
│    3. Return node.is_end                              │
│                                                      │
│  STARTS_WITH(prefix):                                  │
│    1. Same as SEARCH but ignore is_end check        │
│    2. Return True if all chars found                  │
└─────────────────────────────────────────────────────┘
```

---

### Framework 2: Trie with Autocomplete

```
┌─────────────────────────────────────────────────────┐
│  TRIE AUTOCOMPLETE FRAMEWORK                         │
├─────────────────────────────────────────────────────┤
│  1. Build Trie by inserting all dictionary words    │
│  2. GET_WORDS_WITH_PREFIX(prefix):                  │
│     a. Traverse to node representing prefix         │
│     b. If node doesn't exist, return empty list     │
│     c. Perform DFS/BFS from this node:              │
│        - If node.is_end, add node.word to results   │
│        - Recursively visit all children              │
│  3. Return collected words                            │
└─────────────────────────────────────────────────────┘
```

---

### Framework 3: Trie for Word Games

```
┌─────────────────────────────────────────────────────┐
│  TRIE FOR WORD SEARCH / BOGGLE FRAMEWORK             │
├─────────────────────────────────────────────────────┤
│  1. Build Trie with all valid dictionary words      │
│  2. DFS from each cell in the board:                │
│     a. Track current word being built               │
│     b. Check if current prefix exists in Trie       │
│     c. If prefix doesn't exist, prune this path   │
│     d. If complete word found, add to results       │
│     e. Backtrack: remove last char, mark cell unvisited │
│  3. Return all found words                            │
│                                                      │
│  Key Optimization: Early termination on invalid prefix│
└─────────────────────────────────────────────────────┘
```

<!-- back -->
