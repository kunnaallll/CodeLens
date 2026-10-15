
def dfs(graph, start):
    if start not in graph:
        return []

    visited = set()
    traversal = []

    def visit(vertex):
        visited.add(vertex)
        traversal.append(vertex)

        for neighbor in graph.get(vertex, []):
            if neighbor not in visited:
                visit(neighbor)

    visit(start)
    return traversal


if __name__ == "__main__":
    graph = {
        "A": ["B", "C"],
        "B": ["A", "D", "E"],
        "C": ["A", "F"],
        "D": ["B"],
        "E": ["B", "F"],
        "F": ["C", "E"]
    }

    print("DFS Traversal:", dfs(graph, "A"))
