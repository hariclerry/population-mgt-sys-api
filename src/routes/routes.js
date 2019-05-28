const location = require('../controllers/mainLocation');
const subLocation = require('../controllers/subLocation');
const users = require('../controllers/users');

const {
  createLocation,
  updateLocation,
  fetchAllLocations,
  fetchLocation,
  deleteLocation
} = location;

const {
  createSubLocation,
  updateSubLocation,
  fetchAllSubLocations,
  fetchSubLocation,
  deleteSubLocation
} = subLocation;

const {
  createUser,
  loginUser
} = users;

module.exports = app => {
  //mainLocation routes
  app
    .route('/api/v1/location')
    .post(createLocation)
    .get(fetchAllLocations);
  app
    .route('/api/v1/location/:locationId')
    .put(updateLocation)
    .delete(deleteLocation)
    .get(fetchLocation);

  //subLocation routes
  app
    .route('/api/v1/location/:locationId/sub')
    .post(createSubLocation)
    .get(fetchAllSubLocations);
  app
    .route('/api/v1/location/:locationId/sub/:id')
    .put(updateSubLocation)
    .delete(deleteSubLocation)
    .get(fetchSubLocation);

   //user routes
   app
   .route('/api/v1/user')
   .post(createUser)
   app
   .route('/api/v1/user/login')
   .post(loginUser)
};
