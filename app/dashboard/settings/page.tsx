'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UploadAPI } from '@/lib/api';
import { User, KeyRound, AtSign, Church, Upload } from 'lucide-react';
import Image from 'next/image';

export default function SettingsPage() {
  const { data: session, update } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (session?.user) {
      setFormData(prev => ({
        ...prev,
        name: session.user.name || '',
        email: session.user.email || '',
      }));

      if (session.user.image) {
        setPreviewUrl(session.user.image);
      }
    }
  }, [session]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfileImage(file);
      
      // Criar URL para preview da imagem
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError('');
      setSuccess('');
      
      // Validar senhas se estiver alterando
      if (formData.newPassword) {
        if (!formData.currentPassword) {
          setError('Senha atual é obrigatória para alterar a senha');
          return;
        }
        
        if (formData.newPassword !== formData.confirmPassword) {
          setError('As novas senhas não conferem');
          return;
        }
        
        if (formData.newPassword.length < 6) {
          setError('A nova senha deve ter pelo menos 6 caracteres');
          return;
        }
      }
      
      let imageUrl = session?.user?.image || null;
      
      // Upload da imagem se houver uma nova
      if (profileImage) {
        const { urls } = await UploadAPI.uploadFiles([profileImage], 'profiles');
        imageUrl = urls[0];
      }
      
      // Preparar dados para atualização
      const userData = {
        name: formData.name,
        email: formData.email,
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
        image: imageUrl,
      };
      
      // Enviar requisição para API
      const response = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Erro ao atualizar perfil');
      }
      
      // Atualizar a sessão
      await update({
        ...session,
        user: {
          ...session?.user,
          name: formData.name,
          image: imageUrl,
        },
      });
      
      setSuccess('Perfil atualizado com sucesso!');
      
      // Limpar campos de senha
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      }));
      
    } catch (error: any) {
      console.error('Erro ao atualizar perfil:', error);
      setError(error.message || 'Erro ao atualizar perfil. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white">Configurações</h1>
      
      <Card className="bg-gray-900 border-gray-800">
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-destructive/20 text-destructive p-3 rounded-md">
                {error}
              </div>
            )}
            
            {success && (
              <div className="bg-green-500/20 text-green-500 p-3 rounded-md">
                {success}
              </div>
            )}
            
            <div className="flex flex-col md:flex-row gap-6">
              <div className="w-full md:w-1/3 flex flex-col items-center">
                <div className="relative">
                  <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-primary mb-4">
                    {previewUrl ? (
                      <Image
                        src={previewUrl} 
                        alt="Profile" 
                        className="w-full h-full object-cover"
                        width={128}
                        height={128}
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                        <User className="w-16 h-16 text-gray-600" />
                      </div>
                    )}
                  </div>
                  <label 
                    htmlFor="profile-image" 
                    className="absolute bottom-2 right-0 bg-primary rounded-full p-2 cursor-pointer"
                  >
                    <Upload className="h-4 w-4 text-white" />
                  </label>
                  <input 
                    id="profile-image" 
                    type="file" 
                    accept="image/*" 
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </div>
                
                <p className="text-gray-400 text-sm text-center mt-2">
                  Clique no ícone para fazer upload de uma imagem de perfil
                </p>
              </div>
              
              <div className="w-full md:w-2/3 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-white">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <span>Nome completo</span>
                    </div>
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="bg-gray-800 border-gray-700 text-white"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white">
                    <div className="flex items-center gap-2">
                      <AtSign className="h-4 w-4" />
                      <span>Email</span>
                    </div>
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="bg-gray-800 border-gray-700 text-white"
                    required
                  />
                </div>
                
                <div className="border-t border-gray-800 my-4 pt-4">
                  <h3 className="text-lg font-semibold text-white mb-4">Alterar senha</h3>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword" className="text-white">
                        <div className="flex items-center gap-2">
                          <KeyRound className="h-4 w-4" />
                          <span>Senha atual</span>
                        </div>
                      </Label>
                      <Input
                        id="currentPassword"
                        name="currentPassword"
                        type="password"
                        value={formData.currentPassword}
                        onChange={handleChange}
                        className="bg-gray-800 border-gray-700 text-white"
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="newPassword" className="text-white">Nova senha</Label>
                        <Input
                          id="newPassword"
                          name="newPassword"
                          type="password"
                          value={formData.newPassword}
                          onChange={handleChange}
                          className="bg-gray-800 border-gray-700 text-white"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword" className="text-white">Confirmar nova senha</Label>
                        <Input
                          id="confirmPassword"
                          name="confirmPassword"
                          type="password"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          className="bg-gray-800 border-gray-700 text-white"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button type="submit" disabled={loading}>
                    {loading ? 'Salvando...' : 'Salvar alterações'}
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
      
      {session?.user?.role === 'ADMIN' && (
        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-4">
              <Church className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-bold text-white">Configurações da Igreja</h2>
            </div>
            
            <p className="text-gray-400 mb-4">
              Como administrador, você pode gerenciar as configurações da igreja, membros e usuários do sistema.
            </p>
            
            <div className="flex flex-wrap gap-2">
              <Button 
                variant="outline" 
                onClick={() => router.push('/dashboard/settings/users')}
              >
                Gerenciar Usuários
              </Button>
              <Button 
                variant="outline" 
                onClick={() => router.push('/dashboard/settings/church')}
              >
                Configurações da Igreja
              </Button>
              <Button 
                variant="outline" 
                onClick={() => router.push('/dashboard/settings/members')}
              >
                Gerenciar Membros
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 