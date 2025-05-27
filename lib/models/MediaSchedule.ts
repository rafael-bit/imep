import mongoose, { Schema } from 'mongoose';

export interface IMediaSchedule {
	date: Date;
	type: 'live' | 'photo' | 'slide';
	memberId: mongoose.Types.ObjectId;
	churchId: mongoose.Types.ObjectId;
	notes?: string;
	createdAt: Date;
	updatedAt: Date;
}

const MediaScheduleSchema = new Schema<IMediaSchedule>(
	{
		date: { type: Date, required: true },
		type: {
			type: String,
			required: true,
			enum: ['live', 'photo', 'slide']
		},
		memberId: {
			type: Schema.Types.ObjectId,
			ref: 'Member',
			required: true
		},
		churchId: {
			type: Schema.Types.ObjectId,
			ref: 'Church',
			required: true
		},
		notes: { type: String },
	},
	{ timestamps: true }
);

// Composto index para evitar duplicações na mesma data/tipo
MediaScheduleSchema.index({ date: 1, type: 1, memberId: 1 }, { unique: true });

export default mongoose.models.MediaSchedule ||
	mongoose.model<IMediaSchedule>('MediaSchedule', MediaScheduleSchema); 