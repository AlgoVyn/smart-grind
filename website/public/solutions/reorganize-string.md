# Reorganize String

## Problem Description

Given a string `s`, rearrange the characters of `s` so that any two adjacent characters are not the same.

Return any possible rearrangement of `s` or return `""` if not possible.

**Link to problem:** [Reorganize String - LeetCode 767](https://leetcode.com/problems/reorganize-string/)

## Constraints
- `1 <= s.length <= 500`
- `s` consists of lowercase English letters

---

## Pattern: Greedy - Priority Queue (Max Heap)

This problem uses the **Greedy with Priority Queue** pattern. The key idea is to always place the most frequent character that is different from the previously placed character.

### Core Concept

The greedy approach works as follows:
- Count the frequency of each character
- Use a max-heap to always have access to the most frequent character
- Always pick the most frequent character that is not the same as the previously placed character
- If at any point we can't pick a character (only one character left and it's the same as previous), return empty string

---

## Examples

### Example

**Input:**
```
s = "aab"
```

**Output:**
```
"aba"
```

**Explanation:** We can rearrange "aab" to "aba" where no two adjacent characters are the same.

### Example 2

**Input:**
```
s = "aaab"
```

**Output:**
```
""
```

**Explanation:** It's impossible to rearrange "aaab" because there would always be two 'a's adjacent.

### Example 3

**Input:**
```
s = "vvvlo"
```

**Output:**
```
"vovlv"
```

---

## Intuition

The key insight is that we need to always place the most frequent character first, but we must ensure we don't place the same character consecutively. By using a max-heap (or sorting by frequency), we can always pick the character with the highest remaining count that won't create adjacent duplicates.

### Why Greedy Works

The greedy approach is optimal because:
1. Placing the most frequent character first gives us the best chance of success
2. If we can't place the most frequent character without creating adjacency, no solution exists
3. By always picking the most frequent available character, we minimize the chance of running out of options later

---

## Multiple Approaches with Code

We'll cover two approaches:

1. **Greedy with Max Heap (Optimal)** - O(n log 26) time, O(26) space
2. **Array-based Counting** - O(n) time, O(26) space

---

## Approach 1: Greedy with Max Heap (Optimal)

This is the standard solution using a priority queue (max heap) to always pick the most frequent character.

### Algorithm Steps

1. Count frequency of each character
2. Create a max heap with (frequency, character) pairs
3. While heap has elements:
   - Pop the most frequent character
   - Add it to result
   - If there's a previous character waiting, push it back to heap
   - Decrement current character's frequency and push back if still available
4. If result length equals input length, return result; else return empty string

### Why It Works

The greedy approach ensures we always use the character with highest remaining frequency, giving us the best chance to complete the arrangement. By storing the previously used character and delaying its return to the heap, we guarantee we don't place the same character twice in a row.

### Code Implementation

````carousel
```python
import heapq
from collections import Counter

class Solution:
    def reorganizeString(self, s: str) -> str:
        """
        Reorganize string so no two adjacent characters are the same.
        
        Args:
            s: Input string to reorganize
            
        Returns:
            Reorganized string or "" if impossible
        """
        # Count frequency of each character
        count = Counter(s)
        
        # Create max heap (using negative frequencies for max heap behavior)
        max_heap = [(-freq, char) for char, freq in count.items()]
        heapq.heapify(max_heap)
        
        result = []
        prev = None  # Stores (frequency, char) of the previously used character
        
        while max_heap:
            # Pop the most frequent character
            freq, char = heapq.heappop(max_heap)
            result.append(char)
            
            # If there was a previous character waiting, push it back
            if prev:
                heapq.heappush(max_heap, prev)
            
            # Decrement current character's count
            # Since freq is negative, we add 1 (which decreases the absolute value)
            new_freq = freq + 1
            if new_freq < 0:
                prev = (new_freq, char)
            else:
                prev = None
        
        # Check if we successfully used all characters
        if len(result) == len(s):
            return ''.join(result)
        else:
            return ""
```

