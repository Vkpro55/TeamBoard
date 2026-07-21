import { Schema, model, type Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  email: string;
  password: string;
  username?: string;
  profilePic?: string;
  refreshToken?: string;
  comparePassword(candidate: string): Promise<boolean>;
  hasValidRefreshToken(token: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  username: { type: String, trim: true },
  profilePic: { type: String, trim: true },
  refreshToken: { type: String },
});

userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.comparePassword = async function (candidate: string) {
  return bcrypt.compare(candidate, this.password);
};

userSchema.methods.hasValidRefreshToken = async function (token: string) {
  if (!this.refreshToken) return false;
  return bcrypt.compare(token, this.refreshToken);
};

const User = model<IUser>('User', userSchema);
export default User;
