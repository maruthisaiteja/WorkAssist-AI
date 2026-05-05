const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  console.log('Cleaning up database for production reset...');
  await prisma.reminderLog.deleteMany({});
  await prisma.notification.deleteMany({});
  await prisma.task.deleteMany({});
  await prisma.user.deleteMany({});

  // Create HOD
  const hod = await prisma.user.create({
    data: {
      name: 'Dr. Sreenivasulu Gogula',
      designation: 'Professor & Head of Department',
      email: 'hod.it@vardhaman.org',
      phone: '+919999999999',
      role: 'HOD',
      passwordHash: 'Vardhaman@123',
    },
  });

  const facultyData = [
    {
      name: 'Dr. Muni Sekhar Velpuru', designation: 'Professor', email: 'indiacart8@gmail.com', // <-- Add real email here
      phone: '+919490298994'
    },
    { name: 'Dr. Ganesh Bhaiyya Regulwar', designation: 'Professor' },
    { name: 'Dr. Gagan Deep Arora', designation: 'Professor' },
    { name: 'Mr. Vivek Kulkarni', designation: 'Associate Professor' },
    { name: 'Dr. E.R. Aruna', designation: 'Associate Professor' },
    { name: 'Dr. Ramachandro Majji', designation: 'Associate Professor' },
    { name: 'Dr. B.K. Madhavi', designation: 'Associate Professor' },
    { name: 'Dr. Shaik Imam Saheb', designation: 'Associate Professor' },
    { name: 'Mr. Abhishek Dixit', designation: 'Associate Professor' },
    { name: 'Dr. E. Ravi Kumar', designation: 'Assistant Professor' },
    { name: 'Dr. Nikhila Kathirisetty', designation: 'Assistant Professor' },
    { name: 'Dr. Ruqsar Zaitoon', designation: 'Assistant Professor' },
    { name: 'Dr. Sameera Khan', designation: 'Assistant Professor' },
    { name: 'Mr. K. Anvesh', designation: 'Assistant Professor' },
    { name: 'Mr. Vinayak Biradar', designation: 'Assistant Professor' },
    { name: 'Mrs. Y. Sunanda', designation: 'Assistant Professor' },
    { name: 'Mrs. Swetha Polisetty', designation: 'Assistant Professor' },
    { name: 'Mr. Venkatesh Kavididevi', designation: 'Assistant Professor' },
    { name: 'Mr. S. Satheesh Kumar', designation: 'Assistant Professor' },
    { name: 'Mr. S. Ranjith Reddy', designation: 'Assistant Professor' },
    { name: 'Mrs. B. Swapna', designation: 'Assistant Professor' },
    { name: 'Mrs. K. Dhanalaxmi', designation: 'Assistant Professor' },
    { name: 'Mr. Yugandhar Manchala', designation: 'Assistant Professor' },
    { name: 'Mr. Nirmal Keshari Swain', designation: 'Assistant Professor' },
    { name: 'Mrs. Shalini K', designation: 'Assistant Professor' },
    { name: 'Mrs. Ala Rajitha', designation: 'Assistant Professor' },
    { name: 'Mrs. Sumaiya SK', designation: 'Assistant Professor' },
    { name: 'Mr. K. Santosh Kumar', designation: 'Assistant Professor' },
    { name: 'Ms. A. Ashwini', designation: 'Assistant Professor' },
    { name: 'Ms. K.M. Swati Singh', designation: 'Assistant Professor' },
    { name: 'Mr. Vijaya Raghavulu', designation: 'Assistant Professor' },
    { name: 'Mr. Shobanbabu R.J.', designation: 'Assistant Professor' },
    { name: 'Mr. Mohammad Bilal J.', designation: 'Assistant Professor' },
    { name: 'Mrs. Farhana Begum', designation: 'Assistant Professor' },
    { name: 'Mrs. C. Vineela', designation: 'Assistant Professor' },
  ];

  console.log('Seeding production faculty users...');
  for (const faculty of facultyData) {
    // ONLY generate if NOT provided in the object
    const finalEmail = faculty.email || (faculty.name.toLowerCase().replace(/[^a-z0-9]/g, '.') + '@vardhaman.org');
    const finalPhone = faculty.phone || '0000000000';
    
    await prisma.user.create({
      data: {
        name: faculty.name,
        designation: faculty.designation,
        email: finalEmail,
        phone: finalPhone,
        role: 'FACULTY',
        passwordHash: 'Vardhaman@123',
      },
    });
  }

  console.log('--------------------------------------------------');
  console.log('✅ Production seeding completed successfully!');
  console.log('⚠️  WARNING: Running this script again WILL WIPE all assigned tasks.');
  console.log('   Only run this when you want a full system reset.');
  console.log('--------------------------------------------------');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
