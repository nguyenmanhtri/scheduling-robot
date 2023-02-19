export const getOptimalSchedule = (schedule) => {
  // Sort performances by highest priority first
  schedule.sort((a, b) => b.priority - a.priority);

  const timeline = {};
  schedule.forEach(performance => {
    if (timeline[performance.start] || timeline[performance.finish]) return;
    timeline[performance.start] = getCurrentPerformances(performance.startObj, schedule);
    timeline[performance.finish] = getCurrentPerformances(performance.finishObj, schedule);
  });

  // Sort the timeline
  const orderedTimestamps = Object.keys(timeline).sort();
  const orderedTimeline = orderedTimestamps.reduce((obj, key) => {
    obj[key] = timeline[key];
    return obj;
  }, {});

  // Create optimal schedule
  const lastTs = orderedTimestamps.pop();
  return orderedTimestamps.map((ts, idx) => ({
    band: orderedTimeline[ts].find(el => typeof el === 'string'),
    start: ts,
    finish: orderedTimestamps[idx + 1] || lastTs,
  }));
};

// Get current performances and sort by priority
const getCurrentPerformances = (time, schedule) => {
  const curPerformances = [];
  schedule.forEach(performance => {
    if (time >= performance.startObj && time < performance.finishObj) {
      curPerformances.push(performance.band);
    } else if (time === performance.finishObj) {
      curPerformances.push([performance.band, 'finish']);
    }
  })
  return curPerformances;
};
