import mongoose, { Schema } from 'mongoose';

export interface ITeamMember {
	name: string;
	role: string;
	email?: string;
	phone?: string;
	churchId: mongoose.Types.ObjectId;
	instruments: string[];
	isActive: boolean;
	createdAt: Date;
	updatedAt: Date;
}

const TeamMemberSchema = new Schema<ITeamMember>(
	{
		name: { type: String, required: true },
		role: { type: String, required: true },
		email: { type: String },
		phone: { type: String },
		instruments: [{ type: String }],
		isActive: { type: Boolean, default: true },
		churchId: { type: Schema.Types.ObjectId, ref: 'Church', required: true },
	},
	{ timestamps: true }
);

export default mongoose.models.TeamMember ||
	mongoose.model<ITeamMember>('TeamMember', TeamMemberSchema); 