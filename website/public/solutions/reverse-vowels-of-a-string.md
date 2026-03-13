# Reverse Vowels of a String

## LeetCode Link

[Reverse Vowels of a String - LeetCode](https://leetcode.com/problems/reverse-vowels-of-a-string/)

---

## Problem Description

Given a string `s`, reverse only all the vowels in the string and return it.

The vowels are 'a', 'e', 'i', 'o', and 'u', and they can appear in both lower and upper cases.

---

## Examples

### Example 1

**Input:**
```python
s = "IceCreAm"
```

**Output:**
```python
"AceCreIm"
```

**Explanation:**
The vowels in `s` are `['I', 'e', 'e', 'A']`. On reversing the vowels, `s` becomes `"AceCreIm"`.

### Example 2

**Input:**
```python
s = "leetcode"
```

**Output:**
```python
"leotcede"
```

**Explanation:**
The vowels in `s` are `['e', 'e', 'o', 'e']`. Reversing them gives `['e', 'o', 'e', 'e']`.

---

## Constraints

- `1 <= s.length <= 3 * 10^5`
- `s` consists of printable ASCII characters.

---

## Pattern: Two Pointers with Character Set

This problem uses **Two Pointers** from both ends. Skip non-vowels, swap when both pointers find vowels.

---

## Intuition

The key insight is using two pointers approaching from each end, finding vowels and swapping them while leaving consonants in place.

### Key Observations

1. **Two Pointer Approach**: Use left and right pointers moving toward each other.

2. **Vowel Set**: Create a set for O(1) lookup of vowels (both cases).

3. **Selective Swap**: Only swap when both pointers point to vowels.

4. **String Immutability**: Convert string to list, modify, then join back.

### Algorithm Overview

1. Convert string to list (for mutability)
2. Create vowel set for O(1) lookup
3. Use two pointers: left from start, right from end
4. Skip non-vowels, swap vowels when both found
5. Return joined list as string

---

## Multiple Approaches with Code

We'll cover two approaches:

1. **Two Pointers (Optimal)** - Standard solution
2. **Stack-Based** - Alternative approach

---

## Approach 1: Two Pointers (Optimal)

### Algorithm Steps

1. Convert string to list for in-place modification
2. Create vowel set
3. Use left and right pointers
4. Skip non-vowels, swap vowels when both found
5. Join list back to string

### Code Implementation

````carousel
```python
class Solution:
    def reverseVowels(self, s: str) -> str:
        """
        Reverse vowels in a string using two pointers.
        
        Args:
            s: Input string
            
        Returns:
            String with vowels reversed
        """
        vowels = set('aeiouAEIOU')
        s_list = list(s)
        left, right = 0, len(s_list) - 1
        
        while left < right:
            # Move left pointer to find vowel
            if s_list[left] not in vowels:
                left += 1
                continue
            
            # Move right pointer to find vowel
            if s_list[right] not in vowels:
                right -= 1
                continue
            
            # Swap vowels
            s_list[left], s_list[right] = s_list[right], s_list[left]
            left += 1
            right -= 1
        
        return ''.join(s_list)
```

<!-- slide -->
```cpp
#include <string>
#include <unordered_set>
using namespace std;

class Solution {
public:
    string reverseVowels(string s) {
        unordered_set<char> vowels = {'a', 'e', 'i', 'o', 'u', 
                                       'A', 'E', 'I', 'O', 'U'};
        int left = 0, right = s.length() - 1;
        
        while (left < right) {
            while (left < right && vowels.find(s[left]) == vowels.end()) {
                left++;
            }
            while (left < right && vowels.find(s[right]) == vowels.end()) {
                right--;
            }
            swap(s[left], s[right]);
            left++;
            right--;
        }
        
        return s;
    }
};
```

<!-- slide -->
```java
class Solution {
    public String reverseVowels(String s) {
        Set<Character> vowels = new HashSet<>();
        for (char c : "aeiouAEIOU".toCharArray()) {
            vowels.add(c);
        }
        
        char[] arr = s.toCharArray();
        int left = 0, right = arr.length - 1;
        
        while (left < right) {
            while (left < right && !vowels.contains(arr[left])) {
                left++;
            }
            while (left < right && !vowels.contains(arr[right])) {
                right--;
            }
            char temp = arr[left];
            arr[left] = arr[right];
            arr[right] = temp;
            left++;
            right--;
        }
        
        return new String(arr);
    }
}
```

<!-- slide -->
```javascript
/**
 * @param {string} s
 * @return {string}
 */
var reverseVowels = function(s) {
    const vowels = new Set(['a', 'e', 'i', 'o', 'u', 'A', 'E', 'I', 'O', 'U']);
    const arr = s.split('');
    let left = 0, right = arr.length - 1;
    
    while (left < right) {
        while (left < right && !vowels.has(arr[left])) {
            left++;
        }
        while (left < right && !vowels.has(arr[right])) {
            right--;
        }
        [arr[left], arr[right]] = [arr[right], arr[left]];
        left++;
        right--;
    }
    
    return arr.join('');
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) - Single pass through string |
| **Space** | O(n) - For the character list |

---

## Approach 2: Stack-Based

### Algorithm Steps

1. First pass: collect all vowels in a stack
2. Second pass: replace vowels with stack.pop()

### Code Implementation

````carousel
```python
class Solution:
    def reverseVowels(self, s: str) -> str:
        vowels = set('aeiouAEIOU')
        stack = [c for c in s if c in vowels]
        result = []
        for c in s:
            if c in vowels:
                result.append(stack.pop())
            else:
                result.append(c)
        return ''.join(result)
```

<!-- slide -->
```cpp
#include <string>
#include <unordered_set>
#include <stack>
using namespace std;

class Solution {
public:
    string reverseVowels(string s) {
        unordered_set<char> vowels = {'a', 'e', 'i', 'o', 'u', 
                                       'A', 'E', 'I', 'O', 'U'};
        stack<char> st;
        for (char c : s) {
            if (vowels.count(c)) st.push(c);
        }
        for (char& c : s) {
            if (vowels.count(c)) {
                c = st.top();
                st.pop();
            }
        }
        return s;
    }
};
```

<!-- slide -->
```java
class Solution {
    public String reverseVowels(String s) {
        Set<Character> vowels = new HashSet<>();
        for (char c : "aeiouAEIOU".toCharArray()) {
            vowels.add(c);
        }
        Stack<Character> stack = new Stack<>();
        for (char c : s.toCharArray()) {
            if (vowels.contains(c)) stack.push(c);
        }
        StringBuilder sb = new StringBuilder();
        for (char c : s.toCharArray()) {
            if (vowels.contains(c)) {
                sb.append(stack.pop());
            } else {
                sb.append(c);
            }
        }
        return sb.toString();
    }
}
```

<!-- slide -->
```javascript
var reverseVowels = function(s) {
    const vowels = new Set(['a', 'e', 'i', 'o', 'u', 'A', 'E', 'I', 'O', 'U']);
    const stack = [];
    for (const c of s) {
        if (vowels.has(c)) stack.push(c);
    }
    let result = '';
    for (const c of s) {
        if (vowels.has(c)) {
            result += stack.pop();
        } else {
            result += c;
        }
    }
    return result;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) - Two passes |
| **Space** | O(n) - For stack |

---

## Comparison of Approaches

| Aspect | Two Pointers | Stack-Based |
|--------|--------------|-------------|
| **Time Complexity** | O(n) | O(n) |
| **Space Complexity** | O(n) | O(n) |
| **Implementation** | Simple | Simple |
| **LeetCode Optimal** | ✅ | ✅ |

**Best Approach:** Use Approach 1 (Two Pointers) as it's more intuitive.

---

## Why This Problem is Important

### Interview Relevance

- **Frequency**: Commonly asked in interviews
- **Companies**: Google, Meta, Amazon
- **Difficulty**: Easy
- **Concepts Tested**: Two Pointers, String Manipulation

### Learning Outcomes

1. **Two Pointers**: Master the two-pointer technique
2. **Set Lookup**: Efficient vowel checking
3. **String Handling**: String immutability in Python

---

## Related Problems

### Related Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Reverse String | [Link](https://leetcode.com/problems/reverse-string/) | Similar two pointers |
| Valid Palindrome | [Link](https://leetcode.com/problems/valid-palindrome/) | Two pointers |
| Valid Palindrome II | [Link](https://leetcode.com/problems/valid-palindrome-ii/) | Extension |

---

## Video Tutorial Links

### Recommended Tutorials

1. **[NeetCode - Reverse Vowels](https://www.youtube.com/watch?v=8grsX-cB0jU)** - Clear explanation

---

## Follow-up Questions

### Q1: Can you do it in-place without extra space?

**Answer:** Only by modifying the string as a list in-place (O(n) space). True O(1) space isn't possible in most languages due to string immutability.

---

### Q2: How would you handle Unicode?

**Answer:** Use Unicode-aware vowel detection. The current solution works for ASCII.

---

### Q3: What if we only wanted to reverse consonants?

**Answer:** Same approach, just change the character set.

---

## Common Pitfalls

### 1. Vowel Set
**Issue**: Use set('aeiouAEIOU') for O(1) lookup.

**Solution**: Create a set or use `in` with a string.

### 2. String Immutability
**Issue**: Strings are immutable in Python.

**Solution**: Convert to list, modify, join back.

### 3. Both Pointers Move
**Issue**: After swap, both left and right pointers must advance.

**Solution**: Always increment/decrement both pointers after swap.

---

## Summary

The **Reverse Vowels of a String** problem demonstrates the **Two Pointers** technique.

Key takeaways:
1. Use two pointers from both ends
2. Skip non-vowels, swap vowels
3. Handle string immutability by converting to list
4. O(n) time and O(n) space

This problem is a classic example of the two-pointer pattern for string manipulation.

### Pattern Summary

This problem exemplifies the **Two Pointers** pattern:
- Pointers moving toward each other
- Conditional swapping based on character properties
- Single pass through data

---

## Additional Resources

- [LeetCode Problem 345](https://leetcode.com/problems/reverse-vowels-of-a-string/) - Official problem page
- [Two Pointers - GeeksforGeeks](https://www.geeksforgeeks.org/two-pointer-technique/) - Detailed explanation
