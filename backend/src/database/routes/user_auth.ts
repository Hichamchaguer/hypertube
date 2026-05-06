import router from 'express';
import User from '../models/user';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const routes = router.Router();

routes.post('/register', async (req: any, res: any) => {

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

        res.send(await user.save());
        console.log(User)
    }
    catch (err) {
        console.error('Error creating user:', err);
        res.status(500).json({ error: 'Error creating user' });
    }
});

// login via jwt 

routes.post('/login', async (req: any, res: any) => {
    try {
        const user = await User.findOne({ username: req.body.username });
        console.log('>>>>> User:', user);
        if (!user) {
            console.log('User not found:', req.body.username);
            return res.status(404).send({ error: 'Invalid username or password 1' });
        }

        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if (!validPassword) {
            console.log('Invalid password for user:', req.body.username);
            return res.status(400).send({ error: 'Invalid username or password 2' });
        }

        const token = jwt.sign({ id: user._id }, 'secret');
        res.cookie('jwt', token, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000 // 1 day

        })
        res.send({ message: 'Login successful'});
    }
    catch (err) {
        res.status(401).json({ error: 'Unauthenticated' });
    }
});

routes.get('/user', async (req:any, res:any) => {
    try {
        const token = req.cookies.jwt;
        if (!token) {
            return res.send({ user: 'Unauthenticated1' });
        }
        const decoded: any = jwt.verify(token, 'secret');
        const user = await User.findOne({ _id: decoded.id });
        console.log('>>>>> User:', user);
        if (!user) {
            return res.send({ user: 'Unauthenticated2' });
        }
        res.send(user);
    }
    catch (err) {
        console.error('Error fetching user:', err);
        res.status(404).json({ error: 'Error fetching user' });
    }
});

routes.post('/logout', (req: any, res: any) => {
    res.cookie('jwt', '', { maxAge: 0 });
    res.send({ message: 'Logout successful' });
});

routes.get('/profile', async (req: any, res: any) => {

        try {
                const users = await User.find();
                res.send({ message: users.map((u: any) => u.username) });
        }
        catch (err) {
            console.error('Error fetching users:', err);
            res.status(500).json({ error: 'Error fetching users' });
        }
});

export default routes;