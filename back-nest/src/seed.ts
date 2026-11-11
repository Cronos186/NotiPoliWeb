import { DataSource } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';

async function seed() {
  const dataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: 5432,
    username: process.env.DB_USER || 'user',
    password: process.env.DB_PASS || 'password',
    database: process.env.DB_NAME || 'notipolibd',
    entities: [__dirname + '/**/*.entity{.ts,.js}'],
    synchronize: true,
  });
  await dataSource.initialize();

  const usuariosRepo = dataSource.getRepository('Usuario');
  const noticiasRepo = dataSource.getRepository('Noticia');
  const favoritosRepo = dataSource.getRepository('Favorito');

  const noticiasCount = await noticiasRepo.count();
  const usuariosCount = await usuariosRepo.count();
  const favoritosCount = await favoritosRepo.count();

  let hayCambios = false;

  if (noticiasCount === 0) {
    console.log('Sembrando noticias...');
    const noticiasPath = path.join(__dirname, '../data/noticias.json');
    if (fs.existsSync(noticiasPath)) {
      const noticiasData = JSON.parse(fs.readFileSync(noticiasPath, 'utf-8'));
      for (const n of noticiasData.noticias) {
        await noticiasRepo.save(n);
      }
      console.log('Noticias sembradas');
      hayCambios = true;
    }
  }

  if (usuariosCount === 0) {
    console.log('Sembrando usuarios...');
    const usuariosPath = path.join(__dirname, '../data/usuarios.json');
    if (fs.existsSync(usuariosPath)) {
      const usuariosData = JSON.parse(fs.readFileSync(usuariosPath, 'utf-8'));
      for (const u of usuariosData.usuarios) {
        await usuariosRepo.save(u);
      }
      console.log('Usuarios sembrados');
      hayCambios = true;
    }
  }

  // Favoritos se siembran independientemente si la tabla está vacía
  if (favoritosCount === 0) {
    console.log('Sembrando favoritos...');
    const favPath = path.join(__dirname, '../data/favoritos.json');
    if (fs.existsSync(favPath)) {
      const favData = JSON.parse(fs.readFileSync(favPath, 'utf-8'));
      for (const f of favData.favoritos) {
        const usuario = await usuariosRepo.findOneBy({ email: f.email });
        if (usuario) {
          for (const nid of f.noticias) {
            await favoritosRepo.save({ usuario, noticia: { id: nid } } as any);
          }
        }
      }
      console.log('Favoritos sembrados');
      hayCambios = true;
    }
  }

  if (!hayCambios) {
    console.log('Base de datos ya contiene datos, semilla omitida');
  }

  await dataSource.destroy();
}
seed().catch(console.error);