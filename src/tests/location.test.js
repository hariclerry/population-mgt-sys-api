const request = require('supertest');
const MainLocation = require('../models/mainLocation');
const SubLocation = require('../models/subLocations');
const mongoose = require('mongoose');

let server;

describe('/api/locations', () => {
  beforeEach(() => {
    server = require('../index');
  });
  afterEach(async () => {
    server.close();
    await MainLocation.remove({});
    await SubLocation.remove({});
  });

  describe('GET /', () => {
    it('should return all locations', async () => {
      const locations = [
        { locationName: 'Gulu' },
        { numberOfFemale: 10 },
        { numberOfMale: 20 },
        { subLocation: [] },
        { total: 30 }
      ];

      await MainLocation.collection.insertMany(locations);

      const res = await request(server).get('/api/v1/location');

      expect(res.status).toBe(200);
      expect(res.body.length).toBe(5);
      expect(res.body.some(g => g.locationName === 'Gulu')).toBeTruthy();
      expect(res.body.some(g => g.numberOfFemale === 10)).toBeTruthy();
      expect(res.body.some(g => g.numberOfMale === 20)).toBeTruthy();
      expect(res.body.some(g => g.total === 30)).toBeTruthy();
    });
  });

  describe('GET /:id', () => {
    it('should return a location if valid id is passed', async () => {
      const locations = {
        locationName: 'Gulu',
        numberOfFemale: 10,
        numberOfMale: 20,
        subLocation: [],
        total: 30
      };

      const location = new MainLocation(locations);
      await location.save();

      const res = await request(server).get('/api/v1/location/' + location._id);

      expect(res.status).toBe(200);
    });

    it('should return 404 if invalid id is passed', async () => {
      const res = await request(server).get('/api/v1/location/1');

      expect(res.status).toBe(400);
    });

    it('should return 500 if no location with the given id exists', async () => {
      const id = mongoose.Types.ObjectId();
      const res = await request(server).get('/api/v1/location/' + id);

      expect(res.status).toBe(500);
    });
  });

  describe('POST /', () => {
    let locations;
    const exec = async () => {
      return await request(server)
        .post('/api/v1/location')
        .send({ locations });
    };

    beforeEach(() => {
      locations = {
        locationName: 'Gulu',
        numberOfFemale: 10,
        numberOfMale: 20
      };
    });

    it('should return 400 if character validation fails', async () => {
      locations = {
        locationName: 'Gu',
        numberOfFemale: 10.5,
        numberOfMale: 20.2,
        subLocation: [],
        total: 30
      };

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it('should return 201 if a location has been created', async () => {
      locations.total = locations.numberOfFemale + locations.numberOfMale;
      const res = await request(server)
        .post('/api/v1/location')
        .send({
          locationName: 'New location',
          numberOfFemale: 50,
          numberOfMale: 20
        });

      expect(res.status).toBe(201);
    });
  });

  describe('PUT /:id', () => {
    let savedLocation;
    let locationId;

    beforeEach(async () => {
      // Before each test we need to create a genre and
      // put it in the database.
      savedLocation = new MainLocation({
        locationName: 'Updated location',
        numberOfFemale: 50,
        numberOfMale: 20,
        total: 70
      });
      await savedLocation.save();

      locationId = savedLocation._id;
      newLocations = {
        locationName: 'New location',
        numberOfFemale: 50,
        numberOfMale: 20,
        total: 70
      };
    });

    it('should return 400 if location is has invalid characters or input', async () => {
      const res = await request(server)
        .put('/api/v1/location/' + locationId)
        .send({
          locationName: 'Up',
          numberOfFemale: 50.3,
          numberOfMale: 20.2
        });

      expect(res.status).toBe(400);
    });

    it('should return 500 if location with the given id was not found', async () => {
      locationId = mongoose.Types.ObjectId();

      const res = await request(server)
        .put('/api/v1/location/' + locationId)
        .send({
          locationName: 'Update location',
          numberOfFemale: 50,
          numberOfMale: 20
        });

      expect(res.status).toBe(500);
    });

    it('should return 404 if location with invalid id', async () => {
      locationId = 3;

      const res = await request(server)
        .put('/api/v1/location/' + locationId)
        .send({
          locationName: 'Update location',
          numberOfFemale: 50,
          numberOfMale: 20
        });

      expect(res.status).toBe(400);
    });

    it('should update location', async () => {
      const res = await request(server)
        .put('/api/v1/location/' + locationId)
        .send({
          locationName: 'Update location',
          numberOfFemale: 100,
          numberOfMale: 200
        });

      expect(res.status).toBe(200);
    });
  });

  describe('DELETE /:locationId', () => {
    // let token;
    // let genre;
    let locationId;

    const exec = async () => {
      return await request(server)
        .delete('/api/genres/' + locationId)
        .set('x-auth-token', token)
        .send();
    };

    beforeEach(async () => {
      // Before each test we need to create a genre and
      // put it in the database.
      savedLocation = new MainLocation({
        locationName: 'Updated location',
        numberOfFemale: 50,
        numberOfMale: 20,
        total: 70
      });
      await savedLocation.save();

      locationId = savedLocation._id;
    });

    it('should return 400 if id is invalid', async () => {
      locationId = 3;

      const res = await request(server)
        .delete('/api/v1/location/' + locationId)
        .send();

      expect(res.status).toBe(400);
    });

    it('should return 404 if no location with the given id was found', async () => {
      locationId = mongoose.Types.ObjectId();

      const res = await request(server)
        .delete('/api/v1/location/' + locationId)
        .send();

      expect(res.status).toBe(404);
    });

    it('should delete the location if input is valid', async () => {
      await request(server)
        .delete('/api/v1/location/' + locationId)
        .send();

      const locationInDb = await MainLocation.findById(locationId);

      expect(locationInDb).toBeNull();
    });
  });

  // sublocation test

  describe('GET /', () => {
    it('should return all locations', async () => {
      const locations = [
        { locationName: 'Gulu' },
        { numberOfFemale: 10 },
        { numberOfMale: 20 },
        { subTotal: 30 }
      ];

      await SubLocation.collection.insertMany(locations);

      const res = await request(server).get('/api/v1/location/:locationId/sub');

      expect(res.status).toBe(200);
      expect(res.body.length).toBe(4);
      expect(res.body.some(g => g.locationName === 'Gulu')).toBeTruthy();
      expect(res.body.some(g => g.numberOfFemale === 10)).toBeTruthy();
      expect(res.body.some(g => g.numberOfMale === 20)).toBeTruthy();
      expect(res.body.some(g => g.subTotal === 30)).toBeTruthy();
    });
  });

  describe('GET /:id', () => {
    it('should return a location if valid id is passed', async () => {
      const locations = {
        locationName: 'Gulu',
        numberOfFemale: 10,
        numberOfMale: 20,
        subTotal: 30
      };

      const location = new SubLocation(locations);
      await location.save();

      const res = await request(server).get('/api/v1/location/:locationId/sub/' + location._id);

      expect(res.status).toBe(200);
    });

    it('should return 404 if invalid id is passed', async () => {
      const res = await request(server).get('/api/v1/location/:locationId/sub/1');

      expect(res.status).toBe(400);
    });

    it('should return 404 if no location with the given id exists', async () => {
      const id = mongoose.Types.ObjectId();
      const res = await request(server).get('/api/v1/location/:locationId/sub/' + id);

      expect(res.status).toBe(404);
    });
  });

  describe('POST /', () => {
    let locations;
    const exec = async () => {
      return await request(server)
        .post('/api/v1/location/:locationId/sub')
        .send({ locations });
    };

    beforeEach(() => {
      locations = {
        locationName: 'Gulu',
        numberOfFemale: 10,
        numberOfMale: 20
      };
    });

    it('should return 400 if character validation fails', async () => {
      locations = {
        locationName: 'Gu',
        numberOfFemale: 10.5,
        numberOfMale: 20.2,
        subTotal: 30
      };

      const res = await exec();

      expect(res.status).toBe(400);
    });
  });

  describe('PUT /:id', () => {
    let savedLocation;
    let locationId;

    beforeEach(async () => {
      // Before each test we need to create a genre and
      // put it in the database.
      savedLocation = new SubLocation({
        locationName: 'Updated location',
        numberOfFemale: 50,
        numberOfMale: 20,
        subTotal: 70
      });
      await savedLocation.save();

      locationId = savedLocation._id;
      newLocations = {
        locationName: 'New location',
        numberOfFemale: 50,
        numberOfMale: 20,
        subTotal: 70
      };
    });

    it('should return 400 if location is has invalid characters or input', async () => {
      const res = await request(server)
        .put('/api/v1/location/:locationId/sub/' + locationId)
        .send({
          locationName: 'Up',
          numberOfFemale: 50.3,
          numberOfMale: 20.2
        });

      expect(res.status).toBe(400);
    });

    it('should return 500 if location with the given id was not found', async () => {
      locationId = mongoose.Types.ObjectId();

      const res = await request(server)
        .put('/api/v1/location/:locationId/sub/' + locationId)
        .send({
          locationName: 'Update location',
          numberOfFemale: 50,
          numberOfMale: 20
        });

      expect(res.status).toBe(500);
    });

    it('should return 404 if location with invalid id', async () => {
      locationId = 3;

      const res = await request(server)
        .put('/api/v1/location/:locationId/sub/' + locationId)
        .send({
          locationName: 'Update location',
          numberOfFemale: 50,
          numberOfMale: 20
        });

      expect(res.status).toBe(400);
    });

    it('should update location', async () => {
      const res = await request(server)
        .put('/api/v1/location/:locationId/sub/' + locationId)
        .send({
          locationName: 'Update location',
          numberOfFemale: 100,
          numberOfMale: 200
        });

      expect(res.status).toBe(200);
    });
  });

  describe('DELETE /:locationId', () => {
    // let token;
    // let genre;
    let locationId;

    const exec = async () => {
      return await request(server)
        .delete('/api/genres/' + locationId)
        .set('x-auth-token', token)
        .send();
    };

    beforeEach(async () => {
      // Before each test we need to create a genre and
      // put it in the database.
      savedLocation = new SubLocation({
        locationName: 'Updated location',
        numberOfFemale: 50,
        numberOfMale: 20,
        subTotal: 70
      });
      await savedLocation.save();

      locationId = savedLocation._id;
    });

    it('should return 400 if id is invalid', async () => {
      locationId = 3;

      const res = await request(server)
        .delete('/api/v1/location/:locationId/sub/' + locationId)
        .send();

      expect(res.status).toBe(400);
    });

    it('should return 404 if no location with the given id was found', async () => {
      locationId = mongoose.Types.ObjectId();

      const res = await request(server)
        .delete('/api/v1/location/:locationId/sub/' + locationId)
        .send();

      expect(res.status).toBe(404);
    });

    it('should delete the location if input is valid', async () => {
      await request(server)
        .delete('/api/v1/location/:locationId/sub/' + locationId)
        .send();

      const locationInDb = await SubLocation.findById(locationId);

      expect(locationInDb).toBeNull();
    });
  });
});
