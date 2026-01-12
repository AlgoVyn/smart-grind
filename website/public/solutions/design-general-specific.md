# Design (General/Specific)

## Overview

The Design (General/Specific) pattern is a structural approach to software design where a general base class or interface defines the common behavior and structure, while specific subclasses provide tailored implementations for particular use cases. This pattern leverages inheritance and polymorphism to promote code reusability, maintainability, and extensibility. It is particularly useful when you have a core algorithm or process that needs to be adapted for different scenarios without duplicating code.

When to use this pattern:
- When multiple classes share common functionality but require specific variations
- When you want to define a skeleton of an algorithm in a base class and let subclasses override specific steps
- In scenarios involving different strategies or behaviors that can be abstracted into a common interface

Benefits:
- Reduces code duplication by centralizing common logic
- Makes it easy to add new specific implementations without modifying existing code
- Improves testability by allowing mocking of specific behaviors
- Enhances code organization and readability

## Key Concepts

- **Base Class/Interface**: Defines the general structure and common methods
- **Abstract Methods**: Methods that must be implemented by specific subclasses
- **Polymorphism**: Ability to treat objects of different specific classes uniformly through the base class
- **Template Method**: A common pattern where the base class defines the overall algorithm, and subclasses provide specific implementations for certain steps
- **Composition over Inheritance**: While this pattern uses inheritance, it's important to consider when composition might be more appropriate

## Template

```python
from abc import ABC, abstractmethod

class GeneralProcessor(ABC):
    """
    Base class that defines the general processing framework.
    This class provides the skeleton of the algorithm.
    """
    
    def process(self, data):
        """
        Template method that defines the general processing steps.
        This method orchestrates the overall process.
        """
        # Step 1: Pre-process the data (common to all implementations)
        processed_data = self.pre_process(data)
        
        # Step 2: Apply specific transformation (implemented by subclasses)
        result = self.transform(processed_data)
        
        # Step 3: Post-process the result (common to all implementations)
        final_result = self.post_process(result)
        
        return final_result
    
    def pre_process(self, data):
        """
        Common pre-processing logic.
        Can be overridden if needed, but provides a default implementation.
        """
        # Default pre-processing: validate and normalize data
        if not data:
            raise ValueError("Data cannot be empty")
        return data.strip().lower()
    
    def post_process(self, result):
        """
        Common post-processing logic.
        Can be overridden if needed, but provides a default implementation.
        """
        # Default post-processing: format the result
        return f"Processed: {result}"
    
    @abstractmethod
    def transform(self, data):
        """
        Abstract method that must be implemented by specific subclasses.
        This is where the specific behavior is defined.
        """
        pass

class SpecificProcessorA(GeneralProcessor):
    """
    Specific implementation for case A.
    Inherits the general framework and provides specific transformation.
    """
    
    def transform(self, data):
        """
        Specific transformation for case A.
        For example, convert to uppercase and add prefix.
        """
        return f"A-{data.upper()}"

class SpecificProcessorB(GeneralProcessor):
    """
    Specific implementation for case B.
    Inherits the general framework and provides different specific transformation.
    """
    
    def transform(self, data):
        """
        Specific transformation for case B.
        For example, reverse the string and add suffix.
        """
        return f"{data[::-1]}-B"

# Usage example
processor_a = SpecificProcessorA()
processor_b = SpecificProcessorB()

result_a = processor_a.process("hello world")  # Output: "Processed: A-HELLO WORLD"
result_b = processor_b.process("hello world")  # Output: "Processed: dlrow olleh-B"
```

## Example Problems

1. **Calculator Operations**: A base Calculator class with a general compute method, and specific subclasses for AdditionCalculator, SubtractionCalculator, etc., each implementing their own operation logic.

2. **File Processors**: A general FileProcessor base class that handles file I/O and validation, with specific subclasses like CSVProcessor, JSONProcessor, and XMLProcessor that implement parsing and data extraction for different file formats.

3. **Sorting Algorithms**: A base Sorter class with a general sort method that handles array validation and result formatting, and specific subclasses like QuickSort, MergeSort, and BubbleSort that implement their respective sorting algorithms.

## Time and Space Complexity

The time and space complexity of this pattern depends on the specific implementations in the subclasses:

- **Time Complexity**: Generally O(T_base + T_specific), where T_base is the complexity of the base class methods and T_specific is the complexity of the subclass-specific methods. The pattern itself doesn't add overhead beyond the inheritance mechanism.

- **Space Complexity**: Typically O(S_base + S_specific), where S_base is the space used by the base class and S_specific by the subclass. Additional space may be needed for polymorphism (virtual method tables), but this is usually negligible.

Note that the complexity analysis should focus on the concrete implementations rather than the pattern itself, as the pattern is a design abstraction.

## Common Pitfalls

- **Over-inheritance**: Creating deep inheritance hierarchies that become hard to maintain. Favor composition when the relationship isn't truly "is-a".
- **Tight Coupling**: Base classes that know too much about subclasses, violating the Open-Closed Principle.
- **Abstract Method Overload**: Forgetting to implement all abstract methods in subclasses, leading to runtime errors.
- **Performance Overhead**: In languages with dynamic dispatch, method calls through base class references may have slight performance costs.
- **Inflexible Base Classes**: Designing base classes that are too rigid, making it difficult for subclasses to customize behavior without major changes.
- **Violation of Liskov Substitution Principle**: Subclasses that don't properly fulfill the contract of the base class, leading to unexpected behavior when used polymorphically.