const { Schema, model } = require("mongoose");

const preferencesSchema = new Schema({
  dailySchedule: [],
  recommendedSteps: [],
  user: {},
  dreamJob: {
    type: String,
  },
  createdAt: { type: Date, default: Date.now },
});

const Preference = model("preference", preferencesSchema);

module.exports = Preference;
