# Design A Text Editor

## Problem Description

Design a text editor with a cursor that can do the following:

- Add text to where the cursor is.
- Delete text from where the cursor is (simulating the backspace key).
- Move the cursor either left or right.

When deleting text, only characters to the left of the cursor will be deleted. The cursor will also remain within the actual text and cannot be moved beyond it. More formally, we have that 0 <= cursor.position <= currentText.length always holds.

Implement the TextEditor class:

- `TextEditor()` Initializes the object with empty text.
- `void addText(string text)` Appends text to where the cursor is. The cursor ends to the right of text.
- `int deleteText(int k)` Deletes k characters to the left of the cursor. Returns the number of characters actually deleted.
- `string cursorLeft(int k)` Moves the cursor to the left k times. Returns the last min(10, len) characters to the left of the cursor, where len is the number of characters to the left of the cursor.
- `string cursorRight(int k)` Moves the cursor to the right k times. Returns the last min(10, len) characters to the left of the cursor, where len is the number of characters to the left of the cursor.

**Link to problem:** [Design A Text Editor - LeetCode 1670](https://leetcode.com/problems/design-a-text-editor/)

---

## Examples

**Example 1:**

**Input:**
```python
["TextEditor", "addText", "deleteText", "addText", "cursorRight", "cursorLeft", "deleteText", "cursorLeft", "cursorRight"]
[[], ["leetcode"], [4], ["practice"], [3], [8], [10], [2], [6]]
```

**Output:**
```python
[null, null, 4, null, "etpractice", "leet", 4, "", "practi"]
```

---

## Constraints

- `1 <= text.length, k <= 40`
- `text` consists of lowercase English letters.
- At most `2 * 10^4` calls in total will be made to addText, deleteText, cursorLeft and cursorRight.

---

## Pattern: Two-Stack/Deque Simulator (Cursor-Based Text Editing)

This problem uses the **Two Deques** pattern to simulate a text editor with a cursor. The left deque represents text before the cursor, and the right deque represents text after the cursor. Cursor movements transfer characters between the two deques.

### Core Concept

- **Two Deques**: Use one deque for text left of cursor, another for text right of cursor
- **Cursor Position**: The boundary between the two deques represents the cursor position
- **Efficient Operations**: All operations can be performed in O(k) time where k is the parameter

### When to Use This Pattern

This pattern is applicable when:
1. Simulating cursor-based text editing operations
2. Implementing undo/redo functionality
3. Managing a position boundary between two collections

---

## Intuition

The key insight for this problem is understanding how a text editor cursor works:

1. **Cursor as a Boundary**: The cursor divides the text into two parts - everything to the left of the cursor and everything to the right.

2. **Two-Stack Approach**: We can use two deques (or stacks) to represent these two parts:
   - `left`: Characters to the left of the cursor (in order)
   - `right`: Characters to the right of the cursor (in order)

3. **Operation Simulation**:
   - `addText`: Simply append characters to the `left` deque
   - `deleteText`: Pop characters from the `left` deque
   - `cursorLeft`: Move characters from `left` to `right` (pop from left, append to right)
   - `cursorRight`: Move characters from `right` to `left` (pop from right, append to left)

4. **Retrieving Text**: The last 10 characters to the left of the cursor are always available from the `left` deque.

This approach is efficient because each character is moved at most once between the two deques during any sequence of operations.

---

## Multiple Approaches with Code

We'll cover two approaches:

1. **Two Deque Approach (Optimal)** - O(k) per operation
2. **Linked List Approach** - Alternative implementation using linked list

---

## Approach 1: Two Deque Approach (Optimal)

This is the most efficient approach using two deques to simulate the text editor.

### Why It Works

The two deque approach works because:
- The cursor position is naturally represented by the boundary between two collections
- All operations (add, delete, move) can be efficiently performed on the ends of deques
- Each character is moved at most once, giving O(k) time complexity per operation

### Code Implementation

````carousel
```python
from collections import deque

class TextEditor:
    def __init__(self):
        self.left = deque()  # Characters to the left of cursor
        self.right = deque()  # Characters to the right of cursor

    def addText(self, text: str) -> None:
        """
        Appends text to where the cursor is.
        
        Args:
            text: The text to append
        """
        for char in text:
            self.left.append(char)

    def deleteText(self, k: int) -> int:
        """
        Deletes k characters to the left of the cursor.
        
        Args:
            k: Number of characters to delete
            
        Returns:
            Number of characters actually deleted
        """
        deleted = 0
        while self.left and deleted < k:
            self.left.pop()
            deleted += 1
        return deleted

    def cursorLeft(self, k: int) -> str:
        """
        Moves the cursor to the left k times.
        
        Args:
            k: Number of positions to move left
            
        Returns:
            Last min(10, len) characters to the left of cursor
        """
        for _ in range(k):
            if self.left:
                self.right.appendleft(self.left.pop())
        return ''.join(list(self.left)[-10:])

    def cursorRight(self, k: int) -> str:
        """
        Moves the cursor to the right k times.
        
        Args:
            k: Number of positions to move right
            
        Returns:
            Last min(10, len) characters to the left of cursor
        """
        for _ in range(k):
            if self.right:
                self.left.append(self.right.popleft())
        return ''.join(list(self.left)[-10:])
```

<!-- slide -->
```cpp
#include <deque>
#include <string>
using namespace std;

class TextEditor {
private:
    deque<char> left;  // Characters to the left of cursor
    deque<char> right;  // Characters to the right of cursor
    
public:
    TextEditor() {
        // Initialize with empty deques
    }
    
    void addText(string text) {
        for (char c : text) {
            left.push_back(c);
        }
    }
    
    int deleteText(int k) {
        int deleted = 0;
        while (!left.empty() && deleted < k) {
            left.pop_back();
            deleted++;
        }
        return deleted;
    }
    
    string cursorLeft(int k) {
        for (int i = 0; i < k && !left.empty(); i++) {
            right.push_front(left.back());
            left.pop_back();
        }
        return getLeftText();
    }
    
    string cursorRight(int k) {
        for (int i = 0; i < k && !right.empty(); i++) {
            left.push_back(right.front());
            right.pop_front();
        }
        return getLeftText();
    }
    
private:
    string getLeftText() {
        string result;
        int count = 0;
        for (auto it = left.rbegin(); it != left.rend() && count < 10; ++it, count++) {
            result = *it + result;
        }
        return result;
    }
};
```

<!-- slide -->
```java
import java.util.Deque;
import java.util.LinkedList;

class TextEditor {
    private Deque<Character> left;
    private Deque<Character> right;
    
    public TextEditor() {
        left = new LinkedList<>();
        right = new LinkedList<>();
    }
    
    public void addText(String text) {
        for (char c : text.toCharArray()) {
            left.addLast(c);
        }
    }
    
    public int deleteText(int k) {
        int deleted = 0;
        while (!left.isEmpty() && deleted < k) {
            left.removeLast();
            deleted++;
        }
        return deleted;
    }
    
    public String cursorLeft(int k) {
        for (int i = 0; i < k && !left.isEmpty(); i++) {
            right.addFirst(left.removeLast());
        }
        return getLeftText();
    }
    
    public String cursorRight(int k) {
        for (int i = 0; i < k && !right.isEmpty(); i++) {
            left.addLast(right.removeFirst());
        }
        return getLeftText();
    }
    
    private String getLeftText() {
        StringBuilder sb = new StringBuilder();
        int count = 0;
        for (char c : left) {
            if (count >= 10) break;
            sb.append(c);
            count++;
        }
        return sb.toString();
    }
}
```

<!-- slide -->
```javascript
/**
 * @param {string[]} operations
 * @param {any[]} values
 */
var TextEditor = function() {
    this.left = [];
    this.right = [];
};

TextEditor.prototype.addText = function(text) {
    for (const char of text) {
        this.left.push(char);
    }
};

TextEditor.prototype.deleteText = function(k) {
    let deleted = 0;
    while (this.left.length > 0 && deleted < k) {
        this.left.pop();
        deleted++;
    }
    return deleted;
};

TextEditor.prototype.cursorLeft = function(k) {
    for (let i = 0; i < k && this.left.length > 0; i++) {
        this.right.unshift(this.left.pop());
    }
    return this.getLeftText();
};

TextEditor.prototype.cursorRight = function(k) {
    for (let i = 0; i < k && this.right.length > 0; i++) {
        this.left.push(this.right.shift());
    }
    return this.getLeftText();
};

TextEditor.prototype.getLeftText = function() {
    const len = Math.min(10, this.left.length);
    return this.left.slice(-len).join('');
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(k) per operation where k is the parameter |
| **Space** | O(n) where n is the total number of characters |

---

## Approach 2: Linked List Approach

### Algorithm Steps

1. **Create a linked list** to store all characters in the text
2. **Maintain a cursor pointer** to the current position
3. **For each operation**: traverse and modify the linked list accordingly

### Why It Works

A linked list provides O(1) insertion and deletion at any position when you have a pointer to that position. This approach simulates the text editor using a doubly linked list where each node represents a character.

### Code Implementation

````carousel
```python
class ListNode:
    def __init__(self, char):
        self.char = char
        self.prev = None
        self.next = None

class TextEditor:
    def __init__(self):
        self.head = ListNode('')  # Dummy head
        self.tail = ListNode('')  # Dummy tail
        self.head.next = self.tail
        self.tail.prev = self.head
        self.cursor = self.tail  # Cursor starts at end

    def addText(self, text: str) -> None:
        for char in text:
            new_node = ListNode(char)
            prev = self.cursor.prev
            new_node.prev = prev
            new_node.next = self.cursor
            prev.next = new_node
            self.cursor.prev = new_node

    def deleteText(self, k: int) -> int:
        deleted = 0
        node = self.cursor.prev
        while node != self.head and deleted < k:
            prev = node.prev
            prev.next = self.cursor
            self.cursor.prev = prev
            deleted += 1
            node = prev
        return deleted

    def cursorLeft(self, k: int) -> str:
        for _ in range(k):
            if self.cursor != self.tail:
                self.cursor = self.cursor.prev
        return self._getText()

    def cursorRight(self, k: int) -> str:
        for _ in range(k):
            if self.cursor != self.tail:
                self.cursor = self.cursor.next
        return self._getText()

    def _getText(self) -> str:
        result = []
        node = self.cursor.prev
        count = 0
        while node != self.head and count < 10:
            result.append(node.char)
            node = node.prev
            count += 1
        return ''.join(reversed(result))
```

<!-- slide -->
```cpp
struct ListNode {
    char ch;
    ListNode* prev;
    ListNode* next;
    ListNode(char c) : ch(c), prev(nullptr), next(nullptr) {}
};

class TextEditor {
private:
    ListNode* head;
    ListNode* tail;
    ListNode* cursor;
    
public:
    TextEditor() {
        head = new ListNode('\0');
        tail = new ListNode('\0');
        head->next = tail;
        tail->prev = head;
        cursor = tail;
    }
    
    ~TextEditor() {
        ListNode* node = head;
        while (node) {
            ListNode* next = node->next;
            delete node;
            node = next;
        }
    }
    
    void addText(string text) {
        for (char c : text) {
            ListNode* newNode = new ListNode(c);
            ListNode* prev = cursor->prev;
            newNode->prev = prev;
            newNode->next = cursor;
            prev->next = newNode;
            cursor->prev = newNode;
        }
    }
    
    int deleteText(int k) {
        int deleted = 0;
        ListNode* node = cursor->prev;
        while (node != head && deleted < k) {
            ListNode* prev = node->prev;
            prev->next = cursor;
            cursor->prev = prev;
            deleted++;
            node = prev;
        }
        return deleted;
    }
    
    string cursorLeft(int k) {
        for (int i = 0; i < k && cursor != tail; i++) {
            cursor = cursor->prev;
        }
        return getText();
    }
    
    string cursorRight(int k) {
        for (int i = 0; i < k && cursor != tail; i++) {
            cursor = cursor->next;
        }
        return getText();
    }
    
private:
    string getText() {
        string result;
        ListNode* node = cursor->prev;
        int count = 0;
        while (node != head && count < 10) {
            result = node->ch + result;
            node = node->prev;
            count++;
        }
        return result;
    }
};
```

<!-- slide -->
```java
class ListNode {
    char ch;
    ListNode prev;
    ListNode next;
    ListNode(char c) {
        this.ch = c;
    }
}

class TextEditor {
    private ListNode head;
    private ListNode tail;
    private ListNode cursor;
    
    public TextEditor() {
        head = new ListNode('\0');
        tail = new ListNode('\0');
        head.next = tail;
        tail.prev = head;
        cursor = tail;
    }
    
    public void addText(String text) {
        for (char c : text.toCharArray()) {
            ListNode newNode = new ListNode(c);
            ListNode prev = cursor.prev;
            newNode.prev = prev;
            newNode.next = cursor;
            prev.next = newNode;
            cursor.prev = newNode;
        }
    }
    
    public int deleteText(int k) {
        int deleted = 0;
        ListNode node = cursor.prev;
        while (node != head && deleted < k) {
            ListNode prev = node.prev;
            prev.next = cursor;
            cursor.prev = prev;
            deleted++;
            node = prev;
        }
        return deleted;
    }
    
    public String cursorLeft(int k) {
        for (int i = 0; i < k && cursor != tail; i++) {
            cursor = cursor.prev;
        }
        return getText();
    }
    
    public String cursorRight(int k) {
        for (int i = 0; i < k && cursor != tail; i++) {
            cursor = cursor.next;
        }
        return getText();
    }
    
    private String getText() {
        StringBuilder sb = new StringBuilder();
        ListNode node = cursor.prev;
        int count = 0;
        while (node != head && count < 10) {
            sb.insert(0, node.ch);
            node = node.prev;
            count++;
        }
        return sb.toString();
    }
}
```

<!-- slide -->
```javascript
class ListNode {
    constructor(char) {
        this.char = char;
        this.prev = null;
        this.next = null;
    }
}

class TextEditor {
    constructor() {
        this.head = new ListNode('\0');
        this.tail = new ListNode('\0');
        this.head.next = this.tail;
        this.tail.prev = this.head;
        this.cursor = this.tail;
    }
    
    addText(text) {
        for (const char of text) {
            const newNode = new ListNode(char);
            const prev = this.cursor.prev;
            newNode.prev = prev;
            newNode.next = this.cursor;
            prev.next = newNode;
            this.cursor.prev = newNode;
        }
    }
    
    deleteText(k) {
        let deleted = 0;
        let node = this.cursor.prev;
        while (node !== this.head && deleted < k) {
            const prev = node.prev;
            prev.next = this.cursor;
            this.cursor.prev = prev;
            deleted++;
            node = prev;
        }
        return deleted;
    }
    
    cursorLeft(k) {
        for (let i = 0; i < k && this.cursor !== this.tail; i++) {
            this.cursor = this.cursor.prev;
        }
        return this.getText();
    }
    
    cursorRight(k) {
        for (let i = 0; i < k && this.cursor !== this.tail; i++) {
            this.cursor = this.cursor.next;
        }
        return this.getText();
    }
    
    getText() {
        const result = [];
        let node = this.cursor.prev;
        let count = 0;
        while (node !== this.head && count < 10) {
            result.unshift(node.char);
            node = node.prev;
            count++;
        }
        return result.join('');
    }
}
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(k) per operation |
| **Space** | O(n) for the linked list nodes |

---

## Comparison of Approaches

| Aspect | Two Deque | Linked List |
|--------|-----------|-------------|
| **Time Complexity** | O(k) | O(k) |
| **Space Complexity** | O(n) | O(n) |
| **Implementation** | Simple | More complex |
| **Memory Overhead** | Lower | Higher (node objects) |

**Best Approach:** The Two Deque approach (Approach 1) is optimal and recommended for interviews.

---

## Why This Problem is Important

### Interview Relevance

- **Frequency**: Occasionally asked in technical interviews
- **Companies**: Google, Meta, Amazon
- **Difficulty**: Medium
- **Concepts Tested**: Data structure design, Deque/Stack operations, Cursor simulation

### Learning Outcomes

1. **Deque/Stack Operations**: Master efficient end-of-collection operations
2. **Cursor Simulation**: Learn to simulate position-based operations
3. **Design Patterns**: Understand two-collection boundary pattern
4. **Edge Cases**: Handle cursor at boundaries (start/end of text)

---

## Related Problems

### Similar Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Design Browser History | [Link](https://leetcode.com/problems/design-browser-history/) | Similar cursor-based navigation |
| LRU Cache | [Link](https://leetcode.com/problems/lru-cache/) | Two-list pattern |
| Min Stack | [Link](https://leetcode.com/problems/min-stack/) | Stack design |
| Max Stack | [Link](https://leetcode.com/problems/max-stack/) | Extended stack design |

---

## Video Tutorial Links

### Recommended Tutorials

1. **[NeetCode - Design A Text Editor](https://www.youtube.com/watch?v=XuKhk-Nacky)** - Clear explanation with visual examples
2. **[Design Text Editor - LeetCode 1670](https://www.youtube.com/watch?v=5Linky5D3-GU)** - Detailed walkthrough
3. **[Two Deque Pattern](https://www.youtube.com/watch?v=6h7Glr1D9fI)** - Understanding the deque pattern

---

## Follow-up Questions

### Q1: How would you implement an undo feature for this text editor?

**Answer:** You could maintain a stack of operations. Before each operation, push the current state or the reverse operation onto the undo stack. When undo is called, pop from the undo stack and reverse the operation.

---

### Q2: How would you modify the solution to handle Unicode characters?

**Answer:** The deque approach already handles Unicode since it works with character strings. For the linked list approach, ensure you're using proper Unicode-aware string handling in your language.

---

### Q3: What changes would be needed to return the full text instead of just 10 characters?

**Answer:** Simply remove the slicing/limiting logic in the cursorLeft and cursorRight methods. Instead of `return ''.join(list(self.left)[-10:])`, use `return ''.join(list(self.left))`.

---

### Q4: How would you implement a word-wrap feature in this editor?

**Answer:** You would need to track character count per line and break at word boundaries. This adds complexity as you need to maintain line information and handle cursor movements across lines.

---

### Q5: Can you implement this using only one deque?

**Answer:** Yes, but it would be less efficient. You could use a single deque and maintain an index for the cursor position, but all operations would require shifting elements, resulting in O(n) time complexity.

---

## Common Pitfalls

### 1. Not Handling Empty Deques
**Issue**: Trying to pop from an empty left deque in cursorLeft operation.

**Solution**: Always check `if self.left:` before popping.

### 2. Confusing Left and Right Directions
**Issue**: Moving characters in the wrong direction during cursor operations.

**Solution**: Remember that `cursorLeft` moves characters from left deque to right deque, and `cursorRight` does the opposite.

### 3. Returning Wrong Characters
**Issue**: Returning the first 10 characters instead of the last 10.

**Solution**: Use negative indexing in Python: `list(self.left)[-10:]` or iterate from the end.

### 4. Forgetting Cursor Boundary
**Issue**: Moving cursor beyond the text boundaries.

**Solution**: Always check if the deque is non-empty before moving the cursor.

### 5. Inefficient String Building
**Issue**: Creating new strings in each operation unnecessarily.

**Solution**: Convert deque to list once and slice, or use a list builder and join at the end.

---

## Summary

The **Design A Text Editor** problem demonstrates the power of the **Two Deque** pattern for simulating cursor-based operations:

- **Two Deque Approach**: Optimal solution using O(k) per operation
- **Linked List Approach**: Alternative with similar complexity
- **Key Insight**: The cursor is the boundary between two collections

Key takeaways:
1. Use two deques to represent text before and after the cursor
2. Each operation can be performed in O(k) time
3. The cursor position is the boundary between the two deques
4. Always handle boundary conditions (empty deques)

This problem is excellent for learning data structure design and is frequently asked in technical interviews to test your ability to design efficient systems.

---

## Additional Resources

- [LeetCode Problem 1670](https://leetcode.com/problems/design-a-text-editor/) - Official problem page
- [Deque Documentation - Python](https://docs.python.org/3/library/collections.html#collections.deque) - Python deque usage
- [Linked List Data Structure](https://en.wikipedia.org/wiki/Linked_list) - Linked list fundamentals
