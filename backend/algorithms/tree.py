
class Node:
    def __init__(self, data):
        self.data = data
        self.left = None
        self.right = None


class BinaryTree:
    def __init__(self, root_data):
        self.root = Node(root_data)

    # Preorder: Root -> Left -> Right
    def preorder(self, node):
        if node is None:
            return []

        return (
            [node.data]
            + self.preorder(node.left)
            + self.preorder(node.right)
        )

    # Inorder: Left -> Root -> Right
    def inorder(self, node):
        if node is None:
            return []

        return (
            self.inorder(node.left)
            + [node.data]
            + self.inorder(node.right)
        )

    # Postorder: Left -> Right -> Root
    def postorder(self, node):
        if node is None:
            return []

        return (
            self.postorder(node.left)
            + self.postorder(node.right)
            + [node.data]
        )


if __name__ == "__main__":
    tree = BinaryTree(1)

    tree.root.left = Node(2)
    tree.root.right = Node(3)
    tree.root.left.left = Node(4)
    tree.root.left.right = Node(5)

    print("Preorder:", tree.preorder(tree.root))
    print("Inorder:", tree.inorder(tree.root))
    print("Postorder:", tree.postorder(tree.root))
