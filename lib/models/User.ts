import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcrypt';

export interface IUser {
	name: string;
	email: string;
	password: string;
	role: string;
	churchId?: mongoose.Types.ObjectId;
	image?: string;
	createdAt: Date;
	updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
	{
		name: { type: String, required: true },
		email: {
			type: String,
			required: true,
			unique: true,
			lowercase: true,
			trim: true
		},
		password: { type: String, required: true },
		role: {
			type: String,
			required: true,
			enum: ['ADMIN', 'USER', 'MEDIA_CHURCH', 'WORSHIP_CHURCH', 'WORKERS', 'MASTER'],
			default: 'USER'
		},
		churchId: {
			type: Schema.Types.ObjectId,
			ref: 'Church'
		},
		image: { type: String },
	},
	{ timestamps: true }
);

// Pré-hook para hash da senha antes de salvar
UserSchema.pre('save', async function (next) {
	// Só hash a senha se ela foi modificada (ou é nova)
	if (!this.isModified('password')) return next();

	try {
		// Gera um salt e hash a senha com 10 rounds
		const salt = await bcrypt.genSalt(10);
		this.password = await bcrypt.hash(this.password, salt);
		next();
	} catch (error) {
		next(error as Error);
	}
});

// Método para comparar senhas
UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
	return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema); 