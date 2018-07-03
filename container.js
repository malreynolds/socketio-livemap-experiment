class Container {
    constructor(connectionManager, io) {
        this.devices = {};
        this.io = io;
        this.connectionManager = connectionManager;
    }

    initDeviceData(devicesData) {
        devicesData.forEach(device => {
            this.updateDevice(device);
        })
    }

    getFilteredDevicesData(deviceList) {
        var deviceData = [];
        deviceList.forEach(device => deviceData.push({id: device, ...this.devices[device]}));
        return deviceData;
    }

    deviceIntersection(deviceSetA, deviceSetB) {
        // Make the complexity depend on the smaller set size
        if (deviceSetA.size > deviceSetB.size)
            [deviceSetA, deviceSetB] = [deviceSetA, deviceSetB];
        var _intersection = new Set();
        for (var elem of deviceSetB) {
            if (deviceSetA.has(elem)) {
                _intersection.add(elem);
            }
        }
        return _intersection;
    }

    updateDevices(devicesData) {
        let connectionsToUpdate = new Set();
        let deviceIds = new Set(devicesData.map(device => device.id));
        devicesData.forEach(device => {
            this.updateDevice(device);
            var connections = this.connectionManager.getDeviceConnections(device.id);
            connections.forEach(connection => connectionsToUpdate.add(connection));
        });
        connectionsToUpdate.forEach((connection) => {
            this.io.sockets.to(connection).emit("locationsUpdate", 
                this.getFilteredDevicesData(this.deviceIntersection(
                    deviceIds, this.connectionManager.getConnectionDevices(connection)
                ))
            )
        })
    }

    updateDevice(deviceData) {
        this.devices[deviceData.id] = {
            lat: deviceData.lat,
            lon: deviceData.lon
        };
    }
};

module.exports = {
    Container
}