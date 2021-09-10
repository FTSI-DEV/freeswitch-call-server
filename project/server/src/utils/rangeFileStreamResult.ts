
const fs = require('fs');

export class RangeFileStreamResult{

    constructor(req,res, filepath:string,contentType:string) {
        
        var stat = fs.statSync(filepath);
        var total = stat.size;

        if (req.headers.range){
            var range = req.headers.range;
            var parts = range.replace(/bytes=/, "").split('-');
            var partialStart = parts[0];
            var partialEnd = parts[1];

            var start = parseInt(partialStart, 10);
            var end = partialEnd ? parseInt(partialEnd, 10) : total - 1;
            var chunckSize = (end-start)+1;
            var readStream = fs.createReadStream(filepath, {
                start : start,
                end: end
            });
            res.writeHead(206, {
                'Content-Range':'bytes ' + start + '-' + end + '/' + total,
                'Accept-Ranges':'bytes' , 'Content-Length' : chunckSize,
                'Content-Type' : 'audio/' + contentType 
            });

            readStream.pipe(res);
        }
        else{
            res.writeHead(200, { 'Content-Length' : total, 'Content-Type' : 'audio/wav'});
            fs.createReadStream(filepath).pipe(res);
        }
    }
}