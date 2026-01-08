# Replace Words

## Problem Description
[Link to problem](https://leetcode.com/problems/replace-words/)

In English, we have a concept called root, which can be followed by some other word to form another longer word - let's call this word derivative. For example, when the root "help" is followed by the word "ful", we can form a derivative "helpful".
Given a dictionary consisting of many roots and a sentence consisting of words separated by spaces, replace all the derivatives in the sentence with the root forming it. If a derivative can be replaced by more than one root, replace it with the root that has the shortest length.
Return the sentence after the replacement.
 
Example 1:

Input: dictionary = ["cat","bat","rat"], sentence = "the cattle was rattled by the battery"
Output: "the cat was rat by the bat"

Example 2:

Input: dictionary = ["a","b","c"], sentence = "aadsfasf absbs bbab cadsfafs"
Output: "a a b c"

 
Constraints:

1 <= dictionary.length <= 1000
1 <= dictionary[i].length <= 100
dictionary[i] consists of only lower-case letters.
1 <= sentence.length <= 106
sentence consists of only lower-case letters and spaces.
The number of words in sentence is in the range [1, 1000]
The length of each word in sentence is in the range [1, 1000]
Every two consecutive words in sentence will be separated by exactly one space.
sentence does not have leading or trailing spaces.


## Solution

```python
def replaceWords(dictionary, sentence):
    roots = set(dictionary)
    words = sentence.split()
    result = []
    for word in words:
        replacement = word
        for root in roots:
            if word.startswith(root) and len(root) < len(replacement):
                replacement = root
        result.append(replacement)
    return ' '.join(result)
```

## Explanation
This problem replaces words in a sentence with their shortest root from the dictionary if the word starts with that root.

### Step-by-Step Approach:
1. **Prepare Roots:**
   - Put dictionary into a set for O(1) lookup.

2. **Process Each Word:**
   - Split sentence into words.
   - For each word, initialize replacement as the word itself.
   - Check each root: if word starts with root and root is shorter than current replacement, update replacement.

3. **Build Result:**
   - Join the replacements with spaces.

### Time Complexity:
- O(m * d * l), where m is number of words, d is dictionary size, l is max word length, but acceptable since constraints are small.

### Space Complexity:
- O(d + m), for set and result list.
