# Design A Text Editor

## Problem Description
Design a text editor with a cursor that can do the following:

Add text to where the cursor is.
Delete text from where the cursor is (simulating the backspace key).
Move the cursor either left or right.

When deleting text, only characters to the left of the cursor will be deleted. The cursor will also remain within the actual text and cannot be moved beyond it. More formally, we have that 0 <= cursor.position <= currentText.length always holds.
Implement the TextEditor class:

TextEditor() Initializes the object with empty text.
void addText(string text) Appends text to where the cursor is. The cursor ends to the right of text.
int deleteText(int k) Deletes k characters to the left of the cursor. Returns the number of characters actually deleted.
string cursorLeft(int k) Moves the cursor to the left k times. Returns the last min(10, len) characters to the left of the cursor, where len is the number of characters to the left of the cursor.
string cursorRight(int k) Moves the cursor to the right k times. Returns the last min(10, len) characters to the left of the cursor, where len is the number of characters to the left of the cursor.

 
Example 1:

Input
["TextEditor", "addText", "deleteText", "addText", "cursorRight", "cursorLeft", "deleteText", "cursorLeft", "cursorRight"]
[[], ["leetcode"], [4], ["practice"], [3], [8], [10], [2], [6]]
Output
[null, null, 4, null, "etpractice", "leet", 4, "", "practi"]

Explanation
TextEditor textEditor = new TextEditor(); // The current text is "|". (The '|' character represents the cursor)
textEditor.addText("leetcode"); // The current text is "leetcode|".
textEditor.deleteText(4); // return 4
                          // The current text is "leet|". 
                          // 4 characters were deleted.
textEditor.addText("practice"); // The current text is "leetpractice|". 
textEditor.cursorRight(3); // return "etpractice"
                           // The current text is "leetpractice|". 
                           // The cursor cannot be moved beyond the actual text and thus did not move.
                           // "etpractice" is the last 10 characters to the left of the cursor.
textEditor.cursorLeft(8); // return "leet"
                          // The current text is "leet|practice".
                          // "leet" is the last min(10, 4) = 4 characters to the left of the cursor.
textEditor.deleteText(10); // return 4
                           // The current text is "|practice".
                           // Only 4 characters were deleted.
textEditor.cursorLeft(2); // return ""
                          // The current text is "|practice".
                          // The cursor cannot be moved beyond the actual text and thus did not move. 
                          // "" is the last min(10, 0) = 0 characters to the left of the cursor.
textEditor.cursorRight(6); // return "practi"
                           // The current text is "practi|ce".
                           // "practi" is the last min(10, 6) = 6 characters to the left of the cursor.

 
Constraints:

1 <= text.length, k <= 40
text consists of lowercase English letters.
At most 2 * 104 calls in total will be made to addText, deleteText, cursorLeft and cursorRight.

 
Follow-up: Could you find a solution with time complexity of O(k) per call?
## Solution

```python
# Python solution
from collections import deque

class TextEditor:

    def __init__(self):
        self.left = deque()
        self.right = deque()

    def addText(self, text: str) -> None:
        for char in text:
            self.left.append(char)

    def deleteText(self, k: int) -> int:
        deleted = 0
        while self.left and deleted < k:
            self.left.pop()
            deleted += 1
        return deleted

    def cursorLeft(self, k: int) -> str:
        for _ in range(k):
            if self.left:
                self.right.appendleft(self.left.pop())
        return ''.join(list(self.left)[-10:])

    def cursorRight(self, k: int) -> str:
        for _ in range(k):
            if self.right:
                self.left.append(self.right.popleft())
        return ''.join(list(self.left)[-10:])
```

## Explanation
We use two deques: `left` for characters before the cursor (in order), `right` for characters after the cursor.

- `addText`: Append each character to `left`.
- `deleteText`: Pop from `left` up to `k` times.
- `cursorLeft`: Move up to `k` characters from `left` to `right`.
- `cursorRight`: Move up to `k` characters from `right` to `left`.
- For both cursor moves, return the last min(10, len(left)) characters from `left`.

Time complexity: Each operation is O(k) or O(1) for the return string.
Space complexity: O(total characters).
