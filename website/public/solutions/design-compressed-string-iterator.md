# Design Compressed String Iterator

## Problem Description
Design and implement a data structure for a compressed string iterator. The given compressed string will be in the form of each letter followed by a positive integer representing the number of this letter existing in the original uncompressed string.

Implement the StringIterator class:

StringIterator(string s) Initializes the object with the compressed string s.
char next() Returns the next letter of the uncompressed string. It is guaranteed that there will always be a next letter when this method is called.
boolean hasNext() Returns true if there is any letter left to uncompressed in the string, otherwise, it returns false.

Example:

Input
["StringIterator","next","next","next","next","next","next","hasNext","next","hasNext"]
[["L1e2t1C1o1d1e1"],[],[],[],[],[],[],[],[],[]]
Output
[null,"L","e","e","t","C","o",true,"d",true]

Explanation
StringIterator stringIterator = new StringIterator("L1e2t1C1o1d1e1");
stringIterator.next(); // return "L"
stringIterator.next(); // return "e"
stringIterator.next(); // return "e"
stringIterator.next(); // return "t"
stringIterator.next(); // return "C"
stringIterator.next(); // return "o"
stringIterator.hasNext(); // return True
stringIterator.next(); // return "d"
stringIterator.hasNext(); // return True

Constraints:

1 <= compressedString.length <= 1000
compressedString consists of lower and upper case English letters and digits.
The number after a letter will be in the range [1,10^9].
It is guaranteed that the uncompressed string will have more than 0 letters.
At most 100 calls will be made to next and hasNext.

## Solution

```python
# Python solution
class StringIterator:

    def __init__(self, compressedString: str):
        self.data = []
        i = 0
        while i < len(compressedString):
            char = compressedString[i]
            i += 1
            num = 0
            while i < len(compressedString) and compressedString[i].isdigit():
                num = num * 10 + int(compressedString[i])
                i += 1
            self.data.append((char, num))
        self.index = 0
        self.count = 0

    def next(self) -> str:
        if not self.hasNext():
            return ' '
        if self.count == 0:
            self.count = self.data[self.index][1]
        self.count -= 1
        char = self.data[self.index][0]
        if self.count == 0:
            self.index += 1
        return char

    def hasNext(self) -> bool:
        return self.index < len(self.data) or self.count > 0
```

## Explanation
We parse the compressed string into a list of (character, count) pairs.

Keep an index for the current pair and a count for remaining in current pair.

- `next()`: If count == 0, set to current pair's count, decrement, return char, if count == 0, move to next index.
- `hasNext()`: True if index < len or count > 0.

Time complexity: Parsing O(n), each next O(1).
Space complexity: O(number of groups).
