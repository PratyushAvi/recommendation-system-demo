import json
import csv
import random

import util
import agent

def main():
    with open('info.json') as f:
        data = json.load(f)

    with open(data['tags-list'], newline='') as g:
        lines = g.readlines()

        for i in range(len(lines)):
            lines[i] = lines[i].rstrip()

    tags = util.get_tags(lines, data['tags-quantity'])

    courses = util.generate_courses(tags, data['course-quantity'])

    # print(courses)

    user = agent.Agent(tags)
    print(user.preferred_tags)
    print(user.tag_distribution)

    print('\nSIMULATING BEHAVIOR\n')

    for i in range(10):
        print('Epoch', i)

        t5 = []

        for c in courses:
            score = round(user.course_match_score(courses[c]), 3)
            # print(f"Course {c}: {user.match_percentage(courses[c]) * 100}%, {score}")
            t5.append((score, c))
        
        t5.sort(reverse=True)
        t5 = t5[:5]

        print('Top 5 Courses: ', t5)

        actions = []
        for t in t5:
            action = random.choice(['read', 'complete', 'ignore', 'reject'])
            user.action(action, courses[t[1]])
            actions.append((t[1], action))
    
        print('Action taken: ', actions)

        print('Updated Course Match Scores: ')
        for c in courses:
            score = round(user.course_match_score(courses[c]), 3)
            print(f"Course {c}: {user.match_percentage(courses[c]) * 100}%, {score}")

        print('\n-------------------------\n')

    print('Final Tag Distribution')
    print(user.tag_distribution)


if __name__ == '__main__':
    main()