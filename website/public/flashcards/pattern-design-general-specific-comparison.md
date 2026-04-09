## Design - General/Specific: Comparison

How do different design approaches and data structures compare?

<!-- front -->

---

### LRU Cache: Manual vs Built-in

| Aspect | Manual (HashMap + DLL) | OrderedDict |
|--------|------------------------|-------------|
| Code Length | ~80 lines | ~20 lines |
| Interview | Preferred (shows understanding) | Acceptable in Python |
| Flexibility | Full control | Limited customization |
| Edge Cases | Manual handling | Handled by library |
| Learning Value | High | Lower |

---

### Data Structure Combinations

| Problem | Primary DS | Secondary DS | Combined Benefit |
|---------|-----------|--------------|------------------|
| LRU Cache | HashMap | Doubly Linked List | O(1) lookup + O(1) reorder |
| Min Stack | Stack | Auxiliary Stack | O(1) push/pop + O(1) getMin |
| Random + Lookup | ArrayList | HashMap | O(1) random + O(1) lookup |
| LFU Cache | HashMap | Multiple Lists | O(1) all ops with freq buckets |

---

### Time Complexity Trade-offs

```
Single HashMap vs Combined Structure:

HashMap Only:
├── get: O(1) ✓
├── put: O(1) ✓
├── remove oldest: O(n) ✗ (must scan all keys)
└── reorder: O(n) ✗

HashMap + Doubly Linked List:
├── get: O(1) ✓
├── put: O(1) ✓
├── remove oldest: O(1) ✓ (tail removal)
└── reorder: O(1) ✓ (move to head)
```

---

### When to Use What

| Scenario | Use This | Avoid This |
|----------|----------|------------|
| Need ordering info | LinkedHashMap/OrderedDict | Plain HashMap |
| Need both ends | Deque/Doubly Linked List | Array/Stack |
| Fast min/max query | Heap + HashMap | Sorted array |
| O(1) random access | Array + HashMap | Linked List |

<!-- back -->
