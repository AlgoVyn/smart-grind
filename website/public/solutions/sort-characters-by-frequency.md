# Sort Characters by Frequency

## Problem Description

Given a string `s`, sort it in decreasing order based on the frequency of the characters. The frequency of a character is the number of times it appears in the string.

Return the sorted string. If there are multiple answers, return any of them.

**LeetCode Link:** [Sort Characters By Frequency - LeetCode 451](https://leetcode.com/problems/sort-characters-by-frequency/)

---

## Examples

### Example 1

**Input:**
```python
s = "tree"
```

**Output:**
```python
"eert"
```

**Explanation:** Characters 'e' appears 2 times, 't' and 'r' appear 1 time each. The sorted string can be "eert" or "eetr".

### Example 2

**Input:**
```python
s = "cccaaa"
```

**Output:**
```python
"aaaccc"
```

**Explanation:** Both 'c' (3 times) and 'a' (3 times) appear, can return any order.

### Example 3

**Input:**
```python
s = "Aabb"
```

**Output:**
```python
"bbAa"
```

**Explanation:** 'b' appears 2 times, 'A' and 'a' appear 1 time each.

---

## Constraints

- `1 <= s.length <= 5 * 10^5`
- `s` consists of uppercase and lowercase English letters and digits.

---

## Pattern: Frequency Counting with Sorting

This problem uses **frequency counting** to count character occurrences, followed by **sorting** by frequency in descending order. The sorted characters are then concatenated to form the result.

---

## Intuition

The key insight for this problem is straightforward:

1. **Count First**: Count the frequency of each character in the string
2. **Sort by Frequency**: Sort characters based on their frequencies in descending order
3. **Build Result**: Concatenate each character repeated by its frequency

### Alternative Approaches

1. **Bucket Sort (Optimal)**: Since maximum frequency is n (string length), we can use bucket sort - O(n) time
2. **Sort with Custom Comparator**: Standard approach using sorting - O(n log n)
3. **Heap-based**: Use a max heap to always get the most frequent character

### Why Bucket Sort Works

- The frequency of any character cannot exceed the length of the string (n)
- We can create n+1 buckets where bucket[i] contains all characters with frequency i
- Traverse buckets from highest to lowest to build the result

---

## Multiple Approaches with Code

We'll cover three approaches:

1. **Bucket Sort (Optimal)** - O(n) time
2. **Sorting with Counter** - O(n log n) time
3. **Heap-based** - O(n log k) time where k is unique characters

---

## Approach 1: Bucket Sort (Optimal)

### Algorithm Steps

1. **Count frequencies**: Count occurrences of each character
2. **Create buckets**: Create array of buckets where bucket[i] contains characters with frequency i
3. **Build result**: Traverse buckets from highest frequency to lowest

### Why It Works

By using bucket sort, we achieve O(n) time complexity because the maximum possible frequency is n (string length), so we only need n+1 buckets.

### Code Implementation

````carousel
```python
from collections import Counter
from typing import List

class Solution:
    def frequencySort(self, s: str) -> str:
        """
        Sort characters by frequency using bucket sort.
        
        Args:
            s: Input string
            
        Returns:
            String sorted by character frequency
        """
        # Step 1: Count frequencies
        count = Counter(s)
        n = len(s)
        
        # Step 2: Create buckets (index = frequency)
        buckets = [[] for _ in range(n + 1)]
        
        for char, freq in count.items():
            buckets[freq].append(char)
        
        # Step 3: Build result from highest frequency
        result = []
        for freq in range(n, 0, -1):
            for char in buckets[freq]:
                result.append(char * freq)
        
        return ''.join(result)
```

<!-- slide -->
```cpp
#include <string>
#include <vector>
#include <unordered_map>
#include <algorithm>
using namespace std;

class Solution {
public:
    string frequencySort(string s) {
        // Step 1: Count frequencies
        unordered_map<char, int> count;
        for (char c : s) {
            count[c]++;
        }
        
        int n = s.size();
        
        // Step 2: Create buckets
        vector<vector<char>> buckets(n + 1);
        for (auto& pair : count) {
            buckets[pair.second].push_back(pair.first);
        }
        
        // Step 3: Build result
        string result;
        for (int freq = n; freq > 0; freq--) {
            for (char c : buckets[freq]) {
                result.append(freq, c);
            }
        }
        
        return result;
    }
};
```

<!-- slide -->
```java
import java.util.*;

class Solution {
    public String frequencySort(String s) {
        // Step 1: Count frequencies
        Map<Character, Integer> count = new HashMap<>();
        for (char c : s.toCharArray()) {
            count.put(c, count.getOrDefault(c, 0) + 1);
        }
        
        int n = s.length();
        
        // Step 2: Create buckets
        List<List<Character>> buckets = new ArrayList<>(n + 1);
        for (int i = 0; i <= n; i++) {
            buckets.add(new ArrayList<>());
        }
        
        for (Map.Entry<Character, Integer> entry : count.entrySet()) {
            buckets.get(entry.getValue()).add(entry.getKey());
        }
        
        // Step 3: Build result
        StringBuilder result = new StringBuilder();
        for (int freq = n; freq > 0; freq--) {
            for (char c : buckets.get(freq)) {
                for (int i = 0; i < freq; i++) {
                    result.append(c);
                }
            }
        }
        
        return result.toString();
    }
}
```

<!-- slide -->
```javascript
/**
 * @param {string} s
 * @return {string}
 */
var frequencySort = function(s) {
    // Step 1: Count frequencies
    const count = new Map();
    for (const c of s) {
        count.set(c, (count.get(c) || 0) + 1);
    }
    
    const n = s.length;
    
    // Step 2: Create buckets
    const buckets = new Array(n + 1);
    for (let i = 0; i <= n; i++) {
        buckets[i] = [];
    }
    
    for (const [char, freq] of count) {
        buckets[freq].push(char);
    }
    
    // Step 3: Build result
    let result = '';
    for (let freq = n; freq > 0; freq--) {
        for (const char of buckets[freq]) {
            result += char.repeat(freq);
        }
    }
    
    return result;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) - counting O(n), bucket creation O(k), building result O(n) |
| **Space** | O(n) for buckets and result |

---

## Approach 2: Sorting with Counter

### Algorithm Steps

1. **Count frequencies**: Use Counter to count character occurrences
2. **Sort by frequency**: Sort items by frequency in descending order
3. **Build result**: Concatenate characters repeated by their frequency

### Why It Works

This is the straightforward approach. We sort all unique characters by their frequencies.

### Code Implementation

````carousel
```python
from collections import Counter

class Solution:
    def frequencySort(self, s: str) -> str:
        count = Counter(s)
        sorted_chars = sorted(count.items(), key=lambda x: x[1], reverse=True)
        result = []
        
        for char, freq in sorted_chars:
            result.append(char * freq)
        
        return ''.join(result)
```

<!-- slide -->
```cpp
#include <string>
#include <vector>
#include <unordered_map>
#include <algorithm>
using namespace std;

class Solution {
public:
    string frequencySort(string s) {
        unordered_map<char, int> count;
        for (char c : s) {
            count[c]++;
        }
        
        vector<pair<char, int>> vec(count.begin(), count.end());
        sort(vec.begin(), vec.end(), 
             [](const pair<char, int>& a, const pair<char, int>& b) {
                 return a.second > b.second;
             });
        
        string result;
        for (auto& pair : vec) {
            result.append(pair.second, pair.first);
        }
        
        return result;
    }
};
```

<!-- slide -->
```java
import java.util.*;

class Solution {
    public String frequencySort(String s) {
        Map<Character, Integer> count = new HashMap<>();
        for (char c : s.toCharArray()) {
            count.put(c, count.getOrDefault(c, 0) + 1);
        }
        
        List<Map.Entry<Character, Integer>> list = new ArrayList<>(count.entrySet());
        list.sort((a, b) -> b.getValue() - a.getValue());
        
        StringBuilder result = new StringBuilder();
        for (Map.Entry<Character, Integer> entry : list) {
            for (int i = 0; i < entry.getValue(); i++) {
                result.append(entry.getKey());
            }
        }
        
        return result.toString();
    }
}
```

<!-- slide -->
```javascript
/**
 * @param {string} s
 * @return {string}
 */
var frequencySort = function(s) {
    const count = new Map();
    for (const c of s) {
        count.set(c, (count.get(c) || 0) + 1);
    }
    
    const sorted = [...count.entries()].sort((a, b) => b[1] - a[1]);
    
    let result = '';
    for (const [char, freq] of sorted) {
        result += char.repeat(freq);
    }
    
    return result;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n log k) where k is unique characters |
| **Space** | O(k) for the counter |

---

## Approach 3: Heap-based

### Algorithm Steps

1. **Count frequencies**: Count occurrences of each character
2. **Max heap**: Use a max heap ordered by frequency
3. **Build result**: Pop from heap and append characters

### Why It Works

A max heap always gives us the character with highest frequency, allowing us to build the result efficiently.

### Code Implementation

````carousel
```python
from collections import Counter
import heapq

class Solution:
    def frequencySort(self, s: str) -> str:
        count = Counter(s)
        
        # Max heap (negate frequency for max heap behavior)
        heap = [(-freq, char) for char, freq in count.items()]
        heapq.heapify(heap)
        
        result = []
        while heap:
            freq, char = heapq.heappop(heap)
            result.append(char * (-freq))
        
        return ''.join(result)
```

<!-- slide -->
```cpp
#include <string>
#include <vector>
#include <unordered_map>
#include <queue>
using namespace std;

class Solution {
public:
    string frequencySort(string s) {
        unordered_map<char, int> count;
        for (char c : s) {
            count[c]++;
        }
        
        // Max heap
        priority_queue<pair<int, char>> pq;
        for (auto& pair : count) {
            pq.push({pair.second, pair.first});
        }
        
        string result;
        while (!pq.empty()) {
            auto [freq, c] = pq.top();
            pq.pop();
            result.append(freq, c);
        }
        
        return result;
    }
};
```

<!-- slide -->
```java
import java.util.*;

class Solution {
    public String frequencySort(String s) {
        Map<Character, Integer> count = new HashMap<>();
        for (char c : s.toCharArray()) {
            count.put(c, count.getOrDefault(c, 0) + 1);
        }
        
        // Max heap
        PriorityQueue<Character> pq = new PriorityQueue<>((a, b) -> 
            count.get(b) - count.get(a));
        
        for (char c : count.keySet()) {
            pq.add(c);
        }
        
        StringBuilder result = new StringBuilder();
        while (!pq.isEmpty()) {
            char c = pq.poll();
            int freq = count.get(c);
            for (int i = 0; i < freq; i++) {
                result.append(c);
            }
        }
        
        return result.toString();
    }
}
```

<!-- slide -->
```javascript
/**
 * @param {string} s
 * @return {string}
 */
var frequencySort = function(s) {
    const count = new Map();
    for (const c of s) {
        count.set(c, (count.get(c) || 0) + 1);
    }
    
    // Max heap using sort instead (JavaScript doesn't have native heap)
    const sorted = [...count.entries()].sort((a, b) => b[1] - a[1]);
    
    let result = '';
    for (const [char, freq] of sorted) {
        result += char.repeat(freq);
    }
    
    return result;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n + k log k) where k is unique characters |
| **Space** | O(k) for the heap |

---

## Comparison of Approaches

| Aspect | Bucket Sort | Sort with Counter | Heap |
|--------|-------------|-------------------|------|
| **Time Complexity** | O(n) | O(n log k) | O(n + k log k) |
| **Space Complexity** | O(n) | O(k) | O(k) |
| **Implementation** | Moderate | Simple | Moderate |
| **Recommended** | ✅ Best | ✅ Good | ❌ Overkill |

**Best Approach:** Use Approach 1 (Bucket Sort) for optimal O(n) performance.

---

## Common Pitfalls

### 1. Sorting Direction
**Issue**: Sorting in ascending order instead of descending.

**Solution**: Use `reverse=True` or custom comparator for descending order.

### 2. String Multiplication
**Issue**: Using `frequency * char` instead of `char * frequency`.

**Solution**: In Python, use `char * frequency`. In other languages, use the appropriate string repeat function.

### 3. Case Sensitivity
**Issue**: Treating 'A' and 'a' as the same.

**Solution**: The problem treats them as different characters, so keep them as-is.

---

## Why This Problem is Important

### Interview Relevance

- **Frequency**: Occasionally asked in technical interviews
- **Companies**: Amazon, Bloomberg
- **Difficulty**: Medium
- **Concepts Tested**: Hash tables, sorting, bucket sort

### Learning Outcomes

1. **Bucket Sort**: Learn when bucket sort is applicable
2. **Hash Table Operations**: Master frequency counting
3. **String Manipulation**: Practice string building

---

## Related Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Top K Frequent Elements | [Link](https://leetcode.com/problems/top-k-frequent-elements/) | Similar frequency counting |
| First Unique Character | [Link](https://leetcode.com/problems/first-unique-character-in-a-string/) | Frequency counting |
| Group Anagrams | [Link](https://leetcode.com/problems/group-anagrams/) | Character counting |

---

## Video Tutorial Links

1. **[NeetCode - Sort Characters By Frequency](https://www.youtube.com/watch?v=3Q_oL-7lS1U)** - Clear explanation
2. **[Bucket Sort Explanation](https://www.youtube.com/watch?v=fmtk-5IUviU)** - Understanding bucket sort

---

## Follow-up Questions

### Q1: How would you modify to return the top K most frequent characters?

**Answer:** Instead of sorting all characters, use a heap of size K or use bucket sort and take only top K.

### Q2: What if you needed to do this in-place without extra space?

**Answer:** This is not possible for strings since strings are immutable in most languages. You'd need to work with a character array.

---

## Summary

The **Sort Characters By Frequency** problem demonstrates the power of bucket sort when we know the range of possible values (frequencies from 1 to n).

Key takeaways:
1. Count character frequencies using a hash map
2. Use bucket sort for O(n) solution - frequency cannot exceed n
3. Build result by traversing buckets from highest to lowest
4. Alternative approaches include sorting and heap-based solutions

This problem is a great example of choosing the right algorithm based on constraints.
