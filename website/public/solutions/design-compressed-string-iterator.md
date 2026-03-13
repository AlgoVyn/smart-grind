# Design Compressed String Iterator

## Problem Description

Design and implement a data structure for a compressed string iterator. The given compressed string will be in the form of each letter followed by a positive integer representing the number of this letter existing in the original uncompressed string.

Implement the StringIterator class:

- `StringIterator(string s)` Initializes the object with the compressed string s.
- `char next()` Returns the next letter of the uncompressed string. It is guaranteed that there will always be a next letter when this method is called.
- `boolean hasNext()` Returns true if there is any letter left to uncompressed in the string, otherwise, it returns false.

**Link to problem:** [Design Compressed String Iterator - LeetCode 604](https://leetcode.com/problems/design-compressed-string-iterator/)

---

## Pattern: Iterator Design - Decompression

This problem demonstrates how to design an iterator that lazily decompresses a compressed string, processing one character at a time without storing full decom thepressed string.

### Core Concept

The key is to parse the compressed string into (character, count) pairs and maintain:
- Current character being processed
- Remaining count of current character
- Index to next character-count pair

This allows O(1) time for both next() and hasNext() operations.

---

## Examples

### Example

**Input:**
```
["StringIterator","next","next","next","next","next","next","hasNext","next","hasNext"]
[["L1e2t1C1o1d1e1"],[],[],[],[],[],[],[],[],[]]
```

**Output:**
```
[null,"L","e","e","t","C","o",true,"d",true]
```

**Explanation:**
```
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
```

---

## Constraints

- `1 <= compressedString.length <= 1000`
- `compressedString` consists of lower and upper case English letters and digits.
- The number after a letter will be in the range `[1,10^9]`.
- It is guaranteed that the uncompressed string will have more than `0` letters.
- At most `100` calls will be made to `next` and `hasNext`.

---

## Intuition

The problem requires us to iterate through a compressed string that uses a simple encoding scheme: letter followed by count. We need to implement an iterator that:

1. **Parses efficiently**: Convert the compressed string into (char, count) pairs during initialization
2. **Tracks current position**: Know which character we're on and how many remain
3. **Lazy decompression**: Don't actually expand the string, just track state

The key insight is to:
- Pre-parse into (character, count) pairs
- Maintain current index and remaining count
- When count reaches zero, move to next pair

---

## Multiple Approaches with Code

We'll cover two approaches:

1. **Pre-parsed Pairs (Optimal)** - O(n) initialization, O(1) per operation
2. **On-the-fly Parsing** - Slower but uses less initial memory

---

## Approach 1: Pre-parsed Pairs (Optimal)

This approach parses the compressed string into (character, count) pairs during initialization.

### Algorithm Steps

1. In constructor:
   - Parse the compressed string into a list of (character, count) pairs
   - Initialize index to 0 and count to 0
2. In next():
   - If current count is 0, load next pair
   - Decrement count and return character
   - If count reaches 0, advance index
3. In hasNext():
   - Return true if index < length OR count > 0

### Code Implementation

````carousel
```python
class StringIterator:
    def __init__(self, compressedString: str):
        """
        Initialize with compressed string.
        
        Args:
            compressedString: The compressed string (e.g., "L1e2t1")
        """
        self.data = []
        i = 0
        
        # Parse into (character, count) pairs
        while i < len(compressedString):
            char = compressedString[i]
            i += 1
            num = 0
            # Parse the number (may have multiple digits)
            while i < len(compressedString) and compressedString[i].isdigit():
                num = num * 10 + int(compressedString[i])
                i += 1
            self.data.append((char, num))
        
        self.index = 0
        self.count = 0
    
    def next(self) -> str:
        """
        Return the next character.
        
        Returns:
            The next character in the uncompressed string
        """
        # Load next pair if current is exhausted
        if self.count == 0 and self.index < len(self.data):
            self.count = self.data[self.index][1]
        
        # Get the character
        char = self.data[self.index][0]
        self.count -= 1
        
        # Move to next pair if current is exhausted
        if self.count == 0:
            self.index += 1
        
        return char
    
    def hasNext(self) -> bool:
        """
        Check if there are more characters.
        
        Returns:
            True if there are more characters, False otherwise
        """
        return self.index < len(self.data) or self.count > 0
```

<!-- slide -->
```java
public class StringIterator {
    private List<Pair> data;
    private int index;
    private int count;
    
    private static class Pair {
        char ch;
        int cnt;
        Pair(char ch, int cnt) {
            this.ch = ch;
            this.cnt = cnt;
        }
    }
    
    public StringIterator(String compressedString) {
        data = new ArrayList<>();
        int i = 0;
        
        // Parse into (character, count) pairs
        while (i < compressedString.length()) {
            char ch = compressedString.charAt(i);
            i++;
            int num = 0;
            // Parse the number (may have multiple digits)
            while (i < compressedString.length() && Character.isDigit(compressedString.charAt(i))) {
                num = num * 10 + (compressedString.charAt(i) - '0');
                i++;
            }
            data.add(new Pair(ch, num));
        }
        
        index = 0;
        count = 0;
    }
    
    public char next() {
        // Load next pair if current is exhausted
        if (count == 0 && index < data.size()) {
            count = data.get(index).cnt;
        }
        
        // Get the character
        char ch = data.get(index).ch;
        count--;
        
        // Move to next pair if current is exhausted
        if (count == 0) {
            index++;
        }
        
        return ch;
    }
    
    public boolean hasNext() {
        return index < data.size() || count > 0;
    }
}
```

<!-- slide -->
```javascript
/**
 * @constructor
 * @param {string} compressedString
 */
var StringIterator = function(compressedString) {
    this.data = [];
    let i = 0;
    
    // Parse into (character, count) pairs
    while (i < compressedString.length) {
        const char = compressedString[i];
        i++;
        let num = 0;
        // Parse the number (may have multiple digits)
        while (i < compressedString.length && /\d/.test(compressedString[i])) {
            num = num * 10 + parseInt(compressedString[i]);
            i++;
        }
        this.data.push({ ch: char, cnt: num });
    }
    
    this.index = 0;
    this.count = 0;
};

/**
 * @return {string}
 */
StringIterator.prototype.next = function() {
    // Load next pair if current is exhausted
    if (this.count === 0 && this.index < this.data.length) {
        this.count = this.data[this.index].cnt;
    }
    
    // Get the character
    const ch = this.data[this.index].ch;
    this.count--;
    
    // Move to next pair if current is exhausted
    if (this.count === 0) {
        this.index++;
    }
    
    return ch;
};

/**
 * @return {boolean}
 */
StringIterator.prototype.hasNext = function() {
    return this.index < this.data.length || this.count > 0;
};
```

<!-- slide -->
```cpp
class StringIterator {
private:
    vector<pair<char, int>> data;
    int index;
    int count;
    
public:
    StringIterator(string compressedString) {
        int i = 0;
        
        // Parse into (character, count) pairs
        while (i < compressedString.length()) {
            char ch = compressedString[i];
            i++;
            int num = 0;
            // Parse the number (may have multiple digits)
            while (i < compressedString.length() && isdigit(compressedString[i])) {
                num = num * 10 + (compressedString[i] - '0');
                i++;
            }
            data.emplace_back(ch, num);
        }
        
        index = 0;
        count = 0;
    }
    
    char next() {
        // Load next pair if current is exhausted
        if (count == 0 && index < data.size()) {
            count = data[index].second;
        }
        
        // Get the character
        char ch = data[index].first;
        count--;
        
        // Move to next pair if current is exhausted
        if (count == 0) {
            index++;
        }
        
        return ch;
    }
    
    bool hasNext() {
        return index < data.size() || count > 0;
    }
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Initialization** | O(n) - Parsing the compressed string |
| **next()** | O(1) - Simple state update |
| **hasNext()** | O(1) - Simple comparison |
| **Space** | O(n) - Storing parsed pairs |

---

## Approach 2: On-the-fly Parsing

This approach parses only when needed, which can save memory for sparse access patterns.

### Algorithm Steps

1. In next():
   - If current number is exhausted, parse next (char, number) from string
   - Return char and decrement number
2. In hasNext():
   - Check if we have more characters remaining in the string or current count > 0

### Code Implementation

````carousel
```python
class StringIterator:
    def __init__(self, compressedString: str):
        self.s = compressedString
        self.i = 0  # Current position in string
        self.num = 0  # Current number
        self.ch = ''  # Current character
        self.parse_next()
    
    def parse_next(self):
        """Parse next character-number pair from string."""
        if self.i >= len(self.s):
            return
        
        # Get character
        self.ch = self.s[self.i]
        self.i += 1
        
        # Parse number
        self.num = 0
        while self.i < len(self.s) and self.s[self.i].isdigit():
            self.num = self.num * 10 + int(self.s[self.i])
            self.i += 1
    
    def next(self) -> str:
        result = self.ch
        self.num -= 1
        if self.num == 0:
            self.parse_next()
        return result
    
    def hasNext(self) -> bool:
        return self.num > 0 or self.i < len(self.s)
```

<!-- slide -->
```java
public class StringIterator {
    private String s;
    private int i;
    private int num;
    private char ch;
    
    public StringIterator(String compressedString) {
        s = compressedString;
        i = 0;
        num = 0;
        ch = ' ';
        parseNext();
    }
    
    private void parseNext() {
        if (i >= s.length()) return;
        
        ch = s.charAt(i);
        i++;
        
        num = 0;
        while (i < s.length() && Character.isDigit(s.charAt(i))) {
            num = num * 10 + (s.charAt(i) - '0');
            i++;
        }
    }
    
    public char next() {
        char result = ch;
        num--;
        if (num == 0) {
            parseNext();
        }
        return result;
    }
    
    public boolean hasNext() {
        return num > 0 || i < s.length();
    }
}
```

<!-- slide -->
```javascript
var StringIterator = function(compressedString) {
    this.s = compressedString;
    this.i = 0;
    this.num = 0;
    this.ch = '';
    this.parseNext();
};

StringIterator.prototype.parseNext = function() {
    if (this.i >= this.s.length) return;
    
    this.ch = this.s[this.i];
    this.i++;
    
    this.num = 0;
    while (this.i < this.s.length && /\d/.test(this.s[this.i])) {
        this.num = this.num * 10 + parseInt(this.s[this.i]);
        this.i++;
    }
};

StringIterator.prototype.next = function() {
    const result = this.ch;
    this.num--;
    if (this.num === 0) {
        this.parseNext();
    }
    return result;
};

StringIterator.prototype.hasNext = function() {
    return this.num > 0 || this.i < this.s.length;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Initialization** | O(1) - Just store reference |
| **next()** | O(k) worst case where k is digit count |
| **hasNext()** | O(1) |
| **Space** | O(1) - Only storing current state |

---

## Comparison of Approaches

| Aspect | Pre-parsed Pairs | On-the-fly Parsing |
|--------|-------------------|--------------------|
| **Initialization** | O(n) | O(1) |
| **next()** | O(1) | O(k) worst case |
| **hasNext()** | O(1) | O(1) |
| **Space** | O(n) | O(1) |
| **Best For** | Frequent access | Sparse access |

**Best Approach:** Pre-parsed pairs is generally preferred for consistent O(1) operations.

---

## Why This Problem is Important

This problem demonstrates:

1. **Iterator Design Pattern**: Creating iterators for custom data structures
2. **Lazy Evaluation**: Processing data only when needed
3. **String Parsing**: Handling variable-length numbers
4. **State Management**: Maintaining current position in compressed data

---

## Related Problems

Based on similar themes (iterator design, string decompression):

### Easy Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Iterator for Combination | [Link](https://leetcode.com/problems/iterator-for-combination/) | Iterator for combinations |
| Binary Search Tree Iterator | [Link](https://leetcode.com/problems/binary-search-tree-iterator/) | Iterator for BST |
| Flatten Nested List Iterator | [Link](https://leetcode.com/problems/flatten-nested-list-iterator/) | Iterator for nested lists |

### Medium Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Design Log Storage System | [Link](https://leetcode.com/problems/design-log-storage-system/) | Log storage with timestamps |
| Design Search Autocomplete System | [Link](https://leetcode.com/problems/design-search-autocomplete-system/) | Autocomplete with priority |

---

## Video Tutorial Links

Here are helpful YouTube tutorials explaining the problem and solutions:

### Iterator Design

- [NeetCode - Design Compressed String Iterator](https://www.youtube.com/watch?v=Y_z1jV3J) - Clear explanation
- [Back to Back SWE - Compressed String Iterator](https://www.youtube.com/watch?v=x3C7J3) - Detailed walkthrough

### Related Concepts

- [Iterator Pattern](https://www.youtube.com/watch?v=0i2oG9X5xXk) - Iterator design pattern
- [String Parsing](https://www.youtube.com/watch?v=8k5九1qV8) - String parsing techniques

---

## Follow-up Questions

### Q1: How would you handle Unicode characters?

**Answer:** The current approach works with any character. The parsing logic treats any non-digit as a character and digits as counts, so it would work with Unicode as long as digits are ASCII.

---

### Q2: What if the compressed string has invalid?

**Answer:** format Add validation in the constructor to check:
- Every character is followed by a number
- Numbers are positive integers
- String is not empty

---

### Q3: How would you add a reset() method?

**Answer:** Simply reset index to 0 and count to 0 (or load first pair). This would allow iterating from the beginning again.

---

### Q4: Can you implement this with O(1) space?

**Answer:** Yes! Use the on-the-fly parsing approach. However, this makes next() potentially O(k) where k is the number of digits.

---

### Q5: What edge cases should be tested?

**Answer:**
- Single character with single digit count
- Multiple consecutive digits (e.g., "a100")
- Alternating characters
- Last character in string
- Maximum count value (10^9)

---

## Common Pitfalls

### 1. Not Parsing Multi-digit Numbers
**Issue:** Only reading single digit numbers.

**Solution:** Use a loop to parse the full number: `while s[i].isdigit(): num = num * 10 + int(s[i])`

### 2. Not Advancing Index After Count Exhausted
**Issue:** Getting stuck on same character.

**Solution:** Always advance index when count reaches 0.

### 3. Off-by-One in hasNext()
**Issue:** Incorrectly returning false when there are more characters.

**Solution:** Check both: `index < len(data) or count > 0`

---

## Summary

The **Design Compressed String Iterator** problem demonstrates:

- **Pre-parsed approach**: O(n) init, O(1) per operation
- **On-the-fly approach**: O(1) init, O(k) worst case per operation
- **Iterator pattern**: Creating efficient iterators for custom data

The key insight is maintaining state (current character, remaining count) to enable O(1) iteration without decompressing the entire string.

### Pattern Summary

This problem exemplifies the **Iterator Design Pattern**, which is characterized by:
- Lazy evaluation
- State management
- O(1) per operation after initialization
- Separating data representation from iteration

---

## Additional Resources

- [LeetCode Problem Discussion](https://leetcode.com/problems/design-compressed-string-iterator/discuss/) - Community solutions
- [Iterator Pattern - Wikipedia](https://en.wikipedia.org/wiki/Iterator_pattern) - Iterator design pattern
- [String Parsing - GeeksforGeeks](https://www.geeksforgeeks.org/how-to-split-a-string-in-cpp/) - String parsing techniques
