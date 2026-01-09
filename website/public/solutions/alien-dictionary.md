# Alien Dictionary

## Problem Description

There is a new alien language that uses the English alphabet. However, the order of the letters is unknown.

You are given a list of strings `words` from the alien dictionary. The strings in `words` are sorted lexicographically according to the alien language. Return a string representing the unique ordering of characters that is consistent with the given list of words. If there are multiple valid orderings, return any one. If no valid ordering exists, return an empty string.

## Solution

```python
from typing import List
from collections import defaultdict, deque

class Solution:
    def alienOrder(self, words: List[str]) -> str:
        # Build graph and indegree
        graph = defaultdict(list)
        indegree = {c: 0 for word in words for c in word}

        for i in range(len(words) - 1):
            w1, w2 = words[i], words[i + 1]
            min_len = min(len(w1), len(w2))
            for j in range(min_len):
                if w1[j] != w2[j]:
                    graph[w1[j]].append(w2[j])
                    indegree[w2[j]] += 1
                    break
            else:
                # If w1 is prefix of w2 and longer, invalid
                if len(w1) > len(w2):
                    return ""

        # Kahn's algorithm
        queue = deque([c for c in indegree if indegree[c] == 0])
        order = []

        while queue:
            curr = queue.popleft()
            order.append(curr)
            for nei in graph[curr]:
                indegree[nei] -= 1
                if indegree[nei] == 0:
                    queue.append(nei)

        # If not all letters are in order, cycle
        if len(order) != len(indegree):
            return ""

        return "".join(order)
```

## Explanation

To solve the Alien Dictionary problem, we need to determine the order of letters in an alien language based on a list of sorted words. This is a classic topological sorting problem where we build a graph of letter dependencies and use Kahn's algorithm (BFS-based topological sort) to find the order.

First, we initialize a graph using a defaultdict of lists to store the adjacency list and an indegree dictionary to track the number of incoming edges for each letter. We iterate through the words to find the first differing character between consecutive words, which indicates the order (earlier word's character comes before the later one's). We add an edge from the character in the earlier word to the character in the later word and increment the indegree of the latter.

We also handle the case where one word is a prefix of another; if the earlier word is longer, it's invalid, so we return an empty string.

Next, we use Kahn's algorithm: we start with a queue of characters with indegree 0. While the queue is not empty, we dequeue a character, add it to the order, and decrease the indegree of its neighbors. If a neighbor's indegree becomes 0, we enqueue it.

Finally, if the length of the order equals the number of unique letters, we return the joined order; otherwise, there's a cycle, so we return an empty string.

## Time Complexity
**O(N)**, where N is the total number of characters in all words, as we process each character a constant number of times.

## Space Complexity
**O(1)**, since there are at most 26 letters (the English alphabet).
