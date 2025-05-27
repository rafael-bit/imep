import mongoose, { Schema } from 'mongoose';

export interface IChurch {
	name: string;
	address?: string;
	city?: string;
	state?: string;
	phone?: string;
	email?: string;
	website?: string;
	logo?: string;
	createdAt: Date;
	updatedAt: Date;
}

const ChurchSchema = new Schema<IChurch>(
	{
		name: { type: String, required: true },
		address: { type: String },
		city: { type: String },
		state: { type: String },
		phone: { type: String },
		email: { type: String },
		website: { type: String },
		logo: { type: String },
	},
	{ timestamps: true }
);

export default mongoose.models.Church || mongoose.model<IChurch>('Church', ChurchSchema); 