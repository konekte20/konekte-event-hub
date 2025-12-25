import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { toast } from '@/hooks/use-toast';
import { Search, Download, ChevronLeft, ChevronRight, MoreVertical, CheckCircle, XCircle, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import Papa from 'papaparse';
import { showError, logError } from '@/lib/error-handler';
import type { InscriptionStatus } from '@/lib/types';

const ITEMS_PER_PAGE = 20;

const AdminInscriptions = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [levelFilter, setLevelFilter] = useState<string>('all');
  const [page, setPage] = useState(1);

  const { data: inscriptionsData, isLoading } = useQuery({
    queryKey: ['inscriptions-admin', page, statusFilter, levelFilter, search],
    queryFn: async () => {
      let query = supabase
        .from('inscriptions')
        .select('*', { count: 'exact' });

      // Filtres
      if (statusFilter !== 'all') {
        query = query.eq('statut', statusFilter);
      }
      if (levelFilter !== 'all') {
        query = query.eq('niveau_experience', levelFilter);
      }
      if (search) {
        query = query.or(`nom_complet.ilike.%${search}%,email.ilike.%${search}%,telephone.ilike.%${search}%`);
      }

      // Pagination
      const from = (page - 1) * ITEMS_PER_PAGE;
      const to = from + ITEMS_PER_PAGE - 1;
      query = query.range(from, to).order('created_at', { ascending: false });

      const { data, error, count } = await query;
      
      if (error) {
        logError(error, 'AdminInscriptions');
        throw error;
      }
      
      return { data: data || [], count: count || 0 };
    },
  });

  const inscriptions = inscriptionsData?.data || [];
  const totalCount = inscriptionsData?.count || 0;

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  // Mutation pour changer le statut
  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: InscriptionStatus }) => {
      const { error } = await supabase
        .from('inscriptions')
        .update({ statut: status })
        .eq('id', id);
      
      if (error) {
        logError(error, 'UpdateInscriptionStatus');
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inscriptions-admin'] });
      queryClient.invalidateQueries({ queryKey: ['inscription-count'] });
      toast({ title: 'Statut mis à jour', description: 'Le statut de l\'inscription a été modifié.' });
    },
    onError: (error) => {
      showError(error, 'Erreur lors de la mise à jour');
    },
  });

  const exportToExcel = async () => {
    // Récupérer toutes les inscriptions pour l'export
    let query = supabase.from('inscriptions').select('*');
    
    if (statusFilter !== 'all') {
      query = query.eq('statut', statusFilter);
    }
    if (levelFilter !== 'all') {
      query = query.eq('niveau_experience', levelFilter);
    }
    if (search) {
      query = query.or(`nom_complet.ilike.%${search}%,email.ilike.%${search}%,telephone.ilike.%${search}%`);
    }
    
    const { data: allInscriptions, error } = await query.order('created_at', { ascending: false });
    
    if (error) {
      showError(error, 'Erreur lors de l\'export');
      return;
    }

    const exportData = (allInscriptions || []).map((i) => ({
      'Nom Complet': i.nom_complet,
      'Email': i.email,
      'Téléphone': i.telephone,
      'Niveau': i.niveau_experience,
      'Statut': i.statut,
      'Montant Payé': i.montant_paye,
      'Pourcentage Payé': `${i.pourcentage_paye}%`,
      'Code Promo': i.code_promo || '-',
      'Date Inscription': format(new Date(i.created_at), 'dd/MM/yyyy HH:mm'),
    }));

    const csv = Papa.unparse(exportData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `inscriptions_${format(new Date(), 'yyyy-MM-dd')}.csv`;
    link.click();
    toast({ title: 'Export réussi', description: 'Le fichier a été téléchargé.' });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Confirmé':
        return <Badge className="bg-green-500/10 text-green-600 border-green-500/20">Confirmé</Badge>;
      case 'En attente':
        return <Badge className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20">En attente</Badge>;
      case 'Annulé':
        return <Badge className="bg-red-500/10 text-red-600 border-red-500/20">Annulé</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div><h1 className="text-3xl font-bold">Inscriptions</h1></div>
        <Skeleton className="h-[600px]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Inscriptions</h1>
          <p className="text-muted-foreground">{totalCount} inscription(s)</p>
        </div>
        <Button onClick={exportToExcel}>
          <Download className="mr-2 h-4 w-4" />
          Exporter Excel
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher..."
                  value={search}
                  onChange={(e) => { 
                    setSearch(e.target.value); 
                    setPage(1); 
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                    }
                  }}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1); }}>
              <SelectTrigger className="w-[150px]"><SelectValue placeholder="Statut" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="Confirmé">Confirmé</SelectItem>
                <SelectItem value="En attente">En attente</SelectItem>
                <SelectItem value="Annulé">Annulé</SelectItem>
              </SelectContent>
            </Select>
            <Select value={levelFilter} onValueChange={(v) => { setLevelFilter(v); setPage(1); }}>
              <SelectTrigger className="w-[150px]"><SelectValue placeholder="Niveau" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les niveaux</SelectItem>
                <SelectItem value="Débutant">Débutant</SelectItem>
                <SelectItem value="Intermédiaire">Intermédiaire</SelectItem>
                <SelectItem value="Avancé">Avancé</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Téléphone</TableHead>
                <TableHead>Niveau</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Montant</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inscriptions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    Aucune inscription trouvée
                  </TableCell>
                </TableRow>
              ) : (
                inscriptions.map((i) => (
                  <TableRow key={i.id}>
                    <TableCell className="font-medium">{i.nom_complet}</TableCell>
                    <TableCell>{i.email}</TableCell>
                    <TableCell>{i.telephone}</TableCell>
                    <TableCell><Badge variant="outline">{i.niveau_experience}</Badge></TableCell>
                    <TableCell>{getStatusBadge(i.statut)}</TableCell>
                    <TableCell>{i.montant_paye} HTG ({i.pourcentage_paye}%)</TableCell>
                    <TableCell>{format(new Date(i.created_at), 'dd MMM yyyy', { locale: fr })}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => updateStatusMutation.mutate({ id: i.id, status: 'Confirmé' })}
                            disabled={i.statut === 'Confirmé' || updateStatusMutation.isPending}
                          >
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Confirmer
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => updateStatusMutation.mutate({ id: i.id, status: 'En attente' })}
                            disabled={i.statut === 'En attente' || updateStatusMutation.isPending}
                          >
                            <Clock className="mr-2 h-4 w-4" />
                            Mettre en attente
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => updateStatusMutation.mutate({ id: i.id, status: 'Annulé' })}
                            disabled={i.statut === 'Annulé' || updateStatusMutation.isPending}
                            className="text-destructive"
                          >
                            <XCircle className="mr-2 h-4 w-4" />
                            Annuler
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button variant="outline" size="icon" disabled={page === 1} onClick={() => setPage(page - 1)}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm">Page {page} sur {totalPages}</span>
          <Button variant="outline" size="icon" disabled={page === totalPages} onClick={() => setPage(page + 1)}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default AdminInscriptions;
