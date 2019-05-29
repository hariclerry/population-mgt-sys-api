/**
 * @file contains all the routes for the implemented endpoints
 */

 // local imports
const location = require('../controllers/mainLocation');
const subLocation = require('../controllers/subLocation');
const users = require('../controllers/users');
const auth = require('../middleware/auth');

// constants
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
    .post(auth, createLocation)
    .get(auth, fetchAllLocations);
  app
    .route('/api/v1/location/:locationId')
    .put(auth, updateLocation)
    .delete(auth, deleteLocation)
    .get(auth, fetchLocation);

  //subLocation routes
  app
    .route('/api/v1/location/:locationId/sub')
    .post(auth, createSubLocation)
    .get(auth, fetchAllSubLocations);
  app
    .route('/api/v1/location/:locationId/sub/:id')
    .put(auth, updateSubLocation)
    .delete(auth, deleteSubLocation)
    .get(auth, fetchSubLocation);

   //user routes
   app
   .route('/api/v1/user')
   .post(createUser)
   app
   .route('/api/v1/user/login')
   .post(loginUser)
};
