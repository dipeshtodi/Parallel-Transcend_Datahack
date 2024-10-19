import networkx as nx
from models.flashcard import Flashcard

graph = nx.Graph()

def build_knowledge_graph():
    flashcards = Flashcard.query.all()
    for flashcard in flashcards:
        graph.add_node(flashcard.topic)
        for word in flashcard.question.split() + flashcard.answer.split():
            graph.add_edge(flashcard.topic, word)

def get_related_topics(topic, n=5):
    if topic not in graph:
        return []
    return sorted(graph[topic], key=lambda x: graph[topic][x]['weight'], reverse=True)[:n]