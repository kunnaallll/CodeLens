
import heapq


class MinHeap:
    def __init__(self):
        self.heap = []

    # Insert an element
    def insert(self, value):
        heapq.heappush(self.heap, value)

    # Get the smallest element
    def peek(self):
        if not self.heap:
            return None
        return self.heap[0]

    # Remove and return the smallest element
    def extract_min(self):
        if not self.heap:
            return None
        return heapq.heappop(self.heap)

    # Return all elements in sorted order without modifying the heap
    def get_sorted_elements(self):
        return sorted(self.heap)

    # Check whether the heap is empty
    def is_empty(self):
        return len(self.heap) == 0


if __name__ == "__main__":
    min_heap = MinHeap()

    for value in [40, 10, 30, 5, 20]:
        min_heap.insert(value)

    print("Heap:", min_heap.heap)
    print("Smallest element:", min_heap.peek())
    print("Extracted minimum:", min_heap.extract_min())
    print("Sorted elements:", min_heap.get_sorted_elements())
    print("Is empty:", min_heap.is_empty())
