
class Node:
    def __init__(self, data):
        self.data = data
        self.left = None
        self.right = None


class BinarySearchTree:
    def __init__(self):
        self.root = None

    def insert(self, data):
        self.root = self._insert(self.root, data)

    def _insert(self, node, data):
        if node is None:
            return Node(data)

        if data < node.data:
            node.left = self._insert(node.left, data)
        elif data > node.data:
            node.right = self._insert(node.right, data)

        return node

    def search(self, data):
        current = self.root

        while current:
            if data == current.data:
                return True
            elif data < current.data:
                current = current.left
            else:
                current = current.right

        return False

    def inorder(self, node):
        if node is None:
            return []

        return (
            self.inorder(node.left)
            + [node.data]
            + self.inorder(node.right)
        )


if __name__ == "__main__":
    bst = BinarySearchTree()

    for value in [50, 30, 70, 20, 40, 60, 80]:
        bst.insert(value)

    print("BST Inorder:", bst.inorder(bst.root))
    print("Search 40:", bst.search(40))
    print("Search 90:", bst.search(90))
