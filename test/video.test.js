const request = require("supertest");
const app = require("../src/app");
const Video = require("../src/models/video");
const setupDb = require("./fixtures/db.js");

beforeAll(setupDb);

test("Should use / route", async () => {
  const response = await request(app).get("/").expect(200);
  expect(response.text).not.toBeNull();
});

test("Should upload a new video", async () => {
  const response = await request(app)
    .post("/upload")
    .field({
      vidTitle: "Prueba de carga desde jest",
      vidDescription: "Esta es la descripcion de una prueba de carga de video",
      tag: "entertainment",
    })
    .attach("uploaded_video", "test/fixtures/Colombia.mp4")
    .expect(302);
  expect(response.headers.location).toContain("/playVideo?fn");
});

test("Should i like video", async () => {
  const video = await Video.find();
  console.log(video[0].filename);
  const response = await request(app)
    .post(`/like/${video[0].filename}`)
    .expect(202);
  expect(response.text).toBe("11");
});

test("Should i dislike video", async () => {
  const video = await Video.find();
  console.log(video[1].filename);
  const response = await request(app)
    .post(`/dislike/${video[1].filename}`)
    .expect(202);
  expect(response.text).toBe("1");
});

test("Should i increase views ", async () => {
  const video = await Video.find();
  console.log(video[0].filename);
  const response = await request(app)
    .post(`/views/${video[0].filename}`)
    .expect(202);
  expect(response.text).toBe("5");
});
