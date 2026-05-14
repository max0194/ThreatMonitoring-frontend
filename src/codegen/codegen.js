import path from 'path'
import { generateApi } from 'swagger-typescript-api' 

generateApi({
    name: 'api.ts',
    singleHttpClient: true,
    httpClientType: 'axios',
    modular: true,
    // Путь к OpenAPI-файлу
    input: path.resolve(process.cwd(), './src/api/openapi.json'),

    // Папка для сохранения сгенерированного кода
    output: path.resolve(process.cwd(), './src/api'),
})
  .then(() => console.log('API успешно сгенерирован!'))
  .catch(console.error);
