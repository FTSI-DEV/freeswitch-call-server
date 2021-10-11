import fs from 'fs';
import yargs from 'yargs';

export class FileSystemUtils{

    createDirectoryIfNotExist(directory:string):boolean{

        if (fs.existsSync(directory)){
            return false;
        }else{
            fs.mkdirSync(directory)
            return true;
        }
    }

    deleteDir(directory:string){
        fs.rmdir(directory, (err) => {
            if (err){
                console.log(err);
                return;
            }

            console.log('Directory deleted');
        });
    }
}