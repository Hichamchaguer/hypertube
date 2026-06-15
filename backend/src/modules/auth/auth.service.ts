import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../../database/models/user';

export const registerUser = async (payload: any) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(payload.password, salt);

  const user = await User.create({
    firstName: payload.firstName,
    lastName: payload.lastName,
    username: payload.username,
    email: payload.email,
    password: hashedPassword,
  });

  return user.save();
};

export const loginUser = async (payload: any) => {
  const user = await User.findOne({ username: payload.username });
  if (!user || !user.password) {
    throw new Error('Invalid username or password');
  }

  const validPassword = await bcrypt.compare(payload.password, user.password);
  if (!validPassword) {
    throw new Error('Invalid username or password');
  }

  const token = jwt.sign({ id: user._id }, 'secret');
  return { token };
};

export const getUserFromToken = async (token?: string) => {
  if (!token) {
    return null;
  }
  const decoded: any = jwt.verify(token, 'secret');
  return User.findOne({ _id: decoded.id });
};

export const getAllUsers = async () => {
  return User.find();
};
