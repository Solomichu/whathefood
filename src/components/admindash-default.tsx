'use client';
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSession } from "next-auth/react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Clock, Users, Utensils, CheckSquare } from "lucide-react";

interface DashboardStats {
  pendingDishes: number;
  totalDishes: number;
  totalUsers: number;
  totalTasks: number;
  userGrowth: { date: string; count: number; }[];
}

export default function DashboardDefault({ onViewChange }: { onViewChange?: (view: string) => void }) {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<DashboardStats>({
    pendingDishes: 0,
    totalDishes: 0,
    totalUsers: 0,
    totalTasks: 0,
    userGrowth: []
  });

  const fetchStats = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const [pendingDishesResponse, allDishesResponse, usersResponse, tasksResponse] = await Promise.all([
        fetch('/api/dishes?status=PENDING'),
        fetch('/api/dishes'),
        fetch('/api/users'),
        fetch(`/api/tasks?userId=${session?.user?.id}`)
      ]);

      if (!pendingDishesResponse.ok || !allDishesResponse.ok || !usersResponse.ok || !tasksResponse.ok) {
        throw new Error('Error al obtener los datos');
      }

      const [pendingDishesData, allDishesData, usersData, tasksData] = await Promise.all([
        pendingDishesResponse.json(),
        allDishesResponse.json(),
        usersResponse.json(),
        tasksResponse.json()
      ]);

      const last7Days = Array.from({length: 7}, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - i);
        return d.toISOString().split('T')[0];
      }).reverse();

      const userGrowth = last7Days.map(date => ({
        date: new Date(date).toLocaleDateString('es-ES', { 
          month: 'short', 
          day: 'numeric' 
        }),
        count: usersData.filter((user: any) => {
          const creationDate = user.creationDate ? new Date(user.creationDate) : null;
          return creationDate && 
                 creationDate.toISOString().split('T')[0] === date;
        }).length
      }));

      setStats({
        pendingDishes: pendingDishesData.dishes.length,
        totalDishes: allDishesData.dishes.length,
        totalUsers: usersData.length,
        totalTasks: tasksData.length,
        userGrowth
      });
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error al obtener estadísticas');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="max-w-7xl mx-auto space-y-6 p-6">
      {/* Bienvenida */}
      <div className="flex justify-between items-center bg-card p-6 rounded-lg shadow-sm">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            ¡Bienvenido, {session?.user?.name || 'Administrador'}!
          </h1>
          <p className="text-muted-foreground">
            Panel de administración de TuCocina
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center min-h-[200px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : error ? (
        <div className="text-red-500 text-center p-4">
          {error}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <Card 
              className="bg-card h-[150px] cursor-pointer hover:shadow-lg transition-all duration-200"
              onClick={() => onViewChange?.('recipes')}
            >
              <div className="flex justify-between items-center p-6 h-full">
                <div className="flex items-center gap-4">
                  <Utensils className="h-10 w-10 text-primary" />
                  <div>
                    <CardTitle className="text-lg font-medium">
                      Total de Platos
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Platos registrados
                    </p>
                  </div>
                </div>
                <div className="text-6xl font-bold text-primary">
                  {stats.totalDishes}
                </div>
              </div>
            </Card>

            <Card 
              className="bg-card h-[150px] cursor-pointer hover:shadow-lg transition-all duration-200"
              onClick={() => onViewChange?.('recipes')}
            >
              <div className="flex justify-between items-center p-6 h-full">
                <div className="flex items-center gap-4">
                  <Clock className="h-10 w-10 text-yellow-500" />
                  <div>
                    <CardTitle className="text-lg font-medium">
                      Platos Pendientes
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Requieren revisión
                    </p>
                  </div>
                </div>
                <div className="text-6xl font-bold text-yellow-500">
                  {stats.pendingDishes}
                </div>
              </div>
            </Card>

            <Card 
              className="bg-card h-[150px] cursor-pointer hover:shadow-lg transition-all duration-200"
              onClick={() => onViewChange?.('users')}
            >
              <div className="flex justify-between items-center p-6 h-full">
                <div className="flex items-center gap-4">
                  <Users className="h-10 w-10 text-primary" />
                  <div>
                    <CardTitle className="text-lg font-medium">
                      Usuarios Totales
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Usuarios registrados
                    </p>
                  </div>
                </div>
                <div className="text-6xl font-bold text-primary">
                  {stats.totalUsers}
                </div>
              </div>
            </Card>

            <Card 
              className="bg-card h-[150px] cursor-pointer hover:shadow-lg transition-all duration-200"
              onClick={() => onViewChange?.('my-tasks')}
            >
              <div className="flex justify-between items-center p-6 h-full">
                <div className="flex items-center gap-4">
                  <CheckSquare className="h-10 w-10 text-primary" />
                  <div>
                    <CardTitle className="text-lg font-medium">
                      Mis Tareas
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Tareas creadas
                    </p>
                  </div>
                </div>
                <div className="text-6xl font-bold text-primary">
                  {stats.totalTasks}
                </div>
              </div>
            </Card>
          </div>

          {/* User Growth Chart */}
          <Card className="bg-card">
            <CardHeader>
              <CardTitle className="text-sm font-medium">
                Crecimiento de Usuarios
              </CardTitle>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={stats.userGrowth}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="date" 
                    stroke="hsl(var(--muted-foreground))" 
                  />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: 'var(--radius)'
                    }}
                    labelStyle={{ color: 'hsl(var(--muted-foreground))' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="count" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2}
                    dot={{ fill: 'hsl(var(--primary))' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
