import random

def get_tags(tag_list, tag_quantity):
    tags = set()

    while len(tags) < tag_quantity:
        r_num = random.randint(0, len(tag_list)-1)
        tags.add(tag_list[r_num])

    return list(tags)

def generate_courses(tags, num_courses):
    courses = dict()
    i = 0
    while i < num_courses:
        course_tags = set()

        while len(course_tags) < random.randint(3, 5):
            r_num = random.randint(0, len(tags) - 1)
            course_tags.add(tags[r_num])
        
        courses[i] = list(course_tags)

        i += 1

    return courses