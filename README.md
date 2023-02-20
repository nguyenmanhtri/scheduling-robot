1. Install node
2. `chmod -R +x ./scripts/`
3. `chmod +x ./backend/music-schedule/verifier/verify-music.sh`

1. How you model your program?
2. Language of choice: JavaScript. Why?
3. Coding approach?
- Assumptions made?
- Tradeoffs?
4. What testing strategy you apply to ensure that any solution has future maintainability?
- Break the challenge into smaller functional tasks
- Each function will handle an atomic task, which can be easily tested and maintained
5. A readme that discusses your approach, any concessions you made, any self imposed constraints, anything that you think would be valuable for the reviewer to know.

# Program Modelling
The program has 2 main parts:
1. `index.js` is the program's entry point, which reads the input and outputs the optimal schedule for Sally
2. `./src/getOptimalSchedule.js` is where we handle all the lower-level logic for creating an optimal schedule.

I chose JavaScript because...

# Assumptions and Tradeoffs
1. Our server's in-memory storage is quite big, so space complexity is not a problem
2.

# Coding Approach
0. There are 2 variables that we need to consider, priority and time
```
[
  {
    "band" : "Soundgarden",
    "start" : "1993-05-25T02:00:00Z",
    "finish" : "1993-05-25T02:50:00Z",
    "priority" : 5
  },
  {
    "band" : "Pearl Jam",
    "start" : "1993-05-25T02:15:00Z",
    "finish" : "1993-05-25T02:35:00Z",
    "priority" : 9
  }
]
```
1. Because at any given time, Sally wants to attend to best performance (highest priority) possible, we sort the performance object in the order of descending priority
```
[
  {
    "band" : "Pearl Jam",
    "start" : "1993-05-25T02:15:00Z",
    "finish" : "1993-05-25T02:35:00Z",
    "priority" : 9
  },
  {
    "band" : "Soundgarden",
    "start" : "1993-05-25T02:00:00Z",
    "finish" : "1993-05-25T02:50:00Z",
    "priority" : 5
  }
]
```
2. Then we create a ascending timeline, which consists of every timestamp. Each timestamp will have the info of every _playing or finishing_ band already sorted by priority
```
{
  "1993-05-25T02:00:00Z": ["Soundgarden"],
  "1993-05-25T02:15:00Z": ["Pearl Jam", "Soundgarden"],
  "1993-05-25T02:35:00Z": [["Pearl Jam", "finish"], "Soundgarden"],
  "1993-05-25T02:50:00Z": [["Soundgarden", "finish"]]
}
```
3. The final step is to create our optimal schedule. We do this by going through our timeline, creating a joining-time-window object for every timestamp, with the start time being that timestamp and the finish time being the next timestamp. We skip the last timestamp because this timestamp will always contain finishing band.
```
[
  {
    "band" : "Soundgarden",
    "start" : "1993-05-25T02:00:00Z",
    "finish" : "1993-05-25T02:15:00Z"
  },
  {
    "band" : "Pearl Jam",
    "start" : "1993-05-25T02:15:00Z",
    "finish" : "1993-05-25T02:35:00Z"
  },
  {
    "band" : "Soundgarden",
    "start" : "1993-05-25T02:35:00Z",
    "finish" : "1993-05-25T02:50:00Z"
  }
]
```

## Some Considerations
1. When considering the current active bands, our program will also see if that timestamp is the finish timestamp of any given band and mark it
2. In cases where there is a gap between 2 performances, our program will detect if the current timestamp has a finishing band and no other current playing bands and jump to the next closest performance
