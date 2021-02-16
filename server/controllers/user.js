const bcrypt = require('bcryptjs');

module.exports = {

    register: async (req, res) => {
        let {username, password} = req.body;
        let db = req.app.get('db');
        let result = await db.user.find_user_by_username([username]);
        let existingUser = result[0];
        if (existingUser) {
          return res.status(409).send('Username taken');
        }
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password, salt);
        const profile_pic = `https://robohash.org/${username}.png`
        const registeredUser = await db.user.create_user([username, hash, profile_pic])
        const user = registeredUser[0];
        req.session.user ={id: user.id, username: user.username, profile_pic: user.profile_pic}
        res.status(200).send(req.session.user)
    },

    login: async (req, res) => {
        let {username, password} = req.body;
        let foundUser = await req.app.get('db').user.find_user_by_username([username]);
        let user = foundUser[0];
        if (!user) {
            return res.status(401).send('Incorrect credentials');
        }
        let isAuthenticated = bcrypt.compareSync(password, user.password);
        if (!isAuthenticated){
            return res.status(403).send('Incorrect credentials');
        }
        req.session.user = {
            id: user.id,
            username: user.username,
            profile_pic: user.profile_pic
        };
        req.session.save();
        return res.send(req.session.user);
    },

    getUser: async (req, res) => {
        if(req.session.user){
            res.status(200).send(req.session.user)
        } else {
            res.status(404).send('Please log in')
        }
    },

    logout: (req, res) => {
        req.session.destroy();
        return res.sendStatus(200);
    }

}