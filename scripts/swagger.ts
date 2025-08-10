import { generateApi, generateTemplates } from 'swagger-typescript-api';
import path from 'path';
import fs from 'fs';

generateApi({
    name: 'nb_server_api',
    output: false,
    url: `http://localhost:3001/api-json`,
    httpClientType: 'axios',
    singleHttpClient: true,
    modular: true,
    templates: path.resolve(process.cwd(), './templates/swagger'),
    extractRequestParams: true,
    extractRequestBody: true,
    extractEnums: true,
    enumNamesAsValues: true,
})
    .then(({ files, configuration }) => {
        files.forEach(({ fileContent, fileExtension, fileName }) => {
            if (!fileContent) return;
            const fullFileName = fileName + fileExtension;
            const outputPath = path.resolve(process.cwd(), './libs/apis', fullFileName);
            fs.writeFileSync(outputPath, fileContent);
            console.log(`✅ ${fullFileName} created successfully`);
        });
    })
    .catch((e: any) => console.error(e));