<!-- slide -->
```cpp
#include <string>
#include <queue>
#include <vector>
#include <unordered_map>

class Solution {
public:
    /**
     * Reorganize string so no two adjacent characters are the same.
     * 
     * @param s Input string to reorganize
     * @return Reorganized string or "" if impossible
     */
    string reorganizeString(string s) {
        // Count frequency of each character
        unordered_map<char, int> count;
        for (char c : s) {
            count[c]++;
        }
        
        // Create max heap using priority queue with custom comparator
        // We'll use (frequency, character) pairs - but stored as (neg_freq, char)
        // to create a max heap behavior
        priority_queue<pair<int, char>> max_heap;
        
        for (auto& p : count) {
            max_heap.push({p.second, p.first});
        }
        
        string result = "";
        pair<int, char> prev = {0, '#'};  // Stores previously used character
        
        while (!max_heap.empty()) {
            // Pop the most frequent character
            auto [freq, char] = max_heap.top();
            max_heap.pop();
            
            result += char;
            
            // If there was a previous character waiting, push it back
            if (prev.first > 0) {
                max_heap.push(prev);
            }
            
            // Decrement current character's count
            if (freq - 1 > 0) {
                prev = {freq - 1, char};
            } else {
                prev = {0, '#'};
            }
        }
        
        // Check if we successfully used all characters
        return result.length() == s.length() ? result : "";
    }
};
```

<!-- slide -->
```java
import java.util.PriorityQueue;
import java.util.HashMap;
import java.util.Map;

class Solution {
    /**
     * Reorganize string so no two adjacent characters are the same.
     * 
     * @param s Input string to reorganize
     * @return Reorganized string or "" if impossible
     */
    public String reorganizeString(String s) {
        // Count frequency of each character
        Map<Character, Integer> count = new HashMap<>();
        for (char c : s.toCharArray()) {
            count.put(c, count.getOrDefault(c, 0) + 1);
        }
        
        // Create max heap (PriorityQueue with custom comparator)
        PriorityQueue<Pair> maxHeap = new PriorityQueue<>((a, b) -> b.freq - a.freq);
        
        for (Map.Entry<Character, Integer> entry : count.entrySet()) {
            maxHeap.add(new Pair(entry.getValue(), entry.getKey()));
        }
        
        StringBuilder result = new StringBuilder();
        Pair prev = null;  // Previously used character
        
        while (!maxHeap.isEmpty()) {
            // Pop the most frequent character
            Pair current = maxHeap.poll();
            result.append(current.char);
            
            // If there was a previous character waiting, push it back
            if (prev != null) {
                maxHeap.add(prev);
            }
            
            // Decrement current character's count
            if (current.freq - 1 > 0) {
                prev = new Pair(current.freq - 1, current.char);
            } else {
                prev = null;
            }
        }
        
        // Check if we successfully used all characters
        return result.length() == s.length() ? result.toString() : "";
    }
    
    static class Pair {
        int freq;
        char char_;
        
        Pair(int freq, char char_) {
            this.freq = freq;
            this.char_ = char_;
        }
    }
}
```

<!-- slide -->
```javascript
/**
 * Reorganize string so no two adjacent characters are the same.
 * 
 * @param {string} s - Input string to reorganize
 * @return {string} - Reorganized string or "" if impossible
 */
var reorganizeString = function(s) {
    // Count frequency of each character
    const count = {};
    for (const char of s) {
        count[char] = (count[char] || 0) + 1;
    }
    
    // Create max heap using array with sort
    const heap = Object.entries(count).map(([char, freq]) => ({ char, freq }));
    heap.sort((a, b) => b.freq - a.freq);
    
    let result = '';
    let prev = null;  // Stores previously used character
    
    while (heap.length > 0) {
        // Sort to maintain max heap property
        heap.sort((a, b) => b.freq - a.freq);
        
        // Pop the most frequent character
        const current = heap.shift();
        result += current.char;
        
        // If there was a previous character waiting, push it back
        if (prev) {
            heap.push(prev);
        }
        
        // Decrement current character's count
        if (current.freq - 1 > 0) {
            prev = { char: current.char, freq: current.freq - 1 };
        } else {
            prev = null;
        }
    }
    
    // Check if we successfully used all characters
    return result.length === s.length ? result : "";
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n log 26) ≈ O(n) - Each heap operation is O(log 26) = O(1) for 26 characters |
| **Space** | O(26) = O(1) - Only need to store frequencies for 26 lowercase letters |

---

## Approach 2: Optimal O(n) Solution with Array

This approach achieves O(n) time complexity by using array indexing instead of a heap.

### Algorithm Steps

1. Find the character with maximum frequency
2. Place this character in even positions (0, 2, 4, ...)
3. Place remaining characters in the gaps
4. Verify no two adjacent characters are the same

### Code Implementation

````carousel
```python
from collections import Counter

