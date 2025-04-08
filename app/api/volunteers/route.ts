import { NextResponse } from "next/server";
import { prisma } from "@/services/database";
import { z } from "zod";

const volunteerSchema = z.object({
	name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
	email: z.string().email("Email inválido"),
	phone: z.string().min(14, "Telefone inválido"),
	baptized: z.boolean(),
	ministry: z.string().min(1, "Selecione um ministério"),
});

export async function POST(request: Request) {
	try {
		const body = await request.json();

		// Validate the request body
		const validatedData = volunteerSchema.parse(body);

		// Check if email already exists
		const existingVolunteer = await prisma.volunteer.findUnique({
			where: { email: validatedData.email },
		});

		if (existingVolunteer) {
			return NextResponse.json(
				{ error: "Este email já está cadastrado" },
				{ status: 400 }
			);
		}

		// Create the volunteer
		const volunteer = await prisma.volunteer.create({
			data: {
				name: validatedData.name,
				email: validatedData.email,
				phone: validatedData.phone,
				baptized: validatedData.baptized,
				ministry: validatedData.ministry,
			},
		});

		return NextResponse.json(volunteer, { status: 201 });
	} catch (error) {
		console.error("Error creating volunteer:", error);

		if (error instanceof z.ZodError) {
			return NextResponse.json(
				{ error: "Dados inválidos", details: error.errors },
				{ status: 400 }
			);
		}

		return NextResponse.json(
			{ error: "Erro ao processar o formulário" },
			{ status: 400 }
		);
	}
} 