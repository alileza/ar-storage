window._storage = new(function CembriStorage() {
    this.status = 'idle';
    this.storageType = 'localStorage';
    this.result = [];
    this.debug = false;
    this.encryption = true;


    CembriStorage.prototype.set = function (key, value, callback) {
        var storage = {
            data: value
        };
        storage = JSON.stringify(storage);
        if (this.encryption) {
            key = btoa(key);
            storage = btoa(storage);
        }
        window[this.storageType].setItem(key, storage);
        if (this.debug) console.info('Set ' + key + ' : ' + value);

        if (typeof (callback) == 'function') callback(true);
    }

    CembriStorage.prototype.get = function (key, callback) {
        if (this.encryption) key = btoa(key);
        var storage = window[this.storageType].getItem(key);
        if (this.encryption) storage = atob(storage);
        storage = JSON.parse(storage);
        if (this.debug) console.info('Retrieve ' + key);

        if (typeof (callback) == 'function') callback(storage.data);
    }

    return this;
})();