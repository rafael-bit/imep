import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IEquipment {
	name: string;
	type: string;
	status: string;
	assignedTo?: string;
	notes?: string;
	serialNumber?: string;
	purchaseDate?: Date;
	churchId: mongoose.Types.ObjectId;
	createdAt: Date;
	updatedAt: Date;
}

export interface IEquipmentDocument extends IEquipment, Document { }

export interface IEquipmentModel extends Model<IEquipmentDocument> { }

const EquipmentSchema = new Schema<IEquipmentDocument>(
	{
		name: { type: String, required: true },
		type: {
			type: String,
			required: true,
			enum: ['audio', 'video', 'instrument', 'lighting', 'computer', 'other']
		},
		status: {
			type: String,
			required: true,
			enum: ['available', 'in_use', 'maintenance'],
			default: 'available'
		},
		assignedTo: { type: String },
		notes: { type: String },
		serialNumber: { type: String },
		purchaseDate: { type: Date },
		churchId: { type: Schema.Types.ObjectId, ref: 'Church', required: true },
	},
	{ timestamps: true }
);

const Equipment: IEquipmentModel = mongoose.models.Equipment ||
	mongoose.model<IEquipmentDocument, IEquipmentModel>('Equipment', EquipmentSchema);

export default Equipment; 