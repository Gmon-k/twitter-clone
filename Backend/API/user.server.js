const express = require('express');
const router = express.Router();
const UserAccessor = require('../Databases/user.model');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const path = require('path');
const fs = require('fs');

const defaultProfilePicPath = 'src/Images/default_pro_pic.png';
const defaultProfilePicBuffer = fs.readFileSync(defaultProfilePicPath);
const defaultProfilePicBase64 = defaultProfilePicBuffer.toString('base64');



router.post('/login', async function(request, response) {
    const body = request.body;
    const username = body.username;
    const password = body.password;

    if (!username || !password) {
        response.status(401);
        return response.send("Incomplete request");
    }

    const receivedUser = await UserAccessor.getUserByUsername(username);

    if (!receivedUser) {
        response.status(404);
        return response.send("No user with username " + username);
    }

    const isValidPassword = password === receivedUser.password;

    if (isValidPassword) {
        response.cookie('username', receivedUser.username);
        response.cookie('firstName', receivedUser.firstName); // Set firstName cookie
        response.cookie('lastName', receivedUser.lastName);   // Set lastName cookie

        response.status(200);
        return response.send({
            loggedIn: true,
            username: receivedUser.username,
            firstName: receivedUser.firstName,
            lastName: receivedUser.lastName
        });
    } else {
        response.status(404);
        return response.send("Invalid username or password combination for " + username);
    }
});





// Retrieve all user details (except password) by username
router.get('/getUserDetails/:username', async function(request, response) {
  const requestedUsername = request.params.username;

  if (!requestedUsername) {
    response.status(400).json({ error: "Incomplete request" });
    return;
  }

  try {
    const user = await UserAccessor.getUserByUsername(requestedUsername);

    if (user) {
      // Create a copy of the user object without the password
      const userDetails = { ...user.toObject() };
      delete userDetails.password;

      response.status(200).json(userDetails);
    } else {
      response.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: "Internal Server Error" });
  }
});





router.post('/signup', async function(request, response) {
    try {
        const body = request.body;
        const username = body.username;
        const password = body.password;
        const firstName = body.firstName;
        const lastName = body.lastName;


        if (!username || !password || !firstName || !lastName) {
            response.status(400).json({ error: "Incomplete request" });
            return;
        }

        const existingUser = await UserAccessor.getUserByUsername(username);
       

        if (existingUser) {
            response.status(409).json({ error: "Username already exists, please choose another one." });
            return;
        }

        const newUser = {
            username: username,
            password: password,
            firstName: firstName,
            lastName: lastName,
            bio: "insert your bio here",
            profilePic: defaultProfilePicBase64
        };

        const createdUser = await UserAccessor.insertUser(newUser);
        const createdTime = createdUser.createdTime;

        response.cookie('username', createdUser.username);
        response.cookie('firstName', createdUser.firstName);
        response.cookie('lastName', createdUser.lastName);

        response.status(201).json({ message: "Successfully created new user", 
        username: createdUser.username,
        createdTime: createdTime });
    } catch (error) {
        console.error(error);
        response.status(500).json({ error: "Internal Server Error" });
    }
});




router.post('/logout', async function(request, response) {
    response.clearCookie('username');
    response.clearCookie('firstName');
    response.clearCookie('lastName');
    response.send();
});





router.get('/isLoggedIn', function(request, response) {
    const username = request.cookies.username;
    const firstName = request.cookies.firstName;
    const lastName = request.cookies.lastName;
    const createdTime = request.cookies.createdTime; // Add this line to get createdTime


    response.send({
        isLoggedIn: !!username,
        username: username,
        firstName: firstName,
        lastName: lastName,
        createdTime: createdTime 
    });
});

router.post('/updateUserDetails', upload.single('profilePic'), async function (request, response) {
    const username = request.cookies.username;
    const { bio } = request.body;
  
    if (!username) {
      response.status(401).json({ error: "User not logged in" });
      return;
    }
  
    try {
      const user = await UserAccessor.getUserByUsername(username);
      if (user) {
  
        user.bio = bio || user.bio;
  
  
        if (request.file) {
  
          const imageBase64 = fs.readFileSync(request.file.path, { encoding: 'base64' });
  
  
          user.profilePic = imageBase64;
  
          fs.unlinkSync(request.file.path);
        }
  
        await user.save();
  
        response.status(200).json({ message: "User details updated successfully" });
      } else {
        response.status(404).json({ error: "User not found" });
      }
    } catch (error) {
      console.error(error);
      response.status(500).json({ error: "Internal Server Error" });
    }
  });

  router.get('/searchUsers', async function (request, response) {
  const query = request.query.query;

  try {
    if (!query) {
      response.status(400).json({ error: 'Incomplete request' });
      return;
    }

    const searchResults = await UserAccessor.searchUsers(query);
    const formattedResults = searchResults.map((user) => ({
      id: user._id,
      username: user.username,
      // ... other user details
    }));

    response.status(200).json(formattedResults);
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: 'Internal Server Error' });
  }
});



module.exports = router;
