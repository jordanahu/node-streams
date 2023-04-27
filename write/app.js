let fs = require("fs/promises");
let {appendFileSync, appendFile} = require("fs");


(async ()=>{
    console.time("start");
    let fileHandle = await fs.open("text.txt", "r+");
    let writeStream = fileHandle.createWriteStream();

    let i = 0;
    
    function write(){ 
        for (;i<10000000; i++){
            if(!writeStream.write(`${i}\n`)){
                break;
            }
            
        }
    }

    write();

    writeStream.on("drain", ()=>{
        write();
        // console.count("drained")
    })

    // fileHandle.close()
    console.timeEnd("start")
})()
