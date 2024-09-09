export const postVal = async (tableName, item) => {
    const full = {
        "TableName": tableName,
        "Item": item
    }
    try {
      const response = await fetch(`https://s7oq8jma2i.execute-api.us-west-2.amazonaws.com/default/createMappings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(full)
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      return data; // This will be the response from the server
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
      throw error; // Re-throw the error so it can be handled by the caller
    }
  };
  

export const getTable = async (tableName) => {
    try {
      const response = await fetch('https://s7oq8jma2i.execute-api.us-west-2.amazonaws.com/default/createMappings?TableName=' + tableName);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data; // Make sure this is returning an array of people
    } catch (error) {
      console.error("Error in getPeople:", error);
      return []; // Return an empty array in case of error
    }
  };

export const showTasks = (people, tasks) => {
    const result = assignTasks(people, tasks);
    console.log("result", result);
      const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      for (const personId in result) {
          const person = result[personId];
          console.log(`${person.name}:`);
          for (const day in person.tasks) {
              console.log(`  ${dayNames[day]}: ${person.tasks[day].map(taskId => tasks[taskId].name.S)}`);
          }
          console.log();
      }
}

export const assignTasks = (people, tasks) => {
    // Convert people and tasks to more manageable formats
    const peopleDict = people.reduce((acc, p) => {
        acc[parseInt(p.id.N)] = {
            name: p.name.S,
            availability: p.availability.L.map(day => parseInt(day.N)),
            tasks: {}
        };
        return acc;
    }, {});

    const tasksDict = tasks.reduce((acc, t) => {
        acc[parseInt(t.id.N)] = {
            name: t.name.S,
            frequency: parseInt(t.frequency.N),
            assigned: 0
        };
        return acc;
    }, {});

    // Sort tasks by frequency (descending)
    const sortedTasks = Object.entries(tasksDict).sort((a, b) => b[1].frequency - a[1].frequency);

    // Add this line to keep track of assigned tasks per day
    const assignedTasksPerDay = Array(7).fill().map(() => new Set());

    for (const [taskId, task] of sortedTasks) {
        let availableDays = Array.from({length: 7}, (_, i) => i);
        for (let i = 0; i < task.frequency; i++) {
            // Pre-filter eligible people outside of the function declaration
            const eligiblePeopleArray = Object.values(peopleDict).filter(p => 
                p.availability.some(day => availableDays.includes(day)));

            if (eligiblePeopleArray.length === 0) {
                throw new Error(`Unable to assign task ${task.name} on remaining days`);
            }

            const person = eligiblePeopleArray.reduce((min, p) => 
                (Object.keys(p.tasks).length / p.availability.length < Object.keys(min.tasks).length / min.availability.length) ? p : min
            );

            // Modify this part to check if the task has already been assigned on this day
            const possibleDaysArray = person.availability.filter(day => 
                availableDays.includes(day) && !assignedTasksPerDay[day].has(parseInt(taskId))
            );

            if (possibleDaysArray.length === 0) {
                throw new Error(`No available days for task ${task.name} for person ${person.name}`);
            }

            const day = possibleDaysArray[Math.floor(Math.random() * possibleDaysArray.length)];

            // Assign the task
            if (!person.tasks[day]) person.tasks[day] = [];
            person.tasks[day].push(parseInt(taskId));
            task.assigned++;

            // Add the task to the set of assigned tasks for this day
            assignedTasksPerDay[day].add(parseInt(taskId));

            // Remove the day from available days if the task needs to be done every day
            if (task.frequency === 7) {
                availableDays = availableDays.filter(d => d !== day);
            }
        }
    }

    return peopleDict;
}

export const peopleTasksToDayMap = async (people, tasks) => {
    const existingMap = await getTable('Schedule');
    if (existingMap.length > 0) {
        let map = {
            "Sunday": [],
            "Monday": [],
            "Tuesday": [],
            "Wednesday": [],
            "Thursday": [],
            "Friday": [],
            "Saturday": []
        }
        for (const entry of existingMap) {
            map[entry.day.S].push({
                "Person": entry.person.S,
                'Task': entry.task.S
            })
        }
        return map;
    }
    const result = assignTasks(people, tasks);
    const numToDayMap = {
        0: "Sunday",
        1: "Monday",
        2: "Tuesday",
        3: "Wednesday",
        4: "Thursday",
        5: "Friday",
        6: "Saturday"
    }
    let map = {
        "Sunday": [],
        "Monday": [],
        "Tuesday": [],
        "Wednesday": [],
        "Thursday": [],
        "Friday": [],
        "Saturday": []
    }
    const assignedTasksPerDay = {
        "Sunday": new Set(),
        "Monday": new Set(),
        "Tuesday": new Set(),
        "Wednesday": new Set(),
        "Thursday": new Set(),
        "Friday": new Set(),
        "Saturday": new Set()
    }

    // Create a taskId to task name mapping
    const taskIdToName = tasks.reduce((acc, task) => {
        acc[task.id.N] = task.name.S;
        return acc;
    }, {});

    let dbUploads = [];
    let incrementingId = 0;

    for (const personId in result) {
        const person = result[personId];
        for (const dayId in person.tasks) {
            const day = numToDayMap[dayId];
            for (const taskId of person.tasks[dayId]) {
                if (!assignedTasksPerDay[day].has(taskId)) {
                    map[day].push({
                        "Person": person.name,
                        "Task": taskIdToName[taskId]
                    });
                    assignedTasksPerDay[day].add(taskId);

                    const dbEntry = {
                        "id": {"N": incrementingId.toString()},
                        "day": {"S": day},
                        "person": {"S": person.name},
                        "task": {"S": taskIdToName[taskId]}
                    };
                    dbUploads.push(dbEntry);
                    incrementingId++;
                }
            }
        }
    }
    for (const entry of dbUploads) {
        try {
            await postVal('Schedule', entry);
        } catch (error) {
            console.error(`Failed to upload entry: ${JSON.stringify(entry)}`, error);
        }
    }

    return map;
}