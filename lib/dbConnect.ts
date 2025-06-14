import mongoose from 'mongoose';

declare global {
	var mongoose: any;
}

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI && process.env.NODE_ENV === 'development') {
	console.warn('MONGODB_URI environment variable is not defined. Please add it to your .env.local file.');
}

let cached = global.mongoose;

if (!cached) {
	cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
	if (process.env.NODE_ENV === 'production' && !process.env.MONGODB_URI) {
		console.warn('MONGODB_URI not available during build time');
		return null;
	}

	if (!MONGODB_URI) {
		throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
	}

	if (cached.conn) {
		return cached.conn;
	}

	if (!cached.promise) {
		const opts = {
			bufferCommands: false,
		};

		cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
			console.log('MongoDB connected successfully');
			return mongoose;
		});
	}

	try {
		cached.conn = await cached.promise;
	} catch (e) {
		cached.promise = null;
		throw e;
	}

	return cached.conn;
}

export default dbConnect; 