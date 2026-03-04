# Word Break

## Category
Dynamic Programming

## Description

The Word Break problem is a classic dynamic programming problem where we need to determine if a string can be segmented into a sequence of one or more words from a given dictionary. This problem appears frequently in text processing, natural language processing, and autocomplete systems.

---

## When to Use

Use the Word Break algorithm when you need to solve problems involving:

- **Text Segmentation**: Breaking text into meaningful words
- **Dictionary Matching**: Checking if text can be formed from dictionary words
- **String Partitioning**: Dividing a string into valid segments
- **Autocomplete Systems**: Validating user input against a dictionary
- **Spell Checking**: Determining if text can be broken into valid words

### Comparison with Alternatives

| Approach | Time Complexity | Space Complexity | Best Use Case |
|----------|-----------------|------------------|---------------|
| **DP (Bottom-up)** | O(n² × m) | O(n) | Most cases, simple implementation |
| **DP with Trie** | O(n²) avg, O(n × m) best | O(n + m × | Dictionary-heavy, long words |
| **BFS/DFS** | O(n²) | O(n) | Finding all segmentations |
| **Memoization** | O(n²) | O(n) | Recursive, top-down approach |

### When to Choose Each Approach

- **Choose Basic DP** when:
  - Dictionary is small to medium
  - Simplicity is preferred
  - Need quick implementation

- **Choose BFS/DFS** when:
  - Need to find all possible segmentations
  - Memory is constrained
  - Working with graphs/tree structures

- **Choose Trie-based** when:
  - Dictionary is very large
  - Words have common prefixes
  - Need optimized lookups

---

## Algorithm Explanation

### Core Concept

The key insight behind the Word Break problem is that we can determine if a string can be segmented by building up solutions for smaller substrings. We use dynamic programming where each state represents whether a prefix of the string can be segmented into dictionary words.

### How It Works

#### Dynamic Programming Approach:

1. **Define DP State**: `dp[i]` = True if the substring `s[0:i]` can be segmented into dictionary words
2. **Initialize**: `dp[0]` = True (empty string can always be segmented)
3. **Transition**: For each position i from 1 to n:
   - Check all positions j from 0 to i-1
   - If `dp[j]` is True AND `s[j:i]` is in the dictionary, then `dp[i]` = True
4. **Result**: Return `dp[n]`

### Visual Representation

For string `s = "leetcode"` and dictionary `["leet", "code"]`:

```
Index:    0    1    2    3    4    5    6    7    8
String:   l    e    e    t    c    o    d    e
          ├────┤
          dp[4]=True (leet)
                   ├────┤
                   dp[8]=True (code)
                   
dp[0] = True (empty string)
dp[4] = True (s[0:4] = "leet" is in dict)
dp[8] = True (s[4:8] = "code" is in dict AND dp[4]=True)
```

### Why This Works

- **Optimal Substructure**: If we can segment up to position j, and substring from j to i is a word, then we can segment up to i
- **Overlapping Subproblems**: We consider all possible break points, avoiding redundant computation
- **Building Up**: We progressively build solutions for longer prefixes from shorter ones

### Optimization Techniques

1. **Set-based Lookup**: Convert dictionary to a hash set for O(1) word lookup
2. **Early Termination**: Stop checking once `dp[i]` becomes True
3. **Trie Structure**: Use Trie for efficient prefix matching
4. **Length-based Pruning**: Only check words that could fit

### Limitations

- **Time Complexity**: O(n²) can be slow for very long strings
- **Space**: Uses O(n) space for DP array
- **Dictionary Size**: Performance depends on dictionary size and word lengths

---

## Algorithm Steps

### Step-by-Step Approach

1. **Convert Dictionary**: Transform the word list into a Hash Set for O(1) lookups
   
2. **Initialize DP Array**: Create a boolean array `dp` of size `n+1`, where `n` is the string length. Set `dp[0] = True`

3. **Iterate Through Positions**: For each position `i` from 1 to n:
   - For each position `j` from 0 to i-1:
     - If `dp[j]` is True AND `s[j:i]` exists in the word set:
       - Set `dp[i] = True`
       - Break (early termination)

4. **Return Result**: Return `dp[n]`

### Pseudocode

```
function wordBreak(s, wordDict):
    wordSet = set(wordDict)
    n = length(s)
    dp = array of (n+1) false values
    dp[0] = true
    
    for i from 1 to n:
        for j from 0 to i-1:
            if dp[j] AND s[j:i] in wordSet:
                dp[i] = true
                break
    
    return dp[n]
```

---

## Implementation

### Template Code (Word Break)

````carousel
```python
from typing import List, Set, Optional


def word_break(s: str, word_dict: List[str]) -> bool:
    """
    Determine if a string can be segmented into dictionary words.
    
    Args:
        s: String to segment
        word_dict: List of words (dictionary)
    
    Returns:
        True if s can be segmented into words from word_dict
    
    Time: O(n² × m) where n = len(s), m = max word length
    Space: O(n + k) where k = total characters in dictionary
    """
    # Convert to set for O(1) lookup
    word_set: Set[str] = set(word_dict)
    n = len(s)
    
    # dp[i] = True if s[0:i] can be segmented into dictionary words
    dp: List[bool] = [False] * (n + 1)
    dp[0] = True  # Empty string can always be segmented
    
    for i in range(1, n + 1):
        for j in range(i):
            # If we can segment up to position j AND s[j:i] is a word
            if dp[j] and s[j:i] in word_set:
                dp[i] = True
                break  # Early termination - no need to check more j values
    
    return dp[n]


def word_break_bfs(s: str, word_dict: List[str]) -> bool:
    """
    BFS approach - useful when we need path information.
    
    Time: O(n²)
    Space: O(n)
    """
    word_set: Set[str] = set(word_dict)
    n = len(s)
    
    # visited[i] = whether we've explored starting from position i
    visited: List[bool] = [False] * (n + 1)
    queue: List[int] = [0]
    
    while queue:
        start = queue.pop(0)
        
        if start == n:
            return True
        
        if visited[start]:
            continue
        
        visited[start] = True
        
        for end in range(start + 1, n + 1):
            word = s[start:end]
            if word in word_set:
                queue.append(end)
    
    return False


def word_break_all(s: str, word_dict: List[str]) -> List[List[str]]:
    """
    Return ALL possible word segmentations.
    
    Time: O(n² × output_size)
    Space: O(n × output_size)
    """
    word_set: Set[str] = set(word_dict)
    n = len(s)
    
    # dp[i] = list of all ways to segment s[0:i]
    dp: List[List[List[str]]] = [[] for _ in range(n + 1)]
    dp[0] = [[]]  # One way to segment empty string: no words
    
    for i in range(1, n + 1):
        for j in range(i):
            word = s[j:i]
            if dp[j] and word in word_set:
                for partial in dp[j]:
                    dp[i].append(partial + [word])
    
    return dp[n]


def word_break_min_words(s: str, word_dict: List[str]) -> int:
    """
    Find minimum number of words needed to segment the string.
    
    Returns:
        Minimum number of words, or -1 if not possible
    
    Time: O(n²)
    Space: O(n)
    """
    word_set: Set[str] = set(word_dict)
    n = len(s)
    
    # dp[i] = minimum words to segment s[0:i], or infinity if not possible
    dp: List[int] = [float('inf')] * (n + 1)
    dp[0] = 0
    
    for i in range(1, n + 1):
        for j in range(i):
            word = s[j:i]
            if dp[j] != float('inf') and word in word_set:
                dp[i] = min(dp[i], dp[j] + 1)
    
    return dp[n] if dp[n] != float('inf') else -1


# Example usage and demonstration
if __name__ == "__main__":
    # Test cases
    test_cases = [
        ("leetcode", ["leet", "code"]),
        ("applepenapple", ["apple", "pen"]),
        ("catsandog", ["cats", "dog", "sand", "and", "cat"]),
        ("a", ["a"]),
        ("aaaaaaa", ["aaaa", "aaa"]),
        ("dogs", ["dog", "dogs", "s"]),
    ]
    
    print("Word Break Results:")
    print("-" * 60)
    
    for s, word_dict in test_cases:
        result = word_break(s, word_dict)
        print(f"s = \"{s}\"")
        print(f"word_dict = {word_dict}")
        print(f"Result: {result}")
        print()
    
    # Test all segmentations
    print("\nAll Segmentations for 'catsandcat':")
    print("-" * 60)
    s = "catsandcat"
    word_dict = ["cats", "cat", "and", "sand"]
    all_segmentations = word_break_all(s, word_dict)
    print(f"s = \"{s}\"")
    print(f"word_dict = {word_dict}")
    print(f"All segmentations: {all_segmentations}")
    
    # Test minimum words
    print("\nMinimum Words Test:")
    print("-" * 60)
    s = "applepenapple"
    word_dict = ["apple", "pen"]
    min_words = word_break_min_words(s, word_dict)
    print(f"s = \"{s}\"")
    print(f"word_dict = {word_dict}")
    print(f"Minimum words: {min_words}")
```

<!-- slide -->
```cpp
#include <iostream>
#include <vector>
#include <string>
#include <unordered_set>
#include <queue>
using namespace std;

/**
 * Word Break - Dynamic Programming Solution
 * 
 * Time Complexity: O(n² × m) where n = string length, m = max word length
 * Space Complexity: O(n + k) where k = total characters in dictionary
 */
class WordBreak {
public:
    /**
     * Determine if string can be segmented into dictionary words.
     */
    static bool wordBreak(string s, vector<string> wordDict) {
        unordered_set<string> wordSet(wordDict.begin(), wordDict.end());
        int n = s.length();
        
        // dp[i] = true if s[0:i] can be segmented
        vector<bool> dp(n + 1, false);
        dp[0] = true;
        
        for (int i = 1; i <= n; i++) {
            for (int j = 0; j < i; j++) {
                if (dp[j]) {
                    string word = s.substr(j, i - j);
                    if (wordSet.find(word) != wordSet.end()) {
                        dp[i] = true;
                        break;  // Early termination
                    }
                }
            }
        }
        
        return dp[n];
    }
    
    /**
     * BFS approach - returns true if segmentation is possible
     */
    static bool wordBreakBFS(string s, vector<string> wordDict) {
        unordered_set<string> wordSet(wordDict.begin(), wordDict.end());
        int n = s.length();
        
        vector<bool> visited(n + 1, false);
        queue<int> q;
        q.push(0);
        
        while (!q.empty()) {
            int start = q.front();
            q.pop();
            
            if (start == n) return true;
            if (visited[start]) continue;
            visited[start] = true;
            
            for (int end = start + 1; end <= n; end++) {
                string word = s.substr(start, end - start);
                if (wordSet.find(word) != wordSet.end()) {
                    q.push(end);
                }
            }
        }
        
        return false;
    }
    
    /**
     * Return minimum number of words needed
     */
    static int minWords(string s, vector<string> wordDict) {
        unordered_set<string> wordSet(wordDict.begin(), wordDict.end());
        int n = s.length();
        
        const int INF = n + 1;
        vector<int> dp(n + 1, INF);
        dp[0] = 0;
        
        for (int i = 1; i <= n; i++) {
            for (int j = 0; j < i; j++) {
                string word = s.substr(j, i - j);
                if (dp[j] != INF && wordSet.find(word) != wordSet.end()) {
                    dp[i] = min(dp[i], dp[j] + 1);
                }
            }
        }
        
        return dp[n] == INF ? -1 : dp[n];
    }
};

int main() {
    // Test cases
    vector<pair<string, vector<string>>> testCases = {
        {"leetcode", {"leet", "code"}},
        {"applepenapple", {"apple", "pen"}},
        {"catsandog", {"cats", "dog", "sand", "and", "cat"}},
        {"a", {"a"}},
    };
    
    cout << "Word Break Results:" << endl;
    cout << "--------------------" << endl;
    
    for (const auto& test : testCases) {
        string s = test.first;
        vector<string> dict = test.second;
        
        bool result = WordBreak::wordBreak(s, dict);
        
        cout << "s = \"" << s << "\"" << endl;
        cout << "word_dict = [";
        for (size_t i = 0; i < dict.size(); i++) {
            cout << "\"" << dict[i] << "\"";
            if (i < dict.size() - 1) cout << ", ";
        }
        cout << "]" << endl;
        cout << "Result: " << (result ? "true" : "false") << endl;
        cout << endl;
    }
    
    // Test minimum words
    cout << "Minimum Words Test:" << endl;
    cout << "--------------------" << endl;
    string s = "applepenapple";
    vector<string> dict = {"apple", "pen"};
    int minWords = WordBreak::minWords(s, dict);
    cout << "s = \"" << s << "\"" << endl;
    cout << "Minimum words: " << minWords << endl;
    
    return 0;
}
```

<!-- slide -->
```java
import java.util.*;

/**
 * Word Break - Dynamic Programming Solution
 * 
 * Time Complexity: O(n² × m) where n = string length, m = max word length
 * Space Complexity: O(n + k) where k = total characters in dictionary
 */
public class WordBreak {
    
    /**
     * Determine if string can be segmented into dictionary words.
     */
    public static boolean wordBreak(String s, List<String> wordDict) {
        Set<String> wordSet = new HashSet<>(wordDict);
        int n = s.length();
        
        // dp[i] = true if s[0:i] can be segmented
        boolean[] dp = new boolean[n + 1];
        dp[0] = true;
        
        for (int i = 1; i <= n; i++) {
            for (int j = 0; j < i; j++) {
                if (dp[j]) {
                    String word = s.substring(j, i);
                    if (wordSet.contains(word)) {
                        dp[i] = true;
                        break;  // Early termination
                    }
                }
            }
        }
        
        return dp[n];
    }
    
    /**
     * BFS approach
     */
    public static boolean wordBreakBFS(String s, List<String> wordDict) {
        Set<String> wordSet = new HashSet<>(wordDict);
        int n = s.length();
        
        boolean[] visited = new boolean[n + 1];
        Queue<Integer> queue = new LinkedList<>();
        queue.offer(0);
        
        while (!queue.isEmpty()) {
            int start = queue.poll();
            
            if (start == n) return true;
            if (visited[start]) continue;
            visited[start] = true;
            
            for (int end = start + 1; end <= n; end++) {
                String word = s.substring(start, end);
                if (wordSet.contains(word)) {
                    queue.offer(end);
                }
            }
        }
        
        return false;
    }
    
    /**
     * Return minimum number of words needed
     */
    public static int minWords(String s, List<String> wordDict) {
        Set<String> wordSet = new HashSet<>(wordDict);
        int n = s.length();
        
        int[] dp = new int[n + 1];
        Arrays.fill(dp, Integer.MAX_VALUE);
        dp[0] = 0;
        
        for (int i = 1; i <= n; i++) {
            for (int j = 0; j < i; j++) {
                String word = s.substring(j, i);
                if (dp[j] != Integer.MAX_VALUE && wordSet.contains(word)) {
                    dp[i] = Math.min(dp[i], dp[j] + 1);
                }
            }
        }
        
        return dp[n] == Integer.MAX_VALUE ? -1 : dp[n];
    }
    
    /**
     * Return all possible segmentations
     */
    public static List<List<String>> wordBreakAll(String s, List<String> wordDict) {
        Set<String> wordSet = new HashSet<>(wordDict);
        int n = s.length();
        
        List<List<List<String>>> dp = new ArrayList<>(n + 1);
        for (int i = 0; i <= n; i++) {
            dp.add(new ArrayList<>());
        }
        dp.get(0).add(new ArrayList<>());
        
        for (int i = 1; i <= n; i++) {
            for (int j = 0; j < i; j++) {
                String word = s.substring(j, i);
                if (!dp.get(j).isEmpty() && wordSet.contains(word)) {
                    for (List<String> partial : dp.get(j)) {
                        List<String> newList = new ArrayList<>(partial);
                        newList.add(word);
                        dp.get(i).add(newList);
                    }
                }
            }
        }
        
        return dp.get(n);
    }
    
    public static void main(String[] args) {
        // Test cases
        String[][] testCases = {
            {"leetcode", "leet", "code"},
            {"applepenapple", "apple", "pen"},
            {"catsandog", "cats", "dog", "sand", "and", "cat"},
            {"a", "a"},
        };
        
        System.out.println("Word Break Results:");
        System.out.println("--------------------");
        
        for (String[] test : testCases) {
            String s = test[0];
            List<String> dict = Arrays.asList(Arrays.copyOfRange(test, 1, test.length));
            
            boolean result = wordBreak(s, dict);
            
            System.out.println("s = \"" + s + "\"");
            System.out.println("word_dict = " + dict);
            System.out.println("Result: " + result);
            System.out.println();
        }
        
        // Test all segmentations
        System.out.println("All Segmentations:");
        System.out.println("--------------------");
        String str = "catsandcat";
        List<String> dict = Arrays.asList("cats", "cat", "and", "sand");
        List<List<String>> all = wordBreakAll(str, dict);
        System.out.println("s = \"" + str + "\"");
        System.out.println("word_dict = " + dict);
        System.out.println("All segmentations: " + all);
    }
}
```

<!-- slide -->
```javascript
/**
 * Word Break - Dynamic Programming Solution
 * 
 * Time Complexity: O(n² × m) where n = string length, m = max word length
 * Space Complexity: O(n + k) where k = total characters in dictionary
 */

/**
 * Determine if string can be segmented into dictionary words.
 * @param {string} s - String to segment
 * @param {string[]} wordDict - Array of dictionary words
 * @returns {boolean} - True if s can be segmented
 */
function wordBreak(s, wordDict) {
    const wordSet = new Set(wordDict);
    const n = s.length;
    
    // dp[i] = true if s[0:i] can be segmented
    const dp = new Array(n + 1).fill(false);
    dp[0] = true;
    
    for (let i = 1; i <= n; i++) {
        for (let j = 0; j < i; j++) {
            if (dp[j] && wordSet.has(s.substring(j, i))) {
                dp[i] = true;
                break;  // Early termination
            }
        }
    }
    
    return dp[n];
}

/**
 * BFS approach
 * @param {string} s - String to segment
 * @param {string[]} wordDict - Array of dictionary words
 * @returns {boolean} - True if s can be segmented
 */
function wordBreakBFS(s, wordDict) {
    const wordSet = new Set(wordDict);
    const n = s.length;
    
    const visited = new Array(n + 1).fill(false);
    const queue = [0];
    
    while (queue.length > 0) {
        const start = queue.shift();
        
        if (start === n) return true;
        if (visited[start]) continue;
        
        visited[start] = true;
        
        for (let end = start + 1; end <= n; end++) {
            const word = s.substring(start, end);
            if (wordSet.has(word)) {
                queue.push(end);
            }
        }
    }
    
    return false;
}

/**
 * Return minimum number of words needed
 * @param {string} s - String to segment
 * @param {string[]} wordDict - Array of dictionary words
 * @returns {number} - Minimum words or -1 if not possible
 */
function minWords(s, wordDict) {
    const wordSet = new Set(wordDict);
    const n = s.length;
    
    const dp = new Array(n + 1).fill(Infinity);
    dp[0] = 0;
    
    for (let i = 1; i <= n; i++) {
        for (let j = 0; j < i; j++) {
            const word = s.substring(j, i);
            if (dp[j] !== Infinity && wordSet.has(word)) {
                dp[i] = Math.min(dp[i], dp[j] + 1);
            }
        }
    }
    
    return dp[n] === Infinity ? -1 : dp[n];
}

/**
 * Return all possible segmentations
 * @param {string} s - String to segment
 * @param {string[]} wordDict - Array of dictionary words
 * @returns {string[][]} - All possible segmentations
 */
function wordBreakAll(s, wordDict) {
    const wordSet = new Set(wordDict);
    const n = s.length;
    
    const dp = Array.from({ length: n + 1 }, () => []);
    dp[0] = [[]];
    
    for (let i = 1; i <= n; i++) {
        for (let j = 0; j < i; j++) {
            const word = s.substring(j, i);
            if (dp[j].length > 0 && wordSet.has(word)) {
                for (const partial of dp[j]) {
                    dp[i].push([...partial, word]);
                }
            }
        }
    }
    
    return dp[n];
}

// Example usage and demonstration
const testCases = [
    { s: "leetcode", wordDict: ["leet", "code"] },
    { s: "applepenapple", wordDict: ["apple", "pen"] },
    { s: "catsandog", wordDict: ["cats", "dog", "sand", "and", "cat"] },
    { s: "a", wordDict: ["a"] },
];

console.log("Word Break Results:");
console.log("--------------------");

for (const { s, wordDict } of testCases) {
    const result = wordBreak(s, wordDict);
    console.log(`s = "${s}"`);
    console.log(`word_dict = [${wordDict.map(w => `"${w}"`).join(", ")}]`);
    console.log(`Result: ${result}`);
    console.log();
}

// Test all segmentations
console.log("All Segmentations:");
console.log("--------------------");
const s = "catsandcat";
const wordDict = ["cats", "cat", "and", "sand"];
const allSegmentations = wordBreakAll(s, wordDict);
console.log(`s = "${s}"`);
console.log(`word_dict = [${wordDict.map(w => `"${w}"`).join(", ")}]`);
console.log(`All segmentations: ${JSON.stringify(allSegmentations)}`);

// Test minimum words
console.log("\nMinimum Words Test:");
console.log("--------------------");
const minWordsResult = minWords("applepenapple", ["apple", "pen"]);
console.log(`s = "applepenapple"`);
console.log(`Minimum words: ${minWordsResult}`);
```
````

---

## Time Complexity Analysis

| Operation | Time Complexity | Description |
|-----------|-----------------|-------------|
| **Basic DP** | O(n² × m) | n = string length, m = max word length for substring extraction |
| **With Set Lookup** | O(n²) | Set provides O(1) word lookup |
| **BFS/DFS** | O(n²) | Same complexity but different approach |
| **All Segmentations** | O(n² × output) | Depends on number of valid segmentations |
| **Min Words** | O(n²) | Similar to basic DP |

### Detailed Breakdown

- **Nested loops**: For each position i (1 to n), we check all j (0 to i-1)
- **Substring extraction**: O(m) where m is the substring length
- **Set lookup**: O(1) average case with hash set
- **Total comparisons**: n × (n-1) / 2 = O(n²)

---

## Space Complexity Analysis

| Data Structure | Space Complexity | Description |
|----------------|------------------|-------------|
| **DP Array** | O(n) | Boolean array of size n+1 |
| **Word Set** | O(k) | k = total characters in dictionary |
| **BFS Queue** | O(n) | Maximum queue size |
| **All Segmentations** | O(n × output) | Stores all possible results |

---

## Common Variations

### 1. Word Break II - Return All Segmentations

Return all possible ways to segment the string into dictionary words.

````carousel
```python
def word_break_ii(s: str, word_dict: List[str]) -> List[str]:
    """Return all sentences formed by segmenting the string."""
    word_set = set(word_dict)
    n = len(s)
    
    dp = [[] for _ in range(n + 1)]
    dp[0] = [""]
    
    for i in range(1, n + 1):
        for j in range(i):
            word = s[j:i]
            if word in word_set and dp[j]:
                for sentence in dp[j]:
                    dp[i].append((sentence + " " + word).strip())
    
    return dp[n]
```
````

### 2. Word Break with Trie

Use a Trie for more efficient word lookups, especially with large dictionaries.

````carousel
```python
class TrieNode:
    def __init__(self):
        self.children = {}
        self.is_word = False

class Trie:
    def __init__(self):
        self.root = TrieNode()
    
    def insert(self, word):
        node = self.root
        for char in word:
            if char not in node.children:
                node.children[char] = TrieNode()
            node = node.children[char]
        node.is_word = True
    
    def starts_with(self, prefix):
        node = self.root
        for char in prefix:
            if char not in node.children:
                return None
            node = node.children[char]
        return node
    
    def is_word(self, word):
        node = self.starts_with(word)
        return node is not None and node.is_word

def word_break_trie(s: str, word_dict: List[str]) -> bool:
    """Word break using Trie for efficient prefix matching."""
    trie = Trie()
    for word in word_dict:
        trie.insert(word)
    
    n = len(s)
    dp = [False] * (n + 1)
    dp[0] = True
    
    for i in range(1, n + 1):
        node = trie.root
        for j in range(i - 1, -1, -1):
            char = s[j]
            if char not in node.children:
                break
            node = node.children[char]
            if node.is_word and dp[j]:
                dp[i] = True
                break
    
    return dp[n]
```
````

### 3. Minimum Words Break

Find the minimum number of words needed to break the string.

````carousel
```python
def min_word_break(s: str, word_dict: List[str]) -> int:
    """Find minimum number of words to break the string."""
    word_set = set(word_dict)
    n = len(s)
    
    dp = [float('inf')] * (n + 1)
    dp[0] = 0
    
    for i in range(1, n + 1):
        for j in range(i):
            if s[j:i] in word_set and dp[j] != float('inf'):
                dp[i] = min(dp[i], dp[j] + 1)
    
    return dp[n] if dp[n] != float('inf') else -1
```
````

### 4. Word Break with Word Length Constraints

Handle variations where word lengths have constraints.

````carousel
```python
def word_break_with_constraints(s: str, word_dict: List[str], 
                                 min_len: int, max_len: int) -> bool:
    """Word break with word length constraints."""
    word_set = set(word_dict)
    n = len(s)
    dp = [False] * (n + 1)
    dp[0] = True
    
    for i in range(1, n + 1):
        for j in range(max(0, i - max_len), i):
            if i - j < min_len:
                continue
            if dp[j] and s[j:i] in word_set:
                dp[i] = True
                break
    
    return dp[n]
```
````

---

## Practice Problems

### Problem 1: Word Break (Classic)

**Problem:** [LeetCode 139 - Word Break](https://leetcode.com/problems/word-break/)

**Description:** Given a string `s` and a dictionary of strings `wordDict`, return `true` if `s` can be segmented into a space-separated sequence of dictionary words.

**How to Apply Word Break:**
- Use DP where `dp[i]` represents if `s[0:i]` can be segmented
- Convert dictionary to set for O(1) lookup
- Iterate through all possible break points

---

### Problem 2: Word Break II

**Problem:** [LeetCode 140 - Word Break II](https://leetcode.com/problems/word-break-ii/)

**Description:** Given a string `s` and a dictionary of strings `wordDict`, add spaces to construct a sentence where each word is in the dictionary. Return all such possible sentences.

**How to Apply Word Break:**
- Extend the DP approach to store all possible segmentations
- Use backtracking or DP to build all sentences
- Consider memoization for optimization

---

### Problem 3: Concatenated Words

**Problem:** [LeetCode 472 - Concatenated Words](https://leetcode.com/problems/concatenated-words/)

**Description:** Given an array of strings `words`, return all concatenated words in the given list of words. A concatenated word is defined as a word that can be constructed by taking two or more other words from the list.

**How to Apply Word Break:**
- Sort words by length
- For each word, check if it can be broken using previously processed shorter words
- Use the same DP approach with the dictionary being previously processed words

---

### Problem 4: Maximum Number of Words

**Problem:** [LeetCode 1745 - Palindrome Partitioning IV](https://leetcode.com/problems/palindrome-partitioning-iv/)

**Description:** Given a string `s`, return true if you can partition `s` such that each substring of the partition is a palindrome, with the constraint that you can use at most `k` substrings.

**How to Apply Word Break:**
- Combine word break logic with palindrome checking
- Use DP to track both valid segmentation and count

---

### Problem 5: Word Break III

**Problem:** [LeetCode 1775 - Minimum Number of Operations to Make Array Equal](https://leetcode.com/problems/minimum-number-of-operations-to-make-array-equal/) (similar pattern)

**Description:** Similar word break pattern applied to array/sequence problems where you need to partition based on valid segments.

**How to Apply Word Break:**
- Adapt the DP approach to work with arrays instead of strings
- Define valid segments based on problem constraints

---

## Video Tutorial Links

### Fundamentals

- [Word Break Problem - Dynamic Programming (Take U Forward)](https://www.youtube.com/watch?v=Sx9NNgInc3E) - Comprehensive introduction
- [Word Break LeetCode Solution (NeetCode)](https://www.youtube.com/watch?v=hL1pm8X4uD8) - Practical implementation
- [Dynamic Programming Pattern (BacktoBack SWE)](https://www.youtube.com/watch?v=ythL3bA29vc) - DP patterns

### Advanced Topics

- [Word Break II - All Segmentations](https://www.youtube.com/watch?v=puXav0wD1_I) - Generating all solutions
- [Trie-based Word Break](https://www.youtube.com/watch?v=2mxMXqT3G6E) - Optimized approach
- [Word Break with BFS](https://www.youtube.com/watch?v=Wq8bG3cK1fU) - Graph-based solution

---

## Follow-up Questions

### Q1: Can Word Break be solved without DP?

**Answer:** Yes, there are alternative approaches:
- **BFS/DFS**: Treat the string as a graph where edges connect valid word boundaries
- **Recursive with Memoization**: Top-down approach that caches results
- **Trie-based**: Use Trie for efficient prefix matching
- However, DP is often the most intuitive and commonly used approach

### Q2: How do you handle very large dictionaries?

**Answer:** For large dictionaries:
- **Use Trie**: Efficient for prefix matching, especially with common prefixes
- **Sort and Binary Search**: Sort dictionary, use binary search for lookups
- **Hash-based**: Use hash set for O(1) lookups
- **Filter irrelevant words**: Remove words longer than the input string

### Q3: What is the time complexity if dictionary contains very long words?

**Answer:** With long words in dictionary:
- Substring extraction becomes more expensive: O(m) where m is word length
- Total: O(n² × m) where m is max word length
- Optimization: Pre-compute substring hashes, use rolling hash for O(1) comparison

### Q4: How does Word Break relate to other DP problems?

**Answer:** Word Break is foundational for:
- **House Robber**: Similar DP structure, choosing or not choosing
- **Coin Change**: Partition problem variant
- **Palindrome Partitioning**: Uses similar breaking point approach
- **Climbing Stairs**: Basic 1D DP pattern

### Q5: Can Word Break be solved in O(n × max_word_length)?

**Answer:** Yes, with optimization:
- Instead of checking all j positions, only check words that could fit
- Pre-process dictionary by length
- Use Trie to only traverse valid prefixes
- This reduces complexity from O(n²) to O(n × L) where L is max word length

---

## Summary

The Word Break problem is a fundamental dynamic programming problem with many practical applications in text processing and natural language processing. Key takeaways:

- **DP Approach**: Build solutions for smaller substrings progressively
- **Time Complexity**: O(n²) with hash set, can be optimized to O(n × L)
- **Space Complexity**: O(n) for DP array plus O(k) for dictionary
- **Variations**: Multiple extensions including all segmentations, minimum words
- **Optimization**: Use Trie or length-based pruning for large dictionaries

When to use:
- ✅ Text segmentation and word validation
- ✅ Dictionary-based string processing
- ✅ Autocomplete and spell checking
- ✅ Problems requiring string partitioning
- ❌ When order doesn't matter (use combination problems instead)

This algorithm is essential for competitive programming and technical interviews, particularly in companies working with text processing, search engines, or language applications.

---

## Related Algorithms

- [House Robber](./house-robber.md) - Similar DP pattern
- [Climbing Stairs](./climbing-stairs.md) - Basic 1D DP
- [Coin Change](./coin-change.md) - Partition-based DP
- [Palindrome Partitioning](./palindrome-partitioning.md) - Similar breaking approach
- [Trie](./trie.md) - Efficient prefix matching data structure
