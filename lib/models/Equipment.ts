import mongoose, { Schema } from 'mongoose';

export interface IEquipment {
	name: string;
	type: string;
	status: 'available' | 'in_use' | 'maintenance';
	assignedTo?: string;
	notes?: string;
	serialNumber?: string;
	purchaseDate?: Date;
	churchId: mongoose.Types.ObjectId;
	createdAt: Date;
	updatedAt: Date;
}

const EquipmentSchema = new Schema<IEquipment>(
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

export default mongoose.models.Equipment ||
	mongoose.model<IEquipment>('Equipment', EquipmentSchema); 