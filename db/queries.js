const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient();


const db = {
    getUserByName: async(userId) => {
        const user = await prisma.user.findMany({
            where: {
                id: userId,
            }
        });

        return user;
    },

    getUserById: async(username) => {
        const user = await prisma.user.findMany({
            where: {
                username: username,
            }
        });
        return user;
    }
 
}

module.exports = db;