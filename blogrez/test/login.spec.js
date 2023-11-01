import supertest from "supertest";
import assert from "assert";
import app from "../src/index.js";

const request = supertest(app);

describe("Login Testing...", () => {

        //register new data
        before(async () => {
            try {
                await request.post("/api/auth/register").send({
                    "username": "Jamiu",
                    "password": "12345678",
                    "password_confirmation": "12345678"
                });
            } catch (error) {
    
            }
        });
    
    // login failed when username or password is invalid/missing
    it("must failed when username or password is invalid/missing", async () => {
        // username or password is not valid, then it must return 422
        await request.post("/api/auth/login").send({
            "username": "Jamiu",
            "password": "12345"
        }).expect(422);
    });

    // login successful and return token
    it("must login successfully and return a token", async () => {
        const res = await request.post("/api/auth/login").send({
            "username": "Jamiu",
            "password": "12345678"
        });

        assert.equal(res.statusCode, 200);
        assert.strictEqual(res.body.status, "success");
        assert.ok(res.headers["auth-token"]);
    });


});