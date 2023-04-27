let fs = require("fs/promises");

(async()=>{
    console.time("start")
    let srcFileHandle = await fs.open("text.txt", "r");
    let destFileHandle = await fs.open("dest.txt", "w");

    let writeStream = destFileHandle.createWriteStream();
    let readStream = srcFileHandle.createReadStream();

    let buffer;
    readStream.on("data", chunk=>{
        console.log("--------------")
        if(!writeStream.write(chunk)){
            readStream.pause();
            console.log(chunk)
            readStream.destroy();
        }
       
    });

    writeStream.on("drain", ()=>{
        readStream.resume();
    });

    readStream.on("end", ()=>{

        srcFileHandle.close();
        destFileHandle.close();
        console.log("end")
        console.timeEnd("start")
    })


})()