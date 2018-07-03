'use strict';

const _ = require("lodash");

module.exports = {
    setDeviceList: setDeviceList
};

const NUM_DEVICES = 25;
let device_ids = _.range(1, NUM_DEVICES);

function setDeviceList(context, events, done) {
    // pick a message randomly
    let num_updates = Math.floor(Math.random() * NUM_DEVICES / 2) + 1;
    let shuffled = _.shuffle(device_ids);
    let update_ids = shuffled.slice(0, num_updates);
    context.vars.deviceList = update_ids;
    return done();
}