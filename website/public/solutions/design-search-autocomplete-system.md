# Design Search Autocomplete System

## Problem Description
Design a search autocomplete system that returns the top 3 hot sentences for each query character.

When a character is typed, the system should return up to 3 sentences that have the prefix formed by all characters typed so far, sorted by their frequency (descending). If two sentences have the same frequency, they should be sorted lexicographically (ascending).

When the character '#' is typed, it indicates the end of a sentence. The sentence should be added to the autocomplete system with a frequency count of 1.

Implement the following methods:
- `AutocompleteSystem(sentences: List[str], times: List[int])`: Initialize the system with given sentences and their initial frequencies.
- `input(c: str) -> List[str]`: Input the next character c and return the top 3 hot sentences.

## Examples

**Input:**
```python
sentences = ["i love you", "island", "iroman"]
times = [5, 3, 2]
```

**Output:**
```
# After initialization, the system is ready to accept queries
```

## Constraints

- `1 <= sentences.length <= 100`
- `1 <= sentences[i].length <= 100`
- `1 <= times.length == sentences.length`
- `1 <= times[i] <= 10^3`

## Solution

```python
import heapq
from typing import List

class TrieNode:
    def __init__(self):
        self.children = {}
        self.sentences = {}  # sentence -> count

class AutocompleteSystem:

    def __init__(self, sentences: List[str], times: List[int]):
        self.root = TrieNode()
        self.current = ""
        self.node = self.root
        for s, t in zip(sentences, times):
            self._insert(s, t)

    def _insert(self, sentence: str, times: int):
        node = self.root
        for char in sentence:
            if char not in node.children:
                node.children[char] = TrieNode()
            node = node.children[char]
        node.sentences[sentence] = node.sentences.get(sentence, 0) + times

    def input(self, c: str) -> List[str]:
        if c == '#':
            self._insert(self.current, 1)
            self.current = ""
            self.node = self.root
            return []
        self.current += c
        if c not in self.node.children:
            self.node = TrieNode()  # dummy node
            return []
        self.node = self.node.children[c]
        # Get all sentences under this node
        candidates = []
        self._collect(self.node, self.current, candidates)
        # Sort by times desc, then lex asc
        candidates.sort(key=lambda x: (-x[1], x[0]))
        return [s for s, _ in candidates[:3]]

    def _collect(self, node: TrieNode, prefix: str, candidates: List):
        for s, count in node.sentences.items():
            candidates.append((s, count))
        for char, child in node.children.items():
            self._collect(child, prefix + char, candidates)
```

## Explanation
The AutocompleteSystem uses a Trie to store sentences and their frequencies. Each TrieNode has children for characters and a dictionary of sentences with their counts.

In `__init__`, we build the trie with the given sentences and times.

The `input` method handles each character input. If it's '#', we insert the current sentence into the trie and reset. Otherwise, we move to the next node in the trie. Then, we collect all sentences under the current node, sort them by frequency descending and lexicographical order ascending, and return the top 3.

The `_collect` method recursively gathers all sentences from the subtree.

Time complexity: Building trie O(N*L), where N is number of sentences, L is average length. Input: O(L + M log M), where M is number of sentences under prefix.

Space complexity: O(N*L) for the trie.
