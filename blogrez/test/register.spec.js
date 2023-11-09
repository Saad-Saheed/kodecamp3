import supertest from "supertest";
import assert from "assert";
import app from "../src/index.js";
import { database } from "../src/libs/prisma.js";
import { before, after, describe, it } from "mocha";

const request = supertest(app);

describe("Registration Testing...", ()=>{

    // delete register data
    before(async()=>{
        try {
            await database.user.delete({where: {username: "Jamiu"}});
        } catch (error) {
            console.log(error);
        }
    });

    // delete register data
    after(async()=>{
        try {
            await database.user.delete({where: {username: "Jamiu"}});
        } catch (error) {
            console.log(error);
        }
    });
   
    // register failed when username or password is invalid/missing
    it("must failed when username or password is invalid/missing", async()=>{
        // password length < 8, username exist, password doesn't match, then it must return 422
        await request.post("/api/auth/register").send({
            "username": "Jamiu",
            "password": "123456",
            "password_confirmation": "12345678"
        }).expect(422);       
    });


     // register successful and return token
     it("must register successfully and return a token", async()=>{
        const response = await request.post("/api/auth/register").send({
            "username": "Jamiu",
            "password": "12345678",
            "password_confirmation": "12345678"
        });

        assert.equal(response.statusCode, 201);
        assert.ok(response.headers["auth-token"]);
    });


})

