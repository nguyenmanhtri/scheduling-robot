# Forewords
This is my proposed solution to [Skedulo's test](https://github.com/Skedulo/backend-tech-test), which is to create an optimal schedule for Sally who is going to a music festival with multiple bands playing.
# Usage
1. If you have already had Node.js on your machine, you can skip this step. Otherwise, you can install Node.js from their homepage https://nodejs.org/en/
2. Run the `build.sh` script to install the necessary dependencies
```
./scripts/build.sh
```
3. Run the `run.sh` script to create an optimal schedule from the input. You will also have to provide an input schedule to the program. In our case, the example inputs are in the folder `./examples`
```
./scripts/run.sh ./examples/example.json
```
To verify our solution with the provided verifier
```
npm run verify
```
Expected output:
```
> backend-tech-test@1.0.0 verify
> backend/music-schedule/verifier/verify-music.sh index.js node

Testing executable 'index.js' using 'node'

Testing /your/project/path/backend/music-schedule/verifier/example.json...
  OK

Testing /your/project/path/backend/music-schedule/verifier/overlapping.json...
  OK

Testing /your/project/path/backend/music-schedule/verifier/time-priority.json...
  OK

Testing /your/project/path/backend/music-schedule/verifier/minutes-resolution.json...
  OK

Testing /your/project/path/backend/music-schedule/verifier/seconds-resolution.json...
  OK

Testing /your/project/path/backend/music-schedule/verifier/timezone.json...
  OK

Finished verifying
```
# Discussion
1. [Assumptions and tradeoffs](#assumptions-and-tradeoffs)
2. [How I model my program](#how-i-model-my-program)
3. [Testing strategy](#testing-strategy)
4. [Coding approach](#coding-approach)
5. [Possible improvements](#possible-improvements)

## Assumptions and tradeoffs
1. Our server's in-memory storage is quite big, so space complexity is not a problem
2. Realistically, the number of bands at a festival is often not very big, maybe 10 at max. In this case, with every band, we have 2 timestamps, so that gives us 20 data points at worst. With this relatively small number of data points, time complexity will not be a problem either
3. At scale, we only have to worry about large number of I/O operations. So using Node.js here maybe an appropriate approach.

## How I model my program
The program has 2 main parts:
1. `index.js` is the program's entry point, which reads the input and outputs the optimal schedule for Sally
2. `./src/getOptimalSchedule.js` is where we handle all the lower-level logic for creating an optimal schedule.

## Testing strategy
Due to the time constraint, I was only able to perform the _Acceptance Test_, which is to produce the correct output for the user. Some considerations for the future:
- Unit test: The program is already broken down into small functions. Each function will handle an atomic task, which can be easily tested and maintained
- Integration test
- Performance test.

## Coding approach
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
2. Then we create an ascending timeline, which consists of every timestamp. Each timestamp will have the info of every _playing or finishing_ band already sorted by priority
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

- When checking the current active bands, our program will also see if that timestamp is the finish timestamp of any given band and remember it
- In cases where there is a gap between 2 performances, our program will detect if the current timestamp has a finishing band and no other current playing bands and jump to the next closest performance.

## Possible improvements
- Set up a performance test to see how our program handle large number of I/O processes
- Some array operations in the program could be improved
- If we have more inputs from the user such as _all the performances are non-overlapping_ or _some performances are must-see_, we can implement different algorithms to speed up our process.
