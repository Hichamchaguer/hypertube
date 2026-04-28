import router from 'express';
import User from '../models/user';
import bcrypt from 'bcryptjs';

const routes = router.Router();

routes.post('/register', async (req, res) => {

    try {

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        const user = await User.create({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword,
    });
    res.json(user);
    }
    catch (err) {
        console.error('Error creating user:', err);
        res.status(500).json({ error: 'Error creating user' });
    }
});

export default routes;