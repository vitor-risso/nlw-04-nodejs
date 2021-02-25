import request from 'supertest';
import { app } from '../app';
import createConnection from '../database/';



describe('Surveys',  () => {
  beforeAll(async () => {
    const connection =  await createConnection();
    await connection.runMigrations();
  })

  it("Should be able to create a new survey.", async () => {
    const response = await request(app).post('/surveys')
    .send({
      title: "Title test",
      description: "Description test"
    });
    console.log(response.body)
    expect(response.status).toBe(201);
   expect(response.body.data).toHaveProperty("id");
  })

  it("Should be able to get all surveys", async () => {
    await request(app).post('/surveys')
      .send({
        title: "Title test2",
        description: "Description test2"
      });

    const response = await request(app).get('/surveys');

    expect(response.body.length).toBe(2); 

  })

  it("Should not be able to create a user id with an d it had been existed", async () => {
    const response = await request(app).post('/surveys')
    .send({
      title: "Title test",
      description: "Description test"
    });

    expect(response.status).toBe(400);
  })

})
