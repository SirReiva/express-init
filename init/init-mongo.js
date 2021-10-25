db = db.getSiblingDB('express');
db.createUser(
    {
        user: "root",
        pwd: "root",
        roles: [
            {
                role: "readWrite",
                db: "express"
            }
        ]
    }
);
