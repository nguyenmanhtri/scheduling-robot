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
  let previousBand;
  const orderedTimeline = orderedTimestamps.reduce((obj, key, idx) => {
    // Check to see if the current playing band is still the highest priority
    if (timeline[key][0] === previousBand) {
      orderedTimestamps[idx] = null;
      return obj;
    }

    obj[key] = timeline[key];
    previousBand = timeline[key][0];
    return obj;
  }, {});

  return parseTimeline(orderedTimestamps.filter(ts => ts), orderedTimeline);
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

const parseTimeline = (timestamps, timeline) => {
  const lastTs = timestamps.pop();
  return timestamps.map((ts, idx) => ({
    band: timeline[ts].find(el => typeof el === 'string'),
    start: ts,
    finish: timestamps[idx + 1] || lastTs,
  }));
}
