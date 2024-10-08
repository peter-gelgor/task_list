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

  export const updateVal = async (tableName, id, key, value) => {
    const full = {
        "TableName": tableName,
        "id": id,
        "attribute": key,
        "value": (key != "availability")?(value.toString()):value
    }
    try {
        const response = await fetch(`https://s7oq8jma2i.execute-api.us-west-2.amazonaws.com/default/createMappings`, {
            method: 'PUT',
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
  }

  export const uploadImageAndUpdateSchedule = async (image, assignment) => {
    try {
        const base64Image = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result.split(',')[1]);
            reader.onerror = error => reject(error);
            reader.readAsDataURL(image);
        });

        const full = {
            "fileName": (() => {
                const timestamp = Date.now();
                const randomString = Math.random().toString(36).substring(2, 8);
                return `file_${timestamp}_${randomString}.jpg`;
                })(),
            "file": base64Image
        }
        const response = await fetch(`https://n8kpjk7bac.execute-api.us-west-2.amazonaws.com/default/uploadS3/upload`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(full)
          });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
      
        const urlData = await response.json();
        const url = JSON.parse(urlData['body'])['url'];

        await updateVal("Schedule", assignment.id, "photo_link", url);
        const finalVal = await updateVal("Schedule", assignment.id, "done", "1");

        window.location.reload();
        
        

        } catch (error) {
          console.error("There was a problem with the fetch operation:", error);
          throw error; // Re-throw the error so it can be handled by the caller
        }
    }
  

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
            id: parseInt(p.id.N),
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

    // Create an array of people IDs for round-robin assignment
    const peopleIds = Object.keys(peopleDict);
    let currentPersonIndex = 0;

    for (const [taskId, task] of sortedTasks) {
        let availableDays = Array.from({length: 7}, (_, i) => i);
        for (let i = 0; i < task.frequency; i++) {
            let assigned = false;
            let attempts = 0;

            while (!assigned && attempts < peopleIds.length) {
                const personId = peopleIds[currentPersonIndex];
                const person = peopleDict[personId];

                // Find available days for this person that haven't been assigned this task
                const possibleDays = person.availability.filter(day => 
                    availableDays.includes(day) && !assignedTasksPerDay[day].has(parseInt(taskId))
                );

                if (possibleDays.length > 0) {
                    const day = possibleDays[Math.floor(Math.random() * possibleDays.length)];

                    // Assign the task
                    if (!person.tasks[day]) person.tasks[day] = [];
                    person.tasks[day].push(parseInt(taskId));
                    task.assigned++;

                    // Add the task to the set of assigned tasks for this day
                    assignedTasksPerDay[day].add(parseInt(taskId));

                    assigned = true;

                    // Remove the day from available days if the task needs to be done every day
                    if (task.frequency === 7) {
                        availableDays = availableDays.filter(d => d !== day);
                    }
                }

                // Move to the next person in the round-robin
                currentPersonIndex = (currentPersonIndex + 1) % peopleIds.length;
                attempts++;
            }

            if (!assigned) {
                throw new Error(`Unable to assign task ${task.name} on remaining days`);
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
                'Task': entry.task.S,
                "done": entry.done.N,
                "id": entry.id.N,
                "photo_link": entry.photo_link.S,
                "approved_by": entry.approved_by.S,
                "completed_by": entry.completed_by.S
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
                        "Task": taskIdToName[taskId],
                        "done": "0",
                        "id": incrementingId,
                        "photo_link": "",
                        "approved_by": "Unapproved",
                        "completed_by": "Incomplete"
                    });
                    assignedTasksPerDay[day].add(taskId);

                    const dbEntry = {
                        "id": {"N": incrementingId.toString()},
                        "day": {"S": day},
                        "person": {"S": person.name},
                        "task": {"S": taskIdToName[taskId]},
                        "done": {"N": "0"},
                        "photo_link": {"S": ""},
                        "approved_by": {"S": "Unapproved"},
                        "completed_by": {"S": "Incomplete"}
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