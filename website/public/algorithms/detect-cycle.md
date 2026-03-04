# Detect Cycle (Floyd's Tortoise and Hare)

## Category
Linked List

## Description
Floyd's Tortoise and Hare algorithm (also known as cycle detection) is an efficient algorithm to detect if a linked list has a cycle. It's named after the two pointers that move at different speeds - like the fabled race between a tortoise and a hare. This algorithm is a fundamental technique in computer science for detecting cycles in linked lists and other data structures.

---

## When to Use

Use Floyd's Cycle Detection algorithm when you need to solve problems involving:

- **Linked List Cycle Detection**: Determining if a singly or doubly linked list contains a cycle
- **Finding Cycle Start**: Locating where a cycle begins in a linked list
- **Meeting Point Detection**: Finding if two paths ever meet in a graph or sequence
- **Periodic Sequence Detection**: Identifying repeating patterns in sequences
- **Space-Constrained Solutions**: When O(1) space complexity is required

### Comparison with Alternatives

| Algorithm | Time Complexity | Space Complexity | Can Find Cycle Start | Notes |
|-----------|-----------------|------------------|---------------------|-------|
| **Floyd's (Tortoise & Hare)** | O(n) | O(1) | ✅ Yes | Optimal for linked lists |
| **Hash Set** | O(n) | O(n) | ❌ No | Stores visited nodes |
| **Mark Visited (Modify List)** | O(n) | O(1) | ❌ No | Modifies the list |
| **Brute Force** | O(n²) | O(1) | ❌ No | Follow each node's path |

### When to Choose Floyd's vs Hash Set

- **Choose Floyd's Algorithm** when:
  - You need O(1) space complexity
  - You cannot modify the linked list
  - You need to find where the cycle starts
  - Memory is constrained

- **Choose Hash Set** when:
  - Space is not a concern
  - You need to track the actual path taken
  - You need O(n) time with simpler implementation

---

## Algorithm Explanation

### Core Concept

The key insight behind Floyd's algorithm is that if there is a cycle in a linked list, a faster-moving pointer will eventually "lap" a slower-moving pointer. This is analogous to two runners on a circular track - the faster runner will eventually catch up to the slower runner.

### How It Works

The algorithm uses two pointers moving at different speeds:

- **Tortoise (slow pointer)**: Moves 1 step at a time
- **Hare (fast pointer)**: Moves 2 steps at a time

#### Phase 1: Detect if Cycle Exists
1. Initialize both pointers at the head of the list
2. Move slow pointer by 1 step and fast pointer by 2 steps
3. If they ever meet, a cycle exists
4. If fast reaches null, there is no cycle

#### Phase 2: Find Cycle Start (Optional)
Once a cycle is detected, to find where it starts:
1. Reset one pointer to the head
2. Move both pointers one step at a time
3. Where they meet is the start of the cycle

### Mathematical Proof

Why does this work?

1. **In a cycle of length C**: After the slow pointer enters the cycle, the fast pointer is at most C-1 steps behind
2. Since fast moves 1 extra step per iteration relative to slow, they must meet within C iterations
3. Let `a` = distance from head to cycle start, `b` = distance from cycle start to meeting point
4. Slow travels: `a + b` steps
5. Fast travels: `a + b + C` steps (one extra lap)
6. Since fast travels exactly 2x slow: `2(a + b) = a + b + C` → `a + b = C`
7. Therefore, from meeting point, traveling `a` more steps returns to cycle start

### Visual Representation

```
List: 3 -> 2 -> 0 -> -4
            ^         |
            |_________|

Step 1: Both at 3
Step 2: Slow at 2, Fast at 0
Step 3: Slow at 0, Fast at 2 (they met!)
Step 4: Reset slow to head, both move 1 step
Step 5: Slow at 2, Fast at 2 (meeting point = cycle start!)
```

### Key Properties

- **Time Complexity**: O(n) - linear time
- **Space Complexity**: O(1) - constant space
- **No modifications needed**: Doesn't modify the original list
- **Optimal**: Proven that O(1) space solution must use this approach

---

## Algorithm Steps

### Basic Cycle Detection

1. **Initialize**: Set both slow and fast pointers to the head of the list
2. **Traverse**: While fast and fast.next are not null:
   - Move slow by 1: `slow = slow.next`
   - Move fast by 2: `fast = fast.next.next`
   - If slow equals fast: cycle detected, return true
3. **End**: If loop exits, no cycle exists, return false

### Finding Cycle Start

1. **Phase 1 - Detect**: Use the basic algorithm to find if a cycle exists
2. **Phase 2 - Find Start**: 
   - If cycle exists, reset slow to head
   - Move both slow and fast one step at a time
   - Where they meet is the cycle start node

---

## Implementation

### Template Code (Cycle Detection)

