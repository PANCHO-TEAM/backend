import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const products = [
  {
    title: 'Кот-Булочка',
    description: 'Пушистый котик, свернувшийся калачиком. Идеально для уютных вечеров.',
    weight: 2.5,
    images: ['https://placekitten.com/400/300', 'https://placekitten.com/401/300'],
  },
  {
    title: 'Рыжий Комик',
    description: 'Забавный рыжий кот с игривым характером. Поднимет настроение!',
    weight: 3.0,
    images: ['https://placekitten.com/402/300'],
  },
  {
    title: 'Серый Философ',
    description: 'Спокойный и мудрый кот для созерцания жизненных истин.',
    weight: 4.2,
    images: ['https://placekitten.com/403/300', 'https://placekitten.com/404/300'],
  },
  {
    title: 'Чёрный Ниндзя',
    description: 'Незаметный и грациозный. Появляется из ниоткуда.',
    weight: 3.5,
    images: ['https://placekitten.com/405/300'],
  },
  {
    title: 'Белоснежное Чудо',
    description: 'Нежный белый котёнок с голубыми глазами.',
    weight: 1.8,
    images: ['https://placekitten.com/406/300', 'https://placekitten.com/407/300'],
  },
  {
    title: 'Полосатый Разбойник',
    description: 'Активный и любопытный кот с характерными полосками.',
    weight: 3.8,
    images: ['https://placekitten.com/408/300'],
  },
  {
    title: 'Персидский Аристократ',
    description: 'Элегантный кот с длинной шерстью и царственной осанкой.',
    weight: 4.5,
    images: ['https://placekitten.com/409/300', 'https://placekitten.com/410/300'],
  },
  {
    title: 'Сиамский Дипломат',
    description: 'Умный и общительный кот с характерными отметинами.',
    weight: 3.2,
    images: ['https://placekitten.com/411/300'],
  },
  {
    title: 'Мейн-Кун Гигант',
    description: 'Большой и добрый кот для большой семьи.',
    weight: 6.0,
    images: ['https://placekitten.com/412/300', 'https://placekitten.com/413/300'],
  },
  {
    title: 'Сфинкс Загадка',
    description: 'Бесшёрстный кот для ценителей экзотики.',
    weight: 2.8,
    images: ['https://placekitten.com/414/300'],
  },
];

async function main() {
  console.log('🌱 Seeding products...');

  for (const product of products) {
    await prisma.product.create({
      data: product,
    });
  }

  console.log('✅ Seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
