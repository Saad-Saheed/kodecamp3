import fs from 'fs';
import fsPromise from 'fs/promises';
import path from 'path';

const source_path = '../intermediate_test';
const destination_path = '../intermediate_test_copy';

async function copier(source_path, destination_path = "") {
    try {
        source_path = path.resolve(source_path);
        destination_path = path.resolve(destination_path);

        if (!await fileExist(source_path))
            throw new Error(`Source path: ${source_path} doesn't exist!`);

        if (!await fileExist(destination_path))
            await fsPromise.mkdir(destination_path);

        if (!(await fsPromise.stat(destination_path)).isDirectory())
            throw new Error("destination path must be a directory");



        const files = await fsPromise.readdir(source_path, { encoding: "utf8" });
        await Promise.all(files.map(async (file) => {

            const sourceFile = path.resolve(source_path, file);
            const destinationFile = path.resolve(destination_path, file);

            if ((await fsPromise.stat(sourceFile)).isDirectory()) {
                copier(sourceFile, destinationFile);
            } else {              
                const readStream = fs.createReadStream(sourceFile, { encoding: "utf8" });
                const writeStream = fs.createWriteStream(destinationFile, { encoding: "utf8" });

                readStream.on("readable", () => {  
                    let chunk; 
                    console.log(`Reading: ${sourceFile}`);
                    while (null !== (chunk = readStream.read(1000))) {
                        writeStream.write(chunk);
                    }
                });

                readStream.on("end", () => {
                    console.log(`Done reading from: ${sourceFile}`);
                });              
            }
        }));      
    } catch (error) {
        console.log(error?.message);
    }

}

async function fileExist(path) {
    try {
        await fsPromise.access(path, fs.constants.R_OK);
        return true;
    } catch (error) {
        if (error.code == "ENOENT")
            return false;
    }
}

(async () => {
   await copier(source_path, destination_path);
})();