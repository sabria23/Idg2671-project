import multer from 'multer';
import path from 'path';


const storage = multer.memoryStorage();
 
const fileFilter = (req, file, cb) => {
    const allowedTypes = [
        'image/jpeg', 'image/png', 'image/gif',
        'video/mp4', 'video/mpeg',
        'audio/mpeg', 'audio/wav',
        'text/plain', 'application/pdf'
    ];

    if(allowedTypes.includes(file.mimetype)){
        cb(null, true);
    } else{
        cb(new Error(`File type ${file.mimetype} is not allowed`), false);
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 10 * 1024 *1024}

});

export default upload;