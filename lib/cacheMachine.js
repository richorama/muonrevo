var storage = require('./memStorage');

module.exports.addCachingMethods = function(dbx){
    
    dbx.filesCachedDownload = (meta) => {

        return new Promise((resolve, reject) => {
            
            var cachedFile = storage.get(meta.path) || {};
            if (cachedFile.rev === meta.rev) return resolve(cachedFile);
            
            dbx.filesDownload(meta).then(data => {
                storage.put(meta.path, data);
                resolve(data);
            });
        });
    }    

}