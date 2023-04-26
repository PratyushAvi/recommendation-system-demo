import collections
import random

class Agent():
    def __init__(self, tags_list):
        self.tags_list = tags_list
        self.preferred_tags = self.get_preferred_tags()
        self.tag_distribution = self.initialize_distribution()

        self.weights = (0.5, 0.5)
        self.params = [0, 0]

    def get_preferred_tags(self):
        p_tags = set()

        while len(p_tags) < 10:
            r_num = random.randint(0, len(self.tags_list) - 1)
            p_tags.add(self.tags_list[r_num])

        return p_tags
    
    def set_weights(self, weights):
        self.weights = weights
        self.params = [0] * len(weights)

    def initialize_distribution(self):
        dist = dict()
        for tag in self.tags_list:
            dist[tag] = 0.9 if tag in self.preferred_tags else 0.01
        
        return dist

    def match_percentage(self, course_tags):
        matching_tags = self.preferred_tags.intersection(set(course_tags))
        return len(matching_tags) / len(self.preferred_tags) * self.weights[0]

    def course_match_score(self, course_tags):
        self.params[0] = self.match_percentage(course_tags)

        sum_of_distribution = 0
        sum_of_match_tags = 0

        for t in self.tag_distribution:
            sum_of_distribution += self.tag_distribution[t]
            if t in course_tags:
                sum_of_match_tags += self.tag_distribution[t]
        
        self.params[1] = sum_of_match_tags / sum_of_distribution * self.weights[1]

        return sum(self.params)

    def action(self, action_key, course_tags):
        for c in course_tags:
            if action_key == 'read':
                self.tag_distribution[c] = min(1, self.tag_distribution[c] * 1.25)
            elif action_key == 'complete':
                self.tag_distribution[c] = min(1, self.tag_distribution[c] * 2)
            elif action_key == 'ignore':
                self.tag_distribution[c] = max(0, self.tag_distribution[c] * 0.75)
            elif action_key == 'reject':
                self.tag_distribution[c] = max(0, self.tag_distribution[c] * 0.01)
                # TODO: Should this result in complete removal from preferred stuff?