````carousel
```python
from typing import Optional


class ListNode:
    """Node class for linked list."""
    def __init__(self, val: int = 0, next: Optional['ListNode'] = None):
        self.val = val
        self.next = next


def has_cycle(head: Optional[ListNode]) -> bool:
    """
    Detect if a linked list has a cycle using Floyd's algorithm.
    
    Args:
        head: Head of the linked list
    
    Returns:
        True if cycle exists, False otherwise
    
    Time: O(n)
    Space: O(1)
    """
    if not head or not head.next:
        return False
    
    slow = head
    fast = head
    
    while fast and fast.next:
        slow = slow.next        # Move 1 step
        fast = fast.next.next   # Move 2 steps
        
        if slow == fast:
            return True
    
    return False


def detect_cycle_start(head: Optional[ListNode]) -> Optional[ListNode]:
    """
    Find the starting node of the cycle if it exists.
    
    Args:
        head: Head of the linked list
    
    Returns:
        Node where cycle starts, or None if no cycle
    
    Time: O(n)
    Space: O(1)
    """
    if not head or not head.next:
        return None
    
    # Phase 1: Find intersection point
    slow = head
    fast = head
    
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        
        if slow == fast:
            break
    
    # No cycle found
    if not fast or not fast.next:
        return None
    
    # Phase 2: Find cycle start
    # Move both pointers one step at a time
    # They will meet at the cycle start
    slow = head
    while slow != fast:
        slow = slow.next
        fast = fast.next
    
    return slow


def create_linked_list_with_cycle(values: list, cycle_pos: int) -> Optional[ListNode]:
    """
    Create a linked list with an optional cycle for testing.
    
    Args:
        values: List of values to create nodes from
        cycle_pos: Index where cycle should point to (-1 for no cycle)
    
    Returns:
        Head of the linked list
    """
    if not values:
        return None
    
    # Create nodes
    nodes = [ListNode(val) for val in values]
    
    # Connect nodes
    for i in range(len(nodes) - 1):
        nodes[i].next = nodes[i + 1]
    
    # Create cycle if specified
    if cycle_pos >= 0 and cycle_pos < len(nodes):
        nodes[-1].next = nodes[cycle_pos]
    
    return nodes[0]


def list_to_array(head: Optional[ListNode], max_len: int = 20) -> list:
    """Convert linked list to array for display."""
    result = []
    current = head
    count = 0
    
    while current and count < max_len:
        result.append(current.val)
        current = current.next
        count += 1
    
    if current:
        result.append("...")
    
    return result


# Example usage
if __name__ == "__main__":
    print("Floyd's Cycle Detection Algorithm")
    print("=" * 40)
    
    # Test case 1: Linked list with cycle
    # 3 -> 2 -> 0 -> -4 -> (back to 2)
    values1 = [3, 2, 0, -4]
    head1 = create_linked_list_with_cycle(values1, cycle_pos=1)
    
    print("\nTest 1: List with cycle [3,2,0,-4] -> cycle at index 1")
    print(f"  Has cycle: {has_cycle(head1)}")
    
    cycle_node = detect_cycle_start(head1)
    if cycle_node:
        print(f"  Cycle starts at node with value: {cycle_node.val}")
    
    # Test case 2: Linked list without cycle
    values2 = [1, 2, 3, 4, 5]
    head2 = create_linked_list_with_cycle(values2, cycle_pos=-1)
    
    print("\nTest 2: List without cycle [1,2,3,4,5]")
    print(f"  Has cycle: {has_cycle(head2)}")
    
    # Test case 3: Single node with self-loop
    head3 = ListNode(1)
    head3.next = head3  # Self-loop
    
    print("\nTest 3: Single node with self-loop")
    print(f"  Has cycle: {has_cycle(head3)}")
    
    # Test case 4: Single node without cycle
    head4 = ListNode(1)
    
    print("\nTest 4: Single node without cycle")
    print(f"  Has cycle: {has_cycle(head4)}")
```

<!-- slide -->
```cpp
#include <iostream>
#include <unordered_set>
using namespace std;

/**
 * Definition for singly-linked list node.
 */
struct ListNode {
    int val;
    ListNode* next;
    ListNode(int x) : val(x), next(nullptr) {}
};

/**
 * Detect if a linked list has a cycle using Floyd's algorithm.
 * 
 * Time: O(n)
 * Space: O(1)
 */
bool hasCycle(ListNode* head) {
    if (!head || !head->next) {
        return false;
    }
    
    ListNode* slow = head;
    ListNode* fast = head;
    
    while (fast && fast->next) {
        slow = slow->next;           // Move 1 step
        fast = fast->next->next;     // Move 2 steps
        
        if (slow == fast) {
            return true;  // Cycle detected
        }
    }
    
    return false;  // No cycle
}

/**
 * Find the starting node of the cycle.
 * 
 * Time: O(n)
 * Space: O(1)
 */
ListNode* detectCycleStart(ListNode* head) {
    if (!head || !head->next) {
        return nullptr;
    }
    
    // Phase 1: Find intersection point
    ListNode* slow = head;
    ListNode* fast = head;
    
    while (fast && fast->next) {
        slow = slow->next;
        fast = fast->next->next;
        
        if (slow == fast) {
            break;
        }
    }
    
    // No cycle found
    if (!fast || !fast->next) {
        return nullptr;
    }
    
    // Phase 2: Find cycle start
    slow = head;
    while (slow != fast) {
        slow = slow->next;
        fast = fast->next;
    }
    
    return slow;
}

/**
 * Alternative: Hash Set Approach (O(n) space)
 */
bool hasCycleHashSet(ListNode* head) {
    unordered_set<ListNode*> seen;
    
    while (head) {
        if (seen.count(head)) {
            return true;
        }
        seen.insert(head);
        head = head->next;
    }
    
    return false;
}

// Test main function
int main() {
    // Test case 1: List with cycle
    ListNode* n1 = new ListNode(3);
    ListNode* n2 = new ListNode(2);
    ListNode* n3 = new ListNode(0);
    ListNode* n4 = new ListNode(-4);
    
    n1->next = n2;
    n2->next = n3;
    n3->next = n4;
    n4->next = n2;  // Creates cycle back to node 2
    
    cout << "Test 1: List with cycle [3,2,0,-4] -> cycle at 2" << endl;
    cout << "  Has cycle: " << (hasCycle(n1) ? "true" : "false") << endl;
    
    ListNode* cycleStart = detectCycleStart(n1);
    if (cycleStart) {
        cout << "  Cycle starts at node with value: " << cycleStart->val << endl;
    }
    
    // Test case 2: List without cycle
    ListNode* m1 = new ListNode(1);
    ListNode* m2 = new ListNode(2);
    ListNode* m3 = new ListNode(3);
    m1->next = m2;
    m2->next = m3;
    
    cout << "\nTest 2: List without cycle [1,2,3]" << endl;
    cout << "  Has cycle: " << (hasCycle(m1) ? "true" : "false") << endl;
    
    return 0;
}
```

