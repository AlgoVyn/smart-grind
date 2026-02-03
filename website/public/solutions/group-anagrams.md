# Group Anagrams

## Problem Statement

LeetCode Problem 49: Group Anagrams

Given an array of strings `strs`, group the anagrams together. You can return the answer in any order.

An anagram is a word or phrase formed by rearranging the letters of a different word or phrase, typically using all the original letters exactly once. For example, "eat", "ate", and "tea" are all anagrams of each other.

### Examples

Here are some examples to illustrate the problem:

- **Input:** `strs = ["eat","tea","tan","ate","nat","bat"]`<br>
  **Output:** `[["eat","ate","tea"],["tan","nat"],["bat"]]`<br>
  **Explanation:** "eat", "tea", and "ate" share the same character counts. "tan" and "nat" share the same character counts. "bat" is unique.

- **Input:** `strs = [""]`<br>
  **Output:** `[[""]]`<br>
  **Explanation:** An empty string is a valid anagram of another empty string.

- **Input:** `strs = ["a"]`<br>
  **Output:** `[["a"]]`<br>
  **Explanation:** A single character is only anagram to itself.

- **Input:** `strs = ["", "b"]`<br>
  **Output:** `[[""],["b"]]`<br>
  **Explanation:** The empty string and "b" have different character counts.

### Constraints

- `1 <= strs.length <= 10^4`
- `0 <= strs[i].length <= 100`
- `strs[i]` consists of lowercase English letters ('a' to 'z')

### Intuition

The key insight is that two strings are anagrams if and only if they have identical character counts. This means:

1. Strings with the same frequency of each character belong to the same group.
2. We need a way to create a canonical representation (key) for strings that share the same character counts.

For example:
- "eat" → {a: 1, e: 1, t: 1}
- "ate" → {a: 1, e: 1, t: 1}
- "tea" → {a: 1, e: 1, t: 1}

All three produce the same frequency map and should be grouped together.

---

## Approach 1: Character Frequency Counting with Hash Map (Primary and Efficient)

This approach uses a frequency-based key to group anagrams efficiently. We count characters in each string and use the count tuple as the key in a hash map.

### Implementation

````carousel
```python
from collections import defaultdict
from typing import List

class Solution:
    def groupAnagrams(self, strs: List[str]) -> List[List[str]]:
        """
        Group anagrams using character frequency counting.
        
        Time Complexity: O(N * K) where N is number of strings and K is average string length
        Space Complexity: O(N * K) for storing groups
        """
        groups = defaultdict(list)
        
        for s in strs:
            # Create a frequency count array for 26 lowercase letters
            count = [0] * 26
            
            for char in s:
                count[ord(char) - ord('a')] += 1
            
            # Use tuple of counts as key (tuples are hashable)
            key = tuple(count)
            groups[key].append(s)
        
        return list(groups.values())
```

```java
import java.util.*;

class Solution {
    public List<List<String>> groupAnagrams(String[] strs) {
        /*
         * Group anagrams using character frequency counting.
         *
         * Time Complexity: O(N * K) where N is number of strings and K is average string length
         * Space Complexity: O(N * K) for storing groups
         */
        if (strs == null || strs.length == 0) {
            return new ArrayList<>();
        }
        
        Map<String, List<String>> groups = new HashMap<>();
        
        for (String s : strs) {
            // Create a frequency count array for 26 lowercase letters
            char[] count = new char[26];
            
            for (char c : s.toCharArray()) {
                count[c - 'a']++;
            }
            
            // Create key from count array
            String key = new String(count);
            groups.computeIfAbsent(key, k -> new ArrayList<>()).add(s);
        }
        
        return new ArrayList<>(groups.values());
    }
}
```

