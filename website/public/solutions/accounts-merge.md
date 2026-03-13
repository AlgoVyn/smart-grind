# Accounts Merge

## Problem Description

Given a list of `accounts` where each element `accounts[i]` is a list of strings, where the first element `accounts[i][0]` is a name, and the rest of the elements are emails representing emails of the account.

Now, we would like to merge these accounts. Two accounts definitely belong to the same person if there is some common email to both accounts. Note that even if two accounts have the same name, they may belong to different people as people could have the same name. A person can have any number of accounts initially, but all of their accounts definitely have the same name.

After merging the accounts, return the accounts in the following format: the first element of each account is the name, and the rest of the elements are emails in sorted order. The accounts themselves can be returned in any order.

**Note:** This is LeetCode Problem 721. You can find the original problem [here](https://leetcode.com/problems/accounts-merge/).

---

## Examples

### Example

**Input:**
```python
accounts = [["John","johnsmith@mail.com","john_newyork@mail.com"],["John","johnsmith@mail.com","john00@mail.com"],["Mary","mary@mail.com"],["John","johnnybravo@mail.com"]]
```

**Output:**
```python
[["John","john00@mail.com","john_newyork@mail.com","johnsmith@mail.com"],["Mary","mary@mail.com"],["John","johnnybravo@mail.com"]]
```

**Explanation:** The first and second John's are the same person as they have the common email "johnsmith@mail.com". The third John and Mary are different people as none of their email addresses are used by other accounts.

### Example 2

**Input:**
```python
accounts = [["Gabe","Gabe0@m.co","Gabe3@m.co","Gabe1@m.co"],["Kevin","Kevin3@m.co","Kevin5@m.co","Kevin0@m.co"],["Ethan","Ethan5@m.co","Ethan4@m.co","Ethan0@m.co"],["Hanzo","Hanzo3@m.co","Hanzo1@m.co","Hanzo0@m.co"],["Fern","Fern5@m.co","Fern1@m.co","Fern0@m.co"]]
```

**Output:**
```python
[["Ethan","Ethan0@m.co","Ethan4@m.co","Ethan5@m.co"],["Gabe","Gabe0@m.co","Gabe1@m.co","Gabe3@m.co"],["Hanzo","Hanzo0@m.co","Hanzo1@m.co","Hanzo3@m.co"],["Kevin","Kevin0@m.co","Kevin3@m.co","Kevin5@m.co"],["Fern","Fern0@m.co","Fern1@m.co","Fern5@m.co"]]
```

---

## Constraints

- `1 <= accounts.length <= 1000`
- `2 <= accounts[i].length <= 10`
- `1 <= accounts[i][j].length <= 30`
- `accounts[i][0]` consists of English letters.
- `accounts[i][j]` (for j > 0) is a valid email.

---

## Pattern: Union-Find (Disjoint Set Union)

This problem is a classic example of the **Union-Find** pattern. The key insight is to treat each email as a node and connect emails that belong to the same account.

### Core Concept

- **Union-Find**: Efficiently connect and merge groups
- **Email Mapping**: Map each email to its account owner
- **Grouping**: Group emails by their root parent
- **Graph Alternative**: Can also use DFS/BFS on graph

---

## Intuition

The key insight for this problem is understanding how to identify and merge accounts that belong to the same person.

### Key Observations

1. **Email is Unique Identifier**: Each email uniquely identifies a person across accounts

2. **Shared Email = Same Person**: If two accounts share any email, they belong to the same person

3. **Union-Find for Grouping**: Use Union-Find to group all emails that should be merged

4. **Name Association**: Keep track of which name belongs to each email

5. **Sorting Required**: Final output requires sorted emails within each merged account

### Algorithm Overview

1. **Initialize Union-Find**: Create parent dictionary for each unique email
2. **Union Emails**: For each account, union all emails together
3. **Build Groups**: Group emails by their root parent
4. **Sort & Format**: Sort emails in each group, prepend name
5. **Return Result**: Return all merged accounts

---

## Multiple Approaches with Code

We'll cover two approaches:

1. **Union-Find** - Optimal solution
2. **Graph with DFS** - Alternative approach

---

## Approach 1: Union-Find (Optimal)

### Algorithm Steps

1. Initialize parent dictionary and email-to-name mapping
2. For each account:
   - Get the name (first element)
   - For each email, add to email_to_name mapping
   - Initialize email in parent if not exists
   - Union all emails in the account with the first email
3. After processing all accounts, group emails by root parent
4. For each group:
   - Sort emails
   - Prepend name
   - Add to result

### Why It Works

The Union-Find approach works because:
- Union-Find efficiently tracks connected components
- By unioning all emails in each account, we connect accounts sharing emails
- The find operation reveals which emails belong to same person
- Path compression ensures near O(1) operations

### Code Implementation

````carousel
```python
from typing import List
from collections import defaultdict

class Solution:
    def accountsMerge(self, accounts: List[List[str]]) -> List[List[str]]:
        """
        Merge accounts using Union-Find.
        
        Args:
            accounts: List of account information
            
        Returns:
            Merged accounts list
        """
        # Union-Find with path compression
        parent = {}
        email_to_name = {}
        
        def find(x):
            """Find root with path compression."""
            if parent[x] != x:
                parent[x] = find(parent[x])
            return parent[x]
        
        def union(x, y):
            """Union two emails."""
            px, py = find(x), find(y)
            if px != py:
                parent[px] = py
        
        # Process all accounts
        for account in accounts:
            name = account[0]
            first_email = account[1]
            
            # Map all emails to name
            for email in account[1:]:
                email_to_name[email] = name
                # Initialize parent if not seen before
                if email not in parent:
                    parent[email] = email
            
            # Union all emails in this account
            for email in account[2:]:
                union(first_email, email)
        
        # Group emails by their root parent
        groups = defaultdict(list)
        for email in parent:
            root = find(email)
            groups[root].append(email)
        
        # Build result
        result = []
        for emails in groups.values():
            # Sort emails and prepend name
            result.append([email_to_name[emails[0]]] + sorted(emails))
        
        return result
```

<!-- slide -->
```cpp
#include <vector>
#include <string>
#include <unordered_map>
#include <unordered_set>
#include <algorithm>
using namespace std;

class Solution {
private:
    unordered_map<string, string> parent;
    unordered_map<string, string> emailToName;
    
    string find(string x) {
        if (parent[x] != x) {
            parent[x] = find(parent[x]);
        }
        return parent[x];
    }
    
    void unite(string x, string y) {
        string px = find(x), py = find(y);
        if (px != py) {
            parent[px] = py;
        }
    }
    
public:
    vector<vector<string>> accountsMerge(vector<vector<string>>& accounts) {
        // Process all accounts
        for (const auto& account : accounts) {
            const string& name = account[0];
            const string& firstEmail = account[1];
            
            // Map all emails to name
            for (size_t i = 1; i < account.size(); i++) {
                const string& email = account[i];
                emailToName[email] = name;
                if (parent.find(email) == parent.end()) {
                    parent[email] = email;
                }
            }
            
            // Union all emails in this account
            for (size_t i = 2; i < account.size(); i++) {
                unite(firstEmail, account[i]);
            }
        }
        
        // Group emails by root parent
        unordered_map<string, vector<string>> groups;
        for (const auto& p : parent) {
            string root = find(p.first);
            groups[root].push_back(p.first);
        }
        
        // Build result
        vector<vector<string>> result;
        for (auto& g : groups) {
            vector<string> emails = g.second;
            sort(emails.begin(), emails.end());
            vector<string> merged;
            merged.push_back(emailToName[emails[0]]);
            merged.insert(merged.end(), emails.begin(), emails.end());
            result.push_back(merged);
        }
        
        return result;
    }
};
```

<!-- slide -->
```java
import java.util.*;

class Solution {
    private Map<String, String> parent = new HashMap<>();
    private Map<String, String> emailToName = new HashMap<>();
    
    private String find(String x) {
        if (!parent.get(x).equals(x)) {
            parent.put(x, find(parent.get(x)));
        }
        return parent.get(x);
    }
    
    private void union(String x, String y) {
        String px = find(x);
        String py = find(y);
        if (!px.equals(py)) {
            parent.put(px, py);
        }
    }
    
    public List<List<String>> accountsMerge(List<List<String>> accounts) {
        // Process all accounts
        for (List<String> account : accounts) {
            String name = account.get(0);
            String firstEmail = account.get(1);
            
            // Map all emails to name
            for (int i = 1; i < account.size(); i++) {
                String email = account.get(i);
                emailToName.put(email, name);
                parent.putIfAbsent(email, email);
            }
            
            // Union all emails in this account
            for (int i = 2; i < account.size(); i++) {
                union(firstEmail, account.get(i));
            }
        }
        
        // Group emails by root parent
        Map<String, List<String>> groups = new HashMap<>();
        for (String email : parent.keySet()) {
            String root = find(email);
            groups.computeIfAbsent(root, k -> new ArrayList<>()).add(email);
        }
        
        // Build result
        List<List<String>> result = new ArrayList<>();
        for (List<String> emails : groups.values()) {
            Collections.sort(emails);
            List<String> merged = new ArrayList<>();
            merged.add(emailToName.get(emails.get(0)));
            merged.addAll(emails);
            result.add(merged);
        }
        
        return result;
    }
}
```

<!-- slide -->
```javascript
/**
 * @param {string[][]} accounts
 * @return {string[][]}
 */
var accountsMerge = function(accounts) {
    const parent = new Map();
    const emailToName = new Map();
    
    function find(x) {
        if (parent.get(x) !== x) {
            parent.set(x, find(parent.get(x)));
        }
        return parent.get(x);
    }
    
    function union(x, y) {
        const px = find(x);
        const py = find(y);
        if (px !== py) {
            parent.set(px, py);
        }
    }
    
    // Process all accounts
    for (const account of accounts) {
        const name = account[0];
        const firstEmail = account[1];
        
        // Map all emails to name
        for (let i = 1; i < account.length; i++) {
            const email = account[i];
            emailToName.set(email, name);
            if (!parent.has(email)) {
                parent.set(email, email);
            }
        }
        
        // Union all emails in this account
        for (let i = 2; i < account.length; i++) {
            union(firstEmail, account[i]);
        }
    }
    
    // Group emails by root parent
    const groups = new Map();
    for (const email of parent.keys()) {
        const root = find(email);
        if (!groups.has(root)) {
            groups.set(root, []);
        }
        groups.get(root).push(email);
    }
    
    // Build result
    const result = [];
    for (const emails of groups.values()) {
        emails.sort();
        const merged = [emailToName.get(emails[0]), ...emails];
        result.push(merged);
    }
    
    return result;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(N log N) - where N is total emails, sorting dominates |
| **Space** | O(N) - for parent, email-to-name mapping, groups |

---

## Approach 2: Graph with DFS

### Algorithm Steps

1. Build adjacency list (graph) where each email connects to other emails in same account
2. Use visited set to track processed emails
3. DFS from each unvisited email to collect all connected emails
4. Sort collected emails and prepend name
5. Continue until all emails processed

### Why It Works

The graph approach works because:
- Building a graph connects all emails that appear in same account
- DFS explores all connected components (merged accounts)
- Each connected component represents one merged account

### Code Implementation

````carousel
```python
from typing import List
from collections import defaultdict

class Solution:
    def accountsMerge(self, accounts: List[List[str]]) -> List[List[str]]:
        """Using graph with DFS."""
        # Build graph: email -> set of connected emails
        graph = defaultdict(set)
        email_to_name = {}
        
        for account in accounts:
            name = account[0]
            first_email = account[1]
            
            for email in account[1:]:
                email_to_name[email] = name
                graph[first_email].add(email)
                graph[email].add(first_email)
        
        # DFS to find all connected emails
        visited = set()
        result = []
        
        def dfs(email, component):
            visited.add(email)
            component.append(email)
            for neighbor in graph[email]:
                if neighbor not in visited:
                    dfs(neighbor, component)
        
        # Process each email
        for email in graph:
            if email not in visited:
                component = []
                dfs(email, component)
                result.append([email_to_name[email]] + sorted(component))
        
        return result
```

<!-- slide -->
```cpp
class Solution {
private:
    unordered_map<string, vector<string>> graph;
    unordered_map<string, string> emailToName;
    unordered_set<string> visited;
    
    void dfs(const string& email, vector<string>& component) {
        visited.insert(email);
        component.push_back(email);
        
        for (const string& neighbor : graph[email]) {
            if (visited.find(neighbor) == visited.end()) {
                dfs(neighbor, component);
            }
        }
    }
    
public:
    vector<vector<string>> accountsMerge(vector<vector<string>>& accounts) {
        // Build graph
        for (const auto& account : accounts) {
            const string& name = account[0];
            const string& firstEmail = account[1];
            
            for (size_t i = 1; i < account.size(); i++) {
                const string& email = account[i];
                emailToName[email] = name;
                graph[firstEmail].push_back(email);
                graph[email].push_back(firstEmail);
            }
        }
        
        // DFS
        vector<vector<string>> result;
        for (const auto& p : graph) {
            const string& email = p.first;
            if (visited.find(email) == visited.end()) {
                vector<string> component;
                dfs(email, component);
                sort(component.begin(), component.end());
                component.insert(component.begin(), emailToName[email]);
                result.push_back(component);
            }
        }
        
        return result;
    }
};
```

<!-- slide -->
```java
class Solution {
    private Map<String, List<String>> graph = new HashMap<>();
    private Map<String, String> emailToName = new HashMap<>();
    private Set<String> visited = new HashSet<>();
    
    private void dfs(String email, List<String> component) {
        visited.add(email);
        component.add(email);
        
        for (String neighbor : graph.getOrDefault(email, new ArrayList<>())) {
            if (!visited.contains(neighbor)) {
                dfs(neighbor, component);
            }
        }
    }
    
    public List<List<String>> accountsMerge(List<List<String>> accounts) {
        // Build graph
        for (List<String> account : accounts) {
            String name = account.get(0);
            String firstEmail = account.get(1);
            
            for (int i = 1; i < account.size(); i++) {
                String email = account.get(i);
                emailToName.put(email, name);
                graph.computeIfAbsent(firstEmail, k -> new ArrayList<>()).add(email);
                graph.computeIfAbsent(email, k -> new ArrayList<>()).add(firstEmail);
            }
        }
        
        // DFS
        List<List<String>> result = new ArrayList<>();
        for (String email : graph.keySet()) {
            if (!visited.contains(email)) {
                List<String> component = new ArrayList<>();
                dfs(email, component);
                Collections.sort(component);
                component.add(0, emailToName.get(email));
                result.add(component);
            }
        }
        
        return result;
    }
}
```

<!-- slide -->
```javascript
var accountsMerge = function(accounts) {
    const graph = new Map();
    const emailToName = new Map();
    const visited = new Set();
    
    function dfs(email, component) {
        visited.add(email);
        component.push(email);
        
        for (const neighbor of (graph.get(email) || [])) {
            if (!visited.has(neighbor)) {
                dfs(neighbor, component);
            }
        }
    }
    
    // Build graph
    for (const account of accounts) {
        const name = account[0];
        const firstEmail = account[1];
        
        for (let i = 1; i < account.length; i++) {
            const email = account[i];
            emailToName.set(email, name);
            
            if (!graph.has(firstEmail)) graph.set(firstEmail, []);
            if (!graph.has(email)) graph.set(email, []);
            
            graph.get(firstEmail).push(email);
            graph.get(email).push(firstEmail);
        }
    }
    
    // DFS
    const result = [];
    for (const email of graph.keys()) {
        if (!visited.has(email)) {
            const component = [];
            dfs(email, component);
            component.sort();
            component.unshift(emailToName.get(email));
            result.push(component);
        }
    }
    
    return result;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(N log N) - building graph + DFS + sorting |
| **Space** | O(N) - for graph and visited set |

---

## Comparison of Approaches

| Aspect | Union-Find | Graph DFS |
|--------|------------|-----------|
| **Time Complexity** | O(N log N) | O(N log N) |
| **Space Complexity** | O(N) | O(N) |
| **Implementation** | Moderate | Moderate |
| **LeetCode Optimal** | ✅ | ✅ |
| **Difficulty** | Medium | Medium |

**Best Approach:** Use Approach 1 (Union-Find) for its efficiency and simplicity.

---

## Why This Problem is Important

### Interview Relevance

- **Frequency**: Commonly asked in technical interviews
- **Companies**: Google, Facebook, Amazon
- **Difficulty**: Medium
- **Concepts Tested**: Union-Find, Graph Theory, Hash Maps

### Learning Outcomes

1. **Union-Find Mastery**: Learn efficient DSU operations
2. **Graph Building**: Convert problem to graph connectivity
3. **Grouping**: Efficiently group connected components
4. **Data Structure Selection**: Choose right DS for problem

---

## Related Problems

Based on similar themes (Union-Find, connectivity):

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Number of Provinces | [Link](https://leetcode.com/problems/number-of-provinces/) | Connected components |
| Graph Valid Tree | [Link](https://leetcode.com/problems/valid-tree/) | Union-Find connectivity |
| Most Stones Removed | [Link](https://leetcode.com/problems/most-stones-removed-with-same-row-or-column/) | Remove stones |
| Friend Circles | [Link](https://leetcode.com/problems/friend-circles/) | Friend groups |

### Pattern Reference

For more detailed explanations of Union-Find pattern, see:
- **[Union-Find Pattern](/patterns/union-find)**

---

## Video Tutorial Links

### Recommended Tutorials

1. **[NeetCode - Accounts Merge](https://www.youtube.com/watch?v=3QIdU8g4lQ)** - Clear explanation
2. **[Accounts Merge - LeetCode 721](https://www.youtube.com/watch?v=2qF2wYvF3p8)** - Detailed walkthrough

---

## Follow-up Questions

### Q1: How would you handle accounts with same name but different people?

**Answer:** The algorithm already handles this correctly - accounts are merged only if they share emails, not just names.

### Q2: How would you return the number of merged accounts?

**Answer:** Count the number of groups after Union-Find processing - equals number of unique roots.

### Q3: How would you handle invalid email formats?

**Answer:** Add validation before processing. Skip or filter invalid emails.

### Q4: Can you solve this with BFS instead of DFS?

**Answer:** Yes, use BFS to traverse the graph and collect all connected emails.

---

## Common Pitfalls

### 1. Not Initializing Parent for All Emails
**Issue:** Some emails not in parent dictionary.

**Solution:** Initialize each email with itself as parent when first seen.

### 2. Not Handling Path Compression
**Issue:** Union-Find becomes slow without path compression.

**Solution:** Implement find with path compression: `parent[x] = find(parent[x])`.

### 3. Forgetting Email to Name Mapping
**Issue:** Not tracking which name belongs to which email.

**Solution:** Store email_to_name mapping for all emails.

### 4. Not Sorting Emails
**Issue:** Returning unsorted emails in each group.

**Solution:** Sort emails before adding to result.

### 5. Processing Order
**Issue:** Processing emails in wrong order causing issues.

**Solution:** Process all unions first, then group results.

---

## Summary

The **Accounts Merge** problem demonstrates the **Union-Find** pattern:

- **Union-Find**: Efficiently connect emails belonging to same person
- **Email Mapping**: Track name for each email
- **Grouping**: Group emails by root parent
- **Time complexity**: O(N log N) - optimal

Key takeaways:
1. Union all emails within each account
2. Use find to get root parent for grouping
3. Sort emails in each merged account
4. Associate correct name with each group

This pattern extends to:
- Friend circles problems
- Number of connected components
- Graph connectivity problems

---

## Additional Resources

- [LeetCode Problem 721](https://leetcode.com/problems/accounts-merge/) - Official problem page
- [Union-Find - GeeksforGeeks](https://www.geeksforgeeks.org/union-find/) - Detailed explanation
- [Pattern: Union-Find](/patterns/union-find) - Comprehensive pattern guide
