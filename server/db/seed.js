//imports
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { faker } = require('@faker-js/faker');
const bcrypt = require("bcrypt");

//creating users
const createUsers = async() => {
  await prisma.user.createMany({
    data: [
      {
        username: 'El_Doogie', 
        password: await bcrypt.hash('NumberoneChef', 10)
      },
      {
        username: 'KelsCooks', 
        password: await bcrypt.hash('LovesElChef', 10)
      },
      {
        username: 'ALeeChef', 
        password: await bcrypt.hash('BetterthanSaltBae', 10)
      },
    ]
  });
} 


const createPosts = async() => {
  await Promise.all(
    [...Array(9)].map((_, i) => 
    prisma.post.create({
      data: {
        title: 'Food adventures',
        content: faker.image.urlLoremFlickr({ category: 'food' }),
        userid: (i % 3) + 1
      }
    })
  ));
} 


//Prisma Client queries will go here
const main = async() => {
  try{
    console.log('SEEDING THE DATABASE')
    
    //call functions
    await createUsers();
    await createPosts();

    console.log("Database is seeded.");
  }catch(error){
    console.log(error);
  }
}

//calling main
main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })

module.exports = prisma;
