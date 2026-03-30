const HOURLY_RATE = 7000;
const WEEKS_PER_MONTH = 4;

const multipliers = {
  "one-on-one": 1.5,
  "group": 1,
  "intensive": 2
};

function calculateMonthlyFee(duration, weeklyFrequency, sessionType) {

  const monthlyHours = duration * weeklyFrequency * WEEKS_PER_MONTH;

  const base = monthlyHours * HOURLY_RATE;

  const multiplier = multipliers[sessionType] || 1;

  const finalAmount = Math.round(base * multiplier);

  return {
    monthlyHours,
    finalAmount
  };
}

export default calculateMonthlyFee;