<!-- slide -->
```java
/**
 * Definition for singly-linked list node.
 */
class ListNode {
    int val;
    ListNode next;
    ListNode(int x) {
        val = x;
        next = null;
    }
}

/**
 * Floyd's Cycle Detection Algorithm
 * 
 * Time: O(n)
 * Space: O(1)
 */
public class Solution {
    
    /**
     * Detect if a linked list has a cycle using Floyd's algorithm.
     */
    public boolean hasCycle(ListNode head) {
        if (head == null || head.next == null) {
            return false;
        }
        
        ListNode slow = head;
        ListNode fast = head;
        
        while (fast != null && fast.next != null) {
            slow = slow.next;           // Move 1 step
            fast = fast.next.next;      // Move 2 steps
            
            if (slow == fast) {
                return true;  // Cycle detected
            }
        }
        
        return false;  // No cycle
    }
    
    /**
     * Find the starting node of the cycle.
     * 
     * Time: O(n)
     * Space: O(1)
     */
    public ListNode detectCycleStart(ListNode head) {
        if (head == null || head.next == null) {
            return null;
        }
        
        // Phase 1: Find intersection point
        ListNode slow = head;
        ListNode fast = head;
        
        while (fast != null && fast.next != null) {
            slow = slow.next;
            fast = fast.next.next;
            
            if (slow == fast) {
                break;
            }
        }
        
        // No cycle found
        if (fast == null || fast.next == null) {
            return null;
        }
        
        // Phase 2: Find cycle start
        slow = head;
        while (slow != fast) {
            slow = slow.next;
            fast = fast.next;
        }
        
        return slow;
    }
    
    /**
     * Alternative: Hash Set Approach (O(n) space)
     */
    public boolean hasCycleHashSet(ListNode head) {
        Set<ListNode> seen = new HashSet<>();
        
        while (head != null) {
            if (seen.contains(head)) {
                return true;
            }
            seen.add(head);
            head = head.next;
        }
        
        return false;
    }
    
    // Test the implementation
    public static void main(String[] args) {
        Solution solution = new Solution();
        
        // Test case 1: List with cycle
        ListNode n1 = new ListNode(3);
        ListNode n2 = new ListNode(2);
        ListNode n3 = new ListNode(0);
        ListNode n4 = new ListNode(-4);
        
        n1.next = n2;
        n2.next = n3;
        n3.next = n4;
        n4.next = n2;  // Creates cycle
        
        System.out.println("Test 1: List with cycle [3,2,0,-4] -> cycle at 2");
        System.out.println("  Has cycle: " + solution.hasCycle(n1));
        
        ListNode cycleStart = solution.detectCycleStart(n1);
        if (cycleStart != null) {
            System.out.println("  Cycle starts at node with value: " + cycleStart.val);
        }
        
        // Test case 2: List without cycle
        ListNode m1 = new ListNode(1);
        ListNode m2 = new ListNode(2);
        ListNode m3 = new ListNode(3);
        m1.next = m2;
        m2.next = m3;
        
        System.out.println("\nTest 2: List without cycle [1,2,3]");
        System.out.println("  Has cycle: " + solution.hasCycle(m1));
    }
}
```

