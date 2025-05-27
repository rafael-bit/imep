import mongoose, { Schema } from 'mongoose';

export interface IWorshipSchedule {
	date: Date;
	memberId: mongoose.Types.ObjectId;
	role: string;
	instrument?: string;
	churchId: mongoose.Types.ObjectId;
	notes?: string;
	createdAt: Date;
	updatedAt: Date;
}

const WorshipScheduleSchema = new Schema<IWorshipSchedule>(
	{
		date: { type: Date, required: true },
		memberId: {
			type: Schema.Types.ObjectId,
			ref: 'TeamMember',
			required: true
		},
		role: {
			type: String,
			required: true,
			enum: ['vocal', 'teclado', 'guitarra', 'bateria', 'baixo', 'violao']
		},
		instrument: { type: String },
		churchId: {
			type: Schema.Types.ObjectId,
			ref: 'Church',
			required: true
		},
		notes: { type: String },
	},
	{ timestamps: true }
);

// Índice para evitar duplicações na mesma data/função
WorshipScheduleSchema.index({ date: 1, role: 1, memberId: 1 }, { unique: true });

export default mongoose.models.WorshipSchedule ||
	mongoose.model<IWorshipSchedule>('WorshipSchedule', WorshipScheduleSchema); 