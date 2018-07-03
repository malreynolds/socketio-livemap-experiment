class Connections {
    constructor () {
        this.connectionsToDevices = {};
        this.deviceToConnections = {}
    }
    addConnection(connectionId, deviceList) {
        this.connectionsToDevices[connectionId] = new Set(deviceList);
        console.log(deviceList);
        deviceList.forEach(device => {
            console.log(device);
            this.addConnectionToDevice(device, connectionId);
        });
    }
    removeConnection(connectionId) {
        delete this.connectionsToDevices[connectionId];
        for (var deviceId in this.deviceToConnections) {
            this.deviceToConnections[deviceId].delete(connectionId);
            if (this.deviceToConnections[deviceId].size === 0)
                delete this.deviceToConnections[deviceId];
        }
    }
    
    getDeviceConnections(deviceId) {

        return this.deviceToConnections[deviceId] || new Set();
    }

    getConnectionDevices(connectionId) {
        return this.connectionsToDevices[connectionId];
    }

    addConnectionToDevice(deviceId, connection){
        if (!(deviceId in this.deviceToConnections))
            this.deviceToConnections[deviceId] = new Set();
        this.deviceToConnections[deviceId].add(connection);
    }
}

module.exports =  { Connections };