<!-- slide -->
```javascript
/**
 * Floyd's Cycle Detection Algorithm
 * 
 * Time: O(n)
 * Space: O(1)
 */

/**
 * Definition for singly-linked list node.
 */
class ListNode {
    constructor(val = 0, next = null) {
        this.val = val;
        this.next = next;
    }
}

/**
 * Detect if a linked list has a cycle using Floyd's algorithm.
 * @param {ListNode} head - Head of the linked list
 * @returns {boolean} True if cycle exists, False otherwise
 */
function hasCycle(head) {
    if (!head || !head.next) {
        return false;
    }
    
    let slow = head;
    let fast = head;
    
    while (fast && fast.next) {
        slow = slow.next;           // Move 1 step
        fast = fast.next.next;      // Move 2 steps
        
        if (slow === fast) {
            return true;  // Cycle detected
        }
    }
    
    return false;  // No cycle
}

/**
 * Find the starting node of the cycle.
 * @param {ListNode} head - Head of the linked list
 * @returns {ListNode|null} Node where cycle starts, or null if no cycle
 */
function detectCycleStart(head) {
    if (!head || !head.next) {
        return null;
    }
    
    // Phase 1: Find intersection point
    let slow = head;
    let fast = head;
    
    while (fast && fast.next) {
        slow = slow.next;
        fast = fast.next.next;
        
        if (slow === fast) {
            break;
        }
    }
    
    // No cycle found
    if (!fast || !fast.next) {
        return null;
    }
    
    // Phase 2: Find cycle start
    slow = head;
    while (slow !== fast) {
        slow = slow.next;
        fast = fast.next;
    }
    
    return slow;
}

/**
 * Alternative: Hash Set Approach (O(n) space)
 * @param {ListNode} head - Head of the linked list
 * @returns {boolean} True if cycle exists, False otherwise
 */
function hasCycleHashSet(head) {
    const seen = new Set();
    
    while (head) {
        if (seen.has(head)) {
            return true;
        }
        seen.add(head);
        head = head.next;
    }
    
    return false;
}

// Helper function to create linked list with cycle
function createLinkedListWithCycle(values, cyclePos) {
    if (!values || values.length === 0) {
        return null;
    }
    
    const nodes = values.map(val => new ListNode(val));
    
    for (let i = 0; i < nodes.length - 1; i++) {
        nodes[i].next = nodes[i + 1];
    }
    
    if (cyclePos >= 0 && cyclePos < nodes.length) {
        nodes[nodes.length - 1].next = nodes[cyclePos];
    }
    
    return nodes[0];
}

// Test the implementation
console.log("Floyd's Cycle Detection Algorithm");
console.log("=".repeat(40));

// Test case 1: List with cycle
const head1 = createLinkedListWithCycle([3, 2, 0, -4], 1);
console.log("\nTest 1: List with cycle [3,2,0,-4] -> cycle at index 1");
console.log(`  Has cycle: ${hasCycle(head1)}`);

const cycleNode = detectCycleStart(head1);
if (cycleNode) {
    console.log(`  Cycle starts at node with value: ${cycleNode.val}`);
}

// Test case 2: List without cycle
const head2 = createLinkedListWithCycle([1, 2, 3, 4, 5], -1);
console.log("\nTest 2: List without cycle [1,2,3,4,5]");
console.log(`  Has cycle: ${hasCycle(head2)}`);

// Test case 3: Single node with self-loop
const head3 = new ListNode(1);
head3.next = head3;
console.log("\nTest 3: Single node with self-loop");
console.log(`  Has cycle: ${hasCycle(head3)}`);

// Test case 4: Single node without cycle
const head4 = new ListNode(1);
console.log("\nTest 4: Single node without cycle");
console.log(`  Has cycle: ${hasCycle(head4)}`);
```
````

---

## Time Complexity Analysis

| Operation | Time Complexity | Description |
|------------|-----------------|-------------|
| **Cycle Detection** | O(n) | Each pointer traverses at most n nodes |
| **Find Cycle Start** | O(n) | Two phases, each O(n) |
| **Total (with start)** | O(n) | Linear in list length |
| **Space** | O(1) | Only two pointers used |

### Detailed Breakdown

- **Best Case**: O(1) - Cycle at the very first position (head.next points to head)
- **Worst Case**: O(n) - Cycle at the end, or no cycle
- **Average Case**: O(n) - Linear traversal

### Why O(n) Works

1. **Slow pointer**: Travels at most n nodes before either reaching end or meeting fast
2. **Fast pointer**: Travels at most 2n nodes for the same reason
3. **Total operations**: At most 3n pointer moves = O(n)

---

## Space Complexity Analysis

- **Floyd's Algorithm**: O(1) - Only two pointers regardless of list size
- **Hash Set Approach**: O(n) - Stores all visited nodes
- **Modify List Approach**: O(1) - Uses node marking

### Space Optimization

Floyd's algorithm achieves optimal O(1) space by:
1. Using two pointers with different speeds
2. Not storing any visited nodes
3. Not modifying the original list

---

## Common Variations

### 1. Detect Cycle in Circular Array

Apply the same principle to detect cycles in arrays or sequences.

````carousel
```python
def has_circular_array(arr: list) -> bool:
    """
    Detect if array represents a circular buffer that cycles.
    Similar concept to linked list cycle detection.
    """
    n = len(arr)
    if n == 0:
        return False
    
    slow = arr[0] % n
    fast = arr[0] % n
    
    while True:
        # Move slow 1 step
        slow = arr[slow] % n
        # Move fast 2 steps
        fast = arr[arr[fast] % n] % n
        
        if slow == fast:
            return True
        
        # Check if we've traversed entire array
        if slow == arr[0] % n:
            return False
```

