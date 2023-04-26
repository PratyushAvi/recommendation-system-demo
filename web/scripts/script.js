let occupations = ['Safety Officer', 'Horticulturalist', 'Garage Manager', 'Miller', 'Grocer', 'HGV Driver', 'Wheel Clamper', 'Bacon Curer', 'Airport Controller', 'Studio Manager', 'Verger', 'Ticket Inspector', 'Cafe Owner', 'Shipyard Worker', 'Circus Worker', 'Planning Officer', 'History Teacher', 'Sign Maker', 'Bank Messenger', 'Golfer', 'Geophysicist', 'Optical Assistant', 'Sports Commentator', 'Forester', 'Tax Consultant', 'Solicitor', 'Marketing Assistant', 'Oil Broker', 'Log Merchant', 'Lorry Driver', 'Business Proprietor', 'Cleric', 'Sheriff Principal', 'Market Researcher', 'Revenue Officer', 'Furnace Man'];

let preferred_tags = new Set();
let tag_distribution = {};

let courses = {};

let top_5 = [];

document.addEventListener('DOMContentLoaded', () => {
    var tag_list_HTML = document.getElementById('tag-list');

    for (let o in occupations) {
        tag_distribution[occupations[o]] = 0.1
        let node = document.createElement('li');
        let button = document.createElement('button');
        button.id = o;
        button.classList = 'default_button';

        let some_div = document.createElement('div');
        some_div.classList = 'flex';

        let text1 = document.createElement('p');
        let text2 = document.createElement('p');
        let text3 = document.createElement('p');
        text1.innerHTML = occupations[o];
        text2.innerHTML = '|'
        text2.classList = 'mx-[10px]'
        text1.classList = 'mx-[2px]'
        text3.innerHTML = tag_distribution[occupations[o]];
        text3.id = 'button-' + o + '-text';
        text3.classList = 'mx-[2px]'

        some_div.appendChild(text1);
        some_div.appendChild(text2);
        some_div.appendChild(text3);

        button.append(some_div);

        button.onclick = function (event) {
            if (!preferred_tags.has(occupations[button.id])) {
                button.classList = 'selected_button';

                tag_distribution[occupations[button.id]] = 0.9;
                preferred_tags.add(occupations[button.id]);

            }
            else {
                button.classList = 'default_button';

                tag_distribution[occupations[button.id]] = 0.1;
                preferred_tags.delete(occupations[button.id]);
            }

            updateDistributionView();
            showCourses();
        }

        node.appendChild(button);
        tag_list_HTML.appendChild(node);
    }

    updateDistributionView();

    generateCourses();

    showCourses();
});

function generateCourses() {
    for (let i = 0; i < 100; i++) {
        courses[i] = [];
        let r_num = Math.floor(Math.random() * 3) + 3;

        let used = new Set();
        while (courses[i].length < r_num) {
            let rc_num = Math.floor(Math.random() * occupations.length);
            if (used.has(rc_num))
                continue;
            else {
                courses[i].push(occupations[rc_num]);
                used.add(rc_num);
            }
        }
    }
}

function executeAction(action, course_num)
{
    if(action === 'read')
    {
        for(let c in courses[course_num])
        {
            tag_distribution[courses[course_num][c]] = Math.min(tag_distribution[courses[course_num][c]] * 1.5, 1);
        }
    }

    else if(action === 'complete')
    {
        for(let c in courses[course_num])
        {
            tag_distribution[courses[course_num][c]] = Math.min(tag_distribution[courses[course_num][c]] * 5, 1);
        }
        delete courses[course_num];
        console.log(Object.keys(courses).length);
    }
    else if(action === 'ignore')
    {
        for(let c in courses[course_num])
        {
            tag_distribution[courses[course_num][c]] = Math.max(tag_distribution[courses[course_num][c]] * 0.75, 0.01);
        }
    }
    else if(action === 'reject')
    {
        for(let c in courses[course_num])
        {
            tag_distribution[courses[course_num][c]] = Math.max(tag_distribution[courses[course_num][c]] * 0.1, 0.01);
        }
    }
}

function showCourses() {
    getTop5();
    // console.log(top_5);

    let course_list = document.getElementById('course-list');
    course_list.innerHTML = '';
    for (let t in top_5) {
        let list_item = document.createElement('li');

        let superdiv = document.createElement('div');

        let item = document.createElement('div');
        let text1 = document.createElement('p');
        text1.innerText = 'Course ' + top_5[t].course + ' (Score: ' + top_5[t].score + ')';
        text1.classList = 'font-bold'
        let text2 = document.createElement('p');
        text2.innerText = 'Tags: ' + courses[top_5[t].course];
        text2.classList ='italic'
        item.appendChild(text1);
        item.appendChild(text2);

        let options = document.createElement('ul');
        options.classList = 'flex';

        let actions = ['read', 'complete', 'ignore', 'reject'];

        for (let a in actions) {
            let action_button = document.createElement('button');
            action_button.classList = 'w-[100px] default_button';
            action_button.innerHTML = actions[a];

            options.appendChild(action_button);

            action_button.onclick = function () {
                action_button.classList = 'w-[100px] selected_button';
                executeAction(action_button.innerHTML, top_5[t].course);
                updateDistributionView();
                showCourses();
            }
        }

        superdiv.append(item);
        superdiv.append(options);

        superdiv.classList = 'superdiv';
        if (top_5[t].random == false)
            superdiv.classList = 'superdiv border-[#777]'

        list_item.appendChild(superdiv);
        course_list.appendChild(list_item);
    }
}

function getTop5() {
    top_5 = [];
    if (!preferred_tags.size) {
        let t5 = [];
        while (top_5.length < 10) {
            let r_num = Math.floor(Math.random() * Object.keys(courses).length);
            if (!t5.includes(r_num)) {
                t5.push(r_num);
                top_5.push({ "score": NaN, "course": r_num, "random": true });
            }
        }
    }
    else {
        let scores = [];
        let t5 = [];
        for (let c in courses) {
            let score = 0;
            let intersection = courses[c].filter(value => preferred_tags.has(value));
            score += intersection.length / preferred_tags.size * 0.5;

            let sum1 = 0, sum2 = 0;
            for (let o in occupations) {
                sum2 += tag_distribution[occupations[o]];
                if (courses[c].includes(occupations[o]))
                    sum1 += tag_distribution[occupations[o]];
            }
            score += sum1 / sum2;

            scores.push({ "score": score.toPrecision(2), "course": c, 'random': false });
        }

        scores.sort((a, b) => (a.score < b.score) ? 1 : -1);
        top_5 = scores.slice(0, 5);
        for (let t in top_5)
        {
            t5.push(top_5[t].course);
        }

        while (top_5.length < 10) {
            let r_num = Math.floor(Math.random() * (Object.keys(courses).length - 5)) + 5;
            if (!t5.includes(r_num)) {
                t5.push(r_num);
                scores[r_num].random = true;
                top_5.push(scores[r_num]);
            }
        }
    }
}

function updateDistributionView() {
    for (let i in occupations) {
        document.getElementById('button-' + i + '-text').innerText = tag_distribution[occupations[i]].toPrecision(2);
    }
}