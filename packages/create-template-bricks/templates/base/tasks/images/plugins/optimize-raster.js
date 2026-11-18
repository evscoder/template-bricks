import path from 'node:path';
import { Transform } from 'node:stream';
import sharp from 'sharp';

const optimize = async (file, optimizePng) => {
    const extension = path.extname(file.path).toLowerCase();
    if (!['.jpg', '.jpeg', '.gif'].includes(extension)
        && !(extension === '.png' && optimizePng)) return;

    const image = sharp(file.contents, { animated: true }).keepMetadata();
    let output;

    if (extension === '.jpg' || extension === '.jpeg') {
        output = image.jpeg({ quality: 80, progressive: true });
    } else if (extension === '.png') {
        output = image.png({ compressionLevel: 9 });
    } else {
        output = image.gif({ progressive: true, effort: 3 });
    }

    const contents = await output.toBuffer();
    if (contents.length < file.contents.length) file.contents = contents;
};

export default function optimizeRaster({ optimizePng }) {
    return new Transform({
        objectMode: true,
        transform(file, encoding, callback) {
            if (file.isNull()) {
                callback(null, file);
                return;
            }
            if (file.isStream()) {
                callback(new Error(`Image optimization requires buffered files: ${file.path}`));
                return;
            }

            optimize(file, optimizePng).then(
                () => callback(null, file),
                error => callback(new Error(`Cannot optimize image ${file.path}: ${error.message}`, { cause: error }))
            );
        }
    });
}
