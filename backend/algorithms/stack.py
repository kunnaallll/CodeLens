
class Stack:
    def __init__(self):
        self.items = []

    # Add an element to the top
    def push(self, item):
        self.items.append(item)
        print(f"Pushed: {item}")

    # Remove the top element
    def pop(self):
        if self.is_empty():
            print("Stack is empty!")
            return None

        return self.items.pop()

    # View the top element
    def peek(self):
        if self.is_empty():
            print("Stack is empty!")
            return None

        return self.items[-1]

    # Check whether the stack is empty
    def is_empty(self):
        return len(self.items) == 0

    # Display the stack
    def display(self):
        print("Stack (bottom to top):", self.items)


if __name__ == "__main__":
    stack = Stack()

    stack.push(10)
    stack.push(20)
    stack.push(30)

    stack.display()

    print("Top element:", stack.peek())
    print("Removed element:", stack.pop())

    stack.display()
