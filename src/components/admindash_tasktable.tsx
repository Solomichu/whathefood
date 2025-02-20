'use client'
import React, { useEffect, useState } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MoreVertical, Edit, Trash2, Search, Plus } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { DialogContent } from "@/components/ui/dialog"
import { useSession } from 'next-auth/react'
import {DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription } from "@/components/ui/drawer"
import CreateTaskModal from './createtask_modal'
import EditTaskDialog from './edittask_dialog'
import DeleteTaskDialog from './deletetask_dialog'
import { DialogWrapper } from "@/components/ui/dialog-wrapper"
import { DrawerWrapper } from "@/components/ui/drawer-wrapper"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface Task {
  id: string;
  name: string;
  description: string;
  priority: string;
  status: string;
  createdById: string;
  creatorUsername?: string;
  creatorImage?: string;
}

export default function AdmindashTasktable() {
  const { data: session } = useSession();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [priorityFilter, setPriorityFilter] = useState<string>('ALL');
  
  // Estados para modales y drawers
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deletingTask, setDeletingTask] = useState<Task | null>(null);
  
  // Estados para drawers de notificación
  const [isCreateDrawerOpen, setIsCreateDrawerOpen] = useState(false);
  const [isDeleteDrawerOpen, setIsDeleteDrawerOpen] = useState(false);
  const [createdTaskInfo, setCreatedTaskInfo] = useState<{
    name: string;
    priority: string;
    status: string;
  } | null>(null);
  const [deletedTaskInfo, setDeletedTaskInfo] = useState<{
    name: string;
  } | null>(null);

  useEffect(() => {
    const fetchUserTasks = async () => {
      if (!session?.user?.id) return;

      try {
        const response = await fetch(`/api/tasks?userId=${session.user.id}`);
        if (!response.ok) throw new Error('Error al obtener las tareas');
        const data = await response.json();
        
        // Filtrar solo las tareas del usuario actual
        const userTasks = data.filter((task: Task) => task.createdById === session.user.id);
        setTasks(userTasks);
        setFilteredTasks(userTasks);
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchUserTasks();
  }, [session?.user?.id]);

  // Efecto para el filtrado de tareas
  useEffect(() => {
    const filtered = tasks.filter(task => {
      const matchesSearch = task.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (task.description?.toLowerCase() || '').includes(searchTerm.toLowerCase());
      
      const matchesPriority = priorityFilter === 'ALL' || task.priority === priorityFilter;
      
      return matchesSearch && matchesPriority;
    });
    setFilteredTasks(filtered);
  }, [searchTerm, tasks, priorityFilter]);

  const handleTaskCreated = (newTask: Task) => {
    try {
      setTasks(prevTasks => [...prevTasks, newTask]);
      setIsCreateModalOpen(false);
      
      setCreatedTaskInfo({
        name: newTask.name,
        priority: newTask.priority,
        status: newTask.status
      });
      
      setIsCreateDrawerOpen(true);
      setTimeout(() => {
        setIsCreateDrawerOpen(false);
        setCreatedTaskInfo(null);
      }, 3000);
    } catch (error) {
      console.error('Error al manejar la tarea creada:', error);
    }
  };

  const handleTaskUpdated = (updatedTask: Task) => {
    setTasks(prevTasks => 
      prevTasks.map(task => task.id === updatedTask.id ? updatedTask : task)
    );
    setIsEditDialogOpen(false);
    setEditingTask(null);
  };

  const handleDeleteTask = async (id: string) => {
    try {
      const response = await fetch(`/api/tasks?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Error al eliminar la tarea');

      setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
      setIsDeleteDialogOpen(false);
      
      if (deletingTask) {
        setDeletedTaskInfo({
          name: deletingTask.name
        });
        setIsDeleteDrawerOpen(true);
        setTimeout(() => {
          setIsDeleteDrawerOpen(false);
          setDeletedTaskInfo(null);
        }, 3000);
      }
      
      setDeletingTask(null);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleQuickDelete = async (taskId: string, taskName: string) => {
    try {
      const response = await fetch(`/api/tasks?id=${taskId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Error al eliminar la tarea');

      setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
      
      setDeletedTaskInfo({
        name: taskName
      });
      setIsDeleteDrawerOpen(true);
      setTimeout(() => {
        setIsDeleteDrawerOpen(false);
        setDeletedTaskInfo(null);
      }, 3000);
      
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Mis Tareas</h1>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nueva Tarea
        </Button>
      </div>

      <div className="flex gap-4 w-full max-w-xl mx-auto mb-8">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Buscar tareas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border rounded-md bg-background text-foreground"
          />
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        </div>
        
        <Select value={priorityFilter} onValueChange={setPriorityFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filtrar por prioridad" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Todas las prioridades</SelectItem>
            <SelectItem value="HIGH">Alta</SelectItem>
            <SelectItem value="NORMAL">Normal</SelectItem>
            <SelectItem value="LOW">Baja</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTasks.map((task) => (
          <Card key={task.id}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <h3 className="font-semibold">{task.name}</h3>
                  <p className="text-sm text-gray-500 line-clamp-2">{task.description}</p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => {
                      setEditingTask(task);
                      setIsEditDialogOpen(true);
                    }}>
                      <Edit className="mr-2 h-4 w-4" />
                      <span>Editar</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => {
                      setDeletingTask(task);
                      setIsDeleteDialogOpen(true);
                    }}>
                      <Trash2 className="mr-2 h-4 w-4" />
                      <span>Eliminar</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="flex justify-between items-center mt-4">
                <Badge variant="outline" className={
                  task.priority === 'HIGH' ? 'bg-red-400 text-red-800' :
                  task.priority === 'NORMAL' ? 'bg-yellow-400 text-yellow-800' :
                  'bg-primary text-secondary'
                }>
                  {task.priority}
                </Badge>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="ml-auto">
                        <Checkbox
                          className="cursor-pointer"
                          onCheckedChange={(checked) => {
                            if (checked) {
                              handleQuickDelete(task.id, task.name);
                            }
                          }}
                        />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Completar y eliminar</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Modales */}
      <DialogWrapper open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <CreateTaskModal
            onTaskCreated={handleTaskCreated}
            userImage={session?.user?.image}
            username={session?.user?.name}
            userId={session?.user?.id}
          />
        </DialogContent>
      </DialogWrapper>

      <DialogWrapper open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          {editingTask && (
            <EditTaskDialog
              task={editingTask}
              onTaskUpdated={handleTaskUpdated}
              onClose={() => setIsEditDialogOpen(false)}
            />
          )}
        </DialogContent>
      </DialogWrapper>

      <DialogWrapper open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        {deletingTask && (
          <DeleteTaskDialog
            task={deletingTask}
            onConfirmDelete={handleDeleteTask}
            onClose={() => setIsDeleteDialogOpen(false)}
          />
        )}
      </DialogWrapper>

      {/* Drawers de notificación */}
      <DrawerWrapper 
        open={isCreateDrawerOpen} 
        onOpenChange={setIsCreateDrawerOpen}
      >
        <DrawerContent className="flex w-fit mx-auto px-10">
          <DrawerHeader className="text-center">
            <DrawerTitle className="bg-primary text-secondary px-4 py-2 rounded-lg mb-2">
              ¡Tarea Creada!
            </DrawerTitle>
            <DrawerDescription className="space-y-2">
              <p className="font-medium text-lg">{createdTaskInfo?.name}</p>
              <div className="flex items-center justify-center gap-2">
                <Badge variant="outline" className={
                  createdTaskInfo?.priority === 'HIGH' ? 'bg-red-100 text-red-800' :
                  createdTaskInfo?.priority === 'NORMAL' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }>
                  {createdTaskInfo?.priority}
                </Badge>
              </div>
            </DrawerDescription>
          </DrawerHeader>
        </DrawerContent>
      </DrawerWrapper>

      <DrawerWrapper 
        open={isDeleteDrawerOpen} 
        onOpenChange={setIsDeleteDrawerOpen}
      >
        <DrawerContent className="flex w-fit mx-auto px-10">
          <DrawerHeader className="text-center">
            <DrawerTitle className="bg-red-500 text-white px-4 py-2 rounded-lg mb-2">
              Tarea Eliminada
            </DrawerTitle>
            <DrawerDescription className="space-y-2">
              <p className="font-medium text-lg">{deletedTaskInfo?.name}</p>
              <Badge variant="outline" className="bg-red-100 text-red-800">
                ELIMINADA
              </Badge>
            </DrawerDescription>
          </DrawerHeader>
        </DrawerContent>
      </DrawerWrapper>
    </div>
  )
}
