# Group Anagrams

## Problem Description

Given an array of strings `strs`, group the anagrams together. You can return the answer in any order.

An **anagram** is a word or phrase formed by rearranging the letters of a different word or phrase, typically using all the original letters exactly once. For example, "eat", "tea", and "ate" are all anagrams of each other because they contain the same characters ('a', 'e', 't') with the same frequencies but in different orders.

This is one of the most fundamental string manipulation problems and frequently appears in technical interviews. It tests your understanding of:
- Character frequency counting
- Hash maps for grouping
- String sorting as a keying mechanism
- Time/space complexity trade-offs

---

## Examples

**Example 1:**

**Input:**
```python
strs = ["eat","tea","tan","ate","nat","bat"]
```

**Output:**
```python
[["bat"],["nat","tan"],["ate","eat","tea"]]
```

**Explanation:**
- There is no string in strs that can be rearranged to form "bat", so "bat" is in its own group.
- The strings "nat" and "tan" are anagrams as they can be rearranged to form each other.
- The strings "ate", "eat", and "tea" are anagrams as they can be rearranged to form each other.

---

**Example 2:**

**Input:**
```python
strs = [""]
```

**Output:**
```python
[[""]]
```

**Explanation:** An empty string is an anagram of itself (it contains zero characters, which matches the character count of any other empty string).

---

**Example 3:**

**Input:**
```python
strs = ["a"]
```

**Output:**
```python
[["a"]]
```

**Explanation:** A single character string is an anagram of itself.

---

**Example 4:**

**Input:**
```python
strs = ["arc","car","rat","tar","star"]
```

**Output:**
```python
[["arc","car"],["rat","tar"],["star"]]
```

**Explanation:**
- "arc" and "car" are anagrams (both contain 'a', 'r', 'c')
- "rat" and "tar" are anagrams (both contain 'r', 'a', 't')
- "star" has no anagrams in the list

---

## Constraints

- `1 <= strs.length <= 10^4`
- `0 <= strs[i].length <= 100`
- `strs[i]` consists of lowercase English letters ('a' to 'z')

---

## Intuition

The key insight behind grouping anagrams is that **anagrams share the same character frequency signature**. Two strings are anagrams if and only if they have identical counts for each character.

There are two main strategies to generate a unique key for grouping:

### Strategy 1: Sorting
If two strings are anagrams, sorting their characters will produce identical results. For example:
- "eat" → sorted → "aet"
- "tea" → sorted → "aet"
- "tan" → sorted → "ant"

This is the simplest approach but has O(k log k) time per string due to sorting.

