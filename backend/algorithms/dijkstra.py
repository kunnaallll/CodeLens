
import heapq


def dijkstra(graph, start):
    if start not in graph:
        raise ValueError("Starting vertex does not exist")

    # Validate that all edge weights are non-negative
    for vertex, edges in graph.items():
        for neighbor, weight in edges:
            if weight < 0:
                raise ValueError("Dijkstra requires non-negative weights")
            if neighbor not in graph:
                raise ValueError(f"Vertex {neighbor} is missing from graph")

    distances = {vertex: float("inf") for vertex in graph}
    distances[start] = 0

    priority_queue = [(0, start)]

    while priority_queue:
        current_distance, current_vertex = heapq.heappop(priority_queue)

        if current_distance > distances[current_vertex]:
            continue

        for neighbor, weight in graph[current_vertex]:
            new_distance = current_distance + weight

            if new_distance < distances[neighbor]:
                distances[neighbor] = new_distance
                heapq.heappush(
                    priority_queue, (new_distance, neighbor)
                )

    return distances


if __name__ == "__main__":
    graph = {
        "A": [("B", 4), ("C", 2)],
        "B": [("A", 4), ("C", 1), ("D", 5)],
        "C": [("A", 2), ("B", 1), ("D", 8), ("E", 10)],
        "D": [("B", 5), ("C", 8), ("E", 2)],
        "E": [("C", 10), ("D", 2)]
    }

    print("Shortest distances from A:")
    for vertex, distance in dijkstra(graph, "A").items():
        print(f"{vertex}: {distance}")

