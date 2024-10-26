import { DataSource, DataSourceOptions } from 'typeorm';
import { SeederOptions } from 'typeorm-extension';

const options: DataSourceOptions & SeederOptions = {
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: Number(process.env.POSTGRES_PORT),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
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
