window._storage = new (function CembriStorage() {
    this.status = 'idle';
    this.storageType = 'localStorage';
    this.result = [];
    this.debug = true;
    this.encryption = true;
    this.maxAge = 30 * 60 * 1000;


    CembriStorage.prototype.set = function (key, value, callback) {
        var storage = {
            data: value,
            created_at: new Date()
        };
        storage = JSON.stringify(storage);
        if (this.encryption) {
            key = btoa(key);
            storage = btoa(storage);
        }
        window[this.storageType].setItem(key, storage);
        if (this.debug) console.info('Set ' + key + ' : ' + value);

        if (typeof (callback) == 'function')return callback(true);
    }

    CembriStorage.prototype.get = function (key) {
        if (this.encryption) key = btoa(key);
        var storage = window[this.storageType].getItem(key);
        
        if(storage == null)return null;
        
        if (this.encryption) storage = atob(storage);
        
        storage = JSON.parse(storage);
        if (this.debug) console.info('Retrieve ' + key);
        var now = new Date();
        var created_at = new Date(storage.created_at);

        var age = now - created_at;
        
        if(this.maxAge != 0 && age > this.maxAge){
            window[this.storageType].removeItem(key);
        }
        return storage.data;
        //if (typeof (callback) == 'function')return callback(storage.data);
    }
    
    CembriStorage.prototype.remove = function (key) {
        if (this.encryption) key = btoa(key);
        var storage = window[this.storageType].removeItem(key);
        
        if (this.debug) console.info('Removing key : ' + atob(key));
        
        return storage;
    }
    
    CembriStorage.prototype.check = function (key) {
        var exists = true;
        if (this.encryption) key = btoa(key);
        var storage = window[this.storageType].getItem(key);
        
        if(storage == null) exists = false;
        
        if (this.debug) console.info('Check ' + atob(key) + " is " + exists);
        
        return exists;
    }

    return this;
})();