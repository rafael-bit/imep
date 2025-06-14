import mongoose, { Schema, Document, Model } from 'mongoose';

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

export interface IChurchDocument extends IChurch, Document { }

export interface IChurchModel extends Model<IChurchDocument> { }

const ChurchSchema = new Schema<IChurchDocument>(
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

const Church: IChurchModel = mongoose.models.Church ||
	mongoose.model<IChurchDocument, IChurchModel>('Church', ChurchSchema);

export default Church; 