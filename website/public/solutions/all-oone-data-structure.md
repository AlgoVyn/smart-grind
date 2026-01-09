# All Oone Data Structure

## Problem Description
Design a data structure to store the strings' count with the ability to return the strings with minimum and maximum counts.
Implement the AllOne class:

AllOne() Initializes the object of the data structure.
inc(String key) Increments the count of the string key by 1. If key does not exist in the data structure, insert it with count 1.
dec(String key) Decrements the count of the string key by 1. If the count of key is 0 after the decrement, remove it from the data structure. It is guaranteed that key exists in the data structure before the decrement.
getMaxKey() Returns one of the keys with the maximal count. If no element exists, return an empty string "".
getMinKey() Returns one of the keys with the minimum count. If no element exists, return an empty string "".

Note that each function must run in O(1) average time complexity.
 
Example 1:

Input
["AllOne", "inc", "inc", "getMaxKey", "getMinKey", "inc", "getMaxKey", "getMinKey"]
[[], ["hello"], ["hello"], [], [], ["leet"], [], []]
Output
[null, null, null, "hello", "hello", null, "hello", "leet"]

Explanation
AllOne allOne = new AllOne();
allOne.inc("hello");
allOne.inc("hello");
allOne.getMaxKey(); // return "hello"
allOne.getMinKey(); // return "hello"
allOne.inc("leet");
allOne.getMaxKey(); // return "hello"
allOne.getMinKey(); // return "leet"

 
Constraints:

1 <= key.length <= 10
key consists of lowercase English letters.
It is guaranteed that for each call to dec, key is existing in the data structure.
At most 5 * 104 calls will be made to inc, dec, getMaxKey, and getMinKey.
## Solution

```python
from collections import defaultdict

class Node:
    def __init__(self, freq):
        self.freq = freq
        self.keys = set()
        self.prev = None
        self.next = None

class AllOne:
    def __init__(self):
        self.head = Node(0)  # dummy head
        self.tail = Node(0)  # dummy tail
        self.head.next = self.tail
        self.tail.prev = self.head
        self.key_freq = {}  # key -> freq
        self.freq_node = {}  # freq -> node

    def _remove_bucket(self, node):
        node.prev.next = node.next
        node.next.prev = node.prev
        del self.freq_node[node.freq]

    def _add_bucket_after(self, node, new_node):
        new_node.next = node.next
        new_node.prev = node
        node.next.prev = new_node
        node.next = new_node
        self.freq_node[new_node.freq] = new_node

    def inc(self, key: str) -> None:
        if key not in self.key_freq:
            self.key_freq[key] = 0
        freq = self.key_freq[key]
        self.key_freq[key] += 1
        new_freq = self.key_freq[key]
        
        if freq > 0:
            bucket = self.freq_node[freq]
            bucket.keys.remove(key)
            if not bucket.keys:
                self._remove_bucket(bucket)
        
        if new_freq not in self.freq_node:
            new_bucket = Node(new_freq)
            if freq == 0:
                self._add_bucket_after(self.head, new_bucket)
            else:
                prev_bucket = self.freq_node.get(freq, self.head)
                self._add_bucket_after(prev_bucket, new_bucket)
        
        self.freq_node[new_freq].keys.add(key)

    def dec(self, key: str) -> None:
        if key not in self.key_freq:
            return
        freq = self.key_freq[key]
        bucket = self.freq_node[freq]
        bucket.keys.remove(key)
        if not bucket.keys:
            self._remove_bucket(bucket)
        
        if freq == 1:
            del self.key_freq[key]
        else:
            self.key_freq[key] -= 1
            new_freq = self.key_freq[key]
            if new_freq not in self.freq_node:
                new_bucket = Node(new_freq)
                next_bucket = self.freq_node.get(freq, self.tail)
                self._add_bucket_after(next_bucket.prev, new_bucket)
            self.freq_node[new_freq].keys.add(key)

    def getMaxKey(self) -> str:
        if self.head.next == self.tail:
            return ""
        return next(iter(self.tail.prev.keys))

    def getMinKey(self) -> str:
        if self.head.next == self.tail:
            return ""
        return next(iter(self.head.next.keys))
```

## Explanation

This problem requires implementing a data structure that supports incrementing and decrementing key frequencies, and retrieving the keys with maximum and minimum frequencies, all in O(1) time complexity.

We use a doubly linked list where each node (bucket) represents a frequency and contains a set of keys with that frequency. The linked list is ordered by frequency, with the head being the lowest frequency and the tail the highest. Dummy head and tail nodes simplify boundary operations.

A dictionary `key_freq` maps each key to its current frequency. Another dictionary `freq_node` maps frequencies to their corresponding bucket nodes.

For the `inc` operation: Retrieve the current frequency, increment it, remove the key from the old bucket (and delete the bucket if empty), then add the key to the new frequency bucket, creating it if necessary.

For the `dec` operation: Decrement the frequency, remove from old bucket, add to new lower frequency bucket, or delete the key if frequency reaches zero.

For `getMaxKey` and `getMinKey`: Return any key from the tail (highest frequency) or head.next (lowest frequency) bucket, or an empty string if no keys exist.

This design ensures all operations are O(1) on average due to the use of hash maps and sets. Space complexity is O(N), where N is the number of keys, as we store each key in the frequency map and in the sets.