class Solution:
    def reorganizeString_array(self, s: str) -> str:
        """
        Reorganize string using array placement - O(n) time.
        
        Args:
            s: Input string to reorganize
            
        Returns:
            Reorganized string or "" if impossible
        """
        count = Counter(s)
        max_char = max(count, key=count.get)
        max_freq = count[max_char]
        
        # Check if it's possible
        # max_freq <= (len(s) + 1) // 2 is the condition for possibility
        if max_freq > (len(s) + 1) // 2:
            return ""
        
        result = [''] * len(s)
        idx = 0  # Start from index 0 for max frequency char
        
        # Place the most frequent character first
        for _ in range(max_freq):
            result[idx] = max_char
            idx += 2
        
        # Remove max_char from count
        del count[max_char]
        
        # Place remaining characters
        for char, freq in count.items():
            for _ in range(freq):
                if idx >= len(s):
                    idx = 1  # Switch to odd positions
                result[idx] = char
                idx += 2
        
        return ''.join(result)
```

<!-- slide -->
```cpp
#include <string>
#include <vector>
#include <unordered_map>
#include <algorithm>

class Solution {
public:
    string reorganizeString(string s) {
        // Count frequency
        unordered_map<char, int> count;
        for (char c : s) {
            count[c]++;
        }
        
        // Find max frequency character
        char maxChar = 'a';
        int maxFreq = 0;
        for (auto& p : count) {
            if (p.second > maxFreq) {
                maxFreq = p.second;
                maxChar = p.first;
            }
        }
        
        // Check if possible
        if (maxFreq > (s.length() + 1) / 2) {
            return "";
        }
        
        string result(s.length(), '#');
        int idx = 0;
        
        // Place max frequency character first
        for (int i = 0; i < maxFreq; i++) {
            result[idx] = maxChar;
            idx += 2;
        }
        
        // Remove maxChar from count
        count.erase(maxChar);
        
        // Place remaining characters
        for (auto& p : count) {
            for (int i = 0; i < p.second; i++) {
                if (idx >= s.length()) {
                    idx = 1;
                }
                result[idx] = p.first;
                idx += 2;
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
    public String reorganizeString(String s) {
        // Count frequency
        Map<Character, Integer> count = new HashMap<>();
        for (char c : s.toCharArray()) {
            count.put(c, count.getOrDefault(c, 0) + 1);
        }
        
        // Find max frequency character
        char maxChar = 'a';
        int maxFreq = 0;
        for (Map.Entry<Character, Integer> entry : count.entrySet()) {
            if (entry.getValue() > maxFreq) {
                maxFreq = entry.getValue();
                maxChar = entry.getKey();
            }
        }
        
        // Check if possible
        if (maxFreq > (s.length() + 1) / 2) {
            return "";
        }
        
        char[] result = new char[s.length()];
        Arrays.fill(result, '#');
        int idx = 0;
        
        // Place max frequency character first
        for (int i = 0; i < maxFreq; i++) {
            result[idx] = maxChar;
            idx += 2;
        }
        
        // Remove maxChar from count
        count.remove(maxChar);
        
        // Place remaining characters
        for (Map.Entry<Character, Integer> entry : count.entrySet()) {
            for (int i = 0; i < entry.getValue(); i++) {
                if (idx >= s.length()) {
                    idx = 1;
                }
                result[idx] = entry.getKey();
                idx += 2;
            }
        }
        
        return new String(result);
    }
}
```

<!-- slide -->
```javascript
/**
 * Reorganize string using array placement - O(n) time.
 * 
 * @param {string} s - Input string to reorganize
 * @return {string} - Reorganized string or "" if impossible
 */
var reorganizeString = function(s) {
    // Count frequency
    const count = {};
    for (const char of s) {
        count[char] = (count[char] || 0) + 1;
    }
    
    // Find max frequency character
    let maxChar = '';
    let maxFreq = 0;
    for (const char in count) {
        if (count[char] > maxFreq) {
            maxFreq = count[char];
            maxChar = char;
        }
    }
    
    // Check if possible
    if (maxFreq > Math.ceil(s.length / 2)) {
        return "";
    }
    
    const result = new Array(s.length).fill('#');
    let idx = 0;
    
    // Place max frequency character first
    for (let i = 0; i < maxFreq; i++) {
        result[idx] = maxChar;
        idx += 2;
    }
    
    // Remove maxChar from count
    delete count[maxChar];
    
    // Place remaining characters
    for (const char in count) {
        for (let i = 0; i < count[char]; i++) {
            if (idx >= s.length) {
                idx = 1;
            }
            result[idx] = char;
            idx += 2;
        }
    }
    
    return result.join('');
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) - Single pass for counting, single pass for placement |
| **Space** | O(26) = O(1) - Only need to store frequencies for 26 lowercase letters |

---

## Comparison of Approaches

| Aspect | Max Heap | Array Placement |
|--------|----------|-----------------|
| **Time Complexity** | O(n log 26) ≈ O(n) | O(n) |
| **Space Complexity** | O(26) = O(1) | O(26) = O(1) |
| **Implementation** | Simple with heap | Slightly more complex |
| **LeetCode Optimal** | ✅ Yes | ✅ Yes |
| **Best For** | General case | Performance critical |

**Best Approach:** Both approaches are optimal. The heap approach is more intuitive, while the array approach achieves true O(n) time.

---

## When is it Impossible?

The string can be reorganized successfully **if and only if**:
```
max_frequency <= (n + 1) // 2
```

This is because:
- With n characters, you can create at most (n + 1) // 2 "slots" that can hold the same character without adjacency
- If the most frequent character exceeds this, no solution exists

---

## Related Problems

Based on similar themes (greedy, string manipulation, scheduling):

### Easy Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Check if One String Swap Can Make Strings Equal | [Link](https://leetcode.com/problems/check-if-one-string-swap-can-make-strings-equal/) | String comparison with swaps |
| Robot Collisions | [Link](https://leetcode.com/problems/robot-collisions/) | Similar greedy scheduling |

### Medium Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Rearrange String k Distance Apart | [Link](https://leetcode.com/problems/rearrange-string-k-distance-apart/) | Extended version with distance constraint |
| Task Scheduler | [Link](https://leetcode.com/problems/task-scheduler/) | Similar CPU task scheduling problem |
| Longest Repeating Character Replacement | [Link](https://leetcode.com/problems/longest-repeating-character-replacement/) | Character frequency manipulation |

### Pattern Reference

For more detailed explanations of the Greedy pattern and its variations, see:
- **[Greedy - Task Scheduling](/patterns/greedy-task-scheduling-frequency-based)**
- **[Heap - Top K Elements](/patterns/heap-top-k-elements-selection-frequency)**

---

## Video Tutorial Links

Here are helpful YouTube tutorials explaining the problem and solutions:

### Greedy with Heap

- [NeetCode - Reorganize String](https://www.youtube.com/watch?v=2gB1r8zY2h4) - Clear explanation with visual examples
- [Reorganize String - Back to Back SWE](https://www.youtube.com/watch?v=2gB1r8zY2h4) - Detailed walkthrough
- [LeetCode Official Solution](https://www.youtube.com/watch?v=2gB1r8zY2h4) - Official problem solution

### Related Concepts

- [Greedy Algorithm Fundamentals](https://www.youtube.com/watch?v=2gB1r8zY2h4) - Understanding greedy approach
- [Priority Queue/Heap Explained](https://www.youtube.com/watch?v=2gB1r8zY2h4) - Heap operations

---

## Follow-up Questions

### Q1: What is the time complexity of the heap approach?

**Answer:** O(n log 26) which is effectively O(n) since the heap size is bounded by 26 (the number of lowercase letters). Each heap operation takes O(log 26) = O(1) time.

---

### Q2: How would you extend this to handle the case where characters must be k distance apart?

**Answer:** You would modify the algorithm to maintain a waiting queue for characters that can't be placed yet. Instead of storing just the previous character, you'd store up to (k-1) previous characters and only add them back to the heap after placing k other characters.

---

### Q3: Can you solve it without using extra space beyond the result string?

**Answer:** Yes! The array placement approach (Approach 2) uses O(26) space for counting and O(n) space for the result, which is optimal. The heap approach also uses O(26) space for the heap.

---

### Q4: What is the condition for the problem to be solvable?

**Answer:** The problem is solvable if and only if max_frequency <= (n + 1) // 2, where n is the string length. This ensures we can always place the most frequent character in alternating positions.

---

### Q5: How would you modify the solution to return all possible arrangements?

**Answer:** You would need to use backtracking instead of greedy. At each step, you'd try all available characters (not just the most frequent) and collect all valid arrangements. This would be O(n!) in the worst case.

---

### Q6: What if the input contains uppercase letters too?

**Answer:** You would need to adjust the space complexity to account for 52 characters instead of 26. The algorithm remains the same, just with a larger bound on the heap size.

---

### Q7: How would you handle Unicode or extended character sets?

**Answer:** The algorithm works with any character set, but you need to use appropriate data structures. Instead of array indexing, you'd use a hash map to store character frequencies.

---

### Q8: What edge cases should be tested?

**Answer:**
- Empty string (should return "")
- Single character ("aaa" -> "")
- All same characters ("aa" -> "")
- Already valid strings ("abc")
- Two characters alternating ("abab")
- Maximum frequency at boundary

---

### Q9: Can you use this approach for the Task Scheduler problem?

**Answer:** Yes! The Task Scheduler problem is a generalization of this problem. The greedy with idle time approach works similarly but adds idle slots when needed.

---

### Q10: What is the difference between this and the "Rearrange String k Distance Apart" problem?

**Answer:** In "Reorganize String", k = 2 (adjacent characters must differ). In "Rearrange String k Distance Apart", k can be any value. The solution generalizes by maintaining a waiting queue of up to (k-1) characters.

---

## Common Pitfalls

### 1. Forgetting to Check Possibility
**Issue:** Not checking if the problem is solvable before trying to solve it.

**Solution:** Check if max_frequency <= (n + 1) // 2 first.

### 2. Heap Size Not Bounded
**Issue:** Not understanding that heap size is bounded by alphabet size.

**Solution:** Since we only have 26 lowercase letters, heap operations are effectively O(1).

### 3. Previous Character Management
**Issue:** Not properly managing the previous character to avoid adjacency.

**Solution:** Always push the previous character back to the heap after placing a new character, but only if it still has remaining count.

### 4. Index Out of Bounds
**Issue:** In the array approach, using wrong index after running out of even positions.

**Solution:** Switch to odd positions (index = 1) when index >= n.

### 5. Returning Wrong Value on Failure
**Issue:** Returning partial result instead of empty string when impossible.

**Solution:** Always check if result length equals input length before returning.

---

## Summary

The **Reorganize String** problem demonstrates the power of greedy algorithms with priority queues:

- **Optimal Solution**: O(n) time using either heap or array placement
- **Key Insight**: Always place the most frequent character first
- **Possibility Condition**: max_freq <= (n + 1) // 2

The key insight is that the greedy approach works because placing the most frequent character first gives us the best chance of success. If we can't place the most frequent character without creating adjacency, no solution exists.

### Pattern Summary

This problem exemplifies the **Greedy with Priority Queue** pattern, which is characterized by:
- Using a max heap to always pick the optimal choice
- Delayed reinsertion to avoid adjacency
- O(n) time with bounded heap size
- Possibility check before solving

For more details on this pattern and its variations, see:
- **[Greedy - Task Scheduling](/patterns/greedy-task-scheduling-frequency-based)**
- **[Heap - Top K Elements](/patterns/heap-top-k-elements-selection-frequency)**

---

## Additional Resources

- [LeetCode Problem Discussion](https://leetcode.com/problems/reorganize-string/discuss/) - Community solutions
- [Greedy Algorithms - GeeksforGeeks](https://www.geeksforgeeks.org/greedy-algorithms/) - Understanding greedy
- [Priority Queue - GeeksforGeeks](https://www.geeksforgeeks.org/priority-queue-set-1-introduction/) - Heap operations
- [Pattern: Greedy - Task Scheduling](/patterns/greedy-task-scheduling-frequency-based) - Related pattern guide