```cpp
#include <vector>
#include <string>
#include <unordered_map>
#include <algorithm>

class Solution {
public:
    std::vector<std::vector<std::string>> groupAnagrams(std::vector<std::string>& strs) {
        /*
         * Group anagrams using character frequency counting.
         *
         * Time Complexity: O(N * K) where N is number of strings and K is average string length
         * Space Complexity: O(N * K) for storing groups
         */
        std::unordered_map<std::string, std::vector<std::string>> groups;
        
        for (const std::string& s : strs) {
            // Create a frequency count array for 26 lowercase letters
            std::vector<int> count(26, 0);
            
            for (char c : s) {
                count[c - 'a']++;
            }
            
            // Create key from count vector
            std::string key;
            for (int i = 0; i < 26; i++) {
                key += std::to_string(count[i]) + '#';
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

```javascript
/**
 * @param {string[]} strs
 * @return {string[][]}
 */
var groupAnagrams = function(strs) {
    /*
     * Group anagrams using character frequency counting.
     *
     * Time Complexity: O(N * K) where N is number of strings and K is average string length
     * Space Complexity: O(N * K) for storing groups
     */
    const groups = new Map();
    
    for (const s of strs) {
        // Create a frequency count array for 26 lowercase letters
        const count = new Array(26).fill(0);
        
        for (let i = 0; i < s.length; i++) {
            count[s.charCodeAt(i) - 97]++;
        }
        
        // Use count array as key (converted to string)
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

### Explanation Step-by-Step

1. **Initialize Hash Map:** Create a hash map (dictionary) to store groups of anagrams. The key will be a canonical representation of character counts.

2. **Process Each String:** For each string in the input array:
   - Create a count array of size 26 (one for each lowercase letter)
   - Iterate through the string and increment the count for each character

3. **Generate Key:** Convert the count array to a hashable key:
   - In Python/Java: Convert to tuple/string
   - In C++: Build a string representation with separators
   - In JavaScript: Join array with separators

4. **Group Strings:** Add the current string to the list associated with its key in the hash map.

5. **Return Results:** Extract all values from the hash map and return them as the result.

### Complexity Analysis

- **Time Complexity:** O(N × K) where N is the number of strings and K is the average string length. Each string is processed once, and character counting is O(K). Hash map operations are O(1) on average.
- **Space Complexity:** O(N × K) for storing all strings in their respective groups, plus O(26) = O(1) for the count array.

This is the optimal approach for this problem given the constraints.

---

## Approach 2: Sorted String as Key (Simpler but Less Efficient)

This approach uses the sorted version of each string as the key. Since anagrams sort to the same result, this groups them effectively.

### Implementation

````carousel
```python
from collections import defaultdict
from typing import List

class Solution:
    def groupAnagrams(self, strs: List[str]) -> List[List[str]]:
        """
        Group anagrams using sorted string as key.
        
        Time Complexity: O(N * K * log K) where N is number of strings and K is average string length
        Space Complexity: O(N * K) for storing groups
        """
        groups = defaultdict(list)
        
        for s in strs:
            # Sort the string to get canonical form
            sorted_key = ''.join(sorted(s))
            groups[sorted_key].append(s)
        
        return list(groups.values())
```

```java
import java.util.*;

class Solution {
    public List<List<String>> groupAnagrams(String[] strs) {
        /*
         * Group anagrams using sorted string as key.
         *
         * Time Complexity: O(N * K * log K) where N is number of strings and K is average string length
         * Space Complexity: O(N * K) for storing groups
         */
        if (strs == null || strs.length == 0) {
            return new ArrayList<>();
        }
        
        Map<String, List<String>> groups = new HashMap<>();
        
        for (String s : strs) {
            char[] chars = s.toCharArray();
            Arrays.sort(chars);
            String key = new String(chars);
            groups.computeIfAbsent(key, k -> new ArrayList<>()).add(s);
        }
        
        return new ArrayList<>(groups.values());
    }
}
```

```cpp
#include <vector>
#include <string>
#include <unordered_map>
#include <algorithm>

class Solution {
public:
    std::vector<std::vector<std::string>> groupAnagrams(std::vector<std::string>& strs) {
        /*
         * Group anagrams using sorted string as key.
         *
         * Time Complexity: O(N * K * log K) where N is number of strings and K is average string length
         * Space Complexity: O(N * K) for storing groups
         */
        std::unordered_map<std::string, std::vector<std::string>> groups;
        
        for (const std::string& s : strs) {
            std::string key = s;
            std::sort(key.begin(), key.end());
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

```javascript
/**
 * @param {string[]} strs
 * @return {string[][]}
 */
var groupAnagrams = function(strs) {
    /*
     * Group anagrams using sorted string as key.
     *
     * Time Complexity: O(N * K * log K) where N is number of strings and K is average string length
     * Space Complexity: O(N * K) for storing groups
     */
    const groups = new Map();
    
    for (const s of strs) {
        const key = s.split('').sort().join('');
        
        if (!groups.has(key)) {
            groups.set(key, []);
        }
        groups.get(key).push(s);
    }
    
    return Array.from(groups.values());
};
```
````

### Explanation Step-by-Step

1. **Initialize Hash Map:** Create a hash map to store groups of anagrams.

2. **Process Each String:** For each string in the input array:
   - Sort the characters of the string alphabetically
   - Use the sorted string as the key (since anagrams sort to the same result)

3. **Group Strings:** Add the original string to the list associated with its sorted key.

4. **Return Results:** Extract all values from the hash map and return them as the result.

### Complexity Analysis

- **Time Complexity:** O(N × K × log K) where N is the number of strings and K is the average string length. The sorting step dominates with O(K log K) per string.
- **Space Complexity:** O(N × K) for storing all strings and O(K) for the sorted key of each string.

This approach is simpler to implement but less efficient than Approach 1 for longer strings.

---

## Approach 3: Prime Number Multiplication (Mathematical)

This approach assigns each letter a unique prime number and uses the product of these primes as the key. Since prime factorization is unique, strings with the same character counts will have the same product.

### Implementation

````carousel
```python
from collections import defaultdict
from typing import List

class Solution:
    def groupAnagrams(self, strs: List[str]) -> List[List[str]]:
        """
        Group anagrams using prime number multiplication.
        
        Time Complexity: O(N * K) where N is number of strings and K is average string length
        Space Complexity: O(N * K) for storing groups
        """
        # First 26 prime numbers for each letter
        primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 
                  31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 
                  73, 79, 83, 89, 97, 101]
        
        groups = defaultdict(list)
        
        for s in strs:
            # Calculate product of primes for each character
            product = 1
            for char in s:
                product *= primes[ord(char) - ord('a')]
            groups[product].append(s)
        
        return list(groups.values())
```

```java
import java.util.*;

class Solution {
    public List<List<String>> groupAnagrams(String[] strs) {
        /*
         * Group anagrams using prime number multiplication.
         *
         * Time Complexity: O(N * K) where N is number of strings and K is average string length
         * Space Complexity: O(N * K) for storing groups
         */
        if (strs == null || strs.length == 0) {
            return new ArrayList<>();
        }
        
        // First 26 prime numbers for each letter
        int[] primes = {2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 
                        31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 
                        73, 79, 83, 89, 97, 101};
        
        Map<Long, List<String>> groups = new HashMap<>();
        
        for (String s : strs) {
            long product = 1;
            for (char c : s.toCharArray()) {
                product *= primes[c - 'a'];
            }
            groups.computeIfAbsent(product, k -> new ArrayList<>()).add(s);
        }
        
        return new ArrayList<>(groups.values());
    }
}
```

```cpp
#include <vector>
#include <string>
#include <unordered_map>

class Solution {
public:
    std::vector<std::vector<std::string>> groupAnagrams(std::vector<std::string>& strs) {
        /*
         * Group anagrams using prime number multiplication.
         *
         * Time Complexity: O(N * K) where N is number of strings and K is average string length
         * Space Complexity: O(N * K) for storing groups
         */
        // First 26 prime numbers for each letter
        std::vector<int> primes = {2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 
                                   31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 
                                   73, 79, 83, 89, 97, 101};
        
        std::unordered_map<long long, std::vector<std::string>> groups;
        
        for (const std::string& s : strs) {
            long long product = 1;
            for (char c : s) {
                product *= primes[c - 'a'];
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

```javascript
/**
 * @param {string[]} strs
 * @return {string[][]}
 */
var groupAnagrams = function(strs) {
    /*
     * Group anagrams using prime number multiplication.
     *
     * Time Complexity: O(N * K) where N is number of strings and K is average string length
     * Space Complexity: O(N * K) for storing groups
     */
    // First 26 prime numbers for each letter
    const primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 
                    31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 
                    73, 79, 83, 89, 97, 101];
    
    const groups = new Map();
    
    for (const s of strs) {
        let product = 1;
        for (let i = 0; i < s.length; i++) {
            product *= primes[s.charCodeAt(i) - 97];
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

### Explanation Step-by-Step

1. **Prime Number Mapping:** Assign a unique prime number to each letter ('a' = 2, 'b' = 3, etc.).

2. **Initialize Hash Map:** Create a hash map with the product as the key.

3. **Process Each String:** For each string:
   - Calculate the product of primes corresponding to each character
   - Since prime factorization is unique, strings with identical character counts will have identical products

4. **Group Strings:** Add the original string to the list associated with its product key.

5. **Return Results:** Extract all values from the hash map and return them as the result.

### Complexity Analysis

- **Time Complexity:** O(N × K) where N is the number of strings and K is the average string length. Multiplication is O(1) per character.
- **Space Complexity:** O(N × K) for storing all strings.

**Note:** This approach can have integer overflow issues for very long strings in languages without arbitrary-precision integers. The maximum product for a 100-character string using the given primes is manageable but should be tested.

---

## Approach 4: Using Counter with String Key (Python-Specific)

Python's `collections.Counter` provides a concise way to represent character frequencies, and it can be used as a dictionary key since it's hashable in certain contexts.

### Implementation

````carousel
```python
from collections import Counter, defaultdict
from typing import List

class Solution:
    def groupAnagrams(self, strs: List[str]) -> List[List[str]]:
        """
        Group anagrams using Counter as key.
        
        Time Complexity: O(N * K) where N is number of strings and K is average string length
        Space Complexity: O(N * K) for storing groups
        """
        groups = defaultdict(list)
        
        for s in strs:
            # Create a frozenset of character counts
            # Using tuple of sorted items for hashability
            key = tuple(sorted(Counter(s).items()))
            groups[key].append(s)
        
        return list(groups.values())
```

```java
import java.util.*;

class Solution {
    public List<List<String>> groupAnagrams(String[] strs) {
        /*
         * Java equivalent using HashMap with custom key representation.
         *
         * Time Complexity: O(N * K) where N is number of strings and K is average string length
         * Space Complexity: O(N * K) for storing groups
         */
        if (strs == null || strs.length == 0) {
            return new ArrayList<>();
        }
        
        Map<String, List<String>> groups = new HashMap<>();
        
        for (String s : strs) {
            int[] count = new int[26];
            for (char c : s.toCharArray()) {
                count[c - 'a']++;
            }
            
            // Create key string representing counts
            StringBuilder keyBuilder = new StringBuilder();
            for (int i = 0; i < 26; i++) {
                if (count[i] > 0) {
                    keyBuilder.append((char)('a' + i));
                    keyBuilder.append(count[i]);
                }
            }
            String key = keyBuilder.toString();
            
            groups.computeIfAbsent(key, k -> new ArrayList<>()).add(s);
        }
        
        return new ArrayList<>(groups.values());
    }
}
```

```cpp
#include <vector>
#include <string>
#include <unordered_map>
#include <algorithm>

class Solution {
public:
    std::vector<std::vector<std::string>> groupAnagrams(std::vector<std::string>& strs) {
        /*
         * C++ equivalent using frequency-based key.
         *
         * Time Complexity: O(N * K) where N is number of strings and K is average string length
         * Space Complexity: O(N * K) for storing groups
         */
        std::unordered_map<std::string, std::vector<std::string>> groups;
        
        for (const std::string& s : strs) {
            std::vector<int> count(26, 0);
            for (char c : s) {
                count[c - 'a']++;
            }
            
            std::string key;
            for (int i = 0; i < 26; i++) {
                if (count[i] > 0) {
                    key += std::to_string(count[i]) + char('a' + i);
                }
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

```javascript
/**
 * @param {string[]} strs
 * @return {string[][]}
 */
var groupAnagrams = function(strs) {
    /*
     * JavaScript equivalent using frequency-based key.
     *
     * Time Complexity: O(N * K) where N is number of strings and K is average string length
     * Space Complexity: O(N * K) for storing groups
     */
    const groups = new Map();
    
    for (const s of strs) {
        const count = new Array(26).fill(0);
        for (let i = 0; i < s.length; i++) {
            count[s.charCodeAt(i) - 97]++;
        }
        
        // Create key string representing counts
        let key = '';
        for (let i = 0; i < 26; i++) {
            if (count[i] > 0) {
                key += count[i] + String.fromCharCode(97 + i);
            }
        }
        
        if (!groups.has(key)) {
            groups.set(key, []);
        }
        groups.get(key).push(s);
    }
    
    return Array.from(groups.values());
};
```
````

### Explanation Step-by-Step

1. **Count Characters:** For each string, count the occurrences of each character.

2. **Create Key:** Convert the count information into a hashable key format:
   - Python: Use `Counter` and convert to sorted tuple of items
   - Other languages: Build a string representation of non-zero counts

3. **Group Strings:** Add the string to the appropriate group based on its key.

4. **Return Results:** Extract and return all groups.

### Complexity Analysis

- **Time Complexity:** O(N × K) for counting plus O(1) for key generation.
- **Space Complexity:** O(N × K) for storing all strings.

---

## Comparison of Approaches

| Approach | Time Complexity | Space Complexity | Pros | Cons |
|----------|-----------------|------------------|------|------|
| Frequency Count | O(N × K) | O(N × K) | Optimal, handles long strings well | Slightly more complex key generation |
| Sorted String | O(N × K × log K) | O(N × K) | Simple to understand and implement | Slower for longer strings |
| Prime Multiplication | O(N × K) | O(N × K) | Mathematical elegance | Potential overflow, requires careful prime selection |
| Counter-based | O(N × K) | O(N × K) | Pythonic and readable | Language-specific features |

---

## Related Problems

Here are some LeetCode problems that build on similar concepts (string manipulation, character counting, or grouping):

- [Valid Anagram (Easy)](https://leetcode.com/problems/valid-anagram/) - Determine if two strings are anagrams of each other.
- [Find All Anagrams in a String (Medium)](https://leetcode.com/problems/find-all-anagrams-in-a-string/) - Find all anagram starting indices in a string.
- [Permutation in String (Medium)](https://leetcode.com/problems/permutation-in-string/) - Check if a string contains a permutation of another.
- [Find the Difference of Two Arrays (Easy)](https://leetcode.com/problems/find-the-difference-of-two-arrays/) - Group-based problem using character counts.
- [ Ransom Note (Easy)](https://leetcode.com/problems/ransom-note/) - Character frequency matching problem.
- [Minimum Number of Steps to Make Two Strings Anagram (Medium)](https://leetcode.com/problems/minimum-number-of-steps-to-make-two-strings-anagram/) - Character count differences.
- [Group Shifted Strings (Medium)](https://leetcode.com/problems/group-shifted-strings/) - Group strings that are shifted versions of each other.

---

## Video Tutorial Links

For visual explanations, here are some recommended YouTube tutorials:

- [Group Anagrams (LeetCode 49) | Full solution with visuals and animations](https://www.youtube.com/watch?v=vT4sJUnO3JU) - Comprehensive explanation of the frequency count approach.
- [Group Anagrams - LeetCode 49 - Python](https://www.youtube.com/watch?v=ptdg7A_fjvw) - Python implementation with detailed breakdown.
- [LeetCode 49. Group Anagrams Solution Explained](https://www.youtube.com/watch?v=0B-l0Bg_k54) - Java implementation with explanation.
- [Group Anagrams (LeetCode 49) - JavaScript](https://www.youtube.com/watch?v=asc3xX7xGWs) - JavaScript solution walkthrough.

---

## Follow-up Questions

1. **How would you modify the solution if the input could contain uppercase letters and digits in addition to lowercase letters?**

   **Answer:** You would need to expand your count array or key generation to accommodate the additional character types. For uppercase + lowercase + digits (26 + 26 + 10 = 62 characters), you could use an array of size 62 or a dictionary/map for sparse representation. Alternatively, use a sorted string or prime multiplication with a larger set of primes.

2. **What if the strings can be very long (thousands of characters)? How does this affect performance?**

   **Answer:** The frequency count approach (Approach 1) remains optimal at O(N × K). The sorted string approach (Approach 2) becomes significantly slower due to O(K log K) sorting. For very long strings, consider using counting sort since characters are from a limited alphabet (26 letters), which reduces sorting to O(K). The prime multiplication approach may also face integer overflow for extremely long strings.

3. **How would you handle Unicode characters beyond ASCII?**

   **Answer:** For Unicode, you would need to:
   - Use a hash map (dictionary) for character counts instead of a fixed-size array
   - For sorted string approach, Unicode sorting may vary by language/library
   - Prime multiplication becomes impractical due to the large number of possible characters
   - Consider using `defaultdict(int)` in Python or `HashMap<Character, Integer>` in Java for counting

4. **How would you implement this if you needed to return the groups sorted alphabetically within each group?**

   **Answer:** After collecting all groups, sort each individual group's strings alphabetically before returning. In Python: `for group in groups.values(): group.sort()`. In Java: `Collections.sort(group)`. This adds O(G × S × log S) where G is number of groups and S is average group size.

5. **What if you needed to count the total number of unique characters across all groups?**

   **Answer:** This is a set union problem. You could:
   - Iterate through all strings and build a global frequency count
   - Or use a Set of all characters seen across all strings
   - The answer is simply the number of unique characters, which for lowercase letters is at most 26

6. **How would you modify the solution to handle extremely large inputs (millions of strings) with limited memory?**

   **Answer:** For large-scale processing:
   - Use streaming approaches to process strings in batches
   - Consider external sorting for the sorted approach
   - Use disk-based hash maps or databases for persistence
   - Implement map-reduce patterns for distributed processing
   - Consider approximate grouping algorithms if exact results aren't required

7. **What if you needed to find the largest group of anagrams?**

   **Answer:** Track the group sizes as you build them and keep track of the maximum. This can be done by maintaining variables for `max_size` and `largest_group` as you process each string. The final answer is `largest_group` after processing all strings.

8. **How would you implement this if the strings could contain Unicode graphemes (like emoji) that may be composed of multiple code points?**

   **Answer:** You would need proper Unicode normalization before processing:
   - Use `unicodedata.normalize('NFC', s)` in Python to normalize composed characters
   - Use appropriate normalization libraries in other languages
   - The counting approach works at the code point level, which may over-count graphemes
   - Consider using regex with grapheme cluster support if available

9. **What are the thread-safety concerns with the hash map approach, and how would you address them?**

   **Answer:** Hash map operations are not atomic in most languages. For multi-threaded scenarios:
   - Use thread-safe data structures (ConcurrentHashMap in Java, concurrent dictionary in C#)
   - Use locks/mutexes around critical sections
   - Process strings in parallel but use a thread-safe aggregator
   - Consider divide-and-conquer: partition strings, process in parallel, merge results

10. **How would you estimate memory usage before processing if given a large dataset?**

    **Answer:** Estimate based on:
    - Total characters: N × K
    - Hash map overhead: ~2-3x the data size for Java/Python
    - Key storage: frequency arrays use constant O(1) space, sorted strings use O(K)
    - For frequency approach: estimate (N × average_group_size × average_string_length)
    - Use sampling: process a small subset to estimate average sizes

---

## LeetCode Link

[Group Anagrams - LeetCode](https://leetcode.com/problems/group-anagrams/)
