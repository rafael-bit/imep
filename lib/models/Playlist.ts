import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IPlaylist {
	title: string;
	date: Date;
	eventType: string;
	songs: {
		songId: mongoose.Types.ObjectId;
		order: number;
		key?: string; // Permite sobrescrever o tom original da música
		notes?: string;
	}[];
	churchId: mongoose.Types.ObjectId;
	createdAt: Date;
	updatedAt: Date;
}

export interface IPlaylistDocument extends IPlaylist, Document { }

export interface IPlaylistModel extends Model<IPlaylistDocument> { }

const PlaylistSchema = new Schema<IPlaylistDocument>(
	{
		title: { type: String, required: true },
		date: { type: Date, required: true },
		eventType: { type: String, required: true },
		songs: [
			{
				songId: {
					type: Schema.Types.ObjectId,
					ref: 'Song',
					required: true
				},
				order: { type: Number, required: true },
				key: { type: String },
				notes: { type: String },
			}
		],
		churchId: { type: Schema.Types.ObjectId, ref: 'Church', required: true },
	},
	{ timestamps: true }
);

const Playlist: IPlaylistModel = mongoose.models.Playlist ||
	mongoose.model<IPlaylistDocument, IPlaylistModel>('Playlist', PlaylistSchema);

export default Playlist; 