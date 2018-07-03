var redis = require('redis');

class Container {
    constructor(connections) {
        this.redisClient = redis.createClient();
        this.redisClient.on("connect", function () {
            console.log("Redis client connected");
        })
        this.redisClient.on("error", function (e) {
            console.log("Something went wrong " + e);
        })
        this.connections = connections;
    }
    updateDevices(deviceUpdates) {
        let connectionsToUpdate = new Set();
        deviceUpdates.forEach(device => {
            setDeviceData(device)
            var connections = getDeviceConnections(device.id)
            connections.forEach(connection => connectionsToUpdate.add(connection));
        });
        connectionsToUpdate.forEach((connection) => {
        // emit connection update 
        // socket.to(connection)
        })
    }

    setDeviceData(data) {
        // this.redisClient.hmset("devices", "lat", data.lat, "lon", data.lon);
    }

    addConnectionToDevice(connections, deviceId){
        this.redisClient.sadd(deviceId, ...connections);
    }

    getDeviceConnections(deviceId) {
        this.redisClient.smembers(deviceId);
    }
}

module.exports = {
    Container
}