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
1.
