import mongoose, { Schema } from 'mongoose';

export interface IGallery {
	title: string;
	date: Date;
	description?: string;
	images: {
		url: string;
		caption?: string;
		order: number;
	}[];
	createdAt: Date;
	updatedAt: Date;
	churchId: mongoose.Types.ObjectId;
}

const GallerySchema = new Schema<IGallery>(
	{
		title: { type: String, required: true },
		date: { type: Date, required: true },
		description: { type: String },
		images: [
			{
				url: { type: String, required: true },
				caption: { type: String },
				order: { type: Number, default: 0 },
			}
		],
		churchId: { type: Schema.Types.ObjectId, ref: 'Church', required: true },
	},
	{ timestamps: true }
);

export default mongoose.models.Gallery || mongoose.model<IGallery>('Gallery', GallerySchema); 