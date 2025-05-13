'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import MainNavbar from '@/components/main_navbar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Trophy, Users, Star, ArrowRight, Instagram, Twitter, Facebook } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

interface Team {
  id: string;
  name: string;
  image: string | null;
  league: string;
  position: string;
  status: string;
  managerName: string;
  managerImage: string;
}

export default function HomePage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [searchQuery, setSearchQuery] = useState('');
  const [featuredTeams, setFeaturedTeams] = useState<Team[]>([]);
  
  useEffect(() => {
    // Mock data for featured teams
    const mockTeams = [
      {
        id: '1',
        name: 'Manchester United',
        image: '/images/static/teams/manchester.jpg',
        league: 'Premier League',
        position: 'Forward',
        status: 'HIRING',
        managerName: 'Erik ten Hag',
        managerImage: '/images/static/managers/tenhag.jpg'
      },
      // Add more mock teams...
    ];
    setFeaturedTeams(mockTeams);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (session) {
      router.push(`/dashboard?search=${encodeURIComponent(searchQuery)}`);
    } else {
      router.push('/login');
    }
  };

  return (
    <main className="min-h-screen">
      <MainNavbar />
      
      {/* Hero Section with Search */}
      <section className="relative h-[90vh] bg-black bg-fixed bg-cover bg-center"
        style={{
          backgroundImage: 'url("/images/static/stadium.jpg")',
          backgroundAttachment: 'fixed',
        }}
      >
        <div className="absolute inset-0 bg-black/40 z-0" />

        <div className="relative z-10 container mx-auto h-full flex items-center p-20">
          <div className="max-w-3xl">
            <h1 className="text-7xl font-bold text-secondary mb-6">
              Find Your Next <span className="text-primary">Team</span>
            </h1>
            <p className="text-xl text-secondary/80 mb-8">
              Connect with top football clubs worldwide and take your career to the next level.
            </p>
            <form onSubmit={handleSearch} className="flex gap-4 mb-8">
              <div className="flex-1 relative">
                <Input 
                  placeholder="Search teams, leagues, positions..." 
                  className="w-full h-14 pl-12 pr-4 rounded-lg bg-secondary/90"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" />
              </div>
              <Button type="submit" size="lg" className="h-14 bg-primary hover:bg-primary/90 text-black px-8">
                Search
              </Button>
            </form>
            <div className="flex gap-8 text-secondary/80">
              <div className="flex items-center gap-2">
                <Trophy className="h-6 w-6" />
                <span>500+ Teams</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="h-6 w-6" />
                <span>Top Leagues</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-6 w-6" />
                <span>10000+ Players</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Teams */}
      <section className="py-20 bg-secondary">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-4xl font-bold mb-2">Featured Teams</h2>
              <p className="text-gray-600">Top clubs looking for talent</p>
            </div>
            <Button variant="outline" className="flex items-center gap-2">
              View All <ArrowRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredTeams.map((team) => (
              <Card key={team.id} className="overflow-hidden">
                <div className="relative h-[200px]">
                  <Image
                    src={team.image || '/placeholder.jpg'}
                    alt={team.name}
                    layout="fill"
                    objectFit="cover"
                  />
                </div>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold">{team.name}</h3>
                      <p className="text-gray-600">{team.league}</p>
                    </div>
                    <Badge variant="secondary">{team.position}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Avatar>
                        <AvatarImage src={team.managerImage} alt={team.managerName} />
                        <AvatarFallback>{team.managerName[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{team.managerName}</p>
                        <p className="text-xs text-gray-500">Manager</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="bg-green-100 text-green-800">
                      {team.status}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-green-900 text-secondary py-16">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div>
              <h3 className="text-xl font-bold mb-4">About Us</h3>
              <p className="text-secondary">
                Leading platform connecting football talent with top clubs worldwide
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/">Home</Link></li>
                <li><Link href="/teams">Teams</Link></li>
                <li><Link href="/players">Players</Link></li>
                <li><Link href="/about">About</Link></li>
                <li><Link href="/contact">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Contact</h3>
              <ul className="space-y-2 text-gray-400">
                <li>info@footballhiring.com</li>
                <li>+1 234 567 890</li>
                <li>London, UK</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Follow Us</h3>
              <div className="flex gap-4">
                <Instagram className="h-6 w-6" />
                <Twitter className="h-6 w-6" />
                <Facebook className="h-6 w-6" />
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Football Hiring. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}