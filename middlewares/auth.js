const isAuth = (req,res,next) => {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.status(401).json( {msg: 'You are not authorised to view this message'} );
    }
}

const isAdmin = (req,res,next) => {
    if (req.user.admin) {
        next();
    } else {
        res.status(401).json( {msg: 'You must be an admin to view this content'} );
    }
}