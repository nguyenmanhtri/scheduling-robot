export const getOptimalSchedule = (schedule) => {
  // Sort performances by highest priority first
  schedule.sort((a, b) => b.priority - a.priority);

  const timeline = {};
  schedule.forEach(performance => {
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

  return parseTimeline(orderedTimestamps, orderedTimeline);
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
  const validTimestamps = timestamps.filter(ts => ts);
  const lastTs = validTimestamps.pop();

  const optimalSchedule = [];
  for (let i = 0; i < validTimestamps.length; i++) {
    const band = timeline[validTimestamps[i]].find(el => typeof el === 'string');
    if (!band) continue;
    optimalSchedule.push({
      band,
      start: validTimestamps[i],
      finish: validTimestamps[i + 1] || lastTs,
    })
  }
  return optimalSchedule;
}
