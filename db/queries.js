const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient();


const db = {
    getUserByName: async(username) => {
        const user = await prisma.user.findMany({
            where: {
                username: username,
            }
        });
        console.log('returning user:', user);
        return user[0];
    },

    getUserById: async(id) => {
        const user = await prisma.user.findMany({
            where: {
                id: id,
            }
        });
        return user[0];
    },

    createUser: async(username, firstName, lastName, hash) => {
        await prisma.user.create({
            data: {
                username: username,
                firstName: firstName,
                lastName: lastName,
                hash: hash
            }
        })
    }
}

module.exports = db;