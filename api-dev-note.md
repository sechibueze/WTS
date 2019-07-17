#PROJECT WORKFLOW
#TODO: 
npm install coveralls mocha-lcov-reporter node-coveralls --save-dev
npm install  --save-dev
npm i -D 

-Tooling
  Server side Framework: ​ Node​ /​Express 
  ● Linting Library: ​ ESLint 
  ● Style Guide: ​ Airbnb 
  ● Testing Framework: ​ Mocha​ ​ or​  ​ Jasmine 
   

-Guidelines
 
#PROJECT TRACKING & MGT
1. User can sign up. 
2. User can sign in. 
3. Admin can create a trip. 
4. Admin can cancel a trip. 
5. Both Admin and Users can see all trips. 
6. Users can book a seat on a trip. 
7. View all bookings. An Admin can see all bookings, while user can see all of his/her bookings. 
8. Users can delete their booking. 
9. Users can get a list of filtered trips based on origin. 
10. Users can get a list of filtered trips based on destination. 
11. Users can specify their seat numbers when making a booking

--add validations
#GIT & GITHUB

#DATA MODELLING & DESIGN

#ROUTING & SQL QUERIES
baseUrl : /api/v1/

/POST auth/signup
/POST auth/login

/GET users - returns first_name... token of all users from database
/GET users/user_id - returns a single user by user_id
/PATCH users/user_id - update a user's data like status

/GET /trips - get all trips
/GET /trips/trip_id - get data for a specific trip
/POST /trips - create a trip by admin
/PATCH /trips/trip_id - update a trip[by admin] - like cancel

/GET bookings/ - get all bookings by the user
/GET bookings/booking_id
/POST booking/ - user/admin can book a seat 
/PATCH bookings/booking_id - user can update their booking

#TESTING & TEST COVERAGE

#LINTING

#CONTINUOUS INTEGRATION

#AUTOMATED DEPLOYMENT

#DOCUMENTATION