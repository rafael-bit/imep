import mongoose, { Schema } from 'mongoose';

export interface IMember {
	name: string;
	email?: string;
	phone?: string;
	address?: string;
	birthdate?: Date;
	position?: string;
	department?: string;
	isActive: boolean;
	churchId: mongoose.Types.ObjectId;
	image?: string;
	createdAt: Date;
	updatedAt: Date;
}

const MemberSchema = new Schema<IMember>(
	{
		name: { type: String, required: true },
		email: { type: String },
		phone: { type: String },
		address: { type: String },
		birthdate: { type: Date },
		position: { type: String },
		department: { type: String },
		isActive: { type: Boolean, default: true },
		churchId: { type: Schema.Types.ObjectId, ref: 'Church', required: true },
		image: { type: String },
	},
	{ timestamps: true }
);

// Índice para melhorar performance de busca por nome
MemberSchema.index({ name: 'text' });

export default mongoose.models.Member || mongoose.model<IMember>('Member', MemberSchema); 