import { envsafe, str, port } from 'envsafe';

export const config = envsafe({
  PORT: port({ default: 3001 }),
  NODE_ENV: str({ choices: ['development', 'test', 'production'], default: 'development' }),
  API_URL: str({ default: 'http://localhost:3001' }),
}); 