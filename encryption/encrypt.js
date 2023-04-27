let {Transform, pipeline, finished} = require("stream");
let fs = require("fs");


class Encryption extends Transform{
    
    percentCompleted;
    encryptFileName;
    err;
    bytesRead;
    previousPercentLevel;

    constructor(encryptFileName){
        super();
        this.encryptFileName = encryptFileName;
        this.percentCompleted;
        this.bytesRead = 0;
    }

 
     _transform(chunk, encoding, callback){
        this._getFileSize();
        this.once("fileSizeReady", (fileSize)=>{
            for(let i=0; i<chunk.length; ++i){
                if(chunk[i] < 255){
                    chunk[i] = chunk[i] + 1;
                }
            }
            this.bytesRead+=chunk.length;
    
            this.percentCompleted = Math.floor(this.bytesRead / fileSize * 100);

            if(this.percentCompleted != this.previousPercentLevel){
                console.clear();
                console.log(`percentage completed...${this.percentCompleted}%`)

            }

            this.previousPercentLevel = this.percentCompleted;
    
            callback(this.err || null, chunk);
        })

    }


    _getFileSize(){
        fs.stat(this.encryptFileName, (err, stats)=>{
            if(err){
                this.err = err;
            }else{
                this.emit("fileSizeReady", stats.size)
            }
        })
    }
}


let encrypt = new Encryption("file.txt");

let readableFileStream = fs.createReadStream("file.txt");
let encryptedFileStream = fs.createWriteStream("encryptedFile.txt");

pipeline(readableFileStream, encrypt, encryptedFileStream, err=>{
    if(err){
        console.log("the error is, ",err)
    }
})
