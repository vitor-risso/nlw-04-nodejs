import { Connection, createConnection, getConnectionOptions } from 'typeorm';

export default async (): Promise <Connection> => {
  const defautlOptions = await getConnectionOptions();

  return createConnection(
    Object.assign(defautlOptions, {
      database: process.env.NODE_ENV === 'test' 
        ? './src/database/database.test.sqlite' 
        : defautlOptions.database
    })
  );
} 
