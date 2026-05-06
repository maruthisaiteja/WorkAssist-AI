const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const facultyData = [
  { name: "Dr. Sreenivasulu Gogula", designation: "Professor & HOD", vceId: "VCE1678", email: "gsrinivasulu1678@vardhaman.org", phone: "+919866090396", role: "HOD", passwordHash: "VCE1678" },
  { name: "Dr. Muni Sekhar Velpuru", designation: "Associate Professor", vceId: "VCE296", email: "munisek@vardhaman.org", phone: "+919618392466", role: "FACULTY", passwordHash: "VCE296" },
  { name: "Mr. Vivek Kulkarni", designation: "Associate Professor", vceId: "VCE850", email: "vivek@vardhaman.org", phone: "+919866758870", role: "FACULTY", passwordHash: "VCE850" },
  { name: "Dr Yesubabu Mannava", designation: "Associate Professor", vceId: "VCE1320", email: "mannavababu@vardhaman.org", phone: "+919985171170", role: "FACULTY", passwordHash: "VCE1320" },
  { name: "Dr Ganesh Bhaiyya Regulwar", designation: "Associate Professor", vceId: "VCE1477", email: "ganeshregulwar@vardhaman.org", phone: "+919763717437", role: "FACULTY", passwordHash: "VCE1477" },
  { name: "Dr B K Madhavi", designation: "Associate Professor", vceId: "VCE1593", email: "madhavi1593@vardhaman.org", phone: "+918008791861", role: "FACULTY", passwordHash: "VCE1593" },
  { name: "Dr. K Mamatha", designation: "Assistant Professor", vceId: "VCE567", email: "k.mamatha@vardhaman.org", phone: "+917989405487", role: "FACULTY", passwordHash: "VCE567" },
  { name: "Mr. K. Anvesh", designation: "Assistant Professor", vceId: "VCE652", email: "anvesh@vardhaman.org", phone: "+919494016961", role: "FACULTY", passwordHash: "VCE652" },
  { name: "Dr. E. Ravi Kumar", designation: "Assistant Professor", vceId: "VCE865", email: "ravikumar.e@vardhaman.org", phone: "+919885663920", role: "FACULTY", passwordHash: "VCE865" },
  { name: "Dr K Nikhila", designation: "Assistant Professor", vceId: "VCE1168", email: "nikhila@vardhaman.org", phone: "+918309116272", role: "FACULTY", passwordHash: "VCE1168" },
  { name: "Ms P Swetha", designation: "Assistant Professor", vceId: "VCE1343", email: "swethabharath27@vardhaman.org", phone: "+917993136780", role: "FACULTY", passwordHash: "VCE1343" },
  { name: "Ms Farhana Begum", designation: "Assistant Professor", vceId: "VCE1346", email: "farhanasattar@vardhaman.org", phone: "+919849347527", role: "FACULTY", passwordHash: "VCE1346" },
  { name: "Mr K Venkatesh", designation: "Assistant Professor", vceId: "VCE828", email: "venkateshkavididevi@vardhaman.org", phone: "+918977223080", role: "FACULTY", passwordHash: "VCE828" },
  { name: "Mrs Yadla Sunanda", designation: "Assistant Professor", vceId: "VCE1380", email: "sunanda@vardhaman.org", phone: "+919703581360", role: "FACULTY", passwordHash: "VCE1380" },
  { name: "Ms B Swapna", designation: "Assistant Professor", vceId: "VCE1409", email: "swapna_vce1409@vardhaman.org", phone: "+919154847601", role: "FACULTY", passwordHash: "VCE1409" },
  { name: "Mr K Santosh Kumar", designation: "Assistant Professor", vceId: "VCE1412", email: "santoshkumar@vardhaman.org", phone: "+917287068647", role: "FACULTY", passwordHash: "VCE1412" },
  { name: "Mr S Satheesh Kumar", designation: "Assistant Professor", vceId: "VCE1453", email: "satheeshkumar.s@vardhaman.org", phone: "+918012218834", role: "FACULTY", passwordHash: "VCE1453" },
  { name: "Ms Ch Dhanalaxmi", designation: "Assistant Professor", vceId: "VCE1514", email: "dhanalaxmi1514@vardhaman.org", phone: "+919573448555", role: "FACULTY", passwordHash: "VCE1514" },
  { name: "Ms Asma Begum", designation: "Assistant Professor", vceId: "VCE1512", email: "asma1512@vardhaman.org", phone: "+919885956395", role: "FACULTY", passwordHash: "VCE1512" },
  { name: "Mr S Ranjith Reddy", designation: "Assistant Professor", vceId: "VCE1086", email: "ranjithreddy1086@vardhaman.org", phone: "+919666916919", role: "FACULTY", passwordHash: "VCE1086" },
  { name: "Ms A Rajitha", designation: "Assistant Professor", vceId: "VCE1259", email: "rajitha222@vardhaman.org", phone: "+918096529263", role: "FACULTY", passwordHash: "VCE1259" },
  { name: "Mr. Nirmal Keshari Swain", designation: "Assistant Professor", vceId: "VCE1541", email: "nirmal1514@vardhaman.org", phone: "+917978948735", role: "FACULTY", passwordHash: "VCE1541" },
  { name: "Dr. L. Sunitha", designation: "Assistant Professor", vceId: "VCE1553", email: "sunitha1553@vardhaman.org", phone: "+919441264836", role: "FACULTY", passwordHash: "VCE1553" },
  { name: "Dr. Vinayak G Biradar", designation: "Assistant Professor", vceId: "VCE1116", email: "vinayak1116@vardhaman.org", phone: "+919448584819", role: "FACULTY", passwordHash: "VCE1116" },
  { name: "Mr M Yugandhar", designation: "Assistant Professor", vceId: "VCE1567", email: "yugandhar1567@vardhaman.org", phone: "+917989180241", role: "FACULTY", passwordHash: "VCE1567" },
  { name: "Mr Mohd Salahuddin", designation: "Assistant Professor", vceId: "VCE1628", email: "salahuddin@vardhaman.org", phone: "+919866996786", role: "FACULTY", passwordHash: "VCE1628" },
  { name: "Ms Swati Singh", designation: "Assistant Professor", vceId: "VCE1693", email: "swatisingh1693@vardhaman.org", phone: "+918545942381", role: "FACULTY", passwordHash: "VCE1693" },
  { name: "Ms T Prashanthi", designation: "Assistant Professor", vceId: "VCE1711", email: "prashanthi1711@vardhaman.org", phone: "+917995901429", role: "FACULTY", passwordHash: "VCE1711" },
  { name: "Ms Sumaiya SK", designation: "Assistant Professor", vceId: "VCE1732", email: "sumaiya1732@vardhaman.org", phone: "+918919942095", role: "FACULTY", passwordHash: "VCE1732" },
  { name: "Mr. P Vijaya Raghavulu", designation: "Assistant Professor", vceId: "VCE1768", email: "raghavulu1768@vardhaman.org", phone: "+918309375371", role: "FACULTY", passwordHash: "VCE1768" },
  { name: "Mr Shobanbabu R J", designation: "Assistant Professor", vceId: "VCE1818", email: "shobanbabu1818@vardhaman.org", phone: "+917904708988", role: "FACULTY", passwordHash: "VCE1818" },
  { name: "Dr Sameera Khan", designation: "Assistant Professor", vceId: "VCE1865", email: "sameera1865@vardhaman.org", phone: "+917389377104", role: "FACULTY", passwordHash: "VCE1865" },
  { name: "Ms. C Vineela", designation: "Assistant Professor", vceId: "VCE1858", email: "vineela1858@vardhaman.org", phone: "+919849630213", role: "FACULTY", passwordHash: "VCE1858" },
  { name: "Ms. Shruti S Soma", designation: "Assistant Professor", vceId: "VCE1911", email: "shruti1911@vardhaman.org", phone: "+918590537845", role: "FACULTY", passwordHash: "VCE1911" },
  { name: "Mr.P.Maruthi Sai Teja", designation: "Student", vceId: "VCE1956", email: "indiacart8@gmail.com", phone: "+919490298994", role: "FACULTY", passwordHash: "VCE1956" }
];


async function main() {
  console.log('Seeding database with IT Department Faculty Data...');

  // Optional: clear existing data to prevent duplicates during testing
  // await prisma.user.deleteMany({});

  for (const faculty of facultyData) {
    await prisma.user.upsert({
      where: { email: faculty.email },
      update: {
        name: faculty.name,
        designation: faculty.designation,
        vceId: faculty.vceId,
        phone: faculty.phone,
        role: faculty.role,
        passwordHash: faculty.passwordHash
      },
      create: {
        name: faculty.name,
        designation: faculty.designation,
        email: faculty.email,
        vceId: faculty.vceId,
        phone: faculty.phone,
        role: faculty.role,
        passwordHash: faculty.passwordHash
      }
    });
  }

  console.log('✅ IT Department Data Seeded Successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
