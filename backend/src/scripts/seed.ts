import { AppDataSource } from '../data-source';
import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import { Role } from '../entities/Role';
import { User } from '../entities/User';

async function run() {
  await AppDataSource.initialize();

  const roleRepo = AppDataSource.getRepository(Role);
  const userRepo = AppDataSource.getRepository(User);

  const rolesPath = path.join(__dirname, '../../data/roles.json');
  const usersPath = path.join(__dirname, '../../data/users.json');

  const roles = JSON.parse(fs.readFileSync(rolesPath, 'utf8')) as { name: string }[];
  for (const r of roles) {
    let existing = await roleRepo.findOneBy({ name: r.name });
    if (!existing) {
      const role = roleRepo.create({ name: r.name });
      await roleRepo.save(role);
      console.log('Created role', r.name);
    }
  }

  const users = JSON.parse(fs.readFileSync(usersPath, 'utf8')) as { username: string, password: string, role: string }[];
  for (const u of users) {
    let existing = await userRepo.findOne({ where: { username: u.username } });
    if (!existing) {
      const role = await roleRepo.findOneBy({ name: u.role });
      const hashed = bcrypt.hashSync(u.password, 10);
      const user = userRepo.create({ username: u.username, password: hashed, role: role! });
      await userRepo.save(user);
      console.log('Created user', u.username);
    }
  }

  console.log('Seeding complete.');
  process.exit(0);
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
