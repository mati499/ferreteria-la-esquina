import 'dotenv/config';

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed de datos...');

  // 1. Crear administrador por defecto
  const adminEmail = 'admin@ferreterialaesquina.com';
  const adminPassword = 'admin123';

  const existingAdmin = await prisma.user.findUnique({ where: { email: adminEmail } });
  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash(adminPassword, 12);
    await prisma.user.create({
      data: {
        email: adminEmail,
        password: passwordHash,
        role: 'ADMIN',
      },
    });
    console.log(`✅ Admin creado: ${adminEmail} / ${adminPassword}`);
  } else {
    console.log(`ℹ️  Admin ya existe: ${adminEmail}`);
  }

  // 2. Categorías
  const categories = [
    { name: 'Fontanería', slug: 'fontaneria' },
    { name: 'Eléctrica', slug: 'electrica' },
    { name: 'Pintura', slug: 'pintura' },
    { name: 'Herramientas', slug: 'herramientas' },
    { name: 'Cerrejería', slug: 'cerrajería' },
    { name: 'Jardín', slug: 'jardín' },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
  }
  console.log(`✅ ${categories.length} categorías creadas`);

  // 3. Productos de ejemplo
  const catMap = await prisma.category.findMany();
  const getCategoryId = (slug: string) => {
    const c = catMap.find((x) => x.slug === slug);
    return c ? c.id : null;
  };

  const products = [
    {
      name: 'Tubería PVC 1/2"',
      description: 'Tubería PVC para fontanería, diámetro 1/2 pulgada.',
      price: 4500,
      stock: 100,
      imageUrl: 'https://via.placeholder.com/400x400?text=Tuberia+PVC',
      categorySlug: 'fontaneria',
      isActive: true,
    },
    {
      name: 'Interruptor Simple',
      description: 'Interruptor de luz simple para instalación eléctrica.',
      price: 3500,
      stock: 50,
      imageUrl: 'https://via.placeholder.com/400x400?text=Interruptor',
      categorySlug: 'electrica',
      isActive: true,
    },
    {
      name: 'Pintura Blanca 5L',
      description: 'Pintura acrílica blanca para interiores, 5 litros.',
      price: 28000,
      stock: 30,
      imageUrl: 'https://via.placeholder.com/400x400?text=Pintura+Blanca',
      categorySlug: 'pintura',
      isActive: true,
    },
    {
      name: 'Martillo Carpintero',
      description: 'Martillo con cabeza de acero y mango de madera.',
      price: 12000,
      stock: 25,
      imageUrl: 'https://via.placeholder.com/400x400?text=Martillo',
      categorySlug: 'herramientas',
      isActive: true,
    },
    {
      name: 'Cerradura Sobrepuesta',
      description: 'Cerradura sobrepuesta para puertas de entrada.',
      price: 45000,
      stock: 15,
      imageUrl: 'https://via.placeholder.com/400x400?text=Cerradura',
      categorySlug: 'cerrajería',
      isActive: true,
    },
    {
      name: 'Manguera de Jardín 15m',
      description: 'Manguera de riego flexible de 15 metros.',
      price: 22000,
      stock: 20,
      imageUrl: 'https://via.placeholder.com/400x400?text=Manguera',
      categorySlug: 'jardín',
      isActive: true,
    },
  ];

  for (const prod of products) {
    const categoryId = getCategoryId(prod.categorySlug);
    const existingProduct = await prisma.product.findFirst({
      where: { name: prod.name },
    });

    const data = {
      name: prod.name,
      description: prod.description,
      price: prod.price,
      stock: prod.stock,
      imageUrl: prod.imageUrl,
      categoryId,
      isActive: prod.isActive,
    };

    if (existingProduct) {
      await prisma.product.update({
        where: { id: existingProduct.id },
        data,
      });
    } else {
      await prisma.product.create({ data });
    }
  }
  console.log(`✅ ${products.length} productos procesados`);

  // 4. Configuración del negocio (singleton)
  await prisma.businessConfig.upsert({
    where: { id: 1 },
    update: {},
    create: {
      businessName: 'Ferretería La Esquina',
      address: 'Carrera 10 # 15-20, Centro',
      phone: '573001234567',
      whatsappNumber: '573001234567',
      schedule: 'Lunes a sábado: 8:00 AM - 6:00 PM',
    },
  });
  console.log('✅ Configuración del negocio creada');

  console.log('✅ Seed completado exitosamente');
}

main()
  .catch((e) => {
    console.error('❌ Error en el seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