<!-- slide -->
```cpp
#include <vector>
using namespace std;

/**
 * Detect if array represents a circular buffer that cycles.
 * Similar concept to linked list cycle detection.
 */
bool hasCircularArray(const vector<int>& arr) {
    int n = arr.size();
    if (n == 0) return false;
    
    int slow = arr[0] % n;
    int fast = arr[0] % n;
    
    while (true) {
        // Move slow 1 step
        slow = arr[slow] % n;
        // Move fast 2 steps
        fast = arr[arr[fast] % n] % n;
        
        if (slow == fast) return true;
        
        // Check if we've traversed entire array
        if (slow == arr[0] % n) return false;
    }
}
```

<!-- slide -->
```java
/**
 * Detect if array represents a circular buffer that cycles.
 * Similar concept to linked list cycle detection.
 */
public class CircularArrayCycle {
    public boolean hasCircularArray(int[] arr) {
        int n = arr.length;
        if (n == 0) return false;
        
        int slow = arr[0] % n;
        int fast = arr[0] % n;
        
        while (true) {
            // Move slow 1 step
            slow = arr[slow] % n;
            // Move fast 2 steps
            fast = arr[arr[fast] % n] % n;
            
            if (slow == fast) return true;
            
            // Check if we've traversed entire array
            if (slow == arr[0] % n) return false;
        }
    }
}
```

<!-- slide -->
```javascript
/**
 * Detect if array represents a circular buffer that cycles.
 * Similar concept to linked list cycle detection.
 * @param {number[]} arr - Input array
 * @returns {boolean} True if cycle exists
 */
function hasCircularArray(arr) {
    const n = arr.length;
    if (n === 0) return false;
    
    let slow = arr[0] % n;
    let fast = arr[0] % n;
    
    while (true) {
        // Move slow 1 step
        slow = arr[slow] % n;
        // Move fast 2 steps
        fast = arr[arr[fast] % n] % n;
        
        if (slow === fast) return true;
        
        // Check if we've traversed entire array
        if (slow === arr[0] % n) return false;
    }
}
```
````

### 2. Find Meeting Point in Circular Race

When two runners start at different positions on a circular track.

````carousel
```python
def find_meeting_point(distance: int, speed1: int, speed2: int) -> int:
    """
    Find when two runners meet on a circular track.
    
    Args:
        distance: Circumference of the track
        speed1: Speed of first runner
        speed2: Speed of second runner
    
    Returns:
        Time when they meet (or -1 if never)
    """
    if speed1 == speed2:
        return -1  # Never meet if same speed
    
    # Relative speed
    relative_speed = abs(speed1 - speed2)
    
    # Time to meet = distance / relative_speed
    # They meet when relative distance = multiple of circumference
    for t in range(1, distance + 1):
        if (relative_speed * t) % distance == 0:
            return t
    
    return -1
```

<!-- slide -->
```cpp
#include <cmath>
using namespace std;

/**
 * Find when two runners meet on a circular track.
 * 
 * @param distance: Circumference of the track
 * @param speed1: Speed of first runner
 * @param speed2: Speed of second runner
 * @return: Time when they meet (or -1 if never)
 */
int findMeetingPoint(int distance, int speed1, int speed2) {
    if (speed1 == speed2) {
        return -1;  // Never meet if same speed
    }
    
    // Relative speed
    int relativeSpeed = abs(speed1 - speed2);
    
    // They meet when relative distance = multiple of circumference
    for (int t = 1; t <= distance; t++) {
        if ((relativeSpeed * t) % distance == 0) {
            return t;
        }
    }
    
    return -1;
}
```

<!-- slide -->
```java
/**
 * Find when two runners meet on a circular track.
 */
public class CircularRace {
    /**
     * Find meeting time of two runners.
     * 
     * @param distance: Circumference of the track
     * @param speed1: Speed of first runner
     * @param speed2: Speed of second runner
     * @return: Time when they meet (or -1 if never)
     */
    public int findMeetingPoint(int distance, int speed1, int speed2) {
        if (speed1 == speed2) {
            return -1;  // Never meet if same speed
        }
        
        // Relative speed
        int relativeSpeed = Math.abs(speed1 - speed2);
        
        // They meet when relative distance = multiple of circumference
        for (int t = 1; t <= distance; t++) {
            if ((relativeSpeed * t) % distance == 0) {
                return t;
            }
        }
        
        return -1;
    }
}
```

<!-- slide -->
```javascript
/**
 * Find when two runners meet on a circular track.
 * 
 * @param {number} distance - Circumference of the track
 * @param {number} speed1 - Speed of first runner
 * @param {number} speed2 - Speed of second runner
 * @returns {number} Time when they meet (or -1 if never)
 */
function findMeetingPoint(distance, speed1, speed2) {
    if (speed1 === speed2) {
        return -1;  // Never meet if same speed
    }
    
    // Relative speed
    const relativeSpeed = Math.abs(speed1 - speed2);
    
    // They meet when relative distance = multiple of circumference
    for (let t = 1; t <= distance; t++) {
        if ((relativeSpeed * t) % distance === 0) {
            return t;
        }
    }
    
    return -1;
}
```
````

