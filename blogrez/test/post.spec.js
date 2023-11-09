import supertest from "supertest";
import assert from "assert";
import app from "../src/index.js";
import { before, describe, it } from "mocha";

const request = supertest(app);

describe("Posts functionalities testing...", () => {
    let token = '';

    it("must fetch all post", async () => {
        const res = await request.get('/api/posts');

        assert.strictEqual(res.statusCode, 200);
        assert.equal(res.body.status, "success");
        assert.equal(Array.isArray(res.body.data), true);
    });

    before(async() => {
        const res = await request.post("/api/auth/login").send({
            "username": "Jamiu",
            "password": "12345678"
        });

        token = res.headers["auth-token"];
    });

    it("must fetch auth user post(s)", async () => {
        const res = await request.get('/api/auth/me')
                    .set('Accept', 'application/json')
                    .set("Authorization", `Bearer ${token}`);

        assert.strictEqual(res.statusCode, 200);
        assert.equal(res.body.status, "success");
        assert.equal(Array.isArray(res.body.data.posts), true);
    });

});