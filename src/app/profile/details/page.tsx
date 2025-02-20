'use client'
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Camera, Loader2 } from "lucide-react"
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from "@/components/ui/drawer"

interface UserProfile {
  id: string;
  username: string;
  email: string;
  role: 'ADMIN' | 'USER';
  image: string | null;
  creationDate: string;
  modificationDate: string;
}

export default function ProfileDetails() {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'USER' as 'ADMIN' | 'USER',
    image: null as File | null,
  });
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isUpdateDrawerOpen, setIsUpdateDrawerOpen] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (session?.user?.id) {
        try {
          const response = await fetch(`/api/users?id=${session.user.id}`);
          if (response.ok) {
            const data = await response.json();
            setUserProfile(data);
            setFormData(prev => ({
              ...prev,
              username: data.username || '',
              email: data.email || '',
              role: data.role || 'USER',
            }));
          }
        } catch (error) {
          console.error('Error al cargar el perfil:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchUserProfile();
  }, [session]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, image: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');

    if (formData.password) {
      if (formData.password !== formData.confirmPassword) {
        setPasswordError('Las contraseñas no coinciden');
        return;
      }
      if (formData.password.length < 6) {
        setPasswordError('La contraseña debe tener al menos 6 caracteres');
        return;
      }
    }

    setIsSaving(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('username', formData.username);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('role', formData.role);
      if (formData.password) {
        formDataToSend.append('password', formData.password);
      }
      if (formData.image) {
        formDataToSend.append('image', formData.image);
      }

      const response = await fetch(`/api/users?id=${session?.user?.id}`, {
        method: 'PUT',
        body: formDataToSend,
      });

      if (response.ok) {
        const updatedUser = await response.json();
        setUserProfile(updatedUser.user);
        setFormData(prev => ({ 
          ...prev, 
          password: '',
          confirmPassword: '' 
        }));
        setIsUpdateDrawerOpen(true);
        setTimeout(() => setIsUpdateDrawerOpen(false), 3000);
      } else {
        throw new Error('Error al actualizar el perfil');
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto p-4">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Mi Perfil</h1>
          <Badge variant="outline" className="text-primary">
            {userProfile?.role}
          </Badge>
        </div>
        <Separator />

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Información Personal</CardTitle>
              <CardDescription>
                Actualiza tu información personal y contraseña
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col items-center space-y-4">
                <div className="relative">
                  <Avatar className="h-24 w-24">
                    <AvatarImage 
                      src={previewImage || userProfile?.image || ''} 
                      alt={userProfile?.username || 'Avatar'} 
                    />
                    <AvatarFallback>{userProfile?.username?.[0] || 'U'}</AvatarFallback>
                  </Avatar>
                  <label 
                    htmlFor="image-upload" 
                    className="absolute bottom-0 right-0 p-1 bg-primary rounded-full cursor-pointer hover:bg-primary/90"
                  >
                    <Camera className="h-4 w-4 text-white" />
                    <input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageChange}
                    />
                  </label>
                </div>
                <div className="text-sm text-gray-500">
                  Miembro desde {new Date(userProfile?.creationDate || '').toLocaleDateString()}
                </div>
              </div>

              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Nombre de usuario</Label>
                  <Input
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Correo electrónico</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>

                

                <div className="space-y-2">
                  <Label htmlFor="password">Nueva contraseña</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Dejar en blanco para mantener la actual"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmar nueva contraseña</Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="Confirmar nueva contraseña"
                  />
                  {passwordError && (
                    <p className="text-sm text-red-500 mt-1">{passwordError}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="role">Rol</Label>
                  <Input
                    id="role"
                    name="role"
                    value={formData.role}
                    disabled
                    className="bg-gray-100"
                  />
                </div>

              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button type="submit" disabled={isSaving}>
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isSaving ? 'Guardando...' : 'Guardar cambios'}
            </Button>
          </div>
        </form>
      </div>

      <Drawer open={isUpdateDrawerOpen} onOpenChange={setIsUpdateDrawerOpen}>
        <DrawerContent className="flex w-fit mx-auto px-10">
          <DrawerHeader className="text-center">
            <DrawerTitle className="bg-primary text-secondary px-4 py-2 rounded-lg mb-2">
              ¡Perfil Actualizado!
            </DrawerTitle>
            <DrawerDescription>
              Tus cambios han sido guardados exitosamente
            </DrawerDescription>
          </DrawerHeader>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