### 3. Happy Number Detection

 Floyd's algorithm can detect cycles in number sequences.

````carousel
```python
def is_happy(n: int) -> bool:
    """
    Determine if a number is happy using cycle detection.
    
    A happy number is one where repeatedly summing squares of digits
    eventually reaches 1. If it enters a cycle (not reaching 1), it's not happy.
    """
    def get_next(num):
        total = 0
        while num > 0:
            digit = num % 10
            total += digit * digit
            num //= 10
        return total
    
    slow = n
    fast = get_next(n)
    
    while fast != 1 and slow != fast:
        slow = get_next(slow)
        fast = get_next(get_next(fast))
    
    return fast == 1
```

<!-- slide -->
```cpp
#include <iostream>
using namespace std;

/**
 * Determine if a number is happy using cycle detection.
 * A happy number eventually reaches 1; otherwise it enters a cycle.
 */
class HappyNumber {
private:
    int getNext(int num) {
        int total = 0;
        while (num > 0) {
            int digit = num % 10;
            total += digit * digit;
            num /= 10;
        }
        return total;
    }
    
public:
    bool isHappy(int n) {
        int slow = n;
        int fast = getNext(n);
        
        while (fast != 1 && slow != fast) {
            slow = getNext(slow);
            fast = getNext(getNext(fast));
        }
        
        return fast == 1;
    }
};
```

<!-- slide -->
```java
/**
 * Determine if a number is happy using cycle detection.
 * A happy number eventually reaches 1; otherwise it enters a cycle.
 */
public class HappyNumber {
    private int getNext(int num) {
        int total = 0;
        while (num > 0) {
            int digit = num % 10;
            total += digit * digit;
            num /= 10;
        }
        return total;
    }
    
    public boolean isHappy(int n) {
        int slow = n;
        int fast = getNext(n);
        
        while (fast != 1 && slow != fast) {
            slow = getNext(slow);
            fast = getNext(getNext(fast));
        }
        
        return fast == 1;
    }
}
```

<!-- slide -->
```javascript
/**
 * Determine if a number is happy using cycle detection.
 * A happy number eventually reaches 1; otherwise it enters a cycle.
 * 
 * @param {number} n - Number to check
 * @returns {boolean} True if happy number
 */
function isHappy(n) {
    const getNext = (num) => {
        let total = 0;
        while (num > 0) {
            const digit = num % 10;
            total += digit * digit;
            num = Math.floor(num / 10);
        }
        return total;
    };
    
    let slow = n;
    let fast = getNext(n);
    
    while (fast !== 1 && slow !== fast) {
        slow = getNext(slow);
        fast = getNext(getNext(fast));
    }
    
    return fast === 1;
}
```
````

### 4. Linked List with Random Pointer

Detect cycle in linked list with additional random pointers.

````carousel
```python
class RandomListNode:
    def __init__(self, x):
        self.label = x
        self.next = None
        self.random = None

def detect_cycle_random(head: RandomListNode) -> bool:
    """
    Detect cycle in linked list with random pointers.
    Floyd's algorithm still works - random pointer doesn't affect cycle detection.
    """
    if not head or not head.next:
        return False
    
    slow = head
    fast = head
    
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        
        if slow == fast:
            return True
    
    return False
```

<!-- slide -->
```cpp
#include <iostream>
using namespace std;

/**
 * Node class for linked list with random pointer.
 */
struct RandomListNode {
    int label;
    RandomListNode* next;
    RandomListNode* random;
    RandomListNode(int x) : label(x), next(nullptr), random(nullptr) {}
};

/**
 * Detect cycle in linked list with random pointers.
 * Floyd's algorithm still works - random pointer doesn't affect cycle detection.
 */
bool detectCycleRandom(RandomListNode* head) {
    if (!head || !head->next) {
        return false;
    }
    
    RandomListNode* slow = head;
    RandomListNode* fast = head;
    
    while (fast && fast->next) {
        slow = slow->next;
        fast = fast->next->next;
        
        if (slow == fast) {
            return true;
        }
    }
    
    return false;
}
```

<!-- slide -->
```java
/**
 * Node class for linked list with random pointer.
 */
class RandomListNode {
    int label;
    RandomListNode next;
    RandomListNode random;
    RandomListNode(int x) {
        this.label = x;
        this.next = null;
        this.random = null;
    }
}

/**
 * Detect cycle in linked list with random pointers.
 * Floyd's algorithm still works - random pointer doesn't affect cycle detection.
 */
public class RandomListCycle {
    public boolean detectCycleRandom(RandomListNode head) {
        if (head == null || head.next == null) {
            return false;
        }
        
        RandomListNode slow = head;
        RandomListNode fast = head;
        
        while (fast != null && fast.next != null) {
            slow = slow.next;
            fast = fast.next.next;
            
            if (slow == fast) {
                return true;
            }
        }
        
        return false;
    }
}
```

