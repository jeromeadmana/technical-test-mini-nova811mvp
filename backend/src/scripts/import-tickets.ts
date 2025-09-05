import { AppDataSource } from '../data-source';
import fs from 'fs';
import path from 'path';
import { Ticket } from '../entities/Ticket';

async function run() {
  await AppDataSource.initialize();
  const repo = AppDataSource.getRepository(Ticket);

  const p = path.join(__dirname, '../../data/tickets.json');
  const items = JSON.parse(fs.readFileSync(p, 'utf8')) as any[];

  for (const it of items) {
    const existing = await repo.findOne({ where: { ticketNumber: it.ticketNumber } });
    const payload = {
      ticketNumber: it.ticketNumber,
      organization: it.organization || '',
      status: it.status || 'open',
      createdDate: it.createdDate ? new Date(it.createdDate) : new Date(),
      expirationDate: it.expirationDate ? new Date(it.expirationDate) : new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
      location: it.location || '',
      notes: it.notes || ''
    };

    if (existing) {
      repo.merge(existing, payload);
      await repo.save(existing);
      console.log('Updated', it.ticketNumber);
    } else {
      const t = repo.create(payload);
      await repo.save(t);
      console.log('Inserted', it.ticketNumber);
    }
  }

  console.log('Import complete.');
  process.exit(0);
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
