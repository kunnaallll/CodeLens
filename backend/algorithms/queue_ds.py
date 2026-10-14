
from collections import deque


class Queue:
    def __init__(self):
        self.items = deque()

    # Add an element at the rear
    def enqueue(self, item):
        self.items.append(item)
        print(f"Enqueued: {item}")

    # Remove an element from the front
    def dequeue(self):
        if self.is_empty():
            print("Queue is empty!")
            return None

        return self.items.popleft()

    # View the front element
    def peek(self):
        if self.is_empty():
            print("Queue is empty!")
            return None

        return self.items[0]

    # Check whether the queue is empty
    def is_empty(self):
        return len(self.items) == 0

    # Display the queue
    def display(self):
        print("Queue (front to rear):", list(self.items))


if __name__ == "__main__":
    q = Queue()

    q.enqueue(10)
    q.enqueue(20)
    q.enqueue(30)

    q.display()

    print("Front element:", q.peek())
    print("Removed element:", q.dequeue())

    q.display()