<!-- slide -->
```javascript
/**
 * Node class for linked list with random pointer.
 */
class RandomListNode {
    constructor(val) {
        this.label = val;
        this.next = null;
        this.random = null;
    }
}

/**
 * Detect cycle in linked list with random pointers.
 * Floyd's algorithm still works - random pointer doesn't affect cycle detection.
 * 
 * @param {RandomListNode} head - Head of the linked list
 * @returns {boolean} True if cycle exists
 */
function detectCycleRandom(head) {
    if (!head || !head.next) {
        return false;
    }
    
    let slow = head;
    let fast = head;
    
    while (fast && fast.next) {
        slow = slow.next;
        fast = fast.next.next;
        
        if (slow === fast) {
            return true;
        }
    }
    
    return false;
}
```
````

### 5. Find Length of Cycle

After detecting a cycle, find its length.

````carousel
```python
def cycle_length(head: Optional[ListNode]) -> int:
    """
    Find the length of the cycle in a linked list.
    
    Args:
        head: Head of the linked list
    
    Returns:
        Length of cycle, or 0 if no cycle
    """
    if not head or not head.next:
        return 0
    
    # Find meeting point
    slow = head
    fast = head
    
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        
        if slow == fast:
            break
    
    if not fast or not fast.next:
        return 0  # No cycle
    
    # Count nodes in cycle
    length = 1
    current = slow.next
    while current != slow:
        length += 1
        current = current.next
    
    return length
```

<!-- slide -->
```cpp
#include <iostream>
using namespace std;

struct ListNode {
    int val;
    ListNode* next;
    ListNode(int x) : val(x), next(nullptr) {}
};

/**
 * Find the length of the cycle in a linked list.
 * 
 * @param head: Head of the linked list
 * @return: Length of cycle, or 0 if no cycle
 */
int cycleLength(ListNode* head) {
    if (!head || !head->next) {
        return 0;
    }
    
    // Find meeting point
    ListNode* slow = head;
    ListNode* fast = head;
    
    while (fast && fast->next) {
        slow = slow->next;
        fast = fast->next->next;
        
        if (slow == fast) {
            break;
        }
    }
    
    if (!fast || !fast->next) {
        return 0;  // No cycle
    }
    
    // Count nodes in cycle
    int length = 1;
    ListNode* current = slow->next;
    while (current != slow) {
        length++;
        current = current->next;
    }
    
    return length;
}
```

<!-- slide -->
```java
/**
 * Find the length of the cycle in a linked list.
 */
public class CycleLength {
    static class ListNode {
        int val;
        ListNode next;
        ListNode(int x) {
            val = x;
            next = null;
        }
    }
    
    /**
     * Find the length of the cycle.
     * 
     * @param head: Head of the linked list
     * @return: Length of cycle, or 0 if no cycle
     */
    public int cycleLength(ListNode head) {
        if (head == null || head.next == null) {
            return 0;
        }
        
        // Find meeting point
        ListNode slow = head;
        ListNode fast = head;
        
        while (fast != null && fast.next != null) {
            slow = slow.next;
            fast = fast.next.next;
            
            if (slow == fast) {
                break;
            }
        }
        
        if (fast == null || fast.next == null) {
            return 0;  // No cycle
        }
        
        // Count nodes in cycle
        int length = 1;
        ListNode current = slow.next;
        while (current != slow) {
            length++;
            current = current.next;
        }
        
        return length;
    }
}
```

<!-- slide -->
```javascript
/**
 * Find the length of the cycle in a linked list.
 * 
 * @param {ListNode} head - Head of the linked list
 * @returns {number} Length of cycle, or 0 if no cycle
 */
function cycleLength(head) {
    if (!head || !head.next) {
        return 0;
    }
    
    // Find meeting point
    let slow = head;
    let fast = head;
    
    while (fast && fast.next) {
        slow = slow.next;
        fast = fast.next.next;
        
        if (slow === fast) {
            break;
        }
    }
    
    if (!fast || !fast.next) {
        return 0;  // No cycle
    }
    
    // Count nodes in cycle
    let length = 1;
    let current = slow.next;
    while (current !== slow) {
        length++;
        current = current.next;
    }
    
    return length;
}
```
````

---

## Practice Problems

### Problem 1: Linked List Cycle

