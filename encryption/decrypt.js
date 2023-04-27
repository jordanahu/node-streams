let {Transform} = require("stream");
let fs = require("fs");


class Decryption extends Transform{
    
    percentCompleted;
    decryptFileName;
    err;
    fileSize;

    constructor(decryptFileName){
        super();
        this.decryptFileName = decryptFileName;
        this.percentCompleted;
    }

    _transform(chunk, encoding, callback){
        this._getFileSize();

        for(let i=0; i<chunk.length; ++i){
            if(chunk[i] < 255){
                chunk[i] = chunk[i] - 1;
            }
        }

        this.percentCompleted = Math.floor(chunk.length / this.fileSize) * 100 + "%";

        console.log(`percentage completed...${this.percentCompleted}`)

        callback(this.err || null, chunk);
    }

    _getFileSize(){
        fs.stat(this.decryptFileName, (err, stats)=>{
            if(err){
                this.err = err;
            }else{
                this.fileSize = stats.size;
            }
        })
    }
}


