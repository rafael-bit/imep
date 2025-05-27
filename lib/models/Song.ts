import mongoose, { Schema } from 'mongoose';

export interface ISong {
	title: string;
	artist: string;
	key: string;
	bpm: number;
	category: string;
	lyrics?: string;
	chords?: string;
	youtubeLink?: string;
	lastPlayed?: Date;
	churchId: mongoose.Types.ObjectId;
	createdAt: Date;
	updatedAt: Date;
}

const SongSchema = new Schema<ISong>(
	{
		title: { type: String, required: true },
		artist: { type: String, required: true },
		key: { type: String, required: true },
		bpm: { type: Number, default: 0 },
		category: { type: String, required: true },
		lyrics: { type: String },
		chords: { type: String },
		youtubeLink: { type: String },
		lastPlayed: { type: Date },
		churchId: { type: Schema.Types.ObjectId, ref: 'Church', required: true },
	},
	{ timestamps: true }
);

// Index para buscas por título e artista
SongSchema.index({ title: 'text', artist: 'text' });
// Index para garantir que não haja músicas duplicadas por igreja
SongSchema.index({ title: 1, artist: 1, churchId: 1 }, { unique: true });

export default mongoose.models.Song || mongoose.model<ISong>('Song', SongSchema); 