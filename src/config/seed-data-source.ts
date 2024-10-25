import { DataSource, DataSourceOptions } from 'typeorm';
import { SeederOptions } from 'typeorm-extension';

const options: DataSourceOptions & SeederOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [],
  seeds: ['src/database/seeds/*.seed{.ts,.js}'],
};

export const seedDataSource = new DataSource(options);

(async () => {
  await seedDataSource.initialize();
  /*
    Странное поведение, если вызвать runSeeders то он вызывается дважды
    Видимо при старте скрипта npm он вызывается автоматом и еще тут
  */
  // runSeeders(seedDataSource);
})();
