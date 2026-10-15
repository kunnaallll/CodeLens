
class Graph:
    def __init__(self):
        self.adjacency_list = {}

    # Add a vertex
    def add_vertex(self, vertex):
        if vertex not in self.adjacency_list:
            self.adjacency_list[vertex] = []

    # Add an edge between two vertices
    def add_edge(self, vertex1, vertex2):
        self.add_vertex(vertex1)
        self.add_vertex(vertex2)

        if vertex2 not in self.adjacency_list[vertex1]:
            self.adjacency_list[vertex1].append(vertex2)

        if vertex1 not in self.adjacency_list[vertex2]:
            self.adjacency_list[vertex2].append(vertex1)

    # Display the graph
    def display(self):
        for vertex, neighbors in self.adjacency_list.items():
            print(f"{vertex}: {neighbors}")


if __name__ == "__main__":
    graph = Graph()

    graph.add_edge("A", "B")
    graph.add_edge("A", "C")
    graph.add_edge("B", "D")
    graph.add_edge("C", "D")

    print("Graph Representation:")
    graph.display()
