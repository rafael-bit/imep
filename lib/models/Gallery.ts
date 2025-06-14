import mongoose, { Schema, Document, Model } from 'mongoose';

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

export interface IGalleryDocument extends IGallery, Document { }

export interface IGalleryModel extends Model<IGalleryDocument> { }

const GallerySchema = new Schema<IGalleryDocument>(
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

const Gallery: IGalleryModel = mongoose.models.Gallery ||
	mongoose.model<IGalleryDocument, IGalleryModel>('Gallery', GallerySchema);

export default Gallery; 