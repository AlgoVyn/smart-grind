# Design Circular Queue

## Problem Description
[Link to problem](https://leetcode.com/problems/design-circular-queue/)

Design your implementation of the circular queue. The circular queue is a linear data structure in which the operations are performed based on FIFO (First In First Out) principle, and the last position is connected back to the first position to make a circle. It is also called "Ring Buffer".
One of the benefits of the circular queue is that we can make use of the spaces in front of the queue. In a normal queue, once the queue becomes full, we cannot insert the next element even if there is a space in front of the queue. But using the circular queue, we can use the space to store new values.
Implement the MyCircularQueue class:

MyCircularQueue(k) Initializes the object with the size of the queue to be k.
int Front() Gets the front item from the queue. If the queue is empty, return -1.
int Rear() Gets the last item from the queue. If the queue is empty, return -1.
boolean enQueue(int value) Inserts an element into the circular queue. Return true if the operation is successful.
boolean deQueue() Deletes an element from the circular queue. Return true if the operation is successful.
boolean isEmpty() Checks whether the circular queue is empty or not.
boolean isFull() Checks whether the circular queue is full or not.

You must solve the problem without using the built-in queue data structure in your programming language. 
 
Example 1:

Input
["MyCircularQueue", "enQueue", "enQueue", "enQueue", "enQueue", "Rear", "isFull", "deQueue", "enQueue", "Rear"]
[[3], [1], [2], [3], [4], [], [], [], [4], []]
Output
[null, true, true, true, false, 3, true, true, true, 4]

Explanation
MyCircularQueue myCircularQueue = new MyCircularQueue(3);
myCircularQueue.enQueue(1); // return True
myCircularQueue.enQueue(2); // return True
myCircularQueue.enQueue(3); // return True
myCircularQueue.enQueue(4); // return False
myCircularQueue.Rear();     // return 3
myCircularQueue.isFull();   // return True
myCircularQueue.deQueue();  // return True
myCircularQueue.enQueue(4); // return True
myCircularQueue.Rear();     // return 4

 
Constraints:

1 <= k <= 1000
0 <= value <= 1000
At most 3000 calls will be made to enQueue, deQueue, Front, Rear, isEmpty, and isFull.


## Solution

```python
class MyCircularQueue:

    def __init__(self, k: int):
        self.queue = [0] * (k + 1)
        self.head = 0
        self.tail = 0
        self.capacity = k + 1

    def enQueue(self, value: int) -> bool:
        if self.isFull():
            return False
        self.queue[self.tail] = value
        self.tail = (self.tail + 1) % self.capacity
        return True

    def deQueue(self) -> bool:
        if self.isEmpty():
            return False
        self.head = (self.head + 1) % self.capacity
        return True

    def Front(self) -> int:
        if self.isEmpty():
            return -1
        return self.queue[self.head]

    def Rear(self) -> int:
        if self.isEmpty():
            return -1
        return self.queue[(self.tail - 1 + self.capacity) % self.capacity]

    def isEmpty(self) -> bool:
        return self.head == self.tail

    def isFull(self) -> bool:
        return (self.tail + 1) % self.capacity == self.head
```

## Explanation
The circular queue is implemented using a fixed-size array to store the elements. We use two pointers, `head` and `tail`, to keep track of the front and rear of the queue. The array size is set to `k+1` to differentiate between an empty queue (when `head == tail`) and a full queue (when `(tail + 1) % capacity == head`).

### Step-by-Step Explanation:
1. **Initialization (`MyCircularQueue(k)`)**: Create an array of size `k+1`. Set `head = 0` and `tail = 0`. The capacity is `k+1` to handle the full/empty distinction.

2. **enQueue(value)**: Check if the queue is full using `isFull()`. If full, return `false`. Otherwise, insert the value at the `tail` position, then update `tail = (tail + 1) % capacity`. Return `true`.

3. **deQueue()**: Check if the queue is empty using `isEmpty()`. If empty, return `false`. Otherwise, update `head = (head + 1) % capacity`. Return `true`.

4. **Front()**: If the queue is empty, return `-1`. Otherwise, return the element at `head`.

5. **Rear()**: If the queue is empty, return `-1`. Otherwise, return the element at `(tail - 1 + capacity) % capacity`.

6. **isEmpty()**: Return `true` if `head == tail`, otherwise `false`.

7. **isFull()**: Return `true` if `(tail + 1) % capacity == head`, otherwise `false`.

### Time Complexity:
- All operations (`enQueue`, `deQueue`, `Front`, `Rear`, `isEmpty`, `isFull`) are O(1) because they involve constant-time array accesses and arithmetic operations.

### Space Complexity:
- O(k), where k is the maximum size of the queue, as we use a fixed-size array of size k+1.
