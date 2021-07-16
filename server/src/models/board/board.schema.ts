import { Schema } from 'mongoose';
import moment from 'moment';

const BoardSchema = new Schema({
  timestamp: { type: Date, default: new Date() }, // date when the arduino was activated
  status: {
    connected: { type: Boolean, default: false }, // status if the arduino is connected
    port: { type: String, default: '' }, // status on which port the arduino is connected
  },
  sensor: {
    connected: { type: Boolean, default: false },
    pin: { type: String, default: '' },
    interval: { type: Number, default: 3000 }, // iterval to collect sensor data in ms
    calibration: {
      air: { type: Number, default: 800 }, // replace the value with value when placed in air
      water: { type: Number, default: 350 },
    },
  },
  pump: {
    connected: { type: Boolean, default: false },
    pin: { type: String, default: '' },
    active: { type: Boolean, default: false }, // whether pump is currently running
    sensor: {
      active: { type: Boolean, default: true }, // whether the pump should pump when the sensor data is available
      duration: { type: Number, default: 1000 },
      average: {
        value: { type: Number, default: 20 }, // Start the pump when the humidity is 20% or below
        for: {
          type: Number,
          default: 60 * 60 * 100, // (60*60*1000)ms = 1h  // start pump when the average humidity is for x time exact or below the value
        },
      },
    },
    refill: {
      active: { type: Boolean, default: false }, // whether the pump should be refilled
      average: {
        value: { type: Number, default: 20 }, // when the humidity is below x%
        for: {
          type: Number,
          default: 2 * 60 * 60 * 100, // when the humidity is below x humidity for y hours
        },
      },
    },
    schedule: {
      active: { type: Boolean, default: false }, // schedule the pump start
      cron: { type: String, default: '0 8 * * 0' }, // cron job
      duration: { type: Number, default: 1000 }, // pump duration
    },
  },
  stripe: {
    connected: { type: Boolean, default: false },
    pin: { type: String, default: '' },
    active: { type: Boolean, default: false }, // wheter the stripe is active
    schedule: {
      active: { type: Boolean, default: true }, // wheter the schedule should be used
      from: {
        type: String, // schedule start
        default: moment().hours(8).minutes(0).seconds(0).format('HH:mm:ss'), // '08:00:00'
      },
      to: {
        type: String, // schedule end
        default: moment().hours(22).minutes(0).seconds(0).format('HH:mm:ss'), // '22:00:00'
      },
    },
  },
});

export default BoardSchema;
