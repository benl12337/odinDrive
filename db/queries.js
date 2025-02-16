const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient();


const db = {

    getUserByName: async (username) => {
        const user = await prisma.user.findMany({
            where: {
                username: username,
            }
        });
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

    getRootFolder: async (userId) => {
        // search for folder where parentId is NULL and folder userId matches
        const rootFolder = await prisma.item.findFirst({
            where: {
                userId: userId,
            }
        })
        return rootFolder;
    },

    getCurrentPath: async (currFolderId) => {
        // create an array of folder paths
        const path = [];
        
        // get the current folder
        const folder = await db.getItemById(currFolderId);
        path.push(folder);

        let parentFolderId = folder.parentId || null;

        while (parentFolderId) {
            let folder = await db.getItemById(parentFolderId);
            path.push(folder);
            parentFolderId = folder.parentId;
        }

        return path;
    },

    getItemById: async (folderId) => {
        const folder = await prisma.item.findFirst({
            where: {
                id: folderId,
            }
        })
        return folder;
    },

    getFolderContents: async (folderId) => {
        const contents = await prisma.item.findMany({
            where: {
                parentId: folderId,
            },
            orderBy: [
                {type: 'asc'},
                {name: 'asc'}
            ]
        });
        return contents;
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
        await prisma.item.create({
            data: {
                parentId: parentFolderId,
                userId: userId,
                name: folderName,
                type: "FOLDER",
                created: new Date(),
            }
        })
    },
    createFile: async (parentFolderId, userId, fileName, path, size) => {
        await prisma.item.create({
            data: {
                parentId: parentFolderId,
                userId: userId,
                name: fileName,
                type: "FILE",
                path: path,
                size: size,
                created: new Date(),
            }
        })
    },

    updateItem: async (itemId, itemName) =>{
        await prisma.item.update({
            where: {
                id: itemId,
            },
            data: {
                name: itemName,
            },
        });
    },

    deleteItem: async (itemId) => {
        await prisma.item.delete({
            where: {
                id: itemId,
            }
        })
    },

    verifyName: async(name, type, parentFolderId) => {
        // confirm that an item of the same name does not already exist
        
        
        const foundItem = await prisma.item.findMany({
            where: {
                name: name,
                type: type,
                parentId: parentFolderId,
            }
        });
        return foundItem.length > 0 ? false : true;
    }
}

module.exports = db;