import { z } from 'zod';

export const registerSchema = z.object({
	name: z.string().min(2, "Nome precisa ter pelo menos 2 caracteres"),
	email: z.string().email("Email inválido"),
	password: z.string().min(6, "Senha precisa ter pelo menos 6 caracteres"),
	confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
	message: "As senhas não coincidem",
	path: ["confirmPassword"]
});

export const loginSchema = z.object({
	email: z.string().email("Email inválido"),
	password: z.string().min(1, "Senha é obrigatória"),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>; 