### Strategy 2: Character Frequency Count
We can use a tuple or string of character counts as the key. Since there are only 26 lowercase letters, we can create an array of 26 integers representing counts for 'a' through 'z':
- "eat" → [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
- "tea" → [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]

This approach is O(k) per string, where k is the string length.

---

## Approach 1: Sorting (Simple) ⭐

### Algorithm
1. Create a dictionary (hash map) to group strings by their sorted representation
2. For each string in the input array:
   - Sort the characters of the string
   - Use the sorted string as a key in the dictionary
   - Append the original string to the list associated with that key
3. Return all values from the dictionary as the grouped result

### Why This Works
Sorting transforms all anagrams into an identical canonical form. Since anagrams contain exactly the same characters (just in different orders), sorting will always produce the same result for any group of anagrams.

### Code

````carousel
<!-- slide -->
```python
from typing import List
from collections import defaultdict

class Solution:
    def groupAnagrams_sorting(self, strs: List[str]) -> List[List[str]]:
        """
        Group anagrams by sorting each string and using it as a key.
        
        Time: O(n * k * log k) where n is number of strings, k is max string length
        Space: O(n * k) for storing grouped strings
        """
        groups = defaultdict(list)
        for s in strs:
            # Sort the string to create a canonical key
            sorted_key = ''.join(sorted(s))
            groups[sorted_key].append(s)
        return list(groups.values())
```
<!-- slide -->
```java
import java.util.*;

class Solution {
    public List<List<String>> groupAnagrams(String[] strs) {
        /**
         * Group anagrams by sorting each string and using it as a key.
         *
         * Time: O(n * k * log k) where n is number of strings, k is max string length
         * Space: O(n * k) for storing grouped strings
         */
        Map<String, List<String>> groups = new HashMap<>();
        
        for (String s : strs) {
            // Sort the string to create a canonical key
            char[] chars = s.toCharArray();
            Arrays.sort(chars);
            String sortedKey = new String(chars);
            
            groups.computeIfAbsent(sortedKey, k -> new ArrayList<>()).add(s);
        }
        
        return new ArrayList<>(groups.values());
    }
}
```
<!-- slide -->
```cpp
#include <vector>
#include <string>
#include <algorithm>
#include <unordered_map>

class Solution {
public:
    std::vector<std::vector<std::string>> groupAnagrams(std::vector<std::string>& strs) {
        /**
         * Group anagrams by sorting each string and using it as a key.
         *
         * Time: O(n * k * log k) where n is number of strings, k is max string length
         * Space: O(n * k) for storing grouped strings
         */
        std::unordered_map<std::string, std::vector<std::string>> groups;
        
        for (const std::string& s : strs) {
            std::string sortedKey = s;
            std::sort(sortedKey.begin(), sortedKey.end());
            groups[sortedKey].push_back(s);
        }
        
        std::vector<std::vector<std::string>> result;
        for (auto& pair : groups) {
            result.push_back(pair.second);
        }
        
        return result;
    }
};
```
<!-- slide -->
```javascript
/**
 * Group anagrams by sorting each string and using it as a key.
 * 
 * Time: O(n * k * log k) where n is number of strings, k is max string length
 * Space: O(n * k) for storing grouped strings
 * 
 * @param {string[]} strs - Array of input strings
 * @return {string[][]} - Array of grouped anagrams
 */
var groupAnagrams = function(strs) {
    const groups = new Map();
    
    for (const s of strs) {
        // Sort the string to create a canonical key
        const sortedKey = s.split('').sort().join('');
        
        if (!groups.has(sortedKey)) {
            groups.set(sortedKey, []);
        }
        groups.get(sortedKey).push(s);
    }
    
    return Array.from(groups.values());
};
```
````
---

### Time Complexity
**O(n × k × log k)**, where:
- `n` is the number of strings (up to 10^4)
- `k` is the maximum string length (up to 100)
- The `log k` factor comes from sorting each string

### Space Complexity
**O(n × k)** for storing all strings in the groups (in the worst case, each string is its own group)

### Pros
- Simple and intuitive
- Easy to implement correctly
- Works for any character set (not limited to lowercase letters)

### Cons
- Sorting each string adds overhead
- Not optimal for short strings with many duplicates

---

## Approach 2: Character Frequency Count (Optimal) ⭐⭐

### Algorithm
1. Create a dictionary to group strings by their character frequency signature
2. For each string in the input array:
   - Count occurrences of each character (26 counters for lowercase letters)
   - Convert the count array to a tuple or string to use as a key
   - Append the original string to the group for that key
3. Return all groups

### Why This Works
Two strings are anagrams if and only if they have identical character frequency counts. By using the frequency count as a key, we create a unique identifier for each anagram group without the overhead of sorting.

### Code

````carousel
<!-- slide -->
```python
from typing import List
from collections import defaultdict

class Solution:
    def groupAnagrams_frequency(self, strs: List[str]) -> List[List[str]]:
        """
        Group anagrams by counting character frequencies.
        
        Time: O(n * k) where n is number of strings, k is max string length
        Space: O(n * k) for storing grouped strings
        """
        groups = defaultdict(list)
        
        for s in strs:
            # Create a count array for 26 lowercase letters
            count = [0] * 26
            for char in s:
                count[ord(char) - ord('a')] += 1
            
            # Convert count array to tuple for use as dict key
            key = tuple(count)
            groups[key].append(s)
        
        return list(groups.values())
    
    def groupAnagrams_optimized(self, strs: List[str]) -> List[List[str]]:
        """
        Optimized version using a string key instead of tuple.
        Slightly better space efficiency for large inputs.
        """
        groups = defaultdict(list)
        
        for s in strs:
            # Create a count string key (more compact than tuple)
            count = [0] * 26
            for char in s:
                count[ord(char) - ord('a')] += 1
            key = '#'.join(map(str, count))
            groups[key].append(s)
        
        return list(groups.values())
```
<!-- slide -->
```java
import java.util.*;

class Solution {
    public List<List<String>> groupAnagrams(String[] strs) {
        /**
         * Group anagrams by counting character frequencies.
         *
         * Time: O(n * k) where n is number of strings, k is max string length
         * Space: O(n * k) for storing grouped strings
         */
        if (strs == null || strs.length == 0) return new ArrayList<>();
        
        Map<String, List<String>> groups = new HashMap<>();
        
        for (String s : strs) {
            // Count character frequencies
            int[] count = new int[26];
            for (char c : s.toCharArray()) {
                count[c - 'a']++;
            }
            
            // Build a unique key from the count array
            StringBuilder key = new StringBuilder();
            for (int freq : count) {
                key.append('#').append(freq);
            }
            String keyStr = key.toString();
            
            groups.computeIfAbsent(keyStr, k -> new ArrayList<>()).add(s);
        }
        
        return new ArrayList<>(groups.values());
    }
}
```
<!-- slide -->
```cpp
#include <vector>
#include <string>
#include <algorithm>
#include <unordered_map>

class Solution {
public:
    std::vector<std::vector<std::string>> groupAnagrams(std::vector<std::string>& strs) {
        /**
         * Group anagrams by counting character frequencies.
         *
         * Time: O(n * k) where n is number of strings, k is max string length
         * Space: O(n * k) for storing grouped strings
         */
        std::unordered_map<std::string, std::vector<std::string>> groups;
        
        for (const std::string& s : strs) {
            // Count character frequencies (26 lowercase letters)
            int count[26] = {0};
            for (char c : s) {
                count[c - 'a']++;
            }
            
            // Create a string key from the count array
            std::string key;
            for (int i = 0; i < 26; i++) {
                key += '#' + std::to_string(count[i]);
            }
            
            groups[key].push_back(s);
        }
        
        std::vector<std::vector<std::string>> result;
        for (auto& pair : groups) {
            result.push_back(pair.second);
        }
        
        return result;
    }
};
```
<!-- slide -->
```javascript
/**
 * Group anagrams by counting character frequencies.
 * 
 * Time: O(n * k) where n is number of strings, k is max string length
 * Space: O(n * k) for storing grouped strings
 * 
 * @param {string[]} strs - Array of input strings
 * @return {string[][]} - Array of grouped anagrams
 */
var groupAnagrams = function(strs) {
    const groups = new Map();
    
    for (const s of strs) {
        // Count character frequencies for 26 lowercase letters
        const count = new Array(26).fill(0);
        
        for (let i = 0; i < s.length; i++) {
            const charCode = s.charCodeAt(i) - 'a'.charCodeAt(0);
            count[charCode]++;
        }
        
        // Create a unique key from the count array
        const key = count.join('#');
        
        if (!groups.has(key)) {
            groups.set(key, []);
        }
        groups.get(key).push(s);
    }
    
    return Array.from(groups.values());
};
```
````
---

### Time Complexity
**O(n × k)**, where:
- `n` is the number of strings (up to 10^4)
- `k` is the maximum string length (up to 100)

We iterate through each character of each string exactly once.

### Space Complexity
**O(n × k)** for storing all strings in the groups, plus **O(1)** extra space for the count array (fixed size of 26)

### Pros
- Linear time complexity - optimal for this problem
- No sorting overhead
- More efficient for longer strings

### Cons
- Slightly more complex implementation
- Requires understanding of hash map operations
- The key generation is more involved than sorting

---

## Approach 3: Prime Product (Alternative)

### Algorithm
1. Assign each letter a unique prime number (a=2, b=3, c=5, etc.)
2. For each string, compute the product of prime values for its characters
3. Use this product as a unique key for grouping (anagrams will have the same product)
4. Return grouped results

### Why This Works
The Fundamental Theorem of Arithmetic states that every integer greater than 1 has a unique prime factorization. By assigning each letter a unique prime, the product of primes for a string's characters will be unique to that multiset of characters. This product serves as a perfect hash for the anagram group.

### Code

````carousel
<!-- slide -->
```python
from typing import List
from collections import defaultdict

class Solution:
    def groupAnagrams_prime(self, strs: List[str]) -> List[List[str]]:
        """
        Group anagrams using prime number multiplication.
        
        Time: O(n * k) where n is number of strings, k is max string length
        Space: O(n * k) for storing grouped strings
        """
        # Assign prime numbers to each letter
        primes = {
            'a': 2, 'b': 3, 'c': 5, 'd': 7, 'e': 11, 'f': 13, 'g': 17, 'h': 19,
            'i': 23, 'j': 29, 'k': 31, 'l': 37, 'm': 41, 'n': 43, 'o': 47,
            'p': 53, 'q': 59, 'r': 61, 's': 67, 't': 71, 'u': 73, 'v': 79,
            'w': 83, 'x': 89, 'y': 97, 'z': 101
        }
        
        groups = defaultdict(list)
        
        for s in strs:
            # Calculate product of primes for each character
            product = 1
            for char in s:
                product *= primes[char]
            groups[product].append(s)
        
        return list(groups.values())
    
    def groupAnagrams_prime_optimized(self, strs: List[str]) -> List[List[str]]:
        """
        Optimized version using a list of primes for faster lookup.
        """
        primes = [
            2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 
            43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97, 101
        ]
        
        groups = defaultdict(list)
        
        for s in strs:
            product = 1
            for char in s:
                product *= primes[ord(char) - ord('a')]
            groups[product].append(s)
        
        return list(groups.values())
```
<!-- slide -->
```java
import java.util.*;

class Solution {
    // Prime numbers for each letter a-z
    private static final int[] PRIMES = {
        2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41,
        43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97, 101
    };
    
    public List<List<String>> groupAnagrams(String[] strs) {
        /**
         * Group anagrams using prime number multiplication.
         *
         * Time: O(n * k) where n is number of strings, k is max string length
         * Space: O(n * k) for storing grouped strings
         */
        Map<Long, List<String>> groups = new HashMap<>();
        
        for (String s : strs) {
            long product = 1;
            for (char c : s.toCharArray()) {
                product *= PRIMES[c - 'a'];
            }
            
            groups.computeIfAbsent(product, k -> new ArrayList<>()).add(s);
        }
        
        return new ArrayList<>(groups.values());
    }
}
```
<!-- slide -->
```cpp
#include <vector>
#include <string>
#include <unordered_map>

class Solution {
private:
    // Prime numbers for each letter a-z
    static constexpr int PRIMES[26] = {
        2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41,
        43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97, 101
    };
    
public:
    std::vector<std::vector<std::string>> groupAnagrams(std::vector<std::string>& strs) {
        /**
         * Group anagrams using prime number multiplication.
         *
         * Time: O(n * k) where n is number of strings, k is max string length
         * Space: O(n * k) for storing grouped strings
         */
        std::unordered_map<long long, std::vector<std::string>> groups;
        
        for (const std::string& s : strs) {
            long long product = 1;
            for (char c : s) {
                product *= PRIMES[c - 'a'];
            }
            
            groups[product].push_back(s);
        }
        
        std::vector<std::vector<std::string>> result;
        for (auto& pair : groups) {
            result.push_back(pair.second);
        }
        
        return result;
    }
};
```
<!-- slide -->
```javascript
/**
 * Group anagrams using prime number multiplication.
 * 
 * Time: O(n * k) where n is number of strings, k is max string length
 * Space: O(n * k) for storing grouped strings
 * 
 * @param {string[]} strs - Array of input strings
 * @return {string[][]} - Array of grouped anagrams
 */
var groupAnagrams = function(strs) {
    // Prime numbers for each letter a-z
    const primes = [
        2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41,
        43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97, 101
    ];
    
    const groups = new Map();
    
    for (const s of strs) {
        let product = 1;
        
        for (let i = 0; i < s.length; i++) {
            const index = s.charCodeAt(i) - 'a'.charCodeAt(0);
            product *= primes[index];
        }
        
        if (!groups.has(product)) {
            groups.set(product, []);
        }
        groups.get(product).push(s);
    }
    
    return Array.from(groups.values());
};
```
````
---

### Time Complexity
**O(n × k)** for computing products plus **O(n)** for hash map operations

### Space Complexity
**O(n × k)** for storing all strings

### Warning: Integer Overflow
For very long strings, the product can exceed JavaScript's safe integer limit (Number.MAX_SAFE_INTEGER = 9 quadrillion) or C++'s 64-bit integer limit. For strings up to 100 characters, the maximum product is well within safe limits (101^100 ≈ 1.37e200, which overflows 64-bit integers).

**In practice, use Approach 2 (Character Frequency) for safety.**

### Pros
- Elegant mathematical solution
- Constant-time key comparison (single integer comparison)
- No string concatenation overhead

### Cons
- Potential for integer overflow with long strings
- Less intuitive than frequency counting
- Limited to lowercase letters (or small character sets)

---

## Step-by-Step Example

Let's trace through `strs = ["eat", "tea", "tan", "ate", "nat", "bat"]` using Approach 2 (Character Frequency):

### Initial State
```
groups = {}
```

### Step 1: Process "eat"
- Count: a=1, e=1, t=1 (all others=0)
- Key: [1,0,0,0,1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0]
- groups = {"1#0#0#0#1#0#0#0#0#0#0#0#0#1#...": ["eat"]}

### Step 2: Process "tea"
- Count: a=1, e=1, t=1 (same as "eat")
- Same key as "eat"
- groups = {"1#0#0#0#1#0#0#0#0#0#0#0#0#1#...": ["eat", "tea"]}

### Step 3: Process "tan"
- Count: a=1, n=1, t=1
- Different key from "eat"
- groups = {
    "1#0#0#0#1#0#0#0#0#0#0#0#0#1#...": ["eat", "tea"],
    "1#0#0#0#0#0#0#0#0#0#0#1#0#1#...": ["tan"]
  }

### Step 4: Process "ate"
- Count: a=1, e=1, t=1 (same as "eat" and "tea")
- Same key as "eat"
- groups = {
    "1#0#0#0#1#0#0#0#0#0#0#0#0#1#...": ["eat", "tea", "ate"],
    "1#0#0#0#0#0#0#0#0#0#0#1#0#1#...": ["tan"]
  }

### Step 5: Process "nat"
- Count: a=1, n=1, t=1 (same as "tan")
- Same key as "tan"
- groups = {
    "1#0#0#0#1#0#0#0#0#0#0#0#0#1#...": ["eat", "tea", "ate"],
    "1#0#0#0#0#0#0#0#0#0#0#1#0#1#...": ["tan", "nat"]
  }

### Step 6: Process "bat"
- Count: a=1, b=1, t=1
- New key
- groups = {
    "1#0#0#0#1#0#0#0#0#0#0#0#0#1#...": ["eat", "tea", "ate"],
    "1#0#0#0#0#0#0#0#0#0#0#1#0#1#...": ["tan", "nat"],
    "0#1#0#0#1#0#0#0#0#0#0#0#0#1#...": ["bat"]
  }

### Final Result
```python
[["eat", "tea", "ate"], ["tan", "nat"], ["bat"]]
```
(Order may vary based on hash map iteration order)

---

## Time Complexity Comparison

| Approach | Time Complexity | Space Complexity | Best For |
|----------|-----------------|------------------|----------|
| Sorting | O(n × k × log k) | O(n × k) | Simplicity, any character set |
| Character Frequency | O(n × k) | O(n × k) | **Optimal - large inputs** |
| Prime Product | O(n × k) | O(n × k) | Educational purposes |

---

## Related Problems

1. **[Valid Anagram](valid-anagram.md)** - Check if two strings are anagrams (simpler version)
2. **[Find All Anagrams in a String](find-all-anagrams-in-a-string.md)** - Find all starting indices of anagrams of pattern p in string s
3. **[Group Anagrams II](https://leetcode.com/problems/group-anagrams/)** - Variant with different constraints
4. **[Palindrome Permutation](https://leetcode.com/problems/palindrome-permutation/)** - Check if characters can be rearranged to form a palindrome
5. **[Minimum Number of Steps to Make Two Strings Anagram](https://leetcode.com/problems/minimum-number-of-steps-to-make-two-strings-anagram/)** - Find minimum changes to make strings anagrams

---

## Video Tutorials

- [NeetCode - Group Anagrams Solution](https://www.youtube.com/watch?v=pt-2kGj4-Uk)
- [Back to Back SWE - Group Anagrams](https://www.youtube.com/watch?v=vhgT3f91pm0)
- [LeetCode Official Solution](https://www.youtube.com/watch?v=pt-2kGj4-Uk)
- [TechDive - Group Anagrams](https://www.youtube.com/watch?v=vlggw8219hQ)

---

## Follow-up Questions

1. **How would you modify the solution if the input could contain uppercase letters?**
   - Answer: Convert all characters to lowercase first, or expand the count array to handle 52 letters.

2. **What if the input strings could contain Unicode characters?**
   - Answer: Use a HashMap/Map to count character frequencies dynamically instead of a fixed-size array.

3. **How would you return groups in alphabetical order?**
   - Answer: After grouping, sort each group's strings and optionally sort the groups by their first element.

4. **Can you solve this problem without using extra space (in-place)?**
   - Answer: No, this problem inherently requires grouping, which needs additional data structures.

5. **What if you needed to count the number of unique anagram groups?**
   - Answer: Simply return the size of the groups dictionary/hash map.

6. **How would you optimize for memory if the input is extremely large?**
   - Answer: Consider streaming approaches or external sorting for disk-based data.

7. **What if you were asked to do this in a distributed system?**
   - Answer: Use MapReduce - map each string to its sorted/counted key, then reduce by key.

8. **How would you handle strings with spaces and punctuation?**
   - Answer: Preprocess by removing non-letter characters before counting.

---

## Common Mistakes to Avoid

1. **Not handling empty strings** - Empty strings are valid anagrams of each other
2. **Using a list as a dictionary key in Python** - Lists are not hashable; use tuple() instead
3. **Forgetting that sorting is O(k log k)** - Can be slow for many long strings
4. **Not considering case sensitivity** - Decide if 'A' and 'a' are the same
5. **Integer overflow in prime product approach** - Use big integers or switch to frequency counting

---

## References

- [LeetCode 49 - Group Anagrams](https://leetcode.com/problems/group-anagrams/)
- Character Frequency Pattern: Efficient counting for fixed character sets
- Hash Map Grouping: Classic technique for clustering similar items

