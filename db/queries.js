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

    getCurrentPath: async (currFolderId) => {
        // create an array of folder paths
        const path = [];
        
        // get the current folder
        const folder = await db.getFolderById(currFolderId);
        path.push(folder);
        let parentFolderId = folder.parentId;

        while (parentFolderId) {
            let folder = await db.getFolderById(parentFolderId);
            path.push(folder);
            parentFolderId = folder.parentId;
        }

        return path;
    },

    getFolderById: async (folderId) => {
        const folder = await prisma.folder.findFirst({
            where: {
                id: folderId,
            }
        })
        return folder;
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
        return contents[0].childFolders;
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
    },
  createFolder: async (parentFolderId, userId, folderName) => {
        await prisma.folder.create({
            data: {
                parentId: parentFolderId,
                userId: userId,
                name: folderName
            }
        })
    }
}

module.exports = db;