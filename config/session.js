const session = require('express-session');
const { PrismaSessionStore } = require('@quixo3/prisma-session-store');
const { PrismaClient } = require('@prisma/client');

module.exports = session({
    store: new PrismaSessionStore(
        new PrismaClient(),
        {
            checkPeriod: 2 * 60 * 1000, // ms
            dbRecordIdIsSessionId: true,
            dbRecordIdFunction: undefined,
        }
    ),
    secret: 'cats',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 // 1 day
    }
})