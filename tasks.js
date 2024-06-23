import Groq from "groq-sdk";

const groq = new Groq({
    apiKey: toString(process.env.GROQ_API_KEY), dangerouslyAllowBrowser: true
  });
async function groqSubtasks(task) {
    const subtaskList = [];
    const completion = await groq.chat.completions
        .create({
        messages: [
            {
                role: "system",
                content: "You are a helpful assistant that provides software project management guidance. When given one task to give very detailed to-do list and a history of your previous responses (to not be redundant) from an outline of a software project, you generate an extremely to-do-able/implementable list of substeps to complete it. BE CONCISE. Provide resources when applicable. You will output in a very specific format so it can be parsed with regex. Do not use any escape sequences such as tab or newline. Output 3-7 tasks. Here is the format with example tasks—follow it EXACTLY—: 'Subtask 1: Create a project plan and timeline' 'Subtask 2: Define the scope of the project' 'Subtask 3: Identify the project deliverables' 'Subtask 4: Break down the deliverables into tasks' 'Subtask 5: Estimate the time required for each task' 'Subtask 6: Create a project timeline'",
            },
            {
            role: "user",
            content: task,
            },
        ],
        model: "mixtral-8x7b-32768",
        })

        const output = completion.choices[0]?.message?.content || "";
        const pattern = /'Subtask (\d+): (.*?)'/g;
        let match;
        while ((match = pattern.exec(output)) !== null) {
            const subtaskDescription = match[2];
            subtaskList.push(subtaskDescription);
        }
    
        return subtaskList;
}

async function groqSubtaskLinks(input) {
    const subtaskLinksList = [];
    const completion = await groq.chat.completions
        .create({
        messages: [
            {
                role: "system",
                content: "You are a helpful assistant that provides software project management guidance. When given a detailed to-do give the most applicable link to help the end user complete the to-do list. You will output in a very specific format so it can be parsed with regex. Do not use any escape sequences such as tab or newline. GIVE 2-3 LINKS ONLY—THIS IS VERY IMPORTANT. Here is the format with example tasks—follow it EXACTLY—: 'Link 1: <https://www.mongodb.com/try/download/community>' 'Link 2: <https://www.npmjs.com/package/express>' Remember these are just examples use links that are relevant only.",
            },
            {
            role: "user",
            content: input,
            },
        ],
        model: "mixtral-8x7b-32768",
        })

        const output = completion.choices[0]?.message?.content || "";
        const pattern = /'Link (\d+): <(.*?)>'/g;
        let match;
        while ((match = pattern.exec(output)) !== null) {
            const subtaskDescription = match[2];
            subtaskLinksList.push(subtaskDescription);
        }
    
        return subtaskLinksList;
}



// Import OpenAI SDK and create a new OpenAI client
import OpenAI from "openai";
const openai = new OpenAI({apiKey: toString(process.env.OPENAI_API_KEY), dangerouslyAllowBrowser: true});

import moment from "moment";

async function projectAiTasksCall({name,details,libraries,start_date,end_date}) {
    const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
            {
                role: "system",
                content: "You are a helpful assistant that provides project management guidance. When asked about the project tasks, you generate a custom list of steps—or tasks—of a realistic and helpful quantity based on the specific project details provided by the user. Each task comes with a difficulty level on a scale of 1-10. Output 5-8 tasks. You will output in a very specific format so it can be parsed with regex. Do not use any escape sequences such as tab or newline. Here is the format with example tasks: 'Task 1: [Task Description]' 'Difficulty: x/10' 'Task 2: [Task Description]' 'Difficulty: x/10' 'Task 3: [Task Description]' 'Difficulty: x/10' ... 'Task n: [Task Description]' 'Difficulty: x/10' Replace '[Task Description]' with the actual description of the task. The tasks and their descriptions will vary based on the specific project and its requirements.",
            },
            {
                role: "user",
                content: `'${name}''${details}''${libraries}'}'`,
            },
        ],
    });

    // Send the response parsed as a list of strings to the database
    const output = response.choices[0].message.content;
    
    const pattern = /'Task (\d+): (.*?)' 'Difficulty: (\d+)\/10'/g;
    let match;
    const taskList = [];
    const difficultyList = [];
    let startDate = new moment(start_date);
    let endDate = new moment(end_date);
    let totalDays = endDate.diff(startDate, 'days');
    while ((match = pattern.exec(output)) !== null) {
        const taskDescription = match[2];
        const difficultyLevel = match[3];
        taskList.push(taskDescription);
        difficultyList.push(parseInt(difficultyLevel))
    }

    let sumOfDifficulties = difficultyList.reduce(function(accumulator, currentValue) {
        return accumulator + currentValue;
    }, 0);
    let deadlineList = []
    for(let i = 0; i < difficultyList.length; i++){
        let currentDayRatio = (difficultyList[i]/sumOfDifficulties);
        currentDayRatio = Math.floor(currentDayRatio*totalDays);
        let currentDeadline = startDate.add(currentDayRatio, 'days');
        if(difficultyList.length==i+1 && currentDeadline!=endDate){
            let extra = Math.floor((endDate - currentDeadline) / (1000 * 60 * 60 * 24));
            currentDeadline = currentDeadline.add(extra,'days');
        }
        deadlineList.push(currentDeadline.format("YYYY-MM-DD"));
    }

    let go = true;
    let subtaskList = [];
    while(go){
    let previousResponses = "";
    let currentInput;
    for(let i = 0; i < taskList.length; i++){
    currentInput = "Previous Responses: "+subtaskList+" Current Task To Give Detailed To-Do about: "+taskList[i];
    subtaskList.push(await groqSubtasks(currentInput));
    console.log("Subtasks: "+i);
    if(taskList.length1=i){
    previousResponses+=(subtaskList[i]);
    }
    }
    for(let i = 0; i < subtaskList.length; i++)
        {
            if(subtaskList[i]==0)
                {
                    go = true;
                    subtaskList = [];
                }
                else{
                    go=false;
                }
        }
        if(subtaskList.length==0)
            {
                go=true;
            }
    }

    let goLinks = true;
    let subtaskLinksList = [];
    while(goLinks){
    let currentInputForLinks = "";
    for(let i = 0; i < subtaskList.length; i++){
        currentInputForLinks = "Current Subtask List To Give Resources/Links For: "+subtaskList[i];
        subtaskLinksList.push(await groqSubtaskLinks(currentInputForLinks));
        console.log("Links: "+i);
        }   
        for(let i = 0; i < subtaskLinksList.length; i++)
            {
                if(subtaskLinksList[i].length==0)
                    {
                        goLinks = true;
                        subtaskLinksList = [];
                    }
                    else{
                        goLinks=false;
                    }
            }
            if(subtaskLinksList.length==0)
                {
                    goLinks=true;
                }
    }
    return { "taskList": taskList, "deadlineList": deadlineList, "subtaskList": subtaskList, "subtaskLinks": subtaskLinksList};
}

async function generateTasks({name,details,libraries,start_date,end_date}){
    const output = await projectAiTasksCall(name,details,libraries,start_date,end_date);
    for(let i = 0; i < output["taskList"].length; i++){
        console.log(output["taskList"][i]);
        console.log(output["subtaskList"][i]);
        console.log(output["subtaskLinks"][i]);
        console.log(output["deadlineList"][i]);
    }
    // return output["taskList"],output["subtaskList"],output["subtaskLinks"],output["deadlineList"];
}

export default generateTasks;