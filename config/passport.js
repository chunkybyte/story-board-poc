const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const User = require('../models/User');

module.exports = function (passport) {
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: '/auth/google/callback'
    }, 
    async (accessToken, refreshToken, profile, done) => {
        // console.log(profile);
        const newUser = {
            googleId: profile.id,
            displayName: profile.displayName,
            firstName: profile.name.givenName,
            lastName: profile.name.familyName,
            image: profile.photos[0].value
        }

        try {
            let user = await User.findOne( { googleId: profile.id} );

            if (user) { 
                done(null, user);
            } else {
                user = await User.create(newUser);
                done(null, user);
            }
        } catch (error) {
            console.log(`PassportError: ${error}`);
        }
    }
    ));

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });
      
    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
            done(err, user);
        });
    });

}

// { id: '110748895563390490305',
//   displayName: 'Ekansh Kothiyal',
//   name: { familyName: 'Kothiyal', givenName: 'Ekansh' },
//   photos:
//    [ { value:
//         'https://lh3.googleusercontent.com/a-/AOh14Gg1uzcF9xE57B5j8AFbxWIoeRM0TfbHY2Vi55ng' } ],
//   provider: 'google',
//   _raw:
//    '{\n  "sub": "110748895563390490305",\n  "name": "Ekansh Kothiyal",\n  "given_name": "Ekansh",\n  "family_name": "Kothiyal",\n  "picture": "https://lh3.googleusercontent.com/a-/AOh14Gg1uzcF9xE57B5j8AFbxWIoeRM0TfbHY2Vi55ng",\n  "locale": "en"\n}',
//   _json:
//    { sub: '110748895563390490305',
//      name: 'Ekansh Kothiyal',
//      given_name: 'Ekansh',
//      family_name: 'Kothiyal',
//      picture:
//       'https://lh3.googleusercontent.com/a-/AOh14Gg1uzcF9xE57B5j8AFbxWIoeRM0TfbHY2Vi55ng',
//      locale: 'en' } }