import { PrismaClient, Role, AddressType } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('🗑️  Clearing existing data...');

    await prisma.session.deleteMany();
    await prisma.address.deleteMany();
    await prisma.user.deleteMany();

    console.log('✅ Cleared existing data\n');

    // Create test users
    const users = [
        {
            email: 'admin@ecommerce.uz',
            password: 'admin123',
            firstName: 'Admin',
            lastName: 'User',
            phone: '+998901234567',
            role: Role.ADMIN,
        },
        {
            email: 'user@example.com',
            password: 'user123',
            firstName: 'Asilbek',
            lastName: 'Rahimov',
            phone: '+998909876543',
            role: Role.USER,
        },
        {
            email: 'seller@example.com',
            password: 'seller123',
            firstName: 'Sardor',
            lastName: 'Karimov',
            phone: '+998901112233',
            role: Role.SELLER,
        },
        {
            email: 'test@test.com',
            password: 'test123',
            firstName: 'Test',
            lastName: 'User',
            phone: '+998900001111',
            role: Role.USER,
        },
    ];

    for (const userData of users) {
        const hashedPassword = await bcrypt.hash(userData.password, 10);

        const user = await prisma.user.create({
            data: {
                email: userData.email,
                password: hashedPassword,
                firstName: userData.firstName,
                lastName: userData.lastName,
                phone: userData.phone,
                role: userData.role,
                isActive: true,
                isVerified: true,
            },
        });

        console.log(`✅ User: ${userData.email} (${userData.role})`);

        // Add addresses for non-admin users
        if (userData.role !== Role.ADMIN) {
            await prisma.address.create({
                data: {
                    userId: user.id,
                    type: AddressType.HOME,
                    title: 'Uy manzili',
                    fullAddress: 'Toshkent shahar, Chilonzor tumani, 19-kvartal, 5-uy, 32-xonadon',
                    city: 'Toshkent',
                    district: 'Chilonzor',
                    postalCode: '100115',
                    isDefault: true,
                },
            });

            await prisma.address.create({
                data: {
                    userId: user.id,
                    type: AddressType.WORK,
                    title: 'Ish joyi',
                    fullAddress: 'Toshkent shahar, Mirzo Ulug\'bek tumani, IT Park',
                    city: 'Toshkent',
                    district: 'Mirzo Ulug\'bek',
                    postalCode: '100084',
                    isDefault: false,
                },
            });

            console.log(`   📍 Added 2 addresses for ${userData.firstName}`);
        }
    }

    console.log(`\n👥 Created ${users.length} users`);
    console.log('\n🎉 Database seeded successfully!');
    console.log('\n📝 Test credentials:');
    console.log('   Admin: admin@ecommerce.uz / admin123');
    console.log('   User:  user@example.com / user123');
    console.log('   Test:  test@test.com / test123');
}

main()
    .catch((e) => {
        console.error('❌ Error:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
