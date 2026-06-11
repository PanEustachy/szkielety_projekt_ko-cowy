const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const { sequelize, createDatabaseIfNotExists, User, Article } = require('./models');

dotenv.config();

const seed = async () => {
  await createDatabaseIfNotExists();
  await sequelize.sync({ alter: true });

  const adminPassword = await bcrypt.hash('admin123', 12);
  const editorPassword = await bcrypt.hash('editor123', 12);

  const [admin] = await User.findOrCreate({
    where: { email: 'admin@example.com' },
    defaults: { name: 'Administrator', passwordHash: adminPassword, role: 'admin' },
  });

  const [editor] = await User.findOrCreate({
    where: { email: 'editor@example.com' },
    defaults: { name: 'Redaktor', passwordHash: editorPassword, role: 'editor' },
  });

  await Article.findOrCreate({
    where: { title: 'Wprowadzenie do systemu blogowego' },
    defaults: {
      content: 'To jest pierwszy artykuł. System obsługuje role, CRUD oraz ocenianie.',
      tags: 'vue,express,nodejs',
      categories: 'programowanie,blog',
      authorId: admin.id,
      publicationDate: new Date(),
    },
  });

  await Article.findOrCreate({
    where: { title: 'Jak działa uprawnienie redaktora' },
    defaults: {
      content: 'Redaktor może tworzyć, edytować i usuwać swoje artykuły, ale nie cudze.',
      tags: 'role,uprawnienia',
      categories: 'bezpieczeństwo,aplikacja',
      authorId: editor.id,
      publicationDate: new Date(),
    },
  });

  console.log('Baza danych zainicjalizowana. Użytkownicy: admin@example.com / admin123, editor@example.com / editor123');
  process.exit(0);
};

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