**Problem:** [LeetCode 141 - Linked List Cycle](https://leetcode.com/problems/linked-list-cycle/)

**Description:** Given a linked list, determine if it has a cycle in it.

**How to Apply Floyd's Algorithm:**
- Use slow and fast pointers starting from head
- Move slow by 1, fast by 2 in each iteration
- If they meet, there is a cycle
- This is the classic application of the technique

---

### Problem 2: Linked List Cycle II

**Problem:** [LeetCode 142 - Linked List Cycle II](https://leetcode.com/problems/linked-list-cycle-ii/)

**Description:** Given a linked list, return the node where the cycle begins. If there is no cycle, return null.

**How to Apply:**
- Phase 1: Detect cycle using Floyd's algorithm
- Phase 2: Reset one pointer to head and move both one step at a time
- Where they meet is the cycle start (mathematical proof: a + b = C)

---

### Problem 3: Happy Number

**Problem:** [LeetCode 202 - Happy Number](https://leetcode.com/problems/happy-number/)

**Description:** Write an algorithm to determine if a number n is happy. A happy number is a number where repeatedly summing squares of digits eventually reaches 1.

**How to Apply Floyd's Algorithm:**
- Create a function that transforms a number by summing squares of its digits
- This transformation creates a sequence that either reaches 1 or enters a cycle
- Use Floyd's algorithm to detect if the sequence enters a cycle
- If cycle reaches 1, it's happy; otherwise, it's not

---

### Problem 4: Find the Duplicate Number

**Problem:** [LeetCode 287 - Find the Duplicate Number](https://leetcode.com/problems/find-the-duplicate-number/)

**Description:** Given an array nums containing n + 1 integers where each integer is in the range [1, n], find the duplicate number.

**How to Apply Floyd's Algorithm:**
- Treat the array as a linked list where index i points to nums[i]
- Since there's a duplicate, multiple indices point to the same value, creating a cycle
- Use Floyd's to find the entrance to the cycle, which is the duplicate

---

### Problem 5: Circular Array Loop

**Problem:** [LeetCode 457 - Circular Array Loop](https://leetcode.com/problems/circular-array-loop/)

**Description:** You are given a circular array nums of n positive integers. Determine if there is a cycle that meets certain conditions.

**How to Apply Floyd's Algorithm:**
- Treat each index as a node, and the next node is (i + nums[i]) % n
- Use Floyd's to detect if there's a cycle
- Check additional conditions (all forward or all backward)

---

## Video Tutorial Links

### Fundamentals

- [Floyd's Cycle Detection Algorithm (Take U Forward)](https://www.youtube.com/watch?v=zbozWoMgKW0) - Comprehensive introduction
- [Linked List Cycle Detection (NeetCode)](https://www.youtube.com/watch?v=oO0M3cJeaQo) - Practical implementation
- [Detect Cycle in Linked List (WilliamFiset)](https://www.youtube.com/watch?v=xz0E7iS8KfE) - Visual explanation

### Advanced Topics

- [Finding Cycle Start (Take U Forward)](https://www.youtube.com/watch?v=iZJ4jT2SGaA) - Mathematical proof
- [Floyd's Algorithm for Happy Numbers](https://www.youtube.com/watch?v=ckQq1Za75I0) - Application variations
- [Cycle Detection in Arrays](https://www.youtube.com/watch?v=6U3T4dXv1Ng) - Similar concepts

---

## Follow-up Questions

### Q1: Why does Floyd's algorithm work mathematically?

**Answer:** In a cycle of length C, after the slow pointer enters, the fast pointer is at most C-1 steps behind. Since fast moves 1 extra step per iteration relative to slow, they must meet within C iterations. This is guaranteed because:
- Let `a` = distance from head to cycle start
- Let `b` = distance from cycle start to meeting point  
- Slow travels: `a + b` steps
- Fast travels: `2(a + b)` steps = `a + b + C` (one extra lap)
- Solving: `a + b = C`, meaning from meeting point, traveling `a` steps returns to cycle start

### Q2: Can Floyd's algorithm be used for doubly linked lists?

**Answer:** Yes, but it's unnecessary for simple cycle detection in doubly linked lists because you can traverse backwards. However, Floyd's algorithm is still useful if you need to find where the cycle starts or want O(1) space without modifying the list.

### Q3: What happens if the fast pointer moves more than 2 steps?

**Answer:** The algorithm still works as long as fast moves faster than slow. Moving more than 2 steps may find the cycle faster but:
- The mathematical guarantee still holds (they'll meet eventually)
- Finding cycle start becomes more complex
- 2 steps is optimal for balanced performance

### Q4: Can this algorithm detect multiple cycles?

**Answer:** No, Floyd's algorithm detects if there is *any* cycle, not how many. Once the first cycle is detected, it returns. Finding all cycles would require different approaches like DFS or hash-based methods.

### Q5: How does this compare to using a hash set?

**Answer:**
- **Hash Set**: O(n) time, O(n) space - simpler but uses more memory
- **Floyd's**: O(n) time, O(1) space - optimal but only detects cycle, doesn't track path
- Choose Hash Set when you need to know the actual path or modify the list is acceptable

---

## Summary

Floyd's Tortoise and Hare algorithm is a classic technique for cycle detection in linked lists and sequences. Key takeaways:

- **Optimal Space**: Achieves O(1) space - the theoretical minimum for this problem
- **Two Phases**: First detect cycle, then find its starting point
- **Mathematical Guarantee**: Proven to work within n iterations
- **Non-destructive**: Doesn't modify the original list
- **Versatile**: Applies to various problems beyond linked lists

When to use:
- ✅ Need O(1) space complexity
- ✅ Cannot modify the linked list
- ✅ Need to find cycle start location
- ❌ Need to track the actual path taken (use Hash Set instead)
- ❌ For doubly linked lists with simple forward-only traversal

This algorithm is essential for technical interviews and competitive programming, forming the foundation for understanding cycle detection in graphs and other data structures.

---

## Related Algorithms

- [Linked List](./linked-list.md) - Basic linked list operations
- [Two Pointers](./two-pointers.md) - Related technique
- [Graph Cycle Detection](./graph-cycle.md) - Cycle detection in graphs
- [Binary Search](./binary-search.md) - Another O(log n) search technique
