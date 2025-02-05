const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient();


const db = {

    getUserByName: async (username) => {
        const user = await prisma.user.findMany({
            where: {
                username: username,
            }
        });
        console.log('returning user:', user);
        return user[0];
    },

    getUserById: async (id) => {
        const user = await prisma.user.findMany({
            where: {
                id: id,
            }
        });
        return user[0];
    },

    getRootFolderId: async (userId) => {
        // search for folder where parentId is NULL and folder userId matches
        const folderId = await prisma.folder.findFirst({
            where: {
                userId: userId,
            }
        })
        return folderId;
    },

    getFolderContents: async (folderId) => {
        const contents = await prisma.folder.findMany({
            include: {
                childFolders: true,
            },
            where: {
                id: folderId,
            },
        });
        console.log(contents);
    },
    // when creating a new user- also create their root folder in their drive
    createUser: async (username, firstName, lastName, hash) => {
        await prisma.user.create({
            data: {
                username: username,
                firstName: firstName,
                lastName: lastName,
                hash: hash,
                folders: {
                    create: {
                        name: 'My Drive'
                    },
                },
            },
        })
    }
}

module.exports = db;