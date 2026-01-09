# Implement Trie (Prefix Tree)

## Problem Description

A **trie** (pronounced "try") or prefix tree is a tree data structure used to efficiently store and retrieve keys in a dataset of strings. Common applications include autocomplete and spellcheckers.

Implement the Trie class with the following methods:

- `Trie()` - Initializes the trie object.
- `void insert(String word)` - Inserts the string `word` into the trie.
- `boolean search(String word)` - Returns `true` if the string `word` is in the trie (i.e., was inserted before), and `false` otherwise.
- `boolean startsWith(String prefix)` - Returns `true` if there is a previously inserted string word that has the prefix `prefix`, and `false` otherwise.

---

## Examples

**Example 1:**

| Input | Output |
|-------|--------|
| `["Trie", "insert", "search", "search", "startsWith", "insert", "search"]`<br>`[[], ["apple"], ["apple"], ["app"], ["app"], ["app"], ["app"]]` | `[null, null, true, false, true, null, true]` |

**Explanation:**
```python
Trie trie = new Trie();
trie.insert("apple");
trie.search("apple");    // return true
trie.search("app");      // return false
trie.startsWith("app");  // return true
trie.insert("app");
trie.search("app");      // return true
```

---

## Constraints

- `1 <= word.length, prefix.length <= 2000`
- `word` and `prefix` consist only of lowercase English letters.
- At most `3 * 10⁴` calls in total will be made to `insert`, `search`, and `startsWith`.

---

## Solution

```python
class Trie:
    def __init__(self):
        self.children = {}  # Maps character to child Trie node
        self.is_end = False  # Marks the end of a word

    def insert(self, word: str) -> None:
        """Inserts the string word into the trie."""
        node = self
        for c in word:
            if c not in node.children:
                node.children[c] = Trie()
            node = node.children[c]
        node.is_end = True

    def search(self, word: str) -> bool:
        """Returns true if the string word is in the trie."""
        node = self
        for c in word:
            if c not in node.children:
                return False
            node = node.children[c]
        return node.is_end

    def startsWith(self, prefix: str) -> bool:
        """Returns true if there is a word with the given prefix."""
        node = self
        for c in prefix:
            if c not in node.children:
                return False
            node = node.children[c]
        return True
```

---

## Explanation

This problem implements a Trie (prefix tree) for efficient string operations.

### Node Structure

Each Trie node contains:
- `children`: A dictionary mapping characters to child nodes.
- `is_end`: A boolean flag indicating if this node marks the end of a valid word.

### Operations

1. **Insert:**
   - Traverse through each character of the word.
   - Create new nodes as needed.
   - Mark `is_end = True` at the final node.

2. **Search:**
   - Traverse through each character.
   - If a character is not found, return `False`.
   - At the end, return the value of `is_end`.

3. **startsWith:**
   - Similar to search, but don't check `is_end` at the end.
   - Return `True` if all characters in the prefix exist.

---

## Complexity Analysis

| Operation | Time Complexity | Space Complexity |
|-----------|-----------------|------------------|
| Insert | O(m) | O(m) where m is word length |
| Search | O(m) | O(1) |
| startsWith | O(m) | O(1) |

**Overall Space:** O(n * m) where n is the number of words and m is the average word length.
