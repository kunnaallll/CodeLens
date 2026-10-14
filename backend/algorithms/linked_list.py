
class Node:
    def __init__(self, data):
        self.data = data
        self.next = None


class LinkedList:
    def __init__(self):
        self.head = None

    # Insert a node at the end
    def insert(self, data):
        new_node = Node(data)

        if self.head is None:
            self.head = new_node
            return

        current = self.head
        while current.next:
            current = current.next

        current.next = new_node

    # Display all nodes
    def display(self):
        elements = []
        current = self.head

        while current:
            elements.append(current.data)
            current = current.next

        return elements

    # Search for a value
    def search(self, value):
        current = self.head
        position = 0

        while current:
            if current.data == value:
                return position
            current = current.next
            position += 1

        return -1

    # Delete the first matching node
    def delete(self, value):
        current = self.head

        if current and current.data == value:
            self.head = current.next
            return True

        while current and current.next:
            if current.next.data == value:
                current.next = current.next.next
                return True
            current = current.next

        return False


if __name__ == "__main__":
    linked_list = LinkedList()

    linked_list.insert(10)
    linked_list.insert(20)
    linked_list.insert(30)

    print("Linked List:", linked_list.display())
    print("Search 20:", linked_list.search(20))
    print("Delete 20:", linked_list.delete(20))
    print("After deletion:", linked_list.display())
