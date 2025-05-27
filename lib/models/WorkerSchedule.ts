import mongoose, { Schema } from 'mongoose';

export interface IWorkerSchedule {
	date: Date;
	memberId: mongoose.Types.ObjectId;
	role: string;
	position?: string;
	churchId: mongoose.Types.ObjectId;
	notes?: string;
	createdAt: Date;
	updatedAt: Date;
}

const WorkerScheduleSchema = new Schema<IWorkerSchedule>(
	{
		date: { type: Date, required: true },
		memberId: {
			type: Schema.Types.ObjectId,
			ref: 'Member',
			required: true
		},
		role: {
			type: String,
			required: true,
			enum: ['porta', 'recepcao', 'oferta', 'ceia', 'limpeza', 'seguranca']
		},
		position: { type: String },
		churchId: {
			type: Schema.Types.ObjectId,
			ref: 'Church',
			required: true
		},
		notes: { type: String },
	},
	{ timestamps: true }
);

// Índice para evitar duplicações na mesma data/função/posição
WorkerScheduleSchema.index({ date: 1, role: 1, position: 1, memberId: 1 }, { unique: true });

export default mongoose.models.WorkerSchedule ||
	mongoose.model<IWorkerSchedule>('WorkerSchedule', WorkerScheduleSchema); 